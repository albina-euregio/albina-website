// Split from eawsRegions.ts so that importing eawsRegion() does not pull
// maplibre-gl into the main bundle.
import { LngLatBounds } from "maplibre-gl";
import { eawsRegion } from "./eawsRegions";

/**
 * Grow `bounds` by `n` degrees in every direction. Returns a new instance;
 * the input is left untouched. For an empty bounds the result stays empty.
 */
export function padBounds(bounds: LngLatBounds, n: number): LngLatBounds {
  if (bounds.isEmpty()) return bounds;
  return new LngLatBounds([
    bounds.getWest() - n,
    bounds.getSouth() - n,
    bounds.getEast() + n,
    bounds.getNorth() + n
  ]);
}

export function eawsRegionsBounds(
  regionCodes: string[],
  f: (
    regionCode: string
  ) => undefined | { bbox: [number, number, number, number] } = eawsRegion
): LngLatBounds {
  const bounds = new LngLatBounds();
  for (const r of regionCodes) {
    const region = f(r);
    if (region?.bbox) {
      bounds.extend(new LngLatBounds(region.bbox));
    }
  }
  return bounds;
}
