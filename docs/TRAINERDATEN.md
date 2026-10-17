# Trainerdaten (Zuarbeit zu AP 13, Fable, 16./17.10.2026)

Zweig `trainerdaten`. Alles Neue liegt in `pipeline/trainer/`, `schemas/trainer-*.schema.json`,
`inhalte/de/trainer/` und `pipeline/tests/test_trainer_*.py`; die App, `docs/FORTSCHRITT.md` und
die Lösungstexte sind unverändert. Opus übernimmt den Zweig, wenn er grün ist.

## Aufgabe 1: Lösungen der 86 Übungen mit Stockfish gegengeprüft

Datei `inhalte/de/trainer/uebungen-engine.json` (Schema `trainer-uebungen-engine.schema.json`),
erzeugt mit `python -m pipeline.trainer.uebungen` (Engine über `cd app && npm ci`, Dauer etwa
eine Stunde auf einem Kern).

Maßstab (Startwerte wie bei der Engine-Prüfung der Zugzeichen): **gleichwertig** = höchstens 0,3
Bauerneinheiten hinter dem besten Zug; **schwächer** = bis 1,0; **widerlegt** = mehr als 1,0 oder
ein Matt übersehen; **einziger Zug** = jeder andere Zug mindestens 1,0 schlechter. Ein längeres
Matt gilt als gleichwertig zu einem kürzeren, ein Zug ohne Matt nie als gleichwertig zu einem Matt.
Erster Zug: Tiefe 14 über alle Züge, dann Tiefe 20 für Buchzug, akzeptierte Züge und alles bis
0,6 hinter dem besten („searchmoves“); die weiteren eigenen Züge der Buchlinie: Tiefe 18.

Für die App (Opus): Beim Lösen gilt ein Zug als richtig, wenn er `buchzug` ist, in
`akzeptiertBuch` steht (vom Autor freigegeben) oder in `vorschlagAkzeptiert` steht, **sobald der
Autor den Vorschlag freigegeben hat** (bis dahin nur die ersten beiden; die Vorschläge stehen
unten). `einzigerZug` sagt, ob die App „Nur ein Zug führt zum Ziel“ anzeigen kann. Übungen mit
`art` „ohneZug“ (Fragen, Bilanzen) oder „ohneStellung“ (mehrere oder keine Abbildung) bekommen
nur den Stellungswert.

**Ergebnis (Lauf vom 16.10.2026, Stockfish 19 lite):** 86 Übungen, davon 63 mit Lösungszug und
Stellung geprüft, 16 ohne Lösungszug (Fragen, Bilanzen: 7, 14, 16, 17, 23 bis 30, 33, 50, 72, 79;
nur Stellungswert), 7 ohne eindeutige Stellung (1, 3, 18, 21, 22, 85, 86). Von den 63:

- **56 halten** (der Buchzug ist der beste oder gleich gut), **6 gleichwertig** (ein anderer Zug
  ist bis 0,3 besser), **1 schwächer**, **keine widerlegt**. Alle Buchlinien halten auch in den
  weiteren eigenen Zügen (keine Abweichung über 0,3).
- **37 Übungen haben nur einen Zug** (`einzigerZug`): 4, 8, 10, 19, 31, 32, 34 bis 38, 40 bis 47,
  49, 53 bis 55, 57 bis 59, 62, 63, 68, 69, 74, 76 bis 78, 80 bis 82.
- **Vorschläge für „akzeptiert“** (gleich gut laut Engine; der Autor entscheidet):
  - Übung 2 (0.26, Buch 6... h6): a6, Le7, d6, a5 (alle etwa +0,1; die Übung fragt nach
    Notation, nicht nach dem besten Zug).
  - Übung 6 (1.42, Buch 4... Sf6, akzeptiert Lc5): dazu Df6, Lb4+, Sxd4.
  - Übung 11 (2.151, Buch 4... h5, akzeptiert h6): dazu Dc7, Da5+, a6.
  - Übung 15 (3.81, Buch 4... d5): dxc3, Sf6.
  - Übung 39 (7.51, Buch 1. Sf4+): Sxf6+ gewinnt ebenfalls klar (Abzugsschach mit Schlag).
  - Übung 60 (8.65, Buch 1. g5): Ke3, Kd4, Kd3, Kf3 gewinnen laut Engine genauso (+6,3); die
    Übung lehrt eine Technik („Freibauer erst mit König davor“), Vorschlag: nicht annehmen.
  - Übung 66 (9.47, Buch 1. Te4, akzeptiert Tc1): Te6, Td1, Tf1, Kd8, Kd7 gewinnen auch (Lucena,
    alle über +5); Technikfrage wie bei 60.
