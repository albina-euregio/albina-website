import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/app.jsx";
import { setLanguage } from "./appStore";
import { isWebPushSupported } from "./util/isWebPushSupported";
import { template } from "./util/template";
import { newRegionRegex } from "./util/newRegionRegex";
import { $router } from "./components/router";

window["scroll_duration"] = 1000;

/*
 * Request config.json before starting the app (do not cache config!).
 * Also, append date to force reloading at least once a day.
 * config.json is not bundled with the app to allow config editing without
 * redeploying the whole app.
 */
const configRequest =
  import.meta.env.APP_REGION === "BETA" || import.meta.env.APP_REGION === "DEV"
    ? Promise.all([
        import("./config.json"),
        import(`./config.${import.meta.env.APP_REGION}.json`)
      ]).then(([base, override]) => ({ ...base, ...override }))
    : import.meta.env.APP_REGION
      ? import(`./config.${import.meta.env.APP_REGION}.json`)
      : import("./config.json");
// Incidents and snow profiles are not released in production yet
// TODO: Remove this code again after release
const unreleasedMenuUrls =
  import.meta.env.APP_REGION === "BETA" ||
  import.meta.env.APP_REGION === "DEV" ||
  import.meta.env.DEV
    ? []
    : ["/incidents", "/profiles"];

configRequest.then(async configParsed => {
  window.config = {
    ...configParsed,
    menu: configParsed.menu.filter(
      (e: { url: string }) => !unreleasedMenuUrls.includes(e.url)
    ),
    menuFooterMain: configParsed.menuFooterMain.filter(
      (e: { url: string }) => !unreleasedMenuUrls.includes(e.url)
    ),
    template,
    regionsRegex: newRegionRegex(configParsed.regionCodes),
    eawsRegionsRegex: newRegionRegex(configParsed.eawsRegions)
  } satisfies Config;

  type Apis = Record<string, string | Record<string, string>>;
  applyApiBaseUrl(window.config.apis as unknown as Apis);
  function applyApiBaseUrl(obj: Apis, baseUrl = window.config.apis.baseUrl) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && key !== "stations") {
        applyApiBaseUrl(obj[key] as Apis);
      } else if (typeof value === "string" && !value.startsWith("http")) {
        obj[key] = baseUrl + value;
      }
    }
  }

  const language = configParsed.hostLanguageSettings[location.host];
  if (!language && location.host.startsWith("www.")) {
    location.host = location.host.substring("www.".length);
  }

  if (!globalThis.Temporal) {
    await import("temporal-polyfill/global");
  }

  // Load the view in parallel with the language (needs config and Temporal).
  const bulletinRoutes = [
    "home",
    "homeDate",
    "bulletin",
    "bulletinDate",
    "bulletinLatest"
  ];
  const route = $router.get()?.route ?? "";
  if (bulletinRoutes.includes(route)) {
    void import("./views/bulletin");
  } else if (route === "weatherStations" || route === "weatherMeasurements") {
    void import("./views/stationDashboard");
  }

  await setLanguage(language || configParsed.mainLanguages?.[0] || "en");

  const root = document.body.appendChild(document.getElementById("page-all"));
  createRoot(root).render(<App />);
});

if (isWebPushSupported()) {
  navigator.serviceWorker
    .register("/service-worker.js")
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
