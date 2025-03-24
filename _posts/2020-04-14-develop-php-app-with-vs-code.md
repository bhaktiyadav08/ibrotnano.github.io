---
layout: post
title: "PHP mit Visual Studio Code entwickeln"
date:   2020-04-14 14:40:00 +0100
category: development
tags: php vscode code development
excerpt: "Kann man mit Visual Studio Code auch PHP-Anwendungen entwickeln? Ich war erstaunt, dass es sogar ziemlich gut funktioniert. Lest hier was meine Erfahrungen wahren."
typora-root-url: ..\
---

# PHP mit Visual Studio Code entwickeln

## Warum PHP? Warum mit Visual Studio Code?

Ich hatte ein altes Projekt an dem ich schon länger nicht mehr gearbeitet habe auf der Platte liegen. Ein Theme für Wordpress. Wordpress und dessen Themes sind in PHP geschrieben. Damals habe ich das Theme mit PHPStorm entwickelt, einer IDE von JetBrains. Wenn man umfangreichere Projekte in PHP schreiben muss ist PHPStorm sicherlich die richtige Wahl. Es kostet allerdings jedes Jahr Geld, wenn man die neusten Updates haben will. Um so ein überschaubares Projekt wie ein Theme zu entwickeln braucht man solch eine umfangreiche IDE nicht wirklich. Ich brauchte also eine Alternative.

Da ich Visual Studio Code als Editor für so ziemlich Alles benutze, wollte ich mal ausprobieren wie die PHP-Entwicklung damit so funktioniert. Hier sind meine Erfahrungen.

## Git

Mein Projekt war ein Git-Repository. Git wird natürlich in Visual Studio Code unterstützt. Man braucht nichts weiter installieren. Sobald man ein Verzeichnis mit VS Code öffnet, dass ein Git-Repository funktioniert alles reibungslos.

## PHP

Für PHP müssen ein paar Dinge eingestellt werden. Zuerst einmal muss man PHP installieren. Es reicht dafür PHP herunterzuladen und in ein Verzeichnis auf dem Computer zu entpacken. PHP kann von https://www.php.net/downloads heruntergeladen werden.

Das Verzeichnis muss als Umgebungsvariable in `PATH` hinzugefügt werden. Von nun an kann man `php` aus der Kommandozeile aufrufen. Einen lokalen Webserver zum Ausführen von PHP-Seiten benötigt man nicht.

Öffnet man eine PHP-Datei in VS Code zeigt VS Code eine Notiz an, dass Einstellungen gesetzt werden müssen. Wird keine solche Nachricht angezeigt oder man hat sie aus Versehen weggeklickt, wie ich, kann man **CTRL + ,** drücken. Es öffnet sich ein Fenster in dem man nach Einstellungen suchen kann. Sucht man nach **PHP validate: executable path** kann man zu der entsprechenden Einstellung navigieren.

```json
"php.validate.executablePath": "C:/Tools/php/php.exe",
```

Dort trägt man den Pfad zur _php.exe_ ein. VS Code hört nun auf zu meckern.

## Composer

Composer ist ein Tool zum Installieren von Abhängigkeiten in PHP. Auf der Seite von Composer findet man einen Installer.

https://getcomposer.org/download/

Im Projekt kann man eine Datei _composer.json_ anlegen.

```json
{
  "name": "mmelzig/theme",
  "description": "A Wordpress theme.",
  "minimum-stability": "stable",
  "license": "MIT",
  "authors": [
    {
      "name": "Marcel Melzig",
      "email": "marcel@3h-co.de"
    }
  ],
  "require-dev": {
    "phing/phing": "2.16.3",
    "phpunit/phpunit": "9.1.1"
  },
  "require": {
    "twbs/bootstrap": "v3.3.6",
    "components/jquery": "2.2.1"
  }
}
```

