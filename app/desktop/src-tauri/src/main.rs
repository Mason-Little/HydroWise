#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod ai;

fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(ai::state::LlamaSidecarState::default())
        .setup(|app| {
            if let Err(err) = ai::start_sidecar(app.handle()) {
                eprintln!("[llama] sidecar startup skipped: {err}");
                eprintln!("[llama] continuing app startup without local AI runtime");
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        if matches!(event, tauri::RunEvent::Exit) {
            if let Err(err) = ai::stop_sidecar(app_handle) {
                eprintln!("failed to stop llama sidecar: {err}");
            }
        }
    });
}
