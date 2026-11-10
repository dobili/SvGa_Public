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

**Gebaut (Runde 5, mittel-3):** feste Geometrie in drei Varianten: Kanal 20–24 bis Reihe 65, in der
Schlucht als Band 4–24 / 61–65 nach Westen, dann 4–9 bis zum Südrand; Pfad 17–18 von Norden, Fußbrücke
17–18 / 61–65 über die Schlucht, danach fünf Serpentinen (Reihen 92–93, 108–109, 124–125, 140–141,
150–151) mit Holzgeländer unter jedem Bein, Ausgang 24–25 am Südrand. Auslöser `zurueckKanalweg`
(17–18, 0), `weiterIronwood` (24–25, 159), `fundNietenkopf` (18, 62) und `zeitnotTrick` (17, 64) auf
der Brücke, Start (17, 1); `waerterhaus` und `aussichtTal` kommen in Runde 6. A Ginster und rotes
Wärterhäuschen; B Nadelbäume, Bretterschuppen, viel Geröll; C Ginster, Wildblumen, grünes Häuschen,
Birkenhain, zwei Bänke, lange Graffiti-Mauer.

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
(Spalten 3–55), Kammer 30–37 / 14–16 mit Steinkante, Untertor 30–31 und Obertor 36–37 als Stemmtore mit Schwenkbalken (über das Untertor geht man zum Kai), Kai 1–40 / 20–21, Dorfplatz 2–38 / 32–35,
Gasthaus 14–23 / 23–31 (Tür (21, 31), Auslöser `gasthausTuer` (21, 32)), Wärterhaus (38, 0),
Tafel (34, 8), Ankunft (54, 10). A: großes Becken 2–29 / 13–19, drei Häuser im Norden; B: kleineres
Becken 6–29 / 14–19, flache Häuser und ein blaues Häuschen statt Fachwerk, Brunnen statt Linde; C: Beete, drei Wäscheleinen, drei Boote.

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

8. **Ereignisort Weg 3 „Die Brückenbauern“** (Dokument 15, 2.3; Runde 7, mittel-2): am Südufer gleich
   östlich der Kanalbrücke (`bruecke`, Spalten 19–28, Reihen 66–70, in A, B und C gleich). Drei Klapptische
   mit Brett (`ri8Klapptisch`), davor Platz für drei bis sechs Figuren; Kreidespringer am Brückenfuß
   (`ri8Kreidespringer`, 19, 66), Finkenzeichen aus Blech westlich des Brückenfußes (`ri8Finkenzeichen`,
   16, 66). Die Drohne mit dem Logo von Perfect Move fliegt als Belebung `drohne` über dem Wasser
   (Reihe 63); ihr Bogen kommt aus `pipeline/abenteuer/belebungsbilder.py`. „Unter der Brücke“ geht in
   der Draufsicht nicht; das Ufer neben der Brücke steht dafür.

   **Felder für Runde 6 (begehbar, A, B und C gleich):**

   | Karte     | Auslöser                 | Feld     | Hinweis                                |
   | --------- | ------------------------ | -------- | -------------------------------------- |
   | `bruecke` | `ereignisBrueckenbauern` | (23, 69) | vor dem mittleren Klapptisch (Dime)    |
   | `bruecke` | `kreide1`                | (19, 67) | unter dem Kreidespringer am Brückenfuß |
   | `bruecke` | `spurPM1`                | (25, 66) | Ufer, Blick auf die Drohne             |
   | `bruecke` | `seite07`                | (27, 66) | Kanalufer                              |
   | `bruecke` | `finchLaeuferA`          | (16, 67) | unter dem Finkenzeichen am Brückenfuß  |

   **Umgesetzt in Runde 6 (mittel-2):** Auslöser in A, B und C (Felder wie oben; `meilenstein` in A
   (15, 9), `fundKonservendose` (19, 157), `waerterhaus` (19, 23), `rastKanal` in C (9, 113)), Dialoge
   in `weg-riverton-ironwood.ink`: `meilenstein`, `rast_kanal`, `fund_konservendose`, `waerterhaus`,
   `aussicht_tal`, `kreide1` (Rätsel: Grundreihenmatt, Losungswort „Td8“),
   `kreidespringer_geloest`, `brueckenbauern` (Dime, Figur bei (22, 70); Blitz 3 + 2, Begegnung
   `wegRivertonIronwood.dime`), `spur_pm1` (Spur P1), `seite07`, `finch_laeufer_a`. Quest
   `wegRivertonIronwood.brueckenbauern` (`klein`, Lohn 20 Münzen nach der Partie). Funde
   `konservendose`, `kreide1`, `spurPM1`, `seite07`, `finchLaeuferA`. Das Feld des Läufers im
   Meisterproblem fehlt noch (`feld` in funde.json, Haupt-Chat).

   **Leben (Regel 10.53):** Kanalweg: Angler, Radfahrerin, Kind mit der Entenfamilie (Dokument 16,
   5.3; Ambrose antwortet), Landvermesser; Tiere Enten, Gänse, Ratten, Krähen, Reiher, Hase. Brücke:
   Brückenwärter, Kiebitz an den Tischen (Washington Square Park, 16 Nr. 36), Vogelbeobachterin
   (Reiher und Fesselung), Joggerin; Tiere Krähen, Möwe, Eidechse, Reiher, Enten, Hase, dazu die Drohne.

### 3.4 Runde 8 (10.11.2026, mittel-3): Notizen des Autors, Antworten, Zustände

**Umgesetzt (Hauptfassungen; B und C bleiben liegen):**

- `riverton.aussen` (A): Bäckerei als ganzes Haus mit Ziegeldach statt flacher Fassade
  (`rv8Baeckerei`, eigenes Bild aus Dach und Ladengeschoss); Wege zur Tür für Stadthaus, Stellwerk,
  Wohnhaus und Pegelhaus, der Güterschuppen steht nicht mehr auf dem Pflaster (10.58); Sandwege im
  Park sind Erdwege mit Rand; Stände mit Obst- und Gemüsekörben, Obstkarren mit Ware, Pommeskarren,
  an jedem jemand (10.59); Bildschirmtische als weiße Tische, deren Platte ein Bildschirm mit Schachbrett ist (10.60; seit Runde 9 eigenes Bild `rv9Bildschirmtisch`);
  Laternen in festen Abständen; Wasserturm mit Trampelpfad. Tiere im Wasser: nur die Enten
  (`schwimmen`), Möwen fliegen über der Promenade.
- `riverton.bahnhofshalle` (A): echter Fahrkartenschalter (Tresen mit Schalterfenstern) statt Holztisch
  mit Kasse und abgeschnittenem Ticket-Bild; Getränke- und Kaffeeautomat nebeneinander; Wasserspender
  neben der Sitzreihe; Gepäck neben den Bänken; Pflanzen symmetrisch an den Säulen; Taube bleibt.
- `riverton.pavillon` (A): 20 × 17 (Clubhaus mit langer Geschichte, 10.56); vier lange rechteckige
  Tische mit je zwei Brettern nebeneinander; in der Mitte ein Bodenschachbrett aus hellen und dunklen
  Fliesen (das Wahrzeichen des Clubs), Bank davor.
- `riverton.wohnwagen` (A): 17 × 8 nach dem Grundriss eines Reisewohnwagens: Bett im Heck (links),
  Nasszelle mit Mini-Toilette und Waschbecken, Küchenzeile mit Spüle, Herd und Kühlschrank gegenüber
  der Tür, Sitzecke mit Klapptisch im Bug (rechts), Regal mit den Dosentrophäen.
- `riverton.schuppen` (C ist jetzt Hauptfassung): keine Notiz; Kennzeichen `variante` entfernt, damit
  das Spiel das Hintergrundbild bekommt. Größe 10 × 8 passt zum kleinen Schuppen außen.

**Antworten auf die Fragen des Autors:**

- Wasserturm: Er hat eine Geschichte in der Welt, keine in der Handlung. Es ist der Wasserturm der
  Bahn, aus dem früher die Dampfloks am Bahnhof Wasser nahmen; heute Landmarke mit Tauben auf dem
  Tank (2.3). Deshalb steht er neben den Gleisen und hat jetzt einen Trampelpfad vom Gehweg
  (Bahnpersonal). Einen Zaun bekommt er nicht, der Pfad genügt.
