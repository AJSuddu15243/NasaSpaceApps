uniform vec2 uElevationRangeM;
uniform bool uShowContours;
uniform bool uElevationEnabled;
uniform float uContourIntervalM;
varying float vElevationM;
varying vec2 vTerrainUv;
uniform sampler2D uSlopeMap;
uniform sampler2D uImage;
uniform sampler2D uScalarMap;
uniform vec4 uSlopeUv;
uniform vec4 uImageUv;
uniform vec4 uScalarUv;
uniform int uLayer;
uniform float uOverlayOpacity;


// Cividis is designed to remain readable for common forms of colour-vision deficiency.
vec3 cividisRamp(float value) {
  const vec3 deepBlue = vec3(0.000, 0.126, 0.302);
  const vec3 blue = vec3(0.118, 0.298, 0.471);
  const vec3 teal = vec3(0.275, 0.435, 0.416);
  const vec3 ochre = vec3(0.616, 0.573, 0.322);
  const vec3 yellow = vec3(0.992, 0.906, 0.145);

  if (value < 0.25) {
    return mix(deepBlue, blue, value * 4.0);
  }
  if (value < 0.5) {
    return mix(blue, teal, (value - 0.25) * 4.0);
  }
  if (value < 0.75) {
    return mix(teal, ochre, (value - 0.5) * 4.0);
  }
  return mix(ochre, yellow, (value - 0.75) * 4.0);
}

vec3 terrainColor() {
  float height = clamp((vElevationM - uElevationRangeM.x) / (uElevationRangeM.y - uElevationRangeM.x), 0.0, 1.0);
  vec3 base = uElevationEnabled ? cividisRamp(height) : mix(vec3(0.32, 0.34, 0.36), vec3(0.62, 0.63, 0.64), height);
  if (uLayer == 1) base = texture2D(uImage, uImageUv.xy + vTerrainUv * uImageUv.zw).rgb;
  if (uLayer == 4) base = texture2D(uScalarMap, uScalarUv.xy + vTerrainUv * uScalarUv.zw).rgb;
  if (uLayer == 3) {
    vec2 gridUv = uSlopeUv.xy + vTerrainUv * uSlopeUv.zw;
    vec4 packed = texture2D(uSlopeMap, gridUv);
    float slope = (packed.r * 65280.0 + packed.g * 255.0) * (90.0 / 65535.0);
    base = mix(base, cividisRamp(clamp(slope / 30.0, 0.0, 1.0)), uOverlayOpacity);
    float width = max(fwidth(slope), 0.08);
    float limitLine = 1.0 - smoothstep(width, width * 2.0, abs(slope - 10.0));
    base = mix(base, vec3(0.98), limitLine * uOverlayOpacity);
  }
  if (uShowContours) {
    float phase = mod(vElevationM, uContourIntervalM);
    float distanceToLine = min(phase, uContourIntervalM - phase);
    float width = max(fwidth(vElevationM), 0.4);
    float line = 1.0 - smoothstep(0.0, width, distanceToLine);
    base = mix(base, vec3(0.04), line * 0.75);
  }
  return base;
}
