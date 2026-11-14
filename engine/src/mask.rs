//! Horizon masks (ENG-3): highest terrain elevation angle per azimuth bin, from DEM tiles on the
//! 1737.4 km sphere. Pure (no I/O, no threads) so it also compiles for wasm32; bin/masks.rs drives it.
//!
//! Method: from an observer `observer_m` above the bilinear DEM surface, each ray marches a great circle
//! as a 3D destination vector dir = cos(d/R) up + sin(d/R) t (t = horizontal unit vector at the azimuth),
//! projected to south polar stereo to sample the DEM. The first sample is one step out (no self-hit);
//! the step is the cell size of the tile being sampled (near 80 m, then far 240 m); rays stop at
//! `max_m` or the far tile's edge, and the distance reached is recorded. Elevation of terrain point Q
//! seen from P is asin((Q - P) . up / |Q - P|); no refraction (the Moon has no atmosphere).
//! A bin is the max over `sub_rays` rays spread evenly across it (sector max, centred on b * 360 / bins),
//! so narrow peaks between ray azimuths are not missed; that errs towards less Sun/Earth (safe side).

use crate::constants::R_M;
use crate::contracts::{Dtype, TileHeader};
use crate::geometry::{enu, to_latlon};

/// A DEM tile (contract `tile`): heights in metres above the R_M sphere, row-major, rows grow with +y.
pub struct Dem {
    pub header: TileHeader,
    z: Vec<f32>,
}

impl Dem {
    pub fn from_parts(header: TileHeader, z: Vec<f32>) -> Result<Self, String> {
        let h = &header;
        let p = h.crs_params;
        if h.crs != "polar-stereo-south" || p.lat_0 != -90.0 || p.lon_0 != 0.0 || p.radius_m != R_M
        {
            return Err(format!(
                "{}: crs must be polar-stereo-south on R = {R_M} m",
                h.region
            ));
        }
        if h.height_reference_radius_m != R_M || h.dtype != Dtype::Float32 || h.units != "m" {
            return Err(format!(
                "{}: heights must be float32 m above R = {R_M} m",
                h.region
            ));
        }
        if h.nx < 2 || h.ny < 2 || !(h.cell_m.is_finite() && h.cell_m > 0.0) {
            return Err(format!("{}: need nx, ny >= 2 and cell_m > 0", h.region));
        }
        if z.len() != h.nx as usize * h.ny as usize {
            return Err(format!(
                "{}: {} heights != nx * ny = {}",
                h.region,
                z.len(),
                h.nx * h.ny
            ));
        }
        // shortcut: a tile with any gap is rejected (PGDA 80S has none in our regions), fill or mask gaps if a new DEM has them.
        if let Some(i) = z
            .iter()
            .position(|v| !v.is_finite() || h.nodata == Some(*v as f64))
        {
            return Err(format!(
                "{}: nodata or non-finite height at index {i}",
                h.region
            ));
        }
        Ok(Dem { header, z })
    }

    /// From the tile's .bin bytes (little-endian f32).
    pub fn from_le_bytes(header: TileHeader, bytes: &[u8]) -> Result<Self, String> {
        if !bytes.len().is_multiple_of(4) {
            return Err(format!(
                "{}: .bin length {} is not a multiple of 4",
                header.region,
                bytes.len()
            ));
        }
        let z = bytes
            .as_chunks::<4>()
            .0
            .iter()
            .map(|b| f32::from_le_bytes(*b))
            .collect();
        Dem::from_parts(header, z)
    }

    /// Bilinear height at stereo (x, y), or None outside the tile's cell centres.
    pub fn sample(&self, x: f64, y: f64) -> Option<f64> {
        let h = &self.header;
        let (nx, ny) = (h.nx as usize, h.ny as usize);
        let (fc, fr) = ((x - h.x0) / h.cell_m, (y - h.y0) / h.cell_m);
        if !(fc >= 0.0 && fr >= 0.0 && fc <= (nx - 1) as f64 && fr <= (ny - 1) as f64) {
            return None;
        }
        let (c, r) = ((fc as usize).min(nx - 2), (fr as usize).min(ny - 2));
        let (tx, ty) = (fc - c as f64, fr - r as f64);
        let i = r * nx + c;
        let z = |k: usize| self.z[k] as f64;
        Some(
            (z(i) * (1.0 - tx) + z(i + 1) * tx) * (1.0 - ty)
                + (z(i + nx) * (1.0 - tx) + z(i + nx + 1) * tx) * ty,
        )
    }
}

