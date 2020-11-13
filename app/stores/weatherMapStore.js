import { computed, observable, action } from "mobx";
import StationDataStore from "./stationDataStore";
import axios from "axios";
import { dateFormat, isSummerTime } from "../util/date";

export default class WeatherMapStore_new {
  @observable _domainId;
  @observable _loading;
  @observable selectedFeature;
  @observable _timeSpan;
  @observable _availableTimes;
  @observable stations;
  @observable _agl;
  @observable _dateStart;
  @observable _lastDataUpdate;
  @observable config;

  constructor(initialDomainId) {
    this.config = config.weathermaps;
    this.stations = null;
    this.grid = null;
    this._domainId = observable.box(false);
    this._timeSpan = observable.box(false);
    this._lastDataUpdate = 0;
    this._dateStart = null;
    this._agl = null;
    this._availableTimes = [];
    this._timeIndex = observable.box(false);
    this.selectedFeature = null;
    this._loading = observable.box(false);
    this._lastCurrentTime = null;

    const configDefaultDomainId = Object.keys(this.config.domains).find(
      domainKey => this.config.domains[domainKey].domainDefault
    );
    if (!initialDomainId || initialDomainId == "false") {
      initialDomainId = configDefaultDomainId;
    }
    this.changeDomain(initialDomainId);
  }