- **Technikfragen** (mehr als fünf gleichwertige Züge, kein Vorschlag): 13 (2.153, Zugumstellung,
  18 Züge), 20 (4.55, 7 Züge), 61 (8.66, 8), 64 (9.45, 8), 84 (12.6, 23). Beim Lösen in der App
  sollten dort nur Buchzug und akzeptierte Züge zählen.
- **Befunde für den Autor:**
  - Übung 83 (12.5, Kandidatenzüge): 1. Dc2 ist +1,17, 1. Te1 +1,61 (0,44 schwächer, „?!“ nach
    dem Maßstab der Zugzeichen). Die Übung fragt nach der stärksten Antwort auf Kandidaten;
    die Lösung bleibt vertretbar, nur zur Kenntnis.
  - Übung 70 (9.51, akzeptiert 1... Ta1+): laut Engine 1,8 schlechter als 1... Tb8 (+6,41),
    beide gewinnen aber (über +4,5). Vorschlag: so lassen.
  - Übung 65 (9.46, Buch 1... Kg8): 1... Ta6+ ist 0,13 besser (beides remis); kein Handlungsbedarf.
  - Übung 13 (2.153, Buch 7. Lg5): 18 gleichwertige Züge, Zugumstellung ist eine Wissensfrage.

## Aufgabe 2: Aufgaben für drei Trainer

Je Trainer eine Datei `inhalte/de/trainer/<kennung>.json` (Kennungen wie in
`app/src/training/trainer.ts`: `taktik`, `falle`, `struktur`), Schemas `trainer-taktik`,
`trainer-falle`, `trainer-struktur` mit gemeinsamen Bausteinen in `trainer-gemeinsam.schema.json`.
Jede Aufgabe hat Stellung (FEN), Seite, erwartete Antwort, Schwierigkeit 1 bis 5, Herkunft und die
Messung, aus der die Schwierigkeit folgt. Züge stehen in englischer Kurznotation wie in den
Buchdaten; die App schreibt sie deutsch.

### Schwierigkeit: so gemessen

- **Lichess-Aufgaben** tragen eine Wertung aus Millionen Lösungsversuchen echter Spieler
  (Elo-artig). Stufen: 1 bis 999, 2 bis 1299, 3 bis 1599, 4 bis 1899, 5 ab 1900
  (`schwierigkeit.py`). Nur Aufgaben mit sicherer Wertung (Abweichung ≤ 80), ab 200 Partien und
  Beliebtheit ≥ 70.
- **Engine-Messung für jede Aufgabe**, auch die aus dem Buch: die Suchtiefe, ab der Stockfish den
  Lösungszug für den besten hält und bis Tiefe 16 dabei bleibt (`engine.tiefe_bis_loesung`), und
  die Länge der Lösung in eigenen Zügen. Daraus eine Messklasse (Tiefe bis 2 / 5 / 9 / darüber,
  Länge 1 / 2 / länger). **Eichung:** Für jede Messklasse der Median der Lichess-Wertungen ihrer
  Aufgaben → Stufe; Buchaufgaben bekommen die Stufe ihrer Messklasse (Tabelle `eichung` in der
  Datei). So ist die Stufe einer Buchaufgabe an gemessene Spielerdaten gebunden, nicht geschätzt.
