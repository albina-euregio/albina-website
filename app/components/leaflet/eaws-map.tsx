import type { VectorGrid } from "leaflet";
import "leaflet.vectorgrid/dist/Leaflet.VectorGrid";
import { default as filterFeature } from "eaws-regions/filterFeature.mjs";
import { WARNLEVEL_COLORS } from "../../util/warn-levels";

import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import { fetchJSON } from "../../util/fetch";
import { useEffect, useState } from "react";
import { regionCodes } from "../../util/regions";

export const PbfLayer = createLayerComponent((props, ctx) => {
  const instance = L.vectorGrid.protobuf(
    "https://static.avalanche.report/eaws_pbf/{z}/{x}/{y}.pbf",
    {
      maxNativeZoom: 9,
      vectorTileLayerStyles: {
        eaws: {
          stroke: false,
          fill: false
        }
      },
      getFeatureId(f) {
        return !filterFeature(f, "2022-12-01")
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
    {} as Record<string, number>
  );
  const ctx = useLeafletContext();
  useEffect(() => {
    fetchJSON(
      `https://static.avalanche.report/eaws_bulletins/${date}/${date}.ratings.json`,
      {}
    ).then(json => setMaxDangerRatings(json.maxDangerRatings));
  }, [setMaxDangerRatings]);
  useEffect(() => {
    Object.entries(maxDangerRatings).forEach(([id, warnlevel]) => {
      if (regionCodes.some(prefix => id.startsWith(prefix))) return;
      (ctx.vectorGrid as VectorGrid).setFeatureStyle(id, {
        stroke: false,
        fill: true,
        fillColor: WARNLEVEL_COLORS[warnlevel],
        fillOpacity: 0.5,
        className: "mix-blend-mode-multiply"
      });
    });
  }, [maxDangerRatings]);
  return <></>;
};
