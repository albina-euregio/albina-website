import { action, observable, makeAutoObservable } from "mobx";
import StationDataStore from "./stationDataStore";
import { fetchJSON } from "../util/fetch";
import { dateFormat, isSummerTime } from "../util/date";

export default class WeatherMapStore_new {
  constructor(initialDomainId) {
    this.config = config.weathermaps;
    this.stations = null;
    this.grid = null;
    this._domainId = observable.box(false);
    this._timeSpan = observable.box(false);
    this._startUTCHourForTimespans;
    this._lastDataUpdate = 0;
    this._dateStart = null;
    this._agl = null;
    this._availableTimes = [];
    this._timeIndex = observable.box(false);
    this.selectedFeature = null;
    this._loading = observable.box(false);
    this._lastCurrentTime = null;

    // makeObservable(this, {
    //   _domainId: observable,
    //   _loading: observable,
    //   selectedFeature: observable,
    //   _timeSpan: observable,
    //   _availableTimes: observable,
    //   stations: observable,
    //   _agl: observable,
    //   _dateStart: observable,
    //   _lastDataUpdate: observable,
    //   config: observable,
    //   changeDomain: action,
    //   _getStartTimeForSpan: action,
    //   changeTimeSpan: action,
    //   changeCurrentTime: action,
    //   _loadDomainData: action,
    //   lastUpdateTime: computed,
    //   domainId: computed,
    //   items: computed,
    //   currentTime: computed,
    //   availableTimes: computed,
    //   timeSpan: computed,
    //   startDate: computed,
    //   agl: computed,
    //   loading: computed,
    //   overlayFileName: computed,
    //   previousTime: computed,
    //   nextTime: computed,
    //   currentIndex: computed,
    //   domainConfig: computed,
    //   nextUpdateTime: computed
    // });
    makeAutoObservable(this);

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
    this._loading.set(true);
    this._lastDataUpdate = 0;
    // console.log(
    //   "_loadDomainData bbb",
    //   this._domainId,
    //   config.apis.weather.overlays +
    //     this._domainId.get() +
    //     "/" +
    //     this.getMetaFile("agl")
    // );

    const fetchDate = async url => {
      const response = await fetch(url);
      if (!response.ok) throw Error(response.statusText);
      this.lastUpdateTime = response.headers.get("last-modified");
      const date = await response.text();
      return date.includes("T") ? new Date(date.trim()).getTime() : undefined;
    };

    const loads = [
      fetchDate(
        config.apis.weather.overlays +
          this._domainId.get() +
          "/" +
          this.getMetaFile("agl")
      ).then(action(date => (this._dateStart = date ?? this._dateStart))),
      fetchDate(
        config.apis.weather.overlays +
          this._domainId.get() +
          "/" +
          this.getMetaFile("startDate")
      ).then(action(date => (this._agl = date ?? this._agl)))
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
    this.stations = {};
    this.grid = {};
    let loads = [];

    // console.log(
    //   "_loadData this.currentTime bbb",
    //   new Date(this.currentTime),
    //   prefix
    // );
    if (
      this.domainConfig &&
      this.domainConfig.layer.stations &&
      this.currentTime < this._agl
    ) {
      loads.push(
        new StationDataStore()
          .load(this.currentTime ? new Date(this.currentTime) : undefined)
          .then(action(features => (this.stations = { features })))
      );
    } else this.stations = [];
    if (this.domainConfig && this.domainConfig.layer.grid) {
      loads.push(
        fetchJSON(config.apis.weather.grid).then(response => {
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
    returns lastUpdateTime
  */
  get lastUpdateTime() {
    //console.log("get lastUpdateTime kkk", this._lastDataUpdate);
    return this._lastDataUpdate;
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
    returns the active domain id
  */
  get domainId() {
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
  get items() {
    return this.domainId ? this.domain.item : false;
  }

  /*
    returns current timeIndex
  */
  get currentTime() {
    return (
      this._availableTimes &&
      this._timeIndex &&
      this._availableTimes[this._timeIndex.get()]
    );
  }

  /*
    returns all _availableTimes
  */
  get availableTimes() {
    //console.log("timeIndices GET", this._availableTimes);
    return this._availableTimes;
  }

  /*
    returns current timespan selection
  */
  get timeSpan() {
    //console.log("timeSpan GET", this._timeSpan);
    return this._timeSpan.get();
  }

  /*
    returns the start date for history information
  */
  get startDate() {
    return this._dateStart;
  }

  /*
    returns the agl (ausgangslage) date for all calculations
  */
  get agl() {
    return this._agl;
  }

  /*
    returns _loading prop
  */
  get loading() {
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
  get overlayFileName() {
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
  get previousTime() {
    return this._availableTimes[this._timeIndex.get() - 1]
      ? this._availableTimes[this._timeIndex.get() - 1]
      : this._availableTimes[this._availableTimes.length - 1];
  }
  /*
    returns index of active timeIndex incremented by 1
  */
  get nextTime() {
    //console.log("nextTime xxx1", this._availableTimes, this._timeIndex.get());
    return this._availableTimes[this._timeIndex.get() + 1]
      ? this._availableTimes[this._timeIndex.get() + 1]
      : this._availableTimes[0];
  }

  /*
    returns currentIndex
  */
  get currentIndex() {
    return this._timeIndex.get();
  }

  /*
    returns currentIndex
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
      case "snowLine":
        // console.log("valueForPixel", pixelRGB, pixelRGB.r * 50);
        if (pixelRGB.r < 0 || pixelRGB.r >= 100) res = null;
        else res = pixelRGB.r * 50;
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
    let foundItem = arr.reduce(function (prev, curr) {
      return Math.abs(curr - needle) < Math.abs(prev - needle) ? curr : prev;
    });
    return arr.indexOf(foundItem) || 0;
  }

  /*
    Get hours of day for current timespan settings
  */
  _getPossibleTimesForSpan() {
    let posTimes = [];
    let temp = this._startUTCHourForTimespans;
    const absTimeSpan = this._absTimeSpan;
    //console.log("temp#1", temp, absTimeSpan, temp % 24);
    while (temp < 24 + this._startUTCHourForTimespans) {
      posTimes.push(temp < 24 ? temp : temp - 24);
      temp = temp + absTimeSpan;
      //console.log("temp#2", temp, temp % 24);
    }
    //console.log("posTimes", posTimes);
    return posTimes;
  }

  /*
    Calculate startdate for current timespan
  */
  _getStartTimeForSpan(initDate) {
    let currentTime = new Date(initDate);
    //currentTime.setUTCHours(currentTime.getUTCHours() - 6);
    //console.log("_getStartTimeForSpan #1", currentTime.getUTCHours(), isSummerTime(currentTime), currentTime.toUTCString(), this._timeSpan.get());

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
      currentTime.getUTCHours() !== this._startUTCHourForTimespans
    ) {
      let foundStartHour;
      const currHours = currentTime.getUTCHours();
      const timesForSpan = this._getPossibleTimesForSpan();
      const soonerTimesToday = timesForSpan.filter(aTime => aTime < currHours);
      if (soonerTimesToday.length)
        foundStartHour = Math.max.apply(Math, soonerTimesToday);
      else foundStartHour = Math.max.apply(Math, timesForSpan);

      // last possible time was last day
      if (soonerTimesToday.length === 0)
        currentTime.setUTCHours(currentTime.getUTCHours() - 24);

      if (isSummerTime(currentTime)) currentTime.setUTCHours(foundStartHour);
      else currentTime.setUTCHours(foundStartHour + 1);
      //console.log("_getStartTimeForSpan #2", currentTime);
      //console.log("_getStartTimeForSpan #3", currentTime, foundStartHour, timesForSpan, soonerTimes);
    }
    // console.log("_getStartTimeForSpan #2", ["+24", "+48", "+72"].includes(this._timeSpan.get()), this._timeSpan.get(), this.config.settings.startUTCHourForTimespans, currentTime.getUTCHours(), this.config);
    return currentTime;
  }

  /*
    calc indeces for timespan
  */
  _setAvailableTimes() {
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
      //console.log("_setAvailableTimes->this._agl", this._agl);
      // console.log(
      //   "_setAvailableTimes->this._getStart",
      //   this._getStartTimeForSpan(this._dateStart)
      // );
      currentTime = new Date(startFrom);
      //console.log("_setAvailableTimes->currentTime#1", currentTime);
      currentTime.setHours(currentTime.getHours() + this._absTimeSpan * -1);
      //console.log("_setAvailableTimes->currentTime#2", currentTime);
      maxTime = new Date(startFrom);
      //console.log("_setAvailableTimes->maxTime", maxTime);
      maxTime.setHours(
        maxTime.getHours() + parseInt(this.config.settings.timeRange[0], 10)
      );
      // if (maxTime. > startFrom)
      maxTime.setHours(maxTime.getHours() - this._absTimeSpan);
      // console.log(
      //   "weatherMapStore_new _setTimeIndices #3 >= 0",
      //   currentTime,
      //   maxTime
      // );
      while (currentTime >= maxTime) {
        if (timeSpanDir != 0 || !indices.includes(currentTime.getTime())) {
          indices.push(new Date(currentTime).getTime());
        }
        const lastTime = new Date(currentTime.getTime());
        currentTime.setHours(currentTime.getHours() + this._absTimeSpan * -1);
        //fix summertime and wintertime change bug
        if (currentTime.toUTCString() === lastTime.toUTCString()) {
          //console.log("weatherMapStore_new _setTimeIndices FIX BUG",);
          currentTime.setHours(currentTime.getHours() + this._absTimeSpan * -2);
        }
        // console.log(
        //   "weatherMapStore_new _setTimeIndices add date",
        //   currentTime.getHours() + this._absTimeSpan * -1,
        //   currentTime,
        //   this._absTimeSpan,
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
  }

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
  changeDomain(domainId) {
    //console.log("weatherMapStore_new changeDomain: " + domainId);
    if (this.checkDomainId(domainId) && domainId !== this._domainId.get()) {
      this._lastCurrentTime = this.currentTime;
      this._domainId.set(domainId);
      this._startUTCHourForTimespans =
        this.config.domains[domainId]?.startUTCHourForTimespans ||
        this.config.settings.startUTCHourForTimespans;
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
  changeTimeSpan(timeSpan) {
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
  changeCurrentTime(timeIndex) {
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