- **Strukturerkenner** ohne Engine (eine Stellungsbewertung sagt nichts darüber, wie schwer eine
  Struktur zu erkennen ist): 1, +1 ab drei Bauernmerkmalen beider Seiten, +1 ab fünf, +1 ab acht
  Figuren außer Bauern und Königen, +1 ab zwölf.

### Taktiktrainer (`taktik.json`, Kapitel 7)

674 Aufgaben: 37 aus dem Buch, 637 aus der Lichess-Datenbank; `python -m pipeline.trainer.taktik
--lichess <Stichprobe> --je-gruppe 8` (die Stichprobe entsteht aus der 300-MB-Datenbank mit
`lichess.lies_datenbank`, nur lokal; Dauer des Baus etwa 45 Minuten).

- **Buch:** Abbildungen aus Kapitel 7 mit freigegebener Zugfolge, deren Fortsetzung ab der
  Abbildung laut Engine ein klarer Gewinnzug ist (bester Zug, zweitbester mindestens 0,8
  schlechter oder höchstens zwei gleich gute, Gewinn mindestens 1,5 oder Matt oder Rettung), dazu
  die Übungen mit Lösungszug und taktischem Motivtext (ohne Kapitel 8 und 9, die gehören zum
  Endspieltrainer). Motiv aus dem Unterabschnitt („4. Batterie und Abzug“ → `abzug`) oder dem
  Motivtext der Übung; Mattbild aus dem Titel. Abbildungen, die nur ein Motiv zeigen, ohne dass
  die Seite am Zug gewinnt (etwa 7.1, 7.3), fallen weg; 10 Buchaufgaben haben nur ein Mattbild
  und kein Grundmotiv.
- **Lichess:** je Grundmotiv (11 der 12; für „Rettung“ hat Lichess kein Thema) und je Mattbild
  (Grundreihe, Anastasia, Arabisch, Erstickung, Boden) und je Stufe 8 Aufgaben, höchstens drei
  eigene Züge, genau ein Motiv der Buchtabelle unter den Themen. Lösungen sind dort eindeutig,
  `akzeptiert` bleibt leer.
- **Eichung** (Messklasse → Stufe, aus den 637 Lichess-Aufgaben): t0-l0 → 1, t0-l1 → 3,
  t0-l2 → 4, t1-l1 → 3, t1-l2 → 4, t2-l1 → 4, t2-l2 → 5, t3-l2 → 4 (t = Tiefenklasse, l =
  Längenklasse). Lesart: Die Länge der Lösung wiegt schwerer als die Tiefe, weil Stockfish
  erzwingende Opfer schon bei Tiefe 1 sieht. Buchaufgaben: 8 × Stufe 1, 15 × Stufe 3, 14 × Stufe 4.
- Felder je Aufgabe: `loesung` (eigene und gegnerische Züge im Wechsel), `akzeptiert`
  (gleich gute erste Züge, nur Buch), `motiv`, `mattbild`, `schluesselfeld` (Figur des
  Schlüsselzugs, Hilfe 3), `ziel` (matt, gewinn, rettung), `herkunft` (Abbildung, Übung,
  Zugfolge; oder Lichess-Kennung, Wertung, Partie, Themen), `messung`. Das Warnsignal (Hilfe 1)
  rechnet die App mit k7-warnsignale aus der Stellung.

### Falle oder Köder (`falle.json`, Kapitel 4)

132 Aufgaben: 12 aus dem Buch, 120 aus der Lichess-Datenbank; `python -m pipeline.trainer.falle
--lichess <Stichprobe> --je-stufe 12` (Dauer etwa zwei Stunden, die Engine siebt dreimal so viele
Kandidaten wie gebraucht).

- **Aufgabe:** Die Engine hat gezogen und bietet Material an (`angebot`, der Schlag in
  Kurznotation). Antwort **Falle** = Nehmen verliert laut Engine (Tiefe 18) mindestens 1,5
  Bauerneinheiten gegenüber dem besten Zug (`verlustBeimNehmen`, `bester`, die Widerlegung in
  `fortsetzung`); **Geschenk** = Nehmen ist bis 0,3 hinter dem besten Zug. Dazwischen keine
  Aufgabe (Maßstab in der Datei).
