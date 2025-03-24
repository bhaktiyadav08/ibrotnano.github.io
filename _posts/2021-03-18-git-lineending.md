---
layout: post
title: "Zeilenenden in Git"
date:   2021-03-18 15:11:00 +0100
category: development
tags: development git lineending crlf lf unix windows
excerpt: "Windows, Linux und MacOS nutzen alle unterschiedliche Zeilenenden. Das ist die schlechte Nachricht. Git kann diese konvertieren. Das ist die gute Nachricht. Der Artikel erklärt wie man dies sinnvoll konfiguriert."
typora-root-url: ..\
typora-copy-images-to: ..\assets\posts\2021-03-18-git-lineending\images
---

# Zeilenenden in Git

Windows, Linux und MacOS nutzen alle unterschiedliche Zeilenenden. Das ist die schlechte Nachricht. Git kann diese konvertieren. Das ist die gute Nachricht.

Wie dies genau funktioniert und sinnvoll konfiguriert werden kann war für mich als Windows-Nutzer nicht direkt verständlich. Deswegen ist hier eine kleine Hilfestellung:

Installiert man Git unter Windows mit dem Installer wird man gefragt, wie Git mit Zeilenenden umgehen soll.

![Umgang mit Zeilenenden im Installer einstellen](\assets\posts\2021-03-18-git-lineending\images\Screenshot 2021-03-15 093228.png){:.img-content}

Empfohlen und voreingestellt ist *Checkout Windows-style, commit Unix-style line endings*. Das heißt alle Dateien werden bei einem Checkout in CRLF (Carriage Return Line Feed) konvertiert. Bei einem Commit werden sie in LF konvertiert. So ist sichergestellt, dass Windows-Benutzer auf ihren Systemen mit ihren Tools arbeiten können, Linux-Anwender aber ebenso. Der Default auf einem zentralen Repository auf einem Server wäre in diesem Fall LF.

Alternativ gibt es noch:

*Checkout as is, commit Unix-style line endings* um ein Repository komplett in LF zu konvertieren und *Checkout as is, commit as-is* um keine Konvertierung durchzuführen.

Wie die Beschreibung besagt, wird durch den Installer eine Konfiguration gesetzt. Diese kann zu einem späteren Zeitpunkt natürlich angepasst werden[^1].

```
git config --global core.autocrlf true
git config --system core.autocrlf true
```

Dies entspricht der ersten Option, global und systemweit. `–global` sind die Einstellungen des aktuellen Benutzers, `–system` gälten für alle Benutzer des Systems.

*Checkout as is, commit Unix-style line endings* wäre `input` statt `true`. *Checkout as is, commit as-is* wäre `false` als Einstellung.

Eigentlich wäre so alles gut, wenn manchmal nicht ausnahmen nötig wären. Es gibt Dateien, die immer CRLF als Dateiende haben müssen. Z.B. SLN-Arbeitsmappen in Visual Studio. Shell-Skripte, *.sh, die unter Windows z.B. für den Bau eines Docker Images verwendet werden, müssen abhängig vom Betriebssystem des Images eventuell LF sein.

Dazu hat man die Möglichkeit explizit ausnahmen für Dateien oder Dateitypen in einem Repository zu konfigurieren.

Dazu legt man eine Datei *.gitattributes* an, sofern sie nicht schon vorhanden ist.

Der Inhalt der Datei habe ich aus einem Beispiel aus der GitHub Dokumentation[^2].

```
# Set the default behavior, in case people don't have core.autocrlf set.
* text=auto

# Declare files that will always have specified line endings on checkout.
*.sln text eol=crlf
*.sh text eol=lf

# Denote all files that are truly binary and should not be modified.
*.png binary
*.jpg binary
```

`* text=auto` definiert einen Default für Textdateien. Gits Standard wird verwendet. Das heißt, bei einem Commit wird in LF konvertiert.

Binärdateien können explizit ausgenommen werden. Ich hatte aber auch keine Probleme ohne diese Einstellung.

Wenn man nach dem Hinzufügen der *.gitattributes* den Befehlt `git add --renormalize .` ausführt, ändert Git die Zeilenenden im Workspace gemäß der Konfiguration und man kann sie committen.

Wenn man das Repository nun klont, sind alle Zeilenenden wie gewünscht, egal auf welchem OS man arbeitet.

[^1]: 8.1 Customizing Git - Git Configuration, 15.03.2021, https://www.git-scm.com/book/en/v2/Customizing-Git-Git-Configuration
[^2]: Configuring Git to handle line endings, 15.03.2021, https://docs.github.com/en/github/using-git/configuring-git-to-handle-line-endings
