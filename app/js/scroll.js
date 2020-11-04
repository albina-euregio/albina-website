/* !scrolling
 ****************************************************/

/*
const easeInOutBounce = (x, t, b, c, d) => (
	t < d / 2
	? easeInBounce(x, t * 2, 0, c, d) * 0.5 + b
	: easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
);
*/

let scroll_init = () => {
  setTimeout(() => {
    $('a[href^="#"]')
      .not(".modal-trigger")
      .each((li, link) => {
        const href = $.attr(link, "href");
        if (href !== "#") {
          $(link).off("click");
          $(link).click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            let elId = $.attr(this, "href");
            scroll(elId);
            return false;
          });
        }
      });

    scroll_direction();
  }, 0);
};

let scroll = (elId, time = 500) => {
  const $root = $("html, body");
  const elToScrollTo = $(elId);
  if (elToScrollTo.length) {
    $root.animate(
      {
        scrollTop: elToScrollTo.offset().top
      },
      time
    );
  }
};

let scroll_direction = () => {
  let s_pos_old = 0; //old scroll position
  let s_pos_new = 0; //new scroll position
  let s_dis_down = 10; //triggering distance
  let s_dis_up = 100; //triggering distance

  let page_body = $("html, body");

  let header_visible = 1; //header visibility
  let top_fix = $(".top-fix");
  let top_fix_follow = $(".top-fix + section");

  let top_fix_offset = top_fix.offset();
  let topfix_height_now = topfix_height();
  let page_header_height_now = page_header_height();

  window.onresize = function() {
    setTimeout(function() {
      if (top_fix_offset != undefined) top_fix_offset = top_fix.offset();
      topfix_height_now = topfix_height();
      page_header_height_now = page_header_height();
    }, 2000);
  };

  window.onscroll = function() {
    s_pos_new = this.pageYOffset;
    if (top_fix_offset != undefined) top_fix_follow = $(".top-fix + section");

    if (s_pos_new < 20) {
      //up
      page_body.removeClass("scrolling-down");
      s_pos_old = 0;
    } else {
      if (s_pos_old > s_pos_new) {
        //up
        if (Math.abs(s_pos_new - s_pos_old) > s_dis_up) {
          page_body.removeClass("scrolling-down");
          header_visible = 1;
          s_pos_old = s_pos_new;
        }
      } else {
        //down
        if (Math.abs(s_pos_new - s_pos_old) > s_dis_down) {
          page_body.addClass("scrolling-down");
          header_visible = 0;
          s_pos_old = s_pos_new;
        }
      }
    }

    //add visibility
    if (header_visible == 0) {
      page_body.addClass("scrolling-down");
    } else {
      page_body.removeClass("scrolling-down");
    }

    //make .top-fix sticky or not
    if (top_fix_offset != undefined) {
      if (s_pos_new >= top_fix_offset.top - page_header_height_now) {
        page_body.addClass("js-top-fix");
        //top_fix.css({ "top": (header_visible * page_header_height_now) + "px" });
        top_fix.css({ top: page_header_height_now + "px" });
        top_fix_follow.css({ "padding-top": topfix_height_now + "px" });
      }
      //if (s_pos_new < (top_fix_offset.top - (header_visible * page_header_height_now))) {
      if (s_pos_new < top_fix_offset.top - page_header_height_now) {
        page_body.removeClass("js-top-fix");
        top_fix.css({ top: "auto" });
        top_fix_follow.css({ "padding-top": "0" });
      }
    }
  };
};

/* !helper
 ***************************************************/

function page_header_height() {
  return $(".page-header").outerHeight(); //inkl. borders
}

function topfix_height() {
  return $(".top-fix").outerHeight(); //inkl. borders
}

export { scroll_init, scroll };
