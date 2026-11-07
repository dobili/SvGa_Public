# Messlauf „Fehler mit Buchbezug“

Stand 7.11.2026 · Schritt 4 aus `docs/KONZEPT_FEHLER_BUCHBEZUG.md`, Abschnitt 7 · Messskript
`app/src/spiel/buchbezug.messung.ts` (nicht in `npm run pruefen`)

## Kurz gesagt

- **Gut die Hälfte der Fehlzüge bekommt eine Kategorie:** 51,6 % aller Züge ab „ungenau“, 56,2 %
  der Fehler, Patzer und verpassten Gewinne. Der Rest bleibt ohne Zeile („besser keine Erklärung
  als eine falsche“).
- **Schnell genug:** 8,6 ms je Fehlzug am Rechner für Warum, Finden und alle Finde-Kategorien
  zusammen (Konzept: unter 50 ms). Am Handy etwa das Drei- bis Fünffache; die Startseite liest
  deshalb nur gespeicherte Kürzel.
- **Sieben Schwellen und Regeln nachgestellt**, alle bei den Finde-Kategorien (F3, F6, F7, F8, F9,
  F10 und die Auswahl auf der Karte). Die Warum-Kategorien kommen aus der schon geeichten
  Erkennung der Fehlerarten und blieben unverändert.
- **Selten, wie erwartet:** W1 (Falle aus dem Buch) traf in 597 Partien nie, F6 (Opposition) dreimal,
  F2 (Rettung) und F7 (Freibauer) je fünfmal.

## Grundlage

- 597 Lichess-Partien (Schnell- und Blitzpartien von Menschen um 1000 bis 2000 Elo) aus der Eichung
  der Menschenprofile, nur lokal (`buch/arbeit/menschenprofil2/stellungen-0.jsonl`). Je Stellung
  liegen die sechs besten Züge und weitere Züge mit Wert und acht Halbzügen Fortsetzung vor.
- Daraus baut das Skript Partien der App: Wert je Stellung (bester Zug), bester Zug, Abstand zum
  zweitbesten Zug, Variante mit sechs Halbzügen wie in der App. Die Urteile (ungenau, Fehler,
  Patzer, Verpasst) rechnet dieselbe Funktion wie die Auswertung.
- Gezählt werden beide Seiten, alle 12 509 Züge ab „ungenau“, davon 6525 Fehler, Patzer und
  verpasste Gewinne. Die Kategorien kommen aus denselben Regeln wie die Karte und die gespeicherten
  Kürzel (`spiel/buchzuege.ts`, `spiel/buchkuerzel.ts`), mit Fallenindex (Kapitel 4) und
  Eröffnungsindex (Kapitel 2 und 3).
- Aufruf (im Ordner `app/`):
  `ARBEIT=<Pfad zu buch/arbeit> PARTIEN=600 npx vitest run --config vitest.messung.config.ts src/spiel/buchbezug.messung.ts`;
  die Stichproben (je Kategorie fünf, gleichmäßig verteilt) schreibt es nach
  `buch/arbeit/buchbezug/messung.txt`.

## Häufigkeit je Kategorie

„Karte“: die Zeile, die die Karte zeigt (höchstens eine je Richtung, Vorrang nach Konzept 4.1,
Doppeltes weggelassen). „Alle“: wie oft eine Finde-Kategorie überhaupt zutrifft.

| Kategorie                          | Karte | Alle |
| ---------------------------------- | ----: | ---: |
| W1 Falle aus dem Buch              |     0 |      |
| W2 Matt zugelassen                 |   178 |      |
| W3 Drohung stehen gelassen         |  1662 |      |
| W4 Material eingestellt            |   634 |      |
| W5 Abtausch verrechnet             |   222 |      |
| W6 Köder geschluckt                |   134 |      |
| W7 Taktik des Gegners übersehen    |   618 |      |
| W8 Todsünde der Eröffnung          |   298 |      |
| W9 Bauernzug mit Folgen            |  1267 |      |
| W10 Endspielregel                  |   365 |      |
| F1 Matt war möglich                |    81 |   81 |
| F2 Rettung durch Dauerschach/Patt  |     5 |    5 |
| F3 Motiv im besseren Zug           |   261 |  297 |
| F4 Guter Schlag ausgelassen        |   857 |  934 |
| F5 Schach, Schlag oder Drohung     |   177 |  584 |
| F6 Opposition und Schlüsselfelder  |     3 |    3 |
| F7 Freibauer und Quadrat           |     5 |    7 |
| F8 Buchzug deiner Eröffnung        |   163 |  179 |
| F9 Eröffnungsziel                  |    80 |  138 |
| F10 Am wenigsten aktive Figur      |    25 |   42 |

