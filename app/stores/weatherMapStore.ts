import { atom, computed } from "nanostores";
import { loadStationData, type StationData } from "./stationDataStore";
import { getDefaultTime, snapToSlot, clampToRange } from "./weatherMapSlots";

const SIMULATE_START = null; //"2023-11-28T22:00Z"; // for debugging day light saving, simulates certain time

export const config = {
  overlayURLs: [
    "https://static.avalanche.report/zamg_meteo/overlays/{domain}/",
    "https://static.avalanche.report/zamg_meteo/overlays/{domain}/{year}/{date}/"
  ] satisfies [string, string],
  settings: {
    timeRange: ["-17520", "+72"],
    mapOptionsOverride: {
      maxZoom: 12,
      minZoom: 7
    },
    bbox: [
      [45.6167, 9.4],
      [47.8167, 13.0333]
    ],
    debugModus: false
  },
  domains: {
    "snow-height": {
      item: {
        timeSpans: ["-1"],
        defaultTimeSpan: null,
        timeSpanToDataId: { "-1": "HS" },
        updateTimesOffset: { "-1": 1 },
        units: "cm",
        thresholds: [1, 10, 25, 50, 100, 200, 300, 400],
        colors: {
          1: [255, 255, 254],
          2: [255, 255, 179],
          3: [176, 255, 188],
          4: [140, 255, 255],
          5: [3, 205, 255],
          6: [4, 129, 255],
          7: [3, 91, 190],
          8: [120, 75, 255],
          9: [204, 12, 232]
        },
        layer: {
          overlay: true,
          stations: true,
          grid: false
        },
        metaFiles: {
          agl: "agl.ok",
          startDate: "startDate.ok"
        },
        imageOverlay: { file: "{date}_{time}_{domain}_V2.gif" },
        dataOverlays: [
          { file: "{date}_{time}_{domain}_V2.png", type: "snowHeight" }
        ],
        direction: false,
        clusterOperation: "max"
      }
    },
    "new-snow": {
      item: {
        timeSpans: ["+6", "+12", "+24", "+48", "+72"],
        defaultTimeSpan: "+12",
        timeSpanToDataId: {},
        updateTimesOffset: { "*": 12 },
        units: "cm",
        thresholds: [1, 5, 10, 20, 30, 50, 75, 100],
        colors: {
          1: [255, 255, 254],
          2: [255, 255, 179],
          3: [176, 255, 188],
          4: [140, 255, 255],
          5: [3, 205, 255],
          6: [4, 129, 255],
          7: [3, 91, 190],
          8: [120, 75, 255],
          9: [204, 12, 232]
        },
        layer: {
          overlay: true,
          stations: false,
          grid: false
        },
        metaFiles: {
          agl: "agl.ok",
          startDate: "startDate.ok"
        },
        imageOverlay: { file: "{date}_{time}_{domain}_{timespan}h_V2.gif" },
        dataOverlays: [
          {
            file: "{date}_{time}_{domain}_{timespan}h_V2.png",
            type: "snowHeight"
          }
        ],
        displayedItems: ["snow6f"],
        direction: false,
        clusterOperation: "max"
      }
    },
    "diff-snow": {
      item: {
        timeSpans: ["-6", "-12", "-24", "-48", "-72"],
        defaultTimeSpan: null,
        timeSpanToDataId: {
          "-24": "HSD_24",
          "-48": "HSD_48",
          "-72": "HSD_72"
        },
        updateTimesOffset: { "*": 24, "-6": 6, "-12": 12 },
        metaFiles: {
          startDate: "startDate.ok",
          agl: "agl_{timespan}h.ok"
        },
        units: "cm",
        thresholds: [-20, -10, -5, 1, 5, 10, 20, 30, 50, 75, 100],
        colors: {
          1: [255, 100, 100],
          2: [255, 160, 160],
          3: [255, 210, 210],
          4: [255, 255, 254],
          5: [255, 255, 179],
          6: [176, 255, 188],
          7: [140, 255, 255],
          8: [3, 205, 255],
          9: [4, 129, 255],
          10: [3, 91, 190],
          11: [120, 75, 255],
          12: [204, 12, 232]
        },
        layer: {
          overlay: true,
          stations: true,
          grid: false
        },
        imageOverlay: { file: "{date}_{time}_{domain}_{timespan}h_V2.gif" },
        dataOverlays: [
          {
            file: "{date}_{time}_{domain}_{timespan}h_V2.png",
            type: "snowHeight"
          }
        ],
        direction: false,
        clusterOperation: "max"
      }
    },
    "snow-line": {
      item: {
        timeSpans: ["+-1"],
        defaultTimeSpan: null,
        timeSpanToDataId: {},
        updateTimesOffset: { "*": 1 },
        units: "m",
        thresholds: [
          100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400,
          2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 9876
        ],
        colors: {
          1: [192, 96, 255],
          2: [155, 0, 224],
          3: [128, 0, 255],
          4: [102, 0, 192],
          5: [51, 0, 128],
          6: [0, 0, 192],
          7: [0, 0, 255],
          8: [51, 153, 255],
          9: [128, 204, 255],
          10: [128, 255, 255],
          11: [0, 255, 192],
          12: [0, 255, 128],
          13: [0, 228, 0],
          14: [0, 192, 0],
          15: [0, 155, 0],
          16: [0, 128, 0],
          17: [96, 155, 0],
          18: [155, 155, 0],
          19: [192, 155, 0],
          20: [192, 192, 0],
          21: [192, 224, 0],
          22: [192, 255, 0],
          23: [255, 255, 0],
          24: [255, 192, 0],
          25: [255, 155, 0],
          26: [255, 128, 0],
          27: [255, 0, 0],
          28: [224, 0, 0],
          29: [192, 0, 0],
          30: [176, 0, 0],
          31: [128, 0, 0],
          32: [153, 0, 102],
          33: [192, 0, 102],
          34: [204, 0, 102],
          35: [204, 0, 92],
          36: [204, 0, 92]
        },
        layer: {
          overlay: true,
          stations: false,
          grid: false
        },
        imageOverlay: { file: "{date}_{time}_{domain}_V3.gif" },
        dataOverlays: [
          { file: "{date}_{time}_{domain}_V3.png", type: "snowLine" }
        ],
        direction: false,
        clusterOperation: "max",
        metaFiles: {
          startDate: "startDate.ok",
          agl: "c-laef_agl.ok"
        },
        timeRange: ["-17520", "+60"]
      }
    },
    temp: {
      item: {
        timeSpans: ["+-1"],
        defaultTimeSpan: null,
        timeSpanToDataId: { "+-1": "TA" },
        updateTimesOffset: { "*": 1 },
        units: "\u00b0C",
        thresholds: [-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30],
        colors: {
          1: [159, 128, 255],
          2: [120, 75, 255],
          3: [3, 91, 190],
          4: [4, 129, 255],
          5: [3, 205, 255],
          6: [140, 255, 255],
          7: [176, 255, 188],
          8: [255, 255, 103],
          9: [255, 190, 130],
          10: [255, 154, 53],
          11: [255, 85, 54],
          12: [255, 5, 5],
          13: [250, 55, 150]
        },
        layer: {
          overlay: true,
          stations: true,
          grid: false
        },
        imageOverlay: { file: "{date}_{time}_{domain}_V3.gif" },
        dataOverlays: [
          { file: "{date}_{time}_{domain}_V3.png", type: "temperature" }
        ],
        direction: false,
        clusterOperation: "min",
        metaFiles: {
          startDate: "startDate.ok",
          agl: "c-laef_agl.ok"
        },
        timeRange: ["-17520", "+60"]
      }
    },
    wind: {
      item: {
        timeSpans: ["+-1"],
        defaultTimeSpan: null,
        timeSpanToDataId: { "+-1": "VW" },
        updateTimesOffset: { "*": 1 },
        units: "km/h",
        thresholds: [5, 10, 20, 40, 60, 80],
        colors: {
          1: [255, 255, 100],
          2: [200, 255, 100],
          3: [150, 255, 150],
          4: [50, 200, 255],
          5: [100, 150, 255],
          6: [150, 100, 255],
          7: [255, 50, 50]
        },
        layer: {
          overlay: true,
          stations: true,
          grid: false
        },
        imageOverlay: { file: "{date}_{time}_wind_V3.gif" },
        dataOverlays: [
          { file: "{date}_{time}_wind_V3.png", type: "windSpeed" },
          {
            file: "{date}_{time}_wind-dir_V3.png",
            type: "windDirection"
          }
        ],
        direction: "DW",
        clusterOperation: "max",
        metaFiles: {
          startDate: "startDate.ok",
          agl: "c-laef_agl.ok"
        },
        timeRange: ["-17520", "+60"]
      }
    },
    gust: {
      item: {
        timeSpans: ["+-1"],
        defaultTimeSpan: null,
        timeSpanToDataId: { "+-1": "VW_MAX" },
        updateTimesOffset: { "*": 12 },
        units: "km/h",
        thresholds: [5, 10, 20, 40, 60, 80],
        colors: {
          1: [255, 255, 100],
          2: [200, 255, 100],
          3: [150, 255, 150],
          4: [50, 200, 255],
          5: [100, 150, 255],
          6: [150, 100, 255],
          7: [255, 50, 50]
        },
        layer: {
          overlay: true,
          stations: true,
          grid: false
        },
        imageOverlay: { file: "{date}_{time}_gust_V3.gif" },
        dataOverlays: [
          { file: "{date}_{time}_gust_V3.png", type: "windSpeed" },
          {
            file: "{date}_{time}_wind-dir_V3.png",
            domain: "wind",
            type: "windDirection"
          }
        ],
        direction: "DW",
        clusterOperation: "max",
        metaFiles: {
          startDate: "../wind/startDate.ok",
          agl: "c-laef_agl.ok"
        },
        timeRange: ["-17520", "+60"]
      }
    },
    wind700hpa: {
      item: {
        timeSpans: ["+-1"],
        defaultTimeSpan: null,
        timeSpanToDataId: { "+-1": "wind700hpa" },
        updateTimesOffset: { "*": 12 },
        units: "km/h",
        thresholds: [5, 10, 20, 40, 60, 80],
        colors: {
          1: [255, 255, 100],
          2: [200, 255, 100],
          3: [150, 255, 150],
          4: [50, 200, 255],
          5: [100, 150, 255],
          6: [150, 100, 255],
          7: [255, 50, 50]
        },
        layer: {
          overlay: true,
          stations: true,
          grid: false
        },
        imageOverlay: { file: "{date}_{time}_wind700hpa.gif" },
        dataOverlays: [
          { file: "{date}_{time}_wind700hpa.png", type: "windSpeed" },
          {
            file: "{date}_{time}_wind-dir700hpa.png",
            type: "windDirection"
          }
        ],
        direction: "DW",
        clusterOperation: "max",
        metaFiles: {
          startDate: "startDate.ok",
          agl: "c-laef_agl.ok"
        },
        timeRange: ["-17520", "+60"]
      }
    }
  }
};

