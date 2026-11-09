# Riverton, die Wege dorthin und weiter, Lockport

Stand: 9.11.2026, Entwurf von mittel-3 für den Haupt-Chat. Ortsdokument nach dem Verfahren in
`docs/spiel/orte/README.md`: Ortsplan, Ortsbild, Abgleich mit der Geschichte, Bühnenbilder. Es umfasst
Riverton (Ort 3), Weg 2 von Cedar Creek nach Riverton (`wegCedarRiverton`: Zedernwald und Bahndamm),
Weg 3 von Riverton nach Ironwood (`wegRivertonIronwood`: Kanalweg und Eisenbrücke) und den Nebenort N2
Schleusendorf Lockport am Seitenarm Q2. Maßstab: `KARTENREGELN.md` 7a.2 (Pokémon mal 1,5 bis 2).
Leben, Figuren und kleine Aufgaben stehen in `14_Akt2_Leben_teil1.md`, Sperren und Rückkehr in
`13_Wegenetz.md`. Quellen: `05_Story_Bibel.md` (7 bis 15, Szenen 26 bis 37 und 40), `09_Weltbeschreibung.md`
(2, 4, 4a, 5.4), `ortsprofile.json`, `orte.json`, `quests.json`, `funde.json`, die Muster
`orte/maple-falls.md` und `orte/cedar-creek.md` und der Prüfbericht
`pruefberichte/2026-11-09_akt1_wegenetz.md` (vermiedene Fehler: Sackgassen, Sperren nach dem Bedarf der
Geschichte, Türen auf falschen Wänden, Wege ohne Kurven, Vorwegnahmen).

Feld = (Spalte, Reihe), linke obere Kachel; Bereiche „Spalten / Reihen“. Norden ist oben, auf allen
Karten.

## 1. Ortsplan

### 1.0 Lage in der Welt

```text
                                        N
 [Cedar Creek]══ Zedernwald (W→O) ══ Bahndamm (W→O) ══[Riverton]
   Ostrand, Brücke                                    │ Kanal, Treidelpfad nach Süden
                                                      ▼
                         [Lockport] ◄══ Seitenarm Q2 ══ Kanalweg (N→S)
                          Schleuse S3                  │
                                                      ▼
                                                 Eisenbrücke, Abhang (N→S)
                                                      │
                                                      ▼
                                                  [Ironwood]
```

Die Reise geht in Akt 2 erst nach Osten (Weg 2, quer wie Weg 1), dann nach Süden (Weg 3, hoch wie
ein Pokémon-Weg). Der **Ashford River** begleitet den Bahndamm ein Stück im Süden, verlässt ihn vor Riverton nach Süden
und kommt von Süden heran in die Stadt (Prüfbericht Akt 2, Befund 9); er teilt Riverton in eine Bahnhofshälfte (Norden) und eine Parkhälfte (Süden). Am Südufer beginnt der
**Kanal**; er läuft nach Süden bis Ironwood. Sein **Seitenarm** zweigt nach Westen ab und führt durch
die Schleuse von Lockport ins Hafenbecken des Dorfes; dort endet er, ohne Anschluss an den Fluss.

**Maße und Laufzeiten (7a.2: Weg ab Akt 2 zwei Karten, zusammen 280 bis 400 lang, 80 bis 115 s):**

| Karte                          | Größe    | Hauptweg (mit Kurven) | Zeit zu Fuß | mit Fahrrad |
| ------------------------------ | -------- | --------------------- | ----------- | ----------- |
| `wegCedarRiverton.zedernwald`  | 140 × 30 | ≈ 152                 | ≈ 43 s      | ≈ 22 s      |
| `wegCedarRiverton.bahndamm`    | 150 × 30 | ≈ 158                 | ≈ 45 s      | ≈ 23 s      |
| **Weg 2 zusammen**             | 290      | ≈ 310                 | **≈ 88 s**  | ≈ 44 s      |
| `riverton.aussen`              | 72 × 56  | Bahnhof → Pavillon 64 | ≈ 18 s      | –           |
| `wegRivertonIronwood.kanalweg` | 30 × 190 | ≈ 205                 | ≈ 59 s      | ≈ 29 s      |
| `wegRivertonIronwood.bruecke`  | 30 × 160 | ≈ 190 (Serpentinen)   | ≈ 54 s      | ≈ 27 s      |
| **Weg 3 zusammen**             | 350      | ≈ 395                 | **≈ 113 s** | ≈ 56 s      |
| `lockport.aussen`              | 56 × 40  | Ostrand → Kai 48      | ≈ 14 s      | –           |

Die Story-Bibel nennt Weg 3 „doppelt so lang wie Route 2“ (10.3). Nach 7a.2 ist 400 die Obergrenze;
Weg 3 ist deshalb nur gut ein Drittel länger als Weg 2, fühlt sich aber durch die Steigung am Abhang,
die Schleuse und den Abstecher nach Lockport länger an. Das Fahrrad halbiert die Zeit und lohnt sich
hier zum ersten Mal (Bibel 10.3, W3). Befund für den Haupt-Chat (Abschnitt 3.3, Nr. 1).

### 1.1 Zedernwald (`wegCedarRiverton.zedernwald`, 140 × 30)

Waldweg aus Erde, **zwei Felder breit**, weiche Ränder mit Moos (Regel 9.6.1). Er beginnt am
**Westrand in den Reihen 8–9** (Anschluss an die Holzbrücke am Ostrand von Cedar Creek,
`orte/cedar-creek.md` 1.4 und 1.6), senkt sich in einer Kurve nach Süden (Reihen 12–13, Spalten 28–52),
kreuzt am Wegweiser den Abzweig zum Bach, quert den Waldbach auf einem Holzsteg (Spalten 72–75),
steigt in einer Kurve nach Norden zur Lichtung (Reihen 6–7, Spalten 88–110) und fällt zum **Ostrand in
den Reihen 14–15** ab (Anschluss an den Bahndamm). Der **Waldbach** (drei Felder) kommt am Nordrand bei
den Spalten 18–20 herein, läuft nördlich des Weges nach Osten (Reihen 3–5), biegt bei Spalte 70 nach
Süden, unterquert den Weg am Holzsteg und verlässt die Karte am Südrand bei den Spalten 74–76. Bibel
10.1: „Waldweg ab dem Steg, am Bach entlang“; es ist ein Nebenbach, der südlich von Cedar Creek in den
Bach des Ortes mündet.

```text
 Spalte: 0     14    28    42    56    70    84    98    112   126  139
 Reihe 0 ┌──────────────────────────────────────────────────────────────┐ Nordrand: dichter Zedernwald
         │   ≈≈Waldbach (R3–5)≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈┐        Lichtung   │
         │                        Trittsteine ┆ (Abzweig 1)  ╭──────╮     │
 R8–9 ═══╗  Z1 Brückenkopf                ┆        ≈  ╱ R6–7  ╲    │
         ╚══╗ Z2           [Wegweiser+Tafel]═╪═Holzsteg ╱ Z8   ╲   │
 R12–13     ╚════ Kurve ═════════════╝      ≈ Z6   ┆hohler  ╲  │
         │       Fenwick (Z4)                       ≈        ┆Baum (Abzw.2)╚═══ R14–15 → Bahndamm
         │                                           ≈≈ Südrand      │
 Reihe 29└──────────────────────────────────────────────────────────────┘ Südrand: dichter Zedernwald
          Z1    Z2    Z3    Z4    Z5    Z6    Z7    Z8    Z9    Z10
```

| Abschnitt (Spalten)    | Thema                     | Inhalt                                                                                                                                     | Zum Entdecken                                   |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Z1 (0–13) Brückenkopf  | Abschied von Cedar Creek  | Weg aus der Brücke heraus, hohe rote Zedern, ein moosbedeckter Grenzstein „Cedar Creek / Riverton“ (`grenzstein`, Ansehen)                 | Eichhörnchen auf dem Grenzstein                 |
| Z2 (14–27) Bachquelle  | der Waldbach kommt dazu   | Bach tritt von Norden herein, Farne, Pfadfinderleiter Leif Sorensen mit drei Kindern (N-W2a startet hier)                                  | Pfadfinder, Wasserrauschen                      |
| Z3 (28–41) Kurve       | Sonnenflecken             | Weg kurvt nach Süden, tote Zeder mit **Specht**, erster Kreidepfeil der Schnitzeljagd am Stamm                                             | Specht, Pfeil 1                                 |
| Z4 (42–55) Rast        | die Wanderin              | Mrs. Fenwick auf einem Baumstumpf am Weg (Weisheit, vorhanden), Rucksack und Stock                                                         | Mrs. Fenwick                                    |
| Z5 (56–69) Kreuzung    | Wegweiser mit Rätseltafel | einzige Kreuzung: **Wegweiser** (Cedar Creek ←, Riverton →, Bachufer ↑) mit der Rätseltafel (Szene 27); **Abzweig 1** nach Norden (5 lang) | Tafel, Trittsteine, **Pfeilspitze** unter Farn  |
| Z6 (70–83) Holzsteg    | über den Bach             | Holzsteg mit Geländer (Spalten 72–75), Biberspuren an zwei angenagten Stämmen                                                              | angenagte Stämme, Libellen                      |
| Z7 (84–97) Pilze       | Anstieg                   | Weg kurvt nach Norden, Pilzring am Wegrand, zweiter Kreidepfeil                                                                            | Pilzring, Pfeil 2                               |
| Z8 (98–111) Lichtung   | Licht und Gras            | Lichtung mit Gras und Wildblumen; **Abzweig 2** nach Süden (6 lang) zum hohlen Baumstamm                                                   | Rehe am Rand, **Springer aus Holz** (versteckt) |
| Z9 (112–125) Birken    | der Wald wird hell        | Zedern weichen Birken, dritter Kreidepfeil, Ende der Schnitzeljagd: kleines Pfadfinderlager mit Zelt und Fahne                             | Pfeil 3, Zelt                                   |
| Z10 (126–139) Waldrand | man hört den Zug          | Wald öffnet sich nach Osten; Sichtachse auf den Signalmast am Bahndamm                                                                     | Zugpfiff (Klang), Signalmast in der Ferne       |

**Ränder:** Nord- und Südrand dichter Zedernwald (Regel 9.8.1), der Waldbach reicht bis zum Nord- und
Südrand; offen sind nur West (Reihen 8–9) und Ost (Reihen 14–15). **Abzweige:** zwei (mittlerer Weg),
beide mit Ziel. **Sichtachse:** Vom Holzsteg (Z6) sieht man nach Osten die Lichtung, von Z10 den
Signalmast.

### 1.2 Bahndamm (`wegCedarRiverton.bahndamm`, 150 × 30)

Der Weg (Erde, zwei Felder) kommt am **Westrand in den Reihen 14–15** aus dem Birkenwald, steigt in
einem Bogen an den Fuß des Bahndamms (Reihen 8–9 ab Spalte 30) und folgt ihm bis zum **Ostrand in den
Reihen 8–9** (Anschluss an Riverton). Zwischen Spalte 80 und 110 schwingt er nach Süden aus (Reihen
11–12, an den Kleingärten vorbei) und kehrt zurück. Der **Bahndamm** liegt im Norden: Böschung Reihen 2
und 6, Schotter und **ein Gleis** in den Reihen 3–5. Das Gleis kommt im Westteil vom **Nordrand** herein
(Spalten 24–26, Bogen nach Osten bis Spalte 30; nach Norden liegt der Haltepunkt von Cedar Creek,
Prüfbericht Akt 2, Befund 8) und läuft dann bis zum Ostrand (Gleise sind nie begehbar, Zaun nur an den
Haltepunkten). Der **Ashford River** tritt ab Spalte 60 am Südrand auf (Reihen 24–29), begleitet den Weg
bis Spalte 110 und biegt dann nach Süden aus der Karte (Befund 9).

```text
 Spalte: 0     15    30    45    60    75    90    105   120   135  149
 Reihe 2 ┌────────────── Böschung ─────────────────────────────────────┐
 R0–5    │    ║(Nordrand, 24–26)══ Gleis auf dem Schotter bis zum Ostrand ══════════│ (nicht begehbar)
 Reihe 6 │──── Böschung ──[Signal]──[Haltepunkt]─[Durchlass]────[Waggon]──[Plakat]│
 R8–9    │        ╔═══════════════════════════╗   ╔════════════════════════════════ → Riverton
 R11–12  │   ╔═══╝  B2 Gwen   B3        B4 Quinn ╚═══╝ Kleingärten B7                │
 R14–15 ═╝ B1 Birken                       B5        Bank B6                         │
 R24–29  │                                  ≈≈≈≈≈≈≈≈≈ Fluss (bis 120, dann Südrand)≈≈≈≈≈│
         └─────────────────────────────────────────────────────────────┘
          B1    B2    B3    B4    B5    B6    B7    B8    B9    B10
```

