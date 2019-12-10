/*	TRANSPORTER
	Creating Your Web
	www.transporter.at
*/
// import anime from "animejs";
// import { scroll_init } from "./scroll";
/* !dom loaded?
 ****************************************************/
// window["scroll_duration"] = 1000;
// window["tiltySettings"] = {
//   speed: window["scroll_duration"] / 2,
//   transition: false,
//   scale: 1.1
// };
// $(function() {
//   orientation_change();
//debug pattern lab regarding line 33 ff of
//node_modules/styleguidekit-assets-default/dist/styleguide/js/patternlab-pattern.js
//where all a-Tags get kidnapped and won't perform custom events
// var debug_pl_delay = 250;
// var debug_pl = setTimeout(function() {
//   function debug_pl_dekidnap(debug_selector) {
//     for (var i = 0; i < debug_selector.length; i++) {
//       debug_selector[i].onclick = null;
//     }
//   }
//   debug_pl_dekidnap(
//     $(".modal-trigger, .modal-gallery-trigger, [data-scroll]")
//   );
//DOM objects global init
// window["page_window"] = $(window);
// window["page_html_body"] = $("html, body");
// window["page_html"] = $("html");
// window["page_body"] = $("body")
// window["page_loading_screen"] = $(".page-loading-screen");
// window["page_all"] = $(".page-all");
// window["page_header"] = $(".page-header");
// window["page_header_logo"] = $(".page-header-logo");
// window["page_main"] = $(".page-main");
// window["page_main_star"] = $(".page-main > *");
// window["page_footer"] = $(".page-footer");
// window["accordion"] = $(".accordion");
//global variables
// window["lastPopUpElement"] = null;
//init functions
// // detect_browser();
// setTimeout(() => {
//   scroll_init();
// }, 2000);
// flipper_init();
// accordion_init();
// tilt_init();
// page_loaded();
//preload_files();
//   }, debug_pl_delay);
// });
/* !development
 ****************************************************/
/* !helper
 ****************************************************/
// function window_height() {
//   return window["page_window"].height();
// }
// function window_width() {
//   return window["page_window"].width();
// }
// function page_header_height() {
//   return window["page_header"].outerHeight(); //inkl. borders
// }
// function scroll_position() {
//   return window["page_body"].scrollTop();
// }
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
/* !animation
 ****************************************************/
// function animation_fadeIn(target) {
//   anime.remove(target.get(0));
//   target
//     .css({
//       visibility: "visible",
//       opacity: "0"
//     })
//     .show();
//   var cssSelector = anime({
//     targets: target.get(0), //jquery object -> js-object
//     opacity: 1,
//     duration: scroll_duration,
//     easing: "easeOutCubic",
//     begin: function(event) {},
//     complete: function(event) {}
//   });
// }
// function animation_fadeOut(target) {
//   anime.remove(target.get(0));
//   var cssSelector = anime({
//     targets: target.get(0), //jquery object -> js-object
//     opacity: 0,
//     duration: scroll_duration / 2,
//     easing: "easeInCubic",
//     begin: function(event) {},
//     complete: function(event) {
//       target.hide();
//     }
//   });
// }
// function animation_slideIn(target, distance) {
//   if (distance == undefined) {
//     var distance = "-100px";
//   }
//   anime.remove(target.get(0));
//   target
//     .css({
//       visibility: "visible",
//       opacity: "0",
//       transform: "translateY(" + distance + ")"
//     })
//     .show();
//   var cssSelector = anime({
//     targets: target.get(0), //jquery object -> js-object
//     opacity: 1,
//     translateY: 0,
//     duration: scroll_duration / 2,
//     easing: "easeOutQuint",
//     begin: function(event) {},
//     complete: function(event) {}
//   });
// }
// function animation_slideOut(target, distance) {
//   if (distance == undefined) {
//     var distance = "0px";
//   }
//   anime.remove(target.get(0));
//   var cssSelector = anime({
//     targets: target.get(0), //jquery object -> js-object
//     opacity: 0,
//     translateY: distance,
//     duration: scroll_duration / 2,
//     easing: "easeInCubic",
//     begin: function(event) {},
//     complete: function(event) {
//       target
//         .css({
//           transform: "translateY(" + distance + ")"
//         })
//         .hide();
//     }
//   });
// }
/* !flipper
 ****************************************************/
