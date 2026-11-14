import type { SouthPoleTile } from "./types";

const MOCK_SIZE = 129;
const MOCK_CELL_M = 120;

/**
 * A deterministic development tile. It is intentionally kept in this folder
 * until PIPE-4 provides south-polar DEM tiles under the shared file contract.
 */
export function createMockSouthPoleTile(): SouthPoleTile {
  const elevationM = new Float32Array(MOCK_SIZE * MOCK_SIZE);
  const halfWidthM = ((MOCK_SIZE - 1) * MOCK_CELL_M) / 2;

  for (let row = 0; row < MOCK_SIZE; row += 1) {
    for (let column = 0; column < MOCK_SIZE; column += 1) {
      const xM = column * MOCK_CELL_M - halfWidthM;
      const yM = row * MOCK_CELL_M - halfWidthM;
      const radiusM = Math.hypot(xM, yM);
      const crater = -220 * Math.exp(-(radiusM ** 2) / (2 * 2_100 ** 2));
      const rim = 90 * Math.exp(-((radiusM - 2_800) ** 2) / (2 * 700 ** 2));
      const ridge = 34 * Math.sin(xM / 640) * Math.cos(yM / 860);
      const index = row * MOCK_SIZE + column;

      elevationM[index] = crater + rim + ridge;
    }
  }

  return {
    id: "mock-south-pole",
    x0M: -halfWidthM,
    y0M: -halfWidthM,
    cellM: MOCK_CELL_M,
    columns: MOCK_SIZE,
    rows: MOCK_SIZE,
    elevationM,
  };
}
