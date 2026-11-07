# Aufgabenzuordnung je Club

Stand: 07.11.2026 (Helfer niedrig-1). Ausgezählt aus `app/public/daten/de/a1/kap00–12.json`, `inhalte/de/trainer/*.json` und `app/public/daten/zusatzaufgaben.json`. Clubzuordnung nach `03_Technische_Stellungnahme.md`, Abschnitt 3. Schwierigkeit S1–S5: Feld `schwierigkeit`; bei den Zusatzaufgaben aus der Lichess-Wertung mit den Grenzen 1000/1300/1600/1900 (`stufeAusWertung` in `app/src/training/zusatzaufgaben.ts`). Quelle `buch` = Buchabbildung, `lichess` = Lichess-Aufgabe.

## Club 1 Maple Falls – Regeln, Figurenwerte

Buchübungen:

- 1 `ueb:notation-lesen-1`: Notation lesen
- 2 `ueb:notation-lesen-2`: Notation schreiben
- 3 `ueb:notation-schreiben`: Bauernschlag notieren
- 4 `ueb:droh-ignorieren`: Springergabel mit Schach
- 5 `ueb:zaehlen-vorstoss`: Zählen von Angreifern und Verteidigern
- 7 `ueb:angriff-zaehlen`: Läuferopfer auf h7 nachzählen

| Thema (Kennung) | Quelle         |  S1 |  S2 |  S3 |  S4 |  S5 | Summe |
| --------------- | -------------- | --: | --: | --: | --: | --: | ----: |
| `haengend`      | zusatzaufgaben |  10 |  10 |  10 |  10 |  10 |    50 |

Trainer Zählen und Röntgen (`training/trainer.ts`) erzeugt Aufgaben aus Buchstellungen und ist hier nicht ausgezählt.

## Club 2 Cedar Creek – Matt in 1 und 2

Buchübungen:

- 36 `ueb:taktik-a02`: Grundreihenmatt
- 42 `ueb:taktik-a08`: Arabisches Matt
- 46 `ueb:taktik-a12`: Anastasia-Matt
- 47 `ueb:taktik-a13`: Boden-Matt
- 49 `ueb:taktik-a15`: Lolli-Matt
- 51 `ueb:damenmatt`: Damenmatt: erst der König
- 52 `ueb:turmmatt`: Turmmatt ohne Patt

| Thema (Kennung)       | Quelle           |  S1 |  S2 |  S3 |  S4 |  S5 | Summe |
| --------------------- | ---------------- | --: | --: | --: | --: | --: | ----: |
| `mattbild anastasia`  | buch (taktik)    |   0 |   0 |   0 |   2 |   0 |     2 |
| `mattbild anastasia`  | lichess (taktik) |   8 |   8 |   8 |   8 |   5 |    37 |
| `mattbild arabisch`   | buch (taktik)    |   0 |   0 |   1 |   0 |   0 |     1 |
| `mattbild arabisch`   | lichess (taktik) |   8 |   8 |   8 |   8 |   8 |    40 |
| `mattbild boden`      | buch (taktik)    |   0 |   0 |   1 |   0 |   0 |     1 |
| `mattbild boden`      | lichess (taktik) |   8 |   8 |   8 |   8 |   8 |    40 |
| `mattbild damiano`    | buch (taktik)    |   0 |   0 |   0 |   1 |   0 |     1 |
| `mattbild erstickung` | buch (taktik)    |   0 |   0 |   0 |   1 |   0 |     1 |
| `mattbild erstickung` | lichess (taktik) |   8 |   8 |   9 |   9 |   8 |    42 |
| `mattbild grundreihe` | buch (taktik)    |   1 |   0 |   1 |   0 |   0 |     2 |
| `mattbild grundreihe` | lichess (taktik) |  10 |   8 |   9 |   8 |   8 |    43 |
| `mattbild lolli`      | buch (taktik)    |   1 |   0 |   0 |   0 |   0 |     1 |
| `ziel matt`           | alle (taktik)    |  67 |  64 |  68 |  62 |  49 |   310 |
| `matt1`               | zusatzaufgaben   |  10 |  10 |  10 |  10 |  10 |    50 |
| `matt2`               | zusatzaufgaben   |  10 |  10 |  10 |  10 |  10 |    50 |
| `grundreihenmatt`     | zusatzaufgaben   |  10 |  10 |  10 |  10 |  10 |    50 |
| `mattbilder`          | zusatzaufgaben   |  10 |  10 |  10 |  10 |  10 |    50 |

