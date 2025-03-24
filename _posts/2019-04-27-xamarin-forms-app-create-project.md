---
layout: post
title: "Xamarin.Forms-Projekt erstellen"
date:   2019-04-27 12:00:00 +0100
category: development
tags: xamarin app android ios uwp
excerpt: "Der Artikel beschreibt wie man einen Xamarin.Forms-Projekt erstellt."
typora-copy-images-to: ..\assets\posts\2019-04-23-xamarin-forms-app-beginning\images
typora-root-url: ..\

---

# Xamarin.Forms-Projekt erstellen

[Teil 1](/development/2019/04/27/xamarin-forms-app-create-project.html) beschreibt wie man ein Projekt erstellt.

[Teil 2](/development/2019/04/27/xamarin-forms-app-add-di.html) beschreibt wie ein Dependency Injection Container konfiguriert und benutzt wird.

[Teil 3](/development/2019/04/30/xamarin-forms-data-modell.html) behandelt das Design der Interfaces und Klassen der Datenmodelle und Programmlogik.

[Teil 4](/development/2019/05/17/xamarin-forms-percentage-as-value-object.html) zeigt das Pattern **ValueObject** anhand einer Klasse.

[Teil 5](/development/2019/05/21/xamarin-forms-validation.html) zeigt eine Möglichkeit Validierung zu implementieren.

Nicht lang schnacken. Als erstes wird ein Projekt angelegt. Ich hab schon auf Visual Studio 2019 aktualisiert, was ich wirklich nur empfehlen kann. Läuft stabil und sieht genauso schick aus wie Visual Studio 2017, begrüßt dich aber mit einem Startscreen.

![visual-studio-2019-start-screen](/assets/posts/2019-04-27-xamarin-forms-app-create-project/images/vs2019-start-screen.png){:.img-content}

Klicke auf **Create a new Project**.

Hier kann man nach **Xamarin.Forms** suchen um das Template **Mobile App** zu suchen.

![mobile-app-template](/assets/posts/2019-04-27-xamarin-forms-app-create-project/images/mobile-app-template.png){:.img-content}

Mit **Next** kommt man zu einem Bildschirm auf dem der Name des Projekts, der Speicherort und der Name der **Solution** eingetragen werden können.

Als Name des Projekts habe ich **ExampleCalculator** gewählt. Der Name der Solution wird automatisch angepasst.

Mit **Create** werden die Ordner angelegt.

Auf dem folgendem Screen kann das Template weiter spezifiziert werden. Aktiviere hier alle Plattformen und wähle **Blank** als Template. Die anderen erstellen Beispielinhalte mit verschiedenen Arten von Menüführungen.

**OK** bestätigt den Vorgang und legt das Projekt endgültig an.

![project-template](/assets/posts/2019-04-27-xamarin-forms-app-create-project/images/project-template.png){:.img-content}

Das erstellte Projekt lässt sich schon kompilieren und ausführen. Die UWP-Version läuft nativ auf Windows. Für die Android-Version gibt es einen Simulator. Für die iOS-Version braucht man einen Mac. Sonst kann man die App nicht einmal kompilieren. Da ist keinen habe kann ich dazu auch nicht viel sagen. "Das ist typisch Apple", vielleicht.

Als **Startup project** nehme ich gerne die Android-Version, da ich diese Plattform bevorzuge. Ein paar Anpassungen wird man bis zur Marktreife eh für alle Plattformen machen müssen. Neben der Auswahl-Dropdown befindet sich der Button zum Starten und Debuggen der App im Simulator. Alles ganz einfach und gut in VS integriert.

![startup-project](/assets/posts/2019-04-27-xamarin-forms-app-create-project/images/startup-project.png){:.img-content}

In der App sieht man momentan nur ein Begrüßungslabel, aber wir wissen nun, dass wir alles zum Entwickeln vorbereitet haben.

Ich habe gerne Ordnung in meinen Solutions. Mit Ordnern kann man die einzelnen Projekte gruppieren. Alles was zur App gehört packe ich in einen Ordner *App*. In einem weiteren Ordner *Core* lege ich später weitere Projekte an.

