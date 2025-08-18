/* eslint-disable no-console */
import iframeResize from "@iframe-resizer/parent";

initializeIFrame();

function initializeIFrame() {
  const element = document.querySelector("[data-av-region]");
  if (!element) return;
  const region = element.dataset.avRegion;
  const ratio = element.dataset.avRatio;
  const date =
    element.dataset.avDate ||
    new URLSearchParams(location.search).get("date") ||
    "latest";
  const lang = element.dataset.avLang || "de";
  const id = element.dataset.avId || "albina-website-iframe";

  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "80vh";
  iframe.style.border = "0";
  iframe.allow = "geolocation";
  iframe.id = id;
  const params = new URLSearchParams({
    headless: "1",
    province: region,
    language: lang,
    "map-ratio": ratio
  });
  if (location.hostname === "localhost") {
    iframe.src = `/bulletin/${date}?${params}`;
    console.log(location.pathname);
  } else if (/EUREGIO|AT-02|AT-07|IT-32-BZ|IT-32-TN/.exec(String(region))) {
    params.delete("language");
    const host = {
      en: "avalanche.report",
      ca: "ca.avalanche.report",
      de: "lawinen.report",
      es: "es.avalanche.report",
      fr: "fr.avalanche.report",
      oc: "oc.avalanche.report",
      it: "valanghe.report"
    };
    if (location.pathname.startsWith("/beta")) {
      iframe.src = `https://${host[lang]}/beta/bulletin/${date}?${params}`;
    } else if (location.pathname.startsWith("/dev")) {
      iframe.src = `https://${host[lang]}/dev/bulletin/${date}?${params}`;
    } else {
      iframe.src = `https://${host[lang]}/bulletin/${date}?${params}`;
    }
  } else {
    iframe.src = `https://lawinen-warnung.eu/bulletin/${date}?${params}`;
  }
  element.appendChild(iframe);

  iframeResize(
    {
      license: "GPLv3",
      waitForLoad: true,
      onScroll: function ({ top, left }) {
        console.log("onScroll", top, left);
        window.scrollTo({
          top,
          left,
          behavior: "smooth"
        });

        return false; // Stop iframe-resizer scrolling the page
      }
    },
    "#" + id
  );
}