| Abschnitt (Spalten)     | Thema                 | Inhalt                                                                                                                                                   | Zum Entdecken                               |
| ----------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| B1 (0–14) Birken        | aus dem Wald          | Weg steigt aus dem Birkenwald; Hase                                                                                                                      | Hase                                        |
| B2 (15–29) Dammfuß      | Arbeit an der Strecke | Streckenwärterin **Gwen Tolliver** prüft Schwellen (läuft B2 bis B4 am Dammfuß); Löwenzahn                                                               | Gwen, Löwenzahn                             |
| B3 (30–44) Signal       | rot und grün          | **Signalmast** (Kachelanimation, wechselt das Licht), Krähen auf dem Draht                                                                               | Signalmast (`signal`, Ansehen)              |
| B4 (45–59) Haltepunkt   | alter Bahnsteig       | **Abzweig 1** über vier Stufen zum stillgelegten Haltepunkt „Cedar Junction“ (Bahnsteigrest, Bank, Schild); Mr. Quinn in der Pause (Szene 27), Juno      | Quinn, **Fahrkarte von 1958** im Schotter   |
| B5 (60–74) Durchlass    | dunkel unter dem Damm | **Abzweig 2** nach Norden: gemauerter Durchlass unter dem Damm, dunkel (Sperre S14, Laterne); dahinter ein Tümpel mit Seerosen; Fluss erscheint im Süden | Durchlass, Gwens Thermoskanne (mit Laterne) |
| B6 (75–89) Flussblick   | Rast                  | Holzbank am Weg, Blick nach Süden über den Fluss; Weg schwingt nach Süden                                                                                | Aussicht (`aussichtFluss`), Möwen           |
| B7 (90–104) Kleingärten | Gärten der Stadt      | Kleingärten am Weg (Zäune, Beete, Gartenhaus), eine Gärtnerin gießt (Statist); **Abzweig 3** (3 lang) zur Gartenpforte mit Kürbissen                     | Gärtnerin, Kürbisse                         |
| B8 (105–119) Waggon     | was liegen bleibt     | Abstellgleis zweigt im Norden ab, darauf ein rostiger Güterwaggon, Katze auf dem Dach                                                                    | Katze, Waggon                               |
| B9 (120–134) Stadtrand  | die ersten Plakate    | Lagerzaun, **Plakatwand** „Perfect Move Park – Schach für alle, ohne Wartezeit“ (Szene 28)                                                               | Plakat (`plakatPerfectMove`)                |
| B10 (135–149) Einfahrt  | Riverton in Sicht     | Sichtachse auf den Uhrturm des Bahnhofs und die Steinbrücke                                                                                              | Uhrturm, Güterzug rattert vorbei (Belebung) |

**Ränder:** Norden Bahndamm mit Gleis vom Nordrand (Westteil) bis zum Ostrand, dahinter Gebüsch; Süden
Wiesen und zwischen Spalte 60 und 120 der Fluss bis zum Südrand (Regel 6.4); offen nur West (14–15) und
Ost (8–9).
**Abzweige:** drei (Haltepunkt, Durchlass, Gartenpforte), jedes mit Ziel. **Belebung:** Güterzug
(einmal je Besuch, Objekt mit Weg auf dem Gleis), Gwen, Gärtnerin, Krähen, Hase, Katze.

### 1.3 Riverton (`riverton.aussen`, 72 × 56)

Mittlere Stadt nach 7a.2 (60–80 × 50–60). Der Fluss teilt die Karte: oben Bahnhof, Vorplatz, Water
Street mit Markt und Läden; unten Riverside-Park mit Pavillon, Slicks Wohnwagen und das Kanalbecken.
Abschnitte zu je 18 × 14 Kacheln (Spalten A bis D, Reihen 1 bis 4).

```text
                                                 N
 Spalte:  0                18                36                54              71
 Reihe 0  ┌─────────────────┬─────────────────┬─────────────────┬────────────────┐
 R0–4     │═══════════ Gleise (zwei, Schotter) ══════════════════════════════════│
 R5–13    │ Gleisfeld  [Stellw.]   [BAHNHOF 30–42, Uhrturm]  [Güterschuppen 45–60] [Wasserturm]
 R8–9  ═══╪══ Fußweg am Zaun ══╗       Tür (36,13)          Laderampe          │
 R14–18   │                   ╚═ Vorplatz (18–52) · Wegweiser · Brunnen ·[Bus]│
 R19–22   │─ Gehweg / ════ Water Street (R20–21) ═══════════════════ Wendeplatz│
 R23–29   │[Häuser][Handyladen][ Markt 18–31 ][Bäckerei][Café]║Brücke║[Lagerhäuser, Kran]
 R30–32   │──── Uferpromenade ─────────────────────── Kaitreppe ║    ║──────── │
 R33–40   │≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈ Ashford River (West- bis Ostrand) ≈║50–53║≈≈≈≈≈≈≈≈│
 R41–42   │──── Uferweg Süd ────────────────────────────╨─ Parktor ─[Anleger]╔Becken╗
 R43–48   │[Wohnwagen][Werkstatt Albescu] Wiese [PAVILLON 36–45] Pegelhaus ║  ≈≈  ║
 R49–55   │  [Schuppen] · Bildschirmtische (22–34) · Platz   Treidelpfad 57–58║Kanal║
          └─────────────────┴─────────────────┴─────────────────┴──── Südrand → Kanalweg
                    A                 B                 C               D
```

**Reihen (Nord nach Süd):** 0–4 Bahngelände mit zwei Gleisen (nicht begehbar), Zaun in Reihe 5 außer am
Bahnhof; 5–13 Bahnhof, Stellwerk, Güterschuppen, Wasserturm; 8–9 Fußweg am Zaun vom Westrand; 14–18
Bahnhofsvorplatz; 19 Gehweg Nord; 20–21 **Water Street**; 22 Gehweg Süd; 23–29 Häuser, Markt und Läden
der Südseite; 30–31 Uferpromenade; 32 Ufermauer mit Geländer; 33–40 **Ashford River**; 41–42 Uferweg
Süd; 43–55 Park, Kanalbecken und Kanal.

**Gebäude und Plätze:**

| Gebäude, Platz                       | Lage außen (Spalten / Reihen), Tür                                                                                             | Fassade                                                       | Innen                                                 | Begehbar      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------- | ------------- |
| Bahnhof Riverton (Backstein, 1880er) | 30–42 / 5–13, Doppeltür (36, 13) in der Südfassade (7 von 13 = 54 %), Uhrturm über der Tür (35–37 / 5–8)                       | 13 breit, Rundbogenfenster, Vordach über der Tür              | `bahnhofshalle` 26 × 16, Tür Südwand Spalte 13 (50 %) | ja            |
| Stellwerk (Kulisse)                  | 21–26 / 6–11                                                                                                                   | Holz auf Backsteinsockel, Fensterband                         | –                                                     | nein          |
| Güterschuppen (Kulisse)              | 45–60 / 6–12, Laderampe 45–60 / 13 mit Frachtkisten und Sackkarre                                                              | Backstein, Schiebetore                                        | –                                                     | nein          |
| Wasserturm der Bahn                  | 64–69 / 5–12                                                                                                                   | Holztank auf Eisenbeinen                                      | –                                                     | Landmarke     |
| Bahnhofsvorplatz                     | 18–52 / 14–18: Pflaster, Brunnen (26–28 / 15–17), **Wegweiser** (20, 18) an der Ecke zur Water Street                          | –                                                             | –                                                     | Platz         |
| Bushaltestelle (Bus nach Ironwood)   | Wartehäuschen 46–48 / 14–15, Schild (49, 18) an der Bordsteinkante                                                             | Glas und Metall                                               | –                                                     | Kulisse       |
| Reihenhäuser West (zwei)             | 1–7 / 23–28, Türen in der Nordfassade                                                                                          | Backstein, Treppen mit drei Stufen                            | –                                                     | nein          |
| Handyladen „Perfect Move Store“      | 9–16 / 23–28, Tür (12, 23) in der Nordfassade                                                                                  | 8 breit, Glasfront, Leuchtschild, Tablets im Schaufenster     | –                                                     | Kulisse       |
| Markt                                | 18–31 / 23–29: vier Stände unter Markisen in zwei Reihen (Gemüse, Blumen, Brezeln, Fisch), Pflaster                            | –                                                             | –                                                     | Platz         |
| Bäckerei (Kulisse)                   | 33–40 / 23–26, Tür (36, 23) zur Straße; Hof mit Mehlsäcken und Fahrradständer 33–40 / 27–29                                    | 8 breit, Schaufenster mit Brezeln, Markise                    | –                                                     | nein          |
| Fahrradwerkstatt Albescu             | 12–19 / 45–48 am Westteil des Parks, Rolltor (15–16, 45) zum Uferweg Süd, geschlossen                                          | 8 breit, Schild „Albescu Bikes – geschlossen“, Fahrrad-Emblem | (Wohnung oben, nicht begehbar)                        | nein          |
| Schuppen hinter der Werkstatt        | 14–18 / 51–53 (Bibel 9.2: „hinter dem Park“), Tür (16, 53) in der Südfassade zum Hinterweg 0–34 / 54–55; Hofzaun 12–19 / 49–50 | 5 breit, Holz, Vorhängeschloss                                | `schuppen` 10 × 8, Tür Südwand Spalte 5 (50 %)        | ja (E4)       |
| Café „Dockside“ (Kulisse)            | 42–48 / 23–27, zwei Tische draußen auf dem Gehweg Süd                                                                          | 7 breit, Markise                                              | –                                                     | nein          |
| Steinbrücke                          | 50–53 / 22–42 (Rampe ab der Water Street), über dem Fluss Reihen 32–41                                                         | Stein mit Bögen, Laternen, Banner von Perfect Move            | –                                                     | Weg           |
| Lagerhäuser am Kai (Kulisse)         | 55–71 / 23–29, Kran am Kai (62, 31)                                                                                            | Backstein, Ladeluken                                          | –                                                     | nein          |
| Slicks Wohnwagen                     | 3–9 / 44–47, Tür (6, 47) an der Südseite; Klappstuhl, Grill, Kurierrad davor                                                   | 7 lang, weiß mit Rostrand                                     | `wohnwagen` 14 × 9, Tür Südwand Spalte 7 (50 %)       | ja (Szene 37) |
| Parkpavillon                         | 36–45 / 43–48, Treppe und Eingang (40–41, 48) in der Südseite; Platz davor 36–45 / 49–50                                       | 10 breit, achteckiges Holzdach, offene Seiten mit Geländer    | `pavillon` 20 × 14, Eingang Südwand Spalte 10 (50 %)  | ja            |
| Pegelhaus (Kanalmeister)             | 52–55 / 45–48, Pegellatte am Becken                                                                                            | 4 breit, Holz                                                 | –                                                     | nein          |
| Kanalbecken und Anleger              | Becken 58–68 / 41–46 (offen zum Fluss), Anleger 56–57 / 42–46 mit Pollern und Schild „Ashford Belle“                           | –                                                             | –                                                     | Platz         |

Regel wie in Maple Falls: Die Fassade ist halb so breit wie das Erdgeschoss innen (gerundet), die Tür
sitzt außen und innen an derselben relativen Stelle (±1 Kachel). Häuser der Südseite der Water Street
sind Kulisse mit Türen zur Straße (Nordfassade); die einzigen betretbaren Gebäude haben die Tür in der
Südfassade (Bahnhof, Schuppen, Wohnwagen, Pavillon).

**Abschnitte:**

| Abschnitt                  | Bereich       | Thema                              | Zum Entdecken                                                                                        |
| -------------------------- | ------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| A1 Gleisfeld               | 0–17 / 0–13   | Ankunft zu Fuß am Zaun             | Ratten huschen (Geräusch), Löwenzahn, Sichtachse auf den Uhrturm                                     |
| B1 Bahnhof                 | 18–35 / 0–13  | Stellwerk und Bahnhofsfront        | Stellwerk mit Hebeln im Fenster, Bahnhofsuhr am Turm                                                 |
| C1 Güterschuppen           | 36–53 / 0–13  | Fracht                             | Laderampe mit Sackkarre, Güterzug auf dem zweiten Gleis                                              |
| D1 Wasserturm              | 54–71 / 0–13  | Landmarke                          | Wasserturm, Tauben auf dem Tank                                                                      |
| A2 Westende                | 0–17 / 14–27  | Reihenhäuser und Handyladen        | Kyle in der Pause (N-RT3), Leuchtschild des Handyladens (`handyladen`)                               |
| B2 Vorplatz und Markt      | 18–35 / 14–27 | Wegweiser, Brunnen, Marktstände    | Margie am Gemüsestand, Brunnen mit Tauben, Wegweiser (`wegweiserRiverton`)                           |
| C2 Water Street Ost        | 36–53 / 14–27 | Bäckerei, Café, Bushaltestelle     | Duft aus der Bäckerei, Bushaltestelle (`busIronwood`), Banner an der Brückenrampe                    |
| D2 Lagerhäuser             | 54–71 / 14–27 | Hafen am Fluss                     | Wendeplatz, Gabelstapler (Statist), Möwen                                                            |
| A3 Westufer                | 0–17 / 28–41  | Uferpromenade                      | Bank mit Blick über den Fluss, Kinder springen in Pfützen (Pip, N-RT2)                               |
| B3 Hinter dem Markt        | 18–35 / 28–41 | Höfe und Ufermauer                 | Hof der Bäckerei mit Mehlsäcken, Angler auf der Ufermauer (Statist)                                  |
| C3 Brücke                  | 36–53 / 28–41 | Steinbrücke und Kaitreppe          | Dima unter dem ersten Brückenbogen, **Läufer aus Holz** (`fundLaeufer`, versteckt)                   |
| D3 Kai                     | 54–71 / 28–41 | Kran und Kai                       | Kran, Möwen streiten um Pommes                                                                       |
| A4 Wohnwagen und Werkstatt | 0–17 / 42–55  | Slicks Zuhause, Albescus Werkstatt | Wohnwagen mit Kurierrad, Mrs. Albescu vor dem Rolltor, Schuppen mit Vorhängeschloss (`schuppenTuer`) |
| B4 Wiese                   | 18–35 / 42–55 | Bildschirmtische                   | Bildschirmtische (`bildschirmtische`), Brunnen, Kameraleute in Szene 29                              |
| C4 Pavillon                | 36–53 / 42–55 | Parkschach                         | Pavillon mit klopfenden Uhren (Klang), Parktor mit Plakat, Pfützen mit Spiegelung                    |
| D4 Kanalbecken             | 54–71 / 42–55 | Anleger und Kanal                  | Schild „Ashford Belle“ (`anlegerSchild`), Pegelhaus mit Desmond Grant, Hochwassergatter (`kanalweg`) |

