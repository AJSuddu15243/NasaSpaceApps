import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Vector3 } from 'three';

/** DOM labels need a separate DOM renderer root: a ReactDOM portal is still reconciled by R3F. */
export function SceneLabel({ position, children, globe = false }: { position: Vector3; children: ReactNode; globe?: boolean }) {
  const { gl } = useThree();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const projected = useMemo(() => new Vector3(), []);
  useEffect(() => {
    const host = document.createElement('div');
    Object.assign(host.style, { position: 'absolute', top: '0', left: '0', zIndex: '2' });
    const root = createRoot(host);
    hostRef.current = host;
    rootRef.current = root;
    gl.domElement.parentElement?.appendChild(host);
    return () => {
      host.remove();
      hostRef.current = null;
      rootRef.current = null;
      // React may be committing the R3F tree; finish that commit before unmounting this DOM root.
      queueMicrotask(() => root.unmount());
    };
  }, [gl]);
  useEffect(() => { rootRef.current?.render(children); }, [children, gl]);
  useFrame(({ camera, size }) => {
    const host = hostRef.current;
    if (!host) return;
    projected.copy(position).project(camera);
    host.hidden = (globe && position.dot(camera.position) <= position.lengthSq()) || projected.z < -1 || projected.z > 1 || Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1;
    host.style.transform = `translate(${(projected.x + 1) * size.width / 2}px, ${(1 - projected.y) * size.height / 2}px) translate(-50%, -50%)`;
  });
  return null;
}
