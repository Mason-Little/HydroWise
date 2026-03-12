#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod language_model;

// Builds the Tauri app, registers language-model commands and state, starts the server in setup, stops it on exit.
fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(language_model::state::LanguageModelServerState::default())
        .invoke_handler(tauri::generate_handler![
            language_model::download::download_language_model,
            language_model::server::start_language_model_server_command,
            language_model::server::stop_language_model_server_command,
            language_model::server::restart_language_model_server_command,
        ])
        .setup(|app| {
            if let Err(err) = language_model::server::start_language_model_server(app.handle()) {
                eprintln!("[language-model] server startup skipped: {err}");
                eprintln!("[language-model] continuing app startup without local runtime");
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        if matches!(event, tauri::RunEvent::Exit) {
            if let Err(err) = language_model::server::stop_language_model_server(app_handle) {
                eprintln!("failed to stop language-model server: {err}");
            }
        }
    });
}
