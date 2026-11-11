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

**Ortsteil (Runde 7, Regel 10.51):** Crossroads ist ein kleiner Ort und hat in jeder Variante
mindestens zwölf Gebäude, die meisten Kulissenhäuser ohne Innenraum. Südöstlich des Highways führen
zwei Schottergassen zu Motel, Garage, Hühnerstall, Bauernhaus, Kapelle, Eisenwarenladen und Lagerhaus;
im Norden steht eine Scheune auf dem Feld beim Jahrmarktweg, neben der Tankstelle ein Wohnwagen,
südlich des Parkplatzes zwei Wohnwagen (A). B legt die Häuser südwestlich an eine Gasse unter dem
Schotterplatz, Motel und Wohnwagen nordöstlich; C hat die Gassen wie A, aber andere Häuser.

**Belebung (Regel 10.53):** 13 Statisten in allen Varianten gleich, neun davon ansprechbar
(`statist.crossroads.aussen.*`): Fernfahrerin, Mechaniker, Motelwirtin, Küsterin, Kreidekind, Postbote,
Rentner, Farmer, Anhalterin und Hundebesitzerin (zeigt die Gabel Tissir–Dreew, `zeigt: tissirDreev`);
dazu Tankwart, Tomás und Autowäscher ohne Satz. Tiere:
Hund, Rinder auf dem Feld, Krähen, Motelkatze, Spatzen. In der Raststätte vier ansprechbare
Statisten (`statist.crossroads.raststaette.*`): Kellnerin, Fernfahrer, Variantenspielerin,
Schausteller.

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
(`cr8InfotafelDach`) und Rangerhäuschen (`cc4Bootsschuppen`). Die
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
Präriehunde, Lerchen, Hühner, Hofhund, Hase. Im Geysirbecken zeigt die Schachlehrerin das erstickte Matt
Unzicker–Sarapu (`zeigt: unzickerSarapu`).

Auslöser `fernbus` (Haltestelle), `viehgatter` (S13), `geysirAusbruch` (Ansehen, zur vollen
Stunde), `windrad` (Ansehen); Bilder: siehe Bestellung beim Haupt-Chat (Bison, Geysir, Dampf,
Sinterboden, Ranger-Tor, Sturmkeller, Weizen, Wegweiser der Städte, Viehgatter, Schild Crossroads).

### 3.4 Runde 9: Mängel, Muster, Zustände (mittel-3, 10.11.2026)

Auftrag `runde9_uebrige_karten.md`: drei Mängel aus `variantenwahl.md`, die fünf Muster, Zustände (10.63).

**Crossroads außen** (`crossroads-aussen`)

- Mangel 1: Highway: Mittellinie (gestrichelt), Bordsteine automatisch an allen Asphalt-/Gras-Kanten, Bordstein zwischen Vorplätzen und Highway mit Einfahrten; Parkplatz mit Buchten (Bus, zwei Lkw, vier Autobuchten). Lkw bleiben Seitenansicht (Fahrzeugregel der Karten: von der Seite, in Fahrtrichtung). Figuren: Anhalterin auf den Gehweg der Haltestelle, Katze vom Highway an die Motelseite; Hund und Hundebesitzerin bleiben auf dem Vorplatz (jetzt durch Bordstein vom Highway getrennt).
- Mangel 2: Zweite kleine Tankstelle entfernt, an ihrer Stelle das Farmhaus des Rinderzüchters (Gebäudezahl 10.51); Vorplatz der großen Tankstelle bis unter das Dach asphaltiert, Dieselsäule für Lkw am Rand.
- Mangel 3: Kapelle frei gestellt (50–54), Schrottschuppen und zweiter Hühnerstall weg, eingezäunter Friedhof 56–62 / 36–44 mit Tor zum Schotterweg, Gräbern und Blumen; Küsterin harkt vor der Kapelle.
- Dazu: Haltestelle Vorderansicht (mfBushaltestelle, aus A nachgezogen) mit Gehweg; Rastplatz mit Mülleimer und Laterne; Rinder hinter dem Gatter.
- Zustand gatter-offen (gatterschluessel): Gatter aufgeschwenkt am Südrand (59,26), Rinder weg.

**Raststätte** (`crossroads-raststaette`)

- Mangel 1: Durchreiche war schon da; Küche gefüllt: Arbeitstisch mit Brett und Geschirr in der Mitte, Geschirrschrank statt Dosenregal.
- Mangel 2: Kasse als kleine Registrierkasse auf dem rechten Tresenende (statt Kassentheke im Gang). Dielen: Bodenbild des Pakets, bleibt.
- Mangel 3: Dosenregal nur noch im Laden, zwei verschiedene; Postkartenständer (Bildwunsch postkartenstaender.py) statt Zeitungsregal. Gäste können nicht sitzen (Statisten stehen); Fernfahrer steht zwischen den Hockern am Tresen, Schausteller am Spielautomaten.
- Zustände: keine (nichts Festes ändert sich laut Story-Bibel).

