// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[tauri::command]
fn save_video_chunk(data: Vec<u8>) {
    std::fs::write("recording.webm", &data).expect("Failed to save video");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_video_chunk])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
