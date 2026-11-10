# Summit City und die Hochebene

Stand: 9.11.2026, nachts, Entwurf von mittel-2 (Auftrag `auftraege/runde5c_akt4.md`). Ortsdokument nach
`README.md`: Ortsplan, Ortsbild, Abgleich, Bühnenbilder. Es umfasst Summit City (Ort 8, Club 8, Akt 4)
mit `aussen`, `huette`, `bergstation`, `bergladen` und den Abzweig L9 Hochebene (`hochebene`) von Weg 7
mit `felsentuerme` und `schule`. Quellen: `05_Story_Bibel.md` 28 und Szenen 82 bis 91,
`09_Weltbeschreibung.md` 5.9 und 5.10, `13_Wegenetz.md` 5 (S10), `10_Sprueche_Schauplaetze_Varianten.md`
L9 und L10, `orte/summit-weg.md` (Übergänge der Bergstraße), `orte.json`. Maßstab `KARTENREGELN.md` 7a.2.

Feld = (Spalte, Reihe), linke obere Kachel; Bereiche „Spalten / Reihen“. Norden ist oben. Jahreszeit:
Sommer, Summit City feiert sein Sommerfest.

## 1. Ortsplan

### 1.0 Lage in der Welt

```text
                 Gipfel (Fels) ─── Seilbahn ──► Bergstation (über den Wolken)
                        │
   Hochebene ◄═ Abzweig ═╡ Bergstraße (Weg 7) ══► Summit City (Südrand) ══► Weg 8 Geysirbecken (Südrand, Erdweg)
   Felstürme ═► Schule   │
                  Diner (Wüste)
```

| Karte                    | Größe    | Lauf (Kacheln)                 | Zeit (3,5/s) |
| ------------------------ | -------- | ------------------------------ | ------------ |
| `summitCity.aussen`      | 80 × 60  | Südrand → Markt → Südrand ≈ 65 | ≈ 19 s       |
| `summitCity.huette`      | 18 × 13  | Innenraum (Club)               | ≈ 4 s        |
| `summitCity.bergstation` | 18 × 12  | Innenraum                      | ≈ 4 s        |
| `summitCity.bergladen`   | 14 × 10  | Innenraum (Laden)              | ≈ 3 s        |
| `hochebene.felsentuerme` | 100 × 30 | Ostrand → Westrand ≈ 105       | ≈ 30 s       |
| `hochebene.schule`       | 60 × 40  | Ostrand → Schulhof ≈ 40        | ≈ 12 s       |

Der Abzweig Hochebene hat zwei Karten zusammen etwa 160 Kacheln lang (Nebenschauplatz, 28: „ein Weg
oder eine Abzweigung mit zwei Karten“), kürzer als ein Hauptweg.

### 1.1 Summit City außen (`summitCity.aussen`, 80 × 60)

Bergstadt auf einer Alm unter den Gipfeln. Boden Gras, Wege aus Pflaster und Erde, Fels (`wand: fels`)
im Norden als Gipfelwand, Pinien an den Rändern. Die Bergstraße kommt am **Südrand (34–36, 55)** an,
läuft als Pflasterweg nach Norden zum **Marktplatz** mit dem Drachenbrunnen. Vom Markt geht eine
Erdweg (zwei Felder) nach Südosten zum **Südrand (56–57, 55)**, Weg 8 zum Geysirbecken (S10, `wenn: nadelSummitCity`).

```text
 Spalte 0      10      20      30      40      50      60    69
 R0  ┌fels──────────── Gipfelwand ──────────────────Mast──────┐
 R6  │ Gipfelfelsen (Sol)   Pinien        │    Talstation    │
 R13 │═Felsstufe═╡Treppe╞═══              │  [Seilbahn]       │
 R18 │                      Murmeltiere   │   ║ Weg            │
 R20 │ [Wards Hütte]  [Bergladen]        ║                    │
 R28 │        ║          ╔══════ Marktplatz ═══╗               │
 R31 │  Hütte ╚══════════╣  Drachenbrunnen    ╠════╗ Erdweg 56–57 nach Süden (Weg 8)
 R40 │                   ╚══════════╦═════════╝   Hütten      │
 R48 │  Hütten, Ziegen              ║              Pinien      │
 R55 └──────────────────────────────╨ Südrand 34–36 ──────────┘  ← Bergstraße
```

