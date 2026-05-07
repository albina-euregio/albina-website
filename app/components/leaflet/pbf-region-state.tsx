import React, { useEffect, useMemo } from "react";
import {
  AvalancheProblemType,
  BulletinCollection,
  matchesValidTimePeriod,
  toAmPm,
  ValidTimePeriod
} from "../../stores/bulletin";
import { useLeafletContext } from "@react-leaflet/core";
import { eawsRegionIds } from "../../stores/eawsRegions";
import { getMacroRegion, microRegionIds } from "../../stores/microRegions";

export type RegionState =
  | "mouseOver"
  | "selected"
  | "highlighted"
  | "dehighlighted"
  | "dimmed"
  | "noData"
  | "noDataMouseOver"
  | "default";

export const regionStates: RegionState[] = [
  "mouseOver",
  "selected",
  "highlighted",
  "dehighlighted",
  "dimmed",
  "noData",
  "noDataMouseOver",
  "default"
];

export interface PbfRegionStateProps {
  activeBulletinCollection: BulletinCollection;
  problems: Record<AvalancheProblemType, { highlighted: boolean }>;
  region: string;
  regionMouseover: string;
  validTimePeriod: ValidTimePeriod | undefined;
}

export function PbfRegionState({
  activeBulletinCollection,
  problems,
  region,
  regionMouseover,
  validTimePeriod
}: PbfRegionStateProps) {
  const microRegions = useMemo(
    () =>
      microRegionIds(activeBulletinCollection?.date, [
        ...config.regionCodes,
        ...config.extraRegions
      ]),
    [activeBulletinCollection?.date]
  );
  const eawsRegions = useMemo(
    () => eawsRegionIds().filter(r => !config.extraRegions.includes(r)),
    []
  );
  const eawsMicroRegions = useMemo(
    () =>
      Object.keys(activeBulletinCollection?.eawsMaxDangerRatings || {}).filter(
        region => !region.includes(":")
      ),
    [activeBulletinCollection?.eawsMaxDangerRatings]
  );

  const { vectorGrid } = useLeafletContext();
  useEffect(() => {
    [...microRegions, ...eawsRegions].forEach(region =>
      vectorGrid.setFeatureStyle(region, {
        ...config.map.regionStyling.clickable,
        ...config.map.regionStyling.all,
        ...config.map.regionStyling[getRegionState(region)]
      })
    );

    function getRegionState(regionId: string): RegionState {
      const macroRegion = getMacroRegion(regionId);
      const isNoData =
        !!macroRegion &&
        activeBulletinCollection?.macroRegionStatuses?.[macroRegion] === "n/a";

      // For n/a regions: highlight the whole macro-region on hover (no stroke)
      const hoveredMacroRegion = getMacroRegion(regionMouseover);
      const selectedMacroRegion = getMacroRegion(region);
      const isSameHoveredMacro =
        isNoData &&
        hoveredMacroRegion !== undefined &&
        hoveredMacroRegion === macroRegion;
      const isSameSelectedMacro =
        isNoData &&
        selectedMacroRegion !== undefined &&
        selectedMacroRegion === macroRegion;
      if (isSameHoveredMacro || isSameSelectedMacro) {
        return "noDataMouseOver";
      }

      if (regionId === regionMouseover) {
        return "mouseOver";
      }

      // For n/a regions: keep blue (increased opacity) when selected
      if (regionId === region) {
        return isNoData ? "noDataMouseOver" : "selected";
      }
      if (
        activeBulletinCollection
          ?.getBulletinForBulletinOrRegion(region)
          ?.regions?.some(r => r.regionID === regionId)
      ) {
        return "highlighted";
      }
      if (region) {
        // some other region is selected — keep n/a regions blue, dim the rest
        return isNoData ? "noData" : "dimmed";
      }

      const bulletinProblemTypes =
        activeBulletinCollection
          ?.getBulletinForBulletinOrRegion(regionId)
          ?.avalancheProblems?.filter(p =>
            matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
          )
          ?.map(p => p.problemType) ??
        activeBulletinCollection?.eawsAvalancheProblems?.[
          `${regionId}${toAmPm[validTimePeriod || "all_day"]}`
        ] ??
        [];
      if (bulletinProblemTypes.some(p => problems?.[p]?.highlighted)) {
        return "highlighted";
      }

      // dehighligt if any filter is activated
      if (Object.values(problems).some(p => p.highlighted)) {
        return isNoData ? "noData" : "dehighlighted";
      }

      if (isNoData) {
        return "noData";
      }

      return "default";
    }
  }, [
    activeBulletinCollection,
    eawsMicroRegions,
    eawsRegions,
    microRegions,
    problems,
    region,
    regionMouseover,
    validTimePeriod,
    vectorGrid
  ]);
  return <></>;
}
