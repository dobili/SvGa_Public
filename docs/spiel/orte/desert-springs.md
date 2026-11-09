# Desert Springs und der Weg durch den Canyon

Stand: 9.11.2026 (Nacht), Entwurf von mittel-4 für den Haupt-Chat. Ortsdokument nach
`docs/spiel/orte/README.md`: Ortsplan, Ortsbild, Abgleich mit der Geschichte, Bühnenbilder. Es umfasst
Weg 6 von Port Delacroix nach Desert Springs (`wegDelacroixDesert`: Canyonpfad und Felsbogen) und
Desert Springs (Ort 7) mit der Garage (Club) und dem Antiquariat im alten Bahnhof. Maßstab:
`KARTENREGELN.md` 7a.2. Quellen: `05_Story_Bibel.md` 16 bis 23 (besonders 18.4, 19.5, 19.6, Szenen 71
bis 80), `09_Weltbeschreibung.md` 4a und 5.8, `13_Wegenetz.md` Abschnitt 4 (S9, N5), `orte.json`.

Feld = (Spalte, Reihe), linke obere Kachel; Bereiche „Spalten / Reihen“. Norden ist oben.

## 1. Ortsplan

### 1.0 Lage in der Welt

```text
                                          N
   [Desert Springs] ◄══ Felsbogen (O→W) ◄══ Canyonpfad (O→W) ◄══ Wüstenbahnhof ◄══ Wüstenzug ══ [Port Delacroix]
        │ Old Mother Road nach Westen (nach Szene 80)          ┆ Abzweig Sternwarte N5 (S9, Runde 6)
        ▼
   [Weg 7: Diner, Bergstraße] ══ [Summit City]
```

Desert Springs liegt im Westen hinter einem Canyon (09, 5.8). Der Wüstenzug aus Port Delacroix hält
an einem einsamen Bahnhof oberhalb des Canyons am Ostrand des Canyonpfads; von dort geht es zu Fuß
nach Westen durch den Canyon, unter dem Felsbogen hindurch und an der Eisenbahnbrücke von 1879
vorbei hinunter in die Stadt. Die Bahnlinie läuft oben am Canyonrand weiter und erreicht die Stadt
über die Brücke; der Zug selbst fährt nur bis zum Wüstenbahnhof (Bibel 19.5), der alte Bahnhof von
Desert Springs ist seit langem ein Antiquariat. Eine direkte Verbindung nach Silicon Bay gibt es
nicht: Wer zurück will, nimmt die Schnellreise oder den Zug über Port Delacroix (Szene 80).

**Maße und Laufzeiten (7a.2: Weg ab Akt 2 zwei Karten, zusammen 280 bis 400 lang, 80 bis 115 s):**

| Karte                           | Größe    | Hauptweg (mit Kurven)       | Zeit zu Fuß |
| ------------------------------- | -------- | --------------------------- | ----------- |
| `wegDelacroixDesert.canyonpfad` | 160 × 30 | ≈ 180                       | ≈ 51 s      |
| `wegDelacroixDesert.felsbogen`  | 140 × 30 | ≈ 160                       | ≈ 46 s      |
| **Weg 6 zusammen**              | 300      | ≈ 340                       | **≈ 97 s**  |
| `desertSprings.aussen`          | 56 × 40  | Canyonrand → Antiquariat 50 | ≈ 14 s      |
| `desertSprings.garage`          | 18 × 12  | –                           | –           |
| `desertSprings.antiquariat`     | 20 × 13  | –                           | –           |

### 1.1 Canyonpfad (`wegDelacroixDesert.canyonpfad`, 160 × 30)

