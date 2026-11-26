import { useGraphics } from '../../lib/graphics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Crosshair, Loader2, MapPin, Orbit, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../design';
import './globe.css';

export interface GlobeMarker {
  id?: string;
  lat: number;
  lng: number;
  name: string;
  index: number;
  kind?: 'site' | 'sun' | 'earth';
  note?: string;
  distanceKm?: number;
  /** 'region' = surveyed region (radar pulse + label); 'point' = custom coordinate. */
  variant?: 'region' | 'site' | 'point';
  active?: boolean;
}

interface GlobeControls {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

interface GlobeInstance {
  renderer: () => { setPixelRatio: (ratio: number) => void };
  pathsData: (paths: { points: number[][] }[]) => GlobeInstance;
  pathPoints: (key: string) => GlobeInstance;
  pathPointLat: (fn: (point: number[]) => number) => GlobeInstance;
  pathPointLng: (fn: (point: number[]) => number) => GlobeInstance;
  pathColor: (fn: () => string) => GlobeInstance;
  pathStroke: (width: number) => GlobeInstance;
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
  pointOfView: { (): { lat: number; lng: number; altitude: number }; (pov: { lat: number; lng: number; altitude: number }, ms?: number): GlobeInstance };
  controls: () => GlobeControls;
  pauseAnimation: () => GlobeInstance;
  resumeAnimation: () => GlobeInstance;
  _destructor?: () => void;
}

type GlobeConstructor = new (el: HTMLElement) => GlobeInstance;

const OVERVIEW = { lat: -38, lng: 22, altitude: 2.3 };
const SOUTH_POLE = { lat: -90, lng: 0, altitude: 1.35 };
const TEXTURE_COLOR = '/textures/moon_color.jpg';
const TEXTURE_BUMP = '/textures/moon_elevation.jpg';

interface Selection {
  name: string;
  lat: number;
  lng: number;
  note?: string;
  custom?: boolean;
  kind?: 'site' | 'sun' | 'earth';
  distanceKm?: number;
}

export function MoonGlobeView({ markers, timeLabel, focus, focusAltitude = 0.8, overview = OVERVIEW, onInspect, onReady, onError, footprint, active = true, controlsHidden = false }: { markers: GlobeMarker[]; timeLabel?: string; focus?: { lat: number; lon: number }; focusAltitude?: number; overview?: { lat: number; lng: number; altitude: number }; onInspect?: (point: { id?: string; name: string; lat: number; lon: number }) => void; onReady?: () => void; onError?: () => void; footprint?: number[][]; active?: boolean; controlsHidden?: boolean }) {
  const graphics = useGraphics();
  const errorRef = useRef(onError); errorRef.current = onError;
  const readyRef = useRef(onReady);
  const overviewRef = useRef(overview);
  overviewRef.current = overview;
  readyRef.current = onReady;
  const inspectRef = useRef(onInspect);
  inspectRef.current = onInspect;
  const previousPose = useRef<{ lat: number; lng: number; altitude: number } | null>(null);
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
    globeRef.current?.pointOfView(target, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900);
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
        const globe = new Globe(hostRef.current);
        globeRef.current = globe;

        globe
          .width(host.clientWidth)
          .height(host.clientHeight)
          .globeImageUrl(TEXTURE_COLOR)
          .bumpImageUrl(TEXTURE_BUMP)
          .backgroundColor('rgba(0,0,0,0)')
          .showAtmosphere(false)
          .showGraticules(true)
          .htmlElementsData(markersRef.current)
          .htmlElement(d => {
            const el = document.createElement('button');
            el.type = 'button';
            el.setAttribute('aria-label', `Inspect ${d.name}`);
            const kind = d.kind ?? 'site';
            el.className = `globe-marker globe-marker--${kind} globe-marker--${d.variant ?? 'site'}${d.active ? ' is-active' : ''}`;
            el.dataset.tip = `${d.name} · ${d.lat.toFixed(1)}°, ${d.lng.toFixed(1)}°`;
            const label = document.createElement('em'); label.textContent = d.name;
            el.innerHTML = kind === 'site' ? (d.variant === 'region' ? '<i class="globe-pulse"></i><i class="globe-pulse"></i><span></span>' : `<span>${d.index + 1}</span>`) : `<span class="globe-marker-glyph">${kind === 'sun' ? 'S' : 'E'}</span>`;
            if (d.variant === 'region') el.appendChild(label);
            el.title = d.name;
            el.addEventListener('click', event => {
              event.stopPropagation();
              if (kind === 'site' && inspectRef.current) { inspectRef.current({ id: d.id, name: d.name, lat: d.lat, lon: d.lng }); return; }
              selectRef.current({ name: d.name, lat: d.lat, lng: d.lng, note: d.note, kind, distanceKm: d.distanceKm });
              if (kind === 'site') globeRef.current?.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.3 }, 900);
            });
            return el;
          })
          .onGlobeClick(coords => {
            if (inspectRef.current) { inspectRef.current({ name: 'Surface point', lat: coords.lat, lon: coords.lng }); return; }
            selectRef.current({ name: 'Surface point', lat: coords.lat, lng: coords.lng, custom: true });
          })
          .pointOfView(overviewRef.current);

        ro = new ResizeObserver(entries => {
          const rect = entries[0]?.contentRect;
          if (rect) globe.width(Math.max(1, rect.width)).height(Math.max(1, rect.height));
        });
        ro.observe(host);

        requestAnimationFrame(() => { if (!disposed) { setReady(true); readyRef.current?.(); } });
      } catch (error) {
        if (!disposed) { errorRef.current?.(); setFailed(error instanceof Error ? error.message : 'WebGL is unavailable.'); }
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


  useEffect(() => { if (ready) globeRef.current?.renderer().setPixelRatio(graphics.dpr); }, [ready, graphics.dpr]);

  useEffect(() => {
    const update = () => { if (active && !document.hidden) globeRef.current?.resumeAnimation(); else globeRef.current?.pauseAnimation(); };
    const timer = setTimeout(update, active ? 0 : 1000);
    document.addEventListener('visibilitychange', update);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', update); };
  }, [active, ready]);

  useEffect(() => {
    globeRef.current?.htmlElementsData(markers);
  }, [markers]);

  useEffect(() => {
    globeRef.current?.pathsData(footprint ? [{ points: footprint }] : []).pathPoints('points').pathPointLat(p => p[0]).pathPointLng(p => p[1]).pathColor(() => '#f0b979').pathStroke(1.5);
  }, [footprint, ready]);

  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (controls && 'autoRotate' in controls) {
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = autoRotate ? 0.55 : 0;
    }
  }, [autoRotate, ready]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!ready || !globe) return;
    if (focus) {
      previousPose.current ??= globe.pointOfView();
      flyTo({ lat: focus.lat, lng: focus.lon, altitude: focusAltitude });
    } else if (previousPose.current) {
      flyTo(previousPose.current);
      previousPose.current = null;
    }
  }, [focus?.lat, focus?.lon, focusAltitude, ready, flyTo]);

  const fmtLat = (value: number) => `${Math.abs(value).toFixed(2)}°${value < 0 ? 'S' : 'N'}`;
  const fmtLng = (value: number) => `${Math.abs(value).toFixed(2)}°${value < 0 ? 'W' : 'E'}`;
  const fmtDist = (km: number) => km >= 1e6 ? `${(km / 1e6).toFixed(1)}M km` : km >= 1e3 ? `${Math.round(km / 1e3)}k km` : `${km.toFixed(0)} km`;

  return <div className="moon-globe">
    <div ref={hostRef} className="moon-globe-canvas" role="application" aria-label="Interactive 3D Moon. Drag to rotate, scroll to zoom." />
    {!ready && !failed && <div className="globe-loading" role="status"><Loader2 className="spin" aria-hidden="true" /><span>Loading lunar surface…</span></div>}
    {failed && <div className="globe-error" role="alert"><p>The 3D Moon could not start.</p><p className="hint">{failed}</p></div>}

    <TooltipProvider delayDuration={250}>
      {!controlsHidden && <div className="globe-controls" role="toolbar" aria-label="Globe controls">
        <Tooltip><TooltipTrigger asChild><button type="button" onClick={() => flyTo(overview)} aria-label="Reset camera"><RotateCcw size={15} aria-hidden="true" /></button></TooltipTrigger><TooltipContent>Reset camera</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button type="button" onClick={() => flyTo(SOUTH_POLE)} aria-label="Fly to lunar south pole"><MapPin size={15} aria-hidden="true" /></button></TooltipTrigger><TooltipContent>Fly to south pole</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button type="button" onClick={() => setAutoRotate(value => !value)} aria-pressed={autoRotate} aria-label="Toggle auto-rotation"><Orbit size={15} aria-hidden="true" /></button></TooltipTrigger><TooltipContent>{autoRotate ? 'Pause rotation' : 'Auto-rotate'}</TooltipContent></Tooltip>
      </div>}
    </TooltipProvider>

    <div className="globe-hint"><Crosshair size={12} aria-hidden="true" /> Drag to rotate · scroll to zoom · click the surface</div>
    {timeLabel && <div className="globe-time"><span className="eyebrow">EPHEMERIS AT</span><span>{timeLabel}</span></div>}

    {selection && <aside className="globe-info" aria-label="Selected location">
      <header><span className="eyebrow">{selection.kind === 'sun' ? 'SUB-SOLAR POINT' : selection.kind === 'earth' ? 'SUB-EARTH POINT' : selection.custom ? 'SURFACE POINT' : 'SELECTED SITE'}</span><button type="button" onClick={() => setSelection(null)} aria-label="Close location details">×</button></header>
      <h3>{selection.name}</h3>
      <dl><div><dt>Latitude</dt><dd>{fmtLat(selection.lat)}</dd></div><div><dt>Longitude</dt><dd>{fmtLng(selection.lng)}</dd></div>{selection.distanceKm !== undefined && <div><dt>Distance</dt><dd>{fmtDist(selection.distanceKm)}</dd></div>}</dl>
      {selection.note && <p className="globe-note">{selection.note}</p>}
      <p className="globe-coords">MOON_ME frame · click anywhere for coordinates</p>
    </aside>}
  </div>;
}
