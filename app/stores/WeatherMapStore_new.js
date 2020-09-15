import { computed, observable, action } from "mobx";
import StationDataStore from "./stationDataStore";
import axios from "axios";
import { dateFormat } from "../util/date";

export default class WeatherMapStore_new {
  @observable _domainId;
  @observable _loading;
  @observable selectedFeature;
  @observable _timeSpan;
  @observable _timeIndices;
  @observable stations;
  @observable domainConfig;
  config;

  constructor(initialDomainId) {
    this.config = config.weathermaps;
    this.stations = null;
    this.grid = null;
    this._domainId = observable.box(false);
    this._timeSpan = observable.box(false);
    this._dateStart = null;
    this._agl = null;
    this._timeIndices = [];
    this._timeIndicesIndex = observable.box(false);
    this.selectedFeature = null;
    this.domainConfig = null;
    this._loading = observable.box(false);

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

    console.log("_loadDomainData this.currentTimeIndex bbb");

    const loads = [
      axios
        .get(
          config.apis.weather.overlays +
            this._domainId.get() +
            "/" +
            this.config.settings.metaFiles.agl
        )
        .then(response => {
          console.log("WeatherMapStore_new->_loadData aaa: AGL");
          if (response.data.includes("T"))
            this._dateStart = new Date(response.data.trim());
        }),
      axios
        .get(
          config.apis.weather.overlays +
            this._domainId.get() +
            "/" +
            this.config.settings.metaFiles.startDate
        )
        .then(response => {
          console.log("WeatherMapStore_new->_loadData aaa: Startdate");
          if (response.data.includes("T"))
            this._agl = new Date(response.data.trim());
        })
    ];

    Promise.all(loads)
      .then(() => {
        this._loading.set(false);
        console.log("Weathermap_new->_loadDomainData: loaded aaa", this);
        this._setTimeIndices();
        this._loadIndexData();
      })
      .catch(err => {
        // TODO fail with error dialog
        console.error("Weather data API is not available aaa", err);
      });
  }

