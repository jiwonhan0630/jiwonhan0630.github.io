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
            var csharpTypes = ['Dictionary', 'List', 'Task', 'Action', 'Func', 'HashSet'];
            
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

        /**
         * 3. enum
         */
        function patchEnumByComment() {
            $('.highlight .c1').each(function() { // .c1은 한 줄 주석
                var $comment = $(this);

                // 주석 내용에 'enum'이 포함되어 있는지 확인
                if ($comment.text().toLowerCase().indexOf('enum') !== -1) {
                    // 해당 주석 이전 요소들 중 가장 가까운 식별자(.n)들을 찾음
                    var $prevNames = $comment.prevAll('.n');

                    if ($prevNames.length >= 2) {
                        // public EquipSlotType SlotType; // enum 구조에서 
                        // index 0은 SlotType, index 1은 EquipSlotType임
                        $($prevNames[1]).addClass('no'); 
                    } else if ($prevNames.length === 1) {
                        // EquipSlotType; // enum 같은 구조일 경우
                        $prevNames.addClass('no');
                    }
                }
            });
        }

        patchGenericClass();
        patchAttribute();
        patchEnumByComment();
    });
})(jQuery);