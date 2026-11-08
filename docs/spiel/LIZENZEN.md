# Schach-Abenteuer – Lizenzen

Jede Abhängigkeit und jedes Material des Spiels steht hier mit Lizenz, bevor es benutzt wird.
Grundregel (Dokument 01): Ein kostenloses Spiel, das ein Buch bewirbt, zählt als kommerzielle
Nutzung; es wird nur Material verwendet, das kommerziell erlaubt ist. Keine Rechtsberatung.
npm-Pakete brauchen zusätzlich Einträge in `app/src/ui/bildschirme/lizenzbausteine.ts`,
`app/src/i18n/de.json`, `en.json` und `docs/LIZENZEN.md`, sonst wird `lizenzbausteine.test.ts` rot.

## Abhängigkeiten (eingebaut seit Schritt 5, 07.11.2026)

| Paket  | Version | Lizenz | Zweck                                       | Stand                              |
| ------ | ------- | ------ | ------------------------------------------- | ---------------------------------- |
| phaser | 4.2.1   | MIT    | Oberwelt: Kacheln, Figuren, Kamera, Eingabe | eingebaut, mit eventemitter3 (MIT) |
| inkjs  | 2.4.0   | MIT    | Dialoge (Laufzeit und Compiler beim Build)  | eingebaut (Compiler beim Build)    |

## Geplant (nicht eingebaut; vor dem Einbau prüfen)

| Paket                                                   | Lizenz  | Zweck                                                         | Vor dem Einbau prüfen                                                                                                                                                                                                                                |
| ------------------------------------------------------- | ------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fairy-Stockfish (WebAssembly)                           | GPL-3.0 | Schachvarianten abseits der Clubs (`10`, Abschnitte 3 und 3a) | Lizenz des WebAssembly-Baus und seiner Varianten-Netze (NNUE) einzeln nachsehen; Quelltextangebot wie bei Stockfish (Lizenzdatei im Zusatzpaket, Hinweis in „Über die App“); passt zur GPL der App; als Zusatzpaket wie Maia, nur auf Wunsch geladen |
| Figurenbilder für Märchenfiguren (Drache, Falke, Bison) | offen   | eigene Figuren der Varianten L9, L10                          | nur selbst gezeichnet, CC0 oder kommerziell erlaubt mit Nennung; nicht aus Spielen oder Seiten kopieren                                                                                                                                              |

Grundsatz für jedes Zusatzpaket: Lizenz und Herkunft stehen hier, bevor es gebaut wird; Lizenztext
liegt im Paket; npm-Pakete zusätzlich in `lizenzbausteine.ts` (sonst ist der Lizenztest rot).

## Material

| Material                                                                 | Lizenz                                                                                                                          | Was zu tun ist                                                                                                                                                                                                                                           | Stand               |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Platzhaltergrafik für den Prototyp (Kenney)                              | CC0                                                                                                                             | Nennung freiwillig                                                                                                                                                                                                                                       | Schritt 5           |
| LimeZu Modern Interiors / Exteriors (Vollversion)                        | Nutzung in kommerziellen Projekten erlaubt, Nennung nötig, Weitergabe verboten                                                  | Kauf durch den Autor nach dem Prototyp; Dateien nur im privaten Repository (Entscheidung A10); Credits im Abspann                                                                                                                                        | offen               |
| Musik, Geräusche                                                         | CC0 oder CC-BY                                                                                                                  | Quelle und Autor je Stück hier eintragen                                                                                                                                                                                                                 | offen               |
| Pixel-Schrift (falls nötig)                                              | SIL OFL oder CC0                                                                                                                | –                                                                                                                                                                                                                                                        | offen               |
| Porträts der Figuren (DiceBear „Pixel Art“, `@dicebear/pixel-art` 9.4.3) | Gestaltung CC0 1.0 (DiceBear), Code MIT (Florian Körner); Fundstelle `node_modules/@dicebear/pixel-art/LICENSE` und `README.md` | Erzeugt mit `app/skripte/erzeuge-figurenbilder.mjs` nach `inhalte/abenteuer/portraets/*.svg`; das Paket nur zum Erzeugen (`npm install --no-save`), nicht in der App. Nennung freiwillig (CC0), im Abspann trotzdem „Porträts: DiceBear Pixel Art (CC0)“ | erzeugt, 08.11.2026 |
| Porträts (Bild-KI, falls später)                                         | je nach Dienst                                                                                                                  | Nutzungsbedingungen des Bilddienstes prüfen                                                                                                                                                                                                              | offen               |

## Hinweis zum Repository

Die App steht unter GPL-3.0-or-later und hängt an GPL-Bibliotheken (chessops, Stockfish) und
AGPL-Material (Brettbilder von Lichess). Ein späterer Umzug des Spiels in ein privates Repository
(Entscheidung A10) ist möglich; ein Verkauf wäre unter der GPL erlaubt, Käufer hätten aber Anspruch
auf den Quelltext (`04_Architektur.md`, Abschnitt 1).
