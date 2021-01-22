/* eslint-env node */
const fs = require("fs");
const { encodeFeatureCollection } = require("./app/util/polyline");

/**
 * @param {string} filename
 */
function encodeFile(filename) {
  const geojson = JSON.parse(fs.readFileSync(filename));
  const polyline = encodeFeatureCollection(geojson);
  fs.writeFileSync(
    filename.replace(/geojson.json$/, "polyline.json"),
    JSON.stringify(polyline, undefined, 2)
  );
}

encodeFile("app/stores/neighbor_regions.geojson.json");