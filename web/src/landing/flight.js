export const FLIGHT_DURATION_MS = 4200;

export function flightProgress(elapsedMs, durationMs = FLIGHT_DURATION_MS) {
  if (!Number.isFinite(elapsedMs) || !Number.isFinite(durationMs) || durationMs <= 0) {
    throw new RangeError('Flight times must be finite and duration must be positive');
  }
  const t = Math.min(1, Math.max(0, elapsedMs / durationMs));
  return t * t * (3 - 2 * t);
  
}

export function flightCameraZ(progress) {
  return 7.8 - 4.7 * progress;
}
