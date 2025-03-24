---
layout: post
title: "Best practices für PHP-Codestyles"
date:   2018-05-28 12:00:00 +0100
category: development
tags: development best-practice php code codestyle
excerpt: "Es lohnt sich einen Stil für den Quellcode eines Projekts zu definieren an denen sich alle Entwickler halten, die mit dem Code arbeiten. Code wird dadurch nicht nur lesbarer, sondern es besser verarbeitbar. Wenn mehrere Entwickler an einem Projekt arbeiten und eine Sourcecodeverwaltung einsetzten wird es immer wieder zu der Situation kommen, dass Quellcode gemerged werden muss. Die Tools sind smart genug Quellcodeunterschiede festzustellen. Häufig können Leerzeilen oder Leerzeichen ignoriert werden, aber werden z.B. Ausdrücke in einem __if__ auf mehrere Zeilen aufgeteilt, hört stoßen Vergleichstools an ihre Grenzen. Es einheitlicher Codestil muss her."
typora-copy-images-to: ..\assets\posts\2018-05-28-php-codestandard\images
typora-root-url: ..\
---
# Best practices für PHP-Codestyles

Es lohnt sich einen Stil für den Quellcode eines Projekts zu definieren an denen sich alle Entwickler halten, die mit dem Code arbeiten. Code wird dadurch nicht nur lesbarer, sondern es besser verarbeitbar. Wenn mehrere Entwickler an einem Projekt arbeiten und eine Sourcecodeverwaltung einsetzten wird es immer wieder zu der Situation kommen, dass Quellcode gemerged werden muss. Die Tools sind smart genug Quellcodeunterschiede festzustellen. Häufig können Leerzeilen oder Leerzeichen ignoriert werden, aber werden z.B. Ausdrücke in einem __if__ auf mehrere Zeilen aufgeteilt, hört stoßen Vergleichstools an ihre Grenzen. Es einheitlicher Codestil muss her.

In folgendem Artikel findet Ihr mehr als nur ein paar Denkanstöße für einen Codestil für PHP-Code. Ausgehend von den [PEAR-Codestandard][1e6c324f-ccf4-4fd8-a5f8-278fd4fa0fec] die habe ich meinen eigenen Codestil definiert. Natürlich spricht nichts dagegen die Beispiele seinen eigenen Bedürfnissen anzupassen. Es spräche sogar vieles dafür sich an einen bestehenden, verbreiteten Codestandard wie den von PEAR zu halten, da der Code so auch für Entwickler, außerhalb des eigenen Projekts, leichter zugänglich wäre. Jedoch finde ich den PEAR-Standard häufig unpraktisch und unleserlich. Dies ist allerdings nur meine persönliche subjektive Meinung und basiert meist auf nichts weiter als auf estetischem Empfinden.

Die Codestandards sind in unterschiedliche bereiche Aufgeteilt und können so als Regelsatz in der IDE eurer Wahl eingestellt werden. So lässt sich mit einem Shortkey schnell ein einheitliches Codebild erzeugen. Oder mann lässt diesen Schritt von der IDE automatisch beim Speichern oder vor einem Commit in die Sourcecodevertwaltung durchführen.

## Einrückungen

1 Tap a 4 Leerzeichen sind ein guter Kompromiss aus Lesbarkeit und Platzverbrauch. Dies entspricht dem PEAR-Standard. Bei der Länge einer Zeile schreibt der PEAR-Standard 75-85 Zeichen vor. Dieser Wert is in sofern nachvollziehbar, da er der Anzahl der Zeilenlänge in klassischen Büchern entspricht. Die Länge ist nicht zufällig gewählt sondern ist für den Menschen angenehm zu lesen, da er die Zeile ohne große Augenbewegung komplett erfassen kann. Ich halte dieses Wert für Quellcode jedoch nicht für optimal. Quellcode wird hauptsächlich nicht in Büchern sondern auf Computerbildschirmen geschrieben und gelesen. Diese sind heutzutage meist groß und im Breitbildformat. Es steht also viel Platz für eine Zeile zur Verfügung, selbst wenn Teile des Bildschirms für Fenster oder Bereiche der IDE Verwendung finden. Nach meiner Erfahrung sind 80 Zeichen auch schnell genutzt wenn man sprechende Namen nutzt. Der Code resultiert dann in unnötig vielen Zeilenumbrüchen in Steuersequenzen oder Methodenparameterisierungen. Ich empfinde dies als viel unleserlicher als einfach eine längere Zeilenlänge zu nutzen. Ich benutze 140 Zeichen. 120 bis 140 Zeichen haben sich in meiner Arbeit als einen guten Wert herausgestellt.

### Zusammenfassung

* Einrücken: 1 Tap = 4 Leerzeichen
* 140 Zeichen pro Zeile

## Lange Kontrolstrukturen und Parameterlisten

PEAR  ein Leerzeichen zwischen dem Bezeichner und den Klammern einer Kontrollstruktur. Bei Funktionen jedoch kein Leerzeichen. So ließe sich leichter zwischen diesen beiden unterscheiden. Ich denke, dass es keine große Herausforderung für einen Entwickler darstellt, zu erkennen, dass if(whatever) keine Funktion ist. Ob Leerzeichen oder ohne ist eine Geschmackssache. Das Gesamtbild sieht allerdings konsistenter aus wenn man sich für eines entscheidet. Ich lasse die Leerzeichen weg, da sie nicht zur Lesbarkeit beitragen und so nur überflüssige Zeichen darstellen.

