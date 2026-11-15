import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { useEffect, useState } from 'react';
import common from '../../../contracts/schemas/common.schema.json';
import schema from '../../../contracts/schemas/ephem.schema.json';
import type { EphemHeader } from '../contracts/ephem';
import { ephemAt } from '../features/globe/ephem';
const ajv = new Ajv2020({ strict: false });
addFormats(ajv); ajv.addSchema(common);
const valid = ajv.compile<EphemHeader>(schema);
export interface SceneEphemTable { header: EphemHeader; rows: Float32Array }
export function decodeSceneEphemeris(header: unknown, bytes: ArrayBuffer): SceneEphemTable {
  if (!valid(header) || header.n > 50000 || bytes.byteLength !== header.n * 24)
    throw new Error('Ephemeris bytes do not match the header.');
  const rows = new Float32Array(header.n * 6), view = new DataView(bytes);
  for (let i = 0; i < rows.length; i++) {
    const value = view.getFloat32(i * 4, true), col = i % 6;
    if (!Number.isFinite(value) || (col % 3 === 0 && Math.abs(value) > 90) || (col % 3 === 1 && (value < -180 || value >= 180)) || (col % 3 === 2 && value <= 0))
      throw new Error('Invalid ephemeris angle or distance.');
    rows[i] = value;
  }
  return { header, rows };
}
export function coveredSample(table: SceneEphemTable, date: string) {
  return ephemAt(table, date); // null outside the table range
}
/** Consume PIPE-2 if packaged; preserve an explicitly synthetic demo while EPH-2 is pending. */
export function useSceneEphemeris(fallback: SceneEphemTable, date: string) {
  const [reference, setReference] = useState<SceneEphemTable | null>(null);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      const header = await fetch('/data/ephem.json', { signal: controller.signal });
      if (header.status === 404 || header.headers.get('content-type')?.includes('text/html')) {
        setNotice('Reference ephemeris is not packaged. The synthetic demo table has fixed Sun/Earth positions; changing time will not move its shadows.'); return;
      }
      if (!header.ok) throw new Error('Reference ephemeris could not load.');
      const binary = await fetch('/data/ephem.bin', { signal: controller.signal });
      if (!binary.ok) throw new Error('Reference ephemeris binary is unavailable.');
      const table = decodeSceneEphemeris(await header.json(), await binary.arrayBuffer());
      if (!controller.signal.aborted) setReference(table);
    };
    void load().catch((error: unknown) => { if (!controller.signal.aborted) setNotice(error instanceof Error ? error.message : 'Reference ephemeris unavailable.'); });
    return () => controller.abort();
  }, []);
  return { sample: coveredSample(reference ?? fallback, date), source: reference ? 'JPL Horizons reference' : 'synthetic demo', notice };
}