| Abschnitt (Felder)             | Thema          | Inhalt                                                                                    | Zum Entdecken                |
| ------------------------------ | -------------- | ----------------------------------------------------------------------------------------- | ---------------------------- |
| S1 Ortseingang (28–42 / 44–55) | Ankunft        | Pflasterweg vom Südrand, Ortsschild, Plakat „Landesmeisterschaft“ (Szene 83), Bank        | Plakat, Murmeltier pfeift    |
| S2 Marktplatz (26–46 / 28–40)  | Sommerfest     | Drachenbrunnen in der Mitte, Wimpelketten, Marktstände, Bänke, Laternen (Drachenfest L10) | `drachenbrunnen`, Stände     |
| S3 Ward (2–14 / 18–30)         | die Hütte      | Wards Blockhütte mit Veranda, Holzstapel, Bank; Weg zum Markt                             | `huetteTuer`                 |
| S4 Laden (16–28 / 19–29)       | Bergausrüstung | Bergladen mit Schaufenster, Rucksäcke und Seile vor der Tür                               | `bergladenTuer`              |
| S5 Gipfelfelsen (2–24 / 6–12)  | Aussicht       | erhöhte Felsplatte über einer Felsstufe mit Treppe; **Sol** (Szene 89), Fernrohr          | Sol                          |
| S6 Talstation (48–66 / 6–27)   | Seilbahn       | Talstation, Mast vor der Gipfelwand, Weg vom Markt hinauf; Seilbahnwärter                 | `seilbahnTal`                |
| S7 Hütten West (2–24 / 32–54)  | Ferienhütten   | kleine Holzhütten, Ziegen, Holzhacker                                                     | Holzhacker (Statist), Ziegen |
| S8 Hütten Ost (48–68 / 37–54)  | Wiese          | Hütten am Hang, Pinien, Adler am Himmel (Szene)                                           | Adler                        |
| S9 Ostausgang (47–69 / 31–37)  | nach Weg 8     | Straße nach Osten, Wegweiser „Geysirbecken“, Ranger-Hinweis                               | Wegweiser                    |

**Wegeführung:** Hauptweg drei Felder Pflaster Südrand → Markt (Reihen 40–55), Markt 26–46 / 28–40,
Erdweg nach Südosten (Reihen 33–34, dann Spalten 56–57 zum Südrand); Abzweige: Weg zu Wards Hütte und Bergladen (zwei Felder, Reihe 30),
Weg zur Talstation (zwei Felder, Spalten 52–53), Treppe auf den Gipfelfelsen. **Sichtachsen:** vom
Südrand nach Norden der Drachenbrunnen und dahinter die Gipfelwand; vom Markt nach Nordosten die
Talstation mit dem Seil. **Ränder:** Norden Fels, Westen und Osten Pinienwald, Süden Wald; offen nur
Süden (34–36, Bergstraße) und Süden (56–57, Weg 8).

### 1.2 Wards Hütte (`summitCity.huette`, 18 × 13)

Blockhütte, Holzwände, dunkle Dielen. Nordwand: **Kamin** in der Mitte (`kaminfeuer`), links ein
Bücherregal, rechts eine Vitrine mit dem **Pokal von 1985** (`pokal`), daneben Endspieldiagramme in
Rahmen und das Foto vom Gipfel. Vor dem Kamin zwei Sessel und ein Tisch mit dem **alten Holzbrett**
(Ward). Zwei Clubtische mit Brettern im Süden (Kit, Haraldsen). Tür in der Südwand (8–9, 12),
`huetteAusgang`.

### 1.3 Bergstation (`summitCity.bergstation`, 18 × 12)

Halle aus Holz und Glas über den Wolken. Nordwand mit großen Fenstern (Wolken, Gipfel), davor die
**Bank am Fenster** (Szene 88, Victor). Rechts die Plattform mit der **Gondel** (`seilbahnBerg`, man
kommt mit ihr an und fährt mit ihr zurück). Links Fahrkartenschalter, Fahrplan, Kaffeeautomat,
Schließfächer; im Eck die **Murmeltierpfeife** (`fundMurmeltierpfeife`). Kein Ausgang zu Fuß.

### 1.4 Bergladen (`summitCity.bergladen`, 14 × 10)

Holzladen: Theke links (`theke`), Regale mit Seilen, Karten, Seilbahnkarten, Rucksäcke, Laternen;
ein Ständer mit Wanderkarten. Tür in der Südwand (6–7, 9), `bergladenAusgang`.

