//! Site frames, south polar stereographic coordinates and topocentric Sun/Earth az/el (ENG-2).
//!
//! Frame: MOON_ME, east-positive longitude, Moon-centred sphere of radius `R_M` (the LOLA datum).
//! Method = pipeline `validate.azel_from_subpoints` (PIPE-7): body vector from the sub-point and
//! distance, minus the site vector (topocentric, so Earth parallax ~0.26 deg is included; libration
//! enters through the sub-Earth point), rotated into East-North-Up.
//!
//! Precision: all math is f64. Ephem rows arrive as f32: one ulp is <= 1.5e-5 deg for sub-point
//! angles (|lon| < 180), ~0.03 km for the Earth distance and ~16 km for the Sun distance. That moves
//! directions by < 2e-5 deg, far below the 0.01 deg (Sun) / 0.02 deg (Earth) bar vs Horizons.

use crate::constants::R_M;

/// South polar stereographic (lat_0 -90, lon_0 0, k0 1, sphere `R_M`): +y along 0 E, +x along 90 E.
/// Same as pipeline `coords.to_xy`. Returns `None` for the northern hemisphere or non-finite input.
pub fn to_xy(lat_deg: f64, lon_deg: f64) -> Option<(f64, f64)> {
    if !(lat_deg <= 0.0 && lon_deg.is_finite()) {
        return None;
    }
    let rho = 2.0 * R_M * (std::f64::consts::FRAC_PI_4 + lat_deg.to_radians() / 2.0).tan();
    let (s, c) = lon_deg.to_radians().sin_cos();
    Some((rho * s, rho * c))
}

/// Inverse of [`to_xy`]: (lat, lon) in degrees, lon in [-180, 180) (contract range; 180 is written
/// as -180, unlike coords.py's (-180, 180]). The pole returns lon 0.
pub fn to_latlon(x: f64, y: f64) -> (f64, f64) {
    let lat = (2.0 * (x.hypot(y) / (2.0 * R_M)).atan() - std::f64::consts::FRAC_PI_2).to_degrees();
    (lat, wrap_lon(x.atan2(y).to_degrees()))
}

/// Longitude wrapped to [-180, 180).
pub fn wrap_lon(lon_deg: f64) -> f64 {
    let w = (lon_deg + 180.0).rem_euclid(360.0) - 180.0;
    if w >= 180.0 { -180.0 } else { w + 0.0 } // + 0.0 maps -0 to +0
}

/// Unit vector from the Moon's centre towards (lat, lon), MOON_ME.
pub fn unit_vec(lat_deg: f64, lon_deg: f64) -> [f64; 3] {
    let (sp, cp) = lat_deg.to_radians().sin_cos();
    let (sl, cl) = lon_deg.to_radians().sin_cos();
    [cp * cl, cp * sl, sp]
}

/// Local East-North-Up unit vectors at a site, Moon-fixed.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Enu {
    pub e: [f64; 3],
    pub n: [f64; 3],
    pub u: [f64; 3],
}

/// ENU frame at (lat, lon). East comes from the longitude, so it stays defined at the pole
/// (there "north" points along the 180-degrees-away meridian from `lon`, as Horizons does).
pub fn enu(lat_deg: f64, lon_deg: f64) -> Enu {
    let u = unit_vec(lat_deg, lon_deg);
    let (sl, cl) = lon_deg.to_radians().sin_cos();
    let e = [-sl, cl, 0.0];
    Enu { e, n: cross(u, e), u }
}

/// Body position in metres, Moon-fixed, from its sub-point and its distance from the Moon's centre.
pub fn body_vec_m(sub_lat_deg: f64, sub_lon_deg: f64, dist_km: f64) -> [f64; 3] {
    let d = unit_vec(sub_lat_deg, sub_lon_deg);
    let m = dist_km * 1000.0;
    [d[0] * m, d[1] * m, d[2] * m]
}

