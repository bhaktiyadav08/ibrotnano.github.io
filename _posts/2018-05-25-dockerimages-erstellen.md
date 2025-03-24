---
layout: post
title: "Dockerimages erstellen"
date:   2018-05-25 12:00:00 +0100
category: operations
tags: operations docker image
excerpt: "Mit Docker können Anwendungen komfortabel verteilt werden. Hier wird anhand eines Beispiels gezeigt, wie man ein Dockerimage erstellen kann."
typora-copy-images-to: ..\assets\posts\2018-05-25-dockerimages-erstellen\images
typora-root-url: ..\
---

# Dockerimages erstellen

## Was ist Docker?

Neben der klassischen virtuellen Maschine hat sich seit einigen Jahren ein neuer Spieler etabliert. Docker führt Anwendungen statt in einer virtuellen Maschine in einem Container aus. Statt ein komplettes System zu virtualisieren, samt Kernel und Hardwareemulation, teilt sich Docker solche Ressourcen und Komponenten mit dem Host. Durch einen eigenen Netwerk-Stack und ein eigenes Dateisystem können Prozesse allerdings isoliert voneinander ausgeführt werden.

Daraus ergeben sich die Vorteile einer virtuellen Maschine mit minimalem Overhead beim Resourcenverbrauch. Darüber hinaus werden zwei weitere Probleme angegangen.

1. Sicherheit
2. Bereitstellung von Software

### Sicherheit

Da die Anwendungen in einem isolierten Container laufen befinden sie sich in einer Sandbox. Der Zugriff auf den Host ist nur über die Ports und Dateisystem-Mounts möglich, die vom Administrator definiert werden.

### Bereitstellung von Software

Eine Anwendung wird in Form eines Images ausgeliefert. Dieses Image enthält alles was zur Ausführung der Anwendung benötigt wird. Dies umfasst die Betriebssystemkomponenten, die Dateien der Anwendung selbst, Konfigurationsdateien oder auch ein Webserver wie Nginx samt PHP. Solch ein Image ist fertig eingerichtet und vorinstalliert. Es entspräche einem komplett eingerichtetem VM-Template.

## Dockerimage erstellen

Für sehr viele Anwendungen gibt es bereits Images. Sie können über den Docker Hub[^docker-hub] bezogen werden. Kommerzielle Software kann im Docker Store[^docker-store] gekauft werden. Die Images werden direkt mit Docker heruntergeladen. Wo es bereits fertige Images von den Herstellern gibt sollten diese genutzt werden. Diese sind mit Blick auf Best Practices und Sicherheit erstellt und konfiguriert.

### Was tun wenn es kein fertiges Image gibt?

Gibt es allerdings kein Image hat man die Möglichkeit selbst eines zu erstellen. Zunächst muss man dazu Docker einrichten. Auf einem Ubuntu-System funktioniert dies folgendermaßen:

#### Installation über das Docker-Repository

Zunächst muss **apt** das Repository hinzugefügt werden. Dazu wird zuerst einmal der Paketindex aktualisiert.

```bash
sudo apt-get update
```

Es müssen einige Pakete installiert werden, damit **apt** Repositories über HTTPS installieren kann.

```bash
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
```

**apt** muss der GPG-Key hinzugefügt werden.

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Mit Hilfe des Fingerprints lässt sich überprüfen ob man die richtige Version hat.

```bash
sudo apt-key fingerprint 0EBFCD88
pub   4096R/0EBFCD88 2017-02-22
      Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid                  Docker Release (CE deb) <docker@docker.com>
sub   4096R/F273FCD8 2017-02-22
```

Mit folgendem Kommando wird sichergestellt, dass nur die stabilen Versionen über das Repository installiert werden.

