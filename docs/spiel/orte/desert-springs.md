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
| `desertSprings.aussen`          | 60 × 40  | Canyonrand → Antiquariat 50 | ≈ 14 s      |
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
den Bogen und unter der Brücke hindurch. 5. **Motel und Bahnhof:** Der Gang vor den Motelzimmern und die Veranda des alten Bahnhofs sind
begehbar (`frei_unten: 1` im Möbel, seit 10.11.2026).

## Runde 9: Stadt und Innenräume nach dem Gutachten (10.11.2026, mittel-2)

### Antworten auf die drei Mängel (variantenwahl.md)

- **`desertSprings.aussen` (Hauptfassung C):**
  1. **Old Mother Road:** hat jetzt eine gestrichelte Mittellinie (neue Böden `asphaltMitte` und
     `asphaltMitteSenkrecht` aus LimeZus Stadtbogen). Sie biegt mit abgeschrägter Ecke statt im
     rechten Winkel zum Hof ab.
  2. **Diner und Bahnhof:**
     - Der Diner trägt die neue Diner-Fassade (mittel-1) statt des silbernen Wagens aus Crossroads.
     - Der Bahnsteig ist drei Reihen tief vor dem alten Bahnhof, mit zwei Bänken. Der Bahnhof steht
       direkt daran, die Rückseite zu den Gleisen.
     - Motel und Garage bleiben: Die Garage ist der Clubraum, das Motel nennt die Geschichte. Ob
       Crossroads sein Motel tauscht, entscheidet mittel-3.
  3. **Leere Sandflächen:** bekommen Saguaros, blühende Kakteen und Felsgruppen (Süden, am
     Wasserturm, Osten). Der rote Fels am oberen Rand bleibt die Wand. Eine rote Felsklippe gibt es
     erst mit dem Bildwunsch von mittel-4.
- **`desertSprings.garage`:**
  - Der Werktisch steht an der Nordwand neben dem Werkzeugregal; die Holzbank ohne Grund ist weg.
  - Am Auto stehen Werkzeugkiste und Ölkanister, die Fässer zusammen in der Ecke.
  - Rechts kommen Werkzeugschrank und liegende Reifen in die leere Hälfte.
  - Einen Ölfleck gibt es nicht als Bild; er wäre ein kleiner Bildwunsch.
- **`desertSprings.antiquariat`:**
  - Kellerluke, Briefkiste und Zeitungen liegen links, wie es die Beschreibung sagt.
  - Statt Kasten und leerer Vitrine gibt es eine lange Holztheke mit Kasse und eine Vitrine mit
    Inhalt.
  - Eine kleine Wanduhr ersetzt die zwei Kacheln große Bahnhofsuhr; dazu helle Dielen.

### Zustände

| Karte                       | Zustand         | Bedingung                          | Was sich ändert                                                            | Quelle                                                           |
| --------------------------- | --------------- | ---------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `desertSprings.aussen`      | `meisterschaft` | `endeAkt3Gesehen`                  | drei Fahrerautos auf dem Hof vor dem Motel, Banner der Landesmeisterschaft | 13_Wegenetz, Akt 4: Dot vermietet Zimmer an Meisterschaftsfahrer |
| `desertSprings.antiquariat` | `leihgabe`      | `abschiedGesehen und briefGelesen` | Vitrine mit Hales Brief neben dem Lesetisch                                | 13_Wegenetz, Post-Game: Hales Brief als Leihgabe                 |

Die Garage hat keinen Zustand. Dass in Akt 4 Mira und Tomás unterwegs sind, betrifft nur Figuren.
„Erste Wärme, blühende Kakteen“ in Akt 3 ist die Grundkarte.

## Runde 7: Stadt und Leben (10.11.2026)

**Stadt (Regel 10.51, klein: 12 Gebäude):** Die Außenkarte ist von 56 auf 60 Spalten gewachsen. Im
Osten liegt ein Vorplatz mit Postamt (A), Sheriffbüro (B) oder Gemischtwarenladen (C). Dazu kommen
Kulissenhäuser ohne Innenraum: Wohnwagen und eine Blechhütte hinter dem Hof, Containerhäuser,
in B ein Pumpenhaus am Bahnsteig. Ihre Türen zeigen zum Gehweg, zum Hof oder zum Vorplatz.

**Leben (Regel 10.53):** 12 Statisten, 8 davon ansprechbar (`statist.desertSprings.aussen.*`):
Touristen am Bahnhof, Busgast, Postbotin (Fernschach per Postkarte), Hilfssheriff (Läufer in
Schlangenlinien, mit Antwort von Ambrose), Tankwart (Läufer quer übers Brett), Rentnerin (Schah und schachmatt),
Kind (Gabel), Händlerin vor dem Antiquariat (Saavedra-Stellung 1895, zeigt die Vorführung
`saavedraStellung`). Ohne Satz: Mechaniker, Trucker, Motelgast, Wanderin. Tiere: Hund,
Eidechse, Geier, Roadrunner, Katze, Hühner.

### Weg 6 in Runde 9: Mängel der Variantenwahl (10.11.2026, mittel-4)

