# WEB-2 · Lunar interface foundations

Dark theme; IBM Plex Sans for UI, IBM Plex Mono with tabular figures for measurements.
Amber means Sun/power, blue means Earth/comms, and red/yellow/green are reserved for
labelled status. Fonts ship locally through Fontsource; there is no Google Fonts request.

## Run and verify

Requires Node 22+ and pnpm 11. From `web/`:

```sh
pnpm install --frozen-lockfile
pnpm dev
# Open http://127.0.0.1:4173/design
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

WEB-1 lazy-loads the gallery at `/design` in development, keeping gallery code and
synthetic fixtures out of the production bundle.
The browser suite checks keyboard navigation, reduced motion, mobile overflow, runtime
errors and axe WCAG AA checks; it refreshes the two screenshots in `preview/`.
Automated accessibility checks complement manual review; they do not certify compliance.

## WEB-1 integration

The WEB-1 shell supplies the shared React/Vite toolchain and dependencies. Its Tailwind
config conditionally consumes `tailwind.preset.cjs`, and its entry point conditionally
loads `styles.css` plus the development-only gallery. This PR therefore changes only the
WEB-2-owned `web/src/design/` folder and preserves the workstream file contract.

## Component API

- `Button`: shadcn composition with Radix Slot, CVA variants, utility overrides and forwarded
  refs. `default`, `secondary`, `outline`, `ghost`, `destructive`; default/sm/icon sizes.
  Supply an accessible name to icon buttons. Use `disabled` on real buttons; an `asChild`
  anchor must use link semantics and must not be represented as a disabled button.
- `Input`, `Label`, `Card`, `Badge`, `Separator`, `Skeleton`, `Alert`: native semantic elements.
  Connect labels and help/error text using IDs. Badge colour does not compute suitability.
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`: shadcn-style Radix primitives with
  arrow/Home/End keyboard support and the shared semantic theme.
- `cn`: clsx plus tailwind-merge, allowing callers to override utility classes.

The shadcn-compatible variable contract and `components.json` are local to this package.
No Kokonut dependency: those pieces belong to landing only. Do not add NASA or mission
branding to synthetic gallery fixtures.

## Data and limits

`preview/mock.ts` is an explicitly synthetic presentation fixture. It stays local to the
design gallery rather than borrowing WEB-1's engine fixtures. It does not change a SPEC data contract,
feed an engine, claim validated conditions, or contain raw NASA data. The invalid latitude
field illustrates an error state; it is not a coordinate validator. All numerical specimens
are display strings. No simulation, scoring, thermal or ephemeris algorithm is introduced.

`SPEC.md`, `CLAUDE.md`, `Agent.md`, `docs/PROPOSAL.md`, `docs/QUALITY.md`, and `docs/TASKS.md`
were read from `plan/finalize-spec` at `3bf432210552faa7c1b69fb5243e654a56fe9095` (PR #1).
Only the old `Agent.md` exists on the current main branch. Recheck integration if the
pending spec or WEB-1 changes the dependency stack. This package uses Tailwind v3.

## Verification note (2026-11-14)

The design system is integrated on WEB-1 PR #71. Unit tests include token completeness,
component composition, control sizing, and WCAG contrast calculations. The browser suite
adds axe, keyboard, reduced-motion, mobile-overflow, runtime-error, and screenshot checks.
