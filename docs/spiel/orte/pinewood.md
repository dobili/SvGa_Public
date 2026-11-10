# Pinewood Camp und die Wege dorthin und weiter

Stand: 10.11.2026 (Nacht), Entwurf von mittel-4 für den Haupt-Chat. Ortsdokument nach
`docs/spiel/orte/README.md`. Es umfasst Weg 9 von Crossroads nach Pinewood Camp
(`wegCrossroadsPinewood`: Hütten und Riesenbäume, Landschaft L2 Fernwanderweg „Long Ridge Trail“),
Pinewood Camp (Ort 10) im Red-Giants-Nationalpark (O3) und Weg 10 von Pinewood nach Ghost Town
(`wegPinewoodGhost`: Canyonrand und Staubstraße, L3 Echo Canyon). Maßstab: `KARTENREGELN.md` 7a.2.
Quellen: `05_Story_Bibel.md` 25 bis 35 (besonders 27.3, 28, Szenen 94 bis 97), `09_Weltbeschreibung.md`
4a, 5.12, 5.13, `10_Sprueche_Schauplaetze_Varianten.md` 3a (L2, L3, O3), `13_Wegenetz.md` 5 (Pinewood
ist ein Abstecher; S13 nie über Pinewood), `orte.json`.

Feld = (Spalte, Reihe), linke obere Kachel; Bereiche „Spalten / Reihen“. Norden ist oben. Jahreszeit:
Sommer.

## 1. Ortsplan

### 1.0 Lage in der Welt

```text
                                         N
                          ┌──── Hütten (O→W) ◄══════ [9 Crossroads]
                          ▼
                  Riesenbäume (N→S)
                          ▼
                 [10 Pinewood Camp] ══► Canyonrand (W→O) ══► Staubstraße (W→O) ══► [11 Ghost Town]
```

Pinewood liegt südwestlich von Crossroads, Ghost Town südlich von Crossroads und östlich von Pinewood
(`13_Wegenetz.md`, Skizze). Weg 9 führt deshalb erst nach Westen über den Fernwanderweg mit der
Schutzhütte, dann nach Süden durch den Hain der Riesenbäume hinunter ins Camp am See. Weg 10 führt vom
Camp nach Osten am Rand eines Canyons entlang und über eine staubige Straße nach Ghost Town. Pinewood
ist ein Abstecher; die Alte Minenstraße Q4 (S13) verbindet Crossroads und Ghost Town direkt und führt
nie über Pinewood.

**Maße und Laufzeiten (7a.2: Weg ab Akt 2 zwei Karten, zusammen 280 bis 400 lang):**

| Karte                                | Größe    | Hauptweg      | Zeit zu Fuß |
| ------------------------------------ | -------- | ------------- | ----------- |
| `wegCrossroadsPinewood.huetten`      | 150 × 30 | ≈ 165         | ≈ 47 s      |
| `wegCrossroadsPinewood.riesenbaeume` | 40 × 130 | ≈ 150         | ≈ 43 s      |
| **Weg 9 zusammen**                   | 280      | ≈ 315         | **≈ 90 s**  |
| `pinewoodCamp.aussen`                | 60 × 44  | Nord → Ost 60 | ≈ 17 s      |
| `wegPinewoodGhost.canyonrand`        | 150 × 30 | ≈ 165         | ≈ 47 s      |
| `wegPinewoodGhost.staubstrasse`      | 150 × 30 | ≈ 155         | ≈ 44 s      |
| **Weg 10 zusammen**                  | 300      | ≈ 320         | **≈ 91 s**  |

### 1.1 Hütten (`wegCrossroadsPinewood.huetten`, 150 × 30)

Der Fernwanderweg (Erde, 2 breit) kommt am **Ostrand bei den Reihen 14–15** aus Crossroads
(`zurueckCrossroads`) und läuft in Bögen durch lichten Kiefernwald nach Westen zum **Westrand bei den
Reihen 14–15** (`weiterRiesenbaeume`). In der Mitte die **Schutzhütte** mit Veranda; dort spielt
Hüttenwirtin Greta Blindschach (L2).

