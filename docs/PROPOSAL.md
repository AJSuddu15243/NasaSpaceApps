# Lunar Landing Site Navigator: Technical Plan & Challenge Proposal

> Team proposal (Nov 14, 2026). [`SPEC.md`](../SPEC.md) turns this into build tasks.

## 1. Background & Problem Statement
As NASA's Commercial Lunar Payload Services (CLPS) initiative and the Artemis program scale up exploration,
targeting candidate landing sites, particularly at the lunar south pole, presents unique navigational and
environmental challenges. Extreme topography, low Sun elevation angles, dynamic lighting, and intermittent
direct-to-Earth (DTE) communication line-of-sight require precise, multi-factor planning.

While existing tools like NASA Moon Trek, LROC QuickMap, and the JPL Horizons On-Line Ephemeris System provide
comprehensive data, their steep learning curves and heavy data footprints hinder rapid scenario exploration.
Non-expert stakeholders, mission planners evaluating launch-window delays, and the public lack an intuitive,
accessible web tool to rapidly simulate, visualize, and compare landing site feasibility across changing
temporal conditions.

## 2. Challenge Objectives
- **Interactive Landing Site Selection & Simulation:** pinpoint potential landing locations across the lunar
  surface (focusing on south pole regions) and immediately assess power generation, thermal exposure, and
  communication windows.
- **Dynamic Time Control & Launch Window Scrubbing:** full date/time flexibility to scrub through lunar days,
  seasons, and multi-year epochs to assess environmental stability and accommodate launch delays in real time.
- **Ephemeris & Horizon Positioning:** precise relative positions of the Sun and Earth to derive real-time solar
  illumination angles, shadowing effects, and DTE line-of-sight availability.
- **Multi-Site Comparison & Optimization:** a high-performance optimization engine to evaluate and compare
  multiple candidate sites simultaneously, surfacing trade-offs via clear visual heatmaps.
- **Accessibility across Skill Levels:** an engaging 3D landing page and intuitive UI using three.js, serving both
  professional mission planners and the public without sacrificing simulation accuracy.

## 3. Project Architecture & Features
- **Deterministic WASM Simulation Engine:** algorithms executed via WebAssembly run local thermal, solar
  illumination, and DTE radio visibility checks in the browser without server latency.
- **Weighted Greedy Site Evaluator:** scores candidate zones with customizable preference weights (continuous
  solar availability, direct Earth communication, low surface slopes, crater depth, rock distribution).
- **Multi-Site Heatmap Overlays:** GPU-rendered heatmaps of site suitability; probe target areas and compare
  multiple prospective landing sites side by side.
- **Interactive Timeline Scrubber:** instant scrubbing across dates, times, lunar days, and seasons to see how
  shifts change landing windows, lighting transitions, and communication blackouts.

## 4. Technical Approach & Implementation Plan
**Core stack**
- **Simulation core:** Rust compiled to WebAssembly for deterministic, fast computation of solar trajectories,
  thermal energy models, and DTE line-of-sight metrics.
- **Execution optimization:** Rust precompiled to `.wasm` binaries: zero client-side compile wait, small bundle.
- **3D graphics:** Three.js (or React Three Fiber) for the lunar globe, local landing meshes, and skybox lighting.
- **GPU shaders:** custom GLSL vertex and fragment shaders for surface elevation, shadow rendering, lighting
  gradients, and suitability heatmaps.
- **UI:** React + Tailwind CSS with shadcn/ui and Kokonut UI components, styled minimally to leave GPU headroom.

**Data sources**
- **Terrain:** LOLA DEM datasets via NASA Moon Trek and LROC QuickMap.
- **Sun & Earth ephemeris:** NASA Horizons queries backed by Astronomy Engine (JS) for real-time ephemeris
  without network bottlenecks.

Reference: [Repository stack review](../.agent/STACK_REVIEW.md)
