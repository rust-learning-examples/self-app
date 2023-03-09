use tauri::{utils::config::WindowUrl, window::WindowBuilder};

#[tauri::command]
pub fn control_panel(handle: &tauri::AppHandle) {
  let handle = handle.clone();
  tauri::async_runtime::spawn(async move {
    WindowBuilder::new(&handle, "core_panel", WindowUrl::App("/controlPanel".into()))
      .title("控制面板")
      .resizable(true)
      .fullscreen(false)
      .inner_size(1200.0, 700.0)
      .min_inner_size(1000.0, 600.0)
      .build()
      .unwrap();
  });
}