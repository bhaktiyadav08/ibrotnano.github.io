---
layout: post
title: "Datenmodell des ExampleCalculators"
date:   2019-04-30 12:00:00 +0100
category: development
tags: xamarin app android ios uwp
excerpt: "Das Datenmodell einer Xamarin.Forms-Beispielanwendung."
typora-root-url: ..\


---

# Datenmodell des ExampleCalculators

[Teil 1](/development/2019/04/27/xamarin-forms-app-create-project.html) beschreibt wie man ein Projekt erstellt.

[Teil 2](/development/2019/04/27/xamarin-forms-app-add-di.html) beschreibt wie ein Dependency Injection Container konfiguriert und benutzt wird.

[Teil 3](/development/2019/04/30/xamarin-forms-data-modell.html) behandelt das Design der Interfaces und Klassen der Datenmodelle und Programmlogik.

[Teil 4](/development/2019/05/17/xamarin-forms-percentage-as-value-object.html) zeigt das Pattern **ValueObject** anhand einer Klasse.

[Teil 5](/development/2019/05/21/xamarin-forms-validation.html) zeigt eine Möglichkeit Validierung zu implementieren.

Das Datenmodell des Rechners ist ziemlich einfach. Es gibt ein Modell für die Daten, die eingetragen werden, ein Modell für das Ergebnis der Berechnung und eine Klasse die mit dem Eingabemodell die Berechnung durchführt. Da ich möglichst mit Dependency Injection arbeiten möchte bedarf es Interfaces der Modelle.

In **ExampleCalculator.Core** legt man einen Ordner **Interfaces** an. In diesem Ordner liegen alle Interfaces der Anwendung.

Ein Interface **IFund** enthält alle Eingabewerte des Rechners.

```c#
using System.ComponentModel;

namespace ExampleCalculator.Core.Interfaces
{
    /// <summary>
    /// An interface for funds.
    /// </summary>
    public interface IFund : INotifyPropertyChanged
    {
        /// <summary>
        /// The amount of the investment.
        /// </summary>
        decimal InvestmentAmount { get; set; }

        /// <summary>
        /// The rate of return.
        /// </summary>
        Percentage RateOfReturn { get; set; }

        /// <summary>
        /// All costs of the fund per year.
        /// </summary>
        Percentage ExpenseRatio { get; set; }

        /// <summary>
        /// The entry fee.
        /// </summary>
        decimal EntryFee { get; set; }

        /// <summary>
        /// The number of years of the investment.
        /// </summary>
        int InvestmentPeriod { get; set; }
    }
}
```

Ein Interface **IResult** enthält die berechnete Ausgabe.

```c#
using System.Collections.Generic;
using System.ComponentModel;

namespace ExampleCalculator.Core.Interfaces
{
    /// <summary>
    /// An interface of a FundReturnCalculator's result.
    /// </summary>
    public interface IResult : INotifyPropertyChanged
    {
        #region Properties

        /// <summary>
        /// The investment amount after the entry fee is subtracted.
        /// </summary>
        decimal AmountAfterEntryFee { get; set; }

        /// <summary>
        /// The required rate of return needed to compensate the entry fee.
        /// </summary>
        Percentage RequiredRateOfReturnToCompensateEntryFee { get; set; }

        /// <summary>
        /// The final compounded amount.
        /// </summary>
        decimal CompoundedAmount { get; set; }

        /// <summary>
        /// The required rate of return needed to compensate the fund's costs
        /// after the first year.
        /// </summary>
        Percentage RequiredRateOfReturnToCompensateCostsAfterFirstYear { get; set; }

        /// <summary>
        /// Compounded costs of the investment.
        /// </summary>
        decimal CompoundedCosts { get; set; }

        /// <summary>
        /// Compounded costs in percentage.
        /// </summary>
        Percentage CompoundedCostsInPercent { get; set; }

        /// <summary>
        /// The required rate of return needed to compensate the fund's cost over
        /// the whole period.
        /// </summary>
        Percentage RequiredRateOfReturnToCompensateCostsAfterWholePeriod { get; set; }

        /// <summary>
        /// Current period.
        /// </summary>
        int InvestmentPeriod { get; set; }

        /// <summary>
        /// List of the values for each period.
        /// </summary>
        IEnumerable<IResult> AnnualPerformanceValues { get; set; }

        #endregion Properties
    }
}
```

Ein drittes Interface **Calculator** definiert die Serviceklasse des Rechners.

```c#
using MarcelMelzig.Validation.Interfaces;

namespace MarcelMelzig.Annona.Core.Interfaces.FundReturnCalculation
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

Diese Interfaces abstrahieren die Implementierung von der Anwendung.

Als nächstes geht es an die Implementierung dieser Interfaces. Dazu lege ich zwei weitere Ordner an. *Models* und *Logic*.

*Models* wird die Implementierung des Datenmodells beinhalten. *Logic* wird diejenigen Klassen enthalten, die mit den Daten etwas durchführen, wie, in unserem Fall, Berechnungen.

Die Modelklassen sind also POCOs. Klassen, die nur Properties enthalten und keine Methoden. Sie dienen lediglich der Datenhaltung und werden zwischen den **Serviceklassen** unter *Logic* als Messages weitergeleitet oder von ihnen verarbeitet.

Xamarin basiert auf XAML als Technologie und bietet uns somit **Modelbinding** an. Durch die Implementierung des Interfaces `INotifyPropertyChanged` können die Models an die UI gebunden werden. Das heißt, Änderungen im Modell werden in der UI angezeigt und Eingaben in der UI ändern automatisch die Werte im Modell.

Eine Basisklasse für Modelklassen implementiert dieses Interface. Alle Modelklassen erben dann von dieser Basisklasse. 

```c#
using System.ComponentModel;

