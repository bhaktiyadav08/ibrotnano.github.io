---
layout: post
title: "Abhängigkeiten in Software"
date:   2023-01-19 00:00:00 +0200
category: development
tags: development best-practices planning architecture
excerpt: "In Software existieren immer Abhängigkeiten. Dies ist ein Umstand, der sich nicht aufheben lässt. Aus diesem Grund lohnt es, sich einmal sich zu verdeutlichen, was Abhängigkeiten bedeuten und welche Fallstricke sie mit sich bringen können. Obwohl ich als Entwickler schon immer mit Abhängigkeiten umgehen musste und mir die Tools bekannt sind, sind mir einige Zusammenhänge erst jetzt bewusst. Ich möchte in folgendem Artikel klären, was eigentlich eine Abhängigkeit ist und wo sie sich verstecken, auch wenn man sie dort nicht vermutet. Warum sie weder gut noch schlecht sind und warum wir, als Entwickler, sie handeln müssen."
---

# Abhängigkeiten in Software

In Software existieren immer Abhängigkeiten. Dies ist ein Umstand, der sich nicht aufheben lässt. Aus diesem Grund lohnt es, sich einmal sich zu verdeutlichen, was Abhängigkeiten bedeuten und welche Fallstricke sie mit sich bringen können. Obwohl ich als Entwickler schon immer mit Abhängigkeiten umgehen musste und mir die Tools bekannt sind, sind mir einige Zusammenhänge erst jetzt bewusst. Ich möchte in folgendem Artikel klären, was eigentlich eine Abhängigkeit ist und wo sie sich verstecken, auch wenn man sie dort nicht vermutet. Warum sie weder gut noch schlecht sind und warum wir, als Entwickler, sie handeln müssen.

## Was sind Abhängigkeiten und wo verbergen sie sich?

Verbreitet ist die Ansicht, dass Abhängigkeiten in Software Komponenten sind, die verwendet werden. Englisch “Dependencies”. Diese Abhängigkeiten treten in Form von Bibliotheken auf. In .NET werden DLLs in der eigenen Anwendung referenziert und deren Programmcode kann dann verwendet werden. Dafür ist das eigene Programm nun nicht mehr ohne die DLL lauffähig. Wir sind von dieser DLL abhängig.

Nehmen wir zum Beispiel eine Anwendung: SPA mit React umgesetzt und .NET als Backend. Wir wollen im Backend loggen und entscheiden uns Serilog als Lösung zu nutzen. Von nun an, sind wir von Serilog abhängig. Wir sind aber nicht nur von Serilog abhängig. Schon die Wahl der Frameworks kreieren Abhängigkeiten. Durch React ist unser Frontend von Facebook und deren Entwicklung abhängig. Durch .NET von Microsofts Entscheidungen bezüglich des Frameworks. Die Frameworks sind so fundamental, dass wir sie nicht austauschen können. Wir haben uns an zwei Konzerne gebunden. Durch React sind wir von JavaScript abhängig. Durch .NET von C#. Wir brauchen Entwickler, die diese Sprachen beherrschen. Durch React existiert eine Abhängigkeit zu Browsern. .NET hat große Anstrengungen darin investiert die Abhängigkeit vom Betriebssystem (OS) los zu werden. Dies war Voraussetzung dafür, dass .NET als Framework für die Cloud geeignet ist. Auch wenn das OS abstrahiert wurde, so zwingt es uns doch eine Menge Abhängigkeiten auf. Viele hält Microsoft für uns im Griff. Wir brauchen uns keine Gedanken um das Dateisystem zu machen. Aber schon Zeichen zum Trennen von Pfaden oder dem Beginnen einer neuen Zeile führen uns wieder vor Augen, auf welchem OS wir uns befinden. Schon das OS selbst ist wieder eine Abstraktion, die uns die Abhängigkeit von der Hardware vernebelt. Das ändert auch die Cloud nicht. Speicher muss bereit stehen und bezahlt werden. Die CPU begrenzt das Machbare. Über die  System-Clock sind wir Abhängig von der Zeit. Unsere Software ist abhängig von einem Konzept, dass weder mit der Software noch der Hardware etwas zu tun hat. Wär hätte das vermutet?  

