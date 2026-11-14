# Official challenge statement (NASA Space Apps Challenge 2026)

Difficulty: Advanced, Intermediate · Subjects: Human Exploration, Moon, Software, Space Exploration

Missions to the Moon's south pole face extreme lighting and communication constraints, and planning them takes
careful coordination between science and engineering teams. Tools for determining Sun and Earth positions at
candidate landing sites exist, but their complicated interfaces make it difficult to evaluate critical information
with efficiency. Your challenge is to create an intuitive tool or application that lets mission planners,
educators, and the public compare landing sites and dates quickly, visualizing Sun and Earth positions relative to
the horizon to assess power generation potential and direct-to-Earth communication windows.

## Objectives (summary)
- **Interactive site selection and comparison:** curated notable sites (Apollo, CLPS targets, commercial and
  international missions) plus custom coordinates; side-by-side or sequential comparison.
- **Date and time flexibility:** pick landing dates and times; explore changes across lunar days and seasons.
- **Sun and Earth position visualization:** positions relative to the horizon on a chosen date; time remaining
  before sunset or Earthset.
- **Power and communication assessment:** solar elevation angle, duration of sunlight, Earth visibility windows.
- **Multiple visualization approaches:** 2D maps, 3D surfaces, or other creative representations.
- **Temporal dynamics:** animations or timelines over a lunar day or across days.
- **Accessibility across skill levels:** mission planners, educators, and the public.

## Potential considerations (summary)
- Ephemeris from JPL Horizons or precomputed datasets; LOLA topography for accurate horizons.
- No atmosphere: the horizon is set by local terrain and the lunar sphere (no refraction).
- Solar elevation angle is the key power metric; display it prominently.
- Prioritize rapid scenario comparison; communicate time to sunset/Earthset clearly.
- Account for actual topography, Earth's libration, and the Moon's orbital variations.
- Represent steep south-pole slopes and deep craters that create extreme shadows.
- Support schedule changes (launch delays, hardware issues) and education.

## Resources listed by the challenge
- [LROC QuickMap](https://quickmap.lroc.asu.edu/): lunar imagery and topography viewer.
- [Moon Trek](https://trek.nasa.gov/moon/): NASA 3D lunar visualization.
- [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/): ephemerides, including Sun/Earth from a lunar site.
- [CSA Moon Exploration](https://www.asc-csa.gc.ca/eng/astronomy/moon-exploration/): Canada's lunar programs.

NASA does not endorse any non-U.S. Government entity. Follow each website's data-use terms.
