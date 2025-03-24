---
layout: post
title: "Jottacloud CLI-Docker-Image als Docker Service"
date:   2018-05-28 12:00:00 +0100
category: operations
tags: operations jottacloud docker image service
excerpt: "Mit Jottacloud gibt es einen günstigen Cloudspeicheranbieter mit viel Speicher auf dem Markt. Es gibt sogar einen Linux-Client vom Anbieter. Den Client in einem Docker-Image laufen zu lassen bietet sich also an."
typora-copy-images-to: ..\assets\posts\2018-05-28-Jottacloud-cli-docker-image-als-docker-service\images
typora-root-url: ..\
---
# Jottacloud CLI-Docker-Image als Docker Service

Bei Jottacloud handelt es sich um einen Cloudspeicheranbieter aus Norwegen. Er wirbt mit seinen hohen Datenschutzbestimmungen und unbegrenztem Speicher im Abo. Er bietet unter anderem einen Linux-Daemon samt CLI an um den Service nutzten zu können. Damit sticht er in vielen Punkten unter der Konkurrenz hervor.

Ich plane Daten von einem Linux-Host automatisiert in der Cloud zu speichern. Um den Dienst besser nutzen zu können habe ich ein Docker Image gebaut. Die Anleitung dazu ist unter <http://3h-co.de/wordpress/dockerimages-erstellen/> zu finden.

Darauf aufbauend möchte ich zeigen wie man das Image als Service nutzt. Ich nutze dabei Docker Compose als Werkzeug.

## Was ist Docker Compose?

Docker Compose ist ein Core-Tool von Docker. Es steht eine ausführliche Dokumentation unter <https://docs.docker.com/compose/> zur Verfügung. Mit Docker Compose können Anwendungen definiert werden, die aus mehreren Containern bestehen. Z.B. kann die Datenbank in einem Container laufen, das Web-Frontend in einem anderen. Die Jottacloud-CLI kann, in einem dritten Container, die anfallenden Daten zur Sicherung in die Cloud sichern.

In einer YAML-Datei wird definiert wie:

1. Die Images von Docker gebaut oder bezogen werden sollen
2. Wie und wie viele Container Docker aus diesen Images erstellt
3. Wie die Container konfiguriert sein sollen
4. Wo ihre persistenten Daten auf dem Host in Volumes liegen
5. Zu welchen Netzwerken die Container Zugang haben sollen

Mit einem einzigen Befehl kann Docker Compose solch ein komplexes Szenario erstellen und ausführen.

## Docker-Compose installieren

Docker-Compose muss über **curl** installiert werden. Die Versionsnummer in den Befehlen sollte dabei die aktuellste, stabile Version sein.

```bash
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

sudo curl -L https://raw.githubusercontent.com/docker/compose/1.18.0/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose
```

Es muss eine neues Terminal geöffnet werden. `docker-compose --version` sollte nun die Versionsnummer von Docker Compose anzeigen.

Mehr Informationen zu Docker Compose sind unter https://docs.docker.com/compose/install/#install-compose zu finden. Mehr Informationen zur Bashintegration unter https://docs.docker.com/compose/completion/ .

## docker-compose.yml schreiben

Die Konfiguration von Docker Compose wird, wie bereits gesagt, in einer YAML-Datei beschrieben. Die Datei sollte standardmäßig *docker-compose.yml* heißen. Docker Compose nutzt diese Datei automatisch, sofern sie im aktuellen Verzeichnis liegt.

Die *docker-compose.yml* zum einrichten der **Jottacloud CLI** sieht so aus:

```yaml
version: "3.5"

services:
  jotta-cli:
    build:
      context: ./jotta-cli
      args:
        - ubuntu_version=${JOTTA_CLI_IMAGE_UBUNUT_VERSION}
        - jotta_cli_version=${JOTTA_CLI_IMAGE_JOTTA_CLI_VERSION}
    image: jotta-cli:${JOTTA_CLI_IMAGE_JOTTA_CLI_VERSION}
    container_name: jotta-cli
    volumes:
      - type: volume
        source: jotta-cli
        target: /root/.jottad
        volume:
          nocopy: true
      - type: bind
        source: /
        target: /sync
        read_only: true
    restart: always

volumes:
  jotta-cli:
    name: jotta-cli
```

