# Removed code

Cleanup applied to `main` on 2026-11-14.

| Removed | Reason | Replacement |
| --- | --- | --- |
| `web/src/scene/shaders/TerrainShadingControls.tsx` and its exports from `web/src/scene/shaders/index.ts` | This 23-line component had one caller and only wrapped a checkbox. Keeping a separate component and barrel exports added indirection without shared behavior. | The same labeled checkbox now lives beside its state in `web/src/shell/components/ViewPanel.tsx`; it still controls `LunarScene` through `contoursEnabled`. |

The unused `web/public/textures/moon_1024.jpg` was already absent from `main`, so this commit does not change textures. Restore the component from Git history if needed.
