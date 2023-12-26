import $ from "jquery";
import anime from "animejs";

function navigation_init() {
  var nav_open = 0; //navigation is closed
  var navigation_trigger = $(".navigation-trigger");
  var navigation_li = $(".navigation li");
  var page_window = $(window);

  navigation_trigger.off("click");

  navigation_trigger.click(function (event) {
    event.preventDefault();
    navigation_open_close();
  });

  page_window.keyup(function (event) {
    if (nav_open == 1 && event.keyCode == 27) {
      navigation_open_close();
    }
  });

  function navigation_open_close() {
    if (nav_open == 0) {
      $("body").addClass("navigation-open");
      navigation_li.each(function () {
        anime.remove($(this).get(0));
        $(this)
          .css({
            visibility: "visible",
            opacity: "0",
            "margin-top": "-100px"
          })
          .show();
        anime({
          targets: $(this).get(0), //jquery object -> js-object
          opacity: 1,
          "margin-top": 0,
          duration: window["scroll_duration"] / 2,
          easing: "easeOutQuint",
          begin: function () {},
          complete: function () {}
        });
      });

      nav_open = 1;
    } else {
      $("body").removeClass("navigation-open");
      nav_open = 0;
    }
  }
}

export { navigation_init };
