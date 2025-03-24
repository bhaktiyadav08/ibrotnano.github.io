---
layout: post
title: "Ein Print-Layout mit Bootstrap 4"
date:   2018-05-18 12:00:00 +0100
category: development
tags: blog web development bootstrap css styling
excerpt: "Bootstrap 4 bietet einen einige kleine Helfer-CSS-Klassen mit denen sich grob das Print-Layout beeinflussen lässt. So ist es z.B. möglich bestimmte Inhalte beim Drucken gar nicht erst anzuzeigen."
typora-copy-images-to: ..\assets\posts\2018-05-18-print-layout-mit-bootstrap-4\images
typora-root-url: ..\
---

# Ein Print-Layout mit Bootstrap 4

Bootstrap 4 bringt einige Funktionen mit, um Layouts von Webseiten für das Drucken fit zu machen. So werden z.B. Navigationen standardmäßig im Print-Layout ausgeblendet. Es lassen sich aber auch beliebig alle anderen Elemente aus- oder einblenden.

Bootstraps Dokumentation[^bootstrap-doc-display-print] dokumentiert dieses Feature.

## Elemente ausblenden

Das Ausblenden könnte nicht einfacher sein. Es reicht das Hinzufügen einer einzigen CSS-Klasse.

```html
<div class="d-print-none">
    ...
</div>
```

## Zusätzliche Tweaks

Mit den Klassen, die Bootstrap anbietet lässt sich enormer Einfluss auf das Browserverhalten des Print-Layouts nehmen. Ich brauchte für meinen eigenen Blog aber noch ein paar kleine zusätzliche Tweaks.

```css
@media print {
    .print-hide-background {
        background-image: none !important;
        background-color: transparent !important;
    }

    .print-page-break-after {
        page-break-after: always;
    }

    .print-page-break-before {
        page-break-before: always;
    }

    .print-color-black {
        color: black !important;
    }

    code, pre {
        border: none !important;
    }
}
```

Mit `.print-hide-background` lassen sich Hintergrundbilder und Farben entfernen. Das spart Tinte.

`.print-page-break-after` und `print-page-break-before` fügt einen Seitenumbruch in der Druckansicht ein. Das Layout auf den Seiten kann so bei z.B. Überschriften sauberer Verteilt werden, wenn man einen längeren Text geschrieben hat.

`.print-color-black` kann genutzt werden um helle Schriften dunkel zu machen.

## Fazit

CSS eignet sich hervorragend um aus einer Webseite beim Drucken einen schönen, aufgeräumten Text auszudrucken. Bootstrap nimmt einem einiges an Arbeit ab. Probiert es einfach aus. STRG + P und sehen was passiert.

[^bootstrap-doc-display-print]: Bootstraps Display in Print — [https://getbootstrap.com/docs/4.1/utilities/display/#display-in-print](https://getbootstrap.com/docs/4.1/utilities/display/#display-in-print)

