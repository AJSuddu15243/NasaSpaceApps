//! Native horizon mask builder (ENG-3). Runs offline over the pipeline's DEM tiles; never shipped to the browser.
//!
//! masks --region R --near N.json --far F.json --grid G.json --sites S.json --out DATA_DIR
//!       [--max-km 150] [--observer-m 2] [--force]
//!
//! Writes DATA_DIR/masks/{id}.json (360 bins) for every site inside the near tile, and the 64-bin
//! `mask` layer of every grid cell into G.json/.bin (replacing an older one). Skips the region when its
//! outputs are newer than its inputs and the grid already has a mask layer, unless --force. Run it after
//! the pipeline's `layers` stage: that stage rewrites the grid without the mask.

use std::path::{Path, PathBuf};
use std::time::{Instant, SystemTime, UNIX_EPOCH};

use lunar_engine::contracts::{Dtype, GridHeader, GridLayer, GridLayerInfo, SiteMask, TileHeader};
use lunar_engine::geometry::to_xy;
use lunar_engine::grid;
use lunar_engine::mask::{Dem, encode_i16, horizon};
use serde::Deserialize;

const SITE_BINS: usize = 360; // site-mask schema const
const SUB_RAYS: usize = 4;

#[derive(Debug)]
struct Args {
    region: String,
    near: PathBuf,
    far: PathBuf,
    grid: PathBuf,
    sites: PathBuf,
    out: PathBuf,
    max_km: f64,
    observer_m: f64,
    force: bool,
}

fn parse_args(mut it: impl Iterator<Item = String>) -> Result<Args, String> {
    let (mut region, mut near, mut far, mut grid, mut sites, mut out) =
        (None, None, None, None, None, None);
    let (mut max_km, mut observer_m, mut force) = (150.0, 2.0, false);
    while let Some(flag) = it.next() {
        if flag == "--force" {
            force = true;
            continue;
        }
        let val = it.next().ok_or_else(|| format!("{flag}: missing value"))?;
        let num = || {
            val.parse::<f64>()
                .ok()
                .filter(|v| v.is_finite() && *v >= 0.0)
                .ok_or(format!("{flag}: expected a number >= 0"))
        };
        match flag.as_str() {
            "--region" => region = Some(val),
            "--near" => near = Some(val.into()),
            "--far" => far = Some(val.into()),
            "--grid" => grid = Some(val.into()),
            "--sites" => sites = Some(val.into()),
            "--out" => out = Some(val.into()),
            "--max-km" => max_km = num()?,
            "--observer-m" => observer_m = num()?,
            _ => return Err(format!("unknown flag {flag}")),
        }
    }
    let need = |v: Option<PathBuf>, f: &str| v.ok_or(format!("{f} is required"));
    if max_km <= 0.0 {
        return Err("--max-km must be > 0".into());
    }
    Ok(Args {
        region: region.ok_or("--region is required")?,
        near: need(near, "--near")?,
        far: need(far, "--far")?,
        grid: need(grid, "--grid")?,
        sites: need(sites, "--sites")?,
        out: need(out, "--out")?,
        max_km,
        observer_m,
        force,
    })
}

/// Only the fields the builder needs, so both a {id, lat, lon} list and sites.json are accepted.
#[derive(Deserialize)]
struct SiteIn {
    id: String,
    lat: f64,
    lon: f64,
}

fn read(p: &Path) -> Result<Vec<u8>, String> {
    std::fs::read(p).map_err(|e| format!("{}: {e}", p.display()))
}

fn read_json<T: serde::de::DeserializeOwned>(p: &Path) -> Result<T, String> {
    serde_json::from_slice(&read(p)?).map_err(|e| format!("{}: {e}", p.display()))
}

fn read_tile(json: &Path) -> Result<Dem, String> {
    let h: TileHeader = read_json(json)?;
    Dem::from_le_bytes(h, &read(&json.with_extension("bin"))?)
}