Im Taktiktrainer gibt es kein Thema „Matt in 1/2“; dort zählt das Thema `mattbilder` (Feld `mattbild` gesetzt). Matt in 1/2 gibt es nur als Zusatzthemen `matt1`, `matt2`.

## Club 3 Riverton – Gabel, Doppelangriff

Buchübungen:

- 35 `ueb:taktik-a01`: Springergabel
- 40 `ueb:taktik-a06`: Hinlenkung und Gabel
- 4 `ueb:droh-ignorieren`: Springergabel mit Schach
- 10 `ueb:k2-zweispringer-la4`: Doppelangriff auf Springer und Randläufer

| Thema (Kennung) | Quelle                 |  S1 |  S2 |  S3 |  S4 |  S5 | Summe |
| --------------- | ---------------------- | --: | --: | --: | --: | --: | ----: |
| `doppelangriff` | buch (taktik_motiv)    |   2 |   0 |   1 |   0 |   0 |     3 |
| `doppelangriff` | lichess (taktik_motiv) |   8 |   8 |   8 |   8 |   8 |    40 |
| `doppelangriff` | zusatzaufgaben         |  10 |  10 |  10 |  10 |  10 |    50 |

## Club 4 Ironwood – Fesselung, Spieß

Buchübungen:

- 37 `ueb:taktik-a03`: Spieß mit Schach
- 38 `ueb:taktik-a04`: Fesselung der Dame
- 17 `ueb:elefant`: Fesselung auf der e-Linie
- 22 `ueb:legal-verteidigung`: Den billigsten Ausweg finden

| Thema (Kennung) | Quelle                 |  S1 |  S2 |  S3 |  S4 |  S5 | Summe |
| --------------- | ---------------------- | --: | --: | --: | --: | --: | ----: |
| `fesselung`     | buch (taktik_motiv)    |   0 |   0 |   1 |   0 |   0 |     1 |
| `fesselung`     | lichess (taktik_motiv) |   8 |   8 |   8 |   8 |   8 |    40 |
| `spiess`        | buch (taktik_motiv)    |   0 |   0 |   2 |   0 |   0 |     2 |
| `spiess`        | lichess (taktik_motiv) |   8 |   8 |   8 |   8 |   8 |    40 |
| `fesselung`     | zusatzaufgaben         |  10 |  10 |  10 |  10 |  10 |    50 |
| `spiess`        | zusatzaufgaben         |  10 |  10 |  10 |  10 |  10 |    50 |

## Club 5 Silicon Bay – Eröffnungsgrundsätze

Buchübungen:

- 6 `ueb:spannung-halten`: Spannung halten
- 8 `ueb:k2-italienisch-sg5`: Ungedeckte Figur
- 9 `ueb:k2-italienisch-bilanz`: Gegenstoß im Zentrum
- 10 `ueb:k2-zweispringer-la4`: Doppelangriff auf Springer und Randläufer
- 11 `ueb:k2-carokann-h4`: Läufer ohne Rückzugsfeld
- 12 `ueb:k2-nimzo-e4`: Gefesselter Verteidiger
- 13 `ueb:k2-zugumstellung-laeuferspiel`: Zugumstellung
- 19 `ueb:lasker-falle`: Unterverwandlung mit Schach
- 20 `ueb:mortimer-falle`: Scheinbar freier Bauer
- 21 `ueb:warnsignale-zuordnen`: Warnsignale W1 bis W5
- 22 `ueb:legal-verteidigung`: Den billigsten Ausweg finden

