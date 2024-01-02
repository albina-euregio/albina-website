import _p1 from "@eaws/micro-regions_properties/AT-07_micro-regions.json";
import _p2 from "@eaws/micro-regions_properties/IT-32-BZ_micro-regions.json";
import _p3 from "@eaws/micro-regions_properties/IT-32-TN_micro-regions.json";
import _pe1 from "@eaws/micro-regions_elevation_properties/AT-07_micro-regions_elevation.json";
import _pe2 from "@eaws/micro-regions_elevation_properties/IT-32-BZ_micro-regions_elevation.json";
import _pe3 from "@eaws/micro-regions_elevation_properties/IT-32-TN_micro-regions_elevation.json";
import eawsRegions from "@eaws/outline_properties/index.json";
import type { Language } from "../appStore";
import { regionsRegex } from "../util/regions";

export interface MicroRegionProperties {
  id: string;
  start_date?: Date;
  end_date?: Date;
}

export const microRegions: MicroRegionProperties[] = [..._p1, ..._p2, ..._p3];

export interface MicroRegionElevationProperties {
  id: string;
  elevation: "high" | "low" | "low_high";
  "elevation line_visualization"?: number;
  threshold?: number;
  start_date?: Date;
  end_date?: Date;
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
  feature: GeoJSON.Feature,
  today = new Date().toISOString().slice(0, "2006-01-02".length)
): boolean {
  const properties = feature.properties;
  return (
    (!properties.start_date || properties.start_date <= today) &&
    (!properties.end_date || properties.end_date > today)
  );
}

export function eawsRegionIds(
  today = new Date().toISOString().slice(0, "2006-01-02".length)
): string[] {
  return eawsRegions
    .filter(properties => filterFeature({ properties }, today))
    .map(properties => properties.id)
    .filter(id => !regionsRegex.test(id));
}

export function microRegionIds(
  today = new Date().toISOString().slice(0, "2006-01-02".length)
): string[] {
  return microRegions
    .filter(properties => filterFeature({ properties }, today))
    .map(f => String(f.id))
    .sort();
}
