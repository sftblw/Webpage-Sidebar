use std::path::PathBuf;

use crate::{THIS_CRATE_NAME, crate_info::{CrateInfo}};

fn _workspace_crates_raw() -> anyhow::Result<Vec<cargo_metadata::Package>> {
    let cmd = cargo_metadata::MetadataCommand::new();
    
    let metadata = cmd.exec()?;

    let crates: Vec<&cargo_metadata::Package> = metadata.workspace_packages();
    let packages: Vec<cargo_metadata::Package> = crates.into_iter()
        .filter(|pkg| pkg.name != THIS_CRATE_NAME)
        .cloned()
        .collect();

    Ok(packages)
}

pub(crate) fn workspace_crates() -> anyhow::Result<Vec<CrateInfo>> {
    let packages = _workspace_crates_raw()?;
    let parent_paths: Vec<CrateInfo> = packages.into_iter().map(|pkg| pkg.into()).collect();

    Ok(parent_paths)
}

pub(crate) fn workspace_root() -> anyhow::Result<PathBuf>  {
    let cmd = cargo_metadata::MetadataCommand::new();
    
    let metadata = cmd.exec()?;

    Ok(metadata.workspace_root.to_path_buf().into_std_path_buf())
}