  /* 
    get data for currentTimeIndex
  */
  _loadIndexData() {
    this._loading.set(true);

    let cTI = new Date(this.currentTimeIndex);
    cTI.setHours(cTI.getHours() - 4);

    console.log(
      "_loadData this.currentTimeIndex bbb",
      new Date(this.currentTimeIndex),
      cTI
    );

    let prefix =
      this.currentTimeIndex && this.currentTimeIndex
        ? dateFormat(new Date(cTI.getTime()), "%Y-%m-%d_%H-%M", true) + "_"
        : "";
    const loads = [
      new StationDataStore().load(prefix).then(features => {
        console.log(
          "WeatherMapStore_new->_loadData aaa: StationDataStore",
          features
        );
        this.stations = {
          features
        };
      }),
      axios.get(config.apis.weather.grid).then(response => {
        console.log("WeatherMapStore_new->_loadData aaa: Grid");
        this.grid = response.data;
      })
    ];

    Promise.all(loads)
      .then(() => {
        this._loading.set(false);
        console.log("Weathermap_new->_loadIndexData: loaded bbb", this);
      })
      .catch(err => {
        // TODO fail with error dialog
        console.error("Data for timeindex not available", err);
      });
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
  @computed get currentTimeIndex() {
    return (
      this._timeIndices &&
      this._timeIndicesIndex &&
      this._timeIndices[this._timeIndicesIndex.get()]
    );
  }

  /*
    returns all _timeIndices
  */
  @computed get timeIndices() {
    console.log("timeIndices GET", this._timeIndices);
    return this._timeIndices;
  }

  /*
    returns current timespan selection
  */
  @computed get timeSpan() {
    console.log("timeSpan GET", this._timeSpan);
    return this._timeSpan;
  }

  /*
    returns the start date for all calculations
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
    if (tempTimeSpan.includes("+-"))
      tempTimeSpan = tempTimeSpan.replace("+-", "");
    return Math.abs(parseInt(tempTimeSpan, 10));
  }

  /*
    returns filename for overlay e.g.2020-07-29_06-00_diff-snow_6h
  */
  @computed get overlayFileName() {
    console.log(
      "weatherMapStore_new overlayFileName: ",
      this._domainId.get(),
      this._timeSpan.get()
    );

    if (this._timeIndicesIndex.get() != null && this._timeIndices.length > 0) {
      let datePlusOffset = new Date(
        this._timeIndices[this._timeIndicesIndex.get()]
      );
      //if(parseInt(this._timeSpan.get(), 10) > 0)
      datePlusOffset.setHours(datePlusOffset.getHours() + this._absTimeSpan);
      console.log(
        "weatherMapStore_new overlayFileName:#2 ",
        datePlusOffset,
        new Date(this._timeIndices[this._timeIndicesIndex.get()]).getUTCDate()
      );

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
  @computed get previousIndex() {
    return this._timeIndices[this._timeIndicesIndex.get() - 1]
      ? this._timeIndicesIndex.get() - 1
      : false;
  }
  /*
    returns index of active timeIndex incremented by 1
  */
  @computed get nextIndex() {
    return this._timeIndices[this._timeIndicesIndex.get() - 1]
      ? this._timeIndicesIndex.get() + 1
      : false;
  }

  /*
    returns value for pixel color
  */
  valueForPixel(overlayType, pixelRGB) {
    switch (overlayType) {
      case "temperature":
        console.log("valueForPixel", pixelRGB);
        if (pixelRGB.r <= 0) return "<59,5";
        if (pixelRGB.r >= 255) return null;
        return -59.5 + (pixelRGB.r - 1) * 0.5;
        break;
      case "windDirection":
        if (pixelRGB.r <= 0 || pixelRGB.r > 180) return null;
        return pixelRGB.r * 2;
        break;
      case "windSpeed":
        if (pixelRGB.r <= 0 || pixelRGB.r >= 255) return null;
        return pixelRGB.r;
        break;
      case "snowHeight":
        const snowHeightDef = {
          "1-0-0": -250,
          "250-0-0": -1,
          "0-0-0": 0,
          "255-255-255": 250,
          "0-0-1": 255,
          "0-0-150": 1000,
          "0-0-250": 2000,
          "0-1-0": 2020,
          "0-250-0": 7000
        };
        return (
          snowHeightDef[pixelRGB.r + "-" + pixelRGB.g + "-" + pixelRGB.b] ||
          null
        );
        break;
      default:
        return null;
        break;
    }
  }

  /*
    calc indeces for timespan
  */
  _setTimeIndices = function() {
    //console.log("weatherMapStore_new _setTimeIndices: ", this._timeSpan.get());
    let indices = [];
    let currentTimespan = this._timeSpan.get();

    let currentTime = new Date(this._dateStart);
    let maxTime;
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
      currentTime = new Date(this._agl);
      maxTime = new Date(this._agl);
      maxTime.setHours(
        maxTime.getHours() + parseInt(this.config.settings.timeRange[1], 10)
      );
      //console.log("weatherMapStore_new _setTimeIndices #2 >= 0", maxTime);
      while (currentTime < maxTime) {
        indices.push(new Date(currentTime).getTime());
        currentTime.setHours(currentTime.getHours() + this._absTimeSpan);
        // console.log( "weatherMapStore_new _setTimeIndices add date", new Date(currentTime), new Date(currentTime).getTime());
      }
    }
    if (timeSpanDir <= 0) {
      currentTime = new Date(this._dateStart);
      maxTime = new Date(this._dateStart);
      maxTime.setHours(
        maxTime.getHours() + parseInt(this.config.settings.timeRange[0], 10)
      );
      //console.log("weatherMapStore_new _setTimeIndices #3 >= 0", maxTime);
      while (currentTime > maxTime) {
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
    if (timeSpanDir === 0) indices.sort();
    console.log("weatherMapStore_new _setTimeIndices: new indices", indices);
    indices.map(aItem => {
      console.log(
        "weatherMapStore_new _setTimeIndices: new indices",
        new Date(aItem),
        aItem
      );
    });
    this._timeIndices = indices;
    this._timeIndicesIndex.set(0);
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
    console.log("weatherMapStore_new changeDomain: " + domainId);

    if (this.checkDomainId(domainId) && domainId !== this._domainId.get()) {
      this._domainId.set(domainId);
      this._timeSpan.set(null);
      this.changeTimeSpan(
        this.domain.item.defaultTimeSpan || this.domain.item.timeSpans[0]
      );
      this.domainConfig = this.config.domains[domainId].item;
      this.selectedFeature = null;
    }
  }

  /*
  control method to check if the item does exist in the config
*/
  checkTimeSpan(domainId, timeSpan) {
    console.log(
      "weatherMapStore_new: checktimeSpan",
      domainId,
      timeSpan,
      this.config.domains[domainId].item.timeSpans
    );
    return (
      this.checkDomainId(domainId) &&
      this.config.domains[domainId].item.timeSpans.includes(timeSpan)
    );
  }

  /*
    setting a new active timeSpan
  */
  @action changeTimeSpan(timeSpan) {
    console.log("weatherMapStore_new changeTimeSpan: " + timeSpan);
    if (
      timeSpan != this._timeSpan.get() &&
      this.checkTimeSpan(this.domainId, timeSpan)
    ) {
      this._timeIndicesIndex.set(0);
      this._timeSpan.set(timeSpan);
      this._loadDomainData();
      this.selectedFeature = null;
    } else console.error("Timespan does not exist!", timeSpan);
  }

  /*
    setting a new timeIndex
  */
  @action changeTimeIndex(timeIndex) {
    console.log(
      "weatherMapStore_new: changeTimeIndex bbb",
      timeIndex,
      this._timeIndices
    );
    if (
      this._timeIndices.includes(timeIndex) &&
      this._timeIndicesIndex.get() !== this._timeIndices.indexOf(timeIndex)
    ) {
      this._timeIndicesIndex.set(this._timeIndices.indexOf(timeIndex));
      this._loadIndexData();
      this.selectedFeature = null;
    }
  }
}
