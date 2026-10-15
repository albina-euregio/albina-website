import {
  addProtocol,
  setWorkerUrl,
  type StyleSpecification
} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import {
  EtagMismatch,
  PMTiles,
  Protocol,
  type RangeResponse,
  type Source
} from "pmtiles";

// Since v6 MapLibre loads its worker as a separate ES module whose URL bundlers
// cannot resolve from `import.meta.url`. `?worker&url` routes it through Vite's
// worker pipeline, which emits a self-contained chunk (plain `?url` would drop
// the sibling `maplibre-gl-shared.mjs` in production builds).
// https://maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/
setWorkerUrl(workerUrl);

// Register the pmtiles:// protocol once so MapLibre can read PMTiles archives.
// https://maplibre.org/maplibre-gl-js/docs/examples/pmtiles-source-and-protocol/
const protocol = new Protocol();
addProtocol("pmtiles", protocol.tile);

/** Returns the pmtiles:// URL for the archive, read via rangeUrlSource. */
export function pmtilesUrl(url: string): string {
  if (!protocol.get(url)) protocol.add(new PMTiles(rangeUrlSource(url)));
  return `pmtiles://${url}`;
}

/**
 * Like pmtiles' FetchSource, but with the byte range in the URL. Chrome's HTTP
 * cache lets only one request per URL proceed at a time, so tiles that are all
 * ranges of the same URL load one after another (and are hardly cached).
 */
function rangeUrlSource(url: string): Source {
  let mustReload = false;
  return {
    getKey: () => url,
    async getBytes(offset, length, signal, etag): Promise<RangeResponse> {
      const range = `${offset}-${offset + length - 1}`;
      const res = await fetch(`${url}?range=${range}`, {
        signal,
        cache: mustReload ? "reload" : undefined,
        headers: { range: `bytes=${range}` }
      });
      if (res.status !== 206) {
        // e.g. 200: server ignored the range and is sending the whole archive
        await res.body?.cancel();
        throw new Error(`Bad response code: ${res.status}`);
      }
      const newEtag = res.headers.get("ETag");
      if (etag && newEtag && !newEtag.startsWith("W/") && newEtag !== etag) {
        mustReload = true;
        throw new EtagMismatch(`ETag ${newEtag} does not match ${etag}`);
      }
      return {
        data: await res.arrayBuffer(),
        etag: newEtag ?? undefined,
        cacheControl: res.headers.get("Cache-Control") ?? undefined,
        expires: res.headers.get("Expires") ?? undefined
      };
    }
  };
}

export const MAPLIBRE_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "/fonts/{fontstack}/{range}.pbf",
  sources: {
    basemap: {
      type: "raster",
      url: pmtilesUrl("/albina-basemap.pmtiles"),
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
