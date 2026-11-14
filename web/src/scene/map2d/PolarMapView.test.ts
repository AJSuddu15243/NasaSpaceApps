import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { PolarMapView } from './PolarMapView.ts';

test('map uses the original scene, renderer, layers, and markers', () => {
  const originalDocument = globalThis.document;
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    createElement: () => ({ width: 0, height: 0, getContext: () => ({
      font: '', textAlign: '', textBaseline: '', fillStyle: '', fillRect() {}, fillText() {},
    }) }),
  } });
  try {
    const scene = new THREE.Scene();
    const terrain = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000));
    const marker = new THREE.Object3D();
    scene.add(terrain, marker);
    let renderedScene: THREE.Scene | null = null;
    let renderedCamera: THREE.Camera | null = null;
    const renderer = { render: (s: THREE.Scene, c: THREE.Camera) => { renderedScene = s; renderedCamera = c; } } as unknown as THREE.WebGLRenderer;
    const map = new PolarMapView({ scene, renderer, projectedToLatLon: () => ({ lat: -89.5, lon: 15 }), centerX: 0, centerZ: 0, extentKm: 2, spacingKm: 1 });
    map.resize(800, 400);
    map.render();
    assert.equal(renderedScene, scene);
    assert.equal(renderedCamera, map.camera);
    assert.ok(map.camera instanceof THREE.OrthographicCamera);
    assert.equal(map.camera.right - map.camera.left, 4000);
    assert.ok(scene.children.includes(terrain));
    assert.ok(scene.children.includes(marker));
    map.dispose();
    assert.deepEqual(scene.children, [terrain, marker]);
    terrain.geometry.dispose();
    (terrain.material as THREE.Material).dispose();
  } finally {
    Object.defineProperty(globalThis, 'document', { configurable: true, value: originalDocument });
  }
});
