---
layout: post
title: "Probleme mit MSBuild"
date:   2023-03-08 00:00:00 +0100
category: development
tags: development msbuild build debugging log analyzing bug problem
excerpt: "Ich möchte hier kein spezielles Problem erklären, sondern stattdessen anhand eines aufgetretenen Problems ein paar Techniken erläutern, die ich gelernt habe.

Der Artikel ist sehr technisch und richtet sich an Entwickler, die eine Möglichkeit kennen lernen wollen, etwas mehr Einsicht in die Magie ihrer Build zu bekommen.

Das Problem war folgendes. Ich nutze für Bibliotheken gerne SourceLink. Es handelt sich um eine Technik durch die man in den Sourcecode eingebundener Bibliotheken hinein debuggen kann. Man fügt einfach ein NuGet für den Provider der Quellcodeverwaltung hinzu und setzt einige Einstellungen. An der `<InformationalVersion>` wird der Commit-Hash des Commits, für den der Build durchgeführt wurde, angehängt. Durch diese Informationen wird genau dieser Quellcode von Visual Studio im Hintergrund heruntergeladen und für das Debugging verwendet. Eine geniale Technik."
---

# Probleme mit MSBuild

Ich möchte hier kein spezielles Problem erklären, sondern stattdessen anhand eines aufgetretenen Problems ein paar Techniken erläutern, die ich gelernt habe.

Der Artikel ist sehr technisch und richtet sich an Entwickler, die eine Möglichkeit kennen lernen wollen, etwas mehr Einsicht in die Magie ihrer Build zu bekommen.

Das Problem war folgendes. Ich nutze für Bibliotheken gerne SourceLink. Es handelt sich um eine Technik durch die man in den Sourcecode eingebundener Bibliotheken hinein debuggen kann. Man fügt einfach ein NuGet für den Provider der Quellcodeverwaltung hinzu und setzt einige Einstellungen. An der `<InformationalVersion>` wird der Commit-Hash des Commits, für den der Build durchgeführt wurde, angehängt. Durch diese Informationen wird genau dieser Quellcode von Visual Studio im Hintergrund heruntergeladen und für das Debugging verwendet. Eine geniale Technik.

---

**Hinweis:**