namespace ExampleCalculator.Core.Models
{
    public class BaseViewModel : INotifyPropertyChanged
    {
        #region Events

        /// <summary>
        /// The event when a property is changed.
        /// </summary>
        public event PropertyChangedEventHandler PropertyChanged;

        #endregion Events

        #region Methods

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

Mit Hilfe dieser Basisklasse ist hier die Implementierung der Klasse `Fund`.

```c#
using ExampleCalculator.Core.Interfaces;

namespace ExampleCalculator.Core.Models
{
    public class Fund : BaseViewModel, IFund
    {
        #region Fields

        /// <summary>
        /// Investment amount
        /// </summary>
        private decimal _investmentAmount;

        /// <summary>
        /// Rate of return
        /// </summary>
        private Percentage _rateOfReturn;

        /// <summary>
        /// Expense ratio
        /// </summary>
        private Percentage _expenseRatio;

        /// <summary>
        /// Entry fee
        /// </summary>
        private decimal _entryFee;

        /// <summary>
        /// Investment period in years
        /// </summary>
        private int _investmentPeriod;

        #endregion Fields

        #region Constructors

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        public Fund()
        {
            _rateOfReturn = new Percentage(0);
            _expenseRatio = new Percentage(0);
        }

        #endregion Constructors

        #region Properties

        /// <summary>
        /// Investment amount
        /// </summary>
        public decimal InvestmentAmount
        {
            set
            {
                if (_investmentAmount != value)
                {
                    _investmentAmount = value;
                    OnPropertyChanged(nameof(InvestmentAmount));
                }
            }
            get
            {
                return _investmentAmount;
            }
        }

        /// <summary>
        /// Rate of return
        /// </summary>
        public Percentage RateOfReturn
        {
            set
            {
                if (_rateOfReturn != value)
                {
                    _rateOfReturn = value;
                    OnPropertyChanged(nameof(RateOfReturn));
                }
            }
            get
            {
                return _rateOfReturn;
            }
        }

        /// <summary>
        /// Expense ratio
        /// </summary>
        public Percentage ExpenseRatio
        {
            set
            {
                if (_expenseRatio != value)
                {
                    _expenseRatio = value;
                    OnPropertyChanged(nameof(ExpenseRatio));
                }
            }
            get
            {
                return _expenseRatio;
            }
        }

        /// <summary>
        /// Entry fee
        /// </summary>
        public decimal EntryFee
        {
            set
            {
                if (_entryFee != value)
                {
                    _entryFee = value;
                    OnPropertyChanged(nameof(EntryFee));
                }
            }
            get
            {
                return _entryFee;
            }
        }

        /// <summary>
        /// Investment period in years
        /// </summary>
        public int InvestmentPeriod
        {
            set
            {
                if (_investmentPeriod != value)
                {
                    _investmentPeriod = value;
                    OnPropertyChanged(nameof(InvestmentPeriod));
                }
            }
            get
            {
                return _investmentPeriod;
            }
        }

        #endregion Properties
    }
}
```

Das Modell implementiert `BaseViewModel` und `IFund`. In den Settern der Properties wird `OnPropertyChanged` aufgerufen.

Das Model des Ergebnisses enthält nur Daten, die angezeigt, jedoch nicht in der UI geändert werden werden sollen. Ein Aufruf von `OnPropertyChanged` ist zu diesem Zeitpunkt nicht notwendig.

```c#
using ExampleCalculator.Core.Interfaces;
using System.Collections.Generic;

namespace ExampleCalculator.Core.Models
{
    /// <summary>
    /// The implementation of <see cref="IResult"/>.
    /// </summary>
    public class Result : BaseViewModel, IResult
    {
        #region Properties

        /// <summary>
        /// Amount after the entry fee is substracted.
        /// </summary>
        public decimal AmountAfterEntryFee { get; set; }

        /// <summary>
        /// Required rate of return to compensate the entry fee.
        /// </summary>
        public Percentage RequiredRateOfReturnToCompensateEntryFee { get; set; }

        /// <summary>
        /// Final amount after compounding.
        /// </summary>
        public decimal CompoundedAmount { get; set; }

        /// <summary>
        /// Required rate of return to compensate all fund costs after the first year.
        /// </summary>
        public Percentage RequiredRateOfReturnToCompensateCostsAfterFirstYear { get; set; }

        /// <summary>
        /// The compounded costs of a fund over the whole period.
        /// </summary>
        public decimal CompoundedCosts { get; set; }

        /// <summary>
        /// The compounded costs of a fund over the whole period in percent.
        /// </summary>
        public Percentage CompoundedCostsInPercent { get; set; }

        /// <summary>
        /// The required rate of return needed to compensate all costs after the
        /// whole investment period.
        /// </summary>
        public Percentage RequiredRateOfReturnToCompensateCostsAfterWholePeriod { get; set; }

        /// <summary>
        /// Annual values of the fund's performance.
        /// </summary>
        public IEnumerable<IResult> AnnualPerformanceValues { get; set; }

        /// <summary>
        /// The current investment period.
        /// </summary>
        public int InvestmentPeriod { get; set; }

        #endregion Properties
    }
}
```

