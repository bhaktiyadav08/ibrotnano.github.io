---
layout: post
title: "Debuggen in NuGets hinein mit Source Link"
date:   2021-02-09 15:37:00 +0100
category: development
tags: development debug nuget source link
excerpt: "Source Link ist ein klasse Technologie, die das Debuggen und Entwickeln von Komponenten im .NET-Umfeld erst richtig ermöglicht. Entwickler können ihre Bibliotheken so konfigurieren, dass Metainformationen über den Quellcodestand in der Versionsverwaltung enthalten ist, die zum Debuggen genutzt werden können."
typora-root-url: ..\
typora-copy-images-to: ..\assets\posts\2021-02-09-Source Link\images
---

# Debuggen in NuGets hinein mit Source Link

Source Link ist ein klasse Technologie, die das Debuggen und Entwickeln von Komponenten im .NET-Umfeld erst richtig ermöglicht. Entwickler können ihre Bibliotheken so konfigurieren, dass Metainformationen über den Quellcodestand in der Versionsverwaltung enthalten ist.

Beim Debuggen wird dann der Source Code bei Bedarf heruntergeladen und man kann in den Code des NuGets hinein debuggen.

Das kann helfen Bugs in Bibliotheken zu finden oder nachvollziehen zu können, warum eine Methode einen bestimmten Rückgabewert hat.

## Source Line in Action

Debuggt man Code, der eine Methode einer Bibliothek aufruft, die in einem NuGet verteilt ist, ist es normalerweise nicht möglich in den Code der Bibliothek hinein zu debuggen. 

```csharp
var entity = _repository.GetByID(id).SingleOrDefault();

if (entity is null)
{
    // Do stuff...
} 
```

Mit `F11` würde man in Zeile 1 nicht in die Methode hineinspringen, sondern über sie hinweg und bei Zeile 3 landen.

Mit Source Link bekommt man ein Fenster angezeigt, indem man gefragt wird, ob man den Quellcode aus dem Repository herunterladen möchte.

![Source Link-Warnung](\assets\posts\2021-02-09-Source Link\images\newtonsoft-json-download-prompt.png){:.img-content}

Der Code wird dann aus dem Repository in einen lokalen Source Server unter *C:\Users\iBrotNano\AppData\Local\SourceServer* heruntergeladen.

Nun ist es möglich in den Code der Bibliothek hineinzuspringen

## Konfiguration von Visual Studio

Um Source Link in Visual Studio zu aktivieren, muss man es erst konfigurieren.

Dies ist aus Sicherheitsgründen so vorkonfiguriert, da Dateien aus dem Internet heruntergeladen werden.

Um in NuGets von Drittanbietern debuggen zu können, muss man deren Quellen für Debugsymbole aktivieren.

Mit STRG + Q kann man nach *Set Symbols and cache location* suchen.

![Quellen für NuGet-Debugsymbol-Server](\assets\posts\2021-02-09-Source Link\images\Screenshot 2021-02-09 110057.png){:.img-content}

Der Microsoft Symbol Server wird für .NET-Quellen verwendet. Der NuGet.org Symbol Server für alle Quellen, die auf nuget.org gehosted sind und Debugsymbole enthalen. Diese werden in einem separaten Packet gehostet.

Man kann einen Cache definieren, in dem die Quellen gecacht werden. Dies erhöht die Geschwindigkeit beim Debuggen.

Unter *Debugging → General* deaktiviert man *Enable Just My Code* und aktiviert *Enable Source Link support*.

Mit *Enable Just My Code* ermöglicht man den Sprung in Fremdcode. Mit *Enable Source Link support* aktiviert Source Link. Dieser Haken ist standardmäßig aktiv, hat aber nur in Kombination mit *Enable Just My Code* eine Wirkung.

![Source Link aktivieren](\assets\posts\2021-02-09-Source Link\images\Screenshot 2021-02-09 110443.png){:.img-content}

## Konfiguration einer Bibliothek

Entwickler legen im Projekt in der Projektdatei mit der Endung *csproj* fest, ob sie Source Link für eine Bibliothek unterstützen möchten.

Es gibt dabei zwei Varianten die Debugsymbole, die für das Debuggen nötig sind, zu veröffentlichen.

1. Eingebettet in das NuGet
2. In einer Separaten Datei in einem eigenen Repository unter nuget.org

Der Vorteil der ersten Variante liegt darin, dass man weder einen eigene Symbol Server braucht um die Symboldateien zu veröffentlichen noch muss man diesen in Visual Studio konfigurieren. Der Nachteil: Die Dateien sind größer, da die PDF-Dateien in die NuGets eingebettet werden. Der Download der NuGets dauert dadurch etwas länger.