- Kleiner blau-grauer Tisch im Pavillon: der Getränketisch `rv5Limonade` mit dem Limonadenglas
  (Auslöser `limonadenglas`), nur Deko.

**Zustände (gebaut, Technik von mittel-2; Liste: `python -m pipeline.abenteuer.zustaende`):**

| Karte                    | Szene                                       | Bedingung                               | was sich ändert                                                                                   |
| ------------------------ | ------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `riverton.aussen`        | `riverton-aussen-trainingszentrum`          | `slickAbschiedGesehen` (nach Szene 37)  | Schild von Perfect Move über dem Pavillon, Absperrbock „Gesperrt“                                 |
| `riverton.aussen`        | `riverton-aussen-tische-kaputt`             | dazu `nadelIronwood >= 1` (Akt 3)       | zwei Bildschirmtische kaputt (`rv9BildschirmtischKaputt`: Sprung, Flatterband)                    |
| `riverton.aussen`        | `riverton-aussen-unterschriften`            | dazu `nadelDesertSprings >= 1` (Akt 4)  | Bildschirmtische abgeschaltet, Tisch für Slicks Unterschriftenliste                               |
| `riverton.aussen`        | `riverton-aussen-nachspiel`                 | `nicht ausgangCapitalArenaFinale == ""` | Bildschirmtische und ihre Dächer weg, Schild ab                                                   |
| `riverton.bahnhofshalle` | `riverton-bahnhofshalle-slick-auf-der-bank` | `nadelIronwood >= 1` (Akt 3)            | Slicks Brett auf der Bank, Kuriertasche daneben                                                   |
| `riverton.bahnhofshalle` | `riverton-bahnhofshalle-plakat`             | `nadelDesertSprings >= 1` (Akt 4)       | Plakat der Landesmeisterschaft neben dem Kiosk                                                    |
| `riverton.pavillon`      | `riverton-pavillon-perfect-move`            | `slickAbschiedGesehen` (nach Szene 37)  | sechs Bildschirmtische statt der langen Tische, Kartons, Rechnerschränke, Schild von Perfect Move |
| `riverton.schuppen`      | `riverton-schuppen-ohne-fahrrad`            | `fahrradErhalten` (Szene 33)            | Fahrrad weg, nur die gefaltete Plane                                                              |

Nicht als eigene Szene: `schuppenOffen` (außen ist das Vorhängeschloss im Bild nicht zu sehen), der
Lastkahn am Anleger (Objekt mit `wenn`, sobald es Objekte mit Bedingung gibt), Regen und Schnee
(Tönung und Partikel; Schneebilder gibt es nicht, ENTSCHEIDUNGEN 10.11.2026), Wohnwagen (nur Szene 37).

#### Runde 9: viertes Gutachten (mittel-3, 10.11.2026)

`gutachten/riverton-aussen-4.md`, `riverton-innen-4.md`. Außen, Zustände und Halle gelten als reif
für den Autor; behoben sind die Restpunkte:

- **Außen:** Zebrastreifen vom Vorplatz zum Markt; das Ruderboot liegt am Kai unter dem Poller;
  Pfützen auf Vorplatz und Markt; das kleine weiße Haus steht als Pumpenhaus neben dem Wasserturm.
  Offen: Brückenkörper (Steinbogenbrücke steht in der nächsten Gemini-Datei).
- **Halle:** Der Glastresen steht direkt vor den Zeitungshaltern, Pops am Ende des Tresens (direkt
  dahinter würde das Regal die Figur verdecken, Regel 10.55).
- **Pavillon:** vier Tische, je zwei pro Seite, wie die Beschreibung meint; an der Stelle der
  mittleren Tische je eine Zuschauerbank. Partie ohne Damen (sie lasen sich als zweite Könige).
  Truhen als offene Holztruhen mit Eisenbändern (`figurentruhe.png`, Bildwunsch `grosse_figuren.py`).
- **Wohnwagen:** eine Spalte länger (17 × 7); Nasszelle zwischen zwei kurzen Trennwänden;
  Sitzecke als Nische mit zwei Sitzen und Tisch; zwei kleine Pokale, die nicht über die Wand ragen.

### Runde 9: drittes Gutachten (mittel-3, 10.11.2026)

`gutachten/riverton-aussen-3.md`, `riverton-innen-3.md`, `zustaende-runde8.md`:

- **Water Street:** Mittel- und Randlinien über `"markierung": ["s"]` (strasse.py) in allen
  Fassungen der Außenkarte.
- **Brücke:** Eine kurze Straße (Asphalt, Bordstein) zweigt von der Water Street nach Süden zur
  Brücke ab; daneben die Einfahrt zum Lagerhof mit Bordstein. Bogen und Pfeiler der Brücke: offen,
  bis das Bild aus Gemini-Prompt 3 (Eisenbrücke mit Höhe) da ist.
- **Infokiosk** in der Beschreibung; die Ladenschilder sind englisch wie überall im Land (das Spiel
  liegt in Amerika), so steht es jetzt in der Beschreibung.
- **Halle:** zwei Bogenfenster an der freien Nordwand (Bildwunsch `bahnhof_innen.py`), das alte
  Sprossenfenster hinter dem Getränkeautomaten ist weg; Abfahrtsmonitor mit gelben Zeilen.
- **Pavillon:** die Beschreibung nennt jetzt je drei Tische (so stehen sie seit Runde 8); auf dem
  Bodenbrett steht eine angefangene Partie mit großen Holzfiguren (Bildwunsch `grosse_figuren.py`).
- **Wohnwagen:** eine dünne Wand trennt Bett und Nasszelle, der Duschvorhang schließt zur Küche;
  die Küche rückt eine Spalte nach Osten; Kuriertasche an der Wand neben dem Kühlschrank; Pokale
  tiefer auf dem Bord. Das Bett liegt quer zur Längsachse des Wagens (Nord–Süd über alle drei
  Reihen); dass das Bild zwei Kissen hat, bleibt.
- **Zustände:** Das Schild von Perfect Move hängt an der Fassade unter der Traufe (`auf` dem
  Pavillon), nicht mehr als Balken über dem Dach; im Pavillon ersetzt es das abgenommene
  Gründungsbild, Slick und der Club sind dort nicht mehr, ein Techniker und eine Trainerin von
  Perfect Move richten ein. `tische-kaputt` liegt im Winter (`jahreszeit`), zwei Tische zeigen das
  kaputte Bild, auch noch in `unterschriften`.

### Runde 9: Bildschirmtische (mittel-3, 10.11.2026)

Wunsch des Autors und der Geschichte (Szene 29: „Die Tische machen keine Fehler“; Szene 37: „am
nächsten Morgen stehen im Pavillon Bildschirmtische“): Die Picknicktische mit Laptops sind ersetzt
durch `rv9Bildschirmtisch` (3 × 3 Kacheln, weißer Kunststofftisch mit blauem Rahmen und vier Bänken,
die Platte ist ein Bildschirm mit Schachbrett).

- Park (Grundkarte, `trainingszentrum`, `unterschriften`, `tische-kaputt`): sechs Tische in zwei
  Reihen (23/27/31 × 47/50), je eine Kachel Luft zur Seite und zum Erdweg. Vier Kacheln Abstand
  auch nach unten gehen nicht: zwischen Uferweg (Reihe 46) und Parkweg (Reihe 53) liegen nur sechs
  Reihen Wiese; die Bänke der Tischbilder halten die Reihen trotzdem sichtbar auseinander.
- `tische-kaputt`: Tisch 2 und 6 als `rv9BildschirmtischKaputt` (Zustand „kaputt“ in der Szene).
- Der Parkschachtisch des Parkschachspielers steht jetzt auf dem Platz vor dem Pavillon (38, 51).
- Pavillon `perfect-move`: Auch innen Bildschirmtische, je drei links und rechts statt der langen
  Holztische mit Laptops (Szene 37); dazu Kartons der Lieferung und zwei Rechnerschränke.

## 3.5 Gutachten Runde 8 (10.11.2026, mittel-3): Innenräume

Behoben (Gutachten `docs/spiel/auftraege/gutachten/riverton-innen.md`):

