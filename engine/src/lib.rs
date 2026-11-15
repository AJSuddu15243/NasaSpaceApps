//! Lunar landing site engine. Pure Rust core (tested natively) plus thin wasm-bindgen exports.
//! API names and shapes follow SPEC.md "Engine API" and contracts/schemas/engine-api.schema.json (FND-1, proposed).

pub mod constants;
pub mod contracts;
pub mod geometry;
pub mod grid;
pub mod mask;
pub mod score;
pub mod thermal;

pub use contracts::{Area, Metrics, Params, Weights};
use serde::{Serialize, de::DeserializeOwned};
use wasm_bindgen::prelude::*;

// shortcut: every function below is a stub returning neutral values, replaced by ENG-4/6/7/8.

/// Site metrics over [t_start, t_start + hours]. `mask_deg`: horizon per bin; `ephem`: rows of 6 f32 (ephem.json).
pub fn site_metrics(
    _mask_deg: &[f32],
    _ephem: &[f32],
    _t_start: f64,
    _hours: f64,
    _params: &Params,
) -> Metrics {
    Metrics {
        pct_lit: 0.0,
        longest_dark_h: 0.0,
        pct_earth_visible: 0.0,
        longest_blackout_h: 0.0,
        h_to_first_sunset: None,
        h_to_first_earthset: None,
        mean_sun_el_deg: 0.0,
        max_sun_el_deg: 0.0,
        mean_power_vertical: 0.0,
        mean_power_horizontal: 0.0,
        t_min_k: 0.0,
        t_max_k: 0.0,
        h_below_survival: 0.0,
    }
}

/// One score per grid cell, row-major. `grid`: the raw grid/{region}.bin bytes.
pub fn grid_scores(
    _grid: &[u8],
    _ephem: &[f32],
    _t_start: f64,
    _hours: f64,
    _weights: &Weights,
) -> Vec<f32> {
    Vec::new()
}

/// Ranked landing areas, best first.
pub fn top_areas(_scores: &[f32], _window_cells: usize, _n: usize) -> Vec<Area> {
    Vec::new()
}

/// Hex hash of result bytes (ENG-8 picks the algorithm).
pub fn output_hash(_bytes: &[u8]) -> String {
    "0".repeat(16)
}

// --- wasm exports: plain JS objects in/out via serde, typed arrays for bulk data ---

// Objects cross as JSON so serde_json applies the contract exactly: unknown fields rejected
// (deny_unknown_fields), `None` written as `null`. Bulk data crosses as typed arrays instead.
fn from_js<T: DeserializeOwned>(value: &JsValue) -> Result<T, JsError> {
    let text = js_sys::JSON::stringify(value)
        .map_err(|_| JsError::new("input is not JSON-serializable"))?;
    Ok(serde_json::from_str(&String::from(text))?)
}

fn to_js<T: Serialize>(value: &T) -> Result<JsValue, JsError> {
    js_sys::JSON::parse(&serde_json::to_string(value)?)
        .map_err(|_| JsError::new("output is not valid JSON"))
}

#[wasm_bindgen(js_name = site_metrics)]
pub fn site_metrics_js(
    mask_deg: &[f32],
    ephem: &[f32],
    t_start: f64,
    hours: f64,
    params: JsValue,
) -> Result<JsValue, JsError> {
    let params: Params = from_js(&params)?;
    to_js(&site_metrics(mask_deg, ephem, t_start, hours, &params))
}

#[wasm_bindgen(js_name = grid_scores)]
pub fn grid_scores_js(
    grid: &[u8],
    ephem: &[f32],
    t_start: f64,
    hours: f64,
    weights: JsValue,
) -> Result<Vec<f32>, JsError> {
    let weights: Weights = from_js(&weights)?;
    Ok(grid_scores(grid, ephem, t_start, hours, &weights))
}

#[wasm_bindgen(js_name = top_areas)]
pub fn top_areas_js(scores: &[f32], window_cells: usize, n: usize) -> Result<JsValue, JsError> {
    to_js(&top_areas(scores, window_cells, n))
}

#[wasm_bindgen(js_name = output_hash)]
pub fn output_hash_js(bytes: &[u8]) -> String {
    output_hash(bytes)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn weights() -> Weights {
        Weights {
            sun: 0.35,
            earth: 0.25,
            slope: 0.2,
            crater: 0.1,
            rock: 0.0,
            thermal: 0.1,
        }
    }

    #[test]
    fn inputs_follow_contract() {
        let ok = r#"{"sun":0.35,"earth":0.25,"slope":0.2,"crater":0.1,"rock":0,"thermal":0.1}"#;
        assert_eq!(serde_json::from_str::<Weights>(ok).unwrap(), weights());
        assert!(serde_json::from_str::<Weights>(r#"{"sun":1}"#).is_err()); // missing factor
        let typo = ok.replace("\"thermal\"", "\"thermall\"");
        assert!(serde_json::from_str::<Weights>(&typo).is_err()); // unknown key, not silently 0
    }

    #[test]
    fn missing_events_serialize_as_null() {
        let m = site_metrics(&[], &[], 0.0, 24.0, &serde_json::from_str(PARAMS).unwrap());
        assert!(
            serde_json::to_string(&m)
                .unwrap()
                .contains(r#""h_to_first_sunset":null"#)
        );
    }

    const PARAMS: &str = r#"{"battery_h":24,"survival_temp_k":233,"antenna_margin_deg":2,"slope_limit_deg":10,"step_hours":1}"#;

    #[test]
    fn stubs_return_contract_shapes() {
        let p = Params {
            battery_h: 24.0,
            survival_temp_k: 233.0,
            antenna_margin_deg: 2.0,
            slope_limit_deg: 10.0,
            step_hours: 1.0,
        };
        assert_eq!(
            site_metrics(&[0.0; 360], &[0.0; 6], 0.0, 24.0, &p).h_to_first_sunset,
            None
        );
        assert!(grid_scores(&[], &[], 0.0, 24.0, &weights()).is_empty());
        assert!(top_areas(&[0.0; 6], 5, 3).is_empty());
        assert_eq!(output_hash(b"x").len(), 16);
    }
}
