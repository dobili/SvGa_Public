# Gegenprüfung niedrig-1 (Nacht 9./10.11.2026)

Auftrag des Haupt-Chats: Gegenprüfung (nur ansehen, nichts ändern) der Karten, die noch niemand geprüft
hat, je A, B und C, gegen `KARTENREGELN.md` Abschnitt 10 und das jeweilige Ortsdokument.

**Stand:** `claude/friendly-shannon-y8bf90` bei dc490875 (Möbel mit Sperrmaske), Bilder aus dem privaten
`main` vom 9.11.2026 nachts. **Werkzeuge:** Kartenbauer mit Variantenprüfung, Kartenbild mit Randspur
(10.36), Übergangsprüfung. Danach jedes Bild einzeln angesehen.

**Felder:** (Spalte, Reihe), linke obere Kachel; Bereiche „Spalten / Reihen“.

## Ergebnis der Werkzeuge

| Karte                       | Kartenbauer A/B/C | Randspur | Übergänge                                                                                                                                               |
| --------------------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| crossroads.aussen           | in Ordnung        | –        | in Ordnung                                                                                                                                              |
| crossroads.raststaette      | in Ordnung        | –        | in Ordnung; `crTisch`: Katalogeintrag unsicher                                                                                                          |
| jahrmarkt.festplatz         | in Ordnung        | –        | in Ordnung                                                                                                                                              |
| erinnerungLondon.strand     | in Ordnung        | –        | in Ordnung                                                                                                                                              |
| erinnerungLondon.kaffeehaus | in Ordnung        | –        | `ldBild` nicht beschrieben, `ldOfen`/`ldKommode` unsicher, `ldBuecherregal` Bauteil (B)                                                                 |
| sternwarte.felsnase         | in Ordnung        | –        | in Ordnung                                                                                                                                              |
| sternwarte.kuppel           | in Ordnung        | –        | in Ordnung                                                                                                                                              |
| goldmine.stollen            | in Ordnung        | –        | `stollenAusgang` ohne Ziel (in 824eddfe auf abenteuer-aufgabenzuordnung behoben); `st5Bohlen`, `st5Schotterhaufen`, `st5Steinpalette` nicht beschrieben |

Die Werkzeuge finden also nichts Wesentliches. Die Befunde unten kommen aus dem Ansehen der Bilder und dem
Abgleich mit den Ortsdokumenten. Wichtigste Punkte zuerst:

1. **Fehlende Elemente der Geschichte (Regel 37):**
   - Kaffeehaus C hat keine Theke.
   - Der Kuppel fehlt in allen drei Varianten das Funkgerät.
   - Im Stollen fehlen in allen drei Varianten die Kammer der Bergleute (Tisch, Kiste) und die Goldader.
   - Im Raststätten-Diner gibt es keinen großen Varianten-Tisch.
2. **Große `#`-Flächen zeichnen als flacher Boden** (Felsnase, Stollen, London-Strand): Die Höhe oder
   Mauer ist nicht zu sehen (Regel 49).
3. **Sandboden mit grünen Büscheln** auf dem Jahrmarkt wirkt wie Wiese (wie zuvor in Ghost Town).
4. **Lichterketten liegen am Boden** quer über den Jahrmarkt und durch Fahrgeschäfte.
5. **Ortsdokumente und Szenen weichen ab:** Crossroads (Wanderweg und `wegPinewood`, Tür) und London
   (Tür des Kaffeehauses).

## 1. crossroads.aussen (mittel-3)

**Alle Varianten**

