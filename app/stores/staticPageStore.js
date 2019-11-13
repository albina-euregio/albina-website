import Base from "../base";

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
      return JSON.parse(response).entity.uuid;
    };
    const fallbackUrl = "404";

    // trying if we get a result with ///
    return Base.doRequest(createLookupUrl(url, "///")).then(
      response => {
        const id = getPageId(response);
        this.nodeLookup[url] = id;
        return id;
      },
      () => {
        // trying the same with //
        return Base.doRequest(createLookupUrl(url, "//")).then(
          response => {
            const id = getPageId(response);
            this.nodeLookup[url] = id;
            return id;
          },
          () => {
            // error: try fallback url (aka 404)
            if (this.nodeLookup[fallbackUrl]) {
              return this.nodeLookup[fallbackUrl];
            }
            return Base.doRequest(createLookupUrl(fallbackUrl, "")).then(
              response => {
                const id = getPageId(response);
                this.nodeLookup[fallbackUrl] = id;
                return id;
              }
            );
          }
        );
      }
    );
  }

  _loadPage(id) {
    const lang = window["appStore"].language;
    const langParam = !lang || lang == "en" ? "" : lang + "/";
    const url = config.get("apis.content") + langParam + "api/pages/" + id;
    return Base.doRequest(url);
  }

  loadBlock(name) {
    const lang = window["appStore"].language;
    const langParam = !lang || lang == "en" ? "" : lang + "/";
    const url =
      config.get("apis.content") + langParam + "api/block_content/" + name;
    return Base.doRequest(url);
  }
}
