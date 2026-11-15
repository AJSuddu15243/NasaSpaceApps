//! Grid layer stack (grid/{region}.bin + .json, contract `grid`): header-driven decode and write.
//! Element (cell i, component c) is the little-endian value at byte_offset + (i * components + c) * itemsize;
//! physical = stored * scale + offset; a stored value equal to `nodata` decodes to NaN.

use crate::contracts::{Dtype, GridHeader, GridLayer, GridLayerInfo};

pub fn itemsize(d: Dtype) -> usize {
    match d {
        Dtype::Uint8 => 1,
        Dtype::Int16 | Dtype::Uint16 => 2,
        Dtype::Float32 => 4,
    }
}

fn expected_len(h: &GridHeader, dtype: Dtype, components: u32) -> usize {
    h.nx as usize * h.ny as usize * components as usize * itemsize(dtype)
}

/// Physical values of `layer`, n * components long (cell-major), NaN where the stored value is nodata.
pub fn decode_layer(h: &GridHeader, bin: &[u8], layer: GridLayer) -> Result<Vec<f32>, String> {
    let info = h
        .layer_info
        .get(&layer)
        .ok_or_else(|| format!("{layer:?}: not in layer_info"))?;
    let (off, len) = (info.byte_offset as usize, info.byte_length as usize);
    if len != expected_len(h, info.dtype, info.components) {
        return Err(format!(
            "{layer:?}: byte_length {len} != nx * ny * components * itemsize"
        ));
    }
    let bytes = off
        .checked_add(len)
        .and_then(|end| bin.get(off..end))
        .ok_or_else(|| {
            format!(
                "{layer:?}: bytes {off}..+{len} outside the {} byte .bin",
                bin.len()
            )
        })?;
    let k = itemsize(info.dtype);
    Ok(bytes
        .chunks_exact(k)
        .map(|b| {
            let stored = match info.dtype {
                Dtype::Uint8 => b[0] as f64,
                Dtype::Int16 => i16::from_le_bytes([b[0], b[1]]) as f64,
                Dtype::Uint16 => u16::from_le_bytes([b[0], b[1]]) as f64,
                Dtype::Float32 => f32::from_le_bytes([b[0], b[1], b[2], b[3]]) as f64,
            };
            if info.nodata == Some(stored) || stored.is_nan() {
                f32::NAN
            } else {
                (stored * info.scale + info.offset) as f32
            }
        })
        .collect())
}

/// Stereo (x, y) in metres of the centre of cell index i (= row * nx + col).
pub fn cell_xy(h: &GridHeader, i: usize) -> (f64, f64) {
    let (row, col) = (i / h.nx as usize, i % h.nx as usize);
    (h.x0 + col as f64 * h.cell_m, h.y0 + row as f64 * h.cell_m)
}

