/* IE polyfills */
import "@babel/polyfill";
if (!window.Intl) {
  window["Intl"] = require("intl");
}

require("window.requestanimationframe");

import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import App from "./components/app.jsx";
import AppStore from "./appStore.js";
import ModalStateStore from "./stores/modalStateStore";
import StaticPageStore from "./stores/staticPageStore";
import { reaction } from "mobx";
import axios from "axios";

/* enable JavaScript error tracking */
// https://unpkg.com/browse/@sentry/types@5.7.1/dist/options.d.ts
import * as Sentry from "@sentry/browser";
if (!APP_DEV_MODE) {
  Sentry.init({
    release: "albina-website@" + APP_VERSION,
    environment: APP_ENVIRONMENT,
    dsn: "https://513851e41d6e455998f0cc1a91828942@sentry.io/1819947"
  });
}

/* bower components */
window["jQuery"] = window["$"] = require("jquery");

// TODO: check content API for maintenance mode before starting the app
window["appStore"] = new AppStore();
window["staticPageStore"] = new StaticPageStore();
window["modalStateStore"] = new ModalStateStore();
window["scroll_duration"] = 1000;
window["tiltySettings"] = {
  "data-tilt-speed": window["scroll_duration"] / 2,
  "data-tilt-transition": "false",
  "data-tilt-scale": 1.1
};

require("./js/custom.js");

// detect WebP support
// test taken from https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img/webp.js
const isWebpSupported = new Promise(resolve => {
  const webpImage = new Image();
  webpImage.onload = webpImage.onerror = event => {
    const isSupported = event.type === "load" && webpImage.width === 1;
    resolve(isSupported);
  };
  webpImage.src =
    "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";
});

/*
 * Request config.json before starting the app (do not cache config!).
 * Also, append date to force reloading at least once a day.
 * config.json is not bundled with the app to allow config editing without
 * redeploying the whole app.
 */
const configUrl = APP_ASSET_PATH + "config.json?" + Date.now();
const configRequest = axios.get(configUrl).then(res => res.data);
Promise.all([configRequest, isWebpSupported]).then(([configParsed, webp]) => {
  configParsed["projectRoot"] = APP_ASSET_PATH;
  configParsed["developmentMode"] = APP_DEV_MODE; // included via webpack.DefinePlugin
  configParsed["webp"] = webp;
  if (webp) {
    document.body.className += " webp";
    // enable WebP for ALBINA layer
    configParsed["map"]["tileLayers"]
      .filter(layer => layer["id"] === "ALBINA")
      .forEach(
        layer => (layer["url"] = layer["url"].replace(/\.png/, ".webp"))
      );
  }

  const language = configParsed["hostLanguageSettings"][location.host];
  if (language) {
    window["appStore"].setLanguage(language);
  }
  window.config = configParsed;

  // replace language-dependent body classes on language change.
  reaction(
    () => window["appStore"].locale.value,
    newLang => {
      document.body.parentElement.lang = newLang;
      document.body.className = document.body.className
        .replace(/domain-[a-z]{2}/, "domain-" + newLang)
        .replace(/language-[a-z]{2}/, "language-" + newLang);
    }
  );

  // initially set language-dependent body classes
  const initialLang = window["appStore"].locale.value;
  document.body.parentElement.lang = initialLang;
  document.body.className +=
    (document.body.className ? " " : "") +
    "domain-" +
    initialLang +
    " language-" +
    initialLang;

  ReactDOM.render(
    <App />,
    document.body.appendChild(document.getElementById("page-all"))
  );
});