**Canyonpfad (Wahl C).** (1) Der Canyon hat Felswände im Norden und die Kante der Hochfläche im Süden aus
roten Klippenkacheln (`"kante": "klippe"`, `"fels": "rot"`, Bildwunsch `bildwuensche/klippe_rot.py`); der
Zugang zur Sternwarte führt über eine Treppe. (2) Der Bahnhof liegt am Ausgang des Canyons auf derselben
Höhe wie der Pfad, eine Rampe braucht es nicht. (3) Die Gleise enden an Prellböcken: Das ist der
Kopfbahnhof der Wüstenbahn. Das trockene Bachbett ist ein zwei Reihen breiter Streifen aus rotem Felsboden
mit Kieseln am Südrand.

**Felsbogen (Wahl A).** (1) Rote Felswände und Kanten statt Grundriss. (2) Die alte Strecke liegt oben in
einem Einschnitt über die Hochfläche: nach Westen bis an den Kartenrand, mit Übergang und Andreaskreuzen am
Abstieg, nach Osten stillgelegt bis zum Prellbock vor dem Bogen. (3) Der Ostabsatz geht breit in den Weg
durch den Bogen über; die Bank steht am Rand des tiefen Tals mit Blick nach Süden.

**Zustände:** keine; die Geschichte ändert auf Weg 6 keine festen Objekte.

### Weg 6, Gutachten Runde 9 (10.11.2026, mittel-4)

- **Canyonpfad:** Ein Pfad aus hellem Sand führt vom Bahnhof zum Westrand und zur Treppe der
  Sternwarte. Nicht umgesetzt: **Boden und Hochfläche fast gleich rot** – die Hochfläche hat den
  rissigen Felsboden aus `klippe_rot.png`, der Boden roten Sand; **Prellbock** ersetzt mittel-2 zentral.
- **Felsbogen:** Die Brücke steht mittig über dem Weg, die Pfeiler beiderseits. Nicht umgesetzt:
  **leere Hochfläche** – auf Wandfeldern dürfen keine Objekte stehen.

**Restpunkte Weg 6 (10.11.2026):** Stahlprellböcke von mittel-2 an den Gleisenden (Canyonpfad und
Felsbogen); auf den Hochflächen stehen Felsen, flache Steine und Kakteen.

### Weg 6 in Runde 7: Ereignisort und Leben

**Ereignisort „Die Seilschaft“ (Dokument 15, 2.7):** Am Wandfuß beim Felsbogen hängen ein
Kletterseil und ein Seilhaken an der Felswand, davor zwei Rucksäcke und ein Kreidebeutel. Ringsum
ist Platz für drei bis sechs Figuren: in A südlich des Bogens, in B und C auf dem Absatz östlich
davon.

**3.3 Felder für Runde 6 (`wegDelacroixDesert.felsbogen`, begehbar):**

| Auslöser             | A        | B         | C        | Hinweis                           |
| -------------------- | -------- | --------- | -------- | --------------------------------- |
| `ereignisSeilschaft` | (99, 21) | (106, 14) | (98, 13) | am Seil, Mitte des Platzes        |
| `seite06`            | (93, 21) | (97, 20)  | (89, 13) | unter dem Felsbogen               |
| `finchLaeuferB`      | (65, 21) | (68, 20)  | (61, 7)  | Felsspalt, Finkenzeichen (Kreide) |

**Leben (Regel 10.53):**

- **Canyonpfad:** Vogelbeobachterin (Roadrunner, mit Antwort von Ambrose), Geologe, Wanderpaar
  (Doppelschritt erst seit dem späten Mittelalter), Fotograf.
- **Felsbogen:** Rangerin (Springer, Ritter und Pferd), Goldsucher, Radfahrerin (Geier wie
  Kiebitze), Fotograf.
- **Tiere auf beiden Karten:** Roadrunner, Eidechse, Geier, Wüstenhase, Kojote, Falke.

### Weg 6 in Runde 6: spielbar (10.11.2026, mittel-4)

- **Seilschaft** (`ereignisSeilschaft`, Dialog `weg-delacroix-desert.ereignis_seilschaft`):
  - Vor der Versöhnung liegen nur Seile und Rucksäcke da.
  - Danach rufen Wren Okoro (unten) und Sol Ferris (oben) um Hilfe.
  - Quest `wegDelacroixDesert.seilschaft` (klein), ein Schritt: Gedächtnisstellung
    `wegDelacroixDesert.seilschaft` (partieformen.json, fünf Sekunden; `beginneGedaechtnis`), danach
    `seilschaft_ende`.
  - Lohn: Fund `karabiner` und 20 Münzen.
- **Funde:** `seite06` (Kapitel 6, Mittelspielstrategie) und `finchLaeuferB` als Gegenstände an den
  Feldern aus 3.3.
- **Sperre S9:** Der Übergang `sternwarte` auf dem Canyonpfad hat den Dialog
  `weg-delacroix-desert.sternwarte_abzweig` und `wenn: sternwarteOffen`. Der Dialog setzt die
  Variable, wenn `hatLaterne` und `versoehnungGesehen` gelten; sonst nennt er den Grund (Geröll,
  Dunkelheit).
- **Offen:** Mira hat auf dem Canyonpfad keine eigene Figur. Ihr Stein (`stein`) bleibt der Ort von
  Szene 72; eine zweite Mira-Figur würde neben der Garage gleichzeitig stehen.