| Feld                            | Befund                                                                                                                                                                                   | Vorschlag                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Ortsdokument 1.3 / 1.5          | Plan und Tabelle nennen `wegPinewood` am Südrand (20–21, 47) mit Wanderweg nach Süden; in der Szene liegt `wegPinewood` am Westrand (0, 14–15), einen Wanderweg nach Süden gibt es nicht | Ortsdokument an die Szene angleichen (die Übergangsprüfung ist mit dem Westrand zufrieden) |
| Ortsdokument 1.5                | `raststaetteTuer` steht dort bei (15, 20), in der Szene bei (14, 19)                                                                                                                     | Ortsdokument angleichen                                                                    |
| (2–26 / 26) bzw. B (36–62 / 26) | Zwischen Highway (Reihe 25) und Parkplatz (ab Reihe 27) liegt eine Reihe Gras: Der Parkplatz hat keine Zufahrt, Laster und Bus stehen darauf wie hineingehoben                           | Reihe 26 auf einigen Spalten Asphalt (Zufahrt, 4–6 breit)                                  |
| (29 / 19–21) und (33 / 19–21)   | Je eine Spalte Gras zwischen Pflaster-Vorplatz und Schotterstraße: Grasnaht zwischen zwei Belägen (10.1.3)                                                                               | Pflaster bis an den Schotter führen (Spalten 29 und 33 als `p`)                            |
| (6–28 / 19–21), (34–56 / 19–21) | Vorplatz aus Kopfsteinpflaster vor Diner und Tankstelle, das passt nicht zu einer Raststätte am Highway                                                                                  | Asphalt oder heller Beton (`fliesenGrau`) für die Vorplätze                                |
| Viehgatter (58 / 22–25)         | Ein dünner Pfosten quer über dem Highway, als Gatter kaum zu erkennen (48)                                                                                                               | Gatterbild mit Querstangen und Schild „Cattle Guard / Closed“ (bestellen)                  |
| Nordteil                        | Diner, Schild, Wegweiser und Tankstelle stehen in A, B, C auf denselben Feldern                                                                                                          | in Ordnung, weil die Geschichte sie festlegt; Unterschiede bleiben im Süden                |

**Variante A**

| Feld            | Befund                                                                               | Vorschlag                                              |
| --------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| (54–58 / 2–7)   | Werbetafel ist leer und weiß, ein Schild ohne Aufgabe (26, 48)                       | Motiv (Darlenes Diner, „Perfect Move“) oder weglassen  |
| (40–62 / 30)    | Die Weide für die Rinder (Belebung bei (52, 38)) hat nur eine Zaunreihe, kein Gehege | Zaun als Rechteck mit Ecken schließen, Tor zum Highway |
| (27–62 / 26–46) | Der Südosten ist bis auf Bäume und Bänke leer                                        | Tränke, Heuballen, Windrad oder Picknickplatz          |

**Variante B**

| Feld                           | Befund                                       | Vorschlag                                          |
| ------------------------------ | -------------------------------------------- | -------------------------------------------------- |
| (2–9 / 28–31), (18–25 / 29–33) | Werksbus und Food-Truck stehen auf der Wiese | Asphaltfläche darunter oder auf den Parkplatz      |
| (36–62 / 27–40)                | Parkplatz ohne Zufahrt (siehe oben)          | Zufahrt in Reihe 26                                |
| (1–34 / 26–46)                 | Südwesten fast leer, nur Grasbüschel         | als schlichte Variante vertretbar; ein, zwei Bäume |

**Variante C**

| Feld                       | Befund                                                                    | Vorschlag                                             |
| -------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| (9–26 / 5) und (9–26 / 10) | Zwei parallele Zaunreihen ohne Seitenstücke: kein Gehege, kein Grund (27) | eine Reihe weglassen oder zu einem Pferch schließen   |
| Motel (40–53 / 30–36)      | Türen zeigen nach Süden, weg vom Highway; kein Weg zu den Türen (25)      | Motel drehen oder Trampelpfad/Parkreihe vor die Türen |
| (54–58 / 2–7)              | leere Werbetafel wie in A                                                 | wie in A                                              |

## 2. crossroads.raststaette (mittel-3)

**Alle Varianten**

| Feld             | Befund                                                                                                                     | Vorschlag                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Raum             | Diner ohne Küche mit Durchreiche, ohne Toiletten, Lager und Sitznischen (Regel 30)                                         | Küche hinter einer Innenwand mit Wandfläche (39) und Durchreiche an der Nordseite, eine WC-Tür |
| `variantenTisch` | Statt eines großen Tisches mit mehreren Brettern (Ortsdokument 1.4) zwei kleine Rundtische mit je einem Brett, ohne Stühle | ein langer Tisch (2 × 4) mit drei, vier Brettern und Stühlen ringsum                           |
| `postkarten`     | Kein Postkartenständer, nur ein Zeitungsregal                                                                              | Bild „Postkartenständer“ bestellen und mit `postkarten` verbinden                              |

