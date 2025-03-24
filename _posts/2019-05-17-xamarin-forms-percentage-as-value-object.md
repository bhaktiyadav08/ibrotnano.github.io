---
layout: post
title: "Percentage als ValueObject"
date:   2019-05-17 13:08:00 +0100
category: development
tags: c# valueobject pattern percentage
excerpt: "ValueObject ist ein Pattern in der Programmierung. Es wird dann interessant wenn Datentyp nicht primitiv ist, sondern sich durch mehrere spezifische Eigenschaften auszeichnet. ValueObjects sind unveränderbare Objekte, die durch ihren Wert repräsentiert werden und nicht durch ihre Identität."
typora-root-url: ..\


---

# Percentage als ValueObject (fast)

[Teil 1](/development/2019/04/27/xamarin-forms-app-create-project.html) beschreibt wie man ein Projekt erstellt.

[Teil 2](/development/2019/04/27/xamarin-forms-app-add-di.html) beschreibt wie ein Dependency Injection Container konfiguriert und benutzt wird.

[Teil 3](/development/2019/04/30/xamarin-forms-data-modell.html) behandelt das Design der Interfaces und Klassen der Datenmodelle und Programmlogik.

[Teil 4](/development/2019/05/17/xamarin-forms-percentage-as-value-object.html) zeigt das Pattern **ValueObject** anhand einer Klasse.

[Teil 5](/development/2019/05/21/xamarin-forms-validation.html) zeigt eine Möglichkeit Validierung zu implementieren.

ValueObject ist ein Pattern in der Programmierung. Es wird dann interessant wenn Datentyp nicht primitiv ist, sondern sich durch mehrere spezifische Eigenschaften auszeichnet. ValueObjects sind unveränderbare Objekte, die durch ihren Wert repräsentiert werden und nicht durch ihre Identität.

<https://de.wikipedia.org/wiki/Value_Object> enthält weitere Infos dazu.

Ich benutze in der Beispielanwendung den Datentyp `Percentage`, der als `ValueObject` implementiert ist.

## Basisklasse

Zu erst einmal hat ein `ValueObject` einige ganz bestimmte Eigenheiten, die alle `ValueObject`s aufweisen sollen, die wir jemals implementieren. Eine Basisklasse für `ValueObjects`s ist also sinnvoll. Diese kann auch in anderen Anwendungen nützlich sein. Es bietet sich an die Basisklasse also in einer eigenen Library zu implementieren, die auch von anderen Anwendungen verwendet werden kann.

In meinem Fall lege ich dazu ein neues Projekt an. In Visual Studio habe ich als Projekttyp **Class Library (.NET Standard)** gewählt. Das Projekt habe ich **ExampleCalculator.Domain** genannt. Besser wäre als Name **[Firmenname].Domain**, um zu verdeutlichen, dass es sich bei dem Code in diesem Projekt nicht um Anwendungsspezifischen Code handelt.

Im neuen Projekt lege ich eine Klasse *ValueObject.cs* an.

