import React, { useEffect } from "react";
import type { Temporal } from "temporal-polyfill";
import type { PathOptions, VectorGrid } from "leaflet";
import "leaflet.vectorgrid";
import { WARNLEVEL_STYLES, WarnLevelNumber } from "../../util/warn-levels";

import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import {
  filterFeature,
  MicroRegionElevationProperties,
  MicroRegionProperties
} from "../../stores/microRegions";
import { RegionOutlineProperties } from "../../stores/eawsRegions";
import { toAmPm, ValidTimePeriod } from "../../stores/bulletin";
import { newRegionRegex } from "../../util/newRegionRegex";

declare module "@react-leaflet/core" {
  interface LeafletContextInterface {
    vectorGrid: VectorGrid;
  }
}

type Region = string;
type MaxDangerRatings = Record<Region, WarnLevelNumber>;

interface PbfStyleFunction {
  "micro-regions_elevation": (
    properties: MicroRegionElevationProperties
  ) => L.PathOptions;
  "micro-regions": (properties: MicroRegionProperties) => L.PathOptions;
  outline: (properties: RegionOutlineProperties) => L.PathOptions;
}

interface PbfProps {
  isOneDangerRating: boolean;
  validTimePeriod: ValidTimePeriod;
  date: Temporal.PlainDate;
}

export const PbfLayer = createLayerComponent((props: PbfProps, ctx) => {
  const style = (id: string): PathOptions => {
    id += toAmPm[props.validTimePeriod] ?? "";
    const warnlevel = instance.options.dangerRatings[id];
    if (!warnlevel) return config.map.regionStyling.hidden;
    return config.regionsRegex.test(id)
      ? WARNLEVEL_STYLES.albina[warnlevel]
      : WARNLEVEL_STYLES.eaws[warnlevel];
  };
  const instance = L.vectorGrid.protobuf(
    "https://static.avalanche.report/eaws_pbf/{z}/{x}/{y}.pbf",
    {
      dangerRatings: {},
      pane: "overlayPane",
      interactive: false,
      rendererFactory: (tileCoord, tileSize, options) =>
        new L.Canvas.Tile(tileCoord, tileSize, options),
      maxNativeZoom: 10,
      vectorTileLayerStyles: {
        "micro-regions_elevation"(properties) {
          if (!filterFeature({ properties }, props.date)) {
            return config.map.regionStyling.hidden;
          }
          if (props.isOneDangerRating) {
            return style(properties.id);
          }
          return properties.elevation === "low_high"
            ? style(properties.id)
            : style(properties.id + ":" + properties.elevation);
        },
        "micro-regions"() {
          return config.map.regionStyling.hidden;
        },
        outline() {
          return config.map.regionStyling.hidden;
        }
      } as PbfStyleFunction
    }
  );
  return {
    instance,
    context: { ...ctx, vectorGrid: instance }
  };
});

interface DangerRatingsProps {
  maxDangerRatings: MaxDangerRatings;
}

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
    const regionsRegex = newRegionRegex([
      ...config.regionCodes,
      ...config.extraRegions
    ]);
    const instance = L.vectorGrid.protobuf(
      "https://static.avalanche.report/eaws_pbf/{z}/{x}/{y}.pbf",
      {
        pane: "markerPane",
        interactive: true,
        rendererFactory: (tileCoord, tileSize, options) =>
          new L.SVG.Tile(tileCoord, tileSize, options),
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
            return config.map.regionStyling.hidden;
          },
          "micro-regions"(properties) {
            return filterFeature({ properties }, props.date) &&
              regionsRegex.test(properties.id)
              ? config.map.regionStyling.clickable
              : config.map.regionStyling.hidden;
          },
          outline(properties) {
            return filterFeature({ properties }, props.date) &&
              !regionsRegex.test(properties.id)
              ? config.map.regionStyling.clickable
              : config.map.regionStyling.hidden;
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