[Producing Packages with Source Link - .NET Blog (microsoft.com)](https://devblogs.microsoft.com/dotnet/producing-packages-with-source-link/) erklärt die Konfiguration von SourceLink. Achtung! Es gibt ein paar Dinge zu beachten. Der Artikel ist lesenswert.

---

Die Builds sollten deterministisch sein. Eigentlich ein Feature, dass es seit 2015 gibt. Es heißt, die Builds werden so normalisiert, dass jeder Build des selben Commits auch den selben Binärcode erzeugt, unabhängig vom Buildsystem.

Mein Problem war, dass aus irgendeinem Grund diese Konfiguration bei einem neuen Projekt nicht mehr funktionierte.

Überprüft habe ich den Build mit dem NuGet Package Explorer. Dieser zeigt einem an, ob der Build korrekt konfiguriert ist.

![Validierung mit dem NuGet Package Explorer](\assets\posts\2023-03-08-Probleme mit MSBuild\images\nuget-package-explorer-source-link-config.png){:.img-content}

---

**Info:**

[NuGetPackageExplorer/NuGetPackageExplorer: Create, update and deploy Nuget Packages with a GUI (github.com)](https://github.com/NuGetPackageExplorer/NuGetPackageExplorer) ist das Projekt auf GitHub.

---

Meine ersten Ansätze waren:

1. Die Konfiguration des neuen Projekts mit der eines funktionierenden Projekts zu vergleichen. Allerdings ohne Erfolg. Ich konnte keinen Unterschied feststellen.
2. Ich habe dann ein Beispielprojekt angelegt. Eine Bibliothek ohne Inhalt. Einfach nur ein neues Projekt mit einem Standardtemplate von Visual Studio. Auch hier konnte ich SourceLink nicht zum Laufen bringen.
3. Ich habe sogar komplett die Konfiguration vom funktionierenden Projekt in mein Beispielprojekt übernommen. Ohne Erfolg.

Die Idee hinter diesen Ansätzen war, dass es einen Unterschied in der Konfiguration geben muss. Das funktionierende Projekt ist älter. Es kann also Änderungen an den Templates zum Erstellen eines Projekts gegeben haben.

Die Strategie, die ich verfolgte, war die Bedingungen der Builds möglichst identisch zu machen. Daher war mein nächster Ansatz, sicherzustellen, dass das funktionierende Projekt auf dem selben Buildsystem, wie das neue gebaut werden kann. Ich vermutete, dass die Version von MSBuild für den Unterschied verantwortlich war. Das bestehende Projekt funktionierte natürlich trotzdem.

Langsam wurde meine Suche verzweifelter. Ohne tiefere Einsichten in den Buildprozess, so schien es mir, würde ich das Problem nicht verstehen. Ich fand ein Tool, welches die Buildlogs von MSBuild nützlich aufbereitet und anzeigt.

---

**Info:**

[MSBuild Log Viewer](https://msbuildlog.com/#:~:text=Double-click the .binlog file to open it in,log of any verbosity given the .binlog file.)

---

Mit dem Parameter `-bl` lassen sich die Buildlogs erzeugen.

```shell
dotnet build -bl
```

---

**Hinweis:**

Visual Studio kompiliert nicht immer alles sauber neu. Um sicher zu gehen kann man alle kompilierten Dateien entfernen. Mit der PowerShell ist das schnell erledigt.

```powershell
Get-ChildItem .\ -include bin,obj,target -Recurse | foreach ($_) { remove-item $_.fullname -Force -Recurse }
```

---

Mit dem MSBuild Log Viewer können sie dann geöffnet und durchsucht werden. Standardmäßig heißt die Datei einfach `msbuild.binlog` und befindet sich im Projektverzeichnis.

Unter `Search Log` habe ich nach `Deterministic =` gesucht. Bei einem validen Build konnte ich sehen, dass die Eigenschaft sowohl bei `CoreCompile` als auch bei `MapSourceRoots` gesetzt war.

![Valider deterministischer Build](\assets\posts\2023-03-08-Probleme mit MSBuild\images\deterministic-build.png){:.img-content}

Ebenfalls ein valider Build, aber nicht deterministisch, da `<ContinuousIntegrationBuild>false</ContinuousIntegrationBuild>`, zeigt folgendes Log:

 ![Nicht deterministischer Build](\assets\posts\2023-03-08-Probleme mit MSBuild\images\non-deterministic-build.png){:.img-content}

Man kann sehen, dass die Pfade nicht angepasst wurde.

Hier ist das Log meines Problem-Builds:

![Problem-Build](\assets\posts\2023-03-08-Probleme mit MSBuild\images\failing-build.png){:.img-content}

Tatsächlich brachte die Analyse des Builds einen Anhaltspunkt. `Property reassignment`, `Deterministic` wird von `True` auf `false` gesetzt. Der Build ist also tatsächlich nicht deterministisch. Schaut man sich den vollen Logeintrag an, dann stellt man fest, dass ein referenziertes NuGet eine `Build.props` hat, die die Einstellungen des Compilers überschreibt.

```shell
Property reassignment: $(Deterministic)="false" (previous value: "True") at C:\Users\iBrotNano\.nuget\packages\shouldly\4.1.0\build\Shouldly.props (7,5)
```

Entfernt man diese ist das NuGet tatsächlich valide deterministisch.

So ganz kann dies allerdings nicht die Lösung sein. Würde man das referenzierte NuGet erneut herunterladen, beispielsweise bei einem Update, dann wäre das Problem wieder da.

---

**Info:**

Es stellte sich heraus, dass dieses Verhalten bereits bekannt war. [Installing Shouldly silently disables optimization and changes other properties · Issue #795 · shouldly/shouldly (github.com)](https://github.com/shouldly/shouldly/issues/795)

---

In diesem Fall enthält das Shouldly-NuGet eine Datei `build\Shouldly.props` mit Einstellungen, die einen deterministischen Build verhindern.

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project>
  <PropertyGroup>
    <DebugSymbols>true</DebugSymbols>
    <Optimize>false</Optimize>
    <DebugType>embedded</DebugType>
    <Deterministic>false</Deterministic>
    <DeterministicSourcePaths>false</DeterministicSourcePaths>
  </PropertyGroup>
</Project>
```

Diese Einstellungen werden während eines `nuget restore` in lokale Einstellungen umgewandelt und von MSBuild in das eigenen Projekt importiert. In meinem Fall entstand eine Datei `MarcelMelzig.TestEnvironment.csproj.nuget.g.props` mit folgendem Eintrag `<Import Project="$(NuGetPackageRoot)shouldly\4.1.0\buildMultiTargeting\Shouldly.props" Condition="Exists('$(NuGetPackageRoot)shouldly\4.1.0\buildMultiTargeting\Shouldly.props')" />`.

---

**Info:**

[MSBuild props and targets in a package](https://learn.microsoft.com/en-us/nuget/concepts/msbuild-props-and-targets) erklärt diesen Mechanismus genauer.

---

In diesem Fall hat es geholfen, die Referenz auf Shouldly zu mit `    <ExcludeAssets>build</ExcludeAssets>` modifizieren:

```xml
<PackageReference Include="Shouldly">
    <ExcludeAssets>build</ExcludeAssets>
</PackageReference>
```