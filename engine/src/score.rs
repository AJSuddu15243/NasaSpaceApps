//! ENG-6: weighted cell score from per-cell factor layers, the grid time simulation that fills the
//! sun/earth/thermal layers from the 64-bin mask layer, and the PSR flag layer.
//! Design and decisions: .agent/GREEDY.md steps 1–2.

use crate::Weights;
use crate::contracts::{GridHeader, GridLayer, Params};
use crate::geometry::to_latlon;
use crate::grid::{cell_xy, decode_layer};
use crate::metrics::{self, SiteGeom};

/// Crater depth at which the crater factor reaches 0 (decided, GREEDY.md decision 3).
pub const DEPTH_REF_M: f64 = 50.0;
// shortcut: rock ships as a 0–1 DEM roughness proxy (PIPE-6), so ROCK_REF = 1.0; set a real rock_ref when a measured rock layer replaces the proxy.
pub const ROCK_REF: f64 = 1.0;
/// Max |sub-solar lat| in the shipped 2026-2030 ephem table (1.588, rounded up) plus the largest
/// solar disk radius asin(695700 / 1.467e8 km) = 0.272, deg (PSR rule from #21).
// shortcut: constant from the shipped table, not read from it; recompute if the ephem range changes.
pub const PSR_SUN_MAX_DEG: f64 = 1.59 + 0.272;
/// Values per cell in a `grid_fracs` array: sun_frac, earth_frac, cold_frac, longest_dark_h.
pub const FRACS_PER_CELL: usize = 4;

/// Per-cell factor layers in physical units, row-major, all the same length. NaN = no data.
pub struct Layers<'a> {
    pub sun_frac: &'a [f32],
    pub earth_frac: &'a [f32],
    pub slope_deg: &'a [f32],
    pub crater_depth_m: &'a [f32],
    pub rock: &'a [f32],
    /// h_below_survival / hours (ENG-5).
    pub cold_frac: &'a [f32],
}

fn check(layers: &Layers, slope_limit_deg: f64) -> Result<(), &'static str> {
    let n = layers.slope_deg.len();
    let all = [
        layers.sun_frac,
        layers.earth_frac,
        layers.slope_deg,
        layers.crater_depth_m,
        layers.rock,
        layers.cold_frac,
    ];
    if all.iter().any(|l| l.len() != n) {
        return Err("factor layers differ in length");
    }
    if !(slope_limit_deg.is_finite() && slope_limit_deg > 0.0) {
        return Err("slope_limit_deg must be finite and > 0");
    }
    Ok(())
}

/// Normalised factors of cell `c` in [0, 1], higher = better, in `Weights` field order
/// (sun, earth, slope, crater, rock, thermal); NaN where a layer has no data. The slope factor
/// clamps to 0 past the limit; exclusion is `score_cells`' job. The one source for scores and
/// window factor means, so the two cannot drift.
pub fn cell_factors(layers: &Layers, c: usize, slope_limit_deg: f64) -> [f64; 6] {
    let unit = |x: f64| x.clamp(0.0, 1.0);
    [
        unit(layers.sun_frac[c] as f64),
        unit(layers.earth_frac[c] as f64),
        unit(1.0 - layers.slope_deg[c] as f64 / slope_limit_deg),
        1.0 - unit(layers.crater_depth_m[c] as f64 / DEPTH_REF_M),
        1.0 - unit(layers.rock[c] as f64 / ROCK_REF),
        1.0 - unit(layers.cold_frac[c] as f64),
    ]
}

