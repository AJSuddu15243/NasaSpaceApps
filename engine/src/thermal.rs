//! ENG-5: instantaneous radiative-equilibrium surface temperature (SPEC "Thermal exposure").
//! T = ((1 - A) · S0 · (1 AU / r)² · max(0, n·ŝ) · lit / (ε σ))^¼, floored at `T_FLOOR_K`.
//! Simplified, no thermal inertia: label it that way in the UI.

use crate::constants::{ALBEDO, AU_KM, EMISSIVITY, S0, SIGMA, T_FLOOR_K};

/// Surface normal in the site's East-North-Up frame. `aspect_deg` is the downhill azimuth,
/// clockwise from north; the normal tilts by `slope_deg` towards it.
// shortcut: a missing aspect is treated as flat ground, which underestimates polar temperatures; every real mask writes aspect_deg (ENG-3), so only mocks hit this.
// shortcut: callers pass the grid's slope_deg, which is the MAX of the 2x2 80 m slopes (for the hard slope limit) while aspect comes from the mean gradient, so the tilt runs ~0.6-0.7 deg (median) steeper than the mean surface (~+4 K on a sun-facing slope at grazing Sun, earlier 40 K floor facing away); have the layers stage write a mean-gradient slope for the thermal normal when thermal accuracy matters.
pub fn surface_normal(slope_deg: f64, aspect_deg: Option<f64>) -> [f64; 3] {
    let Some(aspect) = aspect_deg else {
        return [0.0, 0.0, 1.0];
    };
    let (ss, cs) = slope_deg.to_radians().sin_cos();
    let (sa, ca) = aspect.to_radians().sin_cos();
    [ss * sa, ss * ca, cs]
}

/// Surface temperature in K. `sun_enu`: unit vector to the Sun in ENU; `sun_dist_km`: site to Sun;
/// `lit`: visible fraction of the solar disk in [0, 1].
pub fn temp_k(normal: [f64; 3], sun_enu: [f64; 3], sun_dist_km: f64, lit: f64) -> f64 {
    let cos_i = (normal[0] * sun_enu[0] + normal[1] * sun_enu[1] + normal[2] * sun_enu[2]).max(0.0);
    let flux = (1.0 - ALBEDO) * S0 * (AU_KM / sun_dist_km).powi(2) * cos_i * lit;
    (flux / (EMISSIVITY * SIGMA)).powf(0.25).max(T_FLOOR_K)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Unit ENU vector towards (az, el) in degrees.
    fn dir(az: f64, el: f64) -> [f64; 3] {
        let (sa, ca) = az.to_radians().sin_cos();
        let (se, ce) = el.to_radians().sin_cos();
        [ce * sa, ce * ca, se]
    }

    #[test]
    fn subsolar_flat_ground_at_1_au_is_about_386_k() {
        let t = temp_k(surface_normal(0.0, None), [0.0, 0.0, 1.0], AU_KM, 1.0);
        assert!((t - 386.0).abs() < 4.0, "{t}");
    }

    #[test]
    fn shadow_gives_exactly_the_floor() {
        assert_eq!(
            temp_k([0.0, 0.0, 1.0], [0.0, 0.0, 1.0], AU_KM, 0.0),
            T_FLOOR_K
        );
        // Sun behind the surface: cos_i clamps to 0, no negative flux.
        assert_eq!(
            temp_k([0.0, 0.0, 1.0], dir(0.0, -5.0), AU_KM, 1.0),
            T_FLOOR_K
        );
    }

    #[test]
    fn sun_facing_slope_is_hotter_than_flat_at_low_sun() {
        let sun = dir(120.0, 1.5);
        let flat = temp_k(surface_normal(0.0, Some(120.0)), sun, AU_KM, 1.0);
        let facing = temp_k(surface_normal(10.0, Some(120.0)), sun, AU_KM, 1.0);
        let away = temp_k(surface_normal(10.0, Some(300.0)), sun, AU_KM, 1.0);
        // About 386 * sin(1.5 deg)^0.25 ~ 155 K flat, and ~258 K on a 10 deg sun-facing slope.
        assert!(
            (150.0..160.0).contains(&flat) && (250.0..265.0).contains(&facing),
            "{flat} {facing}"
        );
        assert_eq!(away, T_FLOOR_K);
    }

    #[test]
    fn normal_is_unit_and_aspect_wraps() {
        let a = surface_normal(10.0, Some(0.0));
        let b = surface_normal(10.0, Some(360.0));
        assert!((0..3).all(|i| (a[i] - b[i]).abs() < 1e-12));
        assert!((a.iter().map(|x| x * x).sum::<f64>() - 1.0).abs() < 1e-12);
        // Downhill to the east: the normal leans east.
        assert!(surface_normal(10.0, Some(90.0))[0] > 0.17);
    }
}