**Wegeführung:** Der Fußweg vom Westrand (Reihen 8–9, Erde, zwei Felder) läuft am Bahnzaun entlang und
biegt bei Spalte 17 in einem Bogen nach Süden auf den Vorplatz. Die **Water Street** (Asphalt, zwei
Felder, Gehwege je eins, Bordsteinkanten beidseitig, Regel 9.2.1) läuft vom Vorplatz bei Spalte 4 nach
Osten bis zum Wendeplatz vor den Lagerhäusern (Spalten 62–68). Bei den Spalten 50–53 führt die
**Brückenrampe** nach Süden über den Fluss; am Südende das Parktor (49–54 / 42). Im Park laufen die
Wege (Kies, zwei Felder) in Bögen: vom Parktor nach Südwesten zum Platz vor dem Pavillon, von dort in
einer weiten S-Kurve nach Westen über die Wiese zum Wohnwagen (Reihen 49–52), und vom Parktor nach
Osten am Pegelhaus vorbei zum Anleger und auf den **Treidelpfad** (Spalten 57–58) zum Südrand. Abzweige:
Kaitreppe hinunter zu Dima (47–49 / 31–32), Hinterweg am Südrand des Parks (Reihen 54–55) von der S-Kurve
zum Schuppen (16, 53), Bank am Westufer. Die Uferpromenade kreuzt die Brückenrampe ebenerdig mit Zebrastreifen.

**Unter der Brücke:** Dima sitzt auf dem schmalen Kai unter dem ersten Brückenbogen (50–53 / 32), zu
erreichen über die Kaitreppe. Das braucht eine Brückenebene über dem Helden (obere Kachelebene). Trägt
die Technik das nicht, sitzt Dima auf dem Treppenabsatz (48, 32) neben dem Brückenkopf; der Fund bleibt
„unter der Brücke“ im Schatten des Bogens (Befund für den Kartenbauer, 3.3 Nr. 3).

**Sichtachsen:** (1) Vom Westrand (Ankunft zu Fuß) sieht man nach einem Bildschirm den Uhrturm des
Bahnhofs. (2) Vom Vorplatz nach Osten die Steinbrücke mit dem Banner von Perfect Move. (3) Von der
Brücke nach Süden das achteckige Dach des Pavillons und dahinter das blaue Leuchten der
Bildschirmtische. (4) Vom Anleger nach Süden der Kanal, der zwischen alten Fabrikmauern verschwindet
(Vorgeschmack auf Weg 3).

**Ränder:** Norden Gleise mit Zaun; Westen Gleisfeld und Gebüsch, offen nur der Fußweg (Reihen 8–9);
Osten Lagerhäuser, Wasserturm und Brachfläche; Süden Hecke und Bäume des Parks, offen nur der
Treidelpfad (Spalten 57–58). Der Fluss reicht bis zum West- und Ostrand, der Kanal bis zum Südrand
(Regel 6.4).

**Laufzeit:** Bahnhofstür → Vorplatz → Water Street → Brücke → Pavillon ≈ 64 Kacheln, gut 18 s; quer
über die Karte (72) etwa 21 s. Der Ankommende zu Fuß läuft vom Westrand bis zum Pavillon etwa 95
Kacheln (27 s); das ist der erste Gang durch die Stadt, danach beginnt man am Bahnhof.

### 1.4 Kanalweg (`wegRivertonIronwood.kanalweg`, 30 × 190)

Treidelpfad am Westufer des Kanals (Erde mit Kies, **zwei Felder breit**), von Nord nach Süd. Er kommt
am **Nordrand bei den Spalten 17–18** aus Riverton und verlässt die Karte am **Südrand bei den Spalten
17–18** zur Eisenbrücke. Der **Kanal** (fünf Felder, gerade Ufermauern) liegt östlich des Pfads:
Reihen 0–69 Spalten 20–24, dann eine weite Kurve nach Westen (Reihen 70–89) auf die Spalten 14–18
(Pfad 11–12), Reihen 90–124 dort, dann zurück (Reihen 125–149) auf die Spalten 20–24 bis zum Südrand.
Der **Seitenarm** Q2 (drei Felder) zweigt in den Reihen 101–103 nach Westen ab und reicht bis zum
Westrand; der Pfad quert seine Mündung auf der **Treidelbrücke** (10–13 / 100–104, Holz auf
Steinpfeilern, immer offen). Der Abzweig nach Lockport folgt dem Nordufer des Seitenarms (Reihen 97–98, zwei Reihen Abstand zum Wasser wie in Lockport; Befund 11)
zum **Westrand**. Die Landschaft wechselt von Industrie (Norden, nahe Riverton) zu Feldern (Süden).

```text
       Spalte 0         11 17  20  24  29
 Reihe 0   ┌────────────────║║─┤≈≈≈≈≈├────┐  Nordrand ← Riverton (Treidelpfad 17–18)
 K1–K2     │ Fabrikmauer, Graffiti (Noor)║≈Kanal≈│ Gestrüpp, Böschung
 K3        │ [Fabrikhof]══ Abzweig 1 ══║≈≈≈≈≈│
 K4        │ Werkstraße, [Halt ohne Bus + Tafel]║≈[Drehbrücke, offen, rostig]
 K5–K6     │ Ziegelei-Schornstein   ╔═╝≈≈≈≈╝  Kurve nach Westen
 K7  R97–98 ◄═══ nach Lockport ═══[Wegweiser]║≈≈≈│
     R101–103≈≈≈ Seitenarm ≈≈≈≈≈≈[Treidelbr.]≈≈≈≈│
 K8        │ Schilf, Rastbank          ║≈≈≈≈≈│
 K9–K10    │ Felder von Mr. Dale, Scheune ║≈≈≈│ Weiden
 K11       │ Rastanleger (Abzweig 3)   ╚═╗≈≈≈≈≈╗ Kurve zurück
 K12–K13   │ Pappeln, Strommast, Rauch im Süden ║≈≈≈≈≈│
 Reihe 189 └────────────────║║─┤≈≈≈≈≈├────┘  Südrand → Eisenbrücke (17–18)
```

| Abschnitt (Reihen)      | Thema                    | Inhalt                                                                                                                                                                       | Zum Entdecken                                      |
| ----------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| K1 (0–14) Kanalausfahrt | Abschied vom Fluss       | Pfad nach dem Hochwassergatter, Poller mit Möwe, Kanalmeilenstein „Meile 0“                                                                                                  | Meilenstein (`meilenstein`), Möwe                  |
| K2 (15–29) Graffiti     | die erste Fabrik         | lange Ziegelmauer westlich des Pfads mit Graffiti von Schachfiguren; **Noor Haddad** sprüht (N-W3a)                                                                          | Noor, Graffiti                                     |
| K3 (30–44) Fabrikhof    | leere Hallen             | **Abzweig 1** nach Westen (6 lang) durch ein offenes Tor in den Fabrikhof; Maschendrahtzaun, Krähen                                                                          | **Zahnrad** am Zaun (`fundZahnrad`), Krähen        |
| K4 (45–59) Werkstraße   | Bushaltestelle ohne Bus  | alte Werkstraße kreuzt von Westen und endet an einer rostigen Drehbrücke (offen gedreht, Kulisse); daran das Haltestellenschild ohne Fahrplan mit **Rätseltafel** (Szene 40) | Tafel (`tafel`), Drehbrücke                        |
| K5 (60–74) Ziegelei     | Schornstein              | Schornstein der alten Ziegelei, Brombeeren; der Kanal beginnt die Kurve nach Westen                                                                                          | Brombeeren, Radfahrer (Belebung)                   |
| K6 (75–89) Kahnwrack    | Industrie endet          | Weiden am Ufer, halb versunkenes Kahnwrack im Kanal (Kulisse)                                                                                                                | Wrack mit Bisamratte                               |
| K7 (90–104) Seitenarm   | Kreuzung am Wasser       | **Wegweiser** (Riverton ↑, Ironwood ↓, Lockport ←) an der einzigen Kreuzung; **Abzweig 2** nach Lockport (Q2), Treidelbrücke über die Mündung                                | Wegweiser, Sicht auf die Dächer von Lockport       |
| K8 (105–119) Schilf     | Rast                     | Schilf, Libellen, Rastbank am Pfad mit Blick über den Kanal                                                                                                                  | Rastbank (`rastKanal`), Libellen                   |
| K9 (120–134) Felder     | Mr. Dale                 | Kohl- und Kürbisfeld bis zum Westrand; **Mr. Dale** am Feldzaun (Weisheit, vorhanden)                                                                                        | Mr. Dale                                           |
| K10 (135–149) Scheune   | Hof                      | Scheune mit Hühnern, Leiterwagen; der Kanal schwingt zurück                                                                                                                  | Hühner, Leiterwagen                                |
| K11 (150–164) Anleger   | ein Platz für Kahnfahrer | **Abzweig 3** (3 lang) nach Osten an den Kanal zum Rastanleger mit Bank; dort treibt eine Konservendose mit Zettel                                                           | **Konservendose mit Zettel** (`fundKonservendose`) |
| K12 (165–179) Pappeln   | Wind                     | Pappelallee am Pfad, Gänse auf dem Kanal                                                                                                                                     | Gänse                                              |
| K13 (180–189) Ausblick  | Ironwood in der Ferne    | Strommast, Sichtachse nach Süden: Rauch und Schornsteine am Horizont                                                                                                         | Rauch (Hintergrund)                                |

**Ränder:** Westen Fabrikmauern, dann Felder bis zum Rand; Osten Böschung mit Gestrüpp und Weiden; der
Kanal reicht bis zum Nord- und Südrand, der Seitenarm bis zum Westrand. Offen sind Nordrand (17–18),
Südrand (17–18) und Westrand (Pfad nach Lockport, Reihen 97–98). **Abzweige:** drei, jedes mit Ziel.

**Gebaut (Runde 5, mittel-3):** drei Varianten mit gleicher fester Geometrie (Kanal, Pfad, Kurven,
Seitenarm mit Treidelbrücke 11–12 / 101–103, Pfad nach Lockport 0–10 / 97–98, Fabrikhof 2–13 / 37–42 mit
Zaun in Reihe 43, Werkstraße 8–16 / 50–51, Wegweiser (9, 95), Rastanleger 19 / 155–156). Auslöser:
`zurueckRiverton` (17–18, 0), `weiterBruecke` (17–18, 189), `lockport` (0, 97–98), `tafel` (15, 50) an der
Rätseltafel (14, 47) neben dem Haltestellenschild, `fundZahnrad` (12, 42) am Hofzaun, Start (17, 1);
Mr. Dale (10, 128). Die neuen Auslöser `meilenstein`, `rastKanal`, `fundKonservendose` kommen mit den
Dialogen in Runde 6; Schild, Rastbank und Anleger stehen schon. A nach dem Dokument; B karger im Herbst
(eine Halle, Container, breiter Ziegelturm, nur Kürbisse, gelbe Pappeln); C reicher (zwei Graffiti-Mauern,
zwei Ziegeltürme, Hühnerstall, Pappeln auf beiden Ufern).

### 1.5 Eisenbrücke und Abhang (`wegRivertonIronwood.bruecke`, 30 × 160)

Der Pfad kommt am **Nordrand bei den Spalten 17–18** an, noch am Westufer des Kanals (Kanal Spalten
20–24). Ab Reihe 40 senkt sich der Kanal in einen tiefen **Einschnitt** und schwenkt nach Südwesten unter
den Pfad: Die **Eisenbrücke** (Spalten 15–20, Reihen 56–72, Fachwerk aus genieteten Trägern, Bohlenbelag,
Geländer) trägt den Pfad hoch über das Wasser. Danach liegt der Kanal westlich (Spalten 4–9, Ufer 3 und 10, bis zum
Südrand), der Pfad läuft auf dem Ostufer und fällt in **Serpentinen** den Abhang hinab (vier Kehren
zwischen Reihen 90 und 145) zum **Südrand bei den Spalten 24–25** (Anschluss an die Treppe am Nordrand von `ironwood.aussen`,
ebenfalls Spalten 24–25; mit mittel-4 abgestimmt, `orte/ironwood.md` 1.6).

| Abschnitt (Reihen)      | Thema                    | Inhalt                                                                                                                                          | Zum Entdecken                        |
| ----------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| BR1 (0–14) Damm         | der Kanal auf dem Damm   | Pfad auf dem Kanaldamm, Ginster                                                                                                                 | Ginster, Wind (Klang)                |
| BR2 (15–29) Wärterhaus  | verlassen                | leeres Brückenwärterhäuschen mit vernagelter Tür (Kulisse), alte Laterne                                                                        | Häuschen (`waerterhaus`, Ansehen)    |
| BR3 (30–44) Einschnitt  | das Wasser sinkt         | Kanal läuft in den Einschnitt, Felswände, Farne in Ritzen                                                                                       | Blick in die Tiefe                   |
| BR4 (45–59) Brückenkopf | Eisen und Nieten         | Brückenkopf aus Stein; **Corwin Lund** streicht das Geländer (N-W3b), Farbeimer                                                                 | Corwin                               |
| BR5 (60–74) Eisenbrücke | Wind, das Tal tief unten | Brückenmitte (Szene 40, `zeitnotTrick` bei (17, 64)); **Nietenkopf** am Geländer (`fundNietenkopf`, (20, 62)); Sichtachse auf Ironwood im Süden | Nietenkopf, Aussicht (`aussichtTal`) |
| BR6 (75–89) Ostufer     | oben am Hang             | Pfad am Ostufer, Bank mit Blick nach Süden (Aussicht auf den Rauch des Werks)                                                                   | Bank, Krähen auf einem Träger        |
| BR7 (90–104) Kehre 1    | Serpentine               | erste Kehre, Geröll, Stützmauer                                                                                                                 | Eidechse auf der Mauer               |
| BR8 (105–119) Kehre 2   | Farbe am Hang            | zweite Kehre; hier liegt in N-W3b der weggerollte Farbeimer                                                                                     | Farbeimer (mit Quest)                |
| BR9 (120–134) Kehre 3   | Birken am Hang           | dritte Kehre, Birken, ein Wegkreuz aus Eisenbahnschwellen                                                                                       | Wegkreuz (Ansehen)                   |
| BR10 (135–149) Kehre 4  | Stadtrand                | letzte Kehre, Lärmschutzzaun, Graffiti „Ironwood steel“                                                                                         | Graffiti                             |
| BR11 (150–159) Ankunft  | Ironwood                 | Pfad mündet in eine Straße; Sichtachse auf Schornsteine und Werkstor                                                                            | Schornsteine                         |

