// Pure scroll-story maths for the landing stage. No three.js imports so it stays unit-testable.
// The Moon is rendered in a Moon-fixed frame: +x = 0°E on the equator, +y = north pole, -z = 90°E.

export type Vec3 = readonly [number, number, number];

export interface StageKey {
  /** Rotation of the Moon about the screen x-axis, degrees. 0 = near side faces the camera, -90 = south pole faces it. */
  tilt: number;
  camera: Vec3;
  target: Vec3;
  /** Scroll clock in degrees of one Sun turn; stageDate turns it into the date whose real Sun and Earth the stage shows. */
  sunLon: number;
  /** 0..1 how strongly site markers show. */
  sites: number;
  /** 0..1 how strongly the Earth shows. */
  earth: number;
}

/** One key per chapter, in scroll order. Keep in sync with CHAPTERS in LandingPage. */
export const KEYS: readonly StageKey[] = [
  { tilt: -14, camera: [-0.62, 0.05, 5.2], target: [-0.62, 0.05, 0], sunLon: 58, sites: 0, earth: 0 },          // 00 hero
  { tilt: -90, camera: [0, 0, 3.0], target: [0, 0, 0], sunLon: 160, sites: 0, earth: 0 },         // 01 the pole
  { tilt: -90, camera: [0, 0, 2.35], target: [0, 0, 0], sunLon: 520, sites: 0, earth: 0 },        // 02 time (sun sweeps one turn)
  { tilt: -90, camera: [-0.05, -0.02, 1.72], target: [-0.05, -0.02, 0], sunLon: 560, sites: 1, earth: 0 }, // 03 sites
  { tilt: -180, camera: [0, 1.22, 1.66], target: [0, 1.12, -3], sunLon: 600, sites: 0, earth: 1 }, // 04 earth on the horizon
  { tilt: -200, camera: [-1.15, 0.2, 5.4], target: [-1.15, 0.2, 0], sunLon: 615, sites: 0, earth: 0 }, // 05 method
  { tilt: -214, camera: [1.25, 0, 5.8], target: [1.25, 0, 0], sunLon: 632, sites: 0, earth: 0 },   // 06 team
  { tilt: -450, camera: [0, 1.05, 3.9], target: [0, 0.66, 0], sunLon: 700, sites: 0, earth: 0 },        // 07 enter
];

/** The south-pole close-up used by the "enter the navigator" dive. */
export const DIVE: StageKey = { tilt: -450, camera: [0, 0, 1.12], target: [0, 0, 0], sunLon: 720, sites: 1, earth: 0 };

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** easeInOutCubic: holds briefly on each key so a chapter reads before the camera moves on. */
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
/** easeOutExpo-ish, the cubic-bezier(0.16, 1, 0.3, 1) feel for one-shot dives. */
export const easeOut = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

export function mixKeys(a: StageKey, b: StageKey, t: number): StageKey {
  return {
    tilt: lerp(a.tilt, b.tilt, t),
    camera: lerp3(a.camera, b.camera, t),
    target: lerp3(a.target, b.target, t),
    sunLon: lerp(a.sunLon, b.sunLon, t),
    sites: lerp(a.sites, b.sites, t),
    earth: lerp(a.earth, b.earth, t),
  };
}

/**
 * Sample the stage for a scroll position measured in chapters (0 = top of chapter 0, KEYS.length - 1 = last key).
 * `stepped` (reduced motion) snaps to the nearest chapter instead of tweening.
 */
export function sampleStage(chapter: number, stepped = false): StageKey {
  if (!Number.isFinite(chapter)) throw new RangeError('chapter must be finite');
  const last = KEYS.length - 1;
  const c = Math.min(last, Math.max(0, chapter));
  if (stepped) return KEYS[Math.round(c)];
  const i = Math.min(last - 1, Math.floor(c));
  return mixKeys(KEYS[i], KEYS[i + 1], ease(c - i));
}

/** Unit vector for a planetocentric lat/lon (degrees) in the stage's Moon-fixed frame. */
export function lonLatToVec(latDeg: number, lonDeg: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon)];
}

/** Opacity of a chapter's copy for the current scroll position: 0 away, 1 while it is the active chapter. */
export function copyOpacity(index: number, chapter: number): number {
  const d = Math.abs(chapter - index);
  return clamp01(1 - (d - 0.18) / 0.32);
}

/** Region centres and names from sites.json (NASA M2M Lunar Surface Data Book); heights are the rounded LOLA elev_m of
 *  masks/{id}.json. Pinned here so the landing chunk skips the fetch; story.test.ts checks them against those files. */
export const SITES = [
  { id: 'connecting-ridge', name: 'Shackleton Connecting Ridge', lat: -89.4632, lon: -137.49, elevation_m: 1943 },
  { id: 'haworth', name: 'Haworth', lat: -86.7639, lon: -22.777, elevation_m: 1628 },
  { id: 'malapert-massif', name: 'Malapert Massif', lat: -85.9948, lon: -0.23578, elevation_m: 4785 },
] as const;

export function formatLat(lat: number): string {
  return `${Math.abs(lat).toFixed(2)}° ${lat < 0 ? 'S' : 'N'}`;
}
export function formatLon(lon: number): string {
  return `${Math.abs(lon).toFixed(2)}° ${lon < 0 ? 'W' : 'E'}`;
}

/** Date the stage shows: the navigator's default window start (DEFAULT_SCENARIO.date) at the pole chapter, then one
 *  Sun turn per synodic month. The hero holds at the epoch. MoonStage places the Sun and Earth with sunEarthAt(date). */
export const SYNODIC_DAYS = 29.53;
export const STAGE_EPOCH_MS = Date.UTC(2027, 0, 15);
export function stageDate(sunLon: number, epochMs = STAGE_EPOCH_MS): Date {
  const turns = Math.max(0, sunLon - KEYS[1].sunLon) / 360;
  return new Date(epochMs + turns * SYNODIC_DAYS * 86_400_000);
}

/** Same projection as the LOLA DEM and the shader cap: south polar stereographic on the 1737.4 km sphere,
 *  +x toward 90° E, +y toward 0° E (pipeline/notes/pipe-3.md). Returns metres. */
export function polarStereo(latDeg: number, lonDeg: number): [number, number] {
  const colat = ((90 + latDeg) * Math.PI) / 180;
  const rho = 2 * 1_737_400 * Math.tan(colat / 2);
  const lon = (lonDeg * Math.PI) / 180;
  return [rho * Math.sin(lon), rho * Math.cos(lon)];
}
