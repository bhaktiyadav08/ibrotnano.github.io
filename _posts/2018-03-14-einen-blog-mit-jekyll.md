---
layout: post
title: "Ein Blog mit Jekyll"
date:   2018-05-23 12:00:00 +0200
category: development
tags: blog jekyll markdown web development operations
excerpt: "Mit Jekyll können aus Klartextdateien statische Webseiten generiert werden. Mit Markdown ergibt sich daraus ein praktischer Workflow um einen Blog zu schreiben. In dem Artikel erkläre ich wie ich mit Jekyll meinen Blog pflege."
typora-copy-images-to: ..\assets\posts\2018-03-14-einen-blog-mit-jekyll\images
typora-root-url: ..\
---

# Ein Blog mit Jekyll

## Was ist Jekyll?

Jekyll ist ein Textprozessor. Aus Klartext-Dateien wie z.B. Markdown-Dateien kann Jekyll eine statische HTML-Webseite generieren. Der Vorteil ist hier die Geschwindigkeit. Kein Skript muss ausgeführt werden um die Seite auzuliefern. Alles ist schon vorher generiert worden.

Für einfache Blogs ist dies sicherlich eine gute Alternative. Für mich passt es super in meinen Workflow. Ich schreibe Artikel mit Typora und kann diese einfach in meine Seitenstruktur übernehmen. Typora unterstütz sogar **Front Matter** mit dem Jekyll konfiguriert werden kann.

Da alle Resourcen Klartextdateien sind kann der gesamte Blog auch unter Sourcecodeverwaltung gestellt werden.

Mein Projekt zum Betreiben eines kleinen Entwicklungsservers für kleine Projekte enthält einen Blog, der von Jekyll generiert wird. Es müssen nur noch Artikel hinzugefügt werden.

## Einen Post schreiben

Posts werden im Unterverzeichnis *_posts* abegelegt. Ein Post ist einfach eine HTML- oder Markdown-Datei. Jekyll erwartet die Namen der Dateien in einem fixen Format. Das Format lautet: **YYYY-MM-dd-title.md**.

Alle Posts müssen mit **YAML Front Matter** beginnen. Dieser Posts beginnt z.B. folgendermaßen:

```yaml
---
title: "Ein Blog mit Jekyll"
date:   2018-03-19 16:28:00 +0100
category: development
tags: blog jekyll markdown web development operations
typora-copy-images-to: ..\assets\posts\einen-blog-mit-jekyll\images
typora-root-url: ..\
---
```

`title` legt den Title des Beitrags fest.

`data` ist das Datum des Beitrags. Es kann sich von dem im Dateinamen unterscheiden. Jekyll bevorzugt das Datum im YAML Front Matter. Ich lasse den Namen der Datei auf dem Datum stehen, an dem die Datei angelegt wurde. Auf diese Weise hat sie einen ausreichend eindeutigen Namen.

Jekyll verwendet die Kategorien um die Artikel in einer Baumstruktur zu schachteln. Ich würde so wenig Kategorien verwenden wie möglich und nicht zu tiefe Hierarchien verwenden. Dadurch bleibt die Seite übersichtlicher.

Ich selbst ordne einen Post jeweils nur einer Kategorie hinzu und nutze auch nur sehr wenig Kategorien.

Die Tags können für eine weitere Spezifizierung der Beiträge genutzt werden.

Die Typora-Einträge legen das Verhalten von Typora fest, wenn Bilder in das Dokument kopiert werden. Ein einigermaßen praktisches Feature zum Organisieren von Downloads und Bildern des Beitrages.

### Images und Dateien einfügen

Das Einfügen von Images und Downloads ist leider in meinen Augen schlecht gelöst. Gutes Design einer Anwendung, auch einer Webseite, ist zusammen zu lassen was zusammen gehört. Jekyll allerdings sieht nur vor, Images in einem Ordner im Rootverzeichnis, z.B. */assets/images* zu organisieren und von dort aus zu verlinken. Relative Pfade zu den Posts sind nicht möglich. Das ist schade, würde es doch ermöglichen, den Text und die Resources zusammen zu organisieren.

