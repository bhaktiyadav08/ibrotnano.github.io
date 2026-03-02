# Jekyll Blog (Monokai Dark)

Dieses Repository enthält ein vollständiges Tech-Blog, optimiert für GitHub Pages.

## Features

- Dunkles Monokai-inspiriertes Theme
- Artikel-Liste mit Datum und Kategorien auf der Startseite
- Archivseite nach Jahr
- Kategorienseite mit allen Posts je Kategorie
- Syntax Highlighting über Rouge
- Copy-Button für Codeblöcke
- Mermaid-Diagramme in Markdown (```mermaid)
- SEO-Metadaten + Sitemap für bessere Auffindbarkeit
- Eigene 404-Seite
- Automatisches Deployment per GitHub Actions

## Lokal starten

Voraussetzungen: Ruby + Bundler

```bash
bundle install
bundle exec jekyll serve
```

Dann öffnen: `http://127.0.0.1:4000`

## Lokal starten ohne Ruby (Docker)

Voraussetzungen: Docker Desktop

```bash
docker compose up -d
```

Dann öffnen: `http://127.0.0.1:4000`

Stoppen:

```bash
docker compose down
```

Hinweis: Live-Reload ist aktiv, Änderungen an Dateien werden automatisch neu gebaut.

## Auf GitHub Pages veröffentlichen

1. Repository nach GitHub pushen.
2. Standard-Branch `main` verwenden.
3. In **Settings → Pages** bei **Build and deployment** die Quelle auf **GitHub Actions** setzen.
4. Nach jedem Push auf `main` läuft `.github/workflows/pages.yml` und deployt automatisch.

## PDF-Export (ohne lokale Ruby-Installation)

Du kannst über GitHub Actions **alle** oder **einen einzelnen** Artikel als PDF exportieren:

1. In GitHub auf **Actions** gehen.
2. Workflow **Export Posts as PDF** auswählen.
3. **Run workflow** klicken.
4. Bei **export_mode** wählen:
	- `all` → exportiert alle Posts
	- `single` → exportiert genau einen Post
5. Bei `single` zusätzlich `post_identifier` setzen, z. B.:
	- Slug: `willkommen-im-blog`
	- Dateiname: `2026-02-20-willkommen-im-blog.md`
6. Nach Abschluss im Run unter **Artifacts** die Datei **blog-pdf-export** herunterladen.

Der Workflow liegt in `.github/workflows/pdf-export.yml`.

## Neue Artikel erstellen

Datei unter `_posts/` mit Schema:

`YYYY-MM-DD-title.md`

Front Matter Beispiel:

```yaml
---
title: Mein Artikel
date: 2026-02-21 09:30:00 +0100
categories: [python, architektur]
---
```