```c#
using System;
using System.Collections.Generic;

namespace ExampleCalculator.Domain
{
    /// <summary>
    /// A basic type for value objects. Objects which are equal based on their
    /// value and not on their identity.
    /// </summary>
    public abstract class ValueObject
    {
        #region Methods

        /// <summary>
        /// Equal operator.
        /// </summary>
        /// <param name="left">Left side of the comparison.</param>
        /// <param name="right">Right side of the comparison.</param>
        /// <returns>True, if the two objects are equal.</returns>
        protected static bool EqualOperator(ValueObject left, ValueObject right)
        {
            return left is null
                   ^ right is null
                   ? false
                   : left is null
                   || left.Equals(right);
        }

        /// <summary>
        /// Not equal operator.
        /// </summary>
        /// <param name="left">Left side of the comparison.</param>
        /// <param name="right">Right side of the comparison.</param>
        /// <returns>True if the two objects are not equal.</returns>
        protected static bool NotEqualOperator(ValueObject left, ValueObject right)
        {
            return !EqualOperator(left, right);
        }

        /// <summary>
        /// Returns atomic values.
        /// </summary>
        /// <returns><see cref="IEnumerable"/> of the atomic values.</returns>
        protected abstract IEnumerable<object> GetAtomicValues();

        /// <summary>
        /// Compares this object to another.
        /// </summary>
        /// <param name="obj">The other object.</param>
        /// <returns>True if this instance equals the other object.</returns>
        public override bool Equals(object obj)
        {
            if (obj == null
                || obj.GetType() != GetType())
            {
                return false;
            }

            ValueObject other = (ValueObject)obj;
            IEnumerator<object> thisValues = GetAtomicValues().GetEnumerator();
            IEnumerator<object> otherValues = other.GetAtomicValues().GetEnumerator();

            while (thisValues.MoveNext() && otherValues.MoveNext())
            {
                if (thisValues.Current is null
                    ^ otherValues.Current is null)
                {
                    return false;
                }

                if (thisValues.Current != null
                    && !thisValues.Current.Equals(otherValues.Current))
                {
                    return false;
                }
            }

            return !thisValues.MoveNext() && !otherValues.MoveNext();
        }

        /// <summary>
        /// Return the hash code of this instance.
        /// </summary>
        /// <returns>A hash.</returns>
        public override int GetHashCode()
        {
            return GetAtomicValues()
             .Select(x => x != null ? x.GetHashCode() : 0)
             .Aggregate((x, y) => Tuple.Create(x, y).GetHashCode());
        }

        #endregion Methods
    }
}
```

Es handelt sich um eine abstrakte Klasse. Einige Vergleichsmethoden und `GetHashCode()` sind bereits implementiert.

## Implementierung der Klasse Percentage

Unter dem namespace/Pfad *ExampleCalculator.Core.Math.Percentrage* lege ich eine Datei *Percentrage.cs* an.

