use std::{error::Error, sync::Mutex};

use tauri_plugin_shell::process::CommandChild;

#[derive(Default)]
pub struct LlamaSidecarState {
    child: Mutex<Option<CommandChild>>,
}

impl LlamaSidecarState {
    pub fn is_running(&self) -> bool {
        self.child
            .lock()
            .map(|guard| guard.is_some())
            .unwrap_or(false)
    }

    pub fn set_if_absent(
        &self,
        child: CommandChild,
    ) -> Result<Option<CommandChild>, Box<dyn Error + Send + Sync>> {
        let mut lock = self
            .child
            .lock()
            .map_err(|err| std::io::Error::other(err.to_string()))?;

        if lock.is_some() {
            Ok(Some(child))
        } else {
            *lock = Some(child);
            Ok(None)
        }
    }

    pub fn take(&self) -> Result<Option<CommandChild>, Box<dyn Error + Send + Sync>> {
        let mut lock = self
            .child
            .lock()
            .map_err(|err| std::io::Error::other(err.to_string()))?;

        Ok(lock.take())
    }
}
