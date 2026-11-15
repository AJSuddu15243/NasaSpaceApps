//! ENG-4: solar illumination and direct-to-Earth visibility over a time window, plus the ENG-5
//! thermal fields. One inner loop serves site cards (360-bin masks) and grid cells (64-bin masks).
//!
//! Time: `t_h` is hours since the ephem table's t0 (row k is at k hours, ephem schema step 1 h).
//! Window: samples at t_start + k * step for k in 0..N (end exclusive), each weighted `step` hours.
//! Lit: fraction of the Sun's disk (radius asin(R_sun / d)) above the mask line at the Sun's
//! azimuth, times the part of the disk not covered by the Earth (lunar eclipse).
//! Earth visible: Earth centre el >= mask(az) + antenna margin. Stated assumption: a DSN station
//! can see the Moon, and relays are ignored.

use serde::{Deserialize, Serialize};

use crate::constants::{R_EARTH_KM, R_M, R_SUN_KM};
use crate::contracts::{Metrics, Params};
use crate::geometry::{Enu, body_vec_m, dot, enu};
use crate::thermal;

/// Site geometry passed to `site_metrics` (engine-api proposal: decided with Ananth 2026-11-14).
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SiteGeom {
    pub lat_deg: f64,
    pub lon_deg: f64,
    pub elev_m: f64,
    pub slope_deg: f64,
    #[serde(default)]
    pub aspect_deg: Option<f64>,
}

/// Validity extras kept out of `Metrics` (no contract change yet; decision 3).
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Extras {
    /// Percent of the window with any sunlight AND Earth contact at the same time.
    pub pct_sun_and_earth: f64,
    /// longest_dark_h <= battery_h; always true when battery_h is 0 (gate off).
    pub survives_night: bool,
    /// Sun centre elevation at t_start (the UI applies its own touchdown threshold).
    pub sun_el_at_start_deg: f64,
    pub earth_visible_at_start: bool,
}

/// Moon-fixed Sun and Earth positions (metres) at every step of a window, computed once and
/// shared by every site or grid cell evaluated over that window.
#[derive(Debug, Clone)]
pub struct Bodies {
    pub sun: Vec<[f64; 3]>,
    pub earth: Vec<[f64; 3]>,
    pub step_h: f64,
}

/// Values at one time step, as seen from one site.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Step {
    pub sun_az: f64,
    pub sun_el: f64,
    /// Visible fraction of the solar disk, [0, 1].
    pub lit: f64,
    /// Disk top minus mask, deg: lit > 0 roughly when > 0 (used for sub-step sunset times).
    sun_margin: f64,
    pub earth_az: f64,
    pub earth_el: f64,
    /// Earth el - mask - antenna margin, deg: visible when >= 0.
    earth_margin: f64,
    pub temp_k: f64,
}

impl Step {
    pub fn earth_visible(&self) -> bool {
        self.earth_margin >= 0.0
    }
}

fn row(ephem: &[f32], k: usize) -> ([f64; 3], [f64; 3]) {
    let r: [f64; 6] = std::array::from_fn(|i| ephem[k * 6 + i] as f64);
    (body_vec_m(r[0], r[1], r[2]), body_vec_m(r[3], r[4], r[5]))
}

/// Linear blend of two body positions: direction lerped then renormalised, distance lerped
/// (so a sub-point crossing lon +/-180 stays near 180).
fn blend(a: [f64; 3], b: [f64; 3], f: f64) -> [f64; 3] {
    let (na, nb) = (dot(a, a).sqrt(), dot(b, b).sqrt());
    let d: [f64; 3] = std::array::from_fn(|i| a[i] / na * (1.0 - f) + b[i] / nb * f);
    let s = (na * (1.0 - f) + nb * f) / dot(d, d).sqrt();
    d.map(|x| x * s)
}

