Reflection과 Attribute를 통해, 별도의 파싱 로직 작성 없이 CSV 데이터를 변환할 수 있는 유틸리티를 구현하였습니다.
<!-- int, string 등의 기본 자료형을 넘어 Enum, List, Dictionary 등 복합 자료형으로의 변환이 가능하도록 구현하였습니다.
또한 변수명과 CSV 헤더명이 다르더라도 Attribute를 통해 이름을 수정하거나 특정 열을 지정하여 매핑할 수 있도록 설계하였습니다 -->
```csharp
[CSVFormat(typeof(Item))]
class Item()
{
    public string Code;

    // CSV 헤더명이 변수명과 다를 경우, 이름이나 인덱스로 매핑 가능
    [CSVName("Item_Tag_Code_List")]
    public List<string> TagList; // 리플렉션을 통해 enum, 컬렉션 등 다양한 타입으로의 변환 지원

    [CSVIndex(4)] 
    public int MaxLevel;
}

// List, Dictionary<key, List<>>등 다양한 컬렉션 사용 가능
Dictionary<string, Item> resultDictionary = new();

CSVUtility.TryFromText("text", nameof(Item.Code), out resultDictionary);
CSVUtility.TryToText("address", resultDictionary);
```