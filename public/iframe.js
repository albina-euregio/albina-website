(function () {
  function loadJS(FILE_URL, callback, async = true) {
    let scriptEle = document.createElement("script");

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
    var element;
    if ((element = document.querySelector("[data-av-region]"))) {
      var region = element.dataset.avRegion;
      var ratio = element.dataset.avRatio;
      var date = element.dataset.avDate || "latest";
      var lang = element.dataset.avLang || "de";
      var id = element.dataset.avId || "eu-lawinen-warnung-iframe";

      var iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "80vh";
      iframe.style.border = "0";
      iframe.allow = "geolocation";
      iframe.id = id;
      iframe.src =
        "https://lawinen-warnung.eu/bulletin/" +
        region +
        "/" +
        date +
        "?language=" +
        lang +
        "&map-ratio=" +
        encodeURIComponent(ratio);
      // iframe.src = 'https://preview-albina.avalanche-warnings.eu/bulletin/' + region + '/' + date + '?language=' + lang + '&map-ratio=' + encodeURIComponent(ratio);
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
  }

  loadJS(
    "https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.3.2",
    initializeIFrame,
    true
  );
})();
