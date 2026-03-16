use tauri::{AppHandle, Manager};
use tauri_plugin_shell::{process::CommandEvent, ShellExt};

use super::{paths, state};

const HOST: &str = "127.0.0.1";
const PORT: &str = "39282";
const IDLE_SLEEP_SECONDS: &str = "300";
const BATCH_SIZE: &str = "2048";
const UBATCH_SIZE: &str = "2048";

fn embedding_model_path(app: &AppHandle) -> Result<String, String> {
    let path = paths::embedding_model_slot(app)?;

    if !path.is_file() {
        return Err(format!("bundled embedding model not found at {}", path.display()));
    }

    path.to_str()
        .map(str::to_owned)
        .ok_or_else(|| format!("embedding model path is not valid UTF-8: {}", path.display()))
}

pub fn start_embedding_model_server(app: &AppHandle) -> Result<(), String> {
    let state: tauri::State<'_, state::EmbeddingModelServerState> = app.state();
    let model_path = embedding_model_path(app)?;

    let command = app
        .shell()
        .sidecar(paths::server_command_name())
        .map_err(|err| format!("failed to create embedding server command: {err}"))?;

    let (rx, child) = command
        .args([
            "-m",
            &model_path,
            "--host",
            HOST,
            "--port",
            PORT,
            "--embeddings",
            "--batch-size",
            BATCH_SIZE,
            "--ubatch-size",
            UBATCH_SIZE,
            "--sleep-idle-seconds",
            IDLE_SLEEP_SECONDS,
            "--no-webui",
        ])
        .spawn()
        .map_err(|err| format!("failed to spawn embedding server: {err}"))?;

    if let Some(duplicate_child) = state
        .set_if_stopped(child)
        .map_err(|err| format!("failed to store embedding server handle: {err}"))?
    {
        duplicate_child
            .kill()
            .map_err(|err| format!("embedding server already running; failed to stop extra process: {err}"))?;
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
                    eprintln!("[embedding-server] error: {err}");
                }
                CommandEvent::Terminated(payload) => {
                    eprintln!(
                        "[embedding-server] terminated: code={:?} signal={:?}",
                        payload.code, payload.signal
                    );
                }
                _ => {}
            }
        }
    });

    Ok(())
}

pub fn stop_embedding_model_server(app: &AppHandle) -> Result<(), String> {
    let state: tauri::State<'_, state::EmbeddingModelServerState> = app.state();

    let child = state
        .take()
        .map_err(|err| format!("failed to clear embedding server state: {err}"))?;

    if let Some(child) = child {
        child
            .kill()
            .map_err(|err| format!("failed to stop embedding server: {err}"))?;
    }

    Ok(())
}

fn print_log(kind: &str, line: &[u8]) {
    let line = String::from_utf8_lossy(line);
    for segment in line.lines() {
        if !segment.is_empty() {
            eprintln!("[embedding-server][{kind}] {segment}");
        }
    }
}
