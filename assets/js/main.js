/*
	Phantom by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile)
			$body.addClass('is-touch');

	// Forms.
		var $form = $('form');

		// Auto-resizing textareas.
			$form.find('textarea').each(function() {

				var $this = $(this),
					$wrapper = $('<div class="textarea-wrapper"></div>'),
					$submits = $this.find('input[type="submit"]');

				$this
					.wrap($wrapper)
					.attr('rows', 1)
					.css('overflow', 'hidden')
					.css('resize', 'none')
					.on('keydown', function(event) {

						if (event.keyCode == 13
						&&	event.ctrlKey) {

							event.preventDefault();
							event.stopPropagation();

							$(this).blur();

						}

					})
					.on('blur focus', function() {
						$this.val($.trim($this.val()));
					})
					.on('input blur focus --init', function() {

						$wrapper
							.css('height', $this.height());

						$this
							.css('height', 'auto')
							.css('height', $this.prop('scrollHeight') + 'px');

					})
					.on('keyup', function(event) {

						if (event.keyCode == 9)
							$this
								.select();

					})
					.triggerHandler('--init');

				// Fix.
					if (browser.name == 'ie'
					||	browser.mobile)
						$this
							.css('max-height', '10em')
							.css('overflow-y', 'auto');

			});

	// Menu.
		var $menu = $('#menu');

		$menu.wrapInner('<div class="inner"></div>');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					if (href == '#menu')
						return;

					window.setTimeout(function() {
						window.location.href = href;
					}, 350);

			});
			// .append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});
			
		/* --- Sidebar Auto TOC (Optimized with CSS Class) --- */
		$(function() {
			var $tocTarget = $('#menu .menu-link.active'); // [핵심] 그냥 active 붙은 놈을 바로 가져옴!
			var $content = $('#main .inner');

			// active된 메뉴가 있고, 본문에 제목(h2,h3)이 있을 때만 실행
			if ($tocTarget.length > 0) {
				var $headers = $content.find('h2, h3');
				
				if ($headers.length > 0) {
					// 1. 목차 리스트 생성
					var $tocUl = $('<ul class="auto-toc"></ul>');
					
					$headers.each(function(index) {
						var $this = $(this);
						var tagName = $this.prop('tagName').toLowerCase();
						
						var id = $this.attr('id');
						if (!id) {
							id = 'section-' + index;
							$this.attr('id', id);
						}

						var $li = $('<li></li>');
						var $a = $('<a></a>')
							.attr('href', '#' + id)
							.text($this.text())
							.addClass(tagName)
							.on('click', function(e) {
								e.preventDefault();
								$menu._hide();
								$('html, body').animate({ scrollTop: $('#' + id).offset().top - 100 }, 500);
							});

						$li.append($a);
						$tocUl.append($li);
					});

					// 2. JS로 색깔 바꾸던 코드는 삭제됨! ($activeLink.css... 삭제)
					// 3. 바로 목차 삽입
					$tocTarget.after($tocUl);

					// 4. 스크롤 스파이 (Scroll Spy) 기능
					$(window).on('scroll', function() {
						var scrollPos = $(window).scrollTop() + 150;
						var currentId = '';

						$headers.each(function() {
							if ($(this).offset().top < scrollPos) {
								currentId = $(this).attr('id');
							}
						});

						if (currentId) {
							$tocUl.find('a').removeClass('active');
							$tocUl.find('a[href="#' + currentId + '"]').addClass('active');
						}
					});
				}
			}
		});

})(jQuery);