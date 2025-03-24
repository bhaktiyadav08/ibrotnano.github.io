---
layout: post
title: "Dokumentation"
date:   2021-01-28 15:10:00 +0100
category: development
tags: development documentation
excerpt: "Weniger ist mehr ist die Devise. Schon klar. Dokumentation ist wichtig und alles was wichtig ist muss auch dokumentiert sein. Aber was ist wichtig? Und in welcher Form sollte man dokumentieren?"
typora-root-url: ..\
---

# Dokumentation

Weniger ist mehr ist die Devise. Schon klar. Dokumentation ist wichtig und alles was wichtig ist muss auch dokumentiert sein. Aber was ist wichtig? Und in welcher Form sollte man dokumentieren?

## Was ist wichtig?

Wichtig ist alles was man wissen muss um nachzuvollziehen **warum** **wer** **was** **wann** **wo** gemacht hat.

Da sind sie, die W-Fragen.

An dieses Grundgerüst des kritischen Journalismus halte ich mich auch beim Dokumentieren und habe damit ganz gute Erfahrungen gemacht.

In einer agilen Welt kommt man mit einer Dokumentation, die diese Fragen beantwortet, ganz gut zurecht, denn eine agile Welt ändert sich. Genau dieser Tatsache gilt es Respekt zu zollen. Den einzigen Anspruch den ich an Dokumentation habe ist, die Historie der Änderungen nachvollziehen zu können.

Wenn ich etwas an Software ändern muss, will ich wissen warum die Software so ist, wie sie ist. Es muss einen Grund haben warum sie so umgesetzt wurde. Haben sich die Anforderungen an die Software geändert oder gibt es da noch alte Anforderungen zu berücksichtigen?

So eine Entscheidung lässt sich ohne Dokumentation nicht treffen.

Um zu einer Dokumentation zu gelangen, aus der man diese Informationen ziehen kann, muss man sich eine Strategie überlegen. Der Ansatz, der mich am meisten überzeugt, ist der, vor allem Entscheidungen zu dokumentieren.

Wenn bei der Projektplanung eine Entscheidung getroffen wird, die den weiteren Verlauf des Projektes beeinflusst oder bestimmt, muss man diese in einem Dokument festhalten.

Wenn ich als Entwickler eine Entscheidung treffe, die die Architektur oder technische Umsetzung der Software festlegt, dann muss ich auch dies festhalten.

Anforderungen an die Software führen zu Entscheidungen auf Projektebene, diese führen zu weiteren Anforderungen an die Software, die zu Entscheidungen auf der technischen Ebene führen. Diese Verkettung besteht und ändert sich ständig.

Die Dokumentation sollte genau das wieder spiegeln und diesen Prozess stetig weiter festhalten. Nun zu den Fragen, die man im Geiste als Checkliste abarbeiten kann. Checklisten sind tolle Dokumentation.

- **Warum** wurde die Entscheidung getroffen?
- **Wer** hat entschieden?
- **Was** wurde entschieden?
- **Wann** wurde es entschieden?
- **Wo** wurde es entschieden? Im Meeting oder auf dem Klo? Diese Frage ist vielleicht eher für größere Unternehmen mit mehreren Managementebenen interessant.

### Was ist sonst noch wichtig?

Sind neben Entscheidungen sonst noch irgendwelche Infos wichtig? Sicher. Alles was für eure Workflows wichtig ist. Konfigurationsanleitungen für neue Features für die QA vielleicht. Anleitungen für Endkunden mit Sicherheit. Gibt es einen Prozess, wie Scrum. Blocker, Planungsmeetings, Retrospektiven gehören dokumentiert, weil sie wiederum Anforderungen, Entscheidungen… nach sich ziehen.

Was sonst noch wichtig ist muss ein Team bei seiner Arbeit selbst erkennen, normieren und dokumentieren.

### Warum ist manches nicht wichtig?

Informationen können immer mal wichtig sein. Aber das Schreiben von Dokumentation braucht Zeit. Also muss man einen Kompromiss eingehen und manches ist halt einfach weniger wichtig.

Natürlich kann ein Lastenheft mit UML-Diagrammen bis ins kleinste Detail ausgearbeitet eine schöne Grundlage für einen Vertrag sein. Wird die Software dann auch so umgesetzt, hat man auch eine perfekte Dokumentation. Ist das aber nicht der Fall oder kommt irgend ein Verrückter später mal auf die Idee die Software einfach zu ändern, dann ist die Dokumentation veraltet.

Sie spiegelt immer nur eine Momentaufnahme eines Standes wieder.

Wenn jetzt ein Entwickler den Code ändert ohne das UML-Diagramm neu zu malen, dann haben wir ein Problem. Der nächste Entwickler schaut sich das Diagramm an und glaubt die Software würde so funktionieren. Die Informationen leiten ihn in die Irre.

Zeit in ein Dokument zu vergeuden, dass bald schon veraltet und falsch sein wird ist eine Verschwendung von Arbeits- und Lebenszeit**.** (Der Punkt ist Fett geschrieben. Das kann man leicht überlesen.)

## Topform

Die Ideale Form der Dokumentation gibt es vielleicht nicht. Aber zumindest lassen sich ein par Anforderungen festlegen.

- Sie sollte von allen Beteiligten angelegt und erweitert werden können.
- Sie soll allen Beteiligten zur Verfügung stehen.
- Sie muss diskutiert werden können.
- Sie muss einfach und schnell “nebenbei” geschrieben werden können, so dass der Aufwand so minimal wie möglich ist. Ansonsten wird sie nicht geschrieben, wenn die Zeit knapp ist.
- Sie muss verständlich sein.
- Man muss Informationen in ihr finden können.

Nicht perfekt, aber brauchbar sind Wikis.

Online per Browser editierbar, mit Kommentarfunktion und einem brauchbaren Seiteneditor und Suchfunktion, sind alle Anforderungen erfüllt.

Mit Templates in Confluence z.B. lassen sich auch Dokumentationsprozesse wunderbar normieren. Gleichzeitig sparen sie auch eine Menge Tipparbeit. Template ausfüllen und fertig.

Wie brauchbar das Ergebnis wird hängt dann **nur** noch vom Menschen ab.

Als Faustregel versuche ich dabei folgendes einzuhalten.

**Ich will besser sein als das Internet! Weniger als 60% Porno, weniger als 39% Werbung, mehr als 1% Information.**

Ja, Faustregeln müssen sich gut merken lassen.

“Porno” heißt Dokumentation als Selbstzweck anzufertigen.

“Werbung” heißt zu zeigen was man alles so tolles gemacht hat ohne Informationen zu geben, die für **andere** nützlich sind.