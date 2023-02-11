use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CrudStamp {
    #[serde(rename="c")]
    created: String,
    
    #[serde(rename="u")]
    updated: Option<String>,
    
    #[serde(rename="d")]
    deleted: Option<String>,
    
    #[serde(rename="i")]
    index: String
}