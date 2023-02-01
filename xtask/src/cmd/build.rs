use std::{process::{Command}, fs, path::PathBuf, str::FromStr};

use tracing::*;

use crate::{workspace_helpers::{workspace_crates, workspace_root}, DIST_PATH};

#[tracing::instrument]
pub(crate) fn build() -> anyhow::Result<()> {
    info!("start");

    let info_list = workspace_crates()?;

    for info in info_list {
        let span = tracing::span!(Level::INFO, "", info.name);
        let _entered = span.enter();
        
        if info.path.join("index.html").exists() {
            info!(
                "[{}] Trunk.toml exists. launching trunk build ...",
                info.name
            );
            
            let mut handle = Command::new("trunk").arg("build").current_dir(info.path).spawn()?;
            handle.wait()?;
        } else {
            info!("[{}] launching build ...", info.name);

            let mut handle = Command::new("cargo").arg("build").current_dir(info.path).spawn()?;
            handle.wait()?;
        }
    }

    info!("copying src_plain into {}", DIST_PATH);

    let root_path = workspace_root()?;
    
    let read_result = std::fs::read_dir(root_path.join("src_plain"))?;

    for entry in read_result {
        let entry = entry?;
        let file_type = entry.file_type()?;
        println!("{:?}", entry);
        
        if file_type.is_dir() {
            let copy_options = fs_extra::dir::CopyOptions { overwrite: true, skip_exist: false, ..Default::default() };
            fs_extra::dir::copy(entry.path(), DIST_PATH, &copy_options)?;
        } else if file_type.is_file() {
            fs::copy(entry.path(), PathBuf::from_str(DIST_PATH)?.join(entry.file_name()))?;
        }
    }

    info!("ok");
    
    Ok(())
}