//! Plugin manager for package operations.
//! Handles listing, fetching, and installing packages from remote servers.

use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::copy;
use std::path::{Path, PathBuf};

/// Package information from the remote server.
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Package {
    pub id: String,
    pub name: String,
    pub description: String,
    pub download_url: String,
}

/// Installed package information.
#[derive(Serialize)]
pub struct InstalledPackage {
    pub name: String,
}

/// Extracts the package name from a download URL.
fn extract_name_from_url(url: &str) -> String {
    url.split('/')
        .last()
        .unwrap_or("package.zip")
        .replace(".zip", "")
}

/// Fetches available packages from the remote API.
#[tauri::command]
pub async fn get_packages() -> Result<Vec<Package>, String> {
    let base_url = std::env::var("API_URL")
    .unwrap_or("http://127.0.0.1:3000".to_string());
    let url: String = format!("{}/api/packages", base_url);
    let resp: reqwest::Response = reqwest::get(url)
        .await
        .map_err(|e: reqwest::Error | format!("Failed to fetch packages: {}", e))?;

    let packages: Vec<Package> = resp.json()
        .await
        .map_err(|e| format!("Failed to parse package response: {}", e))?;

    Ok(packages)
}

/// Lists all installed packages in the ./installed directory.
#[tauri::command]
pub fn list_installed_packages() -> Result<Vec<InstalledPackage>, String> {
    let path = Path::new("./installed");

    if !path.exists() {
        return Ok(vec![]);
    }

    let packages = fs::read_dir(path)
        .map_err(|e| format!("Failed to read installed directory: {}", e))?
        .filter_map(|e| e.ok())
        .filter_map(|e| e.file_name().into_string().ok())
        .map(|name| InstalledPackage { name })
        .collect();

    Ok(packages)
}

/// Downloads and installs a package from the given URL.
#[tauri::command]
pub fn install_package(url: String) -> Result<String, String> {
    let base_dir = Path::new("./installed");
    let package_name = extract_name_from_url(&url);
    let zip_path = base_dir.join(format!("{package_name}.zip"));
    let install_dir = base_dir.join(&package_name);

    fs::create_dir_all(base_dir)
        .map_err(|e| format!("Failed to create install directory: {}", e))?;

    let mut resp = reqwest::blocking::get(&url)
        .map_err(|e| format!("Failed to download package: {}", e))?;
    let mut out = File::create(&zip_path)
        .map_err(|e| format!("Failed to create zip file: {}", e))?;
    copy(&mut resp, &mut out)
        .map_err(|e| format!("Failed to write zip file: {}", e))?;

    let zip_file = File::open(&zip_path)
        .map_err(|e| format!("Failed to open zip file: {}", e))?;
    let mut archive = zip::ZipArchive::new(zip_file)
        .map_err(|e| format!("Failed to read zip archive: {}", e))?;

    fs::create_dir_all(&install_dir)
        .map_err(|e| format!("Failed to create package directory: {}", e))?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)
            .map_err(|e| format!("Failed to read zip entry {}: {}", i, e))?;
        let outpath: PathBuf = install_dir.join(file.mangled_name());

        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath)
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        } else {
            if let Some(parent) = outpath.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed to create parent directory: {}", e))?;
            }
            let mut outfile = File::create(&outpath)
                .map_err(|e| format!("Failed to create file: {}", e))?;
            copy(&mut file, &mut outfile)
                .map_err(|e| format!("Failed to write extracted file: {}", e))?;
        }
    }

    let _ = fs::remove_file(zip_path);

    Ok(format!("Installed {}", package_name))
}


#[tauri::command]
pub fn uninstall_package(name: String) -> Result<String, String> {
    let path = Path::new("./installed").join(name);
    if path.exists() {
        fs::remove_dir_all(&path)
            .map_err(|e| format!("Failed to uninstall package: {}", e))?;
        Ok("Package uninstalled".to_string())
    } else {
        Err("Package not found".to_string())
    }
}