- **Wohnwagen**, jetzt 14 × 8 statt 17 × 8, ohne leere Südhälfte: Querbett (Doppelbett von oben) über
  die ganze Breite im Heck, darüber ein schmales Wandbord mit den Pokalen (Bildwunsch
  `riverton_innen.py`), Kuriertasche an der Wand, Nasszelle hinter einer Milchglastür,
  Küchenzeile mit Spüle und Zweiflammer auf zwei Arbeitsplatten neben dem Kühlschrank, Sitzecke mit
  zwei Bänken um den Tisch, zwei Fenster.
- **Pavillon**, jetzt 24 × 18: Bodenbrett mit Steinrahmen und Laufweg ringsum; Bretter liegen ganz auf
  den Tischen, je ein Stuhl davor und dahinter genau unter jedem Brett; zwischen den Tischreihen eine
  Reihe Abstand; zwei Truhen für die großen Figuren; Gründungsbild statt winziger Tafel;
  Limonadenstand mit Gläsern statt eines unkenntlichen Tischchens; Zuschauerbänke an der Nordwand mit
  Blick aufs Brett.
- **Schuppen**: Brennholz in Gestellen statt Holzscheiten mit Gras, Bretterstapel statt Zaunfeld,
  Farbdose statt Fass als „Kanister“, Werkzeugbord mit Haken und Werkzeugkiste statt Ladenvitrine.
- **Bahnhofshalle**: drei Schalterfenster mit Ablage in der Nordwand statt einer flachen Ladenfront;
  Kiosk in der Ecke mit Zeitungshaltern und Pops hinter dem Tresen; Abfahrtsmonitor an der Wand statt
  Tafel auf Beinen; schwarze Doppeltür zum Bahnsteig, gläserne Doppeltür als Haupteingang;
  Getränke- und Kaffeeautomat nebeneinander an der Ostwand; vier gleiche Säulen, Pflanzen
  einheitlich an den Säulen und am Eingang, keine mehr vor einer Tür; nur noch eine Bankart; der
  „Wasserspender“ ist weg; Sackkarre mit Gepäck und Koffer in den Ecken.

Begründet nicht geändert:

- Pavillon „rechteckig statt achteckig“: Die Innenkarte ist im Raster rechteckig; die Beschreibung
  nennt kein Achteck mehr. Fenster nur in der Nordwand, weil Seitenwände in der Draufsicht keine
  Fenster zeigen können.
- Pavillon „Brett ohne Koordinaten“: Es gibt keine Bodenbilder mit Buchstaben und Zahlen; der Rahmen
  aus Stein grenzt das Brett ab.
- Bahnhofshalle „Personal am Schalter“: Die Schalter sind Fenster in der Wand, der Beamte sitzt
  dahinter und ist in der Draufsicht nicht zu sehen. „Niedrige Wände“: Die Wandhöhe ist für alle
  Innenräume gleich (drei Kacheln).
- Schuppen „Fahrrad unter der Plane wie ein Zelt“: Das Fahrrad ist absichtlich abgedeckt (Szene 33);
  das Hinterrad schaut hervor. „Kein Staub, kein Licht durch Ritzen“: Partikel und Lichtstreifen sind
  Sache der Laufzeit, nicht des Kartenbilds.

### 3.6 Gutachten Runde 8 (10.11.2026, mittel-3): Riverton außen

Behoben (Gutachten `docs/spiel/auftraege/gutachten/riverton-aussen.md`, Nummern in Klammern):

- **Bahn (1–9):** Bahnsteig aus Pflaster zwischen Gleis und Bahnhof mit zwei Bahnsteigbänken. Der
  Bahnhof ist jetzt ein Backsteinbau mit rotem Ziegeldach, zwei Bogenfenstern und der gläsernen
  Eingangstür in der Mitte (Bildwunsch `riverton_aussen.py`); `bahnhofTuer` (36, 16) liegt davor.
  Hecke am Bahnzaun links und rechts des Bahnsteigs. Stellwerk, Güterschuppen (mit Laderampe zum
  Gleis und Holzstapel darauf) und Wasserturm stehen direkt am Gleis; der Fußweg vom Bahndamm läuft
  am Zaun entlang am Stellwerk vorbei zum Bahnsteig. Leere Rasenflächen sind gefüllt.
- **Häuser (10–12):** Graues Hochhaus, Turmhaus und gequetschtes Wohnhaus sind weg. Dafür ein
  Angelladen und ein Wohnhaus an der Water Street im Westen, ein Wohnhaus östlich des Güterschuppens
  und ein Infokiosk auf dem Vorplatz.
- **Vorplatz und Straße (13, 15, 17, 21, 22):** Die Water Street läuft an beiden Rändern aus der Karte
  hinaus (nach Cedar Creek und Ironwood). Vorplatz sechs Reihen tief, der Brunnen mit zwei Bänken,
  die zu ihm schauen, in der Mitte der Westhälfte; die Achse zur Bahnhofstür bleibt frei. Bäckerei,
  Café und Lagerhäuser stehen auf Pflaster; die Brückenstraße ist Fußgängerzone und endet am
  gepflasterten Brückenkopf im Park.
- **Fluss, Kai, Kanal (23–31):** Nordufer als gerade Kaimauer (von vorn gesehen mit Leitern und Reifenfendern aus dem Hafenpaket) mit drei Reihen Promenade, vier Bänken
  mit Blick aufs Wasser und Laternen in festen Abständen. Am Kai im Osten Kisten, Fässer,
  Poller mit Tau, ein Motorboot am Kai (5 × 2 Kacheln, 10.64) und der Gabelstaplerfahrer bei der Arbeit; das Pegelhaus steht am
  Ende des Kais direkt am Wasser. Das Südufer schwingt aus. Der Kanal und sein Becken haben Steinufer
  und laufen gerade nach Süden, der Kanal mit 7 Kacheln Wasser für Frachtkähne (10.64); der Treidelpfad läuft einfach neben dem Steinrand. Die Brücke wirft
  einen Schatten aufs Wasser.
- **Park (32–40):** Bäume, Büsche, drei Laternen am Uferweg. Die Bildschirmtische stehen unter drei
  Holzdächern (Regen); der Pavillon hat ein Holzdach; der Platz davor ist zwei Reihen tief. Der
  Parkschachspieler hat einen Picknicktisch mit Brett.

Begründet nicht geändert:

- (8) Wasserkran und Stichgleis gibt es nicht als Bild; der Turm steht am Hauptgleis.
- (13) Fahrbahnmarkierung und Überweg: keine passenden Bodenbilder für Asphalt.
- (14) Pfützen: Tönung und Partikel der Laufzeit (Regen), nicht das Kartenbild.
- (16) Haltestellenschild: Das Bild der Haltestelle hat den Fahrplan am Wartehäuschen.
- (18) Handyladen „STORE“: Kulisse ohne Innenraum (Bibel 10.2), Kyle steht davor.
- (19) Verkäufer hinter dem Stand: Unter der Markise wäre die Figur verdeckt; Marktfrau, Obsthändler
  und Imbissverkäufer stehen daneben.
- (26) Die Enten sind eine Belebung, das Spiel bewegt sie.
- (31) Das Ostufer des Kanals ist eine Böschung mit Bäumen, nicht begehbar.
- (34) Wohnwagen, Werkstatt und Schuppen haben ihre Türen zum Hinterweg im Süden (Schuppentür zur
  Südwand, 3.2); der Uferweg ist der Vorderweg des Parks. (35) Die Werkstatt ist seit dem Frühjahr
  geschlossen (Bibel 9.2) und behält ihr Schaufenster.
- (37) Der Pavillon ist außen ein Holzdach auf Stützen; innen hat er Wände und Fenster (Planen und
  Holzwände sind in der Draufsicht nicht darstellbar).
- 10.64: Der kleine Portalkran am Kai ist weg (ein Portalkran wäre 10–14 Kacheln hoch und passt nicht
  an einen Flusskai); dafür ein Bahnwärterhäuschen östlich des Güterschuppens (10.51, 20 Gebäude).
- (42) Reihenhaus und Lagerhaus stehen je zweimal nebeneinander als Paar (Punkt 25: höchstens zweimal).

