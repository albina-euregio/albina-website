import React, { useEffect } from "react";
import {
  MaxDangerRatings,
  ValidTimePeriod,
  toAmPm
} from "../../stores/bulletin";
import {
  leafletLayer as pmLayer,
  type Feature,
  type Rule,
  PolygonSymbolizer
} from "protomaps-leaflet/src/index";
import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import {
  EawsRegionDataLayer,
  MicroRegionElevationProperties,
  MicroRegionProperties,
  RegionOutlineProperties,
  filterFeature
} from "../../stores/microRegions";
import { regionsRegex } from "../../util/regions";
import {
  WARNLEVEL_COLORS,
  WARNLEVEL_OPACITY,
  WarnLevelNumber
} from "../../util/warn-levels";
import {
  DomEvent,
  type LeafletMouseEventHandlerFn,
  type LeafletEventHandlerFnMap,
  type LeafletMouseEvent,
  type Map
} from "leaflet";
import { mapValues } from "../../util/mapValues";
import { RegionState, regionStates } from "./pbf-region-state";

type LeafletPbfLayer = ReturnType<typeof pmLayer> & {
  options: {
    rerenderTiles(): void;
    dangerRatings: MaxDangerRatings;
    regionStyling: Record<string, RegionState>;
  };
};

declare module "@react-leaflet/core" {
  interface LeafletContextInterface {
    map: Map;
    vectorGrid: LeafletPbfLayer;
  }
}

type PbfProps = {
  handleSelectRegion: (id?: string) => void;
  validTimePeriod: ValidTimePeriod;
  eventHandlers: LeafletEventHandlerFnMap;
  date: string;
};

export const PbfLayer = createLayerComponent((props: PbfProps, ctx) => {
  const dataSource = "eaws-regions";
  const instance = pmLayer({
    pane: "overlayPane",
    interactive: false,
    sources: {
      [dataSource]: {
        maxDataZoom: 10,
        url: "https://static.avalanche.report/eaws-regions.pmtiles"
      }
    },
    attribution: "",
    label_rules: [],
    paint_rules: [
      ...([1, 2, 3, 4, 5] as WarnLevelNumber[]).map(
        warnlevel =>
          ({
            dataSource,
            dataLayer: EawsRegionDataLayer.micro_regions_elevation,
            filter: (z, f) =>
              filterFeature({ properties: f.props }, props.date) &&
              dangerRating(f.props) === warnlevel,
            symbolizer: new PolygonSymbolizer({
              fill: WARNLEVEL_COLORS[warnlevel],
              opacity: WARNLEVEL_OPACITY[warnlevel]
            })
          }) satisfies Rule
      ),
      ...regionStates.flatMap(regionState =>
        [EawsRegionDataLayer.outline, EawsRegionDataLayer.micro_regions].map(
          dataLayer =>
            ({
              dataSource,
              dataLayer,
              filter: (z, f) =>
                microRegionOrOutline(f, dataLayer) &&
                filterFeature({ properties: f.props }, props.date) &&
                instance.options.regionStyling[f.props.id] === regionState,
              symbolizer: new PolygonSymbolizer({
                fill:
                  config.map.regionStyling[regionState].fillColor ??
                  config.map.regionStyling["clickable"].fillColor,
                opacity:
                  config.map.regionStyling[regionState].fillOpacity ??
                  config.map.regionStyling["clickable"].fillOpacity,
                width: config.map.regionStyling[regionState].weight ?? 0.0
              })
            }) satisfies Rule
        )
      )
    ]
  }) as LeafletPbfLayer;

  ctx.map.on(
    mapValues<
      "click" | "mouseover" | "mouseout",
      LeafletMouseEventHandlerFn,
      LeafletMouseEventHandlerFn
    >(props.eventHandlers, handler => e => {
      e.sourceTarget = { properties: findFeature(e) };
      return handler(e);
    })
  );

  function findFeature(
    e: LeafletMouseEvent
  ): MicroRegionProperties | RegionOutlineProperties | undefined {
    DomEvent.stop(e);
    instance._map = ctx.map;
    const features: {
      feature: Feature;
      layerName: EawsRegionDataLayer;
    }[] = instance.queryFeatures(e.latlng.lng, e.latlng.lat).get(dataSource);
    const feature = features.find(({ feature, layerName }) =>
      microRegionOrOutline(feature, layerName)
    );
    return feature?.feature?.props as unknown as
      | MicroRegionProperties
      | RegionOutlineProperties
      | undefined;
  }

  function microRegionOrOutline(
    feature: Feature,
    dataLayer: EawsRegionDataLayer
  ): unknown {
    return (
      (dataLayer === EawsRegionDataLayer.micro_regions &&
        regionsRegex.test(feature?.props?.id as string)) ||
      (dataLayer === EawsRegionDataLayer.outline &&
        !regionsRegex.test(feature?.props?.id as string))
    );
  }

  function dangerRating({
    id,
    elevation
  }: MicroRegionElevationProperties): WarnLevelNumber {
    if (elevation !== "low_high") id += ":" + elevation;
    id += toAmPm[props.validTimePeriod] ?? "";
    return instance.options.dangerRatings[id];
  }

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
