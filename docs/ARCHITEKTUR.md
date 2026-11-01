# Architektur (Kurzfassung des technischen Konzepts)

Ausführlich: Technisches Konzept (Claude Docs, Link in `CLAUDE.md`). Hier das Wichtigste, Stand
Version 0.3.43.

```
 buch/a1/ (privat, nur lokal)                    schemas/  (Vertrag)
        │                                           │            │
        ▼                                           ▼            ▼
 pipeline/  lesen → prüfen → bauen  ──►  app/public/daten/de/a1/*.json
                                                    │
                                                    ▼
 app/src/  daten → schach → analyse → training/spiel → ui
           speicher (IndexedDB)       engine: Stockfish ×2 und Maia, je im Web Worker
                                                    │
                                     sw.ts: Kern vorab laden, offline ausliefern
```

- **Zwei Welten:** Zur Build-Zeit macht die Python-Pipeline aus dem LaTeX geprüfte Daten. Auf dem
  Gerät läuft eine reine TypeScript-App ohne Server, die nur diese Daten liest.
- **Schemas als Vertrag:** Python prüft beim Erzeugen gegen `schemas/`, die App erzeugt ihre Typen
  aus denselben Dateien (`app/skripte/erzeuge-typen.mjs`). Die CI prüft die eingecheckten Daten
  gegen die Schemas (`python -m pipeline.pruefen.daten`).
- **Werkzeuge sind reine Funktionen** mit einer gemeinsamen Schnittstelle
  (`app/src/analyse/werkzeug.ts`), angemeldet in `analyse/register.ts` (34 Werkzeuge), mit
  Referenztests aus Buchabbildungen.
- **Engine** im Hintergrund (Web Worker), ein Auftrag zur Zeit, Werte aus Sicht von Weiß. Seit
  0.3.40 zwei Stockfish-Worker: einer für Werkzeuge, Hinweise und Bots, einer nur für die
  Auswertung der Partie (`auswertungsEngine` in `engine/engineDienst.ts`), damit sie auf einem
  anderen Kern weiterrechnet. **Maia** (Zusatzpaket, nur auf Wunsch) rechnet im eigenen Worker
  (`engine/maiaWorker.ts`, Aufträge über `engine/maia-web.ts`).
- **Bots:** 80 vorgefertigte Bots in zehn Stufen und 4 Spaß-Bots; Zugwahl über ein Wahlmodell aus
  Lichess-Partien, Fehlerarten des Buches und Maia (`engine/zugwahl.ts`).
- **Speicher:** alle Daten des Lesers in einer IndexedDB auf dem Gerät, mit Formatversion
  (`speicher/format.ts`, heute 7) und Umwandlung älterer Stände. Belohnungen (Erfahrung, Orden,
  Abzeichen) werden möglichst aus vorhandenen Daten gerechnet; neu gespeichert werden nur
  Tagesprotokoll, Antwortprotokoll je Thema, Rekorde, Duelle, Woche, Ziele und Fundstücke
  (`speicher/gamifizierung.ts`).
- **Erweiterbar über Listen:** neue Bildschirme (`app/zusatzansichten.ts`), Karten oben im Buch
  (`ui/komponenten/start/startkarten.ts`) und im Profil (`ui/komponenten/profilkarten/`),
  Meldungen am Rundenende (`ui/trainer/nachDerRunde.ts`) und nach der Partie
  (`speicher/partieprotokoll.ts`) tragen je eine Zeile ein, ohne Router oder Bildschirme zu ändern.
- **Offline:** Der Service Worker lädt beim ersten Aufruf den Kern vorab, weitere Sprachen erst bei
  Bedarf (`sw/dateiliste.ts`); Größenbudget 35 MB für alles zusammen (bis 1.11.2026: 25 MB), geprüft beim Build
  (`app/skripte/pruefe-groesse.mjs`). Neue Versionen werden gemeldet, aktualisiert wird nur nach
  Tippen.
- **Navigation** als Stapel ohne Adressen (`app/stapel.ts`); die Zurück-Taste von Android führt
  eine Ansicht zurück. Sprünge in der Adresse („#abb-6.20“, „#aufgabe-…“) öffnen eine Stelle
  direkt (`app/spruenge.ts`).
- **Texte** nur in `app/src/i18n/de.json` und `en.json` (gleiche Schlüssel, ein Test prüft das).
- **Hosting:** Cloudflare Workers mit statischen Dateien (`app/wrangler.jsonc`), Testadresse je
  Zweig; Dashboard unter /admin/ mit Meldungen, Prüfungen und Wiki.
- **Prüfungen:** `.github/workflows/pruefen.yml` (Pipeline, App, Playwright mit Chromium und
  WebKit) bei jedem Push; `.github/workflows/wartung.yml` wöchentlich und nach jedem Push nach
  `main` (Wartungsprüfungen, danach das Wiki über `python -m pipeline.wiki --senden`).

Wegweiser je Ordner: `pipeline/README.md`, `app/src/README.md` und die README-Dateien der Module.
In Worten für den Autor: `docs/codefuehrer/`, als Karte aller Dateien: `docs/konzeptkarte.html`
(Daten aus `app/skripte/konzeptkarte.mjs`).
