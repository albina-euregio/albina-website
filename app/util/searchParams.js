require("url-search-params-polyfill");

export function parseSearchParams() {
  return new URLSearchParams(document.location.search.substring(1));
}