/// Stereo (x, y) of a unit vector, same projection as geometry::to_xy without trig (south hemisphere only).
fn stereo_xy(v: [f64; 3]) -> (f64, f64) {
    let k = 2.0 * R_M / (1.0 - v[2]);
    (k * v[1], k * v[0])
}

pub struct Horizon {
    /// Horizon elevation per bin, degrees; bin b is centred on azimuth b * 360 / bins (clockwise from north).
    pub el_deg: Vec<f64>,
    /// Shortest distance any sub-ray of the bin reached before `max_m` or the tile edge, metres.
    pub reach_m: Vec<f64>,
}

/// Horizon mask at stereo (x, y). Samples `near` where it covers the ray, else `far`.
#[allow(clippy::too_many_arguments)]
pub fn horizon(
    near: &Dem,
    far: &Dem,
    x: f64,
    y: f64,
    bins: usize,
    max_m: f64,
    observer_m: f64,
    sub_rays: usize,
) -> Result<Horizon, String> {
    if bins == 0 || sub_rays == 0 || !(max_m.is_finite() && max_m > 0.0) || !observer_m.is_finite()
    {
        return Err("need bins, sub_rays >= 1, max_m > 0 and a finite observer height".into());
    }
    let at = |px: f64, py: f64| {
        near.sample(px, py)
            .map(|z| (z, near.header.cell_m))
            .or_else(|| far.sample(px, py).map(|z| (z, far.header.cell_m)))
    };
    let (z0, first_step) =
        at(x, y).ok_or_else(|| format!("observer ({x}, {y}) is outside both tiles"))?;
    let p = R_M + z0 + observer_m;
    let (lat, lon) = to_latlon(x, y);
    let f = enu(lat, lon);

    let mut el_deg = Vec::with_capacity(bins);
    let mut reach_m = Vec::with_capacity(bins);
    for b in 0..bins {
        let (mut best, mut reach) = (-1.0f64, f64::INFINITY); // best = sin(el); -1 is straight down
        for k in 0..sub_rays {
            let az = ((b as f64 + (k as f64 + 0.5) / sub_rays as f64 - 0.5) * 360.0 / bins as f64)
                .to_radians();
            let (sa, ca) = az.sin_cos();
            let t = [
                ca * f.n[0] + sa * f.e[0],
                ca * f.n[1] + sa * f.e[1],
                ca * f.n[2] + sa * f.e[2],
            ];
            let (mut d, mut step, mut ray_reach) = (0.0, first_step, 0.0);
            loop {
                d += step;
                if d > max_m {
                    break;
                }
                let (s, c) = (d / R_M).sin_cos();
                let dir = [
                    c * f.u[0] + s * t[0],
                    c * f.u[1] + s * t[1],
                    c * f.u[2] + s * t[2],
                ];
                let (px, py) = stereo_xy(dir);
                let Some((z, cell)) = at(px, py) else { break };
                let r = R_M + z;
                let one_minus_c = s * s / (1.0 + c); // 1 - cos without cancellation
                // (Q - P) . up and |Q - P| in a form that stays exact for nearby samples.
                let num = (r - p) - r * one_minus_c;
                let den = ((r - p) * (r - p) + 2.0 * r * p * one_minus_c).sqrt();
                best = best.max(num / den);
                ray_reach = d;
                step = cell;
            }
            reach = reach.min(ray_reach);
        }
        el_deg.push(best.asin().to_degrees());
        reach_m.push(reach);
    }
    Ok(Horizon { el_deg, reach_m })
}