| Abschnitt (Spalten)     | Thema        | Inhalt                                                  | Zum Entdecken            |
| ----------------------- | ------------ | ------------------------------------------------------- | ------------------------ |
| HU1 (135–149) Ausgang   | Stadtrand    | Wegweiser „LONG RIDGE TRAIL“, Zaun, Gras                | Wegweiser                |
| HU2 (120–134) Wiese     | Sommer       | Blumenwiese, Bach mit Steg                              | Bach                     |
| HU3 (105–119) Wald      | lichter Wald | Kiefern, Farne, Wanderer mit Riesenrucksack (Statist)   | Wanderer                 |
| HU4 (90–104) Tafel      | Rätsel       | Rätseltafel am Wegrand (`tafel`)                        | Tafel                    |
| HU5 (70–89) Schutzhütte | Rast         | Schutzhütte mit Veranda, Holzstapel, Wasserfass, Greta  | Greta, Blindschach       |
| HU6 (55–69) Lichtung    | Picknick     | Picknicktisch, Feuerstelle aus Steinen                  | Feuerstelle              |
| HU7 (35–54) Hang        | Steine       | Weg steigt an, Felsen, Moos                             | Bärenspur (Bodenbild)    |
| HU8 (15–34) Kamm        | Ausblick     | erster Blick auf die Riesenbäume im Westen (Sichtachse) | Riesenbäume in der Ferne |
| HU9 (0–14) Ausgang      | in den Hain  | Weg zum Westrand                                        | –                        |

### 1.2 Riesenbäume (`wegCrossroadsPinewood.riesenbaeume`, 40 × 130)

Der Weg kommt am **Ostrand oben bei den Reihen 4–5** (`zurueckHuetten`) an und windet sich in Kehren
nach Süden zwischen Mammutbäumen hindurch (Stämme 4 Kacheln breit), vorbei am **Ranger-Häuschen**
(`rangerhaus`, Ansehen) zum **Südrand bei den Spalten 19–20** (`weiterCamp`). Nebel am Morgen als
Tönung der Szene, Bärenspuren auf dem Weg.

| Abschnitt (Reihen)       | Thema        | Inhalt                                         | Zum Entdecken    |
| ------------------------ | ------------ | ---------------------------------------------- | ---------------- |
| RB1 (0–14) Eingang       | Waldrand     | Kiefern, der Weg biegt nach Süden              | Wegweiser        |
| RB2 (15–34) erste Riesen | Staunen      | zwei Mammutbäume rechts und links des Wegs     | Riesenbaum       |
| RB3 (35–54) Ranger       | Station      | Ranger-Häuschen mit Fahne, Bank (`rangerhaus`) | Rangerhaus       |
| RB4 (55–79) Hain         | dichter Hain | Mammutbäume dicht an dicht, Farne              | Bärenspuren      |
| RB5 (80–104) Bach        | Wasser       | Bach quer, Holzsteg                            | Steg, Libellen   |
| RB6 (105–129) Abstieg    | zum Camp     | lichter, Blick auf den See (Sichtachse)        | See in der Ferne |

### 1.3 Pinewood Camp (`pinewoodCamp.aussen`, 60 × 44)

```text
 Spalte: 0        10        20        30        40        50      59
 Reihe 0  ┌──── Riesenbäume ─────── Weg (19–20) ────── Riesenbäume ────┐
          │ Hütte  Hütte          Kiosk          Hütte  Hütte          │
 Reihe 12 │        Lagerfeuerplatz (Kreis, Baumstämme)  Fahnenmast     ═ Ostrand (24–25) → Canyonrand
          │ Zelte          Wiese, Picknick           Rangerin Hollis   │
 Reihe 28 │ ≈≈≈≈≈≈≈≈≈≈≈ See ≈≈≈≈≈≈≈≈≈≈≈≈  Steg  Kanus  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈│
 Reihe 43 └──── See bis zum Südrand ─────────────────────────────────────┘
```

- **Nordrand Spalten 19–20:** `wegCrossroads` (aus den Riesenbäumen).
- **Ostrand Reihen 24–25:** `wegGhost` (zum Canyonrand).
- **Lagerfeuer** in der Mitte (`lagerfeuer`, Szene 95), **Kiosk** (`kiosk`, Laden von Ezra).
- Hütten, Zelte, See mit Steg und Kanus im Süden (bis zum Rand, Regel 6.3), Riesenbäume am Nordrand.
- Figuren: Ezra am Lagerfeuer, Hollis unter den Riesenbäumen (Szene 96), Dex, Mae, Lou, Tamsin.

