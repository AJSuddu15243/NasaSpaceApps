import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Vector3 } from "three";

import type { CameraMode } from "./types";

const ORBIT_POSITION = new Vector3(1.85, 1.15, 1.85);
const ORBIT_TARGET = new Vector3(0, 0, 0);
const POLE_POSITION = new Vector3(0.052, -1.04, 0.075);
const POLE_TARGET = new Vector3(0, -1, 0);

interface SceneCameraProps {
  readonly mode: CameraMode;
}

function cameraPose(mode: CameraMode): { position: Vector3; target: Vector3 } {
  return mode === "south-pole"
    ? { position: POLE_POSITION, target: POLE_TARGET }
    : { position: ORBIT_POSITION, target: ORBIT_TARGET };
}

export function SceneCamera({ mode }: SceneCameraProps): null {
  const { camera, gl } = useThree();
  const controls = useMemo(() => {
    const nextControls = new OrbitControls(camera, gl.domElement);
    nextControls.enableDamping = true;
    nextControls.dampingFactor = 0.08;
    nextControls.minDistance = 0.025;
    nextControls.maxDistance = 4;
    nextControls.minPolarAngle = 0.05;
    nextControls.maxPolarAngle = Math.PI - 0.05;
    nextControls.rotateSpeed = 0.55;
    nextControls.zoomSpeed = 0.75;
    nextControls.panSpeed = 0.45;
    return nextControls;
  }, [camera, gl.domElement]);
  const transitionTarget = useRef(cameraPose(mode));
  const isTransitioning = useRef(true);

  useEffect(() => () => controls.dispose(), [controls]);

  useEffect(() => {
    transitionTarget.current = cameraPose(mode);
    isTransitioning.current = true;
  }, [mode]);

  useFrame((_, delta) => {
    if (isTransitioning.current) {
      const blend = 1 - Math.exp(-delta * 3.8);
      camera.position.lerp(transitionTarget.current.position, blend);
      controls.target.lerp(transitionTarget.current.target, blend);

      if (
        camera.position.distanceTo(transitionTarget.current.position) < 0.001 &&
        controls.target.distanceTo(transitionTarget.current.target) < 0.001
      ) {
        camera.position.copy(transitionTarget.current.position);
        controls.target.copy(transitionTarget.current.target);
        isTransitioning.current = false;
      }
    }

    controls.update();
  });

  return null;
}
