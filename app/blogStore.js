import { observable, action, computed } from 'mobx';
import Base from './base';

export default class BlogStore {
  regions;
  languages;
  _year;
  _month;
  _searchText;
  _loading;
  _posts;

  constructor() {
    // get all regions from appStore and activate them
    const rs = Object.keys(window['appStore'].regions).reduce((acc, r) => {
      acc[r] = {active: true};
      return acc;
    }, {});
    this.regions = observable(rs);

    this.languages = observable({
      'de': {active: true},
      'it': {active: true},
      'en': {active: true}
    });

    // Do not make posts observable, otherwise posts list will be
    // unnecessaryliy rerendered during the filling of this array.
    // Views should only observe the value of the "loading" flag instead.
    this._posts = [];

    this._year = observable.box('');
    this._month = observable.box('');

    // For Mobx > v4 we have to use an obserable box instead of
    // @observable loading = ...;
    this._loading = observable.box(false);
    this._searchText = observable.box('');
  }

  @action
  load(forceReload = false) {
    if(!forceReload && this._posts.length > 0) {
      // don't do a reload if already loaded unless reload is forced
      return;
    }

    this.loading = true;
    this._posts.splice(0, this._posts.length);

    const blogsConfig = window['config'].get('blogs');
    const loads = [];

    // filter config for lang and region
    for(let b of blogsConfig) {
      if(this.languages[b.lang] && this.languages[b.lang].active) {
        if(b.regions.some((r) => (this.regions[r] && this.regions[r].active))) {
          // create by type
          switch(b.apiType) {
          case 'blogger': {
            const params = {
              'key': window['config'].get('apiKeys.google')
            };
            if(this.year) {
              params['startDate'] = this._startDate.toISOString();
              params['endDate'] = this._endDate.toISOString();
            }
            // TODO search

            const url = Base.makeUrl(
              window['config'].get('apis.blogger')
                + b.params.id
                + '/posts'
              , params
            );

            loads.push(Base.doRequest(url).then((response) => {
              // create Blogger object
              const responseParsed = JSON.parse(response);
              responseParsed.items.forEach((b) => {
                this._posts.push(b);
              })
            }));
            break;
          }

          default:
            break;
          }
        }
      }
    }

    return Promise.all(loads).then(() => {
      this.loading = false;
    });
  }

  get loading() {
    return this._loading.get();
  }

  set loading(val) {
    this._loading.set(val);
  }

  get searchText() {
    return this._searchText.get();
  }

  set searchText(val) {
    this._searchText.set(val);
  }

  get year() {
    return this._year.get();
  }

  set year(y) {
    this._year.set(y);
    this.load(true);
  }

  get month() {
    return this._month.get();
  }

  set month(m) {
    this._month.set(m);
    this.load(true);
  }

  get _startDate() {
    if(this.year) {
      if(this.month) {
        return new Date(this.year, this.month - 1, 1);
      }
      return new Date(this.year, 0, 1);
    }
    return null;
  }

  get _endDate() {
    if(this.year) {
      if(this.month) {
        return new Date(this.year, this.month, 0, 23, 59); // 0 means last of month
      }
      return new Date(this.year, 11, 31, 23, 59);
    }
    return null;
  }

  @action
  setRegionFilter(region) {
    for(let r in this.regions) {
      this.regions[r].active = !region || (r === region);
    }
    this.load(true);
  }

  @action
  setLanguageFilter(lang) {
    for(let l in this.languages) {
      this.languages[l].active = !lang || (l === lang);
    }
    this.load(true);
  }

  getPosts(start = 0, limit = 10) {
    const startIndex = Math.min(start, this._posts.length - 1);
    const end = Math.min(limit, this._posts.length);

    if(startIndex >= 0) {
      return this._posts.slice(startIndex, end);
    }
    return [];
  }
}
