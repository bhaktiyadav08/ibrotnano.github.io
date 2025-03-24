---
layout: post
title: "Testumgebung für Unittests in .NET"
date:   2021-04-22 00:00:00 +0100
category: development
tags: development test testing unittest .net
excerpt: "Unittests mit .NET und EF Core setzen ein bisschen Boilerplate Code voraus. Hier stelle ich meinen Standardcode zum Vorbereiten von InMemory-Datenbanken vor und liefere ein Snippet um diesen schnell in Visual Studio einfügen zu können."
---

# Testumgebung für Unittests in .NET {#testumgebung-für-unittests-in-dotnet}

In vielen Fällen sind Datenbanken die Grundlage einer Anwendung. Mit dem Entity Framework Core (EF Core) hat man einen modernen Objektrelationalen Mapper (ORM), der den Zugriff auf die Datenbank abstrahiert. Eine der netten Features ist, dass man diesen auch nutzen kann um Unittests zu schreiben. EF Core bietet nämlich die Möglichkeit an, eine Datenbank im Arbeitsspeicher zu faken. Es handelt sich dabei tatsächlich um einen Fake. Das heißt es stehen nicht alle Features einer realen Datenbank zur Verfügung, wie z.B. Transactions. Als Alternative kann man allerdings immer noch SQLite nutzen um Tests zu schreiben, wo zusätzliches Verhalten nötig ist.

Da Code für diese Tests immer wieder benötigt wird, habe ich eine kleine Hilfsklasse geschrieben. Mit deren Hilfe kann man sich einen Datenbankkontext im Arbeitsspeicher erstellen und in Tests nutzen.

## Der Code {#der-code}

