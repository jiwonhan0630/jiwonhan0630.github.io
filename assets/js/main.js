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


// #region  Sidebar Auto TOC (Nested List Logic)
	$(function() {
		var $tocTarget = $('#menu .menu-link.active');
		var $content = $('#main .inner');

		if ($tocTarget.length > 0) {
			var $headers = $content.find('h2, h3');
			
			if ($headers.length > 0) {
				var $tocUl = $('<ul class="auto-toc"></ul>');
				var hasH2 = $headers.filter('h2').length > 0;
				
				var $lastH2Li = null;   // 최신 h2 li를 저장
				var $currentSubUl = null; // 현재 생성된 하위 ul 저장

				$headers.each(function(index) {
					var $this = $(this);
					var tagName = $this.prop('tagName').toLowerCase();
					
					var id = $this.attr('id') || 'section-' + index;
					if (!$this.attr('id')) $this.attr('id', id);

					var $li = $('<li></li>');
					var $a = $('<a></a>')
						.attr('href', '#' + id)
						.text($this.text())
						.addClass(tagName)
						.on('click', function(e) {
							e.preventDefault();
							if (typeof $menu !== 'undefined') $menu._hide();
							$('html, body').animate({ scrollTop: $('#' + id).offset().top - 100 }, 500);
						});

					$li.append($a);

					if (tagName === 'h2') {
						// h2는 항상 최상위 ul에 추가
						$tocUl.append($li);
						$lastH2Li = $li;
						$currentSubUl = null; // 새로운 h2가 나왔으므로 하위 ul 초기화
					} 
					else if (tagName === 'h3') {
						if (hasH2 && $lastH2Li) {
							// 1. h2가 존재하고, 이전에 나온 h2가 있다면 중첩 리스트 생성
							if (!$currentSubUl) {
								$currentSubUl = $('<ul></ul>');
								$lastH2Li.append($currentSubUl);
							}
							$currentSubUl.append($li);
						} else {
							// 2. h2가 아예 없거나, h2보다 h3이 먼저 나온 경우 최상위에 추가
							$tocUl.append($li);
						}
					}
				});

				$tocTarget.after($tocUl);

				// 스크롤 감지 (중첩 구조에서도 'a' 태그를 모두 찾아 정상 작동)
				function updateTocActive() {
					var scrollPos = $(window).scrollTop() + 160;
					var currentId = null; 

					$headers.each(function() {
						var $this = $(this);
						if ($this.offset().top < scrollPos) {
							currentId = $this.attr('id');
						}
					});

					$tocUl.find('a').removeClass('active');
					if (currentId) {
						$tocUl.find('a[href="#' + currentId + '"]').addClass('active');
					}
				}

				$(window).on('scroll', updateTocActive);
				updateTocActive();
			}
		}
	});
//#endregion

// #region Modal Dialog

	document.addEventListener('DOMContentLoaded', () => {
		const modal = document.getElementById('universal-modal');
		const modalBody = document.getElementById('modal-body');
		const modalTitle = document.getElementById('modal-title');

		document.querySelectorAll('.modal-link').forEach(link => {
			link.addEventListener('click', async (e) => {
				e.preventDefault();
				const contentArea = document.getElementById('modal-content');
				const modal = document.getElementById('modal');
				// 배경 클릭 시 닫기 (선택 사항)
				modal.addEventListener('click', (e) => {
					if (e.target === modal) modal.close();
				});
				
				contentArea.innerHTML = "읽어오는 중...";
				modal.showModal();

				try {
					const response = await fetch(link.href);
					const text = await response.text();
					
					// 가져온 전체 HTML에서 본문 영역만 추출
					const parser = new DOMParser();
					const doc = parser.parseFromString(text, 'text/html');
					
					// 테마에 따라 'main' 또는 '.post-content' 등으로 본문만 선택
					const mainContent = doc.querySelector('main') || doc.body;
					contentArea.innerHTML = mainContent.innerHTML;
				} catch (err) {
					contentArea.innerHTML = "내용을 불러올 수 없습니다.";
				}
			});
		});

		modal.addEventListener('close', () => {
			document.body.style.overflow = ''; // 스크롤 복구
			modalBody.innerHTML = ''; // 이전 내용 삭제 (메모리 관리)
		});
		
		// 배경 클릭 시 닫기 (선택 사항)
		modal.addEventListener('click', (e) => {
			if (e.target === modal) modal.close();
		});
	});

// const modal = document.getElementById('myModal');
// const openBtn = document.getElementById('openModal');
// const closeBtn = document.getElementById('closeModal');

// // 모달 열기
// openBtn.addEventListener('click', () => {
//     modal.showModal(); 
// });

// // 모달 닫기
// closeBtn.addEventListener('click', () => {
//     modal.close();
// });

// // 배경 클릭 시 닫기 (선택 사항)
// modal.addEventListener('click', (e) => {
//     if (e.target === modal) modal.close();
// });

//#endregion


})(jQuery);