# Nebenorte N5 Sternwarte am Canyon und N7 Goldmine

Stand: 10.11.2026 (Nacht), Entwurf von mittel-4. Ortsdokument nach `docs/spiel/orte/README.md` für zwei
Nebenorte aus `13_Wegenetz.md` (Abschnitte „Nebenort N5“ und „Nebenort N7“). Beide sind Orte der Art
`weg` wie der Steinbruch (N3): eine Außenkarte oder ein Stollen, höchstens ein Innenraum. Die Sperren
S9 (Laterne und Versöhnung) und S11 (Laterne und Pruitts Geschichte) kommen in Runde 6; die Abzweige
stehen schon jetzt als Übergänge da.

## 1. Ortsplan

### 1.0 Lage

```text
  N5:   Sternwarte (Kuppel) ── Felsnase ──► Pfad nach Süden ──► Canyonpfad CP9 (Seitenschlucht, Nordrand 30–31)
  N7:   Ghost Town, Stolleneingang an der Bruchkante (Nordrand der Stadt) ──► Stollen mit Gleis und Loren
```

| Karte                 | Größe   | Art   | Hauptweg          | Zeit   |
| --------------------- | ------- | ----- | ----------------- | ------ |
| `sternwarte.felsnase` | 40 × 30 | außen | Süd → Tür 40      | ≈ 11 s |
| `sternwarte.kuppel`   | 14 × 12 | innen | –                 | –      |
| `goldmine.stollen`    | 40 × 24 | innen | Eingang → Ende 50 | ≈ 14 s |

### 1.1 Felsnase (`sternwarte.felsnase`, 40 × 30)

Vom **Südrand bei den Spalten 19–20** (`zurueckCanyon`) steigt ein Pfad in zwei Kehren auf eine
Felsnase aus rotem Fels. Oben die **Sternwarte**: Kuppel auf einem Steinsockel, Tür nach Süden
(`kuppelTuer`, in allen Varianten (19, 9)). Kakteen im Mondlicht, eine Bank an der Westkante mit Blick in
den Canyon, ein alter Antennenmast. Um Plateau und Pfad ein Felsrand (`wand: felsRot`), nach Süden mit
zwei Reihen Felswand über einem Streifen Canyongrund; weiter weg Dunkelheit (`" "`). Offen nur der Südrand.

### 1.2 Kuppel (`sternwarte.kuppel`, 14 × 12)

Runder Raum unter der Kuppel, als Rechteck mit Holzboden. In der Mitte das große Teleskop, an der
Nordwand eine Sternkarte mit dem Sternbild „Springer“ und Regale, an der Ostwand der Schreibtisch mit
Funkgerät (hier spielt Dr. Ngata nachts per Funk), an der Westwand eine Liege, ein Globus und Kisten mit Fotoplatten.
Tür in der Mitte der Südwand (`kuppelAusgang`, Ankunft (7, 10)).

### 1.3 Stollen (`goldmine.stollen`, 40 × 24)

Fels (`wand: fels`). Der Eingang liegt am **Südrand bei den Spalten 19–20** (`stollenAusgang`, zurück
zum Stolleneingang in Ghost Town). Ein Hauptgang mit Gleis läuft nach Norden und gabelt sich: nach
Westen zur alten Kammer der Bergleute (Tisch, Kiste, Platz für das Logbuch von 1866), nach Osten zur
Goldader (`goldader.png`) mit abgestellter Lore und Pfützen. Das Gleis endet im Norden an einem Prellbock.
Holzstützen alle paar Felder, Grubenlampen an den Querbalken. Fels jenseits der Wände bleibt dunkel (`" "`).
Auf dem Tisch der Kammer bleibt ein Feld frei für das Logbuch (Runde 6).

### 1.4 Übergänge

| Von (Karte, Auslöser, Feld)                             | Nach (Karte, Auslöser, Feld)                 |
| ------------------------------------------------------- | -------------------------------------------- |
| canyonpfad `sternwarte` Nordrand (30–31, 0)             | felsnase `zurueckCanyon` Südrand (19–20, 29) |
| felsnase `kuppelTuer` (Tür der Sternwarte)              | kuppel `kuppelAusgang` (7, 11)               |
| ghostTown.aussen `goldmine` (Stolleneingang, niedrig-1) | stollen `stollenAusgang` Südrand (19–20, 23) |

## 2. Ortsbild

**Sternwarte:** Nachts, und nur nachts. Die Felsnase ragt über den Canyon, unten liegt der Pfad wie
ein dunkler Faden. Die Kuppel ist weiß, nur der Spalt ist rostig; wenn er offen ist, zeigt das
Teleskop in den Himmel, der so voll ist, dass man die Milchstraße zu hören meint. Drinnen riecht es
nach Kaffee und Staub, das Funkgerät knistert, und an der Wand hängt eine Sternkarte, auf der jemand
mit Bleistift Züge eingetragen hat.

