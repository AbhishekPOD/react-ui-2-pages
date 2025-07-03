use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn evaluate(expr: &str) -> Result<f64, JsValue> {
    meval::eval_str(expr).map_err(|e| JsValue::from_str(&format!("{}", e)))
}
