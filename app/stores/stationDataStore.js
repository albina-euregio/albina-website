import { observable, action, computed } from "mobx";
import Base from "../base";

export default class StationDataStore {
  @observable data;
  @observable _activeRegions;
  @observable searchText;
  @observable activeData;
  @observable sortValue;
  @observable sortDir;

  constructor() {
    this.data = [];

    this._activeRegions = (() => {
      let regions = {};
      Object.keys(window.appStore.regions).forEach(r => {
        regions[r] = true;
      });
      return regions;
    })();

    this._searchText = observable.box("");
    this.activeData = {
      snow: true,
      temp: true,
      wind: true
    };
    this._sortValue = observable.box("");
    this._sortDir = observable.box("asc");
  }

  @computed get activeRegion() {
    const actives = Object.keys(this._activeRegions).filter(
      e => this._activeRegions[e]
    );

    const a =
      actives.length > 0 &&
      actives.length < Object.keys(this._activeRegions).length
        ? actives[0]
        : "all";
    return a;
  }

  set activeRegion(el) {
    // activate all if undefined or null is given
    const newActive = el ? [el] : Object.keys(this._activeRegions);

    Object.keys(this._activeRegions).forEach(e => {
      this._activeRegions[e] = newActive.indexOf(e) >= 0;
    });
  }

  get searchText() {
    return this._searchText.get();
  }

  set searchText(value) {
    this._searchText.set(value);
  }

  get sortValue() {
    return this._sortValue.get();
  }

  get sortDir() {
    return this._sortDir.get();
  }

  set sortValue(val) {
    this._sortValue.set(val);
  }

  set sortDir(dir) {
    this._sortDir.set(dir);
  }

  @action
  load() {
    // stations.json uses custom region codes 'tirol', 'suedtirol' and 'trentino'
    const regionCodes = {
      tirol: "AT-07",
      suedtirol: "IT-32-BZ",
      trentino: "IT-32-TN"
    };

    return Base.doRequest(config.get("apis.stations")).then(rawData => {
      const data = JSON.parse(rawData).features.filter(
        el => el.properties.date
      );

      // default ordering by "region" and "name"
      data.sort((a, b) => {
        if (a.properties.region != b.properties.region) {
          return a.properties.region < b.properties.region ? -1 : 1;
        }
        const nameA = a.properties.name.toLowerCase();
        const nameB = b.properties.name.toLowerCase();

        if (nameA != nameB) {
          return nameA < nameB ? -1 : 1;
        }
        return 0;
      });

      // add geo attributes
      this.data = data.map(el =>
        Object.assign(
          {
            lon: el.geometry.coordinates[0],
            lat: el.geometry.coordinates[1],
            elev: el.geometry.coordinates[2]
          },
          el.properties,
          {
            // use default region codes
            region: regionCodes[el.properties.region]
          }
        )
      );
    });
  }
}
