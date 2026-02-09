별도의 파싱 로직 작성 없이 CSV 데이터를 변환할 수 있는 유틸리티를 구현하였습니다.  
이름 지정 방식과 열 인덱스 지정 방식을 지원하여 데이터 테이블의 헤더 수정에 유연하게 대응할 수 있도록 하였습니다.  
```csharp
public class Weapon
{
    // 열 지정 방식
    [CSVIndex(0)]
    public string ItemCode;

    // 이름 지정 방식
    [CSVHeader("wpn_author")]
    public string AuthorName;

    public List<string> EnchantList;
    public EquipSlotType SlotType; // enum
}

private UniTaskVoid Start()
{
    Dictionary<string, Weapon> resultDictionary = new();
    CSVUtility.TryFromText("text...", nameof(Weapon.ItemCode), out resultDictionary);

    string resultText = string.Empty;
    CSVUtility.TryToText(resultDictionary, out resultText);
}
```

기본 자료형(int, string) 외에도 사용자 정의 타입(클래스나 딕셔너리 리스트 같은 복합 자료형)을 처리하기 위해,  
제네릭 기반의 추가 컨버터를 구현하여 사용할 수 있습니다.  
동일한 타입이라도 상황에 따라 다른 파싱 규칙을 적용할 수 있습니다.  

```csharp

// 1. 사용자 정의 타입 처리를 위한 컨버터 구현
// CSVConverter<T>를 상속하여 구현
public class StatConverter : CSVConverter<StatInfo>
{
    // 입력값: "HP:100|MP:50"
    public override StatInfo Read(string value)
    {
        var stat = new StatInfo();
        var parts = value.Split('|'); // 구분자 정의
        stat.HP = int.Parse(parts[0].Split(':')[1]);
        stat.MP = int.Parse(parts[1].Split(':')[1]);
        return stat;
    }

    public override string Write(StatInfo value)
    {
        return $"HP:{value.HP}|MP:{value.MP}";
    }
}

// 2. 사용자 정의 타입 컨버터 사용
public class MonsterData
{    
    [CSVIndex(0)]
    public string ID;

    // Attribute로 컨버터를 주입
    [CSVConverter(typeof(StatConverter))]
    public StatInfo BaseStat; 
}
```