//! Lunar landing site engine. Pure Rust core (tested natively) plus thin wasm-bindgen exports.
//! API names and shapes follow SPEC.md "Engine API" and contracts/schemas/engine-api.schema.json (FND-1, proposed).

pub mod constants;
pub mod contracts;
pub mod geometry;
pub mod greedy;
pub mod grid;
pub mod hash;
pub mod mask;
pub mod metrics;
pub mod score;
pub mod thermal;

pub use contracts::{Area, GridHeader, Metrics, Params, Weights};
pub use greedy::{Factors, Nearby, window_cells};
pub use metrics::{Extras, SiteGeom};
pub use score::{grid_fracs, psr_flags, scores_from_fracs};
use serde::{Serialize, de::DeserializeOwned};
use wasm_bindgen::prelude::*;

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

/// One score per grid cell, row-major (NaN = excluded): `grid_fracs` then `scores_from_fracs`.
/// `grid`: the raw grid/{region}.bin bytes; `t_start_h`: hours since the ephem t0.
#[allow(clippy::too_many_arguments)]
pub fn grid_scores(
    grid: &[u8],
    header: &GridHeader,
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    weights: &Weights,
    params: &Params,
) -> Result<Vec<f32>, String> {
    let fracs = grid_fracs(header, grid, ephem, t_start_h, hours, params)?;
    scores_from_fracs(header, grid, &fracs, weights, params)
}

/// Ranked landing areas, best first (GREEDY step 4).
pub fn top_areas(
    scores: &[f32],
    header: &GridHeader,
    window_cells: usize,
    exclusion_m: f64,
    n: usize,
) -> Result<Vec<Area>, &'static str> {
    greedy::top_areas(scores, header, window_cells, exclusion_m, n)
}

/// Best window within `radius_m` of stereo (x_m, y_m) vs the site's own window (GREEDY step 5).
#[allow(clippy::too_many_arguments)]
pub fn nearby_better(
    grid: &[u8],
    header: &GridHeader,
    fracs: &[f32],
    weights: &Weights,
    params: &Params,
    window_cells: usize,
    x_m: f64,
    y_m: f64,
    radius_m: f64,
) -> Result<Option<Nearby>, String> {
    let f = score::FactorGrid::new(header, grid, fracs)?;
    let scores = f.scores(weights, params)?;
    let l = f.layers();
    Ok(greedy::nearby_better(
        &scores,
        &l,
        header,
        window_cells,
        x_m,
        y_m,
        radius_m,
        params.slope_limit_deg,
    )?)
}

/// Normalised factor means over the window centred on the cell containing (x_m, y_m): why an area ranked.
pub fn window_factors(
    grid: &[u8],
    header: &GridHeader,
    fracs: &[f32],
    params: &Params,
    window_cells: usize,
    x_m: f64,
    y_m: f64,
) -> Result<Factors, String> {
    let f = score::FactorGrid::new(header, grid, fracs)?;
    let i = greedy::cell_at(header, x_m, y_m)?;
    Ok(greedy::window_factors(
        &f.layers(),
        header,
        window_cells,
        i,
        params.slope_limit_deg,
    ))
}

/// 16-hex FNV-1a 64 of `hash::ENGINE_TAG` + raw result bytes (e.g. grid scores as bytes).
pub fn output_hash(bytes: &[u8]) -> String {
    hash::bytes_hex(bytes)
}

