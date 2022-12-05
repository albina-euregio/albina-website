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
  MicroRegionProperties
} from "../../stores/bulletin";

declare module "@react-leaflet/core" {
  interface LeafletContextInterface {
    vectorGrid: VectorGrid;
  }
}
declare module "leaflet" {
  interface VectorGridOptions {
    dangerRatings: MaxDangerRatings;
  }
}

const eawsRegionsWithoutElevation =
  /(AD|CH|CZ|ES|ES-CT-RF|ES-CT-PA|ES-CT-PP|ES-CT-VN|ES-CT-TF|ES-CT-PR|ES-CT-L-04|FI|FR|GB|IS|NO|PL|SK)/;

type Region = string;
type MaxDangerRatings = Record<Region, WarnLevelNumber>;

type PbfProps = { ampm: "am" | "pm"; date: string };

export const PbfLayer = createLayerComponent((props: PbfProps, ctx) => {
  const hidden: PathOptions = Object.freeze({ stroke: false, fill: false });
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
      maxNativeZoom: 10,
      vectorTileLayerStyles: {
        "micro-regions_elevation"(
          properties: MicroRegionElevationProperties
        ): PathOptions {
          if (eawsRegionsWithoutElevation.test(properties.id)) return hidden;
          if (!filterFeature({ properties }, props.date)) return hidden;
          return style(properties.id + ":" + properties.elevation);
        },
        "micro-regions"(properties: MicroRegionProperties): PathOptions {
          if (regionsRegex.test(properties.id)) return hidden;
          if (!eawsRegionsWithoutElevation.test(properties.id)) return hidden;
          if (!filterFeature({ properties }, props.date)) return hidden;
          return style(properties.id);
        },
        outline(): PathOptions {
          return hidden;
        }
      }
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
  region?: string;
}) => {
  const [maxDangerRatings, setMaxDangerRatings] = useState(
    {} as MaxDangerRatings
  );
  useEffect(() => {
    if (date < "2021-01-25") {
      return;
    }
    fetchJSON(
      `https://static.avalanche.report/eaws_bulletins/${date}/${date}${
        region ? "-" + region : ""
      }.ratings.json`,
      {}
    )
      .then(({ maxDangerRatings }: { maxDangerRatings: MaxDangerRatings }) =>
        setMaxDangerRatings(
          Object.fromEntries(
            Object.entries(maxDangerRatings).filter(
              ([id]) => !regionsRegex.test(id)
            )
          )
        )
      )
      .catch(error =>
        console.warn("Cannot load EAWS bulletins for date " + date, error)
      );
  }, [date, setMaxDangerRatings]);
  return <DangerRatings maxDangerRatings={maxDangerRatings} />;
};
