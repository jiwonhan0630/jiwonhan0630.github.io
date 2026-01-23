UIToolkit 환경에서, element class를 통해 함수를 자동으로 바인딩하는 기능을 구현하였습니다.  
- **UI 디자인과 로직의 기능적 분리**: 디자이너가 명시한 element class에 따라 프로그래머는 메서드에 Attribute를 선언하는 것 외에는 별도의 바인딩 작업이 필요하지 않도록 설계하였습니다.
    ```csharp
    [ElementCommand("cmd--select--brush-tool")]
    private static void SelectBrushTool(VisualElement target) => History.Log("브러쉬 도구를 선택하였음");
    ```
- **GC 오버헤드 방지**: 불필요한 메모리 할당을 방지할 수 있도록 외부 변수 캡처 없이 static 메서드를 호출하는 static 람다 함수를 사용하여 구현하였습니다.
    UQuery를 통해 가져온 VisualElement에 메서드를 등록하기 위해 Reflection을 사용하였으나,  
    초기화 시점에 딱 한번 동작하여 툴 사용 시 성능 영향이 없도록 설계하였습니다.