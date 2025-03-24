---
layout: post
title: "Schnittstellen zwischen Systemen"
date:   2020-11-20 16:53:00 +0100
category: development
tags: development architecture io design
excerpt: "Die Analyse von Schnittstellen zwischen Systemen ist komplex und herausfordernd. Hier ist ein kurze Strategie, mit der du dich an diese Aufgabe herantasten kannst."
typora-root-url: ..\
---

# Schnittstellen zwischen Systemen

## IO

Die IT liebt Buzzwords. AI, Machine Learning, Cloud, Microservices…

Das ist Ok. Marketing ist Teil des Geschäfts. Die einzelnen Begriffe bezeichnen natürlich auch verschiedene Techniken und Lösungsansätze. Was man sich aber bewusst machen sollte ist, dass die meisten Probleme in der IT auch mit dem antiquierten Begriff Elektronische Datenverarbeitung, EDV, bezeichnet werden können.

Das theoretische Grundgerüst ist tatsächlich alt, aber nicht antiquiert. 1936 hat Alan Touring[^1] die universelle Touringmaschine[^2] eingeführt. Moderne Computer und Programmiersprachen sind touringvollständig[^3] entworfen. Mit einfachen Worten: Alles was Computer berechnen können basiert auf dem selben theoretischen Gerüst. Daten gehen in ein System, werden verarbeitet und verarbeitete Daten kommen auf der anderen Seite heraus. Sind also EDV oder auch IO. Input –> Output, wobei die Grenze des Möglichen dazwischen das ist, was von Computern berechenbar ist.

Genug Verwirrung gestiftet. Denkt mal darüber nach, dass die Probleme, die ein Entwickler zu lösen hat sehr einseitig sind. Input –> rödel, rödel, rödel… –> Output.

Methoden machen das, Services machen das, Webseiten machen das, Neuronale Netzwerke machen das.

Am besten machen sie das deterministisch. Soll heißen was raus kommt hängt nur von dem ab was rein geht.

Hat man das begriffen, lebt man als Entwickler angstfreier. Niemals wird die unlösbare Monsteraufgabe auf euch zu kommen, außer vielleicht das zarte Geschlecht zu verstehen.

## Tur Tur

Wenn ihr trotzdem vor eine riesigen Aufgabe steht, riesig weil sie extrem komplex ist, dann ist es schwierig einen Punkt zu finden, an dem man beginnen kann. Man sieht vielleicht vor lauter Bäumen (Anforderungen) den Wald (Zusammenspiel der Anforderungen um einen Zweck zu erreichen) nicht. Es kann sein, dass eine Aufgabe dann als unlösbar riesig erscheint.

Da ist es gut zu wissen, dass theoretisch jede Aufgabe lösbar ist. Ihr habt hier Angst vor Tur Tur[^4].

Tur Tur ist ein Riese aus Lukas, dem Lokomotivführer. Er wird beschrieben als friedlich, empathisch, hilfsbereit aber einsam. Niemand traut sich an ihn heran. Das liegt daran, dass er aus der Ferne betrachtet riesengroß erscheint. Erst wenn man näher rann kommt, erkennt man, dass er ganz normal groß ist. Er ist ein Scheinriese.

Das ist jetzt auch mal über die IT hinaus lehrreich. Viele Probleme sind Scheinriesen und werden bei genauerer Betrachtung lösbar. Von IT-Problemen wissen wir ja, dass sie theoretisch lösbar sein müssen. Es kann sich also nur um Scheinriesen handeln.

Wie nähert man sich also am besten einem Problem an? In dem man es in Teilprobleme unterteilt.

Scrum zum Beispiel berücksichtigt dies, indem die Analyse auf den Schultern eines Teams und nicht auf dem eines Einzelnen verteilt ist. Aus einem Epic, der nur grob umrissen ist, werden Anforderungen, die begrenzt sind. Aus den Anforderungen werden dann Aufgabe, die umgesetzt werden können.

In einem Artikel “Mit Struktur an Schnittstellen[^5]” beschreibt der Autor, Michael Keller, ein simples Modell zum analysieren einer Schnittstelle. Es ist so simpel, dass es eigentlich nur 4 Punkte sind:

