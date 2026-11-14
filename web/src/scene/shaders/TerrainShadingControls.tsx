import type { ReactElement } from "react";

export interface TerrainShadingControlsProps {
  readonly contoursEnabled: boolean;
  readonly onContoursEnabledChange: (enabled: boolean) => void;
}

/** Controlled view-menu option for contour lines; elevation and hillshade stay enabled. */
export function TerrainShadingControls({
  contoursEnabled,
  onContoursEnabledChange,
}: TerrainShadingControlsProps): ReactElement {
  return (
    <label>
      <input
        type="checkbox"
        checked={contoursEnabled}
        onChange={(event) => onContoursEnabledChange(event.currentTarget.checked)}
      />
      Contour lines
    </label>
  );
}
