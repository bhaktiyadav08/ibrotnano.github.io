---
layout: post
title: "In .NET mit IPAddress arbeiten"
date:   2020-02-11 11:54:00 +0100
category: development
tags: ip ipaddress dotnet c#
excerpt: "Das heutige Thema ist doch sehr spezifisch. Für Leute, die nicht gerade mit dieser .NET-Klasse arbeiten ist es vielleicht zu spezifisch. Ich habe jedoch einiges gelernt als ich mich mit dieser Repräsentation von IPs in .NET auseinander gesetzt habe. Programmiertechniken, die gar nicht direkt mit diesem Datentyp zusammenhängen, die aber praktisch sein können."
typora-root-url: ..\
---

# In .NET mit IPAddress arbeiten

Das heutige Thema ist doch sehr spezifisch. Für Leute, die nicht gerade mit dieser .NET-Klasse arbeiten ist es vielleicht zu spezifisch. Ich habe jedoch einiges gelernt als ich mich mit dieser Repräsentation von IPs in .NET auseinander gesetzt habe. Programmiertechniken, die gar nicht direkt mit diesem Datentyp zusammenhängen, die aber praktisch sein können.

Nebenbei werden ein paar Extensions herauskommen, die du in deinen Programmen verwenden kannst und die dir vielleicht mal nützlich sein könnten.

## Was war denn das Problem?

Ich musste mit IPs arbeiten und bin dabei auf Microsofts Implementierung von `IPAddress` gestoßen. Eine ziemlich nützliche Klasse, die IP Adressen kapselt, so dass man nicht mit `string`s hantieren muss. `IPAddress` arbeitet mit `byte[]` um die Informationen einer IP zu kapseln. Sowohl IPv4 als auch IPv6 wird unterstützt. Braucht man eine IP als `string` bietet die Klasse natürlich `ToString()` an. Genauso Methoden zum parsen von `string`s.

Wo die Möglichkeiten der Klasse aber aufhören ist beim Vergleichen von IPs. Was eigentlich ganz einfach klingt, entpuppte sich als eine doch fordernde Aufgabe. Eine Recherche im Internet ergab, dass tatsächlich schon viele auf ähnliche Probleme gestoßen sind. So manch eine Methode oder sogar kleine Libraries sind zu finden. Für meinen Fall habe ich allerdings nichts gefunden.

Oft sah ich, dass mit `string`s gearbeitet wurde, was mir überhaupt nicht gefiel.

Selbst das vergleichen von `IPAddress` Objekten ist nicht so einfach. Eine IPv4 besteht aus 4 `byte`s. Eine IPv6 aus 16.

Diese in Loops zu vergleichen war mein erster Ansatz. Der Ansatz war doof. Anders kann ich es nicht ausdrücken.

### Die Lösung

Ich bin darauf gestoßen, dass man eine IP auch als Zahl darstellen kann. Als `long` um genau zu sein. Das macht das vergleichen natürlich einfacher. `IPAddress` hat sogar eine Property `Address`, die diesen `long` enthält. Allerdings ist diese Property als **Deprecated** markiert und könnte somit irgendwann entfernt werden. Schade, da sie doch so praktisch ist. Das Problem was diese Form mit sich bringt ist folgendes:

IPv4 kann in einen `long` gespeichert werden, da es sich um eine 64 Bit-Zahl handelt. Eine IPv6 jedoch hat 16 `byte`s. Es handelt sich um eine 128 Bit-Zahl. Einen solchen Datentyp gibt es in .NET nicht. Somit steht auch kein numerischer Typ zur Verfügung in dem sich eine IPv6 so einfach speichern ließe. `Address` funktioniert also nur für IPv4.

Die Lösung ist folgende:

Man speichert eine IPv6 in ein Array. Um genau zu sein ein `ulong[]` mit zwei Zahlen. Die erste repräsentiert die ersten 8 `byte`, die zweite die letzten 8 `byte`.

Hier ist meine Methode zum Konvertieren:

```c#
private static ulong[] ConvertIPBytesToULongArray(byte[] ip)
{
    ulong[] addr = new ulong[2];
    addr[0] = BitConverter.ToUInt64(ip, 8);
    addr[1] = BitConverter.ToUInt64(ip, 0);
    return addr;
}
```

