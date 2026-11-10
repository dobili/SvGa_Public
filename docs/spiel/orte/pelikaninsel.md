# Nebenort N4: Pelikaninsel (`pelikaninsel`)

Ortsdokument nach `README.md` (vier Teile). Verfasst von niedrig-1 in der Nacht 9./10.11.2026 (Nachtrag
in `auftraege/runde5c_akt4.md`). Grundlagen: `13_Wegenetz.md`, Abschnitt 2 (Sperre S6, Nebenort N4,
Gummistiefel); Hafen von Silicon Bay (`szenen/silicon-bay-hafen.json`, Steg der Inselfähre im Osten);
Akt 3 im Winterwind. Maßstab nach `KARTENREGELN.md` 7a.2: Nebenort, eine Karte von gut einem
Bildschirm Breite.

## 1. Ortsplan

### 1.0 Lage in der Welt

Die Insel liegt in der Bucht vor Silicon Bay. Vom Steg der Inselfähre im Osten des Hafens
(`siliconBay.hafen`, Steg Spalten 52–55, Reihen 30–35) fährt die Fähre hinüber; auf der Insel legt sie
am **Anleger im Norden** an (Bohlensteg Spalten 23–24, Reihen 1–5; er endet wie der Steg am Hafen im Wasser). Die Fähre fährt erst nach der
Nadel von Silicon Bay (S6, Bedingung `nadelSiliconBay`), dann dauerhaft. Das Watt im Süden ist ab
Runde 6 nur mit Gummistiefeln begehbar; in Runde 5 ist es Kulisse mit freiem Rand.