- **Buch:** die Fallenchecks aus Kapitel 4, jeweils der erste Schlag mit Fragezeichen in der
  Zugfolge des Beispiels, die Widerlegung ist die Fortsetzung des Buches: Klammerfalle (4.2),
  Halosar (4.10), Elefantenfalle (4.13), Légal (4.17), Kieninger (4.21), Benko (4.24), Sibirische
  Falle (4.29), Arche Noah (4.34), abgelehntes Königsgambit (4.38), Blackburne-Shilling (4.41,
  1,99 Verlust, deshalb Grenze 1,5), Damenfalle im Dänischen Gambit (4.45), Damenfang auf b2
  (4.48); alle mit Antwort „Falle“. „Kompromittierte Verteidigung“ und „Springergabel auf c7“
  haben keinen Schlag mit Fragezeichen und fallen weg. Geschenke gibt es im Buch nicht als
  Fallencheck; die kommen aus Lichess.
- **Lichess:** je Stufe 12 Fallen (Aufgaben, in denen ein Schlag Material zu gewinnen scheint
  und die Lösung ein anderer Zug ist) und 12 Geschenke (Thema `hangingPiece`, die Lösung
  beginnt mit dem Schlag), von der Engine bestätigt.
- **Eichung** (Messklasse → Stufe, Messung = Tiefe, ab der die Engine das Urteil fällt und
  dabei bleibt): t0-l0 → 3 (112 Lichess-Aufgaben, Median 1395), t1-l0 → 5 (Median 1928);
  tiefere Klassen übernehmen die Nachbarklasse. Buch: 5 × Stufe 3 (Halosar, Légal, Sibirisch,
  abgelehntes Königsgambit, Dänisch), 7 × Stufe 5 (Klammer, Elefant, Kieninger, Benko, Arche Noah,
  Blackburne-Shilling, Damenfang). Lesart: Fallen, deren Widerlegung die Engine erst ab Tiefe 3
  sieht, lösen auch starke Spieler selten (Lichess-Median über 1900). Für die Stufen 1, 2 und 4
  gibt es nur Lichess-Aufgaben.
- Felder je Aufgabe: `fen`, `amZug`, `angebot`, `antwort`, `verlustBeimNehmen`, `bester`,
  `fortsetzung`, `schwierigkeit`, `herkunft` (Abbildung, Beispiel, Fallencheck; oder
  Lichess-Kennung, Wertung, Partie, Themen), `messung`. Die Warnsignale (Pflichtenheft 7: der
  Leser markiert sie) rechnet die App mit k4-warnsignale aus der Stellung.

### Strukturerkenner (`struktur.json`, Kapitel 5)

134 Aufgaben, alle aus Buchabbildungen: die 46 Abbildungen aus Kapitel 5 mit Struktur, Seite und
Plan-Satz nach dem Unterabschnitt, in dem das Buch sie zeigt (Tabelle `BUCHSTRUKTUREN` in
`struktur.py`, Vorschlag), dazu 88 Abbildungen aus den Kapiteln 2, 3, 6, 11 und 12, in denen die
Pipeline eine einzige klare Struktur findet (Isolani, hängende Bauern, Minderheitsangriff,
Doppelbauer, festgefahrene Kette, Mehrheit; gleiche Skelette nur einmal). Der Plan gilt für die
Seite am Zug (Besitzer der Struktur oder Gegenseite, Tabellen `PLAN_BESITZER` und
`PLAN_GEGNER`). Die Antworten auf die vier Leitfragen rechnet die App aus der Stellung mit ihren
Werkzeugen (k5-felder, k5-bauern, k5-richtung, k5-figuren); die Datei nennt zusätzlich, was die
Pipeline im Skelett gefunden hat (isolierte, doppelte, rückständige Bauern, Freibauern, Inseln).
Die Plan-Sätze selbst (Texte zu den Schlüsseln `vorpostenBesetzen`, `isolaniBlockieren`, …) gehören
in die App (`i18n/de.json`).

