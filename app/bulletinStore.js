import {observable} from 'mobx';
import Base from './base.js';

export default class BulletinStore {
  // TODO: add language support
  active = observable({
    date: '',
    ampm: '',
    region: 'all'
  });
  @observable isLoading = false;
  bulletins = {};

  constructor() {
  }

  /**
   * Load a bulletin from the API and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  load(date, activate = true) {
    const url = config.get('apis.bulletin') + '?date=' + encodeURIComponent(date + 'T00:00:00+02:00');
    if(this.bulletins[date]) {
      if(activate) {
        this.setDate(date);
      }
    } else {
      this.isLoading = true;

      return Base.doRequest(url).then(
        response => {
          const responseParsed = JSON.parse(response);
          this.bulletins[date] = responseParsed;
          if(activate) {
            this.setDate(date);
          }
          this.isLoading = false;
        }
      );
    }
  }


  /**
   * Set the current date in YYYY-MM-DD format.
   */
  setDate(date) {
    this.active.date = date;
  }


  /**
   * Set the current active 'am'/'pm' state.
   * @param ampm A string 'am' or 'pm'.
   */
  setAmPm(ampm) {
    switch(ampm) {
      case 'am':
      case 'pm':
        this.active.ampm = ampm;
        break;

      default:
        break;
    }
  }


  /**
   * Set the current active region to a given value.
   * @param region A valid region identifier or 'all'.
   */
  setRegion(region) {
    this.active.region = region;
  }


  /**
   * Get the bulletins that match the current selection.
   * @return A list of bulletins that match the selection of
   *   this.date, this.ampm and this.region
   */
  getActive() {
    return this.get(this.active.date, this.active.ampm, this.active.region);
  }


  /**
   * Get a specific bulletin for a given date an region.
   * @param date A date in the format YYYY-MM-DD.
   * @param ampm A string 'am' or 'pm'.
   * @param region A valid region idetifier or 'all'.
   * @return A list of bulletins that match the given parameters.
   */
  get(date, ampm, region = 'all') {
    if(this.bulletins[date]) {
      const bulletins = this.bulletins[date];
      return (region == 'all') ? bulletins : bulletins.filter((bulletin) => {
        return bulletin.regions.includes(region);
      });
    }
    return [];
  }
}
