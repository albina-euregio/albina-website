import Base from "./base.js";
import { observable, action, computed, toJS } from "mobx";
import { parseDate } from "./util/date.js";

class BulletinCollection {
  date;
  status;
  statusMessage;
  dataRaw;
  geodata;

  constructor(date) {
    this.date = date;
    this.status = "pending";
    this.statusMessage = "";
    this.dataRaw = null;
    this.geodata = {};
  }

  get regions() {
    if (this.status != "ok") {
      return [];
    }

    return []; // TODO implement
  }

  get problems() {
    if (this.status != "ok") {
      return [];
    }

    return []; // TODO implement
  }

  get publicationDate() {
    // return maximum of all publicationDates
    if (this.status == "ok" && this.dataRaw.length > 0) {
      return this.dataRaw
        .map(b => {
          return parseDate(b.publicationDate);
        })
        .reduce((acc, d) => {
          return d > acc ? d : acc;
        }, new Date(0));
    }

    return null;
  }

  get length() {
    return this.dataRaw ? this.dataRaw.length : 0;
  }

  hasDaytimeDependency() {
    if (this.status == "ok" && this.dataRaw.length > 0) {
      return this.dataRaw.reduce((acc, b) => {
        return acc || b.hasDaytimeDependency;
      }, false);
    }
    return false;
  }

  getData() {
    return this.dataRaw;
  }

  getGeoData() {
    return this.geodata;
  }

  setData(data) {
    this.dataRaw = data;
    this.status =
      typeof data === "object" ? (data.length > 0 ? "ok" : "empty") : "n/a";
  }

  setStatusData(data) {
    if (typeof data === "object" && data.length == 1 && data[0].status) {
      const st = data[0].status;
      if (st != "published" && st != "republished") {
        this.status = "empty";
      }
      this.statusMessage = st;
    } else {
      this.status = "n/a";
      this.statusMessage = "";
    }
  }

  setGeoData(data) {
    if (typeof data === "object") {
      this.geodata = data;
    }
  }

  toString() {
    return JSON.stringify(this.dataRaw);
  }
}

class BulletinStore {
  // TODO: add language support
  @observable mapCenter = [15, 50];
  @observable mapZoom = 12;
  @observable bulletins = {};
  settings = {};
  problems = {};

  constructor() {
    this.settings = observable({
      status: "",
      date: "",
      region: "",
      ampm: config.get("defaults.ampm")
    });
    this.bulletins = {};

    this.problems = observable({
      new_snow: { active: true },
      wind_drifted_snow: { active: true },
      weak_persistent_layer: { active: true },
      wet_snow: { active: true },
      gliding_snow: { active: true }
    });

    this.mapCenter = observable.box([47, 12]);
    this.mapZoom = observable.box(9);
  }