export type DomainId = keyof typeof config.domains;
export type Domain = (typeof config.domains)[DomainId];
export type OverlayType =
  | "snowHeight"
  | "snowLine"
  | "temperature"
  | "windSpeed"
  | "windDirection";
type TimeSpans = Domain["item"]["timeSpans"];
type TimeSpan = TimeSpans[number];

export const stations = atom<StationData[]>([]);
export const grid = atom([]);
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
  returns lastUpdateTime
*/
export const lastDataUpdate = atom(0);
/*
 * returns the start date for history information
 */
export const startDate = atom<Date | null>(null);
/*
 * returns the agl (ausgangslage) date for all calculations
 */
export const agl = atom<Date | null>(null);
/*
 * returns current time of interest
 */
export const currentTime = atom<Date | null>(null);
export const selectedFeature = atom(null);

/*
 * returns domain data based on the active domain id
 */
export const domain = computed(
  [domainId],
  domainId => config.domains[domainId] as Domain
);

/*
 * returns domain
 */
export const domainConfig = computed([domain], domain => domain?.item);
export const dataOverlays = atom([]);

/**
 * Load data overlay images for pixel-value reading.
 * Separated from computed to avoid side effects (Image creation) in pure derivations.
 */
function _updateDataOverlays() {
  const dc = domainConfig.get();
  const di = domainId.get();
  const ct = currentTime.get();
  const ats = absTimeSpan.get();

  if (!dc?.dataOverlays) {
    dataOverlays.set([]);
    return;
  }

  const overlays = dc.dataOverlays.map(o => {
    const ctx = new Promise<CanvasRenderingContext2D>((resolve, reject) => {
      const urls = getOverlayURLs(ct, o?.domain || di, o.file, ats);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = new OffscreenCanvas(
          img.naturalWidth * 2,
          img.naturalHeight * 2
        );
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        ctx.drawImage(img, 0, 0, img.width * 2, img.height * 2);
        resolve(ctx);
      };
      img.onerror = e => {
        if (urls.length) {
          img.src = urls.shift();
        } else {
          reject(new Error(`Failed to fetch ${img.src}: ${JSON.stringify(e)}`));
        }
      };
      img.src = urls.shift();
    });

    return {
      ...o,
      ctx,
      async valueForPixel(coordinates: {
        x: number;
        y: number;
      }): Promise<number | null> {
        const p = (await ctx).getImageData(coordinates.x, coordinates.y, 1, 1);
        return valueForPixel(o.type as OverlayType, {
          r: p.data[0],
          g: p.data[1],
          b: p.data[2]
        });
      }
    };
  });

  dataOverlays.set(overlays);
}

