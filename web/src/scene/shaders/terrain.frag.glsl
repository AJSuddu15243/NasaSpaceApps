uniform vec2 uElevationRangeM;
uniform vec3 uLightDirectionView;
uniform float uHillshadeStrength;
uniform bool uShowContours;
uniform float uContourIntervalM;
uniform float uContourWidthM;
uniform float uContourOpacity;
uniform vec3 uContourColor;

varying float vElevationM;
varying vec3 vNormalView;

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

float contourMask() {
  if (!uShowContours || uContourIntervalM <= 0.0) {
    return 0.0;
  }

  float phase = mod(vElevationM - uElevationRangeM.x, uContourIntervalM);
  float distanceToLine = min(phase, uContourIntervalM - phase);
  float antiAliasWidth = max(fwidth(vElevationM) * 1.5, uContourWidthM * 2.0);
  return 1.0 - smoothstep(uContourWidthM, antiAliasWidth, distanceToLine);
}

void main() {
  float elevationSpan = max(uElevationRangeM.y - uElevationRangeM.x, 0.0001);
  float normalizedElevation = clamp(
    (vElevationM - uElevationRangeM.x) / elevationSpan,
    0.0,
    1.0
  );
  vec3 elevationColor = cividisRamp(normalizedElevation);
  float sun = max(dot(normalize(vNormalView), normalize(uLightDirectionView)), 0.0);
  float hillshade = mix(1.0, 0.35 + 0.65 * sun, clamp(uHillshadeStrength, 0.0, 1.0));
  vec3 shadedColor = elevationColor * hillshade;
  float contours = contourMask() * clamp(uContourOpacity, 0.0, 1.0);

  gl_FragColor = vec4(mix(shadedColor, uContourColor, contours), 1.0);
}