### 3.7 Zweites Gutachten (10.11.2026, mittel-3)

Behoben (`gutachten/riverton-aussen-2.md`, `riverton-innen-2.md`):

- **Außen:** Bahnhof mit Uhrturm in der Mitte, Bogenportal mit Glastür unter dem Rundbogen und zwei
  Flügeln (Bildwunsch `riverton_aussen.py`); der Bahnsteig liegt hinter dem Bahnhof zwischen Gebäude
  und Gleis, Gleisbett aus Schotter; Bahnsteigbänke von der Seite statt mit dem Rücken zum Gleis;
  Stellwerk ist eine Holzhütte am Fußweg (Tür zum Weg); der Fußweg biegt zum Vorplatz und hat zwei
  Laternen; Tor des Güterschuppens mit Pflasterweg; zwei Läden statt Wohnblock und Angelladen;
  Gehwege, Promenade, Bäckerei und Café auf Steinplatten, Vorplatz und Markt auf Kopfstein, Kai auf
  Beton, so dass jede Fläche eine Kante hat; das ganze Wasser hat Steinufer, das Kanalbecken ist
  offen zum Fluss; Pavillon aus Holz mit Fensterreihe und Tür (Bildwunsch `riverton_runde8b.py`);
  sechs Bildschirmtische mit Abstand; Laternen am Uferweg stehen südlich des Wegs.
- **Bahnhofshalle:** drei Schalterfenster, gläserne Bahnsteigtür in der Nordwand und gläserne
  Eingangstür (eigene Bilder), Getränke- und Kaffeeautomat von vorn nebeneinander an der Nordwand,
  Kiosk mit drei Zeitungshaltern im Raum statt auf der Wandkrone, Pops zwischen Haltern und
  Tresen, keine Kartons mehr, nur zwei Pflanzen am Eingang.
- **Pavillon:** rechteckige Holztische mit zwei Brettern auf der Platte und je einem Stuhl davor und
  dahinter (Bildwunsch), Holztruhen, Pflanzen an den Ecken des Laufwegs, Limonadenglas auf einem
  Tischchen.
- **Wohnwagen:** drei Reihen tief, das Querbett reicht von Wand zu Wand; Pokale stehen auf dem
  Wandbord unter der Decke; Nasszelle mit Mini-Toilette und Duschvorhang; Sitzecke mit zwei Bänken
  um einen niedrigen Holztisch; keine Kistenmatte.

Begründet nicht geändert: Bahnhofshalle mit hellen Ziegeln und rechteckigen Fenstern (keine
Wand- und Fensterbilder in Backstein mit Rundbogen für Innenräume); Fahrbahnmarkierung und Pfützen
(keine Bilder, Tönung der Laufzeit); Enten, Taubenmann und Hund sind Belebungsbilder; die
Bäckerei behält ihr englisches Schild; Schuppen bleibt (stimmigste Karte des Gutachtens).

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

## Runde 7 (10.11.2026): Lockport mit mehr Häusern und Leben (niedrig-1)

`lockport.aussen` A, B, C nach Regel 10.51 und 10.53, Raster und Übergänge unverändert. Die untere
Straße (Reihen 32–35) läuft jetzt bis an den Ostrand (Spalte 54); daran stehen im Südosten neue
Häuser statt eines Teils des Wäldchens. Neue Kulissen (Vorsilbe `lp8`): Dorfladen „Store“,
Markt, Wohnhaus mit Flachdach (ein- und zweistöckig), Lagerschuppen, Bauernhäuser. A hat 12, B 13,
C 12 Gebäude. In A und B steht die Rätseltafel eine Spalte weiter (36, 8), in B eine Laterne
(21, 9), in C eine (54, 9). Belebung in allen drei gleich: Finn und 12 neue Statisten, 8 davon
ansprechbar (`statist.lockport.aussen.*`, Akt 2 im Herbstnebel), Möwe, Enten im Becken, Katze am
Kai, Gans im Süden. Die benannten Figuren aus `14_Akt2_Leben_teil1.md` 4.1 (Imogen, Ruben, Henrik)
kommen mit ihren Dialogen in Runde 6.

## Runde 7 (10.11.2026): Weg 2 mit Stellwerk und Belebung (niedrig-1)

**Zugpartie am Bahndamm** (Dokument 15, 2.2): südlich des Weges am Signalmast das Stellwerk
(`wc8Stellwerk`, eigenes Bild `stellwerk.png`, 4 × 5, mit Tafel an der Hauswand neben der Tür), davor
eine Bank (`wc8StellwerkBank`); Wiese mit Platz für drei bis sechs Figuren. Lage je Variante relativ
zum Signal (A 38, B 24, C 40): Stellwerk bei (Signal + 2, 10), Tür in Spalte Signal + 4, Bank
(Signal − 2, 11).

### Für Runde 6 (Felder bleiben begehbar)

| Auslöser            | Karte                         | Feld A                 | Feld B   | Feld C   | Was dort ist                                        |
| ------------------- | ----------------------------- | ---------------------- | -------- | -------- | --------------------------------------------------- |
| `ereignisZugpartie` | `wegCedarRiverton.bahndamm`   | (42, 15)               | (28, 15) | (44, 15) | Rosalind vor dem Stellwerk                          |
| `seite01`           | `wegCedarRiverton.bahndamm`   | (44, 5)                | (28, 5)  | (46, 5)  | Buchseite Kapitel 1 im Schotter neben dem Bahnsteig |
| `finchSpringerA`    | `wegCedarRiverton.zedernwald` | wie `fundHolzspringer` |          |          | der Springer aus Holz im hohlen Stamm (schon da)    |

**Belebung:** Bahndamm mit Trainspotter (die Katze auf dem Güterzug, kleine Tiergeschichte),
Radlerin, Gärtnerin (jetzt ansprechbar), Katze im Güterwagen, Fasan; Zedernwald mit Jäger mit
Kamera (Hirsch), Wanderpaar (Springer heißt knight und Pferd), Vogelstimmensammlerin, Hirsch und
Fuchs. Gwen, Juno, Leif und die Pfadfinder bleiben ohne Satz, weil ihre Dialoge in Runde 6 kommen.

## Runde 6 (10.11.2026): Weg 2 spielbar (niedrig-1)

| Auslöser            | Art                 | Feld A   | Feld B   | Feld C   | Inhalt                                                                                 |
| ------------------- | ------------------- | -------- | -------- | -------- | -------------------------------------------------------------------------------------- |
| `ereignisZugpartie` | dialog              | (42, 15) | (28, 15) | (44, 15) | Rosalind Kettering, Rätsel `wegCedarRiverton.zugpartie` (2 Aufgaben, hängende Figuren) |
| `seite01`           | gegenstand          | (44, 5)  | (28, 5)  | (46, 5)  | Buchseite Kapitel 1 (Fund `seite01`)                                                   |
| `durchlass`         | gegenstand, S14     | (66, 7)  | (52, 7)  | (64, 7)  | ohne Laterne zu dunkel; mit `hatLaterne` Gwens Thermoskanne (Fund `thermoskanneGwen`)  |
| `fundHolzspringer`  | gegenstand (vorher) | –        | –        | –        | gibt zusätzlich `finchSpringerA` (Finch-Figur Springer a)                              |

Quest `wegCedarRiverton.zugpartie` (Rätsel): Dialog `zugpartie_angebot`, dann die Aufgaben, dann
`zugpartie_geloest` mit der Signalkelle (Fund `signalkelle`). Die Laterne für den Durchlass kommt aus Ironwood (Edna, 13 S14).

## Runde 6 (10.11.2026): Lockport spielbar (niedrig-1)

**Sperre S3:** Der Steg über das Untertor ist ein Übergang auf derselben Karte (`steg` (30–31, 13) →
`stegSued` (30–31, 17), `wenn: lockportSteg`). Damit niemand außen herum läuft, sperren Holzzäune
(`ccZaun`) beide Schleusentore (30–31 und 36–37, Reihe 14) und den Uferstreifen im Westen (A und C
(1, 13), B (1–5, 13)). Die App kann dafür den Helden jetzt auf derselben Karte versetzen
(`Oberweltszene.versetze`). `lockportSteg` setzt der Dialog selbst, sobald die Tafel
`lockport.tafelSchleuse` bestanden ist (5 Münzen).

