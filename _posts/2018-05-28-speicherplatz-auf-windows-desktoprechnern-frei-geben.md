---
layout: post
title: "Speicherplatz auf Windows-Desktoprechnern frei geben"
date:   2018-05-28 12:00:00 +0100
category: operations
tags: operations windows speicherplatz speicher desktop
excerpt: "Hier ist ein kleiner Tipp um auf Windows-Desktop-Rechnern etwas Speicherplatz frei zu geben. Das kann unter Umständen nützlich sein, wenn man ein paar GB mehr auf einer SSD braucht auf der Windows installiert ist."
typora-copy-images-to: ..\assets\posts\2018-05-28-speicherplatz-auf-windows-desktoprechnern-frei-geben\images
typora-root-url: ..\
---
# Speicherplatz auf Windows-Desktoprechnern frei geben

Hier ist ein kleiner Tipp um auf Windows-Desktop-Rechnern etwas Speicherplatz frei zu geben. Das kann unter Umständen nützlich sein, wenn man ein paar GB mehr auf einer SSD braucht auf der Windows installiert ist.

In der versteckten Datei **hiberfil.sys** werden Daten für den **Ruhezustand** gesichert. Er unterscheidet sich vom Energiesparmodus dadurch, dass der letzte Zustand des PCs auf der Festplatte und nicht im Arbeitsspeicher gesichert wird. So muss der Arbeitsspeicher nicht mit Strom versorgt werden und der PC kann sich komplett herunterfahren.

Diese Daten werden in der Datei **hiberfil.sys** gesichert, die dadurch mehrere GB groß sein kann.

## Desktop-Rechner

Auf Desktoprechnern brauche ich den Ruhemodus eigentlich gar nicht. Über die Kommandozeile lässt sich der Ruhemodus komplett deaktivieren.

```bash
powercfg -h off
```

**Die Kommandozeile muss mit Administratorrechten laufen.**