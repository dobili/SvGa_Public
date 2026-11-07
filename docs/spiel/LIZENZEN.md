# Schach-Abenteuer – Lizenzen

Jede Abhängigkeit und jedes Material des Spiels steht hier mit Lizenz, bevor es benutzt wird.
Grundregel (Dokument 01): Ein kostenloses Spiel, das ein Buch bewirbt, zählt als kommerzielle
Nutzung; es wird nur Material verwendet, das kommerziell erlaubt ist. Keine Rechtsberatung.
npm-Pakete brauchen zusätzlich Einträge in `app/src/ui/bildschirme/lizenzbausteine.ts`,
`app/src/i18n/de.json`, `en.json` und `docs/LIZENZEN.md`, sonst wird `lizenzbausteine.test.ts` rot.

## Geplante Abhängigkeiten (noch nicht eingebaut)

| Paket  | Version | Lizenz | Zweck                                       | Stand                                   |
| ------ | ------- | ------ | ------------------------------------------- | --------------------------------------- |
| phaser | 4.2.1   | MIT    | Oberwelt: Kacheln, Figuren, Kamera, Eingabe | Entscheidung A12, Einbau in Schritt 5   |
| inkjs  | 2.4.0   | MIT    | Dialoge (Laufzeit und Compiler beim Build)  | Entscheidung A11, Einbau in Schritt 4/5 |

## Material

| Material                                          | Lizenz                                                                         | Was zu tun ist                                                                                                    | Stand     |
| ------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | --------- |
| Platzhaltergrafik für den Prototyp (Kenney)       | CC0                                                                            | Nennung freiwillig                                                                                                | Schritt 5 |
| LimeZu Modern Interiors / Exteriors (Vollversion) | Nutzung in kommerziellen Projekten erlaubt, Nennung nötig, Weitergabe verboten | Kauf durch den Autor nach dem Prototyp; Dateien nur im privaten Repository (Entscheidung A10); Credits im Abspann | offen     |
| Musik, Geräusche                                  | CC0 oder CC-BY                                                                 | Quelle und Autor je Stück hier eintragen                                                                          | offen     |
| Pixel-Schrift (falls nötig)                       | SIL OFL oder CC0                                                               | –                                                                                                                 | offen     |
| Porträts                                          | je nach Dienst                                                                 | Nutzungsbedingungen des Bilddienstes prüfen                                                                       | offen     |

## Hinweis zum Repository

Die App steht unter GPL-3.0-or-later und hängt an GPL-Bibliotheken (chessops, Stockfish) und
AGPL-Material (Brettbilder von Lichess). Ein späterer Umzug des Spiels in ein privates Repository
(Entscheidung A10) ist möglich; ein Verkauf wäre unter der GPL erlaubt, Käufer hätten aber Anspruch
auf den Quelltext (`04_Architektur.md`, Abschnitt 1).