/// Replace `layer` if present, else add it, always as the last block of the .bin. `info`'s byte_offset
/// and byte_length are overwritten; `data` is the stored little-endian bytes.
pub fn write_layer(
    h: &mut GridHeader,
    bin: &mut Vec<u8>,
    layer: GridLayer,
    mut info: GridLayerInfo,
    data: &[u8],
) -> Result<(), String> {
    if data.len() != expected_len(h, info.dtype, info.components) {
        return Err(format!(
            "{layer:?}: {} bytes != nx * ny * components * itemsize",
            data.len()
        ));
    }
    if let Some(old) = h.layer_info.remove(&layer) {
        let (off, len) = (old.byte_offset as usize, old.byte_length as usize);
        if off + len > bin.len() {
            return Err(format!("{layer:?}: existing layer outside the .bin"));
        }
        bin.drain(off..off + len);
        for other in h.layer_info.values_mut() {
            if other.byte_offset as usize > off {
                other.byte_offset -= len as u64;
            }
        }
        h.layers.retain(|l| *l != layer);
    }
    info.byte_offset = bin.len() as u64;
    info.byte_length = data.len() as u64;
    bin.extend_from_slice(data);
    h.layers.push(layer);
    h.layer_info.insert(layer, info);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    const DATA: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/../web/public/data/");

    fn load(name: &str) -> (GridHeader, Vec<u8>) {
        let h =
            serde_json::from_str(&std::fs::read_to_string(format!("{DATA}{name}.json")).unwrap())
                .unwrap();
        (h, std::fs::read(format!("{DATA}{name}.bin")).unwrap())
    }

    #[test]
    fn decodes_mock_mask_and_real_layers() {
        let (h, bin) = load("mock/grid/demo");
        let mask = decode_layer(&h, &bin, GridLayer::Mask).unwrap();
        assert_eq!(mask.len(), 64);
        let raw = i16::from_le_bytes([bin[0], bin[1]]) as f32 * 0.01;
        assert!((mask[0] - raw).abs() < 1e-6, "{} vs {raw}", mask[0]);

        let (h, bin) = load("grid/haworth");
        let slope = decode_layer(&h, &bin, GridLayer::SlopeDeg).unwrap();
        assert_eq!(slope.len(), (h.nx * h.ny) as usize);
        assert!(
            slope
                .iter()
                .all(|s| s.is_finite() && (0.0..90.0).contains(s))
        );
        assert_eq!(
            cell_xy(&h, h.nx as usize + 2),
            (h.x0 + 2.0 * h.cell_m, h.y0 + h.cell_m)
        );
    }

    #[test]
    fn nodata_is_nan_and_bad_lengths_err() {
        let (mut h, mut bin) = load("mock/grid/demo");
        let info = h.layer_info.get_mut(&GridLayer::Mask).unwrap();
        info.nodata = Some(i16::from_le_bytes([bin[0], bin[1]]) as f64);
        assert!(decode_layer(&h, &bin, GridLayer::Mask).unwrap()[0].is_nan());
        bin.pop();
        assert!(decode_layer(&h, &bin, GridLayer::Mask).is_err());
        h.layer_info.get_mut(&GridLayer::Mask).unwrap().byte_length = 64;
        assert!(decode_layer(&h, &bin, GridLayer::Mask).is_err());
        assert!(decode_layer(&h, &bin, GridLayer::SlopeDeg).is_err());
    }

    #[test]
    fn write_then_read_round_trips_and_replaces() {
        let (mut h, mut bin) = load("grid/haworth");
        let slope = decode_layer(&h, &bin, GridLayer::SlopeDeg).unwrap();
        let n = (h.nx * h.ny) as usize;
        // Float32 layers other than the mask (terrain + science).
        let floats = h.layers.iter().filter(|l| **l != GridLayer::Mask).count();
        let info = GridLayerInfo {
            dtype: Dtype::Int16,
            scale: 0.01,
            offset: 0.0,
            units: "deg".into(),
            components: 64,
            nodata: None,
            byte_offset: 0,
            byte_length: 0,
            proxy: false,
            note: None,
        };
        let enc = |v: i16| {
            (0..n * 64)
                .flat_map(|k| (v + (k % 64) as i16).to_le_bytes())
                .collect::<Vec<u8>>()
        };
        write_layer(&mut h, &mut bin, GridLayer::Mask, info.clone(), &enc(100)).unwrap();
        write_layer(&mut h, &mut bin, GridLayer::Mask, info.clone(), &enc(-50)).unwrap();
        assert_eq!(bin.len(), n * floats * 4 + n * 64 * 2);
        assert_eq!(h.layers.last(), Some(&GridLayer::Mask));
        assert_eq!(
            h.layers.iter().filter(|l| **l == GridLayer::Mask).count(),
            1
        );
        let mask = decode_layer(&h, &bin, GridLayer::Mask).unwrap();
        assert!((mask[65] + 0.49).abs() < 1e-6, "{}", mask[65]); // cell 1, bin 1: -50 + 1 hundredths
        assert_eq!(decode_layer(&h, &bin, GridLayer::SlopeDeg).unwrap(), slope);
        assert!(write_layer(&mut h, &mut bin, GridLayer::Mask, info, &[0; 3]).is_err());
        // The rewritten header still satisfies the contract struct (deny_unknown_fields).
        let back: GridHeader = serde_json::from_str(&serde_json::to_string(&h).unwrap()).unwrap();
        assert_eq!(
            back.layer_info[&GridLayer::Mask].byte_offset,
            (n * floats * 4) as u64
        );
    }
}
