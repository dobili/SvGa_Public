# Weg 7: Desert Springs – Summit City (`wegDesertSummit`)

Ortsdokument nach `README.md` (vier Teile, Zusatz für große Außenkarten). Verfasst von mittel-2 in der
Nacht 9./10.11.2026 (Auftrag `auftraege/runde5b_akt3.md`, Akt 4 Vorarbeit). Grundlagen: Weltbeschreibung
5.8 bis 5.10 (`09_Weltbeschreibung.md`), Wegenetz 5 (`13_Wegenetz.md`), Bibel 28 und 29, Szene 81
(`05_Story_Bibel.md`), Landschaft L8 (`10_Sprueche_Schauplaetze_Varianten.md`), Ortsdokument
`desert-springs.md` (Übergang `highway`). Maßstab nach `KARTENREGELN.md` 7a.2: Weg ab Akt 2, zwei Karten,
zusammen 280 Kacheln lang, Laufzeit etwa 105 Sekunden.

## 1. Ortsplan

### 1.0 Lage in der Welt

Weg 7 verbindet Desert Springs (Ort 7, Akt 3) mit Summit City (Ort 8, Akt 4). Er beginnt am
**Westrand von Desert Springs**, wo die Old Mother Road die Stadt verlässt (`highway`, nur nach dem Ende
von Akt 3), läuft als Wüstenstraße nach Westen zum einsamen **King's Diner** mit Motel und Fernfahrern
und steigt dann auf der **Bergstraße** in Serpentinen nach Norden in die Berge, bis Summit City. Auf
halber Höhe zweigt nach Westen der Fahrweg zur **Hochebene** ab (L9, eigenes Ortsdokument später).

```text
                         N
                         ↑        [Summit City]  (Nordrand der Bergstraße, 18–20)
                                       ║
   [Hochebene] ◄═ Abzweig (Westrand) ═╣  Bergstraße 40 × 130, Serpentinen nach Norden
                                       ║
                                       ╚══╗  (Ostrand unten, 120–122)
   Diner-Karte 150 × 30:  ◄══════════════╝══ Wüstenstraße ══ King's Diner ══ Motel ══◄══ [Desert Springs]
                          Westrand (0, 19–21)                                  Ostrand (149, 15–17)
```

Die Diner-Karte liegt also westlich von Desert Springs; ihr Westrand stößt an den Ostrand der
Bergstraße. Norden ist auf allen Karten oben.

### 1.1 Wüstenstraße mit Diner (`wegDesertSummit.diner`, 150 × 30)

Die **Old Mother Road** (Asphalt, drei Felder breit, Bankette aus Kies je ein Feld) kommt am **Ostrand
in den Reihen 15–17** aus Desert Springs. Sie läuft nach Westen, schwingt bei den Spalten 104–106
nach Norden auf die **Reihen 12–14** (dort liegen Motel und Diner nördlich der Straße, der
Fernfahrerplatz südlich), kehrt bei den Spalten 50–52 auf die **Reihen 19–21** zurück und verlässt die
Karte am **Westrand in den Reihen 19–21** zur Bergstraße. Boden roter Sand (`sandRot`), Bankett Kies, roter Fels
(`wand: felsRot`) als Tafelberge am Nord- und Südrand. Die Sonne steht hoch, die Hitze ist Tönung (Szene).

```text
 Spalte 0     15     30     45     60     75     90    105    120    135   149
 R 0  ┌fels──────────┬────────────fels─────────┬──────────────────fels──────┐
 R 2  │ Pinien       │  Felsbögen │ [fundNeonK hinter dem Diner]  Wasserturm │
 R 4  │ (Ausblick)   │            │ [King's Diner][Motel ▭▭▭▭▭] Reklame     │
 R 8  │              │  Alte      │  Neon   Tafel  Parkplatz        Windrad  │
 R10  │              │  Zapfsäule ╔═════════════════════════╗               │
 R12  │              │            ║   Old Mother Road (3)   ╚═══════╗       │
 R14  │              │     ╔══════╝ Fernfahrerplatz: 2 Sattelzüge  ╚═══════◄ Ostrand 15–17
 R18  ◄══════════════════════╝ Tisch mit Brett (Earl)                       │
 R20  │ Westrand 19–21  Roadrunner   Kakteen     Kojote        Kakteen       │
 R29  └fels─────────────────────────────────────────────────────────────────┘
```

