## Addressables
### 커스텀 AssetReference class
프로젝트의 에셋 사용 방식에 따라, Address·Label을 사용하는 커스텀 AssetReference class를 구현하였습니다.  
<!-- Address·Label을 복사 붙여넣기 하지 않고 에셋을 드래그 앤 드랍하여ㅓ -->
인스펙터에서 에셋을 할당하면 직접 참조하는 대신, 해당 에셋에 지정된 Address·Label을 참조하여 암묵적 종속성을 발생시키지 않는 구조를 설계하였습니다.
또한, 에셋의 타입에 따라 Texture, Material과 같은 의존성있는 하위 자산의 Address·Label를 포함하여 사용할 수 있는 기능을 구현하였습니다.  

### Lifecycle 관리
프로젝트의 씬 사용 방식에 따라 OperationHandle을 상시 상주하는 Global Scope와 스테이지 단위로 상주하는 Stage Scope로 나누었습니다.  
IResourceLocation 단위로 에셋을 로드하고, OperationHandle의 재사용을 통해 참조 카운트를 통제하여  
지정된 시점에 번들을 로드/언로드 할 수 있는 구조를 설계하였습니다.  
동일한 번들의 Asset Churn 현상을 방지하기 위해 에셋의 Unload 시점에 ResourceLocation을 종합하여
커스텀 AssetReference 참조 카운트를 통제하여 
이를 통해
IResourceLocation과 OperationHandle을 커스텀 AssetReference 단위로 관리하여, 에셋 번들의 Asset Churn 현상을 억제할 수 있도록 하였습니다.
IResourceLocation과 OperationHandle을 재사용하여 참조 카운트를 통제하고, 지정된 시점에 번들이 로드/언로드 될 수 있는 구조를 설계하였습니다.
IResourceLocation을 통해
ResourceLocation을 
OperationHandle을 재사용하여 참조 카운트를 관리하고, 동일한 번들의 Asset Churn 현상을 억제할 수 있도록 ResourceLocation을 통해 


### Scope 단위의 Lifecycle 관리
메모리에 상시 상주해야하는 Global Type과 스테이지 단위로 상주하는 Stage Type을 분리하여 관리하였습니다.
OperationHandle을 Group/Label/Address 단위로 관리하여 불필요한 비동기 객체의 생성을 방지하고,  
동일한 번들의 Asset Churn 현상을 억제하였습니다.
OperationHandle의 재사용을 통해 참조 카운트를 관리하고, 지정된 시점에 번들이 로드/언로드 될 수 있도록 하였습니다.  
