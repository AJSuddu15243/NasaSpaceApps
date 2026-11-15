/**
 * Explorer-mode plain-language copy (DOC-1).
 * Reading level target: grade 8. Tone: friendly mission-control — precise,
 * never breathless. UI consumes these strings; keep them honest about
 * synthetic vs real data per docs/QUALITY.md. Quoted numbers come from FACTS (engine-computed, pinned by facts.test.ts).
 */
import { DARK_RANGE, FACTS, SUN_PEAK_RANGE } from './facts';

export interface Explainer {
  id: string;
  title: string;
  /** One-line deck shown on cards and in collapsed tooltips. */
  deck: string;
  /** Short paragraphs, each roughly 2–3 sentences. */
  body: string[];
}

export const explainers: Explainer[] = [
  {
    id: 'why-sun-skims-horizon',
    title: 'Why the Sun barely rises at the pole',
    deck: 'The Moon\u2019s axis is tilted only 1.5\u00B0 — the Sun stays near the horizon for weeks.',
    body: [
      `Earth\u2019s axis tilts 23.4\u00B0, which is why we get seasons and a Sun that climbs high at noon. The Moon\u2019s axis tilts only about 1.5\u00B0 toward the Sun, so the point where the Sun is overhead never strays more than ${FACTS.subSolarLatDeg}\u00B0 from the lunar equator. At our three south-pole sites the Sun never climbs higher than ${SUN_PEAK_RANGE} over ${FACTS.years}.`,
      'That sounds tiny, but it changes everything: sunlight arrives at a grazing angle, every crater rim casts a long shadow, and small changes in terrain decide whether a spot is lit or dark.',
    ],
  },
  {
    id: 'no-atmosphere',
    title: 'No air means the horizon is the whole sky',
    deck: 'Without an atmosphere there is no haze, no diffusion — terrain alone decides what you can see.',
    body: [
      'On Earth, the sky glows because air scatters sunlight, and distant hills fade into haze. The Moon has essentially no atmosphere, so the sky is black and every ray of light travels in a straight line until it hits something.',
      'That makes terrain the only thing that blocks the Sun or Earth. A ridge 10 km away can put a site in permanent shadow — which is exactly what our horizon masks measure.',
    ],
  },
  {
    id: 'libration',
    title: 'Why we can see more than half the Moon',
    deck: 'A slight wobble in the Moon\u2019s orbit reveals about 59% of the surface over time.',
    body: [
      `The Moon keeps the same face toward Earth, but its orbit is tilted and a little elliptical. That wobble — called libration — lets us peek up to ${FACTS.earthLatDeg}\u00B0 over the poles and ${FACTS.earthLonDeg}\u00B0 around the sides (${FACTS.years}).`,
      'Over a month we see roughly 59% of the surface rather than exactly 50%. For landing-site work the bigger effect is that Earth\u2019s position in the sky shifts by those same few degrees, enough to lift it over a ridge or drop it behind one.',
    ],
  },
  {
    id: 'psrs',
    title: 'Permanently shadowed regions',
    deck: 'Some crater floors have not seen sunlight in billions of years.',
    body: [
      'Deep craters near the poles have rims tall enough to block the low Sun forever. The floors inside — called permanently shadowed regions, or PSRs — stay around 40 K and may hold water ice.',
      'They are scientifically exciting and operationally tricky: a lander parked in a PSR gets no solar power at all, while one on the sunlit rim may lose Earth contact. Our metrics treat darkness and contact as separate scores for that reason.',
    ],
  },
  {
    id: 'why-one-km-matters',
    title: 'Why one kilometre changes everything',
    deck: 'At the pole, moving about 1 km can be the difference between steady light and none at all.',
    body: [
      `Because the Sun sits only a few degrees above the horizon, a hill a few kilometres away casts a shadow tens of kilometres long. On the Connecting ridge survey, two spots ${FACTS.nearbyContrast.metres} m apart differ by ${FACTS.nearbyContrast.sunPoints} points of sunlight over the default two weeks: one is lit the whole time, the other never.`,
    ],
  },
  {
    id: 'earth-vs-moon-comparison',
    title: 'Earth vs. the lunar south pole',
    deck: 'Same physics, wildly different outcomes — compare noon Sun height and sky coverage.',
    body: [
      'At mid-latitudes on Earth the Sun climbs high and the sky is full of light. At the lunar south pole the Sun skims the horizon, there is no atmosphere to scatter light, and Earth itself hangs low enough that terrain can block it for hours.',
      'A site that looks harmless on a map can be dark for two weeks straight — or bathed in light and out of radio contact at the same time. That is why we compare sites across dates instead of picking one "best" spot.',
    ],
  },
];

/** Card data for the Earth vs Moon comparison (rendered by UI). */
export const earthMoonComparison = {
  id: 'earth-vs-moon',
  title: 'Earth vs. Moon, side by side',
  rows: [
    { label: 'Noon Sun height (example site)', earth: '~50–70\u00B0 at mid-latitudes', moon: `${SUN_PEAK_RANGE} at most at our three sites` },
    { label: 'Atmosphere', earth: 'Scatters light; sky is blue', moon: 'Essentially none; sky is black' },
    { label: 'Horizon blockers', earth: 'Haze and distant terrain', moon: 'Terrain only — every ray is straight' },
    { label: 'Longest night', earth: 'Hours (polar winter aside)', moon: `${DARK_RANGE} at our three sites (${FACTS.years})` },
    { label: 'Radio sky', earth: 'Many satellites and ground stations', moon: 'Earth hangs near the horizon; terrain can block it' },
  ],
} as const;