Geschweifte Klammern sollten immer gesetzt werden auch wenn diese weggelassen werden können.

PEAR macht ein paar sehr gute Vorschläge zum Aufteilen von langen Kontrollstrukturen.

Um die Zeilenlänge einzuhalten sollten lange Kontrollstrukturen in mehrere Zeilen aufgeteilt werden. Dabei sollte der logische Operator immer vor dem Ausdruck stehen.

~~~PHP
if(
	( $condition1 || $condition2 )
    && $condition3
    && $condition4
) 
{
    //code
}
~~~

PEAR schlägt vor alles an einer Spalte auszurichten. Dies ist allerdings eine Geschmackssache auf die ich verzichte.

Längere Ausdrücke wie `( $condition1 || $condition2 )` sollten in einer Variable zwischengespeichert werden. Dadurch wird der Code viel verständlicher und die Kontrollstrukturen kürzer.

~~~PHP
$clarifyingName = ( $condition1 || $condition2 );

if($clarifyingName)
{
	//code
}
~~~

Auch die kürzer Schreibweise des __if__ kann so abgebildet werden.

 ~~~PHP
 $foo = $condition1 && $condition2
    ? $result1
    : $result2;
 ~~~

Mit Funktionsparametern kann auf die selbe Art umgegangen werden. Mehrer Parameter in einer Zeile sind möglich. Ein klareres Codebild ergibt sich aber wenn alle oder kein Parameter in eine extra Zeile geschrieben wird. Viele Parameter in einer Zeile sind ein Codesmell und deuten darauf hin, dass eventuell mit einem eigenen Objekt gearbeitet werden sollte. Prüft als solche Stellen wenn Ihr drauf stoßt.

~~~PHP
$this->object->functionName(
    $parameterOne, 
	$parameterTwo,
    $aVeryLongParameterThree
);
~~~

Arrays oder verkettete Funktionsaufrufe sind ein weiteres Einsatzgebiet:

~~~PHP
array(
	'foo'  => 'bar',
	'bare' => 'foot',
)

$object->functionName("parameter1", "parameter2")
    ->functionName2(23, 42)
    ->functionName3();
~~~

### Zusammenfassung

* Kein Leerzeichen zwischen Kontroll- oder Funktionsbezeichner und dazugehörenden Klammern
* Immer geschweifte Klammern setzten
* Lange Kontrollstrukturen, Funktionsparameterlisten, Arrays, Funktionsverkettungen auf mehrere Zeilen aufteilen
* Komplexe Überprüfungen in einer Variable zwischenspeichern

## Klammern

Klammersetzung ist eine reine Geschmackssache. Ich bevorzuge es alle geschweiften Klammern in einer neuen Zeile zu setzten, wie es in der .NET-Welt üblich ist. Ich finde diese Schreibweise um einiges übersichtlicher, da der Code dann nicht so verschachtelt wirkt. Dies wiederspricht den Konventionen der meisten anderen Programmiersprachen. Wichtig ist hier vor allem dass man konsistent ein Schema durchzieht. PEAR z.B. setzt die Klammern bei Kontrollstrukturen in der selben, bei Funktionen und Klassen in einer neuen Zeile.

### Zusammenfassung

* Klammernsetzung

## PHP-Delimiter

Benutzt immer <?php ?> und nie <? ?>. Damit stellt Ihr sicher, dass Ihr die größtmögliche Kompatibilität erreicht.

## Klassen

Jede Klasse gehört in eine eigenen Datei.

## Namenskonventionen

Auch hier gilt Konsistenz ist das A und O.

Ich beginne jeden Klassennamen mit einem Großbuchstaben und nutze CamelCase. CamelCase kommt auch bei der Benennung von Funktionen oder Eigenschaften zum Einsatz. Jedoch beginnen diese mit einem kleinen Buchstaben. Diese Konvention gilt auch für andere Programmiersprachen wie Java. CSharp beginnt Methoden mit einem Großbuchstaben, was ich auch so umsetzte wenn ich in CSharp entwickel. Ich versuche mich immer an die in einer Sprache gängigen Konventionen zu halten, außer ich halte sie für unschön und es gibt keinen logischen Grund sie zu benutzten.

Private Funktionen oder Eigenschaften beginnen mit einem Unterstrich. Diese Konvention entstammt dem PEAR-Richtlinien. Aber auch in .NET ist dies eine gängige Praxis.

Konstanten sollten ausschließlich in Großbuchstaben geschrieben werden. Unterstriche können benutzt werden um Worte zu separieren.

### Zusammenfassung

* Klassen mit CamelCase und Großbuchstaben am Anfang benennen
* Funktionen und Eigenschaften in CamelCase und beginnend mit Kleinbuchstaben
* Private Meber beginnen mit einem Unterstrich
* Konstanten in Großbuchstaben

[1e6c324f-ccf4-4fd8-a5f8-278fd4fa0fec]: http://pear.php.net/manual/en/standards.php