Reflection과 Attribute를 통해, 별도의 파싱 로직 작성 없이 CSV 데이터를 변환할 수 있는 유틸리티를 구현하였습니다.

다양한 자료형의 변수를 자동으로 변환합니다.  
추후 다른 자료형의 지원을 고려하여 변환 함수를 개별적으로 정의하도록 설계하였습니다.
```csharp
public string WeaponCode;

public HashSet<string> WeaponTag;
public List<string> EnchantList;

[CSVConverter(typeof(MonsterCommandConverter))]
public MonsterCommand Command; 
public EquipSlotType SlotType; // enum
```
  
  
이름 지정 방식과 열 인덱스 지정 방식을 지원하여 데이터 테이블의 헤더 수정에 유연하게 대응할 수 있도록 하였습니다.
```csharp
[CSVIndex(0)]
public string ItemCode;

[CSVIndex(1)]
public int MinimumLevel;

[CSVHeader("wpn_author")]
public string AuthorName;
```

다양한 콜렉션으로의 변환을 지원하여 원하는 구조로 데이터를 관리할 수 있도록 하였습니다.  
추후 확장성을 고려하여 partial class로 구현하였습니다.  
```csharp
Dictionary<string, Item> resultDictionary = new();
CSVUtility.TryFromText("text...", nameof(Weapon.ItemCode), out resultDictionary);

string resultText = string.Empty;
CSVUtility.TryToText(resultDictionary, out resultText);
```
