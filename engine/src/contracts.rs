//! Boundary types, copied verbatim from the FND-1 PR (#65); contracts/schemas/*.json is the source of truth.
//! shortcut: hand-copied, not generated; re-copy whenever a schema in contracts/ changes.

use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SiteCategory {
    Artemis3,
    Clps,
    Intl,
    Apollo,
}

/// sites.json is `Vec<Site>`. Degrees, MOON_ME, east-positive longitude in [-180, 180).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Site {
    pub id: String,
    pub name: String,
    pub lat: f64,
    pub lon: f64,
    pub category: SiteCategory,
    pub note: String,
    pub source_url: String,
}

/// masks/{id}.json. mask_deg[i] is the horizon elevation (deg) at azimuth i * 360 / bins, clockwise from north.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SiteMask {
    pub schema_version: u32,
    pub generated_at: String,
    pub source_urls: Vec<String>,
    pub id: String,
    pub lat: f64,
    pub lon: f64,
    pub elev_m: f64,
    /// Optional until ENG-3 / PIPE-8 writes it.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aspect_deg: Option<f64>,
    pub slope_deg: f64,
    pub bins: u32,
    pub mask_deg: Vec<f64>,
    pub max_distance_km: f64,
    pub dem_source: String,
}

/// ephem.json. ephem.bin is n rows x 6 little-endian f32, row k at t0_iso + k * step_hours.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct EphemHeader {
    pub schema_version: u32,
    pub generated_at: String,
    pub source_urls: Vec<String>,
    pub t0_iso: String,
    pub step_hours: f64,
    pub n: u64,
    pub fields: Vec<String>,
    pub dtype: Dtype,
}

/// One row of ephem.bin, in file order. Degrees and kilometres.
#[derive(Debug, Clone, Copy, PartialEq)]
#[repr(C)]
pub struct EphemRow {
    pub sun_lat: f32,
    pub sun_lon: f32,
    pub sun_dist_km: f32,
    pub earth_lat: f32,
    pub earth_lon: f32,
    pub earth_dist_km: f32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Dtype {
    Uint8,
    Int16,
    Uint16,
    Float32,
}

/// South polar stereographic on a sphere: lat_0 = -90, lon_0 = 0, radius_m = 1737400.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CrsParams {
    pub lat_0: f64,
    pub lon_0: f64,
    pub radius_m: f64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum GridLayer {
    Mask,
    SlopeDeg,
    AspectDeg,
    ElevM,
    CraterDepthM,
    RoughnessDeg,
    Rock,
}

/// physical = stored * scale + offset; element (cell i, component c) is at
/// byte_offset + (i * components + c) * itemsize. nodata is a STORED value.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct GridLayerInfo {
    pub dtype: Dtype,
    pub scale: f64,
    pub offset: f64,
    pub units: String,
    pub components: u32,
    pub nodata: Option<f64>,
    pub byte_offset: u64,
    pub byte_length: u64,
}

/// grid/{region}.json. (x0, y0) is the centre of cell (col 0, row 0); col grows with +x,
/// row with +y; index = row * nx + col.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct GridHeader {
    pub schema_version: u32,
    pub generated_at: String,
    pub source_urls: Vec<String>,
    pub region: String,
    pub crs: String,
    pub crs_params: CrsParams,
    pub x0: f64,
    pub y0: f64,
    pub cell_m: f64,
    pub nx: u32,
    pub ny: u32,
    pub bins: u32,
    pub layers: Vec<GridLayer>,
    pub layer_info: BTreeMap<GridLayer, GridLayerInfo>,
}

/// tiles/{region}_{res}m.json. The .bin is nx * ny little-endian f32 heights in metres, same axes as GridHeader.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TileHeader {
    pub schema_version: u32,
    pub generated_at: String,
    pub source_urls: Vec<String>,
    pub region: String,
    pub crs: String,
    pub crs_params: CrsParams,
    pub x0: f64,
    pub y0: f64,
    pub cell_m: f64,
    pub nx: u32,
    pub ny: u32,
    pub dtype: Dtype,
    pub units: String,
    pub nodata: Option<f64>,
    pub height_reference_radius_m: f64,
}

/// Degrees. Azimuth clockwise from local north in [0, 360); elevation above the local horizontal plane.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ValidationSample {
    pub t_iso: String,
    pub sun_az: f64,
    pub sun_el: f64,
    pub earth_az: f64,
    pub earth_el: f64,
}

/// validation/{site_id}.json
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ValidationSet {
    pub schema_version: u32,
    pub generated_at: String,
    pub source_urls: Vec<String>,
    pub site_id: String,
    pub lat: f64,
    pub lon: f64,
    pub elev_m: f64,
    pub samples: Vec<ValidationSample>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ManifestFile {
    pub path: String,
    pub bytes: u64,
    pub sha256: String,
    pub source_urls: Vec<String>,
}

/// manifest.json
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Manifest {
    pub schema_version: u32,
    pub generated_at: String,
    pub files: Vec<ManifestFile>,
}

// ---- engine-api: PROPOSED ----

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Params {
    pub battery_h: f64,
    pub survival_temp_k: f64,
    pub antenna_margin_deg: f64,
    pub slope_limit_deg: f64,
    pub step_hours: f64,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Weights {
    pub sun: f64,
    pub earth: f64,
    pub slope: f64,
    pub crater: f64,
    pub rock: f64,
    pub thermal: f64,
}

/// h_to_first_* are None (JSON null) when there is no such event in the window. Do not skip them when serializing.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Metrics {
    pub pct_lit: f64,
    pub longest_dark_h: f64,
    pub pct_earth_visible: f64,
    pub longest_blackout_h: f64,
    pub h_to_first_sunset: Option<f64>,
    pub h_to_first_earthset: Option<f64>,
    pub mean_sun_el_deg: f64,
    pub max_sun_el_deg: f64,
    pub mean_power_vertical: f64,
    pub mean_power_horizontal: f64,
    pub t_min_k: f64,
    pub t_max_k: f64,
    pub h_below_survival: f64,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Area {
    pub x_m: f64,
    pub y_m: f64,
    pub lat: f64,
    pub lon: f64,
    pub score: f64,
    pub radius_m: f64,
}