| Abschnitt (Spalten)              | Thema                  | Inhalt                                                                                                                                          | Zum Entdecken                          |
| -------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| D1 (135–149) Stadtausgang        | Abschied von der Stadt | Ortsschild „Desert Springs“ von hinten, blühende Kakteen am Bankett, Steppenläufer                                                              | Ortsschild, Eidechse                   |
| D2 (120–134) Wasserturm          | Windrad und Tank       | Wasserturm und Windrad auf einer Weide, Viehtränke, die Straße beginnt die Kurve                                                                | Windrad (Belebung: dreht), Viehtränke  |
| D3 (105–119) Reklame             | Werbung im Nichts      | große Reklametafel „King's Diner – 2 Meilen“ (die Meilen stimmen nicht), Kurve nach Norden                                                      | Reklametafel                           |
| D4 (90–104) Motel                | Zimmer frei            | **Starlight Motel**: flacher Bau mit sechs Türen, Neon „VACANCY“, Pool ohne Wasser, Eismaschine                                                 | Motelschild, leerer Pool               |
| D5 (75–89) King's Diner          | Neon und Kaffee        | **King's Diner** (Speisewagen-Bau), großes Neonschild „ING'S DINER“ (das K fehlt), Tür zur Straße, **Rätseltafel** neben der Tür                | Tafel (`tafel`), Kellnerin, Neonschild |
| D6 (60–74) Fernfahrerplatz       | Rast der Brummis       | südlich der Straße zwei Sattelzüge, Reifenstapel, Tisch mit Schachbrett unter einem Sonnensegel: **Earl Dubois** spielt Königsrennen (Szene 81) | Earl, Trucker (Statist)                |
| D7 (75–89, Reihen 1–3) Hinterhof | hinter dem Diner       | Mülltonnen, Kisten, Fliegengittertür; im Sand das **Neon-K** (Szene, Fund)                                                                      | **Neon-K** (`fundNeonK`)               |
| D8 (45–59) Alte Tankstelle       | aufgegeben             | eine einzelne alte Zapfsäule, verblichenes Vordach ohne Haus, ein Autowrack                                                                     | Zapfsäule, Kojote (Belebung)           |
| D9 (30–44) Felsbögen             | roter Fels             | Felsbrocken und ein kleiner Bogen am Nordrand, Kakteen, Roadrunner kreuzt die Straße                                                            | Roadrunner (Belebung)                  |
| D10 (15–29) Steppe               | Weite                  | trockenes Gras, Kreosotbüsche, Geierkreise am Himmel (Szene)                                                                                    | Geier                                  |
| D11 (0–14) Ausblick              | die Berge              | erste Pinien, Rastplatz mit Bank, Sicht nach Westen auf die Berge (Sichtachse)                                                                  | Rastbank, Wegweiser „Summit City“      |

**Wegeführung:** Hauptweg drei Felder Asphalt mit zwei Kurven (nach Norden bei 104–118, zurück bei 50–62);
**zwei Abzweige**: (1) Parkplatz vor Motel und Diner (Asphalt, 72–103 / 10–11), (2) Pfad um den Diner in den
Hinterhof (zwei Felder Sand, 72–73 / 2–9). **Sichtachsen:** Von Osten sieht man das Neonschild des Diners
schon ab Spalte 120 über der Kurve; vom Diner aus nach Westen die Berge hinter den Pinien von D11.
**Ränder:** Nord und Süd roter Fels (Tafelberge, nicht begehbar), offen nur Ost (15–17) und West (19–21).
**Laufzeit:** Hauptweg etwa 165 Kacheln, 47 Sekunden.

### 1.2 Bergstraße (`wegDesertSummit.bergstrasse`, 40 × 130)

