import type { AddLayerObject } from "maplibre-gl";

/**
 * A circle layer whose markers are colored by a per-feature `color` property and
 * stacked by a per-feature `severity` sort key (higher severity drawn on top).
 * Shared by the incident and snow-profile dashboard maps.
 */
export function coloredCircleLayer(id: string, source: string): AddLayerObject {
  return {
    id,
    type: "circle",
    source,
    layout: {
      "circle-sort-key": ["get", "severity"]
    },
    paint: {
      "circle-radius": 8,
      "circle-color": ["get", "color"],
      "circle-stroke-color": "#000",
      "circle-stroke-width": 1
    }
  };
}