**Geysirbecken** (`geysirbecken`)

- Mangel 1: Becken als natürliche Formen (Ellipsen mit Rauschen, geglättet), neues Ufer "sinter" (Bildwunsch wasser_sinter.py, Material wasser_sinter): heller Sinterwulst, oranger Bakteriensaum, flaches türkises Wasser. Keine Mauerlinie mehr.
- Mangel 2: Bohlenweg (Dielen, 2 breit) im Zickzack über den Sinter zwischen den Becken, zwei kurze Stege über Abflussrinnen; der Infoplatz liegt am Weg. Rechte Winkel bleiben: Bohlenwege sind aus geraden Stücken gebaut.
- Mangel 3: Grenze Gras/Sinter oben und unten gewellt statt gerade. Bisons verkleinert (Bildwunsch bison_klein.py, 3 × 2 Kacheln statt 4 × 3); die Belebung „bisonherde“ zeigte Kühe und ist weg (Tierbild Bison fehlt in der App: offen). Dampfwolken über dem Wasser entfernt, die Kegel tragen ihre eigene Fontäne. Falke, Kojote, Präriehunde für die Tierzahl (10.53).
- Zustände: keine (das Ranger-Tor ist beim ersten Betreten schon offen, S10 liegt in Summit City).

**Prärie** (`praerie`)

- Mangel 1: Rote Scheune (Bildwunsch scheune_rot.py: LimeZus kleine Scheune mit roten Brettern und weißem Fachwerk) unter dem Farmhaus; die Sturmkellerklappe liegt vor dem Scheunentor, Hofweg vom Erdweg zum Tor, Ray, Farmerin und Hofhund davor.
- Mangel 2: Weizen dicht (breiter Weizen in jeder Doppelkachel), Feldboden Gras statt Wegerde: keine runden Erdränder, kein sichtbarer Boden zwischen den Reihen.
- Mangel 3: Weg in vier weiten Bögen (eine Spalte je zwei bis drei Reihen) statt rechtwinkliger Versprünge; Felder halten zwei Kacheln Abstand zum Weg.
- Zustände: keine (das Gewitter ist Wetter, keine feste Änderung).

### 3.5 Runde 9: Gutachten zu Crossroads und Weg 8 (mittel-3, 10.11.2026)

`gutachten/crossroads.md`, `gutachten/wege-mittel-3-runde9.md`:

- **Außen:** Asphalttrichter an den Einmündungen der Schotterstraßen in den Highway, Bordsteine neu
  erzeugt; lange gedeckte Picknicktische am Rastplatz (die alten lasen sich als Bänke); Motel mit
  vier Zimmern und Eisautomat in der Beschreibung. Fahrzeuge bleiben Seitenansicht und stehen längs
  in ihren Buchten (10.65). Das geschlossene Gatter steht quer zur Straße und ist von Süden nur als
  Kante zu sehen, das offene liegt längs am Rand und zeigt seine Fläche: dasselbe Gatter.
- **Raststätte:** offene Durchreiche mit Blick in die Küche (Bildwunsch `durchreiche.py`), weiße
  Fliesen in der Küche, gläserne Eingangstür (`sb8GlastuerSued`), Bretter liegen auf der Platte,
  Hocker gleich verteilt; Fernfahrer und Schausteller sitzen (`tun`: „sitzt …“).
- **Geysirbecken:** Grenze Wiese–Sinter in längeren Bögen statt Zinnen; Bootsschuppen weg; Bisons
  größer (52 Pixel, Bildwunsch `bison_klein.py`) und die Herde mit dem neuen Tierbild Bison zurück;
  der Wapiti (zeigte eine Kuh) ist weg, die Weide hat Bisons.
- **Prärie:** Weizen auf Ackerboden; gekiester Hofplatz zwischen Farmhaus, Windrad und Scheune, Fahrweg
  zu Traktor und Silo; Sturmkellerklappe als zweiflügelige Tür im Gras (`sturmkeller_wiese.png`). Nachtrag:
  Die Klappe ist jetzt das Gemini-Bild `sturmkeller_zu.png` (Möbel `sx9SturmkellerZu`); das offene
  Gegenstück `sturmkeller_offen.png` liegt bereit, falls die Gewitterszene einen Zustand bekommt.

### 3.6 Runde 9: zweite Prüfung (mittel-3, 10.11.2026)

`gutachten/mittel-3-runde9-2.md`. Crossroads außen ist reif für den Autor. Raststätte: Die
Durchreiche ist jetzt eine echte Öffnung in der Küchenwand (zwei Felder breit, Stahltisch mit
Tellern darin). Geysirbecken: schmale senkrechte Quellen entfernt, jeder dritte Kegel ist klein
(Bildwunsch `geysir_klein.py`). Prärie: Die Innenkante der Felder folgt dem Weg; Hofplatz und
Fahrweg aus Sandplatz mit weichem Rand statt Kies in Stufen; der Traktor steht auf dem Hofplatz;
die Sturmkellerklappe liegt direkt vor dem Scheunentor. Silo bleibt Seitenansicht (Gebäude).

