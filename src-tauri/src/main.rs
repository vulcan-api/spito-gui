// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod spito_helper;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            spito_helper::start_spito_server(app.app_handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![spito_helper::start_spito_cli])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