### 1.4 Canyonrand (`wegPinewoodGhost.canyonrand`, 150 × 30)

Der Weg kommt am **Westrand bei den Reihen 14–15** (`zurueckCamp`) aus dem Wald und läuft am Rand
eines Canyons nach Osten: Im Süden fällt eine rote Felskante ab, im Norden Kiefern und Fels. An einer
**Kletterwand** spielen Kletterer Drei-Schach (L3), Kletterin Juniper. **Ostrand Reihen 14–15**
(`weiterStaubstrasse`).

| Abschnitt (Spalten)     | Thema        | Inhalt                                                 | Zum Entdecken        |
| ----------------------- | ------------ | ------------------------------------------------------ | -------------------- |
| CR1 (0–19) Waldende     | Abschied     | letzte Kiefern, Weg wird steinig                       | Zapfen               |
| CR2 (20–49) Kante       | Tiefe        | Felskante im Süden mit Geländer                        | Blick in den Canyon  |
| CR3 (50–79) Kletterwand | Klettern     | Kletterwand mit Seilen, Juniper, Rätseltafel (`tafel`) | Juniper, Drei-Schach |
| CR4 (80–109) Echo       | Echo         | Felsnase, Bank                                         | Echo (Klang)         |
| CR5 (110–149) Ausgang   | in die Ebene | Fels wird flacher, Wegweiser „GHOST TOWN“              | Eidechsen            |

### 1.5 Staubstraße (`wegPinewoodGhost.staubstrasse`, 150 × 30)

Eine Schotterpiste (2 breit, eine alte Fahrspur) vom **Westrand bei den Reihen 14–15**
(`zurueckCanyonrand`) nach Osten zum **Ostrand bei den Reihen 14–15** (`weiterGhost`). Mittagshitze,
Staubteufel (Belebung), verlassene Zäune, ein liegengebliebener Wagen, Telegrafenmasten. Sepia beginnt
erst als Tönung der Szene, die Karte bleibt farbig.

### 1.6 Übergänge (Felder auf beiden Seiten)

| Von (Karte, Auslöser, Feld)                          | Nach (Karte, Auslöser, Feld)                            | Lage                   |
| ---------------------------------------------------- | ------------------------------------------------------- | ---------------------- |
| crossroads.aussen `wegPinewood` Westrand (mittel-3)  | huetten `zurueckCrossroads` Ostrand (149, 14–15)        | Vorschlag, abzustimmen |
| huetten `weiterRiesenbaeume` Westrand (0, 14–15)     | riesenbaeume `zurueckHuetten` Ostrand (39, 4–5)         | Weg 2 breit            |
| riesenbaeume `weiterCamp` Südrand (19–20, 129)       | pinewoodCamp.aussen `wegCrossroads` Nordrand (19–20, 0) | Weg 2 breit            |
| pinewoodCamp.aussen `wegGhost` Ostrand (59, 24–25)   | canyonrand `zurueckCamp` Westrand (0, 14–15)            | Weg 2 breit            |
| canyonrand `weiterStaubstrasse` Ostrand (149, 14–15) | staubstrasse `zurueckCanyonrand` Westrand (0, 14–15)    | Weg 2 breit            |
| staubstrasse `weiterGhost` Ostrand (149, 14–15)      | ghostTown.aussen `wegPinewood` Westrand (niedrig-1)     | Vorschlag, abzustimmen |

## 2. Ortsbild

