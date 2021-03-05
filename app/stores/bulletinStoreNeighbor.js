import { decodeFeatureCollection } from "../util/polyline";

/**
 * @type {Promise<GeoJSON.FeatureCollection>}
 */
let loadedRegions = undefined;

/**
 * @return {Promise<GeoJSON.FeatureCollection>}
 */
async function loadRegions() {
  const regionsPolyline = await import("./neighbor_micro_regions.polyline.json");
  const regions = decodeFeatureCollection(regionsPolyline.default);
  regions.features = regions.features.map(f => Object.freeze(f));
  return Object.freeze(regions);
}

/**
 * @type {Promise<Albina.NeighborBulletin[]>}
 */
async function loadBulletins(date) {
  const regions = ["AT-02", "AT-03", "AT-04", "AT-05", "AT-06", "AT-08", "BY"];
  const responses = regions.map(region => fetch(`https://avalanche.report/albina_neighbors/${date}-${region}.json`));
  const bulletins = responses.flatMap(response => response.then(r => ((r.ok ? r.json() : []))).catch(() => []));
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

const WARNLEVEL_COLORS = [undefined, "#ccff66", "#ffff00", "#ff9900", "#ff0000", "#ff0000"];

/**
 * @param {GeoJSON.Feature} feature
 * @param {Albina.NeighborBulletin[]} bulletins
 * @returns {GeoJSON.Feature}
 */
function augmentNeighborFeature(feature, bulletins) {
  const region = feature.properties.id;
  const elev = feature.properties.hoehe;
  const bulletin = bulletins.find(bulletin => bulletin.valid_regions.includes(region));
  const dangerMain = bulletin?.danger_main?.find(
    danger =>
      !danger.valid_elevation ||
      (danger.valid_elevation.charAt(0) === "<" && elev === 1) ||
      (danger.valid_elevation.charAt(0) === ">" && elev === 2)
  );
  const warnlevel = dangerMain?.main_value;
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
      dangerMain,
      warnlevel,
      style
    }
  };
}
