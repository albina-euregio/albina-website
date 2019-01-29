/* !scrolling
 ****************************************************/

/*
const easeInOutBounce = (x, t, b, c, d) => (
	t < d / 2
	? easeInBounce(x, t * 2, 0, c, d) * 0.5 + b
	: easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
);
*/

var scroll_init = () => {
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

            var elId = $.attr(this, "href");
            scroll(elId);
            return false;
          });
        }
      });

    scroll_direction();
  }, 0);
};

var scroll = (elId, time = 500) => {
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

var scroll_direction = () => {
  var s_pos_old = 0; //old scroll position
  var s_pos_new = 0; //new scroll position
  var s_dis = 20; //triggering distance
  var s_dis_down = 10; //triggering distance
  var s_dis_up = 100; //triggering distance

  var page_body = $("html, body");

  window.onscroll = function(event) {
    s_pos_new = this.pageYOffset;
    //console.log(s_pos_new);

    if (s_pos_new < 20) {
      //up
      page_body.removeClass("scrolling-down");
      s_pos_old = 0;
    } else {
      if (s_pos_old > s_pos_new) {
        //up
        if (Math.abs(s_pos_new - s_pos_old) > s_dis_up) {
          page_body.removeClass("scrolling-down");
          s_pos_old = s_pos_new;
        }
      } else {
        //down
        if (Math.abs(s_pos_new - s_pos_old) > s_dis_down) {
          page_body.addClass("scrolling-down");
          s_pos_old = s_pos_new;
        }
      }
    }
  };

  /*
	  window.onscroll = function(event) {
		  s_pos_new = this.pageYOffset;
		  console.log(s_pos_new);
  
		  if (s_pos_new < 20) {
			  //up
			  page_body.removeClass("scrolling-down");
		  } else {
			  if (Math.abs(s_pos_new - s_pos_old) > s_dis) {
  
				  if (s_pos_old > s_pos_new) {
					  //up
					  page_body.removeClass("scrolling-down");
				  } else {
					  //down
					  page_body.addClass("scrolling-down");
					  if (s_pos_new > 0) {}
				  }
  
				  s_pos_old = s_pos_new;
			  }
		  }
	  }
  */
};

export { scroll_init, scroll };
