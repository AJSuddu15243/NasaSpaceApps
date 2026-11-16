import type { TerrainAssets } from './terrainAssets';
import type { MutableRefObject } from "react";
import type { Texture } from 'three';

/** A Moon-fixed vector in the R3F scene coordinate system. */
export type SceneVector = readonly [number, number, number];

/**
 * The terrain shape supplied by the tile pipeline. x0/y0 are south polar
 * stereographic metres from the lunar south pole; elevation values are metres
 * above the mean lunar radius.
 */
export interface SouthPoleTile {
  readonly id: string;
  readonly x0M: number;
  readonly y0M: number;
  readonly cellM: number;
  readonly columns: number;
  readonly rows: number;
  readonly elevationM: ArrayLike<number>;
}

/** Updated by the engine and ephemeris providers without React rerenders. */
export interface SceneSimulationState {
  readonly sunDirection?: SceneVector;
  readonly earthDirection?: SceneVector;
  readonly suitability?: Float32Array;
}

export type SceneSimulationRef = MutableRefObject<SceneSimulationState>;

export type CameraMode = "orbit" | "south-pole";

export interface SceneSiteMarker {
  readonly id: string;
  readonly name: string;
  readonly lat: number;
  readonly lon: number;
  readonly index: number;
}

export interface LunarSceneProps {
  readonly onProbe?: (u: number, v: number) => void;
  readonly onImageryError?: () => void;
  readonly active?: boolean;
  readonly view?: '3d' | 'map';
  readonly assets?: TerrainAssets;
  readonly layer?: 'relief' | 'imagery' | 'elevation' | 'slope';
  readonly scalarMap?: Texture;
  readonly overlayOpacity?: number;
  readonly exaggeration?: 1 | 2;
  readonly onSiteSelect?: (id: string) => void;
  readonly sites?: readonly SceneSiteMarker[];
  readonly elevationEnabled?: boolean;
  /** Changes invalidate the demand-rendered scene after the caller updates simulationRef. */
  readonly timeKey?: string;
  readonly resetKey?: number;

  readonly tile?: SouthPoleTile;
  readonly simulationRef?: SceneSimulationRef;
  readonly contoursEnabled?: boolean;
  readonly cameraMode?: CameraMode;
  readonly onCameraModeChange?: (mode: CameraMode) => void;
  readonly className?: string;
  readonly "aria-label"?: string;
}