/*
 * returns timeRange
 */
export const timeRange = computed(
  [domainConfig],
  domainConfig =>
    (domainConfig?.timeRange || config.settings?.timeRange) as string[]
);

/*
 * get data for currentTime
 */
let _loadIndexGeneration = 0;
async function _loadIndexData() {
  const generation = ++_loadIndexGeneration;
  stations.set([]);
  grid.set([]);

  if (!domainConfig.get()?.layer.stations) return;
  if (currentTime.get() > startDate.get()) return;

  try {
    await loadStationData({
      consumer: s => {
        if (generation !== _loadIndexGeneration) return;
        stations.set([...stations.get(), ...s]);
      },
      dateTime: currentTime
        .get()
        ?.toTemporalInstant()
        ?.toZonedDateTimeISO("UTC")
    });
  } catch (err) {
    // TODO fail with error dialog
    console.error("Data for timeindex not available", err);
  }
}

/*
 * Fetch a metadata date file (startDate.ok or agl.ok)
 */
async function fetchMetaDate(url: string): Promise<Date | null> {
  if (SIMULATE_START) return new Date(SIMULATE_START);
  const response = await fetch(url);
  if (!response.ok) return new Date();

  const lastModified = response.headers.get("last-modified");
  if (lastModified) {
    const date = Date.parse(lastModified);
    if (date > lastDataUpdate.get() || lastDataUpdate.get() === 0) {
      lastDataUpdate.set(date);
    }
  }

  const text = await response.text();
  return text.includes("T") ? new Date(text.trim()) : null;
}