Die Straße kommt am **Ostrand in den Reihen 120–122** von der Diner-Karte (drei Felder Asphalt), läuft
nach Westen und steigt in **drei Serpentinen** nach Norden: Kehren bei Reihe 96, 66 und 36, je über eine
Rampe durch eine Felsstufe (`wand: fels`, Regel 10.49). Am **Nordrand bei den Spalten 18–20** geht es nach
Summit City. Auf der mittleren Stufe zweigt bei den **Reihen 70–71** ein Fahrweg aus Schotter (zwei
Felder) zum **Westrand** ab: zur Hochebene. Unten Wüste, in der Mitte Buschland, oben Pinienwald und
kühler Wind.

```text
 Spalte 0        10        20        30   39
 R 0   ┌──fels──────── ║║║ ─────────fels──┐  Nordrand → Summit City (18–20)
 B1    │ Pinienwald   ║║║  Aussichtsbank  │
 R 36  │ ╔════════════╝║  Kehre 3          │
 B3    │ ║ Felsstufe ════════ Rampe        │
 R 66  │ ╚══════════════════════╗ Kehre 2  │
 R70   ◄═ Abzweig Hochebene (Schotter, 2) ║ Wegweiser
 B5    │        Felsstufe ═══ Rampe        ║│
 R 96  │ ╔══════════════════════╝ Kehre 1  │
 B7    │ ║ Buschland, Ziegen               │
 R120  │ ╚══════════════════════════════════◄ Ostrand 120–122 ← Diner-Karte
 R129  └──fels──────────────────────────────┘
```

| Abschnitt (Reihen)     | Thema            | Inhalt                                                                                    | Zum Entdecken                        |
| ---------------------- | ---------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| B9 (115–129) Fuß       | Wüste endet      | Straße vom Ostrand, letzte Kakteen, ein Viehgitter im Asphalt, Warnschild „Steigung“      | Warnschild, Eidechse                 |
| B8 (100–114) Buschland | Ziegen           | Wacholderbüsche, Steinmauer, Ziegen am Hang                                               | Ziegen (Belebung)                    |
| B7 (85–99) Kehre 1     | Leitplanke       | erste Kehre mit Leitplanke, Felsstufe, Rampe hinauf                                       | Aussicht zurück auf das Diner (Neon) |
| B6 (72–84) Pinien      | die ersten Bäume | einzelne Pinien, eine Quelle mit Steintrog                                                | Quelle                               |
| B5 (66–71) Abzweig     | Wegweiser        | Wegweiser „Summit City ↑ / Hochebene ←“, Schranke offen, Fahrweg zum Westrand             | Wegweiser, Radfahrer (Statist)       |
| B4 (50–65) Felsstufe   | Steinschlag      | Felsbrocken am Rand, Steinschlagnetz, Rampe zur oberen Stufe                              | Adler als Kreise (Szene)             |
| B3 (36–49) Kehre 3     | Wind             | letzte Kehre, Wind in den Pinien, Bank mit Blick nach Süden über die Wüste                | Aussichtsbank                        |
| B2 (15–35) Pinienwald  | kühl             | dichter Pinienwald beidseits, Holzstapel der Forstarbeiter                                | Holzstapel, Eichhörnchen             |
| B1 (0–14) Stadtrand    | Summit City      | Ortsschild „Summit City“, Seilbahnmast in der Ferne (Sichtachse nach Norden), Briefkasten | Ortsschild, Seilbahn (Hintergrund)   |

**Wegeführung:** Hauptweg drei Felder Asphalt, drei Kehren; **ein Abzweig** (Hochebene, Westrand 70–71,
zwei Felder Schotter) mit Ziel. **Sichtachsen:** Von Kehre 1 nach Süden zurück auf die Wüste; vom
Abzweig nach Norden auf den Pinienwald; von B2 auf das Ortsschild von Summit City. **Ränder:** Ost und
West Fels und Wald, Süden Fels; offen nur Ost (120–122), West (70–71) und Nord (18–20).
**Laufzeit:** Hauptweg etwa 130 Reihen plus drei Kehren zu je etwa 26 Feldern, zusammen 210 Kacheln,
60 Sekunden.