/// Body positions over the window. Errors on a malformed table, bad step or a window outside it.
pub fn bodies(
    ephem: &[f32],
    t_start_h: f64,
    hours: f64,
    step_h: f64,
) -> Result<Bodies, &'static str> {
    if ephem.is_empty() || !ephem.len().is_multiple_of(6) {
        return Err("ephem must be a non-empty multiple of 6 values");
    }
    if ephem.iter().any(|x| !x.is_finite()) {
        return Err("ephem contains non-finite values");
    }
    if !(hours.is_finite() && hours > 0.0 && step_h.is_finite() && step_h > 0.0) {
        return Err("hours and step_hours must be finite and > 0");
    }
    let n = (hours / step_h).round();
    if n < 1.0 || (n * step_h - hours).abs() > 1e-9 * hours {
        return Err("step_hours must divide hours");
    }
    let n = n as usize;
    let last = (ephem.len() / 6 - 1) as f64;
    if !(t_start_h.is_finite() && t_start_h >= 0.0 && t_start_h + (n - 1) as f64 * step_h <= last) {
        return Err("window is outside the ephem table");
    }
    let (mut sun, mut earth) = (Vec::with_capacity(n), Vec::with_capacity(n));
    for k in 0..n {
        let t = t_start_h + k as f64 * step_h;
        let i = t.floor();
        let f = t - i;
        let (s0, e0) = row(ephem, i as usize);
        if f == 0.0 {
            sun.push(s0);
            earth.push(e0);
        } else {
            let (s1, e1) = row(ephem, i as usize + 1);
            sun.push(blend(s0, s1, f));
            earth.push(blend(e0, e1, f));
        }
    }
    Ok(Bodies { sun, earth, step_h })
}

/// Horizon elevation at `az_deg`, linear between bins (bin i at i * 360 / n), wrapping 360 -> 0.
pub fn mask_at(mask: &[f32], az_deg: f64) -> f64 {
    let n = mask.len();
    let p = az_deg.rem_euclid(360.0) * n as f64 / 360.0;
    let i = p.floor();
    let f = p - i;
    let i = i as usize % n;
    mask[i] as f64 * (1.0 - f) + mask[(i + 1) % n] as f64 * f
}

/// Fraction of a disk of angular radius `r` centred at `el` that lies above a horizontal line at
/// `horizon` (all degrees): circular-segment area over disk area.
pub fn disk_above(el: f64, horizon: f64, r: f64) -> f64 {
    let c = ((horizon - el) / r).clamp(-1.0, 1.0); // line height in disk radii
    (c.acos() - c * (1.0 - c * c).sqrt()) / std::f64::consts::PI
}

/// Fraction of the Sun's disk NOT covered by the Earth's disk (radii and separation in degrees).
// shortcut: geometric disk overlap only (no limb darkening, Earth atmosphere or penumbra), fine for hour-scale metrics; model the umbra/penumbra if eclipse timing must match to minutes.
pub fn eclipse_factor(sep: f64, r_sun: f64, r_earth: f64) -> f64 {
    let (a, b, d) = (r_sun, r_earth, sep);
    let overlap = if d >= a + b {
        0.0
    } else if d <= (a - b).abs() {
        a.min(b).powi(2) * std::f64::consts::PI
    } else {
        let ca = ((d * d + a * a - b * b) / (2.0 * d * a)).clamp(-1.0, 1.0);
        let cb = ((d * d + b * b - a * a) / (2.0 * d * b)).clamp(-1.0, 1.0);
        let k = ((-d + a + b) * (d + a - b) * (d - a + b) * (d + a + b)).max(0.0);
        a * a * ca.acos() + b * b * cb.acos() - 0.5 * k.sqrt()
    };
    (1.0 - overlap / (std::f64::consts::PI * a * a)).clamp(0.0, 1.0)
}

/// Topocentric direction of a Moon-fixed body position: (az, el, distance km, unit vector in ENU).
/// Same math as `geometry::az_el`, from a position instead of a sub-point.
fn topo(site: &Enu, site_r_m: f64, b: [f64; 3]) -> (f64, f64, f64, [f64; 3]) {
    let v = [
        b[0] - site.u[0] * site_r_m,
        b[1] - site.u[1] * site_r_m,
        b[2] - site.u[2] * site_r_m,
    ];
    let norm = dot(v, v).sqrt();
    let az = dot(v, site.e)
        .atan2(dot(v, site.n))
        .to_degrees()
        .rem_euclid(360.0);
    let el = (dot(v, site.u) / norm).clamp(-1.0, 1.0).asin().to_degrees();
    let enu_dir = [
        dot(v, site.e) / norm,
        dot(v, site.n) / norm,
        dot(v, site.u) / norm,
    ];
    (
        if az >= 360.0 { 0.0 } else { az },
        el,
        norm / 1000.0,
        enu_dir,
    )
}