**Goldmine:** Kühl, dunkel, Wasser tropft. Holzstützen von 1866, Schienen, die irgendwo im Dunkel
enden, eine Lore voller Gestein. Die Laterne zeichnet einen Kreis auf den Fels; in der Kammer der
Bergleute steht noch ein Tisch, auf dem jemand einmal einen Brief geschrieben hat.

## 3. Abgleich mit der Geschichte

- **N5:** Nebenquests Maes Brief, Königsangriff unter Sternen, Sternbild „Springer“; Figuren Dr. Ngata,
  Lucía, Mira (nach der Versöhnung). **Für Runde 6:** Figuren und Dialoge in `orte.json`, Ansehen am
  Teleskop und an der Sternkarte, Sperre S9 am Abzweig, feste Nachttönung als Szene.
- **N7:** Nebenquests Die letzte Schicht (Logbuch), Lorenendspiel, Goldader; Figuren Pruitt, Juniper,
  Fledermäuse. **Für Runde 6:** Figuren, Logbuch und Funde als Auslöser, Sperre S11 am Stolleneingang,
  Lichtkreis der Laterne.

## 4. Bühnenbilder

- **Felsnase:** Boden roter Sand und Felsboden, Pfad Erde (2 breit), Sternwarte (bestellt; Ersatz
  Holzhaus), Kakteen, Felsen, Bank, Antennenmast (Ersatz Strommast).
- **Kuppel:** Boden Dielen, Wand blau (Nachtblau), Teleskop (bestellt; Ersatz Stehlampe), Sternkarte
  (bestellt; Ersatz Weltkarte), Regale, Schreibtisch mit Funkgerät (`radio_alt.png`), Liege, Globus auf
  Anrichte oder Tisch, Pflanze.
- **Stollen:** Boden Felsboden, Wand Fels, Gleis im Hauptgang mit Prellbock, Lore (`lore.png`),
  Goldader (`goldader.png`), Pfützen (`pfuetze_fels_*`), Holzstützen (`stollen_stuetze.png`), Kiste,
  Tisch mit Hockern, Gesteinsbrocken an den Wänden.

## 5. Runde 7: Leben und Finch-Figur (10.11.2026)

**Felsnase:** Am Abend und in der Nacht sind dort:

- ein Hobbyastronom (Arpad Elo, 16, 4.3 Nr. 25);
- ein Paar auf der Bank (Kojoten wie Züge einer Blitzpartie);
- eine Nachtwanderin (Sternbild Springer als L);
- ein Kind am Fernrohr.

Tiere: Eule, Fledermäuse, Kojote, Wüstenfuchs, Nachtfalter, Eidechse.

**3.3 Feld für Runde 6:** `finchBauerG` in der Kuppel bei A (12, 8), B (12, 9), C (12, 8),
begehbar, mit Finkenzeichen aus Kreide.

## 6. Runde 6: Sternwarte spielbar (10.11.2026)

- **Figuren in der Kuppel:**
  - Dr. Ngata (`sternwarte.ngata`) am Schreibtisch mit Funkgerät;
  - Lucía (`sternwarte.lucia`) am Teleskop.
- **Nebenquest** `sternwarte.koenigsangriff` (klein): Mattbilder von Dr. Ngata, Runde
  `sternwarte.sterne`, 25 Münzen.
- **Ansehen:** `teleskop` und `sternkarte` (Kuppel), `bank` und `antennenmast` (Felsnase).
- **Fund:** `finchBauerG` am Feld aus 3.3.
- **Erreichbar über Sperre S9** auf dem Canyonpfad (Laterne und Versöhnung).
- **Offen für mittel-2:** feste Nachttönung (`toenung`).
- **Offen:** Mira kommt nach der Versöhnung nicht als Figur dazu; sie steht schon in der Garage von
  Desert Springs.

## 7. Runde 6: Goldmine spielbar (10.11.2026)

- **Sperre S11:** Der Übergang `goldmine` in Ghost Town hat den Dialog `goldmine.eingang` und
  `wenn: goldmineOffen`. Der Dialog setzt die Variable bei `hatLaterne` und `grabGesehen` (Pruitts
  Geschichte nach dem Grab). Sonst nennt er den Grund: vernagelt oder zu dunkel.
- **Nebenquest `goldmine.letzteSchicht`** (klein):
  - Auf dem Tisch der Kammer liegt das Logbuch von 1866 (`logbuch`).
  - Funde `logbuch1866` und `grubenlampe1866` (30 Münzen).
