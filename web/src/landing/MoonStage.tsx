import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Color, Euler, Group, LinearMipmapLinearFilter, Mesh, MeshBasicMaterial,
  Quaternion, ShaderMaterial, SphereGeometry, SRGBColorSpace, Texture, Vector2, Vector3,
} from 'three';
import { DIVE, easeOut, lonLatToVec, mixKeys, sampleStage, SITES, type StageKey } from './story';
import type { MoonTextures, StageState } from './textures';


const DIVE_MS = 1150;
const D2R = Math.PI / 180;

const moonVertex = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying mat3 vToWorld;
  varying vec3 vObj;
  void main() {
    vUv = uv;
    vObj = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPosW = world.xyz;
    vToWorld = mat3(modelMatrix);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

// Lunar-Lambert shading (Lommel-Seeliger blended with Lambert) keeps the full Moon flat and bright the way the real
// one is. Relief comes from texel-space height differences along local east/north (stable at the terminator,
// unlike screen-space derivatives).
const moonFragment = /* glsl */`
  uniform sampler2D map;
  uniform sampler2D heightMap;
  uniform float useHeight;
  uniform vec2 heightTexel;
  uniform vec2 texel;
  uniform vec3 sunDir;
  uniform float bumpScale;
  uniform float exposure;
  uniform sampler2D capNormal;
  uniform float capOn;
  uniform float capHalf;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying mat3 vToWorld;
  varying vec3 vObj;
  const float PI = 3.141592653589793;
  const float R_M = 1737400.0;

  float polarBias;
  // Real LOLA heights when the manifest ships them (8-bit, ~20 km per step of relief); otherwise albedo luminance.
  float height(vec2 uv) {
    return useHeight > 0.5 ? texture2D(heightMap, uv, polarBias).r : dot(texture2D(map, uv, polarBias).rgb, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    float phi = vUv.x * 2.0 * PI;
    float theta = (1.0 - vUv.y) * PI;
    float sinT = max(sin(theta), 0.03);
    // Equirectangular texels smear toward the poles: blur them there instead of showing streaks.
    polarBias = 4.0 * (1.0 - smoothstep(0.08, 0.5, sinT));
    vec3 albedo = texture2D(map, vUv, polarBias).rgb;
    vec3 east = normalize(vToWorld * vec3(sin(phi), 0.0, cos(phi)));
    vec3 north = normalize(vToWorld * vec3(cos(phi) * cos(theta), sin(theta), -sin(phi) * cos(theta)));
    vec2 tx = useHeight > 0.5 ? heightTexel : texel;
    vec2 du = vec2(tx.x / sinT, 0.0);
    vec2 dv = vec2(0.0, tx.y);
    float dhE = (height(vUv + du) - height(vUv - du)) / (2.0 * du.x * 2.0 * PI * sinT);
    float dhN = (height(vUv + dv) - height(vUv - dv)) / (2.0 * dv.y * PI);
    vec3 n0 = normalize(vNormalW);
    vec3 n = normalize(n0 - bumpScale * smoothstep(0.1, 0.45, sinT) * (dhE * east + dhN * north));

    // South-pole cap: real LOLA normals in the DEM's polar-stereographic grid (+x toward 90E, +y toward 0E).
    vec3 p = normalize(vObj);
    float lat = asin(clamp(p.y, -1.0, 1.0));
    float capW = capOn * smoothstep(-1.396, -1.422, lat); // fades in from 80 S to 81.5 S
    if (capW > 0.0) {
      float lon = atan(-p.z, p.x);
      float rho = 2.0 * R_M * tan((PI * 0.5 + lat) * 0.5);
      vec2 g = rho * vec2(sin(lon), cos(lon));
      vec3 gn = texture2D(capNormal, (g + capHalf) / (2.0 * capHalf)).xyz * 2.0 - 1.0;
      vec3 eastO = vec3(-sin(lon), 0.0, -cos(lon));
      vec3 northO = vec3(-sin(lat) * cos(lon), cos(lat), sin(lat) * sin(lon));
      vec3 mapX = cos(lon) * eastO + sin(lon) * northO;
      vec3 mapY = -sin(lon) * eastO + cos(lon) * northO;
      vec3 capN = normalize(vToWorld * (gn.x * mapX + gn.y * mapY + gn.z * p));
      n = normalize(mix(n, capN, capW));
      // The global map is stretched at the pole; use its average tone instead of its streaks.
      albedo = mix(albedo, vec3(0.42, 0.415, 0.405), capW);
    }
    vec3 v = normalize(cameraPosition - vPosW);
    float mu0 = max(dot(n, sunDir), 0.0);
    float mu = max(dot(n0, v), 0.0);
    float lommel = mu0 / max(mu0 + mu, 1e-3);
    float lit = mix(mu0, 2.0 * lommel, 0.5) * smoothstep(-0.02, 0.05, dot(n0, sunDir));
    float earthshine = 0.02 * (0.5 + 0.5 * dot(n0, -sunDir));
    vec3 col = albedo * (lit * exposure) + albedo * earthshine * vec3(0.62, 0.74, 1.0);
    gl_FragColor = linearToOutputTexel(vec4(col, 1.0));
  }
`;

const starVertex = /* glsl */`
  attribute float size;
  attribute float phase;
  uniform float time;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vAlpha = 0.55 + 0.45 * sin(time * 0.6 + phase);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mv;
  }
`;
const starFragment = /* glsl */`
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(vec3(0.93, 0.91, 0.88) * a, a);
  }
`;

const earthFragment = /* glsl */`
  uniform vec3 sunDir;
  uniform float opacity;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float d = dot(n, sunDir);
    float l = smoothstep(-0.08, 0.35, d);
    float clouds = smoothstep(0.5, 0.72, fbm(vUv * vec2(10.0, 5.0) + vec2(0.0, fbm(vUv * 6.0))));
    float land = smoothstep(0.56, 0.6, fbm(vUv * vec2(4.0, 2.0) + 3.7)) * 0.6;
    vec3 surface = mix(vec3(0.03, 0.11, 0.28), vec3(0.2, 0.22, 0.14), land);
    vec3 col = mix(surface, vec3(0.86, 0.89, 0.93), clouds * 0.85) * l;
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    col += vec3(0.3, 0.55, 1.0) * rim * smoothstep(-0.25, 0.3, d) * 0.9;
    gl_FragColor = linearToOutputTexel(vec4(col * opacity, opacity));
  }
`;

function useStars(count = 1600) {
  return useMemo(() => {
    const geo = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) {
      const u = rand() * 2 - 1;
      const t = rand() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u) * 90;
      pos.set([r * Math.cos(t), u * 90, r * Math.sin(t)], i * 3);
      size[i] = rand() < 0.04 ? 2.6 : 0.7 + rand() * 1.3;
      phase[i] = rand() * 6.28;
    }
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    geo.setAttribute('size', new BufferAttribute(size, 1));
    geo.setAttribute('phase', new BufferAttribute(phase, 1));
    return geo;
  }, [count]);
}


