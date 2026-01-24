## Addressables
### 커스텀 AssetReference class
프로젝트의 에셋 사용 방식에 따라, Address·Label을 사용하는 커스텀 AssetReference class를 구현하였습니다.  
<!-- Address·Label을 복사 붙여넣기 하지 않고 에셋을 드래그 앤 드랍하여ㅓ -->
인스펙터에서 에셋을 할당하면 직접 참조하는 대신, 해당 에셋에 지정된 Address·Label을 참조하여  
암묵적 종속성을 발생시키지 않는 구조를 설계하였습니다.  
또한, 에셋의 타입에 따라 Texture, Material과 같은 의존성있는 하위 자산의 Address·Label를 포함하여 사용할 수 있는 기능을 구현하였습니다.  

### 에셋 Lifecycle 관리
프로젝트의 씬 사용 방식에 따라 OperationHandle을 상시 상주하는 Global Scope와  
스테이지 단위로 상주하는 Stage Scope로 나누어 관리하는 구조를 설계하였습니다.  
종속된 에셋을 사용할 때 발생하는 에셋 번들의 로드/언로드로 인한 부하(Asset Churn)를 방지하기 위해,  
IResourceLocation을 통해 에셋을 로드하여 번들 정보를 수집하고, OperationHandle의 재사용을 통해 참조 카운트를 통제하였습니다.  