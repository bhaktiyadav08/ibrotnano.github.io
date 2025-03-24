---
layout: post
title: "Dependency Injection hinzufügen"
date:   2019-04-27 12:00:00 +0100
category: development
tags: xamarin app android ios uwp
excerpt: "Hier wird beschrieben wie man im einem Xamarin.Forms-Projekt Dependency Injecton hinzufügt."

---

# Dependency Injection hinzufügen

[Teil 1](/development/2019/04/27/xamarin-forms-app-create-project.html) beschreibt wie man ein Projekt erstellt.

[Teil 2](/development/2019/04/27/xamarin-forms-app-add-di.html) beschreibt wie ein Dependency Injection Container konfiguriert und benutzt wird.

[Teil 3](/development/2019/04/30/xamarin-forms-data-modell.html) behandelt das Design der Interfaces und Klassen der Datenmodelle und Programmlogik.

[Teil 4](/development/2019/05/17/xamarin-forms-percentage-as-value-object.html) zeigt das Pattern **ValueObject** anhand einer Klasse.

[Teil 5](/development/2019/05/21/xamarin-forms-validation.html) zeigt eine Möglichkeit Validierung zu implementieren.

Xamarin bringt Dependency Injection mit. Leider keine richtige. Gedacht ist Xamarins DI-Funktionalität um Code in die plattformspezifischen Projekte zu injizieren. Nicht als vollwertiger DI-Container. Das ist allerdings nicht weiter schlimm. Man kann auf eine Vielzahl von DI-Containern zurückgreifen. [Simple Injector](<https://simpleinjector.org/index.html>) kann auch unter Xamarin verwendet werden.

Füg dem Projekt **ExampleCalculator** das Nuget **SimpleInjector** hinzu. In *App.xaml.cs* muss der DI-Container konfiguriert werden.

In einer statischen Property `DI` wird der DI-Container App-weit zugreifbar gemacht.

```c#
public static Container DI { get; private set; }
```

Der Namespace `SimpleInjecto` muss mit einem `using` eingebunden werden.

In einer Methode `InitializeDI()` wird dem DI-Container dann bekannt gegeben, wie Instanzen initialisiert werden sollen.

```c#
private void InitializeDI()
{
    DI = new Container();
    DI.Register<IFund, Fund>(Lifestyle.Transient);
    DI.Register<IFundReturnCalculator, FundReturnCalculator>(Lifestyle.Transient);
    DI.Register<IHelpContent, HelpContent>(Lifestyle.Transient);
    DI.Register<IHelpContentProvider<App>, HelpContentProvider<App>>(Lifestyle.Transient);
    DI.Verify();
}
```

In `public App()` wird die Methode dann aufgerufen und somit beim Start der Anwendung initialisiert. Die Seite von [Simple Injector](https://simpleinjector.org/index.html) enthält weitere Dokumentation dazu. Die Interfaces und Implementierungen der Interfaces gibt es zum jetzigen Zeitpunkt noch nicht. Deswegen kann das Projekt noch nicht angelegt werden.

Aber mit `App.DI.GetInstance<IFundReturnCalculator>();` können nun von überall aus dem Programm heraus Instanzen initialisiert werden.