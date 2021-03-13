/* eslint-env node */
const fs = require("fs");
const { encodeGeobuf } = require("./app/util/geobuf");
const { encodeFeatureCollection } = require("./app/util/polyline");

/**
 * @param {string} filename
 */
function encodeFile(filename) {
  const geojson = JSON.parse(fs.readFileSync(filename));
  const polyline = encodeFeatureCollection(geojson);
  fs.writeFileSync(
    filename.replace(/geojson.json$/, "polyline.json"),
    JSON.stringify(polyline, undefined, 2) + "\n"
  );
  var buffer = encodeGeobuf(geojson);
  fs.writeFileSync(filename.replace(/geojson.json$/, "pbf"), buffer);
}

encodeFile("app/stores/micro_regions.geojson.json");
encodeFile("app/stores/neighbor_regions.geojson.json");
encodeFile("app/stores/neighbor_micro_regions.geojson.json");
