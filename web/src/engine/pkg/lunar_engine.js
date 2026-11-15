/* @ts-self-types="./lunar_engine.d.ts" */

/**
 * FRACS_PER_CELL (4) floats per cell: sun_frac, earth_frac, cold_frac, longest_dark_h.
 * @param {Uint8Array | number[]} grid
 * @param {any} header
 * @param {Float32Array | number[]} ephem
 * @param {number} t_start_h
 * @param {number} hours
 * @param {any} params
 * @returns {Float32Array}
 */
export function grid_fracs(grid, header, ephem, t_start_h, hours, params) {
    const val3 = +t_start_h;
    const val4 = +hours;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArray8ToWasm0(grid, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArrayF32ToWasm0(ephem, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 4, 4); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
        throw e;
    }
    const ret = wasm.grid_fracs(ptr0, len0, header, ptr1, len1, val3, val4, params);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v5 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v5;
}

/**
 * @param {Uint8Array | number[]} grid
 * @param {any} header
 * @param {Float32Array | number[]} ephem
 * @param {number} t_start_h
 * @param {number} hours
 * @param {any} weights
 * @param {any} params
 * @returns {Float32Array}
 */
export function grid_scores(grid, header, ephem, t_start_h, hours, weights, params) {
    const val3 = +t_start_h;
    const val4 = +hours;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArray8ToWasm0(grid, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArrayF32ToWasm0(ephem, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 4, 4); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
        throw e;
    }
    const ret = wasm.grid_scores(ptr0, len0, header, ptr1, len1, val3, val4, weights, params);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v5 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v5;
}

/**
 * Hash of a Metrics[] list, every field canonical and in contract order (see hash.rs).
 * @param {any} list
 * @returns {string}
 */
export function metrics_hash(list) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.metrics_hash(list);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Nearby | null.
 * @param {Uint8Array | number[]} grid
 * @param {any} header
 * @param {Float32Array | number[]} fracs
 * @param {any} weights
 * @param {any} params
 * @param {number} window_cells
 * @param {number} x_m
 * @param {number} y_m
 * @param {number} radius_m
 * @returns {any}
 */
export function nearby_better(grid, header, fracs, weights, params, window_cells, x_m, y_m, radius_m) {
    const val3 = +window_cells;
    const val4 = +x_m;
    const val5 = +y_m;
    const val6 = +radius_m;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArray8ToWasm0(grid, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArrayF32ToWasm0(fracs, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 4, 4); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
        throw e;
    }
    const ret = wasm.nearby_better(ptr0, len0, header, ptr1, len1, weights, params, val3, val4, val5, val6);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array | number[]} bytes
 * @returns {string}
 */
