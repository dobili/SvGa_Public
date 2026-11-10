# Capital: Weg 11 (Seeufer, Leuchtturm) und Capital Arena (Akt 4)

Stand: 9.11.2026 nachts, Entwurf von mittel-1 für den Haupt-Chat. Ortsdokument nach
`docs/spiel/orte/README.md`. Es umfasst den Weg `wegGhostCapital` (Karten `seeufer` und `leuchtturm`,
Landschaft L7 „Große Seen mit Leuchtturm“, Variante König der Hügel) und die Capital Arena
(`capitalArena.aussen`, `.halle`). Quellen: `05_Story_Bibel.md` 25 bis 29 (Szenen 102 bis 109),
`09_Weltbeschreibung.md` 5.14, `10_Sprueche_Schauplaetze_Varianten.md` 3a (L7), `13_Wegenetz.md` 5
(S12), `orte.json`. Maßstab: `KARTENREGELN.md` 7a.2. Jahreszeit: Sommer, langer Abend.

Feld = (Spalte, Reihe), linke obere Kachel. Norden ist oben.

## 1. Ortsplan

### 1.0 Lage in der Welt

```text
                          N
            ≈≈≈≈≈≈≈≈ Großer See (bis zum Nordrand) ≈≈≈≈≈≈≈≈
 [Ghost Town] ══ Seeufer (W→O) ══ Leuchtturm (W→O) ══ [Capital Arena]
   Ostrand        Fähranleger       Landzunge, Turm       Vorplatz, Treppe
```

Weg 11 läuft von Ghost Town nach Osten am Südufer eines großen Sees entlang: erst ein Strand mit dem
Fähranleger, dann eine felsige Landzunge mit dem rot-weißen Leuchtturm, danach öffnet sich der Weg auf
den Vorplatz der Capital Arena. Die Sperre S12 (Wachmann von Perfect Move, „Nur für Gemeldete“) steht
am Westende des Seeufers; im Spiel sperrt der Ausgang in Ghost Town (`wegCapital`, `wenn:
fernpartieGespielt`), der Wachmann ist der sichtbare Grund dafür.

**Maße und Laufzeiten (7a.2: Weg ab Akt 2 zwei Karten, zusammen 280 bis 400 lang):**

| Karte                        | Größe    | Hauptweg (mit Kurven)          | Zeit zu Fuß |
| ---------------------------- | -------- | ------------------------------ | ----------- |
| `wegGhostCapital.seeufer`    | 150 × 30 | ≈ 165                          | ≈ 47 s      |
| `wegGhostCapital.leuchtturm` | 140 × 30 | ≈ 160 (mit Abstecher zum Turm) | ≈ 46 s      |
| **Weg 11 zusammen**          | 290      | ≈ 325                          | **≈ 93 s**  |
| `capitalArena.aussen`        | 64 × 48  | Westrand → Treppe → Tür 45     | ≈ 13 s      |
| `capitalArena.halle`         | 30 × 20  | Tür → Bühne 15                 | ≈ 4 s       |

### 1.1 Seeufer (`wegGhostCapital.seeufer`, 150 × 30)

```text
 Spalte: 0          40          60        80         110          149
 R0–8   ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈ Großer See ≈≈≈ [FÄHRE] ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
 R9–11  ···· Sandstrand · Treibholz · Möwen ··║Anleger║·· Strandkörbe · Boje ·······
 R12–19 ◄═ zurueckGhost (14–15) ═╗ Wachmann  Fährterminal  Tafel  ╔══ Kurven ══► weiterLeuchtturm (16–17)
        │ Dünengras              ╚══ Uferweg (Erde, 2 breit) ══════╝
 R20–29 │ Kiefernwald, Felsen, Picknickplatz, Bank mit Seeblick (Wald schließt dicht ab)
```

- Westrand: `zurueckGhost` (Spalte 0, Reihen 14–15), Ankunft (1, 14). Gleich daneben steht der
  Wachmann von Perfect Move (Statist) neben einem Absperrbock „Nur für Gemeldete“, zur Seite gerückt.
- Fähranleger (Spalten 58–61, Reihen 3–11): Holzsteg in den See, die Fähre liegt daneben; das
  Fährterminal (eigenes Bild) steht am Weg (Spalten 54–58, Reihen 12–16).
- Rätseltafel `tafel` am Weg bei (86, 13) (Holztafel mit Dach).
- Strandkörbe, Sonnenschirme, Boje, Treibholz, Muscheln; im Süden Kiefernwald mit Picknicktisch.
- Ostrand: `weiterLeuchtturm` (Spalte 149, Reihen 16–17).

