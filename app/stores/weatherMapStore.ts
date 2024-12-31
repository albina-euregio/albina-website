import { action, makeAutoObservable, observable, toJS } from "mobx";
import { loadStationData } from "./stationDataStore";
import { fetchJSON } from "../util/fetch";
import { dateFormat } from "../util/date";

const SIMULATE_START = null; //"2023-11-28T22:00Z"; // for debugging day light saving, simulates certain time
const SIMULATE_NOW = null; //"2023-11-28T23:18Z"

export default class WeatherMapStore {
  config = {
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
        domainIdStart: "-1",
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
          dataOverlayFilePostFix: {
            main: "%%DOMAIN%%_V2.gif",
            debug: "%%DOMAIN%%_V2.png"
          },
          dataOverlays: [
            { filePostfix: "%%DOMAIN%%_V2.png", type: "snowHeight" }
          ],
          direction: false,
          clusterOperation: "max"
        }
      },
      "new-snow": {
        domainIdStart: "+6",
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
          dataOverlayFilePostFix: {
            main: "%%DOMAIN%%_V2.gif",
            debug: "%%DOMAIN%%_V2.png"
          },
          dataOverlays: [
            { filePostfix: "%%DOMAIN%%_V2.png", type: "snowHeight" }
          ],
          displayedItems: ["snow6f"],
          direction: false,
          clusterOperation: "max"
        }
      },
      "diff-snow": {
        domainIdStart: "+6",
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
          dataOverlayFilePostFix: {
            main: "%%DOMAIN%%_V2.gif",
            debug: "%%DOMAIN%%_V2.png"
          },
          dataOverlays: [
            { filePostfix: "%%DOMAIN%%_V2.png", type: "snowHeight" }
          ],
          direction: false,
          clusterOperation: "max"
        }
      },
      "snow-line": {
        domainIdStart: "+-1",
        item: {
          timeSpans: ["+-1"],
          defaultTimeSpan: null,
          timeSpanToDataId: {},
          updateTimesOffset: { "*": 1 },
          units: "m",
          thresholds: [
            100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
            1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400,
            2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500,
            9876
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
          dataOverlayFilePostFix: {
            main: "%%DOMAIN%%_V3.gif",
            debug: "%%DOMAIN%%_V3.png"
          },
          dataOverlays: [
            { filePostfix: "%%DOMAIN%%_V3.png", type: "snowLine" }
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
        domainIdStart: "+-1",
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
          dataOverlayFilePostFix: {
            main: "%%DOMAIN%%_V3.gif",
            debug: "%%DOMAIN%%_V3.png"
          },
          dataOverlays: [
            { filePostfix: "%%DOMAIN%%_V3.png", type: "temperature" }
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
        domainIdStart: "+-1",
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
          dataOverlayFilePostFix: {
            main: "wind_V3.gif",
            debug: "wind_V3.png"
          },
          dataOverlays: [
            { filePostfix: "wind_V3.png", type: "windSpeed" },
            { filePostfix: "wind-dir_V3.png", type: "windDirection" }
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
        domainIdStart: "+-1",
        item: {
          timeSpans: ["+-1"],
          defaultTimeSpan: null,
          timeSpanToDataId: { "+-1": "gust" },
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
          dataOverlayFilePostFix: {
            main: "gust_V3.gif",
            debug: "gust_V3.png"
          },
          dataOverlays: [
            { filePostfix: "gust_V3.png", type: "windSpeed" },
            {
              filePostfix: "wind-dir_V3.png",
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
        domainIdStart: "+-1",
        item: {
          timeSpans: ["+-1"],
          defaultTimeSpan: null,
          timeSpanToDataId: { "+-1": "wind700hpa" },
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
          dataOverlayFilePostFix: {
            main: "wind700hpa.gif",
            debug: "wind700hpa.png"
          },
          dataOverlays: [
            { filePostfix: "wind700hpa.png", type: "windSpeed" },
            { filePostfix: "wind-dir700hpa.png", type: "windDirection" }
          ],
          direction: "wdir",
          clusterOperation: "max",
          metaFiles: {
            startDate: "../wind/startDate.ok",
            agl: "c-laef_agl.ok"
          },
          timeRange: ["-17520", "+60"]
        }
      }
    }
  };
  stations = [];
  grid = [];
  _domainId = observable.box<keyof typeof this.config.domains | false>(false);
  _timeSpan = observable.box(false);
  _lastDataUpdate = 0;
  _dateStart: Date | null = null;
  _agl: Date | null = null;
  _currentTime = observable.box<Date | null>(null);
  selectedFeature = null;

  constructor(initialDomainId: keyof typeof this.config.domains) {
    makeAutoObservable(this);
    this.changeDomain(initialDomainId || "new-snow");
  }

  /*
    get data
  */
  _loadDomainData() {
    this._lastDataUpdate = 0;

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
        const date = new Date(lastModified).getTime();
        if (date < this._lastDataUpdate || this._lastDataUpdate === 0) {
          this._lastDataUpdate = date;
        }
      }

      const date = await response.text();
      return date.includes("T") ? new Date(date.trim()) : null;
    };

    const loads = [
      fetchDate(
        config.apis.weather.overlays +
          this._domainId.get() +
          "/" +
          this.domainConfig.metaFiles?.startDate
      ).then(
        action(retrievedDate => {
          this._dateStart = retrievedDate;
        })
      ),
      fetchDate(
        config.apis.weather.overlays +
          this._domainId.get() +
          "/" +
          this.domainConfig.metaFiles?.agl.replace(
            "{timespan}",
            this._absTimeSpan
          )
      ).then(
        action(retrievedDate => {
          this._agl = retrievedDate;
        })
      )
    ];

    Promise.all(loads)
      .then(() => {
        if (!this._currentTime.get())
          this._currentTime.set(this._getStartTimeForSpan(this._dateStart));
        this._loadIndexData();
      })
      .catch(err => {
        // TODO fail with error dialog
        console.error("Weather data API is not available aaa", err);
      });
  }

  /*
    get data for currentTime
  */
  _loadIndexData() {
    this.stations = {};
    this.grid = {};
    const loads = [];

    if (
      this.domainConfig?.layer.stations &&
      this._currentTime.get() <= this._agl
    ) {
      loads.push(
        loadStationData({
          dateTime: this._currentTime.get()
            ? new Date(this._currentTime.get())
            : undefined
        }).then(action(features => (this.stations = { features })))
      );
    } else {
      this.stations = [];
    }
    if (this.domainConfig?.layer.grid) {
      loads.push(
        fetchJSON(config.apis.weather.grid).then(response => {
          this.grid = response.data;
        })
      );
    } else {
      this.grid = [];
    }

    Promise.all(loads)
      .then(() => {})
      .catch(err => {
        // TODO fail with error dialog
        console.error("Data for timeindex not available", err);
      });
  }

  /*
    returns lastUpdateTime
  */
  get lastUpdateTime() {
    return this._lastDataUpdate;
  }

  /*
    returns the active domain id
  */
  get domainId() {
    return this._domainId.get();
  }

  /*
    returns current time of interrest
  */
  get currentTime() {
    return this._currentTime.get();
  }

  /*
    returns domain data based on the active domain id
  */
  get domain() {
    return this.config && this.domainId
      ? this.config.domains[this.domainId]
      : false;
  }

  /*
    returns current timespan selection
  */
  get timeSpan() {
    return this._timeSpan.get();
  }

  /*
    returns the start date for history information
  */
  get startDate() {
    return this._dateStart;
  }

  get startTime() {
    const startTime = new Date(this.startDate);
    startTime.setUTCHours(startTime.getUTCHours() + +this.timeRange[0]);
    return startTime;
  }

  get endTime() {
    const endTime = new Date(this.agl);

    const timeSpan = Number(this.timeSpan.replace(/\D/g, ""), 10);
    if (timeSpan === 12 && [6, 18].includes(endTime.getUTCHours())) {
      endTime.setUTCHours(endTime.getUTCHours() - 6);
    }
    if (timeSpan % 24 === 0 && [12].includes(endTime.getUTCHours())) {
      endTime.setUTCHours(endTime.getUTCHours() - 12);
    }
    if (this.timeSpan.includes("+")) {
      endTime.setUTCHours(endTime.getUTCHours() + +this.timeRange[1]);
    }
    return endTime;
  }

  get initialDate() {
    const currentTime = new Date(this.currentTime);
    const endTime = new Date(this.endTime);
    const initialDate =
      currentTime.getTime() > endTime.getTime() ? endTime : currentTime;

    const timeSpan = Number(this.timeSpan.replace(/\D/g, ""), 10);
    if (timeSpan === 12 && [6, 18].includes(initialDate.getUTCHours())) {
      initialDate.setUTCHours(initialDate.getUTCHours() - 6);
    }
    if (
      timeSpan % 24 === 0 &&
      [6, 12, 18].includes(initialDate.getUTCHours())
    ) {
      initialDate.setUTCHours(
        initialDate.getUTCHours() - initialDate.getUTCHours()
      );
    }
    return initialDate;
  }

  /*
    returns timeRange
  */
  get timeRange() {
    const range =
      this.domainConfig?.timeRange || this.config.settings?.timeRange;
    return toJS(range);
  }

  /*
    returns the agl (ausgangslage) date for all calculations
  */
  get agl() {
    return this._agl;
  }

  get _absTimeSpan() {
    let tempTimeSpan = this._timeSpan.get();
    tempTimeSpan = tempTimeSpan.replace("+-", "");
    return Math.abs(parseInt(tempTimeSpan, 10));
  }

  getOverlayFileName(filePostFix, overrideDomainId = "") {
    filePostFix ||= this.config.settings.debugModus
      ? this.domainConfig?.dataOverlayFilePostFix.debug
      : this.domainConfig?.dataOverlayFilePostFix.main;
    if (this?._currentTime.get()) {
      let domainVar = overrideDomainId || this._domainId.get();
      if (this._absTimeSpan !== 1) domainVar += "_" + this._absTimeSpan + "h";

      return (
        config.apis.weather.overlays +
        (overrideDomainId || this._domainId.get()) +
        "/" +
        dateFormat(this._currentTime.get(), "%Y-%m-%d_%H-%M", true) +
        "_" +
        String(filePostFix).replaceAll("%%DOMAIN%%", domainVar)
      );
    }
    return "";
  }

  /*
    returns item
  */
  get item() {
    return this.config && this.domainId && this.domain
      ? this.domain.item
      : false;
  }

  /*
    returns domain
  */
  get domainConfig() {
    return this.config.domains && this.domainId
      ? this.config.domains[this.domainId].item
      : null;
  }

  /*
    returns nextUpdateTime
  */
  get nextUpdateTime() {
    if (!this.domainConfig.updateTimesOffset || this._lastDataUpdate === 0)
      return null;
    let res = null;
    const timesConfig = this.domainConfig.updateTimesOffset;
    const lastUpdate = new Date(this._lastDataUpdate);

    let addHours;

    addHours = timesConfig[this._timeSpan] || timesConfig["*"];

    if (addHours)
      res = new Date(lastUpdate).setUTCHours(
        lastUpdate.getUTCHours() + addHours
      );

    return res;
  }

  /*
    returns value for pixel color
  */
  valueForPixel(overlayType, pixelRGB) {
    let res;
    switch (overlayType) {
      case "temperature":
        if (pixelRGB.r <= 0) res = "<59,5";
        else if (pixelRGB.r >= 255) res = null;
        else res = Math.round(-59.5 + (pixelRGB.r - 1) * 0.5);
        break;
      case "windDirection":
        if (pixelRGB.r < 0 || pixelRGB.r > 180) res = null;
        else res = pixelRGB.r * 2;
        break;
      case "windSpeed":
        if (pixelRGB.r < 0 || pixelRGB.r >= 255) res = null;
        else res = pixelRGB.r;
        break;
      case "snowLine":
        if (pixelRGB.r < 0 || pixelRGB.r >= 100) res = null;
        else res = pixelRGB.r * 50;
        break;
      case "snowHeight":
        if (pixelRGB.r + pixelRGB.g + pixelRGB.b === 0) res = 0;
        else if (pixelRGB.g + pixelRGB.b === 0) res = -251 + pixelRGB.r;
        else if (pixelRGB.r + pixelRGB.g === 0) res = 249 + pixelRGB.b;
        else if (pixelRGB.r + pixelRGB.b === 0) res = 2019 + pixelRGB.g;
        else if (pixelRGB.r !== 0 && pixelRGB.g !== 0 && pixelRGB.b !== 0)
          res = pixelRGB.r;
        break;
      default:
        break;
    }
    return res;
  }

  /*
    Get hours of day for current timespan settings
  */
  _getPossibleTimesForSpan() {
    const posTimes = [];
    let temp = 0;
    const absTimeSpan = this._absTimeSpan;
    while (temp < 24) {
      posTimes.push(temp < 24 ? temp : temp - 24);
      temp = temp + absTimeSpan;
    }
    return posTimes;
  }

  /*
    Calculate startdate for current timespan
  */
  _getStartTimeForSpan(initDate) {
    const currentTime = new Date(initDate);

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
      ].includes(this._timeSpan.get()) &&
      currentTime.getUTCHours() !== 0
    ) {
      let foundStartHour;
      const currHours = currentTime.getUTCHours();
      const timesForSpan = this._getPossibleTimesForSpan();
      const soonerTimesToday = timesForSpan.filter(aTime => aTime <= currHours);
      if (soonerTimesToday.length)
        foundStartHour = Math.max(...soonerTimesToday);
      else foundStartHour = Math.max(...timesForSpan);

      if (soonerTimesToday.length === 0)
        currentTime.setUTCHours(currentTime.getUTCHours() - 24);
      currentTime.setUTCHours(foundStartHour);
    }
    return currentTime;
  }

  /*
    control method to check if the domain does exist in the config
  */
  checkDomainId(domainId) {
    return (
      domainId &&
      this.config?.domains[domainId]?.item &&
      this.config.domains[domainId].domainIdStart
    );
  }

  /*
    setting a new active domain
  */
  changeDomain(domainId) {
    if (this.checkDomainId(domainId) && domainId !== this._domainId.get()) {
      this._domainId.set(domainId);
      this._timeSpan.set(null);

      this.changeTimeSpan(
        this.domain.item.defaultTimeSpan || this.domain.item.timeSpans[0]
      );
      this._loadDomainData();
      this.selectedFeature = null;
    }
  }

  /*
  control method to check if the item does exist in the config
*/
  checkTimeSpan(domainId, timeSpan) {
    return (
      this.checkDomainId(domainId) &&
      this.config.domains[domainId].item.timeSpans.includes(timeSpan)
    );
  }

  /*
    setting a new active timeSpan
  */
  changeTimeSpan(timeSpan) {
    if (
      timeSpan !== this._timeSpan.get() &&
      this.checkTimeSpan(this.domainId, timeSpan)
    ) {
      this._timeSpan.set(timeSpan);
      this._loadDomainData();
      this.selectedFeature = null;
    } else console.error("Timespan does not exist!", timeSpan);
  }

  /*
    setting a new timeIndex
  */
  changeCurrentTime(newTime) {
    if (
      new Date(newTime).getTime() !==
      new Date(this._currentTime.get()).getTime()
    ) {
      this._currentTime.set(newTime);
    }

    this._loadIndexData();
  }
}