/// Topocentric (az, el) in degrees of a body seen from a site at radius `site_r_m` (R_M + height):
/// az clockwise from local north in [0, 360), el above the local horizontal plane.
pub fn az_el(site: &Enu, site_r_m: f64, sub_lat_deg: f64, sub_lon_deg: f64, dist_km: f64) -> (f64, f64) {
    let b = body_vec_m(sub_lat_deg, sub_lon_deg, dist_km);
    let v = [b[0] - site.u[0] * site_r_m, b[1] - site.u[1] * site_r_m, b[2] - site.u[2] * site_r_m];
    let norm = dot(v, v).sqrt();
    let az = dot(v, site.e).atan2(dot(v, site.n)).to_degrees().rem_euclid(360.0);
    let el = (dot(v, site.u) / norm).clamp(-1.0, 1.0).asin().to_degrees();
    // rem_euclid can return 360.0 for tiny negative inputs; keep the [0, 360) contract.
    (if az >= 360.0 { 0.0 } else { az }, el)
}

pub fn dot(a: [f64; 3], b: [f64; 3]) -> f64 {
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

pub fn cross(a: [f64; 3], b: [f64; 3]) -> [f64; 3] {
    [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

/// Great-circle angle in degrees between two (az, el) directions (pipeline `residual_deg`), so
/// azimuths compare as directions (359.9 vs 0.1 is 0.2 deg apart, not 359.8).
pub fn angle_between_deg(a: (f64, f64), b: (f64, f64)) -> f64 {
    let (az1, el1, az2, el2) = (a.0.to_radians(), a.1.to_radians(), b.0.to_radians(), b.1.to_radians());
    let c = el1.sin() * el2.sin() + el1.cos() * el2.cos() * (az1 - az2).cos();
    c.clamp(-1.0, 1.0).acos().to_degrees()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants::AU_KM;

    fn close(a: f64, b: f64, tol: f64) -> bool {
        (a - b).abs() <= tol
    }

    #[test]
    fn enu_is_orthonormal_and_right_handed() {
        for (lat, lon) in [(-89.5, -137.0), (-86.0, 0.0), (0.0, 0.0), (-90.0, 0.0), (-90.0, 77.0)] {
            let f = enu(lat, lon);
            for v in [f.e, f.n, f.u] {
                assert!(close(dot(v, v), 1.0, 1e-12), "unit {lat},{lon}");
            }
            assert!(dot(f.e, f.n).abs() < 1e-12 && dot(f.e, f.u).abs() < 1e-12 && dot(f.n, f.u).abs() < 1e-12);
            let c = cross(f.e, f.n);
            assert!((0..3).all(|i| close(c[i], f.u[i], 1e-12)), "e x n = u at {lat},{lon}");
        }
        // Away from the pole, north has a positive z component (points towards +90 lat).
        assert!(enu(-86.0, 0.0).n[2] > 0.0);
    }

    #[test]
    fn body_at_own_subpoint_is_at_zenith_and_az_is_clockwise() {
        let site = enu(-86.0, 10.0);
        assert!(close(az_el(&site, R_M, -86.0, 10.0, 384_400.0).1, 90.0, 1e-6));
        // A far body due east on the equator sits near az 90; one at the equator below the site's lon near az 0 (north).
        let (az_e, _) = az_el(&enu(0.0, 0.0), R_M, 0.0, 89.0, 1e12);
        let (az_n, _) = az_el(&enu(-86.0, 0.0), R_M, 0.0, 0.0, 1e12);
        assert!(close(az_e, 90.0, 0.01) && (az_n < 0.01 || az_n > 359.99), "{az_e} {az_n}");
    }

    #[test]
    fn earth_parallax_is_about_a_quarter_degree_near_the_horizon() {
        let site = enu(-89.5, 0.0);
        let near = az_el(&site, R_M, 0.0, 0.0, 384_400.0).1;
        let far = az_el(&site, R_M, 0.0, 0.0, 1e12).1;
        let p = far - near;
        assert!((0.25..0.27).contains(&p), "parallax {p}");
    }

    #[test]
    fn stereo_matches_coords_py_and_round_trips() {
        // Pairs from pipeline/tests/test_coords_tiles.py.
        let (x, y) = to_xy(-86.7639, -22.777).unwrap();
        assert!(close(x, -38_000.0, 1.0) && close(y, 90_501.0, 1.0), "{x} {y}");
        let (x, y) = to_xy(-85.9948, -0.23578).unwrap();
        assert!(close(x, -500.0, 1.0) && close(y, 121_500.0, 1.0), "{x} {y}");
        let (_, y) = to_xy(-85.0, 0.0).unwrap();
        assert!(close(y, 2.0 * R_M * 2.5f64.to_radians().tan(), 1e-6));
        assert_eq!(to_latlon(0.0, 0.0), (-90.0, 0.0));
        assert!(to_xy(10.0, 0.0).is_none() && to_xy(f64::NAN, 0.0).is_none());
        for (lat, lon) in [(-89.4632, -137.49), (-80.0, 179.9), (-88.0, -179.5), (-85.0, 0.0)] {
            let (x, y) = to_xy(lat, lon).unwrap();
            let (la, lo) = to_latlon(x, y);
            assert!(close(la, lat, 1e-9) && close(lo, lon, 1e-9), "{lat},{lon} -> {la},{lo}");
        }
        // lon 180 lands on -180 (contract range [-180, 180)).
        let (_, y) = to_xy(-85.0, 180.0).unwrap();
        assert_eq!(to_latlon(0.0, y).1, -180.0);
        assert_eq!(wrap_lon(540.0), -180.0);
        assert_eq!(wrap_lon(-0.0).to_bits(), 0.0f64.to_bits());
        assert!(close(wrap_lon(359.76422), -0.23578, 1e-12));
    }

    #[test]
    fn angle_between_treats_azimuth_as_direction() {
        assert!(close(angle_between_deg((359.9, 0.0), (0.1, 0.0)), 0.2, 1e-9));
        assert!(angle_between_deg((10.0, 89.999), (190.0, 89.999)) < 0.003);
    }

    /// Port check: same numbers as `validate.azel_from_subpoints` (run with the pipeline venv, f64).
    #[test]
    fn matches_validate_py_to_1e9() {
        let mal = enu(-85.9948, -0.23578);
        let (az, el) = az_el(&mal, R_M, -6.556142, 358.716549, 0.00241343753005 * AU_KM);
        assert!(close(az, 358.9412452363081, 1e-9) && close(el, 10.289383541775168, 1e-9), "{az} {el}");
        let cr = enu(-89.4632, -137.49);
        let (az, el) = az_el(&cr, R_M, -1.346422, 32.519634, 0.985323858740 * AU_KM);
        assert!(close(az, 170.01139284072997, 1e-9) && close(el, 0.8170847219715873, 1e-9), "{az} {el}");
    }

    /// The PIPE-7 Horizons fixtures (pipeline/tests/fixtures/*_2026-01-01_4h.txt), copied by hand.
    #[test]
    fn horizons_fixture_rows() {
        // ObsSub-LON, ObsSub-LAT (sub-Earth), SunSub-LON, SunSub-LAT, r (Sun AU), delta (Earth AU).
        let ephem = [
            [358.716549, -6.556142, 32.519634, -1.346422, 0.985323858740, 0.00241343753005],
            [358.793844, -6.561459, 32.014308, -1.345746, 0.985336247781, 0.00241303538145],
            [358.871397, -6.565990, 31.508989, -1.345068, 0.985348458677, 0.00241265100339],
            [358.949198, -6.569732, 31.003678, -1.344389, 0.985360490113, 0.00241228452043],
        ];
        let mal_sun = [(32.870166412, 4.712309328), (32.363593198, 4.730658018), (31.857004327, 4.748741776), (31.350399911, 4.766559135)];
        let mal_earth = [(358.945941406, 10.289670574), (359.024080695, 10.295037691), (359.102482809, 10.299612358), (359.181135872, 10.303392937)];
        let cr_sun = [(170.011224492, 0.817085045), (169.505986020, 0.817250084), (169.000754775, 0.817455104), (168.495530638, 0.817700029)];
        let (mal, cr) = (enu(-85.9948, -0.23578), enu(-89.4632, -137.49));
        for (k, r) in ephem.iter().enumerate() {
            let sun = |f: &Enu| az_el(f, R_M, r[3], r[2], r[4] * AU_KM);
            let earth = az_el(&mal, R_M, r[1], r[0], r[5] * AU_KM);
            assert!(angle_between_deg(sun(&mal), mal_sun[k]) < 0.01, "malapert sun row {k}");
            assert!(angle_between_deg(earth, mal_earth[k]) < 0.02, "malapert earth row {k}");
            assert!(angle_between_deg(sun(&cr), cr_sun[k]) < 0.01, "connecting-ridge sun row {k}");
        }
    }
}
