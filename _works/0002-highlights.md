---
layout: basic
title: "Highlights"
description: "이 페이지에서는 제가 강조하고 싶은 내용들이 담겨있습니다. 강조가 되었으면 좋겠는데 그게 잘 드러나지 않을 것 같아서 상당히 슬픕니다."
---

<div class="heading-container">
<h1>개발 편의 기능</h1>
<p>
개발 과정에서 발생하는 비효율적인 작업을 개선하고,<br>
실무에 즉시 도입 가능한 기능을 구현하여 팀의 생산성을 끌어올릴 수 있습니다.
</p>
</div>

## Attribute 기반의 자동 이벤트 바인딩 시스템
{% include highlights/projectpz-editor-ui.md %}

## CSV Utility
{% include highlights/csv-utility.md %}

***

<div class="heading-container">
<h1>Unity 에디터 확장 기능</h1>
<p>
프로젝트 특성에 맞는 에디터 확장 기능을 구현하여,<br>
팀 내에 보다 편안한 유니티 작업 환경을 제공할 수 있습니다.
</p>
</div>

## 레벨 에디팅 툴 및 베이킹 툴
{% include highlights/projectc-editor-ui.md %}

## 장비 아이템 착용 위치 에디터
차량의 모자 액세서리 착용 위치를 설정하는 기능을 구현하였습니다.  
바디 쉘에 해당하는 메쉬에서 가장 높은 위치의 폴리곤을 탐색하여 기울기를 적용하여 오브젝트의 Hat Socket으로 설정합니다.  
Gizmos를 통해 Hat Socket의 위치에 장착될 모자 메쉬를 표시하여 각 아이템이 정상 착용 되는지 확인하는 미리보기 기능을 구현하였습니다.  


## Addressables 시스템 확장
{% include highlights/addressablesystem.md %}

***

<div class="heading-container">
<h1>게임 로직 및 시스템</h1>
<p>
게임 플레이에 필요한 로직과 다양한 기능 요구사항을 구현할 수 있습니다.
</p>
</div>

## 절차적 레벨 생성
[Project PZ]({% link _works/0101-ProjectPZ.md %})  
- Wang Tile의 Edge Matching 규칙을 응용한 레벨 생성 로직 구현
- 퀘스트나 아이템 상태에 따라 생성 규칙이 동적으로 변하는 시스템 설계

## 물리 기반 자율 주행 및 파츠 시스템
[Project C]({% link _works/0102-ProjectC.md %})  
- WheelCollider로 이동하는 물리 기반 자율 주행 AI 구현
- 주행 중 실시간으로 파츠(바퀴, 차체) 교체 시, 무게 중심과 회전 반경을 재계산하여 주행 물리에 즉각 반영되는 시스템 구현

## 산업 데이터 기반 게이미피케이션
[Project C]({% link _works/0102-ProjectC.md %})  
- 실제 공장 작업자의 조립 데이터를 실시간으로 수신하여 게임 내 피버 타임, 스테이지 변화 등을 제어하는 자동화 플레이 로직 구현
- 데이터 송수신과 게임 로직을 분리하여 네트워크 지연 시에도 게임 흐름이 끊기지 않도록 설계

## 몬스터 및 보스 패턴 시스템
- 데이터 테이블을 통해 상태와 전이 조건을 정의하는 몬스터 패턴 시스템 구현 [(Project C)]({% link _works/0101-ProjectPZ.md %})
- StateMachineBehaviour를 활용하여 애니메이션 상태와 로직을 1:1로 매핑한 보스 패턴 시스템 구현 [(Project I)]({% link _works/0103-ProjectI.md %})

***

<div class="heading-container">
<h1>Troubleshooting</h1>
<p>
개발 중 발생하는 예상치 못한 스펙 변경이나 성능 이슈를 최선의 방법으로 해결하기 위해 노력합니다.
</p>
</div>

<!-- 엔진 내부 동작 원리를 파악하고 -->

# 프로토타입 지형 생성 로직을 상용 수준으로 리팩토링
재미 검증용으로 작성된 프로토타입 코드의 구조적 한계를 파악하고 병목 원인을 분석하여 상용 수준의 퍼포먼스를 확보하였습니다.
{% include highlights/projectpz-plg-refactoring.md %}

# 수정 불가능한 씬 환경에서 NavMesh 데이터를 통한 물리 주행 구현
NavMesh를 사용하는 월드에서 작동하는 WheelCollider를 이용한 주행 기능을 구현하였습니다.
{% include highlights/projectc-wheel-on-navmesh.md %}
