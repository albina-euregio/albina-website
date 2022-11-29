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

const eawsRegionsWithoutElevation = [
  "AD",
  "CH",
  "CZ",
  "ES",
  "ES-CT",
  "FI",
  "FR",
  "GB",
  "IS",
  "NO",
  "PL",
  "SK"
];

type PbfProps = { ampm: "am" | "pm"; date: string };

export const PbfLayer = createLayerComponent((props: PbfProps, ctx) => {
  const instance = L.vectorGrid.protobuf(
    "https://static.avalanche.report/eaws_pbf/{z}/{x}/{y}.pbf",
    {
      pane: "overlayPane",
      interactive: false,
      maxNativeZoom: 10,
      vectorTileLayerStyles: {
        eaws: {
          stroke: false,
          fill: false
        }
      },
      getFeatureId(f: { properties: MicroRegionElevationProperties }) {
        if (!filterFeature(f, props.date)) return undefined;
        let id = f.properties.id;
        if (f.properties.elevation) id += ":" + f.properties.elevation;
        if (props.ampm) id += ":" + props.ampm;
        return id;
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
    if (date < "2021-01-25") {
      return;
    }
    fetchJSON(
      `https://static.avalanche.report/eaws_bulletins/${date}/${date}.ratings.json`,
      {}
    )
      .then(({ maxDangerRatings }: { maxDangerRatings: MaxDangerRatings }) =>
        setMaxDangerRatings(
          Object.fromEntries(
            Object.entries(maxDangerRatings).filter(
              ([id]) => !regionCodes.some(prefix => id.startsWith(prefix))
            )
          )
        )
      )
      .catch(error =>
        console.warn("Cannot load EAWS bulletins for date " + date, error)
      );
  }, [date, setMaxDangerRatings]);
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
