import { observable, action, computed } from 'mobx';
import Base from './base';

export default class BlogStore {
  regions;
  languages;
  @observable searchText = '';
  loading;
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

    this._posts = [];

    this._loading = observable.box(false);
  }

  @action
  load() {
    this.loading = true;
    const blogsConfig = window['config'].get('blogs');
    const loads = [];

    // filter config for lang and region
    for(let b of blogsConfig) {
      if(this.languages[b.lang] && this.languages[b.lang].active) {
        if(b.regions.some((r) => (this.regions[r] && this.regions[r].active))) {
          // create by type
          switch(b.apiType) {
          case 'blogger': {
            const url = Base.makeUrl(
              window['config'].get('apis.blogger')
                + b.params.id
                + '/posts'
              , {
                'key': window['config'].get('apiKeys.google')
              }
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

  @action
  setRegionFilter(region) {
    for(let r in this.regions) {
      this.regions[r].active = !region || (r === region);
    }
  }

  @action
  setLanguageFilter(lang) {
    for(let l in this.languages) {
      this.languages[l].active = !lang || (l === lang);
    }
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
