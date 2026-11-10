# Weg 8 und Crossroads: Geysirbecken, Prärie, Raststätte

Stand: 9.11.2026, nachts, Entwurf von mittel-3 für den Haupt-Chat. Ortsdokument nach
`docs/spiel/orte/README.md` (Ortsplan, Ortsbild, Abgleich, Bühnenbilder). Es umfasst Weg 8 von Summit
City nach Crossroads (`wegSummitCrossroads`: Geysirbecken und Prärie) und den Rastort Crossroads
(`crossroads.aussen`, `crossroads.raststaette`). Quellen: `05_Story_Bibel.md` 27.3, 28 (Tabelle der
Wege, L4 und L6), Szenen 92 und 93, Funde (Bisonhaar, Postkarte), Läden (Darlene);
`09_Weltbeschreibung.md` 5.11; `13_Wegenetz.md` Abschnitt 5 (S10, S13, Q3, Q4, N6);
`10_Sprueche_Schauplaetze_Varianten.md` L4 (Atomschach), L6 (Entenschach); `orte.json`. Maßstab:
`KARTENREGELN.md` 7a.2. Jahreszeit: Sommer.

Feld = (Spalte, Reihe), linke obere Kachel; Bereiche „Spalten / Reihen“. Norden ist oben.

## 1. Ortsplan

### 1.0 Lage in der Welt

```text
      [8 Summit City] (Südrand, wegCrossroads)
             │  Ranger-Tor S10 (Nadel von Summit City)
             ▼
      Geysirbecken „Steamwell Basin“ (Stege über heißem Boden, Bisons)
             ▼
      Prärie „Wide Plains“ (Weizen, Windräder, Sturmkeller)
             ▼  Schotterstraße
  Fernbus Q3 ◄══ Highway ══[9 Crossroads]══ Alte Minenstraße Q4 (Viehgatter S13) ══► Ghost Town
  ◄═ Wanderweg W9 (Westrand) → Pinewood Camp (mittel-4)
```

| Karte                              | Größe    | Lauf (Kacheln)              | Zeit (3,5/s) | Abzweige                                       |
| ---------------------------------- | -------- | --------------------------- | ------------ | ---------------------------------------------- |
| `wegSummitCrossroads.geysirbecken` | 30 × 170 | Nord → Süd mit Stegen ≈ 230 | ≈ 66 s       | Ranger-Station, Aussichtssteg am großen Geysir |
| `wegSummitCrossroads.praerie`      | 30 × 170 | Nord → Süd ≈ 180            | ≈ 51 s       | Farm mit Sturmkeller, Windrad                  |
| `crossroads.aussen`                | 64 × 48  | Nordrand → Raststätte ≈ 30  | ≈ 9 s        | Tankstelle, Parkplatz, Wanderweg, Minenstraße  |
| `crossroads.raststaette`           | 24 × 18  | Tür → Tresen ≈ 8            | ≈ 3 s        | Küche, WC                                      |

Weg 8 zusammen 340 Kacheln (7a.2: 280–400), etwa zwei Minuten zu Fuß.

### 1.1 Geysirbecken (30 × 170)

Der Erdweg kommt am Nordrand (14–15) von Summit City, führt an der Ranger-Station vorbei (Tor S10,
Rangerin Bell, Rätseltafel) und geht dann auf Holzstege (Dielen) über den hellen, heißen Sinterboden
des Beckens. Die Stege laufen im Zickzack zwischen dampfenden Quellen (Wasser mit Steinkante) und
Geysirkegeln. In der Mitte des Beckens stehen Bisons auf dem Steg (Belebung, Auslöser `bisons`), am
Zaun hängt ein Büschel Bisonhaar (`fundBisonhaar`). Im Süden wird der Boden wieder Gras, der Erdweg
verlässt die Karte am Südrand (14–15).

