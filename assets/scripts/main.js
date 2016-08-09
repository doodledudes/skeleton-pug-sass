var Main = (function () {
	// variables
	var ctr = 0;

	// object
	return {
		init: function () {

			Main.scroll(".navbar-default .navbar-nav > li:not(.dropdown) > a");

			$(window).on('load resize', function() {
				$('section.banner').outerHeight(function(){
					var win = $(window.top).height();
					var nav = $('nav.navbar').outerHeight(true);
					return win - nav;
				});
			});

		},

		scroll : function (obj) {

			var body = $("html, body");

			$(obj).on("click", function(e) {
				e.preventDefault();
				if ( $( $(this).attr("href") ).length ) {
					// console.log("meron");
					var selector = $(this).attr("href");
					var objOffset = $(selector).offset().top;
					body.stop().animate({scrollTop: objOffset}, '200', 'swing');
				} else {
					body.stop();
					// console.log("wala");
					var url = $(this).attr("data-url");
					var toggle = $(this).attr("data-toggle");
					if( url ) {
						location.href = url;
					} else if( toggle ) {
						e.preventDefault();
					} else {
						location.href = "index.html" + $(this).attr("href");
					}
				}
			});

		},

		//--------
		nocomma: null
	};
}());

// Init after the page has loaded
jQuery(Main.init);
