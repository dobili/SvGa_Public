# Architektur (Kurzfassung des technischen Konzepts)

Ausführlich: Technisches Konzept (Claude Docs, Link in `CLAUDE.md`). Hier das Wichtigste.

```
 buch/a1/ (privat, nur lokal)                    schemas/  (Vertrag)
        │                                           │            │
        ▼                                           ▼            ▼
 pipeline/  lesen → prüfen → bauen  ──►  app/public/daten/de/a1/*.json
                                                    │
                                                    ▼
 app/src/  daten → schach → analyse → ui    engine (Stockfish im Web Worker)
                                                    │
                                     sw.ts: alles vorab laden, offline ausliefern
```

- **Zwei Welten:** Zur Build-Zeit macht die Python-Pipeline aus dem LaTeX geprüfte Daten. Auf dem
  Gerät läuft eine reine TypeScript-App ohne Server, die nur diese Daten liest.
- **Schemas als Vertrag:** Python prüft beim Erzeugen gegen `schemas/`, die App erzeugt ihre Typen
  aus denselben Dateien (`app/skripte/erzeuge-typen.mjs`). Die CI prüft die eingecheckten Daten
  gegen die Schemas (`python -m pipeline.pruefen.daten`).
- **Werkzeuge sind reine Funktionen** mit einer gemeinsamen Schnittstelle
  (`app/src/analyse/werkzeug.ts`) und Referenztests aus Buchabbildungen.
- **Engine** im Hintergrund (Web Worker), ein Auftrag zur Zeit, Werte aus Sicht von Weiß.
- **Offline:** Der Service Worker lädt beim ersten Aufruf alle Dateien (Größenbudget 25 MB,
  geprüft beim Build) und meldet neue Versionen; aktualisiert wird nur nach Tippen.
- **Navigation** als Stapel ohne Adressen; die Zurück-Taste von Android führt eine Ansicht zurück.
- **Texte** nur in `app/src/i18n/de.json`.
- **Hosting:** Cloudflare Workers mit statischen Dateien (`app/wrangler.jsonc`), Testadresse je Zweig.
- **Prüfungen:** `.github/workflows/pruefen.yml` (Pipeline, App, Playwright mit Chromium und WebKit).

Wegweiser je Ordner: `pipeline/README.md`, `app/src/README.md` und die README-Dateien der Module.
In Worten für den Autor: `docs/codefuehrer/`, als Karte aller Dateien: `docs/konzeptkarte.html`
(Daten aus `app/skripte/konzeptkarte.mjs`).