/// Degrees to stored int16 hundredths (grid `mask` layer: scale 0.01, offset 0).
pub fn encode_i16(deg: f64) -> i16 {
    (deg * 100.0)
        .round()
        .clamp(i16::MIN as f64, i16::MAX as f64) as i16
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::contracts::CrsParams;
    use crate::geometry::{az_el, to_xy, unit_vec};

    const SITE: (f64, f64) = (-85.0, 0.0);

    fn header(x0: f64, y0: f64, cell_m: f64, n: u32) -> TileHeader {
        TileHeader {
            schema_version: 1,
            generated_at: "2026-11-14T00:00:00Z".into(),
            source_urls: vec!["https://example.org".into()],
            region: "synthetic".into(),
            crs: "polar-stereo-south".into(),
            crs_params: CrsParams {
                lat_0: -90.0,
                lon_0: 0.0,
                radius_m: R_M,
            },
            x0,
            y0,
            cell_m,
            nx: n,
            ny: n,
            dtype: Dtype::Float32,
            units: "m".into(),
            nodata: None,
            height_reference_radius_m: R_M,
        }
    }

    /// Square tile of n x n cells centred on (cx, cy), heights from `f(x, y)`.
    fn tile(cx: f64, cy: f64, cell: f64, n: u32, f: &dyn Fn(f64, f64) -> f64) -> Dem {
        let half = cell * (n - 1) as f64 / 2.0;
        let h = header(cx - half, cy - half, cell, n);
        let z = (0..n * n)
            .map(|i| f(h.x0 + (i % n) as f64 * cell, h.y0 + (i / n) as f64 * cell) as f32)
            .collect();
        Dem::from_parts(h, z).unwrap()
    }

    /// near +-4 km @ 80 m, far +-60 km @ 240 m around the site.
    fn pair(f: &dyn Fn(f64, f64) -> f64) -> (Dem, Dem, f64, f64) {
        let (x, y) = to_xy(SITE.0, SITE.1).unwrap();
        (tile(x, y, 80.0, 101, f), tile(x, y, 240.0, 501, f), x, y)
    }

    fn gaussian(cx: f64, cy: f64) -> impl Fn(f64, f64) -> f64 {
        move |x, y| {
            3000.0 * (-((x - cx).powi(2) + (y - cy).powi(2)) / (2.0 * 3000.0f64.powi(2))).exp()
        }
    }

    #[test]
    fn stereo_xy_matches_geometry() {
        for (lat, lon) in [(-85.0, 0.0), (-89.9, -137.0), (-80.0, 179.0)] {
            let (a, b) = (stereo_xy(unit_vec(lat, lon)), to_xy(lat, lon).unwrap());
            assert!(
                (a.0 - b.0).abs() < 1e-6 && (a.1 - b.1).abs() < 1e-6,
                "{a:?} {b:?}"
            );
        }
    }

    #[test]
    fn flat_sphere_gives_the_dip_angle() {
        for z in [0.0, 1500.0] {
            let (near, far, x, y) = pair(&|_, _| z);
            let hz = horizon(&near, &far, x, y, 64, 150_000.0, 2.0, 4).unwrap();
            let r = R_M + z;
            let dip = -(r / (r + 2.0)).acos().to_degrees();
            for (b, el) in hz.el_deg.iter().enumerate() {
                assert!((el - dip).abs() < 0.005, "z {z} bin {b}: {el} vs {dip}");
            }
        }
    }

    #[test]
    fn mountain_due_east_raises_only_eastern_bins() {
        let (x, y) = to_xy(SITE.0, SITE.1).unwrap();
        let (mx, my) = (x + 50_000.0, y); // +x is east at lon 0
        let (near, far, x, y) = pair(&gaussian(mx, my));
        // 360 bins: sub-rays sit within 0.375 deg of the peak azimuth (64-bin sectors would put them 600 m off it).
        let hz = horizon(&near, &far, x, y, 360, 150_000.0, 2.0, 4).unwrap();
        // Expected: elevation of the peak top seen from the observer, exact 3D.
        let site = enu(SITE.0, SITE.1);
        let p = R_M + 2.0;
        let (plat, plon) = to_latlon(mx, my);
        let q = unit_vec(plat, plon).map(|c| c * (R_M + 3000.0));
        let v = [
            q[0] - site.u[0] * p,
            q[1] - site.u[1] * p,
            q[2] - site.u[2] * p,
        ];
        let want = (crate::geometry::dot(v, site.u) / crate::geometry::dot(v, v).sqrt())
            .asin()
            .to_degrees();
        let (az, _) = az_el(&site, p, plat, plon, R_M / 1000.0 + 3.0);
        assert!((az - 90.0).abs() < 0.5, "peak az {az}");
        assert!(
            (hz.el_deg[90] - want).abs() < 0.05,
            "bin 90 {} vs {want}",
            hz.el_deg[90]
        );
        assert!(want > 2.0);
        let dip = -(R_M / (R_M + 2.0)).acos().to_degrees();
        for (b, el) in hz.el_deg.iter().enumerate().skip(180) {
            assert!((el - dip).abs() < 0.005, "bin {b} {el}");
        }
    }

    #[test]
    fn mountain_due_north_wraps_bins_0_and_359() {
        let (x, y) = to_xy(SITE.0, SITE.1).unwrap();
        let (near, far, x, y) = pair(&gaussian(x, y + 50_000.0)); // +y is north (away from the pole) at lon 0
        let hz = horizon(&near, &far, x, y, 360, 150_000.0, 2.0, 4).unwrap();
        assert!(
            hz.el_deg[0] > 2.0 && hz.el_deg[359] > 2.0 && hz.el_deg[1] > 2.0,
            "{:?}",
            &hz.el_deg[..3]
        );
        assert!(hz.el_deg[180] < 0.0 && hz.el_deg[90] < 0.0);
    }

    #[test]
    fn rays_past_the_edge_are_truncated_and_reruns_are_bit_identical() {
        let (x, y) = to_xy(SITE.0, SITE.1).unwrap();
        let (near, far, x, y) = pair(&gaussian(x - 20_000.0, y + 10_000.0));
        let a = horizon(&near, &far, x, y, 64, 150_000.0, 2.0, 4).unwrap();
        assert!(
            a.reach_m.iter().all(|r| (55_000.0..=85_000.0).contains(r)),
            "{:?}",
            a.reach_m
        );
        let b = horizon(&near, &far, x, y, 64, 150_000.0, 2.0, 4).unwrap();
        assert!(
            a.el_deg
                .iter()
                .zip(&b.el_deg)
                .all(|(p, q)| p.to_bits() == q.to_bits())
        );
        // max_m inside the tile: every ray stops at max_m.
        let c = horizon(&near, &far, x, y, 8, 10_000.0, 2.0, 1).unwrap();
        assert!(
            c.reach_m.iter().all(|r| *r <= 10_000.0 && *r > 9_700.0),
            "{:?}",
            c.reach_m
        );
    }

    #[test]
    fn bad_tiles_and_inputs_err() {
        let h = header(0.0, 0.0, 80.0, 3);
        assert!(Dem::from_parts(h.clone(), vec![0.0; 8]).is_err());
        let mut z = vec![0.0; 9];
        z[4] = f32::NAN;
        assert!(Dem::from_parts(h.clone(), z).is_err());
        let mut nd = h.clone();
        nd.nodata = Some(-9999.0);
        assert!(Dem::from_parts(nd, vec![-9999.0; 9]).is_err());
        let mut crs = h.clone();
        crs.crs_params.radius_m = 1_738_000.0;
        assert!(Dem::from_parts(crs, vec![0.0; 9]).is_err());
        assert!(Dem::from_le_bytes(h.clone(), &[0; 35]).is_err());
        let d = Dem::from_le_bytes(h, &[0; 36]).unwrap();
        assert!(horizon(&d, &d, 1e6, 1e6, 64, 1000.0, 2.0, 4).is_err());
        assert!(horizon(&d, &d, 80.0, 80.0, 0, 1000.0, 2.0, 4).is_err());
        assert_eq!(
            (encode_i16(1.234), encode_i16(-0.005), encode_i16(1e9)),
            (123, -1, i16::MAX)
        );
    }

    #[test]
    fn bilinear_sample_interpolates() {
        let d = tile(80.0, 80.0, 80.0, 3, &|x, y| x + 2.0 * y);
        assert_eq!(d.sample(40.0, 120.0), Some(40.0 + 240.0));
        assert_eq!(d.sample(160.0, 160.0), Some(480.0));
        assert_eq!(d.sample(160.1, 0.0), None);
    }
}
