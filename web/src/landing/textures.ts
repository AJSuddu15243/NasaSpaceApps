// Texture loading for the landing stage. Kept free of three.js so the first bundle stays small.

/** Shared, mutable scroll state written by the page and read every frame by the stage (no React re-render per frame). */
export interface StageState {
  chapter: number;
  stepped: boolean;
  /** performance.now() when the dive into the navigator started, or null. */
  diveStart: number | null;
  hovered: string | null;
}

export interface MoonTextures { color: ImageBitmap; height: ImageBitmap | null; cap: ImageBitmap | null; capHalf: number; credit: string }

async function fetchBitmap(url: string, signal: AbortSignal, onProgress?: (f: number) => void): Promise<ImageBitmap> {
  const res = await fetch(url, { signal });
  if (!res.ok || !res.body) throw new Error(`${url} failed to load (${res.status})`);
  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total && onProgress) onProgress(Math.min(0.97, received / total));
  }
  return createImageBitmap(new Blob(chunks as BlobPart[]), { imageOrientation: 'flipY' });
}

interface Manifest { color: string; credit: string; height?: string; capNormal?: string; capHalfWidthM?: number }

/** Loads the global colour map (with real byte progress) and, when the manifest lists it, the LOLA south-pole cap. */
export async function loadMoonTextures(onProgress: (fraction: number) => void, signal: AbortSignal): Promise<MoonTextures> {
  const manifest = await fetch('/textures/moon/manifest.json', { signal }).then(r => r.json() as Promise<Manifest>);
  const capPromise = manifest.capNormal
    ? fetchBitmap(manifest.capNormal, signal).catch(() => null)
    : Promise.resolve(null);
  const heightPromise = manifest.height ? fetchBitmap(manifest.height, signal).catch(() => null) : Promise.resolve(null);
  const color = await fetchBitmap(manifest.color, signal, onProgress);
  const height = await heightPromise;
  const cap = await capPromise;
  onProgress(1);
  return { color, height, cap, capHalf: manifest.capHalfWidthM ?? 304000, credit: manifest.credit + (cap ? ' South-pole relief: LOLA 80 m DEM (NASA PGDA).' : '') };
}