### 1.2 Leuchtturm (`wegGhostCapital.leuchtturm`, 140 × 30)

```text
 Spalte: 0             50         70           100              139
 R0–8   ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈╗ Landzunge ╔≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
 R3–17                    ║ [LEUCHTTURM] [Wärterhaus] ║
 R9–19  ◄ zurueckSeeufer (16–17) ══ Uferweg ══ Abzweig zum Turm ══ Felsen ══► weiterCapital (20–21)
 R20–29 Wald, Felsen, Blick auf die Stadt im Osten
```

- Westrand: `zurueckSeeufer` (Spalte 0, Reihen 16–17), Ankunft (1, 16).
- Landzunge (Spalten 55–74, Reihen 3–17), Leuchtturm (eigenes Bild aus dem Katalog, 7 × 16) bei
  (62, 1), Fuß in Reihe 16; Wärterhaus von Abe Lindgren rechts davon, Bank und Fernrohr; Abe steht vor
  der Tür. Fund `fundLinse` (alte Linse des Leuchtfeuers) am Turmfuß.
- Ostrand: `weiterCapital` (Spalte 139, Reihen 20–21).

### 1.3 Capital Arena außen (`capitalArena.aussen`, 80 × 60 seit Runde 7)

```text
 Spalte: 0          19                        44          63
 R0–1   Bäume, Hecke
 R2–35  Park  │ [CAPITAL ARENA: Prachtbau, Kuppeln, Glasdach]  │ Park, Fahnen
               │            Tür (Mitte), große Freitreppe        │
 R36–46 ◄ wegGhost (40–41) ═══ Vorplatz (Pflaster): Fahnen, Brunnen, Food-Trucks, Bänke ═══
 R47    Hecke
```

- Die Arena ist ein historischer Prachtbau mit Freitreppe (Bild aus dem Katalog, 25 × 34), Spalten
  19–43, Reihen 2–35. Die untersten Reihen des Bildes sind Treppe und bleiben begehbar
  (`"frei_unten"`). Tür `halleTuer` oben auf der Treppe (Mitte), Auslöser `treppe` auf der Treppe
  (Szene 109: Abschied auf der Treppe).
- Westrand: `wegGhost` (Spalte 0, Reihen 40–41), Ankunft (1, 40).
- Vorplatz mit Fahnenmasten links und rechts der Treppe, Brunnen, zwei Food-Trucks, Bänke, Laternen,
  Fans mit Schals (Statisten), Reporter mit Kamera.

**Runde 7 (mittel-1, 10.11.2026):** Die Karte wuchs auf 80 × 60 (Regel 10.51, große Stadt: 20 Gebäude
je Viertel). Der Park um die Arena ist Stadt geworden:

- A: Arena in der Mitte (Spalten 27–51); links und rechts je zwei Häuserreihen an einer Querstraße
  (Reihen 14–15) mit Gassen neben der Arena; oben Post, Kaufhäuser, Wohnhäuser, Laden, unten
  Feuerwache, Hochhaus und das Polizeirevier. Vorplatz Reihen 36–46 wie bisher, darunter eine Reihe
  Läden, Märkte und Stadthäuser (Reihen 47–56) mit zwei Gassen hinunter zur Fußgängerstraße (Reihen
  57–58). 22 Gebäude.
- B: Arena am Ostrand (Spalten 54–78), zwei lange Häuserreihen links, Steinplatz. 24 Gebäude.
- C: Arena am Westrand (Spalten 1–25), Häuserreihen rechts. 23 Gebäude.
- Neue Möbel `ca8` (Läden, Märkte, Kaufhäuser, Post, Wachen, Polizeirevier, Feuerwache, Landhaus,
  Hoch-, Wohn- und Reihenhäuser aus Modern Exteriors), alle Kulissen ohne Innenraum.
- Ostrand: `innenstadt` (Spalte 79, Reihen 57–58), die Fußgängerstraße führt ins neue Viertel.
- Belebung (alle Varianten gleich): 13 Statisten, davon 10 mit Satz (Schachlehrer am Abend, zeigt
  `immergruenePartie`; Eisverkäuferin, Tourist mit
  Stadtplan, Rentnerin mit Lasker, Student mit Deep Blue, Busfahrer mit Perfect Move (morgens),
  Straßenmusiker (abends), Vater, Schülerin mit Abzugsschach, Junge mit Autogrammheft in zwei Teilen), dazu
  Fans, Reporterin, Polizist (morgens); Tauben, Spatzen, Hund, Katze, Eichhörnchen, Amseln. Sätze unter `statist.capitalArena.aussen.*`.

