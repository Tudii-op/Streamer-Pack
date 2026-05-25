//! Plugin manager for package operations.

use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::copy;
use std::path::PathBuf;
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Package {
    pub id: String,
    pub name: String,
    pub description: String,
    pub download_url: String,
}
pub const WEB_API_URL_DEV: &str = "https://web-app-sigma-six.vercel.app";
pub const API_URL: &str = "https://web-app-sigma-six.vercel.app";
pub const WEB_API_URL_PROD: &str = "https://web-app-sigma-six.vercel.app";
/// Returns the base plugins directory in AppData.
/// e.g. C:\Users\<user>\AppData\Roaming\streamer-pack\plugins
fn plugins_dir() -> Result<PathBuf, String> {
    Ok(dirs::data_dir()
        .ok_or("Can't find AppData")?
        .join("streamer-pack")
        .join("plugins"))
}

fn extract_name_from_url(url: &str) -> String {
    url.split('/')
        .last()
        .unwrap_or("package.zip")
        .replace(".zip", "")
}

#[tauri::command]
pub async fn get_packages() -> Result<Vec<Package>, String> {
    let base_url = API_URL;
    let url = format!("{}/api/packages", base_url);
    let resp = reqwest::get(url)
        .await
        .map_err(|e| format!("Failed to fetch packages: {}", e))?;
    let packages: Vec<Package> = resp.json()
        .await
        .map_err(|e| format!("Failed to parse packages: {}", e))?;
    Ok(packages)
}

/// Downloads a zip from `url`, extracts it into AppData/streamer-pack/plugins/<name>/
#[tauri::command]
pub fn install_package(url: String) -> Result<String, String> {
    let package_name = extract_name_from_url(&url);
    let base_dir = plugins_dir()?;
    let zip_path = base_dir.join(format!("{}.zip", package_name));
    let install_dir = base_dir.join(&package_name);

    fs::create_dir_all(&base_dir)
        .map_err(|e| format!("Failed to create plugins dir: {}", e))?;

    // Download zip
    let mut resp = reqwest::blocking::get(&url)
        .map_err(|e| format!("Failed to download: {}", e))?;
    let mut out = File::create(&zip_path)
        .map_err(|e| format!("Failed to create zip file: {}", e))?;
    copy(&mut resp, &mut out)
        .map_err(|e| format!("Failed to write zip: {}", e))?;

    // Extract zip
    fs::create_dir_all(&install_dir)
        .map_err(|e| format!("Failed to create package dir: {}", e))?;

    let zip_file = File::open(&zip_path)
        .map_err(|e| format!("Failed to open zip: {}", e))?;
    let mut archive = zip::ZipArchive::new(zip_file)
        .map_err(|e| format!("Failed to read zip: {}", e))?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)
            .map_err(|e| format!("Failed to read entry {}: {}", i, e))?;
        let outpath = install_dir.join(file.mangled_name());

        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath)
                .map_err(|e| format!("Failed to create dir: {}", e))?;
        } else {
            if let Some(parent) = outpath.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed to create parent: {}", e))?;
            }
            let mut outfile = File::create(&outpath)
                .map_err(|e| format!("Failed to write file: {}", e))?;
            copy(&mut file, &mut outfile)
                .map_err(|e| format!("Failed to extract file: {}", e))?;
        }
    }

    let _ = fs::remove_file(&zip_path);

    Ok(format!("Installed {}", package_name))
}

#[tauri::command]
pub fn uninstall_package(name: String) -> Result<String, String> {
    let path = plugins_dir()?.join(&name);
    if path.exists() {
        fs::remove_dir_all(&path)
            .map_err(|e| format!("Failed to uninstall: {}", e))?;
        Ok(format!("Uninstalled {}", name))
    } else {
        Err("Package not found".to_string())
    }
}

/// Returns the contents of the package's index.mjs for dynamic JS loading.
#[tauri::command]
pub fn load_plugin(plugin_name: String) -> Result<String, String> {
    let path = plugins_dir()?
        .join(&plugin_name)
        .join("index.mjs");

    std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read index.mjs: {}", e))
}

#[tauri::command]
pub fn call_dll(plugin_name: String, function: String, args: String) -> Result<String, String> {
    let dll_path = plugins_dir()?
        .join(&plugin_name)
        .join("plugin.dll");

    if !dll_path.exists() {
        return Err(format!("No plugin.dll found for {}", plugin_name));
    }

    let input = std::ffi::CString::new(args)
        .map_err(|e| format!("Invalid args string: {}", e))?;

    let fn_name = std::ffi::CString::new(function)
        .map_err(|e| format!("Invalid function name: {}", e))?;

    unsafe {
        let lib = libloading::Library::new(&dll_path)
            .map_err(|e| format!("Failed to load dll: {}", e))?;

        let func: libloading::Symbol<
            unsafe extern "C" fn(
                *const std::os::raw::c_char,
                *const std::os::raw::c_char,
            ) -> *const std::os::raw::c_char,
        > = lib.get(b"call\0")
            .map_err(|e| format!("Failed to find 'call' export: {}", e))?;

        let result_ptr = func(fn_name.as_ptr(), input.as_ptr());

        if result_ptr.is_null() {
            return Err("DLL returned null".to_string());
        }

        Ok(std::ffi::CStr::from_ptr(result_ptr)
            .to_string_lossy()
            .into_owned())
    }
}

#[tauri::command]
pub fn list_installed_packages() -> Result<Vec<String>, String> {
    let dir = plugins_dir()?;

    if !dir.exists() {
        return Ok(vec![]);
    }

    let packages = std::fs::read_dir(dir)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            if entry.file_type().ok()?.is_dir() {
                entry.file_name().into_string().ok()
            } else {
                None
            }
        })
        .collect();

    Ok(packages)
}