## Warum sich abhängig machen?

Abhängigkeiten erleichtern die Arbeit. Oder anders gesagt: Wir können nicht alles selbst entwickeln. Wir sind darauf angewiesen, dass wir auf der Arbeit anderer aufbauen können. Nur so sind komplexe Systeme, wie sie heute existieren, umsetzbar.

Auch werden viele Komponenten von vielen Entwicklern genutzt, entwickelt und getestet. Manche werden gar von großen Unternehmen gefördert oder von diesen bereitgestellt.

Solche Komponenten sind vielleicht sogar besser getestet und einem Peer-Review unterzogen, als es die eigenen Anwendungen könnten.

## Worauf muss ich achten?

Abhängigkeiten bringen immer einen Overhead mit sich. Sie enthalten Code, der vielleicht gar nicht genutzt wird. Sie können auch wieder weitere Abhängigkeiten enthalten, weil sie auf anderen DLLs basieren. Aus diesem Grunde fügen sie einem System erst einmal mehr Komplexität hinzu. Dies kann dazu führen, dass ein System fragiler wird. Bugs in den Abhängigkeiten sind auch Bugs in der eigenen Anwendung. Das selbe gilt für Sicherheitslücken.

Abhängigkeiten können untereinander inkompatibel sein.

Man muss sich bewusst machen, dass man von der Arbeit dritter abhängig ist. Im Zweifel muss man warten, bis die Entwickler einer Komponente einen Bug gefixt haben oder sich aktiv an der Entwicklung beteiligen und den Bug selber fixen. In beiden Fällen kann es zu Verzögerungen bei der eigenen Entwicklung kommen. Gerade bei der Kernfunktionalität einer Anwendung kann dies sehr kritisch sein.

Auch zeigt sich die Abhängigkeit darin, dass man bei der technischen Lösung eines Problems den Weg nehmen muss, den die Entwickler der Komponente vorgesehen haben. Dieser muss nicht unbedingt in die eigene Architektur passen.

Nicht zuletzt ist man auch von den Lizenzen der verwendeten Abhängigkeiten abhängig. Diese müssen zum eigenen Geschäftsmodell passen und berücksichtigt werden. Manche setzen voraus, dass man die Lizenz selbst bekannt macht.

## Strategien zum Managen von Abhängigkeiten

Es gibt einige Strategien um Abhängigkeiten zu managen. 

1. Abhängigkeiten immer aktuell halten. Somit bekommt man oft Performance, Sicherheit und neue Funktionen geschenkt. Außerdem bleibt man auf dem aktuellen Stand. Es wird sonst zunehmend wahrscheinlicher, dass Abhängigkeiten zueinander inkompatibel werden.
2. Abhängigkeiten so granular wie möglich aktualisieren. So lassen sich Fehler eingrenzen, die durch das Update entstanden sein können.
3. Automatisiertes Testen hilf auch Bugs, die durch Abhängigkeiten verursacht werden, zu finden. Schon Unittests können helfen. Integrationstest der Teile der Software, auf der sich die Abhängigkeiten auswirken, können Probleme zusätzlich aufdecken.
4. Die Kandidaten für eine Abhängigkeit sollten vorher geprüft werden:
   1. Sind die Abhängigkeiten selbst von vielen anderen Komponenten abhängig? Dann sollte man sich für die geeignetste mit der geringsten Anzahl entscheiden.
   2. Wird die Abhängigkeit von vielen genutzt, dann spricht das für eine aktive Entwicklung und dafür, dass Bugs schnell gefunden werden.
   3. Wir eine Abhängigkeit aktiv entwickelt und werden Bugs gefixt?
   4. Passt die Lizenz zur eigenen Anwendung? Ansonsten kann eine Abhängigkeit nicht genutzt werden.
