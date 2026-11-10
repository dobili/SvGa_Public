# Auftrag Runde 6: Die neuen Orte spielbar machen (10.11.2026)

**Basis:** `claude/friendly-shannon-y8bf90` hereinholen (Commit dieses Auftrags oder neuer),
privates Repository auf `main`. Ablauf, Meldungen und Varianten wie in Runde 7. Der Autor sieht
gerade die Karten durch; seine Wahl kann einzelne Varianten wegfallen lassen. Deshalb gilt: Jeder
neue Auslöser steht in **allen drei Varianten** einer Karte, an passender Stelle. Keine Rückfragen
an den Autor.

## Warum

Runde 7 hat die Ereignisorte, Statisten und Sammelstellen auf die Karten gebracht (Dokumente 15
und 16). Spielbar sind sie noch nicht. Es fehlen Auslöser in `orte.json`, Dialoge (Ink), Quests,
Funde und die Bedingungen der Sperren. Diese Runde schließt die Lücke für Akt 1 bis 4.

## Grundlagen

1. `docs/spiel/auftraege/runde6_sammlung.md`: alles Offene je Ort, Sperren S1 bis S14, Technik.
2. `docs/spiel/15_Routen_Ereignisse.md`: Ereignis je Weg, die vier Sammelstränge, Tabelle in
   Abschnitt 3, Technikbedarf in Abschnitt 4.
3. `docs/spiel/16_Statisten_und_Tiere.md` und `16a_Vorrat_Zitate_Zuege.md`: Stimmen und Vorrat.
4. `docs/spiel/05_Story_Bibel.md`:
   - Stilregeln 5.1 bis 5.5: Länge, Neutralität für {held}, Ambroses Sprache, Tags, externe
     Funktionen;
   - die Szenen je Akt.
5. `docs/spiel/13_Wegenetz.md`: Sperren und Rückkehr.
6. `docs/spiel/17_Mehrsprachigkeit.md`, Abschnitt 2: Ganze Sätze als ein Schlüssel. Keine Logik im
   Text.
7. Ortsdokumente, Teil 3.3 „für Runde 6“: Dort stehen die Felder aller Fundstellen je Variante.

## Was je Ort zu tun ist

1. **Ansehen-Auslöser:** Alle Gegenstände, die in Runde 5 und 7 als „Ansehen“ vorgesehen sind,
   bekommen einen Eintrag in `orte.json` (art `dialog`) und einen kurzen Ink-Knoten (ein bis drei
   Sätze, Ambrose höchstens jedes vierte Mal).
2. **Sperren** nach `runde6_sammlung.md`, Abschnitt 2:
   - Bedingung `wenn` am Übergang;
   - ein Dialog, der den Grund in der Welt nennt (Gatter, Hochwasser, Wachmann);
   - die öffnende Stelle (Fund, Nadel, Szene) als Variable.

   Gegenstände (Laterne, Gummistiefel) bleiben, wie sie sind. Wo die App etwas Neues braucht
   (Lichtkreis der Laterne), steht der Auslöser schon jetzt da und wartet auf mittel-2.

3. **Ereignis des Wegs** nach Dokument 15, Abschnitt 2:
   - Auslöser `ereignis…` am Ereignisort;
   - Ink-Datei mit Ablauf in zwei bis vier Schritten;
   - Quest mit `klein: true`;
   - Lohn über `gibFund`, `gibKarte` oder Münzen.

   Ereignisse „später“ setzen ihre Bedingung (Akt, Nadel, Rückkehr), vorher steht nur der
   Vorher-Zustand (Plakat, leerer Platz).

4. **Sammelstränge** (Dokument 15, Abschnitt 1, Tabelle Abschnitt 3):
   - Fundstellen als Auslöser mit `gibFund`;
   - Funde in `funde.json`:
     - `finch<Figur><Buchstabe>`;
     - `seite00` bis `seite12`;
     - `spurPM1` bis `spurPM6`;
     - `kreide1` bis `kreide5`.
   - Die Quests der Stränge legt mittel-1 an (unten). Ihr setzt nur die Funde und Auslöser eurer
     Orte.
5. **Buchseiten:**
   - Titel des Kapitels aus den App-Daten (`app/public/daten/de/a1/`, Kapitelübersicht). Den
     einen Satz je Seite schreibt der Autor selbst.
   - Bis dahin steht im Text nur der Titel und „Eine Seite aus einem Handbuch, Kapitel N.“
   - Keine Buchtexte ins Repository (CLAUDE.md, Regel 2).
