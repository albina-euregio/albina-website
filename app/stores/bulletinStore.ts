import { observable, action, makeObservable } from "mobx";
import {
  parseDate,
  parseDateSeconds,
  getSuccDate,
  dateToISODateString
} from "../util/date.js";

import { GeoJSON as LeafletGeoJSON, Util } from "leaflet";
import {
  AvalancheProblem,
  AvalancheProblemType,
  Bulletins,
  convertCaamlToJson,
  DaytimeBulletin,
  toDaytimeBulletins
} from "./bulletin";
import { fetchText } from "../util/fetch.js";
import { loadNeighborBulletins } from "./bulletinStoreNeighbor";

import { decodeFeatureCollection } from "../util/polyline.js";
import encodedMicroRegions from "./micro_regions.polyline.json";
import encodedNeighborRegions from "./neighbor_regions.polyline.json";
const microRegions = decodeFeatureCollection(encodedMicroRegions);
const neighborRegions = decodeFeatureCollection(encodedNeighborRegions);

const enableNeighborRegions = true;

type Status = "pending" | "ok" | "empty" | "n/a";

class BulletinCollection {
  date: string;
  status: Status;
  statusMessage: string;
  dataRaw: Bulletins;
  daytimeBulletins: DaytimeBulletin[];
  neighborBulletins: GeoJSON.FeatureCollection;

  constructor(date: string) {
    this.date = date;
    this.status = "pending";
    this.statusMessage = "";
    this.dataRaw = null;
    this.daytimeBulletins = [];
  }

  get regions(): string[] {
    return this.daytimeBulletins.map(el => el.id);
  }

  get publicationDate(): Date {
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

  get publicationDateSeconds(): Date {
    // return maximum of all publicationDates
    if (this.status == "ok" && this.length > 0) {
      return this.daytimeBulletins
        .map(b => {
          return parseDateSeconds(b.forenoon.publicationTime);
        })
        .reduce((acc, d) => {
          return d > acc ? d : acc;
        }, new Date(0));
    }

    return null;
  }

  get length(): number {
    return this.daytimeBulletins.length;
  }

  hasDaytimeDependency(): boolean {
    return this.daytimeBulletins.some(b => b.hasDaytimeDependency);
  }

  getBulletinForRegion(regionId: string): DaytimeBulletin {
    return (
      this.daytimeBulletins.find(el => el.id == regionId) ??
      this.daytimeBulletins.find(el =>
        el.forenoon.regions.find(r => r.id === regionId)
      )
    );
  }

  getData(): Bulletins {
    return this.dataRaw;
  }

  setData(xmlString: string | any[]) {
    if (typeof xmlString !== "string" || xmlString.length == 0) {
      this.dataRaw = undefined;
      this.status = "empty";
      return;
    }
    const parser = new DOMParser();
    const document = parser.parseFromString(xmlString, "application/xml");
    this.dataRaw = convertCaamlToJson(document.documentElement);
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
  bulletins: Record<string, BulletinCollection> = {};
  latest = null;
  settings = {
    status: "",
    neighbors: 0,
    date: "",
    region: ""
  };
  problems: Record<AvalancheProblemType, { highlighted: boolean }> = {
    new_snow: { highlighted: false },
    wind_drifted_snow: { highlighted: false },
    persistent_weak_layers: { highlighted: false },
    wet_snow: { highlighted: false },
    gliding_snow: { highlighted: false }
  };
  constructor() {
    makeObservable(this, {
      bulletins: observable,
      latest: observable,
      settings: observable,
      problems: observable,
      _latestBulletinChecker: action,
      load: action,
      activate: action,
      setRegion: action,
      dimProblem: action,
      highlightProblem: action
    });

    this._latestBulletinChecker();
  }

  _latestBulletinChecker() {
    const now = new Date();
    const today = dateToISODateString(now);
    const tomorrow = dateToISODateString(getSuccDate(now));
    const url = this._getBulletinUrl(tomorrow);
    fetchText(url, { method: "head" }).then(
      () => this._setLatest(tomorrow),
      () => this._setLatest(today)
    );
    window.setTimeout(
      () => this._latestBulletinChecker(),
      config.bulletin.checkForLatestInterval * 60000
    );
  }

  _setLatest(latest) {
    this.latest = latest;
  }

  /**
   * Load a bulletin from the APIs and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @param activate A flag to indicate, if the bulletin should be activated.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  load(date: string, activate = true) {
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

        if (enableNeighborRegions) {
          this.settings.neighbors = 0;
          loadNeighborBulletins(date).then(geojson => {
            this.bulletins[date].neighborBulletins = geojson;
            if (activate && this.settings.date == date) {
              // reactivate to notify status change
              this.activate(date);
            }
          });
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
  activate(date: string) {
    if (this.bulletins[date]) {
      this.settings.region = "";
      this.settings.date = date;
      this.settings.status = this.bulletins[date].status;
      this.settings.neighbors =
        this.bulletins[date].neighborBulletins?.features?.length ?? 0;

      /*
      if (this.bulletins[date].length === 1) {
        // TODO: filter by problem!!!
        let b = this.bulletins[date].getData();
        this.setRegion(b[0].id);
      }
      */
    } else {
      this.settings.status = "missing";
    }
  }