| Auslöser         | Karte    | Art              | Feld A      | Feld B   | Feld C   | Inhalt                                              |
| ---------------- | -------- | ---------------- | ----------- | -------- | -------- | --------------------------------------------------- |
| `tafelSchleuse`  | aussen   | gegenstand       | (37, 10)    | (37, 10) | (35, 10) | Imogen, Tafel S3; nach L1–L3 die Karte „Auszeit“    |
| `steg`           | aussen   | uebergang, S3    | (30–31, 13) | gleich   | gleich   | ohne Tafel: Schild „Herbstwartung“                  |
| `stegSued`       | aussen   | uebergang        | (30–31, 17) | gleich   | gleich   | zurück ans Nordufer                                 |
| `kai`            | aussen   | dialog           | (13, 20)    | (13, 20) | (13, 20) | Kapitän Ruben: L1 Kahnrennen, L3 Post               |
| `henriksBoot`    | aussen   | gegenstand       | (23, 20)    | (23, 20) | (23, 20) | L2: Aufgaben, danach Gummistiefel                   |
| `henrik`         | gasthaus | dialog           | (15, 8)     | (15, 6)  | (4, 7)   | Henrik am Tresen, nimmt L2 an                       |
| `fundKegel`      | gasthaus | gegenstand       | (15, 4)     | (1, 4)   | (18, 5)  | Fund `kegelKerbe`                                   |
| `kegelbahn`      | gasthaus | dialog (Ansehen) | (7, 5)      | (3, 7)   | (12, 5)  | acht Kegel fallen                                   |
| `fotoHochwasser` | gasthaus | dialog (Ansehen) | (13, 3)     | (10, 3)  | (16, 3)  | Imogen im Hochwasser                                |
| `kegelkoenig`    | gasthaus | dialog (Ansehen) | (3, 3)      | (3, 3)   | (14, 3)  | Tafel „Kegelkönig des Monats“ (in B neu bei (2, 1)) |

Quests (alle `klein`): `lockport.tafelSchleuse` (5 Münzen), `.kahnrennen` (3 Aufgaben Doppelangriff,
10), `.taue` (2 Aufgaben Fesselung, 10 und Gegenstand `gummistiefel`), `.post` (10, setzt
`lastkahnFrei`). Den Brief gibt Big Joe in Ironwood mit der Variable `briefFuerRuben` (mittel-2 setzt
sie in seinem Dialog). Imogen, Ruben und Henrik stehen als Statisten ohne Satz an ihren Auslösern; in B
liegt das Ruderboot neu bei (21, 18). Statt der Pumpe steht ein Dorfbrunnen mit Kurbel (`lp6Brunnen`, Modern Farm) bei (30, 36), Auslöser
`pumpe` (31, 36), in allen drei Varianten. Die Glocke (`lp6Glocke`, eigenes Bild `glocke_pfosten.png`) hängt am Nordufer, Auslöser `glocke` davor auf der Uferstraße bei A (46, 10), B (44, 10), C (37, 10). **Offen:** die Schnellreise mit dem Lastkahn (`reise`) braucht Anleger in Riverton und
Ironwood.

## Runde 8 (10.11.2026): Lockport und Weg 2 nach den Notizen des Autors, Zustände (niedrig-1)

**Lockport außen** (Hauptfassung A, jetzt 56 × 51):

- Schleuse für Frachtkähne (10.57): Kammer 10 Kacheln lang (Spalten 32–41), Kammer und Seitenarm
  5 Reihen Wasser (14–18) mit Steinufer; Untertor (30–31) und Obertor (42–43) tragen je einen Steg.
- Platz unter der Schleuse durchgehend gepflastert; der Bootsschuppen steht auf einem gepflasterten
  Werftplatz (44–54 / 20–24); das Schild „Zur Schleuse“ hängt über den Fenstern, nicht vor der Tür.
- Statt der Scheune ein Schiffsausrüster (`ca8Eisenwaren`) an der Hauptstraße; im Süden eine zweite
  Häuserreihe (fünf Häuser und ein Laden) an einer Hintergasse, Bäume am Südrand.
- Sperre S3 bleibt dicht (Zäune an beiden Toren und am Westufer, geprüft mit Breitensuche).

**Gasthaus** (Hauptfassung, früher C) nach 10.56 auf 30 × 14: Kegelbahn links an der Nordwand mit
Bande und Kugelregal am Abwurf, getrennt von der Theke rechts; Hocker direkt am Tresen; das Rohr unter
dem Stuhl ist weg.

**Bahndamm** (Hauptfassung, früher C): Birkenwäldchen an beiden Enden; Dammkrone zwei Reihen breit,
der Bahnsteig liegt oben, eine Treppe führt die Böschung hinunter; die Böschung läuft durchgehend bis
an beide Ränder (`hang_bis_rand`); Durchlass mittig über dem Trampelpfad, der Teich darüber ist weg;
Weg zum Stellwerk; der Garten hat ein offenes Tor mit Endpfosten und Wege zu beiden Gartenhäusern (das
rote steht nicht mehr am Zaun); das Zaunstück am Damm über der Plakatwand ist weg; der Güterwagen steht
vor den Schienen, die Katze sitzt daneben. **Zedernwald** (früher C): Trampelpfad zum Zelt der
Pfadfinder.

**Antworten auf die Fragen des Autors:**

- _Brücke über den Kanal in Lockport?_ Die Stege auf Unter- und Obertor sind die Brücken; im Herbst
  sind beide wegen der Wartung zu (S3), danach offen (Zustand `stegOffen`).
- _Passt das Farmhaus unten?_ Nein, die Scheune ist durch einen Schiffsausrüster ersetzt; ein
  Kanaldorf lebt von Kähnen, nicht von Feldern.
- _Liegt die Haltestelle am Bahndamm oben oder unten?_ Oben auf dem Damm, mit Treppe hinunter. Umgesetzt.
- _Wie sieht die andere Seite des Damms aus?_ Hinter der Krone fällt die Böschung zu Wiesen ab; die
  Büsche oben stehen auf der Kante als Windschutz. Die Karte zeigt nur die Südseite.
- _Warum gibt es den Damm?_ Er hebt das Gleis über die Flussaue, die im Frühjahr überschwemmt wird
  (kein Staudamm). Der Durchlass lässt Weg und Hochwasser hindurch.

**Zustände (10.63), gebaut (Szenen `lockport-aussen-<zustand>.json`):**

| Karte                         | Zustand        | Bedingung      | Zustand: wann, was, warum                                                                       |
| ----------------------------- | -------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `lockport.aussen`             | `steg-offen`   | `lockportSteg` | Nach Imogens Tafel: Wartung vorbei, die Zäune an beiden Toren sind weg (S3).                    |
| `lockport.aussen`             | `boot-an-land` | `taueErledigt` | Nach L2: Henriks Ruderboot liegt auf dem Werftplatz am Schuppen; der Steg ist dann schon offen. |
| `lockport.gasthaus`           | –              | –              | Kein fester Wechsel.                                                                            |
| `wegCedarRiverton.bahndamm`   | –              | –              | Kein fester Wechsel.                                                                            |
| `wegCedarRiverton.zedernwald` | –              | –              | Kein fester Wechsel.                                                                            |

Der Lastkahn hat auf der Karte keine Plane; der Zustand „lastkahnFrei“ entfällt, bis das Bild des
Frachtkahns da ist (Bildwunsch `frachtkahn`).

## Runde 8 (10.11.2026): Kanalweg und Eisenbrücke nach den Notizen des Autors (mittel-4)

Beide Karten sind neu gebaut (Hauptfassung A; B und C bleiben als Archiv liegen) und jetzt
36 Felder breit, damit der Kanal für Frachtkähne Platz hat.

**Antworten auf die Fragen des Autors (Empfehlung, schon umgesetzt):**

- _Eisenbrücke: Soll es eine Brücke aus Eisen geben?_ Ja, die Geschichte verlangt sie (Story-Bibel
  10.3, Szene 40). Neu gezeichnet als genietetes Fachwerk mit Brückenköpfen aus Stein
  (`bruecke_eisen_laengs_8`, Möbel `wr8BrueckeEisen8`).
