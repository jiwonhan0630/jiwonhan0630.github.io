---
layout: basic
title: "Elements"
description: "CSS 미리보기용 페이지"
tags:
    - "test1"
    - "test2"
    - "test3"
---

## 제목 2단계입니다.
제목 2단계입니다.
### 제목 3단계입니다.
제목 3단계입니다.
#### 제목 4단계입니다.
제목 4단계입니다.
- 리스트입니다.
- 이것도 리스트입니다.
    - 리스트의 하위 리스트입니다.
    - 이것도 하위 리스트임
- 다시 돌아갑시다.

# title-stuck
{: .title-stuck}

## title-stuck
{: .title-stuck}

### title-stuck
{: .title-stuck}

#### title-stuck
{: .title-stuck}

# title-strike
{: .title-strike}

## title-strike
{: .title-strike}

### title-strike
{: .title-strike}

#### title-strike
{: .title-strike}

# Buttons

[주제 버튼](#){: .button .sub sub="위쪽에 뜨는 글자"}
[가운데 정렬 주제 버튼](#){: .button .sub .center sub="위쪽에 뜨는 글자"}
[주제거꾸로버튼](#){: .button .sub .reverse sub="주제거꾸로버튼은 아래쪽에 설명이 뜨도록 되어있습니다.&#10;이렇게하면 더 내용을 많이 쓰는 경우에 사용하면 좋겠죠"}
[일반 버튼](#){: .button .normal}
[가운데 정렬 일반 버튼](#){: .button .normal .center}

<button>button</button>
<input type="submit">
<input type="reset">
<input type="button">


{% include components/button-subject.html 
   main-text="새로운 버튼 테스트" 
   sub-text="내용물 테스트" 
   icon="menu_open" 
   class="center" 
%}

이 프로젝트의 핵심은 [핵심 하이라이트 보기]({% link _about/wang-tile.md %}){: .modal-link} 에서 확인하라구.


# SectionBox


<section class="sectionbox">
<div class="sectionbox-header">
<h1>개발 편의 기능</h1>
<p>
개발 과정에서 발생하는 비효율적인 작업을 개선하고,<br>
실무에 즉시 도입 가능한 기능을 구현하여 팀의 생산성을 끌어올릴 수 있습니다.
</p>
</div>
<div class="sectionbox-content" markdown="1">

## Attribute 기반의 자동 이벤트 바인딩 시스템
{% include highlights/projectpz-editor-ui.md %}

## CSV Utility
{% include highlights/csv-utility.md %}

## Naming Tool
{% include highlights/naming-tool.md %}

</div>
</section>

<section class="sectionbox">
<div class="sectionbox-header">
<h1>에디터 확장 기능</h1>
<p>
개발 과정에서 발생하는 비효율적인 작업을 개선하고,<br>
실무에 즉시 도입 가능한 기능을 구현하여 팀의 생산성을 끌어올릴 수 있습니다.
</p>
</div>
<div class="sectionbox-content" markdown="1">

## Attribute 기반의 자동 이벤트 바인딩 시스템
{% include highlights/projectpz-editor-ui.md %}

## CSV Utility
{% include highlights/csv-utility.md %}

## Naming Tool
{% include highlights/naming-tool.md %}

</div>
</section>



# Tables
|제목|
|---|
|테스트1|테스트2|테스트3|
|테스트1|테스트2|테스트3|
|테스트1|테스트2|테스트3|



||||
|---|---|
|ets|ets|
|ets|ets|