import type { SlopeGrid } from './slope';
import { SLOPE_LIMIT_DEG } from './slope';
export function SlopeLegend({ grid, opacity, onOpacity }: { grid: SlopeGrid; opacity: number; onOpacity: (value: number) => void }) {
  let above = 0, max = 0;
  for (const value of grid.values) { if (value > SLOPE_LIMIT_DEG) above++; max = Math.max(max, value); }
  return <div className="slope-legend" aria-label="Terrain slope legend">
    <div className="slope-scale"><i /><div><span>0°</span><span>10° limit</span><span>20°</span><span>≥30°</span></div></div>
    <p>White contour: 10° · {Math.round(above / grid.values.length * 100)}% of cells above limit · maximum {max.toFixed(1)}°</p>
    <label>Heatmap opacity <input aria-label="Heatmap opacity" type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => onOpacity(Number(e.target.value))} /> {Math.round(opacity * 100)}%</label>
    <p>LOLA-derived slope · 160 m cells · maximum of 2×2 source slopes. Colors saturate at 30°. This is a terrain factor, not a landing suitability score.</p>
  </div>;
}