```c#
using ExampleCalculator.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace ExampleCalculator.Core.Math.Percentage
{
    /// <summary>
    /// A value object for percentages.
    /// </summary>
    public class Percentage : ValueObject, INotifyPropertyChanged
    {
        #region Fields

        /// <summary>
        /// Percentage rate
        /// </summary>
        private decimal _rate;

        /// <summary>
        /// Decimal value of the percentage rate.
        /// </summary>
        private decimal _decimal;

        /// <summary>
        /// PropertyChanged event.
        /// </summary>
        public event PropertyChangedEventHandler PropertyChanged;

        #endregion Fields

        #region Constructors

        /// <summary>
        /// The constructor is intentionally set to private because i don't want
        /// that parameterless instances can be created.
        /// </summary>
        private Percentage()
        {
        }

        /// <summary>
        /// Initializes a new instance with the given percentage.
        /// </summary>
        /// <remarks>
        /// <para>Only one of the parameters must be set.</para>
        /// </remarks>
        /// <param name="rate">Percentage rate</param>
        /// <param name="decimal">Decimal value</param>
        /// <exception cref="ArgumentException">
        /// Throws when the rate and the decimal value are null.
        /// </exception>
        public Percentage(decimal? rate = null, decimal? @decimal = null)
        {
            if (rate is null && @decimal is null)
            {
                throw ArgumentExceptionFactory.Create(nameof(rate));
            }

            Rate = rate
            ?? (decimal)@decimal * 100;

            Decimal = @decimal
            ?? (decimal)rate / 100;
        }

        #endregion Constructors

        #region Properties

        /// <summary>
        /// Percentage rate
        /// </summary>
        public decimal Rate
        {
            set
            {
                if (_rate != value)
                {
                    _rate = value;
                    _decimal = value / 100;
                    OnPropertyChanged(nameof(Rate));
                }
            }
            get
            {
                return _rate;
            }
        }

        /// <summary>
        /// The rate rounded to two decimals.
        /// </summary>
        public decimal RoundedRate
        {
            get
            {
                return System.Math.Round(Rate, 2);
            }
        }

        /// <summary>
        /// Decimal value of the percentage rate.
        /// </summary>
        public decimal Decimal
        {
            set
            {
                if (_decimal != value)
                {
                    _decimal = value;
                    _rate = value * 100;
                    OnPropertyChanged(nameof(Decimal));
                }
            }
            get
            {
                return _decimal;
            }
        }

        /// <summary>
        /// The decimal representation rounded to two decimals.
        /// </summary>
        public decimal RoundedDecimal
        {
            get
            {
                return System.Math.Round(Decimal, 2);
            }
        }

        #endregion Properties

        #region Methods

        /// <summary>
        /// Return the atomic values of the object.
        /// </summary>
        /// <returns></returns>
        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return Rate;
            yield return Decimal;
        }

        /// <summary>
        /// Returns the string representation.
        /// </summary>
        /// <returns>String representation.</returns>
        public override string ToString()
        {
            return $"{Rate}%";
        }

        /// <summary>
        /// Parses the given string for a percentage.
        /// </summary>
        /// <param name="percentage">A string representing a percentage.</param>
        /// <returns>A <see cref="Percentage"/> instance.</returns>
        /// <exception cref="ArgumentException">
        /// Thrown when the given percentage string is null, empty, contains only
        /// whitespaces or does not match a percentage regex.
        /// </exception>
        public static Percentage Parse(string percentage)
        {
            string percentagePattern = "^(\\d+|\\d+["
                    + Thread.CurrentThread.CurrentCulture.NumberFormat.NumberDecimalSeparator
                    + "]\\d+)%$";
                    
            if (string.IsNullOrWhiteSpace(percentage)
                || !new System.Text.RegularExpressions.Regex(percentagePattern).IsMatch(percentage))
            {
                throw ArgumentExceptionFactory.Create(nameof(percentage));
            }
            {
                throw ArgumentExceptionFactory.Create(nameof(percentage));
            }

            var rateString = percentage.Replace("%", string.Empty);
            decimal rate = decimal.Parse(rateString);
            return new Percentage(rate);
        }

        /// <summary>
        /// True if this object equals the given one.
        /// </summary>
        /// <param name="other">A <see cref="Percentage"/> instance.</param>
        /// <returns>True if this instance equals the other one.</returns>
        public override bool Equals(object other)
        {
            return base.Equals(other);
        }

        /// <summary>
        /// Returns a hash code.
        /// </summary>
        /// <returns>Can be used to identify this object.</returns>
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        /// <summary>
        /// Compares two instances for equality.
        /// </summary>
        /// <param name="left">The left side of the comparison.</param>
        /// <param name="right">The right side of the comparison.</param>
        /// <returns>True, if the two objects are equal.</returns>
        public static bool operator ==(Percentage left, Percentage right)
        {
            return EqualOperator(left, right);
        }

        /// <summary>
        /// Compares two instances and returns true if they are not equal.
        /// </summary>
        /// <param name="left">The left side of the comparison.</param>
        /// <param name="right">The right side of the comparison.</param>
        /// <returns>True if the instances are not equal.</returns>
        public static bool operator !=(Percentage left, Percentage right)
        {
            return NotEqualOperator(left, right);
        }

        /// <summary>
        /// Returns a string by allocation.
        /// </summary>
        /// <param name="percentage">A <see cref="Percentage"/> instance.</param>
        public static implicit operator string(Percentage percentage)
        {
            return percentage.ToString();
        }

        /// <summary>
        /// Returns a <see cref="Percentage"/> instance by casting a string.
        /// </summary>
        /// <param name="percentage">A <see cref="Percentage"/> instance.</param>
        public static explicit operator Percentage(string percentage)
        {
            return Parse(percentage);
        }

        /// <summary>
        /// Is executed when a property is changed.
        /// </summary>
        /// <param name="propertyName">Name of the changed property.</param>
        public virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        #endregion Methods
    }
}
```

Die Klasse soll von `ValueObject` erben, aber auch von `INotifyPropertyChanged` implementieren.

Der parameterlose Konstruktor ist `private`. Auf diese Weise kann nicht unkontrolliert eine Instanz der Klasse erstellt werden. Es kann also nur über den zweiten Konstruktor eine Instanz initialisiert werden. Die validiert die übergebenen Parameter und stellt sicher, dass in das Objekt einen logischen Status hat.

Ist dies nicht der Fall wird eine `ArgumentException` geworfen.

In den Properties wird ebenfalls sichergestellt, dass der Status des Objekts valide bleibt und das Event `OnPropertyChanged` wird ausgelöst.