## Lizenzen (Opus trägt sie in `docs/LIZENZEN.md` ein)

| Teil                                                                                                                 | Lizenz                  | Hinweis                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Zusatzaufgaben aus der Lichess-Puzzle-Datenbank (`inhalte/de/trainer/taktik.json`, `falle.json`, Herkunft `lichess`) | CC0 1.0 (gemeinfrei)    | https://database.lichess.org/#puzzles; je Aufgabe Kennung, Wertung und Partie-Adresse; keine Pflichten, Herkunft genannt |
| Aufgaben aus dem Buch (Herkunft `buch`)                                                                              | Alle Rechte vorbehalten | nur Stellungen und Züge, kein Buchtext                                                                                   |

## Entscheidungen und Rückfragen

Alles plausibel entschieden, wie vom Autor gewünscht; was er anders will, ist je ein Parameter.

- **Maßstab der Engine-Prüfung (Aufgabe 1):** gleichwertig bis 0,3, schwächer bis 1,0, darüber
  widerlegt, einziger Zug ab 1,0 Abstand (`uebungen.py`), dieselben Schwellen wie bei der
  Engine-Prüfung der Zugzeichen in der Pipeline. Ein längeres Matt kostet 0,5 je Zug, damit „Matt
  in 2“ und „Matt in 9“ nicht als gleich gelten. In gewonnenen Stellungen (beide Züge über +5)
  gelten alle gewinnenden Züge als gleichwertig; haben mehr als fünf Züge diese Eigenschaft, ist
  es eine Technikfrage und es gibt keinen Vorschlag (die Übung lehrt einen Weg, nicht den
  einzigen). „einziger Zug“ nur, wenn kein anderer Zug gleichwertig oder akzeptiert ist.
  **Rückfrage A1:** Sollen die Vorschläge für „akzeptiert“ (Übungen 2, 6, 11, 15, 39) in die
  Lösungstexte, und soll Übung 83 (Dc2 statt Te1) bleiben?
- **Zwei Stufen der Engine-Rechnung:** Tiefe 14 für alle Züge, Tiefe 20 nur für die Kandidaten
  (Buchzug, akzeptierte, alles bis 0,6 hinter dem besten) über `searchmoves`; Buchlinien mit
  Tiefe 18. Grund: Tiefe 20 über alle Züge brauchte 80 Sekunden je Übung, so sind es etwa 40 bei
  gleichem Urteil; `game=object()` je Aufruf, damit die Engine ohne Hash-Erinnerung rechnet und
  der Lauf wiederholbar ist.
- **Lichess-Puzzles als Zusatzquelle:** Nur Aufgaben mit sicherer Wertung (Abweichung ≤ 80, ab
  200 Partien, Beliebtheit ≥ 70), höchstens drei eigene Züge, genau ein Motiv der Buchtabelle
  unter den Lichess-Themen (`MOTIV_JE_THEMA`: fork → Doppelangriff, pin → Fesselung, skewer →
  Spieß, discoveredAttack/discoveredCheck → Abzug, doubleCheck → Doppelschach, attraction und
  clearance → Hinlenkung, capturingDefender → Beseitigung, deflection → Überlastung, intermezzo →
  Zwischenzug, trappedPiece → Gefangene Figur, promotion → Umwandlung; Mattbilder backRankMate,
  anastasiaMate, arabianMate, smotheredMate, bodenMate). Feste Zufallsquelle (Startwert
  20261016), damit derselbe Lauf dieselben Aufgaben liefert. Für „Rettung“ (Dauerschach, Patt)
  und „Räumung“/„Ablenkung“/„Batterie“/„Desperado“ hat Lichess kein eigenes Thema; dort gibt es
  nur Buchaufgaben. **Rückfrage A2:** 8 Lichess-Aufgaben je Motiv und Stufe (637) und 12 je
  Fallenart und Stufe (etwa 120): genug, zu viel, oder lieber mehr Stufen 1 bis 3?
