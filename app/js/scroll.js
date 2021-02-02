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
  }, 0);
};

let scroll = (elId, time = 500) => {
  const $root = $("html, body");
  const elToScrollTo = $(elId);
  if (elToScrollTo.length) {
    $root.animate(
      {
        scrollTop: elToScrollTo.offset().top - ($("#page-header").height() ?? 0)
      },
      time
    );
  }
};

export { scroll_init, scroll };