**A:** Varianten-Tische (2–3 / 4–5) und (5–6 / 4–5), Auslöser (4, 7). Sonst stimmig: Theke mit Hockern, Kasse
zum Gast, Laden im Nordosten.

**B:** Varianten-Tische (9–10 / 9–10) und (12–13 / 9–10) stehen frei im Raum, ohne Stühle. Nur ein Fenster.

**C:**

- Der Getränkeautomat steht frei mitten im Raum (9–10 / 9–11) (31). Vorschlag: an die Westwand neben die
  Spielautomaten.
- Das Ladenregal (1–4 / 1–3) und die Kasse (11–12 / 3–5) sind getrennt. Vorschlag: Laden in einer Ecke
  zusammenfassen.

## 3. jahrmarkt.festplatz (mittel-3)

**Alle Varianten**

| Feld                | Befund                                                                                                                                   | Vorschlag                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Platz (3–44 / 4–28) | Der Boden `sand` zeichnet LimeZus Sand mit grünen Büscheln, der Platz wirkt wie Wiese; die Kante zum Gras ist gerade, ohne Rand (10.1.1) | Boden `erde` (glatt, mit Rand zum Gras), wie in Ghost Town und auf der Pelikaninsel               |
| Lichterketten       | `n6Lichterkette` liegt als Linie auf dem Boden und läuft über Wege und durch Fahrgeschäfte                                               | an Masten oder zwischen Buden aufhängen (eigene Masten bestellen) oder als Bogen über dem Eingang |
| Figuren             | Dolores und Ike erst in Runde 6, wie im Ortsdokument                                                                                     | –                                                                                                 |

**A:**

- Die Lichterkette in Reihe 16 (Spalten 8–40) läuft durch den Schachautomaten (24–25 / 15–16).
- Die Tribüne (34–37 / 13–15) steht seitlich unter der Bühne, nicht mit Blick auf sie (17). Vorschlag: vor
  die Bühne, mit Blick nach Norden.
- Nur drei Flutlichter; die Südostecke fehlt.

**B:**

- Großer leerer Platz in den Reihen 12–28, karg auch für die schlichte Variante.
- Dosenwerfen fehlt (Ortsbild).
- Die Bühne (5–11 / 5–10) hat keine Treppe.

**C:**

- Zwei Lichterketten am Boden (Reihen 11 und 16). Die obere läuft durch Riesenradfuß, Kasse und
  Karussell, die untere durch Schachautomat und Zuckerwattewagen.
- Der Zuckerwattewagen steht doppelt, bei (15–16 / 21–23) und (23–24 / 14–16) (43). Vorschlag: einen durch
  den Limonadenstand oder eine Popcornbude ersetzen.

## 4. erinnerungLondon.strand (mittel-2)

**Alle Varianten**

| Feld                                | Befund                                                                                                                       | Vorschlag                                                                                                                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reihen 18–21, Reihe 0, Spalten 0/43 | Die `#`-Ränder zeichnen Pflaster und Steinplatten: Über den Dächern liegt Kopfsteinpflaster, unten vier leere Reihen Platten | Ortsdokument 1.1 verlangt in den Reihen 17–21 Händlerkarren und eine Ziegelmauer: als Wand (`backstein`) zeichnen; über den Fassaden Dächer der Hinterhäuser oder dunkler Rand |
| Ortsdokument 1.1 / 1.3              | Tür (21, 8), Auslöser (21, 9); Szene: A und C (19, 9), B (17, 9)                                                             | Ortsdokument angleichen                                                                                                                                                        |
| Fassaden                            | TABAK, BUECHER, UHREN wiederholen sich in derselben Reihenfolge                                                              | Schilder und Fassaden mischen (Hutmacher, Apotheke, Teehandel), zwei Fassaden nicht gleich nebeneinander                                                                       |
| Gaslaternen Nordseite (Reihe 6–8)   | stehen vor Schaufenstern und Türen (9)                                                                                       | an die Bordsteinkante, Reihe 10, auf die Fassadengrenzen                                                                                                                       |

