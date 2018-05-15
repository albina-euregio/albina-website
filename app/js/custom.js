/*	TRANSPORTER
	Creating Your Web
	www.transporter.at
*/

/* !dom loaded?
****************************************************/

$(function() {
  //debug pattern lab regarding line 33 ff of
  //node_modules/styleguidekit-assets-default/dist/styleguide/js/patternlab-pattern.js
  //where all a-Tags get kidnapped and won't perform custom events
  var debug_pl_delay = 250;
  var debug_pl = setTimeout(function() {
    function debug_pl_dekidnap(debug_selector) {
      for (var i = 0; i < debug_selector.length; i++) {
        debug_selector[i].onclick = null;
        //console.log("doing debug_pl");
      }
    }
    debug_pl_dekidnap(
      $('.modal-trigger, .modal-gallery-trigger, [data-scroll]')
    );

    //DOM objects global init
    page_window = $(window);
    page_html_body = $('html, body');
    page_html = $('html');
    page_body = $('body');

    page_loading_screen = $('.page-loading-screen');
    page_all = $('.page-all');
    page_header = $('.page-header');
    page_header_logo = $('.page-header-logo');
    page_main = $('.page-main');
    page_main_star = $('.page-main > *');
    page_footer = $('.page-footer');

    navigation_trigger = $('.navigation-trigger');
    navigation = $('.navigation');
    navigation_li = $('.navigation li');

    modal_trigger = $('.modal-trigger');

    //global variables
    scroll_duration = 1000;

    //init functions
    scroll_init();

    navigation_init();
    //modal_translate();
    modal_init();
    tooltip_init();
    dropdown_init();
    tilt_init();

    video_init();

    loaded_init();

    //preload_files();
    orientation_change();

    console.log('custom.js initialised');
  }, debug_pl_delay);
});

/* !development
****************************************************/

/* !helper
****************************************************/

function window_height() {
  return page_window.height();
}

function window_width() {
  return page_window.width();
}

function page_header_height() {
  return page_header.outerHeight(); //inkl. borders
}

function scroll_position() {
  return page_body.scrollTop();
}

/* !animation
****************************************************/

function animation_fadeIn(target) {
  anime.remove(target.get(0));
  target
    .css({
      visibility: 'visible',
      opacity: '0'
    })
    .show();
  var cssSelector = anime({
    targets: target.get(0), //jquery object -> js-object
    opacity: 1,
    duration: scroll_duration,
    easing: 'easeOutCubic',
    begin: function(event) {},
    complete: function(event) {}
  });
}

function animation_fadeOut(target) {
  anime.remove(target.get(0));
  var cssSelector = anime({
    targets: target.get(0), //jquery object -> js-object
    opacity: 0,
    duration: scroll_duration / 2,
    easing: 'easeInCubic',
    begin: function(event) {},
    complete: function(event) {
      target.hide();
    }
  });
}

function animation_slideIn(target, distance) {
  if (distance == undefined) {
    var distance = '-100px';
  }
  anime.remove(target.get(0));
  target
    .css({
      visibility: 'visible',
      opacity: '0',
      transform: 'translateY(' + distance + ')'
    })
    .show();
  var cssSelector = anime({
    targets: target.get(0), //jquery object -> js-object
    opacity: 1,
    translateY: 0,
    duration: scroll_duration,
    easing: 'easeOutQuint',
    begin: function(event) {},
    complete: function(event) {}
  });
}

function animation_slideOut(target, distance) {
  if (distance == undefined) {
    var distance = '0px';
  }
  anime.remove(target.get(0));
  var cssSelector = anime({
    targets: target.get(0), //jquery object -> js-object
    opacity: 0,
    translateY: '-100',
    duration: scroll_duration / 2,
    easing: 'easeInCubic',
    begin: function(event) {},
    complete: function(event) {
      target
        .css({
          transform: 'translateY(' + distance + ')'
        })
        .hide();
    }
  });
}

/* !scrolling
****************************************************/