**Ränder:** Westen der Kanal bis zum Nord- und Südrand, dahinter Felswand; Osten Hang mit Gebüsch,
oben Ginster, unten Birken; offen nur Nord (17–18) und Süd (24–25). **Abzweige:** zwei (Bank in BR6, Kehre
3 mit Wegkreuz, je 3 lang). **Laufzeit:** durch die Serpentinen ≈ 190 Kacheln für 160 Reihen.

### 1.6 Lockport (`lockport.aussen`, 56 × 40, Nebenort N2)

Neun Häuser (mit Wärterhaus und Gasthaus) um eine Schleuse am Seitenarm Q2 (`13_Wegenetz.md` 3). Der **Seitenarm** kommt am
**Ostrand** herein (Reihen 14–16), fließt durch die **Schleuse** (Kammer 30–37 / 14–16, Obertor bei Spalte 37,
Untertor bei Spalte 30) und weitet sich zum **Hafenbecken** (2–29 / 13–19), das vor dem Westrand endet (Kaimauer bei Spalte 1, dahinter Wiese; ohne Anschluss an den Fluss, Befund 9)
hinausführt. Der Pfad vom Kanalweg kommt am **Ostrand in den Reihen 10–11** auf dem Nordufer an.

```text
 Spalte:  0          14          28          42       55
 Reihe 0  ┌───────────┬───────────┬───────────┬─────────┐
 R2–9     │[Haus][Haus][Haus] Gärten, Wäscheleinen [Schleusenwärterhaus 38–44]
 R10–11   │── Nordufer ─────────────────────[Tafel S3]═══════ ← Kanalweg (Ostrand)
 R12      │ Finn angelt       Ufer          ┆Untertor-Steg (30, 12–18)
 R13–19 ≈≈≈≈ Hafenbecken (endet an der Kaimauer) ≈≈║Kammer║≈≈≈≈ Seitenarm ≈≈≈≈ (Ostrand)
          │   Lastkahn „Ashford Belle“ am Kai
 R20–21   │═══════════ Kai mit Pollern (2–40) ═══════════│
 R22–28   │[Bootsschuppen][Haus] [GASTHAUS 18–27] [Haus][Haus]
 R29–34   │      ═══ Dorfplatz mit Linde und Pumpe (14–34) ═══   [Haus]
 R35–39   │ Wiesen, Pappeln, Hecke                                │
          └───────────────────────────────────────────────────────┘
```

| Gebäude, Platz             | Lage (Spalten / Reihen), Tür                                                      | Fassade                                           | Innen                                            | Begehbar |
| -------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------ | -------- |
| Schleusenwärterhaus Imogen | 38–44 / 4–9, Tür (41, 9) zur Uferstraße                                           | 7 breit, Holz, Fensterläden, Glocke am Giebel     | –                                                | nein     |
| Drei Häuser Nordufer       | 2–8, 10–16, 18–24 / 2–8; Gärten und Wäscheleinen bis Reihe 9                      | je 7, Holz und Backstein gemischt                 | –                                                | nein     |
| Schleuse (S3)              | Kammer 30–37 / 14–16, Steg auf dem Untertor (30, 12–18) zwischen Nordufer und Kai | Holztore mit Balken, Kurbeln                      | –                                                | Weg (S3) |
| Kai                        | 2–40 / 20–21, Poller alle 6 Kacheln, Lastkahn 8–20 / 17–19 im Becken              | –                                                 | –                                                | Platz    |
| Bootsschuppen (Kulisse)    | 2–9 / 22–26                                                                       | Holz, Slipanlage                                  | –                                                | nein     |
| Gasthaus „Zur Schleuse“    | 14–23 / 23–31, Tür (21, 31) in der Südfassade zum Dorfplatz; Terrasse zum Kai     | 10 breit, Fachwerk, Wirtshausschild, Kegel-Emblem | `gasthaus` 20 × 13, Tür Südwand Spalte 14 (70 %) | ja       |
| Vier Häuser Süd            | 11–16 / 22–27, 30–36 / 22–27, 38–44 / 22–27, 46–52 / 28–33                        | je 6–7, Türen zum Dorfplatz oder zum Kai          | –                                                | nein     |
| Dorfplatz                  | 14–34 / 29–34, Linde (24, 31), Schwengelpumpe (30, 30), Bank unter der Linde      | –                                                 | –                                                | Platz    |

**Gebaut (Runde 5, mittel-3):** drei Varianten mit gleicher fester Geometrie: Uferstraße Reihen 10–11
(Spalten 3–55), Kammer 30–37 / 14–16, Steg 32–33 / 14–16, Kai 1–40 / 20–21, Dorfplatz 2–38 / 32–35,
Gasthaus 14–23 / 23–31 (Tür (21, 31), Auslöser `gasthausTuer` (21, 32)), Wärterhaus (38, 0),
Tafel (34, 8), Ankunft (54, 10). A: großes Becken 2–29 / 13–19, drei Häuser im Norden; B: kleineres
Becken 6–29 / 14–19, weniger Häuser, Platz ohne Baum; C: Beete, drei Wäscheleinen, drei Boote.

**Abschnitte** (je 14 × 20; Reihe 1 = Nordufer, Reihe 2 = Kai und Dorf):

| Abschnitt           | Bereich       | Thema                    | Zum Entdecken                                                         |
| ------------------- | ------------- | ------------------------ | --------------------------------------------------------------------- |
| A1 Westgärten       | 0–13 / 0–19   | Wäsche und Möwen         | Wäscheleine im Wind, Möwen über dem Becken                            |
| B1 Finns Ufer       | 14–27 / 0–19  | Angeln                   | Finn angelt Flaschen (Belebung und Figur)                             |
| C1 Schleuse         | 28–41 / 0–19  | Tafel und Tore           | Rätseltafel S3 (`tafelSchleuse`), Kurbeln der Schleuse                |
| D1 Ankunft          | 42–55 / 0–19  | Wärterhaus und Seitenarm | Glocke am Giebel (`glocke`, Ansehen), Seitenarm mit Schilf            |
| A2 Bootsschuppen    | 0–13 / 20–39  | Boote                    | Slipanlage, Henriks Ruderboot an vielen Tauen (L2)                    |
| B2 Kai und Gasthaus | 14–27 / 20–39 | Kahn und Wirtshaus       | Lastkahn „Ashford Belle“, Kapitän Ruben, Tafel mit Kreide am Kai (L1) |
| C2 Dorfplatz        | 28–41 / 20–39 | Linde und Pumpe          | Pumpe (`pumpe`, Ansehen), Bank unter der Linde                        |
| D2 Ostdorf          | 42–55 / 20–39 | Gärten und Pappeln       | Gänse, Kürbisse vor den Türen                                         |

**Wegeführung:** Uferstraße am Nordufer (Erde, zwei Felder, Reihen 10–11) vom Ostrand nach Westen bis
Spalte 2; der Steg über das Untertor (eine Kachel breit, Holz mit Geländer) führt hinüber zum Kai; vom
Kai Gassen zwischen den Häusern zum Dorfplatz (zwei Felder). **Sichtachse:** Vom Ostrand sieht man
über die Schleuse den Mast des Lastkahns und das Wirtshausschild. **Ränder:** Norden Gärten und Hecken,
Süden Wiesen und Pappeln, Westen Wiese hinter der Kaimauer des Beckens, Osten der Seitenarm; offen nur der Pfad
am Ostrand (Reihen 10–11). **Laufzeit:** Ostrand → Steg → Kai ≈ 48 Kacheln, knapp 14 s.

### 1.7 Gebäude und Maße

| Gebäude                       | Außen (Fassade)                 | Innen (7a.2)                                                           | Begehbar |
| ----------------------------- | ------------------------------- | ---------------------------------------------------------------------- | -------- |
| Bahnhofshalle Riverton        | 13, Tür bei 7 von 13 (54 %)     | 26 × 16 (großer Saal; heute 20 × 14), Tür Südwand Spalte 13 (50 %)     | ja       |
| Parkpavillon                  | 10, Eingang bei 5 von 10 (50 %) | 20 × 14 (Clubraum; heute 16 × 12), Eingang Südwand Spalte 10 (50 %)    | ja       |
| Slicks Wohnwagen              | 7, Tür bei 4 von 7 (57 %)       | 14 × 9 (Wohnwagen, schmal; heute 12 × 10), Tür Südwand Spalte 7 (50 %) | ja       |
| Schuppen hinter der Werkstatt | 5, Tür bei 3 von 5 (60 %)       | 10 × 8 (klein; heute 12 × 10), Tür Südwand Spalte 5 (50 %)             | ja       |
| Gasthaus „Zur Schleuse“       | 10, Tür bei 5 von 10 (50 %)     | 20 × 13 (öffentlicher Raum), Tür Südwand Spalte 10 (50 %)              | ja (neu) |

Der Wohnwagen ist mit 9 Reihen schmaler als ein Wohnraum nach 7a.2 (10 bis 13); Wohnwagen sind schmal,
und Szene 37 braucht nur Bett, Brett und Dosen. Der Schuppen ist bewusst klein (Bibel: „innen (klein)“).

### 1.8 Übergänge (Felder auf beiden Seiten)

| Von (Karte, Auslöser, Feld)                                              | Nach (Karte, Auslöser, Feld; Ankunft)                                                     | Lage                                                                                                                                |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| cedarCreek.aussen `zedernwald` (Ostrand, Reihen 8–9)                     | zedernwald `zurueckCedar` (Westrand, Spalte 0, Reihen 8–9; Ankunft (1, 8))                | Waldweg je zwei Felder, gleiche Reihen (`orte/cedar-creek.md` 1.6); nur nach `endeAkt1Gesehen`. In `orte.json` schon so (mittel-2). |
| zedernwald `weiterBahndamm` (Ostrand, Spalte 139, Reihen 14–15)          | bahndamm `zurueckZedernwald` (Westrand, Spalte 0, Reihen 14–15; Ankunft (1, 14))          | Waldweg geht in den Feldweg über                                                                                                    |
| bahndamm `weiterRiverton` (Ostrand, Spalte 149, Reihen 8–9)              | riverton.aussen `bahndamm` (Westrand, Spalte 0, Reihen 8–9; Ankunft (1, 8))               | Fußweg am Bahnzaun; Dialog `riverton-aussen.ankunft_zu_fuss` bleibt an `weiterRiverton`                                             |
| riverton.aussen `bahnhofTuer` (36, 13)                                   | bahnhofshalle `bahnhofAusgang` (13, 15); Ankunft (13, 14), Blick nach oben                | Südfassade 54 % ↔ Südwand 50 %                                                                                                      |
| riverton.aussen `pavillonEingang` (40, 48)                               | pavillon `pavillonAusgang` (10, 13); Ankunft (10, 12)                                     | Südseite ↔ Südwand Mitte                                                                                                            |
| riverton.aussen `wohnwagenTuer` (6, 47)                                  | wohnwagen `wohnwagenAusgang` (7, 8); Ankunft (7, 7)                                       | Südseite ↔ Südwand Mitte; `wenn: clubkampfRivertonBesprochen` (wie heute)                                                           |
| riverton.aussen `schuppenTuer` (16, 53)                                  | schuppen `schuppenAusgang` (5, 7); Ankunft (5, 6)                                         | Südfassade ↔ Südwand; `wenn: schuppenOffen` (wie heute)                                                                             |
| riverton.aussen `kanalweg` (Südrand, Spalten 57–58, Reihe 55)            | kanalweg `zurueckRiverton` (Nordrand, Spalten 17–18, Reihe 0; Ankunft (17, 1))            | Treidelpfad je zwei Felder; `wenn: nadelRiverton` (wie heute), Grund in der Welt: Hochwassergatter (2.4)                            |
| kanalweg `weiterBruecke` (Südrand, Spalten 17–18, Reihe 189)             | bruecke `zurueckKanalweg` (Nordrand, Spalten 17–18, Reihe 0; Ankunft (17, 1))             | Treidelpfad geht weiter                                                                                                             |
| kanalweg `lockport` (neu, Westrand, Spalte 0, Reihen 97–98)              | lockport.aussen `kanalweg` (neu, Ostrand, Spalte 55, Reihen 10–11; Ankunft (54, 10))      | Uferpfad am Seitenarm je zwei Felder; offen; die Sperre S3 liegt erst am Steg in Lockport                                           |
| bruecke `weiterIronwood` (Südrand, Spalten 24–25, Reihe 159)             | ironwood.aussen `kanalweg` (Nordrand, Spalten 24–25, Reihe 0, Treppe; Ankunft (24, 1))    | Weg je zwei Felder, gleiche Spalten; Kanal auf beiden Seiten Spalten 4–9; Dialog `ironwood-aussen.ankunft_zu_fuss` bleibt           |
| lockport.aussen `gasthausTuer` (neu, 21, 32)                             | gasthaus `gasthausAusgang` (neu, 14, 12); Ankunft (14, 11)                                | Südfassade 70 % ↔ Südwand 70 %                                                                                                      |
| bahnhofshalle `zugCedar` (Bahnsteigtür, Nordwand (19, 2); Dialog, Reise) | cedarCreek.aussen `bahnhof` (neuer Haltepunkt am Nordrand, baut der Haupt-Chat; Befund 8) | Schnellreise Zug (W2, nach `besuchtRiverton`), 10 Münzen, frei nach der Nadel von Riverton (Bibel 10.1); mit Monatskarte frei       |
| riverton.aussen `busIronwood` (neu, Schild (49, 18); Dialog, Reise)      | ironwood.aussen `busRiverton` (12, 32), Ankunft (14, 32)                                  | Schnellreise Bus, nach `besuchtIronwood` (W2), 10 Münzen, nach der Nadel von Ironwood frei                                          |
| riverton.aussen `anlegerSchild` (neu, (56, 43); Dialog, Reise)           | lockport.aussen `kai` (neu, (14, 20)) und ironwood.aussen `anleger` (12, 22)              | Lastkahn, erst nach „Post für den Kapitän“ (14, L3), 5 Münzen                                                                       |
| lockport.aussen `kai` (neu, (14, 20); Dialog, Reise)                     | riverton.aussen `anlegerSchild`, ironwood.aussen `anleger` (12, 22)                       | Lastkahn zurück                                                                                                                     |

