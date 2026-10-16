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

ERGEBNIS_FALLE

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

| Teil | Lizenz | Hinweis |
|---|---|---|
| Zusatzaufgaben aus der Lichess-Puzzle-Datenbank (`inhalte/de/trainer/taktik.json`, `falle.json`, Herkunft `lichess`) | CC0 1.0 (gemeinfrei) | https://database.lichess.org/#puzzles; je Aufgabe Kennung, Wertung und Partie-Adresse; keine Pflichten, Herkunft genannt |
| Aufgaben aus dem Buch (Herkunft `buch`) | Alle Rechte vorbehalten | nur Stellungen und Züge, kein Buchtext |

## Entscheidungen und Rückfragen

ENTSCHEIDUNGEN
