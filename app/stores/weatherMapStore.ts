import { atom, computed } from "nanostores";
import { LngLatBounds, MercatorCoordinate, type LngLatLike } from "maplibre-gl";
import {
  _loadStationData as loadStationData,
  type StationData
} from "./stationDataStore";
import { snapToSlot } from "./weatherMapSlots";

/**
 * Every domain is driven by the live `config.json` published per domain at
 * `.../zamg_meteo/overlays/{domain}/config.json` (see `RemoteDomainConfig`
 * below) — this object now only carries the structural, non-meteorological
 * metadata that endpoint doesn't provide.
 */
export const config = {
  settings: {
    timeRange: ["-17520", "+72"],
    // [sw, ne] as [lng, lat].
    bbox: new LngLatBounds([9.4, 45.6167], [13.0333, 47.8167])
  },
  domains: {
    // `sign`/`defaultTimeSpan` default to `"+-"`/`null` (see `findTimeRangeEntry`
    // / `buildDomainConfig`) — so only the domains below that deviate need to
    // state them.
    "snow-height": {
      item: {
        sign: "-",
        timeSpanToDataId: { "-1": "HS" },
        layer: { overlay: true, stations: true }
      }
    },
    "new-snow": {
      item: {
        sign: "+",
        defaultTimeSpan: "+12",
        timeSpanToDataId: {},
        layer: { overlay: true, stations: false }
      }
    },
    "diff-snow": {
      item: {
        sign: "-",
        timeSpanToDataId: {
          "-24": "HSD_24",
          "-48": "HSD_48",
          "-72": "HSD_72"
        },
        layer: { overlay: true, stations: true }
      }
    },
    "relative-snow": {
      item: {
        timeSpanToDataId: {},
        layer: { overlay: true, stations: false }
      }
    },
    "snow-line": {
      item: {
        timeSpanToDataId: {},
        layer: { overlay: true, stations: false }
      }
    },
    temp: {
      item: {
        timeSpanToDataId: { "+-1": "TA" },
        layer: { overlay: true, stations: true }
      }
    },
    wind: {
      item: {
        timeSpanToDataId: { "+-1": "VW" },
        layer: { overlay: true, stations: true },
        // The live config.json only exposes the wind-speed overlay; the
        // direction overlay has no remote equivalent, so its filename stays
        // hardcoded here.
        secondaryOverlay: {
          file: "{date}_{time}-00_wind-dir_V3.png",
          type: "windDirection"
        }
      }
    },
    gust: {
      item: {
        timeSpanToDataId: { "+-1": "VW_MAX" },
        layer: { overlay: true, stations: true },
        // Gust borrows the wind domain's direction overlay, same as today.
        secondaryOverlay: {
          file: "{date}_{time}-00_wind-dir_V3.png",
          type: "windDirection",
          domain: "wind"
        }
      }
    },
    wind700hpa: {
      item: {
        timeSpanToDataId: { "+-1": "wind700hpa" },
        layer: { overlay: true, stations: true },
        secondaryOverlay: {
          file: "{date}_{time}-00_wind-dir700hpa.png",
          type: "windDirection"
        }
      }
    }
  }
};

type RGB = [number, number, number];

export type DomainId = keyof typeof config.domains;
export type OverlayType =
  | "snowHeight"
  | "snowLine"
  | "temperature"
  | "windSpeed"
  | "windDirection";
export type TimeSpan = string;

/** The runtime, per-domain config consumers read via `domainConfig`. */
export interface DomainConfig {
  timeSpans: string[];
  defaultTimeSpan: string | null;
  timeSpanToDataId: Record<string, string>;
  updateTimesOffset: Record<string, number>;
  units: string;
  thresholds: number[];
  colors: Record<number, RGB>;
  layer: { overlay: boolean; stations: boolean };
  imageOverlay: { file: string };
  dataOverlays: { file: string; type: OverlayType; domain?: DomainId }[];
  direction: "DW" | false;
}

/** Structural, non-meteorological metadata for a remote-driven domain. */
interface DomainMeta {
  sign?: "+" | "-" | "+-";
  defaultTimeSpan?: string | null;
  timeSpanToDataId: Record<string, string>;
  layer: { overlay: boolean; stations: boolean };
  secondaryOverlay?: { file: string; type: OverlayType; domain?: DomainId };
}