### 1.3a Innenstadt (`capitalArena.innenstadt`, 80 × 60, neues Viertel)

```text
 Spalte: 0       24/25                      54/55                    79
 R1–13   Häuserreihe │ Häuserreihe            │ Häuserreihe
 R14–15  ═══ Gasse ═══════════════════════════════════════════════
 R16–31  Häuserreihe │ Häuserreihe            │ Häuserreihe
 R32–36  ═══ Allee (Asphalt 33–35, Gehwege 32 und 36), Bus ═══════
 R37–55  Hochhäuser  │ U-Bahn-Platz: Kiosk,   │ Polizeirevier
                     │ Abgang hinter Bauzaun  │
 R56–58  ◄ arena (57–58) ═══ Fußgängerstraße ════════════════════
```

- Szene mit `"viertel": true`; zählt wie eine Außenkarte (Regel 10.51 und 10.53). Gebäude: A 28,
  B und C je 27.
- **U-Bahn-Platz** (Dokument 15, 2.14, Treffpunkt K5): der alte Abgang zum stillgelegten U-Bahnhof
  mit Schild „Subway“, verschlossen mit Rollgitter, Kette und Schloss (`ci8Gitter`, für Runde 6 auch
  `ci8GitterOffen`), daneben ein Kreidespringer auf dem Pflaster und ein Aufsteller „Bald“. Gitter: A
  (39, 45), B (14, 45), C (64, 45). A Platz in der Mitte (Spalten 26–53), B
  im Westen (1–28), C im Osten (51–78). Der Bahnhof selbst (Bahnsteig, Fliesen, Graffiti) kommt mit
  dem Ereignis in Runde 6 als Innenraum.
- Westrand: `arena` (Spalte 0, Reihen 57–58), Ankunft (1, 57).
- Belebung (alle Varianten gleich): 12 Statisten, 8 mit Satz (Zeitungsverkäuferin, Kellner mit dem
  Washington Square Park, Bauarbeiter mit dem Spieß, Frau mit Dackel, Junge mit Kapuze, der vom
  Kreidepferd am Gitter erzählt (zwei Teile, Antwort von Ambrose), Geschäftsfrau mit Perfect Move,
  Schüler mit Judit Polgár, Straßenkehrer mit dem Zentrum); dazu Taxifahrer, Touristen, Jogger,
  Lieferfahrer; Tauben, Dackel, Katze, Spatzen, Möwen, Eichhörnchen. Sätze unter `statist.capitalArena.innenstadt.*`.

### 1.4 Halle (`capitalArena.halle`, 30 × 20)

Großer Saal 30 × 20, Tür in der Mitte der Südwand (Spalte 15). Nordwand mit Fenstern und Bannern;
Tribünen aus Holz an der Nordwand und an den Seiten; in der Mitte die Bühne mit dem Finaltisch; davor
zwei Brettreihen für die Vorrunde; Pressetisch (`pressetisch`) an der Ostseite, Fanshop (`fanshop`)
neben dem Eingang, Turniertafel (`turniertafel`) an der Westwand.

### 1.5 Übergänge (Felder auf beiden Seiten)

| Von (Karte, Auslöser, Feld)                                      | Nach (Karte, Auslöser, Feld; Ankunft)                                    | Lage                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| ghostTown.aussen `wegCapital` (Ostrand, Spalte 55, Reihen 21–22) | seeufer `zurueckGhost` (Westrand, Reihen 14–15; Ankunft (1, 14))         | Erdweg je zwei Felder; `wenn: fernpartieGespielt` (S12), wie heute       |
| seeufer `weiterLeuchtturm` (Ostrand, Reihen 16–17)               | leuchtturm `zurueckSeeufer` (Westrand, Reihen 16–17; Ankunft (1, 16))    | Uferweg je zwei Felder                                                   |
| leuchtturm `weiterCapital` (Ostrand, Reihen 20–21)               | capitalArena.aussen `wegGhost` (Westrand, Reihen 40–41; Ankunft (1, 40)) | Weg je zwei Felder; Dialog `capital-arena-aussen.ankunft_zu_fuss` bleibt |
| capitalArena.aussen `innenstadt` (Ostrand, Reihen 57–58)         | innenstadt `arena` (Westrand, Reihen 57–58; Ankunft (1, 57))             | Fußgängerstraße je zwei Felder (Runde 7)                                 |
| capitalArena.aussen `halleTuer` (Tür oben auf der Treppe)        | halle `halleAusgang` (15, 19); Ankunft (15, 18), Blick nach oben         | Südfassade ↔ Südwand                                                     |

