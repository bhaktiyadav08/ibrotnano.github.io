---
title: Architekturentscheidungen mit ADRs festhalten
date: 2026-02-23 08:30:00 +0100
categories: [architektur]
---

ADRs (Architecture Decision Records) helfen dabei, Entscheidungen langfristig nachvollziehbar zu dokumentieren.

## Mini-Ablauf

```mermaid
sequenceDiagram
    participant Team
    participant ADR
    participant Repo
    Team->>ADR: Entscheidung dokumentieren
    ADR->>Repo: Als Markdown committen
    Team->>Repo: Änderungen referenzieren
```

Wenn später Diskussionen entstehen, ist der Kontext direkt im Repository auffindbar.
