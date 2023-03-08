use tauri::{SystemTray, AppHandle, Manager, UserAttentionType};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};
pub use tauri::{SystemTrayEvent};

pub fn create_system_tray() -> SystemTray {
  let quit = CustomMenuItem::new("quit".to_string(), "退出");
  let hide = CustomMenuItem::new("hide".to_string(), "隐藏");
  // let show = CustomMenuItem::new("show".to_string(), "显示");
  // let toggle_visible = CustomMenuItem::new("toggle_visible".to_string(), "显示/隐藏");
  let tray_menu = SystemTrayMenu::new()
      // .add_item(show)
      .add_item(hide)
      // .add_item(toggle_visible)
      .add_native_item(SystemTrayMenuItem::Separator)
      .add_item(quit);
  SystemTray::new().with_menu(tray_menu)
}

// --- SystemTray Event
pub fn on_system_tray_event(app_handle: &AppHandle, event: SystemTrayEvent) {
  match event {
    // https://tauri.studio/docs/guides/system-tray
    SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
    } => {
        let window = app_handle.get_window("main").unwrap();
        window.show().unwrap();
        window.set_focus().unwrap();
        window.request_user_attention(Some(UserAttentionType::Critical)).unwrap();
    }
    // SystemTrayEvent::RightClick {
    //     position: _,
    //     size: _,
    //     ..
    // } => {
    //     println!("system tray received a right click");
    // }
    SystemTrayEvent::MenuItemClick { id, .. } => {
        // let item_handle = app.tray_handle().get_item(&id);
        match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "hide" => {
                let window = app_handle.get_window("main").unwrap();
                window.hide().unwrap();
            }
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