| Abschnitt (Reihen)        | Thema           | Zum Entdecken                                                   |
| ------------------------- | --------------- | --------------------------------------------------------------- |
| G1 Waldrand (0–20)        | Ankunft         | Kiefern, Ranger-Station, Tor S10, Bell (17, 14), Tafel (11, 16) |
| G2 Beckenrand (21–40)     | erster Dampf    | erste Quellen, Warnschilder                                     |
| G3 Westschleife (41–70)   | Sinter und Steg | Geysirkegel, Quellen links und rechts                           |
| G4 Großer Geysir (71–110) | Ausbruch        | großer Geysir am Aussichtssteg, Bisons (`bisons` (17, 92))      |
| G5 Bisonweide (111–150)   | Weide           | Zaun mit Bisonhaar (`fundBisonhaar` (11, 128))                  |
| G6 Waldrand Süd (151–169) | Abschied        | Kiefern, Bank                                                   |

### 1.2 Prärie (30 × 170)

Weizen bis an beide Ränder, mittendurch der Erdweg in leichten Kurven. Eine Farm mit Scheune, Silo
und Windrad, davor die Holzklappe des Sturmkellers (`sturmkeller`), wo Sturmjäger Ray Castillo
(Figur `ray`) sitzt. Ab Reihe 130 wird der Weg zur Schotterstraße (drei Felder) und verlässt die
Karte am Südrand (14–16) Richtung Crossroads.

| Abschnitt (Reihen)    | Thema       | Zum Entdecken                                     |
| --------------------- | ----------- | ------------------------------------------------- |
| P1 Feldrand (0–30)    | Weite       | Weizen, Vogelscheuche                             |
| P2 Windrad (31–70)    | Wind        | Windrad, Wassertrog                               |
| P3 Farm (71–110)      | Sturmkeller | Scheune, Silo, Sturmkeller (17, 95), Ray (19, 96) |
| P4 Feldweg (111–130)  | Ernte       | Strohballen, Traktor                              |
| P5 Schotter (131–169) | Straße      | Strommasten, Briefkasten, Schild nach Crossroads  |

### 1.3 Crossroads außen (64 × 48)

```text
 Spalte: 0     6-7         20   30-32           50          63
 R0–13  Feld N6 ║Erdweg zum Jahrmarkt║  ║Schotter║ Tankstelle mit Zapfsäulen
 R14–15 ══ Wanderweg W9 (Westrand) ══╗
        [RASTSTÄTTE 10–19 / 12–18] Tür (14, 19), Vorplatz aus Asphalt (6–29 und 33–56 / 19–21)
 R22–25 ══════════════ Highway (Asphalt, 4) ═══════════════════[Viehgatter S13 (58)]══
 R26    Zufahrten zu den Parkplätzen (Asphalt, 6 Felder breit)
 R27–40 Parkplatz: Werksbus, Food-Truck, Sattelzug                  Weide mit Rindern
```

Übergänge: `wegSummit` Nordrand (30–32, 0), `wegPinewood` Westrand (0, 14–15, Wanderweg W9 nach
Westen), `jahrmarkt` Nordrand (6–7, 0), `raststaetteTuer` (14, 19) vor der Tür der Raststätte. Die
Parkplätze haben in Reihe 26 eine Zufahrt vom Highway; in B steht der Werksbus mit dem Food-Truck
auf einem Schotterplatz. Der Highway läuft bis an beide Ränder (Fernbus nach Westen, Alte
Minenstraße nach Osten mit dem geschlossenen Viehgatter S13 bei Spalte 58; ein Übergang dorthin kommt
mit Q4 in Runde 6). Wegweiser in alle Städte an der Kreuzung (`wegweiser` (29, 20)).

### 1.4 Raststätte innen (24 × 18)

