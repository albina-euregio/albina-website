require("url-search-params-polyfill");

var Base = {
  makeUrl(baseUrl, params = {}) {
    return (
      baseUrl +
      (Object.keys(params).length > 0
        ? "?" +
          Object.keys(params)
            .map(k => {
              return k + "=" + encodeURIComponent(params[k]);
            })
            .join("&")
        : "")
    );
  },

  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  },

  checkBlendingSupport() {
    const bodyEl = document.getElementsByTagName("body")[0];
    const bodyElStyle = window.getComputedStyle(bodyEl);
    const blendMode = bodyElStyle.getPropertyValue("mix-blend-mode");
    return !!blendMode;
  },

  searchGet(variable, search = false) {
    const searchParams = search ? search : this.makeSearch();
    return searchParams.get(variable);
  },

  makeSearch() {
    return new URLSearchParams(document.location.search.substring(1));
  },

  searchChange(history, params, replace = false) {
    const search = this.makeSearch();

    // checking, what has changed
    const changes = {};
    Object.keys(params).forEach(paramKey => {
      const newValue = params[paramKey] ? params[paramKey].toString() : "";
      const oldValue = search.get(paramKey);
      if (oldValue != newValue) {
        changes[paramKey] = newValue;
      }
    });

    if (history && search && Object.keys(changes).length > 0) {
      // setting new search object
      Object.keys(changes).forEach(changeKey => {
        const changeValue = changes[changeKey];
        if (search.has(changeKey)) {
          search.set(changeKey, changeValue);
        } else {
          search.append(changeKey, changeValue);
        }
      });

      // pushing to history
      if (search && history) {
        if (replace) {
          history.replace({ search: search.toString() });
        } else {
          history.push({ search: search.toString() });
        }
      }
    }
  }
};

module.exports = Base;