- _Ist es derselbe Kanal wie am Kanalweg?_ Ja. Die Eisenbrücke setzt den Kanalweg fort, deshalb ist
  er auf beiden Karten gerade, acht Felder breit (Spalten 20–27, Frachtkähne nach Lockport) und hat
  ein Steinufer (`ufer: stein`, Regel 10.57). Auf der Eisenbrücke biegt er in den Reihen 54–61 nach
  Westen unter dem Pfad hindurch und läuft in den Spalten 2–9 bis Ironwood weiter; Ironwood hat
  dieselben Spalten.
- _Spieltische ohne Grund?_ Sie gehören den Brückenbauern (Dokument 15, 2.3): Dime und seine Leute
  spielen unter der Brücke, wo es bei Regen trocken bleibt. Die Tische stehen jetzt auf einem
  gepflasterten Kai am Südufer direkt an der Brücke, mit Hockern; die Graffiti am Widerlager dahinter
  sind die übliche Malerei unter Brücken, eine Sprayerin ist dabei.
- _Zickzackweg mit Zäunen?_ Der Pfad fällt in Kehren den Hang hinab (Abhang nach Ironwood). Zwischen
  den Kehren liegen eingezäunte Weiden des Hofs am Hang (Schafe, Ziegen, Streuobst); die Zäune
  trennen den Pfad von den Tieren.
- _Große Graffiti-Mauer unten?_ Entfernt; sie hatte keinen Grund. Graffiti gibt es nur noch dort, wo
  die Geschichte sie trägt: am Widerlager unter der Brücke und an der freien Wand am Kanalweg.
- _Springer im Gras und Schildchen mit Huhn?_ Das sind das Kreidezeichen K1 (Kreide-Strang) und das
  Finkenschild (Finch-Strang). Der Kreidespringer steht jetzt auf dem steinernen Brückenkopf, das
  Finkenschild hängt am Geländer der Brücke (Regel 10.61).
- _Kanalweg: Warum ein Silo ohne Farm?_ Das Silo gehört jetzt zu Mr. Dales Hof: es steht am Hofplatz
  neben Scheune und Farmhaus, darunter vier Äcker (Kohl, Mais, Kürbis, Karotten).
- _Boot quer im Kanal?_ Ein Kanal mit Frachtkähnen ist breit (acht Felder). Auf den Nord-Süd-Strecken
  liegen nur kleine Boote längs am Ufer, weil es den Lastkahn nur in Ost-West-Ansicht gibt.
- _Gebäude neben dem Farmhaus ohne Tür?_ Das war ein Hühnerstall. Er steht jetzt in einem eigenen
  Hühnerhof mit Zaun und Hühnern, mit Weg zum Pfad; das Farmhaus steht für sich.
- _Mast unten links?_ Entfernt, er hatte keinen Grund.

**Eisenbrücke (`weg-riverton-ironwood-2`):** Wärterhäuschen (9, 14) mit Weg zum Pfad und zwei
Laternen daran; Laternen am Treidelpfad alle 12 Reihen und an jeder Kehre. Kai 11–28 / 62–64 mit
Bank und zwei Laternen. Auslöser: `fundNietenkopf` (18, 56), `zeitnotTrick` (17, 58),
`aussichtTal` (18, 60) auf der Brücke; `waerterhaus` (11, 18); `ereignisBrueckenbauern` (24, 62),
`kreide1` (19, 63), `spurPM1` (27, 62), `seite07` (13, 64), `finchLaeuferA` (16, 62); Dime (21, 62).
Ausgang nach Ironwood (24–25, 159).

**Kanalweg (`weg-riverton-ironwood-1`):** Freie Wand (3–14, 16) mit Sprayerin und Schild, Grund:
Riverton hat die alte Fabrikmauer für Graffiti freigegeben (Noors Wand, Akt 2). Fabrikhalle mit Hof
(Tür Spalte 8) und Tor zum Pfad; Werkstraße 1–16 / 50–52 mit Haltestelle und Rätseltafel;
Kleingärten mit Gartenhäuschen (Reihen 60–79); Treidelbrücke über den Seitenarm (100–105) nach
Lockport; Rastbank (15, 109); Hof von Mr. Dale mit Hühnerhof (2–9 / 110–117), Farmhaus (1, 121),
Scheune (2, 132), Silo (11, 128), Hofplatz aus Kies, Äcker 1–14 / 148–159; Rastanleger mit Bank und
Boot; Pappelallee. Auslöser: `tafel` (15, 50), `fundZahnrad` (12, 43), `meilenstein` (16, 10),
`rastKanal` (16, 110), `fundKonservendose` (19, 157); Mr. Dale (8, 147).

**Zustände (Regel 10.63), gebaut, sobald mittel-2 die Technik meldet:**

| Karte    | Zustand             | Wann und warum                                                            |
| -------- | ------------------- | ------------------------------------------------------------------------- |
| kanalweg | Graffiti halb       | Akt 2: Noor beginnt die Schachfiguren an der freien Wand                  |
| kanalweg | Graffiti fertig     | ab Akt 3 (`endeAkt2`-Marke): die Wand zeigt Turm und Springer vollständig |
| kanalweg | Winter              | Akt 3: Schnee am Pfad, Eis am Ufer (13, 7.3)                              |
| bruecke  | Geländer gestrichen | nach Corwins Quest: Farbeimer und Leiter weg, Geländer frisch             |
| bruecke  | Winter              | Akt 3: Schnee auf den Weiden, die Klapptische sind weggeräumt             |

## Gutachten Runde 8: Antworten (niedrig-1, 10.11.2026)

Gutachten in `docs/spiel/auftraege/gutachten/`. Nummern beziehen sich auf die Befunde dort.
„Technik“ heißt: Der Punkt betrifft alle Karten und wird zentral gelöst (Tierbilder, Laternenhöhe,
Fußmatte, Stufendiagonalen der Wege); er wird hier nicht einzeln umgebaut.

**Lockport außen** (Commit „Lockport außen nach dem Gutachten“):

- Behoben: 1 (Becken öffnet sich nach Westen zum Fluss), 2 (Frachtkahn längs am Kai), 6, 7, 9
  (Stemmtore mit GESPERRT-Böcken statt Zaunpfählen und Schwenkbalken), 10, 11, 13, 23 (Rettungsring,
  Steinchen, Pfähle weg), 12 (Nordkai durchgehend gepflastert), 14 (Ladung am Kai), 15, 16, 36–38
  (Holzhäuser in vier Farben statt siebenmal Flachdach und drei Läden), 21 (Wäscheleinen), 24, 25
  (Werft mit Bootsschuppen und Holzstapel), 30 (Gassen gepflastert), 31–35 (echter Dorfplatz mit
  Brunnen, Linde und Bank), 39, 40 (Gärten, mehr und gemischte Bäume).
- Technik: 5 (Hühner im Becken sind das Entenbild), 20 (Laternenhöhe), 19 und 33 (Verdeckung durch
  zu hohe Laterne und Baumkrone).
- Fehlendes Bild: 8 (verschiedene Wasserstände vor und hinter dem Tor gibt es nicht als Kachel),
  3 und 4 (Tau vom Boot zum Poller), 26 (Ladenschild „ANKER TAUE“ für den Schiffsausrüster, als
  Bildwunsch gemeldet), 28 und 29 (das Gasthausbild hat Tür und Fenster fest im Anbau).
- Zur Nachprüfung in der neuen Fassung: 17, 18, 22, 27, 41. Die Hintergasse führt mit Absicht an
  beiden Rändern hinaus: Sie ist der Weg aus dem Dorf (Übergänge nach Westen und Osten).

**Gasthaus „Zur Schleuse“** (Commit „Gasthaus Lockport nach dem Gutachten“):

- Behoben: 1, 2 (Prallbretter als Kugelfang, Ofen aus der Schusslinie), 4 (ein Kegelsatz), 8
  (Tafel auf Wandhöhe), 18 (Küchentür hinter der Theke), 19, 23, 24 (fünf Tische, frei von der
  Südwand), 20 (Gläser auf drei Tischen), 15, 21 (Gäste neben, nicht in den Stühlen), 25 (Pflanzen in
  die Ecken), 32 (Garderobe, eigenes Bild).
