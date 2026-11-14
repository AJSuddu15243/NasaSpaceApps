import * as THREE from 'three';
import { coordinateLabel, gridLines } from './geometry.ts';

export interface PolarMapOptions {
  /** The exact scene rendered by the 3D view; layers and markers remain shared. */
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  /** Converts the source polar-stereographic metre coordinates at the UI edge. */
  projectedToLatLon: (xMetres: number, zMetres: number) => { lat: number; lon: number };
  centerX: number;
  centerZ: number;
  extentKm: number;
  spacingKm: number;
  surfaceY?: number;
}

function textSprite(text: string, color: string, widthMetres: number): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas text is unavailable');
  context.font = '600 35px system-ui';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#111820';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.fillText(text, 256, 48, 490);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(widthMetres, widthMetres * canvas.height / canvas.width, 1);
  sprite.renderOrder = 1002;
  return sprite;
}

/** Changes the camera, not the scene graph used by the 3D view. */
export class PolarMapView {
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  readonly camera = new THREE.OrthographicCamera();
  private readonly overlay = new THREE.Group();
  private readonly projectedToLatLon: PolarMapOptions['projectedToLatLon'];
  private centerX: number;
  private centerZ: number;
  private extentKm: number;
  private spacingKm: number;
  private surfaceY: number;
  private aspect = 1;

  constructor(options: PolarMapOptions) {
    this.scene = options.scene;
    this.renderer = options.renderer;
    this.projectedToLatLon = options.projectedToLatLon;
    this.centerX = options.centerX;
    this.centerZ = options.centerZ;
    this.extentKm = options.extentKm;
    this.spacingKm = options.spacingKm;
    this.surfaceY = options.surfaceY ?? 0;
    this.overlay.name = 'polar-map-distance-grid';
    this.scene.add(this.overlay);
    this.camera.up.set(0, 0, -1);
    this.rebuild();
  }

  resize(width: number, height: number): void {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) throw new RangeError('Viewport size must be positive');
    this.aspect = width / height;
    const half = this.extentKm * 500;
    this.camera.left = -half * this.aspect;
    this.camera.right = half * this.aspect;
    this.camera.top = half;
    this.camera.bottom = -half;
    this.camera.updateProjectionMatrix();
  }

  setView(centerX: number, centerZ: number, extentKm = this.extentKm, spacingKm = this.spacingKm): void {
    gridLines({ centerX, centerZ, extentKm, spacingKm });
    this.centerX = centerX;
    this.centerZ = centerZ;
    this.extentKm = extentKm;
    this.spacingKm = spacingKm;
    this.rebuild();
  }

  setGridVisible(visible: boolean): void { this.overlay.visible = visible; }

  render(): void { this.renderer.render(this.scene, this.camera); }

  dispose(): void {
    this.scene.remove(this.overlay);
    this.clearOverlay();
  }

  private clearOverlay(): void {
    for (const child of [...this.overlay.children]) {
      this.overlay.remove(child);
      if (child instanceof THREE.LineSegments) child.geometry.dispose();
      if (child instanceof THREE.Sprite) {
        const material = child.material as THREE.SpriteMaterial;
        material.map?.dispose();
        material.dispose();
      }
      if (child instanceof THREE.LineSegments) (child.material as THREE.Material).dispose();
    }
  }

  private rebuild(): void {
    const segments = gridLines({ centerX: this.centerX, centerZ: this.centerZ, extentKm: this.extentKm, spacingKm: this.spacingKm });
    this.clearOverlay();
    const positions = new Float32Array(segments.length / 2 * 3);
    for (let i = 0, j = 0; i < segments.length; i += 2) {
      positions[j++] = segments[i];
      positions[j++] = this.surfaceY + 1;
      positions[j++] = segments[i + 1];
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x9ba9ad, transparent: true, opacity: 0.55, depthTest: false }));
    line.renderOrder = 1000;
    this.overlay.add(line);

    const half = this.extentKm * 500;
    const step = this.spacingKm * 1000;
    const labelWidth = Math.min(step * 0.8, half * 0.5);
    const startX = Math.ceil((this.centerX - half) / step) * step;
    const startZ = Math.ceil((this.centerZ - half) / step) * step;
    for (let x = startX; x <= this.centerX + half; x += step) {
      const label = textSprite(`x ${(x / 1000).toFixed(0)} km`, '#e8eeec', labelWidth);
      label.position.set(x, this.surfaceY + 2, this.centerZ + half - step * 0.18);
      this.overlay.add(label);
    }
    for (let z = startZ; z <= this.centerZ + half; z += step) {
      const label = textSprite(`y ${(z / 1000).toFixed(0)} km`, '#e8eeec', labelWidth);
      label.position.set(this.centerX - half + step * 0.3, this.surfaceY + 2, z);
      this.overlay.add(label);
    }
    for (const [x, z] of [[this.centerX, this.centerZ], [this.centerX - half * 0.72, this.centerZ - half * 0.72], [this.centerX + half * 0.72, this.centerZ + half * 0.72]]) {
      const { lat, lon } = this.projectedToLatLon(x, z);
      const label = textSprite(coordinateLabel(lat, lon), '#f0bd61', Math.max(step * 1.7, half * 0.7));
      label.position.set(x, this.surfaceY + 3, z);
      this.overlay.add(label);
    }
    this.camera.position.set(this.centerX, this.surfaceY + Math.max(this.extentKm * 1000, 10_000), this.centerZ);
    this.camera.lookAt(this.centerX, this.surfaceY, this.centerZ);
    this.camera.near = 1;
    this.camera.far = Math.max(this.extentKm * 2000, 20_000);
    this.camera.updateProjectionMatrix();
    this.resize(this.extentKm * this.aspect, this.extentKm);
  }
}
