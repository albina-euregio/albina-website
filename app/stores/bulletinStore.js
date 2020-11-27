import ArchiveStore from "./archiveStore.js";
import neighborRegions from "./neighbor_regions.geojson.json";
import { observable, action } from "mobx";
import { parseDate, getSuccDate, dateToISODateString } from "../util/date.js";

import { GeoJSON, Util } from "leaflet";
import axios from "axios";
import { convertCaamlToJson, toDaytimeBulletins } from "./caaml.js";

class BulletinCollection {
  date;
  status;
  statusMessage;
  /**
   * @type {Caaml.Bulletins}
   */
  dataRaw;
  /**
   * @type {Albina.DaytimeBulletin[]}
   */
  daytimeBulletins;
  geodata;

  constructor(date) {
    this.date = date;
    this.status = "pending";
    this.statusMessage = "";
    this.dataRaw = null;
    this.daytimeBulletins = [];
    this.geodata = {};
  }

  get regions() {
    return this.daytimeBulletins.map(el => el.id);
  }

  get publicationDate() {
    // return maximum of all publicationDates
    if (this.status == "ok" && this.length > 0) {
      return this.daytimeBulletins
        .map(b => {
          return parseDate(b.forenoon.publicationTime);
        })
        .reduce((acc, d) => {
          return d > acc ? d : acc;
        }, new Date(0));
    }

    return null;
  }

  get length() {
    return this.daytimeBulletins.length;
  }

  hasDaytimeDependency() {
    return this.daytimeBulletins.some(b => b.hasDaytimeDependency);
  }

  getBulletinForRegion(regionId) {
    return this.daytimeBulletins.find(el => el.id == regionId);
  }

  getBulletinForMicroRegion(regionId) {
    return this.daytimeBulletins.find(el =>
      el.forenoon.regions.find(r => r.id === regionId)
    );
  }

  getData() {
    return this.dataRaw;
  }

  getGeoData() {
    return this.geodata;
  }

  setData(data) {
    this.dataRaw = convertCaamlToJson(data);
    this.daytimeBulletins = toDaytimeBulletins(this.dataRaw?.bulletins || []);
    if (APP_DEV_MODE) console.log(this.dataRaw);
    this.status =
      typeof this.dataRaw === "object" && this.dataRaw && this.dataRaw.bulletins
        ? this.dataRaw.bulletins.length > 0
          ? "ok"
          : "empty"
        : "n/a";
  }

