---
layout: post
title: "Docker build image für .NET Core-Apps"
date:   2019-12-20 17:02:00 +0100
category: operations
tags: docker build image dotnet core
excerpt: "Zum Erstellen von .NET-Andwendungen in enem GitLab Runner wird ein image benötigt, dass dies durchführen kann. Hier wird beschrieben wie ein eigenes Build-Image den eigenen Bedürfnissen angepasst werden kann."
typora-root-url: ..\
---

# Docker build image für .NET Core-Apps

Microsoft hat bereits ein eigenes Image zum Erstellen von .NET Core-Apps.

https://hub.docker.com/_/microsoft-dotnet-core-sdk/

Warum also ein eigenes erstellen?

Ich hatte das Problem, dass ich aus GitLab heraus .NET Core-Anwendungen kompilieren wollte.  Gehostet war eine eigene GitLab-Instanz auf einem Ubuntu-Server mit eigenem GitLab-Runner und Sonatype-Nexus als Nuget-Repository.

In diesem Repository befanden sich eigene Nugets, die in einem Build wiederhergestellt werden mussten. Der GitLab-Runner war jedoch nicht so einfach zu konfigurieren, da Nuget nicht Bestandteil des Images ist und `dotnet` nicht die volle API von Nuget unterstützt.

Ich habe mich erst entschieden die Buildumgebung des GitLab-Runners konfigurieren zu lassen. Das ist möglich. Man installiert mit `apt` die nötigen Werkzeuge.

Eines dieser Werkzeuge ist allerdings Mono, da Nuget unter Linux auf Mono läuft. 

Mono musste bei der Installation Teile kompilieren, was ca. 15 Minuten dauerte. So viel Wartezeit wollte ich vermeiden für eine, bei jedem Build wiederkehrende, Aufgabe.

Ich entschied mich auf der Basis von Microsofts Image ein eigenes, angepasstes Image zu erstellen.

https://github.com/iBrotNano/build-dotnet-core-docker-image ist das Repository der Sourcen.

## Das Dockerfile

Das Image kann man sich selbst mit folgendem _dockerfile_ erstellen.

```dockerfile
ARG base_image_version=latest
FROM mcr.microsoft.com/dotnet/core/sdk:${base_image_version}

LABEL maintainer="Marcel Melzig <marcel@3h-co.de>"
LABEL org.label-schema.schema-version="1.0.0-rc.1"
LABEL org.label-schema.name="build-dotnet-core"
LABEL org.label-schema.description="This image contains all needed to run .NET Core or .NET Standard builds through a GitLab Runner. Other CI tools should work as well."
LABEL org.label-schema.usage="/usr/doc/app-usage.md"
LABEL org.label-schema.version="${base_image_version}"

COPY app-usage.md /usr/doc/app-usage.md
COPY nuget /usr/bin/nuget

RUN apt clean \
	&& apt update -y \
	&& apt upgrade -y \
	&& apt -y install apt-transport-https dirmngr gnupg ca-certificates \
	&& apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF \
	&& echo "deb https://download.mono-project.com/repo/debian stable-buster main" | tee /etc/apt/sources.list.d/mono-official-stable.list \
	&& apt update -y \
	&& apt install mono-complete -y \
	&& apt autoremove -y \
	&& apt clean \
	&& rm -rf /var/lib/lists/* \
    && curl -o /usr/local/bin/nuget.exe https://dist.nuget.org/win-x86-commandline/latest/nuget.exe \
	&& chmod +x /usr/bin/nuget
```

Das `ARG` **base_image_version** ist standardmäßig **latest**. Man bekommt also mit jedem Build die aktuellste Version von Microsofts Image.

Ein kleiner Knackpunkt ist hier allerdings das Mono-Repository. Es basiert momentan auf Debian 10. Ändert Microsoft sein Basisimage von Debian 10 auf ein anderes muss auch dieser Link, `deb https://download.mono-project.com/repo/debian stable-buster main`, angepasst werden. Die Welt ist nicht perfekt.

