import React from "react";
import type { PathOptions, VectorGrid } from "leaflet";
import "leaflet.vectorgrid/dist/Leaflet.VectorGrid";
import { default as filterFeature } from "eaws-regions/filterFeature.mjs";
import { WarnLevelNumber, WARNLEVEL_STYLES } from "../../util/warn-levels";

import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import { fetchJSON } from "../../util/fetch";
import { useEffect, useState } from "react";
import { regionsRegex } from "../../util/regions";
import {
  MicroRegionElevationProperties,
  MicroRegionProperties,
  RegionOutlineProperties
} from "../../stores/bulletin";
import { RegionState } from "../../stores/bulletinStore";

declare module "@react-leaflet/core" {
  interface LeafletContextInterface {
    vectorGrid: VectorGrid;
  }
}

type Region = string;
type MaxDangerRatings = Record<Region, WarnLevelNumber>;

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

type PbfProps = { ampm: "am" | "pm"; date: string };

export const PbfLayer = createLayerComponent((props: PbfProps, ctx) => {
  const style = (id: string): PathOptions => {
    if (props.ampm) id += ":" + props.ampm;
    const warnlevel = instance.options.dangerRatings[id];
    if (!warnlevel) return hidden;
    return regionsRegex.test(id)
      ? WARNLEVEL_STYLES.albina[warnlevel]
      : WARNLEVEL_STYLES.eaws[warnlevel];
  };
  const instance = L.vectorGrid.protobuf(
    "https://static.avalanche.report/eaws_pbf/{z}/{x}/{y}.pbf",
    {
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
  }, [maxDangerRatings]);
  return <></>;
};

export const EawsDangerRatings = ({
  date,
  region
}: {
  date: string;
  region: string;
}) => {
  const [maxDangerRatings, setMaxDangerRatings] = useState(
    {} as MaxDangerRatings
  );
  useEffect(() => {
    if (date < "2021-01-25") {
      return;
    }
    fetchJSON(
      `https://static.avalanche.report/eaws_bulletins/${date}/${date}-${region}.ratings.json`,
      { cache: "no-cache" }
    )
      .then(json => setMaxDangerRatings(json.maxDangerRatings))
      .catch(error =>
        console.warn("Cannot load EAWS bulletins for date " + date, error)
      );
  }, [date, setMaxDangerRatings]);
  return <DangerRatings maxDangerRatings={maxDangerRatings} />;
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
  region: string;
  regionState: RegionState;
};

export const PbfRegionState = ({
  region,
  regionState
}: PbfRegionStateProps) => {
  const { vectorGrid } = useLeafletContext();
  useEffect(() => {
    vectorGrid.setFeatureStyle(region as any, {
      ...clickable,
      ...config.map.regionStyling.all,
      ...(config.map.regionStyling[regionState] || {})
    });
  }, []);
  return <></>;
};
