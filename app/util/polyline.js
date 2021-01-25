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
  return mapFeatureCollection(geojson, encodeGeometry);
}

/**
 * @param {GeoJSON.FeatureCollection<Polygon>} geojson
 */
function decodeFeatureCollection(geojson) {
  return mapFeatureCollection(geojson, decodeGeometry);
}

/**
 * @param {GeoJSON.Geometry} geometry
 */
function encodeGeometry(geometry) {
  if (geometry.type === "Polygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map(c => polyline.encode(c)).join("\n")
    };
  } else if (geometry.type === "MultiPolygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map(cc =>
        cc.map(c => polyline.encode(c)).join("\n")
      )
    };
  }
  throw "Invalid type " + geometry.type;
}

/**
 * @param {GeoJSON.Geometry} geometry
 */
function decodeGeometry(geometry) {
  if (geometry.type === "Polygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.split("\n").map(c => polyline.decode(c))
    };
  } else if (geometry.type === "MultiPolygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map(cc =>
        cc.split("\n").map(c => polyline.decode(c))
      )
    };
  }
  throw "Invalid type " + geometry.type;
}

module.exports = {
  encodeFeatureCollection,
  decodeFeatureCollection
};
