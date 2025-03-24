---
layout: post
title: "Validation"
date:   2019-05-21 07:52:00 +0100
category: development
tags: c# validation xamarin
excerpt: "Xamarin bietet einen eigenen Weg an. Es gibt Frameworks. Man kann aber auch eine eigene Implementierung machen. Hier werde ich eine eigene Implementierung vorstellen. Perfekt ist sie nicht, aber trotzdem lehrreich. Ich habe jedenfalls ein paar Dinge gelernt."
typora-root-url: ..\
---

# Validation

[Teil 1](/development/2019/04/27/xamarin-forms-app-create-project.html) beschreibt wie man ein Projekt erstellt.

[Teil 2](/development/2019/04/27/xamarin-forms-app-add-di.html) beschreibt wie ein Dependency Injection Container konfiguriert und benutzt wird.

[Teil 3](/development/2019/04/30/xamarin-forms-data-modell.html) behandelt das Design der Interfaces und Klassen der Datenmodelle und Programmlogik.

[Teil 4](/development/2019/05/17/xamarin-forms-percentage-as-value-object.html) zeigt das Pattern **ValueObject** anhand einer Klasse.

[Teil 5](/development/2019/05/21/xamarin-forms-validation.html) zeigt eine Möglichkeit Validierung zu implementieren.

Es ist wahrscheinlich nicht der beste Ansatz um Validierung zu implementieren (Ein schlechter Anfang für einen Artikel), aber ich habe mir bei der Implementierung einige Gedanken gemacht. Wahrscheinlich werden ich diesen Teil der Anwendung in Zukunft ändern. Dann wird es dazu auf jeden Fall einen weiteren Artikel geben.

Zuerst einmal Grundlegendes. Validierung der Benutzereingaben ist eine der wichtigsten Aufgaben der Anwendung. So wichtig, dass es selbstverständlich ist. Und eben weil es so selbstverständlich ist wird es in Beispielen auch nicht behandelt. In Nebensätzen wird erwähnt, dass man es auf jeden Fall machen soll. Nur man soll sich selbst überlegen wie.

Nunja. Xamarin bietet einen eigenen Weg an. Es gibt Frameworks. Man kann aber auch eine eigene Implementierung machen. Hier werde ich eine eigene Implementierung vorstellen. Perfekt ist sie nicht, aber trotzdem lehrreich. Ich habe jedenfalls ein paar Dinge gelernt.

## Was haben die Authoren von Xamarin sich zum Thema gedacht?

Die Authoren von Xamarin haben eine Klasse `Behaviour<T>` eingeführt, mit der einer `View` ein zusätzliches Verhalten angefügt werden kann. Eine der Anwendungsgebiete dieser generischen Lösung ist die Validierung der eingegebenen Daten. <https://devblogs.microsoft.com/xamarin/behaviors-in-xamarin.forms/> beschreibt ein Beispiel, dass auch ziemlich praktisch sein kann.

Mehr als die `Bahaviour` zu schreiben und sie in XAML zu deklarieren muss auch nicht getan werden.

## Warum habe ich mich dagegen entschieden?

Ich sehe trotzdem einige Nachteile bei der Nutzung von Behaviors zur Validierung. 

1. Die Validierung findet in der UI statt. Das will ich zwar auch haben, aber eben nicht nur. Die UI muss nicht die einzige Stelle im Code sein, an der ein Wert geändert wird. Bei einer Berechnung in der Logikschicht kann ebenfalls ein Wert geändert werden. Hier kann ich die `Behaviour` nicht verwenden und muss die Validierung erneut implementieren.
2. Die Validierung wird pro `View` konfiguriert. Validierungen können weit aus komplexer sein, als die Prüfung einer Eingabe in einem einzigen Feld. Werte eines Datenmodells können voneinander abhängen. Ich habe über diesen Weg aber keinen standardisierten Weg ganze Modellklassen zu validieren.

Als ich diese Punkte bedacht hatte, wollte ich eine allgemeinere Validierung für Datenmodelle implementieren. Und diese Validierung sollte Teil des Cores sein. Nicht der GUI. Zur Erinnerung, der Core ist eine eigene Library, die vielleicht auch in anderen Anwendungen zum Einsatz kommen könnte. In diesem Fall mit einer von der UI unabhängigen Implementierung der Validierungslogik

## Wie funktioniert meine Implementierung?