Diese Arrays lassen sich nun vergleichen. Ich habe mir eine Hilfsmethode geschrieben, mit der ich zwei `IPAddress` gleichzeitig umwandeln kann.

```c#
private static Tuple<ulong[], ulong[]> ConvertIPsToULongs(IPAddress first, IPAddress second)
{
    var firstIPAsBytes = first
        .MapToIPv6()
        .GetAddressBytes();

    var secondIPAsBytes = second
        .MapToIPv6()
        .GetAddressBytes();

    if (BitConverter.IsLittleEndian)
    {
        Array.Reverse(firstIPAsBytes);
        Array.Reverse(secondIPAsBytes);
    }

    return new Tuple<ulong[], ulong[]>(
        ConvertIPBytesToULongArray(firstIPAsBytes)
        , ConvertIPBytesToULongArray(secondIPAsBytes));
}
```

Um alle IPs gleich verarbeiten zu können werden IPv4 auf IPv6 gemappt.

Dann werden die `byte`s der IPs ermittelt.

Windows nutzt **Little Endian**, so dass die `byte[]`s umgekehrt werden müssen.

Die Methode gibt dann ein `Tuple<ulong[], ulong[]>` mit den beiden IPs zurück.

Die numerischen Werte können nun einfacher verglichen werden als `string`s oder `byte[]`s.

Hier ist die Extensionmethod, die ich geschrieben habe um zwei `IPAddress` zu vergleichen:

```c#
public static int Compare(this IPAddress address, IPAddress compareAddress)
{
    var ipsAsULongs = ConvertIPsToULongs(address, compareAddress);

    if (ipsAsULongs.Item1[0] < ipsAsULongs.Item2[0])
        return -1;

    if (ipsAsULongs.Item1[0] > ipsAsULongs.Item2[0])
        return 1;

    if (ipsAsULongs.Item1[0] == ipsAsULongs.Item2[0])
    {
        if (ipsAsULongs.Item1[1] < ipsAsULongs.Item2[1])
            return -1;

        if (ipsAsULongs.Item1[1] > ipsAsULongs.Item2[1])
            return 1;
    }

    return 0;
}
```

Ich vergleich hier einfach nur die `ulong` und geben -1 für kleiner, 0 für gleich und 1 für größer zurück. So lassen sich `IPAddress`-Objekte vergleichen und sogar sortieren.

### Ein bisschen Zucker

Mit dieser Methode lässt sich z.B. auch eine Liste von IPs in einem Bereich zurückgeben.

```c#
public static IList<IPAddress> GetIpRange(this IPAddress start, IPAddress end)
{
    var addresses = new List<IPAddress>();
    var ipsAsULongs = ConvertIPsToULongs(start, end);

    try
    {
        checked
        {
            for (var i1 = ipsAsULongs.Item1[0]; i1 <= ipsAsULongs.Item2[0]; i1++)
            {
                try
                {
                    checked
                    {
                        for (var i2 = ipsAsULongs.Item1[1]; i2 <= ipsAsULongs.Item2[1]; i2++)
                        {
                            byte[] ipBytes = new byte[16];
                            var convertedBytes1 = BitConverter.GetBytes(i1);
                            var convertedBytes2 = BitConverter.GetBytes(i2);
                            convertedBytes1.CopyTo(ipBytes, 8);
                            convertedBytes2.CopyTo(ipBytes, 0);

                            if (BitConverter.IsLittleEndian)
                                Array.Reverse(ipBytes);

                            var ip = new IPAddress(ipBytes);

                            if (ip.IsIPv4MappedToIPv6)
                                ip = ip.MapToIPv4();

                            addresses.Add(ip);
                        }
                    }
                }
                catch (OverflowException) { }
            }
        }
    }
    catch (OverflowException) { }

    return addresses;
}
```

Hier werden wieder die Anfangs- und End-IPs in `ulong[]`s umgewandelt.

In `for`-Schleifen werden nun alle `ulong` durchgelaufen und wieder in `IPAddress` umgewandelt.

Hier ist noch etwas, dass ich vorher noch nie gesehen habe. Deshalb eine kleine Erklärung.

Die Loops befinden sich innerhalb eines `checked {}`. Dieser Block wirft `OverflowException`s, wenn ein numerischer Wert über sein Maximum hinaus iteriert wird. Diese `OverflowException`s fange ich ab, so dass meine `ulong` keine ungültigen Werte annehmen können.