/// Write via a temp file + rename so a crash never leaves a half-written output.
fn write(p: &Path, bytes: &[u8]) -> Result<(), String> {
    let tmp = p.with_extension("tmp");
    std::fs::write(&tmp, bytes)
        .and_then(|_| std::fs::rename(&tmp, p))
        .map_err(|e| format!("{}: {e}", p.display()))
}

fn mtime(p: &Path) -> Option<SystemTime> {
    std::fs::metadata(p).and_then(|m| m.modified()).ok()
}

/// UTC ISO 8601 from Unix seconds (Hinnant's civil_from_days).
fn iso_utc(secs: i64) -> String {
    let (days, sod) = (secs.div_euclid(86_400), secs.rem_euclid(86_400));
    let z = days + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = yoe + era * 400 + i64::from(m <= 2);
    format!(
        "{y:04}-{m:02}-{d:02}T{:02}:{:02}:{:02}Z",
        sod / 3600,
        sod % 3600 / 60,
        sod % 60
    )
}

fn run(a: &Args) -> Result<String, String> {
    let t0 = Instant::now();
    let near = read_tile(&a.near)?;
    let sites: Vec<SiteIn> = read_json(&a.sites)?;
    let mut inside = Vec::new();
    for s in &sites {
        if let Some((x, y)) = to_xy(s.lat, s.lon).filter(|&(x, y)| near.sample(x, y).is_some()) {
            inside.push((s, x, y));
        }
    }
    let mask_dir = a.out.join("masks");
    let mask_path = |id: &str| mask_dir.join(format!("{id}.json"));
    let grid_bin = a.grid.with_extension("bin");
    let mut h: GridHeader = read_json(&a.grid)?;

    let newest_in = [
        &a.near,
        &a.near.with_extension("bin"),
        &a.far,
        &a.far.with_extension("bin"),
        &a.sites,
    ]
    .iter()
    .map(|p| mtime(p))
    .collect::<Option<Vec<_>>>()
    .and_then(|v| v.into_iter().max());
    let mut outs: Vec<PathBuf> = inside.iter().map(|(s, _, _)| mask_path(&s.id)).collect();
    outs.push(a.grid.clone());
    let oldest_out = outs
        .iter()
        .map(|p| mtime(p))
        .collect::<Option<Vec<_>>>()
        .and_then(|v| v.into_iter().min());
    if !a.force
        && h.layer_info.contains_key(&GridLayer::Mask)
        && matches!((newest_in, oldest_out), (Some(i), Some(o)) if o >= i)
    {
        return Ok(format!(
            "masks: {} up to date (use --force to rebuild)",
            a.region
        ));
    }

    let far = read_tile(&a.far)?;
    let max_m = a.max_km * 1000.0;
    let mut min_reach = f64::INFINITY;
    let mut source_urls = near.header.source_urls.clone();
    for u in &far.header.source_urls {
        if !source_urls.contains(u) {
            source_urls.push(u.clone());
        }
    }
    let generated_at = iso_utc(
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|e| e.to_string())?
            .as_secs() as i64,
    );

    // Sites: elevation from the near tile, slope/aspect from the nearest grid cell (the layers stage owns them).
    let bin = read(&grid_bin)?;
    let slope = grid::decode_layer(&h, &bin, GridLayer::SlopeDeg)?;
    let aspect = grid::decode_layer(&h, &bin, GridLayer::AspectDeg)?;
    std::fs::create_dir_all(&mask_dir).map_err(|e| format!("{}: {e}", mask_dir.display()))?;
    for (s, x, y) in &inside {
        let hz = horizon(
            &near,
            &far,
            *x,
            *y,
            SITE_BINS,
            max_m,
            a.observer_m,
            SUB_RAYS,
        )?;
        min_reach = hz.reach_m.iter().fold(min_reach, |m, r| m.min(*r));
        let nearest = |v: f64, v0: f64, n: u32| {
            (((v - v0) / h.cell_m).round().max(0.0) as usize).min(n as usize - 1)
        };
        let i = nearest(*y, h.y0, h.ny) * h.nx as usize + nearest(*x, h.x0, h.nx);
        let m = SiteMask {
            schema_version: 1,
            generated_at: generated_at.clone(),
            source_urls: source_urls.clone(),
            id: s.id.clone(),
            lat: s.lat,
            lon: s.lon,
            elev_m: near.sample(*x, *y).ok_or("site left the near tile")?,
            aspect_deg: Some(aspect[i] as f64).filter(|v| v.is_finite()),
            slope_deg: slope[i] as f64,
            bins: SITE_BINS as u32,
            mask_deg: hz
                .el_deg
                .iter()
                .map(|&e| encode_i16(e) as f64 / 100.0)
                .collect(),
            max_distance_km: a.max_km,
            dem_source: format!(
                "LOLA LDEM_80S_80MPP_ADJ ({} m near field, {} m far field)",
                near.header.cell_m, far.header.cell_m
            ),
        };
        let text = serde_json::to_string_pretty(&m).map_err(|e| e.to_string())? + "\n";
        write(&mask_path(&s.id), text.as_bytes())?;
    }
    if inside.len() < sites.len() {
        eprintln!(
            "masks: {}: {} of {} sites are outside the near tile, skipped",
            a.region,
            sites.len() - inside.len(),
            sites.len()
        );
    }

    // Grid: each thread fills its own contiguous rows, so the output does not depend on scheduling.
    let (nx, n, bins) = (h.nx as usize, (h.nx * h.ny) as usize, h.bins as usize);
    let mut cells = vec![0i16; n * bins];
    let threads = std::thread::available_parallelism().map_or(4, |t| t.get());
    let rows_per = (h.ny as usize).div_ceil(threads).max(1);
    let hr = &h;
    let reaches = std::thread::scope(|sc| {
        let jobs: Vec<_> = cells
            .chunks_mut(rows_per * nx * bins)
            .enumerate()
            .map(|(k, chunk)| {
                let (near, far) = (&near, &far);
                sc.spawn(move || -> Result<f64, String> {
                    let mut reach = f64::INFINITY;
                    for (j, out) in chunk.chunks_mut(bins).enumerate() {
                        let (x, y) = grid::cell_xy(hr, k * rows_per * nx + j);
                        let hz = horizon(near, far, x, y, bins, max_m, a.observer_m, SUB_RAYS)?;
                        for (o, e) in out.iter_mut().zip(&hz.el_deg) {
                            *o = encode_i16(*e);
                        }
                        reach = hz.reach_m.iter().fold(reach, |m, r| m.min(*r));
                    }
                    Ok(reach)
                })
            })
            .collect();
        jobs.into_iter()
            .map(|j| j.join().map_err(|_| "worker panicked".to_string())?)
            .collect::<Result<Vec<_>, _>>()
    })?;
    min_reach = reaches.into_iter().fold(min_reach, f64::min);

    let mut bin = bin;
    let info = GridLayerInfo {
        dtype: Dtype::Int16,
        scale: 0.01,
        offset: 0.0,
        units: "deg".into(),
        components: bins as u32,
        nodata: None,
        byte_offset: 0,
        byte_length: 0,
        proxy: false,
        note: Some(format!(
            "Horizon elevation per bin = max over {SUB_RAYS} rays across the bin, terrain to {} km on the 1737.4 km sphere",
            a.max_km
        )),
    };
    let data: Vec<u8> = cells.iter().flat_map(|v| v.to_le_bytes()).collect();
    grid::write_layer(&mut h, &mut bin, GridLayer::Mask, info, &data)?;
    h.generated_at = generated_at;
    write(&grid_bin, &bin)?;
    write(
        &a.grid,
        (serde_json::to_string_pretty(&h).map_err(|e| e.to_string())? + "\n").as_bytes(),
    )?;

    if min_reach < max_m {
        eprintln!(
            "masks: {}: shortest ray reached {:.1} km < {} km (far tile edge)",
            a.region,
            min_reach / 1000.0,
            a.max_km
        );
    }
    let secs = t0.elapsed().as_secs_f64();
    Ok(format!(
        "masks: {} sites={} cells={n} in {secs:.1} s ({:.0} cells/s, {threads} threads), min reach {:.1} km",
        a.region,
        inside.len(),
        n as f64 / secs,
        min_reach / 1000.0
    ))
}

