(() => {
  function loadJS(FILE_URL, callback, async = true) {
    const scriptEle = document.createElement("script");

    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", async);

    document.body.appendChild(scriptEle);

    // success event
    scriptEle.addEventListener("load", () => {
      console.log("File loaded");
      callback();
    });
    // error event
    scriptEle.addEventListener("error", ev => {
      console.log("Error on loading file", ev);
    });
  }

  function initializeIFrame() {
    const element = document.querySelector("[data-av-region]");
    if (!element) return;
    const region = element.dataset.avRegion;
    const ratio = element.dataset.avRatio;
    const date = element.dataset.avDate || "latest";
    const lang = element.dataset.avLang || "de";
    const id = element.dataset.avId || "eu-lawinen-warnung-iframe";

    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "80vh";
    iframe.style.border = "0";
    iframe.allow = "geolocation";
    iframe.id = id;
    iframe.src = `https://lawinen-warnung.eu/bulletin/${region}/${date}?language=${lang}&map-ratio=${encodeURIComponent(ratio)}`;
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

  loadJS(
    "https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.3.2",
    initializeIFrame,
    true
  );
})();
