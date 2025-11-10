/* eslint-disable no-console */
import iframeResize from "@iframe-resizer/parent";

initializeIFrame();

function initializeIFrame() {
  const element = document.querySelector("[data-av-region]");
  if (!(element instanceof HTMLElement)) return;
  const province = element.dataset.avRegion || "";
  const ratio = element.dataset.avRatio || "1/1";
  const date =
    element.dataset.avDate ||
    new URLSearchParams(location.search).get("date") ||
    "latest";
  const language = element.dataset.avLang || "de";
  const id = element.dataset.avId || "albina-website-iframe";

  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "80vh";
  iframe.style.border = "0";
  iframe.allow = "geolocation";
  iframe.id = id;
  const params = new URLSearchParams({
    headless: "1",
    province,
    language,
    "map-ratio": ratio
  });

  let base = location.href;
  if (location.hostname === "localhost") {
    base = new URL('/', location.href).toString();
  } else if (/EUREGIO|AT-02|AT-07|IT-32-BZ|IT-32-TN/.exec(String(province))) {
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
      base = `https://${host[language]}/beta/`;
    } else if (location.pathname.startsWith("/dev")) {
      base = `https://${host[language]}/dev/`;
    } else {
      base = `https://${host[language]}/`;
    }
  } else {
    base = `https://lawinen-warnung.eu/`;
  }
  iframe.src = new URL(`bulletin/${date}?${params}`, base).toString();
  element.appendChild(iframe);

  iframeResize(
    {
      license: "GPLv3",
      waitForLoad: true,
      onScroll({ top, left }) {
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
