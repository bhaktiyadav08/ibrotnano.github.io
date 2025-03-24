---
layout: post
title: "NPM-Error nach nodejs-Update auf Version 8.9.0"
date:   2018-05-28 12:00:00 +0100
category: operations
tags: operations npm error nodejs update
excerpt: "Nach einem Update auf **nodejs** 8.9.0 auf Windows 10 ließ sich npm nicht mehr ausführen."
typora-copy-images-to: ..\assets\posts\2018-05-28-npm-error-nach-nodejs-update-auf-version-8-9-0\images
typora-root-url: ..\
---
# NPM-Error nach nodejs-Update auf Version 8.9.0

Nach einem Update auf **nodejs** 8.9.0 auf Windows 10 ließ sich npm nicht mehr ausführen.

Der Fehler lautete: **Cannot find module 'internal/util/types'**.

## Die Lösung

Offenbar bleiben beim Deinstallieren Dateien zurück, die zu dem Fehler führen. Folgendermaßen konnte ich das Problem lösen:

1. **nodejs** über Apps und Features deinstallieren.
2. Das Installationsverzeichnis löschen falls es noch vorhanden ist.
3. Aus *AppData/Roaming* die Verzeichnisse **npm** und **npm-cache** löschen.
4. **nodejs** neu installieren.

Mit diesen Schritten wurde wirklich alles komplett neu installiert.