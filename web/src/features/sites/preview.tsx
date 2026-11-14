import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SitePicker } from './SitePicker.tsx';
import { emitSiteMapClick, type CuratedSite, type SelectedSite } from './sites.ts';

// shortcut: illustrative curated sites only, replace with DATA-1 sites.json when it lands.
const curatedSites: CuratedSite[] = [
  { id: 'haworth', name: 'Haworth', lat: -87.5, lon: -5.0, category: 'artemis3', note: 'South polar candidate', source_url: 'https://science.nasa.gov/moon/' },
  { id: 'nobile-rim-1', name: 'Nobile Rim 1', lat: -85.1, lon: 35.2, category: 'artemis3', note: 'South polar candidate', source_url: 'https://science.nasa.gov/moon/' },
  { id: 'connecting-ridge', name: 'Connecting Ridge', lat: -89.5, lon: 90, category: 'clps', note: 'Ridge near Shackleton', source_url: 'https://science.nasa.gov/moon/' },
  { id: 'chandrayaan-3', name: 'Chandrayaan-3', lat: -69.37, lon: 32.32, category: 'intl', note: 'Reference landing', source_url: 'https://science.nasa.gov/moon/' },
  { id: 'apollo-11', name: 'Apollo 11', lat: 0.674, lon: 23.473, category: 'apollo', note: 'Equatorial reference', source_url: 'https://science.nasa.gov/moon/' },
];

function Preview() {
  const [selected, setSelected] = useState<SelectedSite[]>([]);
  return <main><p style={{ color: '#f0bd61', fontFamily: 'Arial,sans-serif', margin: '0', padding: '1.5rem 2.5rem 0' }}>Illustrative site list for UI preview · Not mission data</p><SitePicker curatedSites={curatedSites} selectedSites={selected} onSelectionChange={setSelected} /><button type="button" style={{ margin: '0 2.5rem', padding: '.6rem' }} onClick={() => emitSiteMapClick(window, { lat: -85.4, lon: 42.7 })}>Simulate map click</button></main>;
}

createRoot(document.getElementById('root')!).render(<Preview />);
