import * as polyline from "@mapbox/polyline";
const precision = 3;

/**
 * @template T
 * @param {GeoJSON.FeatureCollection<Polygon, T>} geojson
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
 * @template T
 * @param {GeoJSON.FeatureCollection<Polygon, T>} geojson
 */
export function encodeFeatureCollection(geojson) {
  return mapFeatureCollection(geojson, encodeGeometry);
}

/**
 * @template T
 * @param {GeoJSON.FeatureCollection<Polygon, T>} geojson
 */
export function decodeFeatureCollection(geojson) {
  return mapFeatureCollection(geojson, decodeGeometry);
}

/**
 * @param {GeoJSON.Geometry} geometry
 */
function encodeGeometry(geometry) {
  if (geometry.type === "Polygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates
        .map(c => polyline.encode(c, precision))
        .join("\n")
    };
  } else if (geometry.type === "MultiPolygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map(cc =>
        cc.map(c => polyline.encode(c, precision)).join("\n")
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
      coordinates: geometry.coordinates
        .split("\n")
        .map(c => polyline.decode(c, precision))
    };
  } else if (geometry.type === "MultiPolygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map(cc =>
        cc.split("\n").map(c => polyline.decode(c, precision))
      )
    };
  }
  throw "Invalid type " + geometry.type;
}

if (typeof module === "object" && module.exports) {
  module.exports = {
    encodeFeatureCollection,
    decodeFeatureCollection
  };
}
