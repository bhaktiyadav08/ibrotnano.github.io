---
layout: post
title: "Reverb richtig benutzen"
date:   2018-05-25 12:00:00 +0100
category: music
tags: music sound effect reverb
excerpt: "Reverb ist einer der wichtigsten Effekte in einer Musikproduktion. Richtig eingesetzt wirkt Musik durch den Hall natürlich. Das ist auch nicht verwunderlich. In der Realität hallt jedes Geräusch und wir nehmen diese Information unterbewusst war um die Entfernung einer Geräuschquelle festzustellen. Falsch angewendetern Hall empfinden wir so auch schnell als falsch oder störend."
typora-copy-images-to: ..\assets\posts\2018-05-25-reverb-richtig-benutzen\images
typora-root-url: ..\
---

# Reverb richtig benutzen

Reverb ist einer der wichtigsten Effekte in einer Musikproduktion. Richtig eingesetzt wirkt Musik durch den Hall natürlich. Das ist auch nicht verwunderlich. In der Realität hallt jedes Geräusch und wir nehmen diese Information unterbewusst war um die Entfernung einer Geräuschquelle festzustellen. Falsch angewendetern Hall empfinden wir so auch schnell als falsch oder störend.

## Hall in der Musikproduktion

Sowie die Position links, rechts oder mittig von uns mit dem Pan festgelegt werden kann, so ist es mit dem Hall möglich die Position eines Instruments in der Tiefe des Raums zu bestimmen. Instrumente die näher an uns positioniert sind bekommen so mehr gewischt. Realistisch ist somit zum Beispiel, dass ein Sänger näher an uns steht als ein virtueller Pad-Sound aus dem Synthesizer, der nur unterschwellig zu hören sein soll. Auch Bässe sollen meistens möglich präsent im Mix sein.

Sounds, die einen langen Hall und eine hohe Pre-Delay-Zeit haben wirken weit entfernt. Umgekehrt wirkt kurzer Hall und kurze Pre-Delay-Zeit nah.

## Verwendung des Reverb-Effekts

Da der Hall so eine große Auswirkung auf unsere Wahrnehmung hat, sollte seine Verwendung vorher etwas geplant werden. Ich bin bei meinen Recherchen auf zwei Vorgehensweisen gestoßen, die ich sehr vielversprechend fand:

### Hall zur Bestimmung der Position im Raum

Bei dieser Technik wird Hall eingesetzt um die Position im Raum festzulegen. Man stellt sich hinter den Instrumenten eine Wand vor, wie man es von einer Bühne gewöhnt ist. Durch die Länge des Halls wird die Entfernung des Zuhörers zur Quelle bestimmt. Die Entfernung des Zuhörer ändert sich nicht. Somit müsste, streng genommen, dann auch jedes Instrument den selben Hall verwenden, der einen Raum nachbildet, und der Pre-Delay müsste sich ändern. Der Pre-Delay ist der Tone der von der Wand hinter der Bühne reflektiert wird. Dieser muss erst den Weg zur Wand und dann den selben Weg nochmal an dem Instrument vorbei zurücklegen bevor er beim Hörer ankommt. Ist der Pre-Delay sehr hoch nimmt man ein Echo wahr. Deshalb auch der Name Pre-Delay. http://www.delamar.de/tutorials/pre-delay-berechnen-13914/ beschreibt diese Technik näher und bietet die einfache Formel **6 * Entfernung zur Wand in Meter** an um den Wert für den Pre-Delay zu berechnen.

Diese Technik eignet sich sehr gut zum Abmischen von Bandaufnahmen.

### Hall auf Return-Spuren

Bei einer anderen Technik werden Return-Spuren angelegt. In dem Beispiel, dass ich gesehen habe wurden drei Return-Spuren angelegt. Auf jeder lag ein Hall. Einer hatte eine kurze Länge für Instrumente mit hoher Präsenz. Einer hatte eine mittlere Länge und einer eine extrem weite. Mit diesen Dreit Spuren kann man relativ leicht gleichmäßig Hall auf alle Instrumente legen. Das Ergebnis ist dann nicht so realisitisch als würde man wie in der ersten Lösung vorgehen aber es muss auch nicht alles physikalisch realistisch klingen. Es wird empfohlen den Pre-Delay mit der Geschwindigkeit des Songs zu synchronisieren. Die Werte lassen sich folgendermaßen berechnen:

60.000/BPM=Millisekungen pro Takt

z.B. 60000/89=674,2

Teilt man dieses Ergebnis weiter duch 2 bekommt man eine Liste möglicher Werte für den Pre-Delay:

674,2/2~337

337/2~168,5

168,5/2~84,3

84,3/2~42,1

42,1/2~21,1

21,1/2~10,5

### Hall auf Bässe

Gibt man einen Hall auf Bässe kommen weitere tiefe Frequenzen hinzu. Das Frequenzsprektrum im tiefen Bereich ist jedoch sehr gering. von den 20 Hz bis 20000 Hz die wir hören sind nur die unteren Frequenzen bis ca. 250 Hz Bassfrequenzen. Durch den Hall wird alles so voll, dass es sehr leicht unsauber, breiig, muddy klingt. Ableton Live z.B. bietet die Option im Reverb-Effekt einen Low-Cut einzustellen um den Hall nicht auf die tiefen Frequenzen anzuwenden.

![Low-Cut im Reverb-Effekt](/assets/posts/2018-05-25-reverb-richtig-benutzen/images/reverb-bass-cut.png){:.img-content}

## Fazit

Für welche Technik man sich entscheidet kann natürlich jeder für sich selbst entscheiden. Auf jeden Fall sind es gute Fausregeln um beim experimentieren mit Hall einen guten Ansatz zu finden.