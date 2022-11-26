import type { VectorGrid } from "leaflet";
import "leaflet.vectorgrid/dist/Leaflet.VectorGrid";
import { default as filterFeature } from "eaws-regions/filterFeature.mjs";
import {
  WarnLevelNumber,
  WARNLEVEL_COLORS,
  WARNLEVEL_OPACITY
} from "../../util/warn-levels";

import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import { fetchJSON } from "../../util/fetch";
import { useEffect, useState } from "react";
import { regionCodes } from "../../util/regions";
import { MicroRegionElevationProperties } from "../../stores/bulletin";

declare module "@react-leaflet/core" {
  interface LeafletContextInterface {
    vectorGrid: VectorGrid;
  }
}

type PbfProps = { ampm: "am" | "pm"; date: string };

export const PbfLayer = createLayerComponent((props: PbfProps, ctx) => {
  const instance = L.vectorGrid.protobuf(
    "https://static.avalanche.report/eaws_pbf/{z}/{x}/{y}.pbf",
    {
      pane: "overlayPane",
      maxNativeZoom: 9,
      vectorTileLayerStyles: {
        eaws: {
          stroke: false,
          fill: false
        }
      },
      getFeatureId(f: { properties: MicroRegionElevationProperties }) {
        return !filterFeature(f, props.date)
          ? undefined
          : props.ampm
          ? `${f.properties.id}:${f.properties.elevation}:${props.ampm}`
          : `${f.properties.id}:${f.properties.elevation}`;
      }
    }
  );
  return {
    instance,
    context: { ...ctx, vectorGrid: instance }
  };
});

export const EawsDangerRatings = ({ date }: { date: string }) => {
  const [maxDangerRatings, setMaxDangerRatings] = useState(
    {} as MaxDangerRatings
  );
  useEffect(() => {
    fetchJSON(
      `https://static.avalanche.report/eaws_bulletins/${date}/${date}.ratings.json`,
      {}
    ).then(({ maxDangerRatings }: { maxDangerRatings: MaxDangerRatings }) =>
      setMaxDangerRatings(
        Object.fromEntries(
          Object.entries(maxDangerRatings).filter(
            ([id]) => !regionCodes.some(prefix => id.startsWith(prefix))
          )
        )
      )
    );
  }, [setMaxDangerRatings]);
  return (
    <DangerRatings maxDangerRatings={maxDangerRatings} fillOpacity={0.5} />
  );
};

type Region = string;
type MaxDangerRatings = Record<Region, WarnLevelNumber>;

type DangerRatingsProps = {
  maxDangerRatings: MaxDangerRatings;
  fillOpacity?: number | undefined;
};

export const DangerRatings = ({
  maxDangerRatings,
  fillOpacity
}: DangerRatingsProps) => {
  const ctx = useLeafletContext();
  useEffect(() => {
    Object.entries(maxDangerRatings).forEach(([id, warnlevel]) => {
      ctx.vectorGrid.setFeatureStyle(id, {
        stroke: false,
        fill: true,
        fillColor: WARNLEVEL_COLORS[warnlevel],
        fillOpacity: fillOpacity || WARNLEVEL_OPACITY[warnlevel]
      });
    });
  }, [maxDangerRatings]);
  return <></>;
};
