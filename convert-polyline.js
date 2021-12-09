/* eslint-env node */
const fs = require("fs");

const polyline = require("@mapbox/polyline");
const precision = 3;

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
  geojson.features.forEach(({ properties }) => {
    properties.start_date || delete properties.start_date;
    properties.end_date || delete properties.end_date;
    properties.threshold || delete properties.threshold;
    delete properties["elevation line_visualization"];
  });
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

encodeFiles(
  [
    "eaws-regions/public/outline/AT-02_outline.geojson.json",
    "eaws-regions/public/outline/AT-03_outline.geojson.json",
    "eaws-regions/public/outline/AT-04_outline.geojson.json",
    "eaws-regions/public/outline/AT-05_outline.geojson.json",
    "eaws-regions/public/outline/AT-06_outline.geojson.json",
    "eaws-regions/public/outline/AT-08_outline.geojson.json",
    "eaws-regions/public/outline/CH_outline.geojson.json",
    "eaws-regions/public/outline/DE-BY_outline.geojson.json",
    "eaws-regions/public/outline/FR_outline.geojson.json",
    "eaws-regions/public/outline/IT-21_outline.geojson.json",
    "eaws-regions/public/outline/IT-23_outline.geojson.json",
    "eaws-regions/public/outline/IT-25_outline.geojson.json",
    "eaws-regions/public/outline/IT-25-SO-LI_outline.geojson.json",
    "eaws-regions/public/outline/IT-34_outline.geojson.json",
    "eaws-regions/public/outline/IT-36_outline.geojson.json",
    "eaws-regions/public/outline/IT-57_outline.geojson.json",
    "eaws-regions/public/outline/LI_outline.geojson.json",
    "eaws-regions/public/outline/SI_outline.geojson.json"
  ],
  "app/stores/neighbor_regions.polyline.json"
);

for (const region of [
  "AT-02",
  "AT-02",
  "AT-03",
  "AT-04",
  "AT-05",
  "AT-06",
  "AT-08",
  "CH",
  "DE-BY",
  "FR",
  "IT-21",
  "IT-23",
  "IT-25",
  "IT-34",
  "IT-36",
  "IT-57",
  "SI"
]) {
  encodeFiles(
    [
      `eaws-regions/public/micro-regions_elevation/${region}_micro-regions_elevation.geojson.json`
    ],
    `app/stores/micro-regions_elevation/${region}_micro-regions_elevation.polyline.json`
  );
}
