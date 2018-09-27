/*	TRANSPORTER
	Creating Your Web
	www.transporter.at
*/
import anime from 'animejs'

/* !dom loaded?
****************************************************/

$(function() {
  //debug pattern lab regarding line 33 ff of
  //node_modules/styleguidekit-assets-default/dist/styleguide/js/patternlab-pattern.js
  //where all a-Tags get kidnapped and won't perform custom events
  var debug_pl_delay = 250
  var debug_pl = setTimeout(function() {
    function debug_pl_dekidnap(debug_selector) {
      for (var i = 0; i < debug_selector.length; i++) {
        debug_selector[i].onclick = null
      }
    }

    debug_pl_dekidnap(
      $('.modal-trigger, .modal-gallery-trigger, [data-scroll]')
    )

    //DOM objects global init
    window['page_window'] = $(window)
    window['page_html_body'] = $('html, body')
    window['page_html'] = $('html')
    window['page_body'] = $('body')

    window['page_loading_screen'] = $('.page-loading-screen')
    window['page_all'] = $('.page-all')
    window['page_header'] = $('.page-header')
    window['page_header_logo'] = $('.page-header-logo')
    window['page_main'] = $('.page-main')
    window['page_main_star'] = $('.page-main > *')
    window['page_footer'] = $('.page-footer')

    window['accordion'] = $('.accordion')

    //global variables
    window['scroll_duration'] = 1000
    window['lastPopUpElement'] = null

    //init functions
    detect_browser()
    setTimeout(() => {
      scroll_init()
    }, 500)

    flipper_init()
    accordion_init()
    tilt_init()

    page_loaded()

    //preload_files();
    orientation_change()

    //console.log("custom.js initialised");
  }, debug_pl_delay)
})

/* !development
****************************************************/

/* !helper
****************************************************/

function window_height() {
  return window['page_window'].height()
}

function window_width() {
  return window['page_window'].width()
}

function page_header_height() {
  return window['page_header'].outerHeight() //inkl. borders
}

function scroll_position() {
  return window['page_body'].scrollTop()
}

function detect_browser() {
  window['is_chrome'] = navigator.userAgent.indexOf('Chrome') > -1
  window['is_explorer'] = navigator.userAgent.indexOf('MSIE') > -1
  window['is_firefox'] = navigator.userAgent.indexOf('Firefox') > -1
  window['is_safari'] = navigator.userAgent.indexOf('Safari') > -1
  window['is_opera'] =
    navigator.userAgent.toLowerCase().indexOf('op') > -1
  if (window['is_chrome'] && window['is_safari']) {
    window['is_safari'] = false
  }
  if (window['is_chrome'] && window['is_opera']) {
    window['is_chrome'] = false
  }
}

/* !animation
****************************************************/

function animation_fadeIn(target) {
  anime.remove(target.get(0))
  target
    .css({
      visibility: 'visible',
      opacity: '0'
    })
    .show()
  var cssSelector = anime({
    targets: target.get(0), //jquery object -> js-object
    opacity: 1,
    duration: scroll_duration,
    easing: 'easeOutCubic',
    begin: function(event) {},
    complete: function(event) {}
  })
}

function animation_fadeOut(target) {
  anime.remove(target.get(0))
  var cssSelector = anime({
    targets: target.get(0), //jquery object -> js-object
    opacity: 0,
    duration: scroll_duration / 2,
    easing: 'easeInCubic',
    begin: function(event) {},
    complete: function(event) {
      target.hide()
    }
  })
}

function animation_slideIn(target, distance) {
  if (distance == undefined) {
    var distance = '-100px'
  }
  anime.remove(target.get(0))
  target
    .css({
      visibility: 'visible',
      opacity: '0',
      transform: 'translateY(' + distance + ')'
    })
    .show()
  var cssSelector = anime({
    targets: target.get(0), //jquery object -> js-object
    opacity: 1,
    translateY: 0,
    duration: scroll_duration / 2,
    easing: 'easeOutQuint',
    begin: function(event) {},
    complete: function(event) {}
  })
}

function animation_slideOut(target, distance) {
  if (distance == undefined) {
    var distance = '0px'
  }
  anime.remove(target.get(0))
  var cssSelector = anime({
    targets: target.get(0), //jquery object -> js-object
    opacity: 0,
    translateY: distance,
    duration: scroll_duration / 2,
    easing: 'easeInCubic',
    begin: function(event) {},
    complete: function(event) {
      target
        .css({
          transform: 'translateY(' + distance + ')'
        })
        .hide()
    }
  })
}

/* !scrolling
****************************************************/

/*
const easeInOutBounce = (x, t, b, c, d) => (
	t < d / 2
	? easeInBounce(x, t * 2, 0, c, d) * 0.5 + b
	: easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
);
*/

function scroll_init() {
  window['sweetScroll'] = new SweetScroll(
    {
      trigger: '[data-scroll]', // Selector for trigger (must be a valid css selector)
      header: '', //"[data-scroll-header]",		// Selector or Element for fixed header (Selector of must be a valid css selector)
      duration: scroll_duration, // Specifies animation duration in integer
      easing: 'easeOutQuint', // Specifies the pattern of easing
      offset: -5, // Specifies the value to offset the scroll position in pixels
      vertical: true, // Enable the vertical scroll
      horizontal: false, // Enable the horizontal scroll
      cancellable: true, // When fired wheel or touchstart events to stop scrolling
      updateURL: true, // Update the URL hash on after scroll (true | false | 'push' | 'replace')
      preventDefault: true, // Cancels the container element click event
      stopPropagation: true, // Prevents further propagation of the container element click event in the bubbling phase
      quickMode: false, // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)

      // Callbacks
      before: function() {
        console.log('scroll before')
      },
      after: function() {
        console.log('scroll after')
      },
      cancel: null,
      complete: null,
      step: null
    },
    '#page-main'
  )

  scroll_direction()
}