fn check_inputs(geom: &SiteGeom, mask: &[f32], params: &Params) -> Result<(), &'static str> {
    if mask.is_empty() || mask.iter().any(|x| !x.is_finite()) {
        return Err("mask must be non-empty and finite");
    }
    let g = [
        geom.lat_deg,
        geom.lon_deg,
        geom.elev_m,
        geom.slope_deg,
        geom.aspect_deg.unwrap_or(0.0),
    ];
    if g.iter().any(|x| !x.is_finite())
        || geom.lat_deg.abs() > 90.0
        || !(0.0..=90.0).contains(&geom.slope_deg)
    {
        return Err("site geometry must be finite, |lat| <= 90, slope in [0, 90]");
    }
    let p = [
        params.antenna_margin_deg,
        params.battery_h,
        params.survival_temp_k,
    ];
    if p.iter().any(|x| !x.is_finite() || *x < 0.0) {
        return Err("antenna_margin_deg, battery_h and survival_temp_k must be finite and >= 0");
    }
    Ok(())
}

/// Per-step Sun/Earth/thermal values for one site over a window.
pub fn steps(geom: &SiteGeom, mask: &[f32], b: &Bodies, margin_deg: f64) -> Vec<Step> {
    let site = enu(geom.lat_deg, geom.lon_deg);
    let r = R_M + geom.elev_m;
    let normal = thermal::surface_normal(geom.slope_deg, geom.aspect_deg);
    (0..b.sun.len())
        .map(|k| {
            let (sun_az, sun_el, sun_km, sun_dir) = topo(&site, r, b.sun[k]);
            let (earth_az, earth_el, earth_km, earth_dir) = topo(&site, r, b.earth[k]);
            let r_sun = (R_SUN_KM / sun_km).asin().to_degrees();
            let r_earth = (R_EARTH_KM / earth_km).asin().to_degrees();
            let sep = dot(sun_dir, earth_dir).clamp(-1.0, 1.0).acos().to_degrees();
            let sun_mask = mask_at(mask, sun_az);
            let lit = disk_above(sun_el, sun_mask, r_sun) * eclipse_factor(sep, r_sun, r_earth);
            Step {
                sun_az,
                sun_el,
                lit,
                sun_margin: sun_el + r_sun - sun_mask,
                earth_az,
                earth_el,
                earth_margin: earth_el - mask_at(mask, earth_az) - margin_deg,
                temp_k: thermal::temp_k(normal, sun_dir, sun_km, lit),
            }
        })
        .collect()
}

/// Hours from t_start to the first "on -> off" transition, linear in the margin between the two
/// samples; None when it never goes off. When the body is down at t_start this is the first set
/// after it rises (Extras sun_el_at_start_deg / earth_visible_at_start say it started down).
fn first_set(
    on: impl Fn(&Step) -> bool,
    margin: impl Fn(&Step) -> f64,
    s: &[Step],
    step_h: f64,
) -> Option<f64> {
    let rise = s.iter().position(&on)?;
    let k = (rise + 1..s.len()).find(|&k| !on(&s[k]))?;
    let (a, b) = (margin(&s[k - 1]), margin(&s[k]));
    // An eclipse can turn the Sun off with the disk still above the mask: snap to the sample.
    let f = if a > b {
        (a / (a - b)).clamp(0.0, 1.0)
    } else {
        1.0
    };
    Some(((k - 1) as f64 + f) * step_h)
}

/// Longest run of consecutive samples where `off` holds, in hours.
fn longest_run(s: &[Step], off: impl Fn(&Step) -> bool, step_h: f64) -> f64 {
    let (mut best, mut run) = (0usize, 0usize);
    for x in s {
        run = if off(x) { run + 1 } else { 0 };
        best = best.max(run);
    }
    best as f64 * step_h
}