Meine Implementierung besteht aus Regeln, die von einem Validator ausgeführt werden. Über die Regeln des Validators kann so konfiguriert werden, wann ein Modell als valide gilt.

Die Implementierung für das Beispiel befindet sich hauptsächlich im Projekt **ExampleCalculator.Domain**. 

Unter `ExampleCalculator.Domain.Interfaces` werden zwei Interfaces angelegt.

```c#
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace ExampleCalculator.Domain.Interfaces
{
    /// <summary>
    /// An interface for a validator used to validate any kind of object.
    /// </summary>
    public interface IValidator<T>
    {
        #region Properties

        /// <summary>
        /// A list of error messages for any violated rule.
        /// </summary>
        IList<string> ValidationMessages { get; }

        /// <summary>
        /// True if all rules are valid.
        /// </summary>
        bool IsValid { get; }

        /// <summary>
        /// A string containing a summary of violated rules.
        /// </summary>
        string ValidationSummary { get; }

        /// <summary>
        /// A collection of violated properties.
        /// </summary>
        IList<Expression<Func<T, object>>> ViolatedProperties { get; }

        /// <summary>
        /// A collection of violated rules.
        /// </summary>
        IList<IValidationRule<T>> ViolatedRules { get; }

        #endregion Properties

        #region Methods

        /// <summary>
        /// Adds a rule to the validator.
        /// </summary>
        /// <param name="rule">A validation rule.</param>
        void AddRule(IValidationRule<T> rule);

        /// <summary>
        /// True, if the property with the given property path is violated by
        /// some rule.
        /// </summary>
        /// <example>
        /// <code>
        /// violator.IsViolated("variable.property")
        /// </code>
        /// </example>
        /// <param name="propertyPath">Path of a propery.</param>
        /// <returns>
        /// True, if the property with the given property path is violated by
        /// some rule.
        /// </returns>
        bool IsViolated(string propertyPath);

        /// <summary>
        /// True, if the property with the given property descibed by a <see
        /// cref="MemberExpression"/> is violated by some rule.
        /// </summary>
        /// <example>
        /// <code>
        /// violator.IsViolated(x =&gt; instance.Property)
        /// </code>
        /// </example>
        /// <param name="memberExpression">
        /// <see cref="MemberExpression"/> of a member.
        /// </param>
        /// <returns>
        /// True, if the property with the given <see cref="MemberExpression"/>
        /// is violated by some rule.
        /// </returns>
        bool IsViolated(Expression<Func<T, object>> memberExpression);

        #endregion Methods
    }
}
```

Das Interface definiert einen Validator. Über die Properties kann der Status des Validators abgerufen werden. Also z.B. ob das Model aktuell valide ist. Über die Methoden können Regeln hinzugefügt werden, oder es kann überprüft werden ob Properties des Modells verletzt wurden.

```c#
using System;
using System.Linq.Expressions;

namespace ExampleCalculator.Domain.Interfaces
{
    /// <summary>
    /// An interface for a validation rule.
    /// </summary>
    public interface IValidationRule<T>
    {
        #region Properties

        /// <summary>
        /// An expression to descibe the property to be validated.
        /// </summary>
        Expression<Func<T, object>> PropertyToTestExpression { get; }

        /// <summary>
        /// The function that specifies whether the property is valid or not.
        /// </summary>
        Func<Expression<Func<T, object>>, bool> CheckMethod { get; }

        /// <summary>
        /// The validation message is displayed in the list of objects that were
        /// validated when an object occurred errors are listed.
        /// </summary>
        string ValidationMessage { get; }

        /// <summary>
        /// The name of the checked property.
        /// </summary>
        string PropertyName { get; }

        /// <summary>
        /// Path to the property to test.
        /// </summary>
        string PropertyPath { get; }

        #endregion Properties

        #region Methods

        /// <summary>
        /// Executes the validation of the rule.
        /// </summary>
        /// <returns>True if the property is valid.</returns>
        bool Invoke();

        #endregion Methods
    }
}
```

Das Interface definiert eine Regel, anhand der validiert wird. Sie setzt sich zusammen aus einer Property des Modells, dass validiert werden soll und eine Methode bzw. einer Lambda gegen die getestet wird. Die einzige Methode führt den Test aus.

