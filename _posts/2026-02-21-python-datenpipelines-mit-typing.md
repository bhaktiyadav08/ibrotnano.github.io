---
title: Datenpipelines in Python sauber typisieren
date: 2026-02-21 09:00:00 +0100
categories: [python]
---

Kurzer Leitfaden, wie kleine Datenpipelines in Python mit Typannotationen wartbarer werden.

## Beispiel

```python
from dataclasses import dataclass

@dataclass
class Event:
    id: str
    kind: str
    value: float

def normalize(events: list[Event]) -> list[Event]:
    if not events:
        return []

    max_value = max(event.value for event in events) or 1
    return [Event(event.id, event.kind, event.value / max_value) for event in events]
```

So bleibt die Verarbeitung nachvollziehbar, selbst wenn das Projekt wächst.