## 2. Ortsbild

Nach dem Staub von Ghost Town riecht die Luft plötzlich nach Wasser. Der See ist so groß, dass man
das andere Ufer nicht sieht; Wellen laufen auf einen hellen Sandstrand, Möwen stehen im Wind, und
weit draußen zieht ein Frachter. Am Anfang des Weges steht ein Wachmann in einer Jacke mit dem Logo
von Perfect Move neben einem Absperrbock und schaut auf eine Liste; wer gemeldet ist, darf vorbei.
Ein langer Holzsteg führt zur Fähre, die gerade anlegt; am Fährhäuschen hängt der Fahrplan. Familien
sitzen in Strandkörben, ein Kind lässt einen Drachen steigen, unter den Kiefern riecht es nach Harz.

Hinter einer Biegung wird das Ufer felsig. Auf einer Landzunge steht der Leuchtturm, rot und weiß
gestreift, mit einer Laterne, die in der Abendsonne glänzt. Daneben ein kleines Wärterhaus mit einer
Bank davor, auf der Abe Lindgren sitzt, ein alter Mann mit Kapitänsmütze, der von Stürmen erzählt und
ein Schachbrett auf den Knien hat. Von hier sieht man im Osten zum ersten Mal die Stadt: Kuppeln,
Glas, Fahnen.

Die Capital Arena ist kein Betonklotz, sondern ein alter Prachtbau mit Kuppeln und Glasdach, in dem
heute die Landesmeisterschaft spielt. Eine breite Freitreppe führt hinauf, links und rechts wehen
Fahnen, auf dem Vorplatz plätschert ein Brunnen, zwei Imbisswagen verkaufen Limonade und Brezeln,
und Fans aus allen Städten des Spiels laufen mit Schals herum. Der Sommerabend ist lang: Wenn
{held} nach dem Finale allein auf der Treppe sitzt, liegt das Licht noch golden auf den Stufen.

Drinnen ist es kühl und laut: Holztribünen bis unter die Fenster, Reihen von Brettern, eine Bühne
mit dem Finaltisch unter einem Banner, ein Pressetisch mit Laptops und Mikrofonen, und am Eingang
ein Fanshop mit Schals und T-Shirts.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Szene           | Karte               | Verlangt                                         | Auslöser, Figuren (orte.json)                                    |
| --------------- | ------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| S12 (Sperre)    | seeufer             | Wachmann „Nur für Gemeldete“                     | Statist (kein Auslöser; die Sperre sitzt in Ghost Town)          |
| 102 Leuchtturm  | seeufer, leuchtturm | Abe erzählt, König der Hügel                     | Figur `abe`, `tafel`, `fundLinse`                                |
| 103 Arena       | aussen, halle       | Halle mit Tribünen, Reporter, Eltern             | `halleTuer`, `turniertafel`; Figuren mama, juno, lin, grahamHale |
| 104 Vorrunde    | halle               | Bretter für vier Partien                         | Figuren bea, marcus, nova, tobias                                |
| 105 Aussage     | halle               | Pressetisch                                      | `pressetisch`, turnierleiterin                                   |
| 106 Halbfinale  | halle               | Tisch mit Funkprüfer                             | kade                                                             |
| 107, 108 Finale | halle               | Bühne mit Finaltisch, Publikum aus allen Städten | victor                                                           |
| 109 Abschied    | aussen              | Treppe vor der Halle, Abendlicht                 | `treppe`                                                         |

### 3.2 Was bleibt, was sich ändert, was entfällt

- **Bleibt:** See bis zum Nordrand, Strand, Fähre, Leuchtturm, Wärterhaus, Prachtbau mit Treppe,
  Fahnen, Brunnen, Tribünen, Bühne, Pressetisch, Fanshop.
- **Ändert sich:** Der Wachmann ist ein Statist, weil die Sperre am Ausgang von Ghost Town liegt.
- **Für Runde 6:** Auslöser zum Ansehen ohne Eintrag in orte.json (Fähre, Strandkorb, Fernrohr am
  Leuchtturm, Fahnen, Banner) stehen nur als Gegenstände auf der Karte.

