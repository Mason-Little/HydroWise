use std::path::PathBuf;

use tauri::AppHandle;
#[cfg(not(debug_assertions))]
use tauri::Manager;

// Re-export shared path utilities from language_model.
pub use crate::language_model::paths::server_command_name;

pub fn embedding_model_slot(_app: &AppHandle) -> Result<PathBuf, String> {
    // In dev builds, resources aren't copied by Tauri — point straight at src-tauri/resources/.
    #[cfg(debug_assertions)]
    return Ok(PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("resources/bge-small-en-v1.5-q4_k_m.gguf"));

    #[cfg(not(debug_assertions))]
    _app.path()
        .resource_dir()
        .map_err(|err| format!("failed to resolve resource dir: {err}"))
        .map(|dir| dir.join("bge-small-en-v1.5-q4_k_m.gguf"))
}
