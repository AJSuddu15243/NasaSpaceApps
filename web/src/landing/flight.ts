export const INTRO_DURATION_MS = 2200;

export interface FlightSample {
  progress: number;
  camera: readonly [number, number, number];
  target: readonly [number, number, number];
}

export function smoothstep(value: number): number {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

export function sampleFlight(elapsedMs: number, durationMs = INTRO_DURATION_MS): FlightSample {
  if (!Number.isFinite(elapsedMs) || !Number.isFinite(durationMs) || durationMs <= 0) {
    throw new RangeError('Flight times must be finite and duration must be positive.');
  }
  const progress = smoothstep(elapsedMs / durationMs);
  return {
    progress,
    camera: [0.35 * (1 - progress), 0.45 - 1.65 * progress, 5.2 - 1.85 * progress],
    target: [0, -0.85 * progress, 0],
  };
}

export interface HeroCapability {
  reducedMotion: boolean;
  saveData: boolean;
  hardwareConcurrency: number;
  deviceMemory?: number;
  webgl: boolean;
}

export function chooseHeroMode(capability: HeroCapability): 'static' | 'flight' {
  if (capability.reducedMotion || capability.saveData || !capability.webgl) return 'static';
  if (capability.hardwareConcurrency > 0 && capability.hardwareConcurrency <= 4) return 'static';
  if (capability.deviceMemory !== undefined && capability.deviceMemory <= 4) return 'static';
  return 'flight';
}
