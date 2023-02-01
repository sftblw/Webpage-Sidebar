use std::process::{Command};

use tracing::*;

use crate::{workspace_helpers::{workspace_crates, workspace_root}, DIST_PATH, THIS_CRATE_NAME};


#[tracing::instrument]
pub(crate) fn clean(full: bool) -> anyhow::Result<()> {
    info!("calling cargo clean");

    let info_list = workspace_crates()?;

    for info in info_list {
        let span = tracing::span!(Level::INFO, "", info.name);
        let _entered = span.enter();
        info!("cleaning {}", info.name);
        // cargo clean cleanse all of workspace
        let mut handle = Command::new("cargo")
            .arg("clean")
            .arg("--package")
            .arg(info.name)
            .current_dir(info.path).spawn()?;
        handle.wait()?;
    }

    if full {
        info!("cleaning {}", THIS_CRATE_NAME);
        let mut handle = Command::new("cargo")
            .arg("clean")
            .arg("--package")
            .arg(THIS_CRATE_NAME)
            .spawn()?;
        handle.wait()?;
    }
    
    info!("emptying dist");
    let root_path = workspace_root()?;

    let sh = xshell::Shell::new()?;
    sh.change_dir(root_path);
    sh.remove_path(DIST_PATH)?;
    sh.create_dir(DIST_PATH)?;

    info!("ok");

    if full {
        info!("running cargo clean");
        let _handle = Command::new("cargo")
            .arg("clean")
            .spawn()?;
    }

    Ok(())
}