//! ENG-8 determinism hash: FNV-1a 64 over canonical little-endian result bytes, prefixed by an
//! engine tag so a hash from another engine build or schema never matches by accident.

use crate::contracts::Metrics;

/// Hashed first: crate version + engine-api schema version. Bump either and every golden changes.
pub const ENGINE_TAG: &[u8] =
    concat!("lunar-engine/", env!("CARGO_PKG_VERSION"), "/schema1").as_bytes();

const OFFSET: u64 = 0xcbf2_9ce4_8422_2325;
const PRIME: u64 = 0x0000_0100_0000_01b3;

/// FNV-1a 64. Floats are written canonically: every NaN payload -> one quiet NaN, -0.0 -> +0.0.
pub struct Fnv64(u64);

impl Default for Fnv64 {
    fn default() -> Self {
        Self(OFFSET)
    }
}

impl Fnv64 {
    /// A hasher that has already absorbed `ENGINE_TAG`.
    pub fn tagged() -> Self {
        let mut h = Self::default();
        h.write_bytes(ENGINE_TAG);
        h
    }

    pub fn write_bytes(&mut self, bytes: &[u8]) {
        for &b in bytes {
            self.0 = (self.0 ^ b as u64).wrapping_mul(PRIME);
        }
    }

    pub fn write_f64(&mut self, x: f64) {
        let x = if x.is_nan() { f64::NAN } else { x + 0.0 }; // -0.0 + 0.0 == +0.0
        self.write_bytes(&x.to_le_bytes());
    }

    pub fn write_f32(&mut self, x: f32) {
        let x = if x.is_nan() { f32::NAN } else { x + 0.0 };
        self.write_bytes(&x.to_le_bytes());
    }

    /// Tag byte 0 for None, 1 then the value for Some, so None never collides with Some(0.0).
    pub fn write_opt(&mut self, x: Option<f64>) {
        match x {
            None => self.write_bytes(&[0]),
            Some(v) => {
                self.write_bytes(&[1]);
                self.write_f64(v);
            }
        }
    }

    /// Every field in engine-api contract order. A new Metrics field must be added here too.
    pub fn write_metrics(&mut self, m: &Metrics) {
        for x in [
            m.pct_lit,
            m.longest_dark_h,
            m.pct_earth_visible,
            m.longest_blackout_h,
        ] {
            self.write_f64(x);
        }
        self.write_opt(m.h_to_first_sunset);
        self.write_opt(m.h_to_first_earthset);
        for x in [
            m.mean_sun_el_deg,
            m.max_sun_el_deg,
            m.mean_power_vertical,
            m.mean_power_horizontal,
            m.t_min_k,
            m.t_max_k,
            m.h_below_survival,
        ] {
            self.write_f64(x);
        }
    }

    /// 16 lowercase hex chars.
    pub fn finish_hex(&self) -> String {
        format!("{:016x}", self.0)
    }
}

/// Tagged hash of raw bytes (e.g. a Float32Array of grid scores viewed as bytes).
pub fn bytes_hex(bytes: &[u8]) -> String {
    let mut h = Fnv64::tagged();
    h.write_bytes(bytes);
    h.finish_hex()
}

/// Tagged hash of a list of Metrics, in list order.
pub fn metrics_hex(list: &[Metrics]) -> String {
    let mut h = Fnv64::tagged();
    for m in list {
        h.write_metrics(m);
    }
    h.finish_hex()
}

/// Ephem angle grid: 2^-13 deg (~1.2e-4 deg, ~2.1e-6 rad). A power of two, so x * 8192 and the
/// division back are exact, and every grid value with |x| < 2048 deg is exact in f32.
pub const QUANTUM_DEG: f64 = 1.0 / 8192.0;