| Thema (Kennung) | Quelle          |  S1 |  S2 |  S3 |  S4 |  S5 | Summe |
| --------------- | --------------- | --: | --: | --: | --: | --: | ----: |
| `falle`         | buch (falle)    |   0 |   0 |   8 |   0 |   9 |    17 |
| `falle`         | lichess (falle) |  12 |  12 |  12 |  12 |  12 |    60 |
| `geschenk`      | lichess (falle) |  12 |  12 |  12 |  12 |  12 |    60 |

Kennungen sind hier die Werte von `antwort` in `falle.json`.

## Club 6 Old Harbor – Bauernstruktur, Pläne

Buchübungen:

- 23 `ueb:bauernloch-erkennen`: Bauernzüge kosten Schutz
- 24 `ueb:deckungstest-inseln`: Deckungstest und Bauerninseln
- 25 `ueb:guter-schlechter-laeufer`: Guter und schlechter Läufer
- 26 `ueb:skelett-roentgen`: Skelett-Röntgen
- 27 `ueb:angriff-london`: Bedingungen für den Königsangriff
- 28 `ueb:prophylaxe-saemisch`: Prophylaxe
- 29 `ueb:lap-spanisch`: Schlechteste Figur verbessern
- 30 `ueb:planbilanz-kid`: Planbilanz nach dem Bauerntausch
- 31 `ueb:tausch-verwerten`: Wer weniger Material hat, tauscht Bauern

| Thema (Kennung)      | Quelle          |  S1 |  S2 |  S3 |  S4 |  S5 | Summe |
| -------------------- | --------------- | --: | --: | --: | --: | --: | ----: |
| `doppelbauer`        | buch (struktur) |   1 |   4 |  27 |   9 |   6 |    47 |
| `haengendeBauern`    | buch (struktur) |   0 |   0 |   4 |   0 |   0 |     4 |
| `isolani`            | buch (struktur) |   1 |   2 |   6 |   0 |   0 |     9 |
| `kette`              | buch (struktur) |   0 |   0 |  16 |   1 |   0 |    17 |
| `laeufer`            | buch (struktur) |   0 |   1 |   4 |   0 |   0 |     5 |
| `loch`               | buch (struktur) |   0 |   0 |   2 |   0 |   0 |     2 |
| `mehrheit`           | buch (struktur) |   0 |   4 |  11 |   0 |   0 |    15 |
| `minderheitsangriff` | buch (struktur) |   0 |   0 |   3 |   0 |   0 |     3 |
| `offen`              | buch (struktur) |   0 |   0 |   1 |   0 |   0 |     1 |
| `raum`               | buch (struktur) |   0 |   0 |   1 |   0 |   0 |     1 |
| `vorposten`          | buch (struktur) |   0 |   1 |   2 |   0 |   0 |     3 |

Pläne (Feld `plan`) derselben 107 Aufgaben: `doppelbauerAngreifen` 32, `doppelbauerAufloesen` 15, `fluegelDerKette` 4, `gutenLaeuferBehalten` 3, `haengendeAngreifen` 2, `haengendeVorstossen` 2, `isolaniBlockieren` 6, `isolaniVorstossen` 3, `kettenbasisAngreifen` 12, `mehrheitVorstossen` 15, `minderheitsangriff` 3, `raumNutzen` 2, `schlechtenLaeuferTauschen` 1, `stellungOeffnen` 2, `vorpostenBesetzen` 5.

## Club 7 Desert Springs – Königsangriff, Opfer

Buchübungen:

- 7 `ueb:angriff-zaehlen`: Läuferopfer auf h7 nachzählen
- 27 `ueb:angriff-london`: Bedingungen für den Königsangriff
- 33 `ueb:luftloch-verteidigung`: Grundreihenmatt verhindern
- 34 `ueb:morphy-opfer-checkliste`: Damenopfer und Grundreihenmatt
- 44 `ueb:taktik-a10`: Damenopfer und Doppelschach
- 45 `ueb:taktik-a11`: Beseitigung der Verteidigung
- 48 `ueb:taktik-a14`: Damiano-Matt
- 80 `ueb:colle-verteidigung`: Muster Figur für Figur vergleichen

