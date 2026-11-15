//! Lunar landing site engine. Pure Rust core (tested natively) plus thin wasm-bindgen exports.
//! API names and shapes follow SPEC.md "Engine API" and contracts/schemas/engine-api.schema.json (FND-1, proposed).

pub mod constants;
pub mod contracts;
pub mod geometry;
pub mod grid;
pub mod mask;
pub mod metrics;
pub mod score;
pub mod thermal;

pub use contracts::{Area, Metrics, Params, Weights};
pub use metrics::{Extras, SiteGeom};
use serde::{Serialize, de::DeserializeOwned};
use wasm_bindgen::prelude::*;

// shortcut: grid_scores, top_areas and output_hash are stubs returning neutral values, replaced by ENG-6/7/8.

/// Site metrics over [t_start_h, t_start_h + hours), `t_start_h` in hours since the ephem t0.
/// `mask_deg`: horizon per bin (any bin count); `ephem`: rows of 6 f32 (ephem.json).
/// h_to_first_* are 0 when the Sun / Earth is already down at t_start, null when it never sets.
pub fn site_metrics(
    geom: &SiteGeom,
    mask_deg: &[f32],
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    params: &Params,
) -> Result<Metrics, &'static str> {
    let b = metrics::bodies(ephem, t_start_h, hours, params.step_hours)?;
    Ok(metrics::window(geom, mask_deg, &b, params)?.0)
}

/// Validity extras for the same window (kept out of `Metrics` until the contract adds them).
pub fn site_extras(
    geom: &SiteGeom,
    mask_deg: &[f32],
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    params: &Params,
) -> Result<Extras, &'static str> {
    let b = metrics::bodies(ephem, t_start_h, hours, params.step_hours)?;
    Ok(metrics::window(geom, mask_deg, &b, params)?.1)
}

/// Per-step track, 6 f32 per step: sun_az, sun_el, sun_lit (0..1), earth_az, earth_el, earth_visible (0/1).
pub fn site_track(
    geom: &SiteGeom,
    mask_deg: &[f32],
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    params: &Params,
) -> Result<Vec<f32>, &'static str> {
    let b = metrics::bodies(ephem, t_start_h, hours, params.step_hours)?;
    metrics::track(geom, mask_deg, &b, params)
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
    geom: JsValue,
    mask_deg: &[f32],
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    params: JsValue,
) -> Result<JsValue, JsError> {
    let (geom, params): (SiteGeom, Params) = (from_js(&geom)?, from_js(&params)?);
    to_js(&site_metrics(&geom, mask_deg, ephem, t_start_h, hours, &params).map_err(JsError::new)?)
}

#[wasm_bindgen(js_name = site_extras)]
pub fn site_extras_js(
    geom: JsValue,
    mask_deg: &[f32],
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    params: JsValue,
) -> Result<JsValue, JsError> {
    let (geom, params): (SiteGeom, Params) = (from_js(&geom)?, from_js(&params)?);
    to_js(&site_extras(&geom, mask_deg, ephem, t_start_h, hours, &params).map_err(JsError::new)?)
}

#[wasm_bindgen(js_name = site_track)]
pub fn site_track_js(
    geom: JsValue,
    mask_deg: &[f32],
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    params: JsValue,
) -> Result<Vec<f32>, JsError> {
    let (geom, params): (SiteGeom, Params) = (from_js(&geom)?, from_js(&params)?);
    site_track(&geom, mask_deg, ephem, t_start_h, hours, &params).map_err(JsError::new)
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

    fn geom() -> SiteGeom {
        serde_json::from_str(r#"{"lat_deg":-89.5,"lon_deg":0,"elev_m":0,"slope_deg":0}"#).unwrap()
    }

    /// 30 hourly rows: Sun at sub-lat -10 (always up near the pole), Earth at lat 0.
    fn sunny_ephem() -> Vec<f32> {
        (0..30)
            .flat_map(|k| [-10.0, k as f32, 1.496e8, 0.0, 0.0, 384_400.0])
            .collect()
    }

    #[test]
    fn site_geom_rejects_unknown_fields() {
        assert!(
            serde_json::from_str::<SiteGeom>(
                r#"{"lat_deg":-89,"lon_deg":0,"elev_m":0,"slope_deg":0,"aspect":1}"#
            )
            .is_err()
        );
        assert_eq!(geom().aspect_deg, None);
    }

    #[test]
    fn missing_events_serialize_as_null() {
        let p = serde_json::from_str(PARAMS).unwrap();
        let m = site_metrics(&geom(), &[0.0; 360], &sunny_ephem(), 0.0, 24.0, &p).unwrap();
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
            site_metrics(&geom(), &[0.0; 360], &sunny_ephem(), 0.0, 24.0, &p)
                .unwrap()
                .h_to_first_sunset,
            None
        );
        assert!(site_metrics(&geom(), &[0.0; 360], &[0.0; 6], 0.0, 24.0, &p).is_err()); // window past the table
        let bad_step = Params {
            step_hours: 0.7,
            ..p
        };
        assert!(site_metrics(&geom(), &[0.0; 360], &sunny_ephem(), 0.0, 24.0, &bad_step).is_err());
        assert_eq!(
            site_track(&geom(), &[0.0; 64], &sunny_ephem(), 1.0, 4.0, &p)
                .unwrap()
                .len(),
            24
        );
        assert!(
            site_extras(&geom(), &[0.0; 64], &sunny_ephem(), 1.0, 4.0, &p)
                .unwrap()
                .survives_night
        );
        assert!(grid_scores(&[], &[], 0.0, 24.0, &weights()).is_empty());
        assert!(top_areas(&[0.0; 6], 5, 3).is_empty());
        assert_eq!(output_hash(b"x").len(), 16);
    }
}
