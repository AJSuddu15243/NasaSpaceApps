//! ENG-6: weighted cell score from per-cell factor layers. Design and decisions: .agent/GREEDY.md steps 1–2.

use crate::Weights;

/// Crater depth at which the crater factor reaches 0 (decided, GREEDY.md decision 3).
pub const DEPTH_REF_M: f64 = 50.0;
// shortcut: rock layer is treated as a 0–1 fraction, set the real rock_ref once PIPE-6 picks a source.
pub const ROCK_REF: f64 = 1.0;

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

/// score = Σ wᵢ·fᵢ / Σ wᵢ in [0, 1]; NaN where the cell is excluded (slope over the limit or not finite,
/// or a factor with weight > 0 has no data).
pub fn score_cells(
    layers: &Layers,
    weights: &Weights,
    slope_limit_deg: f64,
) -> Result<Vec<f32>, &'static str> {
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
    if !(slope_limit_deg.is_finite() && slope_limit_deg > 0.0) {
        return Err("slope_limit_deg must be finite and > 0");
    }

    let unit = |x: f64| x.clamp(0.0, 1.0);
    Ok((0..n)
        .map(|c| {
            let slope = layers.slope_deg[c] as f64;
            if slope.is_nan() || slope > slope_limit_deg {
                return f32::NAN; // over the limit, or NaN slope
            }
            let f = [
                unit(layers.sun_frac[c] as f64),
                unit(layers.earth_frac[c] as f64),
                unit(1.0 - slope / slope_limit_deg),
                1.0 - unit(layers.crater_depth_m[c] as f64 / DEPTH_REF_M),
                1.0 - unit(layers.rock[c] as f64 / ROCK_REF),
                1.0 - unit(layers.cold_frac[c] as f64),
            ];
            let mut acc = 0.0f64; // f64, fixed factor order: determinism
            for (wi, fi) in w.iter().zip(f) {
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
}
