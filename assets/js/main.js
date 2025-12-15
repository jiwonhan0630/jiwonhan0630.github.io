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

	/* --- TOC --- */
    $(function() {
        var $content = $('#main .inner');
        var $menuLinks = $('#menu .menu-link');
        var currentPath = window.location.pathname;

        // 헤더 수집
        var $headers = $content.find('h2, h3');

        if ($headers.length > 0) {
            // 현재 페이지 메뉴 찾기
            var $activeLink = null;
            $menuLinks.each(function() {
                if ($(this).attr('href') === currentPath) {
                    $activeLink = $(this);
                    return false;
                }
            });

            // 목차 생성 및 삽입
            if ($activeLink) {
                $activeLink.css('color', '#f2849e'); // 상위 메뉴 강조
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
                        .text('- ' + $this.text())
                        .addClass(tagName)
                        .on('click', function(e) {
                            e.preventDefault();
                            $menu._hide();
                            $('html, body').animate({ scrollTop: $('#' + id).offset().top - 100 }, 500);
                        });

                    $li.append($a);
                    $tocUl.append($li);
                });

                $activeLink.after($tocUl);

                // ==========================================
                // 스크롤 감지 (Scroll Spy)
                // ==========================================
                $(window).on('scroll', function() {
                    var scrollPos = $(window).scrollTop() + 150; // 감지 위치 보정 (헤더 높이 고려)
                    var currentId = '';

                    // 모든 헤더를 돌면서 "지금 내가 보고 있는 구역이 어디인가" 확인
                    $headers.each(function() {
                        var $this = $(this);
                        if ($this.offset().top < scrollPos) {
                            currentId = $this.attr('id');
                        }
                    });

                    // 찾은 구역의 목차 아이템만 'active' 클래스 부여
                    if (currentId) {
                        var $currentLink = $tocUl.find('a[href="#' + currentId + '"]');
                        // 기존 active 다 지우고, 현재 것만 active 추가
                        $tocUl.find('a').removeClass('active');
                        $currentLink.addClass('active');
                    }
                });
            }
        }
    });
})(jQuery);