/** A single `{ range: [from, to], color }` entry from the live config.json. */
interface RemoteThreshold {
  range: [number | null, number | null];
  color: string;
}

/** A single per-timespan entry from the live config.json's `timeRanges`. */
interface RemoteTimeRange {
  timeRange: number;
  timeStepHours: number;
  imageOverlayURL: string;
  dataOverlayURL: string;
  initialValidity: [string, string];
  initialTimestamp: string;
  maxForecastTimestamp: string;
  maxAnalysisTimestamp: string;
}

/** The shape of `.../zamg_meteo/overlays/{domain}/config.json`. */
interface RemoteDomainConfig {
  parameter: string;
  units: string;
  thresholds: RemoteThreshold[];
  timeRanges: RemoteTimeRange[];
  startDate: string;
  startDateModifyTimestamp: string;
}

/** Parse a "#rrggbb" hex color into an [r, g, b] triple. */
function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Convert the live `thresholds` (`{range,color}` pairs, ordered low→high)
 * into the numeric-cutpoints + RGB-record shape the map/marker rendering
 * code expects. Exact conversion: `thresholds[i] = ranges[i].range[1]` for
 * every entry but the last (open-ended) one.
 */
function buildThresholdsAndColors(remoteThresholds: RemoteThreshold[]): {
  thresholds: number[];
  colors: Record<number, RGB>;
} {
  const colors = Object.fromEntries(
    remoteThresholds.map((t, i) => [i + 1, hexToRgb(t.color)])
  ) as Record<number, RGB>;
  const thresholds = remoteThresholds
    .slice(0, -1)
    .map(t => t.range[1] as number);
  return { thresholds, colors };
}

/**
 * Most domains' `imageOverlayURL`/`dataOverlayURL` are absolute
 * wiski.tirol.gv.at URLs that send no CORS headers, so only the filename is
 * used, templated against the CORS-safe proxied base URL instead (see
 * `getOverlayURLs`).
 */
function filenameFromRemoteUrl(url: string): string {
  return url.slice(url.lastIndexOf("/") + 1);
}

function buildUpdateTimesOffset(
  timeRanges: RemoteTimeRange[],
  sign: string
): Record<string, number> {
  return Object.fromEntries(
    timeRanges.map(tr => [sign + tr.timeRange, tr.timeStepHours])
  );
}

/** The `timeRanges[]` entry matching `timeSpan`, else the first entry. */
function findTimeRangeEntry(
  domainId: DomainId,
  timeSpan: TimeSpan | null,
  remote: RemoteDomainConfig
): RemoteTimeRange | undefined {
  const item = config.domains[domainId].item as unknown as DomainMeta;
  const sign = item.sign ?? "+-";
  return (
    remote.timeRanges.find(tr => sign + tr.timeRange === timeSpan) ??
    remote.timeRanges[0]
  );
}

/**
 * Build the runtime `DomainConfig` for `domainId`/`timeSpan` from structural
 * metadata plus the live remote config. Returns `null` while `remote` hasn't
 * resolved yet (or belongs to a domain other than `domainId`, e.g. mid
 * domain-switch) — callers already null-check `domainConfig`.
 */
function buildDomainConfig(
  domainId: DomainId | null,
  timeSpan: TimeSpan | null,
  remote: RemoteDomainConfig | null
): DomainConfig | null {
  if (!domainId || !remote || remote.parameter !== domainId) return null;

  const item = config.domains[domainId].item as unknown as DomainMeta;
  const meta = { sign: "+-" as const, defaultTimeSpan: null, ...item };
  const timeSpans = remote.timeRanges.map(tr => meta.sign + tr.timeRange);
  const entry = findTimeRangeEntry(domainId, timeSpan, remote);
  if (!entry) return null;

  const { thresholds, colors } = buildThresholdsAndColors(remote.thresholds);

  // relative-snow's own server sends CORS headers, so its URL is used
  // directly — every other domain's is wiski.tirol.gv.at (no CORS headers),
  // reduced to a filename templated against the proxied base URL instead.
  const overlayFile =
    domainId === "relative-snow" ? (url: string) => url : filenameFromRemoteUrl;

  const dataOverlays: DomainConfig["dataOverlays"] = [
    {
      file: overlayFile(entry.dataOverlayURL),
      type: OVERLAY_TYPE_BY_DOMAIN[domainId]
    }
  ];
  if (meta.secondaryOverlay) dataOverlays.push(meta.secondaryOverlay);

  return {
    timeSpans,
    defaultTimeSpan: meta.defaultTimeSpan,
    timeSpanToDataId: meta.timeSpanToDataId,
    updateTimesOffset: buildUpdateTimesOffset(remote.timeRanges, meta.sign),
    units: remote.units,
    thresholds,
    colors,
    layer: meta.layer,
    imageOverlay: { file: overlayFile(entry.imageOverlayURL) },
    dataOverlays,
    direction: Object.values(meta.timeSpanToDataId).some(id =>
      ["VW", "VW_MAX", "wind700hpa"].includes(id)
    )
      ? "DW"
      : false
  };
}