Der **Wüstenbahnhof** steht oben auf der Hochfläche am Ostrand (Spalten 146–159, Reihen 2–9):
Bahnsteig, Gleis bis zum Ostrand, Holzhäuschen, Wasserturm. Ankunft `start` auf dem Bahnsteig
(152, 9); `zurueckDelacroix` am Gleisende des Bahnsteigs (157, 9), Zug zurück nach Port Delacroix.
Der Pfad steigt über eine Rampe in den Canyon hinab und läuft in weiten Bögen zwischen roten
Felswänden (`#` mit `wand: fels`, oben und unten je 4 bis 9 Reihen) nach Westen. Der **Westrand**
öffnet sich bei den Reihen 14–15 (`weiterFelsbogen`).

| Abschnitt (Spalten)        | Thema                  | Inhalt                                                                     | Zum Entdecken                                      |
| -------------------------- | ---------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| CP1 (146–159) Bahnhof      | einsamer Halt          | Bahnsteig, Stationshäuschen, Wasserturm, Bank                              | Wasserturm, Fahrplan                               |
| CP2 (131–145) Rampe        | Abstieg                | Pfad fällt von der Hochfläche in den Canyon, Felsstufen                    | Blick nach Westen in den Canyon                    |
| CP3 (116–130) Wanderschild | Rätsel                 | Wanderschild mit Rätseltafel (`tafel`, (122, 13)), Bank                    | Rätseltafel (3 Königsangriffe)                     |
| CP4 (101–115) Trockenbach  | ausgetrocknet          | trockenes Bachbett mit Kieseln, Kakteen                                    | Eidechse sonnt sich                                |
| CP5 (86–100) Engstelle     | hohe Wände             | die Wände rücken zusammen (Pfad bleibt 3 breit), Schatten                  | Echo (Klang)                                       |
| CP6 (71–85) Kakteenhang    | erste Blüten           | Hang mit Kakteen, ein blühender                                            | Fund Eidechsenhaut (`fundEidechsenhaut`, (78, 18)) |
| CP7 (56–70) Miras Stein    | Stille                 | flacher roter Stein (`stein`, (62, 15)); Mira sitzt dort in Szene 72       | Miras Stein                                        |
| CP8 (41–55) Wanderin       | Rast                   | Mrs. Holloway rastet an einem Felsblock (`holloway`, (48, 12))             | Weisheit der Wanderin                              |
| CP9 (26–40) Abzweig        | Platzhalter Sternwarte | Seitenschlucht nach Norden, vorerst mit Geröll versperrt (N5, S9, Runde 6) | Geröll, Pfadreste                                  |
| CP10 (11–25) Weite         | der Canyon öffnet sich | breiter Talboden, Geier kreisen                                            | Geier (Belebung)                                   |
| CP11 (0–10) Ausgang        | zum Felsbogen          | Pfad zum Westrand, 2 breit                                                 | Felsbogen in der Ferne (Sichtachse)                |

**Ränder:** Norden und Süden Felswände bis zum Rand; im Osten läuft das Gleis am Bahnsteig vorbei
aus der Karte (der Rand selbst ist Fels, man kommt nur mit dem Zug weg); offen sind nur der
Bahnsteig (Übergang) und der Westrand (14–15).
**Sichtachse:** von CP10 nach Westen auf den Ausgang, über dem der Felsbogen auf der nächsten Karte
steht. **Laufzeit:** ≈ 180 Kacheln.

### 1.2 Felsbogen (`wegDelacroixDesert.felsbogen`, 140 × 30)

Der Pfad kommt am **Ostrand bei den Reihen 14–15** an (`zurueckCanyon`) und steigt auf einen
Felsabsatz. Bei Spalten 88–97 überspannt der **Felsbogen** den Pfad (Bild, Durchgang 3 breit). Dahinter
der **Aussichtspunkt** (`aussichtspunkt`, (80, 10)): Blick nach Süden in eine Seitenschlucht, über die
die **Eisenbahnbrücke von 1879** führt (Spalten 56–67, Reihen 4–9, quer). Der Pfad steigt in die
Seitenschlucht hinab, läuft **unter der Brücke** durch (Pfeiler mit den Nieten „J. H.“,
`fundNieten`, (61, 11)) und fällt in zwei Kehren zum **Westrand bei den Reihen 20–21**
(`weiterDesert`, Abstieg zur Stadt). Die Bahnlinie läuft am Nordrand von Ost nach West.

