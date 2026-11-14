import './sections.css';

const team = [
  ['DA', 'Data and ephemeris', 'Source, normalize and validate lunar terrain and sky positions.'],
  ['EN', 'Simulation engineering', 'Keep horizon, illumination and contact calculations deterministic.'],
  ['3D', 'Scene and interaction', 'Turn the same inputs into legible spatial context.'],
  ['UX', 'Product and story', 'Make assumptions, trade-offs and missing data visible.'],
] as const;

export function LandingSections({ onOpen }: { onOpen: () => void }) {
  return <>
    <section className="landing-section landing-method" aria-labelledby="method-title">
      <div className="landing-section-heading"><p>02 / HOW IT WORKS</p><h2 id="method-title">One scenario, traced from source to screen.</h2><p>The interface keeps source data, deterministic calculation and visual explanation separate so a result can be inspected instead of merely trusted.</p></div>
      <ol className="method-flow" aria-label="Processing flow">
        <li><span>INPUT</span><strong>Choose sites and a UTC window</strong><small>Selection and time remain in the shareable URL.</small></li>
        <li><span>CONTEXT</span><strong>Place Sun and Earth above the local horizon</strong><small>Ephemeris and terrain masks use explicit units and timestamps.</small></li>
        <li><span>COMPUTE</span><strong>Evaluate the same inputs in Rust/WASM</strong><small>Physics stays out of React and GLSL.</small></li>
        <li><span>COMPARE</span><strong>Read trade-offs side by side</strong><small>Metrics include assumptions, missing layers and validation state.</small></li>
      </ol>
    </section>

    <section className="landing-section landing-features" aria-labelledby="features-title">
      <div className="landing-section-heading"><p>03 / THE PRODUCT</p><h2 id="features-title">Compare the window, not a single instant.</h2><p>These interface previews mirror the current navigator. Values shown are visibly synthetic until the real engine and sourced datasets land.</p></div>
      <div className="feature-previews">
        <figure className="workspace-preview">
          <figcaption><span>SCENARIO WORKSPACE</span><strong>Site and date stay together</strong></figcaption>
          <div className="preview-window">
            <aside><b>Scenario</b><span className="preview-selected">Demo ridge A</span><span>Demo ridge B</span><hr/><small>UTC start</small><code>2026-11-14 12:00</code><small>Window</small><code>336 h</code></aside>
            <div className="preview-map"><span>3D / PANORAMA / MAP</span><div className="preview-globe"/><small>Illustrative scene · synthetic fixture</small></div>
            <aside><b>Compare</b><span className="preview-metric">72<small>% sunlit</small></span><span className="preview-metric earth-preview">61<small>% Earth</small></span></aside>
          </div>
        </figure>
        <figure className="workspace-preview timeline-preview">
          <figcaption><span>SHAREABLE SCENARIO</span><strong>Change time without losing context</strong></figcaption>
          <div className="timeline"><div><span>LANDING</span><code>14 NOV · 12:00 UTC</code></div><div className="timeline-track"><i/><i/><i/><i/><i/></div><div className="timeline-legend"><span>Sun above horizon</span><span>Earth visible</span><span>Blackout</span></div></div>
          <p>Planned timeline view · visual structure only, not computed mission data.</p>
        </figure>
      </div>
    </section>

    <section className="landing-section landing-validation" aria-labelledby="validation-title">
      <div className="landing-section-heading"><p>04 / VALIDATION</p><h2 id="validation-title">Show what is known, tested and still missing.</h2></div>
      <div className="validation-grid">
        <article><span className="status-current">CURRENT</span><h3>Contract-checked inputs</h3><p>Schema, units, binary lengths and finite values are checked before mock data reaches the interface.</p></article>
        <article><span className="status-current">CURRENT</span><h3>Deterministic boundary</h3><p>The web adapter is shaped for the Rust/WASM engine; physics is not recreated in components or shaders.</p></article>
        <article><span className="status-next">NEXT</span><h3>Horizons comparison</h3><p>Real ephemeris output will be compared with JPL Horizons and reported with time and angular error.</p></article>
        <article><span className="status-next">NEXT</span><h3>Real terrain evidence</h3><p>LOLA-derived terrain, horizon masks and source manifests replace every clearly labelled synthetic fixture.</p></article>
      </div>
    </section>

    <section className="landing-section landing-team" aria-labelledby="team-title">
      <div className="landing-section-heading"><p>05 / TEAM</p><h2 id="team-title">Four disciplines, one inspectable scenario.</h2><p>Role initials are used until the team publishes its preferred names and portraits.</p></div>
      <div className="team-grid">{team.map(([initials, role, description]) => <article key={initials}><span>{initials}</span><h3>{role}</h3><p>{description}</p></article>)}</div>
    </section>

    <section className="landing-section landing-resources" aria-labelledby="resources-title">
      <div className="landing-section-heading"><p>06 / PRIMARY RESOURCES</p><h2 id="resources-title">Continue with the source tools.</h2></div>
      <div className="resource-list">
        <a href="https://quickmap.lroc.asu.edu/" target="_blank" rel="noreferrer"><span>LROC QuickMap</span><small>Lunar imagery and topography</small><b aria-hidden="true">↗</b></a>
        <a href="https://trek.nasa.gov/moon/" target="_blank" rel="noreferrer"><span>NASA Moon Trek</span><small>Interactive lunar exploration</small><b aria-hidden="true">↗</b></a>
        <a href="https://ssd.jpl.nasa.gov/horizons/" target="_blank" rel="noreferrer"><span>JPL Horizons</span><small>Sun and Earth ephemerides</small><b aria-hidden="true">↗</b></a>
      </div>
    </section>

    <section className="landing-final" aria-labelledby="final-title"><p>THE SAME CONTEXT, READY TO SHARE</p><h2 id="final-title">Choose a site. Move the date. See what changes.</h2><button type="button" onClick={onOpen}>Compare landing sites <span aria-hidden="true">↗</span></button><small>Synthetic demonstration data is labelled throughout.</small></section>
  </>;
}