/// score = Σ wᵢ·fᵢ / Σ wᵢ in [0, 1]; NaN where the cell is excluded (slope over the limit or not finite,
/// or a factor with weight > 0 has no data).
pub fn score_cells(
    layers: &Layers,
    weights: &Weights,
    slope_limit_deg: f64,
) -> Result<Vec<f32>, &'static str> {
    check(layers, slope_limit_deg)?;
    let w = [
        weights.sun,
        weights.earth,
        weights.slope,
        weights.crater,
        weights.rock,
        weights.thermal,
    ];
    if w.iter().any(|x| !x.is_finite() || *x < 0.0) {
        return Err("weights must be finite and >= 0");
    }
    let w_sum: f64 = w.iter().sum();
    if w_sum <= 0.0 {
        return Err("at least one weight must be > 0");
    }
    Ok((0..layers.slope_deg.len())
        .map(|c| {
            let slope = layers.slope_deg[c] as f64;
            if slope.is_nan() || slope > slope_limit_deg {
                return f32::NAN; // over the limit, or NaN slope
            }
            let mut acc = 0.0f64; // f64, fixed factor order: determinism
            for (wi, fi) in w.iter().zip(cell_factors(layers, c, slope_limit_deg)) {
                if *wi > 0.0 {
                    if fi.is_nan() {
                        return f32::NAN; // weighted factor has no data
                    }
                    acc += wi * fi;
                }
            }
            (acc / w_sum) as f32
        })
        .collect())
}

fn n_cells(h: &GridHeader) -> usize {
    h.nx as usize * h.ny as usize
}

/// Decoded layer, or all-NaN when the grid does not have it (optional factor layers).
fn layer_or_nan(h: &GridHeader, bin: &[u8], layer: GridLayer) -> Result<Vec<f32>, String> {
    if h.layer_info.contains_key(&layer) {
        decode_layer(h, bin, layer)
    } else {
        Ok(vec![f32::NAN; n_cells(h)])
    }
}

/// The mask layer as (values n * bins, bins). Err when the grid has none: a flat-horizon fallback
/// would show fake sunlight at the pole.
fn mask_layer(h: &GridHeader, bin: &[u8]) -> Result<(Vec<f32>, usize), String> {
    let info = h
        .layer_info
        .get(&GridLayer::Mask)
        .ok_or("grid has no mask layer; run the PIPE-8 masks stage")?;
    Ok((
        decode_layer(h, bin, GridLayer::Mask)?,
        info.components as usize,
    ))
}

/// Per-cell time simulation over [t_start_h, t_start_h + hours), FRACS_PER_CELL values per cell:
/// sun_frac = pct_lit / 100, earth_frac = pct_earth_visible / 100, cold_frac = h_below_survival / hours,
/// longest_dark_h. Same inner function as site cards (`metrics::window`) on the cell's 64-bin mask;
/// body vectors are computed once per step, cells run in index order. NaN for cells whose mask,
/// elevation or slope has no data. Weight-free, so slider moves only re-run `scores_from_fracs`.
pub fn grid_fracs(
    h: &GridHeader,
    bin: &[u8],
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    params: &Params,
) -> Result<Vec<f32>, String> {
    let (mask, bins) = mask_layer(h, bin)?;
    let slope = decode_layer(h, bin, GridLayer::SlopeDeg)?;
    let elev = decode_layer(h, bin, GridLayer::ElevM)?;
    let aspect = layer_or_nan(h, bin, GridLayer::AspectDeg)?;
    let b = metrics::bodies(ephem, t_start_h, hours, params.step_hours)?;
    let mut out = Vec::with_capacity(n_cells(h) * FRACS_PER_CELL);
    for i in 0..n_cells(h) {
        let m = &mask[i * bins..(i + 1) * bins];
        let (e, s) = (elev[i] as f64, slope[i] as f64);
        if !(e.is_finite() && (0.0..=90.0).contains(&s) && m.iter().all(|x| x.is_finite())) {
            out.extend([f32::NAN; FRACS_PER_CELL]);
            continue;
        }
        let (x, y) = cell_xy(h, i);
        let (lat_deg, lon_deg) = to_latlon(x, y);
        let a = aspect[i] as f64;
        let geom = SiteGeom {
            lat_deg,
            lon_deg,
            elev_m: e,
            slope_deg: s,
            aspect_deg: a.is_finite().then_some(a),
        };
        let (mt, _) = metrics::window(&geom, m, &b, params)?;
        out.extend(
            [
                mt.pct_lit / 100.0,
                mt.pct_earth_visible / 100.0,
                mt.h_below_survival / hours,
                mt.longest_dark_h,
            ]
            .map(|v| v as f32),
        );
    }
    Ok(out)
}

