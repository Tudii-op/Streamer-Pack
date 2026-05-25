#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod plugin_manager;

use plugin_manager::{
    get_packages,
    install_package,
    list_installed_packages,
    uninstall_package,
    load_plugin,
    call_dll,
};

fn main() {
    dotenvy::dotenv().ok();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_packages,
            install_package,
            list_installed_packages,
            uninstall_package,
            load_plugin,
            call_dll,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}