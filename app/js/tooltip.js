import tippy, { animateFill } from "tippy.js";
import "tippy.js/animations/shift-away-subtle.css";

function tooltip_init() {
  return;
  //delete tooltips
  var tooltips = $(".tooltip").not("[data-tippy]");
  var tooltip_delay, tooltip_theme;
  if (tooltips.length) {
    tooltips.each(function () {
      if ($(this).hasClass("html")) {
        tooltip_delay = 0;
        tooltip_theme = "albina-html"; //"custom-html";
      } else {
        tooltip_delay = window["scroll_duration"] / 4;
        tooltip_theme = "albina"; //"custom";
      }
      tippy($(this).get(0), {
        plugins: [animateFill],
        content: reference => reference.getAttribute("title"),
        duration: [
          window["scroll_duration"] / 2,
          window["scroll_duration"] / 4
        ],
        delay: [tooltip_delay, tooltip_delay / 2],
        arrow: false,
        maxWidth: "30em",
        ////updateDuration: window["scroll_duration"] / 4,
        moveTransition: "transform " + tooltip_delay + "s ease-out",
        theme: tooltip_theme,
        animation: "shift-away-subtle",
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
              enabled: true,
              options: {
                // flipBehavior: ['bottom', 'right', 'top']
                fallbackPlacements: ["top"]
              }
            }
          ]
        }
      });
    });
  }
}

export { tooltip_init };