```text
                                   N
   ~~~~~~~~~~~~~~~~~~~~~~~~~ Bucht ~~~ ║ Anleger ~~~~~~~~~~~~~~~~~~~~~~~~
  ~ ┌────────────┬─────────────────────╨──────────┬─────────────────────┐ ~
  ~ │ P2 Felsspitze│ P1 Anleger: Fährboot, Schild │ P4 Pfahlhäuser      │ ~
  ~ │ Leuchtfeuer  │ Pelikanpfähle               │ auf Stelzen im      │ ~
  ~ │ Seefelsen    │ P3 Dorfplatz (Sand): Netze,  │ Bohlensteg übers    │ ~
  ~ │ Möwen        │ Fässer, Boote am Strand      │ Wasser, Boote       │ ~
  ~ └──────────────┴──────────────────────────────┴─────────────────────┘ ~
  ~       P5 Watt (Schlick): Muscheln, Seesterne, Krebse, Priele           ~
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ offene See ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

### 1.1 Inseldorf (`pelikaninsel.dorf`, 50 × 36)

| Abschnitt (Spalten / Reihen)  | Thema           | Inhalt                                                                 | Zum Entdecken                    |
| ----------------------------- | --------------- | ---------------------------------------------------------------------- | -------------------------------- |
| P1 Anleger (17–31 / 0–9)      | Ankunft         | Bohlensteg ins Wasser, Fährboot am Steg, Wegweiser, Kisten             | Pelikan „Bishop“ am Steg         |
| P2 Felsspitze (0–15 / 3–22)   | das Leuchtfeuer | Felsboden, Leuchtfeuer ohne Wärter, Seefelsen, Möwen                   | Tür des Leuchtfeuers             |
| P3 Dorfplatz (16–33 / 9–24)   | Fischerei       | Sandplatz, Netzgestelle, Fässer und Kisten, Boote auf dem Strand       | Old Pete am Netz                 |
| P4 Pfahlhäuser (34–49 / 3–25) | Wohnen          | bunte Pfahlhäuser im Wasser, Treppen hinunter zum Bohlensteg, Pelikane | Rettungsringe, Delphines Kutter  |
| P5 Watt (4–45 / 25–35)        | Ebbe            | Schlick bis an den Südrand, Priele, Muscheln, Seesterne, Krebse        | Coral sammelt Muscheln (Runde 6) |

**Ränder:** Wasser ringsum (Regel 6.4), im Süden das Watt bis an den Rand; man verlässt die Insel nur mit
der Fähre am Ende des Anlegers. **Laufzeit:** Anleger bis Leuchtfeuer etwa 30 Kacheln, bis zu den Pfahlhäusern etwa 25, gut
8 Sekunden.

### 1.2 Übergänge

| Von (Karte, Auslöser, Feld)                                        | Nach (Karte, Auslöser, Feld; Ankunft)            | Lage                                    |
| ------------------------------------------------------------------ | ------------------------------------------------ | --------------------------------------- |
| siliconBay.hafen `inselfaehre` (Stegende, Spalten 53–54, Reihe 35) | dorf `faehre` (Stegende, Spalten 23–24, Reihe 1) | Fähre; erst nach `nadelSiliconBay` (S6) |

## 2. Ortsbild

Winter in der Bucht. Der Wind kommt vom offenen Meer und schmeckt nach Salz; die Fähre schaukelt, und ein
Pelikan fliegt neben ihr her, als gehöre er zur Mannschaft. Die Insel ist flach, kaum mehr als ein Strand
mit einem Buckel aus Fels im Westen. Darauf steht das Leuchtfeuer, weiß und rot, seit Jahren ohne
Wärter; die Tür klemmt, das Licht blinkt nur noch, wenn jemand die Batterie wechselt. Im Osten stehen
die Häuser des Fischerdorfs auf Stelzen über dem Wasser, blau, rot, weiß gestrichen und vom Salz
verblichen, verbunden durch Bohlen, die bei jedem Schritt knarren. Auf jedem Pfahl sitzt ein Pelikan.
Auf dem Dorfplatz trocknen Netze, Old Pete flickt Masche um Masche, Fässer und Kisten stehen herum,
und ein paar Boote liegen kieloben im Sand. Bei Ebbe fällt im Süden das Watt trocken: Schlick, Priele,
Muscheln, ein Krebs, der seitwärts davonläuft. Hier gibt es kein Netz für Telefone und keine
Bildschirme, nur Wind, Möwen und das Klappern der Leinen an den Masten.

## 3. Abgleich mit der Geschichte

| Element (Wegenetz, N4)            | Entscheidung  | Grund                                                                        |
| --------------------------------- | ------------- | ---------------------------------------------------------------------------- |
| Fischerdorf, Häuser auf Stelzen   | bleibt        | drei eigene Pfahlhäuser (blau, rot, weiß) im Wasser, Treppe zum Steg         |
| Leuchtfeuer ohne Wärter           | bleibt        | auf der Felsspitze; Auslöser `leuchtfeuer` für die Batterie-Quest in Runde 6 |
| Pelikane auf jedem Pfahl          | bleibt        | eigene Bilder, Pelikane auf Pfählen im Wasser, dazu Belebung                 |
| Netze flicken (Old Pete)          | bleibt        | eigenes Netzgestell auf dem Dorfplatz neben Old Pete                         |
| Watt mit Coral (Gummistiefel)     | Kulisse       | Schlickfläche ohne Sperre in Runde 5; Bedingung Gummistiefel in Runde 6      |
| Partie gegen die Gezeiten         | entfällt hier | Stellungsduell, kein Kartenelement                                           |
| Delphine, Old Pete, Coral, Bishop | Statisten     | Figuren mit Dialogen erst in Runde 6                                         |

**Für Runde 6:** Auslöser `leuchtfeuer`, `netze`, `watt` (Bedingung Gummistiefel); Figuren Delphine, Old
Pete, Coral, Bishop mit Dialogen; Dialog für die geschlossene Fähre am Hafen („fährt nur sonntags“).

### 3.1 Runde 9: Winter, Mängel, Zustände (mittel-3, 10.11.2026)

Auftrag `runde9_uebrige_karten.md`: drei Mängel aus `variantenwahl.md`, die fünf Muster, Zustände (10.63).

**Inseldorf** (`pelikaninsel-dorf`)

- Mangel 1: Winter (`"jahreszeit": "winter"`): Tropenpflanzen entfernt, Gras wird Schnee, der Dorfplatz ist verschneit; das Grasufer wird zum Schneeufer.
- Mangel 2: Leuchtfeuer auf einer felsigen Landzunge (Felsboden als Rundung mit Spitze nach Westen ins Meer, Felsen ringsum) statt eckigem Kiesfleck; Inselfähre 11 × 4 (Bildwunsch inselfaehre.py, Regel 10.64 Kutter) statt Motorboot, am Anleger.
- Mangel 3: Sand: Unter der Winterfärbung sieht Sand wie Erde aus; der Platz ist deshalb Schnee. Netzgestell ersetzt durch Netztrockner (Bildwunsch netztrockner.py: Böcke, Stange, durchhängendes Netz mit Schwimmern).
- Zustände: keine.

### 3.2 Runde 9: Gutachten (mittel-3, 10.11.2026)

`gutachten/jahrmarkt-pelikaninsel.md`: Die Karte ist acht Reihen nach Norden gewachsen (50 × 44);
der Anleger hat einen Querkopf, an dem die Fähre in Normgröße (18 × 6, Bild der Küstenfähre,
`pk9Faehre`) längsseits an zwei Pollern liegt. Das Leuchtfeuer steht auf einer verschneiten
Landzunge zwischen Felsen statt auf einem Kiesfeld. Die Ruderboote liegen im Wasser, Fässer stehen
gruppiert am Anleger und an den Kisten, fünf statt zwölf Möwen.

### 3.3 Runde 9: zweite Prüfung (mittel-3, 10.11.2026)

Reif für den Autor. Zwei statt fünf einzelne Möwen neben der Schar.

## 4. Bühnenbilder

**Größe** 50 × 36. **Boden** Strand und Dorfplatz Erde (der Sandboden zeichnet sich fleckig), Felsspitze
Felsboden, Stege dunkles Holz, Watt Schotter (grau wie nasser Schlick), ringsum Wasser.
Dünengras als Sprosse, Boote im Sand mit Kollision, Boote und Seefelsen im Wasser ohne (das Wasser sperrt). Bühnenbild je Variante in den Szenen
(`inhalte/abenteuer/szenen/pelikaninsel-dorf.json`, B und C in `szenen/varianten/`): A Leuchtfeuer im
Westen und Dorf im Osten, B gespiegelt und schlichter, C mit größerem Watt, mehr Booten und einem Kutter,
der bei Ebbe im Watt liegt. Die Pfahlhäuser (eigene Bilder, 4 × 5) stehen ohne Kollision im Wasser, das Wasser sperrt; ihre Treppen
enden am Bohlensteg darunter. Leuchtfeuer (3 × 6, Tür unten in der Mitte), Netzgestell und Pelikane auf
Pfählen sind ebenfalls eigene Bilder.

## Nachtrag: Leuchtfeuer nur mit Batterie (10.11.2026, mittel-2)

- **Befund (Simulation):** Beim zweiten Besuch führte `pelikaninsel.leuchtfeuer` jeden Auftrag nach
  `leuchtfeuer_einsetzen`, auch ohne Batterie. Die Quest `pelikaninsel.leuchtfeuer` wäre damit ohne
  Batterie fertig geworden: 35 Münzen und `gegenstandWeg` für eine Batterie, die es nicht gibt.
- **Behoben:** Der Knoten führt nur mit `hatBatterie` zum Einsetzen. Ohne Batterie sagt der
  Erzähler, dass das Feuer dunkel bleibt und es drüben in Silicon Bay eine gibt. Die Batterie gibt
  der Eisenwarenladen der Altstadt (Quest `siliconBay.batterie`).
- **Dazu, allgemein:** Die App meldete Knoten mit nur einer Zeile vor `END` nie an die Quests,
  `leuchtfeuer_einsetzen` ist so ein Knoten. Seitdem meldet `dialog/geschichte.ts` Knoten über ihre
  Besuchszahl, der Paketbau übersetzt mit „alle Besuche zählen“.

## Runde 7: Leben und Finch-Figur (10.11.2026, mittel-4)

Zu Delphine, Old Pete und Coral kommen drei ansprechbare Statisten (`statist.pelikaninsel.dorf.*`):

- Fischerin (Pelikane wie Bauern vor dem Doppelschritt);
- Netzflicker (Narrenmatt, 16, 4.1 Nr. 9);
- Inselkind (Fähre im Winter).

Tiere: Bishop, Pelikane, Möwen, Krebs, Reiher, Alligator.

**3.3 Feld für Runde 6:** `finchBauerH` bei A (40, 13), B (40, 10), C (40, 13), begehbar, mit
Finkenzeichen aus Blech.

## Runde 6: spielbar (10.11.2026, mittel-4)

- **Figuren** statt Statisten: Delphine, Old Pete, Coral. Der Pelikan Bishop bleibt Belebung. Dafür
  kommt der Muschelsammler als Statist dazu (Weiß beginnt erst seit dem 19. Jahrhundert, 16, 4.1
  Nr. 7).
- **Nebenquest `pelikaninsel.netze`** (klein): Aufgabenrunde „Welche Figur hängt?“ mit Old Pete,
  15 Münzen. Danach liegt am Netz der Fund `treibholzTurm`.
- **Nebenquest `pelikaninsel.leuchtfeuer`** (klein): Das Leuchtfeuer braucht eine Batterie
  (Gegenstand `batterie`). Lohn 35 Münzen. **Offen:** Die Batterie muss es in Silicon Bay geben
  (mittel-3), etwa als Wirkung `gegenstand: batterie` am Hafen.
- **Watt:** `watt` und Coral prüfen `hatGummistiefel`. Mit Stiefeln schenkt Coral den Fund
  `muschelCoral`. Die Gummistiefel gibt es in Lockport (niedrig-1).
- **Fund:** `finchBauerH`.
