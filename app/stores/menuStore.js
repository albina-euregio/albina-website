import { observable, action } from 'mobx';
import Base from '../base';

// NOTE: Getting menuItems via CMS API is currently (Drupal 8.5 - July 2018)
// blocked by issue https://www.drupal.org/project/drupal/issues/2915792 -
// currently admin privileges are required to view the menu.
// Use patch #16 in the above thread to enable menu view via API - DO NOT
// FORGET TO CLEAR ALL DRUPAL CACHES AFTER APPLYING THE PATCH!!!

export default class MenuStore {
  _loading;
  menus;

  constructor() {
    this._loading = observable.box(true);
    this.menus = {};
    this._load();
  }

  get loading() {
    return this._loading.get();
  }

  set loading(v) {
    this._loading.set(v);
  }

  getMenu(menuId) {
    return (!this.loading && this.menus[menuId]) ? this.menus[menuId] : null;
  }

  @action
  _load() {
    this.loading = true;
    const lang = window['appStore'].language;
    const fields = ['internalId', 'title', 'link', 'menuInternalId', 'parentIs', 'isExternal'];
    const params = {
      'fields[menuLinks]': fields.join(','),
      'sort': 'weight'
    };
    const langParam = (!lang || (lang == 'en')) ? '' : (lang + '/');
    const url = Base.makeUrl(config.get('apis.content') + langParam  + 'api/menuLinks', params);
    
    const processEntry = (entry) => {
      const ats = entry.attributes;
      const parentId = ats.parentIs ? ats.parentIs.substr(18) : null;

      this._addMenuEntry(ats.menuInternalId, {
        id: entry.id,
        title: ats.title,
        url: ats.link.replace(/^internal:/, ''), // strip "internal:" prefix
        isExternal: ats.isExternal
      }, parentId);
    };

    Base.doRequest(url).then(
      (response) => {
        const responseParsed = JSON.parse(response);
        if(responseParsed && responseParsed.data && Array.isArray(responseParsed.data)) {
          const rootEntries = [];
          const subEntries = [];
          
          responseParsed.data.forEach((entry) => {
            if(entry && typeof(entry.attributes) === 'object') {
              if(entry.attributes.parentIs) {
                subEntries.push(entry);
              } else {
                rootEntries.push(entry);
              }
            }
          });

          rootEntries.forEach(processEntry);
          subEntries.forEach(processEntry);
        }
      }
    ).then(() => {
      this.loading = false;
    });
  }

  _addMenuEntry(menuId, entry, parentId = null) {
    if(!this.menus[menuId]) {
      this.menus[menuId] = [];
    }
    if(parentId) {
      const p = this.menus[menuId].find((e) => { return e.id == parentId; });
      if(p) {
        if(!p.children) {
          p.children = [];
        }
        p.children.push(entry);
      } else {
        console.log('cannot find parent ' + parentId + ' for ' + entry.url);
      }
    } else {
      this.menus[menuId].push(entry);
    }
  }
}
