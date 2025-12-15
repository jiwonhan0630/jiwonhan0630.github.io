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

	/* --- Sidebar Auto TOC (Natural Highlight Logic) --- */
    $(function() {
        var $tocTarget = $('#menu .menu-link.active');
        var $content = $('#main .inner');

        if ($tocTarget.length > 0) {
            var $headers = $content.find('h2, h3');
            
            if ($headers.length > 0) {
                // 1. 목차 리스트 생성 (이 부분은 기존과 동일)
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

                $tocTarget.after($tocUl);

                // ==========================================
                // [수정됨] 스크롤 감지 로직 (자연스러운 버전)
                // ==========================================
                function updateTocActive() {
                    // 감지 기준선 (헤더 높이 + 여유분)
                    var scrollPos = $(window).scrollTop() + 150; 
                    
                    // 기본값: null (아직 아무것도 못 만났음)
                    var currentId = null; 

                    // 순서대로 검사하면서 "내 스크롤이 지나친 마지막 제목"을 찾음
                    $headers.each(function() {
                        var $this = $(this);
                        if ($this.offset().top < scrollPos) {
                            currentId = $this.attr('id');
                        }
                    });

                    // 1. 일단 모든 강조 표시를 끕니다 (Reset)
                    $tocUl.find('a').removeClass('active');

                    // 2. 만약 감지된 구역이 있다면 그때만 켭니다
                    // (맨 위라서 currentId가 null이면, 아무것도 안 켜진 상태가 유지됨)
                    if (currentId) {
                        $tocUl.find('a[href="#' + currentId + '"]').addClass('active');
                    }
                }

                // 이벤트 연결 및 초기 실행
                $(window).on('scroll', updateTocActive);
                updateTocActive();
            }
        }
    });

})(jQuery);