  setRegion(id: string) {
    this.settings.region = id;
  }

  dimProblem(problemId: string | number) {
    if (typeof this.problems[problemId] !== "undefined") {
      this.problems[problemId].highlighted = false;
    }
  }

  highlightProblem(problemId: string | number) {
    if (typeof this.problems[problemId] !== "undefined") {
      this.problems[problemId].highlighted = true;
    }
  }

  /**
   * Get the bulletins that match the current selection.
   * @return {BulletinCollection} A list of bulletins that match the selection of
   *   this.date and this.ampm
   */
  get activeBulletinCollection(): BulletinCollection {
    if (this.settings.status == "ok") {
      return this.bulletins[this.settings.date];
    }
    return null;
  }

  get activeNeighborBulletins() {
    return this.bulletins[this.settings.date]?.neighborBulletins;
  }

  get activeRegionName(): string {
    if (!this.settings?.region?.match(config.regionsRegex)) {
      return "";
    }
    const feature = microRegions.features.find(
      f => f.id === this.settings.region
    );
    return (feature?.id as string) ?? "";
  }

  /**
   * Get the bulletin that is relevant for the currently set region.
   * @return A bulletin object that matches the selection of
   *   this.date, this.ampm and this.region
   */
  get activeBulletin(): DaytimeBulletin {
    if (this.activeBulletinCollection) {
      return this.activeBulletinCollection.getBulletinForRegion(
        this.settings.region
      );
    }
    return null;
  }

  get activeNeighbor(): GeoJSON.Feature {
    return neighborRegions.features.find(f => f.id === this.settings.region);
  }

  getProblemsForRegion(regionId: string, ampm = null): AvalancheProblem[] {
    if (!this.activeBulletinCollection) {
      return [];
    }
    const bulletin =
      this.activeBulletinCollection.getBulletinForRegion(regionId);
    if (!bulletin) {
      return [];
    }
    const daytime =
      bulletin.hasDaytimeDependency && ampm == "pm" ? "afternoon" : "forenoon";
    return bulletin[daytime].avalancheProblems || [];
  }

  getRegionState(
    regionId: string,
    ampm = null
  ): "selected" | "highlighted" | "dimmed" | "dehighlighted" | "default" {
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

    const problems = this.getProblemsForRegion(regionId, ampm);
    if (problems.some(p => this.problems?.[p.type]?.highlighted)) {
      return "highlighted";
    }

    // dehighligt if any filter is activated
    if (Object.keys(this.problems).some(p => this.problems[p].highlighted)) {
      return "dehighlighted";
    }
    return "default";
  }

  get neighborRegions(): GeoJSON.Feature[] {
    return neighborRegions.features.map(f => this._augmentFeature(f));
  }

  _augmentFeature(f: GeoJSON.Feature, ampm = null): GeoJSON.Feature {
    if (!f.properties) f.properties = {};
    f.properties.state = this.getRegionState(f.id, ampm);
    if (!f.properties.latlngs) {
      f.properties.latlngs = LeafletGeoJSON.coordsToLatLngs(
        f.geometry.coordinates,
        f.geometry.type === "Polygon" ? 1 : 2
      );
    }
    return f;
  }

  // assign states to regions
  getVectorRegions(ampm = null): GeoJSON.Feature[] {
    const collection = this.activeBulletinCollection;

    if (collection && collection.length > 0) {
      const regions: GeoJSON.Feature[] = microRegions.features.map(f =>
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

  _getBulletinUrl(date: string): string {
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
