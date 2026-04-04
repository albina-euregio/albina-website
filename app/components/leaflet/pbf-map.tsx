import React, { useEffect } from "react";
import type { PathOptions, VectorGrid } from "leaflet";
import "leaflet.vectorgrid";
import { WARNLEVEL_STYLES, WarnLevelNumber } from "../../util/warn-levels";

import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import {
  filterFeature,
  MicroRegionElevationProperties,
  MicroRegionProperties
} from "../../stores/microRegions";
import { $province } from "../../appStore";
import { RegionOutlineProperties } from "../../stores/eawsRegions";
import { toAmPm, ValidTimePeriod } from "../../stores/bulletin";
import { newRegionRegex } from "../../util/newRegionRegex";

const pbfStar = import.meta.glob("./@eaws/pbf/*/*/*.pbf", {
  base: "../../../node_modules",
  eager: true,
  import: "default",
  query: "?url"
});
const url = ({ x, y, z }: { x: number; y: number; z: number }) => {
  return pbfStar[`./@eaws/pbf/${z}/${x}/${y}.pbf`];
};

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
    const amPm = toAmPm[props.validTimePeriod] ?? "";
    const dangerRatings = instance.options.dangerRatings;
    const key = `${id}${amPm}`;
    let warnlevel = dangerRatings[key];
    if (!warnlevel && props.isOneDangerRating) {
      warnlevel = Math.max(
        dangerRatings[`${id}:low${amPm}`] ?? 0,
        dangerRatings[`${id}:high${amPm}`] ?? 0
      ) as WarnLevelNumber;
    }
    if (!warnlevel) return config.map.regionStyling.hidden;

    const province = $province.get();
    const internRegex = province
      ? new RegExp(`^(${province})`)
      : new RegExp(config.regionsRegex);
    return internRegex.test(key)
      ? WARNLEVEL_STYLES.intern[warnlevel]
      : WARNLEVEL_STYLES.extern[warnlevel];
  };
  const instance = L.vectorGrid.protobuf(url, {
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
  });
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
    const eawsRegionsExclude: string[] = config.eawsRegionsExclude ?? [];

    const instance = L.vectorGrid.protobuf(url, {
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
          eawsRegionsExclude.includes(properties.id) ||
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
            !eawsRegionsExclude.includes(properties.id) &&
            !regionsRegex.test(properties.id)
            ? config.map.regionStyling.clickable
            : config.map.regionStyling.hidden;
        }
      } as PbfStyleFunction
    });

    return {
      instance,
      context: { ...ctx, vectorGrid: instance }
    };
  }
);
