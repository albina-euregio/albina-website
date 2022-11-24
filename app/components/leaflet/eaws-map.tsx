import type { VectorGrid } from "leaflet";
import "leaflet.vectorgrid/dist/Leaflet.VectorGrid";
import { default as filterFeature } from "eaws-regions/filterFeature.mjs";
import { WARNLEVEL_COLORS } from "../../util/warn-levels";

import { createLayerComponent, useLeafletContext } from "@react-leaflet/core";
import { fetchJSON } from "../../util/fetch";
import { useEffect, useState } from "react";

export const PbfLayer = createLayerComponent(({}, ctx) => {
  const instance = L.vectorGrid.protobuf("/pbf/{z}/{x}/{y}.pbf", {
    maxNativeZoom: 9,
    vectorTileLayerStyles: {
      eaws: {
        stroke: false,
        fill: false
      }
    },
    filter(f) {
      return filterFeature(f, "2022-12-01");
    },
    getFeatureId(f) {
      return `${f.properties.id}:${f.properties.elevation}`;
    }
  });
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
      (ctx.vectorGrid as VectorGrid).setFeatureStyle(id, {
        stroke: false,
        fill: true,
        fillColor: WARNLEVEL_COLORS[warnlevel],
        fillOpacity: 0.5
        // className: "mix-blend-mode-multiply"
      });
    });
  }, [maxDangerRatings]);
  return <></>;
};