Anhand dieser Datei weiß Composer welche Abhängigkeiten es herunterladen und in einem lokalen Verzeichnis innerhalb des Projekts ablegen muss. Das Verzeichnis heißt _vendor_. Da es von Composer beim Build erstellt werden kann brauchen und sollten wir die Abhängigkeiten nicht im Repository verwalten. _vendor_ muss also der _.gitignore_ hinzugefügt werden.

Im Beispiel sind einige Methainformationen enthalten, die nur benötigt werden wenn man mit Composer ein eigenes Packet erstellt. Interessant sich die Einträge unter `require-dev` und `require`. `require-dev` sind Abhängigkeiten, die zum Entwickeln der Anwendung benötigt werden. Hier **Phing**, ein Buildwerkzeug und **PHPUnit** zum Ausführen von Unittests.

Die Abhängigkeiten unter `require` sind solche, die vom Projekt verwendet werden. Bootstrap und Jquery z.B.

In VS Code kann man mit `CTRL + SHIFT + ö` ein Terminal direkt im Editor öffnen. Tippt man dort dann `composer install` ein lädt Composer die Komponenten herunter.

## Node.js bzw. npm

Nicht alle Komponenten können per Composer heruntergeladen werden. Vor allem Javascript-Frameworks gibt es nicht alle. Einige Tools benötigen auch Node.js um ausgeführt zu werden. Also muss man auch Node.js installieren.

Unter https://nodejs.org/en/download/ findet man einen Installer.

So wie man eine _compsoser.json_ für Composer anlegt, so kann man auch eine _package.json_ für npm anlegen.

```json
{
  "name": "theme",
  "version": "4.7.1",
  "devDependencies": {
    "gulp": "^4.0.2",
    "gulp-clean-css": "^4.3.0",
    "gulp-rename": "^2.0.0",
    "less": "^3.11.1",
    "gulp-less": "^4.0.1",
    "gulp-minify": "^3.1.0",
    "gulp-sass": "^4.0.2"
  },
  "dependencies": {
    "readmore-js": "^2.2.1"
  }
}

```

Hier sieht man wieder die Abhängigkeiten für die Entwicklung und die für das Projekt.

Mit `npm install` werden die Abhängigkeiten heruntergeladen und im Unterverzeichnis _node_modules_ abgelegt.

## gulp

Eines der Tools, die ich verwendet habe war gulp. gulp benötigt Node.js um ausgeführt zu werden. gulp ist ein Buildwerkzeug in Javascript geschrieben. Ich benutze dessen Werkzeuge um CSS und Javascripte zu komprimieren. Dazu legt man im Projekt ein _gulpfile.js_ an.

```javascript
const gulp = require('gulp');
const less = require('gulp-less');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

gulp.task('less', function(cb) {
  gulp
    .src('LESS/*.less')
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(
      gulp.dest('css/')
    );
  cb();
});

gulp.task('compress', function(cb) {
  gulp
    .src('lib/*.js')
    .pipe(minify({
      ext: {
          min: '.min.js'
      },
      noSource: true,
      ignoreFiles: ['*.min.js']
    }))
    .pipe(
      gulp.dest('js/')
    );
  cb();
});

gulp.task(
  'default',
  gulp.series('less', 'compress', function(cb) {
    gulp.watch('LESS/*.less', gulp.series('less'));
    gulp.watch('lib/*.js', gulp.series('compress'));
    cb();
  })
);
```

Hier werden zwei Aufgaben definiert. LESS-Dateien werden in komprimierte CSS-Dateien kompiliert und Javascripte werden ebenfalls komprimiert.

Der Task **default** führt diese Aufgaben einmal aus und überwacht zwei Projektverzeichnisse mit CSS- und Javascript-Dateien auf Änderungen und aktualisiert die komprimierten Dateien automatisch.

Man kann diesen Task direkt mit VS Code ausführen lassen. Dazu muss man gulp allerdings auch global auf dem System für alle Benutzer installieren lassen. `npm install -g gulp gulp-less gulp-minify gulp-clean-css gulp-rename`.