Klicke im **Solution Explorer** mit der rechten Maustaste auf die Solution um das Kontextmenü zu öffnen. Unter *Add --> New Solution Folder* kannst du die Ordner anlegen und ihnen einen Namen geben.

Alle angelegten Projekte kann man im Solution Explorer markieren und per Drag and Drop in den Ordner *App* verschieben.

## Kurze Desingüberlegung

Im Ordner *App* sind alle Projekte die unsere Anwendung erstellen. Das Projekt **ExmpleCalculator** ist das Xamarin.Forms-Projekt. In diesem Projekt wird der größte Teil der Arbeit erledigt. Per XAML wird die UI beschrieben und die Logik in Code-Behind-Dateien programmiert. Dies ist ziemlich vereinfacht ausgedrückt. Bei den Code-Behind-Dateien handelt es sich um partielle Klassen, die zusammen mit den XAML-Dateien eine Klasse bilden und als solche kompiliert werden. Es gibt jede Menge Mechanismen und allerlei Funktionalitäten. Eine vollständige Beschreibung kann ich hier nicht liefern und verweise auf Microsoft. Microsoft bietet eine sehr gute Dokumentation. Man sollte sie auf Englisch lesen, das die deutsche Übersetzung manchmal maschinell eher schlecht als recht übersetzt ist.

In den plattform-spezifischen Projekten werden nur wenige Anpassungen gemacht und Einstellungen für das Packen der Installationspakete vorgenommen. Dazu später mehr.

In allem was im Ordner *App* ist will ich nur den Code haben, der auch wirklich zu meiner App gehört. Das soll heißen:

- Alles was zur UI gehört
- Assets wie Icons, Fonts ect.
- Anpassungen, Extensions und so für Xaml
- Interfaces, die in den plattformspezifischen Projekten implementiert werden. In einigen Fällen ist diese Vorgehensweise notwendig. Später wird ein Beispiel dazu folgen.
- Resourcen für die Lokalisierung der App
- Pages, die die UI beschreiben (Xaml, Code-Behind)

Die eigentliche Logik der Anwendung trenne ich ganz gerne von der App. Auf diese Weise bekommt man eine DLL oder ein Nuget, mit der Anwendungslogik. Diese kann man dann auch z.B. in einer Webseite oder Desktopanwendung nutzen.

Diesen Code packe ich in ein Projekt mit dem Namen **ExampleCalculator.Core**. Das Projekt wird folgendes enthalten:

- Exceptions
- Interfaces für die Nutzung mit Dependency Injection
- Resourcen für die Lokalisierung von Logeinträgen
- Die Programlogik
- Anderer Code, der von der Programlogik verwendet wird
- Modelklassen
- Code zur Validierung

Vorbildlich wie ich bin kommen noch Testprojekte für die App und den Core hinzu.

## Projekte fertig anlegen

Im Kontextmenü der Ordners *App* kann man über *Add --> New Project* ein Testprojekt anlegen. Suche nach **xUnit Test Project (.NET Core)** für C#. Klick auf **Next**. Tippe als Name **ExampleCalculator.Test** ein und klicke auf **Create**. Die schrottige Datei *UnitTest1.cs* können wir löschen. Die braucht kein Mensch.

Das selbe Spiel im Ordner *Core*. Als Core-Projekt nehme ich ganz gerne ein .NET-Standard-Projekt. Ich möchte ohnehin nur die nötigsten Abhängigkeiten. **Class Library (.NET-Standard)** für C# ist der Projekttyp. Die Datei *Class1.cs* kann ebenfalls weg. Noch ein Testprojekt für den Core nach dem Vorbild des vorhergingen Testprojekts und wir sind fürs erste fertig. Als Namen habe ich **ExampleCalculator.Core.Test** benutzt.

![project-structure](/assets/posts/2019-04-27-xamarin-forms-app-create-project/images/project-structure.png){:.img-content}
