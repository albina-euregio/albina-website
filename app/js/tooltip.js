function tooltip_init() {
  //delete tooltips;
  var tooltips = $(".tooltip").not("[data-tippy]");
  var tooltip_delay, tooltip_theme;
  if (tooltips.length) {
    tooltips.each(function(index) {
      if ($(this).hasClass("html")) {
        tooltip_delay = 0;
        tooltip_theme = "custom-html";
      } else {
        tooltip_delay = window["scroll_duration"] / 4;
        tooltip_theme = "custom";
      }
      tippy($(this).get(0), {
        duration: [
          window["scroll_duration"] / 2,
          window["scroll_duration"] / 4
        ],
        delay: [tooltip_delay, tooltip_delay / 2],
        //,arrow: true
        maxWidth: "30em",
        updateDuration: window["scroll_duration"] / 4,
        theme: tooltip_theme,
        animation: "shift-away",
        animateFill: false,
        inertia: true,
        placement: "bottom",
        flipBehavior: "flip",
        //,trigger: "click"
        //,interactive: true
        dynamicTitle: true,
        //,followCursor: true
        touchHold: true,
        hideOnClick: true
      });
    });
  }
}

export { tooltip_init };