- **Nebenquest `goldmine.lorenendspiel`** (klein): Turmendspiele als Aufgabenrunde an der Lore
  (`lore`), 20 Münzen.
- **Goldader** (`goldader`): Fund `goldkorn`.
- **Offen für mittel-2:** Lichtkreis der Laterne. Pruitt und Juniper bleiben bei ihren Orten (Ghost
  Town, Weg 10).

## 8. Runde 9: Mängel der Variantenwahl (10.11.2026, mittel-4)

**Felsnase (Wahl A).** (1) Neu gebaut als drei Stufen: Plateau mit der Sternwarte vor der höheren
Felswand, mittlere Stufe, Canyonboden; dazwischen rote Felskanten (`"fels": "rot"`) mit Treppen, der Pfad
aus Felsboden steigt in zwei Kehren. Kein Rahmen, keine schwarzen Flächen. (2) Die Bank schaut nach Westen
über die Kante. (3) Die Sternwarte steht vor einer Felswand über die ganze Breite; die Nacht zeigt jetzt
auch die Vorschau (`pipeline/abenteuer/toenung.py`, wie die App).

**Kuppel (Wahl A).** (1) Nachtblaue Wand (neues Wandmaterial `nachtblau`). (2) Abgeschrägte Ecken geben
dem Raum ein Rund; das Teleskop zeigt auf den offenen Kuppelspalt in der Nordwand. Eine echte runde Kuppel
in Draufsicht gibt es in keinem Paket. (3) Das Zeichen am Boden ist das Finkenzeichen (Ereignis von Finch),
kein Springer; der Karton ohne Grund ist weg. Die Dielen sind das Material des Kartenbilds.

**Zustände:** keine; die Sternwarte ändert sich in der Geschichte nicht.

## 9. Gutachten Runde 9 (10.11.2026, mittel-4)

- **Felsnase:** Der Pfad ist heller Sand und auch nachts sichtbar; die obere Kante hat einen Versprung.
  Nicht umgesetzt: **Hunde** sind die Tierbilder für Kojote und Wüstenfuchs (`belebungsbilder.py`);
  **Bank** von der Seite (Bild).

**Gemini-Bilder (10.11.2026):** In der Kuppel steht das Messingfernrohr auf seiner Säule mit dem
Beobachterstuhl, links ein Tisch mit aufgeschlagenem Sternatlas statt Anrichte und Globus.

**Restpunkt Kuppel (10.11.2026):** Der Kuppelspalt ist ein eigenes Bild mit Schienen und Nachthimmel
(Bildwunsch `bildwuensche/kuppelspalt.py`).

## Gemini-Bilder Teil 2: Bagger im Steinbruch (10.11.2026, mittel-4)

In der Grube steht der gelbe Kettenbagger aus Gemini von der Seite (`fz12BaggerLinks`, 112 × 78, Feld
(56, 37)), der Löffel zeigt zur Feldbahn. Er ersetzt den kleinen Bagger von vorn (`st5Bagger`). Der
Auslöser `bagger` liegt jetzt bei (59, 42) vor den Ketten.

## Steinbruch, vierte Prüfung (11.11.2026, mittel-4)

Gutachten `steinbruch-4.md`.

- **Grube 1:** Die Granitblöcke liegen in losen Gruppen (Stapelplatz, liegengebliebene Einzelblöcke) statt
  in zwei Reihen; dazu Bauholz, Schotterhaufen und eine Werkzeugkiste auf der Stufe.
- **Grube 2:** Sohle westlich des Wasserlochs: Steinpaletten, Bohlen, Karren, Schotterhaufen, Lichtmast,
  Birke, Büsche, Pfütze. Südöstlich: Bauholz, Schotterhaufen, Werkzeugkiste, Fels, Pfütze.
- **Grube 3:** Die Beschreibung nennt den gelben Raupenbagger.
- **Grube 4, 5 (Zufahrt gerade, Nebeltönung blass):** nicht geändert; die Zufahrt ist die alte Werkstraße,
  die Tönung prüft der Autor im Spiel.
- **Stollen 2:** Das Gleis läuft drei Felder weiter bis in die Kaverne, der Prellbock steht bei (18, 6).
- **Stollen 3:** Das Eingangslicht ist ein weicher, durchscheinender Schein (Bildwunsch
  `bildwuensche/stollenlicht.py`, Möbel `st11Eingangslicht`) statt eines Stücks Sandboden.
- **Stollen 4:** Die Brocken im Quergang liegen in ungleichem Abstand, einer ist größer.
- **Stollen 1 (Felswand nur an Nordseiten):** bleibt, der Gutachter nimmt es im Dunkel hin.
