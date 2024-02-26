use std::process::Command;
use dbus_tokio::connection;
use futures::future;
use dbus::channel::{MatchingReceiver, Sender};
use dbus::message::MatchRule;
use dbus::nonblock::SyncConnection;
use dbus::{Message};
use dbus_crossroads::{Crossroads, IfaceToken, IfaceBuilder};
use std::sync::{Arc, Mutex};
use tauri::{EventHandler, Manager};
use crate::APP;

#[tauri::command]
pub fn start_spito_cli(ruleset: &str, rule: &str) -> Result<(), String> {
    Command::new("spito")
        .arg("check")
        .arg(ruleset)
        .arg(rule)
        .arg("--gui-child-mode")
        .spawn().map_err(|err| err.to_string())?;
    Ok(())
}

const DBUS_ID: &str = "org.avorty.spito.gui";
const DBUS_OBJECT_PATH: &str = "/org/avorty/spito/gui";

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct DBusInfoPayload {
    message_type: String,
    message: String,
}

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct DBusCheckFinishedPayload {
    does_rule_pass: bool,
}

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct DBusSuccessPayload {
    revert_number: u32,
}

static CONFIRM_LISTENER: Mutex<Option<EventHandler>> = Mutex::new(None);
fn register_iface(cr: &Arc<Mutex<Crossroads>>, conn: Arc<SyncConnection>) -> IfaceToken<()> {
    let mut cr_lock = cr.lock().unwrap();
    cr_lock.register(DBUS_ID, |b: &mut IfaceBuilder<()>| {
        b.method("Info", ("message_type", "message"), (), move |_, _, (message_type, message, ): (String, String, )| {
            let app = APP.get().expect("cannot obtain app");// TODO: implement something better
            app.emit_all("Info", DBusInfoPayload { message_type, message })
                .map_err(|_err| {
                    dbus::MethodErr::no_arg() // TODO: here should be something more meaningful
                })?;

            Ok(())
        });
        b.method("Success", ("revert_number", ), (), move |_, _, (revert_number, ): (u32, )| {
            let app = APP.get().expect("cannot obtain app");// TODO: implement something better
            app.emit_all("Success", DBusSuccessPayload { revert_number })
                .map_err(|_err| {
                    dbus::MethodErr::no_arg() // TODO: here should be something more meaningful
                })?;

            Ok(())
        });
        b.method("CheckFinished", ("does_rule_pass", ), (), move |_, _, (does_rule_pass, ): (bool, )| {
            let app = APP.get().expect("cannot obtain app");
            let _ = app.emit_all("CheckFinished", DBusCheckFinishedPayload { does_rule_pass })
                .map_err(|_err| {
                    dbus::MethodErr::no_arg() // TODO: here should be something more meaningful
                });

            match *CONFIRM_LISTENER.lock().expect("cannot assign confirm listener") {
                None => ..,
                _ => return Ok(())
            };

            let conn_clone = conn.clone();

            // it's a hideous way to achieve a reply
            let listener = app.listen_global("ReplyChecker", move |event| {
                let msg_type= match event.payload() {
                    None => "Decline",
                    _ => "Confirm"
                };

                let msg = Message::signal(&DBUS_OBJECT_PATH.into(), &DBUS_ID.into(), &msg_type.into());
                let _ = conn_clone.send(msg);

                let app = APP.get().expect("cannot obtain app");

                let mut listener_id = CONFIRM_LISTENER.lock().expect("cannot obtain confirm listener");
                match *listener_id {
                    None => return (),
                    Some(id) => app.unlisten(id)
                }
                *listener_id = None;
            });
            *CONFIRM_LISTENER.lock().expect("cannot assign confirm listener") = Some(listener);
            Ok(())
        });
        b.signal::<(bool, ), _>("Confirm", ("", ));
        b.signal::<(bool, ), _>("Decline", ("", ));
    })
}

pub async fn start_spito_server() -> anyhow::Result<()> {
    let (resource, c) = connection::new_session_sync()?;
    let _handle = tokio::spawn(async {
        let err = resource.await;
        panic!("Lost connection to D-Bus: {}", err); // TODO: improve
    });
    let cr = Arc::new(Mutex::new(Crossroads::new()));
    let token = register_iface(&cr, c.clone());
    {
        let mut cr_lock = cr.lock().unwrap();
        cr_lock.insert(DBUS_OBJECT_PATH, &[token], ());
    }
    c.request_name(DBUS_ID, false, true, false).await?;
    c.start_receive(MatchRule::new_method_call(), Box::new(move |msg, conn| {
        let mut cr_lock = cr.lock().unwrap();
        cr_lock.handle_message(msg, conn).unwrap();
        true
    }));
    future::pending::<()>().await;
    unreachable!()
}