Um wenigstens etwas Ordnung halten zu können würde ich Dateien eines Posts zumindest organisiert im Verzeichnisbaum ablegen.

*/assets/posts/post-name/images*

*/assets/posts/post-name/files*

Aus dem Dokument kann dann, laut Jekylls Dokumentation mit relativen Pfaden von der Basis-URL verwiesen werden.

```markdown
# image
![My helpful screenshot](/assets/posts/post-name/images/001.jpg)
# file
[get the PDF]("/assets/posts/post-name/files/mydoc.pdf)
```

Geht man so vor, sieht man in einem Editor wie Typora die Images nicht in der Vorschau. Man ist gezwungen erst die Seite mit Jekyll zu erstellen um einen Eindruck zu bekommen, wie der Post aussehen wird.

#### Features in Typora erleichtern das Arbeiten mit Images

Es gibt zwei Features in Typora, die das Arbeiten mit Bildern erleichtern. Sie können mit Einträgen in YAML Front Matter aktiviert und konfiguriert werden.

```yaml
typora-copy-images-to: ..\assets\posts\einen-blog-mit-jekyll\images
typora-root-url: ..\
```

`typora-copy-images-to` erzeugt einen Kontextmenüeintrag, mit dessen Hilfe Images in den angegebenen Ordner kopiert werden können.

`typora-root-url` gibt ein Wurzelverzeichnis an, dass Typore in der Vorschau für den relativen Pfad des eingefügten Bildes benutzt.

![Ein Bild mit Typora in einen Post einfügen.](/assets/posts/2018-03-14-einen-blog-mit-jekyll/images/1521104320258.png){:.img-content}

Es ist übrigens möglich Bilder direkt aus der Zwischenablege zu kopieren. Ist der Ordner unter `typora-copy-images-to` nicht vorhanden kann er angelegt werden lassen.

## Kategorien anlegen

Kategorien und Tags können nicht so einfach angezeigt werden. Es ist dazu notwendig eine eigene Seite anzulegen, die die Post der Kategorie anzeigt.

Ein Post wird einer Kategorie einfach durch einen entsprechenden Eintrag in YAML Font Metter hinzugefügt.

```yaml
---
category: development
---
```

Jekylls Dokumentation[^jekyll-doc-category-tag] enthält weitere Informationen zu diesem Thema.

### Vorbereitungen

Es müssen ein paar minimale Erweiterungen an der Seite vorgenommen werden. Sofern nicht vorhanden muss eine Datei *category.html* unter *_layouts* angelegt werden, die folgenden Inhalt enthält.

```html
---
layout: page
---

{% for post in site.categories[page.category] %}
    <a href="{{ post.url | absolute_url }}">
      {{ post.title }}
    </a>
{% endfor %}
```

Die Seite listet die Posts einer Kategorie auf. Dieser Schritt muss nur einmalig ausgeführt werden.

Im Rootverzeichnis der Seite muss ein neues Verzeichnis *category* erstellt werden.

In diesem Verzeichnis muss führ jede Kategorie eine Datei mit folgendem Inhalt erstellt werden:

```yaml
---
layout: category
title: Development
excerpt: "Alle Posts in der Kategorie Development."
permalink: /development/
pagination: 
  enabled: true
  category: development
---
```

Eine Liste aller Posts in der Kategorie **development**  kann dann über *{baseurl}/category/development.html* aufgerufen werden.

[^jekyll-doc-category-tag]: Dokumentation von Jekylls Tag- und Kategorien-Funktionalität —[https://jekyllrb.com/docs/posts/#displaying-post-categories-or-tags](https://jekyllrb.com/docs/posts/#displaying-post-categories-or-tags)

