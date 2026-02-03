---
layout: basic
title: "Project PZ"
description: "실시간 턴제 전략 액션"
---

### 프로젝트 개요
- Mobile (Android)
- Unity Engine

## 담당 업무

[UIToolkit 이벤트 바인딩 시스템](#attribute-기반의-자동-이벤트-바인딩-시스템){: .button .subject-negative .arrow sub="Attribute 기반의 자동 이벤트 바인딩 시스템"}
[에디터 확장 기능](#레벨-디자인-툴){: .button .subject-negative .arrow sub="UIToolkit을 사용한 레벨 디자인 툴"}
[절차적 레벨 생성](#절차적-레벨-생성){: .button .subject .arrow sub="Wang Tile 알고리즘을 응용한 절차적 레벨 생성"}
[청크 시스템](#청크-시스템){: .button .subject .arrow sub="Spatial Hash Grid 기반의 청크 시스템"}
[CSV Utility](#csv-utility){: .button .subject .arrow sub="CSV 데이터 변환 유틸리티"}
[몬스터 패턴 시스템](#몬스터-패턴-시스템){: .button .subject .arrow sub="데이터 기반 몬스터 패턴"}
[Troubleshooting](#troubleshooting){: .button .subject-negative .arrow sub="절차적 레벨 생성 스크립트 리팩토링"}

# 세부 내용
## Attribute 기반의 자동 이벤트 바인딩 시스템
{% include highlights/projectpz-editor-ui.md %}

## 레벨 디자인 툴
절차적 레벨 생성에 사용되는 파츠 데이터를 작업할 수 있는 레벨 에디터를 구현하였습니다.  
1. **[Attribute 기반의 자동 이벤트 바인딩 시스템](#attribute-기반의-자동-이벤트-바인딩-시스템)**을 사용하여 디자인 작업과 유연하게 연동할 수 있는 구조를 설계하였습니다.
2. **인게임과 동일한 프리뷰 환경**: 인게임의 레벨 생성 로직을 모듈화하고 에디터 환경에 통합하여, 별도의 빌드 과정 없이 절차적 생성 결과를 빠르게 확인하며 작업할 수 있는 환경을 구축하였습니다.
3. 파츠의 ObjectPreview 기능과 스냅샷 출력 기능을 구현하여 툴을 사용하지 않더라도 파츠의 모습을 확인할 수 있도록 하였습니다.

## 절차적 레벨 생성
### 절차적 레벨 생성

**[Wang Tile 알고리즘]({% link _works/frags/wang-tile.md %}){: .modal-link}**을 응용하여 절차적 지형을 생성하는 로직을 구현하였습니다.  
<!-- 디자이너가 설계한 다양한 크기와 형태의 작은 지형 데이터(이하 파츠)를 인접 가능한 엣지 조건에 맞춰 회전, 확장, 연결하여 지형을 생성합니다.   -->
퀘스트 진행도나 아이템 보유 여부 등 디자이너가 설정한 외부 데이터에 따라 각 파츠 Edge의 인접 조건과 오브젝트 생성 규칙이 동적으로 변경되는 구조를 설계하였습니다.  

### 절차적 메쉬 생성
[Greedy 알고리즘](https://en.wikipedia.org/wiki/Greedy_algorithm)을 통한 절차적 메쉬 생성을 구현하였습니다.  
다른 지형에 가려지거나 불필요한 정점의 생성을 가능한 방지하여 청크 단위로 나눠진 메쉬를 생성하도록 하였습니다.  
<!-- 레벨 데이터를 통해 파츠의 점유 영역을 스캔하여 최적화된 Quad 단위로 메쉬를 생성합니다. 이는 불필요한 정점 생성을 원천 차단하여 메모리 할당을 최소화합니다.   -->

### 월드맵
TilemapRenderer를 통해 생성된 지형의 모습과 오브젝트의 위치 등을 표시하는 월드맵 기능을 구현하였습니다.

## 청크 시스템
Spatial Hash Grid를 통해 월드 공간을 영역으로 나누고 활성 상태를 관리하는 청크 시스템을 구현하였습니다.  
플레이어의 이동에 따라 각 청크의 활성 상태가 전환되는 시점에 월드 타임스탬프를 기록하여,  
재활성화 시 공백 시간 동안의 오브젝트 상태 변화를 수식 기반으로 즉시 보정할 수 있는 구조를 설계하였습니다.

## CSV Utility
{% include highlights/csv-utility.md %}

## 몬스터 패턴 시스템

### CSV 기반 몬스터 FSM
몬스터의 행동 패턴을 CSV 텍스트로 작성하여 FSM으로 동작시키는 시스템을 구현하였습니다.  
각 행에 부여된 속성 키에 따라 내용을 다르게 파싱하는 방식으로, 새로운 상태를 생성하거나 상태별 전이 조건, 사용 스킬 등을 정의하여 사용할 수 있도록 하였습니다.  

### 몬스터 패턴 뷰어
UIToolkit을 통해 몬스터의 패턴을 시각화하는 뷰어를 구현하였습니다.  
스테이지에 생성된 몬스터의 이전 동작이나 다음 틱에 실행할 동작을 확인할 수 있도록 하였습니다.  

# Troubleshooting
{% include highlights/projectpz-plg-refactoring.md %}