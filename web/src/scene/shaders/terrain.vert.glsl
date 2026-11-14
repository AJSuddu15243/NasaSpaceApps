uniform float uMoonRadiusM;
uniform float uBaseRadius;
uniform float uVerticalExaggeration;

varying float vElevationM;
varying vec3 vNormalView;

void main() {
  float radiusOffset = length(position) - uBaseRadius;
  vElevationM = radiusOffset * uMoonRadiusM / max(uVerticalExaggeration, 0.0001);
  vNormalView = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