**Hütten:** Ein Sommermorgen am Long Ridge Trail. Der Weg ist weich von Nadeln, es riecht nach Harz und
nassem Moos. Wanderer mit Rucksäcken, so groß wie Kühlschränke, grüßen kurz. Die Schutzhütte ist aus
dunklen Bohlen, auf der Veranda sitzt Greta mit einer Kanne Kaffee und ruft Züge in den Wald, ohne
Brett. **Riesenbäume:** Plötzlich wird es still und kühl. Die Stämme sind rot und so breit wie ein
Haus, oben verliert sich die Krone im Nebel. Im weichen Boden eine Bärenspur, frisch. Das
Ranger-Häuschen hat eine Fahne und eine Tafel „Bitte keine Lebensmittel draußen lassen“. **Camp:**
Hütten am See, Kinderstimmen, ein Betreuer pfeift. Kanus liegen kieloben am Ufer, Libellen über dem
Wasser, abends knistert das Lagerfeuer, und Mae zeigt allen die Sterne. **Canyonrand:** Der Wald hört
auf, der Fels fängt an. Seile klirren an der Kletterwand, jedes Schach hallt dreimal. **Staubstraße:**
Mittag. Die Luft flimmert, ein Staubteufel tanzt über die Straße, ein Zaun steht schief, irgendwo
klappert ein Blech. Die Farben werden blass.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Karte        | Szene  | Figuren und Auslöser (orte.json)                                                        |
| ------------ | ------ | --------------------------------------------------------------------------------------- |
| huetten      | 94     | `start`, `zurueckCrossroads`, `tafel`, `weiterRiesenbaeume`; Greta                      |
| riesenbaeume | 94     | `zurueckHuetten`, `rangerhaus`, `weiterCamp`                                            |
| camp         | 95, 96 | `wegCrossroads`, `lagerfeuer`, `kiosk`, `wegGhost`; Ezra, Hollis, Dex, Mae, Lou, Tamsin |
| canyonrand   | 97     | `start`, `zurueckCamp`, `tafel`, `weiterStaubstrasse`; Juniper                          |
| staubstrasse | 97     | `zurueckCanyonrand`, `weiterGhost`                                                      |

### 3.2 Was bleibt, was sich ändert, was entfällt

- **Bleibt:** Schutzhütte mit Greta, Mammutbäume, Rangerhaus, Camp am See mit Lagerfeuer und Kiosk,
  Kletterwand am Canyonrand, Staubstraße.
- **Ändert sich:** Weg 9 biegt in den Riesenbäumen nach Süden (Lage von Pinewood südwestlich von
  Crossroads), deshalb ist die Riesenbaumkarte hoch statt breit.
- **Entfällt vorerst:** Nebel und Sepia (nur Tönung der Szene), Wanderer und Staubteufel als Belebung.

### 3.3 Befunde und offene Punkte für den Haupt-Chat

1. **Ränder zu Crossroads und Ghost Town:** siehe Nr. 4.
2. **Ansehen für Runde 6:** Wegweiser „LONG RIDGE TRAIL“, Bärenspur, Feuerstelle an der Lichtung,
   Steg am See, Kanus, Kletterwand, liegengebliebener Wagen auf der Staubstraße.
3. **Bilder** (bestellt und geliefert in der Nacht 10.11.2026, eingebaut): Mammutbaum und Stammfuß,
   Schutzhütte, Campbude, Rangerhaus, Kiosk, Kanus, Bootssteg, Kletterwand, Seilhaken, Bärenspur,
   Wegweiser „LONG RIDGE TRAIL“, Staubteufel, große Feuerstelle. Ein Mammutbaum sperrt sein ganzes Bild
   außer der obersten Reihe; dichte Haine entstehen deshalb aus Stammfüßen.
4. **Ränder abgestimmt:** crossroads.aussen `wegPinewood` am Westrand 14–15 (mittel-3, 9.11.2026);
   ghostTown.aussen `wegPinewood` am Westrand 14–15 ist niedrig-1 vorgeschlagen.

### 3.4 Runde 7: Ereignisorte und Belebung auf Weg 9 (mittel-3, 10.11.2026)

**Lebendschach (Dokument 15, 2.11)** in `riesenbaeume`: eine Lichtung neben dem Weg mit einem
Rasenbrett 8 × 8 aus Gras und Kies, einer Holztribüne (`n6Tribuene`) im Norden und vier Fahnen an
den Ecken (`cr8FahneWeiss` links, `cr8FahneSchwarz` rechts). Lichtung links oben: A (28, 79),
B (18, 71), C (8, 85).

**Holzfällerhütte (K4)** in `huetten`: Hütte `cr8Holzfaellerhuette` mit Holzstapel und Trampelpfad
zum Weg; an ihrer Wand der Kreidespringer (`cr8Kreidespringer`). Hütte links oben:
A (96, 3), B (30, 3), C (38, 3).

Felder für Runde 6 (frei begehbar):

| Auslöser               | A         | B        | C        | Ort                                    |
| ---------------------- | --------- | -------- | -------- | -------------------------------------- |
| `ereignisLebendschach` | (38, 85)  | (28, 77) | (18, 91) | riesenbaeume, Rand der Lichtung        |
| `seite10`              | (24, 106) | (16, 68) | (17, 18) | riesenbaeume, am Fuß eines Mammutbaums |
| `kreide4`              | (100, 8)  | (34, 8)  | (42, 8)  | huetten, vor der Wand der Hütte        |