5. Abhängigkeiten sollten so weit wie möglich abstrahiert werden. Interfaces bieten sich dazu an. Ich werde nachfolgend einige Beispiele dafür nennen. Per DI kommt dann ein bisschen Fleisch an die Interfaces.
6. Dokumentation über die bestehenden Abhängigkeiten helfen den Überblick zu behalten. Allerdings nur, wenn diese aktuell gehalten wird. In den meisten Frameworks stehen die Abhängigkeiten in irgendeiner Form von Datei. `package.json` oder `<PackageReference>` sind Beispiele dafür. Es lohnt sich diese auslesen zu lassen und die Informationen lesbar für ein Release zu dokumentieren. Es wäre z.B. möglich die Abhängigkeiten mit Versionsnummer auszulesen und mit denen einer Branch `production` zu vergleichen um herauszufinden, welche sich geändert haben. Dazu wäre es sinnvoll nachzuhalten auf welche Programmteile sich eine Abhängigkeit auswirkt. Für Tester können diese Informationen sehr wertvoll sein. 

## Beispiele für die Abstraktion einer Abhängigkeit

### Logging in .NET

.NET bietet ein eigenes Interface an, um Logginglösungen zu abstrahieren. `ILogger`. Serilog oder NLog implementieren dieses Interface. Per Dependency Injection wird dann Serilog als Implementierung verwendet. Der eigene Code basiert dann nur auf dem Interfact `ILogger`.

### SystemClock

Es bietet sich an in .NET den Zugriff auf die System-Clock zu abstrahieren. In .NET findet dieser über die Datentypen `DateTime.UtcNow` oder besser `DateTimeOffset.UtcNow` statt. Hinter einer unscheinbaren `Property` verbirgt sich der Zugriff auf die System-Clock.

Durch ein Interface kann man sie abstrahieren.

```c#
public interface IDateTimeProvider
{
        DateTimeOffset UtcNow { get; }
 }
```

Die Implementierung könnte einfach so aussehen:

```c#
    public class DateTimeProvider
        : IDateTimeProvider
    {
        public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
    }
```

Nun basiert mein Code nur noch auf `IDateTimeProvider`. Nebenbei wird mein Code dadurch testbar, denn nun kann ich ein Datum mocken.

### FileSystem

Ein Projekt, dass diesen Ansatz fortführt ist `System.IO.FileSystem`. Dieses abstrahiert all Typen für Verzeichnisse und Dateien von .NET im Interface `IFileSystem`. Das heißt `Directory`, `FileInfo` oder `Path`, deren Methoden meistens `static` sind. Auch eine wunderbare Methode um Unittests vom Dateisystem unabhängig zu machen.

---

