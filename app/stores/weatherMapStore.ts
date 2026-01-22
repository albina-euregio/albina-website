import { atom, computed } from "nanostores";
import { loadStationData, type StationData } from "./stationDataStore";

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
        timeSpanToDataId: { "-1": "snow" },
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
          "-24": "snow24",
          "-48": "snow48",
          "-72": "snow72"
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
        timeSpanToDataId: { "+-1": "temp" },
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
        timeSpanToDataId: { "+-1": "wspd" },
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
        direction: "wdir",
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
        timeSpanToDataId: { "+-1": "wgus" },
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
        direction: "wdir",
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
        direction: "wdir",
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
export const dataOverlays = computed(
  [domainConfig, domainId, currentTime, absTimeSpan],
  (domainConfig, domainId, currentTime, absTimeSpan) =>
    domainConfig.dataOverlays.map(o => {
      const ctx = new Promise<CanvasRenderingContext2D>((resolve, reject) => {
        const overlayURLs = getOverlayURLs(
          currentTime,
          o?.domain || domainId,
          o.file,
          absTimeSpan
        );
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
          if (overlayURLs.length) {
            img.src = overlayURLs.shift();
          } else {
            reject(
              new Error(`Failed to fetch ${img.src}: ${JSON.stringify(e)}`)
            );
          }
        };
        img.src = overlayURLs.shift();
      });

      return {
        ...o,
        ctx,
        async valueForPixel(coordinates: {
          x: number;
          y: number;
        }): Promise<number | null> {
          const p = (await ctx).getImageData(
            coordinates.x,
            coordinates.y,
            1,
            1
          );
          return valueForPixel(o.type as OverlayType, {
            r: p.data[0],
            g: p.data[1],
            b: p.data[2]
          });
        }
      };
    })
);

/*
 * returns timeRange
 */
export const timeRange = computed(
  [domainConfig],
  domainConfig =>
    (domainConfig?.timeRange || config.settings?.timeRange) as string[]
);

/*
 * get data
 */
async function _loadDomainData() {
  lastDataUpdate.set(0);

  const fetchDate = async (url: string) => {
    if (SIMULATE_START) {
      return new Date(SIMULATE_START);
    }

    const response = await fetch(url);
    if (!response.ok) {
      return new Date();
    }

    const lastModified = response.headers.get("last-modified");
    if (lastModified) {
      const date = Date.parse(lastModified);
      if (date > lastDataUpdate.get() || lastDataUpdate.get() === 0) {
        lastDataUpdate.set(date);
      }
    }

    const date = await response.text();
    return date.includes("T") ? new Date(date.trim()) : null;
  };

  try {
    const url = config.overlayURLs[0];
    const startDate0 = fetchDate(
      window.config.template(url + domainConfig.get().metaFiles?.startDate, {
        domain: domainId.get()
      })
    );
    const agl0 = fetchDate(
      window.config.template(url + domainConfig.get().metaFiles?.agl, {
        domain: domainId.get(),
        timespan: absTimeSpan.get()
      })
    );

    startDate.set(await startDate0);
    agl.set(await agl0);

    if (!currentTime.get()) {
      currentTime.set(_getStartTimeForSpan());
    }
    await _loadIndexData();
  } catch (err) {
    // TODO fail with error dialog
    console.error("Weather data API is not available aaa", err);
  }
}

/*
 * get data for currentTime
 */
async function _loadIndexData() {
  stations.set([]);
  grid.set([]);

  if (!domainConfig.get()?.layer.stations) return;
  if (currentTime.get() > startDate.get()) return;

  try {
    await loadStationData({
      consumer: s => stations.set([...stations.get(), ...s]),
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

export const startTime = computed(
  [startDate, timeRange],
  (startDate, timeRange) => {
    const startTime = new Date(startDate);
    startTime.setUTCHours(startTime.getUTCHours() + +timeRange[0]);
    return startTime;
  }
);

export const endTime = computed(
  [agl, timeSpan, timeSpanInt, timeRange],
  (agl, timeSpan, timeSpanInt, timeRange) => {
    const endTime = new Date(agl);

    if (timeSpanInt === 12 && [6, 18].includes(endTime.getUTCHours())) {
      endTime.setUTCHours(endTime.getUTCHours() - 6);
    }
    if (timeSpanInt % 24 === 0 && [12].includes(endTime.getUTCHours())) {
      endTime.setUTCHours(endTime.getUTCHours() - 12);
    }
    if (timeSpan?.includes("+")) {
      endTime.setUTCHours(endTime.getUTCHours() + +timeRange[1]);
    }
    return endTime;
  }
);

export const initialDate = computed(
  [currentTime, endTime, timeSpanInt],
  (currentTime, endTime, timeSpanInt) => {
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
    Get hours of day for current timespan settings
  */
function _getPossibleTimesForSpan() {
  const posTimes = [];
  let temp = 0;
  while (temp < 24) {
    posTimes.push(temp < 24 ? temp : temp - 24);
    temp = temp + absTimeSpan.get();
  }
  return posTimes;
}

/*
    Calculate startdate for current timespan
  */
function _getStartTimeForSpan() {
  const currentTime = new Date(startDate.get());

  if (
    [
      "-6",
      "-12",
      "-24",
      "-48",
      "-72",
      "+6",
      "+12",
      "+24",
      "+48",
      "+72"
    ].includes(timeSpan.get()) &&
    currentTime.getUTCHours() !== 0
  ) {
    let foundStartHour;
    const currHours = currentTime.getUTCHours();
    const timesForSpan = _getPossibleTimesForSpan();
    const soonerTimesToday = timesForSpan.filter(aTime => aTime <= currHours);
    if (soonerTimesToday.length) foundStartHour = Math.max(...soonerTimesToday);
    else foundStartHour = Math.max(...timesForSpan);

    if (soonerTimesToday.length === 0)
      currentTime.setUTCHours(currentTime.getUTCHours() - 24);
    currentTime.setUTCHours(foundStartHour);
  }
  return currentTime;
}

/*
 * control method to check if the domain does exist in the config
 */
function checkDomainId(domainId: DomainId) {
  return Boolean(domainId && config?.domains[domainId]?.item);
}

/*
 * setting a new active domain
 */
export function changeDomain(domainId0: DomainId, newTimeSpan: TimeSpan) {
  domainId0 ||= "new-snow";
  if (!checkDomainId(domainId0) || domainId0 === domainId.get()) {
    return;
  }
  domainId.set(domainId0);
  timeSpan.set(null);
  let usedTimeSpan =
    domainConfig.get().defaultTimeSpan || domainConfig.get().timeSpans[0];
  if (newTimeSpan && checkTimeSpan(domainId0, newTimeSpan)) {
    usedTimeSpan = newTimeSpan;
  }

  changeTimeSpan(usedTimeSpan);
  _loadDomainData();
  selectedFeature.set(null);
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

/*
 * setting a new active timeSpan
 */
export function changeTimeSpan(timeSpan0: TimeSpan) {
  if (timeSpan0 == timeSpan.get()) return;
  if (checkTimeSpan(domainId.get(), timeSpan0)) {
    timeSpan.set(timeSpan0);
    _loadDomainData();
    selectedFeature.set(null);
  } else {
    console.error("Timespan does not exist!");
  }
}

/*
 * setting a new timeIndex
 */
export function changeCurrentTime(newTime: Date | string) {
  const date = new Date(newTime);
  if (+date !== +currentTime.get()) {
    currentTime.set(date);
  }
  _loadIndexData();
}
