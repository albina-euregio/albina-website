import React, { useEffect,useMemo } from "react";
import "leaflet.vectorgrid/dist/Leaflet.VectorGrid";
import { AvalancheProblemType, BulletinCollection, MaxDangerRatings, ValidTimePeriod, matchesValidTimePeriod, toAmPm } from "../../stores/bulletin";
import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import { MicroRegionElevationProperties, MicroRegionProperties, RegionOutlineProperties, eawsRegionIds, filterFeature, microRegionIds } from "../../stores/microRegions";
import { PolygonSymbolizer, leafletLayer as pmLayer } from "protomaps-leaflet/src/index";
import { regionsRegex } from "../../util/regions";
import { RegionState } from "../../stores/bulletin";
import { WARNLEVEL_STYLES } from "../../util/warn-levels";
import type { Layer, PathOptions } from "leaflet";

declare module "@react-leaflet/core" {
  interface LeafletContextInterface {
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
const clickable = Object.freeze({
  stroke: false,
  fill: true,
  fillColor: "black",
  fillOpacity: 0.1
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
    const instance = pmLayer({
      pane: "markerPane",
      interactive: true,
      maxDataZoom: 10,
      attribution: "",
      url: "https://static.avalanche.report/eaws-regions.pmtiles",
      label_rules: [],
      paint_rules: [
        {
          dataLayer: "overlay",
          filter: (z, f) => filterFeature({ properties: f.props }, props.date),
          symbolizer: new PolygonSymbolizer({
            fill: (z, f) =>
              (instance.options.regionStyling[f.props.id] ?? clickable)
                .fillColor,
            opacity: (z, f) =>
              (instance.options.regionStyling[f.props.id] ?? clickable)
                .fillOpacity
          })
        }
      ]
    });
    ctx.map.on("click", e =>
      // FIXME
      console.log(instance.queryFeatures(e.latlng.lat, e.latlng.lng))
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
      vectorGrid.options.regionStyling = {
        [region]: {
          ...clickable,
          ...config.map.regionStyling.all,
          ...(config.map.regionStyling[regionState] || {})
        }
      };
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
