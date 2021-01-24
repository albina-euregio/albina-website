/**
 * @returns {Promise<GeoJSON.FeatureCollection>}
 */
export async function loadNeighborBulletins(date) {
  const response = await fetch(
    "https://avalanche.report/transfer/bulletins-AT.json"
  );
  if (!response.ok) throw Error(response.statusText);
  /**
   * @type {Albina.NeighborBulletin[]}
   */
  const bulletins = await response.json();
  /**
   * @type {GeoJSON.FeatureCollection}
   */
  const regions = (await import("./neighbor_micro_regions.geojson.json"))
    .default;

  return Object.freeze({
    ...regions,
    features: regions.features
      .filter(
        // exclude ALBINA regions
        feature => !feature.properties.id.match(window.config.regionsRegex)
      )
      .map(feature => augmentNeighborFeature(feature, bulletins))
      .filter(feature => feature.properties.validityDate === date)
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
 * @param {Albina.NeighborBulletin} bulletins
 * @returns {GeoJSON.Feature}
 */
function augmentNeighborFeature(feature, bulletins) {
  const region = feature.properties.id;
  const elev = feature.properties.hoehe;
  const bulletin = bulletins.find(bulletin =>
    bulletin.validRegions.includes(region)
  );
  const { validityDate } = bulletin;
  const dangerMain = bulletin?.dangerMain?.find(
    danger =>
      !danger.validElev ||
      (danger.validElev.charAt(0) === "<" && elev === 1) ||
      (danger.validElev.charAt(0) === ">" && elev === 2)
  );
  const warnlevel = dangerMain?.mainValue;
  /**
   * @type {import("leaflet").PathOptions}
   */
  const style = {
    stroke: false,
    fillColor: WARNLEVEL_COLORS[warnlevel],
    fillOpacity: 0.5,
    className: "mix-blend-mode-multiply"
  };
  Object.assign(feature.properties, {
    bulletin,
    validityDate,
    dangerMain,
    warnlevel,
    style
  });
  return feature;
}
