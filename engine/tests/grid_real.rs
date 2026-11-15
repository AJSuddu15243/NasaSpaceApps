//! ENG-6/7 on the 3 shipped real grids (64-bin mask layer) over the real Horizons ephem.
//! `real_grids_smoke` runs by default on a 24 h window; `real_grids_report` (cargo test --release
//! --test grid_real -- --ignored --nocapture) prints valid-cell %, PSR %, the battery-gate effect,
//! top-3 areas for the default weights and timing over 14 days.

use lunar_engine::{
    GridHeader, Params, Weights, grid_fracs, psr_flags, scores_from_fracs, top_areas, window_cells,
};
use std::path::PathBuf;
use std::time::Instant;

const REGIONS: [&str; 3] = ["haworth", "connecting-ridge", "malapert-massif"];
/// Power-first defaults (GREEDY decision 4).
const W: Weights = Weights {
    sun: 0.35,
    earth: 0.25,
    slope: 0.2,
    crater: 0.1,
    rock: 0.0,
    thermal: 0.1,
};

fn data() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../web/public/data")
}

fn ephem() -> Vec<f32> {
    let b = std::fs::read(data().join("ephem.bin")).unwrap();
    b.as_chunks::<4>()
        .0
        .iter()
        .map(|x| f32::from_le_bytes(*x))
        .collect()
}

fn grid(region: &str) -> (GridHeader, Vec<u8>) {
    let h =
        serde_json::from_slice(&std::fs::read(data().join(format!("grid/{region}.json"))).unwrap())
            .unwrap();
    (
        h,
        std::fs::read(data().join(format!("grid/{region}.bin"))).unwrap(),
    )
}

fn params(battery_h: f64) -> Params {
    Params {
        battery_h,
        survival_temp_k: 233.0,
        antenna_margin_deg: 2.0,
        slope_limit_deg: 10.0,
        step_hours: 1.0,
    }
}

fn pct(n: usize, of: usize) -> f64 {
    100.0 * n as f64 / of as f64
}

#[test]
fn real_grids_smoke() {
    let e = ephem();
    for r in REGIONS {
        let (h, bin) = grid(r);
        let n = (h.nx * h.ny) as usize;
        let fr = grid_fracs(&h, &bin, &e, 36.0, 24.0, &params(0.0)).unwrap();
        assert!(
            fr.iter().all(|x| x.is_finite()),
            "{r}: every real cell has a mask"
        );
        let s = scores_from_fracs(&h, &bin, &fr, &W, &params(0.0)).unwrap();
        let bits = |v: &[f32]| v.iter().map(|x| x.to_bits()).collect::<Vec<_>>();
        let again = scores_from_fracs(&h, &bin, &fr, &W, &params(0.0)).unwrap();
        assert_eq!(bits(&s), bits(&again), "{r}: bit-identical rerun");
        let a = top_areas(&s, &h, window_cells(400.0, h.cell_m).unwrap(), 2000.0, 3).unwrap();
        assert!(!a.is_empty(), "{r}: some landable area");
        assert!(
            a.iter()
                .all(|x| x.lat < -84.0 && (0.0..=1.0).contains(&x.score))
        );
        assert!(
            psr_flags(&h, &bin)
                .unwrap()
                .iter()
                .filter(|&&f| f == 1)
                .count()
                < n
        );
    }
}

#[test]
#[ignore]
fn real_grids_report() {
    let e = ephem();
    let (t0, hours) = (36.0, 336.0); // 2026-01-02T12Z + 14 days, the golden window
    for r in REGIONS {
        let (h, bin) = grid(r);
        let n = (h.nx * h.ny) as usize;
        let t = Instant::now();
        let fr = grid_fracs(&h, &bin, &e, t0, hours, &params(48.0)).unwrap();
        let sim_ms = t.elapsed().as_secs_f64() * 1e3;
        let t = Instant::now();
        let s_off = scores_from_fracs(&h, &bin, &fr, &W, &params(0.0)).unwrap();
        let score_ms = t.elapsed().as_secs_f64() * 1e3;
        let s48 = scores_from_fracs(&h, &bin, &fr, &W, &params(48.0)).unwrap();
        let s24 = scores_from_fracs(&h, &bin, &fr, &W, &params(24.0)).unwrap();
        let valid = |s: &[f32]| s.iter().filter(|x| x.is_finite()).count();
        let psr = psr_flags(&h, &bin)
            .unwrap()
            .iter()
            .filter(|&&f| f == 1)
            .count();
        let dark: Vec<f32> = fr.iter().skip(3).step_by(4).copied().collect();
        let k = window_cells(400.0, h.cell_m).unwrap();
        let t = Instant::now();
        let top = top_areas(&s_off, &h, k, 2000.0, 3).unwrap();
        let top_ms = t.elapsed().as_secs_f64() * 1e3;
        let top48 = top_areas(&s48, &h, k, 2000.0, 3).unwrap();
        println!(
            "{r}: valid {:.1}% (gate off), {:.1}% (battery 48 h), {:.1}% (24 h); PSR {:.1}%; \
             cells with dark > 48 h {:.1}%; sim {sim_ms:.0} ms, score {score_ms:.1} ms, top {top_ms:.1} ms",
            pct(valid(&s_off), n),
            pct(valid(&s48), n),
            pct(valid(&s24), n),
            pct(psr, n),
            pct(dark.iter().filter(|&&d| d > 48.0).count(), n),
        );
        for (label, list) in [("gate off", &top), ("battery 48", &top48)] {
            for (i, a) in list.iter().enumerate() {
                println!(
                    "  {label} #{}: lat {:.4} lon {:.4} score {:.3} (x {:.0}, y {:.0})",
                    i + 1,
                    a.lat,
                    a.lon,
                    a.score,
                    a.x_m,
                    a.y_m
                );
            }
        }
    }
}