  cancelLoad() {
    this.status = "empty";
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
  /**
   * @type {Record<date, BulletinCollection>}
   */
  @observable bulletins = {};
  @observable latest = null;
  settings = {};
  /**
   * @type {Record<Caaml.AvalancheProblemType, {highlighted: boolean}}
   */
  problems = {};

  constructor() {
    if (!window["archiveStore"]) {
      window["archiveStore"] = new ArchiveStore();
    }
    this.archiveStore = window["archiveStore"];

    this.settings = observable({
      status: "",
      date: "",
      region: ""
    });
    this.bulletins = {};

    this.problems = observable({
      new_snow: { highlighted: false },
      wind_drifted_snow: { highlighted: false },
      persistent_weak_layers: { highlighted: false },
      wet_snow: { highlighted: false },
      gliding_snow: { highlighted: false }
    });

    this._latestBulletinChecker();
  }

  @action _latestBulletinChecker() {
    const now = new Date();
    const today = dateToISODateString(now);
    const tomorrow = dateToISODateString(getSuccDate(now));
    const url = this._getBulletinUrl(tomorrow);
    axios.head(url).then(
      () => (this.latest = tomorrow),
      () => (this.latest = today)
    );
    window.setTimeout(
      () => this._latestBulletinChecker(),
      config.bulletin.checkForLatestInterval * 60000
    );
  }

  /**
   * Load a bulletin from the APIs and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @param activate A flag to indicate, if the bulletin should be activated.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  @action load(date, activate = true) {
    if (APP_DEV_MODE) console.log("loading bulletin", { date, activate });
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
         * First check status data (via archiveStore). If status is 'ok'
         * (i.e. 'published' or 'republished'),
         * continue loading bulletin data and then load GeoJSON.
         *
         * NOTE: It would (in principle) be possible to load GeoJSON and
         * bulletin data in parallel (using Promise.all). However GeoJSON
         * filename conventions use 'fd_...' for non-time-dependent bulletins.
         * Therefore, we have to check daytime dependency before being able to
         * determine the correct url.
         */
        return this.archiveStore
          .load(date)
          .then(() => {
            const status = this.archiveStore.getStatus(date);
            if (APP_DEV_MODE) console.log("loaded bulletin", { date, status });
            if (status == "ok") {
              return this._loadBulletinData(date);
            } else {
              this.bulletins[date].cancelLoad();
            }
          })
          .then(() => {
            if (this.bulletins[date].status == "ok") {
              // bulletin data has been loaded, continue with GeoJSON
              if (this.bulletins[date].hasDaytimeDependency()) {
                // only request 'am' geojson - 'pm' has same geometries, only
                // different properties which are irrelevant here
                return this._loadGeoData(date, "am");
              }
              // else (this will load the 'fd' geojson)
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
  @action activate(date) {
    if (this.bulletins[date]) {
      this.settings.region = "";
      this.settings.date = date;
      this.settings.status = this.bulletins[date].status;

      /*
      if (this.bulletins[date].length === 1) {
        // TODO: filter by problem!!!
        let b = this.bulletins[date].getData();
        this.setRegion(b[0].id);
      }
      */
    }
  }

  @action setRegion(id) {
    this.settings.region = id;
  }

  @action dimProblem(problemId) {
    if (typeof this.problems[problemId] !== "undefined") {
      this.problems[problemId].highlighted = false;
    }
  }

  @action highlightProblem(problemId) {
    if (typeof this.problems[problemId] !== "undefined") {
      this.problems[problemId].highlighted = true;
    }
  }

  /**
   * Get the bulletins that match the current selection.
   * @return {BulletinCollection} A list of bulletins that match the selection of
   *   this.date and this.ampm
   */
  get activeBulletinCollection() {
    if (this.settings.status == "ok") {
      return this.bulletins[this.settings.date];
    }
    return null;
  }

  /**
   *
   *
   */
  get activeBulletinValid() {
    return (
      !!this.activeBulletinCollection &&
      this.vectorRegions.length &&
      this.vectorRegions.length > 0
    );
  }

  /**
   * Get the bulletin that is relevant for the currently set region.
   * @return {Albina.DaytimeBulletin} A bulletin object that matches the selection of
   *   this.date, this.ampm and this.region
   */
  get activeBulletin() {
    if (this.activeBulletinCollection) {
      return this.activeBulletinCollection.getBulletinForRegion(
        this.settings.region
      );
    }
    return null;
  }

  get activeNeighbor() {
    return neighborRegions.features.find(
      f => f.properties.bid === this.settings.region
    );
  }

  getProblemsForRegion(regionId, ampm = null) {
    if (!this.activeBulletinCollection) {
      return [];
    }
    const bulletin = this.activeBulletinCollection.getBulletinForRegion(
      regionId
    );
    if (!bulletin) {
      return [];
    }
    const daytime =
      bulletin.hasDaytimeDependency && ampm == "pm" ? "afternoon" : "forenoon";
    return bulletin[daytime].avalancheProblems || [];
  }

  getRegionState(regionId, ampm = null) {
    if (this.settings.region && this.settings.region === regionId) {
      return "selected";
    }
    if (this.settings.region) {
      // some other region is selected
      return "dimmed";
    }

    const checkHighlight = rId => {
      const problems = this.getProblemsForRegion(rId, ampm);
      return problems.some(p => this.problems?.[p.type]?.highlighted);
    };

    if (checkHighlight(regionId)) {
      return "highlighted";
    }

    // dehighligt if any filter is activated
    if (Object.keys(this.problems).some(p => this.problems[p].highlighted)) {
      return "dehighlighted";
    }
    return "default";
  }

  get neighborRegions() {
    return neighborRegions.features.map(f => this._augmentFeature(f));
  }

  _augmentFeature(f, ampm = null) {
    f.properties.state = this.getRegionState(f.properties.bid, ampm);
    if (!f.properties.latlngs) {
      f.properties.latlngs = GeoJSON.coordsToLatLngs(
        f.geometry.coordinates,
        f.geometry.type === "Polygon" ? 1 : 2
      );
    }
    if (!f.properties.bid) {
      f.properties.bid = f.properties.NUTS2_area;
    }
    return f;
  }

  // assign states to regions
  getVectorRegions(ampm = null) {
    const collection = this.activeBulletinCollection;

    if (collection && collection.length > 0) {
      // clone original geojson
      const clonedGeojson = Object.assign({}, collection.getGeoData());

      const regions = (clonedGeojson.features || []).map(f =>
        this._augmentFeature(f, ampm)
      );

      const states = [
        "selected",
        "highlighted",
        "dehighlighted",
        "dimmed",
        "default"
      ];
      regions.sort((r1, r2) => {
        return states.indexOf(r1.properties.state) <
          states.indexOf(r2.properties.state)
          ? 1
          : -1;
      });
      return regions;
    } else {
      return [];
    }
  }

  _getBulletinUrl(date) {
    return Util.template(
      config.links.downloads.base + config.links.downloads.xml,
      {
        date,
        lang: window["appStore"].language
      }
    );
  }

  _loadBulletinData(date) {
    const url = this._getBulletinUrl(date);
    return axios.get(url, { responseType: "document" }).then(
      // query bulletin data
      response => {
        this.bulletins[date].setData(response.data);
      },
      error => {
        console.error("Cannot load bulletin for date " + date, error);
        this.bulletins[date].setData(null);
      }
    );
  }

  _loadGeoData(date, daytime = null) {
    // API uses daytimes 'am', 'pm' and 'fd' ('full day')
    const d = daytime || "fd";
    const publicationDate =
      this.bulletins[date] && this.bulletins[date].publicationDate
        ? this.bulletins[date].publicationDate.getTime()
        : Date.now();
    const url =
      config.apis.geo + date + "/" + d + "_regions.json?" + publicationDate;

    return axios.get(url).then(
      // query vector data
      response => {
        this.bulletins[date].setGeoData(response.data, daytime);
      },
      error => {
        console.error("Cannot load geo data for date " + date, error);
        this.bulletins[date].setGeoData(null, daytime);
      }
    );
  }
}

export { BulletinStore, BulletinCollection };
