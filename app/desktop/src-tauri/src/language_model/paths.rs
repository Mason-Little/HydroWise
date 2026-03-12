use std::path::PathBuf;

use tauri::{AppHandle, Manager};

// App data subdir used for models and embeddings.
pub fn management_root(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map_err(|err| format!("failed to resolve app data dir: {err}"))
        .map(|dir| dir.join("management"))
}

// Directory for chat model files.
pub fn models_dir(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(management_root(app)?.join("models"))
}

// Directory for embedding model files.
pub fn embeddings_dir(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(management_root(app)?.join("embeddings"))
}

// Path to the GGUF file for the given tier.
pub fn model_slot(app: &AppHandle, tier: &str) -> Result<PathBuf, String> {
    Ok(models_dir(app)?.join(format!("{tier}.gguf")))
}

// Sidecar binary name for the llama server.
pub fn server_command_name() -> &'static str {
    "llama-server"
}