1. Prozesse
2. Daten
3. Systeme
4. Kommunikation

Anhand dieser 4 Punkte, kann man sich entlanghangeln um die Anforderung in Teilanforderungen zu trennen.

### Prozesse

Software bildet in der Regel reale Prozesse ab. Die Daten, die verarbeitet werden sollen, fallen in Unternehmen oder bei Benutzern an. Rechnungen, Fotos, soziales oder politisches Verhalten irgendwelcher Menschen. Als ersten Schritt kann man sich diese Prozesse visualisieren. Man kann dazu ein Flow-Chart nutzen. Hier spielt technisches Wissen noch gar keine Rolle. Nur der Prozess in der realen Welt muss hier definiert werden. Er ist es, der umgesetzt werden soll. Das Ziel der Arbeit.

- Was sind mögliche Voraussetzungen? 
- Wer nutzt diese Prozesse, wer betreut sie? 
- Lassen sich Business-Objekte identifizieren?

Sind die Prozesse klar, ergeben sich aus den Antworten dieser Fragen die Anforderungen an die Software. Sie können in User Stories ausgedrückt werden.

`<Wer>` macht `<was>` (und startet einen Prozess) um `<was>` zu erreichen (Ziel des Prozesses).

Aus den Voraussetzungen lassen sich Akzeptanzkriterien formulieren.

### Daten

Business-Objekte sind Daten und lassen sich in weitere Anforderungen an die Schnittstellen aufteilen.

Dabei kann man folgende Punkte analysieren:

- Wie viele Daten fallen an? 10 Datensätze pro Tag oder 10.000 in der Stunde? KB oder GB?
- Sind die Daten immer vollständig? Wann sind sie vollständig?
- Wann sind die Daten valide?
- Sind sie Zeitabhängig? 
- In welcher Reihenfolge werden die Daten im Prozess verarbeitet? 
- Können sie asynchron verarbeitet werden?
- Wo kommen die Daten her? 
- Wie sicher sind die Daten?
- Sind die Daten immer verfügbar?
- Und letztendlich die Struktur der Daten.

### Systeme

Daten sind immer in irgendeiner Form gespeichert. RAM oder Datenbank. Input –> Output heißt hier:

- Aus welchem System kommen die Daten? Fremdsoftware, E-Mail-Postfach, Scanner, Web…
- In welches System sollen die Daten?
- In welchen System oder Systemen werden die Daten im Prozess gehalten? Message Queue, Cache, RAM oder Dateisystem?
- Wo laufen diese Systeme? Lokal, Remote oder Cloud?
- Gibt es Ausfallszenarien?
- Wer ist Zuständig für die Administration?

Einige dieser Punkte sind Anforderungen an die Infrastruktur, andere wie Ausfallszenarien müssen in der eigenen Entwicklung berücksichtigt werden.

### Kommunikation

Nun sind Prozess, Daten und Akteure definiert. Als letzter Schritt kann die Kommunikation beschrieben werden. Dieser Schritt ist schon sehr technisch. Es entsteht hier schon ein sehr genaues Bild des Datenflusses.

- Welcher Akteur kommuniziert wann mit wem?
- Über welches Protokoll soll kommuniziert werden? HTTP, Soap, FTP ect.
- Wie wird die Kommunikation abgesichert?
- Muss die Kommunikation synchron sein oder kann sie asynchron ablaufen?

[^1]: **Alan Touring:** https://de.wikipedia.org/wiki/Alan_Turing
[^2]: **Universelle Touringmaschine:** https://de.wikipedia.org/wiki/Turingmaschine
[^3]: **Touringvollständigkeit:** https://de.wikipedia.org/wiki/Turing-Vollst%C3%A4ndigkeit
[^4]: **Tur Tur:** https://de.wikipedia.org/wiki/Scheinriese
[^5]: **Mit Struktur an Schnittstellen:** https://www.heise.de/developer/artikel/Mit-Struktur-an-Schnittstellen-4960680.html?wt_mc=rss.red.developer.developer.atom.beitrag.beitrag