### 3.3 Befunde und offene Punkte

1. Rand zu Ghost Town mit niedrig-1 abgestimmt: ghostTown.aussen Ostrand (Spalte 55, Reihen 21–22) ↔ seeufer Westrand (Reihen 14–15), je zwei Felder Erdweg.
2. Bilder (beim Haupt-Chat bestellt, bis dahin Ersatz): Bühne für das Finale, Banner
   „Landesmeisterschaft“, Pressetisch mit Laptops und Mikrofonen, Fanshop-Stand.
3. **Für Runde 6 (Felder der Fundstellen, frei begehbar):** Nacht der Kreidespringer (Dokument 15,
   2.14) in `capitalArena.innenstadt` vor dem Bauzaun am U-Bahn-Abgang:
   - `ereignisKreidenacht` (vor dem Gitter): A (40, 47), B (15, 47), C (65, 47);
   - `kreide5` (Kreidespringer am Gitter): A (38, 47), B (13, 47), C (63, 47).
4. Bilder für das Viertel: eigene Bilder `gitter_ubahn.png`, `kreidespringer.png`, `plakat_bald.png`.
5. **Weg 11, Weltschachtag (Dokument 15, 2.13; Runde 7):** Am Ostende des Seeufers stehen in allen
   Varianten die Bühne (138, 9) mit zwei Lautsprechern, dazwischen eine weiße und eine schwarze Fahne, davor
   eine lange Tafel aus fünf Klapptischen mit Brettern (`ca8KlapptischBrett`) (Spalten 122–135, Reihen 12–13) für das Simultan, westlich davon Eiswagen und Tacowagen
   (A (100, 12)/(110, 12), B (105, 11)/(115, 11), C (100, 10)/(110, 10)). Am Leuchtturm stehen Odettes
   Wohnmobil (A (78, 9), B (112, 9), C (37, 9)) und ein Plakat (A (58, 10), B (109, 10), C (20, 10);
   eigenes Bild `plakat_20juli.png`). Über der Tafel hängt zwischen zwei Lichtermasten (121, 9) und (133, 9) eine Lichterkette.
   - `ereignisWeltschachtag`: Seeufer (140, 13), vor der Bühne;
   - `seite12` am Anleger: Seeufer (59, 10);
   - `finchKoenig` (Odette am Wohnmobil): Leuchtturm A (78, 13), B (113, 13), C (38, 13);
   - `wandererCapital`: Seeufer (120, 15), am Weg neben der Tafel.
6. **Belebung Weg 11 (Sommer):** Seeufer: Wachmann (Perfect Move), Schwimmerin (20. Juli, FIDE 1924),
   Geschwister beim Steinehüpfen (Enten wie Bauern, mit Antwort von Ambrose), Drachenkind und
   Picknickfamilie ohne Satz; Möwen, Enten, Hecht, Eichhörnchen, Specht, Schwan. Leuchtturm:
   Spaziergänger (Hund gegen Leuchtturm, Tiergeschichte), Fotograf (Carlsen 2882), Radfahrerin (Welt),
   Angler ohne Satz; Möwen, Hund, Robbe, Kormoran, Krebs, Seeadler.
7. Halle (Runde 7): vier Statisten mit Satz (Zuschauer mit den Kiebitzen, Reporter mit der ersten
   Olympiade 1927, Mutter mit Brotdose, Ordner).

### 3.4 Runde 6 (mittel-1, 10.11.2026): spielbar

- **Neuer Innenraum `capitalArena.ubahnhof`** (36 × 20, A/B/C): stillgelegter Bahnsteig mit
  Graffitizug hinter einem Geländer, Pfeilern, Bänken, Drehkreuzen und drei Turniertischen. Ausgang
  `ubahnAusgang` (18, 19) ↔ Innenstadt `ubahn` vor dem Rollgitter (A (40, 47), B (15, 47), C
  (65, 47)), `wenn: ubahnOffen`.
- **Innenstadt:** `kreide5` neben dem Kreidespringer (A (38, 47), B (13, 47), C (63, 47)): Fund
  `kreide5`, dann Losungsrätsel (Runde `capitalArena.kreideraetsel`, eine Aufgabe Doppelangriff);
  das Losungswort öffnet das Gitter. Die Felder ersetzen `ereignisKreidenacht` aus 3.3, der Auslöser
  steht jetzt unten im Bahnhof.
