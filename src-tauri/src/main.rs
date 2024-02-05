use crate::spito_helper::start_spito_server;

mod spito_helper;

#[cfg(target_os = "linux")]
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            start_spito_server(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![spito_helper::start_spito_cli])
        .run(tauri::generate_context!())
        .expect("error while running spito-gui");
}
