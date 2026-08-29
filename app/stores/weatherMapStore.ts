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
  domains: [
    "snow-height",
    "new-snow",
    "diff-snow",
    "relative-snow",
    "snow-line",
    "temp",
    "wind",
    "gust",
    "wind700hpa"
  ] as const
};

export type DomainId = (typeof config.domains)[number];
export type OverlayType =
  | "snowHeight"
  | "snowLine"
  | "temperature"
  | "windSpeed"
  | "windDirection";
export type TimeSpan = number;

/** The runtime, per-domain config consumers read via `domainConfig`. */
export interface DomainConfig {
  timeSpans: TimeSpan[];
  timeSpanToDataId: Record<string, string>;
  /** How often this domain/timeSpan is published, in hours. */
  timeStepHours: number;
  units: string;
  thresholds: RemoteThreshold[];
  stations: boolean;
  imageOverlay: { file: string };
  dataOverlays: { file: string; type: OverlayType; domain?: DomainId }[];
  direction: "DW" | false;
}

/**
 * The live config.json only exposes the wind-speed overlay; the direction
 * overlay has no remote equivalent, so its filename is hardcoded here for
 * the domains that have one. `gust` borrows `wind`'s direction overlay
 * (its own domain has no such file).
 */
const WIND_DIRECTION_OVERLAY_BY_DOMAIN: Partial<
  Record<DomainId, { file: string; domain?: DomainId }>
> = {
  wind: { file: "{date}_{time}-00_wind-dir_V3.png" },
  gust: { file: "{date}_{time}-00_wind-dir_V3.png", domain: "wind" },
  wind700hpa: { file: "{date}_{time}-00_wind-dir700hpa.png" }
};

/**
 * `[domainId, timeSpan, dataId]` triples for the live config.json
 * `parameter`/dataId each domain/timeSpan combination corresponds to.
 * Combinations not listed here have no dedicated dataId (e.g. new-snow,
 * relative-snow, snow-line).
 */
const DATA_ID_BY_DOMAIN_TIME_SPAN: [DomainId, TimeSpan, string][] = [
  ["snow-height", 1, "HS"],
  ["diff-snow", 24, "HSD_24"],
  ["diff-snow", 48, "HSD_48"],
  ["diff-snow", 72, "HSD_72"],
  ["temp", 1, "TA"],
  ["wind", 1, "VW"],
  ["gust", 1, "VW_MAX"],
  ["wind700hpa", 1, "wind700hpa"]
];