- **U-Bahnhof:** Figur Mo (`capitalArena.mo`, (18, 10)), `ereignisKreidenacht` vor dem mittleren Tisch
  (18, 14). Quest `capitalArena.kreidenacht` (klein): drei Blitzpartien 3 + 2
  (`capitalArena.kreidenacht1` gegen Dime, `2` gegen Mama Bear, `3` gegen Victor mit Kapuze), dann
  Victors Moment ohne Kamera, Lohn Karte Sanduhr (eine eigene Zeitkarte „Kreide“ fehlt noch), Foto,
  30 Münzen.
- **Weg 11, Seeufer:** Sperre S12 am Übergang `weiterLeuchtturm` (`wenn: capitalZugang` =
  `fernpartieGespielt` und `novaBitteGehoert`, der Wachmann erklärt). `ereignisWeltschachtag` (140, 13)
  mit Quest `wegGhostCapital.weltschachtag` (klein): Simultan `wegGhostCapital.simultan`
  (partieformen.json: fünf Stellungsduelle aus Kapitel 6, Abschnitt 6.8, Abbildungen 6.33 bis 6.38,
  gegen Slick, Big Joe, Mrs. Okafor, Céleste und Hollis; drei Punkte bestehen), danach Abes Partie gegen die Welt, Foto, 25
  Münzen. Figur Wanderer (`wegGhostCapital.wanderer`, (124, 15)) nimmt die Buchseiten zurück.
  `seite12` am Anleger (A (59, 8), B (99, 8), C (33, 8)), `faehrterminal` (A (48, 12), B (88, 12), C
  (22, 12)).
- **Leuchtturm:** Figur Odette Finch (`wegGhostCapital.odette`, A (78, 14), B (114, 14), C (43, 13)):
  Hinweise nach Zahl der Figuren, ab 15 der König (Fund `finchKoenig`) und das Meisterproblem (Falle
  von Légal, Begegnung `wegGhostCapital.meisterproblem` als Stellungsduell aus der Vorführung `finchFalle`), danach Fund
  `finchsBuchsbaum` (Extra). `plakatWeltschachtag` vor dem Aufsteller (A (58, 13), B (110, 14), C
  (20, 13)).
- **Arena:** `fahnen` (A (31, 44), B (59, 44), C (5, 44)); Figur Wanderer (`capitalArena.wanderer`,
  (16, 43)) schenkt nach dem Finale das Buch (Fund `buchVonGrundAuf`, Bretthintergrund „Manuskript“).
  Halle: `banner` (12, 3); Dr. Lin erkennt die Mappe mit allen sechs Spuren (Knoten `lin_mappe`, Fund
  `fotoMappe`).
- **Quests der Sammelstränge** (alle klein): `wegGhostCapital.finchJagd` (Start am Flohmarkt,
  Auslöser `ereignisFlohmarkt` auf `wegMapleCedar.landstrasse`; Ende bei Odette),
  `capitalArena.verloreneSeiten` (Start bei `seite00`; Ende Buch nach dem Finale),
  `capitalArena.spurenPerfectMove` (Start bei `spurPM1` auf `wegRivertonIronwood.bruecke`; Ende bei Dr.
  Lin), `capitalArena.kreidespringer` (Start bei `kreide1` ebenda; Ende in der Kreidenacht). Die Zahl
  der Funde prüft Ink über die gemeinsamen Zähler `finchFiguren`, `buchseiten`, `spurenPM`,
  `kreideTreffpunkte`; keine `voraussetzung`, damit eine verpasste Fundstelle den Strang nicht sperrt.

### 3.5 Runde 9 (mittel-1, 10.11.2026): Mängel aus der Variantenwahl

- **Außen (`capitalArena.aussen`, A):** Höfe und Gassen zwischen den Häusern sind helle Platten statt
  Rasen, nur der Park um die Arena bleibt grün. Bordstein an jeder Kante von Pflaster zu Rasen. Die
  Läden heißen nach ihrem Zweck (Kaufhaus, Sport, Blumen, Kaffee, Apotheke, Mode, Spielwaren,
  Bücher, Musik) und haben kein Vorhängeschloss mehr (Bildwunsch `laeden_schilder.py`). Pflanzkübel
  mit Bäumen in den Höfen. Die Arena bleibt am oberen Rand: Sie füllt die Karte bis zum Vorplatz,
  nach Norden liegt nichts, was die Geschichte braucht, und ein Umbau würde Übergänge und Auslöser
  verschieben.
