---
layout: basic
title: "Project C"
description: "실시간 산업 데이터 기반 게이미피케이션"
---

### 프로젝트 개요
- PC (Windows)
- Unity Engine
- MariaDB

## 담당 업무
[에디터 확장 기능](#에디터-확장-기능){: .button .subject-negative .arrow sub="주행 경로 에디터, Hat Socket 에디터"}
[실시간 파츠 교체 시스템](#parts-system){: .button .subject .arrow sub="주행 중 정차 없이 차량의 부품을 교체"}
[산업 데이터 기반 게이미피케이션 로직](#gamification){: .button .subject .arrow sub="UnityWebRequest를 사용한 실제 작업자의 산업 데이터를 사용한 플레이 로직"}
[차량 AI 및 자율 주행 시스템](#car-ai){: .button .subject .arrow sub="NavMesh Baking을 활용한 자율 주행 AI"}
[전용 런처 개발](#){: .button .subject .pointer-none sub="클라이언트의 자동 업데이트와 재실행, 버전 관리 기능이 포함된 전용 런처 구현"}
[Troubleshooting](#troubleshooting){: .button .subject-negative .arrow sub="NavMesh 기반 환경에서 WheelCollider를 사용하는 차량 구현"}

# 세부 내용

## 에디터 확장 기능
{% include highlights/projectc-editor-ui.md %}

## 실시간 파츠 교체 시스템
{: #parts-system}

주행 도중 정지 없이 차량의 부품을 변경하고, 주행 성능에 반영되는 시스템을 구현하였습니다.  
바퀴가 변경되었을 때, MeshRenderer의 Bound 크기를 통해 WheelCollider의 반지름을 조절합니다.  
또한 차체의 무게나 길이가 변경되었을 때, 무게 중심을 변경하고 예상 회전 반경을 계산하여[(관련자료)](https://www.mdpi.com/1424-8220/23/12/5751), 주행 경로를 수정하였습니다.

## 차량 AI 및 자율 주행 시스템
{: #car-ai}

Unity AI Navigation의 NavMesh Baking을 통해 생성되는 폴리곤의 좌표를 활용하여, NavMeshAgent없이 WheelCollider를 통해 이동하는 자율 주행 시스템을 구현하였습니다.  
별도의 베이킹 프로세스를 구현하여, NavMesh와 관련된 애셋을 생성-사용하지 않고, 노드 정보가 저장된 ScriptableObject를 생성하여 사용하였습니다.  
차량 AI는 전략 패턴과 커맨드 패턴을 응용하여 주행 시 발생하는 각종 사건(충돌, 우회 등)과 환경의 변화에 따라 다른 주행 방식을 적용할 수 있도록 구현하였습니다.  

## 실시간 산업 데이터 기반 게이미피케이션 로직
{: #gamification}

UnityWebRequest와 UniTask를 사용, 백엔드에서 제공한 API를 호출하여 실제 공장 작업자의 조립 데이터를 송수신하였습니다.  
데이터 송수신 로직을 독립적으로 분리하고 Behaviour Tree의 구조를 차용하여,  
수신된 데이터를 통해 피버타임 진입, 게임 내 스테이지나 씬 변경 등의 필요를 판단하여 각 상황에 맞는 API를 호출하거나 게임을 진행시키는 자동화된 플레이를 구현하였습니다.
<!-- 실제 공장 작업자의 조립 데이터를 수신하여 플레이 자동화, 게임 내 스테이지 및 보상 체계와 연동하는 시스템을 구현하였습니다.   -->

# Troubleshooting
{% include highlights/projectc-wheel-on-navmesh.md %}