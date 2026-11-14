import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import LandingPage from './landing/LandingPage';
import { CompareCards } from './features/compare/CompareCards';
import { mockSites } from './features/compare/mock';

function Navigator() {
  const [timelineIso, setTimelineIso] = useState('2026-11-14T12:00:00Z');
  return <main style={{ minHeight: '100vh', background: '#111820', color: '#e8eeec', fontFamily: 'Arial,sans-serif' }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem clamp(1rem,3vw,2.5rem)', borderBottom: '1px solid #52616b' }}>
      <a href="/" style={{ color: '#e8eeec', textDecoration: 'none', fontWeight: 700 }}>South Pole Navigator</a>
      <a href="/" style={{ color: '#8bc4e8' }}>Landing page</a>
    </header>
    <div style={{ padding: '1.5rem clamp(1rem,3vw,2.5rem) 0' }}>
      <p style={{ margin: '0 0 1rem', color: '#f0bd61' }}>Demo metrics · Not mission data</p>
      <label htmlFor="timeline" style={{ display: 'block', marginBottom: '.5rem' }}>Timeline time (UTC)</label>
      <input id="timeline" type="datetime-local" value={timelineIso.slice(0, 16)} onChange={event => setTimelineIso(`${event.target.value}:00Z`)} style={{ padding: '.65rem', color: '#e8eeec', background: '#202b33', border: '1px solid #80919b', colorScheme: 'dark' }} />
    </div>
    <CompareCards sites={mockSites} timelineIso={timelineIso} thresholds={{ minLitPercent: 75, minEarthContactPercent: 80, maxDarknessHours: 20, maxBlackoutHours: 8 }} />
  </main>;
}

const page = window.location.pathname === '/app' || window.location.pathname.startsWith('/app/') ? <Navigator /> : <LandingPage />;
createRoot(document.getElementById('root')).render(page);
