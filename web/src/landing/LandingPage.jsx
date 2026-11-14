import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FLIGHT_DURATION_MS, flightCameraZ, flightProgress } from './flight.js';
import './style.css';

const team = [
  { initials: '01', role: 'Terrain intelligence', label: 'Data & mapping' },
  { initials: '02', role: 'Route engineering', label: 'Navigation' },
  { initials: '03', role: 'Mission experience', label: 'Design & story' },
];

function MoonScene({ reducedMotion }) {
  const mount = useRef(null);
  const [finished, setFinished] = useState(reducedMotion);

  useEffect(() => {
    const host = mount.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 48, 32),
      new THREE.MeshStandardMaterial({ color: 0xb9c1c5, roughness: 1, metalness: 0, flatShading: true })
    );
    moon.rotation.z = -0.18;
    scene.add(moon);
    scene.add(new THREE.AmbientLight(0x607789, 1.8));
    const sun = new THREE.DirectionalLight(0xe9f3f2, 3.2);
    sun.position.set(-3, 2, 5);
    scene.add(sun);

    const pole = new THREE.Group();
    pole.position.set(0, -1.56, 0);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.19, 0.205, 48),
      new THREE.MeshBasicMaterial({ color: 0x9ee7d1, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    ring.rotation.x = -Math.PI / 2;
    pole.add(ring);
    pole.add(new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), new THREE.MeshBasicMaterial({ color: 0xc5fff0 })));
    scene.add(pole);

    const points = new Float32Array([
      -6, 3, -3, -4, -2, -2, 5, 3, -3, 4, -1, -1, -2, 5, -5,
      3, 5, -4, 6, 0, -4, -5, 0, -2, 1, 4, -5, -3, -4, -4,
      2, -4, -5, 5, -3, -5, -6, -1, -5, 0, 6, -5, -5, 4, -5
    ]);
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xaabdc6, size: 0.035 }));
    scene.add(stars);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let frame;
    let start;
    const render = (now) => {
      if (start === undefined) start = now;
      const progress = reducedMotion ? 1 : flightProgress(now - start, FLIGHT_DURATION_MS);
      camera.position.set(0, -2.2 * progress, flightCameraZ(progress));
      camera.lookAt(0, -1.3 * progress, 0);
      moon.rotation.y = 0.2 * progress;
      ring.scale.setScalar(1 + 0.25 * progress);
      renderer.render(scene, camera);
      if (progress < 1 && !document.hidden) frame = requestAnimationFrame(render);
      else setFinished(true);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeChild(renderer.domElement);
      moon.geometry.dispose();
      moon.material.dispose();
      ring.geometry.dispose();
      ring.material.dispose();
      pole.children[1].geometry.dispose();
      pole.children[1].material.dispose();
      starsGeometry.dispose();
      stars.material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return <div className={`moon-scene ${finished ? 'arrived' : ''}`} ref={mount} aria-hidden="true" />;
}

export default function LandingPage() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return <>
    <a className="skip" href="#what">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="South Pole Navigator home"><span className="brand-mark">✳</span><span>SOUTH POLE<br /><strong>NAVIGATOR</strong></span></a>
      <nav aria-label="Main navigation"><a href="#what">The mission</a><a href="#how">How it works</a><a href="#team">Team</a><a href="#resources">Resources</a></nav>
      <a className="header-cta" href="/app">Launch navigator <span aria-hidden="true">↗</span></a>
    </header>
    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-glow" />
        <MoonScene reducedMotion={reducedMotion} />
        <div className="hero-copy">
          <p className="eyebrow"><span className="signal" /> EXPLORATION SYSTEM / 001</p>
          <h1 id="hero-title">The next step<br />starts <em>here.</em></h1>
          <p className="hero-description">A new way to explore the lunar south pole. See the terrain, understand the risk, and find a path forward.</p>
          <div className="hero-actions"><a className="button primary" href="/app">Launch the navigator <span aria-hidden="true">↗</span></a><a className="text-link" href="#what">Discover the mission <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="hero-meta"><span>84°–90° S<br />LUNAR SOUTH POLE</span><span>SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span></div>
      </section>

      <section className="section intro" id="what"><div className="section-index">01 / WHAT</div><div><p className="kicker">THE MISSION</p><h2>Find a way through<br /><em>the unknown.</em></h2><p className="large-copy">The Moon's south pole holds extraordinary promise. It also holds complex terrain. South Pole Navigator turns elevation and slope data into an explorable view of the ground ahead.</p></div></section>

      <section className="section why" id="why"><div className="section-index">02 / WHY</div><div className="why-grid"><div><p className="kicker">WHY IT MATTERS</p><h2>Every meter<br /><em>matters.</em></h2></div><div className="stat-card"><span className="stat-icon">◌</span><p>Steep slopes, deep shadows, and long distances make every route a decision. Better terrain context helps explorers see the tradeoffs before taking the first step.</p><span className="card-foot">DESIGNED FOR EXPLORATION / BUILT ON DATA</span></div></div></section>

      <section className="section how" id="how"><div className="section-index">03 / HOW</div><div><p className="kicker">FROM DATA TO DIRECTION</p><h2>Navigate with<br /><em>confidence.</em></h2><div className="steps"><article><span>01</span><h3>Explore terrain</h3><p>Move through a focused view of the lunar south pole and inspect the landscape.</p></article><article><span>02</span><h3>Understand slope</h3><p>Read elevation and steepness together to see where the ground gets difficult.</p></article><article><span>03</span><h3>Trace a path</h3><p>Compare routes between a landing area and a destination on the surface.</p></article></div></div></section>

      <section className="section team" id="team"><div className="section-index">04 / TEAM</div><div><p className="kicker">THE PEOPLE BEHIND THE PATH</p><h2>Built for the<br /><em>curious.</em></h2><p className="large-copy">A cross discipline NASA Space Apps effort connecting planetary data, route planning, and accessible exploration.</p><div className="team-grid">{team.map(member => <article key={member.initials}><span>{member.initials}</span><h3>{member.role}</h3><p>{member.label}</p></article>)}</div></div></section>

      <section className="section resources" id="resources"><div className="section-index">05 / RESOURCES</div><div><p className="kicker">GO FURTHER</p><h2>The data behind<br /><em>the journey.</em></h2><p className="large-copy">Explore the source material behind this project and start navigating the surface yourself.</p><div className="resource-links"><a href="https://science.nasa.gov/moon/" target="_blank" rel="noreferrer">NASA Moon science <span aria-hidden="true">↗</span></a><a href="https://trek.nasa.gov/moon/" target="_blank" rel="noreferrer">NASA Moon Trek <span aria-hidden="true">↗</span></a><a href="/app">Launch the navigator <span aria-hidden="true">↗</span></a></div></div></section>
    </main>
    <footer><div className="brand"><span className="brand-mark">✳</span><span>SOUTH POLE<br /><strong>NAVIGATOR</strong></span></div><p>Made for the next giant leap.</p><a href="#top">Back to top ↑</a></footer>
  </>;
}
