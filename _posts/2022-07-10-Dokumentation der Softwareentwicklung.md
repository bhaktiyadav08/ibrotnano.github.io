---
layout: post
title: "Dokumentation der Softwareentwicklung"
date:   2022-07-10 00:00:00 +0200
category: development
tags: development best-practices dokumentation
excerpt: "Dokumentation ist nicht gerade die Lieblingsaufgabe eines Softwareentwicklers. Sie braucht Zei, auch wenn Termindruck herrscht. Sie braucht auch Konzentration und lässt sich nicht einfach nebenbei erledigen. Jedenfalls nicht, wenn sie gut sein soll. Also Informationen enthalten soll, die nützlich sind. Diese Informationen müssen dann auch noch auffindbar sein. Am besten für Jeden, der sie braucht. Zu guter Letzt muss sie auch aktuell gehalten werden, da sie sonst im schlimmsten Fall zu falschen Annahmen führt."
---

# Dokumentation der Softwareentwicklung

Dokumentation ist nicht gerade die Lieblingsaufgabe eines Softwareentwicklers. Sie braucht Zei, auch wenn Termindruck herrscht. Sie braucht auch Konzentration und lässt sich nicht einfach nebenbei erledigen. Jedenfalls nicht, wenn sie gut sein soll. Also Informationen enthalten soll, die nützlich sind. Diese Informationen müssen dann auch noch auffindbar sein. Am besten für Jeden, der sie braucht. Zu guter Letzt muss sie auch aktuell gehalten werden, da sie sonst im schlimmsten Fall zu falschen Annahmen führt.

Eine ganze Menge Anforderungen, die eine ordentliche Dokumentation erfüllen muss.

## Was verstehe ich unter Dokumentation?

Dokumentation sind alle nützlichen Informationen, die den Entwicklungsprozess beschreiben. Sie beantworten zuerst einmal die 5 W-Fragen. Es ist journalistische Arbeit wenn man so will.

1. Was wurde entwickelt?
2. Warum wurde es entwickelt?
3. Wann wurde es entwickelt?
4. Von Wem wurde es entwickelt?
5. Wie wurde es entwickelt?

## Was ist keine Dokumentation?

Alles was niemals wieder gelesen wird, weil es keine nützlichen Informationen enthält. Nützlich ist, was zum Verständnis des aktuellen Stands einer Software beiträgt.

## Der Status der Software

Das Verständnis des aktuellen Stands der Software. Dies ist es, was eine Dokumentation erklären soll. Es ist nicht möglich alle Dokumente anzupassen, wenn sich der Stand der Software ändert. Es reicht eine Zeile Code zu ändern und eine Anpassung der Dokumentation ist wahrscheinlich nötig. Wen man weiß, dass es ein entsprechendes Dokument gibt, ist alles in Ordnung. Man kann es anpassen. Weiß man es aber nicht, gehen der Zustand der Software und die Dokumentation getrennte Wege. Wenn jetzt ein neuer Mitarbeiter mit der Dokumentation zur Einarbeitung anfängt, macht er falsche Annahmen über die Funktionsweise der Software.

Dokumentation ist immer nur eine Momentaufnahme. Dies muss jedem bewusst sein. Allerdings lässt sich an ihr die Historie der Software nachlesen. Wenn eine Dokumentation gut geschrieben ist, kann man ihr trotzdem nützliche Informationen über die Intention entnehmen. Dies ist wieder wichtig, wenn man eigene Designentscheidungen treffen muss.

## Mein Workflow

Bei all den Anforderungen steht man glücklicherweise nicht alleine da. Es gibt mächtige Tools, die es einem erlauben eine brauchbare Dokumentation zu schreiben.

Ich arbeite agil, meine Dokumentation ist es auch.

### Was und warum?

Tickets sind das erste Mittel zu einer besseren Organisation. Sie sind aber auch gleichzeitig Dokumentation. Was und warum etwas gemacht wird, wird direkt im Ticket beschrieben. Scrum z.B. nutzt dafür das Format der *User Story*.

`<Benutzer>` will `<Aktion>` durchführen, um folgendes `<Ziel>` zu erreichen.

Im Zweifel reicht 1 Satz und das Was und Warum ist ausreichend beantwortet. Leider fällt es auch hier manchmal schwer diszipliniert zu arbeiten und alles Wichtige auch tatsächlich aufzuschreiben. Ein Template kann hier Abhilfe schaffen. Viele Tools unterstützen für diesen Zweck Templates in Markdown.

Zuerst sind diese Tickets Aufgaben und Hilfe für die Organisation des Entwicklungsprozesses. Ohne weiteres Zutun werden sie aber nach Erledigung zur Dokumentation jeder erledigten Arbeit. Die chronologische Reihenfolge der erledigten Tickets ist der chronologische Entwicklungsprozess der Software. Jede Designentscheidung ist hier in Kurzform bereits dokumentiert.

### Wann und wer?

Durch das Ticketsystem wird automatisch dokumentiert, wann eine Aufgabe und vom Wem sie erledigt wurde. Dokumentation kann sehr einfach sein. Alles was man schreiben muss, kann man nicht vergessen und auch keine Fehler machen.

### Wie?

