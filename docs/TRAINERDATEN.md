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

ERGEBNIS_UEBUNGEN

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
