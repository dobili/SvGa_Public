# Begriffe im Code und im Buch

Fachbegriffe heißen im Code wie im Buch, auf Deutsch und ohne Umlaute (Konzept Abschnitt 3 und 12).
Begriffe der Bibliotheken (chessops, React) bleiben englisch.

| Im Code                                             | Im Buch                                                           | Wo                                        |
| --------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------- |
| `Abbildung`                                         | Abbildung, „Abb. 1.26“                                            | `schemas/abbildung.schema.json`, `daten/` |
| `Stellung`                                          | Stellung (FEN)                                                    | `schach/stellung.ts`                      |
| `FIGURENWERT`                                       | Faustwerte der Figuren (Kapitel 1, Tabelle)                       | `schach/stellung.ts`                      |
| `angreifer`                                         | Angreifer und Verteidiger                                         | `schach/angreifer.ts`                     |
| `hinter` (Batterie)                                 | Batterie, „die Dame über den Bauern hinweg“                       | `schach/angreifer.ts`                     |
| `abtausch`, `bilanz`, `schlagfolge`                 | Abtausch, „schlage zuerst mit der billigsten Figur“               | `schach/abtausch.ts`                      |
| `Werkzeug`, `Werkzeugergebnis`, `Befund`            | Werkzeuge der Kapitel, Hinweisstufen                              | `analyse/werkzeug.ts`                     |
| `k1-zaehlen`                                        | Zählen von Angreifern und Verteidigern (Kapitel 1)                | `analyse/k1-zaehlen.ts`                   |
| `Markierung` (Pfeil, Feld) in `gold`, `rot`, `grau` | Farbcode der Diagramme                                            | `analyse/werkzeug.ts`, `ui/brett/`        |
| `zugfolgeAlsText`                                   | Notation (Kapitel 0)                                              | `schach/notation.ts`                      |
| `Wert`, `wertInWorten`                              | Bewertung („leicht besser“)                                       | `engine/`                                 |
| `Uebung` (`nummer`, `aufgabe`, `loesung`)           | „Übung 4“ im Kasten „Übungen zu diesem Kapitel“                   | `schemas/uebung.schema.json`              |
| `Steckbrief`                                        | Eröffnungssteckbrief                                              | `schemas/bilanz.schema.json`              |
| `Bilanz` (`art` ziel/faktor, `wertung`)             | Zielbilanz (✓ ◐ ✗), Faktorenbilanz (Waage)                        | `schemas/bilanz.schema.json`              |
| `Glossar`, `stellen`, `verweise`                    | Glossar, Seitenverweis, Pfeil →                                   | `schemas/glossar.schema.json`             |
| `Zugfolge`, `Zug` (`san`, `zeichen`)                | Zugfolge im Text, Zugzeichen (!, ?, ??)                           | `lesen/zugfolgen.py`                      |
| `Beispiel`, `Knoten`, `Abzweigung`                  | Beispiel des Buches, Hauptvariante und Abzweigungen (Konzept 4.2) | `zugfolgen/baum.py`                       |
| `Anschluss`, `Spitze`, `Nebenlinie`                 | – (wo eine Zugfolge im Text weitergeht)                           | `zugfolgen/nachspielen.py`                |
| `Befund`, `Schwere`                                 | Meldung an den Autor im Bericht                                   | `pipeline/befunde.py`                     |
| `Stapel`, `Ansicht`                                 | – (Navigation der App)                                            | `app/stapel.ts`                           |
