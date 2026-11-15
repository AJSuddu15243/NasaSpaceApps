import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { BufferAttribute, BufferGeometry, Color, DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, ShaderMaterial, Vector3, type Material } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { specimenGeometry, specimenScalarGeometry, probeIndex } from './specimen';
import { TerrainShaderMaterial } from '../../scene/shaders';
import type { TerrainAssets } from '../../scene/terrainAssets';
import type { SouthPoleTile } from '../../scene/types';
import type { Grid } from './grid';
import { scalarTexture } from './scalarTexture';
import { LAYERS, STACK, SURFACE_LAYERS, layerValues, type HeatLayer } from './layers';

export const RELIEF = 0.3;
const SPAN = 2;
const GAP = 0.2;
const BASE_DEPTH = 0.42;

export interface StrataProps {
  active: boolean;
  resetKey: number;
  contours: boolean;
  exaggeration: 1 | 2;
  overlayOpacity: number;
  onImageryError: () => void;
  grid: Grid;
  tile: SouthPoleTile;
  assets?: TerrainAssets;
  scores: Float32Array;
  ranges: Record<HeatLayer, [number, number]>;
  selected: HeatLayer | null;
  stackCount: number;
  onSelect: (layer: HeatLayer) => void;
  onProbe: (index: number | null) => void;
  /** Unit vector to the Sun in the stack frame (x east-ish map +x, y up, z map −y). */
  sunDir: [number, number, number];
  reducedMotion: boolean;
  labelRefs: MutableRefObject<(HTMLElement | null)[]>;
}

/** Cut-away walls from the terrain edge down to a flat base: the "cross-section" of the specimen. */
function skirtGeometry(tile: SouthPoleTile, lo: number, hi: number) {
  const { columns: nx, rows: ny } = tile;
  const edge: number[] = [];
  for (let c = 0; c < nx; c++) edge.push(c);                       // south edge (row 0)
  for (let r = 1; r < ny; r++) edge.push(r * nx + nx - 1);          // east
  for (let c = nx - 2; c >= 0; c--) edge.push((ny - 1) * nx + c);   // north
  for (let r = ny - 2; r >= 0; r--) edge.push(r * nx);              // west
  const pos: number[] = []; const depth: number[] = [];
  const at = (i: number) => [(i % nx / (nx - 1) - 0.5) * SPAN, (tile.elevationM[i] - lo) / Math.max(1, hi - lo) * RELIEF, -(Math.floor(i / nx) / (ny - 1) - 0.5) * SPAN];
  for (let k = 0; k < edge.length; k++) {
    const [x0, y0, z0] = at(edge[k]); const [x1, y1, z1] = at(edge[(k + 1) % edge.length]);
    pos.push(x0, y0, z0, x0, -BASE_DEPTH, z0, x1, y1, z1, x1, y1, z1, x0, -BASE_DEPTH, z0, x1, -BASE_DEPTH, z1);
    depth.push(0, 1, 0, 0, 1, 1);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute('aDepth', new BufferAttribute(new Float32Array(depth), 1));
  return g;
}

const skirtMaterial = () => new ShaderMaterial({
  side: DoubleSide, transparent: true,
  uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } },
  vertexShader: 'attribute float aDepth; varying float vDepth; varying vec3 vPos; void main(){ vDepth=aDepth; vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  // Illustrative strata bands (no subsurface data): regolith → megaregolith → bedrock, plus a holographic scan grid.
  fragmentShader: `uniform float uTime; uniform float uOpacity; varying float vDepth; varying vec3 vPos;
    void main(){
      float y = vPos.y;
      vec3 regolith = vec3(0.30,0.29,0.27); vec3 mega = vec3(0.17,0.17,0.16); vec3 bed = vec3(0.09,0.10,0.10);
      vec3 c = y > 0.0 ? regolith : y > -0.18 ? mega : bed;
      float band = smoothstep(0.0,0.004,abs(y)) * smoothstep(0.0,0.004,abs(y+0.18));
      c = mix(vec3(1.0,0.82,0.56), c, band);
      float grain = fract(sin(dot(floor(vPos.xz*90.0)+floor(y*140.0), vec2(12.9898,78.233)))*43758.5453);
      c *= 0.85 + grain*0.25;
      float grid = step(0.985, fract((vPos.x+vPos.z)*10.0)) * 0.25;
      float scan = (1.0-smoothstep(0.0,0.02,abs(fract(y*2.0 - uTime*0.25)-0.5))) * 0.35;
      c += vec3(1.0,0.78,0.48)*(grid+scan)*0.4;
      gl_FragColor = vec4(c, uOpacity * (1.0 - vDepth*0.25));
    }`,
});

