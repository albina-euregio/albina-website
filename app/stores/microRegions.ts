import { LatLngBounds } from "./eawsRegions";

const regions_properties = import.meta.glob(
  "../../node_modules/@eaws/micro-regions_properties/*_micro-regions.json",
  { import: "default", eager: true }
);
const regions_elevation_properties = import.meta.glob(
  "../../node_modules/@eaws/micro-regions_elevation_properties/*_micro-regions_elevation.json",
  { import: "default", eager: true }
);
import { z } from "zod/mini";

export enum EawsRegionDataLayer {
  micro_regions_elevation = "micro-regions_elevation",
  micro_regions = "micro-regions",
  outline = "outline"
}

export const MicroRegionPropertiesSchema = z.object({
  id: z.string(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  start_date: z.nullish(z.string()),
  end_date: z.nullish(z.string())
});
export type MicroRegionProperties = z.infer<typeof MicroRegionPropertiesSchema>;

const MicroRegionElevationPropertiesSchema = z.extend(
  MicroRegionPropertiesSchema,
  {
    elevation: z.enum(["high", "low", "low_high"]),
    threshold: z.nullish(z.number())
  }
);
export type MicroRegionElevationProperties = z.infer<
  typeof MicroRegionElevationPropertiesSchema
>;
export const microRegionsElevation: MicroRegionElevationProperties[] = z
  .array(MicroRegionElevationPropertiesSchema)
  .parse(
    config.regionCodes.flatMap(
      id =>
        regions_elevation_properties[
          `../../node_modules/@eaws/micro-regions_elevation_properties/${id}_micro-regions_elevation.json`
        ]
    )
  );

/**
 * Determines whether the GeoJSON feature's start_date/end_date is valid today
 * @param {GeoJSON.Feature} feature the GeoJSON feature
 * @param {string} today the reference date
 * @returns {boolean}
 */
export function filterFeature(
  { properties }: { properties: MicroRegionProperties },
  today: Temporal.PlainDate
): boolean {
  if (!today) return false;
  return (
    (!properties.start_date || properties.start_date <= today.toString()) &&
    (!properties.end_date || properties.end_date > today.toString())
  );
}

export function filterFeatureSpecification(
  today: ReturnType<Temporal.PlainDate["toString"]>
): maplibregl.FilterSpecification {
  if (!today) return ["literal", false];
  return [
    "all",
    [
      "case",
      ["==", ["coalesce", ["get", "start_date"], ""], ""],
      true,
      ["<=", ["get", "start_date"], today]
    ],
    [
      "case",
      ["==", ["coalesce", ["get", "end_date"], ""], ""],
      true,
      [">", ["get", "end_date"], today]
    ]
  ];
}

export function microRegions(
  today: Temporal.PlainDate,
  regionCodes = config.regionCodes
) {
  return z
    .array(MicroRegionPropertiesSchema)
    .parse(
      regionCodes.flatMap(
        id =>
          regions_properties[
            `../../node_modules/@eaws/micro-regions_properties/${id}_micro-regions.json`
          ] ??
          regions_properties[
            `../../node_modules/@eaws/micro-regions_properties/${id.replace(/(-[^-]+){1}$/, "")}_micro-regions.json`
          ] ??
          regions_properties[
            `../../node_modules/@eaws/micro-regions_properties/${id.replace(/(-[^-]+){2}$/, "")}_micro-regions.json`
          ] ??
          regions_properties[
            `../../node_modules/@eaws/micro-regions_properties/${id.replace(/(-[^-]+){3}$/, "")}_micro-regions.json`
          ]
      )
    )
    .filter(Boolean)
    .filter(properties => filterFeature({ properties }, today));
}

export function microRegionIds(
  today: Temporal.PlainDate,
  regionCodes = config.regionCodes
): string[] {
  return microRegions(today, regionCodes)
    .map(f => String(f.id))
    .sort();
}

/**
 * Given a micro-region or outline-region ID, returns the macro-region code
 * (from config.regionCodes or config.extraRegions) that it belongs to.
 */
export function getMacroRegion(regionId: string): string | undefined {
  if (!regionId) return undefined;
  return [...config.regionCodes, ...config.extraRegions].find(
    code => regionId === code || regionId.startsWith(code + "-")
  );
}

export function microRegionBounds(
  today: Temporal.PlainDate,
  microRegionId: string,
  regionCodes = config.regionCodes
): LatLngBounds {
  const region = microRegions(today, regionCodes)?.find(
    r => r.id === microRegionId
  );
  if (region?.bbox) {
    return new LatLngBounds(...region.bbox);
  }
  return new LatLngBounds(NaN, NaN, NaN, NaN);
}
