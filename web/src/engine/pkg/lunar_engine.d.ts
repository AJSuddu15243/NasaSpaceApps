/* tslint:disable */
/* eslint-disable */

/**
 * FRACS_PER_CELL (4) floats per cell: sun_frac, earth_frac, cold_frac, longest_dark_h.
 */
export function grid_fracs(grid: Uint8Array | number[], header: any, ephem: Float32Array | number[], t_start_h: number, hours: number, params: any): Float32Array;

export function grid_scores(grid: Uint8Array | number[], header: any, ephem: Float32Array | number[], t_start_h: number, hours: number, weights: any, params: any): Float32Array;

/**
 * Hash of a Metrics[] list, every field canonical and in contract order (see hash.rs).
 */
export function metrics_hash(list: any): string;

/**
 * Nearby | null.
 */
export function nearby_better(grid: Uint8Array | number[], header: any, fracs: Float32Array | number[], weights: any, params: any, window_cells: number, x_m: number, y_m: number, radius_m: number): any;

export function output_hash(bytes: Uint8Array | number[]): string;

export function output_hash_f32(xs: Float32Array | number[]): string;

/**
 * 1 per permanently shadowed cell, else 0 (GREEDY decision 10).
 */
export function psr_flags(grid: Uint8Array | number[], header: any): Uint8Array;

/**
 * Copy of `ephem` (rows of 6 f32) with angle columns snapped to `hash::QUANTUM_DEG`.
 */
export function quantize_ephem(ephem: Float32Array | number[]): Float32Array;

export function scores_from_fracs(grid: Uint8Array | number[], header: any, fracs: Float32Array | number[], weights: any, params: any): Float32Array;

export function site_extras(geom: any, mask_deg: Float32Array | number[], ephem: Float32Array | number[], t_start_h: number, hours: number, params: any): any;

export function site_metrics(geom: any, mask_deg: Float32Array | number[], ephem: Float32Array | number[], t_start_h: number, hours: number, params: any): any;

export function site_track(geom: any, mask_deg: Float32Array | number[], ephem: Float32Array | number[], t_start_h: number, hours: number, params: any): Float32Array;

export function top_areas(scores: Float32Array | number[], header: any, window_cells: number, exclusion_m: number, n: number): any;

export function window_cells(base_m: number, cell_m: number): number;

export function window_factors(grid: Uint8Array | number[], header: any, fracs: Float32Array | number[], params: any, window_cells: number, x_m: number, y_m: number): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly grid_fracs: (a: number, b: number, c: any, d: number, e: number, f: number, g: number, h: any) => [number, number, number, number];
    readonly grid_scores: (a: number, b: number, c: any, d: number, e: number, f: number, g: number, h: any, i: any) => [number, number, number, number];
    readonly metrics_hash: (a: any) => [number, number, number, number];
    readonly nearby_better: (a: number, b: number, c: any, d: number, e: number, f: any, g: any, h: number, i: number, j: number, k: number) => [number, number, number];
    readonly output_hash: (a: number, b: number) => [number, number];
    readonly output_hash_f32: (a: number, b: number) => [number, number];
    readonly psr_flags: (a: number, b: number, c: any) => [number, number, number, number];
    readonly quantize_ephem: (a: number, b: number) => [number, number, number, number];
    readonly scores_from_fracs: (a: number, b: number, c: any, d: number, e: number, f: any, g: any) => [number, number, number, number];
    readonly site_extras: (a: any, b: number, c: number, d: number, e: number, f: number, g: number, h: any) => [number, number, number];
    readonly site_metrics: (a: any, b: number, c: number, d: number, e: number, f: number, g: number, h: any) => [number, number, number];
    readonly site_track: (a: any, b: number, c: number, d: number, e: number, f: number, g: number, h: any) => [number, number, number, number];
    readonly top_areas: (a: number, b: number, c: any, d: number, e: number, f: number) => [number, number, number];
    readonly window_cells: (a: number, b: number) => [number, number, number];
    readonly window_factors: (a: number, b: number, c: any, d: number, e: number, f: any, g: number, h: number, i: number) => [number, number, number];
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
