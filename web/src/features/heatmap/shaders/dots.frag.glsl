varying vec3 vColor;
varying float vAlpha;
varying float vGlow;

void main() {
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float core = 1.0 - smoothstep(0.18, 0.5, r);
  float halo = (1.0 - smoothstep(0.0, 0.5, r)) * 0.55 * (0.4 + vGlow);
  gl_FragColor = vec4(vColor * (core + halo), (core * 0.9 + halo) * vAlpha);
}