An dieser Stelle laufe ich vor Scharm rot an und sollte von einem wütenden Mopp durchs Dorf getrieben werden. Ein `ValueObject` hat er uns versprochen. Jetzt verletzt er das Pattern doch!

Die `Setter` sind nicht `private`. Das sollten sie aber sein um die Definition eines `ValueObject`s zu erfüllen. `ValueObject`s sollen unveränderbar sein.

Objekte von `Percentage` will ich aber an die UI binden. Dazu muss es der UI möglich sein über die Properties Werte zu setzen.

Hier handelt es sich also gar nicht um eine korrekte Implementierung. Dafür haben wir aber eine Basisklasse die wir für solche Implementierungen nutzen können. Wir haben was gelernt und wir haben ein `Percentage`, dass die Equals-Operatoren der Basisklasse nutzt um anhand der Werte zweier `Percentage`-Instanzen zu prüfen, ob sie identisch sind.

### Operatorenüberladungen

Einige Schmankerl sind in der Klasse noch zu finden. Am Ende stehen einige Operatorenüberladungen.

```c#
/// <summary>
/// Compares two instances for equality.
 /// </summary>
/// <param name="left">The left side of the comparison.</param>
/// <param name="right">The right side of the comparison.</param>
/// <returns>True, if the two objects are equal.</returns>
public static bool operator ==(Percentage left, Percentage right)
{
	return EqualOperator(left, right);
}

/// <summary>
/// Compares two instances and returns true if they are not equal.
/// </summary>
/// <param name="left">The left side of the comparison.</param>
/// <param name="right">The right side of the comparison.</param>
/// <returns>True if the instances are not equal.</returns>
public static bool operator !=(Percentage left, Percentage right)
{
	return NotEqualOperator(left, right);
}

/// <summary>
/// Returns a string by allocation.
/// </summary>
/// <param name="percentage">A <see cref="Percentage"/> instance.</param>
public static implicit operator string(Percentage percentage)
{
	return percentage.ToString();
}

/// <summary>
/// Returns a <see cref="Percentage"/> instance by casting a string.
/// </summary>
/// <param name="percentage">A <see cref="Percentage"/> instance.</param>
public static explicit operator Percentage(string percentage)
{
	return Parse(percentage);
}
```

Aus den Tests dieser Klasse stammt folgender Code, der verdeutlicht, wie schön man mit diesen Operatoren programmieren kann.

```c#
[Fact]
public void ImplicitConversionToStringResultsInCorrectString()
{
	var percentage = new Core.Math.Percentage.Percentage(10);
	string result = percentage;
	Assert.Equal(percentage.ToString(), result);
}
```

Eine Zuweisung von einer `Percentage`-Instanz castet implizit auf einen `string`.

```c#
[Fact]
public void ExplicitConversionFromStringSetsValues()
{
    var actual = (Core.Math.Percentage.Percentage)"10%";
    Assert.Equal(10, actual.Rate);
    Assert.Equal(0.1m, actual.Decimal);
}
```

Expliziter Cast von einem String zu `Percentage`.

Das ganze geht auch Culture-Spezifisch.

```c#
[Fact]
public void ExplicitConversionFromStringSetsValuesWithDecimalPoint()
{
    CultureInfo.CurrentCulture = new CultureInfo("en-US");
    var actual = (Core.Math.Percentage.Percentage)"10.5%";
    Assert.Equal(10.5m, actual.Rate);
    Assert.Equal(0.105m, actual.Decimal);
}

[Fact]
public void ExplicitConversionFromStringSetsValuesWithDecimalComma()
{
    CultureInfo.CurrentCulture = new CultureInfo("de-DE");
    var actual = (Core.Math.Percentage.Percentage)"10,5%";
    Assert.Equal(10.5m, actual.Rate);
    Assert.Equal(0.105m, actual.Decimal);
}
```

Und übliche Vergleichsoperatoren funktionieren auch.