W3 und W9 sind am häufigsten; W9 und W10 vor allem bei „ungenau“, das auf der Startseite nicht
zählt. Bei W9 ist das erwartet (mittlere Zuverlässigkeit, strengere Schwelle 4 Partien und 40 %).

## Geänderte Schwellen und Regeln

Vorher und nachher gemessen an den ersten 198 Partien (F3 105 → 73 Treffer, F10 24 → 11, F4
241 → 272, F7 3 → 2), danach an allen 597.

| Kategorie | Änderung                                                                                                   | Grund (Fehlalarm in der Stichprobe)                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| F3        | schweigt, wenn schon der Schlag des besten Zuges den ganzen Gewinn erklärt (Abtauschbilanz ≥ Gewinn); dann F4 | `1n2k2r/4b2p/2r2p2/1Q6/5BPp/5K2/Pq4PP/RN6 w k - 0 25`, gespielt Lxb8, besser Dxb2: nahm eine ungedeckte Dame und hieß „Fesselung“            |
| F10       | neue Schwelle `lapFreieFelderBis = 5`: Die Figur hat höchstens fünf freie Felder (Läufer c1 in Abb. 6.20 hat fünf) | `r4rk1/pppbqppp/2n5/3p4/8/1P1PPNP1/3N1PBP/1R1Q1RK1 b - - 0 14`, Springer c6 mit sechs freien Feldern als „am wenigsten aktiv“ |
| F10       | nur ruhige beste Züge (kein Schlag, kein Schach)                                                           | `r3rk2/pp4pp/2p2pn1/3p2q1/3P2QN/2P3PP/PP4K1/R4R2 b - - 5 23`, besser Sxh4+ (ein Schlag mit Schach) als „Planzug“                           |
| F9, F10   | nie bei Patzer und „Verpasst“                                                                              | `r1bq1rk1/ppp1npb1/3p1np1/3Pp2p/2P5/P1NBPN2/1PQ2PPP/R1B1K2R w KQ - 1 10`, gespielt b4 (Patzer), besser e4: Ein großer Ausschlag ist kein Faustregelfehler |
| F6        | ohne Datenbank nur, wenn der Gegner keinen Freibauern hat                                                  | `8/8/6K1/4k1P1/7P/8/5p2/8 w - - 0 54`, besser Kg7 „nimmt die Opposition“, während der schwarze f-Bauer auf f2 steht (Wettrennen)               |
| F7        | „Umwandlung“ nicht, wenn der gespielte Zug selbst umwandelt                                                 | `4R3/8/P7/6p1/5k2/1P2p3/1P3p1K/8 b - - 0 41`, gespielt f1=D, besser e2: „Mit e2 kommt dein Bauer zur Umwandlung“                              |
| F8        | Name der Eröffnung nach dem Buchzug statt vor ihm                                                          | `r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3`, Buchzug d4 hieß „Spanische Partie“; jetzt „Schottische Partie“            |
| Karte     | Findezeile entfällt, wenn sie dieselbe Übung öffnet wie die Warum-Zeile                                     | 12. O-O-O?? der Testpartie: „Drohung stehen gelassen“ und „Schach, Schlag oder Drohung zuerst“, beide Schach-Röntgen-Regel; Karte zu hoch      |

Dazu ein Textfehler: Das allgemeine „Matt“ ist kein Mattbild; die Zeile sagt dann nur „Matt in
zwei Zügen“ statt „Ein Mattbild aus Kapitel 7: Matt.“

Die Version der Regeln (`BUCHBEZUG_REGELN` in `spiel/buchkuerzel.ts`) steht auf 1; ändert sich
eine Schwelle, steigt sie, und die App rechnet die gespeicherten Kürzel im Leerlauf neu.

## Stichproben (Auswahl, nach der Änderung)

Je Kategorie fünf Treffer angesehen; hier je einer. Schachlich stimmig, wo nicht anders vermerkt.