- **Innenstadt (`capitalArena.innenstadt`, A):** dicht bebaut, Höfe gepflastert statt Wiesen. Die
  Allee hat eine gestrichelte Mittellinie und Bordstein zu den Gehwegen. Der U-Bahn-Abgang ist ein
  sichtbarer Treppenschacht mitten auf dem Platz (37, 42). Die zweite kleine Polizeiwache ist ein
  Wohnhaus. Statt sechsmal MARKET stehen Elektro, Warenhaus, Tabak, Sport, Schuhe, Kaufhaus,
  Galerie, Uhren, Wohnen und Feinkost an den Läden.
- **Halle (`capitalArena.halle`, C):** helle Wand (`creme`) und dunkles Holz (`holzDunkel`, jetzt
  eine ruhige Diele). Die Turniertafel hängt an der Nordwand über dem Saal (19, 1), der Auslöser
  `turniertafel` steht davor (19, 3). Die zwei quer stehenden Tribünen sind weg, an ihrer Stelle
  stehen Pflanzen. Nova und die Statisten stehen frei, nicht in Stühlen.
- **U-Bahnhof (`capitalArena.ubahnhof`, A):** Der Ausgang ist eine Treppe nach oben (17, 16) unter
  einem halb hochgezogenen Rollgitter (Bildwunsch `ubahn_rollgitter.py`), passend zur Kreidenacht
  („das Rollgitter geht um Mitternacht herunter“). Die Drehkreuze stehen als Sperre davor
  (15, 13) und (20, 13), Hocker an den Klapptischen.
- **Seeufer (`wegGhostCapital.seeufer`, A):** Der Strand ist heller Sand aus LimeZus Strandbogen
  (Material `strand` zeigt jetzt `21_Beach`, vorher war es oranger Boden; das betrifft auch den
  Strand der Raststätte). Die Strandzunge hat runde Ecken. Das Fährhaus ist ein Holzhaus mit
  Satteldach, Schalter und Uhr im Giebel (Bildwunsch `faehrhaus.py`), der Auslöser
  `faehrterminal` bleibt. Der Steg hat einen Kopf nach Osten (60–69, 7–8), an dem die Fähre
  längsseits liegt. Der Absperrbock steht am Wegrand neben dem Wachmann (2, 12). Die Kiefern
  stehen locker gestreut mit unregelmäßigem Waldrand und einer Lichtung um den Picknicktisch.
- **Leuchtturm (`wegGhostCapital.leuchtturm`, A):** Die Landzunge ist breit am Ufer und läuft zur
  Spitze schmal aus (Reihen 1–8, x 47–82), mit Felsen rings am Ufer. Der orange Erdstreifen
  zwischen See und Wiese ist Wiese geworden. Der Weg läuft in Bögen durch Stützpunkte, mit einem
  Abzweig zum Turmfuß. Die Kiefern stehen locker gestreut unter dem Weg, der Waldrand schwingt.
- Zustände: keine neuen. Die Geschichte ändert die Arena-Karten nicht sichtbar; das Gitter am
  Abgang ist nach `ubahnOffen` nur offen, und das zeigt schon der Übergang.

### 3.6 Gutachten Runde 9: Antworten (mittel-1, 10.11.2026)

Gutachten `docs/spiel/auftraege/gutachten/capital-arena-bayou.md`.

- **Außen, Schilder (2):** Feuerwache, Polizei und Post tragen deutsche Schilder (Bildwunsch
  `schilder_deutsch.py`). Die zweite Eisenwarenhandlung ist ein Café. „Hot Dogs“ am Imbisswagen
  bleibt, das Wort ist im Deutschen geläufig.
- **Außen, Fahrbahn (3):** Vor Feuerwache, Arenatreppe und Polizeirevier läuft eine Straße
  (Reihen 36–38) mit Mittellinie (`"markierung": ["s"]`). Feuerwache und Revier fahren auf sie
  hinaus. Imbisswagen, Laternen, Limonadenwagen und Fahnen stehen jetzt südlich davon auf dem
  Platz, der Auslöser `fahnen` liegt bei (34, 44).
- **Außen, Kuppeln (1):** Die Arena bleibt, wie in 3.5 begründet. Ein Verschieben hätte die
  Treppe auf die Straße gesetzt.
