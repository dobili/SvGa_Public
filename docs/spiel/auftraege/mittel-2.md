# Auftrag mittel-2: Spieldaten für Riverton, Ironwood und die Wege dorthin

**Stand:** offen (Haupt-Chat, 08.11.2026, sechster Auftrag; Grundlage ist dein Akt 2 in
`05_Story_Bibel.md` und `09_Weltbeschreibung.md`, Abschnitte 5.4 und 5.5)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-regelwerk`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/orte.json` (nur neue Orte anhängen: `riverton`, `ironwood`,
`wegCedarRiverton`, `wegRivertonIronwood`; in `cedarCreek` nur einen Übergang zum Bahnhof/Weg
ergänzen), `inhalte/abenteuer/gegner.json`, `begegnungen.json`, `runden.json` (anhängen),
`inhalte/abenteuer/quests.json` (nur Quests mit `ort` riverton, ironwood oder den beiden Wegen),
`inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q` (alle), in `app/`
`node skripte/baue-abenteuerpaket.mjs` und `npx prettier --check ../inhalte/abenteuer`

## Ziel

Akt 2 als Spieldaten, so wie du Cedar Creek angelegt hast: Orte mit Karten (Kennungen und
Dateinamen, die Karten selbst zeichnet später niedrig-1), Figuren, Gegnerprofile, Begegnungen,
Aufgabenrunden, Quests und Texte. Danach können mittel-1 die Dialoge und niedrig-1 die Karten
bauen, ohne etwas zu erfinden.

## Vorgaben

1. **Orte:** `riverton` (Nummer 3) und `ironwood` (Nummer 4) mit Club (Kapitel nach
   `07_Aufgabenzuordnung.md`, Zeitbudget, Buchübungen, Themen), Karten und Auslösern nach 09;
   Wege `wegCedarRiverton` und `wegRivertonIronwood` als `art: "weg"`, Nummer 0, je zwei Karten,
   Stationen als Auslöser (Tafel, Fund, Gegner, Wanderer). Übergänge mit Dialog und `wenn` dürfen
   benutzt werden (siehe `inhalte/abenteuer/README.md`, neu: Abschied, Ankunft, Sperre).
2. **Gegner:** Clubchefs nach R4 (`eingang`, 160 + 60 · Nummer: Slick +340, Big Joe +400; die
   Pipeline prüft das), Clubmitglieder −100 bis +50, Straßengegner −150 bis 0; Stil, Schwächen und
   Steckbrief aus der Bibel.
3. **Begegnungen:** Clubkämpfe, Straßenduelle (Stellungsduell aus den Abbildungen, die du schon
   geprüft hast: 3.77, 3.75, 6.14, 6.5, 8.44), Wiedereinstieg und Karten nach Regelwerk.
4. **Runden:** Reihenblöcke der Clubmitglieder (`reihe: true`, Buchübungen nur aus dem Club, die
   als Taktikaufgabe mit Lösungszug vorliegen; sonst Themen), Rätseltafeln der Wege mit `anzahl`.
5. **Quests:** Haupt- und Nebenquests der Bibel, Funde als Wirkung `gegenstand` (Fahrrad im
   Schuppen von Riverton), übergreifende Quests E4 mit `voraussetzung`.
6. Läden, Münzen und Zeitkarten noch nicht als Daten (die Formate kommen mit Schritt 12 und 13);
   Angebote und Preise stehen schon in deiner Bibel.

## Was nicht dazugehört

Dialoge (Ink), Karten (Tiled), Code, Änderungen an Maple Falls.

## Bericht

(vom Helfer auszufüllen)