Über _Terminal --> Run Tasks_ kann man den Task **gulp: default** starten. Er läuft im Terminal weiter. Mit `CTRL + SHIFT + 5`  kann man das Terminal splitten. So hat man zwei Terminals im Fenster nebeneinander und kann im anderen weitere Aufgaben ausführen.

## Phing

Die einzige weitere Aufgabe, die ich hier noch ausgeführt habe ist phing. phing ist ein weiteres Buildwerkzeug, dass über eine Datei _build.xml_ konfiguriert wird.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-model xlink:href="./vendor/phing/phing/etc/phing-grammar.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0" ?>
<project name="Theme" 
    description="The buildfile for a Wordpress theme."
    default="distribute">
    <!-- Define the build properties. It is important to know that all values are just default values.
    Every value can be overriden in the build.properties file. A proper build.properties file may look
    like this:

    version=1.0.2-SNAPSHOT
    srcdir=src
    composerdir=./vendor
    phpunitConfigurationFile=phpunit.xml.dist

     -->
    <property file="./build.properties"/>
    <property name="version" value="1.0-SNAPSHOT" override="false"/>
    <property name="package" value="${phing.project.name}" override="false"/>
    <property name="targetdir" value="./target" override="false"/>
    <property name="builddir" value="${targetdir}/build" override="false"/>
    <property name="srcdir" value="" override="false"/>
    <property name="reportdir" value="${targetdir}/reports" override="false"/>
    <property name="coveragedir" value="${reportdir}/coverage" override="false"/>
    <property name="composerdir" value="vendor" override="false"/>
    <property name="nodedir" value="node_modules" override="false"/>
    <!-- Define all source files. All sources are located in the src folder. -->
    <fileset dir="." id="sourcefiles">
        <include name="404.php"/>
        <include name="footer.php"/>
        <include name="functions.php"/>
        <include name="header.php"/>
        <include name="index.php"/>
        <include name="page.php"/>
        <include name="screenshot.png"/>
        <include name="search.php"/>
        <include name="single.php"/>
        <include name="style.css"/>
        <include name="wp_bootstrap_navwalker.php"/>
        <include name="fonts/**"/>
        <include name="img/**"/>
    </fileset>
    <!-- Set the version number in the source files. The version number is defines in build.properties. -->
    <target name="setversion">
        <reflexive>
            <fileset dir=".">
                <include name="style.css"/>
                <include name="Doxyfile"/>
                <include name="package.json"/>
            </fileset>
            <filterchain>
                <replaceregexp>
                    <regexp pattern="Version: [\d\w\.\-]*" replace="Version: ${version}"/>
                    <regexp pattern="PROJECT_NUMBER         = [\d\w\.\-]*"
                            replace="PROJECT_NUMBER         = ${version}"/>
                    <regexp pattern='"version": "[\d\w\.\-]*"' replace='"version": "${version}"'/>
                </replaceregexp>
            </filterchain>
        </reflexive>
    </target>
    <target name="setdottool" depends="setversion">
        <reflexive>
            <fileset dir=".">
                <include name="Doxyfile"/>
            </fileset>
            <filterchain>
                <replaceregexp>
                    <regexp pattern="DOT_PATH               = [\d\w\.\-\\\:\ \(\)]*"
                            replace="DOT_PATH               = ${dottool}"/>
                </replaceregexp>
            </filterchain>
        </reflexive>
    </target>
    <!-- Prepares the prerequities for the build. -->
    <target name="prepare" depends="setdottool">
        <echo msg="Cleanup directory target..."/>
        <delete dir="${targetdir}"/>
        <echo msg="Creating directories..."/>
        <mkdir dir="${targetdir}"/>
        <mkdir dir="${builddir}"/>
        <mkdir dir="${builddir}/${package}"/>
        <mkdir dir="${reportdir}"/>
        <mkdir dir="${coveragedir}"/>
    </target>
    <!-- The build process. The build is just a copy process. Don't forget to include dependencies downloaded
    by composer into the buildfolder to include them into the deployment package also.. -->
    <target name="build" depends="prepare">
        <echo msg="Copying files..."/>
        <copy todir="${builddir}/${package}">
            <fileset refid="sourcefiles"/>
        </copy>
        <copy file="css/style.min.css" tofile="${builddir}/${package}/css/style.min.css"/>
        <copy file="${composerdir}/twbs/bootstrap/dist/css/bootstrap.min.css"
              tofile="${builddir}/${package}/css/bootstrap.min.css"/>
        <copy file="${composerdir}/twbs/bootstrap/dist/js/bootstrap.min.js"
              tofile="${builddir}/${package}/js/bootstrap.min.js"/>
        <copy file="${composerdir}/twbs/bootstrap/dist/fonts/glyphicons-halflings-regular.eot"
              tofile="${builddir}/${package}/fonts/glyphicons-halflings-regular.eot"/>
        <copy file="${composerdir}/twbs/bootstrap/dist/fonts/glyphicons-halflings-regular.svg"
              tofile="${builddir}/${package}/fonts/glyphicons-halflings-regular.svg"/>
        <copy file="${composerdir}/twbs/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf"
              tofile="${builddir}/${package}/fonts/glyphicons-halflings-regular.ttf"/>
        <copy file="${composerdir}/twbs/bootstrap/dist/fonts/glyphicons-halflings-regular.woff"
              tofile="${builddir}/${package}/fonts/glyphicons-halflings-regular.woff"/>
        <copy file="${composerdir}/twbs/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2"
              tofile="${builddir}/${package}/fonts/glyphicons-halflings-regular.woff2"/>
        <copy file="${composerdir}/components/jquery/jquery.min.js" tofile="${builddir}/${package}/js/jquery.min.js"/>
        <copy file="js/adminbar-fix.min.js" tofile="${builddir}/${package}/js/adminbar-fix.min.js"/>
        <copy file="js/autocallapsing-menu.min.js" tofile="${builddir}/${package}/js/autocallapsing-menu.min.js"/>
        <copy file="node_modules/readmore-js/readmore.min.js" tofile="${builddir}/${package}/js/readmore.min.js"/>
        <copy file="js/flowtype.min.js" tofile="${builddir}/${package}/js/flowtype.min.js"/>
        <copy file="js/Vague.min.js" tofile="${builddir}/${package}/js/Vague.min.js"/>
        <fileset dir="${builddir}" id="buildfiles">
            <include name="**"/>
        </fileset>
    </target>
    <!-- Run all tests and create a code coverage report. -->
    <target name="tests" depends="build">
        <exec command="phpunit --bootstrap --configuration tests/phpunit.xml.dist" />
        <!--<coverage-setup database="${coveragedir}/coverage.db">-->
        <!--<fileset refid="allfiles"/>-->
        <!--</coverage-setup>-->
        <!--<phpunit codecoverage="false" 
            haltonfailure="true"
            printsummary="true">
            <batchtest>
                <fileset dir="tests">
                    <include name="**/*Test.php"/>
                </fileset>
            </batchtest>
        </phpunit>-->
        <!--<coverage-report outfile="${reportdir}/coverage.xml">-->
        <!--<report toDir="${coveragedir}" styleDir="${composerdir}/phing/phing/etc"/>-->
        <!--</coverage-report>-->
    </target>
    <!-- The process of distribution. It is used as the default process. It depends on all previous processes.
    So also a documentation will be generated and all tests with a codecoverage report will be processed. -->
    <target name="distribute" depends="tests">
        <echo msg="Creating archive..."/>
        <zip destfile="${targetdir}/${package}-${version}.zip">
            <fileset refid="buildfiles"/>
        </zip>
        <echo msg="Zip ${package}.zip created in the folder ${targetdir}."/>
    </target>