- Bildwunsch gestellt: 6 (Bande mit der Leiste oben in der Kachel; die alte Leiste liegt am
  unteren Kachelrand, darum scheint sie neben der Bahn), 9 (Kugelregal von der Seite).
- Technik: 29 (Fußmatte). Perspektive: 7, 15 (alle Figuren stehen frontal, es gibt keine
  Schiebe- oder Sitzhaltung), 30 (Türbild).
- Fehlendes Bild: 3, 5 (Bahnbelag und Kegel im Maßstab), 14 (Zapfhahn, Kasse), 16 (Leitung).
- Ansichtssache: 22, 27, 28 (Bildstil der Möbel aus dem Paket, nicht der Karte).

**Bahndamm** (Commit „Bahndamm nach dem Gutachten“):

- Behoben: 1–3 (Gleis mitten auf Schotterkrone, Böschung nach Süden; die Nordböschung reicht
  als `hang_bis_rand` bis an den Kartenrand und ist darum kaum zu sehen), 4, 5, 24 (Buschreihe und
  Steine aufgelockert), 6 (Bahnsteig mit Laternen), 10, 11 (Viehdurchlass zur Kuhweide), 12, 13
  (Güterwagen auf Abstellgleis mit Prellbock), 16 (dichter Birkenwald), 18, 19, 20 (Stellwerk
  nördlich am Gleis mit Blick auf die Strecke), 25–29 (Kleingarten mit Kürbis, Sonnenblumen, Tor),
  31 (Weg zur Bank am Fluss), 33–35 (Lagerzaun und -halle, Plakatwand von Perfect Move), 38
  (Wegweiser, Laternen am Bahnsteig).
- Technik: 13, 15, 17, 30, 37 (Tierbilder und ihre Stellung), 36 (Stufendiagonalen).
- Perspektive: 7 (Bänke werden immer von vorn gezeigt; auf dem Bahnsteig stehen sie mit dem Rücken
  zur Krone, damit Wartende zum Zug schauen), 22 (keine Figur mit Rad), 28 (keine Gießkanne in der
  Hand).
- Gewollt: 32 (der Fluss läuft am Südrand aus der Karte; das Gegenufer liegt außerhalb).

**Zedernwald** (Commit „Zedernwald nach dem Gutachten“):

- Behoben: 1, 2 (Bach zwei Kacheln schmal und gewunden), 3, 11 (Trittsteine, Wegweiser und Tafel an
  der Kreuzung), 4, 17, 18 (Waldboden, Farne, Büsche, Pilzblock aufgelöst), 23 (zweites Zelt,
  Fahne), 24, 25 (Leif mit drei Kindern am Weg), 26 (Wanderpaar zu zweit).
- Technik: 9, 21, 28 (Tierbilder), 10 (Stufendiagonalen).
- Fehlendes Bild: 15 (eine erkennbare Zeder gibt es im Paket nicht; Wunsch an den Haupt-Chat), 8
  (Grenzstein), 14, 20 (hohler und angenagter Stamm), 27 (Mikrofon).
- Zur Nachprüfung: 5, 6, 7, 12, 13, 16, 19, 22.

**Zustände Weg 3 (gebaut):** Kanalweg `graffiti` (`nadelIronwood >= 1`): Noors Wand ist fertig bemalt,
Leiter und Sprayerin sind weg. Eisenbrücke `ohne-tische` (`nadelIronwood >= 1`): Die Brückenbauern haben
die Klapptische weggeräumt, Corwin ist mit dem Streichen fertig. Der Winter beider Karten kommt mit der
Schneefärbung (mittel-2).

**Regel 10.64 (Größen):** Kanal 8 Reihen, Seitenarm nach Lockport jetzt 7 Reihen (vorher 6), Treidelbrücke
neun Felder lang. Auf Weg 3 fahren keine Fahrzeuge; die Ruderboote am Ufer sind 4 × 2, das Autowrack im
Fabrikhof 4 × 4, der Leiterwagen 2 × 3. Ironwood: Werksbus 7 × 4 (wie LimeZus Bus), keine Lastwagen.
Steinbruch: Radlader 6 × 3, Lore der Feldbahn 1,5 × 1. Weg 7: die Sattelzüge sind 10 × 4; das Autowrack an
der Tankstelle war ein Kleinwagen von vorn (2 × 2) und ist jetzt ein Wrack in Autogröße (4 × 4).

### Gutachten Runde 8 (Kanalweg, Eisenbrücke): Umsetzung und Begründungen

**Kanalweg** (`gutachten/weg-riverton-ironwood-1.md`), umgesetzt: befestigter Treidelpfad direkt an der
Kaimauer (9), Poller in gleichem Abstand und ein Frachtkahn längs am Kai (2, eigenes Bild 5 × 26, Regel
10.64), Steg am Rastanleger mit Boot daneben (4, 5), Reiher entfernt (6), Brücke mit Brückenköpfen und
Fachwerk über den Seitenarm (8), Hütte am Ostufer entfernt, das Ostufer ist bewachsene Böschung (10), die
Mauer ist die Hofmauer der Fabrik (11), Graffiti mit Turm und Springer (12), Fabrikhalle mit Rolltor statt
Holzschuppen (14), Hof mit Containern und Fässern statt Autowracks (15), Hof ringsum eingezäunt mit Tor zum
Pfad (16), Laternen an der Werkstraße (17), Haltestelle mit Bank und Mülleimer (18), Obstwiese und
Picknicktisch statt leerer Wiese (19), vier verschiedene umzäunte Kleingärten ohne Straßenlaternen, Beete
bepflanzt, der Gärtner gießt Kohl (20–23), Landvermesser auf dem Treidelpfad (24), Silo auf 9 Kacheln
gekürzt (25), Hofplatz aus Erde mit Rand (26), Weg zwischen den Äckern bis zum Pfad (28), Zaun ringsum
(29), Baumreihe als Birkenreihe beschrieben (31), ein Baumstil (32).
Nicht umgesetzt, mit Grund: **Ufer als Mauer mit Krone (1, 3):** Das Steinufer zeichnet das Material
`wasser_stein` des Kartenbilds; eine Mauerfläche mit Krone und dunklerer Wassermitte braucht ein neues
Material (Vorschlag an den Haupt-Chat). **Enten und Gänse (6):** Das Tierbild „ente“ kommt aus
`belebungsbilder.py`; dort gehört es ausgetauscht. **Wegweiser lesbar (7):** Das Bild ist ein Wegweiser
ohne Schrift; der Seitenarm führt zum Westrand, wo Lockport anschließt. **Farmhaus (27):** Das wiederholte
Hausbild ersetzt mittel-1 für alle Karten. **Hochbeete (30):** Der Gutachter nennt sie sauber gemacht; sie
bleiben.

**Eisenbrücke** (`gutachten/weg-riverton-ironwood-2.md`), umgesetzt: Der Hang hat Felskanten mit
Treppen zwischen den Kehren (Klippenkacheln, Kante „klippe“), die Treppe nach Ironwood führt durch die
letzte Kante, das Widerlager mit Graffiti sitzt am Brückenkopf, die Möwe fliegt über der Wiese, der
Reiher ist weg, am Wärterhaus stehen kleine Laternen statt Straßenlaternen. Nicht umgesetzt: **Brücke
liegt flach:** Das Fachwerk mit steinernen Brückenköpfen ist in der Draufsicht gezeichnet; eine Brücke mit
sichtbarer Höhe über einem Einschnitt bräuchte ein eigenes Bild mit Unterseite und Schatten
(Bildwunsch).

Zweiter Durchgang an der Eisenbrücke (Detailbefunde, 10.11.2026): mehr Hocker am Imbiss, Dime am
Brückenkopf, Koppeln mit Gattern, Stall in der ersten Koppel, Schafherde, Felsen unregelmäßig, mehr Bäume
und Büsche am Hang, Hase entfernt.

## Regel 10.64 und Bootsschuppen in Lockport (niedrig-1, 10.11.2026)

- **Frachtkahn:** Die „Ashford Belle“ misst jetzt 24 × 5 Kacheln (vorher 6 × 3, kaum länger als ein
  Ruderboot). Das Bild `frachtkahn.png` ist im Bildwunsch `niedrig1_clubraum_schleuse.py` neu
  gezeichnet (384 × 80, sieben Lukendeckel, Steuerhaus mit Schornstein).
