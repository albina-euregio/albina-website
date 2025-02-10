import type { Temporal } from "temporal-polyfill";
import _p1 from "@eaws/micro-regions_properties/AT-07_micro-regions.json";
import _p2 from "@eaws/micro-regions_properties/IT-32-BZ_micro-regions.json";
import _p3 from "@eaws/micro-regions_properties/IT-32-TN_micro-regions.json";
import _pe1 from "@eaws/micro-regions_elevation_properties/AT-07_micro-regions_elevation.json";
import _pe2 from "@eaws/micro-regions_elevation_properties/IT-32-BZ_micro-regions_elevation.json";
import _pe3 from "@eaws/micro-regions_elevation_properties/IT-32-TN_micro-regions_elevation.json";
import eawsRegions from "@eaws/outline_properties/index.json";
import type { Language } from "../appStore";
import { regionsRegex } from "../util/regions";

export enum EawsRegionDataLayer {
  micro_regions_elevation = "micro-regions_elevation",
  micro_regions = "micro-regions",
  outline = "outline"
}
export interface MicroRegionProperties {
  id: string;
  start_date?: string;
  end_date?: string;
}

export const microRegions: MicroRegionProperties[] = [..._p1, ..._p2, ..._p3];

export interface MicroRegionElevationProperties {
  id: string;
  elevation: "high" | "low" | "low_high";
  "elevation line_visualization"?: number;
  threshold?: number;
  start_date?: string;
  end_date?: string;
}

export const microRegionsElevation: MicroRegionElevationProperties[] = [
  ..._pe1,
  ..._pe2,
  ..._pe3
];

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
    .filter(id => !regionsRegex.test(id));
}

export function microRegionIds(today: Temporal.PlainDate): string[] {
  return microRegions
    .filter(properties => filterFeature({ properties }, today))
    .map(f => String(f.id))
    .sort();
}