- **Innenstadt (1, 2, 4):** Der Bus in Seitenansicht ist weg. Statt der Möwen auf der Allee laufen
  Krähen auf dem Platz. Feuerwache und Polizei stehen nur noch an der Arena. In der Innenstadt
  stehen dafür ein graues Stadthaus (27, 16) und ein großes Bürohaus (57, 38). Die Post hat ein
  deutsches Schild.
- **Halle (1):** Die Beschreibung folgt jetzt dem Bild: helle Wände, dunkler Holzboden, Tribünen
  links und rechts der Bühne an der Nordwand, Turniertafel an der Nordwand.
- **U-Bahnhof (1, 4):** Das Rollgitter hängt sichtbar über dem Ausgang (`vorn`). An den
  Klapptischen sitzen drei Blitzspieler auf den Hockern.
- **Seeufer (Weg 11):** Die Fähre ist eine große weiße Seefähre, 20 × 6 Kacheln (Regel 10.64,
  Bildwunsch `weg11_bilder.py`). Sie liegt längsseits an einem Stegkopf, der genauso lang ist
  (60–79, 7–8). In der Mitte liegt der Weg auf dem Strand, nicht als zweiter Erdweg daneben.
  Absperrbock und Wachmann stehen am Weg (3–5, 14). Die Imbisswagen stehen auf einem
  Plattenplatz, Verkäufer davor. An den Schachtischen stehen Hocker, zwei Spieler sitzen.
- **Leuchtturm (Weg 11):** Die alte Linse ist eine Fresnel-Linse aus Glasringen im
  Messinggestell auf einer Palette (`weg11_bilder.py`). Offen: Landzunge (1, die Karte endet
  oben), Bank mit Blick auf den See (4), Wohnmobil ohne Zufahrt (5), Wegstufen (6).
- Offen: schmale graue Häuser (außen 5), Allee in drei Stücken (Innenstadt 3), Stühle neben den
  Tischen in der Halle (2, 3), Treppe gestreift und Kreidespringer blass (U-Bahnhof 2, 3).

### 3.7 Zweites Gutachten Runde 9: Antworten (mittel-1, 10.11.2026)

Gutachten `docs/spiel/auftraege/gutachten/mittel-1-runde9-2.md`.

- **Innenstadt, Allee (1):** Der Asphalt läuft durch, an den zwei Quergassen liegen Zebrastreifen
  (Bild `zebrastreifen_3` von mittel-3) statt Kopfsteinstücken.
- **Innenstadt, Bus (2) und Halle, „roter Saal“ (1):** Beide Beschreibungen sind seit der ersten
  Antwort angepasst (kein Bus, helle Wände und dunkles Holz). Der Gutachter sah noch den alten
  Text.
- **Leuchtturm, Landzunge (1):** Links und rechts schneiden zwei Buchten ins Ufer (Westbucht bis
  Reihe 11, Ostbucht bis Reihe 13). Die Landzunge ragt jetzt zwölf Reihen in den See.
- **Leuchtturm, Wohnmobil (10.65):** Es steht auf der Wiese jetzt von vorn (`fz11WohnmobilAb`,
  (82, 8)) statt in Seitenansicht.
- Offen: Ausfahrt mit abgesenktem Bord an Feuerwache und Polizei, Kreidespringer blass, Platz
  dünn, Turm in Seitenansicht, leere Wiese am Leuchtturm.

### 3.8 Fahrzeuge aus Gemini Teil 2 (mittel-1, 10.11.2026)

Bilder aus `spiel/eigene/` (privat f285318f), alle in Vorder- oder Heckansicht nach 10.65, mit
Kollision.

- **Seeufer:** Eiswagen (`gc12Eiswagen`, (102, 10)) und Hotdogwagen (`gc12Hotdogwagen`, (112, 10))
  ersetzen die zwei Wagen in Seitenansicht. Der Sonnenschirm steht dazwischen (106, 9).
- **Arena außen:** Der Imbisswagen ist der Hotdogwagen von vorn (`ca12Hotdogwagen`, (6, 39)).
- **Leuchtturm, Wohnmobil:** Es steht auf einer Schotterfläche (81–84, 8–13), eine Schotterspur
  (82–83, 14–15) führt zum Weg.

## 4. Bühnenbilder

Möbel mit Vorsilbe `gc7` (Weg) in `moebel/weg-ghost-capital.json` und `ca7` (Arena) in
`moebel/capital-arena.json`. Stil: natur und klassisch am See, klassisch und modern in der Arena.
Die Szenen und Varianten stehen in `inhalte/abenteuer/szenen/`; Einzelheiten in deren Beschreibung.
