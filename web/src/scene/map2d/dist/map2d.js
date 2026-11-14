import * as o from "three";
function g({ centerX: h, centerZ: e, extentKm: s, spacingKm: t }) {
  if (![h, e, s, t].every(Number.isFinite) || s <= 0 || t <= 0)
    throw new RangeError("Grid centre and spacing must be finite; extent and spacing must be positive");
  if (s / t > 100) throw new RangeError("Use at most 100 grid intervals");
  const r = s * 500, i = t * 1e3, a = h - r, m = h + r, d = e - r, f = e + r, n = [], c = Math.ceil(a / i) * i, p = Math.ceil(d / i) * i;
  for (let l = c; l <= m; l += i) n.push(l || 0, d, l || 0, f);
  for (let l = p; l <= f; l += i) n.push(a, l || 0, m, l || 0);
  return Float32Array.from(n);
}
function v(h, e) {
  if (!Number.isFinite(h) || !Number.isFinite(e) || Math.abs(h) > 90) throw new RangeError("Invalid latitude or longitude");
  const s = ((e + 180) % 360 + 360) % 360 - 180, t = `${Math.abs(h).toFixed(2)}°${h < 0 ? "S" : "N"}`, r = `${Math.abs(s).toFixed(2)}°${s < 0 ? "W" : "E"}`;
  return `${t}  ${r}`;
}
function u(h, e, s) {
  const t = document.createElement("canvas");
  t.width = 512, t.height = 96;
  const r = t.getContext("2d");
  if (!r) throw new Error("Canvas text is unavailable");
  r.font = "600 35px system-ui", r.textAlign = "center", r.textBaseline = "middle", r.fillStyle = "#111820", r.fillRect(0, 0, t.width, t.height), r.fillStyle = e, r.fillText(h, 256, 48, 490);
  const i = new o.CanvasTexture(t);
  i.colorSpace = o.SRGBColorSpace;
  const a = new o.SpriteMaterial({ map: i, depthTest: !1, transparent: !0 }), m = new o.Sprite(a);
  return m.scale.set(s, s * t.height / t.width, 1), m.renderOrder = 1002, m;
}
class b {
  scene;
  renderer;
  camera = new o.OrthographicCamera();
  overlay = new o.Group();
  projectedToLatLon;
  centerX;
  centerZ;
  extentKm;
  spacingKm;
  surfaceY;
  aspect = 1;
  constructor(e) {
    this.scene = e.scene, this.renderer = e.renderer, this.projectedToLatLon = e.projectedToLatLon, this.centerX = e.centerX, this.centerZ = e.centerZ, this.extentKm = e.extentKm, this.spacingKm = e.spacingKm, this.surfaceY = e.surfaceY ?? 0, this.overlay.name = "polar-map-distance-grid", this.scene.add(this.overlay), this.camera.up.set(0, 0, -1), this.rebuild();
  }
  resize(e, s) {
    if (!Number.isFinite(e) || !Number.isFinite(s) || e <= 0 || s <= 0) throw new RangeError("Viewport size must be positive");
    this.aspect = e / s;
    const t = this.extentKm * 500;
    this.camera.left = -t * this.aspect, this.camera.right = t * this.aspect, this.camera.top = t, this.camera.bottom = -t, this.camera.updateProjectionMatrix();
  }
  setView(e, s, t = this.extentKm, r = this.spacingKm) {
    g({ centerX: e, centerZ: s, extentKm: t, spacingKm: r }), this.centerX = e, this.centerZ = s, this.extentKm = t, this.spacingKm = r, this.rebuild();
  }
  setGridVisible(e) {
    this.overlay.visible = e;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.scene.remove(this.overlay), this.clearOverlay();
  }
  clearOverlay() {
    for (const e of [...this.overlay.children]) {
      if (this.overlay.remove(e), e instanceof o.LineSegments && e.geometry.dispose(), e instanceof o.Sprite) {
        const s = e.material;
        s.map?.dispose(), s.dispose();
      }
      e instanceof o.LineSegments && e.material.dispose();
    }
  }
  rebuild() {
    const e = g({ centerX: this.centerX, centerZ: this.centerZ, extentKm: this.extentKm, spacingKm: this.spacingKm });
    this.clearOverlay();
    const s = new Float32Array(e.length / 2 * 3);
    for (let n = 0, c = 0; n < e.length; n += 2)
      s[c++] = e[n], s[c++] = this.surfaceY + 1, s[c++] = e[n + 1];
    const t = new o.BufferGeometry();
    t.setAttribute("position", new o.BufferAttribute(s, 3));
    const r = new o.LineSegments(t, new o.LineBasicMaterial({ color: 10201517, transparent: !0, opacity: 0.55, depthTest: !1 }));
    r.renderOrder = 1e3, this.overlay.add(r);
    const i = this.extentKm * 500, a = this.spacingKm * 1e3, m = Math.min(a * 0.8, i * 0.5), d = Math.ceil((this.centerX - i) / a) * a, f = Math.ceil((this.centerZ - i) / a) * a;
    for (let n = d; n <= this.centerX + i; n += a) {
      const c = u(`x ${(n / 1e3).toFixed(0)} km`, "#e8eeec", m);
      c.position.set(n, this.surfaceY + 2, this.centerZ + i - a * 0.18), this.overlay.add(c);
    }
    for (let n = f; n <= this.centerZ + i; n += a) {
      const c = u(`y ${(n / 1e3).toFixed(0)} km`, "#e8eeec", m);
      c.position.set(this.centerX - i + a * 0.3, this.surfaceY + 2, n), this.overlay.add(c);
    }
    for (const [n, c] of [[this.centerX, this.centerZ], [this.centerX - i * 0.72, this.centerZ - i * 0.72], [this.centerX + i * 0.72, this.centerZ + i * 0.72]]) {
      const { lat: p, lon: l } = this.projectedToLatLon(n, c), x = u(v(p, l), "#f0bd61", Math.max(a * 1.7, i * 0.7));
      x.position.set(n, this.surfaceY + 3, c), this.overlay.add(x);
    }
    this.camera.position.set(this.centerX, this.surfaceY + Math.max(this.extentKm * 1e3, 1e4), this.centerZ), this.camera.lookAt(this.centerX, this.surfaceY, this.centerZ), this.camera.near = 1, this.camera.far = Math.max(this.extentKm * 2e3, 2e4), this.camera.updateProjectionMatrix(), this.resize(this.extentKm * this.aspect, this.extentKm);
  }
}
export {
  b as PolarMapView,
  v as coordinateLabel,
  g as gridLines
};