### 1.5 Hochebene: Felstürme (`hochebene.felsentuerme`, 100 × 30)

Rote Hochfläche (`sandRot`, `felsbodenRot`, `wand: felsRot`) zwischen Wüste und Bergen, weiter Himmel.
Der Schotterweg kommt am **Ostrand (99, 14–15)** von der Bergstraße (Abzweig, zwei Felder) und läuft
in weiten Bögen nach Westen zwischen roten Felstürmen hindurch zum **Westrand (0, 14–15)**, zur Schule.
In der Mitte an einem Wacholder der **Steintisch** (`steintisch`), an dem Kira nach der Schule spielt.

| Abschnitt (Spalten)   | Thema               | Inhalt                                                     | Zum Entdecken              |
| --------------------- | ------------------- | ---------------------------------------------------------- | -------------------------- |
| F1 (85–99) Abzweig    | Abschied der Straße | Weidezaun, Viehgitter, Schild „Schule 3 km“                | Schild                     |
| F2 (70–84) Felstürme  | rote Türme          | zwei hohe Felstürme links und rechts des Wegs              | Falken (Belebung, kreisen) |
| F3 (55–69) Weide      | Pferde              | Koppel mit Zaun, Wassertrog, ein Pferd (Tier)              | Pferd                      |
| F4 (40–54) Steintisch | Kira                | Wacholder, Steintisch mit Brett, Fahrrad an einem Stein    | `steintisch`, Kira         |
| F5 (25–39) Felsbogen  | Durchblick          | flache Felsplatten, Kakteen, Eidechsen                     | Eidechse                   |
| F6 (0–24) Schulweg    | Strommasten         | Weg mit Strommast und Briefkasten, Bushaltestelle ohne Bus | Briefkasten, Haltestelle   |

### 1.6 Hochebene: Schule (`hochebene.schule`, 60 × 40)

Eine gewöhnliche Schule von heute auf der Hochebene: Schulhaus mit rotem Walmdach, Turnhalle
(Basketballkorb an der Wand), Schulhof mit Spielgeräten, Basketballfeld, Bushaltestelle mit dem
Schulbus, daneben die **Werkstatt** von Joss Vell mit Rolltor (`werkstatt`). Am Eingang das
**Schwarze Brett** (`aushang`). Keine Kostüme, keine heiligen Zeichen, keine Deko aus fremden
Kulturen (O5): Menschen von heute mit Berufen. Der Weg kommt am **Ostrand (59, 19–20)** an.

### 1.7 Übergänge (Felder auf beiden Seiten)

| Auslöser (Karte, Feld)                                | Gegenstück (Karte, Feld)                           | Bemerkung                                                            |
| ----------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| aussen `wegDesert` Südrand (34–36, 55)                | bergstrasse `weiterSummit` Nordrand (18–20, 0)     | drei Felder                                                          |
| aussen `wegCrossroads` Südrand (56–57, 55)            | geysirbecken `zurueckSummit` Nordrand (14–15, 0)   | Erdweg zwei Felder, `wenn: nadelSummitCity`, mit mittel-3 abgestimmt |
| aussen `huetteTuer` (8, 26)                           | huette `huetteAusgang` (8–9, 12)                   | Tür der Hütte                                                        |
| aussen `bergladenTuer` (21, 24)                       | bergladen `bergladenAusgang` (6–7, 9)              | Tür des Ladens                                                       |
| aussen `seilbahnTal` (54, 22)                         | bergstation `seilbahnBerg` an der Gondel           | Fahrt mit der Seilbahn                                               |
| felsentuerme `zurueckBergstrasse` Ostrand (99, 14–15) | bergstrasse `abzweigHochebene` Westrand (0, 70–71) | zwei Felder Schotter                                                 |
| felsentuerme `weiterSchule` Westrand (0, 14–15)       | schule `zurueckFelsentuerme` Ostrand (59, 19–20)   | zwei Felder                                                          |

## 2. Ortsbild

### 2.1 Summit City

Nach der letzten Kehre liegt Summit City wie hingeworfen auf einer Alm: Holzhütten mit Schindeldächern,
Geranien in den Fenstern, darüber die Gipfelwand, so nah, dass man den Schnee in den Rinnen sieht. Die
Luft ist dünn und kalt am Morgen, mittags warm, und es riecht nach Harz und Holzrauch. Auf dem Marktplatz
steht der Drachenbrunnen: Ein Drache aus Stein speit Wasser, Kinder klettern auf seinen Rücken. Seit
einer Woche hängen Wimpel über dem Platz, denn am Wochenende ist Sommerfest, und am Abend spielt die
ganze Stadt nach der alten Bergwerkssage Schach mit dem Drachen.

