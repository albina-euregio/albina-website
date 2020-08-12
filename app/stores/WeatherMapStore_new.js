import { computed, observable, action } from "mobx";
import StationDataStore from "./stationDataStore";
import axios from "axios";
import { dateFormat } from "../util/date";

export default class WeatherMapStore_new {
  @observable _domainId;
  @observable _loading;
  @observable selectedFeature;
  config;

  constructor(initialDomainId) {
    this.config = config.weathermaps;
    this.stations = null;
    this.grid = null;
    this._domainId = observable.box(false);
    this._timeSpan = observable.box(false);
    this._dateAat6 = observable.box(false);
    this._timeIndices = [];
    this._timeIndicesIndex = observable.box(false);
    this.selectedFeature = null;
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
  _loadData() {
    this._loading.set(true);
    const loads = [
      new StationDataStore(this.currentTimeIndex).load().then(features => {
        this.stations = {
          features
        };
      }),
      axios.get(config.apis.weather.grid).then(response => {
        this.grid = response.data;
      })
    ];

    Promise.all(loads)
      .then(() => {
        this._loading.set(false);
        console.log("Weathermap_new: loaded", this);
      })
      .catch(err => {
        // TODO fail with error dialog
        console.error("Weather data API is not available", err);
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
    return this._timeIndices;
  }

  /*
    returns the start date for all calculations
  */
  @computed get startDate() {
    return this._dateAat6;
  }

  /*
    returns _loading prop
  */
  @computed get loading() {
    return this._loading.get();
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
      datePlusOffset.setHours(
        datePlusOffset.getHours() + parseInt(this._timeSpan.get(), 10)
      );
      console.log(
        "weatherMapStore_new overlayFileName:#2 ",
        datePlusOffset,
        new Date(this._timeIndices[this._timeIndicesIndex.get()]).getUTCDate()
      );

      return (
        dateFormat(datePlusOffset, "%Y-%m-%d_%H-%M", true) +
        "_" +
        this._domainId.get() +
        "_" +
        Math.abs(parseInt(this._timeSpan.get(), 10)) +
        "h"
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
    setting a new active domain
  */
  @action changeDomain(domainId) {
    console.log("weatherMapStore_new changeDomain: " + domainId);

    if (this.checkDomainId(domainId)) {
      this._domainId.set(domainId);
      this._timeSpan.set(null);
      this.changeTimeSpan(
        this.domain.item.defaultTimeSpan || this.domain.item.timeSpans[0]
      );
      this.selectedFeature = null;
    }
  }

  /*
    calc indeces for timespan
  */
  _setTimeIndices = function() {
    console.log("weatherMapStore_new _setTimeIndices: ", this._timeSpan.get());
    let indices = [];
    let currentTimespan = this._timeSpan.get();
    this._dateAat6.set(new Date());
    this._dateAat6.set(this._dateAat6.get().setUTCHours(6, 0, 0, 0));

    let currentTime = new Date(this._dateAat6.get());
    let maxTime;
    //indices.push(new Date(currentTime).getTime());
    let timeSpanDir = currentTimespan.includes("+-")
      ? 0
      : parseInt(currentTimespan, 10) > 0
      ? 1
      : -1;
    let timeSpanVal = Math.abs(parseInt(currentTimespan.replace("+-", ""), 10));

    console.log(
      "weatherMapStore_new _setTimeIndices #1",
      this._dateAat6.get(),
      timeSpanDir,
      timeSpanVal
    );

    if (timeSpanDir >= 0) {
      currentTime = new Date(this._dateAat6.get());
      maxTime = new Date(this._dateAat6.get());
      maxTime.setHours(
        maxTime.getHours() + parseInt(this.config.settings.timeRange[1], 10)
      );
      //console.log("weatherMapStore_new _setTimeIndices #2 >= 0", maxTime);
      while (currentTime < maxTime) {
        indices.push(new Date(currentTime).getTime());
        currentTime.setHours(currentTime.getHours() + timeSpanVal);
        // console.log( "weatherMapStore_new _setTimeIndices add date", new Date(currentTime), new Date(currentTime).getTime());
      }
    }
    if (timeSpanDir <= 0) {
      currentTime = new Date(this._dateAat6.get());
      maxTime = new Date(this._dateAat6.get());
      maxTime.setHours(
        maxTime.getHours() + parseInt(this.config.settings.timeRange[0], 10)
      );
      //console.log("weatherMapStore_new _setTimeIndices #3 >= 0", maxTime);
      while (currentTime > maxTime) {
        if (timeSpanDir != 0 || !indices.includes(currentTime.getTime()))
          indices.push(new Date(currentTime).getTime());
        currentTime.setHours(currentTime.getHours() + timeSpanVal * -1);
        console.log(
          "weatherMapStore_new _setTimeIndices add date",
          new Date(currentTime),
          maxTime
        );
      }
    }
    if (timeSpanDir === 0) indices.sort();
    //console.log("weatherMapStore_new _setTimeIndices: new indices", indices);
    indices.map(aItem => {
      console.log(
        "weatherMapStore_new _setTimeIndices: new indices",
        new Date(aItem)
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
      this._setTimeIndices();
      this.selectedFeature = null;
      this._loadData();
    } else console.error("Timespan does not exist!", timeSpan);
  }

  /*
    setting a new timeIndex
  */
  @action changeTimeIndex(timeIndex) {
    console.log(
      "weatherMapStore_new: changeTimeIndex",
      timeIndex,
      this._timeIndices
    );
    if (
      this._timeIndices.includes(timeIndex) &&
      this._timeIndicesIndex.get() !== this._timeIndices.indexOf(timeIndex)
    ) {
      this._timeIndicesIndex.set(this._timeIndices.indexOf(timeIndex));
      this.selectedFeature = null;
      this._loadData();
    }
  }
}
