import { observable, action } from "mobx";
import { parseDate, getSuccDate, dateToISODateString } from "../util/date.js";

import { GeoJSON, Util } from "leaflet";
import { convertCaamlToJson, toDaytimeBulletins } from "./caaml.js";
import { fetchText } from "../util/fetch.js";

import { decodeFeatureCollection } from "../util/polyline.js";
import encodedMicroRegions from "./micro_regions.polyline.json";
import encodedNeighborRegions from "./neighbor_regions.polyline.json";
const microRegions = decodeFeatureCollection(encodedMicroRegions);
const neighborRegions = decodeFeatureCollection(encodedNeighborRegions);

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

  constructor(date) {
    this.date = date;
    this.status = "pending";
    this.statusMessage = "";
    this.dataRaw = null;
    this.daytimeBulletins = [];
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
    return (
      this.daytimeBulletins.find(el => el.id == regionId) ??
      this.daytimeBulletins.find(el =>
        el.forenoon.regions.find(r => r.id === regionId)
      )
    );
  }

  getData() {
    return this.dataRaw;
  }

  /**
   * @param {string} xmlString
   */
  setData(xmlString) {
    const parser = new DOMParser();
    const document = parser.parseFromString(xmlString, "application/xml");
    this.dataRaw = convertCaamlToJson(document);
    this.daytimeBulletins = toDaytimeBulletins(this.dataRaw?.bulletins || []);
    // console.log(this.dataRaw);
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
    fetchText(url, { method: "head" }).then(
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
    // console.log("loading bulletin", { date, activate });
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

        return this._loadBulletinData(date).then(() => {
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
   * @returns {string}
   */
  get activeRegionName() {
    if (!this.settings?.region?.match(config.regionsRegex)) {
      return "";
    }
    const feature = microRegions.features.find(
      f => f.id === this.settings.region
    );
    return feature?.id;
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
    return neighborRegions.features.find(f => f.id === this.settings.region);
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
    if (this.settings?.region === regionId) {
      return "selected";
    }
    if (this.activeBulletin?.forenoon?.regions?.some(r => r.id === regionId)) {
      return "highlighted";
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
    if (!f.properties) f.properties = {};
    f.properties.state = this.getRegionState(f.id, ampm);
    if (!f.properties.latlngs) {
      f.properties.latlngs = GeoJSON.coordsToLatLngs(
        f.geometry.coordinates,
        f.geometry.type === "Polygon" ? 1 : 2
      );
    }
    return f;
  }

  // assign states to regions
  getVectorRegions(ampm = null) {
    const collection = this.activeBulletinCollection;

    if (collection && collection.length > 0) {
      const regions = microRegions.features.map(f =>
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
    return fetchText(url).then(
      // query bulletin data
      response => {
        this.bulletins[date].setData(response);
      },
      error => {
        console.error("Cannot load bulletin for date " + date, error);
        this.bulletins[date].setData(null);
      }
    );
  }
}

export { BulletinStore, BulletinCollection };