An der Talstation surrt das Seil, alle zehn Minuten schwebt eine Gondel in die Wolken. Murmeltiere
pfeifen am Hang, Ziegen stehen auf Felsen, die zu steil für Ziegen sind. Ein Plakat am Ortseingang
kündigt die Landesmeisterschaft in der Capital Arena an, „präsentiert von Perfect Move“. Wards Hütte
steht am Westrand des Ortes, mit einer Veranda, auf der ein Schachbrett im Wind liegt. Im Bergladen
riecht es nach Leder und Seil.

### 2.2 Die Hochebene

Westlich der Bergstraße öffnet sich die Hochebene: roter Boden, weiter Himmel, Felstürme, die wie
Finger in die Luft zeigen. Falken kreisen. Ein Schotterweg führt an einer Pferdekoppel vorbei zu einem
Wacholder, unter dem ein flacher Stein als Tisch dient; hier spielt Kira nach der Schule. Am Ende des
Wegs steht die Schule: rotes Dach, Turnhalle, ein Basketballkorb mit zerfranstem Netz, ein gelber Bus,
und daneben die Werkstatt, in der Joss Vell den Bus repariert. Die Hälfte der Schule heißt Vell.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

- **83 Ankunft** (`aussen`): Seilbahn, Holzhütten, Murmeltiere, Plakat Landesmeisterschaft; Victor mit
  einem Mann im Anzug (Statisten in der Szene, kein fester Platz).
- **84, 85, 86, 87, 91** (`huette`): Ward am Kaminfeuer, Brett für Endspiele, Kit und Haraldsen
  (Aufgabenreihen), Victor als Zuschauer, Tisch für den Clubkampf. Auslöser `pokal`, `kaminfeuer`.
- **88** (`bergstation`): Bank am Fenster über den Wolken, Victor; Fund `fundMurmeltierpfeife`.
- **89** (`aussen`, Gipfelfelsen): Sol.
- **90** (`aussen`, Marktplatz am Abend): Drachenfest, `drachenbrunnen`.
- **82** (`hochebene`): Kira am Steintisch (`steintisch`), Annek an der Schule, Joss in der Werkstatt
  (`werkstatt`), Schwarzes Brett (`aushang`).
- **Figuren:** Ward, Kit, Haraldsen in der Hütte (Dialoge `summit-city-huette.*`), Victor in der
  Bergstation, Sol am Gipfelfelsen; Kira, Annek, Joss auf der Hochebene.

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

- **Bleibt:** Seilbahn mit Tal- und Bergstation, Holzhütten, Gipfelfelsen mit Sol, Murmeltiere,
  Ziegen, Marktplatz mit Drachenbrunnen, Wards Hütte mit Kamin, Pokal, Foto und Teekanne, Bergladen.
- **Ändert sich:** Haraldsen ist Clubmitglied (Dialog in der Hütte); den Laden führt in der Karte eine
  Ladenhilfe (Statist), Haraldsen steht in der Hütte.
- **Entfällt:** nichts.

### 3.3 Befunde und offene Punkte für den Haupt-Chat

- **Für Runde 6 (keine Auslöser jetzt):** `plakat` (S1), `fernrohr` (S5), `foto` und `teekanne`
  (Hütte), `fahrplan` (Bergstation), `wanderkarten` (Bergladen), `pferd` und `schildSchule`
  (Felstürme), `bus` (Schule).
- **Weg 8:** abgestimmt mit mittel-3: `wegCrossroads` am Südrand (56–57), Gegenstück Nordrand (14–15) des Geysirbeckens.
- **Bilder** sind beim Haupt-Chat bestellt (Drachenbrunnen, Talstation, Mast, Berghütte, Ferienhütten,
  Bergladen, Plakat, Wimpelketten, Kamin, Gondel, Wolkenfenster, rote Felstürme, Steintisch); bis sie
  kommen, steht Ersatz aus dem Katalog, in der Beschreibung genannt. Erledigt: alle Bilder eingesetzt (9.11.2026 nachts).

## 4. Bühnenbilder

### 4.1 Summit City außen