/*
 * Single entry point for all weather map state changes.
 * Called from weather.tsx when URL params change.
 * - Skips metadata fetch if domain+timeSpan unchanged
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

  // 2. Resolve timespan
  const domainConf = config.domains[newDomain].item;
  const resolvedTimeSpan =
    newTimeSpan && checkTimeSpan(newDomain, newTimeSpan as TimeSpan)
      ? (newTimeSpan as TimeSpan)
      : domainConf.defaultTimeSpan || domainConf.timeSpans[0];

  // 3. Detect what changed
  const domainChanged = newDomain !== domainId.get();
  const timeSpanChanged = resolvedTimeSpan !== timeSpan.get();
  const needsMetadata = domainChanged || timeSpanChanged;

  // 4. Set domain and timespan atoms
  if (domainChanged) {
    domainId.set(newDomain);
    selectedFeature.set(null);
  }
  if (timeSpanChanged) {
    timeSpan.set(resolvedTimeSpan);
  }

  // 5. Fetch metadata only when domain or timeSpan actually changed
  if (needsMetadata) {
    lastDataUpdate.set(0);
    const baseUrl = config.overlayURLs[0];
    const startDateUrl = window.config.template(
      baseUrl + domainConf.metaFiles?.startDate,
      { domain: newDomain }
    );
    const absSpan = Math.abs(
      parseInt(String(resolvedTimeSpan).replace("+-", ""), 10)
    );
    const aglUrl = window.config.template(baseUrl + domainConf.metaFiles?.agl, {
      domain: newDomain,
      timespan: absSpan
    });

    try {
      const [start, aglDate] = await Promise.all([
        fetchMetaDate(startDateUrl),
        fetchMetaDate(aglUrl)
      ]);
      if (gen !== _generation) return; // stale — newer call superseded this one
      startDate.set(start);
      agl.set(aglDate);
    } catch (err) {
      console.error("Weather data API is not available", err);
      return;
    }
  }

  if (gen !== _generation) return;

  // 6. Resolve time — URL timestamp if provided and valid, else calculate default
  const absSpan = absTimeSpan.get();
  const now = SIMULATE_START ? new Date(SIMULATE_START) : new Date();
  let resolvedTime: Date;

  if (timestamp && +new Date(timestamp) > 0) {
    const parsed = new Date(timestamp);
    const snapped = snapToSlot(parsed, absSpan);
    const st = startTime.get();
    const et = endTime.get();
    if (st && et) {
      resolvedTime = clampToRange(snapped, st, et);
    } else {
      resolvedTime = snapped;
    }
  } else {
    resolvedTime = getDefaultTime(
      now,
      new Date(startDate.get()),
      timeSpan.get(),
      absSpan
    );
  }

  const timeChanged = +resolvedTime !== +currentTime.get();
  if (timeChanged) {
    currentTime.set(resolvedTime);
  }

  // 7. Load overlay images and station data only if something actually changed
  if (needsMetadata || timeChanged) {
    _updateDataOverlays();
    if (gen === _generation) {
      await _loadIndexData();
    }
  }
}

export const startTime = computed(
  [startDate, timeRange],
  (startDate, timeRange) => {
    if (!startDate) return null;
    const startTime = new Date(startDate);
    startTime.setUTCHours(startTime.getUTCHours() + +timeRange[0]);
    return startTime;
  }
);

export const endTime = computed(
  [agl, timeSpan, timeSpanInt, timeRange],
  (agl, timeSpan, timeSpanInt, timeRange) => {
    if (!agl) return null;
    const endTime = new Date(agl);

    if (timeSpanInt === 12 && [6, 18].includes(endTime.getUTCHours())) {
      endTime.setUTCHours(endTime.getUTCHours() - 6);
    }
    if (timeSpanInt % 24 === 0 && [12].includes(endTime.getUTCHours())) {
      endTime.setUTCHours(endTime.getUTCHours() - 12);
    }
    if (timeSpan && /^\+\d/.test(timeSpan)) {
      endTime.setUTCHours(endTime.getUTCHours() + +timeRange[1]);
    }
    return endTime;
  }
);

export const initialDate = computed(
  [currentTime, endTime, timeSpanInt],
  (currentTime, endTime, timeSpanInt) => {
    if (!currentTime || !endTime) return null;
    currentTime = new Date(currentTime);
    endTime = new Date(endTime);
    const initialDate = +currentTime > +endTime ? endTime : currentTime;

    if (timeSpanInt === 12 && [6, 18].includes(initialDate.getUTCHours())) {
      initialDate.setUTCHours(initialDate.getUTCHours() - 6);
    }
    if (
      timeSpanInt % 24 === 0 &&
      [6, 12, 18].includes(initialDate.getUTCHours())
    ) {
      initialDate.setUTCHours(
        initialDate.getUTCHours() - initialDate.getUTCHours()
      );
    }
    return initialDate;
  }
);

export const overlayURLs = computed(
  [currentTime, domainConfig, domainId, absTimeSpan],
  (currentTime, domainConfig, domainId, absTimeSpan) => {
    return getOverlayURLs(
      currentTime,
      domainId,
      domainConfig.imageOverlay.file,
      absTimeSpan
    );
  }
);

function getOverlayURLs(
  currentTime: Date | null,
  domain: DomainId,
  file: string | undefined,
  timespan: number
): [string, string] {
  if (!currentTime) return ["", ""];
  const utc = currentTime.toISOString();
  const data = {
    year: utc.slice(0, "2025".length),
    date: utc.slice(0, "2025-03-14".length),
    time: currentTime.getUTCHours().toString().padStart(2, "0") + "-00",
    domain,
    timespan
  };
  return [
    window.config.template(config.overlayURLs[0] + file, data),
    window.config.template(config.overlayURLs[1] + file, data)
  ];
}

/*
 * returns nextUpdateTime
 */