- **Schleuse:** Damit Kammer und Kahn passen, ist die Karte 18 Spalten breiter (74 statt 56). Die
  Kammer ist 28 Kacheln lang (Kahn + 4) und hat wie Becken und Oberwasser 7 Reihen Wasser (Reihen
  13–19). Die Stemmtore reichen über diese 7 Reihen und je eine Reihe Kaimauer; das Bild
  `schleusentor_stemm.png` ist dafür 32 × 144 (gleicher Bildwunsch).
- **Bootsschuppen:** Er steht jetzt am Westende des Uferwegs auf der Kaimauer, das Tor öffnet sich
  nach Süden zum Hafenbecken (Möbelangabe `zum_wasser`, damit die Prüfung „Vorderseite zur Wand“
  Wasser vor dem Tor zulässt). Der Weg endet damit nicht mehr stumpf im Gras (Gutachten Nr. 22).
  Der alte Wellblechschuppen ist der Werkstattschuppen auf dem Werftplatz.
- **Henriks Boot:** ein Ruderboot von 4 × 2 Kacheln im Oberwasser östlich der Kammer (vorher 5 × 2
  im Becken, wo jetzt der Kahn liegt); im Zustand `boot-an-land` liegt es auf dem Werftplatz.
- **Abweichung:** Ein Ruderboot ist nach 10.64 3–4 × 1,5; das Bild ist 4 × 2, weil es die Bordwand
  in der Schrägansicht mitzeigt.
- **Gefüllt nach dem Verbreitern:** drei Wohnhäuser mit Gärten am Nordufer, drei an der mittleren
  Reihe, zwei in der Südreihe. Der Dorfplatz ist wieder 12 Kacheln breit.

## Zweites Gutachten Runde 8: Antworten (niedrig-1, 10.11.2026)

Gutachten `docs/spiel/auftraege/gutachten/lockport-2.md` und `weg-cedar-riverton-2.md`. Der
Gutachter sah noch den Frachtkahn 6 × 3. Seit 3e2bf4af misst der Kahn 24 × 5, die Kammer ist 28 lang.

**Lockport außen:**

- **Spielzeughäuser (Regel 10.66):** Alle 18 Häuser von 4–5 × 4 sind weg. Es gibt keine Wohnhausbilder
  ab 5 × 5 außer den Blockhütten A und B, der Holzfällerhütte (alle 5 × 5) und dem Blockhaus
  (8 × 7). Diese stehen je zweimal an Nordufer und mittlerer Reihe. Die übrigen Plätze sind Gärten mit
  Gartenhäusern von mittel-1. In der Südreihe steht die Bäckerei.
- **Tore mit einem Flügel und ohne Laufsteg:** Das Stemmtor ist im Bildwunsch neu gezeichnet: zwei
  breite Flügel im V und darüber über die ganze Länge ein Bohlensteg mit Geländer.
- **Eisenwaren statt Schiffsausrüster:** Der Kramladen trägt jetzt das Schild „ANKER TAUE“.
- **Ruderboot:** Henriks Boot ist ein Holzruderboot (Boat 1), 4 × 2, im Oberwasser. Ein Motorboot
  gibt es nicht mehr.
- **Uferweg doppelt:** Erdweg und Pflaster sind jetzt ein gepflasterter Kai.
- **Rätseltafel im Gras zwischen Häusern:** Sie steht vor dem Haus der Schleusenwärterin.
- **Bank vom Brunnen weg:** Sie steht jetzt nördlich des Brunnens und schaut zu ihm.
- **Wasserstand in Kammer und Becken gleich:** Es gibt keine Kacheln für verschiedene Wasserstände.

**Gasthaus:**

- **Prallbretter wie ein Holzstapel:** Ein Kugelfang (Bildwunsch `kugelfang.png`: Bohlen,
  Lederpolster, Gummimatte) steht direkt am Bahnende.
- **Ofen nicht erkennbar:** Es ist jetzt der Kanonenofen aus der Siedlungshütte, vor der Wand.
- **Foto eine graue Platte:** Dort hängt jetzt ein gerahmtes Bild.
- **Fassgruppen ohne Grund:** Es bleiben nur die Bierfässer hinter der Theke; Milchkanne weg.
- **Leere Mitte:** Dort steht ein sechster Tisch mit Gläsern.
- **Kegler mit dem Rücken zur Bahn:** Er steht am Bahnanfang.

**Bahndamm:**

- **Abstellgleis ohne Weiche, Güterwagen quer und zu kurz:** Abstellgleis, Prellbock und Wagen sind
  weg. 15_Routen_Ereignisse nennt den Güterwagen mit Katze nur als Belebung bei der Vorbeifahrt eines
  Zuges, nicht als abgestellten Wagen.
- **Keine Nordböschung:** Die Krone hat vier Reihen (6–9), das Gleis liegt mittig. Nördlich davon
  zeigt ein Streifen dunkleren Grases mit heller Kante die Böschung, die vom Betrachter wegfällt
  (Bildwunsch `boeschung_nord.png`).
- **Bänke vom Gleis weg:** Der Bahnsteig ist drei Reihen tief. Die Bänke stehen längs zum Gleis
  (Seitenansicht), weil es keine Bank von hinten gibt.

**Zedernwald:**

- **Bach im Osten breit und gerade:** Er ist dort jetzt zwei Kacheln schmal und gewunden. Die Brücke
  ist vier statt fünf Kacheln lang.
- **Trittsteine am Ufer:** Je Feld liegt ein Stein, ins Wasser gerückt. Der Abzweig führt weiter nach
  Norden zu einer Bank.
- **Fahnenmast auf großem Sockel:** Es ist jetzt eine schlichte Fahne, daneben eine Feuerstelle.
- **Ziegen statt Rehe:** Die Szene nennt Reh und Hirsch. Welches Bild ein Tier bekommt, legt die
  gemeinsame Tierzuordnung (`tierarten.json`) fest; Wunsch an den Haupt-Chat.

### Gutachten Runde 8, zweite Prüfung: Kanalweg und Eisenbrücke (10.11.2026, mittel-4)

- **Kanalweg** (`weg-riverton-ironwood-1-2.md`): Werkstraße mit Mittel- und Randlinien und einem
  Gehweg für Laternen, Bank und Haltestelle; doppelter Wegweiser entfernt; Enten schwimmen im Wasser;
  im Zustand „graffiti“ ist die Wand von Ende zu Ende bemalt, der Satz nennt keine Leiter mehr. Nicht
  umgesetzt: **Durchfahrt unter der Brücke** – Draufsicht, die Brücke liegt über dem Wasser;
  **Fabrik** ist das Steinhaus des Pakets (mit Rolltor); **Hoftor, Gartenstichwege** bleiben.
- **Eisenbrücke** (`weg-riverton-ironwood-2-2.md`): Felskanten reichen bis an den Kanal, dort steigt
  der Kanal über eine Schleusentreppe (Tore an jeder Stufe) ab; Versprünge in den Kanten; die Ränder
  sind Wiese statt orange Platzhalter (`"hochflaeche": "gras"`); Graffiti-Turm am steinernen
  Brückenkopf statt der freien Mauer; Gatter in den Weiden; sechs Brückenbauer sitzen an den
  Klapptischen. Nicht umgesetzt: **Brücke flach** – Draufsicht.

### Eisenbrücke mit Höhe (Gemini-Bild, 10.11.2026, mittel-4)

Das Bild `eisenbruecke_hoch` zeigt die Brücke von der Seite mit steinernen Pfeilern und Höhe. Es
überspannt deshalb den Nord-Süd-Arm des Kanals kurz vor der Biegung (Reihen 48–53); der Pfad quert dort
nach Osten und führt am Ostufer hinunter zum Kai. Die alte flache Querung über den Westarm entfällt,
die Auslöser auf der Brücke (Nietenkopf, Zeitnot-Trick, Aussicht) und der Brückenwärter sind
mitgezogen, der Graffiti-Turm steht am östlichen Pfeiler. Damit ist der Befund „Brücke flach, kein
Kahn käme darunter durch“ erledigt.
