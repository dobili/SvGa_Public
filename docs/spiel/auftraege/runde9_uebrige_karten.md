# Auftrag Runde 9: Die 48 übrigen Karten nach Regeln, Gutachten und Zuständen (10.11.2026)

**Basis:** `claude/friendly-shannon-y8bf90` ab Commit 41773874 hereinholen. Bilder nur als Bildwunsch
(Code in `docs/spiel/auftraege/bildwuensche/`, der Haupt-Chat rendert ins private Repository). Keine
Rückfragen an den Autor.

**Reihenfolge:** Erst die offenen Gutachten aus Runde 8 abarbeiten (eure Meldungen), dann diese Runde.

## Warum

Der Autor sieht die übrigen Karten nicht mehr in drei Varianten. Sein Ablauf (Revision 2):

1. Der Haupt-Chat wählt die beste Variante. **Erledigt:** `variantenwahl.md` (26 × A, 22 × C). Die
   Wahl C ist schon Hauptfassung, die alte A liegt als `varianten/<szene>-a.json`.
2. Die Notizen des Autors gelten als Regeln für alle Karten (`docs/spiel/KARTENPRUEFUNG.md`).
3. Jede Karte bekommt ihre Zustände aus der Geschichte (10.63).
4. Jedes Bild prüft der Gutachter, bevor der Autor es sieht.

## Grundlagen

1. **Je Karte:** der Eintrag in `variantenwahl.md`, mit drei Mängeln samt Kachellage. Am Ende der
   Datei stehen fünf Muster, die in fast allen Karten bleiben:
   - Höhen sind als Grundriss gezeichnet.
   - Wege laufen rechtwinklig.
   - Asphalt hat keine Markierung.
   - Innenräume sind laut und leer.
   - Gleiche Läden stehen mehrfach.
   - Beschreibungen sind nicht erfüllt.
2. **Prüfregelwerk:** `docs/spiel/KARTENPRUEFUNG.md` (Fragen an jeden Gegenstand, Prüfliste nach
   Themen). Dazu KARTENREGELN 10.55 bis 10.64:
   - 10.56 Innenräume nach Gebäudegröße
   - 10.57 Kanäle
   - 10.58 Weg zu jeder Tür
   - 10.59 Waren
   - 10.60 Schrägansicht
   - 10.61 Grund für Objekte
   - 10.62 Gleise
   - 10.63 Zustände
   - 10.64 Größen von Fahrzeugen und Schiffen
3. **Vorbilder:** `docs/spiel/vorbilder/README.md`. Es enthält die beste Vorlage je Thema und die
   Themen der Pakete, die zuerst zu nutzen sind (§6 im Prüfregelwerk).
4. **Neue Technik:**
   - **Felskanten:** `"kante": "klippe"` in der Szene (mittel-4, `inhalte/abenteuer/szenen/README.md`).
     Sie gibt Höhen eine Felswand mit Kante, Fuß und Treppen auf den Rampen. Gilt für Gras- und
     Erdboden.
   - **Roter Fels (Canyon, Sternwarte):** mittel-4 schreibt dafür einen Bildwunsch, der die
     Klippenkacheln rot umfärbt.
   - **Winter:** `"jahreszeit": "winter"` (mittel-2). Der Hintergrund wird umgefärbt, in der App
     schneit es. Blumen und Pilze gehören weg; kartenbild meldet sie. Wo Winter ist, sagt die
     Story-Bibel. Port Delacroix und die Pelikaninsel liegen nach dem Gutachten im Winter.
   - **Zustände:**
     - `zustaende` in `orte.json` mit Bedingungen wie bei `wenn`.
     - Szene `<basis>-<zustand>.json`, ihre Beschreibung beginnt mit „Zustand: …“.
     - Liste: `python -m pipeline.abenteuer.zustaende`.
   - **Neue eigene Bilder** (mittel-1):
     - Gartenhäuser `gartenhaus_braun/_blau/_rot/_weiss` und `bootsschuppen` statt der Gartenkiste;
     - Ladenfassaden je Zweck: `fassade_diner`, `_waschsalon`, `_rasthaus`, `_cafe`, `_kramladen`,
       `_eisenwaren`;
     - `wartehaus_hinten` für Haltestellen nördlich der Straße.
   - **Neue Pakete** im Katalog (`katalog_korrekturen/neue_pakete.json`, Übersicht privat
     `register/neue_pakete.md`):
     - Hafenböden mit Kaimauer, Leiter und Fendern sind brauchbar.
     - Schiffe, Fahrzeuge und Krane der Pakete sind laut 10.64 viel zu klein. Sie kommen nur
       verlängert oder skaliert in eine Karte, über einen Bildwunsch.