</project>
```

phing ist ein umfangreiches Werkzeug. Hier wird ein Buildordner angelegt, alle erforderlichen Dateien der Anwendung werden in diesen Ordner kopiert, Tests werden ausgeführt, Docs können erstellt werden und am Ende wird alles in eine Zip archiviert.

Ich mache das eigentlich nicht gerne aber schaut bitte in den Docs von phing nach, wenn ihr wissen wollt wie das alles funktioniert.

Mit `php ./vendor/phing/phing/bin/phing` kann man den Build im Terminal ausführen.

https://www.phing.info/

Das Beispiel ist eine Konfiguration die einige Schritte enthält und vielleicht eine nützliche Vorlage sein kann.

Ich habe Doxygen zum Erstellen der Dokumentation benutzt. Das würde ich heute nicht mehr machen, da phing nativ direkt zwei Alternativen unterstützt.

## GitLab Runner

Ich benutze für meine kleinen Projekte GitLab. Auch wenn man mit phing lokal einen Build durchführen kann so will ich euch die Konfiguration für GitLab nicht vorenthalten.

GitLab könnte alles was phing auch kann. Um den Build nicht doppelt zu konfigurieren nutze ich allerdings phing auch im GitLab Runner.

Die Konfiguration des GitLab Runners wird direkt in einer Datei im Projekt durchgeführt. _gitlab-ci.yml_.

```yaml
variables:
    CURRENT_VERSION: "1.1.0"
    VERSION_LOGIC: '(if [ "$${CI_COMMIT_TAG}" == "" ]; then echo "$$CURRENT_VERSION.$$CI_PIPELINE_IID"; else echo "$${CI_COMMIT_TAG}"; fi);'
      