| Thema (Kennung) | Quelle                 |  S1 |  S2 |  S3 |  S4 |  S5 | Summe |
| --------------- | ---------------------- | --: | --: | --: | --: | --: | ----: |
| `hinlenkung`    | buch (taktik_motiv)    |   0 |   0 |   1 |   3 |   0 |     4 |
| `hinlenkung`    | lichess (taktik_motiv) |   8 |   8 |   8 |   8 |   8 |    40 |
| `beseitigung`   | buch (taktik_motiv)    |   0 |   0 |   1 |   1 |   0 |     2 |
| `beseitigung`   | lichess (taktik_motiv) |   8 |   8 |   8 |   8 |   8 |    40 |
| `abzug`         | buch (taktik_motiv)    |   0 |   0 |   3 |   0 |   0 |     3 |
| `abzug`         | lichess (taktik_motiv) |   8 |   8 |   8 |   8 |   8 |    40 |
| `doppelschach`  | buch (taktik_motiv)    |   0 |   0 |   1 |   1 |   0 |     2 |
| `doppelschach`  | lichess (taktik_motiv) |   8 |   8 |   8 |   8 |   8 |    40 |
| `hinlenkung`    | zusatzaufgaben         |  10 |  10 |  10 |  10 |  10 |    50 |
| `raeumung`      | zusatzaufgaben         |  10 |  10 |  10 |  10 |  10 |    50 |
| `beseitigung`   | zusatzaufgaben         |  10 |  10 |  10 |  10 |  10 |    50 |
| `abzug`         | zusatzaufgaben         |  10 |  10 |  10 |  10 |  10 |    50 |
| `doppelschach`  | zusatzaufgaben         |  10 |  10 |  10 |  10 |  10 |    50 |

Mattbilder `erstickung` und weitere siehe Club 2.

## Club 8 Summit City – Endspiele

Buchübungen:

- 50 `ueb:pattfalle-vermeiden`: Pattfalle
- 51 `ueb:damenmatt`: Damenmatt: erst der König
- 52 `ueb:turmmatt`: Turmmatt ohne Patt
- 53 `ueb:opposition-anwenden`: Opposition
- 54 `ueb:fernopposition`: Fernopposition
- 55 `ueb:schluesselfeld-finden`: Schlüsselfelder
- 56 `ueb:randbauer-ecke`: Randbauer: die Ecke beherrschen
- 57 `ueb:tausch-bauernendspiel`: Tausch ins gewonnene Bauernendspiel
- 58 `ueb:quadrat-doppelschritt`: Quadratregel mit Doppelschritt
- 59 `ueb:bauernrennen-schach`: Umwandlung mit Schach
- 60 `ueb:freibauer-bilden`: Freibauer erst mit König davor
- 61 `ueb:entfernter-freibauer`: Entfernter Freibauer
- 62 `ueb:durchbruch-ecke`: Bauernopfer statt Patt
- 63 `ueb:reserve-tempo`: Reserve-Tempo
- 64 `ueb:philidor-reihenfolge`: Philidor-Stellung
- 65 `ueb:kurze-seite`: König auf die kurze Seite
- 66 `ueb:lucena-c-bauer`: Lucena: Brückenbau
- 67 `ueb:vancura-a7`: Turm hinter den Randbauern
- 68 `ueb:turm-gegen-bauer`: Turm auf die Umwandlungsreihe
- 69 `ueb:abschneiden-reihe`: Abschneiden auf der Reihe
- 70 `ueb:turm-gegen-zwei-bauern`: Turm gegen verbundene Freibauern
- 71 `ueb:dame-gegen-bauer`: Matt statt Patt
- 72 `ueb:falscher-laeufer`: Falscher Läufer
- 73 `ueb:unterverwandlung`: Unterverwandlung mit Matt
- 74 `ueb:pattfalle-umwandlung`: Unterverwandlung gegen Patt
- 75 `ueb:stiller-turmzug`: Stiller Zug und Zugzwang
- 76 `ueb:reti-weg`: Réti-Manöver
- 77 `ueb:wegversperrung`: Wegversperrung
- 78 `ueb:pattreserve`: Pattreserve stehen lassen

