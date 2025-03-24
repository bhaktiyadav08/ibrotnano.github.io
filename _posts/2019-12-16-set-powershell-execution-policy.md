---
layout: post
title: "ExecutionPolicy in der Powershell"
date:   2019-12-16 17:02:00 +0100
category: operations
tags: powershell policy configuration
excerpt: "Beim Ausführen von Skripten in der PowerShell kann es vorkommen, dass man Fehler angezeigt bekommt, die darauf hinweisen, dass man keine Skripte ausführen darf. Hier zeige ich wie man die PowerShell so konfigurieren kann, dass Skripte ausgeführt werden."
typora-root-url: ..\
---

# ExecutionPolicy in der Powershell

Beim Ausführen von Skripten in der PowerShell kann es vorkommen, dass man eine Exception wie die Folgende angezeigt bekommt.

```po
Die Datei "C:\Temp\example\build.ps1" kann nicht geladen werden, da die
Ausführung von Skripts auf diesem System deaktiviert ist. Weitere Informationen finden Sie
unter "about_Execution_Policies" (https:/go.microsoft.com/fwlink/?LinkID=135170).
```

Das heißt, man ist nicht berechtigt, ein Skript auszuführen.

Folgendermaßen kann man sich die Policies auf dem System ansehen.

```pow
Get-ExecutionPolicy -List
```

    Scope ExecutionPolicy
    ----- ---------------
    MachinePolicy       Undefined
    UserPolicy       	Undefined
    Process			   Undefined
    CurrentUser       	Undefined
    LocalMachine       	Undefined
In meinem Fall war zum Beispiel nichts konfiguriert.

Man kann die Policy direkt in der PowerShell setzen. Dabei muss man folgendes beachten:

1. Wie oben zu sehen gibt es verschiedene Scoped mit denen die Berechtigung auf verschiedenen Ebenen konfiguriert werden kann.
2. Es gibt verschiedene Berechtigungen. Diese können unter https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-6 nachgelesen werden.

Man kann dann so eine Policy setzen:

```power
Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force
```

Nun sollte es möglich sein, das Skript auszuführen.