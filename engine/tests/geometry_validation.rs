//! ENG-2 accuracy gate: engine az/el from the shipped ephem table (web/public/data/ephem.bin, f32
//! sub-points) vs every JPL Horizons topocentric sample in web/public/data/validation/*.json.
//! Bar (docs/handoff/START-HERE.md Prompt E): Sun < 0.01 deg, Earth < 0.02 deg great-circle.

use lunar_engine::constants::R_M;
use lunar_engine::geometry::{angle_between_deg, az_el, enu};
use std::path::PathBuf;

/// Days from 1970-01-01 for a proleptic Gregorian date (H. Hinnant's days_from_civil).
fn days_from_civil(y: i64, m: i64, d: i64) -> i64 {
    let y = if m <= 2 { y - 1 } else { y };
    let era = y.div_euclid(400);
    let yoe = y - era * 400;
    let doy = (153 * (m + if m > 2 { -3 } else { 9 }) + 2) / 5 + d - 1;
    era * 146_097 + yoe * 365 + yoe / 4 - yoe / 100 + doy - 719_468
}

/// Whole hours since the Unix epoch for "YYYY-MM-DDTHH:MM:SSZ" (minutes and seconds must be 0).
fn iso_hours(s: &str) -> i64 {
    let n = |a: usize, b: usize| s[a..b].parse::<i64>().unwrap();
    assert!(
        s.len() == 20 && s.ends_with('Z') && n(14, 16) == 0 && n(17, 19) == 0,
        "{s}"
    );
    days_from_civil(n(0, 4), n(5, 7), n(8, 10)) * 24 + n(11, 13)
}

#[test]
fn iso_hours_known_values() {
    assert_eq!(iso_hours("1970-01-01T00:00:00Z"), 0);
    assert_eq!(iso_hours("2026-01-01T00:00:00Z"), 490_896);
    assert_eq!(
        iso_hours("2028-03-01T05:00:00Z") - iso_hours("2028-02-28T00:00:00Z"),
        53
    ); // leap day
}

#[test]
fn horizons_validation_all_samples() {
    let data = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../web/public/data");
    let head: serde_json::Value =
        serde_json::from_slice(&std::fs::read(data.join("ephem.json")).unwrap()).unwrap();
    assert_eq!(head["step_hours"], 1);
    let fields: Vec<&str> = head["fields"]
        .as_array()
        .unwrap()
        .iter()
        .map(|f| f.as_str().unwrap())
        .collect();
    assert_eq!(
        fields,
        [
            "sun_lat",
            "sun_lon",
            "sun_dist_km",
            "earth_lat",
            "earth_lon",
            "earth_dist_km"
        ]
    );
    let t0 = iso_hours(head["t0_iso"].as_str().unwrap());
    let bytes = std::fs::read(data.join("ephem.bin")).unwrap();
    let ephem: Vec<f32> = bytes
        .as_chunks::<4>()
        .0
        .iter()
        .map(|b| f32::from_le_bytes(*b))
        .collect();
    assert_eq!(ephem.len(), head["n"].as_u64().unwrap() as usize * 6);

    let mut files: Vec<_> = std::fs::read_dir(data.join("validation"))
        .unwrap()
        .map(|e| e.unwrap().path())
        .collect();
    files.sort();
    assert!(files.len() >= 3, "expected the 3 PIPE-7 sites");
    let (mut sun_max, mut earth_max, mut count) = (0.0f64, 0.0f64, 0usize);
    for path in &files {
        let v: serde_json::Value = serde_json::from_slice(&std::fs::read(path).unwrap()).unwrap();
        let f = |k: &str| v[k].as_f64().unwrap();
        let (site, r) = (enu(f("lat"), f("lon")), R_M + f("elev_m"));
        let (mut s_max, mut e_max) = (0.0f64, 0.0f64);
        for s in v["samples"].as_array().unwrap() {
            let g = |k: &str| s[k].as_f64().unwrap();
            let k = usize::try_from(iso_hours(s["t_iso"].as_str().unwrap()) - t0).unwrap();
            let row: Vec<f64> = ephem[k * 6..k * 6 + 6].iter().map(|&x| x as f64).collect();
            s_max = s_max.max(angle_between_deg(
                az_el(&site, r, row[0], row[1], row[2]),
                (g("sun_az"), g("sun_el")),
            ));
            e_max = e_max.max(angle_between_deg(
                az_el(&site, r, row[3], row[4], row[5]),
                (g("earth_az"), g("earth_el")),
            ));
            count += 1;
        }
        println!(
            "{}: max sun {s_max:.6} deg, max earth {e_max:.6} deg",
            path.file_name().unwrap().to_string_lossy()
        );
        sun_max = sun_max.max(s_max);
        earth_max = earth_max.max(e_max);
    }
    println!("{count} samples: max sun {sun_max:.6} deg, max earth {earth_max:.6} deg");
    assert!(count >= 3 * 1440, "{count}");
    assert!(
        sun_max < 0.01 && earth_max < 0.02,
        "sun {sun_max} earth {earth_max}"
    );
}
