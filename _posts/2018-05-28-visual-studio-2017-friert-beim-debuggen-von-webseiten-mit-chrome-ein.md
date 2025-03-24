---
layout: post
title: "Visual Studio 2017 friert beim Debuggen von Webseiten mit Chrome ein"
date:   2018-05-23 12:00:00 +0100
category: development
tags: development visual-studio-2017 debugging web chrome
excerpt: "Ich musste feststellen, dass Visual Studio 2017, zum Stand 24.11.2017, einfriert, wenn man versucht eine Webseite mit Chrome zu debuggen. Das Problem wurde auch in einem Microsoft-Forum beschrieben. Es geht also nicht nur mir so."
typora-copy-images-to: ..\assets\posts\2018-05-28-visual-studio-2017-friert-beim-debuggen-von-webseiten-mit-chrome-ein\images
typora-root-url: ..\
---
# Visual Studio 2017 friert beim Debuggen von Webseiten mit Chrome ein

## Das Problem

Ich musste feststellen, dass Visual Studio 2017, zum Stand 24.11.2017, einfriert, wenn man versucht eine Webseite mit Chrome zu debuggen. Das Problem wurde auch in einem Microsoft-Forum beschrieben. Es geht also nicht nur mir so.

Bei fror Visual Studio nur ein, wenn es mit Administratorrechten ausgeführt wurde.

## Die Lösung

Entweder man nutzt einen anderen Browser zum Debuggen wie z.B. Edge oder man deaktiviert **JavaScript-Debugging für ASP.NET aktivieren (Chrome und IE)** in den Einstellungen unter *Extras --> Optionen --> Debugging --> Allgemein*.