function Rig({ state, textures, onSiteHover, labels }: {
  state: MutableRefObject<StageState>;
  textures: MoonTextures;
  onSiteHover: (id: string | null) => void;
  labels: MutableRefObject<(HTMLElement | null)[]>;
}) {
  const { camera, size, gl } = useThree();
  const { texture, height, cap } = useMemo(() => ({ texture: toTexture(textures.color, true), height: textures.height ? toTexture(textures.height, false) : null, cap: textures.cap ? toTexture(textures.cap, false) : null }), [textures]);
  const capHalf = textures.capHalf;
  useEffect(() => () => { texture.dispose(); height?.dispose(); cap?.dispose(); }, [texture, height, cap]);
  const moon = useRef<Group>(null);
  const rings = useRef<(Mesh | null)[]>([]);
  const earth = useRef<Mesh>(null);
  const smooth = useRef<StageKey | null>(null);
  const tmp = useMemo(() => ({ q: new Quaternion(), e: new Euler(), v: new Vector3(), w: new Vector3(), sun: new Vector3(), target: new Vector3() }), []);
  const stars = useStars();

  const moonMat = useMemo(() => new ShaderMaterial({
    uniforms: { map: { value: texture }, heightMap: { value: height ?? texture }, useHeight: { value: height ? 1 : 0 }, heightTexel: { value: new Vector2(1 / ((height ?? texture).image as ImageBitmap).width, 1 / ((height ?? texture).image as ImageBitmap).height) }, capNormal: { value: cap ?? texture }, capOn: { value: cap ? 1 : 0 }, capHalf: { value: capHalf }, texel: { value: new Vector2(1 / (texture.image as ImageBitmap).width, 1 / (texture.image as ImageBitmap).height) }, sunDir: { value: new Vector3(1, 0, 0) }, bumpScale: { value: height ? 0.03 : 0.004 }, exposure: { value: 1.15 } },
    vertexShader: moonVertex,
    fragmentShader: moonFragment,
  }), [texture, height, cap, capHalf]);
  const starMat = useMemo(() => new ShaderMaterial({
    uniforms: { time: { value: 0 } }, vertexShader: starVertex, fragmentShader: starFragment,
    transparent: true, depthWrite: false, blending: AdditiveBlending,
  }), []);
  const earthMat = useMemo(() => new ShaderMaterial({
    uniforms: { sunDir: { value: new Vector3(1, 0, 0) }, opacity: { value: 0 } },
    vertexShader: moonVertex, fragmentShader: earthFragment, transparent: true,
  }), []);
  const moonGeo = useMemo(() => new SphereGeometry(1, 256, 192), []);
  useEffect(() => () => { moonMat.dispose(); starMat.dispose(); earthMat.dispose(); moonGeo.dispose(); stars.dispose(); }, [moonMat, starMat, earthMat, moonGeo, stars]);

  // Earth sits ~5.5° below the lunar equator so a south-polar observer sees it just above the horizon (libration ±6.86°).
  const earthPos = useMemo(() => new Vector3(...lonLatToVec(-3.4, 3.2)).multiplyScalar(38), []);
  const sitePos = useMemo(() => SITES.map(s => new Vector3(...lonLatToVec(s.lat, s.lon)).multiplyScalar(1.0025)), []);
  const siteRot = useMemo(() => sitePos.map(p => new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), p.clone().normalize())), [sitePos]);

  useFrame(({ clock }, delta) => {
    const s = state.current;
    let key = sampleStage(s.chapter, s.stepped);
    if (s.diveStart !== null) key = mixKeys(key, DIVE, easeOut(Math.min(1, (performance.now() - s.diveStart) / DIVE_MS)));
    // Critically damped follow gives the Ascenta-style inertia on top of Lenis smoothing.
    const k = s.stepped || s.diveStart !== null ? 1 : 1 - Math.exp(-delta * 6);
    smooth.current = smooth.current ? mixKeys(smooth.current, key, k) : key;
    const cur = smooth.current;

    const idle = s.stepped ? 0 : clock.elapsedTime * 1.2 * Math.max(0, 1 - s.chapter * 2);
    tmp.e.set(cur.tilt * D2R, (-90 + idle) * D2R, 0, 'XYZ');
    tmp.q.setFromEuler(tmp.e);
    moon.current?.quaternion.copy(tmp.q);

    // Portrait screens: centre the Moon and pull back so it fits the width.
    const narrow = size.width < size.height;
    const xs = narrow ? 0.12 : 1;
    const zs = narrow ? 1 + 0.45 * Math.max(0, Math.min(1, (cur.camera[2] - 1.6) / 1.4)) : 1;
    camera.position.set(cur.camera[0] * xs, cur.camera[1], cur.camera[2] * zs);
    camera.lookAt(tmp.target.set(cur.target[0] * xs, cur.target[1], cur.target[2]));

    tmp.sun.set(...lonLatToVec(-1.2, cur.sunLon)).applyQuaternion(tmp.q).normalize();
    moonMat.uniforms.sunDir.value.copy(tmp.sun);
    earthMat.uniforms.sunDir.value.copy(tmp.sun);
    earthMat.uniforms.opacity.value = cur.earth;
    if (earth.current) earth.current.visible = cur.earth > 0.01;
    starMat.uniforms.time.value = clock.elapsedTime;

    // Site rings + DOM leader labels (projected every frame, written straight to the element).
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const hot = s.hovered === SITES[i].id;
      ring.visible = cur.sites > 0.01;
      const mat = ring.material as MeshBasicMaterial;
      mat.opacity = cur.sites * (hot ? 1 : 0.75);
      const scale = hot ? 1.45 : 1;
      ring.scale.setScalar(ring.scale.x + (scale - ring.scale.x) * Math.min(1, delta * 10));
      const el = labels.current[i];
      if (!el) return;
      tmp.w.copy(sitePos[i]).applyQuaternion(tmp.q);
      const facing = tmp.w.dot(tmp.v.copy(camera.position).sub(tmp.w)) > 0;
      tmp.v.copy(tmp.w).project(camera);
      const x = (tmp.v.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = facing ? String(cur.sites) : '0';
    });
  });

  useEffect(() => { gl.domElement.style.touchAction = 'pan-y'; }, [gl]);

  return <>
    <points geometry={stars} material={starMat} frustumCulled={false} />
    <group ref={moon}>
      <mesh geometry={moonGeo} material={moonMat} />
      {sitePos.map((p, i) => <mesh
        key={SITES[i].id}
        ref={el => { rings.current[i] = el; }}
        position={p}
        quaternion={siteRot[i]}
        onPointerOver={e => { e.stopPropagation(); onSiteHover(SITES[i].id); }}
        onPointerOut={() => onSiteHover(null)}
      >
        <ringGeometry args={[0.0062, 0.0085, 48]} />
        <meshBasicMaterial color={new Color('#efa767')} transparent depthWrite={false} />
      </mesh>)}
      <mesh ref={earth} position={earthPos}>
        <sphereGeometry args={[0.95, 48, 32]} />
        <primitive object={earthMat} attach="material" />
      </mesh>
    </group>
  </>;
}

function toTexture(bitmap: ImageBitmap, srgb: boolean): Texture {
  const texture = new Texture(bitmap as unknown as HTMLImageElement);
  if (srgb) texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.anisotropy = 8;
  texture.flipY = false; // createImageBitmap already flipped it
  texture.needsUpdate = true;
  return texture;
}

export default function MoonStage({ state, textures, onSiteHover, labels }: {
  state: MutableRefObject<StageState>;
  textures: MoonTextures;
  onSiteHover: (id: string | null) => void;
  labels: MutableRefObject<(HTMLElement | null)[]>;
}) {
  return <Canvas
    className="moon-stage"
    aria-hidden="true"
    camera={{ fov: 30, near: 0.01, far: 300, position: [0, 0, 5.2] }}
    dpr={[1, 1.75]}
    gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    onCreated={({ gl }) => gl.setClearColor('#09090a')}
  >
    <Rig state={state} textures={textures} onSiteHover={onSiteHover} labels={labels} />
  </Canvas>;
}