Nordwand (Reihen 0–2), dahinter die Hinterräume (3–5): die Großküche mit Kühlschränken, Herden unter
Hauben, Grill, Fritteuse, Spültisch und Vorratsregalen, daneben das WC. Eine Innenwand mit Wandfläche
(Reihen 6–8, Regel 39) trennt sie vom Gastraum (9–16); in ihr die Durchreiche, die Küchentür und die
WC-Tür. Vor der Durchreiche der lange Holztresen mit vier Hockern, Darlene dahinter, die Kasse zum Gast
hin. Darlenes Laden (Postkartenständer `postkarten`, Regale) steht vor der Innenwand, davor der lange
Varianten-Tisch (`variantenTisch`) mit drei Brettern und Hockern ringsum, Nova allein am Ecktisch. Tür
in der Südwand (12, 17). A: Küche links, WC rechts; B: WC links, Küche rechts; C: wie A, mit zwei
Toiletten, Spielautomaten und Kreidetafel.

### 1.5 Übergänge (Felder auf beiden Seiten)

| Auslöser hier                                | Gegenstück                                                         | Bemerkung                                          |
| -------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| geysirbecken `zurueckSummit` (14–15, 0)      | summitCity.aussen `wegCrossroads` (Südrand, zwei Felder; mittel-2) | `wenn: nadelSummitCity` (S10) auf der Seite Summit |
| geysirbecken `weiterPraerie` (14–15, 169)    | praerie `zurueckGeysirbecken` (14–15, 0)                           |                                                    |
| praerie `weiterCrossroads` (14–16, 169)      | crossroads.aussen `wegSummit` (30–32, 0)                           | Schotterstraße, drei Felder                        |
| crossroads.aussen `wegPinewood` (0, 14–15)   | wegCrossroadsPinewood.huetten `zurueckCrossroads` (mittel-4)       | Wanderweg W9 am Westrand, zwei Felder              |
| crossroads.aussen `raststaetteTuer` (14, 19) | raststaette `raststaetteAusgang` (12, 17); Ankunft (12, 16)        |                                                    |
| crossroads.aussen `jahrmarkt` (6–7, 0)       | jahrmarkt.festplatz `zurueckCrossroads` (23–24, 35)                | Nebenort N6, siehe `jahrmarkt.md`                  |

## 2. Ortsbild

**Steamwell Basin.** Hinter dem Ranger-Tor riecht die Luft nach Schwefel und nassem Holz. Der Boden
ist weiß und gelb und an den Rändern der Quellen orange; überall steigt Dampf auf, und manchmal
zischt irgendwo ein Geysir. Die Stege knarren. Bisons stehen, wo sie wollen, auch auf dem Steg, und
gehen erst, wenn man wartet. Rangerin Bell kennt jeden Geysir beim Namen.

**Wide Plains.** Danach nur noch Weizen, golden bis zum Horizont, ein Windrad, das sich quietschend
dreht, und ein Himmel, der im Westen dunkel wird. Ray Castillo, Tomás' Onkel, jagt Stürme und
spielt im Sturmkeller seiner Freunde Entenschach, wenn draußen der Twister vorbeizieht.

**Crossroads.** Wo der Highway die alte Schotterstraße kreuzt, steht Darlenes Raststätte: Tankstelle,
Parkplatz mit Lastern, der Werksbus aus Ironwood, Rosies Food-Truck. Drinnen riecht es nach Kaffee
und Pfannkuchen; an der Wand Postkarten aller Städte, in der Ecke der Varianten-Tisch mit allen
Spielarten, die man unterwegs gelernt hat. Hier trifft man alle wieder.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Karte        | Szene | Figuren                     | Auslöser (orte.json)                                                          |
| ------------ | ----- | --------------------------- | ----------------------------------------------------------------------------- |
| geysirbecken | 92    | Rangerin Bell (`bell`)      | `start`, `zurueckSummit`, `tafel`, `fundBisonhaar`, `bisons`, `weiterPraerie` |
| praerie      | 92    | Ray Castillo (`ray`)        | `zurueckGeysirbecken`, `sturmkeller`, `weiterCrossroads`                      |
| aussen       | 93    | Slick, Mira, Big Joe, Rosie | `wegSummit`, `raststaetteTuer`, `wegweiser`, `wegPinewood`                    |
| raststaette  | 93    | Darlene, Nova               | `raststaetteAusgang`, `variantenTisch`, `postkarten`                          |