### 1.3 Übergänge (Felder auf beiden Seiten)

| Auslöser (Karte, Feld)                             | Gegenstück (Karte, Feld)                              | Bemerkung                                                          |
| -------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| diner `zurueckDesert` Ostrand (149, 15–17)         | desertSprings.aussen `highway` Westrand (0, 18–20)    | Rückweg landet laut orte.json am `bahnhof` (desert-springs.md 1.8) |
| diner `weiterBergstrasse` Westrand (0, 19–21)      | bergstrasse `zurueckDiner` Ostrand (39, 120–122)      | gleiche Breite (3)                                                 |
| bergstrasse `abzweigHochebene` Westrand (0, 70–71) | hochebene.felsentuerme `zurueckBergstrasse` (Ostrand) | zwei Felder; Hochebene folgt mit eigenem Ortsdokument              |
| bergstrasse `weiterSummit` Nordrand (18–20, 0)     | summitCity.aussen `wegDesert` (Südrand, 3 Felder)     | Summit City folgt; Breite drei Felder                              |

Start je Karte: diner (147, 16) Blick nach links; bergstrasse (38, 121) Blick nach links.

## 2. Ortsbild

### 2.1 Die Wüstenstraße

Hinter dem letzten Haus von Desert Springs wird die Straße still. Der Asphalt flimmert, der Sand neben
dem Bankett ist rot und fein, und alle paar Schritte steht ein Kaktus, als hätte ihn jemand dort
vergessen. Ein Windrad quietscht über einer Viehtränke, die seit Jahren kein Vieh gesehen hat. Dann die
Reklametafel, verblichen, aber stolz: King's Diner, 2 Meilen. Es sind eher fünf.

Das Diner taucht hinter der Kurve auf wie ein Zug, der sich verfahren hat: ein silberner Speisewagen mit
runden Ecken, daneben das Starlight Motel, sechs Türen, ein Pool ohne Wasser. Über dem Diner leuchtet
das Neonschild auch am Tag, rosa und blau, nur das K ist dunkel, seit 1989, sagt Earl. Es riecht nach
Kaffee, heißem Öl und Diesel. Auf dem Fernfahrerplatz gegenüber stehen zwei Sattelzüge in der Sonne,
und unter einem Sonnensegel spielen Fernfahrer an einem wackligen Tisch „Königsrennen“: Wer zuerst die
letzte Reihe erreicht, zahlt nicht. Earl Dubois hat seit zwanzig Jahren keinen Kaffee bezahlt.

Westlich des Diners wird es leer. Eine einzelne alte Zapfsäule steht da wie ein Grabstein, ein Kojote
schaut aus dem Schatten eines Felsens. Ein Roadrunner rennt über die Straße, als hätte er einen Termin.
Am Horizont stehen die Berge blau, und je näher man kommt, desto mehr Pinien mischen sich unter die
Büsche.

### 2.2 Die Bergstraße

Am Fuß der Berge hört die Wüste mit einem Viehgitter im Asphalt auf. Die Straße windet sich in
Kehren hinauf, eine Leitplanke glänzt an jeder Kurve, und mit jeder Kehre wird die Luft kühler. Ziegen
stehen auf Felsen, die zu steil für Ziegen aussehen. An der ersten Kehre kann man zurückschauen: Tief
unten leuchtet das Neon des Diners, klein wie ein Bonbon.

Auf halber Höhe steht ein Wegweiser, links ein Schotterweg zur Hochebene, wo die roten Felstürme
stehen. Weiter oben riecht es nach Harz, Holzstapel liegen am Rand, ein Eichhörnchen schimpft. Hinter
der letzten Kehre steht eine Bank mit Blick auf die ganze Wüste. Dann das Ortsschild von Summit City
und in der Ferne ein Seilbahnmast, der im Wind summt.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