**Abstimmung mit mittel-4 (Ironwood), Stand 9.11.2026 (vermittelt vom Haupt-Chat):** Übergang Südrand
der Brückenkarte ↔ Treppe am Nordrand von `ironwood.aussen`, Weg auf beiden Seiten in den Spalten 24–25,
Kanal auf beiden Seiten in den Spalten 4–9 (`orte/ironwood.md` 1.6). In Ironwood: Anleger `anleger`
(12, 22) am Kai, Bus `busRiverton` (12, 32), Ankunft `bushaltestelle` (14, 32) an der Brücke der Schnellstraße. Gegenstücke in
Riverton: `anlegerSchild` (56, 43) am Kanalbecken, `busIronwood` (49, 18) am Bahnhofsvorplatz; in
Lockport `kai` (14, 20). Der Lastkahn fährt nach L3 (Brief von Big Joe, also nach Szene 39), das passt zu
„nach Szene 39“ in `orte/ironwood.md`.

Die Prüfung im Kartenbauer (`pipeline/abenteuer/uebergaenge.py`) verlangt: jedes Gegenstück auf der
Zielkarte; Türen auf der Wand, durch die man den Raum verlässt (Südwand innen ↔ Tür in einer
Südfassade außen); Randübergänge auf dem passenden Rand (Ost ↔ West, Süd ↔ Nord) und gleiche Breite
auf beiden Seiten.

### 1.9 Platzhalter für die Rückkehr (13, Abschnitt 7.4)

- `riverton.aussen`: Bildschirmtische als Objektebene mit Bedingung (Akt 2 aufgebaut, Akt 3 verschneit,
  zwei kaputt, Akt 4 abgedeckt, Post-Game weg); Pavillontür verschließbar (nach Szene 37: Gitter vor
  der Treppe, Schild „Trainingszentrum – demnächst“); Tisch für Slicks Unterschriftenliste auf dem Platz
  vor dem Pavillon (Akt 4); am Anleger ein Feld für den Eiszapfen-Fund (Akt 3, 13 §7.3); Lastkahn am
  Anleger als Objekt (nach L3 liegt er manchmal dort); Hochwassergatter als Objekt (offen ab `nadelRiverton`).
- `riverton.bahnhofshalle`: Bank für Slick (Akt 3: „Slick spielt in der Bahnhofshalle weiter“), eine
  freie Wandfläche für ein Plakat der Landesmeisterschaft (Akt 4).
- `riverton.pavillon`: Bildschirmtische als Objektebene über den Marmortischen (nach Szene 37).
- `wegCedarRiverton.bahndamm`: Durchlass (S14) als Objekt mit Bedingung `hatLaterne`; Thermoskanne im
  Durchlass.
- `wegRivertonIronwood.kanalweg`: Noors Graffiti in zwei Stufen (Akt 2 halb, Akt 3 fertig); Konservendose
  am Rastanleger nur einmal.
- `lockport.aussen`: Lastkahn am Kai (bis L3 vertäut und abgedeckt, danach mit Mannschaft); Steg am
  Untertor als Objekt (S3 zu, dann offen); Feld für Eis auf dem Becken (Akt 3).

## 2. Ortsbild

### 2.1 Der Zedernwald

Hinter der neuen Holzbrücke von Cedar Creek wird es still. Die Zedern stehen hier so dicht, dass ihr
Duft wie eine Decke über dem Weg liegt, warm, ein bisschen nach Bleistift. Moos wächst auf allem, was
sich nicht bewegt, und das Licht fällt in Flecken durch die Kronen, die wandern, wenn der Wind geht.
Ein kleiner Bach kommt von Norden und begleitet den Weg eine Weile, murmelnd, als hätte er Neuigkeiten.
Irgendwo klopft ein Specht in einem toten Stamm, gleichmäßig wie eine Uhr. An einer Kreuzung steht ein
alter Wegweiser mit drei Armen, an seinem Pfosten eine Tafel mit Kreidestellungen, und auf einem
Baumstumpf daneben ruht eine Frau mit Rucksack und Wanderstock, die aussieht, als hätte sie schon jeden
Weg des Staates gegangen. Hinter dem Holzsteg wird der Wald heller: eine Lichtung mit hohem Gras, ein
Reh, das kurz aufschaut, und am Rand ein hohler Stamm, in dem etwas liegt, das nicht dorthin gehört. Dann
kommen Birken, und plötzlich hört man durch die Bäume einen Zug pfeifen.

### 2.2 Der Bahndamm

Der Bahndamm ist ein langer grüner Rücken mit einem einzigen glänzenden Gleis obendrauf. Der Weg läuft
an seinem Fuß entlang, zwischen Löwenzahn und Schotter, und alle paar Minuten summen die Schienen, bevor
ein Güterzug vorbeirattert, so lang, dass man aufhört zu zählen. Eine Frau in orangefarbener Weste
geht die Strecke ab und klopft mit einem Hammer auf die Schwellen. An einem verlassenen Haltepunkt,
nicht mehr als ein Stück Bahnsteig und eine Bank, macht ein Schaffner Pause und hat ein Steckschach mit
einer kleinen Uhr dabei. Weiter östlich duckt sich ein dunkler Durchlass unter den Damm, aus dem es
kühl herausweht. Dann taucht im Süden der Fluss auf, breit und grau, Kleingärten mit Kürbissen säumen
den Weg, und auf einer Plakatwand am Stadtrand lächelt eine junge Spielerin vor einem leuchtenden
Bildschirm: „Perfect Move Park – Schach für alle, ohne Wartezeit“. Über den Dächern steht ein Uhrturm.

### 2.3 Riverton

Riverton riecht nach nassem Backstein. Es regnet nicht immer, aber es hat immer gerade geregnet: Die
Pfützen auf dem Vorplatz spiegeln den Uhrturm, die Tauben laufen mit nassen Füßen über das Pflaster,
und die Pendler tragen ihre Schirme auch dann aufgespannt, wenn es nur noch tropft. Der Bahnhof ist
aus der Zeit, als man Bahnhöfe wie Kirchen baute: rote Ziegel, hohe Bogenfenster, eine Uhr im Turm, die
eine Minute nachgeht, weil der alte Uhrmacher auf der Bank darunter sagt, sie gehe richtig und alle
anderen falsch. Hinter dem Bahnhof stampfen Güterzüge, im Stellwerk legt jemand Hebel um, und auf dem
Wasserturm sitzen Tauben in einer langen Reihe.

Die Water Street ist die Straße, auf der Riverton lebt. Am Markt verkauft eine Frau mit roten Händen
Äpfel und Kürbisse und rechnet die Preise so schnell aus, dass man nicht nachkommt; gegenüber hängt
das glänzende Schild eines neuen Ladens, in dessen Schaufenster Tablets mit Schachbrettern leuchten. Ein
paar Häuser weiter duftet es aus einer Bäckerei. Im Café an der Ecke dampft es aus
den Tassen. Am Ende der Straße schwingt sich eine Steinbrücke mit drei Bögen über den Fluss, an ihrem
Geländer flattert ein Banner, und unter dem ersten Bogen spielt ein Mann Akkordeon für die Möwen.

Auf der anderen Seite liegt der Riverside-Park. Seit Jahrzehnten wird hier im Pavillon Schach gespielt:
ein achteckiges Holzdach auf Säulen, darunter Marmortische, und das Klopfen der Uhren hört man schon von
der Brücke. Jetzt stehen auf der Wiese davor sechs neue Tische mit Bildschirmen, die im Regen blau
leuchten und auf denen Figuren ziehen, ohne dass jemand sie berührt. Ganz am Westende des Parks, wo das
Ufer flach wird, steht ein Wohnwagen mit Rostrand, davor ein Klappstuhl, ein Grill und ein Kurierrad,
und im Fenster glänzen Pokale, die aus Limodosen gebogen sind. Gleich daneben ist an einer kleinen
Werkstatt ein Rolltor heruntergelassen, „Albescu Bikes – geschlossen“, und eine Frau steht davor, als
warte sie darauf, dass es sich von selbst öffnet; hinter der Werkstatt duckt sich ein Schuppen mit
Vorhängeschloss. Im Osten öffnet sich das Kanalbecken: Ein
Anleger mit eisernen Pollern, ein Schild für einen Lastkahn, der gerade nicht da ist, ein kleines
Pegelhaus mit einer Messlatte im Wasser, und dahinter verschwindet der Kanal schnurgerade nach Süden
zwischen alten Fabrikmauern.

### 2.4 Kanalweg und Eisenbrücke

Der Treidelpfad war einmal für Pferde gebaut, die Kähne zogen; heute fahren hier Radfahrer, und das
Wasser liegt still wie ein Spiegel, in dem die leeren Hallen stehen. Am Pegelhaus von Riverton hängt
im Regen ein Gatter quer über dem Pfad („Hochwasser – Treidelpfad gesperrt“), und der Kanalmeister
klopft auf seine Messlatte. Hinter dem Gatter beginnt eine lange Mauer, auf die jemand Schachfiguren in
Hausgröße sprüht: einen Turm, einen Springer, halb fertig. Fabrikhöfe mit Maschendrahtzäunen, ein
Schornstein ohne Rauch, eine Bushaltestelle, an der seit Jahren kein Bus hält und an der jemand eine
Tafel mit Kreidestellungen aufgehängt hat. Krähen sitzen auf jedem Zaunpfahl.

Dann hört die Stadt auf. Weiden hängen ins Wasser, ein altes Kahnwrack liegt halb versunken, und an
einer Kreuzung zeigt ein Wegweiser nach Westen: „Lockport“. Dort führt eine Holzbrücke über einen
Seitenarm, und hinter dem Schilf sieht man ein paar Dächer und den Mast eines Lastkahns. Weiter südlich
Kohlfelder, eine Scheune mit Hühnern, ein Bauer am Zaun, Pappeln, die sich im Wind biegen. Am Horizont
steigt Rauch auf.

Wo der Kanal in einen Einschnitt im Fels hinabsinkt, spannt sich eine Brücke aus Eisen über die Tiefe:
genietete Träger, Bohlen, die unter den Schritten hohl klingen, ein Wind, der an der Jacke zerrt. Ein
Mann streicht das Geländer in Eisengrau und flucht leise, wenn der Wind die Farbe wegträgt. Von der
Mitte der Brücke sieht man das Tal: tief unten das Wasser, im Süden die Schornsteine von Ironwood, und
dazwischen ein Pfad, der sich in Kehren den Hang hinunterschlängelt.

### 2.5 Lockport

Lockport ist so klein, dass man es in einem Atemzug umrunden könnte, und so still, dass man die
Schleusentore knarren hört. Neun Häuser sitzen um ein Hafenbecken, Wäsche flattert an Leinen über den
Gärten, und im Herbstnebel kommen Möwen vom Fluss herauf und streiten sich auf den Pollern. Am Nordufer
steht das Haus der Schleusenwärterin mit einer Glocke am Giebel; sie läutet, wenn ein Kahn kommt, und
das ist selten genug, dass das ganze Dorf aus den Fenstern schaut. Ein Junge sitzt am Ufer und angelt,
aber an seinem Haken hängen Flaschen statt Fische. Auf der anderen Seite der Schleuse liegt am Kai ein
breiter Lastkahn mit dem Namen „Ashford Belle“ am Bug, unter einer Plane, als schlafe er. Daneben das
Gasthaus „Zur Schleuse“, Fachwerk, ein Schild mit einem Kegel, und von drinnen hört man es poltern: Auf
der Kegelbahn wird gespielt, auch mittags. Auf dem Dorfplatz steht eine Linde mit einer Bank, und die
alte Schwengelpumpe gibt noch Wasser, wenn man fest genug pumpt.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

Figuren, kleine Aufgaben und Funde aus `14_Akt2_Leben_teil1.md` kommen hinzu; hier stehen die Szenen
der Story-Bibel und die Wege.

| Karte                  | Szenen               | Figuren                                                       | Auslöser und Gegenstände                                                                                                                                                                            | Belebung                                               |
| ---------------------- | -------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| zedernwald             | 26, 27               | Juno, Mrs. Fenwick; Leif Sorensen und Pfadfinder (14)         | `zurueckCedar`, `weiterBahndamm`, `tafel` (Runde `wegCedarRiverton.tafelWegweiser`), `fundPfeilspitze`, `fundHolzspringer`; `grenzstein`, Pfeile der Schnitzeljagd (14)                             | Specht, Eichhörnchen, Rehe, Libellen                   |
| bahndamm               | 27                   | Mr. Quinn (`schaffner`), Juno; Gwen Tolliver (14)             | `zurueckZedernwald`, `weiterRiverton`, `fundFahrkarte`; `signal`, `durchlass` (S14), `aussichtFluss`, `plakatPerfectMove` (14)                                                                      | Güterzug, Krähen, Hase, Katze, Gärtnerin               |
| riverton.aussen        | 28, 29, 33, 37 (Weg) | Nova, Victor, Mrs. Albescu, Juno; Kameraleute; Figuren aus 14 | `bahndamm`, `kanalweg`, `bahnhofTuer`, `pavillonEingang`, `wohnwagenTuer`, `schuppenTuer`, `bildschirmtische`, `handyladen`, `fundLaeufer`; neu `busIronwood`, `anlegerSchild`, `wegweiserRiverton` | Tauben, Möwen, Pendler mit Schirmen, Ratten (Geräusch) |
| riverton.bahnhofshalle | 30, 30a, 31, 31a, 35 | Pops, Mr. Harlan, Mr. Quinn (30a), Ambrose                    | `bahnhofAusgang`, `zugCedar`, `grosseUhr` (Flashback), `zeitungsstand`, `fundZeitungsausschnitt`, `fundTaubenfeder`; Fahrplantafel, Fundbüro-Schild, Taube                                          | Reisende, Durchsagen (Klang)                           |
| riverton.pavillon      | 29, 32, 34, 36, 37   | Slick, Tamsin, Ray, Juno, Zuschauer                           | `pavillonAusgang`, `gedenktafel`, `limonadenglas`, Uhr mit Klebeband; vier Marmortische                                                                                                             | Regen aufs Dach (Klang), Zuschauer                     |
| riverton.wohnwagen     | 37                   | Slick                                                         | `wohnwagenAusgang`, `dosentrophaeen`, Kurierrad, Brett auf dem Bett                                                                                                                                 | –                                                      |
| riverton.schuppen      | 33                   | –                                                             | `schuppenAusgang`, `fahrrad`                                                                                                                                                                        | Staub (Partikel)                                       |
| kanalweg               | 40                   | Mr. Dale, Juno; Noor (14)                                     | `zurueckRiverton`, `weiterBruecke`, `tafel` (Runde `wegRivertonIronwood.tafelHaltestelle`), `fundZahnrad`; neu `lockport`, `meilenstein`, `rastKanal`, `fundKonservendose`                          | Krähen, Gänse, Radfahrer, Bisamratte                   |
| bruecke                | 40, 50 (Erinnerung)  | Ambrose, Juno; Corwin Lund (14)                               | `zurueckKanalweg`, `weiterIronwood`, `fundNietenkopf`, `zeitnotTrick`; neu `waerterhaus`, `aussichtTal`                                                                                             | Krähen, Eidechse, Wind                                 |
| lockport.aussen        | – (Nebenort, 13 §3)  | Imogen, Kapitän Ruben, Finn, Wirt Henrik (im Gasthaus)        | `kanalweg`, `gasthausTuer`, `tafelSchleuse` (S3), `kai` (Lastkahn), `glocke`, `pumpe`, Henriks Boot                                                                                                 | Möwen, Gänse, Wäsche im Wind                           |
| lockport.gasthaus      | –                    | Wirt Henrik                                                   | `gasthausAusgang`, Kegelbahn, `fundKegel`                                                                                                                                                           | Kegler (Statisten), Kegel poltern (Klang)              |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