/// Window metrics and extras for one site. Accumulation is f64 in step order (determinism).
// shortcut: dark/blackout runs are clipped at the window edges, so they undercount nights that cross them; widen the window (or scan past it) if battery sizing needs the full night.
pub fn window(
    geom: &SiteGeom,
    mask: &[f32],
    b: &Bodies,
    params: &Params,
) -> Result<(Metrics, Extras), &'static str> {
    check_inputs(geom, mask, params)?;
    let s = steps(geom, mask, b, params.antenna_margin_deg);
    let (n, h) = (s.len() as f64, b.step_h);
    let (mut lit_n, mut earth_n, mut both_n, mut cold_n) = (0usize, 0usize, 0usize, 0usize);
    let (mut el_sum, mut pv, mut ph) = (0.0f64, 0.0f64, 0.0f64);
    let (mut el_max, mut t_min, mut t_max) = (f64::NEG_INFINITY, f64::INFINITY, f64::NEG_INFINITY);
    for x in &s {
        lit_n += (x.lit > 0.0) as usize;
        earth_n += x.earth_visible() as usize;
        both_n += (x.lit > 0.0 && x.earth_visible()) as usize;
        cold_n += (x.temp_k < params.survival_temp_k) as usize;
        el_sum += x.sun_el;
        el_max = el_max.max(x.sun_el);
        let (se, ce) = x.sun_el.to_radians().sin_cos();
        pv += x.lit * ce.max(0.0);
        ph += x.lit * se.max(0.0);
        t_min = t_min.min(x.temp_k);
        t_max = t_max.max(x.temp_k);
    }
    let longest_dark_h = longest_run(&s, |x| x.lit <= 0.0, h);
    let m = Metrics {
        pct_lit: 100.0 * lit_n as f64 / n,
        longest_dark_h,
        pct_earth_visible: 100.0 * earth_n as f64 / n,
        longest_blackout_h: longest_run(&s, |x| !x.earth_visible(), h),
        h_to_first_sunset: first_set(|x| x.lit > 0.0, |x| x.sun_margin, &s, h),
        h_to_first_earthset: first_set(Step::earth_visible, |x| x.earth_margin, &s, h),
        mean_sun_el_deg: el_sum / n,
        max_sun_el_deg: el_max,
        mean_power_vertical: pv / n,
        mean_power_horizontal: ph / n,
        t_min_k: t_min,
        t_max_k: t_max,
        h_below_survival: cold_n as f64 * h,
    };
    let e = Extras {
        pct_sun_and_earth: 100.0 * both_n as f64 / n,
        survives_night: params.battery_h == 0.0 || longest_dark_h <= params.battery_h,
        sun_el_at_start_deg: s[0].sun_el,
        earth_visible_at_start: s[0].earth_visible(),
    };
    Ok((m, e))
}

