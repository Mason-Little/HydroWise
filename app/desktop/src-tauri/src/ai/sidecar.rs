use std::{
    fs::{self, read_to_string},
    path::Path,
};

use tauri::{AppHandle, Manager};
use tauri_plugin_shell::{process::CommandEvent, ShellExt};

use super::{paths, state};

pub fn start_sidecar(app_handle: &AppHandle) -> Result<(), String> {
    let state: tauri::State<'_, state::LlamaSidecarState> = app_handle.state();

    if state.is_running() {
        return Ok(());
    }

    let paths = paths::RuntimePaths::from_app(app_handle)?;

    paths::ensure_model_exists(&paths.chat_model)?;
    paths::ensure_model_exists(&paths.embedding_model)?;

    generate_router_config(
        &paths.template_router_config,
        &paths.generated_router_config,
        &paths.chat_model,
        &paths.embedding_model,
    )?;

    let generated_path = paths.generated_router_config.to_str().ok_or_else(|| {
        format!(
            "generated config path is not valid UTF-8: {}",
            paths.generated_router_config.display()
        )
    })?;

    let command = app_handle
        .shell()
        .sidecar(paths::RuntimePaths::sidecar_command_name())
        .map_err(|err| format!("failed to create llama sidecar command: {err}"))?;

    let (rx, child) = command
        .args([
            "--models-preset",
            generated_path,
            "--host",
            "127.0.0.1",
            "--port",
            "39281",
            "--ctx-size",
            "8192",
            "--models-max",
            "1",
            "--sleep-idle-seconds",
            "300",
            "--no-webui",
        ])
        .spawn()
        .map_err(|err| format!("failed to spawn llama sidecar: {err}"))?;

    if let Some(duplicate_child) = state
        .set_if_absent(child)
        .map_err(|err| format!("failed to store llama sidecar handle: {err}"))?
    {
        duplicate_child.kill().map_err(|err| {
            format!("sidecar already running; failed to stop extra process: {err}")
        })?;
        return Ok(());
    }

    // Always drain stdout/stderr to prevent pipe buffers from filling and blocking the sidecar.
    tauri::async_runtime::spawn(async move {
        let mut rx = rx;
        while let Some(event) = rx.recv().await {
            if cfg!(debug_assertions) {
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
        }
    });

    Ok(())
}

pub fn stop_sidecar(app_handle: &AppHandle) -> Result<(), String> {
    let state: tauri::State<'_, state::LlamaSidecarState> = app_handle.state();

    let child = state
        .take()
        .map_err(|err| format!("failed to clear llama sidecar state: {err}"))?;

    if let Some(child) = child {
        child
            .kill()
            .map_err(|err| format!("failed to stop llama sidecar: {err}"))?;
    }

    Ok(())
}

fn generate_router_config(
    template_path: &Path,
    output_path: &Path,
    chat_model: &Path,
    embedding_model: &Path,
) -> Result<(), String> {
    let rendered = render_router_config(template_path, chat_model, embedding_model)?;

    if let Some(parent) = output_path.parent() {
        fs::create_dir_all(parent).map_err(|err| {
            format!(
                "failed to create runtime config directory {}: {err}",
                parent.display()
            )
        })?;
    }

    fs::write(output_path, rendered).map_err(|err| {
        format!(
            "failed to write generated router config {}: {err}",
            output_path.display()
        )
    })
}

fn render_router_config(
    template_path: &Path,
    chat_model: &Path,
    embedding_model: &Path,
) -> Result<String, String> {
    let template = read_to_string(template_path).map_err(|err| {
        format!(
            "failed to read router template {}: {err}",
            template_path.display()
        )
    })?;

    let rendered = template
        .replace(
            "__CHAT_MODEL_PATH__",
            chat_model.to_str().ok_or_else(|| {
                format!(
                    "chat model path is not valid UTF-8: {}",
                    chat_model.display()
                )
            })?,
        )
        .replace(
            "__EMBEDDING_MODEL_PATH__",
            embedding_model.to_str().ok_or_else(|| {
                format!(
                    "embedding model path is not valid UTF-8: {}",
                    embedding_model.display()
                )
            })?,
        );

    Ok(rendered)
}

fn print_log(kind: &str, line: &[u8]) {
    let line = String::from_utf8_lossy(line);
    for segment in line.lines() {
        if !segment.is_empty() {
            eprintln!("[llama-server][{kind}] {segment}");
        }
    }
}
