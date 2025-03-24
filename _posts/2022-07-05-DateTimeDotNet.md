---
layout: post
title: "DateTime in .NET"
date:   2022-07-05 00:00:00 +0200
category: development
tags: development best-practices
excerpt: "Früher habe ich mir wenig Gedanken zu Daten und Zeiten in .NET gemacht. `DateTime.Now` war im Grunde der Code, der in 90% der Fälle zum Einsatz kam, wenn ich mit Daten arbeiten musste. Hand aufs Herz. Ich bin da nicht der Einzige. Diese Zeile habe ich schon zu genüge gesehen."
---

# DateTime in .NET

Früher habe ich mir wenig Gedanken zu Daten und Zeiten in .NET gemacht. `DateTime.Now` war im Grunde der Code, der in 90% der Fälle zum Einsatz kam, wenn ich mit Daten arbeiten musste. Hand aufs Herz. Ich bin da nicht der Einzige. Diese Zeile habe ich schon zu genüge gesehen.

Ich habe mir nie die Zeit genommen über so etwas triviales (?)  nachzudenken. Aber es kann sich lohnen.

Lasst mal folgendes kleines Programm laufen:

```csharp
using System;

namespace DateTimeExperiment
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            Console.WriteLine($"DataTime.Now:          {DateTime.Now}");
            Console.WriteLine($"DateTime.UtcNow:       {DateTime.UtcNow}");
            Console.WriteLine($"DateTimeOffset.Now:    {DateTimeOffset.Now}");
            Console.WriteLine($"DateTimeOffset.UtcNow: {DateTimeOffset.UtcNow}");
            Console.ReadKey();
        }
    }
}
```

Der Output sieht bei mir so aus:

```shell
DataTime.Now:          15.02.2022 11:40:47
DateTime.UtcNow:       15.02.2022 10:40:47
DateTimeOffset.Now:    15.02.2022 11:40:47 +01:00
DateTimeOffset.UtcNow: 15.02.2022 10:40:47 +00:00
```

Und er sieht wirklich **nur** bei mir, genau in diesem Moment, so aus. `DateTime` ist eine Abhängigkeit zur System-Clock. Und das auch noch durch Code, der `static` ist. Pfui Bah!

Und wenn ich mir die Ausgabe genauer anschaue, dann muss ich leider auch noch feststellen, dass ich von alles Möglichkeiten die schlechteste als Standard auserkoren habe. `DateTime.Now` ist die aktuelle Zeit auf  **meinem** System zur Laufzeit. Diese Zeit in eine Datenbank geschrieben, die vielleicht auf einem Server in einem Rechenzentrum auf der anderen Seite der Welt läuft, hat wenig wert. Man wird wahrscheinlich annehmen es handele sich um das Datum und die Zeit auf dem Datenbankserver.

`DateTime.UtcNow` ist die UTC-Zeit. Diese ist wenigstens überall auf der Welt identisch. Leider habe ich ja früher immer `DateTime.Now` genutzt. Ohne die Angabe und Prüfung um welche Zeit es sich handelt, `DateTime.Now.Kind`, kann man anhand der Ausgabe (oder dem Wert in der Datenbank) auch nicht sagen welche Zeit gemeint ist. In meinen Systemen habe ich nun ein Durcheinander mit mehr oder weniger nutzlosen Zeitstempeln.

In Zukunft bin ich aber schlauer. `DateTimeOffset.UtcNow` wird mein Standard. Hier wird auch ein Offset gespeichert, der die Zeitzone angibt. Erst dadurch werden Zeitangaben eindeutig. Durch diesen Offset ist es eigentlich egal ob man `Now` oder `UtcNow` nutzt. Durch `UtcNow` wird das Vergleichen von Zeiten einfacher.

Da es sich bei `DateTime(Offset)`, wie erwähnt, um eine Abhängigkeit zur System-Clock, also zu Infrastruktur der Anwendung handelt, sollte diese eh abstrahiert werden.

```csharp
public interface DateTimeProvider
{
	DateTimeOffset UtcNow { get; }
}
```

