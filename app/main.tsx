import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/app.jsx";
import { setLanguage } from "./appStore";
import { isWebPushSupported } from "./util/isWebPushSupported";
import { template } from "./util/template";
import { newRegionRegex } from "./util/newRegionRegex";

(() => import("./sentry"))();

window["scroll_duration"] = 1000;

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
configRequest.then(async configParsed => {
  configParsed = {
    ...configParsed,
    projectRoot: import.meta.env.BASE_URL,
    template,
    regionsRegex: newRegionRegex(configParsed.regionCodes),
    eawsRegionsRegex: newRegionRegex(configParsed.eawsRegions)
  } satisfies Config;

  const language = configParsed.hostLanguageSettings[location.host];
  if (!language && location.host.startsWith("www.")) {
    location.host = location.host.substring("www.".length);
  }
  await setLanguage(language || "en");

  window.config = configParsed;

  const root = document.body.appendChild(document.getElementById("page-all"));
  createRoot(root).render(<App />);
});

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