**Belebung (Regel 10.53):** je Karte vier ansprechbare Statisten und sechs Tiere, in A, B, C
dieselben. Hütten (`statist.wegCrossroadsPinewood.huetten.*`): Wanderer, Holzfäller, Pilzsammlerin,
Vogelkundler (Spechte); Eichhörnchen, Reh, Hase, Waschbär, Eichelhäher, Specht. Riesenbäume
(`….riesenbaeume.*`): Pfadfinderin, Junge mit dem Eichhörnchen (es trägt einen schwarzen Bauern aus
dem Camp, Dokument 16, 5.3), Betreuerin, Fotografin; Libellen, Specht, Eichhörnchen,
Streifenhörnchen, Eule, Reh.

## 4. Bühnenbilder

### 4.1 Hütten

Boden Gras, Weg Erde (2 breit), Rand Hecke als Waldrand. Inventar: Kiefern (Camping-Bäume),
Farne und Büsche, Schutzhütte mit Bank und Holzstapel, Rätseltafel, Picknicktisch, Steinfeuerstelle,
Bach mit Steg, Felsen, Wegweiser.

### 4.2 Riesenbäume

Boden Gras mit Erde, Weg Erde (2 breit), Rand dichter Wald. Inventar: Mammutbäume (bestellt), Kiefern,
Farne, Rangerhaus mit Fahne und Bank, Bach mit Holzsteg, Bärenspuren.

### 4.3 Pinewood Camp

Boden Gras, Wege Erde, Platz am Feuer Sand, See (Wasser bis zum Südrand). Inventar: Campbuden (bestellt;
Ersatz Zelte und Schuppen), Zelte, Kiosk, Lagerfeuer mit Baumstämmen, Fahnenmast, Picknicktische,
Steg, Kanus, Riesenbäume am Nordrand.

### 4.4 Canyonrand

Boden Fels mit Gras im Westen, Weg Erde; Felskante im Süden (`wand: felsRot`). Inventar: Kletterwand
mit Seilen, Geländer an der Kante, Bank, Rätseltafel, Kiefern im Westen, Felsen, Wegweiser.

### 4.5 Staubstraße

Boden Sand, Piste Schotter (2 breit). Inventar: schiefe Zäune, Telegrafenmasten, liegengebliebener
Wagen, Kakteen, Felsen, ein Schild „GHOST TOWN 2 MI“.

## Runde 7: Camp als Ort und Leben (10.11.2026)

**Camp (Regel 10.51, klein: 12 Gebäude):** Zu den Campbuden und dem Kiosk kommen
Kulissenhäuser ohne Innenraum am Uferweg: Ranger-Häuschen, Waschhaus, zwei Wohnwagen,
Schutzhütte, Pavillon und Bootsschuppen. Dazu ein Badehäuschen am Strand und ein Holzschuppen im
Nordosten. Ein Erdweg führt im Westen am Ufer entlang und im Nordosten bis zum Schuppen. In B
stehen die Hütten im Norden am Hüttenweg, weil der Westen dort Strand ist.

**Leben (Regel 10.53):** 12 Statisten, 7 davon ansprechbar (`statist.pinewoodCamp.aussen.*`):
Betreuer, Köchin am Kiosk (Bauer schlägt Dame, mit Antwort von Ambrose), Rangerin
(Lewis-Figuren), Wanderin, Anglerin (Italienisch), Bademeister (Perfect Move im Alltag) und Opa
am Wohnwagen (Bobby Fischer mit 14). Ohne Satz: Holzhacker, zwei Kinder beim Wettlauf,
Fotografin, Gitarrist am Abend, Kanufahrer. Tiere: Libellen, Reh, Eichhörnchen, Enten, Hund,
Specht.

### Weg 10 in Runde 7: Ereignisort und Leben

**Ereignisort „Das Gespenst der Tankstelle“ (Dokument 15, 2.12):** An der Staubstraße steht eine
verlassene Tankstelle direkt an der Piste: ein Blechhäuschen mit Solarpaneel auf dem Dach (darin
kommt in Runde 6 der kleine Raum mit Z-1), zwei alte Zapfsäulen unter einem Vordach mit Schild
„GAS“ und ein Autowrack. Davor ist Platz für drei bis sechs Figuren.

