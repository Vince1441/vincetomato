#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use tauri::Manager;

fn app_data_dir(app: &tauri::AppHandle) -> PathBuf {
    app.path().app_data_dir().unwrap_or_else(|_| PathBuf::from("."))
}

fn ensure_dir(path: &PathBuf) {
    let _ = fs::create_dir_all(path);
}

#[tauri::command]
fn read_json_file(app: tauri::AppHandle, filename: String) -> Result<String, String> {
    let dir = app_data_dir(&app);
    ensure_dir(&dir);
    let path = dir.join(filename);
    if !path.exists() {
        return Ok("".to_string());
    }
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_json_file(app: tauri::AppHandle, filename: String, content: String) -> Result<(), String> {
    let dir = app_data_dir(&app);
    ensure_dir(&dir);
    let path = dir.join(filename);
    fs::write(&path, content).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![read_json_file, write_json_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}