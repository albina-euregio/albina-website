import tippy, { animateFill } from "tippy.js";

function tooltip_init() {
  //delete tooltips;
  console.log("tooltip_init");
  var tooltips = $(".tooltip").not("[data-tippy]");
  var tooltip_delay, tooltip_theme;
  if (tooltips.length) {
    tooltips.each(function () {
      console.log("tooltip_init Item", $(this).get(0));
      if ($(this).hasClass("html")) {
        tooltip_delay = 0;
        tooltip_theme = "custom-html";
      } else {
        tooltip_delay = window["scroll_duration"] / 4;
        tooltip_theme = "custom";
      }
      tippy($(this).get(0), {
        plugins: [animateFill],
        content: reference => reference.getAttribute("title"),
        duration: [
          window["scroll_duration"] / 2,
          window["scroll_duration"] / 4
        ],
        delay: [tooltip_delay, tooltip_delay / 2],
        //,arrow: true
        maxWidth: "30em",
        ////updateDuration: window["scroll_duration"] / 4,
        moveTransition: "transform " + tooltip_delay + "s ease-out",
        theme: tooltip_theme,
        animation: "shift-away",
        animateFill: false,
        inertia: true,
        placement: "bottom",
        //,trigger: "click"
        //,interactive: true
        ////dynamicTitle: true,
        //,followCursor: true
        ////touchHold: true,
        touch: "hold",
        hideOnClick: true,
        popperOptions: {
          modifiers: [
            {
              name: "flip",
              // flip: false
              enabled: false,
              options: {
                // flipBehavior: ['bottom', 'right', 'top']
                fallbackPlacements: ["right", "top"]
              }
            }
          ]
        }
      });
    });
  }
}

export { tooltip_init };
