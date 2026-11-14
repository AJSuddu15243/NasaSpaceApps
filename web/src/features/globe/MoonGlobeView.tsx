import { useCallback, useEffect, useRef, useState } from 'react';
import { Crosshair, Loader2, MapPin, Orbit, RotateCcw } from 'lucide-react';
import './globe.css';

export interface GlobeMarker {
  lat: number;
  lng: number;
  name: string;
  index: number;
  note?: string;
}

interface GlobeControls {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

interface GlobeInstance {
  width: (px: number) => GlobeInstance;
  height: (px: number) => GlobeInstance;
  globeImageUrl: (url: string) => GlobeInstance;
  bumpImageUrl: (url: string | null) => GlobeInstance;
  backgroundColor: (color: string) => GlobeInstance;
  showAtmosphere: (show: boolean) => GlobeInstance;
  showGraticules: (show: boolean) => GlobeInstance;
  htmlElementsData: (data: GlobeMarker[]) => GlobeInstance;
  htmlElement: (fn: (d: GlobeMarker) => HTMLElement) => GlobeInstance;
  onGlobeClick: (fn: (coords: { lat: number; lng: number }) => void) => GlobeInstance;
  pointOfView: (pov: { lat: number; lng: number; altitude: number }, ms?: number) => GlobeInstance;
  controls: () => GlobeControls;
  _destructor?: () => void;
}

type GlobeConstructor = (el: HTMLElement) => GlobeInstance;

const OVERVIEW = { lat: 8, lng: 20, altitude: 2.35 };
const SOUTH_POLE = { lat: -90, lng: 0, altitude: 1.35 };
const TEXTURE_COLOR = '/textures/moon_color.jpg';
const TEXTURE_BUMP = '/textures/moon_elevation.jpg';

interface Selection {
  name: string;
  lat: number;
  lng: number;
  note?: string;
  custom?: boolean;
}

export function MoonGlobeView({ markers }: { markers: GlobeMarker[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const markersRef = useRef(markers);
  const selectRef = useRef<(selection: Selection | null) => void>(() => {});
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);

  markersRef.current = markers;
  selectRef.current = setSelection;

  const flyTo = useCallback((target: { lat: number; lng: number; altitude: number }) => {
    globeRef.current?.pointOfView(target, 900);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let ro: ResizeObserver | undefined;

    const boot = async () => {
      try {
        const mod = await import('globe.gl');
        const Globe = (mod.default ?? mod) as unknown as GlobeConstructor;
        if (disposed || !hostRef.current) return;
        const globe = Globe(hostRef.current);
        globeRef.current = globe;

        globe
          .width(host.clientWidth)
          .height(host.clientHeight)
          .globeImageUrl(TEXTURE_COLOR)
          .bumpImageUrl(TEXTURE_BUMP)
          .backgroundColor('#04060d')
          .showAtmosphere(false)
          .showGraticules(true)
          .htmlElementsData(markersRef.current)
          .htmlElement(d => {
            const el = document.createElement('div');
            el.className = 'globe-marker';
            el.innerHTML = `<span>${d.index + 1}</span>`;
            el.title = d.name;
            el.addEventListener('click', event => {
              event.stopPropagation();
              selectRef.current({ name: d.name, lat: d.lat, lng: d.lng, note: d.note });
            });
            return el;
          })
          .onGlobeClick(coords => {
            selectRef.current({ name: 'Surface point', lat: coords.lat, lng: coords.lng, custom: true });
          })
          .pointOfView(OVERVIEW);

        ro = new ResizeObserver(entries => {
          const rect = entries[0]?.contentRect;
          if (rect) globe.width(Math.max(1, rect.width)).height(Math.max(1, rect.height));
        });
        ro.observe(host);

        requestAnimationFrame(() => { if (!disposed) setReady(true); });
      } catch (error) {
        if (!disposed) setFailed(error instanceof Error ? error.message : 'WebGL is unavailable.');
      }
    };
    void boot();

    return () => {
      disposed = true;
      ro?.disconnect();
      try { globeRef.current?._destructor?.(); } catch { /* noop */ }
      globeRef.current = null;
    };
  }, []);

  useEffect(() => {
    globeRef.current?.htmlElementsData(markers).pointOfView(OVERVIEW, 0);
  }, [markers]);

  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (controls && 'autoRotate' in controls) {
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = autoRotate ? 0.55 : 0;
    }
  }, [autoRotate, ready]);

  const fmtLat = (value: number) => `${Math.abs(value).toFixed(2)}°${value < 0 ? 'S' : 'N'}`;
  const fmtLng = (value: number) => `${Math.abs(value).toFixed(2)}°${value < 0 ? 'W' : 'E'}`;

  return <div className="moon-globe">
    <div ref={hostRef} className="moon-globe-canvas" role="application" aria-label="Interactive 3D Moon. Drag to rotate, scroll to zoom." />
    {!ready && !failed && <div className="globe-loading" role="status"><Loader2 className="spin" aria-hidden="true" /><span>Loading lunar surface…</span></div>}
    {failed && <div className="globe-error" role="alert"><p>The 3D Moon could not start.</p><p className="hint">{failed}</p></div>}

    <div className="globe-controls" role="toolbar" aria-label="Globe controls">
      <button type="button" onClick={() => flyTo(OVERVIEW)} aria-label="Reset camera"><RotateCcw size={15} aria-hidden="true" /><span>Reset</span></button>
      <button type="button" onClick={() => flyTo(SOUTH_POLE)} aria-label="Fly to lunar south pole"><MapPin size={15} aria-hidden="true" /><span>South pole</span></button>
      <button type="button" onClick={() => setAutoRotate(value => !value)} aria-pressed={autoRotate} aria-label="Toggle auto-rotation"><Orbit size={15} aria-hidden="true" /><span>{autoRotate ? 'Pause spin' : 'Auto-rotate'}</span></button>
    </div>

    <div className="globe-hint"><Crosshair size={12} aria-hidden="true" /> Drag to rotate · scroll to zoom · click the surface</div>

    {selection && <aside className="globe-info" aria-label="Selected location">
      <header><span className="eyebrow">{selection.custom ? 'SURFACE POINT' : 'SELECTED SITE'}</span><button type="button" onClick={() => setSelection(null)} aria-label="Close location details">×</button></header>
      <h3>{selection.name}</h3>
      <dl><div><dt>Latitude</dt><dd>{fmtLat(selection.lat)}</dd></div><div><dt>Longitude</dt><dd>{fmtLng(selection.lng)}</dd></div></dl>
      {selection.note && <p className="globe-note">{selection.note}</p>}
      <p className="globe-coords">MOON_ME frame · click anywhere for coordinates</p>
    </aside>}
  </div>;
}
