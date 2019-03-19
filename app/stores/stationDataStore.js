import { observable, action } from 'mobx';
import Base from '../base';

export default class StationDataStore {
  @observable data;
  @observable regionActive;
  @observable searchText;
  @observable activeData;
  @observable sortValue;
  @observable sortDir;

  constructor() {
    this.data = [];
    this.regionActive = "all";
    this.searchText = "";
    this.activeData = {
      "snow": true,
      "temp": true,
      "wind": true
    }
    this.sortValue = null;
    this.sortDir = null
  }

  @action
  load() {
    const regionCodes = {
      'tirol': 'AT-07',
      'suedtirol': 'IT-32-BZ',
      'trentino': 'IT-32-TN'
    };
    return Base.doRequest(config.get('apis.stations')).then((rawData) => {
      const data = JSON.parse(rawData).features;

      // default ordering
      data.sort((a, b) => {
        if(a.properties.region != b.properties.region) {
          return (a.properties.region < b.properties.region) ? -1 : 1;
        }
        const nameA = a.properties.name.toLowerCase();
        const nameB = b.properties.name.toLowerCase();

        if(nameA != nameB) {
          return (nameA < nameB) ? -1 : 1;
        }
        return 0;
      });

      this.data = data.map((el) => Object.assign({
          lon: el.geometry.coordinates[0],
          lat: el.geometry.coordinates[1],
          elev: el.geometry.coordinates[2]
        }, el.properties, {
          region: regionCodes[el.properties.region]
        }
      ));
    });
  }
}