  /**
   * Load a bulletin from the APIs and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @param activate A flag to indicate, if the bulletin should be activated.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  @action
  load(date, activate = true) {
    if (date) {
      if (this.bulletins[date]) {
        if (activate) {
          this.activate(date);
        }
      } else {
        // create empty bulletin entry
        this.bulletins[date] = new BulletinCollection(date);

        if (activate) {
          this.activate(date);
        }

        /*
         * First load status data. If status is 'published' or 'republished',
         * continue loading bulletin data and then load GeoJSON(s) in parallel.
         */
        return this._loadBulletinStatus(date)
          .then(() => {
            if (this.bulletins[date].status == "pending") {
              // bulletin status still pending -> need to load data
              return this._loadBulletinData(date);
            }
          })
          .then(() => {
            if (this.bulletins[date].status == "ok") {
              if (this.bulletins[date].hasDaytimeDependency()) {
                // only request 'am' geojson - 'pm' has same geometries, only
                // different properties which are irrelevant here
                return this._loadGeoData(date, "am");
              }
              // else
              return this._loadGeoData(date);
            }
          })
          .then(() => {
            if (activate && this.settings.date == date) {
              // reactivate to notify status change
              this.activate(date);
            }
          });
      }
    }
  }

  /**
   * Activate bulletin collection for a given date.
   * @param date The date in yyyy-mm-dd format.
   */
  @action
  activate(date) {
    if (this.bulletins[date]) {
      this.settings.region = "";
      this.settings.date = date;
      this.settings.status = this.bulletins[date].status;

      if (this.bulletins[date].length == 1) {
        // TODO: filter by problem!!!
        let b = this.bulletins[date].getData();
        this.setRegion(b[0].id);
      }
    }
  }

  // TODO move to map store
  @action
  setMapViewport(mapState) {
    this.mapCenter.set(mapState.center);
    this.mapZoom.set(mapState.zoom);
  }

  /**
   * Increase or decrease the zoom value of the bulletin map.
   * TODO: move to map store
   */
  @action
  zoomIn() {
    this.mapZoom.set(this.mapZoom + 1);
  }
  @action
  zoomOut() {
    this.mapZoom.set(this.mapZoom - 1);
  }

  /**
   * Set the current active 'am'/'pm' state.
   * @param ampm A string 'am' or 'pm'.
   */
  @action
  setAmPm(ampm) {
    switch (ampm) {
      case "am":
      case "pm":
        this.settings.ampm = ampm;
        break;

      default:
        break;
    }
  }

  @action
  setRegion(id) {
    this.settings.region = id;
  }

  @action
  excludeProblem(problemId) {
    if (typeof this.problems[problemId] !== "undefined") {
      this.problems[problemId].active = false;
    }
  }

  @action
  includeProblem(problemId) {
    if (typeof this.problems[problemId] !== "undefined") {
      this.problems[problemId].active = true;
    }
  }

  /**
   * Get the bulletins that match the current selection.
   * @return A list of bulletins that match the selection of
   *   this.date and this.ampm
   */
  get activeBulletinCollection() {
    if (this.settings.status == "ok") {
      return this.bulletins[this.settings.date];
    }
    return null;
  }

  /**
   * Get the bulletin that is relevant for the currently set region.
   * @return A bulletin object that matches the selection of
   *   this.date, this.ampm and this.region
   */
  get activeBulletin() {
    return this.getBulletinForRegion(this.settings.region);
  }

  getBulletinForRegion(regionId) {
    const collection = this.activeBulletinCollection;

    if (collection && collection.length > 0) {
      return collection.getData().find(el => {
        return el.id == regionId;
      });
    }

    return null;
  }

  getProblemsForRegion(regionId) {
    const problems = [];
    const b = this.getBulletinForRegion(regionId);
    const daytime =
      b.hasDaytimeDependency && this.settings.ampm == "pm"
        ? "afternoon"
        : "forenoon";
    const daytimeBulletin = b[daytime];

    if (daytimeBulletin && daytimeBulletin.avalancheSituation1) {
      problems.push(daytimeBulletin.avalancheSituation1.avalancheSituation);
    }
    if (daytimeBulletin && daytimeBulletin.avalancheSituation2) {
      problems.push(daytimeBulletin.avalancheSituation2.avalancheSituation);
    }
    return problems;
  }

  // deprecated
  @computed
  get activeVectorLayer() {
    const collection = this.activeBulletinCollection;

    if (collection && collection.length > 0) {
      // clone original geojson
      const data = Object.assign({}, collection.getGeoData());

      // filter features to exclude regions with disabled problems
      const features = data.features;
      const newFeatures = features.filter(f => {
        const problems = this.getProblemsForRegion(f.properties.bid);
        const active =
          problems.length == 0 || problems.some(p => this.problems[p].active);
        return active;
      });

      data.features = newFeatures; // replace with filtered data;

      return data;
    }
    return null;
  }

  @computed
  get vectorRegions() {
    const collection = this.activeBulletinCollection;

    if (collection && collection.length > 0) {
      // clone original geojson
      const clonedGeojson = Object.assign({}, collection.getGeoData());

      return clonedGeojson.features.map(f => {
        let state = "default";
        const bid = f.properties.bid;

        const problems = this.getProblemsForRegion(bid);
        if (
          problems.length === 0 ||
          problems.some(p => this.problems[p].active)
        ) {
          if (this.settings.region) {
            if (this.settings.region === bid) {
              state = "selected";
            } else {
              state = "dimmed";
            }
          } else {
            state = "default";
          }
        } else {
          state = "hidden";
        }

        f.properties.state = state;
        return f;
      });
    } else {
      return [];
    }
  }

  /**
   * Returns leaflet encoded value for map center
   */
  @computed
  get getMapCenter() {
    return toJS(this.mapCenter);
  }

  @computed
  get getMapZoom() {
    return toJS(this.mapZoom);
  }

  _loadBulletinData(date) {
    const dateParam = encodeURIComponent(date + "T00:00:00+02:00");
    const url = config.get("apis.bulletin") + "?date=" + dateParam;

    return Base.doRequest(url).then(
      // query bulletin data
      response => {
        this.bulletins[date].setData(JSON.parse(response));
      },
      error => {
        console.error("Cannot load bulletin for date " + date + ": " + error);
        this.bulletins[date].setData(null);
      }
    );
  }

  _loadBulletinStatus(date) {
    const dateParam = encodeURIComponent(date + "T00:00:00+02:00");
    const url =
      config.get("apis.bulletin") +
      "/status?startDate=" +
      dateParam +
      "&endDate=" +
      dateParam +
      "&region=IT-32-BZ";

    return Base.doRequest(url).then(
      // query status data
      response => {
        this.bulletins[date].setStatusData(JSON.parse(response));
      },
      error => {
        console.error(
          "Cannot load bulletin status for date " + date + ": " + error
        );
        this.bulletins[date].setStatusData(null);
      }
    );
  }

  _loadGeoData(date, daytime = null) {
    // API uses daytimes 'am', 'pm' and 'fd' ('full day')
    const d = daytime ? daytime : "fd";
    const url = config.get("apis.geo") + date + "/" + d + "_regions.json";
    return Base.doRequest(url).then(
      // query vector data
      response => {
        this.bulletins[date].setGeoData(JSON.parse(response), daytime);
      },
      error => {
        console.error("Cannot load geo data for date " + date + ": " + error);
        this.bulletins[date].setGeoData(null, daytime);
      }
    );
  }
}

export { BulletinStore, BulletinCollection };
