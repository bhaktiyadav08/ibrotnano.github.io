---
title: CI/CD für kleine Teams ohne Overhead
date: 2026-02-22 10:15:00 +0100
categories: [devops]
---

Eine einfache Pipeline reicht oft völlig aus, wenn Build, Tests und Deployment klar getrennt sind.

## Pipeline-Übersicht

```mermaid
flowchart LR
    A[Push auf main] --> B[Build]
    B --> C[Test]
    C --> D[Deploy Staging]
    D --> E[Freigabe]
    E --> F[Deploy Produktion]
```

Wichtig ist nicht Komplexität, sondern Stabilität und kurze Feedback-Zyklen.
