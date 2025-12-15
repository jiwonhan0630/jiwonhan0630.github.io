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

		/* --- Sidebar TOC --- */
    	$(function() {
        var $content = $('#main .inner');           // 본문 영역
        var $menuLinks = $('#menu .menu-link');     // 메뉴의 링크들
        var currentPath = window.location.pathname; // 현재 주소

        // 본문에서 h2, h3 태그 수집
        var $headers = $content.find('h2, h3');

        // 헤더가 하나라도 있을 때만 실행
        if ($headers.length > 0) {
            
            // 메뉴에서 '현재 페이지'에 해당하는 링크 찾기
            var $activeLink = null;
            $menuLinks.each(function() {
                // 링크 주소가 현재 주소와 일치하는지 확인
                if ($(this).attr('href') === currentPath) {
                    $activeLink = $(this);
                    return false; // 찾았으면 반복 종료
                }
            });

            // 활성 링크를 찾았으면 그 밑에 목차 생성
            if ($activeLink) {
                // 현재 페이지 메뉴 색상 강조
                $activeLink.css('color', '#f2849e'); 

                // 목차를 담을 ul 생성
                var $tocUl = $('<ul class="auto-toc"></ul>');
                
                $headers.each(function(index) {
                    var $this = $(this);
                    var tagName = $this.prop('tagName').toLowerCase(); // h2 or h3
                    
                    // ID가 없으면 자동 생성 (이동을 위해 필수)
                    var id = $this.attr('id');
                    if (!id) {
                        id = 'section-' + index;
                        $this.attr('id', id);
                    }

                    // 리스트 아이템 생성
                    var $li = $('<li></li>');
                    var $a = $('<a></a>')
                        .attr('href', '#' + id)
                        .text('- ' + $this.text()) // 앞에 하이픈(-) 장식
                        .addClass(tagName)         // 클래스(h2/h3) 추가
                        .on('click', function(e) {
                            e.preventDefault();
                            $menu._hide(); // 클릭 시 메뉴 닫기
                            
                            // 부드러운 스크롤 이동
                            var targetTop = $('#' + id).offset().top - 100; // 헤더 높이만큼 뺌
                            $('html, body').animate({ scrollTop: targetTop }, 500);
                        });

                    $li.append($a);
                    $tocUl.append($li);
                });

                // 찾은 메뉴 링크 바로 뒤에 목차 삽입
                $activeLink.after($tocUl);
            }
        }
    });

})(jQuery);