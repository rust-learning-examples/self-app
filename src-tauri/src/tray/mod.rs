use tauri::{SystemTray, AppHandle, Manager, UserAttentionType};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};
pub use tauri::{SystemTrayEvent};

pub fn create_system_tray() -> SystemTray {
    let control_panel = CustomMenuItem::new("control_panel".to_string(), "控制面板");
    let check_update = CustomMenuItem::new("check_update".to_string(), "检查更新");
    let hide = CustomMenuItem::new("hide".to_string(), "隐藏");
    let restart = CustomMenuItem::new("restart".to_string(), "重启");
    let quit = CustomMenuItem::new("quit".to_string(), "退出");

    // let show = CustomMenuItem::new("show".to_string(), "显示");
    // let toggle_visible = CustomMenuItem::new("toggle_visible".to_string(), "显示/隐藏");
    let tray_menu = SystemTrayMenu::new()
        .add_item(control_panel)
        .add_item(check_update)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide)
        .add_item(restart)
        // .add_item(toggle_visible)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    SystemTray::new().with_menu(tray_menu)
}

// --- SystemTray Event
pub fn on_system_tray_event(app_handle: &AppHandle, event: SystemTrayEvent) {
    match event {
        // https://tauri.studio/docs/guides/system-tray
        SystemTrayEvent::LeftClick {position: _, size: _, ..} => {
            let win = app_handle.get_window("main").unwrap();
            win.show().unwrap();
            win.set_focus().unwrap();
            win.request_user_attention(Some(UserAttentionType::Critical)).unwrap();
        }
        // SystemTrayEvent::RightClick {position: _, size: _, ..} => {
        //     println!("system tray received a right click");
        // }
        SystemTrayEvent::MenuItemClick { id, .. } => {
            // let item_handle = app.tray_handle().get_item(&id);
            match id.as_str() {
                "control_panel" => {
                    crate::window::cmd::control_panel(app_handle)
                },
                "hide" => {
                    let win = app_handle.get_window("main").unwrap();
                    win.hide().unwrap();
                },
                "check_update" => {
                    crate::utils::check_update(app_handle, false, Some(true));
                },
                "restart" => {
                    tauri::api::process::restart(&app_handle.env())
                },
                "quit" => {
                    let win = app_handle.get_window("main").unwrap();
                    tauri::api::dialog::ask(Some(&win), "确认", "确定要完全退出应用吗?", move |is_ok| {
                        if is_ok {
                            std::process::exit(0);
                        }
                    })
                },
                // "toggle_visible" => {
                //     let window = app.get_window("main").unwrap();
                //     let new_title = if window.is_visible().unwrap() {
                //         window.hide().unwrap();
                //         "显示"
                //       } else {
                //         window.show().unwrap();
                //         "隐藏"
                //       };
                //     item_handle.set_title(new_title).unwrap();
                // }
                _ => {}
            }
        }
        _ => {}
  }
}