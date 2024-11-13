import React, { useEffect, useMemo } from "react";
import {
  AvalancheProblemType,
  BulletinCollection,
  ValidTimePeriod,
  matchesValidTimePeriod,
  toAmPm
} from "../../stores/bulletin";
import { useLeafletContext } from "@react-leaflet/core";
import { eawsRegionIds, microRegionIds } from "../../stores/microRegions";

export type RegionState =
  | "mouseOver"
  | "selected"
  | "highlighted"
  | "dehighlighted"
  | "dimmed"
  | "default";

export const regionStates: RegionState[] = [
  "mouseOver",
  "selected",
  "highlighted",
  "dehighlighted",
  "dimmed",
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
    () => microRegionIds(activeBulletinCollection?.date),
    [activeBulletinCollection?.date]
  );
  const eawsRegions = useMemo(
    () => eawsRegionIds(activeBulletinCollection?.date),
    [activeBulletinCollection?.date]
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
      if (regionId === regionMouseover) {
        return "mouseOver";
      }
      if (regionId === region) {
        return "selected";
      }
      if (
        activeBulletinCollection
          ?.getBulletinForBulletinOrRegion(region)
          ?.regions?.some(r => r.regionID === regionId)
      ) {
        return "highlighted";
      }
      if (region) {
        // some other region is selected
        return "dimmed";
      }

      const bulletinProblemTypes =
        activeBulletinCollection
          ?.getBulletinForBulletinOrRegion(regionId)
          ?.avalancheProblems?.filter(p =>
            matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
          )
          ?.map(p => p.problemType) ??
        activeBulletinCollection?.eawsAvalancheProblems?.[
          `${regionId}${toAmPm[validTimePeriod || ValidTimePeriod.AllDay]}`
        ] ??
        [];
      if (bulletinProblemTypes.some(p => problems?.[p]?.highlighted)) {
        return "highlighted";
      }

      // dehighligt if any filter is activated
      if (Object.values(problems).some(p => p.highlighted)) {
        return "dehighlighted";
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
