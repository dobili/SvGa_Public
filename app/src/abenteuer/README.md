# Schach-Abenteuer (`app/src/abenteuer/`)

Das optionale Story-Spiel zur App. Konzept, Stellungnahme, Architektur und Entscheidungen liegen in
`docs/spiel/`; diese Datei ist nur der Wegweiser durch den Code.

Grundsatz (docs/spiel/04_Architektur.md): Die App bleibt, wie sie ist. Das Spiel liegt vollständig
in diesem Ordner, wird erst auf Wunsch geladen und spricht mit der App nur über die Verträge in
`schnittstelle/`. Die Einhängepunkte in der App sind klein: `app/zusatzansichten.ts` (Ansicht
„abenteuer“), `app/spruenge.ts` („#abenteuer“), `ui/komponenten/partie/partieerweiterungen.ts`
(Kartenleiste), `spiel/partie.ts` (Feld `abenteuer`), `speicher/format.ts` (Feld `abenteuer`,
Format 11), `sw/dateiliste.ts` (Code-Baustein als Paket), `vite.config.ts` und
`skripte/pruefe-groesse.mjs` (Zusatzpaket außerhalb des Budgets).

| Ordner           | Aufgabe                                                                                   | Anfangen mit           |
| ---------------- | ----------------------------------------------------------------------------------------- | ---------------------- |
| `schnittstelle/` | Verträge zwischen App und Spiel: nur Typen                                                | `modul.ts`             |
| `anbindung/`     | App-Seite der Grenze: Hülle (Zusatzansicht), Dienste, Partiestart, Partieergebnis, Leiste | `AbenteuerAnsicht.tsx` |
| `regeln/`        | Reine Regeln: Gegnerstärke, Spielstand lesen und leer anlegen                             | `gegnerstaerke.ts`     |
| `paket/`         | Zusatzpaket laden, prüfen, lesen, löschen (Cache „abenteuer-<version>“)                   | `paketlader.ts`        |
| `daten/`         | Spieldaten aus dem Paket (Typen aus `schemas/abenteuer-*.schema.json`)                    | `laden.ts`             |
| `modul/`         | Einstieg des Bausteins `assets/abenteuer-*.js` (dynamisch geladen)                        | `abenteuer.tsx`        |
| `oberwelt/`      | Phaser: Karte, Held, Kollision, Auslöser; Steuerkreuz in React                            | `Oberwelt.tsx`         |
| `dialog/`        | Ink-Geschichten abspielen und anzeigen                                                    | `geschichte.ts`        |
| `texte/`         | Oberflächentexte des Spiels (`inhalte/abenteuer/texte/de.json`)                           | `texte.ts`             |

Die Partie selbst, die Aufgaben und das Brett kommen aus der App (`spiel/`, `training/`, `ui/`);
das Spiel ruft sie über die Dienste in `anbindung/dienste.ts` auf. Inhalte (Gegner, Karten,
Quests, Orte, Begegnungen, Ink, Tiled) liegen in `inhalte/abenteuer/`; `skripte/baue-abenteuerpaket.mjs`
macht daraus `public/abenteuer/` (erzeugt, nicht eingecheckt).
