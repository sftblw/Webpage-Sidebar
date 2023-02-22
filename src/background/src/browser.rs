use wasm_bindgen::prelude::*;
use js_sys::Promise;

    
#[wasm_bindgen]
extern "C" {
    pub type StorageArea;

    #[wasm_bindgen(method, js_name = get, catch)]
    pub async fn get(this: &StorageArea, keys: &JsValue) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(method, js_name = get, catch)]
    pub async fn get_1(this: &StorageArea, keys: &str) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(method, js_name = set, catch)]
    pub async fn set_1(this: &StorageArea, keys: &str) -> Result<(), JsValue>;

    #[wasm_bindgen(method, js_name = clear)]
    pub async fn clear(this: &StorageArea);
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = ["browser", "storage"])]
    pub static local: StorageArea;

    #[wasm_bindgen(js_namespace = ["browser", "storage"])]
    pub static managed: StorageArea;

    #[wasm_bindgen(js_namespace = ["browser", "storage"])]
    pub static session: StorageArea;

    #[wasm_bindgen(js_namespace = ["browser", "storage"])]
    pub static sync: StorageArea;
}