```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

Jetzt muss abermals der Paketindex aktualisiert werden um die nötigen Informationen über das Docker-Repository herunterzuladen.

```bahs
sudo apt-get update
```

Darauf folgt die Installation der letzten Version.

```bash
sudo apt-get install docker-ce
```

Es gibt eine genauere Anleitung in der Docker Dokumentation [^uninstall-docker-ce].

#### Docker als Nicht-Root-Benutzer ausführen

Der Docker-Deamon läuft immer als **root**. Man kann sich die Eingabe des Befehls `sudo` sparen wenn man seinen Benutzer der Gruppe **docker** hinzufügt.

```bash
sudo usermod -aG docker $USER
```

Der Benutzer sollte nun der Gruppe **docker** angehören.

```bash
sudo groups 4dm1n
```

Es ist notwendig sich mit `exit` aus- und wieder einzuloggen damit die Rechte wirksam werden.

#### Docker beim Booten starten lassen

Mit **systemd** ist diese Aufgabe denkbar einfach.

```bash
sudo systemctl enable docker
```

#### Docker-Deamon konfigurieren

Der Deamon wird über */etc/defaults/docker* konfiguriert. Diese Datei kann mit Vim bearbeitet werden.

```bash
sudo vim /etc/defaults/docker
```

Die **DOCKER_OPTS** müssen einkommentiert und erweitert werden, damit DNS-Einträge innerhalb der Docker-Container aufgelöst werden können.

```bash
DOCKER_OPTS="--dns 8.8.8.8 --dns 8.8.4.4 --ip-masq=true"
```

Dann muss der Dienst neu gestartet werden.

```bash
sudo systemctl restart docker
```
### Das Image erstellen

Als Beispiel möchte ich eine Command Line Interface von Jottacloud als Image nutzen. Jottacloud ist ein Cloud-Speicher-Anbieter aus Norwegen. Er wirbt damit, dass Norwegen eines der strengsten Datenschutzgesetze der Welt hat und die eigenen Daten somit gesetzlich gut geschützt sind. Dazu kommt dass man für 7,50 € im Monat unbegrenzten Cloud-Speicher bekommt. Es gibt eine sehr gute App für Android, Mac und Windows PC um seine eigenen Daten in der Cloud zu sichern. Seit kurzen gibt es einen Deamon und eine CLI-Anwendung für Linux auf der Webseite des Herstellers [^jottacloud].

Informationen zur Anwendung sind unter http://docs.jottacloud.com/jottacloud-command-line-tool zu finden.

#### Docker vorbereiten

Zum Erstellen eines Containers muss noch **docker-compose** installiert werden.

```bash
sudo apt-get install docker-compose
```

#### Dockerfile

Mit einem Dockerfile kann die Konfiguration eines Containers definiert werden. Es ist eine Best Practice für ein Image-Projekt einen Ordner anzulegen. Dieser enthält das dockerfile, dass den Bau des Images definiert und alle weiteren Dateien wie z.B. Konfigurationsdateien, die beim Bau in das Image kopiert werden sollen. Der komplette Ordner kann in einem Git-Repository unter Quellcodeverwaltung gestellt werden. 

```bash
mkdir jotta-cli-image
cd jotta-cli-image
vim dockerfile
```

##### Das Base-Image

Es gibt ein Debian-Paket für die Anwendung. Deswegen möchte ich das Dockerimagel aus einem Ubuntu-Image erstellen. Ich benutze die neuste stabile Version mit Langzeit-Support. (aktuell 16.04.) Es wäre möglich als Tag **latest** anzugeben. Der Vorteil wäre, dass man automatisch die nächste LTS-Version von Ubuntu nutzen würde, sobald sie in Dockerhub als **latest** getagt würde. Der Nachteil ist, dass es möglich wäre ein Image zu erstellen, dass nicht richtig funktioniert ohne, dass man es direkt mitbekommt. Aus diesem Grund sollte eine fixe Version angegeben werden.

```dockerfile
ARG ubuntu_version=16.04
FROM ubuntu:${ubuntu_version}
```

Es wird ein `ARG` mit einem Default von **16.04** genutzt. Dies wird in `FROM` aufgelöst und definiert die verwendete Ubuntu-Version.

Dieses Vorgehen hat zwei Vorteile.

1. Die Versionsnummer muss bei einem Update nur an einer Stelle geändert werden, kann im Dockerfile aber an mehreren Stellen verwendet werden.
2. Die Versionsnummer kann mit einem Parameter beim Build gesetzt werden um ein Testimage für die Validierung einer neuen Ubuntu-Version zu erstellen.

```bash
docker build -t jotta-cli:0.3.4269 --build-arg ubuntu_version=18.04 .
```

##### ARGs

Neben dem Argument zum Setzen der Ubuntu-Version kann auch die Version von **jotta-cli** gesetzt werden.

```dockerfile
ARG jotta_cli_version=0.3.4269
```

bzw. in der Kommandozeile:

```bash
docker build -t jotta-cli:0.3.4269 --build-arg jotta_cli_version=0.3.4269 .
```

#### Metadaten

Im Dockerfile können Labels angegeben werden, die das Image beschreiben. Dabei sollte nach dem Schema unter http://label-schema.org/rc1/ vorgegangen werden.

```dockerfile
LABEL maintainer="Marcel Melzig <marcel@3h-co.de>"
LABEL org.label-schema.schema-version="1.0.0-rc.1"
LABEL org.label-schema.name="jottad"
LABEL org.label-schema.description="This image runs the Jottacloud deamon jottad."
LABEL org.label-schema.usage="/usr/doc/app-usage.txt"
LABEL org.label-schema.url="http://docs.jottacloud.com/jottacloud-command-line-tool"
LABEL org.label-schema.version="${jotta_cli_version}"
```

#### Einrichtung von Jotta-Cli

Danach wird **jotta-cli** im Image installiert. http://docs.jottacloud.com/jottacloud-command-line-tool/installing-the-command-line-tool/jottacloud-cli-for-linux-debian-packages beschreibt das Vorgehen. 

Zuerst werden die zur Installation notwendigen Abhängigkeiten installiert.

```bash
apt-get install wget apt-transport-https ca-certificates
```

Dann wird der Repositoryschlüssel geholt.

```bash
wget -O - https://repo.jotta.us/public.gpg | sudo apt-key add -
```

Die Repositoryinfos werden den apt-Sourcen hinzugefügt.

```bash
echo "deb https://repo.jotta.us/debian debian main" | sudo tee /etc/apt/sources.list.d/jotta-cli.list
```

Jetzt wird **jotta-cli** installiert. Dabei wird eine fixe Version angegeben damit das Docker-Image immer konsistent bleibt.

```bash
apt-get update
apt-get install jotta-cli=0.3.4269
systemctl restart jottad
```

Auf das Dockerimage übertragen bedeutet dies, dass wir die Anweisungen mit einem `RUN` ausführen müssen.

```dockerfile
RUN apt-get clean \
	&& apt-get update -y \
	&& apt-get upgrade -y \
	&& apt-get -y install wget apt-transport-https ca-certificates \
	&& wget -O - https://repo.jotta.us/public.gpg | apt-key add - \
	&& echo "deb https://repo.jotta.us/debian debian main" | tee /etc/apt/sources.list.d/jotta-cli.list \
	&& apt-get update -y \
	&& apt-get install jotta-cli=${jotta_cli_version} -y \
	&& apt-get autoremove -y \
	&& apt-get clean \
	&& rm -rf /var/lib/lists/*
```

Der letzte Befehle säubern das Image von unnötigen Balast in Form von Cachedateien.

##### Portfreigabe

Der Port 53 muss freigegeben werden, da der Login mit `jotta-cli login` über diesen durchgeführt wird.

```dockerfile
EXPOSE 53
```

##### Der Dienst als Entrypoint

**systemctl** kann in Dockerimages nicht genutzt werden. Der Dienst muss also manuell gestartet werden.

```dockerfile
ENTRYPOINT [ "jottad","stdoutlog" ]
```

Mit dem Parameter `stdoutlog` wird das Log in stdout geschrieben. Dies hat einerseits den Vorteil, dass der Prozess am laufen bleibt und der Container somit nicht beendet wird. Andererseits kann über Docker auf das Log des Dienstes zugegriffen werden.

#### Image bauen

Das Image sollte nun gebaut werden können.

```bash
docker image build --tag jotta-cli:0.3.4269 .
```

Folgendermaßen kann man sich ansehen ob es erstellt wurde:

```bash
docker image ls -a
```

Nun kann ein  Container mit dem Image erstellt und ausgeführt werden.

```bash
docker container run -it --name jotta-cli jotta-cli:0.3.4269
```

Zum Testen kann man sich die Versionsnummer von **jotta-cli** anzeigen lassen.

```bash
docker exec jotta-cli jotta-cli version
```

Danach sollte das Image entfernt werden, da noch einige Konfigurationen nötig sind.

```bash
docker container stop jotta-cli
docker container prune
docker volume prune
```
### Das Image nutzen

#### Volume erstellen und einbinden

Mit einem Volume soll die Konfiguration von **jottad** gesichert werden. Dazu muss ein Volume angelegt werden.

```bash
docker volume create jotta-cli
```

Folgendermaßen kann es in einen Container eingebunden werden.

```bash
docker run -d --restart=always --name jotta-cli --mount source=jotta-cli,target=/root/.jottad --mount type=bind,source=/,target=/sync,readonly jotta-cli:0.3.4269
```

Der Inhalt des Ordners */root/.jottad* im Container wird dann im Volume unter */var/lib/docker/volumes/jotta-cli/_data* auf dem Host gesichert. Da dieser Ordner die Konfiguration enthält liegt sie somit auf dem Host vor und kann mit gesichert werden.

