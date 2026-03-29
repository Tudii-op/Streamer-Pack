use serde::Serialize;
use std::fs::{self, File};
use std::io::copy;
use std::path::Path;

#[derive(Clone, Serialize)]
pub struct Package {
    pub id: String,
    pub name: String,
    pub description: String,
    pub download_url: String,
}
#[tauri::command]
pub fn install_package(url: String) -> Result<String, String> {
    let install_dir = "./installed/video_capture";
    let zip_path = "./installed/video_capture.zip";

    // create folder
    fs::create_dir_all("./installed").map_err(|e| e.to_string())?;

    // download zip
    let mut resp = reqwest::blocking::get(&url)
        .map_err(|e| e.to_string())?;

    let mut out = File::create(zip_path).map_err(|e| e.to_string())?;
    copy(&mut resp, &mut out).map_err(|e| e.to_string())?;

    // unzip
    let zip_file = File::open(zip_path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(zip_file).map_err(|e| e.to_string())?;

    fs::create_dir_all(install_dir).map_err(|e| e.to_string())?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let outpath = Path::new(install_dir).join(file.name());

        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
        } else {
            if let Some(p) = outpath.parent() {
                fs::create_dir_all(p).map_err(|e| e.to_string())?;
            }
            let mut outfile = File::create(&outpath).map_err(|e| e.to_string())?;
            copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;
        }
    }

    Ok("Installed successfully".into())
}
#[tauri::command]
pub fn get_packages() -> Vec<Package> {
    vec![Package {
        id: "1".into(),
        name: "Video Capture Test".into(),
        description: "Dummy".into(),
        download_url: "/packages/video_capture.zip".into(),
    }]
}