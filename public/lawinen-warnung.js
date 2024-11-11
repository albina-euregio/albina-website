(function () {
  function loadJS(FILE_URL, callback, async = true) {
    let scriptEle = document.createElement("script");

    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", async);

    document.body.appendChild(scriptEle);

    // success event
    scriptEle.addEventListener("load", () => {
      console.log("File loaded")
      callback();
    });
    // error event
    scriptEle.addEventListener("error", (ev) => {
      console.log("Error on loading file", ev);
    });
  }

  function initializeIFrame() {
    var element;
    if (element = document.querySelector("[data-av-region]")) {
      id = 'unique-id';

      var region = element.dataset.avRegion;
      var ratio = element.dataset.avRatio;
      var date = element.dataset.avDate || 'latest';

      var iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "80%";
      iframe.id = id;
      iframe.src = 'https://lawinen-warnung.eu/bulletin/' + region + '/' + date + '?map-ratio=' + encodeURIComponent(ratio);
      element.appendChild(iframe);

      iframeResize({
        license: 'GPLv3',
        waitForLoad: true,
      }, '#' + id);
    }
  }

  loadJS("https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.3.2", initializeIFrame, true);
})();
