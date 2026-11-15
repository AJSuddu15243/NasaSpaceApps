//! ENG-7: base-footprint window means, greedy top-N landing areas and "nearby better spot".
//! Design: .agent/GREEDY.md steps 3–5. Distances are Euclidean in projected stereographic metres.

use serde::{Deserialize, Serialize};

use crate::contracts::{Area, GridHeader};
use crate::geometry::to_latlon;
use crate::grid::cell_xy;
use crate::score::{Layers, cell_factors};

/// Window side in cells: the smallest odd k >= base_m / cell_m, so the window covers the base and has
/// a centre cell (400 m: k = 3 at 160 m cells, 5 at 80 m).
pub fn window_cells(base_m: f64, cell_m: f64) -> Result<usize, &'static str> {
    if !(base_m.is_finite() && base_m > 0.0 && cell_m.is_finite() && cell_m > 0.0) {
        return Err("base_m and cell_m must be finite and > 0");
    }
    let k = (base_m / cell_m * (1.0 - 1e-12)).ceil().max(1.0) as usize; // 1e-12: 480 / 160 stays 3
    Ok(k | 1)
}

fn dims(h: &GridHeader) -> (usize, usize) {
    (h.nx as usize, h.ny as usize)
}

/// Mean of `values` over the k x k window centred on each cell, NaN unless the window lies fully inside
/// the grid and every cell in it is finite. Two summed-area tables (f64 sums, invalid counts) built in
/// row-major order, so the cost is O(cells) for any k.
pub fn window_means(values: &[f32], nx: usize, ny: usize, k: usize) -> Vec<f64> {
    let w = nx + 1;
    let (mut sum, mut bad) = (vec![0.0f64; w * (ny + 1)], vec![0u32; w * (ny + 1)]);
    for r in 0..ny {
        for c in 0..nx {
            let v = values[r * nx + c];
            let (s, b) = if v.is_finite() {
                (v as f64, 0)
            } else {
                (0.0, 1)
            };
            let i = (r + 1) * w + c + 1;
            sum[i] = s + sum[i - 1] + sum[i - w] - sum[i - w - 1];
            bad[i] = b + bad[i - 1] + bad[i - w] - bad[i - w - 1];
        }
    }
    let mut out = vec![f64::NAN; nx * ny];
    let half = k / 2;
    if k > nx || k > ny {
        return out;
    }
    for r in half..ny - half {
        for c in half..nx - half {
            let (top, bot, lft, rgt) = ((r - half) * w, (r + half + 1) * w, c - half, c + half + 1);
            if bad[bot + rgt] + bad[top + lft] - bad[top + rgt] - bad[bot + lft] == 0 {
                let s = sum[bot + rgt] - sum[top + rgt] - sum[bot + lft] + sum[top + lft];
                out[r * nx + c] = s / (k * k) as f64;
            }
        }
    }
    out
}

fn check(scores: &[f32], h: &GridHeader, k: usize) -> Result<(), &'static str> {
    let (nx, ny) = dims(h);
    if scores.len() != nx * ny {
        return Err("scores length != nx * ny");
    }
    if k == 0 || k.is_multiple_of(2) {
        return Err("window_cells must be odd and >= 1 (see window_cells())");
    }
    Ok(())
}

fn dist(a: (f64, f64), b: (f64, f64)) -> f64 {
    (a.0 - b.0).hypot(a.1 - b.1)
}

/// Valid window centres sorted best first: window mean desc (total_cmp), then cell index asc.
fn ranked(means: &[f64]) -> Vec<usize> {
    let mut c: Vec<usize> = (0..means.len()).filter(|&i| means[i].is_finite()).collect();
    c.sort_by(|&a, &b| means[b].total_cmp(&means[a]).then(a.cmp(&b)));
    c
}