function scroll_init() {
  var sweetScroll = new SweetScroll({
    trigger: '[data-scroll]', // Selector for trigger (must be a valid css selector)
    header: '[data-scroll-header]', // Selector or Element for fixed header (Selector of must be a valid css selector)
    duration: scroll_duration, // Specifies animation duration in integer
    easing: 'easeInOutCubic', // Specifies the pattern of easing
    offset: 0, // Specifies the value to offset the scroll position in pixels
    vertical: true, // Enable the vertical scroll
    horizontal: false, // Enable the horizontal scroll
    cancellable: true, // When fired wheel or touchstart events to stop scrolling
    updateURL: false, // Update the URL hash on after scroll (true | false | 'push' | 'replace')
    preventDefault: true, // Cancels the container element click event
    stopPropagation: true, // Prevents further propagation of the container element click event in the bubbling phase
    quickMode: false, // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)

    // Callbacks
    before: function() {
      //console.log("scroll before");
    },
    after: null,
    cancel: null,
    complete: null,
    step: null
  });

  scroll_direction();
}

function scroll_direction() {
  var s_pos_old = 0; //old scroll position
  var s_pos_new = 0; //new scroll position
  var s_dis = 20; //triggering distance
  var s_dis_down = 10; //triggering distance
  var s_dis_up = 100; //triggering distance

  window.onscroll = function(event) {
    s_pos_new = this.pageYOffset;
    //console.log(s_pos_new);

    if (s_pos_new < 20) {
      //up
      page_body.removeClass('scrolling-down');
      s_pos_old = 0;
    } else {
      if (s_pos_old > s_pos_new) {
        //up
        if (Math.abs(s_pos_new - s_pos_old) > s_dis_up) {
          page_body.removeClass('scrolling-down');
          s_pos_old = s_pos_new;
        }
      } else {
        //down
        if (Math.abs(s_pos_new - s_pos_old) > s_dis_down) {
          page_body.addClass('scrolling-down');
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
}

/* !navigation
****************************************************/

function navigation_init() {
  var nav_open = 0; //navigation is closed

  navigation_trigger.click(function(event) {
    event.preventDefault();
    navigation_open_close();
  });

  page_window.keyup(function(event) {
    if (nav_open == 1 && event.keyCode == 27) {
      navigation_open_close();
    }
  });

  function navigation_open_close() {
    if (nav_open == 0) {
      page_body.addClass('navigation-open');
      navigation_li.each(function(event) {
        anime.remove($(this).get(0));
        $(this)
          .css({
            visibility: 'visible',
            opacity: '0',
            'margin-top': '-100px'
          })
          .show();
        var cssSelector = anime({
          targets: $(this).get(0), //jquery object -> js-object
          opacity: 1,
          'margin-top': 0,
          duration: scroll_duration / 2,
          easing: 'easeOutQuint',
          begin: function(event) {},
          complete: function(event) {}
        });
      });

      nav_open = 1;
    } else {
      page_body.removeClass('navigation-open');
      nav_open = 0;
    }
  }
}

/* !modals
****************************************************/

function modal_translate() {
  //sprache anpassen
  $.extend(true, $.magnificPopup.defaults, {
    tClose: 'Schließen (Esc)', // Alt text on close button
    tLoading: 'Laden...', // Text that is displayed during loading. Can contain %curr% and %total% keys
    gallery: {
      tPrev: 'Zurück | Pfeiltaste &larr;', // Alt text on left arrow
      tNext: 'Vor | Pfeiltaste &rarr;', // Alt text on right arrow
      tCounter: '%curr% von %total%' // Markup for "1 of 7" counter
    },
    image: {
      tError: '<a href="%url%">Das Bild</a> konnte nicht geladen werden.' // Error message when image could not be loaded
    },
    ajax: {
      tError: '<a href="%url%">Der Inhalt</a> konnte nicht geladen werden.' // Error message when ajax request failed
    }
  });
}

function modal_init() {
  //to be initialised repeatedly if modals are added on the fly
  // delete modals;
  var modals = $('.modal-trigger');
  if (modals.length) {
    modals.each(function(event) {
      modal_open($(this));
    });
  }

  //to be initialised repeatedly if modals are added on the fly
  // delete modal_galleries;
  var modal_galleries = $('.modal-gallery');
  if (modal_galleries.length) {
    modal_galleries.each(function(event) {
      modal_gallery_open($(this));
    });
  }
}

function modal_open(modal) {
  if (modal.hasClass('mfp-iframe')) {
    modal_type = 'iframe';
  } else if (modal.hasClass('mfp-image')) {
    modal_type = 'image';
  } else if (modal.hasClass('mfp-ajax')) {
    modal_type = 'ajax';
  } else {
    modal_type = 'inline';
  }

  modal_url = modal.attr('href');
  modal_title = modal.attr('title');

  modal.magnificPopup({
    type: modal_type,
    items: {
      src: modal_url
    },

    image: {
      verticalFit: true,
      titleSrc: function(event) {
        return modal_title;
      }
    },

    gallery: {
      enabled: true
    },

    modal: false,
    closeOnBgClick: true,

    alignTop: false,
    fixedContentPos: true,
    fixedBgPos: true,

    mainClass: 'mfp-slide-animation',
    focus: '.modal-focus',
    midClick: true,

    showCloseBtn: true,
    closeBtnInside: false,

    removalDelay: 250, //mit close animation abzustimmen

    callbacks: {
      open: function() {},
      close: function() {}
    }
  });
}

function modal_gallery_open(modal) {
  modal.magnificPopup({
    delegate: 'a',

    type: 'image',

    gallery: {
      enabled: true
    },

    modal: false,
    closeOnBgClick: true,

    alignTop: false,
    fixedContentPos: true,
    fixedBgPos: true,

    mainClass: 'mfp-slide-animation',
    focus: '.modal-focus',
    midClick: true,

    showCloseBtn: true,
    closeBtnInside: false,

    removalDelay: 250, //mit close animation abzustimmen

    callbacks: {
      open: function() {},
      close: function() {}
    }
  });
}

function modal_runtime(this_modal) {}

/* !tooltips
****************************************************/

function tooltip_init() {
  // delete tooltips;
  var tooltips = $('.tooltip');
  var tooltip_delay, tooltip_theme;
  if (tooltips.length) {
    //tippy(tooltips.get(0));
    tooltips.each(function(index) {
      if ($(this).hasClass('html')) {
        tooltip_delay = 0;
        tooltip_theme = 'custom-html';
      } else {
        tooltip_delay = scroll_duration / 4;
        tooltip_theme = 'custom';
      }
      tippy($(this).get(0), {
        duration: [scroll_duration / 2, scroll_duration / 4],
        delay: [tooltip_delay, tooltip_delay / 2],
        //,arrow: true
        maxWidth: '30em',
        updateDuration: scroll_duration / 4,
        theme: tooltip_theme,
        animation: 'shift-away',
        animateFill: false,
        inertia: true,
        placement: 'bottom',
        flipBehavior: 'flip',
        //,trigger: "click"
        //,interactive: true
        dynamicTitle: true
        //,followCursor: true
      });
    });
  }
}

/* !tilt
****************************************************/

function tilt_init() {
  // delete tilts;
  var tilts = $('[data-tilt]');
  if (tilts.length) {
    tilts.tilt({
      speed: scroll_duration / 2,
      transition: false,
      scale: 1.1
    });
  }
}

/* !dropdown
****************************************************/

function dropdown_init() {
  $('.dropdown').selectric({});
}

/* !video
****************************************************/

function video_init() {
  fluidvids.init({
    selector: ['.fitvids iframe'], // runs querySelectorAll()
    players: ['www.youtube.com', 'player.vimeo.com'] // players to support
  });
}

/* !loaded
****************************************************/

function loaded_init() {
  page_html.addClass('page-loaded');
  setTimeout(function() {
    page_loading_screen.hide();
  }, 1000);
}

/* !preload
****************************************************/

function preload_files() {
  var bilder = new Array('images/pro/logo_hover.svg');
  bilder.forEach(function(url) {
    $('<img/>')[0].src = url;
  });
}

/* !orientation_change
****************************************************/

function orientation_change() {
  window.addEventListener('orientationchange', function() {
    var target = page_body;

    switch (window.orientation) {
      //case -90:
      //case 90:
      default:
        target.css({ opacity: '0' });
        var cssSelector = anime({
          targets: target.get(0), //jquery object -> js-object
          opacity: [0, 1],
          duration: scroll_duration,
          easing: 'easeOutCubic',
          delay: scroll_duration / 4,
          begin: function(event) {},
          complete: function(event) {}
        });
        break;
    }
  });
}

//sticky hover fix in iOS: http://www.dynamicdrive.com/forums/entry.php?335-iOS-Sticky-Hover-Fix-Unhovering-dropdown-CSS-menus
//(function(l){var i,s={touchend:function(){}};for(i in s)l.addEventListener(i,s)})(document);

/* !analytics
****************************************************/