Das ganze muss implementiert werden. Unter `ExampleCalculator.Domain.Validation` habe ich eine Klasse `Validator` angelegt, die das Interface `IValidator` implementiert. Unter `ExampleCalculator.Domain.Exceptions` habe ich eine Ausnahme `NotValidException` implementiert.

```c#
using ExampleCalculator.Domain.Localization;
using System;

namespace ExampleCalculator.Domain.Exceptions
{
    /// <summary>
    /// The exception is thrown when a validation rule is not valid.
    /// </summary>
    public class NotValidException : Exception
    {
        #region Constructors

        /// <summary>
        /// Initializes an instance.
        /// </summary>
        public NotValidException()
            : base(Translations.ExampleCalculator_Domain_Exceptions_NotValidException_Default_Error_Message)
        {
        }

        /// <summary>
        /// Initializes an instance.
        /// </summary>
        /// <param name="message">Error description</param>
        public NotValidException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initialize an instance
        /// </summary>
        /// <param name="message">Error description</param>
        /// <param name="innerException">Inside exception</param>
        public NotValidException(string message, Exception innerException) : base(message, innerException)
        {
        }

        #endregion Constructors
    }
}
```

Der Validator kann entweder so konfiguriert werden, dass bei der ersten verletzten Regel eine Ausnahme geworfen wird. Dazu kann ein `bool` als Parameter an den Konstruktor übergeben werden. Die Defaulteinstellung ist so, dass alle Regeln geprüft werden. An anderer Stelle im Code kann dann geprüft werden, welche Regeln verletzt wurden.

```c#
using ExampleCalculator.Domain.Exceptions;
using ExampleCalculator.Domain.Extensions;
using ExampleCalculator.Domain.Interfaces;
using ExampleCalculator.Domain.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace ExampleCalculator.Domain.Validation
{
    /// <summary>
    /// The class encapsulates the validation of an object.
    /// </summary>
    public class Validator<T> : IValidator<T>
    {
        #region Fields

        /// <summary>
        /// A list of validation rules.
        /// </summary>
        private List<IValidationRule<T>> _validationRules;

        /// <summary>
        /// True, if an exception is to be thrown at the first occurrence of a
        /// rule that is not valid.
        /// </summary>
        private readonly bool _throwExceptionOnFirstViolatedRule;

        #endregion Fields

        #region Constructor

        /// <summary>
        /// Initializes an instance.
        /// </summary>
        public Validator() : this(false)
        {
        }

        /// <summary>
        /// Initializes an instance.
        /// </summary>
        /// <param name="throwExceptionOnFirstViolatedRule">
        /// True, if an exception is to be thrown at the first occurrence of a
        /// rule that is not valid.
        /// </param>
        public Validator(bool throwExceptionOnFirstViolatedRule)
        {
            _validationRules = new List<IValidationRule<T>>();
            ValidationMessages = new List<string>();
            _throwExceptionOnFirstViolatedRule = throwExceptionOnFirstViolatedRule;
            ViolatedProperties = new List<Expression<Func<T, object>>>();
            ViolatedRules = new List<IValidationRule<T>>();
        }

        #endregion Constructor

        #region Properties

        /// <summary>
        /// A list of the error messages that occurred during validation.
        /// </summary>
        public IList<string> ValidationMessages { get; }

        /// <summary>
        /// True, if the object to be validated is valid.
        /// </summary>
        public bool IsValid
        {
            get
            {
                return Validate();
            }
        }

        /// <summary>
        /// A summary of the violated rules.
        /// </summary>
        public string ValidationSummary
        {
            get
            {
                return GetValidationSummary();
            }
        }

        /// <summary>
        /// A collection of violated properties.
        /// </summary>
        public IList<Expression<Func<T, object>>> ViolatedProperties { get; }

        /// <summary>
        /// A collection of violated rules.
        /// </summary>
        public IList<IValidationRule<T>> ViolatedRules { get; }

        #endregion Properties

        #region Methods

        /// <summary>
        /// Adds a rule to the validator.
        /// </summary>
        /// <param name="rule">An instance of type <see cref="IValidationRule{T}"/>.</param>
        public void AddRule(IValidationRule<T> rule)
        {
            _validationRules.Add(rule);
        }

        /// <summary>
        /// Goes through the validation rules and shows if the instance is valid.
        /// </summary>
        /// <returns>
        /// <para>True, if the instance is valid.</para>
        /// <para>The error messages can be retrieved via <see cref="ValidationMessages"/>.</para>
        /// </returns>
        private bool Validate()
        {
            ValidationMessages.Clear();
            ViolatedProperties.Clear();
            ViolatedRules.Clear();
            bool valid = true;

            foreach (IValidationRule<T> rule in _validationRules)
            {
                valid = rule.Invoke();

                if (!valid)
                {
                    ValidationMessages.Add(rule.ValidationMessage);
                    ViolatedProperties.Add(rule.PropertyToTestExpression);
                    ViolatedRules.Add(rule);

                    if (_throwExceptionOnFirstViolatedRule)
                    {
                        throw new NotValidException(ValidationSummary);
                    }
                }
            }

            return ValidationMessages.Count == 0;
        }

        /// <summary>
        /// Returns a summary of the violated rules.
        /// </summary>
        /// <returns>Summary of the violated rules.</returns>
        private string GetValidationSummary()
        {
            string validationSummary = Translations.ExampleCalculator_Domain_Exceptions_NotValidException_Default_Error_Message;

            foreach (string validationMessage in ValidationMessages)
            {
                validationSummary += Environment.NewLine;
                validationSummary += validationMessage;
            }

            return validationSummary;
        }

        /// <summary>
        /// True, if the property with the given property path is violated by
        /// some rule.
        /// </summary>
        /// <example>
        /// <code>
        /// violator.IsViolated("variable.property")
        /// </code>
        /// </example>
        /// <param name="propertyPath">Path of a propery.</param>
        /// <returns>
        /// True, if the property with the given property path is violated by
        /// some rule.
        /// </returns>
        public bool IsViolated(string propertyPath)
        {
            if (!IsValid)
            {
                return ViolatedRules.Any(vr => vr.PropertyPath == propertyPath);
            }

            return false;
        }

        /// <summary>
        /// True, if the property with the given property descibed by a <see
        /// cref="MemberExpression"/> is violated by some rule.
        /// </summary>
        /// <example>
        /// <code>
        /// violator.IsViolated(x =&gt; instance.Property)
        /// </code>
        /// </example>
        /// <param name="memberExpression">
        /// <see cref="MemberExpression"/> of a member.
        /// </param>
        /// <returns>
        /// True, if the property with the given <see cref="MemberExpression"/>
        /// is violated by some rule.
        /// </returns>
        public bool IsViolated(Expression<Func<T, object>> memberExpression)
        {
            return IsViolated(memberExpression.GetMemberPath());
        }

        #endregion Methods
    }
}
```

