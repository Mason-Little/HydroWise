use std::{error::Error, sync::Mutex};

use tauri_plugin_shell::process::CommandChild;

#[derive(Default)]
pub struct LanguageModelServerState {
    child: Mutex<Option<CommandChild>>,
}

impl LanguageModelServerState {
    // True if a server process is currently stored.
    pub fn is_running(&self) -> bool {
        self.child
            .lock()
            .map(|guard| guard.is_some())
            .unwrap_or(false)
    }

    // Stores the child only if no server is running; returns the child if already running.
    pub fn set_if_stopped(
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

    // Removes and returns the stored server process, if any.
    pub fn take(&self) -> Result<Option<CommandChild>, Box<dyn Error + Send + Sync>> {
        let mut lock = self
            .child
            .lock()
            .map_err(|err| std::io::Error::other(err.to_string()))?;

        Ok(lock.take())
    }
}
