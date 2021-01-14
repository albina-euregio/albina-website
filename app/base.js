require("url-search-params-polyfill");

var Base = {
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
  }
};

module.exports = Base;
