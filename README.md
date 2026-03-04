# Jekyll Blog (Neon Funky Space Theme)

This repository contains a complete tech blog, optimized for GitHub Pages. I use this theme on [Blog · iBrotNano](https://ibrotnano.github.io/). Feel free to inspect, adapt or use it for own blogs.

## Features

- Dark neon space theme
- Article list with date and categories on the homepage
- Archive page by year
- Category page with all posts per category
- Syntax highlighting via Rouge
- Copy button for code blocks
- Mermaid diagrams in Markdown (```mermaid)
- SEO metadata + Sitemap for better discoverability
- Custom 404 page

## Local Development with Docker

Requirements: Docker Desktop

```bash
docker compose up -d
```

Then open: `http://localhost:4000`

Stop the container with:

```bash
docker compose down
```

Note: Live-Reload is active, changes to files are automatically rebuilt.

## Publishing on GitHub Pages

1. Push the repository to GitHub.
2. Use the default branch `main`.
3. In **Settings → Pages** set the source to **GitHub Actions** under **Build and deployment**.
4. After each push to `main`, `.github/workflows/pages.yml` will run and deploy automatically.

## Creating New Articles

File under `_posts/` with schema:

`YYYY-MM-DD-title.md`

Front Matter example:

```yaml
---
title: My Article
date: 2026-02-21 09:30:00 +0100
categories: [python, architecture]
---
```
