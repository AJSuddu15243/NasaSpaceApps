import { expect, test } from "vitest";

import { createSouthPoleTerrainGeometry, MOON_RADIUS_M } from "./terrain";
import type { SouthPoleTile } from "./types";

function makeTile(x0M: number, y0M: number): SouthPoleTile {
  return {
    id: "regression-tile",
    x0M,
    y0M,
    cellM: 100,
    columns: 2,
    rows: 2,
    elevationM: new Float32Array(4),
  };
}

function inverseSouthPolarStereographic(xM: number, yM: number): readonly [number, number, number] {
  const rhoSquared = xM * xM + yM * yM;
  const fourRadiusSquared = 4 * MOON_RADIUS_M * MOON_RADIUS_M;
  const denominator = fourRadiusSquared + rhoSquared;
  return [
    fourRadiusSquared * xM / denominator / MOON_RADIUS_M,
    -(fourRadiusSquared - rhoSquared) / denominator,
    fourRadiusSquared * yM / denominator / MOON_RADIUS_M,
  ];
}

test("terrain triangles face outward at the south pole", () => {
  const geometry = createSouthPoleTerrainGeometry(makeTile(0, 0));
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");

  const dot = position.getX(0) * normal.getX(0)
    + position.getY(0) * normal.getY(0)
    + position.getZ(0) * normal.getZ(0);

  expect(dot).toBeGreaterThan(0.99);
  geometry.dispose();
});

test("terrain vertices follow the inverse south-polar stereographic projection", () => {
  const geometry = createSouthPoleTerrainGeometry(makeTile(250_000, 100_000));
  const position = geometry.getAttribute("position");
  const expected = inverseSouthPolarStereographic(250_000, 100_000);

  expect(position.getX(0)).toBeCloseTo(expected[0], 7);
  expect(position.getY(0)).toBeCloseTo(expected[1], 7);
  expect(position.getZ(0)).toBeCloseTo(expected[2], 7);
  geometry.dispose();
});
