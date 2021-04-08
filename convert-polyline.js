/* eslint-env node */
const fs = require("fs");
const { encodeFeatureCollection } = require("./app/util/polyline");

/**
 * @param {string[]} files
 * @param {string} output
 */
function encodeFiles(files, output) {
  /**
   * @type {[GeoJSON.FeatureCollection]}
   */
  const geojsons = files.map(file => JSON.parse(fs.readFileSync(file)));
  /**
   * @type {GeoJSON.FeatureCollection}
   */
  const geojson = {
    type: "FeatureCollection",
    features: []
  };
  geojson.features = geojson.features
    .concat(...geojsons.map(g => g.features))
    .map(f => ({ id: f.properties?.id, ...f }))
    .sort((f1, f2) => f1.properties.id.localeCompare(f2.properties.id));
  const polyline = encodeFeatureCollection(geojson);
  fs.writeFileSync(output, JSON.stringify(polyline, undefined, 2));
}

encodeFiles(
  [
    "eaws-regions/public/micro-regions/AT-07_micro-regions.geojson.json",
    "eaws-regions/public/micro-regions/IT-32-BZ_micro-regions.geojson.json",
    "eaws-regions/public/micro-regions/IT-32-TN_micro-regions.geojson.json"
  ],
  "app/stores/micro_regions.polyline.json"
);
