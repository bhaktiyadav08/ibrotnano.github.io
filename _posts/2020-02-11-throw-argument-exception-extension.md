---
layout: post
title: "ArgumentExceptions werfen"
date:   2020-02-11 15:11:00 +0100
category: development
tags: exception argumentexception argumentnullexception c# exception-handling
excerpt: "Code zum Werfen von ArgumentExceptions schreibe ich extrem häufig. Ich habe also nach einer Möglichkeit gesucht solchen Code zu vereinheitlichen. Eine Extension erschien mir als eine gute Möglichkeit."
typora-root-url: ..\
---

# ArgumentExceptions werfen

Mir ist aufgefallen, dass ich Code wie diesen extrem häufig schreibe:

```c#
if(something is null)
    throw new ArgumentNullException(nameof(something));

if(somethingOther < 18)
    throw new ArgumentException(nameof(somethingOther));
```

Zugegeben! Das ist nicht viel Code. Aber es sind immer zwei Zeilen und es kann auch sein, dass ich oder ein anderer Entwickler minimale Variationen dieses Codes schreiben.

```c#
if(something == null)
    throw new ArgumentException();
```

Sieht nicht nach viel aus, kann sich aber anders verhalten.

Ich mag es wenn solche Logik vereinheitlicht wird.

## Die Lösung

Mir gefallen Extensions in .NET bei manchen Aufgaben ziemlich gut. Ich kann Objekte um Methoden erweitern ohne sie ändern zu müssen oder einen eigenen Type abzuleiten.

In diesem Fall habe ich `object` erweitert, weil ich möchte, dass die Methoden auf allen Objekten aufgerufen werden können. Die Klasse wird so deklariert:

```c#
public static class ObjectExtension {}
```

`public static` ist hier das Zauberwort.

Hier können nun Methoden implementiert werden:

```c#
public static void ThrowArgumentException<T>(
    this T instance
    , Predicate<T> predicate = null
    , string paramName = null
    , bool throwArgumentNullException = true)
{
    if (throwArgumentNullException)
        instance.ThrowArgumentNullExceptionIfNull(paramName);

    if (predicate is null
        || predicate.Invoke(instance))
    {
        if (string.IsNullOrEmpty(paramName))
            throw new ArgumentException("An exception has occurred in conjunction with a unspecified parameter.");
        else
            throw new ArgumentException($"An exception has occurred in conjunction with the parameter \"{paramName}\"."
                , paramName);
    }
}
```

Die Methode wirft eine `ArgumentException`.

Die Methode ist generisch. Sie kann also alleine dadurch schon für alle Datentypen angewendet werden. Mit `this T instance` wird die Instanz referenziert, durch die die Methode aufgerufen wird.

Das Verhalten der Methode kann konfiguriert werden.

Über `Predicate<T> predicate` kann man ein Lambda übergeben. Die Exception wird geworfen, wenn das `Predicate` `true` ist. Der `paramName` wird in der Fehlernachricht angezeigt. Wenn `throwArgumentNullExcetion` `true` ist, dann wird ein `null`-Check durchgeführt.

Folgende Methode wirft eine `ArgumentNullException`:

```c#
public static void ThrowArgumentNullExceptionIfNull<T>(
    this T instance
    , string paramName = null)
{
    if (instance is null)
    {
        if (string.IsNullOrEmpty(paramName))
            throw new ArgumentNullException("An unspecified argument is null.");
        else
            throw new ArgumentNullException(paramName
                , $"A null exception has occurred in conjunction with the parameter \"{paramName}\".");
    }
}
```

Und zu guter Letzt noch eine Methode zum Wergen von `ArgumentOutOfRangeExceptions`:

```c#
public static void ThrowArgumentOutOfRangeExceptionException<T>(
            this T instance
            , Predicate<T> predicate = null
            , string paramName = null)
        {
            if (predicate is null
                || predicate.Invoke(instance))
            {
                if (string.IsNullOrEmpty(paramName))
                    throw new ArgumentOutOfRangeException();
                else
                    throw new ArgumentOutOfRangeException(paramName
                        , $"An out of range exception occurred in conjunction with the parameter \"{paramName}\".");
            }
        }
```

Der Aufruf der Methoden ist nun ziemlich einfach:

```c#
using namespaceofmethods;

IPAddress ip = new IPAddress(192,178,168,100);
IPAddress ip2 = new IPAddress(192,178,168,100);

ip.ThrowArgumentException(x =>
	ip.AddressFamily != ip2.AddressFamily
    , nameof(address));
```

## Die Nachteile

Es gibt leider auch Nachteile.

Der Namespace der Extension muss in einer Klasse bekannt sein, bevor man die Methoden aufrufen kann.

Ein anderer Nachteil ist, dass Visual Studio nicht immer erkennt, dass eine Exception geworfen wird. In manchen Fällen muss man dann einen Rückgabewert zurückgeben, obwohl der Code logisch nicht erreicht werden kann. `default` passt hier ganz gut.