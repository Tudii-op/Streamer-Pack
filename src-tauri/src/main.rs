#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod plugin_manager;

use plugin_manager::{get_packages, install_package};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_packages,
            install_package
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}