Die Konfiguration für eine separate Datei sieht folgendermaßen aus:

```xml
<Project Sdk="Microsoft.NET.Sdk">
 <PropertyGroup>
    <PublishRepositoryUrl>true</PublishRepositoryUrl>
    <EmbedUntrackedSources>true</EmbedUntrackedSources>
    <IncludeSymbols>true</IncludeSymbols>
    <SymbolPackageFormat>snupkg</SymbolPackageFormat>
  </PropertyGroup>
    
  <PropertyGroup Condition="'$(BUILDSERVER_BUILD)' == 'true'">
  	<ContinuousIntegrationBuild>true</ContinuousIntegrationBuild>
  </PropertyGroup>  
    
  <ItemGroup>
    <!-- Add PackageReference specific for your source control provider (see below) --> 
  </ItemGroup>
</Project>
```

Die Debugsymbole werden in *snupkg*-Datei neben der *nupkg*-Datei generiert.

Es muss eine Referenz zum Anbieter des Git-Repositories hinzugefügt werden. [^1]

Als GitLab-Nutzer sähe das ganze so aus:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.SourceLink.GitLab" Version="1.0.0" PrivateAssets="All"/>
</ItemGroup>
```

Mit `PrivateAssets` kennzeichnet man die Referenz als Entwicklerreferenz, so dass die DLL nicht mit in der Endanwendung landet.

Mit `<ContinuousIntegrationBuild>true</ContinuousIntegrationBuild>` kann man einen deterministischen Build erstellen. Dieser sorgt dafür, dass der Output beim Build binär immer der selbe ist, wenn der Input der selbe ist. Es werden z.B. Pfade normiert. Durch diese Einstellung gäbe es Probleme beim Debuggen von lokalen Builds. Durch eine `Condition` kann man den Build steuern. [^2]

`dotnet publish -p:BUILDSERVER_BUILD=true`

Es gibt ein Tool von einer Microsoft-Entwicklering, mit dem man sich den Inhalt von NuGets ansehen kann, den NuGet Package Explorer. [^3]

Öffnet man ein NuGet, das für Source Link konfiguriert ist, kann man dies hier überprüfen.

![Source Link-Check im NuGet Package Explorer](\assets\posts\2021-02-09-Source Link\images\Screenshot 2021-02-09 115649.png){:.img-content}

Die Konfiguration für eingebettete Debugsymbole sieht etwas anders aus:

```xml
<Project Sdk="Microsoft.NET.Sdk">
 <PropertyGroup>
    <PublishRepositoryUrl>true</PublishRepositoryUrl>
    <EmbedUntrackedSources>true</EmbedUntrackedSources>
    <DebugType>embedded</DebugType>
  </PropertyGroup>
    
  <PropertyGroup Condition="'$(BUILDSERVER_BUILD)' == 'true'">
  	<ContinuousIntegrationBuild>true</ContinuousIntegrationBuild>
  </PropertyGroup>  
    
  <ItemGroup>
    <!-- Add PackageReference specific for your source control provider (see below) --> 
  </ItemGroup>
</Project>
```

Die Debugsymbole sind in diesem Fall durch `<DebugType>`[^4] in die DLLs eingebettet. Dadurch werden die DLLs größer, sind aber immer debugbar.[^5]

Es gab mal eine Lösung, in der man die PDB-Dateien in das NuGet, aber nicht in die DLLs einbettet. Diese wird in vielen Dokumentationen erwähnt, funktioniert aber nicht mehr.[^6]

Der Code sähe in der *csproj* so aus:

`<AllowedOutputExtensionsInPackageBuildOutputFolder>$(AllowedOutputExtensionsInPackageBuildOutputFolder);.pdb</AllowedOutputExtensionsInPackageBuildOutputFolder>`

[^1]: [Auflistung von Providern](https://github.com/dotnet/sourcelink/blob/master/README.md)
[^2]:  [Infos zu Deterministic Builds](https://devblogs.microsoft.com/dotnet/producing-packages-with-source-link/#deterministic-builds)
[^3]:  [Das Repository des NuGet Package Explorers](https://github.com/NuGetPackageExplorer/NuGetPackageExplorer)
[^4]:  [MSBuild-Properties](https://docs.microsoft.com/en-us/visualstudio/msbuild/common-msbuild-project-properties?view=vs-2019#list-of-common-properties-and-parameters)
[^5]: [Eingebettete PDB-Dateien](https://docs.microsoft.com/en-us/dotnet/core/deploying/single-file#include-pdb-files-inside-the-bundle)
[^6]: [In NuGets eingebettete PDBs](https://github.com/dotnet/sourcelink/issues/244)