| Element                                       | Entscheidung                                                                                                   | Grund                                                                                                                                                   |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Größen                                        | Zedernwald 140 × 30, Bahndamm 150 × 30, Riverton 72 × 56, Kanalweg 30 × 190, Brücke 30 × 160, Lockport 56 × 40 | 7a.2; heute je 28 × 20 und Riverton 32 × 24.                                                                                                            |
| Ankunft zu Fuß                                | Westrand am Bahnzaun, nicht am Bahnhof                                                                         | Wer läuft, kommt nicht aus dem Zug (Regel 5.1, wie Cedar Creek). Szene 28 („Ort: Bahnhof“) spielt auf dem Vorplatz vor dem Bahnhof.                     |
| Rückweg nach Cedar Creek                      | `zurueckCedar` führt an den Ostrand von Cedar Creek (`zedernwald`), nicht an die Bushaltestelle                | Randübergang Ost ↔ West; die Haltestelle ist die Schnellreise.                                                                                          |
| Regen                                         | bleibt als Grundwetter von Riverton in Akt 2 (Partikel, Pfützen); nach der Nadel nur noch Pfützen              | 09, 2: „Regen in Riverton“; das Ende des Regens öffnet sichtbar das Hochwassergatter (Sperre in der Welt statt Nadel als Zahl).                         |
| Bildschirmtische auf der Wiese                | bleiben, sechs Tische in zwei Reihen südwestlich vor dem Pavillon                                              | Szene 29 („auf der Wiese“), 13 §7.4 (Objektebene mit Bedingung).                                                                                        |
| Pavillon                                      | nah an der Brücke (36–45 / 43–48), Sichtachse von der Brücke                                                   | Der wichtigste Ort der Stadt soll man vom Weg aus sehen (README, Sichtachsen); kurze Wege (7a.3, Regel 6).                                              |
| Brücke mit Straßenmusiker                     | bleibt; Musiker bekommt einen Namen (Dima, 14) und sitzt unter dem ersten Bogen                                | Bibel 12 (Läufer „unter der Brücke beim Straßenmusiker“), 09, 4a.                                                                                       |
| Handyladen                                    | bleibt Kulisse, Tür zur Straße, Verkäufer Kyle als Figur davor                                                 | Bibel 10.2: kein Laden für {held}; Kyle zeigt die Menschen hinter dem Konzern (14).                                                                     |
| Bushaltestelle                                | auf dem Bahnhofsvorplatz, Bus nach Ironwood                                                                    | 09, 5.4; Schnellreise nach 13 §3 und Bibel 10.3.                                                                                                        |
| Markt                                         | neu, mit Gemüsestand (Margie Pell)                                                                             | 09, 4a: Riverton lebt von „Bahn, Hafen am Fluss, Markt“; der Markt war bisher nirgends.                                                                 |
| Hafen am Fluss                                | Lagerhäuser und Kran am Ostkai (Kulisse), Anleger am Kanalbecken                                               | 09, 4a; der Anleger ist Teil der Lastkahn-Schnellreise (13 §3).                                                                                         |
| Fahrradwerkstatt mit Schuppen                 | Werkstatt am Westteil des Parks, Schuppen dahinter mit Tür zum Hinterweg am Südrand                            | Bibel 9.2 („hinter dem Park“; Prüfbericht Akt 2, Befund 21); die Schuppentür in der Südfassade passt zur Südwand innen.                                 |
| Slicks Wohnwagen „am Fluss“                   | Westende des Parks am flachen Ufer                                                                             | Bibel 9.2; abseits, damit Szene 37 ein eigener Gang ist.                                                                                                |
| Kanal                                         | beginnt am Kanalbecken im Südosten, Treidelpfad am Westufer                                                    | Bibel 10.3; der Seitenarm nach Lockport zweigt nach Westen ab, der Pfad quert ihn auf einer festen Brücke (keine Sackgasse, Befund 1 des Prüfberichts). |
| Schleuse S3                                   | am Steg über das Untertor in Lockport, nicht auf Weg 3                                                         | 13 §3 und Befund 1: Weg 3 bleibt frei; man sieht Lockport hinter der Schleuse (Grundsatz aus 12, Abschnitt 5).                                          |
| Bushaltestelle ohne Bus                       | an einer alten Werkstraße, die an einer offenen, rostigen Drehbrücke endet                                     | erklärt, warum dort einmal ein Bus hielt (Regel 5.8).                                                                                                   |
| Eisenbrücke „über den Kanal, dann der Abhang“ | der Kanal schwenkt im Einschnitt unter dem Pfad durch; Abhang mit Serpentinen                                  | Bibel 10.3; Kurven nach README (Wegeführung).                                                                                                           |
| Brücke mit Nieten in Ironwood (Szene 50)      | bleibt bei mittel-4 (Ironwood); auf Weg 3 nur der Nietenkopf am Geländer                                       | Bibel 12 und Szene 50 („dieselben Initialen wie auf Route 3“).                                                                                          |
| Wohnwagen und Schuppen als Innenkarten        | bleiben, kleiner als 7a.2 für Wohnräume                                                                        | Bibel 10.2 („innen (klein)“); 1.7.                                                                                                                      |

### 3.3 Befunde und offene Punkte für den Haupt-Chat

1. **Weg 3 „doppelt so lang wie Route 2“** (Bibel 10.3) widerspricht der Obergrenze 400 aus 7a.2.
   Empfehlung: Bibel anpassen („gut ein Drittel länger, mit Abhang und Abstecher“); umgesetzt in den
   Maßen oben. **Haupt-Chat einverstanden (9.11.2026).**
2. **`zurueckCedar`** in `orte.json` zielt auf `cedarCreek.aussen` `bushaltestelle`; richtig ist der
   Randübergang `zedernwald` (cedar-creek.md 1.6). **Erledigt** von mittel-2 in `orte.json`.
3. **Brückenebene über dem Helden** für Dima unter der Brücke (1.3); Ausweichlösung steht dabei. **Haupt-Chat einverstanden.**
4. **Hochwassergatter**: Bedingung bleibt `nadelRiverton` (wie heute in `orte.json`), in der Welt
   erklärt: Nach dem Clubkampf hört der Regen auf, Desmond Grant öffnet das Gatter („Wasser ist runter.“).
   Szene 40 braucht den Weg erst nach Szene 38, also nach der Nadel: Die Sperre öffnet rechtzeitig. **Haupt-Chat einverstanden.**
5. **Nebenort als Ort:** `lockport` braucht in `orte.json` eine neue Art, Vorschlag `art: "nebenort"`
   (wie `weg`), Nummer 0, Staffel 1. **Vorschlag:** braucht eine Schemaänderung; eingebaut wird beim
   Kartenbau von Akt 2 (Haupt-Chat, 9.11.2026).
6. **Lastkahn-Schnellreise** braucht in Ironwood einen Anleger (mittel-4) und die Variable
   `lastkahnFrei` (gesetzt in L3). Anleger in Ironwood: `anleger` (12, 22), abgestimmt (1.8).
7. **Übergang Weg 3 ↔ Ironwood:** abgestimmt (1.8): Spalten 24–25 auf beiden Seiten, Kanal 4–9.

## 4. Bühnenbilder

Je Karte Größe, Wände, Böden, Laufwege, Zonen und Inventar. Feld = linke obere Kachel. Möbel und Bilder
nach dem Katalog beim Bau (Vorsilbe `rt` für Riverton, `w2`, `w3`, `lp`); hier nur die Beschreibung,
Karten werden noch nicht gebaut.

### 4.0a Gebaute Karten und Varianten (mittel-1, 9.11.2026)

Gebaut mit dem Kartenbauer, Szenen in `inhalte/abenteuer/szenen/riverton-*.json`, Varianten B und C in
`szenen/varianten/`, Möbel mit Vorsilbe `rv5` in `moebel/riverton.json`. Eigene Bilder (nur im privaten
Repository): `fahrrad_plane.png` (Schuppen) und `bahnhofsuhr.png` (Halle); der Katalog hat weder Fahrrad
noch Wanduhr.

- **Außen (72 × 56)**, Abweichungen von 1.3 wegen der Bildhöhen: Reihe 0 Hecke, ein Gleis in Reihe 1–2,
  Hecke am Bahnzaun Reihe 3; Bahnhof ist der Backsteinturm mit Uhr (Spalten 32–39, Reihen 3–17),
  Tür `bahnhofTuer` (36, 18); Vorplatz Reihen 18–21, Water Street Reihen 23–25 mit Gehwegen 22 und 26
  und Gehweg um die Enden (kein Wendeplatz); Häuser der Südseite Reihen 27–35 mit der Front zur
  Uferpromenade (Reihen 36–37), Markt als gepflasterter Platz; Fluss Reihen 38–44 von Rand zu Rand,
  Straßenbrücke Spalten 50–54; Uferweg Süd 45–46; Park 47–54 mit Hinterweg 53–54, Hecke Reihe 55.
  Wohnwagentür (4, 53), Schuppentür (16, 53), Pavilloneingang (41, 52). Übergänge unverändert:
  `bahndamm` Westrand Reihen 8–9, `kanalweg` Südrand Spalten 57–58.
- **Außen B:** graue Gleise, Steinpflaster auf Vorplatz und Promenade, Erde am Uferweg; Güterschuppen links,
  Stellwerk rechts vom Bahnhof, Statuenbrunnen, Bogenlaternen, Nadelbäume; Südseite mit Holzhäusern,
  Kaffeekiosk, Markthalle; großer Wohnwagen (Tür (3, 53)), Werkstatt in einer Bretterbude, Pavillon westlich
  der Bildschirmtische. **Außen C:** Brücke in der Mitte (Spalten 30–34), Bahnhofstür (30, 18), Ausleger-
  laternen, Ahorne, Eisladen, Kies auf der Promenade, gepflasterter Uferweg, Pavillon östlich der Brücke.
- **Bahnhofshalle (26 × 16):** je ein Fahrkartenschalter; Zeitungsstand mit Holzladentisch und Kasse,
  Fundbüro mit Glasvitrine. A wie 4.1 mit vier Säulen und Schließfächern; B alte Wartehalle mit dunklem
  Holzboden, Holzbänken und zwei Säulen; C mit hellen Wänden, Bänken in der Mitte und den Ständen in den
  Nordecken.
- **Pavillon (20 × 14):** Holzwände mit großen Fenstern statt offener Seiten (der Kartenbauer kennt keine
  Geländerwand). A vier Tische mit Kreuzgang; B fünf Tische; C helle Dielen, weiße Wände, fünf runde
  Tischchen mit Seitenstühlen und Teppich.
- **Wohnwagen (14 × 9):** A Bett West, Küche Ost, runder Teppich unter dem Klapptisch; B Holzwände, alte
  Dielen, Sitzecke mit zwei Sesseln, Pokale auf dem Fensterbrett; C blauer Teppichboden, Etagenbett,
  Rundtisch. Kein Kurierrad (fehlt im Katalog), dafür die Kuriertasche.
- **Schuppen (10 × 8):** A Fahrrad in der Mitte; B Rad an der Ostseite; C halb Holzlager.

### 4.1 Bahnhofshalle (`riverton.bahnhofshalle`)

**Größe:** 26 × 16 (großer Saal). Nordwand Reihen 0–2 Backstein mit Fliesensockel, Boden ab Reihe 3
Terrazzo (hell, ein Muster), Südwand Reihe 15 mit der Doppeltür bei Spalte 13 (50 %). Zwei hohe
Bogenfenster in der Nordwand; die Bahnsteigtür in der Nordwand führt zu den Gleisen (nicht begehbar,
Dialog `zugCedar`). **Stimmung:** Hall, Durchsagen, das laute Ticken der großen Uhr, nasse Mäntel.

**Laufwege:** Tür (13, 15) → Start (13, 14) → gerade nach oben zur Uhr und zur Bahnsteigtür; links zum
Zeitungsstand von Pops und zum Fahrkartenschalter; rechts zu den Wartebänken und zur Bank des
Uhrmachers. Reihe 3 bleibt frei vor der Nordwand.