### 3.7 Fahrzeuge nach 10.65 und Restpunkte (mittel-3, 10.11.2026)

Parkplatz Crossroads: Bus (`fz11BusAb`) und Autos (`wsgAutoAb1`, `wsgAutoAuf2`) stehen von vorn oder
hinten gesehen in quer gelegten Buchten; Sattelzüge und Food-Truck bleiben Seitenansicht, bis die
Gemini-Bilder da sind. Prärie: Traktor von vorn (`fz11TraktorVorn`) auf dem Hofplatz, der blinde
Fahrweg hinter der Kellerklappe ist weg. Geysirbecken: die zwei Zaunstücke ohne Weide sind weg.

### 3.8 Sattelzüge und Imbisswagen von vorn (mittel-3, 10.11.2026)

Die Gemini-Bilder (Teil 2) sind eingebaut: Auf dem Parkplatz stehen zwei Sattelzüge
(`cr10SattelzugVorn`, `cr10SattelzugHinten`), ein Lastwagen (`cr10LastwagenVorn`) und der
Hotdog-Wagen (`cr10HotdogwagenVorn`) von vorn oder hinten gesehen in Buchten; Seitenansichten gibt
es auf dem Platz nicht mehr (10.65). Big Joe steht neben seinem Sattelzug, ein kleiner Wohnwagen
am Nordrand hält die Zahl der Bauten.

### 3.9 Drittes Gutachten und Laufwege (mittel-3, 11.11.2026)

Parkplatz: Der Lastwagen hinter dem Bus ist weg (der Bus kam nicht heraus). Die beiden Sattelzüge
stehen in eigenen, vier Kacheln breiten Buchten mit Trennlinie (x 8–11 und x 12–15). Laufwege
nach 10.70: Hofhund der Prärie nicht mehr über den Auslöser `sturmkeller`, Bisons im
Geysirbecken nicht mehr auf `bisons` und `fundBisonhaar`, Betreuerin bei den Riesenbäumen nicht
mehr über `ereignisLebendschach`.

## 4. Bühnenbilder

Die Inventare stehen in den Szenen (`beschreibung`) und folgen 1.1 bis 1.4; feste Felder sind die
Übergänge und Auslöser aus 1.5 und 3.1, die Figuren Bell (17, 14), Ray (19, 96), Darlene am Tresen,
Nova am Ecktisch.

## 5. Runde 6: spielbar (mittel-3, 10.11.2026)

**Weg 8** (`weg-summit-crossroads.ink`): Ereignis `ereignisGeysirblitz` mit Aufgabenrunde
`wegSummitCrossroads.geysirblitz` (sechs Endspiele, Kapitel 9; Platzhalter für die Uhr als Geysir)
und Quest `wegSummitCrossroads.geysirblitz`, Lohn Fund `rangerabzeichen`. Fundstellen `spurPM5`
(Antrag am Infobrett), `finchBauerD` (unter dem Steg), `seite09` (Sturmkeller); Ansehen
`geysirAusbruch` (Old Patience) und `windrad`. Felder in allen Varianten:

| Auslöser              | A        | B        | C        |
| --------------------- | -------- | -------- | -------- |
| `ereignisGeysirblitz` | (5, 71)  | (14, 63) | (21, 62) |
| `spurPM5`             | (11, 73) | (9, 63)  | (18, 60) |
| `finchBauerD`         | (20, 73) | (8, 64)  | (15, 63) |
| `geysirAusbruch`      | (6, 69)  | (16, 61) | (24, 59) |

| Auslöser  | A        | B        | C        |
| --------- | -------- | -------- | -------- |
| `seite09` | (16, 95) | (16, 95) | (16, 95) |
| `windrad` | (21, 80) | (24, 46) | (26, 80) |

**Crossroads:** Sperre S13 am Viehgatter: Auslöser `viehgatter` (A, B, C bei (57, 23)),
Dialog `crossroads-aussen.viehgatter`. Nach Novas Bitte gibt Darlene eine Lieferung für Dolores und
den Gatterschlüssel mit (`darlene_lieferung`, Variablen `lieferungFuerDolores`,
`gatterschluessel`; Quest `crossroads.lieferung`, Lohn 20 Münzen bei Dolores). Mit dem Schlüssel
reist {held} über die Alte Minenstraße nach Ghost Town (vorerst `reise` nach
`ghostTown.aussen`, Auslöser `wegPinewood`; die Karte der Minenstraße Q4 fehlt noch). Fernbus Q3: Wartehäuschen am Highway West (1, 17),
Auslöser `fernbus` (3, 20) in allen Varianten. Der Dialog `crossroads-aussen.fernbus` fährt zu den
Haltestellen und Bahnhöfen von Maple Falls, Cedar Creek, Riverton, Ironwood, Port Delacroix, Desert
Springs, zur Raststätte vor Silicon Bay und an den Südrand von Summit City; zurück geht es mit den
Bussen und Zügen der Städte.
