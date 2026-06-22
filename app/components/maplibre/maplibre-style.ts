import maplibregl from "maplibre-gl";

export const MAPLIBRE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: `${import.meta.env.BASE_URL}fonts/{fontstack}/{range}.pbf`,
  sources: {
    basemap: {
      type: "raster",
      tiles: ["https://static.avalanche.report/tms/{z}/{x}/{y}.webp"],
      tileSize: 256,
      minzoom: 5,
      maxzoom: 10,
      attribution:
        "© <a href='https://sonny.4lima.de/'>Sonny</a>, CC BY 4.0 | © <a href='https://www.eea.europa.eu/en/datahub/datahubitem-view/d08852bc-7b5f-4835-a776-08362e2fbf4b'>EU-DEM</a>, CC BY 4.0 | © avalanche.report, CC BY 4.0"
    },
    opentopomap: {
      type: "raster",
      tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 17,
      attribution:
        "Map data: OpenStreetMap contributors, SRTM | Map style: OpenTopoMap (CC-BY-SA)"
    }
  },
  layers: [
    {
      id: "basemap",
      type: "raster",
      source: "basemap",
      maxzoom: 10.25
    },
    {
      id: "opentopomap",
      type: "raster",
      source: "opentopomap",
      minzoom: 10.25
    }
  ]
};