export function output_hash(bytes) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.output_hash(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {Float32Array | number[]} xs
 * @returns {string}
 */
export function output_hash_f32(xs) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passArrayF32ToWasm0(xs, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.output_hash_f32(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * 1 per permanently shadowed cell, else 0 (GREEDY decision 10).
 * @param {Uint8Array | number[]} grid
 * @param {any} header
 * @returns {Uint8Array}
 */
export function psr_flags(grid, header) {
    const ptr0 = passArray8ToWasm0(grid, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.psr_flags(ptr0, len0, header);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v2;
}

/**
 * Copy of `ephem` (rows of 6 f32) with angle columns snapped to `hash::QUANTUM_DEG`.
 * @param {Float32Array | number[]} ephem
 * @returns {Float32Array}
 */
export function quantize_ephem(ephem) {
    const ptr0 = passArrayF32ToWasm0(ephem, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.quantize_ephem(ptr0, len0);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * @param {Uint8Array | number[]} grid
 * @param {any} header
 * @param {Float32Array | number[]} fracs
 * @param {any} weights
 * @param {any} params
 * @returns {Float32Array}
 */
export function scores_from_fracs(grid, header, fracs, weights, params) {
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArray8ToWasm0(grid, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArrayF32ToWasm0(fracs, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 4, 4); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
        throw e;
    }
    const ret = wasm.scores_from_fracs(ptr0, len0, header, ptr1, len1, weights, params);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v3 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v3;
}

/**
 * @param {any} geom
 * @param {Float32Array | number[]} mask_deg
 * @param {Float32Array | number[]} ephem
 * @param {number} t_start_h
 * @param {number} hours
 * @param {any} params
 * @returns {any}
 */
export function site_extras(geom, mask_deg, ephem, t_start_h, hours, params) {
    const val3 = +t_start_h;
    const val4 = +hours;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArrayF32ToWasm0(mask_deg, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArrayF32ToWasm0(ephem, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 4, 4); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 4, 4); }
        throw e;
    }
    const ret = wasm.site_extras(geom, ptr0, len0, ptr1, len1, val3, val4, params);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} geom
 * @param {Float32Array | number[]} mask_deg
 * @param {Float32Array | number[]} ephem
 * @param {number} t_start_h
 * @param {number} hours
 * @param {any} params
 * @returns {any}
 */
export function site_metrics(geom, mask_deg, ephem, t_start_h, hours, params) {
    const val3 = +t_start_h;
    const val4 = +hours;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArrayF32ToWasm0(mask_deg, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArrayF32ToWasm0(ephem, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 4, 4); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 4, 4); }
        throw e;
    }
    const ret = wasm.site_metrics(geom, ptr0, len0, ptr1, len1, val3, val4, params);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} geom
 * @param {Float32Array | number[]} mask_deg
 * @param {Float32Array | number[]} ephem
 * @param {number} t_start_h
 * @param {number} hours
 * @param {any} params
 * @returns {Float32Array}
 */
export function site_track(geom, mask_deg, ephem, t_start_h, hours, params) {
    const val3 = +t_start_h;
    const val4 = +hours;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArrayF32ToWasm0(mask_deg, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArrayF32ToWasm0(ephem, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 4, 4); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 4, 4); }
        throw e;
    }
    const ret = wasm.site_track(geom, ptr0, len0, ptr1, len1, val3, val4, params);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v5 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v5;
}

/**
 * @param {Float32Array | number[]} scores
 * @param {any} header
 * @param {number} window_cells
 * @param {number} exclusion_m
 * @param {number} n
 * @returns {any}
 */
export function top_areas(scores, header, window_cells, exclusion_m, n) {
    const val2 = +window_cells;
    const val3 = +exclusion_m;
    const val4 = +n;
    const ptr0 = passArrayF32ToWasm0(scores, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.top_areas(ptr0, len0, header, val2, val3, val4);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {number} base_m
 * @param {number} cell_m
 * @returns {number}
 */
export function window_cells(base_m, cell_m) {
    const ret = wasm.window_cells(base_m, cell_m);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] >>> 0;
}

/**
 * @param {Uint8Array | number[]} grid
 * @param {any} header
 * @param {Float32Array | number[]} fracs
 * @param {any} params
 * @param {number} window_cells
 * @param {number} x_m
 * @param {number} y_m
 * @returns {any}
 */
export function window_factors(grid, header, fracs, params, window_cells, x_m, y_m) {
    const val3 = +window_cells;
    const val4 = +x_m;
    const val5 = +y_m;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArray8ToWasm0(grid, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArrayF32ToWasm0(fracs, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 4, 4); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
        throw e;
    }
    const ret = wasm.window_factors(ptr0, len0, header, ptr1, len1, params, val3, val4, val5);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_208446807d0d1e30: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg___wbindgen_string_get_7ce8eee7fd327545: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_4c88d8bf264fd984: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_parse_c3f72b5a24f83c01: function() { return handleError(function (arg0, arg1) {
            const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments); },
        __wbg_stringify_0a0fbf2ef722380a: function() { return handleError(function (arg0) {
            const ret = JSON.stringify(arg0);
            return ret;
        }, arguments); },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            table.set(0, undefined);
            table.set(1024, undefined);
            table.set(1025, null);
            table.set(1026, true);
            table.set(1027, false);
        },
    };
    return {
        __proto__: null,
        "./lunar_engine_bg.js": import0,
    };
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(bytes) {
    numBytesDecoded += bytes.length;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
        cachedTextDecoder.decode();
        numBytesDecoded = bytes.length;
    }
    return cachedTextDecoder.decode(bytes);
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

let __wbg_init_promise;
async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;
    if (__wbg_init_promise === undefined) {
        __wbg_init_promise = __wbg_init_once(module_or_path);
        __wbg_init_promise.catch(() => { __wbg_init_promise = undefined; });
    }
    return __wbg_init_promise;
}

async function __wbg_init_once(module_or_path) {

    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('lunar_engine_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