**A:**

- Laternen bei (7, 6), (15, 6), (30, 6), (36, 6) vor den Läden.
- Die Straße ist mit 19 Objekten für einen belebten Strand eher leer. Vorschlag: mehr Passanten als
  Belebung, ein Blumenstand.

**B:**

- Die Fassadenreihe endet bei Spalte 30; rechts liegt eine leere Pflasterfläche (31–42 / 1–8).
  Vorschlag: zwei Fassaden mehr oder eine Kirchenmauer.
- Die Laterne bei (22, 13–16) ist eine andere Bauart (`ldGaslaterne`) als die übrigen (19).

**C:**

- Zwei gleiche Droschken, bei (6–11 / 11–14) und (26–31 / 11–14). Vorschlag: die zweite gespiegelt oder
  als Fuhrwerk.
- Zwei gleiche Karren.
- Die Laternen der Nordseite stehen vor den Schaufenstern.

## 5. erinnerungLondon.kaffeehaus (mittel-2)

**Alle Varianten**

- Anderssen und Kieseritzky (Belebung) stehen eine Reihe unter den Stühlen am Schachtisch und wirken wie
  Zuschauer. Vorschlag: Belebung auf die Stuhlfelder setzen.
- Außen zeigt die Kaffeehausfront zwei große Fenster mit Kerzenlicht, innen gibt es keine Fenster. Das
  ist nur ein Hinweis, denn in der Südwand sind Fenster kaum darstellbar.

**A:** Die Spieler stehen bei (7, 9) und (11, 9), die Stühle bei (7 / 7–8) und (11 / 7–8). Der Kellner (13, 6)
steht vor statt hinter der Theke (10–16 / 2–4).

**B:**

- Das Bücherregal (5–6 / 1–3) hinter der Lederbank verdeckt das Bild (7, 1). Vorschlag: Bild versetzen.
- Die Kommode (15–16 / 4–5) steht frei neben dem Thekenende (31).
- Der Zeitungsleser steht in der Ecke (2, 11), der Ohrensessel (4–5 / 9–10) ist leer. Vorschlag: Leser in
  den Sessel, Zeitungshalter daneben.

**C:**

- **Keine Theke** (Ortsdokument 1.2: „Theke rechts mit dem Kellner“; Regel 37). Der Kellner (15, 9) steht
  ohne Theke.
- Der Zeitungsleser steht in der Ecke (1, 11).

## 6. sternwarte.felsnase (mittel-4)

**Alle Varianten**

| Feld         | Befund                                                                                                                                                                           | Vorschlag                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `#`-Flächen  | Der Fels um Plateau und Pfad zeichnet als flacher roter Boden mit einer dünnen dunklen Linie; nur die Nordkanten haben eine Felswand. Die Felsnase wirkt eben, nicht erhöht (49) | Felswände auch an Süd- und Seitenkanten oder den Fels dunkler (`felsbodenRot` mit Felsrand) |
| Westrand     | Ortsbild: „Die Felsnase ragt über den Canyon“, Bank mit Blick nach Westen; vom Canyon ist nichts zu sehen                                                                        | Abbruchkante am Westrand des Plateaus mit Blick hinunter, die Bank davor                    |
| `kuppelTuer` | wandert mit der Sternwarte: A (19, 9), B (14, 9), C (24, 9). Regel 37 hält Übergänge fest; als Tür am Gebäude vertretbar                                                         | Haupt-Chat entscheidet; sonst Sternwarte in allen dreien mittig                             |

**A:** stimmig. Bank (7 / 9–10); mit 11 Objekten eher karg.

**B:** Der Boden `felsbodenRot` hat dieselbe Farbe wie der Fels ringsum. Die begehbare Fläche ist nur an
den dünnen Linien zu erkennen. Vorschlag: `sandRot` wie A und C.

**C:** am besten lesbar, keine eigenen Befunde.

## 7. sternwarte.kuppel (mittel-4)

**Alle Varianten**

