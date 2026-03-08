use std::{
    collections::HashMap,
    fs::read_to_string,
    path::{Path, PathBuf},
};

use tauri::{AppHandle, Manager};

pub struct RuntimePaths {
    pub template_router_config: PathBuf,
    pub generated_router_config: PathBuf,
    pub chat_model: PathBuf,
    pub embedding_model: PathBuf,
}

impl RuntimePaths {
    pub fn from_app(handle: &AppHandle) -> Result<Self, String> {
        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let config_dir = manifest_dir.join("../config");
        let template_router_config = config_dir.join("llama-router.ini");
        let models_config = parse_models_config(&config_dir.join("models.ini"))?;

        let generated_router_config = handle
            .path()
            .app_config_dir()
            .map_err(|err| format!("failed to read app config dir: {err}"))?
            .join("llama/llama-router.ini");

        Ok(Self {
            template_router_config,
            generated_router_config,
            chat_model: models_config.chat_model,
            embedding_model: models_config.embedding_model,
        })
    }

    pub fn sidecar_command_name() -> &'static str {
        "llama-server"
    }
}

struct ModelsConfig {
    chat_model: PathBuf,
    embedding_model: PathBuf,
}

fn parse_models_config(config_path: &Path) -> Result<ModelsConfig, String> {
    let content = read_to_string(config_path).map_err(|err| {
        format!(
            "failed to read models config {}: {err}",
            config_path.display()
        )
    })?;
    let config_dir = config_path.parent().ok_or_else(|| {
        format!(
            "models config has no parent directory: {}",
            config_path.display()
        )
    })?;

    let mut current_section = String::new();
    let mut models_root = None;
    let mut default_chat = None;
    let mut default_embedding = None;
    let mut chat_paths = HashMap::new();
    let mut embedding_paths = HashMap::new();

    for raw_line in content.lines() {
        let line = raw_line.trim();

        if line.is_empty() || line.starts_with('#') || line.starts_with(';') {
            continue;
        }

        if line.starts_with('[') && line.ends_with(']') {
            current_section = line[1..line.len() - 1].trim().to_string();
            continue;
        }

        let Some((key, value)) = line.split_once('=') else {
            continue;
        };

        let key = key.trim();
        let value = value.trim();

        match current_section.as_str() {
            "models" if key == "root" => {
                models_root = Some(config_dir.join(value));
            }
            "defaults" if key == "chat" => {
                default_chat = Some(value.to_string());
            }
            "defaults" if key == "embedding" => {
                default_embedding = Some(value.to_string());
            }
            section if section.starts_with("chat.") && key == "path" => {
                let name = section.trim_start_matches("chat.");
                chat_paths.insert(name.to_string(), value.to_string());
            }
            section if section.starts_with("embedding.") && key == "path" => {
                let name = section.trim_start_matches("embedding.");
                embedding_paths.insert(name.to_string(), value.to_string());
            }
            _ => {}
        }
    }

    let models_root =
        models_root.ok_or_else(|| format!("missing [models] root in {}", config_path.display()))?;
    let default_chat = default_chat
        .ok_or_else(|| format!("missing [defaults] chat in {}", config_path.display()))?;
    let default_embedding = default_embedding
        .ok_or_else(|| format!("missing [defaults] embedding in {}", config_path.display()))?;

    let chat_model = build_model_path(
        &models_root,
        chat_paths.get(&default_chat),
        "chat",
        &default_chat,
        config_path,
    )?;
    let embedding_model = build_model_path(
        &models_root,
        embedding_paths.get(&default_embedding),
        "embedding",
        &default_embedding,
        config_path,
    )?;

    Ok(ModelsConfig {
        chat_model,
        embedding_model,
    })
}

fn build_model_path(
    models_root: &Path,
    relative_path: Option<&String>,
    model_type: &str,
    model_name: &str,
    config_path: &Path,
) -> Result<PathBuf, String> {
    let relative_path = relative_path.ok_or_else(|| {
        format!(
            "missing [{model_type}.{model_name}] path in {}",
            config_path.display()
        )
    })?;

    Ok(models_root.join(relative_path))
}

pub fn ensure_model_exists(path: &Path) -> Result<(), String> {
    if path.is_file() {
        return Ok(());
    }

    Err(format!("model file missing: {}", path.display()))
}
