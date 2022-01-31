/* eslint-env node */
import { writeFileSync } from "fs";
import polyline from "@mapbox/polyline";
import { default as filterFeature } from "eaws-regions/filterFeature.mjs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const precision = 3;
const today = "2021-10-01";
const excludeAws = ["AEMET", "ALPSOLUT", "ICGC", "METEOMONT Carabinieri"];

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
  const geojsons = files.map(file => require(file));
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
    .filter(feature => filterFeature(feature, today))
    .sort((f1, f2) => f1.properties.id.localeCompare(f2.properties.id));
  geojson.features.forEach(({ properties }) => {
    if (properties.aws) {
      properties.aws = properties.aws.filter(
        aws => !excludeAws.includes(aws.name)
      );
    }
    properties.start_date || delete properties.start_date;
    properties.end_date || delete properties.end_date;
    properties.threshold || delete properties.threshold;
    delete properties["elevation line_visualization"];
  });
  const polyline = encodeFeatureCollection(geojson);
  writeFileSync(output, JSON.stringify(polyline, undefined, 2));
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
    "eaws-regions/public/micro-regions_elevation/AT-07_micro-regions_elevation.geojson.json",
    "eaws-regions/public/micro-regions_elevation/IT-32-BZ_micro-regions_elevation.geojson.json",
    "eaws-regions/public/micro-regions_elevation/IT-32-TN_micro-regions_elevation.geojson.json"
  ],
  "app/stores/micro-regions_elevation.polyline.json"
);

const eawsRegions = [
  "AT-02",
  "AT-03",
  "AT-04",
  "AT-05",
  "AT-06",
  "AT-08",
  "CH",
  "DE-BY",
  "ES-CT-L",
  "FR",
  "GB",
  "IT-21",
  "IT-23",
  "IT-25",
  "IT-34",
  "IT-36",
  "IT-57",
  "NO",
  "SI"
];

encodeFiles(
  [...eawsRegions, "LI", "IT-25-SO-LI"]
    .sort()
    .map(
      region => `eaws-regions/public/outline/${region}_outline.geojson.json`
    ),
  "app/stores/eaws_regions.polyline.json"
);

eawsRegions.forEach(region =>
  encodeFiles(
    [
      ["CH", "CZ", "FI", "FR", "GB", "IS", "NO", "PL"].includes(region)
        ? `eaws-regions/public/micro-regions/${region}_micro-regions.geojson.json`
        : `eaws-regions/public/micro-regions_elevation/${region}_micro-regions_elevation.geojson.json`
    ],
    `app/stores/micro-regions_elevation/${region}_micro-regions_elevation.polyline.json`
  )
);