/// Rounds the angle columns (sun_lat, sun_lon, earth_lat, earth_lon) of 6-f32 ephem rows to
/// `QUANTUM_DEG`, in place, so small last-bit trig differences between browsers vanish.
/// shortcut: SPEC asks for 1e-7 rad, which is below the f32 ulp at |lon| > 64 deg (ephem rows are
/// f32), so the grid is 2^-13 deg; values straddling a grid midpoint can still differ, and distance
/// columns stay as f32; upgrade (quantize in f64 in JS before the f32 cast) if live-ephem hashes
/// ever differ across browsers. The shipped Horizons table needs no quantizing (bit-identical bytes).
pub fn quantize_ephem(rows: &mut [f32]) -> Result<(), &'static str> {
    if !rows.len().is_multiple_of(6) {
        return Err("ephem length must be a multiple of 6");
    }
    for row in rows.as_chunks_mut::<6>().0 {
        for c in [0, 1, 3, 4] {
            row[c] = ((row[c] as f64 / QUANTUM_DEG).round() * QUANTUM_DEG) as f32;
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn plain(bytes: &[u8]) -> String {
        let mut h = Fnv64::default();
        h.write_bytes(bytes);
        h.finish_hex()
    }

    #[test]
    fn fnv1a_known_vectors() {
        assert_eq!(plain(b""), "cbf29ce484222325");
        assert_eq!(plain(b"a"), "af63dc4c8601ec8c");
        assert_eq!(plain(b"foobar"), "85944171f73967e8");
        assert_ne!(bytes_hex(b"foobar"), plain(b"foobar")); // tag is mixed in
    }

    fn f64_hex(x: f64) -> String {
        let mut h = Fnv64::default();
        h.write_f64(x);
        h.finish_hex()
    }

    #[test]
    fn floats_are_canonical() {
        let odd_nan = f64::from_bits(0x7ff8_0000_dead_beef);
        assert!(odd_nan.is_nan());
        assert_eq!(f64_hex(odd_nan), f64_hex(f64::NAN));
        assert_eq!(f64_hex(-f64::NAN), f64_hex(f64::NAN));
        assert_eq!(f64_hex(-0.0), f64_hex(0.0));
        assert_ne!(f64_hex(1.0), f64_hex(0.0));
        let (mut a, mut b) = (Fnv64::default(), Fnv64::default());
        a.write_f32(f32::from_bits(0xffc0_0001));
        b.write_f32(f32::NAN);
        assert_eq!(a.finish_hex(), b.finish_hex());
        let (mut a, mut b) = (Fnv64::default(), Fnv64::default());
        a.write_f32(-0.0);
        b.write_f32(0.0);
        assert_eq!(a.finish_hex(), b.finish_hex());
    }

    fn metrics() -> Metrics {
        Metrics {
            pct_lit: 80.0,
            longest_dark_h: 12.0,
            pct_earth_visible: 50.0,
            longest_blackout_h: 100.0,
            h_to_first_sunset: None,
            h_to_first_earthset: Some(3.0),
            mean_sun_el_deg: 1.5,
            max_sun_el_deg: 2.5,
            mean_power_vertical: 0.7,
            mean_power_horizontal: 0.03,
            t_min_k: 40.0,
            t_max_k: 300.0,
            h_below_survival: 5.0,
        }
    }

    #[test]
    fn options_tagged_and_field_order_matters() {
        let m = metrics();
        let zero = Metrics {
            h_to_first_sunset: Some(0.0),
            ..m
        };
        assert_ne!(metrics_hex(&[m]), metrics_hex(&[zero])); // None != Some(0)
        let swapped = Metrics {
            pct_lit: m.longest_dark_h,
            longest_dark_h: m.pct_lit,
            ..m
        };
        assert_ne!(metrics_hex(&[m]), metrics_hex(&[swapped]));
        let other = Metrics {
            t_max_k: 301.0,
            ..m
        };
        assert_ne!(metrics_hex(&[m, other]), metrics_hex(&[other, m])); // list order matters
        assert_eq!(metrics_hex(&[m]), metrics_hex(&[m]));
    }

    #[test]
    fn quantize_is_idempotent_and_snaps_to_grid() {
        let q = QUANTUM_DEG as f32;
        let mut rows = vec![
            -1.5 + 0.4 * q,
            359.0 - 0.4 * q,
            1.496e8 + 3.0, // sun lat/lon/dist
            6.0 + 0.3 * q,
            -179.0,
            384_399.7, // earth lat/lon/dist
        ];
        quantize_ephem(&mut rows).unwrap();
        assert_eq!(rows, [-1.5, 359.0, 1.496e8 + 3.0, 6.0, -179.0, 384_399.7]);
        let once = rows.clone();
        quantize_ephem(&mut rows).unwrap();
        assert_eq!(rows, once);
        // Any f32 near 360 snaps to an exact grid value and is then stable.
        let mut r = vec![359.987_6, 0.0, 0.0, 0.0, 0.0, 0.0];
        quantize_ephem(&mut r).unwrap();
        assert_eq!((r[0] as f64 / QUANTUM_DEG).fract(), 0.0);
        assert!(quantize_ephem(&mut [0.0; 5]).is_err());
    }
}