type LiveY = MutableRefObject<Partial<Record<HeatLayer, { y: number; o: number }>>>;

/** Damped per-layer position/opacity. Every layer writes its live height so the HTML labels can follow it. */
function useSlab(key: HeatLayer, index: number, selected: HeatLayer | null, reducedMotion: boolean, live: LiveY) {
  const state = useRef({ y: 0, o: 0, t0: -1 });
  const focused = selected !== null;
  const isSel = selected === key;
  const targetY = key === 'relief' ? 0 : !focused ? index * GAP : isSel ? 0.006 : 1.6 + index * GAP * 1.4;
  const targetO = key === 'relief' || !focused || isSel ? 1 : 0;
  return (clock: number, delta: number) => {
    const s = state.current;
    if (s.t0 < 0) s.t0 = clock;
    const started = reducedMotion || clock - s.t0 > 0.35 + index * 0.09; // staggered "opening up"
    const k = reducedMotion ? 1 : 1 - Math.exp(-delta * (focused ? 10 : 6));
    if (started) { s.y += (targetY - s.y) * k; s.o += (targetO - s.o) * k; }
    live.current[key] = { y: s.y, o: s.o };
    return s;
  };
}

function SurfaceSlab({ layer, index, geometry, tile, assets, selected, reducedMotion, live, onSelect, onProbe, grid, contours, overlayOpacity, onImageryError }: { layer: HeatLayer; index: number; geometry: BufferGeometry; tile: SouthPoleTile; assets?: TerrainAssets; selected: HeatLayer | null; reducedMotion: boolean; live: LiveY; onSelect: (l: HeatLayer) => void; onProbe: (i: number | null) => void; grid: Grid; contours: boolean; overlayOpacity: number; onImageryError: () => void }) {
  const mesh = useRef<Mesh>(null);
  const step = useSlab(layer, index, selected, reducedMotion, live);
  const config = useMemo(() => {
    let lo = Infinity; let hi = -Infinity;
    for (let i = 0; i < tile.elevationM.length; i++) { lo = Math.min(lo, tile.elevationM[i]); hi = Math.max(hi, tile.elevationM[i]); }
    return { elevationRangeM: [lo, Math.max(hi, lo + 1)] as const, showContours: contours, contourIntervalM: 100 };
  }, [tile, contours]);
  useFrame((state, delta) => {
    const s = step(state.clock.elapsedTime, delta);
    if (!mesh.current) return;
    mesh.current.position.y = s.y;
    mesh.current.visible = s.o > 0.01;
    const m = mesh.current.material as Material;
    m.transparent = s.o < 0.99; m.opacity = s.o; m.depthWrite = s.o > 0.5;
  });
  const shaderLayer = layer === 'imagery' ? 'imagery' : layer === 'slope' ? 'slope' : layer === 'elevation' ? 'elevation' : 'relief';
  const probe = (e: ThreeEvent<PointerEvent>) => {
    if (selected !== layer || !e.uv) return;
    e.stopPropagation(); onProbe(probeIndex(grid, tile, e.uv.x, e.uv.y));
  };
  return <mesh ref={mesh} geometry={geometry} castShadow receiveShadow onClick={e => { if (selected === null) { e.stopPropagation(); onSelect(layer); } }} onPointerMove={probe} onPointerOut={() => selected === layer && onProbe(null)}>
    <TerrainShaderMaterial config={config} tile={tile} assets={assets} layer={shaderLayer} overlayOpacity={overlayOpacity} onImageryError={onImageryError} elevationEnabled={layer === 'elevation'} />
  </mesh>;
}