### Version

Die Versionsnummer am Anfang beschreibt die Version des Schemas der *docker-compose.yml*. Einige Features sind nur ab bestimmten Docker Compose-Versionen verfügbar. Anhand der Versionsnummer weiß Docker Compose ob es die Anwendung bauen kann.

### Services

Unter `services:` können alle Anwendungen aufgelistet werden, die ausgeführt werden sollen. Es gibt hier viele Konfigurationsmöglichkeiten. Die der **Jottacloud CLI** ist recht speziell.

`build:` besagt, dass kein Image gezogen werden soll. Docker Compose baut das Image beim Einrichten der Anwendung. Das Dockerfile zum Bau des Images ist relativ zur *docker-compose.yml* im *./jotta-cli/dockerfile*. Wer den Artikel unter <http://3h-co.de/wordpress/dockerimages-erstellen/> gelesen hat, weiß dass die Versionsnummern des Ubuntu-Images und der Jottacloud CLI über `ARG`s gesetzt werden können.

In diesem Fall wird es noch spezieller. Die `ARG`s werden durch Umgebungsvariablen der Shell **JOTTA_CLI_IMAGE_UBUNUT_VERSION** und **JOTTA_CLI_IMAGE_JOTTA_CLI_VERSION** gesetzt. Setzt man diese nicht, werden Defaults aus einer Datei *.env* im selben Verzeichnis der *docker-compose.yml* genutzt.

Der Inhalt der Datei *.env* sieht also folgendermaßen aus:

```ini
JOTTA_CLI_IMAGE_UBUNUT_VERSION=16.04
JOTTA_CLI_IMAGE_JOTTA_CLI_VERSION=0.3.4269
```

`image:` legt im Zusammenhang mit `build:` den Namen und Tag des erzeugten Images fest.

`container_name` legt den Namen des erzeugten Containers fix auf **jotta-cli**. Docker Compose nutzt diesen Namen und vergibt keinen eigenen. Deshalb kann Docker Compose nur einen einzigen Container erzeugen. In diesem Fall ist das gewollt.

`volumes:` mountet das Volume **jotta-cli** in den Container oder legt dieses an, sofern es nicht vorhanden ist. Es wird im Container in */root/.jottad* gemountet. Dort ist die Konfiguration der Jottacloud CLI gespeichert. `nocopy: true` stellt sicher, dass keine Dateien vom Container zur Buildzeit in das Volume kopiert werden. Persistente Daten bleiben so bei einem Update des Containers erhalten.

Ein zweiter Mount mountet den gesamten Verzeichnisbaum des Hosts im Container unter */sync*. Da es als `readonly` gemountet ist können Daten nur gelesen, aber nicht geschrieben werden.

`restart: always` stellt sicher, dass der Container immer läuft.

### Volumes

Hier ist das Volume beschrieben. Hier wird in diesem Fall nur der Name fix auf **jotta-cli** festgelegt.

## Docker Compose benutzen

Jetzt ist der größte Teil der Arbeit getan. Man muss nun in das Verzeichnis wechseln, in dem *docker-compose.yml* liegt. 

### Service bauen und ausführen

Hier kann man seine Anwendung bauen und ausführen lassen.

```bash
docker-compose up -d
```

Docker Compose richtet alles ein, startet die Anwendung und führt sie im Hintergrund aus. Den Status der Anwendung kann man sich anzeigen lassen.

```bash
docker-compose ps
```
### Service stoppen und entfernen

Will man die Anwendung beenden und entfernen, weil man z.B. eine aktuellere Version laufen lassen will, geht man folgendermaßen vor:

```bash
docker-compose stop
docker-compose rm
```

Das Volume mit den persistenten Daten bleibt erhalten. So nutzt sie eine aktualisierte Version weiter.