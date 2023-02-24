use wasm_bindgen::prelude::*;

pub mod storage_area;
use storage_area::StorageArea;


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = ["browser", "storage"], js_name = local)]
    pub static LOCAL: StorageArea;

    #[wasm_bindgen(js_namespace = ["browser", "storage"], js_name = managed)]
    pub static MANAGED: StorageArea;

    #[wasm_bindgen(js_namespace = ["browser", "storage"], js_name = session)]
    pub static SESSION: StorageArea;

    #[wasm_bindgen(js_namespace = ["browser", "storage"], js_name = sync)]
    pub static SYNC: StorageArea;
}