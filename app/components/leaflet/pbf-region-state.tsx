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
import { RegionState } from "../../stores/bulletin";
import type { PathOptions } from "leaflet";

export type PbfRegionStateProps = {
  activeBulletinCollection: BulletinCollection;
  problems: Record<AvalancheProblemType, { highlighted: boolean }>;
  region: string;
  regionMouseover: string;
  validTimePeriod: ValidTimePeriod | undefined;
};

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

  const regionStyling = useMemo(() => {
    return Object.fromEntries<PathOptions>(
      Object.entries(config.map.regionStyling).map(([k, v]) => [
        k,
        {
          ...config.map.regionStyling.clickable,
          ...config.map.regionStyling.all,
          ...v
        }
      ])
    );
  }, []);

  const { vectorGrid } = useLeafletContext();
  useEffect(() => {
    vectorGrid.options.regionStyling = Object.fromEntries(
      [...microRegions, ...eawsRegions, ...eawsMicroRegions].map(region => [
        region,
        regionStyling[getRegionState(region)]
      ])
    );
    requestAnimationFrame(() => vectorGrid.rerenderTiles());

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
    regionStyling,
    validTimePeriod,
    vectorGrid
  ]);
  return <></>;
}