// function flipper_init(flipper_start) {
//   //delete flippers;
//   var flippers = $(".flipper");
//   if (flippers.length) {
//     var flipper_controls_left = $(".flipper-left");
//     var flipper_controls_right = $(".flipper-right");
//     var flipper_buttongroup = $(".flipper-buttongroup");
//     var flipper_button = $(".flipper-buttongroup button");
//     var flipper_content = $(".flipper-content");
//     var flipper_item = $(".flipper-item");
//     var flipper_count = flipper_item.length;
//     var flipper_now = 0;
//     var flipper_next = 0;
//     for (var i = 0; i < flipper_count; i++) {
//       $(flipper_button[i]).attr("data-flipper", i);
//       $(flipper_item[i]).attr("data-flipper", i);
//     }
//     function flipper_flip(flipper_next, init) {
//       flipper_content.css({ left: -flipper_next * 100 + "vw" });
//       flipper_now = flipper_next;
//       flipper_button.removeClass("js-active");
//       $(
//         ".flipper-buttongroup button[data-flipper=" + flipper_now + "]"
//       ).addClass("js-active");
//       flipper_item.addClass("js-inactive");
//       $(".flipper-item[data-flipper=" + flipper_now + "]").removeClass(
//         "js-inactive"
//       );
//       if (!init) {
//         sweetScroll.to("#flipper");
//       }
//     }
//     flipper_controls_left.click(function(event) {
//       event.preventDefault();
//       if (flipper_now == 0) {
//         flipper_next = flipper_count - 1;
//       } else {
//         flipper_next = flipper_now - 1;
//       }
//       flipper_flip(flipper_next);
//     });
//     flipper_controls_right.click(function(event) {
//       event.preventDefault();
//       if (flipper_now == flipper_count - 1) {
//         flipper_next = 0;
//       } else {
//         flipper_next = flipper_now + 1;
//       }
//       flipper_flip(flipper_next);
//     });
//     flipper_button.click(function(event) {
//       event.preventDefault();
//       flipper_next = parseInt($(this).attr("data-flipper"));
//       flipper_flip(flipper_next);
//     });
//     if (typeof flipper_start == "undefined") {
//       flipper_start = 0;
//     }
//     flipper_flip(flipper_start, true);
//   }
// }
/* !accordion_init
 ****************************************************/
// function accordion_init() {
//   if (accordion.length) {
//     $(".accordion-trigger").click(function(event) {
//       $(this)
//         .parent()
//         .toggleClass("js-active");
//       if (
//         $(this)
//           .parent()
//           .hasClass("js-active")
//       ) {
//         animation_slideIn($(this).next(), "-50px");
//       } else {
//         animation_slideOut($(this).next(), "-50px");
//       }
//     });
//   }
// }
/* !tilt
 ****************************************************/
// function tilt_init() {
// if (!is_safari) {
//   //delete my_tilts;
//   var my_tilts = $("[data-tilty]");
//   if (my_tilts.length) {
//     my_tilts.tilt({
//       speed: scroll_duration / 2,
//       transition: false,
//       scale: 1.1
//     });
//   }
// }
// }
/* !video
 ****************************************************/
/* !loaded and loading
 ****************************************************/
// function page_loaded() {
//   page_html.removeClass("page-loading");
//   page_html.addClass("page-loaded");
//   setTimeout(function() {
//     page_loading_screen.hide();
//   }, 500);
// }
// function page_loading() {
//   page_loading_screen.show();
//   page_html.removeClass("page-loaded");
//   page_html.addClass("page-loading");
// }
/* !preload
 ****************************************************/
// function preload_files() {
//   var bilder = new Array("images/pro/logo_hover.svg");
//   bilder.forEach(function(url) {
//     $("<img/>")[0].src = url;
//   });
// }
/* !orientation_change
 ****************************************************/
// function orientation_change() {
//   window.addEventListener("orientationchange", function() {
//     var target = page_body;
//     switch (window.orientation) {
//       //case -90:200
//       //case 90:
//       default:
//         target.css({ opacity: "0" });
//         var cssSelector = anime({
//           targets: target.get(0), //jquery object -> js-object
//           opacity: [0, 1],
//           duration: scroll_duration,
//           easing: "easeOutCubic",
//           delay: window["scroll_duration"] / 4,
//           begin: function(event) {},
//           complete: function(event) {}
//         });
//         break;
//     }
//   });
// }
//sticky hover fix in iOS: http://www.dynamicdrive.com/forums/entry.php?335-iOS-Sticky-Hover-Fix-Unhovering-dropdown-CSS-menus
//(function(l){var i,s={touchend:function(){}};for(i in s)l.addEventListener(i,s)})(document);
/* !analytics
 ****************************************************/