**Info:** Unter [NuGet Gallery | System.IO.FileSystem 4.3.0](https://www.nuget.org/packages/System.IO.FileSystem/) findet man das Nuget.

---

## Tools

### Packetmanager

Jede Programmiersprache hat sein Ecosystem, mit dem Abhängigkeiten verwaltet werden können. In .NET ist es NuGet, in Node.js NPM, in PHP Composer ect.

Abhängigkeiten sollten immer mit diesen Tools installiert und aktualisiert werden.

### Repositorymanager mit Lizenzfilter und Securityscans

Diese Ecosysteme beinhalten alle ein Kommandozeilentool zum Verwalten der Abhängigkeiten und ein Repository, in dem die Abhängigkeiten gehostet werden. Repositorymanager wie Sonatype Nexus können verwendet werden um alle einzelnen Repositories über eine Uri in einem Unternehmen zur Verfügung zu stellen. Darüber hinaus lassen sich die Abhängigkeiten, die Entwickler nutzen können nach Lizenzen einschränken oder die Entwickler werden automatisch über Sicherheitslücken in den genutzten Abhängigkeiten informiert.

### Scans

Solche Sicherheitsscans können nicht nur proaktiv durch die Repositorymanager durchgeführt werden. Auch von einem Buildserver können Tool zum Scannen der Abhängigkeiten genutzt werden. Solche Scans lassen sich salbt über ganze Container durchführen. Es ist auf jeden Fall empfehlenswert mehrere Scans zu kombinieren. Es gibt kein “zu sicher”.

### Vergleich von Abhängigkeiten

Abhängigkeiten zu vergleichen ist eine gute Strategie um den Überblick zu gewinnen, was getestet werden muss. Es gibt einige Tools, die dazu genutzt werden können. Auch ein eigenes Skript, dass diese Informationen sammelt und aufbereitet wäre eine Lösung.

#### dotnet list

`dotnet list` listet alle NuGets eines Projekts oder einer Solution auf.

```powershell
dotnet list .\Solution.sln package
```

Man kann sich das ganze in eine Datei ausgeben lassen:

```powershell
dotnet list .\Solution.sln package > dependencies.txt
```

Interessant sind folgende Parameter:

- `--include-transitive` gibt auch die Abhängigkeiten der Abhängigkeiten zurück.
- `--deprecated` zeigt nicht mehr unterstützte Quellen
- `--outdated` zeigt Quellen an, für die es Updates gibt

---

**Info:** [dotnet list package command - .NET CLI | Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-list-package) dokumentiert den Befehl.

---

#### sbom

[microsoft/sbom-tool: The SBOM tool is a highly scalable and enterprise ready tool to create SPDX 2.2 compatible SBOMs for any variety of artifacts. (github.com)](https://github.com/microsoft/sbom-tool) ist ein recht neues Tool von Microsoft für diesen Zweck. Es erkennt Abhängigkeiten unterschiedlicher Quellen, wie NPM oder NuGet. Microsoft plant weitere Quellen hinzuzufügen. Bei SBOM handelt es sich auch um ein standardisiertes Format für diesen Zweck.

---

**Info:** [Microsoft open sources its software bill of materials (SBOM) generation tool - Engineering@Microsoft](https://devblogs.microsoft.com/engineering-at-microsoft/microsoft-open-sources-software-bill-of-materials-sbom-generation-tool/) beschreibt das Tool in Kürze.

[Tools Community - Software Package Data Exchange (SPDX)](https://spdx.dev/tools-community/) enthält eine Liste von Tools, die für andere Programmiersprachen verwendet werden können.

---

Am einfachsten installiert man das Tool mit `dotnet`.

```shell
dotnet tool install --global Microsoft.Sbom.DotNetTool
```

Man kann dann eine Manifestdatei erzeugen:

```shell
sbom-tool generate -b "Path\To\Build\Artefacts\Directory" -bc "Path\To\Solution\With\Sources" -nsb "https://3h-co.de" -ps "Marcel Melzig" -pn "PackageName" -pv "1.0.0" -m "OutputFolder"
```

[spdx/tools-java: SPDX Command Line Tools using the Spdx-Java-Library (github.com)](https://github.com/spdx/tools-java) ist ein Java-Tool von den Entwicklern des Dateiformats. Mit diesem können die SBOM-Dateien in andere Formate konvertiert und verglichen werden. Für die Tools wird Java benötigt. 

---

**Hinweis:** Das OpenJDK lässt sich einfach mit Chocolatey installieren. `choco install openjdk`.

---

Man kann die Tools mit Curl herunterladen.

```powershell
curl -LO https://github.com/spdx/tools-java/releases/download/v1.1.3/tools-java-1.1.3.zip
Expand-Archive .\tools-java-1.1.3.zip
```

Nun kann man sich die Datei z.B. in eine Exceltabelle umwandeln lassen.

```shell
java -jar .\tools-java-1.1.3\tools-java-1.1.3-jar-with-dependencies.jar Convert .\manifest.spdx.json spreadsheat.xlsx
```

Mit folgendem Befehlt kann man zwei SBOMs miteinander vergleichen und sich das Ergebnis als Exceltabelle ausgeben lassen.

```shell
java -jar .\tools-java-1.1.3\tools-java-1.1.3-jar-with-dependencies.jar CompareDocs output.xlsx .\manifest-1.spdx.json .\manifest-2.spdx.json
```

---

**Hinweis:** Es ist eine gute Praxis jedes Projekt einzeln zu vergleichen, da das Ergebnis mit dem Tool übersichtlicher wird.

---