| Thema (Kennung)    | Quelle             |  S1 |  S2 |  S3 |  S4 |  S5 | Summe |
| ------------------ | ------------------ | --: | --: | --: | --: | --: | ----: |
| `bauernendspiel`   | lichess (endspiel) |   5 |  10 |   5 |   5 |   5 |    30 |
| `bauernrennen`     | buch (endspiel)    |   0 |   0 |   3 |   0 |   0 |     3 |
| `dameGegenBauer`   | buch (endspiel)    |   0 |   0 |   0 |   4 |   1 |     5 |
| `damenendspiel`    | lichess (endspiel) |   5 |   5 |   5 |   5 |   5 |    25 |
| `damenmatt`        | buch (endspiel)    |   3 |   0 |   0 |   0 |   0 |     3 |
| `durchbruch`       | buch (endspiel)    |   0 |   0 |   1 |   0 |   0 |     1 |
| `freibauer`        | buch (endspiel)    |   0 |   0 |   5 |   1 |   0 |     6 |
| `laeuferpaar`      | buch (endspiel)    |   0 |   0 |   1 |   0 |   0 |     1 |
| `leichtfiguren`    | buch (endspiel)    |   0 |   0 |   0 |  10 |   1 |    11 |
| `leichtfiguren`    | lichess (endspiel) |   6 |   6 |   6 |   5 |   5 |    28 |
| `opposition`       | buch (endspiel)    |   0 |   1 |   4 |   0 |   0 |     5 |
| `quadrat`          | buch (endspiel)    |   1 |   1 |   0 |   0 |   0 |     2 |
| `randbauer`        | buch (endspiel)    |   0 |   1 |   1 |   0 |   0 |     2 |
| `schluesselfelder` | buch (endspiel)    |   0 |   0 |   4 |   6 |   0 |    10 |
| `turmendspiel`     | buch (endspiel)    |   0 |   0 |   0 |  15 |   8 |    23 |
| `turmendspiel`     | lichess (endspiel) |   8 |  10 |   8 |   5 |   5 |    36 |
| `turmmatt`         | buch (endspiel)    |   0 |   4 |   0 |   0 |   0 |     4 |
| `zugzwang`         | buch (endspiel)    |   0 |   0 |   0 |   2 |   1 |     3 |
| `zugzwang`         | zusatzaufgaben     |  10 |  10 |  10 |  10 |  10 |    50 |
| `umwandlung`       | zusatzaufgaben     |  10 |  10 |  10 |  10 |  10 |    50 |
| `stillerzug`       | zusatzaufgaben     |  10 |  10 |  10 |  10 |  10 |    50 |
| `wegversperrung`   | zusatzaufgaben     |  10 |  10 |  10 |  10 |  10 |    50 |

Übungen 73–78 (Kap. 10) als Nebenquests.

## Lücken

Themen mit weniger als 15 Aufgaben oder ohne S1–S2 (je Quelle gezählt; Buchanteile sind fast immer klein, weil die Lichess-Ergänzung im selben Thema liegt):