/** A single `{ range: [from, to], color }` entry from the live config.json. */
export interface RemoteThreshold {
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

/**
 * Most domains' `imageOverlayURL`/`dataOverlayURL` are absolute
 * wiski.tirol.gv.at URLs that send no CORS headers, so only the filename is
 * used, templated against the CORS-safe proxied base URL instead (see
 * `getOverlayURLs`).
 */
function filenameFromRemoteUrl(url: string): string {
  return url.slice(url.lastIndexOf("/") + 1);
}

/** The `timeRanges[]` entry matching `timeSpan`, else the first entry. */
function findTimeRangeEntry(
  timeSpan: TimeSpan | null,
  remoteDomainConfig: RemoteDomainConfig
): RemoteTimeRange | undefined {
  return (
    remoteDomainConfig.timeRanges.find(tr => tr.timeRange === timeSpan) ??
    remoteDomainConfig.timeRanges[0]
  );
}

/** This domain's slice of `DATA_ID_BY_DOMAIN_TIME_SPAN`, keyed by timeSpan. */
function timeSpanToDataIdFor(domainId: DomainId): Record<string, string> {
  return Object.fromEntries(
    DATA_ID_BY_DOMAIN_TIME_SPAN.filter(([id]) => id === domainId).map(
      ([, timeSpan, dataId]) => [timeSpan, dataId]
    )
  );
}

/**
 * Build the runtime `DomainConfig` for `domainId`/`timeSpan` from structural
 * metadata plus the live remote config. Returns `null` while
 * `remoteDomainConfig` hasn't resolved yet (or belongs to a domain other
 * than `domainId`, e.g. mid domain-switch) — callers already null-check
 * `domainConfig`.
 */
function buildDomainConfig(
  domainId: DomainId | null,
  timeSpan: TimeSpan | null,
  remoteDomainConfig: RemoteDomainConfig | null
): DomainConfig | null {
  if (
    !domainId ||
    !remoteDomainConfig ||
    remoteDomainConfig.parameter !== domainId
  )
    return null;

  const timeSpans = remoteDomainConfig.timeRanges.map(tr => tr.timeRange);
  const timeSpanToDataId = timeSpanToDataIdFor(domainId);
  const remoteTimeRange = findTimeRangeEntry(timeSpan, remoteDomainConfig);
  if (!remoteTimeRange) return null;

  // relative-snow's own server sends CORS headers, so its URL is used
  // directly — every other domain's is wiski.tirol.gv.at (no CORS headers),
  // reduced to a filename templated against the proxied base URL instead.
  const overlayFile =
    domainId === "relative-snow" ? (url: string) => url : filenameFromRemoteUrl;

  const dataOverlays: DomainConfig["dataOverlays"] = [
    {
      file: overlayFile(remoteTimeRange.dataOverlayURL),
      type: OVERLAY_TYPE_BY_DOMAIN[domainId]
    }
  ];
  const windDirectionOverlay = WIND_DIRECTION_OVERLAY_BY_DOMAIN[domainId];
  if (windDirectionOverlay) {
    dataOverlays.push({ ...windDirectionOverlay, type: "windDirection" });
  }

  return {
    timeSpans,
    timeSpanToDataId,
    timeStepHours: remoteTimeRange.timeStepHours,
    units: remoteDomainConfig.units,
    thresholds: remoteDomainConfig.thresholds,
    stations: Object.keys(timeSpanToDataId).length > 0,
    imageOverlay: { file: overlayFile(remoteTimeRange.imageOverlayURL) },
    dataOverlays,
    // Station wind arrows are drawn exactly for the domains that have a
    // wind-direction overlay.
    direction: windDirectionOverlay ? "DW" : false
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
export const absTimeSpan = computed([timeSpan], timeSpan => timeSpan ?? NaN);
export const timeSpanInt = computed([timeSpan], timeSpan => timeSpan ?? NaN);
/*
 * returns current time of interest
 */
export const currentTime = atom<Temporal.Instant | null>(null);
export const selectedFeature = atom(null);

/*
 * the last config.json fetched for the current domain
 */
export const remoteDomainConfig = atom<RemoteDomainConfig | null>(null);
/*
 * the `timeRanges[]` entry resolved for the active domain/timespan —
 * `endTime` below just reads fields off this, rather than being tracked as
 * its own atom.
 */
export const remoteTimeRange = atom<RemoteTimeRange | null>(null);

/*
 * returns the start date for history information
 */
export const startDate = computed([remoteDomainConfig], remoteDomainConfig =>
  remoteDomainConfig
    ? Temporal.Instant.from(remoteDomainConfig.startDate)
    : null
);
/*
  returns lastUpdateTime
*/
export const lastDataUpdate = computed(
  [remoteDomainConfig],
  remoteDomainConfig =>
    remoteDomainConfig
      ? Temporal.Instant.from(remoteDomainConfig.startDateModifyTimestamp)
      : null
);

/*
 * returns domain config for the active domain/timespan
 */
export const domainConfig = computed(
  [domainId, timeSpan, remoteDomainConfig],
  (domainId, timeSpan, remoteDomainConfig) =>
    buildDomainConfig(domainId, timeSpan, remoteDomainConfig)
);
/*
 * returns how often the active domain/timeSpan is published, in hours —
 * the spacing of the selectable times on the timeline. NaN until the
 * domain's config.json has resolved.
 */
export const timeStepHours = computed(
  [domainConfig],
  domainConfig => domainConfig?.timeStepHours ?? NaN
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

  if (!domainConfig.get()?.stations) return;
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
  let currentRemoteDomainConfig = remoteDomainConfig.get();
  if (domainChanged) {
    try {
      currentRemoteDomainConfig = await fetchRemoteDomainConfig(newDomain);
    } catch (err) {
      console.error("Weather data API is not available", err);
      return;
    }
    if (gen !== _generation) return;
    remoteDomainConfig.set(currentRemoteDomainConfig);
  }

  // 3. Resolve timespan
  const parsedTimeSpan = newTimeSpan ? parseInt(newTimeSpan, 10) : null;
  const domainConf = buildDomainConfig(
    newDomain,
    parsedTimeSpan,
    currentRemoteDomainConfig
  );
  if (!domainConf) return;
  const resolvedTimeSpan =
    parsedTimeSpan !== null && domainConf.timeSpans.includes(parsedTimeSpan)
      ? parsedTimeSpan
      : domainConf.timeSpans[0];

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
    if (!currentRemoteDomainConfig) return;
    remoteTimeRange.set(
      findTimeRangeEntry(resolvedTimeSpan, currentRemoteDomainConfig) ?? null
    );
  }

  if (gen !== _generation) return;

  // 7. Resolve time — URL timestamp if provided and valid, else the live
  // config's own resolved default for this domain/timespan
  const currentRemoteTimeRange = remoteTimeRange.get();
  if (!currentRemoteTimeRange) return;
  let resolvedTime: Temporal.Instant;

  if (timestamp) {
    const parsed = Temporal.Instant.from(timestamp);
    const snapped = snapToSlot(parsed, currentRemoteTimeRange.timeStepHours);
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
    resolvedTime = Temporal.Instant.from(
      currentRemoteTimeRange.initialTimestamp
    );
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

export const endTime = computed([remoteTimeRange], remoteTimeRange =>
  remoteTimeRange
    ? Temporal.Instant.from(remoteTimeRange.maxForecastTimestamp)
    : null
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
  [domainConfig, lastDataUpdate],
  (domainConfig, lastDataUpdate) =>
    domainConfig && lastDataUpdate
      ? lastDataUpdate.add({ hours: domainConfig.timeStepHours })
      : null
);

/*
 * control method to check if the domain does exist in the config
 */
function checkDomainId(domainId: DomainId) {
  return Boolean(domainId && config.domains.includes(domainId));
}