Die Methode `public bool IsViolated(Expression<Func<T, object>> memberExpression)` ruft eine Extension-Method auf. Die Extension-Method `GetMemberPath` ist in eine Extension für `Expression`. Extensions sind Kandidaten für `ExampleCalculator.Domain`, denn die Wahrscheinlichkeit, dass sie auch in anderen Anwendungen Anwendung finden könnten ist ziemlich hoch.

In `ExampleCalculator.Domain` habe ich einen Ordner *Extensions* angelegt. Dort habe ich eine Datei *ExpressionExtension.cs* angelegt.

```c#
using System;
using System.Linq.Expressions;
using System.Text;

namespace ExampleCalculator.Domain.Extensions
{
    /// <summary>
    /// Extensions for <see cref="Expression"/>.
    /// </summary>
    public static class ExpressionExtension
    {
        #region Methods

        /// <summary>
        /// Returns the <see cref="Expression"/> as a <see cref="MemberExpression"/>.
        /// </summary>
        /// <param name="expression">An expression.</param>
        /// <returns>
        /// A <see cref="MemberExpression"/>. NULL if no <see
        /// cref="MemberExpression"/> could be casted.
        /// </returns>
        public static MemberExpression AsMemberExpression(this Expression expression)
        {
            if (expression is MemberExpression)
            {
                return (MemberExpression)expression;
            }
            else if (expression is LambdaExpression)
            {
                var lambdaExpression = expression as LambdaExpression;

                if (lambdaExpression.Body is MemberExpression)
                {
                    return (MemberExpression)lambdaExpression.Body;
                }
                else if (lambdaExpression.Body is UnaryExpression)
                {
                    return ((MemberExpression)((UnaryExpression)lambdaExpression.Body).Operand);
                }
            }

            return null;
        }

        /// <summary>
        /// Gets the Name of a <see cref="MemberExpression"/>.
        /// </summary>
        /// <param name="expression">A <see cref="MemberExpression"/>.</param>
        /// <returns>The name of a <see cref="MemberExpression"/>.</returns>
        /// <exception cref="NotMemberExpressionException">
        /// Is thrown when the given expression is not a <see cref="MemberExpression"/>.
        /// </exception>
        public static string GetMemberName(this Expression expression)
        {
            var memberExpression = expression.AsMemberExpression();

            if (!(memberExpression is MemberExpression))
            {
                throw new Exception("Not a member");
            }

            return memberExpression.Member.Name;
        }

        /// <summary>
        /// Gets the path of a <see cref="MemberExpression"/>.
        /// </summary>
        /// <param name="expression">A <see cref="MemberExpression"/>.</param>
        /// <returns>The path to the given <see cref="MemberExpression"/>.</returns>
        public static string GetMemberPath(this Expression expression)
        {
            var path = new StringBuilder();

            MemberExpression memberExpression = expression.AsMemberExpression();

            do
            {
                if (path.Length > 0)
                {
                    path.Insert(0, ".");
                }

                path.Insert(0, memberExpression.Member.Name);
                memberExpression = memberExpression.Expression.AsMemberExpression();
            }
            while (memberExpression != null);

            return path.ToString();
        }

        #endregion Methods
    }
}
```