```csharp
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.IO;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = false)]

namespace Escido.Domain.Persistence.EESM.Test
{
    /// <summary>
    /// The class provides methods to set up a test environment.
    /// </summary>
    /// <remarks>
    /// <para>Some dependencies are needed in the using statements. Install them via NuGet.</para>
    /// </remarks>
    public static class TestEnvironment
    {
        #region Fields

        /// <summary>
        /// Name of the folder used to store test data.
        /// </summary>
        public const string TEST_ENVIRONMENT_DATA_FOLDER = "Escido.Domain.Persistence.EESM.Test";

        #endregion Fields

        #region Enums

        /// <summary>
        /// Types of InMemory providers.
        /// </summary>
        public enum InMemoryProviders
        {
            /// <summary>
            /// Provider for EF Core.
            /// </summary>
            EFCore,

            /// <summary>
            /// Provider for SQLite.
            /// </summary>
            SQLite
        }

        #endregion Enums

        #region Properties

        /// <summary>
        /// Returns a <see cref="DirectoryInfo"/> of the folder used for storing test data.
        /// </summary>
        public static DirectoryInfo ApplicationCommonDataPath
        {
            get
            {
                return Directory.CreateDirectory(
                    Path.Combine(
                        Environment.GetFolderPath(
                            Environment.SpecialFolder.CommonApplicationData)
                            , TEST_ENVIRONMENT_DATA_FOLDER));
            }
        }

        #endregion Properties

        #region Methods

        /// <summary>
        /// Returns a DbContext for the DbContext Type T for testing in an in memory database.
        /// </summary>
        /// <typeparam name="T">
        /// Type of the DbContext.
        /// </typeparam>
        /// <param name="provider">
        /// The type of InMemory database provider to use. The Type is defined by the enumeration
        /// <see cref="InMemoryProviders"/>.
        /// </param>
        /// <param name="sqliteConnection">
        /// A connection for a SQLite database. It must be passed in when a SQLite database is used.
        /// </param>
        /// <returns>
        /// DbContext of an in memory test database.
        /// </returns>
        public static T CreateDbContext<T>(
            InMemoryProviders provider = InMemoryProviders.EFCore,
            SqliteConnection sqliteConnection = null)
            where T : DbContext
        {
            var options = CreateCbContextOptions<T>(provider, sqliteConnection);
            var dbContext = Activator.CreateInstance(typeof(T), options) as T;
            dbContext.Database.EnsureCreated();
            return dbContext;
        }

        /// <summary>
        /// Creates a SQLite database connection string for an InMemory database.
        /// </summary>
        /// <returns>
        /// <see cref="SqliteConnection"/> for an InMemory database.
        /// </returns>
        public static SqliteConnection CreateSqliteConnection()
        {
            var connection = new SqliteConnection("Data Source=:memory:;Foreign Keys=False;");
            connection.Open();
            return connection;
        }

        /// <summary>
        /// Return a mock of a IServiceProvider used in .NET Core application.
        /// </summary>
        public static IServiceProvider GetServiceProviderMock<T>()
        {
            var logger = Mock.Of<ILogger<T>>();

            return Mock.Of<IServiceProvider>(serviceProvider =>
                serviceProvider.GetService(typeof(ILogger<T>)) == logger);
        }

        /// <summary>
        /// Returns DbContextOptions used to configure an in memory test database DbContext.
        /// </summary>
        /// <typeparam name="T">
        /// Type of the DbContext.
        /// </typeparam>
        /// <param name="provider">
        /// The type of InMemory database provider to use. The Type is defined by the enumeration
        /// <see cref="InMemoryProviders"/>.
        /// </param>
        /// <param name="sqliteConnection">
        /// A connection for a SQLite database. It must be passed in when a SQLite database is used.
        /// </param>
        /// <returns>
        /// DbContextOptions to configure an in memory test database.
        /// </returns>
        private static DbContextOptions<T> CreateCbContextOptions<T>(
            InMemoryProviders provider,
            SqliteConnection sqliteConnection = null)
            where T : DbContext
        {
            if (sqliteConnection is null
                && provider == InMemoryProviders.SQLite)
                throw new ArgumentNullException(nameof(sqliteConnection));

            DbContextOptionsBuilder<T> builder = null;

            if (provider == InMemoryProviders.EFCore)
            {
                var serviceProvider = new ServiceCollection()
                    .AddEntityFrameworkInMemoryDatabase()
                    .BuildServiceProvider();

                builder = new DbContextOptionsBuilder<T>()
                    .UseInMemoryDatabase("InMemoryDb")
                    .UseInternalServiceProvider(serviceProvider);
            }

            if (provider == InMemoryProviders.SQLite)
            {
                var serviceProvider = new ServiceCollection()
                    .AddEntityFrameworkSqlite()
                    .BuildServiceProvider();

                builder = new DbContextOptionsBuilder<T>()
                    .UseSqlite(sqliteConnection)
                    .UseInternalServiceProvider(serviceProvider);
            }

            return builder.Options;
        }

        #endregion Methods
    }
}
```

## Die Klasse benutzen {#die-klasse-benutzen}

Es werden zwei InMemory-Datenbank-Provider unterstützt. Der von EF Core und SQLite. SQLite unterstütz mehr Features von Relationalen Datenbanken als die Fake-Implementierung von EF Core. Für Anwendungen, die SQLite nutzen, wie Mobile Apps, bietet es sich ebenfalls an, diesen Provider zu nutzen. Er ist näher an der Produktivumgebnung.

Über die Enumeration `InMemoryProviders` kann der genutzte Provider für einen Datenbankkontext in der Factorymethode genutzt werden.

```csharp
[Fact]
public void Test()
{
	using var dbContext = TestEnvironment.CreateDbContext<MyDbContext>(TestEnvironment.InMemoryProviders.EFCore);
}
```

EF Core ist der Default. Es reicht also `TestEnvironment.CreateDbContext<MyDbContext>()`.

Möchte oder braucht man SQLite als InMemory-Datenbank kann man die Methode überladen.

