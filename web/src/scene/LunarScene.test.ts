import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PerspectiveCamera, Vector3 } from "three";
import { expect, test, vi } from "vitest";

import { LunarScene } from "./LunarScene";

const projection = vi.hoisted(() => ({ near: undefined as number | undefined }));

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ camera }: { camera?: { near?: number } }) => {
    projection.near = camera?.near;
    return null;
  },
  useFrame: vi.fn(),
  useThree: vi.fn(),
}));

test("the pole camera keeps zero-height terrain inside its clip depth", () => {
  renderToStaticMarkup(createElement(LunarScene));
  const camera = new PerspectiveCamera(75, 1.5, projection.near, 1000);
  camera.position.set(0.052, -1.04, 0.075);
  camera.lookAt(0, -1, 0);
  camera.updateMatrixWorld();
  const pole = new Vector3(0, -1, 0).project(camera);
  expect(pole.z).toBeGreaterThanOrEqual(-1);
  expect(pole.z).toBeLessThanOrEqual(1);
});
