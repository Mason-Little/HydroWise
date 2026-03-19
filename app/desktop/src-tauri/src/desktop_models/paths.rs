use std::path::PathBuf;

use tauri::{AppHandle, Manager};

// App data subdir used for local GGUF models (chat, vision, embedding slots).
pub fn management_root(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map_err(|err| format!("failed to resolve app data dir: {err}"))
        .map(|dir| dir.join("management"))
}

// Directory for GGUF models (chat tiers, vision, embedding).
pub fn models_dir(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(management_root(app)?.join("models"))
}

// Path to the model GGUF for the given tier or slot id.
// Each tier lives in its own subdirectory so llama-server --models-dir treats it as a
pub fn model_slot(app: &AppHandle, tier: &str) -> Result<PathBuf, String> {
    Ok(models_dir(app)?.join(tier).join("model.gguf"))
}

// Path to the vision projection GGUF for the given tier.
// The filename must start with "mmproj" for llama-server bundle auto-detection.
pub fn mmproj_slot(app: &AppHandle, tier: &str) -> Result<PathBuf, String> {
    Ok(models_dir(app)?.join(tier).join("mmproj-F16.gguf"))
}

// Sidecar binary name for the llama server.
pub fn server_command_name() -> &'static str {
    "llama-server"
}
