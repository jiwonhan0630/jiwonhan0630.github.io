// Rouge가 제대로 잡지 못하는 C# 구문 보정

(function($) {
    'use strict';

    $(function() {
        /**
         * 1. [Attribute]
         */
        function patchAttribute() {
            $('.highlight .nf').each(function() {
                var $this = $(this);
                var $prev = $this.prev();

                // 1) 만약 이름 앞에 공백(.w)이 있다면 한 칸 더 앞으로 이동
                if ($prev.hasClass('w')) {
                    $prev = $prev.prev();
                }

                // 2) 바로 앞 요소가 .p(구분자)이고 내용이 '[' 인지 확인
                // [ 또는 , 뒤에 오는 이름도 특성으로 간주
                if ($prev.hasClass('p') && ( $prev.text().indexOf('[') !== -1 || $prev.text().indexOf(',') !== -1 )){
                    $this.addClass('nd');
                }
            });
        }

        /**
         * 2. Dictionary<T> 같은 제네릭 타입
         */
        function patchGenericClass() {
            var csharpTypes = ['Dictionary', 'List', 'Task', 'Action', 'Func'];
            
            $('.highlight .n').each(function() {
                var $this = $(this);
                if (csharpTypes.indexOf($this.text().trim()) !== -1) {
                    var $next = $this.next();
                    if ($next.hasClass('w')) $next = $next.next();
                    if ($next.hasClass('p') && $next.text().indexOf('<') !== -1) {
                        $this.addClass('nc');
                    }
                }
            });
        }


        patchGenericClass();
        patchAttribute();
    });
})(jQuery);