| Kategorie | Stellung (FEN)                                                         | Gespielt (Urteil) | Besser | Befund                                                     |
| --------- | ---------------------------------------------------------------------- | ----------------- | ------ | ---------------------------------------------------------- |
| W2        | `r1b1k2r/1p1n1pBp/p3p3/2b5/2P5/2NQ2P1/Pq3PBP/3RK2R w Kkq - 0 16`         | Lxh8 (Patzer)     | O-O    | Dxf2# folgt; stimmt                                         |
| W3        | `r3r1k1/pp3ppp/2p5/6q1/2PNn1n1/1P2P1P1/PBQ1R2P/R5K1 w - - 5 21`          | h4 (Fehler)       | Sf3    | Sxe3 drohte vorher und danach; stimmt                       |
| W4        | `1r1qr1k1/3Nbpp1/2Q1p2p/3p4/3P4/4P1P1/1PR2PP1/2R3K1 b - - 4 30`         | Tc8 (Patzer)      | Ta8    | gezogener Turm hängt; stimmt                                |
| W5        | `rnb1k2r/3p1ppp/2pb1n2/pp2P2q/3P1p2/PB3N2/1PP3PP/RNBQ1R1K b kq - 0 11`  | Lxe5 (Fehler)     | Lc7    | Schlag kostet Material; stimmt                              |
| W5        | `1Bk4r/7p/3Q1p2/8/6Pp/5K2/P5PP/qN6 w - - 5 31`                           | Dxf6 (Patzer)     | Dc7#   | fraglich: Der eigentliche Grund ist das verpasste Matt (F1 steht daneben); offen |
| W6        | `rnbqkbnr/ppp3pp/8/3P1p2/3Pp3/5P2/PP1NP1PP/RNBQKB1R b KQkq - 0 6`         | Dxd5 (Fehler)     | e3     | Bauernraub der Dame; stimmt                                 |
| W7        | `r2qkb1r/pp2pppp/2np1n2/8/4P1b1/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 2 7`      | e5 (Fehler)       | Lb5    | dxe5 mit Abzug auf die Dame d1; stimmt                      |
| W8        | `r1b2rk1/ppp2ppp/2n4q/3pp3/8/1PP1PN1P/P2PBP2/RN1QK2R w KQ - 0 12`         | h4 (Fehler)       | d4     | König in der Mitte bei möglicher Rochade; stimmt             |
| F1        | `6k1/5pp1/4p2p/2r5/PR6/3B3P/1P3PPK/1n6 w - - 1 31`                        | a5 (ungenau)      | Tb8+   | Grundreihenmatt in 2; stimmt                                |
| F2        | `6k1/5rp1/3NQ2p/8/1p6/1R4PP/1P3q2/7K b - - 4 42`                          | Df3+ (Patzer)     | Df1+   | Dauerschach; stimmt                                         |
| F3        | `2r2rk1/pQ4p1/8/5b2/1P1n4/P7/5NPP/4RRK1 w - - 1 27`                        | Te7 (Fehler)      | Dd5+   | Doppelangriff mit Schach; stimmt                            |
| F4        | `rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2`            | d5 (Fehler)       | dxe5   | Bauer e5 ungedeckt; stimmt                                  |
| F5        | `rnb1kb1r/ppppqppp/5n2/8/2B1Pp2/3P1N2/PPP3PP/RNBQK2R b KQkq - 0 5`        | c6 (Patzer)       | d5     | Drohung zuerst, gewinnt eine Figur; stimmt                  |
| F5        | `rn1qkbnr/ppp2ppp/3pb3/4p3/8/5NP1/PPPPPPBP/RNBQK2R w KQkq - 2 4`          | O-O (ungenau)     | d4     | Grenzfall: Gewinn ein Bauer erst über die Fortsetzung        |
| F6        | `8/7k/8/8/5PK1/8/8/8 w - - 0 63`                                          | Kg5 (Patzer)      | Kf5    | Datenbank und Opposition; stimmt                            |
| F7        | `8/ppp5/5k2/3K4/1P5p/P7/8/8 w - - 0 49`                                   | b5 (Fehler)       | Ke4    | König ins Quadrat des h-Bauern; stimmt                      |
| F8        | `rnbqkbnr/pppp1ppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1R b KQkq - 1 3`            | De7 (ungenau)     | g5     | Buchzug im Königsgambit; stimmt                             |
| F9        | `rnbq1rk1/ppp2ppp/8/8/2Bp1QP1/8/PPP2P1P/RNB1K2R w KQ - 1 10`              | Ld3 (ungenau)     | O-O    | Rochade; stimmt                                             |
| F10       | `r2q1rk1/ppp2p2/2n2n1p/b2p4/6bP/2PPPN2/PBQ1BP2/RN2K2R w KQ - 1 16`        | d4 (Fehler)       | Sbd2   | Springer b1 mit zwei freien Feldern; stimmt                 |

## Offen

- **W5 neben einem verpassten Matt** (Stichprobe oben): Die Karte zeigt dann W5 und F1; F1 wäre
  allein klarer. Kandidat für eine Regel „F1 vor W5“, sobald mehr solche Fälle vorliegen.
- **F5 mit Gewinn von nur einem Bauern** über vier Halbzüge ist bei „ungenau“ ein Grenzfall. Die
  Startseite zählt „ungenau“ nicht; auf der Karte steht es nur im Rückblick.
- **W1 und F6** sind in Lichess-Partien zu selten für eine Aussage; sie sind an den
  Buchabbildungen getestet (Kapitel 4 und 8).
- Die zweite empfohlene Messung (Konzept 5.8 b, etwa 100 zufällige Karten auf dem Handy ansehen)
  bleibt beim Autor.