| Abschnitt (Spalten)        | Thema              | Inhalt                                                      | Zum Entdecken                  |
| -------------------------- | ------------------ | ----------------------------------------------------------- | ------------------------------ |
| FB1 (126–139) Eingang      | aus dem Canyon     | Pfad steigt auf den Felsabsatz                              | Felsstufen                     |
| FB2 (111–125) Absatz       | Weite              | Hochfläche mit Gras und Kakteen, Bahngleis am Nordrand      | Roadrunner rennt vorbei        |
| FB3 (98–110) vor dem Bogen | Sichtachse         | der Bogen erscheint frontal                                 | Felsbogen                      |
| FB4 (88–97) Felsbogen      | Versöhnung         | Durchgang unter dem Bogen, Abendlicht                       | Felsbogen                      |
| FB5 (74–87) Aussicht       | Blick in die Tiefe | Aussichtspunkt mit Geländer und Bank (`aussichtspunkt`)     | Brücke von 1879 (Sichtachse)   |
| FB6 (56–73) Brücke         | Nieten             | Abstieg unter die Brücke, Pfeiler mit Nieten (`fundNieten`) | Nieten „J. H.“                 |
| FB7 (36–55) Kehren         | Abstieg            | zwei Kehren, Geröll, Kakteen                                | Eidechsen                      |
| FB8 (16–35) Stadtblick     | Ankunft            | erste Lichter von Desert Springs (Sichtachse nach Westen)   | Wasserturm der Stadt (Kulisse) |
| FB9 (0–15) Ausgang         | zur Stadt          | Pfad zum Westrand, 2 breit                                  | Wegweiser „Desert Springs“     |

**Ränder:** Nord Bahngleis vor einer Felskante, Süd Felswand; offen Ost (14–15) und West (20–21).
**Laufzeit:** ≈ 160 Kacheln.

### 1.3 Desert Springs außen (`desertSprings.aussen`, 56 × 40)

```text
 Spalte: 0        10        20        30        40        50   55
 Reihe 0  ┌─────────────────── Felskante, Bahnlinie (Reihen 3–4) ──────────────┐
          │ Wasserturm   [alter Bahnhof / Antiquariat]   Bahnsteig (bahnhof)   │
 Reihe 8  │ [Diner]            Tür (24, 16)              [Tankstelle, Buck]    │
 R 17–21  ═══════════ Old Mother Road (Highway, West→Rand) ════════════════════│
 Reihe 22 │ [Motel ═════════ Zimmer 1–5 ═════][Garage, Tür (24, 29)]  Kakteen   │
          │ Parkplatz, Neon-Schild MOTEL       Hof                              │
 Reihe 33 │ Kakteengarten, Brachland                    Pfad vom Canyon ═══════ Ostrand (32–33)
 Reihe 39 └─────────────────────────── Felsen ─────────────────────────────────┘
```

- **Bahnlinie** Reihen 3–6 (zwei Schienenstränge auf Schotter), quer über die Karte; im Westen und
  Osten bis an den Rand (der Rand ist dort Fels, die Schienen laufen optisch hinaus).
- **Alter Bahnhof mit Antiquariat** Spalten 20–29 / 7–16, Tür (24, 16), Auslöser
  `antiquariatTuer` (24, 17); Bahnsteig hinter dem Haus, Auslöser `bahnhof` (32, 7) am Bahnsteig
  (Dialog, Ankunft vom Weg 7 nach Szene 80).
- **Diner** 4–13 / 9–16 mit Schild „DINER“, **Tankstelle** 38–49 / 6–16 mit Zapfsäulen; Buck spielt
  auf der Motorhaube eines Wagens vor der Tankstelle (`buck`, (44, 18)).
- **Old Mother Road** Reihen 18–20 (Asphalt), Gehwege 17 und 21, vom **Westrand** (`highway`,
  (0, 18)–(0, 20), erst nach Szene 80) bis zur Kurve am Ostende, wo sie in den Hof der Garage mündet.
