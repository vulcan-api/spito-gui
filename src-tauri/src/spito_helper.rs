use std::process::{Command};
use dbus_crossroads::Crossroads;
use dbus::blocking::Connection;
use tauri::{Manager};
use crate::APP;

#[tauri::command]
pub fn start_spito_cli(ruleset: &str, rule: &str) -> Result<(), String> {
    Command::new("spito")
        .arg("check")
        .arg("--gui-child-mode")
        .arg(ruleset)
        .arg(rule)
        .spawn().map_err(|err| err.to_string())?;
    // TODO: handle y/N question
    Ok(())
}

const DBUS_ID: &str = "org.avorty.spito.gui";
const DBUS_OBJECT_PATH: &str = "/org/avorty/spito/gui";

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct DBusEchoPayload {
    message_type: String,
    message: String,
}

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct DBusConfirmPayload {
    rule_name: String,
}

#[tauri::command]
pub fn start_spito_server() {
    std::thread::spawn(move || -> anyhow::Result<()> {
        _start_spito_server()
    });
}

fn _start_spito_server() -> anyhow::Result<()> {
    let conn = Connection::new_session()?;
    conn.request_name(DBUS_ID, false, true, false)?;

    let mut cr = Crossroads::new();
    let info_token = cr.register(DBUS_ID, |builder| {
        builder.method("Info", ("message_type", "message"), (), move |_, _, (message_type, message, ): (String, String, )| {
            let app = APP.get().unwrap(); // TODO: implement something better
            app.emit_all("Info", DBusEchoPayload { message_type, message })
                .map_err(|_err| {
                    dbus::MethodErr::no_arg() // TODO: here should be something more meaningful
                })?;

            Ok(())
        });
        builder.method("AskForConfirmation", ("rule_name", ), (), move |_, _, (rule_name, ): (String, )| {
            let app = APP.get().unwrap(); // TODO: same as above
            app.emit_all("AskForConfirmation", DBusConfirmPayload { rule_name })
                .map_err(|_err| {
                    dbus::MethodErr::no_arg() // TODO: here should be something more meaningful
                })?;

            Ok(())
        });
    });

    cr.insert(DBUS_OBJECT_PATH, &[info_token, info_token], ());
    cr.serve(&conn)?;

    unreachable!()
}