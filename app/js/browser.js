import anime from "animejs";
import $ from "jquery";

function orientation_change() {
  window.addEventListener("orientationchange", function () {
    let target = $("body");
    switch (window.orientation) {
      //case -90:200
      //case 90:
      default:
        target.css({ opacity: "0" });
        anime({
          targets: target.get(0), //jquery object -> js-object
          opacity: [0, 1],
          duration: window["scroll_duration"],
          easing: "easeOutCubic",
          delay: window["scroll_duration"] / 4
          // begin: function(event) {},
          // complete: function(event) {}
        });
        break;
    }
  });
}

// function detect_browser() {
//   window["is_chrome"] = navigator.userAgent.indexOf("Chrome") > -1;
//   window["is_explorer"] = navigator.userAgent.indexOf("MSIE") > -1;
//   window["is_firefox"] = navigator.userAgent.indexOf("Firefox") > -1;
//   window["is_safari"] = navigator.userAgent.indexOf("Safari") > -1;
//   window["is_opera"] = navigator.userAgent.toLowerCase().indexOf("op") > -1;
//   if (window["is_chrome"] && window["is_safari"]) {
//     window["is_safari"] = false;
//   }
//   if (window["is_chrome"] && window["is_opera"]) {
//     window["is_chrome"] = false;
//   }
// }

export {
  orientation_change
  // detect_browser
};