const OVERLAY_TYPE_BY_DOMAIN: Record<DomainId, OverlayType> = {
  "snow-height": "snowHeight",
  "new-snow": "snowHeight",
  "diff-snow": "snowHeight",
  "relative-snow": "snowHeight",
  "snow-line": "snowLine",
  temp: "temperature",
  wind: "windSpeed",
  gust: "windSpeed",
  wind700hpa: "windSpeed"
};

export const stations = atom<StationData[]>([]);
/*
 * returns the active domain id
 */
export const domainId = atom<DomainId | null>(null);
/*
 * returns current timespan selection
 */
export const timeSpan = atom<TimeSpan | null>(null);
export const absTimeSpan = computed([timeSpan], timeSpan =>
  Math.abs(parseInt(String(timeSpan).replace("+-", ""), 10))
);
export const timeSpanInt = computed([timeSpan], timeSpan =>
  parseInt(String(timeSpan).replace(/\D/g, ""), 10)
);
/*
 * returns current time of interest
 */
export const currentTime = atom<Temporal.Instant | null>(null);
export const selectedFeature = atom(null);

/*
 * the last config.json fetched for the current domain
 */
export const remoteConfig = atom<RemoteDomainConfig | null>(null);
/*
 * the `timeRanges[]` entry resolved for the active domain/timespan —
 * `endTime` below just reads fields off this, rather than being tracked as
 * its own atom.
 */
export const remoteTimeRange = atom<RemoteTimeRange | null>(null);

/*
 * returns the start date for history information
 */
export const startDate = computed([remoteConfig], remote =>
  remote ? Temporal.Instant.from(remote.startDate) : null
);
/*
  returns lastUpdateTime
*/
export const lastDataUpdate = computed([remoteConfig], remote =>
  remote ? Temporal.Instant.from(remote.startDateModifyTimestamp) : null
);

/*
 * returns domain config for the active domain/timespan
 */
export const domainConfig = computed(
  [domainId, timeSpan, remoteConfig],
  (domainId, timeSpan, remoteConfig) =>
    buildDomainConfig(domainId, timeSpan, remoteConfig)
);
/**
 * A loaded data overlay image, sampled by `valueForPixel` at a coordinate.
 * Loads the image once, on construction. Data PNGs encode values in their
 * pixels, so they're drawn 1:1 with smoothing off: reads must return exact
 * source pixels. Any scaling or interpolation blends neighbouring pixels and
 * corrupts the encoding.
 */
export class DataOverlay {
  readonly type: OverlayType;
  private readonly ctx: Promise<CanvasRenderingContext2D>;

