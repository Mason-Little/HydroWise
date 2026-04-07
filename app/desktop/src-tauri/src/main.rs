#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod desktop_models;

// Builds the Tauri app, registers desktop-model commands/state, starts the llama server in setup, and stops it on exit.
fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(desktop_models::state::DesktopModelServerState::default())
        .invoke_handler(tauri::generate_handler![
            desktop_models::download::download_desktop_model,
            desktop_models::download::download_desktop_model_mmproj,
            desktop_models::server::start_desktop_model_server_command,
            desktop_models::server::stop_desktop_model_server_command,
            desktop_models::server::restart_desktop_model_server_command,
        ])
        .setup(|app| {
            if let Err(err) = desktop_models::server::start_desktop_model_server(app.handle()) {
                eprintln!("local model server failed to start: {err}");
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        if matches!(event, tauri::RunEvent::Exit) {
            if let Err(err) = desktop_models::server::stop_desktop_model_server(app_handle) {
                eprintln!("failed to stop desktop-model server: {err}");
            }
        }
    });
}
