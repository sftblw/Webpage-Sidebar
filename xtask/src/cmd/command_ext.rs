use std::{ffi::OsStr, process::Command};

pub(crate) trait OptionalCommand<T>
    where T: AsRef<OsStr>
{
    fn arg_opt(&mut self, option: Option::<T>) -> &mut Command;
}

impl<T> OptionalCommand<T> for Command 
    where T: AsRef<OsStr>
{
    fn arg_opt(&mut self, option: Option::<T>) -> &mut Command {
        if let Some(val) = option {
            self.arg(val);
        }
        self
    }
}