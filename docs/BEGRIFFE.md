# Begriffe im Code und im Buch

Fachbegriffe heißen im Code wie im Buch, auf Deutsch und ohne Umlaute (Konzept Abschnitt 3 und 12).
Begriffe der Bibliotheken (chessops, React) bleiben englisch.

| Im Code                                                                                   | Im Buch                                                           | Wo                                        |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------- |
| `Abbildung`                                                                               | Abbildung, „Abb. 1.26“                                            | `schemas/abbildung.schema.json`, `daten/` |
| `Stellung`                                                                                | Stellung (FEN)                                                    | `schach/stellung.ts`                      |
| `FIGURENWERT`                                                                             | Faustwerte der Figuren (Kapitel 1, Tabelle)                       | `schach/stellung.ts`                      |
| `angreifer`                                                                               | Angreifer und Verteidiger                                         | `schach/angreifer.ts`                     |
| `hinter` (Batterie)                                                                       | Batterie, „die Dame über den Bauern hinweg“                       | `schach/angreifer.ts`                     |
| `abtausch`, `bilanz`, `schlagfolge`                                                       | Abtausch, „schlage zuerst mit der billigsten Figur“               | `schach/abtausch.ts`                      |
| `Werkzeug`, `Werkzeugergebnis`, `Befund`                                                  | Werkzeuge der Kapitel, Hinweisstufen                              | `analyse/werkzeug.ts`                     |
| `k1-zaehlen`                                                                              | Zählen von Angreifern und Verteidigern (Kapitel 1)                | `analyse/k1-zaehlen.ts`                   |
| `Markierung` (Pfeil, Feld) in `gold`, `rot`, `grau` (dazu `gruen`, `blau` nur in der App) | Farbcode der Diagramme                                            | `analyse/werkzeug.ts`, `ui/brett/`        |
| `zugfolgeAlsText`                                                                         | Notation (Kapitel 0)                                              | `schach/notation.ts`                      |
| `Wert`, `wertInWorten`                                                                    | Bewertung („leicht besser“)                                       | `engine/`                                 |
| `Uebung` (`nummer`, `aufgabe`, `loesung`)                                                 | „Übung 4“ im Kasten „Übungen zu diesem Kapitel“                   | `schemas/uebung.schema.json`              |
| `Steckbrief`                                                                              | Eröffnungssteckbrief                                              | `schemas/bilanz.schema.json`              |
| `Bilanz` (`art` ziel/faktor, `wertung`)                                                   | Zielbilanz (✓ ◐ ✗), Faktorenbilanz (Waage)                        | `schemas/bilanz.schema.json`              |
| `Glossar`, `stellen`, `verweise`                                                          | Glossar, Seitenverweis, Pfeil →                                   | `schemas/glossar.schema.json`             |
| `Zugfolge`, `Zug` (`san`, `zeichen`)                                                      | Zugfolge im Text, Zugzeichen (!, ?, ??)                           | `lesen/zugfolgen.py`                      |
| `Beispiel`, `Knoten`, `Abzweigung`                                                        | Beispiel des Buches, Hauptvariante und Abzweigungen (Konzept 4.2) | `zugfolgen/baum.py`                       |
| `Anschluss`, `Spitze`, `Nebenlinie`                                                       | – (wo eine Zugfolge im Text weitergeht)                           | `zugfolgen/nachspielen.py`                |
| `Befund`, `Schwere`                                                                       | Meldung an den Autor im Bericht                                   | `pipeline/befunde.py`                     |
| `Stapel`, `Ansicht`                                                                       | – (Navigation der App)                                            | `app/stapel.ts`                           |
| `Zusatzansicht`                                                                           | – (Bildschirm, über eine Liste eingehängt)                        | `app/zusatzansichten.ts`                  |
| `Zugklasse`, `Zugzeichen`                                                                 | Zugzeichen (!, ?, ??), dazu „bester Zug“, „Theoriezug“            | `spiel/auswertung.ts`                     |
| `Moment`                                                                                  | – (wichtige Stelle der Partie in der Zeitleiste der Auswertung)   | `ui/komponenten/auswertung/momente.ts`    |
| `Gegner`, `Stufe`, `Gruppe`                                                               | – (Bots, zehn Spielstufen, Gruppenmodus)                          | `engine/gegnerbau.ts`, `engine/stufen.ts` |

## Begriffe der Belohnungen (Gamifizierung)

Diese Begriffe gibt es nur in der App, nicht im Buch. Die Stufen der Erfahrung tragen aber Begriffe
des Buches in der Reihenfolge, in der das Buch sie lehrt.

| Im Code                                  | In der App                                                                             | Wo                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `Erfahrungsgrundlage`, `Erfahrungsstufe` | Erfahrungspunkte (EP) und zehn Stufen von „Erster Zug“ bis „Meisterplan“               | `ui/komponenten/fortschritt/erfahrung.ts`               |
| Ring, Orden                              | Ein voller Ring des Fortschritts wird zum Orden                                        | `ui/komponenten/fortschritt/ringrechnung.ts`            |
| `Abzeichenangabe`                        | Abzeichen für besondere Leistungen                                                     | `ui/komponenten/fortschritt/abzeichen.ts`               |
| `Station`, `Etappe`                      | Lernpfad: ein Kapitel ist eine Station, ein Teil des Buches eine Etappe mit Landschaft | `ui/komponenten/lernpfad/lernpfad.ts`                   |
| Nebenaufgabe, Kapitelaufgabe             | Was man zu einem Kapitel noch tun kann                                                 | `ui/komponenten/lernpfad/nebenaufgaben.ts`              |
| Tagesprotokoll (`Tageszaehler`)          | – (je Tag, was der Leser getan hat)                                                    | `speicher/aktivitaet.ts`                                |
| `Themenstand`, `Medaillenstufe`          | Meisterschaft je Thema: Bronze, Silber, Gold                                           | `training/meisterschaft.ts`                             |
| `Wochenstand`, `Wochenauftrag`           | Wochenziel (Lerntage) und drei Aufträge je Woche                                       | `training/wochenziel.ts`, `training/wochenauftraege.ts` |
| `Uebungsplan`                            | „Wann übst du?“ mit Kalendererinnerung                                                 | `training/uebungsplan.ts`                               |
| `Ziel`, `Zielstand`                      | Eigene Ziele zum Anheften                                                              | `training/ziele.ts`                                     |
| `Duell`, Rivale                          | Bilanz gegen einen Bot, der Rivale                                                     | `training/duelle.ts`, `training/rivalen.ts`             |
| `Rekord`                                 | Rekordtafel                                                                            | `training/rekorde.ts`                                   |
| Extra                                    | Freischaltbare Brettfarbe, Figuren, Rahmen, Konfetti, Titel                            | `training/extras.ts`                                    |
| Fundstück                                | Seltene Karte mit Schachgeschichte am Ende einer Runde                                 | `training/fundstuecke.ts`                               |
| Monatsrückblick                          | „Dein Oktober“                                                                         | `training/rueckblick.ts`                                |
| `Startkarte`, `Profilkarte`              | Karten oben im Buch („Heute“) und im Profil                                            | `ui/komponenten/start/`, `ui/komponenten/profilkarten/` |
| `Vorschlag`                              | „Schnell eine Partie“: ein passender Bot                                               | `ui/komponenten/spielstart/vorschlag.ts`                |
| Herausforderung                          | Geteilter Link auf eine Aufgabe                                                        | `ui/komponenten/teilen/`                                |
