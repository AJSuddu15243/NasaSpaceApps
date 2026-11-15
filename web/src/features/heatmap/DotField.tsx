import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Group, ShaderMaterial, Vector2, Vector3 } from 'three';
import vertexShader from './shaders/dots.vert.glsl?raw';
import fragmentShader from './shaders/dots.frag.glsl?raw';

export const SPAN = 2; // fields span [-1, 1] in x and z

export interface DotLayerProps {
  bounds?: [number, number, number, number];
  nx: number;
  ny: number;
  /** Layer values in physical units (NaN = excluded / no data). */
  values: Float32Array;
  /** Elevation normalised to 0..1 (shared across the stack so layers line up). */
  elevation01: Float32Array;
  range: [number, number];
  ramp: [string, string, string];
  marks?: number[];
  swapKey?: string;
  reducedMotion: boolean;
  /** Pointer wave + probe enabled. */
  interactive?: boolean;
  relief?: number;
  /** Target opacity; eased every frame (no React re-render). */
  opacity?: number;
  onProbe?: (index: number | null) => void;
  labelRefs?: MutableRefObject<(HTMLElement | null)[]>;
}

/** Normalise elevation once per grid so every layer of the stack shares the same vertical scale. */
export function normaliseElevation(elevation: Float32Array): Float32Array {
  let lo = Infinity; let hi = -Infinity;
  for (const v of elevation) if (Number.isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
  return elevation.map(v => Number.isFinite(v) ? (v - lo) / Math.max(1, hi - lo) : 0);
}

/**
 * Dot-matrix layer: one glowing dot per grid cell. Presentation only (SPEC guardrail 5): colour and height come
 * from data attributes; the cursor wave never feeds back into results. Sim data lives in buffers/uniforms, not
 * React state (guardrail 7).
 */
export function DotLayer({ bounds = [-1, 1, -1, 1], nx, ny, values, elevation01, range, ramp, marks = [], swapKey = '', reducedMotion, interactive = false, relief = 0.32, opacity = 1, onProbe, labelRefs }: DotLayerProps) {
  const [left, right, bottom, top] = bounds;
  const group = useRef<Group>(null);
  const target = useRef(new Vector2(9, 9));
  const hovering = useRef(false);
  const swapAt = useRef(-10);
  const lastProbe = useRef<number | null>(null);
  const { size, camera, clock } = useThree();

  const material = useMemo(() => new ShaderMaterial({
    vertexShader, fragmentShader, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uCursor: { value: new Vector2(9, 9) }, uHover: { value: 0 }, uReveal: { value: 0 }, uSwapAge: { value: 10 },
      uRelief: { value: relief }, uSize: { value: 1.8 }, uPixelRatio: { value: Math.min(1.5, window.devicePixelRatio || 1) }, uMotion: { value: 1 }, uOpacity: { value: 0 },
      uC0: { value: new Color() }, uC1: { value: new Color() }, uC2: { value: new Color() },
    },
  }), []); // Dynamic relief is pushed in the frame loop.
  useEffect(() => () => material.dispose(), [material]);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const n = nx * ny;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const col = i % nx; const row = Math.floor(i / nx);
      pos[i * 3] = left + col / (nx - 1) * (right - left);
      pos[i * 3 + 2] = -(bottom + row / (ny - 1) * (top - bottom)); // row grows with projected +y → away from the camera
    }
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('aValue', new BufferAttribute(new Float32Array(n), 1));
    g.setAttribute('aElev', new BufferAttribute(new Float32Array(n), 1));
    g.setAttribute('aMark', new BufferAttribute(new Float32Array(n), 1));
    return g;
  }, [nx, ny, left, right, bottom, top]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    const attr = geometry.getAttribute('aElev') as BufferAttribute;
    (attr.array as Float32Array).set(elevation01);
    attr.needsUpdate = true;
  }, [elevation01, geometry]);

  useEffect(() => {
    const attr = geometry.getAttribute('aValue') as BufferAttribute;
    const [lo, hi] = range;
    for (let i = 0; i < values.length; i++) attr.array[i] = Number.isFinite(values[i]) ? Math.min(1, Math.max(0, (values[i] - lo) / Math.max(1e-9, hi - lo))) : -1;
    attr.needsUpdate = true;
    material.uniforms.uC0.value.set(ramp[0]); material.uniforms.uC1.value.set(ramp[1]); material.uniforms.uC2.value.set(ramp[2]);
  }, [values, range, ramp, geometry, material]);

  useEffect(() => {
    const attr = geometry.getAttribute('aMark') as BufferAttribute;
    (attr.array as Float32Array).fill(0);
    for (const m of marks) {
      const c0 = m % nx; const r0 = Math.floor(m / nx);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const c = c0 + dx; const r = r0 + dy;
        if (c >= 0 && c < nx && r >= 0 && r < ny) attr.array[r * nx + c] = 1;
      }
    }
    attr.needsUpdate = true;
  }, [marks, geometry, nx, ny]);

  useEffect(() => { swapAt.current = clock.elapsedTime; }, [swapKey, clock]);
  useEffect(() => { if (!interactive) { hovering.current = false; } }, [interactive]);

  const local = useMemo(() => new Vector3(), []);
  const project = useMemo(() => new Vector3(), []);
  useFrame((state, delta) => {
    const u = material.uniforms;
    const t = state.clock.elapsedTime;
    u.uTime.value = t;
    u.uMotion.value = reducedMotion ? 0 : 1;
    u.uRelief.value = relief;
    u.uReveal.value = reducedMotion ? 1 : Math.min(1, u.uReveal.value + delta / 1.4);
    u.uSwapAge.value = t - swapAt.current;
    u.uOpacity.value += (opacity - u.uOpacity.value) * (reducedMotion ? 1 : Math.min(1, delta * 4));
    u.uHover.value += ((hovering.current ? 1 : 0) - u.uHover.value) * Math.min(1, delta * 5);
    (u.uCursor.value as Vector2).lerp(target.current, Math.min(1, delta * 10));
    const labels = labelRefs?.current;
    if (labels && group.current) {
      marks.forEach((m, k) => {
        const el = labels[k];
        if (!el) return;
        const col = m % nx; const row = Math.floor(m / nx);
        project.set(left + col / (nx - 1) * (right - left), elevation01[m] * relief + 0.04, -(bottom + row / (ny - 1) * (top - bottom)));
        group.current!.localToWorld(project).project(camera);
        el.style.transform = `translate(${((project.x + 1) / 2 * size.width).toFixed(1)}px, ${((1 - project.y) / 2 * size.height).toFixed(1)}px)`;
        el.style.opacity = String(u.uOpacity.value);
      });
    }
  });

  const move = (event: ThreeEvent<PointerEvent>) => {
    if (!group.current || !interactive) return;
    local.copy(event.point); group.current.worldToLocal(local);
    target.current.set(local.x, local.z);
    if (!hovering.current) { hovering.current = true; material.uniforms.uCursor.value.copy(target.current); }
    const col = Math.round(((local.x - left) / (right - left)) * (nx - 1));
    const row = Math.round(((-local.z - bottom) / (top - bottom)) * (ny - 1));
    const index = col >= 0 && col < nx && row >= 0 && row < ny ? row * nx + col : null;
    if (index !== lastProbe.current) { lastProbe.current = index; onProbe?.(index); }
  };
  const leave = () => { hovering.current = false; lastProbe.current = null; onProbe?.(null); };

  return <group ref={group}>
    <points geometry={geometry} material={material} frustumCulled={false} />
    {interactive && <mesh rotation-x={-Math.PI / 2} position-y={relief * 0.4} onPointerMove={move} onPointerOut={leave}>
      <planeGeometry args={[SPAN * 1.04, SPAN * 1.04]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>}
  </group>;
}
