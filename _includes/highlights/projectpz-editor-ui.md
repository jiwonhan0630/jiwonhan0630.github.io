UIToolkit 환경에서, element class를 통해 이벤트를 자동으로 바인딩하는 기능을 구현하였습니다.  
디자이너는 UI를 새로 만들거나 수정할 때, element class를 추가하면 즉시 기능을 적용할 수 있습니다.  
프로그래머는 명시된 element class에 따라 Attribute를 선언하는 것으로, 추가적인 바인딩 작업을 진행하지 않아도 됩니다.  
```csharp
[ElementCommand("cmd--button--brush-tool")]
private static void SelectBrushTool(VisualElement target) => History.Log("브러쉬 도구를 선택하였음");
```
UQuery를 통해 가져온 VisualElement에 메서드를 등록하기 위해 Reflection을 사용하였으나,  
초기화 시점에 단 한번 동작하여 UIBuilder 사용 시 성능 영향이 적도록 설계하였습니다.  
추후 런타임 적용을 고려하여, Source Generator를 사용하는 방식으로 전환하더라도 복잡한 수정 과정 없이 사용할 수 있도록 설계하였습니다.  
추가적인 메모리 할당을 방지할 수 있도록, 외부 변수 캡처 없이 static 메서드를 호출하는 static 람다 함수를 사용하는 방식으로 구현하였습니다.  