- **Szene 81 „Die Wüstenstraße“** (Bibel 29): Ort `wegDesertSummit.diner`, Earl Dubois (er), Ambrose;
  Diner mit Neonschild; Fernfahrer spielen Königsrennen; {held} lernt die Regel und spielt eine Partie.
  → Earl am Spieltisch auf dem Fernfahrerplatz (D6), Neonschild am Diner (D5).
- **Fund Neonbuchstabe „K“** (Bibel 30, Funde): „hinter dem Diner“, Earl: „Das K von King's Diner. Ist
  seit '89 kaputt.“ → `fundNeonK` im Hinterhof (D7). Rückkehr (Wegenetz 7.3): Wer das K zurückbringt,
  sieht in Akt 4 das reparierte Schild (eine Variante der Szene, Runde 6).
- **Rätseltafel** `tafel` (vorhanden in orte.json) → an der Dinertür (D5).
- **Statisten und Tiere** aus der Platzhalterkarte: Trucker, Kellnerin, Kojote, Eidechse (diner); Radler,
  Ziegen, Adler (bergstrasse). Dazu neu als Belebung: Roadrunner, Geier, Eichhörnchen.
- **Übergänge:** `zurueckDesert`, `weiterBergstrasse`, `zurueckDiner`, `abzweigHochebene`, `weiterSummit`
  (alle vorhanden, Namen bleiben).

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

- **Bleibt:** Diner mit Neon, Motel, Fernfahrer, Roadrunner, Kakteen, roter Fels, Serpentinen, Pinien,
  kühler Wind (Weltbeschreibung 5.9).
- **Ändert sich:** Der Diner heißt King's Diner, damit das Neon-K einen Sinn hat (Bibel 30). Das Motel
  heißt Starlight Motel (erfunden). Die Tankstelle der Wüstenstraße ist aufgegeben, weil Desert Springs
  schon eine Tankstelle hat (keine Wiederholung).
- **Entfällt:** Ein Innenraum des Diners (nicht in orte.json); man spielt draußen unter dem Sonnensegel.

### 3.3 Befunde und offene Punkte für den Haupt-Chat

- **Für Runde 6 (keine Auslöser jetzt):** `reklame` (Reklametafel D3), `motelschild` (D4), `aussicht`
  (Rastbank D11 und Aussichtsbank B3), `wegweiserHochebene` (B5), `quelle` (B6). Die Gegenstände stehen
  in den Karten, die Auslöser kommen mit den Dialogen.
- **Bilder** (bestellt beim Haupt-Chat, sonst Ersatz): Neonschild „KING'S DINER“ mit dunklem K
  (etwa 96 × 32), Fund „Neon-K“ (16 × 16), Sattelzug von der Seite (etwa 160 × 64), Motel (kommt für
  Desert Springs), Diner-Wagen (kommt), Kakteen und roter Fels (kommen), Leitplanke für die Kehren.
- **Rückweg:** `zurueckDesert` landet am `bahnhof` von Desert Springs, nicht am `highway`; das ist so in
  orte.json und in `desert-springs.md` gewollt.

## 4. Bühnenbilder

### 4.1 Wüstenstraße mit Diner (`wegDesertSummit.diner`, Bühnenbild)

**Größe** 150 × 30. **Boden** Sand, Straße Asphalt (drei Felder), Bankett Kies, Parkplatz Asphalt,
Hinterhof Sand. **Wand** roter Fels (`wand: felsRot`) als Tafelberge am Nord- und Südrand, drei Reihen
tief. **Ränder** offen nur Ost (149, 15–17) und West (0, 19–21).

