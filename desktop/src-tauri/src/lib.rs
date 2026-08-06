/// Toe-dip workspace label until native folder open lands (Phase 1 later).
#[tauri::command]
fn get_workspace_label() -> String {
    "fixtures/sample-project".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_workspace_label])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
