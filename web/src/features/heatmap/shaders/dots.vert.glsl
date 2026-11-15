// Dot-matrix heatmap. Presentation only: colour and height come from data attributes; the cursor wave is
// a visual effect and never feeds back into any result (SPEC guardrail 5).
uniform float uTime;
uniform vec2 uCursor;      // field-local xz of the pointer
uniform float uHover;      // 0..1 eased pointer presence
uniform float uReveal;     // 0..1 entrance
uniform float uSwapAge;    // seconds since the layer changed (drives the shockwave)
uniform float uRelief;     // vertical scale of elevation
uniform float uSize;       // base dot size in px
uniform float uPixelRatio;
uniform float uMotion;     // 0 = reduced motion
uniform float uOpacity;    // layer fade (strata view)
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;

attribute float aValue;    // 0..1 normalised layer value, < 0 = excluded / no data
attribute float aElev;     // 0..1 normalised elevation
attribute float aMark;     // 1 inside a ranked area

varying vec3 vColor;
varying float vAlpha;
varying float vGlow;

vec3 ramp(float t) {
  return t < 0.5 ? mix(uC0, uC1, t * 2.0) : mix(uC1, uC2, (t - 0.5) * 2.0);
}

void main() {
  vec3 p = position;
  float r0 = length(p.xz);
  float d = distance(p.xz, uCursor);
  float bump = exp(-d * d / 0.03) * 0.16;
  float ripple = sin(d * 28.0 - uTime * 5.5) * exp(-d * 3.4) * 0.045;
  float wave = uHover * (bump + ripple) * uMotion;
  float idle = sin(p.x * 3.1 + uTime * 0.7) * sin(p.z * 2.7 + uTime * 0.55) * 0.010 * uMotion;
  float front = uSwapAge * 1.7;
  float shock = exp(-pow(r0 - front, 2.0) / 0.006) * 0.07 * step(uSwapAge, 2.0) * uMotion;
  float reveal = smoothstep(0.0, 1.0, clamp(uReveal * 1.8 - r0 * 0.6, 0.0, 1.0));
  p.y = (aElev * uRelief + wave + idle + shock) * reveal;

  bool excluded = aValue < 0.0;
  vec3 c = excluded ? vec3(0.16, 0.2, 0.19) : ramp(aValue);
  float lift = clamp((wave + shock) * 7.0, 0.0, 1.0);
  c = mix(c, vec3(1.0, 0.92, 0.79), lift * 0.45);
  float scan = (1.0 - smoothstep(0.0, 0.035, abs(fract(p.z * 0.5 + 0.5 - uTime * 0.09) - 0.5))) * uMotion;
  c += vec3(0.85, 0.64, 0.36) * scan * 0.35;
  vColor = c;
  vAlpha = (excluded ? 0.35 : 0.95) * reveal * uOpacity;
  vGlow = lift + aMark * (0.55 + 0.45 * sin(uTime * 3.0) * uMotion);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (1.0 + lift * 1.6 + aMark * 0.8) * (2.4 / -mv.z);
}
