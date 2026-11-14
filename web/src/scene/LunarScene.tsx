import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactElement } from "react";
import type { Group } from "three";

import { createMockSouthPoleTile } from "./mockTerrain";
import { MoonGlobe } from "./MoonGlobe";
import { SceneCamera } from "./SceneCamera";
import { SouthPolePatch } from "./SouthPolePatch";
import type { CameraMode, LunarSceneProps, SceneSimulationRef } from "./types";

const sceneStyle: CSSProperties = {
  width: "100%",
  minHeight: 480,
  background: "#121212",
};

function usePageVisibility(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = (): void => setVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return visible;
}

function SimulationBridge({ simulationRef }: { simulationRef?: SceneSimulationRef }): ReactElement {
  const groupRef = useRef<Group | null>(null);

  useFrame(() => {
    if (groupRef.current && simulationRef) {
      groupRef.current.userData.simulation = simulationRef.current;
    }
  });

  return <group ref={groupRef} />;
}

function SceneContents({
  mode,
  simulationRef,
  tile,
  contoursEnabled,
}: {
  readonly mode: CameraMode;
  readonly simulationRef?: SceneSimulationRef;
  readonly tile: NonNullable<LunarSceneProps["tile"]>;
  readonly contoursEnabled: boolean;
}): ReactElement {
  return (
    <>
      <color attach="background" args={["#121212"]} />
      <fog attach="fog" args={["#121212", 2.6, 5.5]} />
      <ambientLight intensity={0.72} />
      {/* shortcut: static presentation light until SCN-3 uses the ephemeris Sun vector. */}
      <directionalLight castShadow intensity={1.1} position={[3, 2, 4]} />
      <MoonGlobe />
      <SouthPolePatch tile={tile} contoursEnabled={contoursEnabled} />
      <SceneCamera mode={mode} />
      <SimulationBridge simulationRef={simulationRef} />
    </>
  );
}

export function LunarScene({
  tile,
  simulationRef,
  contoursEnabled = false,
  cameraMode,
  onCameraModeChange,
  className,
  "aria-label": ariaLabel = "Interactive lunar south-pole terrain scene",
}: LunarSceneProps): ReactElement {
  const visible = usePageVisibility();
  const mockTile = useMemo(() => createMockSouthPoleTile(), []);
  const [uncontrolledCameraMode, setUncontrolledCameraMode] = useState<CameraMode>("orbit");
  const activeTile = tile ?? mockTile;
  const activeCameraMode = cameraMode ?? uncontrolledCameraMode;

  const toggleCameraMode = (): void => {
    const nextMode = activeCameraMode === "orbit" ? "south-pole" : "orbit";
    if (cameraMode === undefined) {
      setUncontrolledCameraMode(nextMode);
    }
    onCameraModeChange?.(nextMode);
  };

  return (
    <Canvas
      aria-label={ariaLabel}
      className={className}
      dpr={[1, 1.75]}
      frameloop={visible ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      shadows
      style={sceneStyle}
      tabIndex={0}
      onDoubleClick={toggleCameraMode}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleCameraMode();
        }
      }}
    >
      <SceneContents mode={activeCameraMode} simulationRef={simulationRef} tile={activeTile} contoursEnabled={contoursEnabled} />
    </Canvas>
  );
}