Es wurden zwei Mounts durchgeführt. Der zweite Mount ist vom Typ **bind**. Das heißt es wird ein Verzeichnis direkt vom Host gemounted. In diesem Fall **root** in */sync* um aus dem Container heraus auf alle Dateien und Verzeichnisse des Hosts zugreifen zu können. Dies ist notwendig, um Backups mit **jotta-cli** anlegen zu können. Um sicherzugehen, dass der Container nicht das Hostsystem kompromittiert wird **root** als **readonly** in den Container gemountet. So kann der Container zwar Backups durchführen aber nichts ändern.

==Wichtig ist, dass root auf dem Container nicht direkt in / gemountet wird, sondern in ein Unterverzeichnis!==

#### jotta-cli und jottad konfigurieren

Der Dienst kann jetzt über die Anwendung **jotta-cli** konfiguriert werden. Für den Fall des Kommandos **login** muss ein **bash** im Container geöffnet werden. Die Ausgabe des Programms kann nicht korrekt angezeigt werden wenn sie direkt mit `docker exec` ausgeführt wird.

```bash
docker exec -it jotta-cli /bin/bash
```

`-it` hällt dabei die **bash** offen.

Nun kann der Login des Dienstes konfiguriert werden.

```bash
jotta-cli login
```

Die Lizenzbestimmungen werden mit `yes` angenommen. Der Benutzername und dass Passwort müssen eingetragen werden. Sofern Two-Factor-Authentication aktiviert ist wird ein Code zugesendet, der eingegeben werden muss. Zum Abschluss muss man dem System einen Namen geben unter dem die Daten hochgeladen werden. Unter dieser Maschine sind die hochgeladenen Daten dann auch im Web zu finden.

