import type { Temporal } from "temporal-polyfill";
const regions_properties = import.meta.glob(
  "../../node_modules/@eaws/micro-regions_properties/*_micro-regions.json",
  { import: "default" }
);
const regions_elevation_properties = import.meta.glob(
  "../../node_modules/@eaws/micro-regions_elevation_properties/*_micro-regions_elevation.json",
  { import: "default" }
);
import eawsRegions from "@eaws/outline_properties/index.json";
import type { Language } from "../appStore";
import { z } from "zod/v4-mini";

export enum EawsRegionDataLayer {
  micro_regions_elevation = "micro-regions_elevation",
  micro_regions = "micro-regions",
  outline = "outline"
}

export const MicroRegionPropertiesSchema = z.object({
  id: z.string(),
  start_date: z.optional(z.nullable(z.string())),
  end_date: z.optional(z.nullable(z.string()))
});
export type MicroRegionProperties = z.infer<typeof MicroRegionPropertiesSchema>;
const microRegions0 = await Promise.all(
  config.regionCodes.map(id =>
    regions_properties[
      `../../node_modules/@eaws/micro-regions_properties/${id}_micro-regions.json`
    ]()
  )
);
export const microRegions: MicroRegionProperties[] = z
  .array(MicroRegionPropertiesSchema)
  .parse(microRegions0.flat());

export const MicroRegionElevationPropertiesSchema = z.extend(
  MicroRegionPropertiesSchema,
  {
    elevation: z.enum(["high", "low", "low_high"]),
    threshold: z.number()
  }
);
export type MicroRegionElevationProperties = z.infer<
  typeof MicroRegionElevationPropertiesSchema
>;
const microRegionsElevation0 = await Promise.all(
  config.regionCodes.map(id =>
    regions_elevation_properties[
      `../../node_modules/@eaws/micro-regions_elevation_properties/${id}_micro-regions_elevation.json`
    ]()
  )
);
export const microRegionsElevation: MicroRegionElevationProperties[] = z
  .array(MicroRegionElevationPropertiesSchema)
  .parse(microRegionsElevation0.flat());

export interface RegionOutlineProperties {
  id: string;
  aws: {
    name: string;
    url: Record<Language, string>;
  }[];
}

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

export function eawsRegionIds(today: Temporal.PlainDate): string[] {
  return eawsRegions
    .filter(properties => filterFeature({ properties }, today))
    .map(properties => properties.id)
    .filter(id => !new RegExp(config.regionsRegex).test(id));
}

export function microRegionIds(today: Temporal.PlainDate): string[] {
  return microRegions
    .filter(properties => filterFeature({ properties }, today))
    .map(f => String(f.id))
    .sort();
}
