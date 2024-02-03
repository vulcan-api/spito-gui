use std::process::{Command};
use dbus_crossroads::Crossroads;
use dbus::blocking::Connection;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub(crate) fn start_spito_cli(ruleset: &str, rule: &str) -> Result<(), String> {
    Command::new("spito")
        .arg("check")
        .arg(ruleset)
        .arg(rule)
        .spawn().map_err(|err| err.to_string())?;
    Ok(())
}

const DBUS_ID: &str = "org.avorty.spito.gui";
const DBUS_OBJECT_PATH: &str = "/org/avorty/spito/gui";

#[derive(Clone, serde::Serialize)]
struct Payload {
    mess_type: String,
    message: String,
}

#[tauri::command]
pub(crate) fn start_spito_server(app: AppHandle) -> Result<(), String>{
    std::thread::spawn(move || -> Result<(), String> {
        let c = Connection::new_session().map_err(|err| err.to_string())?;
        c.request_name(DBUS_ID, false, true, false).map_err(|err| err.to_string())?;
        let mut cr = Crossroads::new();
        let token = cr.register(DBUS_ID, |b| {
            b.method("Echo", ("mess_type", "message"), (),move |_ctx, _cr, (mess_type, message, ): (String, String, )| {
                app.emit_all("echo", Payload { mess_type, message}).unwrap();
                Ok(())
            });
        });
        cr.insert(DBUS_OBJECT_PATH, &[token], ());
        cr.serve(&c).map_err(|err| err.to_string())?;
        unreachable!()
    });
    Ok(())
}