| Zone      | Gegenstand                                  | Feld                       | Ausrichtung          | Material, Stil, Zustand           | Zweck                                                               |
| --------- | ------------------------------------------- | -------------------------- | -------------------- | --------------------------------- | ------------------------------------------------------------------- |
| Nordwand  | große Bahnhofsuhr                           | Wandfläche (12, 0), 2 × 2  | –                    | Eisen und Glas, klassisch, alt    | `grosseUhr` (13, 3), Flashback (Szene 35)                           |
| Nordwand  | Bahnsteigtür mit Schild „Zu den Gleisen“    | Wandfläche (19, 1)         | –                    | Holz und Glas                     | `zugCedar` (19, 3), Schnellreise                                    |
| Nordwand  | zwei Bogenfenster                           | Wandfläche (5, 1), (22, 1) | –                    | Holz, Glas                        | Licht                                                               |
| Nordwand  | Fahrplantafel mit Klappanzeige              | Wandfläche (8, 1)          | –                    | Metall                            | `fahrplantafel` (8, 3), Ansehen                                     |
| unter Uhr | Holzbank mit Lehne (Mr. Harlan)             | (11, 4), 4 × 1             | Sitz nach unten      | Holz dunkel, klassisch, gebraucht | Mr. Harlan (12, 5); `fundTaubenfeder` auf der Bank (14, 4)          |
| Westseite | Zeitungsstand (Kiosk im Raum) mit Ständern  | (2, 5), 4 × 3              | Theke nach rechts    | Holz und Blech, gebraucht         | Laden `riverton.zeitungsstand`, Pops (6, 6); `zeitungsstand` (6, 7) |
| Westseite | Zeitungsständer hinter dem Stand            | (1, 4)                     | –                    | Draht                             | dahinter `fundZeitungsausschnitt` (1, 5), versteckt                 |
| Westseite | Fahrkartenschalter mit Gitterfenster        | (2, 10), 4 × 2             | Schalter nach rechts | Holz, Messing, alt                | Kulisse; Schild „Fahrkarten auch am Zeitungsstand“                  |
| Ostseite  | drei Wartebänke Rücken an Rücken            | (17, 7), (17, 9), (17, 11) | quer                 | Holz, gleiche Bauart              | Warten; Reisende (Statisten)                                        |
| Ecke SO   | Fundbüro-Schalter mit Schild                | (22, 11), 3 × 2            | –                    | Holz                              | `fundbuero` (22, 13), Ansehen                                       |
| Ecke NO   | Gepäckwagen mit Koffern                     | (23, 4)                    | –                    | Metall, Leder                     | Spuren von Leben                                                    |
| Mitte     | Taube, die sich hereinverirrt hat           | (15, 6)                    | –                    | Tier, `sitzen`                    | „Gurr.“                                                             |
| Ecken     | Pflanzen in Kübeln, Mülleimer an den Bänken | (1, 13), (24, 8); (16, 8)  | –                    | Pflanze, Metall                   | Regel 4.4                                                           |

Belebung: zwei Reisende mit Koffer gehen zwischen Tür und Bahnsteigtür. Platzhalter: Wandfläche (16, 1)
für das Meisterschaftsplakat (Akt 4); Bank (17, 11) für Slick (Akt 3).

### 4.2 Parkpavillon (`riverton.pavillon`)

**Größe:** 20 × 14 (Clubraum). Ein offener Pavillon: Statt einer Nordwand ein Holzgeländer zwischen
Säulen (Reihen 0–2: Dachunterseite und Geländer, dahinter Regen und Fluss), Boden Holzdielen, Südseite
Reihe 13 mit dem Eingang (Treppe) bei Spalte 10 (50 %). Seiten West und Ost Geländer zwischen Säulen.
**Stimmung:** Regen trommelt aufs Dach, Uhren klopfen, Limonade.

**Laufwege:** Eingang (10, 13) → Start (10, 12) → in der Mitte frei nach oben; die vier Marmortische
stehen in zwei Reihen mit einem Kreuzgang dazwischen (Spalte 9–10 und Reihe 7 frei).

| Zone           | Gegenstand                                       | Feld                                                  | Ausrichtung | Material, Stil, Zustand | Zweck                                                |
| -------------- | ------------------------------------------------ | ----------------------------------------------------- | ----------- | ----------------------- | ---------------------------------------------------- |
| Mitte oben     | zwei Marmortische mit Brett und Uhr              | (4, 4), (13, 4), je 3 × 2                             | –           | Marmor, alt, gebraucht  | Slick (5, 3), Ray (14, 3); Clubkampf am Tisch (4, 4) |
| Mitte unten    | zwei Marmortische mit Brett und Uhr              | (4, 8), (13, 8), je 3 × 2                             | –           | Marmor, alt             | Tamsin (5, 10); Aufgabenreihen                       |
| an den Tischen | je zwei gleiche Hocker oben und unten            | Reihen 3, 6, 7, 10 an den Tischen                     | zum Tisch   | Metall, Park            | Spieler                                              |
| Westgeländer   | Gedenktafel für Mr. Odum an einer Säule          | (0, 6)                                                | –           | Messing                 | `gedenktafel` (1, 6)                                 |
| Ostgeländer    | Klapptisch mit Limonadenkrug und Glas mit Münzen | (18, 5)                                               | –           | Holz, Glas              | `limonadenglas` (17, 5)                              |
| Ostgeländer    | Schachuhr mit Klebeband                          | (18, 9)                                               | –           | Holz, alt               | `uhrKlebeband` (17, 9), Ansehen                      |
| Ecke SW        | Kiste mit Ersatzfiguren und Kuriertasche         | (1, 11)                                               | –           | Holz, Leder             | Slick packt hier in Szene 37                         |
| Eingang        | Schirmständer mit nassen Schirmen                | (8, 12)                                               | –           | Metall                  | Spuren von Leben                                     |
| Säulen         | acht Säulen am Rand                              | (0, 2), (6, 2), (13, 2), (19, 2), (0, 12), (19, 12) … | –           | Holz weiß gestrichen    | Tragwerk                                             |

Belebung: zwei Zuschauer unter Schirmen am Westgeländer (Szene 36 mehr). Platzhalter: Objektebene mit
Bildschirmtischen auf den vier Marmortischen (nach Szene 37).

### 4.3 Slicks Wohnwagen (`riverton.wohnwagen`)

**Größe:** 14 × 9. Nordwand Reihen 0–1 (helles Kunststoffpaneel, ein Fenster), Boden Linoleum, Südwand
Reihe 8 mit der Tür bei Spalte 7 (50 %). Eng, gemütlich, alles hat zwei Zwecke.

**Laufwege:** Tür (7, 8) → Start (7, 7) → links zum Bett mit Brett, rechts zur Küchenzeile und zum
Kurierrad an der Wand.

| Zone     | Gegenstand                                        | Feld                   | Ausrichtung       | Material, Stil, Zustand | Zweck                                     |
| -------- | ------------------------------------------------- | ---------------------- | ----------------- | ----------------------- | ----------------------------------------- |
| Westende | Bett quer mit Decke, darauf ein Brett mit Figuren | (0, 2), 3 × 4          | Kopf links        | Stoff, gebraucht        | Brett auf dem Bett (`brettBett`, Ansehen) |
| Nordwand | Regal mit Dosentrophäen                           | (4, 0), 4 × 2          | Vorderseite unten | Blech, selbst gebogen   | `dosentrophaeen` (5, 2)                   |
| Nordwand | Fenster mit Blick auf den Fluss                   | Wandfläche (9, 0)      | –                 | Kunststoff              | Licht                                     |
| Ostende  | Küchenzeile mit Kochplatte, Kessel                | (11, 1), 3 × 2         | Vorderseite links | Kunststoff, gebraucht   | Leben                                     |
| Ostwand  | Kurierrad an der Wand                             | (13, 4)                | –                 | Metall, gebraucht       | `kurierrad` (12, 4), Ansehen              |
| Mitte    | Klapptisch mit zwei Hockern                       | (6, 3), (5, 4), (8, 4) | –                 | Holz                    | Slick sitzt hier in Szene 37 (6, 4)       |
| Ecke SW  | Kuriertasche, Stapel Zeitungen                    | (1, 6)                 | –                 | Leder, Papier           | Spuren von Leben                          |

### 4.4 Schuppen hinter der Werkstatt (`riverton.schuppen`)

**Größe:** 10 × 8. Nordwand Reihen 0–1 Holzbretter, Boden Beton mit Staub, Südwand Reihe 7 mit der Tür bei
Spalte 5 (50 %). Staub in der Luft (Partikel), Spinnweben in den Ecken.

| Zone     | Gegenstand                               | Feld              | Ausrichtung        | Material, Stil, Zustand | Zweck                            |
| -------- | ---------------------------------------- | ----------------- | ------------------ | ----------------------- | -------------------------------- |
| Mitte    | grünes Fahrrad unter einer Plane         | (4, 3), 2 × 2     | Lenker nach rechts | Stoff über Metall, alt  | `fahrrad` (5, 5), Szene 33       |
| Nordwand | Werkzeugwand mit Schlüsseln und Speichen | Wandfläche (2, 0) | –                  | Holz und Metall         | Ansehen (`werkzeugwand`, (2, 2)) |
| Nordwand | Werkbank mit Schraubstock                | (6, 1), 3 × 1     | Vorderseite unten  | Holz, gebraucht         | Spuren von Leben                 |
| Westwand | zwei alte Felgen, Reifenstapel           | (0, 3), (0, 5)    | –                  | Gummi, Metall           | Lager                            |
| Ecke SO  | Kanister und Ölkanne                     | (8, 5)            | –                  | Metall                  | Lager                            |

### 4.5 Riverton außen (`riverton.aussen`, Bühnenbild)

**Größe** 72 × 56, Norden oben. **Boden:** Pflaster (Vorplatz, Markt, Kai), Asphalt (Water Street,
Brücke), Gehwege aus Platten mit Bordstein, Kies (Parkwege), Gras mit Varianten (Park), Erde (Fußweg
am Bahnzaun, Treidelpfad), Wasser mit Ufer und Kaimauer (Fluss, Becken, Kanal), Schotter mit Gleisen.
**Rand:** Gleise im Norden, Gebüsch und Gleisfeld im Westen, Lagerhäuser im Osten, Hecke und Bäume im
Süden; Fluss und Kanal reichen bis zum Rand. **Wetter:** Regen (Partikel) bis `nadelRiverton`, danach
Pfützen; Spiegelungen in den Pfützen als Kachelvariante.

**Wege:** wie 1.3; Breiten: Fußweg 2, Water Street 2 mit Gehwegen je 1, Brückenrampe 4 (Fahrbahn 2,
Gehwege je 1), Parkwege 2, Treidelpfad 2.

| Abschnitt | Inventar (Feld = linke obere Kachel)                                                                                                                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1        | Zaun am Gleisfeld Reihe 5–7 (Unterkante), Fußweg 0–17 / 8–9, Gebüsch, Löwenzahn, zwei Laternen am Weg (6, 7), (14, 7)                                                                                                                                                   |
| B1        | Stellwerk (21, 6), Bahnhof (30, 5) mit Uhrturm, Vordach über der Tür (35–37, 12), Fahrradständer (28, 13)                                                                                                                                                               |
| C1        | Güterschuppen (45, 6), Laderampe (45–60, 13) mit drei Frachtkisten (47, 13), (49, 13), (55, 13) und Sackkarre (52, 13); Gabelstapler-Fahrer (Statist)                                                                                                                   |
| D1        | Wasserturm (64, 5), Tauben auf dem Tank (Tiere, `fliegen`)                                                                                                                                                                                                              |
| A2        | Reihenhäuser (1, 23), (4, 23) mit Treppen; Handyladen (9, 23) mit Leuchtschild und Banner; Kyle (13, 22) auf dem Gehweg; Laterne (8, 22)                                                                                                                                |
| B2        | Vorplatz: Brunnen (26, 15), Wegweiser (20, 18) mit drei Armen (Park ↘, Markt ↓, Kanal →); Markt: vier Stände (19, 24), (24, 24), (19, 27), (24, 27) mit Markisen; Margie (21, 26); Tauben auf dem Pflaster                                                              |
| C2        | Bäckerei (33, 23) mit Markise; Café (42, 23) mit zwei Tischen (43, 22), (46, 22); Bushaltestelle (46, 14) mit Wartehäuschen, Schild (49, 18) `busIronwood`; Banner an der Brückenrampe (51, 22)                                                                         |
| D2        | Lagerhäuser (55, 23), Wendeplatz (62–68, 19–22), Laternen; Möwen                                                                                                                                                                                                        |
| A3        | Uferpromenade, Bank zum Fluss (8, 31), Mülleimer (10, 31); Pip und zwei Pfützen (5, 30), (12, 30) (Kachelvariante Pfütze)                                                                                                                                               |
| B3        | Hof der Bäckerei (33–40, 27–29) mit Mehlsäcken und Fahrradständer; Angler auf der Ufermauer (28, 31, Statist)                                                                                                                                                           |
| C3        | Kaitreppe (47–49, 31–32), Kai unter dem Bogen (50–53, 32) mit Dima (51, 32), `fundLaeufer` (52, 32) im Schatten; Brücke 50–53 / 32–41 mit Laternen (50, 33), (53, 33), (50, 40), (53, 40)                                                                               |
| D3        | Kran (62, 31), Kaimauer, zwei Poller; Möwen mit Pommes                                                                                                                                                                                                                  |
| A4        | Wohnwagen (3, 44), Klappstuhl (5, 48), Grill (8, 48), Kurierrad (10, 46); Werkstatt Albescu (12, 45) mit Rolltor (15–16, 45), Mrs. Albescu (14, 43); Hofzaun 12–19 / 49–50; Schuppen (14, 51) mit Tür (16, 53) und Vorhängeschloss; Hinterweg 0–34 / 54–55; Uferweg Süd |
| B4        | Bildschirmtische (22, 50), (26, 50), (30, 50), (22, 53), (26, 53), (30, 53) als Objektebene `bildschirmtische` (Auslöser (27, 49)); Brunnen (30, 45); Bänke an den Parkwegen; Baumgruppen                                                                               |
| C4        | Pavillon (36, 43), Treppe (40, 48), Platz davor (36–45, 49–50), Parktor (49, 42) mit Plakat; zwei Pfützen auf dem Weg                                                                                                                                                   |
| D4        | Anleger (56, 42) mit Pollern und `anlegerSchild` (56, 43); Pegelhaus (52, 45) mit Desmond Grant (54, 49); Hochwassergatter (57–58, 50) als Objekt mit Bedingung; Kanal 60–64 / 47–55; Fabrikmauer (66, 47)                                                              |

