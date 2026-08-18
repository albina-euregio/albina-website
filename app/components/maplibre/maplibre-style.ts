import {
  addProtocol,
  setWorkerUrl,
  type StyleSpecification
} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { Protocol } from "pmtiles";

// Since v6 MapLibre loads its worker as a separate ES module whose URL bundlers
// cannot resolve from `import.meta.url`. `?worker&url` routes it through Vite's
// worker pipeline, which emits a self-contained chunk (plain `?url` would drop
// the sibling `maplibre-gl-shared.mjs` in production builds).
// https://maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/
setWorkerUrl(workerUrl);

// Register the pmtiles:// protocol once so MapLibre can read PMTiles archives.
// https://maplibre.org/maplibre-gl-js/docs/examples/pmtiles-source-and-protocol/
addProtocol("pmtiles", new Protocol().tile);

export const MAPLIBRE_STYLE: StyleSpecification = {
  version: 8,
  glyphs: `${import.meta.env.BASE_URL}fonts/{fontstack}/{range}.pbf`,
  sources: {
    basemap: {
      type: "raster",
      url: "pmtiles:///albina-basemap.pmtiles",
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