| Abschnitt | Inventar                                                                                                                                  |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| D1        | Ortsschild (142, 12), Kakteen (138, 18), (145, 19), Steppenläufer                                                                         |
| D2        | Wasserturm (124, 3), Windrad (130, 4), Viehtränke (128, 9)                                                                                |
| D3        | Reklametafel (108, 2) mit Sicht von der Kurve                                                                                             |
| D4        | Motel 88–101 / 3–9 (fünf Zimmer), Motelschild mit „VACANCY“ (102, 5)                                                                      |
| D5        | Diner 76–85 / 3–9, Neonschild auf dem Dach (Objekt `auf`), Tür (80–81, 9), Rätseltafel (86, 8) `tafel` (86, 10), Parkplatz 72–103 / 10–11 |
| D6        | Platz 55–79 / 15–25, Sattelzüge (57, 16) und (57, 21), Reifen (77, 16), Tisch unter dem Schirm mit Brett (70, 19); Earl (72, 25)          |
| D7        | Hinterhof 72–104 / 2, Container (73, 3), Neon-K (80, 2) `fundNeonK`                                                                       |
| D8        | Zapfsäule (52, 12), Vordachrest, Autowrack (48, 14), Kojote (Belebung)                                                                    |
| D9        | Felsbrocken, kleiner Felsbogen (36, 2), Kakteen; Roadrunner (Belebung, quert die Straße)                                                  |
| D10       | Trockengras, Büsche, Geier (Szene)                                                                                                        |
| D11       | Pinien (4, 6), (9, 4), Rastbank (6, 15), Wegweiser (2, 16)                                                                                |

### 4.2 Bergstraße (`wegDesertSummit.bergstrasse`, Bühnenbild)

**Größe** 40 × 130. **Boden** unten Sand, in der Mitte Erde und Gras, oben Gras mit Nadeln; Straße
Asphalt (drei Felder), Abzweig Schotter (zwei Felder). **Wand** Fels in Stufen (Regel 10.49) bei den
Kehren. **Ränder** offen nur Ost (39, 120–122), West (0, 70–71), Nord (18–20, 0).

| Abschnitt | Inventar                                                                            |
| --------- | ----------------------------------------------------------------------------------- |
| B9        | Viehgitter im Asphalt (34, 120), Warnschild „Steigung“ (30, 118), Kakteen           |
| B8        | Wacholderbüsche, Trockenmauer 4–20 / 104, Ziegen (Belebung)                         |
| B7        | Leitplanke an Kehre 1, Felsstufe mit Rampe                                          |
| B6        | Pinien einzeln, Quelle mit Steintrog (8, 78)                                        |
| B5        | Wegweiser (6, 68), Schranke offen (3, 70), Fahrweg 0–6 / 70–71; Radfahrer (Statist) |
| B4        | Felsbrocken, Steinschlagnetz an der Felsstufe                                       |
| B3        | Leitplanke an Kehre 3, Aussichtsbank (32, 40) nach Süden                            |
| B2        | Pinienwald beidseits, Holzstapel (6, 22), Eichhörnchen                              |
| B1        | Ortsschild Summit City (22, 4), Briefkasten (15, 6)                                 |

### 4.3 Varianten (Regel 10.7, 10.37)

- **A:** wie oben.
- **B, die schlichtere:** Diner und Motel tauschen die Seiten (Motel westlich), nur ein Sattelzug, keine
  alte Tankstelle; Bergstraße mit zwei Kehren und weniger Wald, Abzweig weiter unten.
- **C, die reichere:** zusätzlich ein Campingplatz mit Wohnwagen bei D2, mehr Neon (zweites Schild am
  Motel), drei Sattelzüge; Bergstraße mit Quelle und Picknickplatz, dichterer Wald oben.

### 4.4 Gebaute Karten (mittel-2, 9.11.2026 nachts)

- **Diner** (`weg-desert-summit-diner`): wie 4.1, eigene Bilder des Haupt-Chats (Diner-Wagen, Motel,
  Motelschild, Neonschild ohne K, Neon-K, Sattelzüge, Kakteen, roter Stein, Felsbogen, Geierkreise).
  Die alte Tankstelle ist das Zapfsäulen-Vordach aus dem Katalog, der Tisch ein Sonnenschirm mit Tisch
  und Stühlen. Windrad (eigenes Bild) neben dem Wasserturm; Wasserturm und Reklametafel aus dem Katalog.
  **B:** Motel links vom Diner, ein Sattelzug, Tafelberg statt Felsbogen, ohne Tankstelle.
  **C:** Diner und Motel enger, Wohnwagen am Wasserturm, Felsbogen und Zapfsäule weiter westlich, mehr
  blühende Kakteen.