**Boden** Gras, Pflaster (Wege, Markt), Erde (Gipfelpfad). **Wand** Fels (Gipfelwand Reihen 0–5,
Felsstufe 13–15 mit Treppe bei 10–11). **Ränder** wie 1.1.

| Abschnitt | Inventar                                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| S1        | Ortsschild (31, 50), Plakat (38, 46), Bank (39, 50)                                                              |
| S2        | Drachenbrunnen (34, 31), Wimpelketten über dem Platz (Reihe 28), Marktstände (27, 36), (42, 36), Bänke, Laternen |
| S3        | Berghütte 5–12 / 19–25, Holzstapel (12, 24), Bank auf der Veranda                                                |
| S4        | Bergladen 18–24 / 18–23, Rucksäcke und Seil vor der Tür                                                          |
| S5        | Felsplatte 2–24 / 6–12, Treppe (10–11, 13–15), Fernrohr (16, 7); Sol (12, 9)                                     |
| S6        | Talstation 51–58 / 14–21, Mast (54, 7), Weg 54–55 / 22–27                                                        |
| S7–S8     | Ferienhütten, Pinien, Holzhacker mit Hackklotz, Ziegen                                                           |
| S9        | Wegweiser (60, 31)                                                                                               |

### 4.2 Innenräume

- **Hütte:** Wand `holz`, Boden `holzDunkel`, Kamin (8, 1), Regal (2, 1), Vitrine mit Pokal (14, 1),
  Diagramme an der Wand, Sessel (6, 4) und (11, 4) mit Tisch und Brett (8, 4); Clubtische (3, 8) und (13, 8);
  Ward (9, 5), Kit (4, 10), Haraldsen (14, 10).
- **Bergstation:** Wand `hellgrau`, Boden `fliesenGrau`, Fenster mit Wolken in der Nordwand, Bank (5, 3),
  Gondel 13–16 / 2–5 mit `seilbahnBerg` davor, Schalter (2, 7), Fahrplan, Kaffeeautomat, Schließfächer,
  Murmeltierpfeife (1, 10); Victor (6, 4).
- **Bergladen:** Wand `holz`, Boden `dielen`, Theke (2, 2), Regale an Nord- und Ostwand, Kartenständer
  (9, 5), Rucksäcke; Ladenhilfe (Statist).

### 4.3 Hochebene

- **Felstürme:** Boden `sandRot` und `felsbodenRot`, Wand `felsRot` am Nord- und Südrand, Schotterweg zwei
  Felder, Felstürme (bestellt), Koppel mit Zaun, Steintisch (46, 12), Wacholder, Kakteen.
- **Schule:** Boden Gras und Pflaster (Hof), Schulhaus 18–41 / 2–24 (Katalog `School_1`), Basketballfeld,
  Spielgeräte, Werkstatt mit Rolltor (`garage_rolltor`) (4, 22), Bus, Haltestelle, Schwarzes Brett (30, 26).

### 4.4 Varianten (Regel 10.7, 10.37)

- **A:** wie oben.
- **B, die schlichtere:** außen ohne Marktstände, Hütte und Laden tauschen die Plätze, Talstation weiter
  westlich; Hütte mit nur einem Clubtisch; Felstürme mit einer geraden Strecke.
- **C, die reichere:** außen mit Bühne und mehr Ständen (Sommerfest am Abend), zusätzliche Hütten; Hütte
  mit Bärenfell und zwei Bücherwänden; Felstürme mit Felsbogen und Pferdekoppel.

### 4.5 Nacharbeit nach der Gegenprüfung (10.11.2026)

- Hütte, Laden und Talstation stehen in A, B und C an denselben Stellen; die Türauslöser `huetteTuer`
  (8, 26), `bergladenTuer` (21, 24) und `seilbahnTal` (54, 22) sind in allen Varianten gleich (Regel 37).
- Die Ferienhütten stehen am Hüttenweg (Erde, zwei Felder, Reihen 46–47) im Westen und Osten, ihre Türen
  direkt darüber.
- B unterscheidet sich jetzt deutlich: Erdwege, ein achteckiger Brunnengarten mit Blumen und Bänken statt
  des Marktplatzes, keine Stände, Ziegen auf der Ostwiese.

## Runde 7: Dorf und Leben (10.11.2026)

**Dorf (Regel 10.51, mittel: 20 Gebäude):** Die Außenkarte ist auf 80 × 60 gewachsen: zehn
Spalten nach Osten und vier Reihen nach Süden. Die Übergänge am Südrand sind mit dem Rand nach
unten gezogen. Neue Gassen machen Platz für Kulissenhäuser ohne Innenraum:

