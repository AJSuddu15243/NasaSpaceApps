# LND-1 · Lunar Window

**Final product name: Lunar Window.** Descriptor: Lunar Landing Site Navigator.
Tagline: **Compare sites. Find your window.**

“Window” connects the launch-delay scenario to the time intervals when sunlight and
Earth contact are available. The arched observation-window mark frames a terrain horizon with an amber Sun and a
blue Earth. It is an original, hand-authored vector; it contains no NASA insignia,
stock rocket, remote image, embedded font or simulation data.

## Assets and usage

- `brand.json`: shared name, descriptor, tagline, summary and relative asset paths.
- `assets/mark.svg`: transparent colour mark for the dark UI, viewBox 64 × 64.
- `assets/mark-mono.svg`: single-colour mark for print or monochrome contexts. Inline SVG
  inherits `currentColor`; an external `<img>` renders black by default.
- `assets/favicon.svg`: 32 × 32 viewBox with an opaque lunar-grey tile for both browser themes.
- `VOICE.md`: five do/don't rules aligned with `docs/QUALITY.md`.
- `preview/index.html`: offline specimen showing the identity, variants and actual icon sizes.

Use the colour mark at 32 CSS px or larger; use the favicon below that size. Keep at least
8 px of clear space at a 64 px mark size, scaling proportionally. Do not stretch, rotate,
add glows, change the Sun/Earth semantics, or use the mark as a suitability badge.
The wordmark remains live text: IBM Plex Sans 500 or 600 from WEB-2. Numbers use IBM Plex
Mono. A lockup should have 12 px between a 48 px mark and its text. The standalone specimen
uses a system fallback until the shared font files are integrated; logo SVGs are font-free.

The asset colours match WEB-2's lunar white, amber Sun and blue Earth. The only opaque
background is lunar grey. This work introduces no new colour roles or animation.

## Integration (for the shell / landing owner)

Vite resolves imported assets; do not hardcode a public URL to `src/brand`:

```tsx
import brand from '../brand/brand.json';
import markUrl from '../brand/assets/mark.svg';
import faviconUrl from '../brand/assets/favicon.svg';

// Decorative mark when the adjacent text already names the product:
<a href="/" aria-label={`${brand.name} home`}>
  <img src={markUrl} width="48" height="48" alt="" />
  <span>{brand.name}</span>
</a>
// If shown alone, use alt={brand.name}.
// Set the shell's existing <link rel="icon" type="image/svg+xml"> href to faviconUrl.
// Set the document title to `${brand.name} · ${brand.descriptor}`.
```

Keep the preview out of the production bundle. The shell title/favicon and landing header
are owned by other issues and are deliberately not edited here. LND-2 can use these assets
without waiting for WEB-1. The SVGs have accessible titles for standalone viewing; the
embedding page still supplies appropriate image alt text.

## Preview and checks

From the repository root, with Python 3 (standard library only):

```sh
python3 -m unittest discover -s web/src/brand/tests -v
python3 -m http.server 4174 --bind 127.0.0.1 --directory web/src/brand
# Open http://127.0.0.1:4174/preview/
```

No npm install, build step, raw data, mocked scientific results or runtime dependencies.
Checks parse every SVG, prohibit executable/external content, validate the asset paths and
accessible titles, and keep the voice guide at five rules. No algorithms are introduced.

## Scope and handoff

Only `web/src/brand/` is changed. LND-1 does not build landing sections, mode controls or a
simulation. WEB-2 remains on its own local branch, with its PR held for WEB-1 context at the
user's request. Next in the design-and-landing sequence: LND-2, then LND-3 + WEB-12,
LND-4, and LND-5, respecting their dependencies.

`preview/identity.svg` and `preview/identity.png` are a rendered identity sheet for review
(not an app screenshot). The PNG was rendered from that SVG with Sharp and visually
inspected at 16/32/48 px icon sizes. Both specimen formats use a system font fallback;
the production wordmark uses WEB-2’s IBM Plex Sans.