- **Kein Funkgerät** auf dem Schreibtisch (Ortsdokument 1.2: Dr. Ngata spielt nachts per Funk; Bühnenbild
  „Schreibtisch mit Radio“; Regeln 37 und 40). Vorschlag: Radio oder Funkgerät mit `auf` auf den
  Schreibtisch.
- Der Globus steht auf dem Boden (13). Vorschlag: auf die Anrichte oder den Schreibtisch.

**A:** Globus (4 / 4–5). Der Karton (5–6 / 9) steht frei vor dem Teleskop (31). Vorschlag: zur Liege an die
Westwand.

**B:** Globus (9, 5). Der runde Tisch (5–6 / 9–10) steht direkt vor dem Teleskopfuß und halb im Weg zur Tür.

**C:** Der runde Teppich (6–7 / 6–7) liegt halb unter dem Teleskopfuß und wirkt verrutscht. Vorschlag:
mittig unter das Teleskop. Globus (4, 9).

## 8. goldmine.stollen (mittel-4)

**Alle Varianten**

| Feld                                  | Befund                                                                                                                                             | Vorschlag                                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `#`-Flächen                           | Der Fels ringsum zeichnet als heller Boden wie der Gang; der Stollen wirkt wie Räume auf einer Ebene                                               | Fels dunkel und massiv (eigener Felsboden dunkel oder Felswand ringsum)                                         |
| Westkammer                            | Ortsdokument 1.3: „alte Kammer der Bergleute (Tisch, Kiste, Platz für das Logbuch von 1866)“; in A, B, C nur Felsbrocken und ein Bohlenbündel (37) | Tisch, Hocker, Kiste, Laterne; Platz für das Logbuch als freies Tischfeld                                       |
| Ostkammer                             | Ortsdokument: „Goldader mit abgestellter Lore und Pfützen“; die Lore steht am Nordende des Hauptgangs (19–20 / 4–5), Pfützen und Goldader fehlen   | Goldader als Wandbild oder Felsen mit Gold bestellen, Lore auf ein Gleisende in der Ostkammer, `pfuetze_fels_*` |
| Felsbrocken                           | 50 bis 60 Felsen (`fels`, `felsKlein`, `wg4Felsgruppe`) mit grünem Gras am Fuß, verstreut wie auf einem Acker                                      | Felsen ohne Gras (Steinbruch-Felsen) und weniger, an den Wänden gruppiert                                       |
| Gleis (19–20 / 6–22)                  | endet oben an der Lore, ohne Prellbock (42)                                                                                                        | Prellbock (`spiel/eigene/prellbock.png`) am Gleisende                                                           |
| Grubenlampen (21 / 7–8), (21 / 15–16) | hängen frei neben dem Gang                                                                                                                         | an die Stützen hängen (Haken am Querbalken)                                                                     |

**A:** Westkammer (3–12 / 3–10) mit Bohlen bei (3 / 5–7). In der Ostkammer (28–37 / 6–18) stehen
Steinpalette und Schotterhaufen, keine Goldader.

**B:** Westkammer (3–11 / 10–20) nur mit Felsen. Die Ostkammer (29–37 / 1–13) hat keine Goldader.

**C:** Holzstapel (36 / 17–18) und Bohlen (8 / 13–14). Sonst wie A und B.

## Für den Haupt-Chat

- Katalog im privaten Repository nachtragen:
  - nicht beschrieben: `ldBild`, `st5Bohlen`, `st5Schotterhaufen`, `st5Steinpalette`;
  - Einträge unsicher: `crTisch`, `ldOfen`, `ldKommode`.
- Mögliche Bildbestellungen:
  - Postkartenständer (Raststätte);
  - Viehgatter mit Schild (Crossroads);
  - Masten für Lichterketten (Jahrmarkt);
  - Goldader (Stollen);
  - Funkgerät, falls der Katalog keines hat (Kuppel).
- Die Befunde mit `#`-Flächen (Felsnase, Stollen, London) betreffen das Zeichnen der Ränder im Werkzeug.
  Vielleicht ist eine Regel dafür sinnvoll: Große `#`-Flächen innen bekommen eine eigene Füllung (Fels,
  Mauer, Dächer) statt des Bodens daneben.
