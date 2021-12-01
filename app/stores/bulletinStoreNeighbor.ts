import { decodeFeatureCollection } from "../util/polyline";
import { NeighborBulletin } from "./bulletin";

let loadedRegions: Promise<GeoJSON.FeatureCollection> = undefined;

async function loadRegions(): Promise<GeoJSON.FeatureCollection> {
  const polyline = import("./neighbor_micro_regions.polyline.json");
  const polylineExtra = import("./neighbor_regions.polyline.json");
  const regions = decodeFeatureCollection((await polyline).default);
  const extraRegions = decodeFeatureCollection((await polylineExtra).default);
  const extraFeatures = extraRegions.features.filter(
    feature => feature.id === "CH" || feature.id === "LI"
  );
  extraFeatures.forEach(
    feature => (feature.properties.id = feature.id as string)
  );
  regions.features.push(...extraFeatures);
  regions.features = regions.features.map(f => Object.freeze(f));
  return Object.freeze(regions);
}

async function loadBulletin(
  date: string,
  region: string
): Promise<NeighborBulletin[]> {
  try {
    const url = `https://avalanche.report/albina_neighbors/${date}-${region}.json`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (ignore) {}
  return [];
}

async function loadBulletins(date: string): Promise<NeighborBulletin[]> {
  const regions = [
    "AT-02",
    "AT-03",
    "AT-04",
    "AT-05",
    "AT-06",
    "AT-08",
    "BY",
    "CH",
    "SI"
  ];
  const allBulletins = await Promise.all(
    regions.map(region => loadBulletin(date, region))
  );
  return allBulletins.flat();
}

export async function loadNeighborBulletins(
  date: string
): Promise<GeoJSON.FeatureCollection> {
  if (typeof date !== "string") return;
  const bulletins = await loadBulletins(date);
  if (!loadedRegions) loadedRegions = loadRegions();
  const regions = await loadedRegions;

  return Object.freeze({
    ...regions,
    name: `neighbor_bulletins_${date}`,
    features: regions.features
      .filter(
        // exclude ALBINA regions
        feature => !feature.properties.id.match(window.config.regionsRegex)
      )
      .map(feature => augmentNeighborFeature(feature, bulletins))
      .filter(feature => feature.properties.bulletin)
  });
}

const WARNLEVEL_COLORS = [
  undefined,
  "#ccff66",
  "#ffff00",
  "#ff9900",
  "#ff0000",
  "#ff0000"
];

function augmentNeighborFeature(
  feature: GeoJSON.Feature,
  bulletins: NeighborBulletin[]
): GeoJSON.Feature {
  const region = feature.properties.id;
  const elevation = feature.properties.elevation;
  bulletins = bulletins.filter(bulletin =>
    bulletin.valid_regions.includes(region)
  );
  const bulletin =
    bulletins.length &&
    bulletins.reduce((b1, b2) =>
      Math.max(...b1.danger_main.map(d => d.main_value)) >=
      Math.max(...b2.danger_main.map(d => d.main_value))
        ? b1
        : b2
    );
  const warnlevel = bulletin?.danger_main
    ?.filter(
      danger =>
        !danger.valid_elevation ||
        (danger.valid_elevation.charAt(0) === "<" && elevation === "low") ||
        (danger.valid_elevation.charAt(0) === ">" && elevation === "high")
    )
    .map(danger => danger.main_value)
    .reduce((w1, w2) => Math.max(w1, w2), 0);
  /**
   * @type {import("leaflet").PathOptions}
   */
  const style = {
    stroke: false,
    fillColor: WARNLEVEL_COLORS[warnlevel],
    fillOpacity: 0.5,
    className: "mix-blend-mode-multiply"
  };
  return {
    ...feature,
    properties: {
      ...feature.properties,
      bulletin,
      warnlevel,
      style
    }
  };
}