- die Nordgasse vor der Talstation bis an den Ostrand;
- die Pfade am Hang und an den Hütten, nach Osten verlängert;
- eine Gasse im Südwesten zum Platz;
- ein Schotterweg am Südrand.

An ihnen stehen Chalets, Lodge, Höfe, Stadel, Ställe, Post, Bergwacht (C) und ein Wohnhaus (neue
Möbel `sc8*`), alle im Maßstab der Nachbarhäuser. Die kleinen Häuschen der ersten Fassung sind
ersetzt (Hinweis des Haupt-Chats, 10.11.2026). Jede Tür hat einen kurzen Stichweg zur Gasse. Alle
Varianten haben mindestens 20 Gebäude.

**Leben (Regel 10.53):** 12 Statisten, 7 davon ansprechbar (`statist.summitCity.aussen.*`):

- Seilbahnwärter;
- Kinder am Drachenbrunnen;
- Marktfrau (Sizilianisch);
- Briefträger (Staunton-Figuren seit 1849);
- Bergführerin (Spieß);
- Rentner (Lebendschach in Marostica, mit Antwort von Ambrose);
- Blitzspieler am Platz (Schirows Läuferopfer, Linares 1998; zeigt die Vorführung `schirowLh3`);
- Festwirt (Perfect Move im Alltag).

Ohne Satz: Wanderer, Holzhacker, Touristen, Gärtnerin, Radfahrer. Tiere: Murmeltier, Ziegen,
Kuh, Hund, Adler, Katze.

### Hochebene in Runde 7: Ereignisort und Leben

**Ereignisort „Das Bauerndiplom“ (Dokument 15, 2.9):** Auf dem Schulhof stehen eine Tribüne aus
drei Teilen (`sc8Tribuene*`), drei Steintische, das Plakat „Diplomtag“ und eine Kiste mit
Sportgeräten. Am Rand des Hofs steht die Fahnenstange der Schule (`sc8Fahnenmast`, sperrt nur am
Fuß). Vor den Tischen ist Platz für drei Kinder, Annek, Kira und {held}.

**3.3 Felder für Runde 6 (`hochebene.schule`, begehbar):**

| Auslöser         | A        | B        | C        | Hinweis                               |
| ---------------- | -------- | -------- | -------- | ------------------------------------- |
| `ereignisDiplom` | (28, 27) | (28, 27) | (29, 27) | zwischen den Steintischen             |
| `seite03`        | (48, 23) | (48, 23) | (46, 24) | an der Fahnenstange                   |
| `finchTurmB`     | (43, 31) | (43, 31) | (42, 31) | Kiste mit Sportgeräten, Finkenzeichen |

**Leben (Regel 10.53):**

- **Felstürme:** Kletterer (drei Punkte fest), Bisonforscherin (Bisons wie Bauern vor dem König),
  Lehrer im Urlaub (Schachdorf Ströbeck seit 1823), Fotografin.
  Tiere: Bisons, Falke, Murmeltier, Präriehunde, Hase, Schmetterlinge.
- **Schule:** Hausmeister (Läufer im Sandkasten), Busfahrerin (en passant), Schulkind (Kiras Bison
  als Turm, mit Antwort von Ambrose), Vater (Rétis Studie von 1921, zeigt die Vorführung `retiStudie`).
  Tiere: Hühner, Hund, Spatzen, Katze, Falke, Hase.

## Runde 6: spielbar (10.11.2026, mittel-4)

- **Summit City, Ansehen:**
  - außen: `plakat` (Landesmeisterschaft) und `fernrohr` (Blick vom Felsplateau);
  - Hütte: `foto` und `teekanne`;
  - Bergstation: `fahrplan`.
- **Bergladen:** `wanderkarten` bleibt offen; der Bergladen ist auf Wunsch des Haupt-Chats
  festgeschrieben.
- **Hochebene, Bauerndiplom** (`ereignisDiplom`): Das Ereignis beginnt erst, wenn Annek Schach
  gelernt hat (`annekSchachGelernt`). Vorher zeigt es das Plakat „Diplomtag – bald!“.
  - Quest `hochebene.bauerndiplom` (klein): Aufgabenrunde `hochebene.diplom`, gestellt von Annek.
  - Buchbezug der Aufgabenwahl ist Kapitel 12 (Trainingsmethodik), nicht 3 wie in Dokument 15; Ambrose
    nennt es am Ende. Die Buchseite Kapitel 3 an der Fahnenstange bleibt.
    Das ist der Ersatz für die Aufgabenwahl je Kind.
  - Lohn: Fund `diplomKira`, von Kira gemalt mit Falke und Bison, dazu 20 Münzen.