/// All factor layers of a grid: terrain from the .bin, sun/earth/thermal from a `grid_fracs` array.
pub struct FactorGrid {
    pub sun_frac: Vec<f32>,
    pub earth_frac: Vec<f32>,
    pub cold_frac: Vec<f32>,
    pub longest_dark_h: Vec<f32>,
    pub slope_deg: Vec<f32>,
    pub crater_depth_m: Vec<f32>,
    pub rock: Vec<f32>,
}

impl FactorGrid {
    pub fn new(h: &GridHeader, bin: &[u8], fracs: &[f32]) -> Result<Self, String> {
        let n = n_cells(h);
        if fracs.len() != n * FRACS_PER_CELL {
            return Err(format!(
                "fracs has {} values, want nx * ny * {FRACS_PER_CELL} = {}",
                fracs.len(),
                n * FRACS_PER_CELL
            ));
        }
        let col = |j: usize| {
            fracs
                .iter()
                .skip(j)
                .step_by(FRACS_PER_CELL)
                .copied()
                .collect()
        };
        Ok(Self {
            sun_frac: col(0),
            earth_frac: col(1),
            cold_frac: col(2),
            longest_dark_h: col(3),
            slope_deg: decode_layer(h, bin, GridLayer::SlopeDeg)?,
            crater_depth_m: layer_or_nan(h, bin, GridLayer::CraterDepthM)?,
            rock: layer_or_nan(h, bin, GridLayer::Rock)?,
        })
    }

    pub fn layers(&self) -> Layers<'_> {
        Layers {
            sun_frac: &self.sun_frac,
            earth_frac: &self.earth_frac,
            slope_deg: &self.slope_deg,
            crater_depth_m: &self.crater_depth_m,
            rock: &self.rock,
            cold_frac: &self.cold_frac,
        }
    }

    /// `score_cells`, then the night-survival gate: NaN where longest_dark_h > battery_h
    /// (battery_h 0 = gate off). The dark run is clipped at the window edges (metrics::window).
    pub fn scores(&self, weights: &Weights, params: &Params) -> Result<Vec<f32>, String> {
        let bat = params.battery_h;
        if !(bat.is_finite() && bat >= 0.0) {
            return Err("battery_h must be finite and >= 0".into());
        }
        let mut s = score_cells(&self.layers(), weights, params.slope_limit_deg)?;
        if bat > 0.0 {
            for (v, d) in s.iter_mut().zip(&self.longest_dark_h) {
                if *d as f64 > bat {
                    *v = f32::NAN;
                }
            }
        }
        Ok(s)
    }
}

/// Cheap re-score for a weight or limit change: no time simulation.
pub fn scores_from_fracs(
    h: &GridHeader,
    bin: &[u8],
    fracs: &[f32],
    weights: &Weights,
    params: &Params,
) -> Result<Vec<f32>, String> {
    FactorGrid::new(h, bin, fracs)?.scores(weights, params)
}

/// 1 where the cell is permanently shadowed: its mask is above 90 - |lat| + PSR_SUN_MAX_DEG in
/// every azimuth bin, so no Sun position in any season clears it. Time-independent.
pub fn psr_flags(h: &GridHeader, bin: &[u8]) -> Result<Vec<u8>, String> {
    let (mask, bins) = mask_layer(h, bin)?;
    Ok((0..n_cells(h))
        .map(|i| {
            let (x, y) = cell_xy(h, i);
            let sun_max = 90.0 - to_latlon(x, y).0.abs() + PSR_SUN_MAX_DEG;
            mask[i * bins..(i + 1) * bins]
                .iter()
                .all(|&m| m as f64 > sun_max) as u8
        })
        .collect())
}

#[cfg(test)]
mod tests {
    use super::*;

    const W: Weights = Weights {
        sun: 0.35,
        earth: 0.25,
        slope: 0.2,
        crater: 0.1,
        rock: 0.0,
        thermal: 0.1,
    };