function ScalarSlab({ layer, index, geometry, grid, tile, values, range, selected, live, onSelect, onProbe }: { layer: HeatLayer; index: number; geometry: BufferGeometry; grid: Grid; tile: SouthPoleTile; values: Float32Array; range: [number, number]; selected: HeatLayer | null; live: LiveY; onSelect: (l: HeatLayer) => void; onProbe: (i: number | null) => void }) {
  const texture = useMemo(() => scalarTexture(grid, tile, values, range, LAYERS[layer].ramp), [grid, tile, values, range[0], range[1], layer]);
  const material = useMemo(() => new MeshBasicMaterial({ map: texture, side: DoubleSide }), [texture]);
  useEffect(() => () => { material.dispose(); texture.dispose(); }, [material, texture]);
  const y = selected === null ? index * GAP : 0.006;
  useEffect(() => {
    live.current[layer] = { y, o: 1 };
    return () => { live.current[layer] = { y, o: 0 }; };
  }, [live, layer, y]);
  const probe = (e: ThreeEvent<PointerEvent>) => {
    if (selected !== layer || !e.uv) return;
    e.stopPropagation(); onProbe(probeIndex(grid, tile, e.uv.x, e.uv.y));
  };
  return <mesh geometry={geometry} material={material} position-y={y} onClick={e => { if (selected === null) { e.stopPropagation(); onSelect(layer); } }} onPointerMove={probe} onPointerOut={() => selected === layer && onProbe(null)} />;
}

function Rig({ selected, height, reducedMotion, resetKey }: { selected: HeatLayer | null; height: number; reducedMotion: boolean; resetKey: number }) {
  const { camera, gl, invalidate } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  const travel = useRef(0);
  const origin = useRef(new Vector3());
  const fromTarget = useRef(new Vector3());
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    controls.current = c; c.enableDamping = true; c.minDistance = 0.65; c.maxDistance = 12;
    c.maxPolarAngle = Math.PI * 0.49;
    const interrupt = () => { travel.current = 1; };
    const redraw = () => invalidate();
    c.addEventListener('start', interrupt); c.addEventListener('change', redraw);
    return () => { c.removeEventListener('start', interrupt); c.removeEventListener('change', redraw); c.dispose(); controls.current = null; };
  }, [camera, gl, invalidate]);
  useEffect(() => {
    origin.current.copy(camera.position); fromTarget.current.copy(controls.current?.target ?? new Vector3());
    travel.current = 0; invalidate();
  }, [selected, resetKey, reducedMotion, camera, invalidate]);
  useFrame((_, delta) => {
    const c = controls.current;
    if (!c) return;
    if (travel.current < 1) {
      travel.current = reducedMotion ? 1 : Math.min(1, travel.current + delta / 0.9);
      const t = travel.current, ease = 1 - Math.pow(1 - t, 3);
      const aspect = (camera as PerspectiveCamera).aspect;
      const fit = Math.max(1, 0.95 / aspect);
      const target = selected === null ? new Vector3(3.3, height * 0.55 + 1, 4.1).multiplyScalar(fit) : new Vector3(0.6, 1.9, 2.7).multiplyScalar(fit);
      camera.position.lerpVectors(origin.current, target, ease);
      c.target.lerpVectors(fromTarget.current, new Vector3(0, selected === null ? height * 0.45 : 0.08, 0), ease);
      const cam = camera as PerspectiveCamera;
      cam.fov = 38 + (reducedMotion ? 0 : Math.sin(t * Math.PI) * 10); cam.updateProjectionMatrix();
      invalidate();
    }
    c.update();
  });
  return null;
}

function Labels({ live, labelRefs }: { live: LiveY; labelRefs: MutableRefObject<(HTMLElement | null)[]> }) {
  const { camera, size } = useThree();
  const p = useMemo(() => new Vector3(), []);
  useFrame(() => {
    STACK.forEach((key, i) => {
      const el = labelRefs.current[i]; const s = live.current[key];
      if (!el || !s) return;
      p.set(SPAN * 0.52, s.y + RELIEF * 0.55, SPAN * 0.5).project(camera);
      el.style.transform = `translate(${((p.x + 1) / 2 * size.width).toFixed(1)}px, ${((1 - p.y) / 2 * size.height).toFixed(1)}px)`;
      el.style.opacity = String(s.o);
      el.style.pointerEvents = s.o > 0.5 ? 'auto' : 'none';
    });
  });
  return null;
}

