import type { Temporal } from "temporal-polyfill";
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

export function microRegionIds(
  today: Temporal.PlainDate,
  regionCodes = config.regionCodes
): string[] {
  return z
    .array(MicroRegionPropertiesSchema)
    .parse(
      regionCodes.flatMap(
        id =>
          regions_properties[
            `../../node_modules/@eaws/micro-regions_properties/${id}_micro-regions.json`
          ]
      )
    )
    .filter(properties => filterFeature({ properties }, today))
    .map(f => String(f.id))
    .sort();
}