export const nextUpdateTime = computed(
  [domainConfig, lastDataUpdate, timeSpan],
  (domainConfig, lastDataUpdate, timeSpan) => {
    if (!domainConfig.updateTimesOffset || lastDataUpdate === 0) return null;
    let res = null;
    const timesConfig = domainConfig.updateTimesOffset;
    const lastUpdate = new Date(lastDataUpdate);

    const addHours = timesConfig[timeSpan] || timesConfig["*"];
    if (addHours)
      res = new Date(lastUpdate).setUTCHours(
        lastUpdate.getUTCHours() + addHours
      );

    return res;
  }
);

/*
 * returns value for pixel color
 */
export function valueForPixel(
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
      if (pixelRGB.g + pixelRGB.b === 0) return -251 + pixelRGB.r;
      if (pixelRGB.r + pixelRGB.g === 0) return 249 + pixelRGB.b;
      if (pixelRGB.r + pixelRGB.b === 0) return 2019 + pixelRGB.g;
      if (pixelRGB.r !== 0 && pixelRGB.g !== 0 && pixelRGB.b !== 0)
        return pixelRGB.r;
  }
  return null;
}

/*
 * control method to check if the domain does exist in the config
 */
function checkDomainId(domainId: DomainId) {
  return Boolean(domainId && config?.domains[domainId]?.item);
}

/*
 * control method to check if the item does exist in the config
 */
function checkTimeSpan(domainId: DomainId, timeSpan: TimeSpan) {
  return Boolean(
    checkDomainId(domainId) &&
    config.domains[domainId].item.timeSpans.includes(timeSpan)
  );
}
