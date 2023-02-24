use std::collections::HashMap;

use js_sys::Object;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub type StorageArea;

    #[wasm_bindgen(method, js_name = get, catch)]
    pub async fn get(this: &StorageArea, keys: &JsValue) -> Result<JsValue, JsValue>;

    #[wasm_bindgen(method, js_name = get, catch)]
    pub async fn get_1(this: &StorageArea, key: &str) -> Result<JsValue, JsValue>;

    // #[wasm_bindgen(method, js_name = set, catch)]
    // pub async fn set_impl(this: &StorageArea, kv_dict: &Object) -> Result<(), JsValue>;

    #[wasm_bindgen(method, js_name = clear)]
    pub async fn clear(this: &StorageArea);
}

impl StorageArea {
    // fn set(&mut self, kv_dict: HashMap<String, JsValue>) {

    //     self.set_impl(kv_dict.into());
    // }
}