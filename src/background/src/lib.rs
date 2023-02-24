use wasm_bindgen::prelude::*;
use ws_webextensions::browser;

#[wasm_bindgen(start)]
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
    browser::storage::LOCAL.clear().await;
    web_sys::console::log_1(&"clear".into());
    // browser::storage::LOCAL.set_1("{asdf}").await?;
    web_sys::console::log_1(&browser::storage::LOCAL.get_1("asdf").await.expect("asdf"));
    Ok(())
}
