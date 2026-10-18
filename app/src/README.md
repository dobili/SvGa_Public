# Wegweiser durch die App (`app/src/`)

Die App ist eine reine TypeScript-App ohne Server (Konzept Abschnitt 6). Abhängigkeiten zeigen nur
in eine Richtung: `ui/` nutzt alle anderen Module, kein Modul kennt `ui/`.

| Ordner        | Aufgabe                                                     | Anfangen mit                   |
| ------------- | ----------------------------------------------------------- | ------------------------------ |
| `app/`        | Hülle: Start, Navigation als Stapel, Offline und Updates    | `App.tsx`                      |
| `daten/`      | Buchdaten laden, Abbildungsnummern verstehen                | `laden.ts`, `finde.ts`         |
| `schach/`     | Schachlogik in den Begriffen des Buches (auf chessops)      | `stellung.ts`                  |
| `analyse/`    | Werkzeuge des Buches, alle mit derselben Schnittstelle      | `werkzeug.ts`, `k1-zaehlen.ts` |
| `engine/`     | Stockfish im Hintergrund, Werte in Worten, Spielstufen      | `engineDienst.ts`              |
| `spiel/`      | Partie gegen die Engine: Züge, Ende, Uhr, PGN               | `partie.ts`                    |
| `i18n/`       | Alle sichtbaren Texte (`de.json`)                           | `sprache.ts`                   |
| `speicher/`   | Nutzerdaten auf IndexedDB, Umwandlung, Datensicherung       | `speicher.ts`, `format.ts`     |
| `ui/`         | Brett, Komponenten, Bildschirme, Stil                       | `bildschirme/Abbildung.tsx`    |
| `autor/`      | Aufgabenseite des Autors: Aufgabendatei lesen, Links, Haken | `aufgabendatei.ts`             |
| `startseite/` | Statische Startseite des Buches (/, /installieren/)         | `startseite.ts`                |
| `sw.ts`       | Service Worker für die Offline-Nutzung                      | –                              |

Tests liegen neben dem Code (`*.test.ts`, Vitest); Oberflächentests in `app/tests/e2e/` (Playwright).
Erzeugt und nie von Hand bearbeitet: `daten/generiert/` (aus `schemas/`) und
`ui/brett/figurenpfade.generiert.ts` (aus der Figurenschrift SkakNew).

Seiten der Website (Entscheidung 15.10.2026): `index.html` ist die statische Startseite des
Buches unter `/`, `installieren/index.html` der Installationsteil für den QR-Code,
`app/index.html` die App unter `/app/`, dazu `impressum/` und `datenschutz/`. Die Texte der
statischen Seiten kommen beim Build aus `i18n/de.json` (`vite.config.ts`, `texteInHtml`).