## Was je Karte zu tun ist

1. Die drei Mängel aus `variantenwahl.md` und die fünf Muster beheben, soweit sie die Karte betreffen.
   Das Prüfregelwerk Abschnitt für Abschnitt durchgehen und jeden Gegenstand befragen (§2).
2. Innenräume: Die logische Größe festlegen (Gebäude außen, Zweck, 10.56) und den Raum danach bauen.
3. Die Beschreibung der Szene erfüllen oder anpassen, wenn sie etwas verlangt, was es nicht gibt. Die
   Abweichung im Ortsdokument begründen.
4. Zustände auflisten:
   - Feste Objekte, die in der Geschichte dazukommen oder weggehen; Figuren und Tiere zählen nicht.
   - Je Zustand eine Szene mit Eintrag in `zustaende`.
   - Quellen:
     - Story-Bibel (`docs/spiel/05_Story_Bibel.md`)
     - `13_Wegenetz.md`
     - `15_Routen_Ereignisse.md`
     - `auftraege/runde6_sammlung.md`
5. Kartenbauer ohne Befund, Vorschau rendern und selbst ansehen. Es zählt das Bild.
6. Ortsdokument Teil 3 nachziehen: die Antworten auf die drei Mängel, die Liste der Zustände und
   Begründungen.
7. Die Karte samt Zuständen unten in `docs/spiel/auftraege/gutachten/WARTESCHLANGE.md` eintragen,
   etwa `- [ ] port-delacroix-aussen (Runde 9, mittel-1)`.

Wo eine Wahl C zur Hauptfassung wurde, sind Änderungen an der alten A aus Runde 8 nachzuziehen. Das
betrifft etwa:

- die Haltestelle in Crossroads außen (mittel-1, Regel: Straße südlich, also Vorderansicht);
- das Autowrack am Diner (mittel-4).

Der Zustand `diner-neon` beruht noch auf der alten A. Er wird aus der neuen Hauptfassung neu
abgeleitet.

## Verteilung

Jeder nimmt seine Orte aus Runde 7, damit er die Ortsdokumente schon kennt.

| Helfer    | Karten (Szenen)                                                                                                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mittel-1  | port-delacroix-aussen, -musikhaus (dazu Zustand neu), -turnhalle, -werkstatt; capital-arena-aussen, -halle, -innenstadt, -ubahnhof; weg-silicon-delacroix-faehre, -deich; bayou-steg; weg-ghost-capital-seeufer, -leuchtturm                |
| mittel-3  | crossroads-aussen, crossroads-raststaette; weg-summit-crossroads-geysirbecken, -praerie; jahrmarkt-festplatz; weg-crossroads-pinewood-huetten, -riesenbaeume; pelikaninsel-dorf                                                             |
| mittel-4  | summit-city-aussen, -huette, -bergstation, -bergladen; hochebene-felsentuerme, -schule; weg-desert-summit-bergstrasse, -diner (dazu Zustand neon), -hinterzimmer; sternwarte-felsnase, -kuppel; weg-delacroix-desert-canyonpfad, -felsbogen |
| mittel-2  | nach der eigenen Liste (Gutachterbefunde, Sammel-Nebenquests, Aufteilen der Simulation): desert-springs-aussen, -garage, -antiquariat; pinewood-camp-aussen; weg-pinewood-ghost-canyonrand, -staubstrasse                                   |
| niedrig-1 | ghost-town-aussen, -saloon; goldmine-stollen; erinnerung-siedlung-huette (Sepia); erinnerung-london-kaffeehaus, -strand (Sepia, fünf Fronten laut Beschreibung); kuerbishof-hof; weg-pinewood-ghost-tankstelle                              |

## Ende

- Kartenbauer und Übergänge ohne Befund, pytest, `npm run pruefen`, e2e Abenteuer.
- Commit, Push auf euren Zweig.
- Meldung mit:
  - Liste der Karten und Zustände;
  - Bildwünschen;
  - was offen bleibt und warum.
- Danach prüft der Gutachter. Seine Befunde kommen über den Haupt-Chat zurück.
