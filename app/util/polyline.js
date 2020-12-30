const polyline = require("@mapbox/polyline");

/**
 * @param {GeoJSON.FeatureCollection<Polygon>} geojson
 * @param {GeoJSON.Polygon => GeoJSON.Polygon} function
 */
function mapFeatureCollection(geojson, geometryMapper) {
  if (geojson.type !== "FeatureCollection") {
    throw "Invalid type " + geojson.type;
  }
  return {
    ...geojson,
    features: geojson.features.map(feature => ({
      ...feature,
      geometry: geometryMapper(feature.geometry)
    }))
  };
}

/**
 * @param {GeoJSON.FeatureCollection<Polygon>} geojson
 */
function encodeFeatureCollection(geojson) {
  return mapFeatureCollection(geojson, encodePolygon);
}

/**
 * @param {GeoJSON.FeatureCollection<Polygon>} geojson
 */
function decodeFeatureCollection(geojson) {
  return mapFeatureCollection(geojson, decodePolygon);
}

/**
 * @param {GeoJSON.Polygon} geometry
 */
function encodePolygon(geometry) {
  if (geometry.type !== "Polygon") {
    throw "Invalid type " + geometry.type;
  }
  return {
    ...geometry,
    coordinates: geometry.coordinates.map(c => polyline.encode(c)).join("\n")
  };
}

/**
 * @param {GeoJSON.Polygon} geometry
 */
function decodePolygon(geometry) {
  if (geometry.type !== "Polygon") {
    throw "Invalid type " + geometry.type;
  }
  return {
    ...geometry,
    coordinates:
      typeof geometry.coordinates === "string"
        ? geometry.coordinates.split("\n").map(c => polyline.decode(c))
        : geometry.coordinates
  };
}

module.exports = {
  encodeFeatureCollection,
  decodeFeatureCollection
};
