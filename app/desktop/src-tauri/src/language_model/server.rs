use std::fs;

use tauri::{AppHandle, Manager};
use tauri_plugin_shell::{process::CommandEvent, ShellExt};

use super::{paths, state};

const HOST: &str = "127.0.0.1";
const PORT: &str = "39281";
const CONTEXT_SIZE: &str = "8192";
const MAX_LOADED_MODELS: &str = "1";
const IDLE_SLEEP_SECONDS: &str = "300";
const PARALLEL: &str = "1";

// Creates management/models dirs and returns models dir path.
fn ensure_runtime_directories(app: &AppHandle) -> Result<String, String> {
    let management_root = paths::management_root(app)?;
    let models_dir = paths::models_dir(app)?;

    fs::create_dir_all(&management_root)
        .map_err(|err| format!("failed to create management directory: {err}"))?;
    fs::create_dir_all(&models_dir)
        .map_err(|err| format!("failed to create models directory: {err}"))?;

    models_dir.to_str().map(str::to_owned).ok_or_else(|| {
        format!(
            "models directory path is not valid UTF-8: {}",
            models_dir.display()
        )
    })
}

// Spawns the llama sidecar and registers it in app state.
pub fn start_language_model_server(app: &AppHandle) -> Result<(), String> {
    let state: tauri::State<'_, state::LanguageModelServerState> = app.state();

    let models_dir = ensure_runtime_directories(app)?;

    let command = app
        .shell()
        .sidecar(paths::server_command_name())
        .map_err(|err| format!("failed to create llama server command: {err}"))?;

    let (rx, child) = command
        .args([
            "--models-dir",
            &models_dir,
            "--host",
            HOST,
            "--port",
            PORT,
            "--ctx-size",
            CONTEXT_SIZE,
            "--models-max",
            MAX_LOADED_MODELS,
            "--sleep-idle-seconds",
            IDLE_SLEEP_SECONDS,
            "--parallel",
            PARALLEL,
            "--no-webui",
        ])
        .spawn()
        .map_err(|err| format!("failed to spawn llama server: {err}"))?;

    if let Some(duplicate_child) = state
        .set_if_stopped(child)
        .map_err(|err| format!("failed to store language-model server handle: {err}"))?
    {
        duplicate_child.kill().map_err(|err| {
            format!("language-model server already running; failed to stop extra process: {err}")
        })?;
        return Ok(());
    }

    #[cfg(not(debug_assertions))]
    let _ = rx;

    #[cfg(debug_assertions)]
    tauri::async_runtime::spawn(async move {
        let mut rx = rx;
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    print_log("stdout", &line);
                }
                CommandEvent::Stderr(line) => {
                    print_log("stderr", &line);
                }
                CommandEvent::Error(err) => {
                    eprintln!("[llama-server] error: {err}");
                }
                CommandEvent::Terminated(payload) => {
                    eprintln!(
                        "[llama-server] terminated: code={:?} signal={:?}",
                        payload.code, payload.signal
                    );
                }
                _ => {}
            }
        }
    });

    Ok(())
}

// Tauri invoke handler for starting the server.
#[tauri::command]
pub fn start_language_model_server_command(app: AppHandle) -> Result<(), String> {
    start_language_model_server(&app)
}

// Stops the sidecar and clears state.
pub fn stop_language_model_server(app: &AppHandle) -> Result<(), String> {
    let state: tauri::State<'_, state::LanguageModelServerState> = app.state();

    let child = state
        .take()
        .map_err(|err| format!("failed to clear language-model server state: {err}"))?;

    if let Some(child) = child {
        child
            .kill()
            .map_err(|err| format!("failed to stop language-model server: {err}"))?;
    }

    Ok(())
}

// Tauri invoke handler for stopping the server.
#[tauri::command]
pub fn stop_language_model_server_command(app: AppHandle) -> Result<(), String> {
    stop_language_model_server(&app)
}

// Tauri invoke handler that stops then starts the server.
#[tauri::command]
pub fn restart_language_model_server_command(app: AppHandle) -> Result<(), String> {
    stop_language_model_server(&app)?;
    start_language_model_server(&app)
}

// Logs sidecar stdout/stderr lines in debug builds.
fn print_log(kind: &str, line: &[u8]) {
    let line = String::from_utf8_lossy(line);
    for segment in line.lines() {
        if !segment.is_empty() {
            eprintln!("[llama-server][{kind}] {segment}");
        }
    }
}
