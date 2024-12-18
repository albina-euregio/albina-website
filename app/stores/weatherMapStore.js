import { action, observable, makeAutoObservable, set } from "mobx";
import { loadStationData } from "./stationDataStore";
import { fetchJSON } from "../util/fetch";
import { dateFormat, removeMilliseconds } from "../util/date";
const SIMULATE_START = null; //"2023-11-28T22:00Z"; // for debugging day light saving, simulates certain time
const SIMULATE_NOW = null; //"2023-11-28T23:18Z"
export default class WeatherMapStore_new {
  constructor(initialDomainId) {
    this.config = config.weathermaps;
    this.stations = null;
    this.grid = null;
    this._domainId = observable.box(false);
    this._timeSpan = observable.box(false);
    this._lastDataUpdate = 0;
    this._dateStart = null;
    this._agl = null;
    this._currentTime = observable.box(null);
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
    //   "_loadDomainData #i01",
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
      ).then(
        action(retrievedDate => {
          this._dateStart = SIMULATE_START
            ? new Date(SIMULATE_START)
            : new Date(retrievedDate) ?? this._dateStart;
          //console.log("weathermapStore->loadOverlay->startDate loaded #i011", {retrievedDate, dateStartgl: this._dateStart, usedVar: (SIMULATE_START ? new Date(SIMULATE_START) : new Date(retrievedDate) ?? this._dateStart)});
        })
      ),
      fetchDate(
        config.apis.weather.overlays +
          this._domainId.get() +
          "/" +
          this.getMetaFile("startDate")
      ).then(
        action(retrievedDate => {
          this._agl = SIMULATE_START
            ? new Date(SIMULATE_START)
            : new Date(retrievedDate) ?? this._agl;
          //console.log("weathermapStore->loadOverlay->startDate loaded #i011", {retrievedDate, dateStartgl: this._agl, usedVar: (SIMULATE_START ? new Date(SIMULATE_START) : new Date(retrievedDate) ?? this._dateStart)});
        })
      )
    ];

    Promise.all(loads)
      .then(() => {
        this._loading.set(false);
        // console.log("Weathermap_new->_loadDomainData: loaded #j01", {
        //   _dateStart: this._dateStart,
        //   _lastCurrentTime: this._lastCurrentTime,
        //   _agl: this._agl,
        //   currentTime: this._getStartTimeForSpan(
        //     this._lastCurrentTime || this._dateStart
        //   )
        // });
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
    this._loading.set(true);
    this.stations = {};
    this.grid = {};
    let loads = [];

    // console.log(
    //   "_loadData this._currentTime #j01",
    //   new Date(this._currentTime)
    // );
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
    } else this.stations = [];
    if (this.domainConfig?.layer.grid) {
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
    returns all items for the active domain in a form of array
  */
  get items() {
    return this.domainId ? this.domain.item : false;
  }

  // /*
  //   returns current timeIndex
  // */
  // get currentTime() {
  //   //console.log("weatherMapStore_new currentTime: ", this._timeIndex.get());
  //   return (
  //     this._availableTimes &&
  //     this._timeIndex &&
  //     this._availableTimes[this._timeIndex.get()]
  //   );
  // }

  // /*
  //   returns all _availableTimes
  // */
  // get availableTimes() {
  //   //console.log("timeIndices GET", this._availableTimes);
  //   return this._availableTimes;
  // }

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
    //console.log("startDate", this._dateStart, (this._dateStart * 10) / 10);
    let usedDate = new Date(this._dateStart);

    // if (this._absTimeSpan === 12) {
    //   const currentHours = usedDate.getUTCHours();
    //   if ([6, 18].includes(currentHours))
    //     usedDate.setUTCHours(usedDate.getUTCHours() - 6);
    // }
    // if (this._absTimeSpan % 24 === 0) {
    //   const currentHours = usedDate.getUTCHours();
    //   if ([12].includes(currentHours))
    //     usedDate.setUTCHours(usedDate.getUTCHours() - 12);
    // }
    // console.log("weathermapStore->startDate #44", {
    //   startDate: new Date(this._dateStart).toISOString(),
    //   usedDate: usedDate.toISOString()
    // });

    return this._dateStart
      ? this._dateStart.setDate(usedDate.getDate())
      : usedDate;
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

    if (this._currentTime.get()) {
      // console.log("weatherMapStore_new overlayFileName:#1 ", {
      //   currentTime: this._currentTime.get()
      // });

      return (
        config.apis.weather.overlays +
        this._domainId.get() +
        "/" +
        dateFormat(this._currentTime.get(), "%Y-%m-%d_%H-%M", true) +
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
      res = new Date(lastUpdate).setUTCHours(
        lastUpdate.getUTCHours() + addHours
      );

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
        //console.log("snowHeight t01", pixelRGB);
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
    let temp = 0;
    const absTimeSpan = this._absTimeSpan;
    //console.log("temp#1", temp, absTimeSpan, temp % 24);
    while (temp < 24) {
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

    // console.log(
    //   "_getStartTimeForSpan #1",
    //   initDate,
    //   this._timeSpan.get(),
    //   currentTime.getUTCHours()
    // );
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
      //("_getStartTimeForSpan #2", currHours, soonerTimesToday);
      if (soonerTimesToday.length)
        foundStartHour = Math.max.apply(Math, soonerTimesToday);
      else foundStartHour = Math.max.apply(Math, timesForSpan);

      // first possible time was last day
      if (soonerTimesToday.length === 0)
        currentTime.setUTCHours(currentTime.getUTCHours() - 24);
      currentTime.setUTCHours(foundStartHour);
      // console.log(
      //   "_getStartTimeForSpan #1",{
      //     currentTimeUTC: currentTime.toUTCString(),
      //     currHours,
      //     timesForSpan,
      //     soonerTimesToday,
      //     foundStartHour
      //   });
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
    //console.log("weatherMapStore_new changeDomain: " + domainId);
    if (this.checkDomainId(domainId) && domainId !== this._domainId.get()) {
      this._lastCurrentTime = this._currentTime.get();
      this._domainId.set(domainId);
      this._timeSpan.set(null);
      //this._timeIndex.set(null);
      //this._agl = null;
      //this._dateStart = null;

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
      //this._timeIndex.set(null);
      //this._agl = null;
      //this._dateStart = null;
      this._timeSpan.set(timeSpan);
      this._loadDomainData();
      this.selectedFeature = null;
    } else console.error("Timespan does not exist!", timeSpan);
  }

  /*
    setting a new timeIndex
  */
  changeCurrentTime(newTime) {
    //console.log("weatherMapStore_new: changeCurrentTime #k0112 #k0113", {
    //   newTime: new Date(newTime),
    //   oldDate: new Date(this._currentTime.get())
    // });
    if (
      new Date(newTime).getTime() != new Date(this._currentTime.get()).getTime()
    ) {
      this._currentTime.set(newTime);
    }

    this._loadIndexData();
  }

  /*
    setting a new timeIndex
  */
  // changeCurrentTime1(timeIndex) {
  //   // console.log(
  //   //   "weatherMapStore_new: changeCurrentTime hhhh",
  //   //   this._timeIndex.get(),
  //   //   timeIndex,
  //   //   this._availableTimes.indexOf(timeIndex),
  //   //   //this._availableTimes
  //   // );
  //   if (this._availableTimes.includes(timeIndex)) {
  //     // console.log(
  //     //   "weathermap->changeCurrentTime_1 ##33",
  //     //   {timeIndex2Date: new Date(timeIndex),

  //     //   curTimeIndex: this._timeIndex.get(),
  //     //   timeIndex,
  //     //   availTimeIndex: this._availableTimes.indexOf(timeIndex)}
  //     // );
  //     if (this._timeIndex.get() !== this._availableTimes.indexOf(timeIndex)) {
  //       // console.log("weathermap->changeCurrentTime_2 ##33", timeIndex);
  //       this._timeIndex.set(this._availableTimes.indexOf(timeIndex));
  //       this._loadIndexData();
  //       this.selectedFeature = null;
  //     }
  //   } else
  //     console.error("timeIndex not available", timeIndex, this._availableTimes);
  // }
}