  constructor(
    o: { file: string; type: OverlayType; domain?: DomainId },
    domainId: DomainId | null,
    currentTime: Temporal.Instant | null,
    absTimeSpan: number
  ) {
    this.type = o.type;
    const [, url] = getOverlayURLs(
      currentTime,
      (o.domain || domainId) as DomainId,
      o.file,
      absTimeSpan
    );
    this.ctx = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0);
        resolve(ctx);
      };
      img.onerror = e => {
        reject(new Error(`Failed to fetch ${img.src}: ${JSON.stringify(e)}`));
      };
      img.src = url;
    });
  }

  async valueForPixel(lngLat: LngLatLike): Promise<number | null> {
    const resolvedCtx = await this.ctx;
    const w = resolvedCtx.canvas.width;
    const h = resolvedCtx.canvas.height;
    // Normalized position within the bbox, in Web Mercator (linear in lng,
    // non-linear in lat) — matching how the overlay images are projected.
    const bbox = config.settings.bbox;
    const sw = MercatorCoordinate.fromLngLat(bbox.getSouthWest());
    const ne = MercatorCoordinate.fromLngLat(bbox.getNorthEast());
    const p0 = MercatorCoordinate.fromLngLat(lngLat);
    const fx = (p0.x - sw.x) / (ne.x - sw.x);
    const fy = (p0.y - ne.y) / (sw.y - ne.y);
    const pixelX = Math.round(Math.max(0, Math.min(1, fx)) * (w - 1));
    const pixelY = Math.round(Math.max(0, Math.min(1, fy)) * (h - 1));
    const p = resolvedCtx.getImageData(pixelX, pixelY, 1, 1);
    return DataOverlay.valueForPixel(this.type, {
      r: p.data[0],
      g: p.data[1],
      b: p.data[2]
    });
  }

  /** Returns the value for a pixel color. */
  static valueForPixel(
    overlayType: OverlayType,
    pixelRGB: { r: number; g: number; b: number }
  ): number | null {
    switch (overlayType) {
      case "temperature":
        if (pixelRGB.r <= 0) return null;
        if (pixelRGB.r >= 255) return null;
        return Math.round(-59.5 + (pixelRGB.r - 1) * 0.5);
      case "windDirection":
        if (pixelRGB.r < 0 || pixelRGB.r > 180) return null;
        return pixelRGB.r * 2;
      case "windSpeed":
        if (pixelRGB.r < 0 || pixelRGB.r >= 255) return null;
        return pixelRGB.r;
      case "snowLine":
        if (pixelRGB.r < 0 || pixelRGB.r >= 100) return null;
        return pixelRGB.r * 50;
      case "snowHeight":
        if (pixelRGB.r + pixelRGB.g + pixelRGB.b === 0) return 0;
        if (pixelRGB.r + pixelRGB.g + pixelRGB.b === 255 * 3) return null;
        if (pixelRGB.g + pixelRGB.b === 0) return -251 + pixelRGB.r;
        if (pixelRGB.r + pixelRGB.g === 0) return 249 + pixelRGB.b;
        if (pixelRGB.r + pixelRGB.b === 0) return 2019 + pixelRGB.g;
        // r=0, g>0, b>0: encodes gap range 505–2019 cm
        // formula: 504 + (g - 1) * 255 + b
        if (pixelRGB.r === 0) return 504 + (pixelRGB.g - 1) * 255 + pixelRGB.b;
        if (pixelRGB.r !== 0 && pixelRGB.g !== 0 && pixelRGB.b !== 0)
          return pixelRGB.r;
    }
    return null;
  }
}

export const dataOverlays = atom<DataOverlay[]>([]);

function overlayBaseURLs(): [string, string] | null {
  const urls = window.config.apis.weatherOverlay as
    | [string, string]
    | undefined;
  return urls ?? null;
}

/**
 * `relative-snow`'s live config.json doesn't exist on the backend yet (404).
 * Until it ships, synthesize a `RemoteDomainConfig` in the same shape from
 * the thresholds/colors/overlay filename pattern the domain used before its
 * migration to the live endpoint, so the domain stays functional meanwhile.
 */
function buildRelativeSnowFallbackConfig(): RemoteDomainConfig {
  const now = Temporal.Now.zonedDateTimeISO("UTC")
    .round({ smallestUnit: "hours", roundingMode: "trunc" })
    .toInstant()
    .toString();
  return {
    parameter: "relative-snow",
    units: "%",
    thresholds: [
      { range: [null, -1], color: "#08306b" },
      { range: [-1, 30], color: "#ffa0a0" },
      { range: [30, 60], color: "#ffd2d2" },
      { range: [60, 90], color: "#ffe6ce" },
      { range: [90, 110], color: "#b0ffbc" },
      { range: [110, 140], color: "#9ecae1" },
      { range: [140, 170], color: "#6baed6" },
      { range: [170, 200], color: "#4292c6" },
      { range: [200, 230], color: "#2171b5" },
      { range: [230, 260], color: "#08519c" },
      { range: [260, null], color: "#08306b" }
    ],
    timeRanges: [
      {
        timeRange: 24,
        timeStepHours: 24,
        imageOverlayURL:
          "https://models.avalanche.report/relativesnowheight/{date}/{date}_00-00_REL.gif",
        dataOverlayURL:
          "https://models.avalanche.report/relativesnowheight/{date}/{date}_00-00_REL.png",
        initialValidity: [now, now],
        initialTimestamp: now,
        maxForecastTimestamp: now,
        maxAnalysisTimestamp: now
      }
    ],
    startDate: now,
    startDateModifyTimestamp: now
  };
}