fn main() {
    match parse_args(std::env::args().skip(1)).and_then(|a| run(&a)) {
        Ok(line) => println!("{line}"),
        Err(e) => {
            eprintln!("masks: {e}");
            std::process::exit(1);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use lunar_engine::contracts::CrsParams;
    use std::collections::BTreeMap;

    fn args(s: &str) -> Result<Args, String> {
        parse_args(s.split_whitespace().map(String::from))
    }

    #[test]
    fn parses_flags_and_defaults() {
        let a = args("--region r --near n.json --far f.json --grid g.json --sites s.json --out d")
            .unwrap();
        assert_eq!(
            (a.region.as_str(), a.max_km, a.observer_m, a.force),
            ("r", 150.0, 2.0, false)
        );
        let a = args("--force --region r --near n --far f --grid g --sites s --out d --max-km 50 --observer-m 0").unwrap();
        assert_eq!((a.max_km, a.observer_m, a.force), (50.0, 0.0, true));
        assert!(args("--region r").is_err());
        assert!(args("--region r --near n --far f --grid g --sites s --out d --max-km x").is_err());
        assert!(args("--region r --near n --far f --grid g --sites s --out d --max-km 0").is_err());
        assert!(args("--bogus 1").is_err());
    }

    #[test]
    fn iso_utc_known_dates() {
        assert_eq!(iso_utc(0), "1970-01-01T00:00:00Z");
        assert_eq!(iso_utc(951_782_400), "2000-02-29T00:00:00Z");
        assert_eq!(iso_utc(1_700_000_000), "2023-11-14T22:13:20Z");
    }

    fn tile_header(cx: f64, cy: f64, cell: f64, n: u32) -> TileHeader {
        let half = cell * (n - 1) as f64 / 2.0;
        TileHeader {
            schema_version: 1,
            generated_at: "2026-11-14T00:00:00Z".into(),
            source_urls: vec!["https://pgda.gsfc.nasa.gov/products/90".into()],
            region: "syn".into(),
            crs: "polar-stereo-south".into(),
            crs_params: CrsParams {
                lat_0: -90.0,
                lon_0: 0.0,
                radius_m: 1_737_400.0,
            },
            x0: cx - half,
            y0: cy - half,
            cell_m: cell,
            nx: n,
            ny: n,
            dtype: Dtype::Float32,
            units: "m".into(),
            nodata: None,
            height_reference_radius_m: 1_737_400.0,
        }
    }

    fn put(dir: &Path, name: &str, json: &impl serde::Serialize, bin: &[u8]) -> PathBuf {
        let p = dir.join(format!("{name}.json"));
        std::fs::write(&p, serde_json::to_string(json).unwrap()).unwrap();
        std::fs::write(p.with_extension("bin"), bin).unwrap();
        p
    }

    #[test]
    fn end_to_end_on_synthetic_tiles() {
        let dir = std::env::temp_dir().join(format!("masks-e2e-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(dir.join("grid")).unwrap();
        let (cx, cy) = to_xy(-86.0, 10.0).unwrap();
        let tile = |cell, n| {
            let h = tile_header(cx, cy, cell, n);
            // A plane rising 3 m per 80 m towards +x, the same surface in both tiles.
            let z: Vec<u8> = (0..n * n)
                .map(|i| (500.0 + (h.x0 + (i % n) as f64 * cell - cx) * 0.0375) as f32)
                .flat_map(f32::to_le_bytes)
                .collect();
            (h, z)
        };
        let (nh, nz) = tile(80.0, 21);
        let (fh, fz) = tile(240.0, 101);
        let near = put(&dir, "syn_80m", &nh, &nz);
        let far = put(&dir, "syn_240m", &fh, &fz);
        let (gn, cell) = (5u32, 160.0);
        let n = (gn * gn) as usize;
        let layer = |off| GridLayerInfo {
            dtype: Dtype::Float32,
            scale: 1.0,
            offset: 0.0,
            units: "deg".into(),
            components: 1,
            nodata: None,
            byte_offset: off,
            byte_length: n as u64 * 4,
            proxy: false,
            note: None,
        };
        let g = GridHeader {
            schema_version: 1,
            generated_at: "2026-11-14T00:00:00Z".into(),
            source_urls: vec!["https://pgda.gsfc.nasa.gov/products/90".into()],
            region: "syn".into(),
            crs: "polar-stereo-south".into(),
            crs_params: nh.crs_params,
            x0: cx - 2.0 * cell,
            y0: cy - 2.0 * cell,
            cell_m: cell,
            nx: gn,
            ny: gn,
            bins: 64,
            layers: vec![GridLayer::SlopeDeg, GridLayer::AspectDeg],
            layer_info: BTreeMap::from([
                (GridLayer::SlopeDeg, layer(0)),
                (GridLayer::AspectDeg, layer(n as u64 * 4)),
            ]),
        };
        let gbin: Vec<u8> = (0..2 * n)
            .flat_map(|i| (if i < n { 2.0f32 } else { 270.0 }).to_le_bytes())
            .collect();
        let grid = put(&dir.join("grid"), "syn", &g, &gbin);
        let sites = dir.join("sites.json");
        let lat = -86.000123456789;
        std::fs::write(&sites, format!(r#"[{{"id":"in","lat":{lat},"lon":10.0,"name":"x"}},{{"id":"out","lat":-80.0,"lon":0.0}}]"#)).unwrap();
        let a = args(&format!(
            "--region syn --near {} --far {} --grid {} --sites {} --out {} --max-km 20",
            near.display(),
            far.display(),
            grid.display(),
            sites.display(),
            dir.display()
        ))
        .unwrap();

        let line = run(&a).unwrap();
        assert!(line.contains("sites=1 cells=25"), "{line}");
        let m: SiteMask =
            serde_json::from_slice(&std::fs::read(dir.join("masks/in.json")).unwrap()).unwrap();
        assert_eq!(
            (m.lat, m.lon, m.bins, m.mask_deg.len()),
            (lat, 10.0, 360, 360)
        );
        assert_eq!((m.slope_deg, m.aspect_deg), (2.0, Some(270.0)));
        assert!(
            m.mask_deg
                .iter()
                .all(|v| (v * 100.0 - (v * 100.0).round()).abs() < 1e-9)
        );
        assert!(!dir.join("masks/out.json").exists());
        let h: GridHeader = serde_json::from_slice(&std::fs::read(&grid).unwrap()).unwrap();
        let bin = std::fs::read(grid.with_extension("bin")).unwrap();
        let info = &h.layer_info[&GridLayer::Mask];
        assert_eq!(
            (info.byte_offset, info.byte_length),
            (n as u64 * 8, n as u64 * 64 * 2)
        );
        assert_eq!(bin.len() as u64, info.byte_offset + info.byte_length);
        assert_eq!(
            grid::decode_layer(&h, &bin, GridLayer::SlopeDeg).unwrap(),
            vec![2.0; n]
        );
        let mask = grid::decode_layer(&h, &bin, GridLayer::Mask).unwrap();
        // Uphill (east, roughly +x here) the horizon is the 2.1 deg plane; downhill it drops away.
        assert!(
            mask[16] > 1.5 && mask[48] < -1.5,
            "{} {}",
            mask[16],
            mask[48]
        );

        assert!(run(&a).unwrap().contains("up to date"));
        let forced = Args { force: true, ..a };
        assert!(run(&forced).unwrap().contains("cells=25"));
        let h2: GridHeader = serde_json::from_slice(&std::fs::read(&grid).unwrap()).unwrap();
        assert_eq!(
            h2.layers.iter().filter(|l| **l == GridLayer::Mask).count(),
            1
        );
        assert_eq!(
            std::fs::read(grid.with_extension("bin")).unwrap().len(),
            bin.len()
        );
        std::fs::remove_dir_all(&dir).unwrap();
    }
}
