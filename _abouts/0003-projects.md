---
layout: basic
title: "참여 프로젝트"
description: "개발에 참여한 프로젝트 목록"
---

{% for work in site.works %}

{% include components/button-subject.html class="negative" url=work.url 
    icon="arrow_forward_ios" 
    main-text=work.title 
    sub-text=work.description 
%}

{% endfor %}