/// Greedy top-n areas: the best valid window, then the best one at least `exclusion_m` from every
/// earlier pick, and so on. Empty when no window is valid ("no landable area").
pub fn top_areas(
    scores: &[f32],
    h: &GridHeader,
    window_cells: usize,
    exclusion_m: f64,
    n: usize,
) -> Result<Vec<Area>, &'static str> {
    check(scores, h, window_cells)?;
    if !(exclusion_m.is_finite() && exclusion_m > 0.0) || n == 0 {
        return Err("exclusion_m must be finite and > 0, n >= 1");
    }
    let (nx, ny) = dims(h);
    let means = window_means(scores, nx, ny, window_cells);
    // No with_capacity(n): wasm-bindgen maps a JS n = -1 to u32::MAX, which would trap on allocation.
    let mut picked: Vec<Area> = Vec::new();
    for i in ranked(&means) {
        let p = cell_xy(h, i);
        if picked
            .iter()
            .all(|a| dist(p, (a.x_m, a.y_m)) >= exclusion_m)
        {
            let (lat, lon) = to_latlon(p.0, p.1);
            picked.push(Area {
                x_m: p.0,
                y_m: p.1,
                lat,
                lon,
                score: means[i],
                radius_m: exclusion_m,
            });
            if picked.len() == n {
                break;
            }
        }
    }
    Ok(picked)
}

/// Window means of the normalised factors (score.rs `cell_factors`), in [0, 1], higher = better.
/// NaN (JSON null) when the window leaves the grid or a factor has no data in it.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Factors {
    pub sun: f64,
    pub earth: f64,
    pub slope: f64,
    pub crater: f64,
    pub rock: f64,
    pub thermal: f64,
}

impl Factors {
    fn from_array(f: [f64; 6]) -> Self {
        let [sun, earth, slope, crater, rock, thermal] = f;
        Self {
            sun,
            earth,
            slope,
            crater,
            rock,
            thermal,
        }
    }

    fn array(&self) -> [f64; 6] {
        [
            self.sun,
            self.earth,
            self.slope,
            self.crater,
            self.rock,
            self.thermal,
        ]
    }
}

/// Index of the cell containing stereo (x, y); Err outside the grid.
pub fn cell_at(h: &GridHeader, x_m: f64, y_m: f64) -> Result<usize, &'static str> {
    let col = ((x_m - h.x0) / h.cell_m).round();
    let row = ((y_m - h.y0) / h.cell_m).round();
    if !(col >= 0.0 && row >= 0.0 && col < h.nx as f64 && row < h.ny as f64) {
        return Err("point is outside the grid");
    }
    Ok(row as usize * h.nx as usize + col as usize)
}

/// Factor means over the k x k window centred on cell `centre` (f64 sums, row-major order).
pub fn window_factors(
    layers: &Layers,
    h: &GridHeader,
    k: usize,
    centre: usize,
    slope_limit_deg: f64,
) -> Factors {
    let (nx, ny) = dims(h);
    let (r, c, half) = (
        (centre / nx) as isize,
        (centre % nx) as isize,
        (k / 2) as isize,
    );
    if r < half || c < half || r + half >= ny as isize || c + half >= nx as isize {
        return Factors::from_array([f64::NAN; 6]);
    }
    let mut acc = [0.0f64; 6];
    for rr in r - half..=r + half {
        for cc in c - half..=c + half {
            let f = cell_factors(layers, rr as usize * nx + cc as usize, slope_limit_deg);
            for (a, x) in acc.iter_mut().zip(f) {
                *a += x;
            }
        }
    }
    Factors::from_array(acc.map(|a| a / (k * k) as f64))
}

/// Best window near a site, and how it differs from the site's own window.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Nearby {
    pub x_m: f64,
    pub y_m: f64,
    pub lat: f64,
    pub lon: f64,
    /// From the centre of the site's cell.
    pub dist_m: f64,
    pub score: f64,
    /// The site window's score; NaN (JSON null) when that window is invalid.
    pub site_score: f64,
    pub site_valid: bool,
    /// Best minus site, per normalised factor (e.g. sun 0.18 = +18 points of sunlit time).
    pub delta: Factors,
}

