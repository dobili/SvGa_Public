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

### 1.3 Capital Arena außen (`capitalArena.aussen`, 64 × 48)

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

## 4. Bühnenbilder

Möbel mit Vorsilbe `gc7` (Weg) in `moebel/weg-ghost-capital.json` und `ca7` (Arena) in
`moebel/capital-arena.json`. Stil: natur und klassisch am See, klassisch und modern in der Arena.
Die Szenen und Varianten stehen in `inhalte/abenteuer/szenen/`; Einzelheiten in deren Beschreibung.