Kleinflora: Blumenkästen an den Reihenhäusern, Beete am Vorplatz parallel zum Weg (nicht auf dem Weg),
Herbstlaub in Gruppen auf den Parkwegen. Belebung: Pendler mit Schirmen (Vorplatz ↔ Water Street),
Kinder springen in Pfützen (A3), Tauben, Möwen, Ratten (nur Geräusch am Gleisfeld).

### 4.6 Zedernwald (`wegCedarRiverton.zedernwald`, Bühnenbild)

**Größe** 140 × 30. **Boden** Waldboden mit Moos und Nadeln, Weg aus Erde (zwei Felder), Bach als
Wasser mit Ufer und Steinen. **Rand** dichter Wald im Norden und Süden (zwei Reihen Zedern lückenlos).

| Abschnitt | Inventar                                                                                                                         |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Z1        | Grenzstein (6, 7) am Weg, Zedern dicht, Eichhörnchen                                                                             |
| Z2        | Bach tritt bei (18–20, 0) ein; Leif Sorensen (22, 10), drei Pfadfinderkinder (24, 11), (25, 10), (26, 11) als Statisten          |
| Z3        | tote Zeder (34, 9) mit Specht, Kreidepfeil 1 (36, 11) am Stamm (`pfeil1`)                                                        |
| Z4        | Baumstumpf (47, 11) mit Mrs. Fenwick (47, 10)                                                                                    |
| Z5        | Wegweiser mit Tafel (56, 11), Abzweig nach Norden 57–58 / 6–10, Trittsteine (58, 5), (60, 5), Farn mit `fundPfeilspitze` (61, 4) |
| Z6        | Holzsteg 72–75 / 12–13 mit Geländer; angenagte Stämme (78, 9), (80, 16)                                                          |
| Z7        | Pilzring (88, 10), Kreidepfeil 2 (92, 8) (`pfeil2`)                                                                              |
| Z8        | Lichtung 98–110 / 3–9 mit Gras und Blumen; Abzweig nach Süden 104–105 / 8–13; hohler Stamm (104, 14) mit `fundHolzspringer`      |
| Z9        | Birken; Kreidepfeil 3 (116, 9) (`pfeil3`); Pfadfinderlager mit Zelt (120, 4) und Fahne (123, 4)                                  |
| Z10       | Birken licht, Blick nach Osten; Belebung Rehe am Rand                                                                            |

Belebung: Specht, Eichhörnchen, Rehe (Z8), Libellen am Bach. Kleinflora: Farne, Pilze, Steine, Moospolster
in Gruppen von ein bis drei, nie auf dem Weg.

### 4.7 Bahndamm (`wegCedarRiverton.bahndamm`, Bühnenbild)

**Größe** 150 × 30. **Boden** Gras, Weg Erde, Damm aus Schotter mit Gleis (Reihen 3–5), Böschung als
Grasböschung (Reihen 2 und 6), Fluss mit Ufer ab Spalte 60 im Süden. **Rand** Damm im Norden
(geschlossen), Wiesen und Fluss im Süden.

| Abschnitt | Inventar                                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1        | Birken, Hase                                                                                                                                                        |
| B2        | Gwen Tolliver läuft 18–55 / 7 (Laufweg), Werkzeugkiste (20, 7)                                                                                                      |
| B3        | Signalmast (38, 6) mit Licht (Kachelanimation), Krähen auf dem Draht (Tiere)                                                                                        |
| B4        | Stufen 50–51 / 6–7 zum Bahnsteigrest 46–57 / 6, Bank (52, 6), Schild „Cedar Junction“ (48, 6); Mr. Quinn (53, 7), Juno (55, 8); `fundFahrkarte` (57, 7) im Schotter |
| B5        | Durchlass 66–67 / 2–6 (dunkel, Objekt `durchlass` mit Bedingung `hatLaterne`), dahinter Tümpel 64–70 / 0–1; Thermoskanne im Durchlass (66, 3)                       |
| B6        | Holzbank (80, 13) zum Fluss, Auslöser `aussichtFluss` (80, 14)                                                                                                      |
| B7        | Kleingärten 90–104 / 13–20 mit Zäunen, Beeten, Gartenhaus (98, 14); Gärtnerin (95, 16); Gartenpforte (92, 12) mit Kürbissen                                         |
| B8        | Abstellgleis 105–119 / 1; Güterwaggon (110, 0) mit Katze                                                                                                            |
| B9        | Lagerzaun 120–134 / 11, Plakatwand (126, 10) `plakatPerfectMove`                                                                                                    |
| B10       | freie Sicht nach Osten; Güterzug als Belebung auf dem Gleis                                                                                                         |

### 4.8 Kanalweg (`wegRivertonIronwood.kanalweg`, Bühnenbild)

**Größe** 30 × 190. **Boden** Treidelpfad aus Erde mit Kies (zwei Felder), Kanal mit gemauerter
Uferkante, Fabrikhöfe aus Beton, Felder aus Erde, Gras mit Varianten. **Rand** Fabrikmauern und Felder
im Westen, Böschung im Osten; Kanal bis Nord- und Südrand, Seitenarm bis zum Westrand.

| Abschnitt | Inventar                                                                                                                                                                                                |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| K1        | Poller (19, 4) mit Möwe, Meilenstein (16, 9) `meilenstein`                                                                                                                                              |
| K2        | Ziegelmauer 2–14 / 15–29 mit Graffiti (Objektebene in zwei Stufen), Noor (15, 22), Leiter und Sprühdosen (14, 23)                                                                                       |
| K3        | Tor (14, 36), Fabrikhof 4–13 / 32–43, Halle (Kulisse) 0–9 / 30–38, Maschendrahtzaun 4–13 / 43, `fundZahnrad` (9, 43)                                                                                    |
| K4        | Werkstraße 0–16 / 50–51, Haltestellenschild mit Tafel (15, 49) `tafel`, Drehbrücke 20–24 / 50–51 (offen, Kulisse)                                                                                       |
| K5        | Schornstein (4, 62), Brombeeren (14, 66), Beginn der Kurve                                                                                                                                              |
| K6        | Weiden am Ostufer, Kahnwrack (15, 82) im Kanal                                                                                                                                                          |
| K7        | Wegweiser (9, 96), Uferpfad 0–10 / 97–98, Treidelbrücke 10–13 / 100–104, Seitenarm 0–13 / 101–103                                                                                                       |
| K8        | Schilf am Ufer, Rastbank (9, 112) `rastKanal`, Libellen                                                                                                                                                 |
| K9        | Feld 0–9 / 120–134 (Kohl und Kürbis bis zum Rand), Feldzaun Spalte 10, Mr. Dale (10, 128)                                                                                                               |
| K10       | Scheune (2, 136), Hühner (Tiere), Leiterwagen (8, 141)                                                                                                                                                  |
| K11       | Abzweig 3 vom Pfad (17–18) nach Osten an den Kanal: Rastanleger 19–21 / 156 (Holzsteg auf der Uferkante), Bank (19, 155) zum Wasser, Konservendose (21, 157) `fundKonservendose` am Anleger (Befund 11) |
| K12       | Pappeln am Pfad in gleichem Abstand (Allee), Gänse auf dem Kanal                                                                                                                                        |
| K13       | Strommast (5, 182), freie Sicht nach Süden                                                                                                                                                              |

### 4.9 Eisenbrücke und Abhang (`wegRivertonIronwood.bruecke`, Bühnenbild)

**Größe** 30 × 160. **Boden** Erde und Kies, Brücke aus Bohlen mit Eisengeländer, Felswände im
Einschnitt, Hang aus Gras und Geröll. **Rand** Kanal und Felswand im Westen, Hang im Osten.

| Abschnitt | Inventar                                                                                                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR1       | Ginster in Gruppen, Kanal auf dem Damm                                                                                                                                                                                |
| BR2       | Wärterhaus (22, 18) mit vernagelter Tür, Laterne (21, 22), `waerterhaus` (20, 23)                                                                                                                                     |
| BR3       | Felswände 0–14 / 40–55, Kanal im Einschnitt                                                                                                                                                                           |
| BR4       | Brückenkopf aus Stein 15–20 / 52–55; Corwin Lund (21, 50), Farbeimer (22, 51), Leiter                                                                                                                                 |
| BR5       | Eisenbrücke 15–20 / 56–72 (Pfad 17–18), Geländer beidseitig; `zeitnotTrick` (17, 64); `fundNietenkopf` (20, 62); `aussichtTal` (16, 68)                                                                               |
| BR6       | Bank (24, 80) mit Blick nach Süden, Krähen auf einem alten Träger (26, 84)                                                                                                                                            |
| BR7–BR10  | Serpentinen östlich des Kanals: Kehren bei Reihe 92 (Spalten 12–27), 108 (12–26), 124 (13–27), 140 (14–26); Stützmauern, Geröll, Birken, Wegkreuz (24, 126), Graffiti (15, 144); Kanal 4–9 / 72–159 mit Ufer 3 und 10 |
| BR11      | Pfad mündet am Südrand (24–25, 159) in die Treppe nach Ironwood                                                                                                                                                       |

### 4.10 Lockport außen (`lockport.aussen`, Bühnenbild)

**Größe** 56 × 40. **Boden** Erde (Uferstraße, Gassen), Pflaster (Kai, Dorfplatz), Gras mit Varianten,
Wasser mit Ufer (Becken, Seitenarm), Schleuse aus Stein mit Holztoren. **Rand** Gärten und Hecken im
Norden, Wiesen und Pappeln im Süden und Westen (das Becken endet an einer Kaimauer bei Spalte 1), Seitenarm
bis zum Ostrand.

| Abschnitt | Inventar                                                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1        | Haus (2, 2) mit Garten, Wäscheleine 2–8 / 9; Möwen                                                                                                           |
| B1        | Häuser (10, 2), (18, 2), Finn (18, 12) am Ufer mit Angel, Eimer mit Flaschen (19, 11)                                                                        |
| C1        | Tafel S3 (33, 11) `tafelSchleuse`; Steg auf dem Untertor (30, 12–18) als Objekt mit Bedingung `lockportSteg`; Kurbeln auf der Kammermauer (31, 13), (36, 13) |
| D1        | Schleusenwärterhaus (38, 4) mit Glocke (41, 4) `glocke`; Imogen (42, 10); Seitenarm 38–55 / 14–16 mit Schilf                                                 |
| A2        | Bootsschuppen (2, 22) mit Slipanlage; Henriks Ruderboot (6, 19) an vier Tauen (`henriksBoot`)                                                                |
| B2        | Lastkahn 8–20 / 17–19 („Ashford Belle“, Plane bis L3); Kapitän Ruben (14, 20) `kai`; Kreidetafel am Kai (11, 20) für L1; Gasthaus (14, 23) mit Tür (21, 31)  |
| C2        | Dorfplatz: Linde (24, 31), Bank (23, 33), Pumpe (30, 30) `pumpe`; Häuser (30, 22)                                                                            |
| D2        | Häuser (38, 22), (46, 28) mit Kürbissen vor den Türen; Gänse                                                                                                 |

### 4.11 Gasthaus „Zur Schleuse“ (`lockport.gasthaus`)

**Größe:** 20 × 13 (öffentlicher Raum). Nordwand Reihen 0–2 Fachwerk (helle Gefache, dunkle Balken),
Boden Holzdielen, Südwand Reihe 12 mit der Tür bei Spalte 14 (70 %, passend zur Fassade). **Stimmung:** Kegel poltern,
Bratkartoffeln, Lachen.

**Laufwege:** Tür (14, 12) → Start (14, 11) → nach oben zur Kegelbahn; rechts zum Tresen mit Henrik;
links zu den Tischen.

| Zone      | Gegenstand                                 | Feld                   | Ausrichtung       | Material, Stil, Zustand | Zweck                                           |
| --------- | ------------------------------------------ | ---------------------- | ----------------- | ----------------------- | ----------------------------------------------- |
| Nordwand  | Kegelbahn, Anlauf links, neun Kegel rechts | (1, 2), 15 × 2         | läuft nach rechts | Holz hell, gebraucht    | `kegelbahn` (8, 4), Ansehen; Kegler (Statisten) |
| Nordwand  | Kegel mit Kerbe im Ständer am Bahnende     | (16, 2)                | –                 | Holz, alt               | `fundKegel` (16, 4)                             |
| Ostseite  | Tresen mit Zapfhahn und Gläsern            | (16, 6), 3 × 3         | Vorderseite links | Holz dunkel, rustikal   | Wirt Henrik (15, 7)                             |
| Ostwand   | Regal mit Gummistiefeln und Laternen       | (19, 5)                | –                 | Holz                    | Henriks Stiefel (L2)                            |
| Westseite | drei Tische mit je vier gleichen Stühlen   | (2, 6), (6, 6), (2, 9) | –                 | Holz, rustikal          | Gäste (Statisten)                               |
| Nordwand  | Foto der Schleuse im Hochwasser            | Wandfläche (17, 1)     | –                 | gerahmt                 | `fotoHochwasser` (17, 3), Ansehen               |
| Westwand  | Tafel „Kegelkönig des Monats“              | Wandfläche (0, 4)      | –                 | Kreide                  | Ansehen, etwas Komisches (Regel 3.2)            |
| Ecken     | Kachelofen, Pflanze                        | (1, 11), (18, 10)      | –                 | Keramik, Pflanze        | Wärme, Regel 4.4                                |

Drei Dinge zum Ansehen nach 09, 3.2: Foto der Schleuse (Foto), Kegel mit Kerbe (Geschichte), Tafel
„Kegelkönig“ (Komisches); der Schachbezug kommt über die Kegelbahn („neun Kegel, und einer hält alle
anderen“, Henrik zu L2).
