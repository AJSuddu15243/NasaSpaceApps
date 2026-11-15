import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three';
import type { TerrainFrame } from './coordinates';
import type { CameraMode } from './types';

export function SceneCamera({ frame, view, mode, resetKey }: {
  frame: TerrainFrame; view: '3d' | 'map'; mode: CameraMode; resetKey: number;
}) {
  const { gl, size, set, invalidate } = useThree();
  const camera = useMemo(() => view === 'map' ? new OrthographicCamera() : new PerspectiveCamera(42), [view]);
  const controlRef = useRef<OrbitControls | null>(null);
  useEffect(() => {
    set({ camera });
    const controls = new OrbitControls(camera, gl.domElement);
    controlRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.enableRotate = view !== 'map';
    controls.screenSpacePanning = true;
    controls.minDistance = frame.span * 0.08;
    controls.maxDistance = frame.span * 4;
    controls.minZoom = 0.5; controls.maxZoom = 16;
    const redraw = () => invalidate();
    controls.addEventListener('change', redraw);
    return () => { controls.removeEventListener('change', redraw); controls.dispose(); controlRef.current = null; };
  }, [camera, gl, frame.span, invalidate, set, view]);
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    camera.near = 0.005; camera.far = frame.span * 12;
    camera.up.copy(frame.up);
    if (camera instanceof OrthographicCamera) {
      const half = frame.span * 0.62;
      camera.left = -half * Math.max(1, aspect); camera.right = -camera.left;
      camera.top = half / Math.min(1, aspect); camera.bottom = -camera.top;
    } else camera.aspect = aspect;
    camera.updateProjectionMatrix(); invalidate();
  }, [camera, frame, size, invalidate]);
  useEffect(() => {
    const controls = controlRef.current;
    if (!controls) return;
    // Fit immediately, also respecting reduced motion.
    const distance = frame.span * (mode === 'orbit' ? 1.9 : 1.1);
    camera.position.copy(frame.normal).multiplyScalar(distance);
    if (view === '3d') camera.position.addScaledVector(frame.up, -distance * 0.8).addScaledVector(frame.right, distance * 0.4);
    camera.zoom = 1;
    controls.target.set(0, 0, 0);
    camera.lookAt(new Vector3()); camera.updateProjectionMatrix();
    controls.update(); invalidate();
  }, [camera, frame, view, mode, resetKey, invalidate]);
  useFrame(() => controlRef.current?.update());
  return null;
}
