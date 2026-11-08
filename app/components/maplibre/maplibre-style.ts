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
import type { AlbinaIntl } from "../../i18n";

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

/** Localized help texts for `cooperativeGestures`, for MapLibre's `locale` option. */
export function cooperativeGesturesLocale(
  intl: AlbinaIntl
): Record<string, string> {
  return {
    "CooperativeGesturesHandler.WindowsHelpText": intl.formatMessage({
      id: "bulletin:map:gesture:windows"
    }),
    "CooperativeGesturesHandler.MacHelpText": intl.formatMessage({
      id: "bulletin:map:gesture:mac"
    }),
    "CooperativeGesturesHandler.MobileHelpText": intl.formatMessage({
      id: "bulletin:map:gesture:mobile"
    })
  };
}

export const MAPLIBRE_MIN_ZOOM = 5;

const OPENTOPOMAP_TILES = "https://tile.opentopomap.org/{z}/{x}/{y}.png";

// basemap://{z}/{x}/{y} serves tiles from the basemap archive. Where the
// archive has no tile (outside its coverage, e.g. Latin America), it serves
// the OpenTopoMap tile instead, so OpenTopoMap is only requested where needed.
const basemapArchive = new PMTiles(rangeUrlSource("/albina-basemap.pmtiles"));
addProtocol("basemap", async ({ url }, { signal }) => {
  const [, z, x, y] = /^basemap:\/\/(\d+)\/(\d+)\/(\d+)$/.exec(url) ?? [];
  if (!z || !x || !y) throw new Error(`Invalid basemap URL: ${url}`);
  const tile = await basemapArchive.getZxy(+z, +x, +y, signal);
  if (tile) {
    const { data, cacheControl, expires } = tile;
    return { data, cacheControl, expires };
  }
  const res = await fetch(
    OPENTOPOMAP_TILES.replace("{z}", z).replace("{x}", x).replace("{y}", y),
    { signal }
  );
  if (!res.ok) throw new Error(`Bad response code: ${res.status}`);
  return { data: await res.arrayBuffer() };
});

export const MAPLIBRE_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "/fonts/{fontstack}/{range}.pbf",
  sources: {
    basemap: {
      type: "raster",
      tiles: ["basemap://{z}/{x}/{y}"],
      tileSize: 256,
      minzoom: MAPLIBRE_MIN_ZOOM,
      maxzoom: 10,
      attribution:
        "© <a href='https://sonny.4lima.de/'>Sonny</a>, CC BY 4.0 | © <a href='https://www.eea.europa.eu/en/datahub/datahubitem-view/d08852bc-7b5f-4835-a776-08362e2fbf4b'>EU-DEM</a>, CC BY 4.0 | © avalanche.report, CC BY 4.0"
    },
    opentopomap: {
      type: "raster",
      tiles: [OPENTOPOMAP_TILES],
      tileSize: 256,
      minzoom: MAPLIBRE_MIN_ZOOM,
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