stages:
  - version
  - prepare-css-and-js
  - build

version:
  stage: version
  script:
    - VERSION=$(eval $VERSION_LOGIC)
    - echo "The current version is set to ${VERSION}."
    - sed -i -e "s/4.7.1.1/$VERSION/g" CHANGELOG.md
    - sed -i -e "s/4.7.1.1/$VERSION/g" README.md
    - sed -i -e "s/4.7.1.1/$VERSION/g" build.properties
    - sed -i -e "s/4.7.1.1/$VERSION/g" Doxyfile
    - sed -i -e "s/4.7.1/$CURRENT_VERSION/g" package.json
    - sed -i -e "s/4.7.1.1/$VERSION/g" style.css
  artifacts:
    paths:
      - CHANGELOG.md
      - README.md
      - build.properties
      - Doxyfile
      - package.json
      - style.css
    expire_in: 1 day

prepare-css-and-js:
  stage: prepare-css-and-js
  image: node:latest
  script:
    - npm install
    - npm install node-sass less
    - npm install gulp
    - npm install gulp-sass gulp-less gulp-minify gulp-clean-css gulp-rename
    - npx gulp less
    - npx gulp compress
  dependencies:
    - version
  artifacts:
    paths:
      - css/
      - js/
      - node_modules/
    expire_in: 1 day

build:
  stage: build
  image: composer:latest
  script:
    - composer install
    - php ./vendor/phing/phing/bin/phing
  dependencies:
    - version
    - prepare-css-and-js
  artifacts:
    paths:
      - target/
      - CHANGELOG.md
      - README.md
    expire_in: 1 day
```

`CURRENT_VERSION` ist die Versionsnummer des Builds. Ich setze die Versionsnummer ausschließlich in dieser Datei. In allen Dateien des Projektes steht bei mir als Versionsnummer immer nur 4711, Echt Kölnisch Wasser. Die Pipeline nimmt entweder die hier festgelegte Versionsnummer und hängt eine von GitLab generierte, eindeutige ID als Buildnummer an oder übernimmt die in einem Commit-Tag festgelegt Versionsnummer. Über diese Tags werden in GitLab die Releases gekennzeichnet.

In der Stage `version` werden alle 4711er durch die Versionsnummer ersetzt. `prepare-css-and-js` führt die gulp-Tasks aus und `build` nutzt phing zum Erstellen des Release-Pakets.

Testsdaten werden momentan noch nicht in GitLab angezeigt. Aber was hier zu sehen ist funktioniert schon mal ganz gut.