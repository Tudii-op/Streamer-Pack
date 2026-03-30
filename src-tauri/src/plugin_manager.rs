use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::copy;
use std::path::{Path, PathBuf};

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Package {
    pub id: String,
    pub name: String,
    pub description: String,
    pub download_url: String,
}

#[derive(Serialize)]
pub struct InstalledPackage {
    pub name: String,
}

fn extract_name_from_url(url: &str) -> String {
    url.split('/')
        .last()
        .unwrap_or("package.zip")
        .replace(".zip", "")
}

#[tauri::command]
pub async fn get_packages() -> Result<Vec<Package>, String> {
    let resp = reqwest::get("http://127.0.0.1:3000/api/packages")
        .await
        .map_err(|e| e.to_string())?;

    let packages: Vec<Package> = resp.json()
        .await
        .map_err(|e| e.to_string())?;

    Ok(packages)
}

#[tauri::command]
pub fn list_installed_packages() -> Result<Vec<InstalledPackage>, String> {
    let path = Path::new("./installed");

    if !path.exists() {
        return Ok(vec![]);
    }

    let packages = fs::read_dir(path)
        .map_err(|e| e.to_string())?
        .filter_map(|e| e.ok())
        .filter_map(|e| e.file_name().into_string().ok())
        .map(|name| InstalledPackage { name })
        .collect();

    Ok(packages)
}

#[tauri::command]
pub fn install_package(url: String) -> Result<String, String> {
    let base_dir = Path::new("./installed");
    let package_name = extract_name_from_url(&url);
    let zip_path = base_dir.join(format!("{package_name}.zip"));
    let install_dir = base_dir.join(&package_name);

    fs::create_dir_all(base_dir).map_err(|e| e.to_string())?;

    let mut resp = reqwest::blocking::get(&url).map_err(|e| e.to_string())?;
    let mut out = File::create(&zip_path).map_err(|e| e.to_string())?;
    copy(&mut resp, &mut out).map_err(|e| e.to_string())?;

    let zip_file = File::open(&zip_path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(zip_file).map_err(|e| e.to_string())?;

    fs::create_dir_all(&install_dir).map_err(|e| e.to_string())?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let outpath: PathBuf = install_dir.join(file.mangled_name());

        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
        } else {
            if let Some(parent) = outpath.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            let mut outfile = File::create(&outpath).map_err(|e| e.to_string())?;
            copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;
        }
    }

    let _ = fs::remove_file(zip_path);

    Ok(format!("Installed {}", package_name))
}