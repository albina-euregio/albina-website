import { decodeFeatureCollection } from "../util/polyline";

/**
 * @type {Promise<GeoJSON.FeatureCollection>}
 */
let loadedRegions = undefined;

/**
 * @return {Promise<GeoJSON.FeatureCollection>}
 */
async function loadRegions() {
  const regionsPolyline = await import(
    "./neighbor_micro_regions.polyline.json"
  );
  debugger;
  const regions = decodeFeatureCollection(regionsPolyline.default);
  regions.features.push(...(await loadRegionsCH()));
  regions.features = regions.features.map(f => Object.freeze(f));
  return Object.freeze(regions);
}

/**
 * @type {Promise<Albina.NeighborBulletin[]>}
 */
async function loadBulletins(date) {
  const regions = [
    "AT-02",
    "AT-03",
    "AT-04",
    "AT-05",
    "AT-06",
    "AT-08",
    "BY",
    "CH"
  ];
  const responses = regions.map(region =>
    fetch(`https://avalanche.report/albina_neighbors/${date}-${region}.json`)
  );
  const bulletins = responses.flatMap(response =>
    response.then(r => ((r.ok ? r.json() : []))).catch(() => [])
  );
  const allBulletins = await Promise.all(bulletins);
  return allBulletins.flat();
}

/**
 * @returns {Promise<GeoJSON.FeatureCollection>}
 */
export async function loadNeighborBulletins(date) {
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

/**
 * @param {GeoJSON.Feature} feature
 * @param {Albina.NeighborBulletin[]} bulletins
 * @returns {GeoJSON.Feature}
 */
function augmentNeighborFeature(feature, bulletins) {
  const region = feature.properties.id;
  const elev = feature.properties.hoehe;
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
        (danger.valid_elevation.charAt(0) === "<" && elev === 1) ||
        (danger.valid_elevation.charAt(0) === ">" && elev === 2)
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

/**
 * @returns{Promise<GeoJSON.Feature[]>}}
 */
async function loadRegionsCH() {
  const extraRegionsPolyline = await import("./neighbor_regions.polyline.json");
  const extraRegions = decodeFeatureCollection(
    extraRegionsPolyline.default
  ).features.filter(feature => feature.id === "CH" || feature.id === "LI");
  extraRegions.forEach(feature => (feature.properties.id = feature.id));
  return extraRegions;
}
