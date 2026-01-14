---
layout: basic
title: "Project C"
description: "실시간 산업 데이터 기반 게이미피케이션"
image: /images/pic01.jpg
---

### 프로젝트 개요
- PC (Windows)
- Unity Engine
- MariaDB

## 담당 업무
[산업 데이터 기반 게이미피케이션 로직](#gamification){: .button .subject sub="UnityWebRequest를 통해 실제 작업자의 산업 데이터를 사용한 플레이 로직"}
[차량 AI 및 자율 주행 시스템](#car-ai){: .button .subject sub="NavMesh Baking을 활용한 자율 주행 AI"}
[실시간 파츠 교체 시스템](#parts-system){: .button .subject sub="주행 중 정차 없이 차량의 부품을 교체"}
[커스텀 에디터](#custom-editor){: .button .subject sub="주행 경로 편집, 액세서리 장착 위치 수정"}

[전용 런처 개발]{: .subject sub="클라이언트의 자동 업데이트와 재실행, 버전 관리 기능이 포함된 전용 런처 구현"}

[Troubleshooting](#troubleshooting){: .button .subject-negative sub="NavMesh를 사용하는 맵에서 WheelCollider를 굴리기"}

# 세부 내용
## 실시간 산업 데이터 기반 게이미피케이션 로직
{: #gamification}

UnityWebRequest와 UniTask를 사용, 백엔드에서 제공한 API를 호출하여 실제 공장 작업자의 조립 데이터를 송수신하였습니다.  
데이터 송수신 로직을 독립적으로 분리하고 Behaviour Tree의 구조를 차용하여, 수신된 데이터를 통해  
피버타임 진입, 게임 내 스테이지나 씬 변경 등의 필요를 판단하여 각 상황에 맞는 API를 호출하거나 게임을 진행시키는 자동화된 플레이를 구현하였습니다.
<!-- 실제 공장 작업자의 조립 데이터를 수신하여 플레이 자동화, 게임 내 스테이지 및 보상 체계와 연동하는 시스템을 구현하였습니다.   -->

## 차량 AI 및 자율 주행 시스템
{: #car-ai}

Unity AI Navigation의 NavMesh Baking을 통해 생성되는 폴리곤의 좌표를 사용하여 NavMeshAgent없이 WheelCollider를 통해 이동하는 자율 주행 시스템을 구현하였습니다.  

자율 주행 시스템은 아래와 같이 구현하였습니다.  

Brain: 다음 목적지를 결정하는 로직과, 주행 시 발생하는 상황에 대한 대응 방식이 구현되어있으며, 목적지와 행동()
Controller: Brain 클래스의 따라 WheelCollider의 값을 변경하여 차량을 이동시킵니다.

부품에 할당된 성격에 따라 목적지를 결정하는 기준과 주행 시 발생하는 상황에 대한 대응 방식이 구현되어있는 Brain 클래스,  
Brain 클래스의 처리 결과에 따라 WheelController의 값을 변경하여 차량을 이동시키는 Controller를 구현하였습니다.  

|타입|이름|상세|
|:---|:---|:---|
|class|CarBrain|특정 상황을 감지하고 정해진 BrainAction을 호출하여, 반환된 DriveAction을 CarController에게 넘겨줍니다.|
|class|CarController|들어온 DriveAction의 값에 따라 WheelCollider를 조작하여 차량을 이동시킵니다.|
|class|BrainAction|장애물을 감지하였을 때, 보상을 획득하였을 때 등, 특정 상황에 대한 대응 방식이 구현되어있습니다. DriveInfo을 받고 DriveAction을 반환합니다.|

### 실시간 파츠 교체 시스템
{: #parts-system}

주행 도중 정지 없이 차량의 부품을 변경하고, 주행 성능에 반영되는 시스템을 구현하였습니다.  
바퀴가 변경되었을 때, MeshRenderer의 Bound 크기를 통해 WheelCollider의 반지름을 조절합니다.  
또한 차량의 무게와 길이가 변경되었을 때, 예상 회전 반경을 계산하여[(관련자료)](https://www.mdpi.com/1424-8220/23/12/5751), 주행 경로를 수정합니다.

### 커스텀 에디터
{: #custom-editor}

**경로 에디터**: 사전에 정의된 경로를 제작하는 에디터 확장 기능 구현  
**파츠 비주얼 에디터**: UIToolkit을 사용하여 부품의 장착 위치와 외형을 에디터에서 즉시 설정하고 미리 볼 수 있는 툴 구현  
**레벨 베이킹 툴**: 레벨 디자인 후 필요한 데이터를 자동 추출하여 정적 데이터화하는 베이킹 툴 구현  

### 전용 런처 개발
클라이언트의 자동 업데이트와 재실행, 버전 관리 기능이 포함된 전용 런처 구현

# Troubleshooting
### 이슈 발생
NavMeshAgent를 사용하여 이동하는 방식이었으나, 개발 도중 WheelCollider를 통해 이동하도록 스펙이 변경되었습니다.  
각 스테이지는 이미 NavMesh를 사용하는 규격으로 구현되어있었기 때문에, 스테이지를 수정하는 것은 불가능했습니다.  
Unity AI Navgation을 통해 이동하는 차량에 물리적인 상호작용과 각 부품의 변경에 따른 성능 차이를 추가해야함.  
기존 스테이지는 특별한 규격 없이 씬 하나에 NavMesh를 사용함.

### 이슈 해결
Unity AI Navigation의 Baking에 사용되는 함수를 역추적하여, 베이킹 시 생성된 NavMesh 폴리곤의 좌표를 별도의 ScriptableObject로 저장하였습니다.
하지만 해당 좌표를 통한 최단경로 이동 시(NavMesh의 경로 따라가기 함수 사용) 폴리곤의 꼭짓점 부분을 이용하여 가장자리(코너)를 이동하기 때문에 시각적으로 부자연스러움.  

이를 해결하기 위해 삼각형의 무게중심 좌표를 선형보간하여 이동하도록 하였으나, 분할된 삼각형의 모양에 따라 불필요한 움직임이 생겼음.
최종적으로는 삼각형이 맞닿는 모서리의 중간 지점 좌표를 이용하도록 수정하여, 길의 중앙을 주행할 수 있도록 구현하였음.

NavMeshAgent를 제거하며 사라진 장애물 회피 능력을 보완하기 위해,  
raycast를 통해 일정 거리 내의 다른 오브젝트를 인식하여 회피, 후진, 정지하는 기능을 추가하였음.  
박스나 캡슐 모양의 충돌체를 가진 고정 오브젝트를 감지할 경우, 각 충돌체의 좌표와 회전값을 바탕으로 우회 경로를 생성하여,  
현재 속력과의 계산을 통해 예측된 시간 내에 도착하지 못할 경우 재탐색을 시도하도록 함.  