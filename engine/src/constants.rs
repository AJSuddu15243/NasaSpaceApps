//! Physical constants shared by geometry, solar and thermal code (SPEC "Simulation model").

/// Mean lunar radius, m (LOLA reference sphere, matches the DEM datum).
pub const R_M: f64 = 1_737_400.0;
/// Solar radius, km (IAU 2015 nominal).
pub const R_SUN_KM: f64 = 695_700.0;
/// Mean Earth radius, km.
pub const R_EARTH_KM: f64 = 6_371.0;
/// Astronomical unit, km (IAU 2012, exact).
pub const AU_KM: f64 = 149_597_870.7;
/// Solar constant at 1 AU, W/m².
pub const S0: f64 = 1361.0;
/// Bond albedo of the regolith (SPEC A ≈ 0.12).
pub const ALBEDO: f64 = 0.12;
/// Infrared emissivity of the regolith (SPEC ε ≈ 0.95).
pub const EMISSIVITY: f64 = 0.95;
/// Stefan-Boltzmann constant, W/(m²·K⁴) (CODATA 2018, exact).
pub const SIGMA: f64 = 5.670_374_419e-8;
/// Temperature used for shadowed hours, K.
// shortcut: fixed 40 K floor for unlit hours (no thermal inertia), replace with Diviner night temps or a 1D heat model if thermal accuracy matters.
pub const T_FLOOR_K: f64 = 40.0;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn subsolar_equilibrium_is_plausible() {
        // Noon at 1 AU on flat ground: ((1-A) S0 / (eps sigma))^0.25 is about 384 K, near Diviner equatorial maxima.
        let t = ((1.0 - ALBEDO) * S0 / (EMISSIVITY * SIGMA)).powf(0.25);
        assert!((380.0..390.0).contains(&t), "{t}");
    }
}
