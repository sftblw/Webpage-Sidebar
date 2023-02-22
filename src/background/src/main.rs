mod storage;
mod browser;

use wasm_bindgen::{prelude::wasm_bindgen, JsValue};


pub fn main() {
    // ref: https://github.com/thedodd/trunk/issues/466
    // ref: https://github.com/emilk/eframe_template/pull/83/files
    wasm_bindgen_futures::spawn_local(async {
        let _result = main_js().await;
    })
}

// #[wasm_bindgen(start)]
pub async fn main_js() -> Result<(), JsValue> {
    web_sys::console::log_1(&"hello world".into());
    browser::local.clear().await;
    web_sys::console::log_1(&"clear".into());
    web_sys::console::log_1(&browser::local.get_1("asdf").await.expect("asdf"));

    Ok(())
}