function Skirt({ geometry, selected, reducedMotion }: { geometry: BufferGeometry; selected: HeatLayer | null; reducedMotion: boolean }) {
  const material = useMemo(skirtMaterial, []);
  useEffect(() => () => material.dispose(), [material]);
  useFrame(state => { material.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime; material.uniforms.uOpacity.value = selected === null || selected === 'relief' ? 1 : 0.55; });
  return <mesh geometry={geometry} material={material} />;
}

function Scene(props: StrataProps) {
  const { grid, tile, assets, scores, ranges, selected, stackCount, onSelect, onProbe, sunDir, reducedMotion, labelRefs, resetKey, contours, exaggeration, overlayOpacity, onImageryError } = props;
  const live: LiveY = useRef({});
  const [lo, hi] = useMemo(() => { let a = Infinity; let b = -Infinity; for (let i = 0; i < tile.elevationM.length; i++) { a = Math.min(a, tile.elevationM[i]); b = Math.max(b, tile.elevationM[i]); } return [a, b]; }, [tile]);
  const surface = useMemo(() => specimenGeometry(tile, RELIEF * exaggeration), [tile, exaggeration]);
  const scalarSurface = useMemo(() => specimenScalarGeometry(grid, tile, RELIEF * exaggeration, lo, hi), [grid, tile, lo, hi, exaggeration]);
  const skirt = useMemo(() => skirtGeometry(tile, lo, lo + (hi - lo) / exaggeration), [tile, lo, hi, exaggeration]);
  useEffect(() => () => { surface.dispose(); scalarSurface.dispose(); skirt.dispose(); }, [surface, scalarSurface, skirt]);
  const height = (STACK.length - 1) * GAP + RELIEF;
  const sun = useMemo(() => new Vector3(...sunDir).multiplyScalar(6), [sunDir]);
  return <>
    <ambientLight intensity={0.55} color={new Color('#eee2ce')} />
    <hemisphereLight args={['#eee2ce', '#141210', 0.35]} />
    <directionalLight castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} shadow-bias={-0.0001} position={sun} intensity={sunDir[1] > -0.05 ? 2.4 : 0.2} color="#fff3dc" />
    <Rig selected={selected} height={height} reducedMotion={reducedMotion} resetKey={resetKey} />
    <Labels live={live} labelRefs={labelRefs} />
    <group>
      <Skirt geometry={skirt} selected={selected} reducedMotion={reducedMotion} />
      {STACK.map((key, i) => (selected === null ? i < stackCount : key === 'relief' || key === selected) && (SURFACE_LAYERS.includes(key)
        ? (key !== 'imagery' || assets?.imagery) && (key !== 'slope' || assets?.slope)
          ? <SurfaceSlab key={key} layer={key} index={i} geometry={surface} tile={tile} assets={assets} selected={selected} reducedMotion={reducedMotion} live={live} onSelect={onSelect} onProbe={onProbe} grid={grid} contours={contours} overlayOpacity={overlayOpacity} onImageryError={onImageryError} />
          : null
        : (() => { const values = layerValues(grid, key, scores); return values ? <ScalarSlab key={key} layer={key} index={i} geometry={scalarSurface} grid={grid} tile={tile} values={values} range={ranges[key]} selected={selected} live={live} onSelect={onSelect} onProbe={onProbe} /> : null; })()))}
      <gridHelper args={[SPAN * 1.6, 32, '#66563f', '#211e19']} position-y={-BASE_DEPTH - 0.002} />
    </group>
  </>;
}

/** The anatomy view: real terrain at the bottom, every data layer floating above it; click one to dive in. */
export function StrataView(props: StrataProps) {
  return <Canvas className="dot-field-canvas" resize={{ offsetSize: true }} shadows frameloop={props.active ? (props.reducedMotion ? 'demand' : 'always') : 'never'} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    camera={{ position: [3.4, 3.2, 3.6], fov: 38, near: 0.05, far: 40 }} onPointerMissed={() => props.onProbe(null)}>
    <Scene {...props} />
  </Canvas>;
}