- **Bergstraße** (`weg-desert-summit-bergstrasse`): wie 4.2 mit grauem Fels (`wand: fels`), Leitplanken
  (eigene Bilder) talseits und an der Außenseite jeder Kehre. **B:** zwei lange Kehren (80, 34), weniger
  Wald. **C:** drei weite Kehren (Straße 4–35), Picknickplatz an der Quelle, dichter Wald.

## Runde 7: Ereignisort und Leben (10.11.2026, mittel-4)

**Ereignisort „Schach über Funk“ (Dokument 15, 2.8):**

- **Diner:** Im Fenster des Diners steht das CB-Funkgerät. An der Seite des Diners ist ein
  Kreidespringer (K3). Am Motel steht ein Blumenkasten, daneben das Finkenzeichen aus Blech.
- **Bergstraße:** Ein blauer Sattelzug steht in einer Haltebucht aus Schotter neben der Straße,
  mit Kisten daneben (Spur P4).
- **Hinterzimmer:** Die Tür an der Rückseite des Diners kommt mit dem Innenraum in Runde 6. Das
  Bild des Diners hat dort keine Tür.

**3.3 Felder für Runde 6 (begehbar):**

| Karte         | Auslöser             | A         | B         | C        | Hinweis                     |
| ------------- | -------------------- | --------- | --------- | -------- | --------------------------- |
| `diner`       | `ereignisFunkschach` | (79, 11)  | (83, 11)  | (77, 11) | vor dem Diner               |
| `diner`       | `kreide3`            | (87, 9)   | (91, 9)   | (85, 9)  | Kreidespringer an der Seite |
| `diner`       | `finchSpringerB`     | (89, 10)  | (65, 10)  | (87, 10) | Blumenkasten am Motel       |
| `diner`       | `seite08`            | (55, 22)  | (52, 18)  | (54, 17) | Parkplatz                   |
| `bergstrasse` | `spurPM4`            | (16, 116) | (16, 115) | (15, 95) | neben dem Sattelzug         |

**Leben (Regel 10.53):**

- **Diner:** Kellnerin (über Earl), Fernfahrer (erst in den Spiegel schauen), Motelgast
  (Präriehunde wie zögernde Bauern), Tankwart.
- **Bergstraße:** Radfahrerin (Bauernendspiel bergauf), Schäferin (Ziegen wie Springer, mit
  Antwort von Ambrose), Wanderer (Franklins Aufsatz über Schach), Fotograf.
- **Tiere, Diner:** Präriehunde, Eidechse, Geier, Hund, Krähen, Hase.
- **Tiere, Bergstraße:** Ziegen, Murmeltier, Adler, Reh, Eichhörnchen, Schmetterlinge.

## Runde 6: spielbar (10.11.2026, mittel-4)

- **Schach über Funk** (`ereignisFunkschach`, Dialog `weg-desert-summit.ereignis_funkschach`): Earl
  holt {held} ans CB-Funkgerät.
  - Quest `wegDesertSummit.funkschach` (klein): Partie gegen Mama Bear (Begegnung
    `wegDesertSummit.funkschach`, Gegner `wegDesertSummit.mamaBear`) als Partie nach Gehör
    (`"variante": "gehoer"`): Ihr Zug kommt erst als Ansage, dann aufs Brett.
  - Danach erzählt Mama Bear von den summenden Kisten. Lohn: Funkname „{held} Junior“ und
    30 Münzen.
- **Hinterzimmer (K3), neuer Innenraum `wegDesertSummit.hinterzimmer`** (14 × 12, A/B/C):
  - Die Tür `hinterzimmerTuer` an der Seite des Diners öffnet, wenn der Kreidespringer gefunden
    ist (`hinterzimmerOffen`, gesetzt vom Türdialog).
  - Drinnen ist Mags, eine Kreidespringerin. Sie spielt Blitz 3 + 2, Begegnung
    `wegDesertSummit.kreideblitz`.
  - Ebenfalls drinnen: Ruth Keene, die am Funk Mama Bear heißt.
  - Das Losungswort der Kreidespringer gehört zur Quest von mittel-1. Bis dahin genügt der Fund
    `kreide3`.