### 3.2 Entscheidungen

| Element            | Entscheidung                                            | Grund                                                     |
| ------------------ | ------------------------------------------------------- | --------------------------------------------------------- |
| Vier Straßen       | Highway West–Ost, Schotterstraße Nord, Wanderweg West   | Bibel: Kreuzung von vier Straßen; Weg 8 und W9 sind Pfade |
| Viehgatter S13, Q4 | Gatter als Bild auf dem Highway im Osten, ohne Auslöser | Q4 und Darlenes Lieferung kommen in Runde 6               |
| Jahrmarkt N6       | freies Feld nordwestlich hinter der Raststätte          | 13 §5: „auf dem Feld hinter der Raststätte“, Bau später   |
| Fernbus Q3         | Haltestelle am Highway West                             | Schnellreise in Runde 6                                   |

### 3.3 Für Runde 6

**Ereignis Weg 8, Geysirblitz (Dokument 15, 2.10; Runde 7):** Auf der Sinterinsel am großen Geysir
„Old Patience“ liegt eine Holzplattform (Boden `dielen`) mit zwei Bänken, Infotafel
(`cc3Raetseltafel`, Ersatz bis `infotafel_geysir.png`) und Rangerhäuschen (`cc4Bootsschuppen`). Die
Felder bleiben frei begehbar:

| Auslöser              | A        | B        | C        | Ort                                              |
| --------------------- | -------- | -------- | -------- | ------------------------------------------------ |
| `ereignisGeysirblitz` | (5, 71)  | (14, 63) | (21, 62) | geysirbecken, Plattform                          |
| `spurPM5`             | (11, 73) | (9, 63)  | (18, 60) | geysirbecken, vor dem Rangerhäuschen (Infobrett) |
| `finchBauerD`         | (20, 73) | (8, 64)  | (15, 63) | geysirbecken, Ufer am Steg (Finkenzeichen)       |
| `seite09`             | (16, 95) | (16, 95) | (16, 95) | praerie, neben dem Sturmkeller                   |

**Belebung Weg 8 (Regel 10.53):** je Karte vier ansprechbare Statisten und sechs Tiere, in A, B, C
dieselben (Sätze unter `statist.wegSummitCrossroads.geysirbecken.*` und `….praerie.*`).
Geysirbecken: Fotograf, Ranger-Praktikant, Vogelbeobachterin (Bisons), Kind; Bisonherde,
Bisonweide, Raben, Murmeltiere, Eichhörnchen, Wapiti. Prärie: Farmerin, Radfahrerin, Landvermesser
(arbeitet für eine Firma aus Silicon Bay, passt zu Spur P5), Bauer (Präriehunde); Falke,
Präriehunde, Lerchen, Hühner, Hofhund, Hase.

Auslöser `fernbus` (Haltestelle), `viehgatter` (S13), `geysirAusbruch` (Ansehen, zur vollen
Stunde), `windrad` (Ansehen); Bilder: siehe Bestellung beim Haupt-Chat (Bison, Geysir, Dampf,
Sinterboden, Ranger-Tor, Sturmkeller, Weizen, Wegweiser der Städte, Viehgatter, Schild Crossroads).

## 4. Bühnenbilder

Die Inventare stehen in den Szenen (`beschreibung`) und folgen 1.1 bis 1.4; feste Felder sind die
Übergänge und Auslöser aus 1.5 und 3.1, die Figuren Bell (17, 14), Ray (19, 96), Darlene am Tresen,
Nova am Ecktisch.
