# Lektorat Akt 2: Umsetzung durch mittel-2 (17.11.2026)

Auftrag des Hauptchats zu `docs/spiel/auftraege/lektorat_17-11.md`, Abschnitt Akt 2, Größere
Fragen (Regel 9: Empfehlungen umsetzen, Widerspruch genügt). Nicht angefasst wurden die Dateien,
in die gerade Gemini-Bilder eingebaut werden (`hochebene-schule*`, `jahrmarkt-festplatz`,
`silicon-bay-altstadt*`, `weg-silicon-delacroix-faehre`).

## 1. Anlass für Ironwood, Verbotsszene zu Hause

Nach dem Wohnwagen gab es keine laufende Quest, und die Verbotsszene zu Hause
(`maple-falls-wohnzimmer.nicht_ironwood`) sah nur, wer zwischendurch heimfuhr. Die Simulation
erreichte sie nie.

- **Juno nennt das Turnier:** Neuer Knoten `riverton-wohnwagen.turnier_nachricht` nach Slicks
  Abschied am Fluss. Juno liest die Nachricht von Coach Delgado (Freundschaftsturnier in Ironwood,
  vier Bretter), der Zettel liegt zu Hause bei Mama. Danach die Wahl „Mit dem Abendzug nach Hause
  fahren“ (`reise` ins Wohnzimmer) oder „Noch in Riverton bleiben“.
- **Neue Hauptquest `ironwood.turnier`** („Das Turnier in Ironwood“):
  - Start ist der Knoten `turnier_nachricht`.
  - Schritt 1: Mama den Zettel zeigen (`nicht_ironwood`).
  - Schritt 2: über den Kanalweg nach Ironwood (`ironwood.aussen`).
- **Kanalweg:** Er öffnet erst nach Mamas Nein (`orte.json`, `wenn: nadelRiverton und
verbotGesehen`). Vorher sagt Juno am Kanal „Erst nach Hause“ und bietet die Zugfahrt an
  (`riverton-aussen.kanalweg_heim`). So läuft Szene 38 zu Hause für alle. Der Anruf bei der Ankunft
  in Ironwood bleibt als Rückfall in der Datei.

## 2. Lockport und Bahndamm mit Sprecherzeilen

Imogen, Ruben und Henrik sowie Marian Shaw am Bahndamm (Sprecher `rosalind`, Name „Marian Shaw“)
sprechen jetzt mit eigener Zeile statt als Erzählzeile in Anführungszeichen. Wo vor der Rede eine
Beschreibung stand, ist sie eine eigene Erzählzeile geblieben („Henrik ruft vom Tresen.“). Dasselbe
gilt für Ruben an den Anlegern in Riverton und Ironwood. Die vier Sprecher stehen in der Liste
„noch ohne Porträt“ (`Portraet.test.ts`); ihre Namen gibt es in `texte/de.json`.

## 3. Kantine nach dem Kauf

- **Figuren:** Hank, Priya und Mama stehen nach dem Kauf nicht mehr in der Kantine
  (`orte.json`, `wenn: nicht kaufGesehen`). Mama bleibt, bis sie die Lernkarte gegeben hat.
- **Big Joe** räumt in `big_joe_nach_kauf` zwischen den Kartons. Die Revanche bietet er in seiner
  Garage an, „das Stahlbrett steht schon dort“. Die Feier, falls sie vorher abgelehnt wurde, holt
  er dort nach. In der Kantine steht er bis zum Ende von Akt 3, danach ist er in Crossroads.
- **Stahlbrett:** Ansehen zeigt nach dem Kauf den hellen Fleck auf dem Tisch.

## 4. Treppe oder Brücke

Slick spielt jetzt „auf der Treppe unter der alten Steinbrücke“. Damit passen seine Sätze zu Eli
unter der Brücke, zu Mr. Dunmore („unter einer Brücke, Dach hat er“) und zu Port Delacroix
(„unter der alten Steinbrücke“).

## 5. Finchs Figuren aus Buchsbaum

„Aus hellem Holz“ heißt jetzt „aus Buchsbaum“ an drei Stellen:

- `weg-maple-cedar.ink`
- `bayou.ink`
- `weg-silicon-delacroix.ink` (Dialog, nicht die Fährszene)

Dazu kommt `fund.finchLaeuferA.text`. Der Satz „Waldholz“ (Springer, Läufer, Turm aus hellem
Holz) ist ein anderer Satz und bleibt.

## 6. Rückfahrt durch Akt 1

- **Coach Delgado** (`coachStand()`): Riverton geschafft und für Ironwood angemeldet / vier
  Nadeln / Silicon Bay, statt nur „Cedar Creek hast du hinter dir“.
- **Juno in Maple Falls** (`junoStand()`): das Tagebuch je Stand, sieben Seiten Riverton, vier
  Nadeln mit Mamas Foto, Silicon Bay. Juno bleibt in Maple Falls sichtbar. Sie wohnt dort; wenn
  {held} zu Hause ist, ist sie es auch.

## Prüfungen

Ergebnisse siehe Meldung an den Hauptchat:

- inkbesuche
- Sprachprüfung
- pytest
- vitest
- Simulation mit den Startwerten 1 bis 3

Jede neue Stufe habe ich außerdem einzeln mit dem Ink-Compiler durchgespielt.
