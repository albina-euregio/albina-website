import React from "react"; // eslint-disable-line no-unused-vars
import { createRoot } from "react-dom/client";
import App from "./components/app.jsx";
import { setLanguage } from "./appStore";
import { isWebPushSupported } from "./components/dialogs/subscribe-web-push-dialog.jsx";

(() => import("./sentry"))();

window["scroll_duration"] = 1000;

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
const configRequest =
  import.meta.env.BASE_URL === "/dev/"
    ? import("./config-dev.json")
    : import("./config.json");
Promise.all([configRequest, isWebpSupported]).then(
  async ([configParsed, webp]) => {
    configParsed = { ...configParsed };
    configParsed["projectRoot"] = import.meta.env.BASE_URL;
    configParsed["webp"] = webp;
    configParsed["template"] = template;
    if (webp) {
      document.body.className += " webp";
      // enable WebP for ALBINA layer
      [configParsed["map"]["tileLayer"]]
        .filter(layer => layer["id"] === "ALBINA")
        .forEach(
          layer => (layer["url"] = layer["url"].replace(/\.png/, ".webp"))
        );
    }

    const language = configParsed["hostLanguageSettings"][location.host];
    if (!language && location.host.startsWith("www.")) {
      location.host = location.host.substring("www.".length);
    }
    await setLanguage(language || "en");

    window.config = configParsed;

    const root = document.body.appendChild(document.getElementById("page-all"));
    createRoot(root).render(<App />);
  }
);

if (isWebPushSupported()) {
  navigator.serviceWorker
    .register(import.meta.env.BASE_URL + "service-worker.js")
    .then(serviceWorkerRegistration => {
      console.info("Service worker was registered.", {
        serviceWorkerRegistration
      });
    })
    .catch(error => {
      console.error(
        "An error occurred while registering the service worker.",
        error
      );
    });
} else {
  console.error("Browser does not support service workers or push messages.");
}

const templateRe = /\{ *([\w_ -]+) *\}/g;

function template(str: string, data: Record<string, string>) {
  return str.replace(templateRe, (str, key) => {
    const value = data[key];
    if (value === undefined) {
      throw new Error("No value provided for variable " + str);
    }
    return value;
  });
}
