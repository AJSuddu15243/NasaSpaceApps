//! ENG-8 golden regression: site_metrics + site_track on 2 real masks (haworth, connecting-ridge)
//! over the real Horizons ephem table, hashed with the engine's FNV-1a 64.
//! shortcut: native goldens (std trig, no libm) are a regression check on this toolchain/machine only;
//! the cross-browser determinism hash comes from the WASM build. Upgrade by asserting the same
//! constants in a vitest against pkg/ once the facade (ENG-9) runs real WASM.
//! Re-baseline: a failure prints the new hash; paste it below and say why in the PR.

use lunar_engine::contracts::SiteMask;
use lunar_engine::hash::Fnv64;
use lunar_engine::{Params, SiteGeom, site_metrics, site_track};
use std::path::PathBuf;

const SITES: [&str; 2] = ["haworth", "connecting-ridge"];
/// 2026-01-02T12:00Z (hours since ephem t0 2026-01-01T00Z), 14 days: the 48 h PIPE fixture window and beyond.
const T_START_H: f64 = 36.0;
const HOURS: f64 = 336.0;
const GOLDEN: &str = "17b8254dc52b9c4d";

fn data() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../web/public/data")
}

fn ephem() -> Vec<f32> {
    let bytes = std::fs::read(data().join("ephem.bin")).unwrap();
    bytes
        .as_chunks::<4>()
        .0
        .iter()
        .map(|b| f32::from_le_bytes(*b))
        .collect()
}

fn params() -> Params {
    serde_json::from_str(
        r#"{"battery_h":48,"survival_temp_k":233,"antenna_margin_deg":2,"slope_limit_deg":10,"step_hours":1}"#,
    )
    .unwrap()
}

fn golden_hash(ephem: &[f32]) -> String {
    let mut h = Fnv64::tagged();
    for id in SITES {
        let m: SiteMask = serde_json::from_slice(
            &std::fs::read(data().join(format!("masks/{id}.json"))).unwrap(),
        )
        .unwrap();
        assert_eq!(m.mask_deg.len(), m.bins as usize, "{id}");
        let geom = SiteGeom {
            lat_deg: m.lat,
            lon_deg: m.lon,
            elev_m: m.elev_m,
            slope_deg: m.slope_deg,
            aspect_deg: m.aspect_deg,
        };
        let mask: Vec<f32> = m.mask_deg.iter().map(|&x| x as f32).collect();
        let metrics = site_metrics(&geom, &mask, ephem, T_START_H, HOURS, &params()).unwrap();
        assert!(
            metrics.pct_lit > 0.0 && metrics.pct_lit <= 100.0,
            "{id}: {metrics:?}"
        );
        h.write_metrics(&metrics);
        for x in site_track(&geom, &mask, ephem, T_START_H, HOURS, &params()).unwrap() {
            h.write_f32(x);
        }
    }
    h.finish_hex()
}

#[test]
fn golden_two_real_sites() {
    let (a, b) = (golden_hash(&ephem()), golden_hash(&ephem()));
    assert_eq!(a, b, "rerun must be identical");
    assert_eq!(a, GOLDEN, "golden changed: new hash {a}");
}

#[test]
fn one_ephem_byte_changes_the_hash() {
    let mut e = ephem();
    let base = golden_hash(&e);
    let k = (T_START_H as usize + 10) * 6 + 1; // sun_lon, 10 h into the window
    e[k] = f32::from_bits(e[k].to_bits() ^ 0x100); // flip one bit of the second mantissa byte
    assert_ne!(golden_hash(&e), base);
}
