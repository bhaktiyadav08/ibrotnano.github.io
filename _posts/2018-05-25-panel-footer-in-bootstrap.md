---
layout: post
title: "Panel-Footer in Bootstrap"
date:   2018-05-25 12:00:00 +0100
category: development
tags: web development css stylesheet bootstrap
excerpt: "Die Footer in einem Bootstrap-Panel passen sich nicht den Farben an, wenn man z.B. ein Info- oder ein Warning-Panel nutzt. Dies ist eine Desingentscheidung von Bootstrap, da der Footer so mehr im Hintergrund bleibt. Es gibt also durchaus einen guten Grund, aber wenn man doch einen einheitlicheren Look erreichen möchte kann man natürlich das entsprechende CSS ergänzen."
typora-copy-images-to: ..\assets\posts\2018-05-25-panel-footer\images
typora-root-url: ..\
---

# Panel-Footer in Bootstrap

Die Footer in einem Bootstrap-Panel passen sich nicht den Farben an, wenn man z.B. ein Info- oder ein Warning-Panel nutzt. Dies ist eine Desingentscheidung von Bootstrap, da der Footer so mehr im Hintergrund bleibt. Es gibt also durchaus einen guten Grund, aber wenn man doch einen einheitlicheren Look erreichen möchte kann man natürlich das entsprechende CSS ergänzen.

```css
.panel-primary > .panel-footer {
  color: #fff;
  background-color: #337ab7;
  border-color: #337ab7;
}

.panel-success > .panel-footer {
  color: #3c763d;
  background-color: #dff0d8;
  border-color: #d6e9c6;
}

.panel-info > .panel-footer {
  color: #31708f;
  background-color: #d9edf7;
  border-color: #bce8f1;
}

.panel-warning > .panel-footer {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border-color: #faebcc;
}

.panel-danger > .panel-footer {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}
```