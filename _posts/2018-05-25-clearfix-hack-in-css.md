---
layout: post
title: "Clearfix-Hack in CSS"
date:   2018-05-25 12:00:00 +0100
category: development
tags: web development css
excerpt: "Floating ist eine tolle Technik in CSS zum Positionieren von Inhalten und wenn eine Webseite responsiv sein soll kommt man wohl kaum ohne aus. Dabei entstehen allerdings öfter mal kleine Problemchen in der Darstellung wenn man Inhalte floatet."
typora-copy-images-to: ..\assets\posts\2018-05-25-clearfix-hack-in-css\images
typora-root-url: ..\
---

# Clearfix-Hack in CSS

Floating ist eine tolle Technik in CSS zum Positionieren von Inhalten und wenn eine Webseite responsiv sein soll kommt man wohl kaum ohne aus. Dabei entstehen allerdings öfter mal kleine Problemchen in der Darstellung wenn man Inhalte floatet.

![Float Problem](/assets/posts/2018-05-25-clearfix-hack-in-css/images/float-problem.png){:.img-content}

Im Beispiel befindet sich der Button außerhalb des umrahmenden Block-Elements. Dieses Verhalten entsteht dadurch, dass sich der Button als float-Element außerhalb des Flow-Layouts befindet. Der Browser muss explizit den Befehl bekommen das Floating auzusetzen. Dazu ist ein Element nach dem Button, aber vor dem abschließendem Tag des umrahmenden Elementes mit der Eigenschaft `clear:both;` nötig.

```html
<div>
	<button></button>
  	<span style="clear: both;" />
</div>
```

Dieses Vorgehen nennt man den **Clearfix-Hack**.

![Clearfix-Hack](/assets/posts/2018-05-25-clearfix-hack-in-css/images/problem-solved.png){:.img-content}

Es gibt Alternativen den Hack zu nutzen.

## Bootstrap

Bootstrap[^bootstrap] enthält bereits eine Umsetzung des Hacks. Dabei bekommt das umrahmende Element die Klasse **clearfix**.

```html
<div class="clearfix">
	<button></button>
</div>
```

## JQuery

Wer Bootstrap nicht nutzt kann mit Javascript Ähnliches bewirken. Ich nutze dabei JQuery um alle Elemente mit der Klasse **clearfix-hack** zu finden und eine **span** für den Fix anzuhängen.

```html
<div>
	<button class="clearfix-hack"></button>
</div>

<script>
 	$(document).ready(function () {
        $(".clearfix-hack").after("<span style=\"clear: both;\" />");
    });
</script>
```

## Flow-Root

Eine neue, aber elegante Weise ist die Nutzung von `display: flow-root`[^flow-root]. Diese möglichkeit kann in Firefox und Chrome schon verwendet werden und stellt einen Standard dar um den Fix zu umgehen. In Zukunft könnte es also die erste Wahl sein.

```html
<div style="display: flow-root">
	<button></button>
</div>
```

[^bootstrap]: Bootstrap-Clearfix-Hack — [https://v4-alpha.getbootstrap.com/utilities/clearfix/](https://v4-alpha.getbootstrap.com/utilities/clearfix/)
[^flow-root]: CSS zum erstellen eines neuen Block-Containers — [https://drafts.csswg.org/css-display-3/#valdef-display-flow-root](https://drafts.csswg.org/css-display-3/#valdef-display-flow-root)