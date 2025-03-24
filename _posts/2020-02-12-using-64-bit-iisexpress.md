---
layout: post
title: "IISExpress im 64 Bit-Modus"
date:   2020-02-12 10:33:00 +0100
category: development
tags: exception argumentexception argumentnullexception c# exception-handling
excerpt: "“Es wurde versucht, eine Datei mit einem falschem Format zu laden”. Sowas kann man lesen, wenn man versucht eine Webanwendung aus Visual Studio 2019 heraus zu starten, die eine 64 Bit-Komponente verwendet."
typora-root-url: ..\
---

# IISExpress im 64 Bit-Modus

“Es wurde versucht, eine Datei mit einem falschem Format zu laden”. Sowas kann man lesen, wenn man versucht eine Webanwendung aus Visual Studio 2019 heraus zu starten, die eine 64 Bit-Komponente verwendet.

Standardmäßig wird die Webseite in IISExpress geladen. Dieser kleine Webserver läuft im 32 Bit-Modus. Es lässt sich aber einstellen, dass er im 64 Bit-Modus ausgeführt werden soll.

Dazu öffnet man:

_Tools –> Options –> Project and Solutions –>Web Projects_ und setzt den Haken bei **Use the 64 bit version of IIS Express for web sites and projects**.

Der Fehler sollte nun behoben sein.