- **Hochebene, Funde:** `seite03` (Kapitel 3, Gambits; an der Fahnenstange) und `finchTurmB` (Kiste
  mit Sportgeräten).
- **Hochebene, Ansehen:** `pferd`, `schildSchule` (Felstürme) und `bus` (Schule).

## Runde 9: Mängel der Variantenwahl, Muster und Zustände (10.11.2026, mittel-4)

Grundlage: `docs/spiel/auftraege/variantenwahl.md` (Wahl A für außen, Bergladen, Felstürme, Schule; Wahl C
für Hütte und Bergstation) und die fünf Muster.

**Summit City außen.** (1) Die Gipfelwand ist jetzt eine Felswand mit Kante aus Klippenkacheln
(`"kante": "klippe"`), die Gipfelfelsen haben eine in den Fels geschlagene Treppe; der Kartenrand neben
Boden zeigt den Boden, kein Rahmen mehr (`"wandart": "gras"`). (2) Kein Haus steht mehr als zweimal: an
die Stelle der dritten Ferienhütten, der dritten Berghütte, des dritten Hofs und des dritten Stalls treten
Holzfällerhütte, Schuppen, Schutzhütte, Wohnhaus und die Bergwacht. (3) Das Seil läuft vom Mast der
Talstation bis in die Gipfelwand; zwischen den Häusern stehen 34 Pinien, Wacholder, Felsen und
Blumenbüsche. Kuh und Radfahrer standen in Gebäuden und sind versetzt. Nicht umgesetzt: Die Gipfelwand ist
braun statt grau, weil LimeZus Klippe nur Erde und Gras kennt.

**Wards Hütte.** (1) Die Vitrine mit dem Pokal von 1985 steht an der Nordwand. (2) Ruhige Dielen statt
Schrägmuster. (3) Zwei gerahmte Endspieldiagramme (Bildwunsch `bildwuensche/endspieldiagramm.py`) statt
Karo und Landschaftsbild; Kit und Haraldsen stehen an den Clubtischen, ihnen gegenüber sitzen zwei Clubmitglieder
(Statisten auf den Stuhlfeldern mit „sitzt …“, Hinweis des Haupt-Chats).

**Bergstation.** (1) Die Gondel steht auf der steinernen Plattform, das Seil läuft durch ein Glastor in der
Nordwand hinaus. (2) Der Schalter ist ein Schaltertresen mit Glas und Kasse, dahinter ein Schalterbeamter
(neuer Statist), daneben der Fahrplan statt des U-Bahn-Netzes. Das Schild „TICKET“ gehört zum Bild des
Pakets. (3) Holzboden statt Schachbrettfliesen; Kaffeeautomat und Schließfächer stehen an West- und Ostwand.

**Bergladen.** (1, 2) Drei Bergsportregale mit Seilen, Karabinern und Laternen, ein Seil am Haken, ein
Ständer mit Seilbahn- und Wanderkarten und eine aufgefaltete Wanderkarte auf dem Kartentisch (Bildwunsch
`bildwuensche/bergladen.py`); Dosenregale und Gießkannen sind weg. (3) Die Ladenhilfe steht hinter der
Theke mit Kasse, der Kunde hat ein anderes Bild (`statist-31`).

**Hochebene, Felstürme.** (1) Rote Felswand im Norden und Kante der Geländestufe im Süden aus roten
Klippenkacheln (`"fels": "rot"`, Bildwunsch `bildwuensche/klippe_rot.py`), kein Rahmen. (2) Der Weg ist aus
rotem Felsboden mit innen ausgerundeten Bögen (Erde hätte grüne Grasränder auf rotem Sand). (3) Der
Steintisch ist ein flacher roter Stein mit Brett unter einem Baum; die Koppel hat einen Holzzaun. Das Pferd
bleibt das Tierbild aus `belebungsbilder.py`.

**Hochebene, Schule.** (1) Das Basketballfeld liegt auf eigenem Pflaster, ein Weg verbindet es mit dem Hof;
kleiner als das Bild des Pakets geht es nicht. (2) Eine Hecke schließt das Gelände, offen nur an Straße und
Schotterweg. (3) Die Straße hat Mittellinie und Randlinien (`"markierung"`) und läuft bis an beide Ränder;
das zweite Backsteinhaus ist die Turnhalle und hat einen Weg zum Hof.

