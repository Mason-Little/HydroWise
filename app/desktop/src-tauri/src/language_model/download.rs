use std::path::PathBuf;

use futures_util::StreamExt;
use tauri::AppHandle;
use tokio::{fs, io::AsyncWriteExt};

use super::paths;

// Resolves the on-disk path for a model tier.
fn download_path(app: &AppHandle, tier: &str) -> Result<PathBuf, String> {
    paths::model_slot(app, tier)
}

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadProgress {
    bytes_downloaded: u64,
    bytes_total: Option<u64>,
    progress: Option<f64>,
}

#[tauri::command]
// Downloads a GGUF model from url into the tier slot, streaming progress on progress.
pub async fn download_language_model(
    app: AppHandle,
    tier: String,
    url: String,
    progress: tauri::ipc::Channel<DownloadProgress>,
) -> Result<(), String> {
    let destination = download_path(&app, &tier)?;

    if destination.is_file() {
        let size = fs::metadata(&destination).await.ok().map(|metadata| metadata.len());
        let _ = progress.send(DownloadProgress {
            bytes_downloaded: size.unwrap_or(0),
            bytes_total: size,
            progress: Some(1.0),
        });
        return Ok(());
    }

    if let Some(parent) = destination.parent() {
        fs::create_dir_all(parent)
            .await
            .map_err(|err| format!("failed to create model directory: {err}"))?;
    }

    let temp_path = destination.with_extension("gguf.part");
    let _ = fs::remove_file(&temp_path).await;

    let response = reqwest::get(&url)
        .await
        .map_err(|err| format!("failed to start download: {err}"))?;

    if !response.status().is_success() {
        return Err(format!("download failed with status {}", response.status()));
    }

    let bytes_total = response.content_length();
    let mut bytes_downloaded = 0_u64;
    let mut stream = response.bytes_stream();
    let mut file = fs::File::create(&temp_path)
        .await
        .map_err(|err| format!("failed to create temp file: {err}"))?;

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|err| format!("failed while downloading: {err}"))?;

        file.write_all(&chunk)
            .await
            .map_err(|err| format!("failed to write download chunk: {err}"))?;

        bytes_downloaded += chunk.len() as u64;

        let _ = progress.send(DownloadProgress {
            bytes_downloaded,
            bytes_total,
            progress: bytes_total.map(|total| bytes_downloaded as f64 / total as f64),
        });
    }

    file.flush()
        .await
        .map_err(|err| format!("failed to flush temp file: {err}"))?;

    fs::rename(&temp_path, &destination)
        .await
        .map_err(|err| format!("failed to finalize model file: {err}"))?;

    Ok(())
}
