use std::path::Path;
use std::process::Command;

const EMBEDDING_MODEL_URL: &str = "https://huggingface.co/CompendiumLabs/bge-small-en-v1.5-gguf/resolve/main/bge-small-en-v1.5-q4_k_m.gguf?download=true";
const EMBEDDING_MODEL_PATH: &str = "resources/bge-small-en-v1.5-q4_k_m.gguf";

fn main() {
    if !Path::new(EMBEDDING_MODEL_PATH).exists() {
        println!("cargo:warning=Downloading embedding model...");
        std::fs::create_dir_all("resources").expect("failed to create resources dir");
        let status = Command::new("curl")
            .args(["-L", "--progress-bar", "-o", EMBEDDING_MODEL_PATH, EMBEDDING_MODEL_URL])
            .status()
            .expect("curl not found");
        assert!(status.success(), "embedding model download failed");
    }

    tauri_build::build()
}
