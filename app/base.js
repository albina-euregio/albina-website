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

  doRequest(url, type = "json") {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status == 200) {
            resolve(xhr.responseText);
          } else {
            reject(xhr.statusText, xhr.status);
          }
        }
      };
      xhr.open("GET", url, true);

      // set content type
      if (type === "json") {
        xhr.setRequestHeader(
          "Accept",
          "application/json,application/vnd.application+json,application/vnd.api+json"
        );
      }
      xhr.send(null);
    });
  },

  doPost(url, payload, type = "json") {
    return new Promise(function(resolve, reject) {
      console.log("post: " + url + " " + JSON.stringify(payload));
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status == 200) {
            resolve(xhr.responseText);
          } else {
            reject(xhr.statusText, xhr.status);
          }
        }
      };
      xhr.open("POST", url, true);

      // set content type
      if (type === "json") {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader(
          "Accept",
          "application/json,application/vnd.application+json,application/vnd.api+json"
        );
      }
      xhr.send(JSON.stringify(payload));
    });
  },

  cleanCache(fileName) {
    if (window.caches) {
      window.caches.delete(fileName);
    }
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

  now() {
    const d = new Date();
    return d.valueOf();
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

    // console.log("search changes", JSON.stringify(changes));

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