  /* 
    get data
  */
  _loadDomainData() {
    const self = this;
    this._loading.set(true);
    this._lastDataUpdate = 0;
    //console.log("_loadDomainData bbb", this._domainId, this.getMetaFile("agl"));

    const loads = [
      axios
        .get(
          config.apis.weather.overlays +
            this._domainId.get() +
            "/" +
            this.getMetaFile("agl")
        )
        .then(response => {
          if (response.data.includes("T"))
            this._dateStart = new Date(response.data.trim()).getTime();
          self.lastUpdateTime = response.headers["last-modified"];
        }),
      axios
        .get(
          config.apis.weather.overlays +
            this._domainId.get() +
            "/" +
            this.getMetaFile("startDate")
        )
        .then(response => {
          // console.log(
          //   "WeatherMapStore_new->_loadData fff: Startdate",
          //   response.data,
          //   new Date(response.data.trim())
          // );
          if (response.data.includes("T"))
            this._agl = new Date(response.data.trim()).getTime();
          self.lastUpdateTime = response.headers["last-modified"];
        })
    ];

    Promise.all(loads)
      .then(() => {
        this._loading.set(false);
        //console.log("Weathermap_new->_loadDomainData: loaded aaa", this);
        this._setAvailableTimes();
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
    this._loading.set(true);

    let cTI = new Date(this.currentTime);
    cTI.setHours(cTI.getHours() - 4);

    // console.log(
    //   "_loadData this.currentTime bbb",
    //   new Date(this.currentTime),
    //   cTI
    // );

    this.stations = {};
    this.grid = {};
    let prefix =
      this.currentTime && this.currentTime
        ? dateFormat(new Date(cTI.getTime()), "%Y-%m-%d_%H-%M", true) + "_"
        : "";
    let loads = [];
    if (
      this.domainConfig &&
      this.domainConfig.layer.stations &&
      this.currentTime < this._agl
    ) {
      loads.push(
        new StationDataStore().load(prefix).then(features => {
          // console.log(
          //   "WeatherMapStore_new->_loadData aaa: StationDataStore",
          //   features
          // );
          this.stations = {
            features
          };
        })
      );
    } else this.stations = [];
    if (this.domainConfig && this.domainConfig.layer.grid) {
      loads.push(
        axios.get(config.apis.weather.grid).then(response => {
          // console.log("WeatherMapStore_new->_loadData aaa: Grid");
          this.grid = response.data;
        })
      );
    } else this.grid = [];

    Promise.all(loads)
      .then(() => {
        this._loading.set(false);
        //console.log("Weathermap_new->_loadIndexData: loaded bbb", this);
      })
      .catch(err => {
        // TODO fail with error dialog
        console.error("Data for timeindex not available", err);
      });
  }

  /*
    sets last update time
  */
  set lastUpdateTime(dateTime) {
    //console.log("set lastUpdateTime kkk ", dateTime, this._lastDataUpdate);
    const updateDateTime = new Date(dateTime).getTime();
    if (updateDateTime < this._lastDataUpdate || this._lastDataUpdate === 0)
      this._lastDataUpdate = new Date(dateTime).getTime();
  }

  /*
    returns metafile
  */
  getMetaFile(type) {
    let foundDef;
    if (type === "agl")
      foundDef =
        this.domainConfig.metaFiles?.startDate ||
        this.config.settings.metaFiles.startDate;
    if (type === "startDate")
      foundDef =
        this.domainConfig.metaFiles?.startDate ||
        this.config.settings.metaFiles.startDate;

    return foundDef.replace("{timespan}", this._absTimeSpan);
  }

  /*
    returns lastUpdateTime
  */
  @computed get lastUpdateTime() {
    //console.log("get lastUpdateTime kkk", this._lastDataUpdate);
    return this._lastDataUpdate;
  }

  /*
    returns the active domain id
  */
  @computed get domainId() {
    return this._domainId.get();
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
    returns all items for the active domain in a form of array
  */
  @computed get items() {
    return this.domainId ? this.domain.item : false;
  }

  /*
    returns current timeIndex
  */
  @computed get currentTime() {
    return (
      this._availableTimes &&
      this._timeIndex &&
      this._availableTimes[this._timeIndex.get()]
    );
  }

  /*
    returns all _availableTimes
  */
  @computed get availableTimes() {
    //console.log("timeIndices GET", this._availableTimes);
    return this._availableTimes;
  }

  /*
    returns current timespan selection
  */
  @computed get timeSpan() {
    //console.log("timeSpan GET", this._timeSpan);
    return this._timeSpan.get();
  }

  /*
    returns the start date for history information
  */
  @computed get startDate() {
    return this._dateStart;
  }

  /*
    returns the agl (ausgangslage) date for all calculations
  */
  @computed get agl() {
    return this._agl;
  }

  /*
    returns _loading prop
  */
  @computed get loading() {
    return this._loading.get();
  }

  get _absTimeSpan() {
    let tempTimeSpan = this._timeSpan.get();
    tempTimeSpan = tempTimeSpan.replace("+-", "");
    return Math.abs(parseInt(tempTimeSpan, 10));
  }

  /*
    returns filename for overlay e.g.2020-07-29_06-00_diff-snow_6h
  */
  @computed get overlayFileName() {
    // console.log(
    //   "weatherMapStore_new overlayFileName: ",
    //   this._domainId.get(),
    //   this._timeSpan.get()
    // );

    if (this._timeIndex.get() != null && this._availableTimes.length > 0) {
      let datePlusOffset = new Date(
        this._availableTimes[this._timeIndex.get()]
      );
      //if(parseInt(this._timeSpan.get(), 10) > 0)
      datePlusOffset.setHours(datePlusOffset.getHours() + this._absTimeSpan);
      // console.log(
      //   "weatherMapStore_new overlayFileName:#2 ",
      //   datePlusOffset,
      //   new Date(this._availableTimes[this._timeIndex.get()]).getUTCDate()
      // );

      return (
        config.apis.weather.overlays +
        this._domainId.get() +
        "/" +
        dateFormat(datePlusOffset, "%Y-%m-%d_%H-%M", true) +
        "_" +
        this._domainId.get() +
        (this._absTimeSpan !== 1 ? "_" + this._absTimeSpan + "h" : "")
      );
    }
    return false;
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
   returns index of active timeIndex decremented by 1
  */
  @computed get previousTime() {
    return this._availableTimes[this._timeIndex.get() - 1]
      ? this._availableTimes[this._timeIndex.get() - 1]
      : this._availableTimes[this._availableTimes.length - 1];
  }
  /*
    returns index of active timeIndex incremented by 1
  */
  @computed get nextTime() {
    //console.log("nextTime xxx1", this._availableTimes, this._timeIndex.get());
    return this._availableTimes[this._timeIndex.get() + 1]
      ? this._availableTimes[this._timeIndex.get() + 1]
      : this._availableTimes[0];
  }

  /*
    returns currentIndex
  */
  @computed get currentIndex() {
    return this._timeIndex.get();
  }

  /*
    returns currentIndex
  */
  @computed get domainConfig() {
    return this.config.domains && this.domainId
      ? this.config.domains[this.domainId].item
      : null;
  }

  /*
    returns nextUpdateTime
  */
  @computed get nextUpdateTime() {
    //console.log("nextUpdateTime kkk #0", this.domainConfig);
    if (!this.domainConfig.updateTimesOffset || this._lastDataUpdate === 0)
      return null;
    //console.log("nextUpdateTime kkk #1", this.domainConfig.updateTimes, Object.entries(this.domainConfig.updateTimes));
    let res = null;
    const timesConfig = this.domainConfig.updateTimesOffset;
    const lastUpdate = new Date(this._lastDataUpdate);

    //const utcHour = lastUpdate.getUTCHours();

    let addHours;

    addHours = timesConfig[this._timeSpan] || timesConfig["*"];

    //console.log("nextUpdateTime kkk #4", utcHour, addHours);
    if (addHours)
      res = new Date(lastUpdate).setHours(lastUpdate.getHours() + addHours);

    return res;
  }

  /*
    returns value for pixel color
  */
  valueForPixel(overlayType, pixelRGB) {
    //console.log("valueForPixel jjj", overlayType, pixelRGB);
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
      case "snowHeight":
        //console.log("snowHeight", pixelRGB);
        if (pixelRGB.r + pixelRGB.g + pixelRGB.g === 0) res = 0;
        else if (pixelRGB.g + pixelRGB.g === 0) res = -251 + pixelRGB.r;
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
  finds index of arr item closest to needle
*/
  _findClosestIndex(arr, needle) {
    let foundItem = arr.reduce(function(prev, curr) {
      return Math.abs(curr - needle) < Math.abs(prev - needle) ? curr : prev;
    });
    return arr.indexOf(foundItem) || 0;
  }

  _getStartTimeForSpan = function(initDate) {
    let currentTime = new Date(initDate);
    //console.log("_getStartTimeForSpan #1", isSummerTime(currentTime), currentTime, this._timeSpan.get());
    if (
      ["-12", "-24", "-48", "-72", "+12", "+24", "+48", "+72"].includes(
        this._timeSpan.get()
      ) &&
      currentTime.getUTCHours() !==
        this.config.settings.startUTCHourForTimespans
    ) {
      if (isSummerTime(currentTime))
        currentTime.setUTCHours(this.config.settings.startUTCHourForTimespans);
      else
        currentTime.setUTCHours(
          this.config.settings.startUTCHourForTimespans + 1
        );
      //console.log("_getStartTimeForSpan #2", currentTime);
    }
    // console.log("_getStartTimeForSpan #2", ["+24", "+48", "+72"].includes(this._timeSpan.get()), this._timeSpan.get(), this.config.settings.startUTCHourForTimespans, currentTime.getUTCHours(), this.config);
    return currentTime;
  };

  /*
    calc indeces for timespan
  */
  _setAvailableTimes = function() {
    //console.log("weatherMapStore_new _setTimeIndices: ", this._timeSpan.get());
    let indices = [];
    let currentTimespan = this._timeSpan.get();

    let currentTime = this._getStartTimeForSpan(this._dateStart);
    let maxTime;
    let endTime;
    let timeSpanDir = currentTimespan.includes("+-")
      ? 0
      : parseInt(currentTimespan, 10) > 0
      ? 1
      : -1;

    // console.log(
    //   "weatherMapStore_new _setTimeIndices #1",
    //   this._dateStart,
    //   timeSpanDir,
    //   this._absTimeSpan
    // );

    if (timeSpanDir >= 0) {
      currentTime = this._getStartTimeForSpan(this._agl);
      maxTime = new Date(this._agl);
      maxTime.setHours(
        maxTime.getHours() + parseInt(this.config.settings.timeRange[1], 10)
      );
      endTime = new Date(currentTime);
      endTime.setHours(endTime.getHours() + this._absTimeSpan);
      //console.log("weatherMapStore_new _setTimeIndices #2", endTime, maxTime);
      while (endTime <= maxTime) {
        //console.log( "weatherMapStore_new _setTimeIndices add date", this._absTimeSpan, new Date(currentTime), new Date(maxTime));
        indices.push(new Date(currentTime).getTime());
        currentTime.setHours(currentTime.getHours() + this._absTimeSpan);
        endTime.setHours(endTime.getHours() + this._absTimeSpan);
      }
    }
    if (timeSpanDir <= 0) {
      let startFrom =
        currentTimespan.includes("+") && this._agl
          ? this._agl
          : this._getStartTimeForSpan(this._dateStart);
      currentTime = new Date(startFrom);
      currentTime.setHours(currentTime.getHours() + this._absTimeSpan * -1);
      maxTime = new Date(startFrom);
      maxTime.setHours(
        maxTime.getHours() + parseInt(this.config.settings.timeRange[0], 10)
      );
      // console.log(
      //   "weatherMapStore_new _setTimeIndices #3 >= 0",
      //   currentTime,
      //   maxTime
      // );
      while (currentTime >= maxTime) {
        if (timeSpanDir != 0 || !indices.includes(currentTime.getTime()))
          indices.push(new Date(currentTime).getTime());
        currentTime.setHours(currentTime.getHours() + this._absTimeSpan * -1);
        // console.log(
        //   "weatherMapStore_new _setTimeIndices add date",
        //   currentTime,
        //   currentTime.getTime()
        // );
      }
    }
    indices.sort();
    // console.log("weatherMapStore_new _setTimeIndices: new indices", indices);
    // indices.map(aItem => {
    //   console.log(
    //     "weatherMapStore_new _setTimeIndices: new indices",
    //     new Date(aItem),
    //     aItem
    //   );
    // });
    this._availableTimes = indices;

    if (indices.includes(this._lastCurrentTime))
      this._timeIndex.set(indices.indexOf(this._lastCurrentTime));
    else this._timeIndex.set(this._findClosestIndex(indices, new Date()));
  };

  /*
    control method to check if the domain does exist in the config
  */
  checkDomainId(domainId) {
    return (
      domainId &&
      this.config &&
      this.config.domains[domainId] &&
      this.config.domains[domainId].item &&
      this.config.domains[domainId].domainIdStart
    );
  }

  /*
    setting a new active domain
  */
  @action changeDomain(domainId) {
    //console.log("weatherMapStore_new changeDomain: " + domainId);
    if (this.checkDomainId(domainId) && domainId !== this._domainId.get()) {
      this._lastCurrentTime = this.currentTime;
      this._domainId.set(domainId);
      this._timeSpan.set(null);
      this._timeIndex.set(null);
      this._agl = null;
      this._dateStart = null;

      this.changeTimeSpan(
        this.domain.item.defaultTimeSpan || this.domain.item.timeSpans[0]
      );
      this.selectedFeature = null;
    }
  }

  /*
  control method to check if the item does exist in the config
*/
  checkTimeSpan(domainId, timeSpan) {
    // console.log(
    //   "weatherMapStore_new: checktimeSpan",
    //   domainId,
    //   timeSpan,
    //   this.config.domains[domainId].item.timeSpans
    // );
    return (
      this.checkDomainId(domainId) &&
      this.config.domains[domainId].item.timeSpans.includes(timeSpan)
    );
  }

  /*
    setting a new active timeSpan
  */
  @action changeTimeSpan(timeSpan) {
    // console.log(
    //   "weatherMapStore_new changeTimeSpan: ",
    //   timeSpan,
    //   this.domainConfig
    // );
    if (
      timeSpan != this._timeSpan.get() &&
      this.checkTimeSpan(this.domainId, timeSpan)
    ) {
      this._timeIndex.set(null);
      this._agl = null;
      this._dateStart = null;
      this._timeSpan.set(timeSpan);
      this._loadDomainData();
      this.selectedFeature = null;
    } else console.error("Timespan does not exist!", timeSpan);
  }

  /*
    setting a new timeIndex
  */
  @action changeCurrentTime(timeIndex) {
    // console.log(
    //   "weatherMapStore_new: changeCurrentTime hhhh",
    //   this._timeIndex.get(),
    //   timeIndex,
    //   this._availableTimes.indexOf(timeIndex),
    //   this._availableTimes
    // );
    if (this._availableTimes.includes(timeIndex)) {
      // console.log(
      //   "weatherMapStore_new: bbb changeCurrentTime SET",
      //   new Date(timeIndex),
      //   timeIndex
      // );
      if (this._timeIndex.get() !== this._availableTimes.indexOf(timeIndex)) {
        this._timeIndex.set(this._availableTimes.indexOf(timeIndex));
        this._loadIndexData();
        this.selectedFeature = null;
      }
    } else
      console.error("timeIndex not available", timeIndex, this._availableTimes);
  }
}