function scroll_direction() {
  var s_pos_old = 0 //old scroll position
  var s_pos_new = 0 //new scroll position
  var s_dis = 20 //triggering distance
  var s_dis_down = 10 //triggering distance
  var s_dis_up = 100 //triggering distance

  window.onscroll = function(event) {
    s_pos_new = this.pageYOffset
    //console.log(s_pos_new);

    if (s_pos_new < 20) {
      //up
      page_body.removeClass('scrolling-down')
      s_pos_old = 0
    } else {
      if (s_pos_old > s_pos_new) {
        //up
        if (Math.abs(s_pos_new - s_pos_old) > s_dis_up) {
          page_body.removeClass('scrolling-down')
          s_pos_old = s_pos_new
        }
      } else {
        //down
        if (Math.abs(s_pos_new - s_pos_old) > s_dis_down) {
          page_body.addClass('scrolling-down')
          s_pos_old = s_pos_new
        }
      }
    }
  }

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
}

/* !flipper
****************************************************/

function flipper_init(flipper_start) {
  //delete flippers;
  var flippers = $('.flipper')

  if (flippers.length) {
    var flipper_controls_left = $('.flipper-left')
    var flipper_controls_right = $('.flipper-right')
    var flipper_buttongroup = $('.flipper-buttongroup')
    var flipper_button = $('.flipper-buttongroup button')
    var flipper_content = $('.flipper-content')
    var flipper_item = $('.flipper-item')
    var flipper_count = flipper_item.length
    var flipper_now = 0
    var flipper_next = 0

    for (var i = 0; i < flipper_count; i++) {
      $(flipper_button[i]).attr('data-flipper', i)
      $(flipper_item[i]).attr('data-flipper', i)
    }

    function flipper_flip(flipper_next, init) {
      //console.log(flipper_now, flipper_next);
      flipper_content.css({ left: -flipper_next * 100 + 'vw' })
      flipper_now = flipper_next

      flipper_button.removeClass('js-active')
      $(
        '.flipper-buttongroup button[data-flipper=' +
          flipper_now +
          ']'
      ).addClass('js-active')

      flipper_item.addClass('js-inactive')
      $(
        '.flipper-item[data-flipper=' + flipper_now + ']'
      ).removeClass('js-inactive')

      if (!init) {
        sweetScroll.to('#flipper')
      }
    }

    flipper_controls_left.click(function(event) {
      event.preventDefault()
      if (flipper_now == 0) {
        flipper_next = flipper_count - 1
      } else {
        flipper_next = flipper_now - 1
      }
      flipper_flip(flipper_next)
    })

    flipper_controls_right.click(function(event) {
      event.preventDefault()
      if (flipper_now == flipper_count - 1) {
        flipper_next = 0
      } else {
        flipper_next = flipper_now + 1
      }
      flipper_flip(flipper_next)
    })

    flipper_button.click(function(event) {
      event.preventDefault()
      flipper_next = parseInt($(this).attr('data-flipper'))
      flipper_flip(flipper_next)
    })

    if (typeof flipper_start == 'undefined') {
      flipper_start = 0
    }
    flipper_flip(flipper_start, true)
  }
}

/* !accordion_init
****************************************************/

function accordion_init() {
  if (accordion.length) {
    $('.accordion-trigger').click(function(event) {
      $(this)
        .parent()
        .toggleClass('js-active')
      if (
        $(this)
          .parent()
          .hasClass('js-active')
      ) {
        animation_slideIn($(this).next(), '-50px')
      } else {
        animation_slideOut($(this).next(), '-50px')
      }
    })
  }
}

/* !tilt
****************************************************/

function tilt_init() {
  if (!is_safari) {
    //delete my_tilts;
    var my_tilts = $('[data-tilty]')
    if (my_tilts.length) {
      my_tilts.tilt({
        speed: scroll_duration / 2,
        transition: false,
        scale: 1.1
      })
    }
  }
}

/* !video
****************************************************/

/* !loaded and loading
****************************************************/

function page_loaded() {
  page_html.removeClass('page-loading')
  page_html.addClass('page-loaded')
  setTimeout(function() {
    page_loading_screen.hide()
  }, 500)
}

function page_loading() {
  page_loading_screen.show()
  page_html.removeClass('page-loaded')
  page_html.addClass('page-loading')
}

/* !preload
****************************************************/

function preload_files() {
  var bilder = new Array('images/pro/logo_hover.svg')
  bilder.forEach(function(url) {
    $('<img/>')[0].src = url
  })
}

/* !orientation_change
****************************************************/

function orientation_change() {
  window.addEventListener('orientationchange', function() {
    var target = page_body

    switch (window.orientation) {
      //case -90:200
      //case 90:
      default:
        target.css({ opacity: '0' })
        var cssSelector = anime({
          targets: target.get(0), //jquery object -> js-object
          opacity: [0, 1],
          duration: scroll_duration,
          easing: 'easeOutCubic',
          delay: scroll_duration / 4,
          begin: function(event) {},
          complete: function(event) {}
        })
        break
    }
  })
}

//sticky hover fix in iOS: http://www.dynamicdrive.com/forums/entry.php?335-iOS-Sticky-Hover-Fix-Unhovering-dropdown-CSS-menus
//(function(l){var i,s={touchend:function(){}};for(i in s)l.addEventListener(i,s)})(document);

/* !analytics
****************************************************/