- **Motel** 6–19 / 22–28 (fünf Zimmertüren, Schild „MOTEL“ an der Straße, Auslöser `motel` (12, 29)
  zum Ansehen), **Garage** 20–25 / 23–28, Tür (22, 28), Auslöser `garageTuer` (22, 29).
- **Pfad vom Canyon** Reihen 32–33 vom **Ostrand** (`canyon`, (55, 32)–(55, 33)) nach Westen zum Hof.

### 1.4 Gebäude innen

| Karte         | Größe   | Tür (Südwand) | Ankunft  |
| ------------- | ------- | ------------- | -------- |
| `garage`      | 18 × 12 | (9, 11)       | (9, 10)  |
| `antiquariat` | 20 × 13 | (10, 12)      | (10, 11) |

### 1.5 Übergänge (Felder auf beiden Seiten)

| Von (Karte, Auslöser, Feld)                        | Nach (Karte, Auslöser, Feld)                      | Lage, Bedingung                                           |
| -------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| portDelacroix.aussen `wuestenzug` (mittel-1)       | canyonpfad `start` (152, 9)                       | Zug, Ankunft auf dem Bahnsteig                            |
| canyonpfad `zurueckDelacroix` (157, 9)             | portDelacroix.aussen `wuestenzug`                 | Zug zurück, Dialog `zurueck_delacroix`                    |
| canyonpfad `weiterFelsbogen` Westrand (0, 14–15)   | felsbogen `zurueckCanyon` Ostrand (139, 14–15)    | Pfad, 2 breit, gleiche Reihen                             |
| felsbogen `weiterDesert` Westrand (0, 20–21)       | desertSprings.aussen `canyon` Ostrand (55, 32–33) | Pfad, 2 breit; Dialog `ankunft_zu_fuss`                   |
| desertSprings.aussen `garageTuer` (22, 29)         | garage `garageAusgang` (9, 11)                    | Südfassade 1/3 ↔ Südwand 1/2                              |
| desertSprings.aussen `antiquariatTuer` (24, 17)    | antiquariat `antiquariatAusgang` (10, 12)         | Südfassade 1/2 ↔ Südwand 1/2                              |
| desertSprings.aussen `highway` Westrand (0, 18–20) | wegDesertSummit.diner `zurueckDesert` (Akt 4)     | `wenn: endeAkt3Gesehen`; zurück kommt man am `bahnhof` an |

### 1.6 Platzhalter für später

- Canyonpfad CP9: Abzweig zur Sternwarte N5 (S9, Laterne und Versöhnung), Runde 6.
- Antiquariat: freie Vitrine für Hales Brief als Leihgabe (Post-Game, 13 Abschnitt 4).
- Garage: freie Wand für die Clubnadel und Miras Dosenpokal (Fund).

## 2. Ortsbild

### 2.1 Der Canyonpfad

Der Zug hält, weil hier jemand ein Schild aufgestellt hat, nicht weil hier jemand wohnt. Ein
Holzhäuschen, ein Wasserturm mit Rostflecken, eine Bank, auf der der Wind sitzt. Dann der Abstieg:
Der Fels ist rot wie Ziegel, oben fast orange, unten im Schatten dunkel wie Wein. Es ist still, so
still, dass man die eigenen Schritte auf dem Kies hört. Eidechsen sonnen sich auf flachen Steinen und
sind weg, bevor man hinsieht; ein Roadrunner kreuzt den Pfad, als hätte er einen Termin. Im
trockenen Bachbett liegen Kiesel, rund geschliffen von einem Wasser, das seit Jahren nicht kam. Die
Kakteen tragen die ersten Knospen. Auf einem flachen Stein sitzt ein Mädchen mit einem Brett und
opfert seine Dame.

### 2.2 Der Felsbogen