6. **Prüfung:**
   - `python -m pipeline.abenteuer.uebergaenge`;
   - die Kartenbauer-Befunde;
   - pytest und `npm run pruefen`; dort prüfen die Tests der App Ink, Quests und Texte;
   - für eine neue Ink-Datei ein Durchlauf mit dem Ink-Test der App, falls einer für den Ort
     existiert.

## Verteilung (wie Runde 7)

| Helfer    | Orte und Wege                                                                                                                                                                                                 | dazu                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| mittel-1  | Port Delacroix, Capital (mit Innenstadt und U-Bahnhof als neuem Innenraum, 15 §2.14), Weg 5, Bayou, Weg 11 (Weltschachtag)                                                                                    | **Quests der vier Sammelstränge** (Finch-Jagd, Buchseiten, Spuren, Kreidespringer) mit `voraussetzung`, Endpunkte am Leuchtturm und in Capital |
| mittel-2  | Riverton, Ironwood, Weg 3; **zuerst die Technik**                                                                                                                                                             | Technik aus 15 §4 und runde6_sammlung §4, siehe unten                                                                                          |
| mittel-3  | Silicon Bay (mit Altstadt und Inselfähre S6), Crossroads, Jahrmarkt, Weg 4, Weg 8, Weg 9                                                                                                                      |                                                                                                                                                |
| mittel-4  | Summit City, Desert Springs, Pinewood Camp, Weg 6, Weg 7 (Diner-Hinterzimmer als neuer Innenraum für K3), Hochebene, Weg 10 (Tankstelle als neuer Innenraum), Kürbishof, Pelikaninsel, Steinbruch, Sternwarte | Goldmine (S11) ebenfalls                                                                                                                       |
| niedrig-1 | Maple Falls, Cedar Creek, Lockport, Ghost Town, Weg 1 (Flohmarkt, S1, S5), Weg 2 (Zugpartie, S14)                                                                                                             | Zedernpfad S2, Schleuse S3                                                                                                                     |

## mittel-2: Technik zuerst

In dieser Reihenfolge, je mit Vitest und, wo sichtbar, einem e2e-Test:

1. **Laterne:** Lichtkreis von vier Feldern um den Helden auf dunklen Karten (`hatLaterne`).
   Bedingung für S4, S9, S11 und S14.
2. **Tönung** je Karte oder Szene: Nebel, Nacht, Abend, Sepia, Dunkel. Ein Feld `toenung` in
   Szene und Karte, und der Dialog kann sie setzen (`setzeToenung`).
3. **`zustand_der_karte`:** Die App lädt den Hintergrund `<kennung>-<zustand>.png`, wenn die
   Variable gesetzt ist (Musikhaus).
4. **Neue Partieformen** aus Dokument 15, Abschnitt 4:
   - **Kandidatenwahl:** Der Gegner zieht zufällig einen von drei vorgegebenen Zügen (Stream).
   - **Partie nach Gehör:** Der Gegnerzug erscheint erst als Notation (Funkschach).
   - **Simultan:** mehrere Stellungsduelle hintereinander, mit Gesamtwertung (Weltschachtag).
   - **Gedächtnisstellung:** fünf Sekunden zeigen, dann aufbauen (Seilschaft).
   - **Gegner mit Buch und Bruch:** stark im Buch, danach Stufe 2 (Z-1).
5. **Sammelkarte der Finch-Jagd** als Seite im Tagebuch: 16 Kästchen mit Feldnamen, Fortschritt
   aus den Funden.
6. **Lebendschach:** Brettansicht mit dem Bild der Lichtung dahinter. Die Animation der Kinder
   folgt später.

Danach Riverton, Ironwood und Weg 3 wie die anderen.

## Was nicht in diese Runde gehört

- **Englisch** (Dokument 17): erst nach der fertigen deutschen Fassung.
- **Neue Karten oder Umbauten:** Die Wahl des Autors steht noch aus; Auslöser kommen in alle
  Varianten.
- **Das Meisterproblem der Finch-Jagd:** Der Haupt-Chat baut es mit der Engine. Die Felder stehen
  in Dokument 15, Abschnitt 3.

## Ende

- alle Prüfungen grün;
- Ortsdokumente Teil 3 nachgezogen;
- Commit, Push, Meldung an den Haupt-Chat mit Liste der neuen Auslöser, Dialoge, Quests und
  Funde.