Das Wie ist der Knackpunkt. Einige behaupten der Code selbst sei die beste Dokumentation. Das ist er so, wie die Arbeit selbst der beste Lohn ist. Selbst mit Kommentaren ist das Zusammenspiel von Komponenten nicht immer ersichtlich. In verteilten Systemen kann er gar nicht ersichtlich sein. Man hat den Code ja eventuell gar nicht vorliegen, weil er vielleicht von einem anderen Team bearbeitet wird.

Es ist also weitere Dokumentation erforderlich. Hier tritt in Kraft, was ich oben schon beschrieben habe. Eine detaillierte Dokumentation aller Implementierungsdetails kann hier nicht gepflegt werden. Was gehört aber trotzdem dokumentiert?

Die Architektur der Anwendung. Ich meine nicht UML-Diagramme jeder Klasse, da sie zu spezifisch sind. Ich meine Welche Komponenten gibt es? Wie interagieren diese?  Eventuell ist auch die Lösung eines technischen Problems allgemein interessant. Wie ist zum Beispiel die Authentifizierung gelöst.

Ich arbeite streng ein Template ab, dass ich für jedes Ticket anlege.

```markdown
## TODO

### Dev

- [ ] Create a `feature` branch
- [ ] Plan the architecture
- [ ] Update the dependencies
- [ ] Here is the place for development todo items
- [ ] Check if the exception handling is well done
- [ ] Check if further tests must be written
- [ ] Write meaningful comments
- [ ] Are there any compiler warnings?
- [ ] Do all unit tests pass?
- [ ] Phrase a meaningful commit comment
- [ ] Check-in the changes and push them to the server
- [ ] Describe the setup of the feature briefly

### Debug

- [ ] Test the story in a test environment
- [ ] Add TODOs for bugs and improvements

### Doc

- [ ] Do I need a new PIA or update an existing one?
- [ ] Update the README.md
- [ ] Update the CHANGELOG.md
- [ ] Describe the setup of the story if needed for end users
- [ ] Does something in the wiki needed to be updated?
- [ ] Needs other stuff been documented?
- [ ] Update the API documentation

### Demo

- [ ] Setup a fresh demo environment
- [ ] Are the requirements fulfilled?

### Dump

- [ ] Merge `feature` into `master`  with a `squash` and remove the `feature` branch
- [ ] Check if the compiled artifact is valid
- [ ] Cleanup the Git history locally on the dev system

## Open Questions?

1. @Who: What must be discussed?

## Blockers

1. Something blocks my work.

## Decisions

| Decision          | Description                |
| ----------------- | -------------------------- |
| What was decided? | Why was the decision made? |

## Architecture and design

Documentation of the planning, design of the API, design of the code and design of the UI.

## Setup

Briefly description of the features setup.

## Tests

| Name                        | Expected result   | Pass |
| --------------------------- | ----------------- | ---- |
| Unique name of a test case. | What is expected? | 🟢🔴🟡 |

### Name of a test case

How is the case set up?

## Notes

Nothing to mention.

## PIAs

- Link to related PIA

## Further documentation

- Link to further documentation
```

Ich arbeite dabei eine Checkliste ab, bis ein Ticket erledigt ist. Die Checkliste enthält alle allgemeinen Aufgaben, die für jedes Ticket erledigt werden müssen. Es ist die Dokumentation des Workflows.

Treten bei der Arbeit Fragen auf, die mit anderen diskutiert werden müssen, notiere ich diese. So kann ich sie bei der nächsten Gelegenheit besprechen.

Habe ich Probleme, die meinen Fortschritt beim Ticket behindern, einen Blocker, dann notiere ich diesen. Ich muss sie lösen, um weiter arbeiten zu können. Im Zweifel können die Blocker im nächsten Daily Scrum besprochen werden.

Oft muss ich als Entwickler Designentscheidungen treffen, die so granular sind, dass sie nicht in der Architekturplanung bekannt waren. Diese notiere ich, so dass später ersichtlich ist, warum ich etwas auf eine bestimmte Art gelöst habe.

Features brauchen oft etwas an Konfiguration um sie Testen zu können. Es hilft den Testern, wenn es eine Beschreibung des Setups gibt. Diese Beschreiung dient später als Vorlage für das Benutzerhandbuch.

Testfälle, die nicht automatisiert ausgeführt werden, sollten trotzdem dokumentiert werden. So kann man zumindest sehen, dass ein bestimmtes Setup mal funktioniert hat.

Alle weiteren Notizen und Links zu weiterführender Dokumentation gehören ebenfalls im Dokument verlinkt.

PIA beschreiben was mit persönlichen Daten geschieht. Sie können rechtlich vorgeschrieben sein. Aber es macht auch so Sinn, da sie einem bewusst machen welche und wie man Daten von Personen verarbeitet.

## Was noch?

Es gibt noch weitere Dokumente die sich lohnen dokumentiert zu werden.

Ich pflege Whiteboards für Scrum digital in einer Wiki. Remote ist dies eine Lösung, die ganz brauchbar ist.

Präsentationen, Mitschriften von Meetings und alles was zum Geschäftsprozess gehört können in Wikis dokumentiert werden. Confluence z.B. bietet dafür brauchbare Vorlagen. 