/// Same hash over f32 results written canonically (one NaN, -0 -> +0): what the UI shows for float arrays,
/// since WASM NaN payloads are unspecified. Equals `output_hash` of the bytes when there is no NaN or -0.
pub fn output_hash_f32(xs: &[f32]) -> String {
    hash::f32s_hex(xs)
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
#[allow(clippy::too_many_arguments)]
pub fn grid_scores_js(
    grid: &[u8],
    header: JsValue,
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    weights: JsValue,
    params: JsValue,
) -> Result<Vec<f32>, JsError> {
    let (h, w, p): (GridHeader, Weights, Params) =
        (from_js(&header)?, from_js(&weights)?, from_js(&params)?);
    grid_scores(grid, &h, ephem, t_start_h, hours, &w, &p).map_err(|e| JsError::new(&e))
}

/// FRACS_PER_CELL (4) floats per cell: sun_frac, earth_frac, cold_frac, longest_dark_h.
#[wasm_bindgen(js_name = grid_fracs)]
pub fn grid_fracs_js(
    grid: &[u8],
    header: JsValue,
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    params: JsValue,
) -> Result<Vec<f32>, JsError> {
    let (h, p): (GridHeader, Params) = (from_js(&header)?, from_js(&params)?);
    grid_fracs(&h, grid, ephem, t_start_h, hours, &p).map_err(|e| JsError::new(&e))
}

#[wasm_bindgen(js_name = scores_from_fracs)]
pub fn scores_from_fracs_js(
    grid: &[u8],
    header: JsValue,
    fracs: &[f32],
    weights: JsValue,
    params: JsValue,
) -> Result<Vec<f32>, JsError> {
    let (h, w, p): (GridHeader, Weights, Params) =
        (from_js(&header)?, from_js(&weights)?, from_js(&params)?);
    scores_from_fracs(&h, grid, fracs, &w, &p).map_err(|e| JsError::new(&e))
}

/// 1 per permanently shadowed cell, else 0 (GREEDY decision 10).
#[wasm_bindgen(js_name = psr_flags)]
pub fn psr_flags_js(grid: &[u8], header: JsValue) -> Result<Vec<u8>, JsError> {
    let h: GridHeader = from_js(&header)?;
    psr_flags(&h, grid).map_err(|e| JsError::new(&e))
}

#[wasm_bindgen(js_name = top_areas)]
pub fn top_areas_js(
    scores: &[f32],
    header: JsValue,
    window_cells: usize,
    exclusion_m: f64,
    n: usize,
) -> Result<JsValue, JsError> {
    let h: GridHeader = from_js(&header)?;
    to_js(&top_areas(scores, &h, window_cells, exclusion_m, n).map_err(JsError::new)?)
}

#[wasm_bindgen(js_name = window_cells)]
pub fn window_cells_js(base_m: f64, cell_m: f64) -> Result<usize, JsError> {
    window_cells(base_m, cell_m).map_err(JsError::new)
}

/// Nearby | null.
#[wasm_bindgen(js_name = nearby_better)]
#[allow(clippy::too_many_arguments)]
pub fn nearby_better_js(
    grid: &[u8],
    header: JsValue,
    fracs: &[f32],
    weights: JsValue,
    params: JsValue,
    window_cells: usize,
    x_m: f64,
    y_m: f64,
    radius_m: f64,
) -> Result<JsValue, JsError> {
    let (h, w, p): (GridHeader, Weights, Params) =
        (from_js(&header)?, from_js(&weights)?, from_js(&params)?);
    let nb = nearby_better(grid, &h, fracs, &w, &p, window_cells, x_m, y_m, radius_m)
        .map_err(|e| JsError::new(&e))?;
    to_js(&nb)
}

#[wasm_bindgen(js_name = window_factors)]
pub fn window_factors_js(
    grid: &[u8],
    header: JsValue,
    fracs: &[f32],
    params: JsValue,
    window_cells: usize,
    x_m: f64,
    y_m: f64,
) -> Result<JsValue, JsError> {
    let (h, p): (GridHeader, Params) = (from_js(&header)?, from_js(&params)?);
    to_js(
        &window_factors(grid, &h, fracs, &p, window_cells, x_m, y_m)
            .map_err(|e| JsError::new(&e))?,
    )
}

#[wasm_bindgen(js_name = output_hash)]
pub fn output_hash_js(bytes: &[u8]) -> String {
    output_hash(bytes)
}

#[wasm_bindgen(js_name = output_hash_f32)]
pub fn output_hash_f32_js(xs: &[f32]) -> String {
    output_hash_f32(xs)
}

/// Hash of a Metrics[] list, every field canonical and in contract order (see hash.rs).
#[wasm_bindgen(js_name = metrics_hash)]
pub fn metrics_hash_js(list: JsValue) -> Result<String, JsError> {
    let list: Vec<Metrics> = from_js(&list)?;
    Ok(hash::metrics_hex(&list))
}

/// Copy of `ephem` (rows of 6 f32) with angle columns snapped to `hash::QUANTUM_DEG`.
#[wasm_bindgen(js_name = quantize_ephem)]
pub fn quantize_ephem_js(ephem: &[f32]) -> Result<Vec<f32>, JsError> {
    let mut rows = ephem.to_vec();
    hash::quantize_ephem(&mut rows).map_err(JsError::new)?;
    Ok(rows)
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
        assert_eq!(output_hash(b"x").len(), 16);
        assert_ne!(output_hash(b"x"), output_hash(b"y"));
        let raw =
            |xs: &[f32]| output_hash(&xs.iter().flat_map(|x| x.to_le_bytes()).collect::<Vec<u8>>());
        assert_eq!(output_hash_f32(&[1.5, 2.0]), raw(&[1.5, 2.0]));
        assert_eq!(output_hash_f32(&[-0.0]), output_hash_f32(&[0.0]));
        assert_eq!(
            output_hash_f32(&[f32::from_bits(0xffc0_0001)]),
            output_hash_f32(&[f32::NAN])
        );
        assert_ne!(
            output_hash(&(-0.0f32).to_le_bytes()),
            output_hash(&0.0f32.to_le_bytes())
        );
    }
}