```c#
[Fact]
public void EqualOperator()
{
    var percentage1 = new Core.Math.Percentage.Percentage(10.5m);
    var percentage2 = new Core.Math.Percentage.Percentage(10.5m);
    Assert.True(percentage1 == percentage2);
}

[Fact]
public void NotEqualOperator()
{
    var percentage1 = new Core.Math.Percentage.Percentage(10.5m);
    var percentage2 = new Core.Math.Percentage.Percentage(20.5m);
    Assert.True(percentage1 != percentage2);
}
```

### ArgumentExceptionFactory

Die Methode `Parse(string percentage)` wirf eine `ArgumentException`. Ich mag es, dies auf einen standardisierte Art durchzuführen. Dazu habe ich eine Factory implementiert, die hier genutzt wird.

```c#
public static Percentage Parse(string percentage)
{
    string percentagePattern = "^(\\d+|\\d+["
        + Thread.CurrentThread.CurrentCulture.NumberFormat.NumberDecimalSeparator
        + "]\\d+)%$";
    
    if (string.IsNullOrWhiteSpace(percentage)
        || !new System.Text.RegularExpressions.Regex(percentagePattern).IsMatch(percentage))
    {
        throw ArgumentExceptionFactory.Create(nameof(percentage));
    }

    var rateString = percentage.Replace("%", string.Empty);
    decimal rate = decimal.Parse(rateString);
    return new Percentage(rate);
}
```

Diese ist ebenfalls auch für andere Anwendungen interessant. Die Factory kommt also in den namespace `ExampleCalculator.Domain.Exceptions` im entsprechenden Projekt. Der Name der Datei ist *ArgumentExceptionFactory.cs*.

```c#
using System;

namespace ExampleCalculator.Domain.Exceptions
{
    /// <summary>
    /// A factory to create standardized <see cref="ArgumentException"/> instances.
    /// </summary>
    public static class ArgumentExceptionFactory
    {
        #region Methods

        /// <summary>
        /// Creates a new standardized <see cref="ArgumentException"/> instance
        /// for the given parameter's name.
        /// </summary>
        /// <remarks>
        /// <para>
        /// Use nameof() to get the parameter's name instead of a string. That
        /// way the application keeps typesafe.
        /// </para>
        /// </remarks>
        /// <example>
        /// <code>
        /// throw ArgumentExceptionFactory.Create(nameof(param));
        /// </code>
        /// </example>
        /// <param name="paramName">Name of a parameter</param>
        /// <returns>
        /// An <see cref="ArgumentException"/> instance with a standardized
        /// exception message.
        /// </returns>
        public static ArgumentException Create(string paramName)
        {
            return new ArgumentException(string.Format(Translations.ExampleCalculator_Domain_Exceptions_ArgumentExceptionFactory_Create_ArgumentException_Message, paramName), paramName);
        }

        #endregion Methods
    }
}
```

Die Nachricht der Exception kommen aus einer Ressource. Dieser liegt in einem Ordner *Localization*. Ich benutze meisten nur eine Datei *Translations.resx* pro Sprache. Im Beispiel gibt es nur eine Sprache. Die Nachricht lautet: "Eine Ausnahme ist im Zusammenhang mit dem Parameter "{0}" aufgetreten.". `{0}` ist eine Variable. In diese wird der Name des Parameters eingefügt. Dazu muss dieser mit `nameof` an die Methode übergeben werden.

Ich finde es sehr praktische mit einem Einzeiler ArgumentExceptions werfen zu können.

```c#
throw ArgumentExceptionFactory.Create(nameof(parameter));
```

### Regex für die Prozentangabe

Entspricht der an `public static Percentage Parse(string percentage)` übergebene Wert nicht dem Pattern einer Prozentangabe wird ebenfalls eine `ArgumentException` geworfen. Das Pattern berücksichtigt Dezimaltrennzeichen der aktuell eingestellten Sprache.

Das Pattern und die Regex stehen hier direkt im Code um das Beispiel nicht zu komplex werden zu lassen.

Es bietet sich an, ebenfalls eine Factory zu implementieren.

## Nutzung des Datentypen

Der Datentyp `Percentage` ist nun fertig implementiert. Im Code der Modelklassen `Fund` und `Result` wird er bereits verwendet. Es kann sein, dass bei dir noch ein `using` auf den Namespace von `Percentage` angegeben werden muss.

