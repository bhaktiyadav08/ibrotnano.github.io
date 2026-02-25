---
layout: default
title: Archiv
permalink: /archive/
---

# Archiv nach Datum

{% assign postsByYear = site.posts | group_by_exp: 'post', 'post.date | date: "%Y"' %}
{% for year in postsByYear %}
## {{ year.name }}
{% assign yearPosts = year.items | sort: 'date' | reverse %}
{% for post in yearPosts %}
- {{ post.date | date: "%d.%m" }} — [{{ post.title }}]({{ post.url | relative_url }})
{% endfor %}

{% endfor %}
