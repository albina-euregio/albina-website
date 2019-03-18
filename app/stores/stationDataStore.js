import { observable, action } from 'mobx';
import Base from '../base';

export default class StationDataStore {
  @observable data;
  @observable regionActive;
  @observable searchText;

  constructor() {
    this.data = [];
    this.regionActive = "all";
    this.searchText = "";
  }

  @action
  load() {
    const regionCodes = {
      'tirol': 'AT-07',
      'suedtirol': 'IT-32-BZ',
      'trentino': 'IT-32-TN'
    };
    return Base.doRequest(config.get('apis.stations')).then((rawData) => {
      this.data =
        JSON.parse(rawData)
          .features
          .map((el) => Object.assign({
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