/// Per-step track, 6 f32 per step: sun_az, sun_el, sun_lit, earth_az, earth_el, earth_visible (0/1).
pub fn track(
    geom: &SiteGeom,
    mask: &[f32],
    b: &Bodies,
    params: &Params,
) -> Result<Vec<f32>, &'static str> {
    check_inputs(geom, mask, params)?;
    Ok(steps(geom, mask, b, params.antenna_margin_deg)
        .iter()
        .flat_map(|x| {
            [
                x.sun_az,
                x.sun_el,
                x.lit,
                x.earth_az,
                x.earth_el,
                x.earth_visible() as u8 as f64,
            ]
            .map(|v| v as f32)
        })
        .collect())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants::{AU_KM, T_FLOOR_K};
    use crate::geometry::az_el;

    const EARTH_KM: f32 = 384_400.0;

    fn params() -> Params {
        Params {
            battery_h: 48.0,
            survival_temp_k: 233.0,
            antenna_margin_deg: 2.0,
            slope_limit_deg: 10.0,
            step_hours: 1.0,
        }
    }

    fn pole_site() -> SiteGeom {
        SiteGeom {
            lat_deg: -90.0,
            lon_deg: 0.0,
            elev_m: 0.0,
            slope_deg: 0.0,
            aspect_deg: None,
        }
    }

    /// Ephem with `n` hourly rows; `f(k)` gives (sun_lat, sun_lon, earth_lat, earth_lon).
    fn ephem(n: usize, f: impl Fn(usize) -> (f64, f64, f64, f64)) -> Vec<f32> {
        (0..n)
            .flat_map(|k| {
                let (sl, so, el, eo) = f(k);
                [
                    sl as f32,
                    so as f32,
                    AU_KM as f32,
                    el as f32,
                    eo as f32,
                    EARTH_KM,
                ]
            })
            .collect()
    }

    fn run(
        geom: &SiteGeom,
        mask: &[f32],
        eph: &[f32],
        t0: f64,
        hours: f64,
        p: &Params,
    ) -> (Metrics, Extras) {
        window(
            geom,
            mask,
            &bodies(eph, t0, hours, p.step_hours).unwrap(),
            p,
        )
        .unwrap()
    }

    /// At the south pole the Sun's elevation is about -sun_lat (minus a tiny parallax).
    #[test]
    fn a_sun_fixed_above_mask_is_always_lit() {
        let eph = ephem(30, |k| (-5.0, k as f64, 0.0, 0.0));
        let (m, e) = run(&pole_site(), &[0.0; 360], &eph, 0.0, 24.0, &params());
        assert_eq!(
            (m.pct_lit, m.longest_dark_h, m.h_to_first_sunset),
            (100.0, 0.0, None)
        );
        assert!((m.mean_sun_el_deg - 5.0).abs() < 0.01 && (m.max_sun_el_deg - 5.0).abs() < 0.01);
        assert!(e.survives_night && (e.sun_el_at_start_deg - 5.0).abs() < 0.01);
    }

    #[test]
    fn b_sun_below_mask_is_never_lit() {
        let eph = ephem(30, |k| (-1.0, k as f64, 0.0, 0.0));
        let (m, e) = run(&pole_site(), &[3.0; 64], &eph, 2.0, 24.0, &params());
        assert_eq!(
            (m.pct_lit, m.longest_dark_h, m.h_to_first_sunset),
            (0.0, 24.0, None)
        );
        assert_eq!(
            (m.mean_power_vertical, m.t_min_k, m.t_max_k),
            (0.0, T_FLOOR_K, T_FLOOR_K)
        );
        assert_eq!(m.h_below_survival, 24.0);
        assert!(e.survives_night); // 24 h dark <= 48 h battery
        let short = Params {
            battery_h: 12.0,
            ..params()
        };
        assert!(
            !run(&pole_site(), &[3.0; 64], &eph, 2.0, 24.0, &short)
                .1
                .survives_night
        );
        let off = Params {
            battery_h: 0.0,
            ..params()
        };
        assert!(
            run(&pole_site(), &[3.0; 64], &eph, 2.0, 24.0, &off)
                .1
                .survives_night
        ); // gate off
    }

    /// Sun at el 1 deg circling the pole once per 708.7 h, behind a 2 deg wall over az [90, 180].
    #[test]
    fn c_rotating_sun_and_one_wall_gives_expected_dark_run_and_sub_hour_sunset() {
        let rate = 360.0 / 708.7;
        let eph = ephem(800, |k| (-1.0, 50.0 + k as f64 * rate, 0.0, 0.0));
        let mask: Vec<f32> = (0..360)
            .map(|i| if (90..=180).contains(&i) { 2.0 } else { 0.0 })
            .collect();
        let (m, _) = run(&pole_site(), &mask, &eph, 0.0, 708.0, &params());
        // At the pole (site lon 0) az = sun_lon, rising from 50 deg; the Sun sets behind the lerped
        // 89..90 edge (~78 h in), between two samples.
        let sunset = m.h_to_first_sunset.unwrap();
        assert!(sunset > 0.0 && sunset.fract() != 0.0, "{sunset}");
        // Disk at el 1, r 0.267: lit while the mask < 1.267, so dark across az [89.63, 180.37] = 90.73 deg.
        let dark_deg = m.longest_dark_h * rate;
        assert!(
            (sunset - 39.63 / rate).abs() < 0.2 && (dark_deg - 90.73).abs() < 1.0,
            "{} h = {dark_deg} deg",
            m.longest_dark_h
        );
        assert!((m.pct_lit - 100.0 * (1.0 - m.longest_dark_h / 708.0)).abs() < 1e-9);
    }

    #[test]
    fn d_earth_just_under_mask_plus_margin_is_not_visible() {
        // Earth sub-point at lat -1.7 seen from the pole: centre el ~1.7 - 0.26 parallax = 1.44 < 2 deg margin.
        let eph = ephem(30, |_| (-5.0, 0.0, -1.7, 0.0));
        let (m, e) = run(&pole_site(), &[0.0; 360], &eph, 0.0, 24.0, &params());
        assert_eq!(
            (
                m.pct_earth_visible,
                m.longest_blackout_h,
                m.h_to_first_earthset
            ),
            (0.0, 24.0, None)
        );
        assert!(!e.earth_visible_at_start && e.pct_sun_and_earth == 0.0);
        let p = Params {
            antenna_margin_deg: 1.0,
            ..params()
        };
        let (m, e) = run(&pole_site(), &[0.0; 360], &eph, 0.0, 24.0, &p);
        assert_eq!(
            (
                m.pct_earth_visible,
                m.h_to_first_earthset,
                e.pct_sun_and_earth
            ),
            (100.0, None, 100.0)
        );
    }

    #[test]
    fn e_sun_on_the_horizon_gives_vertical_power_only() {
        let eph = ephem(30, |k| (0.0, k as f64, 0.0, 180.0));
        let (m, _) = run(&pole_site(), &[-5.0; 360], &eph, 0.0, 24.0, &params());
        // Pole site el is ~0 (parallax ~0.0003 deg for the Sun): full disk, cos 0 = 1, sin 0 = 0.
        assert!(
            (m.mean_power_vertical - 1.0).abs() < 1e-6 && m.mean_power_horizontal < 1e-5,
            "{m:?}"
        );
    }

    #[test]
    fn f_reruns_are_bit_identical() {
        let eph = ephem(100, |k| (-1.2, k as f64 * 0.5, -3.0, 10.0 + k as f64 * 0.1));
        let mask: Vec<f32> = (0..64).map(|i| (i as f32 * 0.37).sin() * 2.0).collect();
        let g = SiteGeom {
            lat_deg: -89.4,
            lon_deg: -137.0,
            elev_m: 1500.0,
            slope_deg: 5.0,
            aspect_deg: Some(200.0),
        };
        let p = Params {
            step_hours: 0.25,
            ..params()
        };
        let a = run(&g, &mask, &eph, 3.5, 48.0, &p);
        let b = run(&g, &mask, &eph, 3.5, 48.0, &p);
        assert_eq!(
            serde_json::to_string(&a.0).unwrap(),
            serde_json::to_string(&b.0).unwrap()
        );
        assert_eq!(a.1, b.1);
    }

    #[test]
    fn integer_t_reads_rows_exactly_and_matches_geometry() {
        let eph = ephem(5, |k| (-1.3, 30.0 + k as f64, -6.5, 358.7));
        let b = bodies(&eph, 2.0, 2.0, 1.0).unwrap();
        let g = SiteGeom {
            lat_deg: -85.99,
            lon_deg: -0.23,
            elev_m: 2000.0,
            slope_deg: 0.0,
            aspect_deg: None,
        };
        let s = steps(&g, &[0.0; 360], &b, 0.0);
        let (az, el) = az_el(
            &enu(g.lat_deg, g.lon_deg),
            R_M + g.elev_m,
            -1.3f32 as f64,
            32.0,
            AU_KM as f32 as f64,
        );
        assert_eq!((s[0].sun_az, s[0].sun_el), (az, el));
    }

    #[test]
    fn lerp_across_the_dateline_stays_near_180() {
        let eph = ephem(2, |k| (-1.0, if k == 0 { 179.5 } else { -179.5 }, 0.0, 0.0));
        let b = bodies(&eph, 0.0, 1.0, 0.5).unwrap();
        let v = b.sun[1];
        let lon = v[1].atan2(v[0]).to_degrees();
        assert!((lon.abs() - 180.0).abs() < 1e-6, "{lon}");
        assert!((dot(v, v).sqrt() / 1000.0 / AU_KM - 1.0).abs() < 1e-6);
    }

    #[test]
    fn bad_inputs_are_errors() {
        let eph = ephem(10, |_| (-1.0, 0.0, 0.0, 0.0));
        assert!(bodies(&eph[..7], 0.0, 1.0, 1.0).is_err());
        assert!(bodies(&eph, 0.0, 10.0, 1.0).is_ok()); // end exclusive: last sample at row 9
        assert!(bodies(&eph, 0.0, 11.0, 1.0).is_err()); // needs row 10
        assert!(bodies(&eph, 0.0, 1.0, 0.3).is_err()); // step does not divide hours
        assert!(bodies(&eph, -1.0, 1.0, 1.0).is_err());
        let mut nan = eph.clone();
        nan[3] = f32::NAN;
        assert!(bodies(&nan, 0.0, 1.0, 1.0).is_err());
        let b = bodies(&eph, 0.0, 2.0, 1.0).unwrap();
        assert!(window(&pole_site(), &[], &b, &params()).is_err());
        assert!(window(&pole_site(), &[f32::NAN], &b, &params()).is_err());
        let neg = Params {
            antenna_margin_deg: -1.0,
            ..params()
        };
        assert!(window(&pole_site(), &[0.0], &b, &neg).is_err());
    }

    #[test]
    fn mask_lerp_wraps_and_any_bin_count_agrees() {
        let m: Vec<f32> = (0..360).map(|i| i as f32).collect();
        assert_eq!(mask_at(&m, 359.5), 359.0 * 0.5); // bins 359 and 0
        assert_eq!(mask_at(&m, 10.25), 10.25);
        assert_eq!(mask_at(&m, 360.0), 0.0);
        for az in [0.0, 3.3, 181.0, 359.9] {
            assert_eq!(mask_at(&[1.5; 64], az), mask_at(&[1.5; 360], az));
        }
    }

    #[test]
    fn disk_fraction_edges() {
        let r = 0.267;
        assert!((disk_above(0.0, 0.0, r) - 0.5).abs() < 1e-12);
        assert_eq!(disk_above(1.0 + r, 1.0, r), 1.0);
        assert!(disk_above(1.0 - r, 1.0, r).abs() < 1e-12);
        assert!(disk_above(0.1, 0.0, r) > 0.5 && disk_above(-0.1, 0.0, r) < 0.5);
    }

    #[test]
    fn eclipse_overlap_is_monotonic() {
        let (rs, re) = (0.267, 0.95);
        assert_eq!(eclipse_factor(0.0, rs, re), 0.0); // centred: total
        assert_eq!(eclipse_factor(1.3, rs, re), 1.0); // separated
        let mut prev = 0.0;
        for i in 0..=30 {
            let f = eclipse_factor(0.6 + i as f64 * 0.02, rs, re);
            assert!(f >= prev, "{i}");
            prev = f;
        }
        // Earth's limb through the Sun's centre: a bit over half stays lit (the limb bulges into the Sun's disk).
        assert!((eclipse_factor(re, rs, re) - 0.52988).abs() < 1e-4);
    }

    #[test]
    fn eclipse_darkens_the_sun_in_the_window() {
        // Earth sitting on the Sun's direction (el 10 at the pole) for hours 5..8.
        let eph = ephem(30, |k| {
            (
                -10.0,
                0.0,
                if (5..8).contains(&k) { -10.0 } else { 30.0 },
                0.0,
            )
        });
        let (m, _) = run(&pole_site(), &[0.0; 360], &eph, 0.0, 24.0, &params());
        assert_eq!((m.longest_dark_h, m.h_to_first_sunset), (3.0, Some(5.0)));
    }

    #[test]
    fn starts_dark_then_rises_and_sets_reports_the_later_sunset() {
        // Behind a 2 deg wall: Sun el 1 (dark) for k < 4, el 10 (lit) for 4..10, el 1 again after.
        let eph = ephem(30, |k| {
            (
                if (4..10).contains(&k) { -10.0 } else { -1.0 },
                0.0,
                0.0,
                0.0,
            )
        });
        let (m, e) = run(&pole_site(), &[2.0; 360], &eph, 0.0, 24.0, &params());
        let sunset = m.h_to_first_sunset.unwrap();
        // Set between samples 9 and 10; the margin lerp puts it inside that hour.
        assert!(sunset > 9.0 && sunset <= 10.0, "{sunset}");
        assert!(e.sun_el_at_start_deg < 2.0);
        assert_eq!(m.longest_dark_h, 14.0);
    }

    #[test]
    fn mixed_window_counts_cold_hours() {
        // Sun above the 2 deg wall for 10 h, below it for 14 h: 14 h at the floor, below 233 K.
        let eph = ephem(30, |k| (if k < 10 { -20.0 } else { -1.0 }, 0.0, 0.0, 0.0));
        let (m, _) = run(&pole_site(), &[2.0; 360], &eph, 0.0, 24.0, &params());
        assert_eq!((m.h_below_survival, m.t_min_k), (14.0, T_FLOOR_K));
        assert!(m.t_max_k > 233.0, "{}", m.t_max_k); // flat ground, Sun at 20 deg: ~295 K
    }

    #[test]
    fn track_has_six_values_per_step() {
        let eph = ephem(30, |k| (-5.0, k as f64, -1.0, 0.0));
        let b = bodies(&eph, 0.0, 6.0, 0.5).unwrap();
        let t = track(&pole_site(), &[0.0; 360], &b, &params()).unwrap();
        assert_eq!(t.len(), 12 * 6);
        assert!((t[1] - 5.0).abs() < 0.01 && t[2] == 1.0 && t[5] == 0.0); // Earth el ~0.74 < margin 2
    }

    /// Real shipped data: web/public/data (ephem.bin from PIPE-2, validation/ from PIPE-7, masks/ from ENG-3).
    mod real_data {
        use super::*;
        use crate::contracts::SiteMask;
        use std::path::PathBuf;

        fn data() -> PathBuf {
            PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../web/public/data")
        }

        fn json(path: &str) -> serde_json::Value {
            serde_json::from_slice(&std::fs::read(data().join(path)).unwrap()).unwrap()
        }

        fn real_ephem() -> Vec<f32> {
            assert_eq!(json("ephem.json")["t0_iso"], "2026-01-01T00:00:00Z");
            let bytes = std::fs::read(data().join("ephem.bin")).unwrap();
            bytes
                .as_chunks::<4>()
                .0
                .iter()
                .map(|b| f32::from_le_bytes(*b))
                .collect()
        }

        /// Hours since 2026-01-01T00Z for "YYYY-MM-DDTHH:00:00Z" (days_from_civil, H. Hinnant).
        fn hours_since_2026(s: &str) -> f64 {
            let n = |a: usize, b: usize| s[a..b].parse::<i64>().unwrap();
            let days = |y: i64, m: i64, d: i64| {
                let y = if m <= 2 { y - 1 } else { y };
                let (era, yoe) = (y.div_euclid(400), y.rem_euclid(400));
                let doy = (153 * (m + if m > 2 { -3 } else { 9 }) + 2) / 5 + d - 1;
                era * 146_097 + yoe * 365 + yoe / 4 - yoe / 100 + doy
            };
            ((days(n(0, 4), n(5, 7), n(8, 10)) - days(2026, 1, 1)) * 24 + n(11, 13)) as f64
        }

        /// PIPE-7 sanity: with a zero mask, lit > 0 exactly when the Horizons Sun centre is above -r_sun.
        /// Samples within 0.01 deg of the threshold (the geometry accuracy bar) are not judged.
        #[test]
        fn zero_mask_lit_matches_horizons_sun_elevation() {
            assert_eq!(hours_since_2026("2026-12-01T00:00:00Z"), 8016.0);
            let eph = real_ephem();
            let p = params();
            let (mut judged, mut near) = (0, 0);
            for site in ["haworth", "connecting-ridge", "malapert-massif"] {
                let v = json(&format!("validation/{site}.json"));
                let f = |k: &str| v[k].as_f64().unwrap();
                let g = SiteGeom {
                    lat_deg: f("lat"),
                    lon_deg: f("lon"),
                    elev_m: f("elev_m"),
                    slope_deg: 0.0,
                    aspect_deg: None,
                };
                for s in v["samples"].as_array().unwrap() {
                    let t = hours_since_2026(s["t_iso"].as_str().unwrap());
                    let b = bodies(&eph, t, 1.0, 1.0).unwrap();
                    let st = steps(&g, &[0.0], &b, p.antenna_margin_deg)[0];
                    let r_sun = st.sun_margin - st.sun_el; // engine disk radius, mask 0
                    let horizons_up = s["sun_el"].as_f64().unwrap() + r_sun;
                    if horizons_up.abs() < 0.01 {
                        near += 1;
                        continue;
                    }
                    assert_eq!(st.lit > 0.0, horizons_up > 0.0, "{site} {}", s["t_iso"]);
                    judged += 1;
                }
            }
            println!("{judged} samples agree, {near} within 0.01 deg of the limb skipped");
            assert!(judged >= 4300, "{judged}");
        }

        /// ENG-4/5 on the real ENG-3 masks: 14 days from 2026-12-01, default params. Prints the numbers.
        #[test]
        fn real_masks_two_weeks_from_2026_12_01() {
            let eph = real_ephem();
            let p = params();
            for site in ["haworth", "connecting-ridge", "malapert-massif"] {
                let m: SiteMask =
                    serde_json::from_value(json(&format!("masks/{site}.json"))).unwrap();
                let g = SiteGeom {
                    lat_deg: m.lat,
                    lon_deg: m.lon,
                    elev_m: m.elev_m,
                    slope_deg: m.slope_deg,
                    aspect_deg: m.aspect_deg,
                };
                let mask: Vec<f32> = m.mask_deg.iter().map(|&x| x as f32).collect();
                let b = bodies(&eph, 8016.0, 336.0, 1.0).unwrap();
                let (x, e) = window(&g, &mask, &b, &p).unwrap();
                println!("{site}: {}", serde_json::to_string(&x).unwrap());
                println!("{site} extras: {}", serde_json::to_string(&e).unwrap());
                for pct in [x.pct_lit, x.pct_earth_visible, e.pct_sun_and_earth] {
                    assert!((0.0..=100.0).contains(&pct));
                }
                for pw in [x.mean_power_vertical, x.mean_power_horizontal] {
                    assert!((0.0..=1.0).contains(&pw));
                }
                assert!(
                    x.longest_dark_h <= 336.0
                        && x.longest_blackout_h <= 336.0
                        && x.h_below_survival <= 336.0
                );
                assert!(T_FLOOR_K <= x.t_min_k && x.t_min_k <= x.t_max_k && x.t_max_k < 400.0);
                assert!(x.max_sun_el_deg < 6.0 && x.mean_sun_el_deg > -6.0); // polar Sun stays low
            }
        }
    }
}
