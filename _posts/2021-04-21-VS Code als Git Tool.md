---
layout: post
title: "VS Code als Git Tool"
date:   2021-04-21 00:00:00 +0100
category: development
tags: development git vs tool diff merge
excerpt: "Visual Studio ist ein geniales Tool um als Editor für Git verwendet zu werden. Als Editor, Diff- und Mergetool ist es gleichermaßen geeignet."
---

# VS Code als Git Tool {#vs-code-als-git-tool}

Visual Studio ist ein geniales Tool um als Editor für Git verwendet zu werden. Als Editor, Diff- und Mergetool ist es gleichermaßen geeignet.

Mit `git config --global -e` kann man die Git-Konfiguration für den aktuellen Benutzer in Gits Standardeditor editieren.

Hier ändert man folgende Zeilen oder fügt diese hinzu:

```
[core]
	editor = code --wait
[diff]
  tool = vscode
[difftool "vscode"]
  cmd = code --wait --diff $LOCAL $REMOTE
[merge]
  tool = vscode
[mergetool "vscode"]
  cmd = code --wait $MERGED
```

Die Konfiguration kann man am besten mit einem Testrepository ausprobieren. Folgender Code legt mit der PowerShell ein Repository an und führt einen Commit durch:

```powershell
mkdir test-repo
cd test-repo
git init
New-Item test.txt
git add .
git commit
```

Es öffnet sich nun VS Code um eine Commitmessage einzutragen.

![Commitmessage mit VS Code eintragen](\assets\posts\2021-04-21-VS Code als Git Tool\images\Screenshot 2021-03-24 210514.png){:.img-content}

Trägt man in der ersten Zeile die Commitmessage ein, speichert und schließt die Datei in VS Code, wird der Commit durchgeführt.

Ändert man nun etwas in *test.txt* und führt einen weiteren Commit durch, kann man  `diff` testen.

```powershell
git add .
git commit -m "test.txt modified"
git difftool ae3dc66^!
```

In diesem Beispiel wird mit der Schreibweise `ae3dc66^!` der Commit, der mit dem Hash `ae3dc66` anfängt mit seinem Vorgänger verglichen.

VS Code wird für den Vergleich geöffnet.

![diff mit VS Code](\assets\posts\2021-04-21-VS Code als Git Tool\images\Screenshot 2021-03-24 211508.png){:.img-content}

Der letzte Test wäre ein Merge. Dazu muss man erst eine Branch anlegen und in dieser und `master` eine Änderung an *test.txt* in der selben Zeile durchführen.

```powershell
git branch dev
git checkout dev
code test.txt
```

Inhalt in `Testinhalt 1` ändern und speichern.

```powershell
git add .
git commit -m "test.txt changed."
git checkout master
code test.txt
```

Inhalt in `Testinhalt 2` ändern und speichern.

```powershell
git add .
git commit -m "test.txt changed in master."
```

In VS Code kann man dann den Merge durchführen.

![merge in VS Code](\assets\posts\2021-04-21-VS Code als Git Tool\images\Screenshot 2021-03-24 213602.png){:.img-content}

Interessant ist, dass man den kompletten Workflow in VS Code durchführen kann, ohne den Editor verlassen zu müssen.