```csharp
[Fact]
public void Test()
{
    using var sqliteConnection = TestEnvironment.CreateSqliteConnection();
    
	using var dbContext = TestEnvironment.CreateDbContext<MyDbContext>(
        TestEnvironment.InMemoryProviders.EFCore,
        sqliteConnection
    );
}
```

Die Datenbank wird dabei durch das `using` innerhalb dieses Tests erstellt und danach disposed.

## Snippet {#snippet}

Ich nutze gerne Snippets[^1] in Visual Studio (VS). Mit einem Snippet lässt sich der Code schnell in einem Testprojekt einfügen.

Wer es nicht nutzt sollte es sich unbedingt einmal ansehen. Dort ist auch beschrieben, wie man VS konfiguriert.

Es reicht dann im Editor den Namen des Snippets einzutippen und `Tab` zu drücken. Der Code wird dann eingefügt und man kann mit `Tab` zu den Variablen springen, die man anpassen muss.

Speichert den Code in einer Datei mit der Endung *.snippet* und man kann den Code injecten.

```xml
<?xml version="1.0" encoding="utf-8"?>
<CodeSnippets xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
    <CodeSnippet Format="1.0.0">
        <Header>
            <Title>Test Environment</Title>
            <Author>Marcel Melzig</Author>
            <Description>Creates a class which helps to setup a test environment. The class offers helper methods. For example to create an in memory DbContext for database testing.</Description>
            <Shortcut>mm_test_environment</Shortcut>
        </Header>
        <Snippet>
            <Code Language="CSharp">
                <![CDATA[
                using Microsoft.Data.Sqlite;
                using Microsoft.EntityFrameworkCore;
                using Microsoft.Extensions.DependencyInjection;
                using Microsoft.Extensions.Logging;
                using Moq;
                using System;
                using System.IO;
                using Xunit;

                [assembly: CollectionBehavior(DisableTestParallelization = false)]

                namespace Escido.Domain.Persistence.EESM.Test
                {
                    /// <summary>
                    /// The class provides methods to set up a test environment.
                    /// </summary>
                    /// <remarks>
                    /// <para>Some dependencies are needed in the using statements. Install them via NuGet.</para>
                    /// </remarks>
                    public static class TestEnvironment
                    {
                        #region Fields

                        /// <summary>
                        /// Name of the folder used to store test data.
                        /// </summary>
                        public const string TEST_ENVIRONMENT_DATA_FOLDER = "Escido.Domain.Persistence.EESM.Test";

                        #endregion Fields

                        #region Enums

                        /// <summary>
                        /// Types of InMemory providers.
                        /// </summary>
                        public enum InMemoryProviders
                        {
                            /// <summary>
                            /// Provider for EF Core.
                            /// </summary>
                            EFCore,

                            /// <summary>
                            /// Provider for SQLite.
                            /// </summary>
                            SQLite
                        }

                        #endregion Enums

                        #region Properties

                        /// <summary>
                        /// Returns a <see cref="DirectoryInfo"/> of the folder used for storing test data.
                        /// </summary>
                        public static DirectoryInfo ApplicationCommonDataPath
                        {
                            get
                            {
                                return Directory.CreateDirectory(
                                    Path.Combine(
                                        Environment.GetFolderPath(
                                            Environment.SpecialFolder.CommonApplicationData)
                                            , TEST_ENVIRONMENT_DATA_FOLDER));
                            }
                        }

                        #endregion Properties

                        #region Methods

                        /// <summary>
                        /// Returns a DbContext for the DbContext Type T for testing in an in memory database.
                        /// </summary>
                        /// <typeparam name="T">
                        /// Type of the DbContext.
                        /// </typeparam>
                        /// <param name="provider">
                        /// The type of InMemory database provider to use. The Type is defined by the enumeration
                        /// <see cref="InMemoryProviders"/>.
                        /// </param>
                        /// <param name="sqliteConnection">
                        /// A connection for a SQLite database. It must be passed in when a SQLite database is used.
                        /// </param>
                        /// <returns>
                        /// DbContext of an in memory test database.
                        /// </returns>
                        public static T CreateDbContext<T>(
                            InMemoryProviders provider = InMemoryProviders.EFCore,
                            SqliteConnection sqliteConnection = null)
                            where T : DbContext
                        {
                            var options = CreateCbContextOptions<T>(provider, sqliteConnection);
                            var dbContext = Activator.CreateInstance(typeof(T), options) as T;
                            dbContext.Database.EnsureCreated();
                            return dbContext;
                        }

                        /// <summary>
                        /// Creates a SQLite database connection string for an InMemory database.
                        /// </summary>
                        /// <returns>
                        /// <see cref="SqliteConnection"/> for an InMemory database.
                        /// </returns>
                        public static SqliteConnection CreateSqliteConnection()
                        {
                            var connection = new SqliteConnection("Data Source=:memory:;Foreign Keys=False;");
                            connection.Open();
                            return connection;
                        }

                        /// <summary>
                        /// Return a mock of a IServiceProvider used in .NET Core application.
                        /// </summary>
                        public static IServiceProvider GetServiceProviderMock<T>()
                        {
                            var logger = Mock.Of<ILogger<T>>();

                            return Mock.Of<IServiceProvider>(serviceProvider =>
                                serviceProvider.GetService(typeof(ILogger<T>)) == logger);
                        }

                        /// <summary>
                        /// Returns DbContextOptions used to configure an in memory test database DbContext.
                        /// </summary>
                        /// <typeparam name="T">
                        /// Type of the DbContext.
                        /// </typeparam>
                        /// <param name="provider">
                        /// The type of InMemory database provider to use. The Type is defined by the enumeration
                        /// <see cref="InMemoryProviders"/>.
                        /// </param>
                        /// <param name="sqliteConnection">
                        /// A connection for a SQLite database. It must be passed in when a SQLite database is used.
                        /// </param>
                        /// <returns>
                        /// DbContextOptions to configure an in memory test database.
                        /// </returns>
                        private static DbContextOptions<T> CreateCbContextOptions<T>(
                            InMemoryProviders provider,
                            SqliteConnection sqliteConnection = null)
                            where T : DbContext
                        {
                            if (sqliteConnection is null
                                && provider == InMemoryProviders.SQLite)
                                throw new ArgumentNullException(nameof(sqliteConnection));

                            DbContextOptionsBuilder<T> builder = null;

                            if (provider == InMemoryProviders.EFCore)
                            {
                                var serviceProvider = new ServiceCollection()
                                    .AddEntityFrameworkInMemoryDatabase()
                                    .BuildServiceProvider();

                                builder = new DbContextOptionsBuilder<T>()
                                    .UseInMemoryDatabase("InMemoryDb")
                                    .UseInternalServiceProvider(serviceProvider);
                            }

                            if (provider == InMemoryProviders.SQLite)
                            {
                                var serviceProvider = new ServiceCollection()
                                    .AddEntityFrameworkSqlite()
                                    .BuildServiceProvider();

                                builder = new DbContextOptionsBuilder<T>()
                                    .UseSqlite(sqliteConnection)
                                    .UseInternalServiceProvider(serviceProvider);
                            }

                            return builder.Options;
                        }

                        #endregion Methods
                    }
                }
                ]]>
            </Code>
            <Declarations>
                <Literal>
                    <ID>Namespace</ID>
                    <ToolTip>Choose a namespace for the class.</ToolTip>
                    <Default>TestEnvironment</Default>
                </Literal>
            </Declarations>
        </Snippet>
    </CodeSnippet>
</CodeSnippets>
```

[^1]: **Microsoft:** Code snippets, https://docs.microsoft.com/en-us/visualstudio/ide/code-snippets?view=vs-2019, 12.04.2021