## Nutzung des Images

Das Image enthält eine Datei unter __/usr/doc/app-usage.md_.

Dort ist nochmal beschrieben wie man das Image benutzt.

### Das Image erstellen

Der Build kann wie jeder andere gebaut werden. Die offizielle Dokumentation von Docker sollte hier die beste Informationsquelle sein, wenn etwas schief gegangen ist. Sie finden sie unter https://docs.docker.com/engine/reference/commandline/build/.

Im Grunde genommen muss man nur diese Schritte ausführen:

1. Navigiere in das Projektverzeichnis: `cd \path\to\project\`

2. Erstelle das Image: `docker build --rm -t build-dotnet-core .`. Ein Image wird mit dem Namen **build-dotnet-core** und dem Tag **latest** erstellt. Du kannst die Ausgabe des Terminals überprüfen, um zu sehen, ob das Bauen erfolgreich war. 

3. Das _dockerfile_ enthält ein `ARG`, das die Version des Basis-Images definiert. Du kannst es ändern, indem du das Argument an `docker build` übergeben.

   ```bash
   docker build -t build-dotnet-core:3.1.100 --build-arg base_image_version=3.1.100 .
   ```

   Wenn du kein Argument übergibst, wird die Vorgabe im _dockerfile_ verwendet.

4. Prüfe, ob das Image erstellt wurde: `docker image ls`. Wenn es ein Image mit dem Namen und dem Tag `build-dotnet-core:latest` gibt, ist alles in Ordnung.

5. Führe  einen Befehl aus, um zu sehen, ob der Build funktioniert: `docker run build-dotnet-core dotnet --version`

6. Die Version des Builds sollte mit der Version von `dotnet` getaggt werden, um die Möglichkeit zu haben, ältere Builds später zu verwenden. In meinem Fall war es die Version 3.1.100: `docker build -rm -t build-dotnet-core:3.1.100 .`.

### Das Image benutzen

Du hast schon gesehen wie man Befehle mit `dotnet` ausführt. Hier sind aber die wichtigsten Befehle des Images.

Um Befehlte mit `dotnet` auszuführen:

```bash
docker run -it --rm build-dotnet-core dotnet --version
```

Für `nuget`

```bash
docker run -it --rm build-dotnet-core mono /usr/local/bin/nuget.exe 
```

Wie du hier sehen kannst wird die Mono-Version von Nuget verwendet. Sie hat einige Limitierungen, welche du unter https://docs.microsoft.com/en-us/nuget/install-nuget-client-tools#feature-availability nachlesen kannst.

Ich habe ein Shellskript hinzugefügt welches den Monoaufruf kapselt. So ist es einfacher Nuget aufzurufen:

```bash
docker run -it --rm build-dotnet-core nuget
```

## Das Image lokal aktualisieren

Um ein Image zu aktualisieren muss man das Alte entfernen und ein neues hinzufügen:

```bash
docker image rm build-dotnet-core:latest
docker build --rm -t build-dotnet-core .
```

## Das Image in eine Registry pushen

Um ein Image in eine Registry zu pushen muss man sich erst an der Registry einloggen.

```bash
docker login registry.host.tld
```

Pullen und Pushen von Images ist unter https://docs.docker.com/engine/reference/commandline/pull/ und https://docs.docker.com/engine/reference/commandline/push/ beschrieben.

Als erstes musst du das Image taggeb um die Version zu markieren und auf die Registry zu verweisen. Danach kann das Image zur Registry gepusht werden.

```bash
docker tag build-dotnet-core:latest registry.host.tld/build-dotnet-core:latest
docker push registry.host.tld/build-dotnet-core:latest
```

Diese Schritte müssen für jede Version durchgeführt werden.

Um Images aus der Registry zu ziehen gebe diesen Befehl ein:

```bash
docker pull registry.host.tld/build-dotnet-core:tag
```