**3.3 Felder für Runde 6 (begehbar):**

| Karte          | Auslöser             | A        | B        | C         | Hinweis                              |
| -------------- | -------------------- | -------- | -------- | --------- | ------------------------------------ |
| `staubstrasse` | `ereignisTankstelle` | (88, 15) | (49, 9)  | (99, 11)  | vor der Tür des Häuschens            |
| `staubstrasse` | `spurPM6`            | (89, 15) | (51, 9)  | (100, 11) | an der Tür                           |
| `staubstrasse` | `seite11`            | (84, 14) | (45, 8)  | (94, 10)  | Ölwechsel-Graben neben dem Dach      |
| `canyonrand`   | `finchBauerE`        | (99, 17) | (99, 16) | (43, 17)  | Aussicht bei der Bank, Finkenzeichen |

**Leben (Regel 10.53):**

- **Canyonrand:** Kletterer (Fesselung), Wanderin (Eichhörnchen mit einem Bauern aus dem Camp),
  Campbetreuerin (Tag des Schachs am 20. Juli, FIDE 1924), Fotograf.
  Tiere: Adler, Eichhörnchen, Eidechse, Geier, Hase, Specht.
- **Staubstraße:** zwei Kinder aus dem Camp (das Gespenst, mit Ambroses „Gespenster spielen nicht
  in Tankstellen“), Truckerin (der Türke), Landvermesser (Eidechsen vor den Staubteufeln),
  Motorradfahrer.
  Tiere: Eidechse, Geier, Roadrunner, Kojote, Hase, Krähen.

## Runde 6: spielbar (10.11.2026, mittel-4)

- **Gespenst der Tankstelle** (`ereignisTankstelle` vor der alten Tankstelle): Draußen klackt es.
  Die Kinder reden von einem Gespenst, Ambrose widerspricht.
- **Neuer Innenraum `wegPinewoodGhost.tankstelle`** (12 × 11, A/B/C):
  - Tür `tankstelleTuer` am Blechhäuschen.
  - Drinnen steht der Greifarm Z-1 (`cp8Greifarm`, Bild `greifarm_z1`) vor einem Tisch mit Brett.
- **Quest `wegPinewoodGhost.gespenst`** (klein):
  - Partie gegen Z-1 (Gegner `wegPinewoodGhost.z1`).
  - Z-1 spielt fest Italienisch ohne Abweichung. Den Bruch nach dem Buch baut mittel-2.
  - Lohn: Fund `bauerZ1` (Bauer aus Metall) und 25 Münzen.
  - Das Porträt `z1.svg` ist eine eigene Pixelzeichnung.
- **Funde:**
  - `spurPM6`: Typenschild an der Tür;
  - `seite11`: Ölwechsel-Graben, Kapitel 11;
  - `finchBauerE`: Aussicht am Canyonrand.
- **Ansehen:**
  - Weg 10: `kletterwand` (Canyonrand), `wagen` (Autowrack, Staubstraße);
  - Camp: `steg` und `kanus`.
- **Nicht von mir:** Wegweiser, Bärenspur und die Nebelzeit auf Weg 9 gehören zu mittel-3.
- **Offen für mittel-2:** Sepia-Tönung der Staubstraße.

### 3.5 Runde 6: Weg 9 spielbar (mittel-3)

Ereignis `ereignisLebendschach` mit Aufgabenrunde `wegCrossroadsPinewood.lebendschach` (Platzhalter
für die Brettansicht) und Quest gleichen Namens, Lohn Fund `fotoLebendschach`; Fundstellen
`seite10` und `kreide4`. Felder:

| Auslöser               | A         | B        | C        |
| ---------------------- | --------- | -------- | -------- |
| `ereignisLebendschach` | (38, 85)  | (28, 77) | (18, 91) |
| `seite10`              | (24, 106) | (16, 68) | (17, 18) |

| Auslöser  | A        | B       | C       |
| --------- | -------- | ------- | ------- |
| `kreide4` | (100, 8) | (34, 8) | (42, 8) |

Nachtrag: Die Fundknoten heißen wie die Auslöser (`seite10`, `kreide4`) und zählen die Sammelstränge
mit (`buchseiten`, `kreideTreffpunkte`). Die Riesenbäume haben in allen Varianten die Tönung `nebel`.
