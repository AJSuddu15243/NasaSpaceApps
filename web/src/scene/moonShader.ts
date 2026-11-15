export const moonVertex = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying mat3 vToWorld;
  varying vec3 vObj;
  void main() {
    vUv = uv;
    vObj = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPosW = world.xyz;
    vToWorld = mat3(modelMatrix);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
// Lunar-Lambert shading (Lommel-Seeliger blended with Lambert) keeps the full Moon flat and bright the way the real
// one is. Relief comes from texel-space height differences along local east/north (stable at the terminator,
// unlike screen-space derivatives).
export const moonFragment = /* glsl */`
  uniform sampler2D map;
  uniform sampler2D heightMap;
  uniform float useHeight;
  uniform vec2 heightTexel;
  uniform vec2 texel;
  uniform vec3 sunDir;
  uniform float bumpScale;
  uniform float exposure;
  uniform sampler2D capNormal;
  uniform float capOn;
  uniform float capHalf;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying mat3 vToWorld;
  varying vec3 vObj;
  const float PI = 3.141592653589793;
  const float R_M = 1737400.0;

  float polarBias;
  // Real LOLA heights when the manifest ships them (8-bit, ~20 km per step of relief); otherwise albedo luminance.
  float height(vec2 uv) {
    return useHeight > 0.5 ? texture2D(heightMap, uv, polarBias).r : dot(texture2D(map, uv, polarBias).rgb, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    float phi = vUv.x * 2.0 * PI;
    float theta = (1.0 - vUv.y) * PI;
    float sinT = max(sin(theta), 0.03);
    // Equirectangular texels smear toward the poles: blur them there instead of showing streaks.
    polarBias = 4.0 * (1.0 - smoothstep(0.08, 0.5, sinT));
    vec3 albedo = texture2D(map, vUv, polarBias).rgb;
    vec3 east = normalize(vToWorld * vec3(sin(phi), 0.0, cos(phi)));
    vec3 north = normalize(vToWorld * vec3(cos(phi) * cos(theta), sin(theta), -sin(phi) * cos(theta)));
    vec2 tx = useHeight > 0.5 ? heightTexel : texel;
    vec2 du = vec2(tx.x / sinT, 0.0);
    vec2 dv = vec2(0.0, tx.y);
    float dhE = (height(vUv + du) - height(vUv - du)) / (2.0 * du.x * 2.0 * PI * sinT);
    float dhN = (height(vUv + dv) - height(vUv - dv)) / (2.0 * dv.y * PI);
    vec3 n0 = normalize(vNormalW);
    vec3 n = normalize(n0 - bumpScale * smoothstep(0.1, 0.45, sinT) * (dhE * east + dhN * north));

    // South-pole cap: real LOLA normals in the DEM's polar-stereographic grid (+x toward 90E, +y toward 0E).
    vec3 p = normalize(vObj);
    float lat = asin(clamp(p.y, -1.0, 1.0));
    float capW = capOn * smoothstep(-1.396, -1.422, lat); // fades in from 80 S to 81.5 S
    if (capW > 0.0) {
      float lon = atan(-p.z, p.x);
      float rho = 2.0 * R_M * tan((PI * 0.5 + lat) * 0.5);
      vec2 g = rho * vec2(sin(lon), cos(lon));
      vec3 gn = texture2D(capNormal, (g + capHalf) / (2.0 * capHalf)).xyz * 2.0 - 1.0;
      vec3 eastO = vec3(-sin(lon), 0.0, -cos(lon));
      vec3 northO = vec3(-sin(lat) * cos(lon), cos(lat), sin(lat) * sin(lon));
      vec3 mapX = cos(lon) * eastO + sin(lon) * northO;
      vec3 mapY = -sin(lon) * eastO + cos(lon) * northO;
      vec3 capN = normalize(vToWorld * (gn.x * mapX + gn.y * mapY + gn.z * p));
      n = normalize(mix(n, capN, capW));
      // The global map is stretched at the pole; use its average tone instead of its streaks.
      albedo = mix(albedo, vec3(0.42, 0.415, 0.405), capW);
    }
    vec3 v = normalize(cameraPosition - vPosW);
    float mu0 = max(dot(n, sunDir), 0.0);
    float mu = max(dot(n0, v), 0.0);
    float lommel = mu0 / max(mu0 + mu, 1e-3);
    float lit = mix(mu0, 2.0 * lommel, 0.5) * smoothstep(-0.02, 0.05, dot(n0, sunDir));
    float earthshine = 0.02 * (0.5 + 0.5 * dot(n0, -sunDir));
    vec3 col = albedo * (lit * exposure) + albedo * earthshine * vec3(0.62, 0.74, 1.0);
    gl_FragColor = linearToOutputTexel(vec4(col, 1.0));
  }
`;
