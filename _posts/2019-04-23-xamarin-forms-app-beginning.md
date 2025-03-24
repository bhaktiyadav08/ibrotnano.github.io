---
layout: post
title: "Einstieg in Xamarin.Forms"
date:   2019-04-23 12:00:00 +0100
category: development
tags: xamarin app android ios uwp
excerpt: "Wie schreibt man eine mobile App mit Xamarin? Wo und wie fängt man da am besten an? In einer kleinen Serie von Artikeln werde ich den Einstieg in das Schreiben einer App erklären."
typora-root-url: ..\

---

# Einstieg in Xamarin.Forms

Xamarin.Forms ist ein wirklich cooles Framework von Microsoft. Es basiert auf Mono, aber wird offiziell von Microsoft supported und entwickelt. Stell dir vor du schreibst eine App einmal. Die GUI beschreibst du in XAML, Microsofts Syntax zum Beschreiben von Oberflächen auf XML-Basis. Den Code schreibst du in C#. Am Ende purzeln Apps für Android, iOS und Windows raus und das in nativem Bytecode. Die Apps laufen also so schnell als hätte man sie direkt für die entsprechende Plattform geschrieben.

In dieser Serie von Artikeln möchte ich beschreiben:

- wie man ein Projekt anlegt
- wie man eine GUI schreibt
- wie man die Anwendung dazu bringt dann auch etwas zu tun
- Eine menge mehr oder weniger sinnvolle und/oder nützliche Designüberlegungen

[Teil 1](/development/2019/04/27/xamarin-forms-app-create-project.html) beschreibt wie man ein Projekt erstellt.

[Teil 2](/development/2019/04/27/xamarin-forms-app-add-di.html) beschreibt wie ein Dependency Injection Container konfiguriert und benutzt wird.

[Teil 3](/development/2019/04/30/xamarin-forms-data-modell.html) behandelt das Design der Interfaces und Klassen der Datenmodelle und Programmlogik.

[Teil 4](/development/2019/05/17/xamarin-forms-percentage-as-value-object.html) zeigt das Pattern **ValueObject** anhand einer Klasse.

[Teil 5](/development/2019/05/21/xamarin-forms-validation.html) zeigt eine Möglichkeit Validierung zu implementieren.