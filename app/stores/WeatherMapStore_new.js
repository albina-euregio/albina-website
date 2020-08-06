import { computed, observable, action } from "mobx";
import StationDataStore from "./stationDataStore";
import axios from "axios";

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
    this._timeIndices = observable.box(false);
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
    returns _loading prop
  */
  @computed get loading() {
    return this._loading.get();
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
    let dateAt6 = new Date();
    dateAt6.setUTCHours(6, 0, 0, 0);
    let maxTime = new Date(dateAt6);
    maxTime.setHours(
      maxTime.getHours() +
        parseInt(
          this.config.settings.timeRange[this._timeSpan.get() > 0 ? 1 : 0],
          10
        )
    );
    console.log(
      "weatherMapStore_new _setTimeIndices",
      dateAt6,
      maxTime,
      parseInt(
        this.config.settings.timeRange[this._timeSpan.get() > 0 ? 1 : 0],
        10
      )
    );
    let currentTime = dateAt6;
    indices.push(new Date(currentTime));

    if (this._timeSpan.get() > 0) {
      while (currentTime < maxTime) {
        currentTime.setHours(
          currentTime.getHours() + parseInt(this._timeSpan.get(), 10)
        );
        indices.push(new Date(currentTime).getTime());
        console.log(
          "weatherMapStore_new _setTimeIndices add date",
          new Date(currentTime),
          new Date(currentTime).getTime()
        );
      }
    } else {
      while (currentTime > maxTime) {
        currentTime.setHours(
          currentTime.getHours() + parseInt(this._timeSpan.get(), 10)
        );
        indices.push(new Date(currentTime).getTime());
        console.log(
          "weatherMapStore_new _setTimeIndices add date",
          new Date(currentTime),
          new Date(currentTime).getTime()
        );
      }
    }
    console.log("weatherMapStore_new _setTimeIndices: new indices", indices);
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
    }
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