Die Methode gibt den Pfad einer Property innerhalb einer Objekt-Hierarchie zurück.

Die Implentierung von `IValidationRule` ist in einer Datei *ValidationRule.cs* im Namespace `ExempleCalculator.Domain.Validation`. 

```c#
using ExampleCalculator.Domain.Extensions;
using ExampleCalculator.Domain.Interfaces;
using System;
using System.Linq.Expressions;

namespace ExampleCalculator.Domain.Validation
{
    /// <summary>
    /// Validation rule for an object.
    /// </summary>
    /// <remarks>
    /// <para>
    /// A rule consists of an object that is tested and a test method. The
    /// objects are the properties of an object. Validation rules can be all
    /// delegates that have an object and return a boolean.
    /// </para>
    /// </remarks>
    public class ValidationRule<T> : IValidationRule<T>
    {
        #region Constructor

        /// <summary>
        /// Creates a new instance.
        /// </summary>
        /// <remarks>
        /// No error message is set. During validation, therefore, no Error
        /// message for the error is queried, so that it cannot be determined why
        /// the object is not valid.
        /// </remarks>
        /// <param name="propertyToTestExpression">
        /// A property to be checked. Properties of a derivative class can be
        /// checked, too.
        /// </param>
        /// <param name="testFunction">A method used for validation.</param>
        public ValidationRule(Expression<Func<T, object>> propertyToTestExpression, Func<Expression<Func<T, object>>, bool> testFunction)
            : this(propertyToTestExpression, testFunction, string.Empty) { }

        /// <summary>
        /// Creates a new instance.
        /// </summary>
        /// <param name="propertyToTestExpression">
        /// A property to be checked. Properties of a derivative class can be
        /// checked, too.
        /// </param>
        /// <param name="testFunction">A method used for validation.</param>
        /// <param name="validationMassages">A description of the invalid state.</param>
        public ValidationRule(Expression<Func<T, object>> propertyToTestExpression, Func<Expression<Func<T, object>>, bool> testFunction, string validationMassages)
        {
            PropertyToTestExpression = propertyToTestExpression;
            PropertyName = propertyToTestExpression.GetMemberName();
            PropertyPath = propertyToTestExpression.GetMemberPath();
            CheckMethod = testFunction;
            ValidationMessage = validationMassages;
        }

        #endregion Constructor

        #region Properties

        /// <summary>
        /// The expression descibes the property to be checked.
        /// </summary>
        public Expression<Func<T, object>> PropertyToTestExpression { get; } = null;

        /// <summary>
        /// The function that specifies whether the property is valid or not.
        /// </summary>
        public Func<Expression<Func<T, object>>, bool> CheckMethod { get; } = null;

        /// <summary>
        /// The validation message is displayed in the list of objects that were
        /// validated when an object occurred errors are listed.
        /// </summary>
        public string ValidationMessage { get; } = string.Empty;

        /// <summary>
        /// The name of the checked property.
        /// </summary>
        public string PropertyName { get; } = string.Empty;

        /// <summary>
        /// Path of the checked property.
        /// </summary>
        public string PropertyPath { get; } = string.Empty;

        #endregion Properties

        #region Methods

        /// <summary>
        /// Executes the validation of the rule.
        /// </summary>
        /// <returns>True if the property is valid.</returns>
        public bool Invoke()
        {
            return CheckMethod.Invoke(PropertyToTestExpression);
        }

        #endregion Methods
    }
}
```

