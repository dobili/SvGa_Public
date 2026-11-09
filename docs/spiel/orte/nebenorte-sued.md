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