- **Funde:**
  - `kreide3`: Kreidespringer an der Seite des Diners;
  - `finchSpringerB`: Blumenkasten am Motel;
  - `seite08`: Parkplatz, Kapitel 8, Endspiel-Fundament;
  - `spurPM4`: Frachtbrief am Sattelzug in der Haltebucht.
- **Ansehen:**
  - Diner: `reklame` (D3), `motelschild` (D4), `aussicht` (Rastbank D11);
  - Bergstraße: `aussichtBerg` (B3), `wegweiserHochebene` (B5), `quelle` (B6).
- **Repariertes Neonschild:** Wer das K gefunden hat, kann es Earl geben (`earl_k`, Wahl in
  `earl_alltag`). Das setzt `neonRepariert`; orte.json lädt dann über `zustaende` die zweite Fassung
  `weg-desert-summit-diner-neon` (A, B, C) mit leuchtendem Schild `wds6SchildDinerHell`
  (`schild_kings_diner_hell.png`) und ohne das K im Hinterhof.
- **Offen:** Tönung Hitze (mittel-2).

## Runde 9: Mängel der Variantenwahl, Muster und Zustände (10.11.2026, mittel-4)

Grundlage: `variantenwahl.md` (alle drei Karten Wahl C, die alte A liegt in `varianten/`).

**Wüstenstraße mit Diner.** (1) Die Old Mother Road läuft gerade, drei Spuren breit, mit gelber
Mittellinie und weißen Randlinien (`"markierung"`, `pipeline/abenteuer/strasse.py`). (2) Der
Fernfahrerplatz hat Buchten (`"buchten"`), die Sattelzüge stehen darin; sie bleiben Seitenansichten, weil
das Paket keine Draufsicht hat. (3) Tafelberge: Felswand im Norden mit einem Vorsprung, zwei Tafelberge im
Süden, rote Klippenkacheln, kein Rahmen. (4) Die Tankstelle steht auf einem Vorplatz aus Beton an der
Straße, die Zapfsäulen nicht mehr im Sand; das Bild bleibt so groß wie im Paket. Aus Runde 8 übernommen:
das Autowrack steht hinter der Tankstelle statt auf der Straße. Gehweg und Parkplatz vor Diner und Motel.

**Bergstraße.** (1) Markierung, abgeschrägte Kehren (Außenecke abgeschnitten, Innenecke gefüllt),
Leitplanken bleiben an den Querstücken. (2) Die Felsstufen sind Klippenkanten, die Straße läuft durch einen
Einschnitt mit Randkacheln; der Kartenrand neben Boden zeigt den Boden. (3) Die Zonen wechseln an den
Felsstufen statt an geraden Linien im offenen Gelände (Gras über der oberen Stufe, Erde dazwischen, Sand
unter der unteren); der Rastplatz ist eine Haltebucht aus Asphalt.

**Hinterzimmer.** (1, 2) Mags und Ruth Keene stehen je an einem Brett; sitzende Figurenbilder gibt es
nicht. (3) Gestapelte Kisten statt des Werkbankstücks, ein zweites Fass und eine Kiste in der Ecke. (4) Ein
Kreidespringer auf der Tafel zeigt den Treffpunkt. Die Dielen sind das Material des Kartenbilds.

**Zustände (10.63):**

| Karte                   | Bedingung       | Szene                          | Was sich ändert                           |
| ----------------------- | --------------- | ------------------------------ | ----------------------------------------- |
| `wegDesertSummit.diner` | `neonRepariert` | `weg-desert-summit-diner-neon` | Schild leuchtet ganz, kein Neon-K im Sand |

Der Zustand ist aus der neuen Hauptfassung (C) neu abgeleitet. Bergstraße und Hinterzimmer haben keine
Zustände: Die Geschichte ändert dort keine festen Objekte.