- **Schwierigkeit gemessen statt geschätzt:** Stufen aus der Lichess-Wertung (1000, 1300, 1600,
  1900 als Grenzen, etwa die Spielstärken, die die Stufen 2 bis 5 des Buches meinen); Buchaufgaben
  über die Messklasse (Suchtiefe bis zum Lösungszug, Länge) an den Median der Lichess-Aufgaben
  derselben Klasse geeicht, erst ab fünf Aufgaben je Klasse (sonst eicht eine einzelne Aufgabe).
  Beim Strukturerkenner ohne Engine (siehe oben). **Rückfrage A3:** Soll der Autor die Stufe
  einzelner Buchaufgaben von Hand setzen können? Dann ein Feld `stufeAutor` in der Datei.
- **Taktiktrainer:** Aus Kapitel 7 nur Abbildungen, in denen die Seite am Zug laut Engine klar
  gewinnt (zweitbester Zug mindestens 0,8 schlechter oder höchstens zwei gleich gute; Gewinn
  mindestens 1,5, Matt oder Rettung), sonst ist es ein Lehrbild, keine Aufgabe. Übungen aus
  Kapitel 8 und 9 gehören zum Endspieltrainer, nicht hierher. Das Motiv der Übungsabbildungen
  7.44 bis 7.61 kommt aus dem Motivtext der Übung (sie haben keinen Unterabschnitt). Ein Matt am
  Ende der Lösung zählt als Ziel „matt“, auch wenn das Motiv ein anderes ist.
- **Falle oder Köder:** Eine Aufgabe ist ein Angebot (Material zu nehmen) mit der Antwort
  „Falle“ (das Nehmen verliert laut Engine mindestens 1,5 Bauerneinheiten, Tiefe 18; 1,5 statt
  2, weil die Blackburne-Shilling-Falle 1,99 ergab) oder „Geschenk“ (das Nehmen ist bis 0,3
  hinter dem besten Zug). Aus dem Buch: die Fallenchecks aus Kapitel 4, der erste Schlag mit
  Fragezeichen in der Zugfolge des Beispiels („Kompromittierte Verteidigung“ und „Springergabel
  auf c7“ haben keinen solchen Schlag und fallen weg). Aus Lichess: Fallen = Aufgaben, in denen
  der Lösungsweg einen scheinbaren Gewinn widerlegt; Geschenke = Thema `hangingPiece` (die Figur
  hängt wirklich). **Rückfrage A4:** Sollen Fallen aus Kapitel 2 und 3 (Zugfolgen mit „?“ nach
  einem Schlag, etwa das Damengambit mit 3... b5?) dazu? Die Pipeline könnte sie genauso ziehen.
- **Strukturerkenner:** Die Tabelle `BUCHSTRUKTUREN` (Abbildung → Struktur, Seite, Plan) ist aus
  den Unterabschnitten von Kapitel 5 abgeleitet und ein **Vorschlag zur Durchsicht** (Rückfrage
  A5), ebenso die Plan-Schlüssel (`vorpostenBesetzen`, `isolaniBlockieren`, `minderheitsangriff`,
  …), deren Sätze Opus in `i18n/de.json` schreibt. Ketten zählen nur, wenn ihr Kopf blockiert ist
  (sonst wäre jede Eröffnung eine „Kette“); gleiche Bauernskelette aus anderen Kapiteln nur einmal.
- **Öffentlich:** Dateien enthalten nur FEN, Züge, Kennungen, Nummern und Lichess-Kennungen;
  keine Buchtexte, keine Lösungstexte. Die Lichess-Datenbank (300 MB) und die Stichprobe bleiben
  lokal (nur die Kennungen stehen in den Daten; `--lichess` erwartet die Stichprobe).
- **Für Opus:** `docs/LIZENZEN.md` um die Zeile aus dem Abschnitt „Lizenzen“ ergänzen; die
  Plan-Sätze und Motivnamen kommen aus `i18n/de.json`; `pipeline.pruefen.daten` prüft die
  Trainerdateien noch nicht (die Tests `test_trainer_daten.py` tun es gegen die Schemas).
