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
[에디터 확장 기능](#에디터-확장-기능){: .button .subject-negative .arrow sub="UIToolkit을 사용한 주행 경로 에디터·베이커"}
[산업 데이터 기반 게이미피케이션 로직](#gamification){: .button .subject .arrow sub="UnityWebRequest를 사용한 실제 작업자의 산업 데이터를 사용한 플레이 로직"}
[차량 AI 및 자율 주행 시스템](#car-ai){: .button .subject .arrow sub="NavMesh Baking을 활용한 자율 주행 AI"}
[실시간 파츠 교체 시스템](#parts-system){: .button .subject .arrow sub="주행 중 정차 없이 차량의 부품을 교체"}
[Hat Socket 자동 설정 기능](#hat-socket-자동-설정-기능){: .button .subject .arrow sub="모자 착용 위치 자동 설정"}
[전용 런처 개발](#){: .button .subject .pointer-none sub="클라이언트의 자동 업데이트와 재실행, 버전 관리 기능이 포함된 전용 런처 구현"}
[Troubleshooting](#troubleshooting){: .button .subject-negative .arrow sub="NavMesh 기반 환경에서 WheelCollider를 사용하는 차량 구현"}

# 세부 내용

## 에디터 확장 기능

### 주행 경로 에디터
원하는 경로로 차량이 이동할 수 있도록 자율 주행 경로를 제작할 수 있는 경로 제작 기능을 구현하였습니다.  
경로 에디터 윈도우에 UIToolkit을 사용하여 노드의 추가 및 삭제 버튼, 선택된 노드의 정보를 표시하였으며,  
씬 뷰에서 Gizmos와 Handles를 사용하여 각 노드의 위치와 각도를 수정할 수 있도록 하였습니다.  

### 주행 경로 베이커
NavMeshAsset을 생성하는 대신 별도의 ScriptableObject를 통해 NavMesh 폴리곤 좌표와 커스텀한 주행 경로를 저장하는 베이킹 기능을 구현하였습니다.  
기존의 Navigation 윈도우를 사용하는 대신 각 씬마다 설정이 필요한 정보만 노출하는 전용 에디터 윈도우를 구현하였습니다.  

## 실시간 산업 데이터 기반 게이미피케이션 로직
{: #gamification}

UnityWebRequest와 UniTask를 사용, 백엔드에서 제공한 API를 호출하여 실제 공장 작업자의 조립 데이터를 송수신하였습니다.  
데이터 송수신 로직을 독립적으로 분리하고 Behaviour Tree의 구조를 차용하여,  
수신된 데이터를 통해 피버타임 진입, 게임 내 스테이지나 씬 변경 등의 필요를 판단하여 각 상황에 맞는 API를 호출하거나 게임을 진행시키는 자동화된 플레이를 구현하였습니다.
<!-- 실제 공장 작업자의 조립 데이터를 수신하여 플레이 자동화, 게임 내 스테이지 및 보상 체계와 연동하는 시스템을 구현하였습니다.   -->

## 차량 AI 및 자율 주행 시스템
{: #car-ai}

Unity AI Navigation의 NavMesh Baking을 통해 생성되는 폴리곤의 좌표를 활용하여, NavMeshAgent없이 WheelCollider를 통해 이동하는 자율 주행 시스템을 구현하였습니다.  
별도의 베이킹 프로세스를 구현하여, NavMesh와 관련된 애셋을 생성-사용하지 않고, 노드 정보가 저장된 ScriptableObject를 생성하여 사용하였습니다.  
차량 AI는 전략 패턴과 커맨드 패턴을 응용하여 주행 시 발생하는 각종 사건(충돌, 우회 등)과 환경의 변화에 따라 다른 주행 방식을 적용할 수 있도록 구현하였습니다.  

## 실시간 파츠 교체 시스템
{: #parts-system}

주행 도중 정지 없이 차량의 부품을 변경하고, 주행 성능에 반영되는 시스템을 구현하였습니다.  
바퀴가 변경되었을 때, MeshRenderer의 Bound 크기를 통해 WheelCollider의 반지름을 조절합니다.  
또한 차체의 무게나 길이가 변경되었을 때, 무게 중심을 변경하고 예상 회전 반경을 계산하여[(관련자료)](https://www.mdpi.com/1424-8220/23/12/5751), 주행 경로를 수정하였습니다.

## Hat Socket 자동 설정 기능
차량의 모자 액세서리 착용 위치를 자동으로 설정해주는 기능을 구현하였습니다.  
바디 쉘에 해당하는 메쉬에서 가장 높은 위치의 폴리곤을 탐색하여 기울기를 적용하여 오브젝트의 Hat Socket으로 설정합니다.  
Gizmos를 통해 Hat Socket의 위치에 장착될 모자 메쉬를 표시하여 간단한 미리보기 기능을 구현하였습니다.  

# Troubleshooting
## 문제 상황
NavMeshAgent를 사용하여 이동하는 방식이었으나, 개발 도중 WheelCollider를 통해 이동하도록 스펙이 변경되었습니다.  
각 스테이지는 이미 NavMesh를 사용하는 규격으로 구현되어있었기 때문에, 스테이지를 수정하는 것은 불가능했습니다.  
Unity AI Navgation을 통해 이동하는 차량에 물리적인 상호작용과 각 부품의 변경에 따른 성능 차이를 추가해야함.  
기존 스테이지는 특별한 규격 없이 씬 하나에 NavMesh를 사용함.

## 해결 과정
Unity AI Navigation의 Baking에 사용되는 함수를 역추적하여, 베이킹 시 생성된 NavMesh 폴리곤의 좌표를 별도의 ScriptableObject로 저장하였습니다.
하지만 해당 좌표를 통한 최단경로 이동 시(NavMesh의 경로 따라가기 함수 사용) 폴리곤의 꼭짓점 부분을 이용하여 가장자리(코너)를 이동하기 때문에 시각적으로 부자연스러움.  

이를 해결하기 위해 삼각형의 무게중심 좌표를 선형보간하여 이동하도록 하였으나, 분할된 삼각형의 모양에 따라 불필요한 움직임이 생겼음.
최종적으로는 삼각형이 맞닿는 모서리의 중간 지점 좌표를 이용하도록 수정하여, 길의 중앙을 주행할 수 있도록 구현하였음.

NavMeshAgent를 제거하며 사라진 장애물 회피 능력을 보완하기 위해,  
raycast를 통해 일정 거리 내의 다른 오브젝트를 인식하여 회피, 후진, 정지하는 기능을 추가하였음.  
박스나 캡슐 모양의 충돌체를 가진 고정 오브젝트를 감지할 경우, 각 충돌체의 좌표와 회전값을 바탕으로 우회 경로를 생성하여,  
현재 속력과의 계산을 통해 예측된 시간 내에 도착하지 못할 경우 재탐색을 시도하도록 함.  