Gegen Abend wird das Licht kupfern. Der Bogen steht über dem Pfad wie ein Tor, das keiner gebaut hat.
Vom Aussichtspunkt sieht man die alte Eisenbahnbrücke: genietetes Eisen, schwarzbraun, so fest, als
wolle sie noch hundert Jahre stehen. Unten am Pfeiler, auf Augenhöhe, eine Reihe Nieten, und auf
einer steht „J. H.“. Dahinter fällt der Pfad in Kehren zur Stadt, deren erste Lichter angehen.

### 2.3 Desert Springs

Eine Straße, ein Motel, ein Diner, eine Tankstelle, ein alter Bahnhof, der keiner mehr ist. Die Old
Mother Road kommt von Westen und hört hier fast auf. Am Motel blinkt ein Schild „MOTEL“, bei dem
das O manchmal aussetzt; Dot gießt die Kakteen in Kaffeedosen. Neben dem Motel die Garage von Tomás:
das Rolltor halb offen, drinnen riecht es nach Öl, ein Schachbrett liegt auf einem Reifenstapel. Vor
der Tankstelle sitzt Buck auf der Motorhaube eines alten Wagens, die Uhr neben sich. Vor dem Diner
schläft ein Hund im Schatten. Der alte Bahnhof hat eine Veranda, auf der Mr. Okoro Bücher in der
Sonne ausbleicht; drinnen stapeln sich Kisten mit Briefen, und im Keller liegt der Kram eines alten
Brückenbauers.

### 2.4 Garage und Antiquariat

**Garage:** Betonboden mit Ölflecken, Werkbank mit Werkzeugwand, Reifenstapel mit Brett, ein
Klapptisch für den Club mit vier Stühlen, Kühlbox, Ventilator, Miras Dosenpokal auf einem Regal.
**Antiquariat:** Holzdielen, Regale bis an die Decke, Bücherstapel auf dem Boden, Kisten mit
Briefen, ein Tresen mit Kasse, eine Leselampe, alte Fahrkarten in einer Glasvitrine, die Kellerluke.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Karte       | Szenen     | Figuren und Auslöser (orte.json)                                                                | Belebung                               |
| ----------- | ---------- | ----------------------------------------------------------------------------------------------- | -------------------------------------- |
| canyonpfad  | 71, 72     | `start`, `zurueckDelacroix`, `tafel`, `fundEidechsenhaut`, `stein`, `weiterFelsbogen`; Holloway | Eidechsen, Roadrunner, Geier           |
| felsbogen   | 73         | `zurueckCanyon`, `aussichtspunkt`, `fundNieten`, `weiterDesert`                                 | Roadrunner, Eidechsen                  |
| aussen      | 74, 79     | `canyon`, `garageTuer`, `antiquariatTuer`, `motel`, `bahnhof`, `highway`; Buck                  | Hund, Touristen, Tankwart, Mann am Bus |
| garage      | 75, 77, 78 | `garageAusgang`; Mira, Tomás, Dot                                                               | –                                      |
| antiquariat | 76         | `antiquariatAusgang`; Okoro                                                                     | –                                      |

### 3.2 Was bleibt, was sich ändert, was entfällt

- **Bleibt:** Wüstenbahnhof, roter Canyon, Miras Stein, Felsbogen, Brücke von 1879 mit Nieten, Motel
  mit Garage, Diner, Tankstelle, Antiquariat im alten Bahnhof.
- **Ändert sich:** Der Zug fährt nur bis zum Wüstenbahnhof; die Brücke trägt die alte Strecke in die
  Stadt, auf der heute kein Zug mehr hält (das passt zum Bahnhof als Antiquariat).
- **Entfällt vorerst:** Abzweig zur Sternwarte (Runde 6), Neon-Animation, Nachtszene 79 (Tönung der
  Szene, keine eigene Karte).

### 3.3 Befunde und offene Punkte für den Haupt-Chat

