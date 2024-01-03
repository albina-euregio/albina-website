import React, { useMemo } from "react";
import type { PathOptions, VectorGrid } from "leaflet";
import "leaflet.vectorgrid/dist/Leaflet.VectorGrid";
import { WARNLEVEL_STYLES } from "../../util/warn-levels";

import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import { useEffect } from "react";
import { regionsRegex } from "../../util/regions";
import {
  eawsRegionIds,
  filterFeature,
  MicroRegionElevationProperties,
  microRegionIds,
  MicroRegionProperties,
  RegionOutlineProperties
} from "../../stores/microRegions";
import {
  AvalancheProblemType,
  BulletinCollection,
  matchesValidTimePeriod,
  MaxDangerRatings,
  toAmPm,
  ValidTimePeriod
} from "../../stores/bulletin";
import { RegionState } from "../../stores/bulletin";

declare module "@react-leaflet/core" {
  interface LeafletContextInterface {
    vectorGrid: VectorGrid;
  }
}

type PbfStyleFunction = {
  "micro-regions_elevation": (
    properties: MicroRegionElevationProperties
  ) => L.PathOptions;
  "micro-regions": (properties: MicroRegionProperties) => L.PathOptions;
  outline: (properties: RegionOutlineProperties) => L.PathOptions;
};

const hidden = Object.freeze({
  stroke: false,
  fill: false
} as PathOptions);
const clickable = Object.freeze({
  stroke: false,
  fill: true,
  fillColor: "black",
  fillOpacity: 0.0
} as PathOptions);

type PbfProps = {
  validTimePeriod: ValidTimePeriod;
  date: string;
};

export const PbfLayer = createLayerComponent((props: PbfProps, ctx) => {
  const style = (id: string): PathOptions => {
    id += toAmPm[props.validTimePeriod] ?? "";
    const warnlevel = instance.options.dangerRatings[id];
    if (!warnlevel) return hidden;
    return regionsRegex.test(id)
      ? WARNLEVEL_STYLES.albina[warnlevel]
      : WARNLEVEL_STYLES.eaws[warnlevel];
  };
  const instance = L.vectorGrid.protobuf(
    "https://static.avalanche.report/eaws_pbf/{z}/{x}/{y}.pbf",
    {
      dangerRatings: {},
      pane: "overlayPane",
      interactive: false,
      rendererFactory: L.canvas.tile,
      maxNativeZoom: 10,
      vectorTileLayerStyles: {
        "micro-regions_elevation"(properties) {
          if (!filterFeature({ properties }, props.date)) return hidden;
          return properties.elevation === "low_high"
            ? style(properties.id)
            : style(properties.id + ":" + properties.elevation);
        },
        "micro-regions"() {
          return hidden;
        },
        outline() {
          return hidden;
        }
      } as PbfStyleFunction
    }
  );
  return {
    instance,
    context: { ...ctx, vectorGrid: instance }
  };
});

type DangerRatingsProps = { maxDangerRatings: MaxDangerRatings };

export const DangerRatings = ({ maxDangerRatings }: DangerRatingsProps) => {
  const { vectorGrid } = useLeafletContext();
  useEffect(() => {
    vectorGrid.options.dangerRatings = {
      ...vectorGrid.options.dangerRatings,
      ...maxDangerRatings
    };
  }, [maxDangerRatings, vectorGrid.options]);
  return <></>;
};

type PbfLayerOverlayProps = PbfProps & {
  handleSelectRegion: (id?: string) => void;
};

export const PbfLayerOverlay = createLayerComponent(
  (props: PbfLayerOverlayProps, ctx) => {
    const instance = L.vectorGrid.protobuf(
      "https://static.avalanche.report/eaws_pbf/{z}/{x}/{y}.pbf",
      {
        pane: "markerPane",
        interactive: true,
        rendererFactory: L.svg.tile,
        maxNativeZoom: 10,
        getFeatureId({
          properties
        }: {
          properties:
            | MicroRegionElevationProperties
            | MicroRegionProperties
            | RegionOutlineProperties;
        }) {
          if (
            (properties as MicroRegionElevationProperties).elevation ||
            !filterFeature({ properties }, props.date)
          ) {
            return undefined;
          } else {
            return properties.id;
          }
        },
        vectorTileLayerStyles: {
          "micro-regions_elevation"() {
            return hidden;
          },
          "micro-regions"(properties) {
            if (!filterFeature({ properties }, props.date)) return hidden;
            return regionsRegex.test(properties.id) ? clickable : hidden;
          },
          outline(properties) {
            if (!filterFeature({ properties }, props.date)) return hidden;
            return !regionsRegex.test(properties.id) ? clickable : hidden;
          }
        } as PbfStyleFunction
      }
    );

    return {
      instance,
      context: { ...ctx, vectorGrid: instance }
    };
  }
);

type PbfRegionStateProps = {
  activeBulletinCollection: BulletinCollection;
  problems: Record<AvalancheProblemType, { highlighted: boolean }>;
  region: string;
  regionMouseover: string;
  validTimePeriod: ValidTimePeriod | undefined;
};

export const PbfRegionState = ({
  activeBulletinCollection,
  problems,
  region,
  regionMouseover,
  validTimePeriod
}: PbfRegionStateProps) => {
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
    [...microRegions, ...eawsRegions, ...eawsMicroRegions].forEach(region => {
      const regionState = getRegionState(region);
      vectorGrid.setFeatureStyle(region as unknown as number, {
        ...clickable,
        ...config.map.regionStyling.all,
        ...(config.map.regionStyling[regionState] || {})
      });
    });

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
};
