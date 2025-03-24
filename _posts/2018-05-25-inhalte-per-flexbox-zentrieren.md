---
layout: post
title: "Inhalte per CSS mit Flexbox zentrieren"
date:   2018-05-25 12:00:00 +0100
category: development
tags: web development css flexbox stylesheet
excerpt: "Es gibt unzählige Methoden zum zentrieren von Inhalten per CSS. Mein Favorit ist momentan das Zentrieren per Flexbox."
typora-copy-images-to: ..\assets\posts\2018-05-25-inhalte-per-flexbox-zentrieren\images
typora-root-url: ..\
---

# Inhalte per CSS mit Flexbox zentrieren

Es gibt unzählige Methoden zum zentrieren von Inhalten per CSS. Mein Favorit ist momentan das Zentrieren per Flexbox.

Mit nur sehr wenig CSS lässt sich eine wiederverwertbare Regel definieren:

```css
.center-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.center-wrapper > div:first-child {
    width: 80%;
}
```

Jetzt muss das HTML der Seite nur minimal erweitert werden:

```html
<div class="center-wrapper">
	<div>
    	Inhalt
    </div>
</div>
```

Mehr ist nicht nötig.