    fn score(sun: f32, slope: f32, rock: f32, w: &Weights) -> Result<Vec<f32>, &'static str> {
        let l = Layers {
            sun_frac: &[sun],
            earth_frac: &[0.5],
            slope_deg: &[slope],
            crater_depth_m: &[25.0],
            rock: &[rock],
            cold_frac: &[0.2],
        };
        score_cells(&l, w, 10.0)
    }

    #[test]
    fn hand_computed_cell() {
        // sun 1, earth 0.5, slope 5/10 → 0.5, crater 25/50 → 0.5, thermal 1 − 0.2 = 0.8; Σw = 1
        let want = 0.35 * 1.0 + 0.25 * 0.5 + 0.2 * 0.5 + 0.1 * 0.5 + 0.1 * 0.8;
        assert!((score(1.0, 5.0, f32::NAN, &W).unwrap()[0] as f64 - want).abs() < 1e-6);
    }

    #[test]
    fn slope_is_a_hard_limit() {
        assert!(score(1.0, 10.0, 0.0, &W).unwrap()[0].is_finite()); // at the limit: allowed
        assert!(score(1.0, 10.1, 0.0, &W).unwrap()[0].is_nan());
        assert!(score(1.0, f32::NAN, 0.0, &W).unwrap()[0].is_nan());
    }

    #[test]
    fn nan_layer_excludes_only_when_weighted() {
        assert!(score(1.0, 5.0, f32::NAN, &W).unwrap()[0].is_finite()); // rock weight 0: "no data" ignored
        let rocky = Weights { rock: 0.1, ..W };
        assert!(score(1.0, 5.0, f32::NAN, &rocky).unwrap()[0].is_nan());
    }

    #[test]
    fn scaling_weights_keeps_scores() {
        let doubled = Weights {
            sun: 0.7,
            earth: 0.5,
            slope: 0.4,
            crater: 0.2,
            rock: 0.0,
            thermal: 0.2,
        };
        assert_eq!(score(0.7, 3.0, 0.0, &W), score(0.7, 3.0, 0.0, &doubled));
    }

    #[test]
    fn bad_inputs_are_errors() {
        let zero = Weights {
            sun: 0.0,
            earth: 0.0,
            slope: 0.0,
            crater: 0.0,
            rock: 0.0,
            thermal: 0.0,
        };
        assert!(score(1.0, 5.0, 0.0, &zero).is_err());
        assert!(score(1.0, 5.0, 0.0, &Weights { sun: -1.0, ..W }).is_err());
        let l = Layers {
            sun_frac: &[1.0, 1.0],
            earth_frac: &[0.5],
            slope_deg: &[5.0],
            crater_depth_m: &[0.0],
            rock: &[0.0],
            cold_frac: &[0.0],
        };
        assert!(score_cells(&l, &W, 10.0).is_err());
    }

    #[test]
    fn deterministic() {
        assert_eq!(
            score(0.3, 7.0, 0.0, &W).unwrap()[0].to_bits(),
            score(0.3, 7.0, 0.0, &W).unwrap()[0].to_bits()
        );
    }

    use crate::contracts::{Dtype, GridLayerInfo};
    use crate::grid::write_layer;

    fn info(dtype: Dtype, scale: f64, components: u32) -> GridLayerInfo {
        GridLayerInfo {
            dtype,
            scale,
            offset: 0.0,
            units: String::new(),
            components,
            nodata: None,
            byte_offset: 0,
            byte_length: 0,
            proxy: false,
            note: None,
        }
    }

    /// nx x 1 grid of 10 m cells starting at stereo y = 3032 m (lat about -89.9), slope 2 deg,
    /// elev 0, 64-bin mask `mask(i)` deg per cell (no mask layer when None).
    fn synth(nx: u32, mask: Option<&dyn Fn(usize, usize) -> f32>) -> (GridHeader, Vec<u8>) {
        let mut h: GridHeader = serde_json::from_value(serde_json::json!({
            "schema_version": 1, "generated_at": "", "source_urls": [], "region": "t",
            "crs": "polar-stereo-south", "crs_params": {"lat_0": -90.0, "lon_0": 0.0, "radius_m": 1737400.0},
            "x0": 0.0, "y0": 3032.0, "cell_m": 10.0, "nx": nx, "ny": 1, "bins": 64,
            "layers": [], "layer_info": {}
        }))
        .unwrap();
        let mut bin = Vec::new();
        let f32s = |v: f32| (0..nx).flat_map(|_| v.to_le_bytes()).collect::<Vec<u8>>();
        write_layer(
            &mut h,
            &mut bin,
            GridLayer::SlopeDeg,
            info(Dtype::Float32, 1.0, 1),
            &f32s(2.0),
        )
        .unwrap();
        write_layer(
            &mut h,
            &mut bin,
            GridLayer::ElevM,
            info(Dtype::Float32, 1.0, 1),
            &f32s(0.0),
        )
        .unwrap();
        if let Some(m) = mask {
            let data: Vec<u8> = (0..nx as usize * 64)
                .flat_map(|k| ((m(k / 64, k % 64) * 100.0).round() as i16).to_le_bytes())
                .collect();
            write_layer(
                &mut h,
                &mut bin,
                GridLayer::Mask,
                info(Dtype::Int16, 0.01, 64),
                &data,
            )
            .unwrap();
        }
        (h, bin)
    }

    #[test]
    fn psr_needs_every_bin_above_the_highest_sun() {
        // lat -89.9: highest Sun 0.1 + 1.81 = 1.91 deg.
        let (h, bin) = synth(
            4,
            Some(&|i, b| match (i, b) {
                (0, _) => 3.0,
                (1, 17) => 1.0, // one low bin lets the Sun in
                (1, _) => 3.0,
                _ => 0.0,
            }),
        );
        assert_eq!(psr_flags(&h, &bin).unwrap(), vec![1, 0, 0, 0]);
        let (h, bin) = synth(2, None);
        assert!(psr_flags(&h, &bin).unwrap_err().contains("no mask layer"));
    }

    fn params() -> Params {
        Params {
            battery_h: 0.0,
            survival_temp_k: 233.0,
            antenna_margin_deg: 2.0,
            slope_limit_deg: 10.0,
            step_hours: 1.0,
        }
    }

    /// 30 hourly rows, Sun circling at sub-lat -1 (el about 1 deg at -89.9), Earth at lat 0.
    fn ephem() -> Vec<f32> {
        (0..30)
            .flat_map(|k| [-1.0, (k * 12) as f32, 1.496e8, 0.0, 0.0, 384_400.0])
            .collect()
    }

    #[test]
    fn grid_fracs_follow_the_mask_and_scores_follow_the_fracs() {
        // Cell 0: flat horizon; cell 1: 5 deg wall all round (never lit); cell 2: wall to the south only.
        let (h, bin) = synth(
            3,
            Some(&|i, b| match i {
                0 => 0.0,
                1 => 5.0,
                _ => {
                    if (24..40).contains(&b) {
                        5.0
                    } else {
                        0.0
                    }
                }
            }),
        );
        let fr = grid_fracs(&h, &bin, &ephem(), 0.0, 24.0, &params()).unwrap();
        assert_eq!(fr.len(), 3 * FRACS_PER_CELL);
        assert_eq!((fr[0], fr[3]), (1.0, 0.0)); // always lit, no dark run
        assert_eq!((fr[4], fr[7]), (0.0, 24.0)); // never lit, dark all window
        assert!(fr[8] > 0.0 && fr[8] < 1.0, "partial wall: {}", fr[8]);
        assert_eq!(
            fr,
            grid_fracs(&h, &bin, &ephem(), 0.0, 24.0, &params()).unwrap()
        ); // bit-identical rerun
        let w = Weights {
            rock: 0.0,
            crater: 0.0,
            ..W
        };
        let s = scores_from_fracs(&h, &bin, &fr, &w, &params()).unwrap();
        assert!(s[0] > s[2] && s[2] > s[1], "{s:?}");
        // Battery gate: 12 h excludes the cells with a longer dark run; 0 turns it off.
        let gated = scores_from_fracs(
            &h,
            &bin,
            &fr,
            &w,
            &Params {
                battery_h: 12.0,
                ..params()
            },
        )
        .unwrap();
        assert!(gated[0].is_finite() && gated[1].is_nan());
        assert_eq!(gated[2].is_nan(), fr[11] > 12.0);
        assert!(scores_from_fracs(&h, &bin, &fr[1..], &w, &params()).is_err());
        let (h, bin) = synth(3, None);
        assert!(grid_fracs(&h, &bin, &ephem(), 0.0, 24.0, &params()).is_err());
    }
}
