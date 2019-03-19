import { observable, action } from 'mobx';
import Base from '../base';

export default class StationDataStore {
  @observable data;
  @observable activeRegion;
  @observable searchText;
  @observable activeData;
  @observable sortValue;
  @observable sortDir;

  constructor() {
    this.data = [];
    this.activeRegion = "all";
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
    // stations.json uses custom region codes 'tirol', 'suedtirol' and 'trentino'
    const regionCodes = {
      'tirol': 'AT-07',
      'suedtirol': 'IT-32-BZ',
      'trentino': 'IT-32-TN'
    };

    return Base.doRequest(config.get('apis.stations')).then((rawData) => {
      const data = JSON.parse(rawData).features.filter((el) => el.properties.date);

      // default ordering by "region" and "name"
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

      // add geo attributes
      this.data = data.map((el) => Object.assign({
          lon: el.geometry.coordinates[0],
          lat: el.geometry.coordinates[1],
          elev: el.geometry.coordinates[2]
        }, el.properties, {
          // use default region codes
          region: regionCodes[el.properties.region]
        }
      ));
    });
  }
}
