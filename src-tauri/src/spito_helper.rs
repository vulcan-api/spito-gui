use std::process::{Command};
use dbus_crossroads::Crossroads;
use dbus::blocking::Connection;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn start_spito_cli(ruleset: &str, rule: &str) -> Result<(), String> {
    Command::new("spito")
        .arg("check")
        .arg("--gui-child-mode")
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
pub fn start_spito_server(app: AppHandle) {
    std::thread::spawn(move || -> anyhow::Result<()> {
        _start_spito_server(app)
    });
}

fn _start_spito_server(app: AppHandle) -> anyhow::Result<()> {
    let conn = Connection::new_session()?;
    conn.request_name(DBUS_ID, false, true, false)?;

    let mut cr = Crossroads::new();
    let token = cr.register(DBUS_ID, |builder| {
        builder.method("Echo", ("mess_type", "message"), (), move |_ctx, _cr, (mess_type, message, ): (String, String, )| {
            app.emit_all("Echo", Payload { mess_type, message })
                .map_err(|err| {
                    dbus::MethodErr::no_arg() // TODO: here should be something more meaningful
                })
        });
    });

    cr.insert(DBUS_OBJECT_PATH, &[token], ());
    cr.serve(&conn)?;

    unreachable!()
}
