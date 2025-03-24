---
layout: post
title: "Mit Docker-Desktop Container auf Windows 10 mit WSL"
date:   2020-07-23 17:39:00 +0100
category: development
tags: docker vscode code development windows wsl
excerpt: "Docker auf Windows 10 und gleichzeitig eine weiter Virtualisierungslösung zu nutzen war bisher nur umständlich möglich. Mit WSL 2 hat sich aber einiges geändert und Docker lässt sich hervorragend in Windows 10 integrieren, was es zu einem wertvollen Tool zum Entwickeln macht."
typora-root-url: ..\
typora-copy-images-to: ..\assets\posts\2020-07-23-docker-desktop-auf-windows-10-mit-wsl\images
---

# Mit Docker Desktop Container auf Windows 10 mit WSL

Bisher war das Arbeiten mit Docker auf Windows für mich eher ein Kompromiss. Die Windows-Version von Docker basierte auf Hyper-V. Ich benötigte aber ebenfalls VMWare. Zwei Virtualisierungslösungen nebeneinander zu betreiben war technisch nicht möglich. Hyper-V ist so tief im System verankert, dass der eigene Windows-Desktop tatsächlich auch nur virtuell ist. Eine weitere Virtualisierungsschicht in der Virtualisierung ging nicht.

Als Ausweg blieb eine Linux-VM aufzusetzen und in dieser Docker zu installieren. Das ist kein Beinbruch aber es hat mich gewurmt, dass ich mit WSL eine Linux-Integration in Windows 10 habe und diese nicht voll nutzen kann.

Nun hat Microsoft aber mit WSL 2 seine Architektur geändert und es ist möglich Docker in der Linux-Integration zu nutzen. Ich möchte hier beschreiben, wie man es einrichten und damit arbeiten kann.

**Kenntnisse mit Docker werden in dieser Anleitung voraus gesetzt. Das Tutorial, dass von Docker Desktop am Ende dieser Anleitung gestartet werden kann erklärt aber sehr anschaulich alle wichtigen Schritte.**

## Windows 10 vorbereiten

WSL gibt es schon eine ganze Weile. Version 2 allerdings nur im Insider Build von Windows 10. Seit kurzem allerdings hat Microsoft das Feature auch die stabile Version von Windows 10 veröffentlicht. Seit **Version 2004 Build 19041** kann WSL 2 genutzt werden.

## WSL Installieren

https://docs.microsoft.com/en-us/windows/wsl/install-win10 ist die offizielle Dokumentation.

Das **Windows Subsystem for Linux**, kurz WSL, ist ein optionales Feature. Es kann über die Windows Features aktiviert oder deaktiviert werden. **Win + Q** öffnet die Suche. Hier nach **Windows Feature** suchen und **Windows Subsytem für Linux** aktivieren.

Alternativ kann dies über die PowerShell gemacht werden. Dazu muss die PowerShell als Administrator ausgeführt werden.

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

Ein Neustart ist erforderlich.

Auf die selbe Art muss man das Feature **Plattform für virtuelle Computer** aktivieren.

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Ein erneuter Neustart ist erforderlich.

Als nächstes wird WSL 2 als der Default gegenüber WSL 1 für Linuxdistributionen gesetzt.

```powershell
wsl --set-default-version 2
```

### Linux installieren

Über den Microsoft Store können Linuxdisrtibutionen installiert werden. Die Doc von Microsoft enthält eine Liste mit den direkten Links zu den Distributionen.

Von dort aus kann die gewünschte Distribution installiert werden.

Nach der Installation findet man im Startmenü ein Icon um die Installation zu starten und auf die Kommandozeile der Distribution zuzugreifen.

Beim ersten Start wird die Installation abgeschlossen.

```bash
Installing, this may take a few minutes...
Die Windows-Subsystem für Linux-Instanz wurde beendet.
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: https://aka.ms/wslusers
Enter new UNIX username:
```

Hier muss man einen Benutzernamen und ein Passwort für den Linux-Account festlegen, der auf dem System genutzt wird.

Danach sollte man die Installation erst einmal aktualisieren. In meinem Fall einer Ubuntu-Installation:

```bash
sudo apt update && sudo apt upgrade
```

### Docker Desktop installieren

Als nächstes kann Docker installiert werden. Am einfachsten geht das unter Windows mit Docker Desktop. Man bekommt dann zu Docker und Docker Compose in der aktuellsten Version noch eine schicke UI, über die man die Container verwalten kann.

Auf https://www.docker.com/products/docker-desktop kann man den Installer herunterladen.

Um WSL 2 als Backend zu nutzen muss beim Installieren der entsprechende Haken gesetzt sein.

<img src="/assets/posts/2020-07-23-docker-desktop-auf-windows-10-mit-wsl/images/wsl2-in-docker-desktop.png" alt="WSL 2 als Backend für Docker Desktop konfigurieren" style="width:100%;" />

Nach der Installation ist alles bereit und man kann mit Docker arbeiten.

In einer PowerShell kann man zum Testen die Version abfragen:

```powershell
docker -v
```

Der selbe Befehlt funktioniert auch in der Ubuntu-Bash. Man kann also beide Shells nutzen. Nach anfänglicher Skepsis, puh... es ist neu... ich weiß nicht... hab das immer anders gemacht, hab ich die UI aber sehr schnell lieb gewonnen. Die Kombination aus Kommandozeile und UI sorgt für eine Menge Übersicht.

## Mit Docker unter Windows arbeiten

Ein super Editor für die Arbeit mit Docker ist Visual Studio Code. Er bringt schon alles mit was man braucht. Zum Beispiel ein Termin, dass eine PowerShell integriert. So hat man alles bereit um mit Docker zu arbeiten.

Einfach z.B. `docker-compose up -d` im Terminal von VS Code eingeben und Docker beginnt mit der Arbeit und erstellt einen Service. Genauso wie man es aus jeder anderen Kommandozeile her kennt.

Hier kommt die UI ins Spiel. Nachdem Docker den Service erstellt und gestartet hat kann man ihn in der UI verwalten.

<img src="/assets/posts/2020-07-23-docker-desktop-auf-windows-10-mit-wsl/images/docker-desktop-ui.png" alt="docker desktop" style="width:100%;" />

Hier lassen sich Logs einsehen oder auch Container stoppen oder im Browser öffnen. Gerade das Stoppen und Entfernen der Container ist hier sehr einfach.

Die UI ist noch in Entwicklung und in Zukunft werden sicher weitere coole Features hinzukommen.