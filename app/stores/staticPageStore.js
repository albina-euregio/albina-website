import axios from "axios";

export default class StaticPageStore {
  constructor() {
    this.nodeLookup = {};
  }

  loadPage(url) {
    if (this.nodeLookup[url]) {
      return this._loadPage(this.nodeLookup[url]);
    }
    return this._translatePath(url).then(id => this._loadPage(id));
  }

  _translatePath(url) {
    const createLookupUrl = (u, formatPrefix) => {
      return (
        config.get("apis.content") +
        "router/translate-path?_format=json&path=" +
        formatPrefix +
        u
      );
    };

    const getPageId = response => {
      const id = response.data.entity.uuid;
      this.nodeLookup[url] = id;
      return id;
    };
    const fallbackUrl = "404";

    // trying if we get a result with ///
    return axios
      .get(createLookupUrl(url, "///"))
      .then(getPageId, () => {
        // trying the same with //
        return axios.get(createLookupUrl(url, "//")).then(getPageId, () => {
          // error: try fallback url (aka 404)
          if (this.nodeLookup[fallbackUrl]) {
            return this.nodeLookup[fallbackUrl];
          }
          return axios.get(createLookupUrl(fallbackUrl, "")).then(getPageId);
        });
      })
      .catch(error =>
        console.error("Error while loading translation for path=" + url, error)
      );
  }

  _loadPage(id) {
    const lang = window["appStore"].language;
    const langParam = !lang || lang == "en" ? "" : lang + "/";
    const url = config.get("apis.content") + langParam + "api/pages/" + id;
    return axios.get(url).then(response => response.data);
  }

  loadBlock(name) {
    const lang = window["appStore"].language;
    const langParam = !lang || lang == "en" ? "" : lang + "/";
    const url =
      config.get("apis.content") + langParam + "api/block_content/" + name;
    return axios.get(url).then(response => response.data);
  }
}
