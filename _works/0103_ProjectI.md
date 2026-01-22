---
layout: basic
title: "Project I"
description: "3D 횡스크롤 슈팅 플랫포머"
image: /images/pic01.jpg
---

### 프로젝트 개요
- PC (Windows)
- Unity Engine
- 3D 횡스크롤 슈팅 플랫포머

## 담당 업무

[보스 몬스터](#보스-몬스터){: .button .subject .arrow sub="StateMachineBehaviour를 이용한 보스 패턴 시스템"}
[스테이지 설계 기능](#스테이지-설계-기능){: .button .subject .arrow sub="Gizmos를 이용한 스테이지 지형 설계"}
[이벤트 기반 입력 시스템](#이벤트-기반-입력-시스템){: .button .subject .arrow sub="LegacyInputManager 환경에서의 입력 시스템"}
[UI 시스템](#){: .button .subject .pointer-none sub="계층형 UI 구조, UGUI Navigation 적용"}
[Cinemachine을 사용한 스테이지별 입장 연출](#){: .button .subject .pointer-none}

# 세부 내용
## 보스 몬스터
- **보스 몬스터 FSM**: StateMachineBehaviour을 통해 애니메이션과 실제 상태를 연동한 FSM을 구현하였습니다.  
- **인스펙터를 통한 패턴 설정**: 인스펙터를 통해 보스의 공격 패턴, 타이밍, 페이즈 전환 조건 등의 Json 데이터를 편집하는 기능을 구현하였습니다.

## 스테이지 설계 기능
- Gizmos를 통해 스테이지의 지형(플랫폼)을 정의하고 시각화하는 기능을 구현하였습니다.  
- 배치된 MeshRenderer의 Bound에 따라 해당 지형 정보를 수정하는 기능을 구현하였습니다.  

## 이벤트 기반 입력 시스템
LegacyInputManager 환경에서 이벤트 기반의 입력 시스템을 구현하였습니다.  
발행·구독 패턴을 사용하여 KeyCode 참조 없이 string key와 상태를 통해 입력 이벤트를 구독하고, 런타임에 조작키를 변경할 수 있는 구조를 설계하였습니다.



<!-- ### 기타
**스테이지 연출**: 시네머신을 사용하여 각 스테이지별 시작 연출 제작
**오브젝트 풀링 시스템**: 템플릿을 통해 간단하게 사용할 수 있는 오브젝트 풀링 스크립트 작성
**Reflection 기반 동적 키 바인딩**: 하드코딩된 키 입력을 수정, Reflection을 활용하여 키를 매핑하도록 함
**CSV 파일을 사용한 대사 출력**
**계층형 UI 시스템** -->

