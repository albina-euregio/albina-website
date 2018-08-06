function modal_init() {
	//to be initialised repeatedly if modals are added on the fly
	//delete modals;
	var modals = $(".modal-trigger");
	if (modals.length) {
		modals.each(function(index, aModal){
			modal_open($(this));
		});
	}

	//to be initialised repeatedly if modals are added on the fly
	//delete modal_galleries;
	var modal_galleries = $(".modal-gallery");
	if (modal_galleries.length) {
		modal_galleries.each(function(event){
			modal_gallery_open($(this));
		});
	}
}

function modal_open(modal) {
	var modal_type;

	if (modal.hasClass("mfp-iframe")) {
		modal_type = "iframe";
	} else if (modal.hasClass("mfp-image")) {
		modal_type = "image";
	} else if (modal.hasClass("mfp-ajax")) {
		modal_type = "ajax";
	} else {
		modal_type = "inline";
	}

	const modal_url = modal.attr("href");
	const modal_title = modal.attr("title");

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

		mainClass: "mfp-slide-animation",
		focus: ".modal-focus",
		midClick: true,

		showCloseBtn: true,
		closeBtnInside: false,

		removalDelay: 250,//mit close animation abzustimmen
		autoFocusLast: false,

		callbacks: {
			beforeOpen: function() {
        window['modalStateStore'].open();
      },
			open: function() {
				//lastPopUpElement = this;
			},
			ajaxContentAdded: function(mfpResponse) {
				tooltip_init();
			},
			afterClose: function() {
				window['modalStateStore'].close();
			}
		}
	});
}

function modal_gallery_open(modal) {
	modal.magnificPopup({

		delegate: "a",

		type: "image",

		gallery: {
			enabled: true
		},

		modal: false,
		closeOnBgClick: true,

		alignTop: false,
		fixedContentPos: true,
		fixedBgPos: true,

		mainClass: "mfp-slide-animation",
		focus: ".modal-focus",
		midClick: true,

		showCloseBtn: true,
		closeBtnInside: false,

		removalDelay: 250,//mit close animation abzustimmen

		callbacks: {
      beforeOpen: function() {
        window['modalStateStore'].open();
      },
			open: function() {},
			close: function() {},
      afterClose: function() {
				window['modalStateStore'].close();
			}
		}
	});
}

export { modal_init }