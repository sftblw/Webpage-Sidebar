#[derive(Debug)]
pub struct CrateInfo {
    pub name: String,
    pub path: std::path::PathBuf
}

impl From<cargo_metadata::Package> for CrateInfo {
    fn from(package: cargo_metadata::Package) -> Self {
        CrateInfo {
            name: package.name,
            path: package.manifest_path
                .parent().expect("Cargo.toml parent should exist")
                .to_path_buf().into_std_path_buf()
        }
    }
}