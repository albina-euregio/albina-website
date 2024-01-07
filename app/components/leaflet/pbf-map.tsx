import React, { useEffect } from "react";
import {
  MaxDangerRatings,
  ValidTimePeriod,
  toAmPm
} from "../../stores/bulletin";
import {
  leafletLayer as pmLayer,
  type Feature,
  PolygonSymbolizer
} from "protomaps-leaflet/src/index";
import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import {
  MicroRegionElevationProperties,
  MicroRegionProperties,
  RegionOutlineProperties,
  filterFeature
} from "../../stores/microRegions";
import { regionsRegex } from "../../util/regions";
import { WARNLEVEL_STYLES } from "../../util/warn-levels";
import { DomEvent, type Map, type Layer, type PathOptions } from "leaflet";

declare module "@react-leaflet/core" {
  interface LeafletContextInterface {
    map: Map;
    vectorGrid: Layer;
  }
}

type Region = string;

type PbfStyleFunction = {
  "micro-regions_elevation": (
    properties: MicroRegionElevationProperties
  ) => L.PathOptions;
  "micro-regions": (properties: MicroRegionProperties) => L.PathOptions;
  outline: (properties: RegionOutlineProperties) => L.PathOptions;
};

const hidden = Object.freeze({
  stroke: false,
  fill: false,
  fillOpacity: 0.0
} as PathOptions);
export const clickable = Object.freeze({
  stroke: false,
  fill: true,
  fillColor: "black",
  fillOpacity: 0.1
} as PathOptions);

type PbfProps = {
  handleSelectRegion: (id?: string) => void;
  validTimePeriod: ValidTimePeriod;
  date: string;
};

export const PbfLayer = createLayerComponent((props: PbfProps, ctx) => {
  const style = ({
    id,
    elevation
  }: MicroRegionElevationProperties): PathOptions => {
    if (elevation !== "low_high") id += ":" + elevation;
    id += toAmPm[props.validTimePeriod] ?? "";
    const warnlevel = instance.options.dangerRatings[id];
    if (!warnlevel) return hidden;
    return regionsRegex.test(id)
      ? WARNLEVEL_STYLES.albina[warnlevel]
      : WARNLEVEL_STYLES.eaws[warnlevel];
  };
  const instance = pmLayer({
    pane: "overlayPane",
    interactive: false,
    sources: {
      "eaws-regions": {
        maxDataZoom: 10,
        url: "https://static.avalanche.report/eaws-regions.pmtiles"
      }
    },
    attribution: "",
    label_rules: [],
    paint_rules: [
      {
        dataSource: "eaws-regions",
        dataLayer: "micro-regions_elevation",
        filter: (z, f) => filterFeature({ properties: f.props }, props.date),
        symbolizer: new PolygonSymbolizer({
          fill: (z, f) => style(f.props).fillColor,
          opacity: (z, f) => style(f.props).fillOpacity
        })
      },
      {
        dataSource: "eaws-regions",
        dataLayer: "outline",
        filter: (z, f) => filterFeature({ properties: f.props }, props.date),
        symbolizer: new PolygonSymbolizer({
          fill: (z, f) =>
            (instance.options.regionStyling[f.props.id] ?? clickable).fillColor,
          opacity: (z, f) =>
            (instance.options.regionStyling[f.props.id] ?? clickable)
              .fillOpacity
        })
      }
    ]
  });
  ctx.map.on("click", e => {
    DomEvent.stop(e);
    instance._map = ctx.map;
    const features: {
      feature: Feature;
      layerName: "outline" | string;
    }[] = instance
      .queryFeatures(e.latlng.lng, e.latlng.lat)
      .get("eaws-regions");
    const feature = features.find(
      feature =>
        (feature.layerName === "micro-regions" &&
          regionsRegex.test(feature.feature?.props?.id)) ||
        (feature.layerName === "outline" &&
          !regionsRegex.test(feature.feature?.props?.id))
    );
    props.handleSelectRegion(feature?.feature?.props?.id || "");
  });
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
