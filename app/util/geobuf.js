const geobuf = require("geobuf");
const Pbf = require("pbf");

/**
 * @param {GeoJSON.FeatureCollection} geojson
 * @returns {Uint8Array}
 */
function encodeGeobuf(geojson) {
  return geobuf.encode(geojson, new Pbf());
}

/**
 * @param {Uint8Array|ArrayBuffer} buffer
 * @returns {GeoJSON.FeatureCollection}
 */
function decodeGeobuf(buffer) {
  return geobuf.decode(new Pbf(buffer));
}

module.exports = {
  encodeGeobuf,
  decodeGeobuf
};