1. **Mira im Canyon (Szene 72):** Die Figur `mira` gehört zum Ort `desertSprings`; auf dem Canyonpfad
   gibt es nur den Auslöser `stein`. Vorschlag für Runde 6: eine Figur `wegDelacroixDesert.mira`
   (gleiches Sprite) oder der Dialog am `stein` zeigt sie. Bis dahin steht sie nicht auf der Karte.
2. **Ansehen für Runde 6:** Wasserturm, Fahrplan am Wüstenbahnhof, Geröll am Abzweig, Wegweiser
   „Desert Springs“, Hund vor dem Diner, Miras Dosenpokal (Fund nach Bibel 21), Kellerluke im
   Antiquariat.
3. **Bilder bestellt** (9.11.2026 nachts): roter Fels als Wand und Boden, Felsbogen, Eisenbahnbrücke
   1879 mit Nietenschild, Kakteen, Motel mit Schild, Garage mit Rolltor, Wüstenbahnhof, alter
   Bahnhof mit Veranda, Diner, flacher Stein. Bis dahin Ersatz aus dem Katalog, in den Szenen genannt.

## 4. Bühnenbilder

### 4.1 Canyonpfad

Boden: Sand und Felsboden, Pfad Erde (2 bis 3 breit). Wände: Fels (`wand: fels`), oben und unten
4 bis 9 Reihen, mit Buchten. Inventar: Stationshäuschen (Ersatz Holzschuppen), Wasserturm,
Bahnsteig mit Bank und Fahrplan, Gleis am Bahnsteig, Wanderschild mit Rätseltafel,
Kakteen (Ersatz Feigenkaktus), Felsgruppen, Kiesel im Bachbett, Miras flacher Stein (Ersatz flacher
Fels), Felsblock der Wanderin, Geröll am Abzweig.

### 4.2 Felsbogen

Boden: Felsboden, Gras auf der Hochfläche, Pfad Erde. Wände: Fels. Inventar: Felsbogen (Ersatz zwei
Felssäulen mit Durchgang, bis das Bild kommt), Aussichtspunkt mit Geländer und Bank, Eisenbahnbrücke
(Ersatz: Brückenbild quer über der Seitenschlucht), Gleis am Nordrand, Kakteen, Wegweiser.

### 4.3 Desert Springs außen

Boden: Sand, Straße Asphalt mit Gehwegen, Hof und Parkplatz Pflaster. Inventar: Gebäude nach 1.3
(Ersatz aus Generic Building, bis Motel, Diner und Bahnhof kommen), Tankstelle `Gas_Station_1`,
Wasserturm, Schild „DINER“ (eigenes Bild), Autos, Kakteen, Bänke, Laternen (eine Bauart), Felsen am
Südrand.

### 4.4 Garage (18 × 12)

| Zone      | Gegenstand                             | Zweck                     |
| --------- | -------------------------------------- | ------------------------- |
| Nordwand  | Werkbank, Werkzeugregal, Fenster       | Tomás' Werkstatt          |
| Ostseite  | Reifenstapel mit Brett, Kühlbox        | Miras Trainingsplatz      |
| Mitte     | Clubtisch mit vier Stühlen             | Aufgabenreihen, Clubkampf |
| Westseite | Auto unter Plane oder Motorrad, Ölfass | Werkstatt                 |
| Südwand   | Tür (9, 11), Fußmatte                  | Eingang                   |

### 4.5 Antiquariat (20 × 13)

| Zone        | Gegenstand                                     | Zweck                          |
| ----------- | ---------------------------------------------- | ------------------------------ |
| Nordwand    | Bücherregale, Fenster, alte Bahnhofsuhr        | Laden                          |
| Seitenwände | Regale in Seitenansicht                        | Bücher an allen Wänden (10.46) |
| Mitte       | Regalreihen, Bücherstapel, Lesetisch mit Lampe | Stöbern                        |
| Ostseite    | Tresen mit Kasse, Mr. Okoro                    | Laden                          |
| Westseite   | Kisten mit Briefen, Kellerluke                 | Szene 76                       |
| Südwand     | Tür (10, 12)                                   | Eingang                        |
