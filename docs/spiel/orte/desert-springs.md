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

Der Talboden kommt am **Ostrand bei den Reihen 14–15** an (`zurueckCanyon`) und läuft nach Westen.
Bei Spalte 90 (A) überspannt der **Felsbogen** den Weg (Durchgang 3 breit). Dahinter liegt nördlich
des Wegs ein Felsabsatz mit Bank, der **Aussichtspunkt** (`aussichtspunkt`): Blick nach Westen auf die
**Eisenbahnbrücke von 1879**, die den Canyon von Nord nach Süd überspannt (Spalten 60–62 in A). Die
alte Strecke in die Stadt wird nicht mehr befahren; man geht **unter der Brücke** hindurch, am
Brückenfuß sitzen die Nieten „J. H.“ (`fundNieten`). Danach fällt der Weg in Kehren zum **Westrand bei
den Reihen 20–21** (`weiterDesert`, Abstieg zur Stadt). Die Felder von Bogen, Brücke, Aussicht und
Nieten wandern je Variante mit (Regel 10.37).3. **Bilder** (bestellt und geliefert in der Nacht 9./10.11.2026, eingebaut): roter Fels (`felsRot`,
`sandRot`, `felsbodenRot`), Felsbogen, Eisenbahnbrücke 1879 mit Gussschild „J. H. 1879“, Säulen-,
kleine und blühende Kakteen, Motel mit Neonschild, Garage mit Rolltor, Wüstenbahnhof, alter Bahnhof
mit Veranda und Schild ANTIQUARIAT, Diner-Wagen, Miras flacher Stein, Geierkreis. 4. **Felsbogen und Brücke** sind Frontansichten mit Durchgang nach Norden und Süden. Sie stehen deshalb
über senkrechten Stücken des Wegs, die Pfeiler auf Fels, das Bild vorn gezeichnet; man geht durch
den Bogen und unter der Brücke hindurch. 5. **Motel:** Der Gang vor den Zimmern (unterste Bildreihe) ist gesperrt, weil ein Möbel nur ganz
gesperrt sein kann; man steht am Auslöser `motel` davor im Hof.