| Club             | Thema                 | Quelle              | Summe | S1+S2 |
| ---------------- | --------------------- | ------------------- | ----: | ----: |
| 2 Cedar Creek    | `mattbild anastasia`  | buch (taktik)       |     2 |     0 |
| 2 Cedar Creek    | `mattbild arabisch`   | buch (taktik)       |     1 |     0 |
| 2 Cedar Creek    | `mattbild boden`      | buch (taktik)       |     1 |     0 |
| 2 Cedar Creek    | `mattbild damiano`    | buch (taktik)       |     1 |     0 |
| 2 Cedar Creek    | `mattbild erstickung` | buch (taktik)       |     1 |     0 |
| 2 Cedar Creek    | `mattbild grundreihe` | buch (taktik)       |     2 |     1 |
| 2 Cedar Creek    | `mattbild lolli`      | buch (taktik)       |     1 |     1 |
| 3 Riverton       | `doppelangriff`       | buch (taktik_motiv) |     3 |     2 |
| 4 Ironwood       | `fesselung`           | buch (taktik_motiv) |     1 |     0 |
| 4 Ironwood       | `spiess`              | buch (taktik_motiv) |     2 |     0 |
| 5 Silicon Bay    | `falle`               | buch (falle)        |    17 |     0 |
| 6 Old Harbor     | `haengendeBauern`     | buch (struktur)     |     4 |     0 |
| 6 Old Harbor     | `isolani`             | buch (struktur)     |     9 |     3 |
| 6 Old Harbor     | `kette`               | buch (struktur)     |    17 |     0 |
| 6 Old Harbor     | `laeufer`             | buch (struktur)     |     5 |     1 |
| 6 Old Harbor     | `loch`                | buch (struktur)     |     2 |     0 |
| 6 Old Harbor     | `minderheitsangriff`  | buch (struktur)     |     3 |     0 |
| 6 Old Harbor     | `offen`               | buch (struktur)     |     1 |     0 |
| 6 Old Harbor     | `raum`                | buch (struktur)     |     1 |     0 |
| 6 Old Harbor     | `vorposten`           | buch (struktur)     |     3 |     1 |
| 7 Desert Springs | `hinlenkung`          | buch (taktik_motiv) |     4 |     0 |
| 7 Desert Springs | `beseitigung`         | buch (taktik_motiv) |     2 |     0 |
| 7 Desert Springs | `abzug`               | buch (taktik_motiv) |     3 |     0 |
| 7 Desert Springs | `doppelschach`        | buch (taktik_motiv) |     2 |     0 |
| 8 Summit City    | `bauernrennen`        | buch (endspiel)     |     3 |     0 |
| 8 Summit City    | `dameGegenBauer`      | buch (endspiel)     |     5 |     0 |
| 8 Summit City    | `damenmatt`           | buch (endspiel)     |     3 |     3 |
| 8 Summit City    | `durchbruch`          | buch (endspiel)     |     1 |     0 |
| 8 Summit City    | `freibauer`           | buch (endspiel)     |     6 |     0 |
| 8 Summit City    | `laeuferpaar`         | buch (endspiel)     |     1 |     0 |
| 8 Summit City    | `leichtfiguren`       | buch (endspiel)     |    11 |     0 |
| 8 Summit City    | `opposition`          | buch (endspiel)     |     5 |     1 |
| 8 Summit City    | `quadrat`             | buch (endspiel)     |     2 |     2 |
| 8 Summit City    | `randbauer`           | buch (endspiel)     |     2 |     1 |
| 8 Summit City    | `schluesselfelder`    | buch (endspiel)     |    10 |     0 |
| 8 Summit City    | `turmendspiel`        | buch (endspiel)     |    23 |     0 |
| 8 Summit City    | `turmmatt`            | buch (endspiel)     |     4 |     4 |
| 8 Summit City    | `zugzwang`            | buch (endspiel)     |     3 |     0 |

Wo die Lichess-Ergänzung im selben Thema schon 40 Aufgaben mit S1–S2 hat, ist die Lücke nur formal. Echte Lücken:

- Club 5: Buchfallen (`falle`, buch) nur S3 und S5; Einsteiger bekommen die Lichess-Fallen.
- Club 6: `struktur.json` hat nur Buchaufgaben, fast alle S3; `loch`, `offen`, `raum`, `minderheitsangriff`, `vorposten`, `haengendeBauern`, `laeufer`, `isolani` unter 15. Nachschub: weitere Buchabbildungen aus Kap. 5/6 nach den Regeln der Pipeline (Lichess hat keine Strukturthemen).
- Club 8: Buchendspiele meist einzeln unter 15 und ohne S1–S2 (`schluesselfelder`, `opposition`, `freibauer`, `zugzwang`, `dameGegenBauer` …). Nachschub: Lichess-Themen `pawnEndgame`, `rookEndgame`, `zugzwang` (als Zusatzthema `zugzwang` schon da), weitere Abbildungen aus Kap. 8/9.
- Club 2: Buch-Mattbilder `damiano`, `lolli` gibt es nur einmal aus dem Buch, ohne Lichess-Gegenstück; Nachschub über Lichess-Themen (`dovetailMate`, `hookMate` o. ä.) nur, wenn passend.
- Club 1: außer `haengend` keine Trainerdaten; die Zählaufgaben erzeugt der Trainer aus Buchstellungen.