/// Best valid window whose centre is within `radius_m` of the site's cell centre (ties: nearer, then
/// lower index), compared with the site's own window on the same 64-bin grid data. `scores` are the
/// gated grid scores; `layers` the factor layers they came from. None when no window qualifies.
#[allow(clippy::too_many_arguments)]
pub fn nearby_better(
    scores: &[f32],
    layers: &Layers,
    h: &GridHeader,
    k: usize,
    site_x_m: f64,
    site_y_m: f64,
    radius_m: f64,
    slope_limit_deg: f64,
) -> Result<Option<Nearby>, &'static str> {
    check(scores, h, k)?;
    if !(radius_m.is_finite() && radius_m >= 0.0) {
        return Err("radius_m must be finite and >= 0");
    }
    let site = cell_at(h, site_x_m, site_y_m)?;
    let sp = cell_xy(h, site);
    let (nx, ny) = dims(h);
    let means = window_means(scores, nx, ny, k);
    let best = (0..means.len())
        .filter(|&i| means[i].is_finite())
        .map(|i| (i, dist(cell_xy(h, i), sp)))
        .filter(|&(_, d)| d <= radius_m)
        .min_by(|a, b| {
            means[b.0]
                .total_cmp(&means[a.0])
                .then(a.1.total_cmp(&b.1))
                .then(a.0.cmp(&b.0))
        });
    let Some((i, d)) = best else { return Ok(None) };
    let (bf, sf) = (
        window_factors(layers, h, k, i, slope_limit_deg).array(),
        window_factors(layers, h, k, site, slope_limit_deg).array(),
    );
    let p = cell_xy(h, i);
    let (lat, lon) = to_latlon(p.0, p.1);
    Ok(Some(Nearby {
        x_m: p.0,
        y_m: p.1,
        lat,
        lon,
        dist_m: d,
        score: means[i],
        site_score: means[site],
        site_valid: means[site].is_finite(),
        delta: Factors::from_array(std::array::from_fn(|j| bf[j] - sf[j])),
    }))
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Header for an nx x ny grid with 100 m cells starting 50 km from the pole.
    fn header(nx: u32, ny: u32) -> GridHeader {
        serde_json::from_value(serde_json::json!({
            "schema_version": 1, "generated_at": "", "source_urls": [], "region": "t",
            "crs": "polar-stereo-south", "crs_params": {"lat_0": -90.0, "lon_0": 0.0, "radius_m": 1737400.0},
            "x0": 0.0, "y0": 50000.0, "cell_m": 100.0, "nx": nx, "ny": ny, "bins": 64,
            "layers": [], "layer_info": {}
        }))
        .unwrap()
    }

    fn grid(nx: usize, ny: usize, f: impl Fn(usize, usize) -> f32) -> Vec<f32> {
        (0..nx * ny).map(|i| f(i / nx, i % nx)).collect()
    }

    fn centre(h: &GridHeader, a: &Area) -> usize {
        cell_at(h, a.x_m, a.y_m).unwrap()
    }

    #[test]
    fn window_cells_is_smallest_odd_cover() {
        assert_eq!(window_cells(400.0, 160.0), Ok(3));
        assert_eq!(window_cells(400.0, 80.0), Ok(5));
        assert_eq!(window_cells(400.0, 240.0), Ok(3));
        assert_eq!(window_cells(480.0, 160.0), Ok(3));
        assert_eq!(window_cells(50.0, 160.0), Ok(1));
        assert!(window_cells(0.0, 160.0).is_err());
    }

    #[test]
    fn summed_area_means_match_brute_force() {
        let (nx, ny, k) = (20, 17, 5);
        // Fixed pseudo-random values with a few NaN holes.
        let v = grid(nx, ny, |r, c| {
            let x = ((r * 31 + c * 17) % 23) as f32 / 23.0;
            if (r * nx + c) % 41 == 7 { f32::NAN } else { x }
        });
        let m = window_means(&v, nx, ny, k);
        for r in 0..ny {
            for c in 0..nx {
                let inside = r >= 2 && c >= 2 && r + 2 < ny && c + 2 < nx;
                let brute = inside.then(|| {
                    let cells: Vec<f32> = (r - 2..=r + 2)
                        .flat_map(|rr| (c - 2..=c + 2).map(move |cc| (rr, cc)))
                        .map(|(rr, cc)| v[rr * nx + cc])
                        .collect();
                    cells
                        .iter()
                        .all(|x| x.is_finite())
                        .then(|| cells.iter().map(|&x| x as f64).sum::<f64>() / 25.0)
                });
                match brute.flatten() {
                    Some(b) => assert!((m[r * nx + c] - b).abs() < 1e-12, "{r},{c}"),
                    None => assert!(m[r * nx + c].is_nan(), "{r},{c} should be invalid"),
                }
            }
        }
    }

    #[test]
    fn t1_single_bright_cell_ranks_first_and_hides_its_neighbours() {
        let h = header(30, 30);
        let s = grid(30, 30, |r, c| if (r, c) == (10, 10) { 1.0 } else { 0.5 });
        let a = top_areas(&s, &h, 1, 500.0, 5).unwrap();
        assert_eq!(centre(&h, &a[0]), 10 * 30 + 10);
        // k = 3: the 9 windows holding the bright cell tie; the lowest index, (9, 9), wins.
        assert_eq!(
            centre(&h, &top_areas(&s, &h, 3, 500.0, 1).unwrap()[0]),
            9 * 30 + 9
        );
        assert!(
            a[1..]
                .iter()
                .all(|x| dist((x.x_m, x.y_m), (a[0].x_m, a[0].y_m)) >= 500.0)
        );
        assert!(a.iter().all(|x| x.radius_m == 500.0));
    }

    #[test]
    fn t2_close_peaks_give_one_pick_and_the_far_peak_is_second() {
        let h = header(40, 20);
        let s = grid(40, 20, |r, c| match (r, c) {
            (10, 10) => 1.0,
            (10, 13) => 0.95, // 300 m away: inside the exclusion
            (10, 30) => 0.9,
            _ => 0.0,
        });
        let a = top_areas(&s, &h, 1, 1000.0, 3).unwrap();
        assert_eq!(
            (centre(&h, &a[0]), centre(&h, &a[1])),
            (10 * 40 + 10, 10 * 40 + 30)
        );
    }

    #[test]
    fn t3_an_invalid_cell_spoils_its_windows() {
        let h = header(9, 9);
        let s = grid(9, 9, |r, c| match (r, c) {
            (4, 4) => 1.0,
            (4, 5) => f32::NAN, // over-slope neighbour
            _ => 0.5,
        });
        let a = top_areas(&s, &h, 3, 100.0, 1).unwrap();
        let i = centre(&h, &a[0]);
        let (r, c) = (i / 9, i % 9);
        assert!(
            r.abs_diff(4) > 1 || c.abs_diff(5) > 1,
            "window at {r},{c} contains the NaN cell"
        );
        assert!(a[0].score > 0.5); // still touches the bright cell from the other side
    }

    #[test]
    fn t4_t8_flat_grid_picks_in_index_order_and_reruns_are_identical() {
        let h = header(10, 10);
        let s = vec![0.7f32; 100];
        let a = top_areas(&s, &h, 3, 250.0, 3).unwrap();
        let idx: Vec<usize> = a.iter().map(|x| centre(&h, x)).collect();
        assert_eq!(idx, vec![11, 14, 17]); // first valid centre (1,1), then 300 m steps along the row
        assert_eq!(a, top_areas(&s, &h, 3, 250.0, 3).unwrap());
    }

    #[test]
    fn empty_and_bad_inputs() {
        let h = header(5, 5);
        assert!(
            top_areas(&[f32::NAN; 25], &h, 3, 100.0, 3)
                .unwrap()
                .is_empty()
        );
        assert!(top_areas(&[0.5; 25], &h, 7, 100.0, 3).unwrap().is_empty()); // window bigger than the grid
        assert!(top_areas(&[0.5; 24], &h, 3, 100.0, 3).is_err());
        assert!(top_areas(&[0.5; 25], &h, 4, 100.0, 3).is_err());
        assert!(top_areas(&[0.5; 25], &h, 3, 0.0, 3).is_err());
        // Edge windows are invalid: only the 3 x 3 interior centres can be picked.
        let a = top_areas(&[0.5; 25], &h, 3, 1.0, 25).unwrap();
        assert_eq!(a.len(), 9);
        // JS n = -1 arrives as u32::MAX: no huge allocation, just every pickable area.
        assert_eq!(
            top_areas(&[0.5; 25], &h, 3, 1.0, u32::MAX as usize)
                .unwrap()
                .len(),
            9
        );
        let (lat, lon) = (a[0].lat, a[0].lon);
        assert!(lat < -88.0 && (-180.0..180.0).contains(&lon));
    }

    struct Owned {
        sun: Vec<f32>,
        flat: Vec<f32>,
        slope: Vec<f32>,
    }

    impl Owned {
        fn layers(&self) -> Layers<'_> {
            Layers {
                sun_frac: &self.sun,
                earth_frac: &self.flat,
                slope_deg: &self.slope,
                crater_depth_m: &self.flat,
                rock: &self.flat,
                cold_frac: &self.flat,
            }
        }
    }

    /// 7 x 7 at 100 m: sun_frac = col / 10, slope 2 deg except a steep cell at (3, 1).
    fn seven() -> (GridHeader, Owned, Vec<f32>) {
        let o = Owned {
            sun: grid(7, 7, |_, c| c as f32 / 10.0),
            flat: vec![0.0; 49],
            slope: grid(7, 7, |r, c| if (r, c) == (3, 1) { 20.0 } else { 2.0 }),
        };
        let w = crate::Weights {
            sun: 1.0,
            earth: 0.0,
            slope: 0.0,
            crater: 0.0,
            rock: 0.0,
            thermal: 0.0,
        };
        let s = crate::score::score_cells(&o.layers(), &w, 10.0).unwrap();
        (header(7, 7), o, s)
    }

    #[test]
    fn t7_radius_zero_returns_the_site_with_zero_deltas() {
        let (h, o, s) = seven();
        let (x, y) = cell_xy(&h, 3 * 7 + 4);
        let nb = nearby_better(&s, &o.layers(), &h, 3, x + 30.0, y - 40.0, 0.0, 10.0)
            .unwrap()
            .unwrap();
        assert_eq!((nb.x_m, nb.y_m, nb.dist_m), (x, y, 0.0));
        assert!(nb.site_valid && nb.score == nb.site_score);
        assert!(nb.delta.array().iter().all(|d| *d == 0.0), "{:?}", nb.delta);
    }

    #[test]
    fn nearby_better_hand_computed_delta_and_radius_edge() {
        let (h, o, s) = seven();
        let (x, y) = cell_xy(&h, 3 * 7 + 3); // site (3,3): window cols 2..4, clear of the steep cell
        let nb = nearby_better(&s, &o.layers(), &h, 3, x, y, 100.0, 10.0)
            .unwrap()
            .unwrap();
        // Best within 100 m is (3,4): window sun mean 0.4 vs the site's 0.3.
        assert_eq!((nb.x_m, nb.y_m), cell_xy(&h, 3 * 7 + 4));
        assert!(
            (nb.delta.sun - 0.1).abs() < 1e-7 && nb.delta.earth == 0.0,
            "{:?}",
            nb.delta
        );
        // (3,5) is better still but 200 m away: outside a 199 m radius, so it is not returned.
        let nb = nearby_better(&s, &o.layers(), &h, 3, x, y, 199.0, 10.0)
            .unwrap()
            .unwrap();
        assert_eq!((nb.x_m, nb.dist_m), (cell_xy(&h, 3 * 7 + 4).0, 100.0));
        assert!((nb.delta.sun - 0.1).abs() < 1e-7);
        let nb = nearby_better(&s, &o.layers(), &h, 3, x, y, 200.0, 10.0)
            .unwrap()
            .unwrap();
        assert_eq!(nb.dist_m, 200.0);
    }

    #[test]
    fn invalid_site_still_gets_a_neighbour() {
        let (h, o, s) = seven();
        let (x, y) = cell_xy(&h, 3 * 7 + 2); // window cols 1..3 holds the steep cell (3,1)
        let nb = nearby_better(&s, &o.layers(), &h, 3, x, y, 150.0, 10.0)
            .unwrap()
            .unwrap();
        assert!(!nb.site_valid && nb.site_score.is_nan() && nb.score.is_finite());
        assert!(nb.delta.slope.is_finite()); // factors are compared even where the score is excluded
        assert!(
            serde_json::to_string(&nb)
                .unwrap()
                .contains(r#""site_score":null"#)
        );
        assert!(nearby_better(&s, &o.layers(), &h, 3, -500.0, y, 150.0, 10.0).is_err()); // off the grid
        assert_eq!(
            nearby_better(&[f32::NAN; 49], &o.layers(), &h, 3, x, y, 150.0, 10.0),
            Ok(None)
        );
    }
}
