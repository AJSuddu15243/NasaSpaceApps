import { SceneLabel } from './SceneLabel';
import { useEffect, useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { geographicPoint, projectedPoint, sampleHeight, surfacePoint } from './coordinates';
import type { TerrainFrame } from './coordinates';
import type { SceneSiteMarker, SouthPoleTile } from './types';
export function SceneOverlays({ tile, frame, sites, map, exaggeration = 1, onSiteSelect }: { tile: SouthPoleTile; frame: TerrainFrame; sites: readonly SceneSiteMarker[]; map: boolean; exaggeration?: number; onSiteSelect?: (id: string) => void }) {
  const grid = useMemo(() => {
    const points: number[] = [];
    const step = frame.span > 12 ? 5000 : 2000;
    const x1 = tile.x0M + (tile.columns - 1) * tile.cellM;
    const y1 = tile.y0M + (tile.rows - 1) * tile.cellM;
    const add = (x: number, y: number) => surfacePoint(x, y, (sampleHeight(tile, x, y) ?? 0) * exaggeration + 15).sub(frame.origin).toArray(points, points.length);
    for (let x = Math.ceil(tile.x0M / step) * step; x <= x1; x += step) {
      for (let r = 0; r < tile.rows - 1; r++) { add(x, tile.y0M + r * tile.cellM); add(x, tile.y0M + (r + 1) * tile.cellM); }
    }
    for (let y = Math.ceil(tile.y0M / step) * step; y <= y1; y += step) {
      for (let c = 0; c < tile.columns - 1; c++) { add(tile.x0M + c * tile.cellM, y); add(tile.x0M + (c + 1) * tile.cellM, y); }
    }
    return new BufferGeometry().setAttribute('position', new Float32BufferAttribute(points, 3));
  }, [tile, frame, exaggeration]);
  useEffect(() => () => grid.dispose(), [grid]);
  const coords = geographicPoint(frame.x, frame.y);
  return <>
    {map && <lineSegments geometry={grid} renderOrder={3}><lineBasicMaterial color="#c4ced6" transparent opacity={0.35} depthTest={false} /></lineSegments>}
    {map && <SceneLabel position={frame.up.clone().multiplyScalar(frame.span * 0.55)}><span className="scene-coordinate">+y · 0°E<br />{coords.lat.toFixed(3)}° · {coords.lon.toFixed(3)}°</span></SceneLabel>}
    {sites.map(site => {
      const p = projectedPoint(site.lat, site.lon);
      const height = p && sampleHeight(tile, p.x, p.y);
      if (!p || height === null) return null;
      const position = surfacePoint(p.x, p.y, height * exaggeration + 35).sub(frame.origin);
      return <SceneLabel key={site.id} position={position}><button type="button" className="scene-site" aria-label={`Focus ${site.name}`} onClick={() => onSiteSelect?.(site.id)} title={`${site.name} · ${site.lat.toFixed(3)}°, ${site.lon.toFixed(3)}°`}>{site.index + 1}<span>{site.name}</span></button></SceneLabel>;
    })}
  </>;
}
