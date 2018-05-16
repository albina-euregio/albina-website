import {observable, action} from 'mobx';
import Base from './base.js';

export default class BulletinStore {
  // TODO: add language support
  active = observable({
    status: '',
    date: '',
    ampm: '',
    region: 'all'
  });
  bulletins = {};

  constructor() {
    this.setAmPm(config.get('defaults.ampm'));
  }

  /**
   * Load a bulletin from the API and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  @action
  load(date, activate = true) {
    if(date) {
      const url = config.get('apis.bulletin') + '?date=' + encodeURIComponent(date + 'T00:00:00+02:00');
      if(this.bulletins[date]) {
        if(activate) {
          this.setDate(date);
        }
      } else {
        if(activate) {
          this.active.date = date;
          this.active.status = 'pending';
        }

        return Base.doRequest(url).then(
          response => {
            const responseParsed = JSON.parse(response);
            this.bulletins[date] = responseParsed;
            if(activate) {
              this.setDate(date);
            }
          },
          error => {
            console.error('Cannot load bulletin for date ' + date + ': ' + error);
            if(activate) {
              this.setDate(date);
            }
          }
        );
      }
    }
  }


  /**
   * Set the current date in YYYY-MM-DD format.
   */
  @action.bound
  setDate(date) {
    this.active.status = (this.bulletins[date]) ? (
      (this.bulletins[date].length > 0) ? 'ok' : 'empty'
    ) : 'n/a';

    this.active.date = date;
  }


  /**
   * Set the current active 'am'/'pm' state.
   * @param ampm A string 'am' or 'pm'.
   */
  @action.bound
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
  @action.bound
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

  // findByProblem(problem, date = this.active.date, ampm = this.active.ampm, region = this.active.region) {
  //   const bulletins = this.get(date, ampm, region);
  //   if(this.bulletins.length > 0) {
  //     return bulletins.
  //   }
  // }
}