/**
 * Fetch the live per-domain config.json through the same proxied base URL
 * used for overlay images (CORS-safe, same-origin) — never directly from
 * wiski.tirol.gv.at, which sends no CORS headers. Falls back to
 * `buildRelativeSnowFallbackConfig` for `relative-snow` until its endpoint
 * ships.
 */
async function fetchRemoteDomainConfig(
  domain: DomainId
): Promise<RemoteDomainConfig> {
  const baseUrl = overlayBaseURLs()?.[0];
  if (!baseUrl) {
    throw new Error(`No overlay base URL configured for ${domain}`);
  }
  const url = window.config.template(baseUrl + "config.json", { domain });
  const response = await fetch(url);
  if (!response.ok) {
    if (domain === "relative-snow") return buildRelativeSnowFallbackConfig();
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

/*
 * get data for currentTime
 */
let _loadIndexGeneration = 0;
async function _loadIndexData() {
  const generation = ++_loadIndexGeneration;
  stations.set([]);

  if (!domainConfig.get()?.layer.stations) return;
  const currentTime0 = currentTime.get();
  if (
    !currentTime0 ||
    Temporal.Instant.compare(currentTime0, startDate.get()) > 0
  )
    return;

  try {
    await loadStationData({
      consumer: s => {
        if (generation !== _loadIndexGeneration) return;
        stations.set([...stations.get(), ...s]);
      },
      dateTime: currentTime0?.toZonedDateTimeISO("UTC")
    });
  } catch (err) {
    // TODO fail with error dialog
    console.error("Data for timeindex not available", err);
  }
}

/*
 * Single entry point for all weather map state changes.
 * Called from weather.tsx when URL params change.
 * - Fetches the domain's live config.json when the domain changes
 * - Skips the fetch (and metadata resolution) if domain+timeSpan unchanged
 * - Resolves time from URL timestamp or calculates default
 * - Generation counter cancels stale responses
 */
let _generation = 0;
export async function initDomain(
  newDomain: DomainId,
  newTimeSpan?: string,
  timestamp?: string
) {
  const gen = ++_generation;

  // 1. Validate and resolve domain
  newDomain ||= "new-snow";
  if (!checkDomainId(newDomain)) return;

  // 2. Fetch the domain's live config when the domain changed
  const domainChanged = newDomain !== domainId.get();
  let remote = remoteConfig.get();
  if (domainChanged) {
    try {
      remote = await fetchRemoteDomainConfig(newDomain);
    } catch (err) {
      console.error("Weather data API is not available", err);
      return;
    }
    if (gen !== _generation) return;
    remoteConfig.set(remote);
  }

  // 3. Resolve timespan
  const domainConf = buildDomainConfig(newDomain, newTimeSpan ?? null, remote);
  if (!domainConf) return;
  const resolvedTimeSpan =
    newTimeSpan && domainConf.timeSpans.includes(newTimeSpan)
      ? newTimeSpan
      : domainConf.defaultTimeSpan || domainConf.timeSpans[0];

  // 4. Detect what changed
  const timeSpanChanged = resolvedTimeSpan !== timeSpan.get();
  const needsMetadata = domainChanged || timeSpanChanged;

  // 5. Set domain and timespan atoms
  if (domainChanged) {
    domainId.set(newDomain);
    selectedFeature.set(null);
  }
  if (timeSpanChanged) {
    timeSpan.set(resolvedTimeSpan);
  }

  // 6. Resolve the active timeRanges[] entry (drives endTime) only when
  // domain or timeSpan actually changed
  if (needsMetadata) {
    if (!remote) return;
    remoteTimeRange.set(
      findTimeRangeEntry(newDomain, resolvedTimeSpan, remote) ?? null
    );
  }

  if (gen !== _generation) return;

  // 7. Resolve time — URL timestamp if provided and valid, else the live
  // config's own resolved default for this domain/timespan
  const entry = remoteTimeRange.get();
  if (!entry) return;
  let resolvedTime: Temporal.Instant;

  if (timestamp) {
    const parsed = Temporal.Instant.from(timestamp);
    const snapped = snapToSlot(parsed, absTimeSpan.get());
    const st = startTime.get();
    const et = endTime.get();
    if (st && et) {
      resolvedTime =
        Temporal.Instant.compare(snapped, st) < 0
          ? st
          : Temporal.Instant.compare(snapped, et) > 0
            ? et
            : snapped;
    } else {
      resolvedTime = snapped;
    }
  } else {
    resolvedTime = Temporal.Instant.from(entry.initialTimestamp);
  }

  const timeChanged =
    Temporal.Instant.compare(
      resolvedTime,
      currentTime.get() || Temporal.Instant.fromEpochMilliseconds(0)
    ) !== 0;
  if (timeChanged) {
    currentTime.set(resolvedTime);
  }

  // 8. Load overlay images and station data only if something actually changed
  if (needsMetadata || timeChanged) {
    // Load data overlay images for pixel-value reading. Separated from a
    // computed to avoid side effects (Image creation) in pure derivations.
    const dc = domainConfig.get();
    const di = domainId.get();
    const ct = currentTime.get();
    const ats = absTimeSpan.get();
    dataOverlays.set(
      (dc?.dataOverlays ?? []).map(o => new DataOverlay(o, di, ct, ats))
    );

    if (gen === _generation) {
      await _loadIndexData();
    }
  }
}

export const startTime = computed(
  [startDate],
  (startDate): Temporal.Instant | null => {
    if (!startDate) return null;
    return startDate.add({ hours: +config.settings.timeRange[0] });
  }
);

export const endTime = computed([remoteTimeRange], entry =>
  entry ? Temporal.Instant.from(entry.maxForecastTimestamp) : null
);

export const initialDate = computed([remoteTimeRange], entry =>
  entry ? Temporal.Instant.from(entry.initialTimestamp) : null
);

export const overlayURLs = computed(
  [currentTime, domainConfig, domainId, absTimeSpan],
  (currentTime, domainConfig, domainId, absTimeSpan) => {
    if (!domainConfig) return ["", ""] as [string, string];
    return getOverlayURLs(
      currentTime,
      domainId,
      domainConfig.imageOverlay.file,
      absTimeSpan
    );
  }
);

function getOverlayURLs(
  currentTime: Temporal.Instant | null,
  domain: DomainId,
  file: string | undefined,
  timespan: number
): [string, string] {
  if (!currentTime || !file) return ["", ""];
  // Translate the live `imageOverlayURL`/`dataOverlayURL`'s `$year`/`$date`/
  // `$hour` tokens to the `{year}`/`{date}`/`{time}` template syntax
  // `window.config.template` fills in below.
  const translatedFile = file
    .replace(/\$year/g, "{year}")
    .replace(/\$date/g, "{date}")
    .replace(/\$hour/g, "{time}");
  const data = {
    year: currentTime.toString().slice(0, "2025".length),
    date: currentTime.toString().slice(0, "2025-03-14".length),
    time: currentTime
      .toZonedDateTimeISO("UTC")
      .hour.toString()
      .padStart(2, "0"),
    domain,
    timespan
  };
  // A bare filename (from filenameFromRemoteUrl) needs the proxied base URL
  // prefixed; a full URL (relative-snow only) is already fetchable as-is.
  if (/^https?:\/\//.test(translatedFile)) {
    const url = window.config.template(translatedFile, data);
    return [url, url];
  }
  const baseUrls = overlayBaseURLs();
  if (!baseUrls) return ["", ""];
  return [
    window.config.template(baseUrls[0] + translatedFile, data),
    window.config.template(baseUrls[1] + translatedFile, data)
  ];
}

/*
 * returns nextUpdateTime
 */
export const nextUpdateTime = computed(
  [domainConfig, lastDataUpdate, timeSpan],
  (domainConfig, lastDataUpdate, timeSpan) => {
    if (!domainConfig?.updateTimesOffset || !lastDataUpdate) return null;
    const timesConfig = domainConfig.updateTimesOffset;

    const addHours = (timeSpan && timesConfig[timeSpan]) || timesConfig["*"];
    if (addHours) {
      return lastDataUpdate.add({ hours: addHours });
    }

    return lastDataUpdate;
  }
);

/*
 * control method to check if the domain does exist in the config
 */
function checkDomainId(domainId: DomainId) {
  return Boolean(domainId && config?.domains[domainId]?.item);
}
