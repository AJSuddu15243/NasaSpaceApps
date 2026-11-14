/**
 * Explorer-mode plain-language copy (DOC-1).
 * Reading level target: grade 8. Tone: friendly mission-control — precise,
 * never breathless. UI consumes these strings; keep them honest about
 * synthetic vs real data per docs/QUALITY.md.
 */

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
      'Earth\u2019s axis tilts 23.4\u00B0, which is why we get seasons and a Sun that climbs high at noon. The Moon\u2019s axis tilts just 1.5\u00B0 to its orbit, so at the south pole the Sun never gets more than about 1.5\u00B0 above the horizon.',
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
      'The Moon keeps the same face toward Earth, but its orbit is tilted and a little elliptical. That wobble — called libration — lets us peek a few degrees around the edges.',
      'Over a month we see roughly 59% of the surface rather than exactly 50%. For landing-site work the bigger effect is that the Earth\u2019s position in the sky shifts slightly, which changes contact windows at the margin.',
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
    deck: 'At the pole, a 1 km ridge can be the difference between light and permanent dark.',
    body: [
      'Because the Sun sits at most ~1.5° above the horizon, a hill just a few kilometres away casts a shadow tens of kilometres long. Moving a landing site by 1 km can move it in or out of that shadow entirely.',
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
    { label: 'Noon Sun height (example site)', earth: '~50–70\u00B0 at mid-latitudes', moon: '~0\u20131.5\u00B0 at the pole' },
    { label: 'Atmosphere', earth: 'Scatters light; sky is blue', moon: 'Essentially none; sky is black' },
    { label: 'Horizon blockers', earth: 'Haze and distant terrain', moon: 'Terrain only — every ray is straight' },
    { label: 'Longest night', earth: 'Hours (polar winter aside)', moon: 'Up to ~14 Earth days' },
    { label: 'Radio sky', earth: 'Many satellites and ground stations', moon: 'Earth hangs near the horizon; terrain can block it' },
  ],
} as const;
