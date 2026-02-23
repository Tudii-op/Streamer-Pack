#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::process::Command;
use dirs::data_dir; // <- use dirs crate
use std::path::PathBuf;

#[tauri::command]
fn save_video_chunk(data: Vec<u8>) -> Result<String, String> {
    let mut path = dirs::data_dir().ok_or("Cannot find data directory")?;
    path.push("StreamerPack");
    fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    path.push("recording.webm");

    fs::write(&path, &data).map_err(|e| e.to_string())?;
    Ok(format!("Saved to {}", path.display()))
}
#[tauri::command]
fn install_instances() -> Result<String, String> {
    // Project-local instances folder (inside current project)
    let mut dest = std::env::current_dir().unwrap();
    dest.push("instances");

    // Create destination folder if missing
    fs::create_dir_all(&dest).map_err(|e| e.to_string())?;

    // Temporary folder for git clone
    let temp_clone = std::env::temp_dir().join("streamer-pack-instances-temp");
    if temp_clone.exists() {
        fs::remove_dir_all(&temp_clone).ok();
    }

    // Clone GitHub repo
    let output = Command::new("git")
        .args([
            "clone",
            "https://github.com/Tudii-op/streamer-pack-instances",
            temp_clone.to_str().unwrap(),
        ])
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    // Recursive copy function (works across drives)
    fn copy_dir_all(src: &PathBuf, dst: &PathBuf) -> std::io::Result<()> {
        fs::create_dir_all(dst)?;
        for entry in fs::read_dir(src)? {
            let entry = entry?;
            let dest_path = dst.join(entry.file_name());
            if entry.file_type()?.is_dir() {
                copy_dir_all(&entry.path(), &dest_path)?;
            } else {
                fs::copy(&entry.path(), &dest_path)?;
            }
        }
        Ok(())
    }

    // Copy modules to project-local instances folder
    copy_dir_all(&temp_clone, &dest).map_err(|e| e.to_string())?;
    fs::remove_dir_all(&temp_clone).ok();

    Ok(format!("Installed successfully to {}", dest.display()))
}

#[tauri::command]
fn list_installed_modules() -> Result<Vec<String>, String> {
    let mut instances_dir = std::env::current_dir().unwrap();
    instances_dir.push("instances");

    if !instances_dir.exists() {
        return Ok(vec![]);
    }

    let mut list = vec![];
    for entry in fs::read_dir(&instances_dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if path.join("index.tsx").exists() {
            list.push(path.to_string_lossy().to_string());
        }
    }

    Ok(list)
}

fn main() {
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![install_instances, save_video_chunk, list_installed_modules])
    .run(tauri::generate_context!())
    .expect("error while running tauri app");
}