Für die weitere Konfiguration kann man den Container wieder verlassen.

```bash
exit
```

##### Pfade zum Sichern hinzufügen

Über **exec** kann der Dienst konfiguriert werden. Jeder Pfad der gesichert werden soll muss **jotta-cli** mitgeteilt werden. Alle Dateien und Verzeichnisse werden in diesem Pfad dann rekursiv gesichert.

```bash
docker exec jotta-cli jotta-cli add /var/lib/docker
```
Im Beispiel wird der Pfad zu den Docker-Volumes gesichert. **jotta-cli** kann so seine eigene Konfiguration in der Cloud sichern.

## Fazit

Es ist gar nicht so schwer ein Image zu erstellen. Somit können eigene Anwendungen bereit gestellt werden oder Anwendungen für die es kein Image gibt können auf diese Weise verwendet werden. In jedem Fall lohnt es, sich mit der Technik auseinander zu setzen, denn sie ist vielseitig einsetzbar.

[^docker-hub]: Docker Hub — [https://hub.docker.com/](https://hub.docker.com/)
[^docker-store]: Docker Store — [https://store.docker.com/](https://store.docker.com/)
[^uninstall-docker-ce]: Docker CE deinstallieren — [https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#uninstall-docker-ce](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#uninstall-docker-ce)
[^jottacloud]: Jottacloud — [www.jottacloud.com](www.jottacloud.com)