## Wie benutzt man den Validator?

Der Validator ist Teil des Calculators. Im Interface wird definiert, dass der Calculator eine Instanz von einem IValidator enthält.

```c#
using ExampleCalculator.Domain.Interfaces;

namespace ExampleCalculator.Core.Interfaces
{
    /// <summary>
    /// An interface for a calculator to calculate a fund's return.
    /// </summary>
    public interface IFundReturnCalculator
    {
        #region Properties

        /// <summary>
        /// The result of the calculations.
        /// </summary>
        IResult Result { get; }

        /// <summary>
        /// True, if the fund is valid.
        /// </summary>
        bool IsFundValid { get; }

        /// <summary>
        /// A validator for <see cref="IFund"/> instances.
        /// </summary>
        IValidator<IFund> Validator { get; }

        /// <summary>
        /// The fund instance used by the calculator.
        /// </summary>
        IFund Fund { get; }

        #endregion Properties

        #region Methods

        /// <summary>
        /// Sets a fund in the calculator.
        /// </summary>
        /// <param name="fund">A fund.</param>
        void SetFund(IFund fund);

        #endregion Methods
    }
}
```

Um mit einem Validator arbeiten zu können müssen wir einen spezifischen Validator instanziieren und konfigurieren.

In `ExampleCalculator.Core` habe ich dazu einen Ordner *Validation* erstellt. Dort werden alle Validatoren liegen. In diesem Ordner/Namespace habe ich eine Datei *CalculatorValidator.cs* erstellt.

```c#
using ExampleCalculator.Core.Interfaces;
using ExampleCalculator.Domain.Exceptions;
using ExampleCalculator.Domain.Validation;

namespace ExampleCalculator.Core.Validation
{
    public class CalculatorValidator : Validator<IFund>
    {
        /// <summary>
        /// Initializes an instance for the given fund.
        /// </summary>
        /// <param name="fund">The fund to validate.</param>
        public CalculatorValidator(IFund fund)
        {
            if (fund == null)
            {
                throw ArgumentExceptionFactory.Create(nameof(fund));
            }

            AddRule(new ValidationRule<IFund>(x => x.EntryFee
            , x => fund.EntryFee >= 0m
            , $"{nameof(fund.EntryFee)} is required"));

            AddRule(new ValidationRule<IFund>(x => x.ExpenseRatio
            , X => fund.ExpenseRatio.Rate >= 0m));

            AddRule(new ValidationRule<IFund>(x => x.InvestmentAmount
            , X => fund.InvestmentAmount > 0m));

            AddRule(new ValidationRule<IFund>(x => x.InvestmentPeriod
            , X => fund.InvestmentPeriod >= 0));

            AddRule(new ValidationRule<IFund>(x => x.RateOfReturn
            , X => fund.RateOfReturn.Rate >= 0m));
        }
    }
}
```

Der spezifische Validator erbt von `Validator<T>`. Im Konstruktor wird der Validator konfiguriert, indem Regeln hinzugefügt werden. Die Methode `AddRule` nimmt eine `ValidationRule` entgegen, die als Parameter die zu prüfende Property und eine Expression mit der Prüflogik entgegennimmt. Optional kann noch eine Nachricht angegeben werden, die beschreibt, warum die Regel verletzt wurde. Hier können auch RESX-Dateien verwendet werden um lokalisierte Nachrichten zu übergeben.

Der Validator kann so verwendet werden:

```c#
var validator = new CalculatorValidator(Fund);

if(validator.IsValid)
{
    //Do Stuff here
}
```

## Was ginge besser?

Eine eigene Implementierung für die Validierungslogik ist nicht immer der Beste Ansatz. Ich bin noch nicht dazu gekommen mir bestehende Lösungen anzusehen. [Fluent Validation](<https://fluentvalidation.net/>) scheint sehr vielversprechend zu sein.