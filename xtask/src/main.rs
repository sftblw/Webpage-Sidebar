use clap::{Parser, Subcommand};

mod crate_info;
mod workspace_helpers;

mod cmd;

// https://stackoverflow.com/a/27841363/4394750
const THIS_CRATE_NAME: &str = env!("CARGO_PKG_NAME");
const DIST_PATH: &str = "dist";

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Adds files to myapp
    Build {
        #[arg(short, long, action = clap::ArgAction::SetTrue)]
        release: bool,
    },
    Clean {
        #[arg(short, long, action = clap::ArgAction::SetTrue)]
        full: bool
    },
}

fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let cli = Cli::parse();

    match &cli.command {
        Commands::Build { release } => cmd::build::build(*release)?,
        Commands::Clean { full }=> cmd::clean::clean(*full)?,
    }
    Ok(())
}
