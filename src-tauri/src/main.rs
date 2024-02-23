use std::sync::{OnceLock};
use tauri::AppHandle;
use crate::spito_helper::start_spito_server;

mod spito_helper;

static APP: OnceLock<AppHandle> = OnceLock::new();

#[cfg(target_os = "linux")]
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            APP.set(app.handle()).expect("Could not setup app properly");
            tauri::async_runtime::spawn(async {
                let _ = start_spito_server().await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![spito_helper::start_spito_cli])
        .run(tauri::generate_context!())
        .expect("error while running spito-gui");
}