**Zustände (10.63):**

| Karte              | Bedingung                  | Szene                         | Was sich ändert                                     |
| ------------------ | -------------------------- | ----------------------------- | --------------------------------------------------- |
| `hochebene.schule` | `nicht annekSchachGelernt` | `hochebene-schule-vor-diplom` | ohne Tribüne, Steintische und Kisten des Diplomtags |

Keine Zustände für Summit City außen, Hütte, Bergstation, Bergladen und Felstürme: Sommerfest, Wimpel und
Plakat der Landesmeisterschaft stehen den ganzen Akt 4; das Drachenfest (Szene 90) ist ein Abend auf dem
Marktplatz ohne feste neue Objekte.

### Gutachten Runde 9 (10.11.2026, mittel-4)

Gutachten `gutachten/summit-city.md` und `gutachten/hochebene-sternwarte.md`.

- **Orange Flächen** (Querbefund): Die Randspalte setzt Felsbänder fort, Ecken zeigen den Boden, über
  der Gipfelwand liegt Almwiese (`"hochflaeche": "gras"`); ein Test prüft alle Karten mit Klippe.
- **Summit City außen:** Felsen auf den Gipfelfelsen, kein Schotterstreifen am Südrand, Chalet statt
  Vorstadthaus mit Doppelgarage, nur noch eine Langhütte (die zweite ist eine Holzfällerhütte), zwei
  kleine Häuser statt Hof und Wohnhaus, das Seil endet in der Gipfelwand. Nicht umgesetzt: **Erdwege
  im Osten** bleiben ein Kreuz aus geraden Stücken.
- **Bergstation:** Dielen statt gelbem Holz, Fahrplan aus dem Laufweg. Nicht umgesetzt: **Schalter**
  – der Beamte steht hinter dem Glasschalter des Pakets; „TICKET“ steht auf dem Bild.
- **Bergladen:** Der Kunde steht nicht mehr in den Rucksäcken.
- **Felstürme:** Weg aus hellem Sand mit abgeschrägten Bögen; Wacholder statt Tanne am Steintisch;
  Wassertrog in der Koppel; Haltestellenschild und Automat entfernt; Kakteen statt grüner Laubbüsche;
  Kleinkram auf der Fläche. Nicht umgesetzt: **Esel** ist das Tierbild „pferd“ aus
  `belebungsbilder.py`.
- **Schule:** Der Schulbus steht in der Bucht am Hof, nicht quer über der Straße (10.65); im Zustand
  „vor-diplom“ stehen Annek und die Kinder nicht mehr am leeren Platz der Steintische.

**Restpunkte (Gutachten `mittel-4-runde9-2.md`, 10.11.2026):** Summit City: auf den Gipfelfelsen
Felsbrocken statt Tannen; die zwei kleinen Häuser im Süden sind Schuppen und Kiosk (10.66). Felstürme:
Weg als Piste mit Rand und Schrägen an den Bögen (Material `pisteRot` von mittel-2); unter der
Südstufe liegt tieferer Boden, so zeigt sie ihre Felswand. Nicht umgesetzt: **Esel** – für „pferd“
gibt es kein Tierbild (es fällt auf den Esel zurück); als Gemini-Bild gemeldet.

**Fahrzeuge (10.65, 10.11.2026):** Der Schulbus steht in Vorderansicht (`fz11SchulbusAb`) in einer
Querbucht östlich am Hof, mit der Front zur Straße; die Fahrerin daneben.

**Haltebucht (10.11.2026, abends):** Die Bucht des Schulbusses hat ein eigenes Zeichen und eine weiße
Randlinie, offen zur Straße (`"randlinie"`, `strasse.py`).

## Gemini-Bilder Teil 2: Pferde auf der Koppel (10.11.2026, mittel-4)

Die Belebung `pferd` der Hochebene zeigt jetzt das braune Pferd aus Gemini statt des Esels (Art `pferd` in
`tierarten.json`, Schnitt „ansichten“; der Bogen kommt vom Haupt-Chat). Dazu grasen auf der Koppel ein
Schimmel (66, 15) und ein Brauner (61, 19) als Möbel (`tier12SchimmelGrast`, `tier12PferdGrast`).
