# Auftrag mittel-2: Spieldaten für Cedar Creek (Ort, Figuren, Gegner, Begegnungen, Quests)

**Stand:** fertig (mittel-2, 07.11.2026, zweiter Auftrag)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-regelwerk`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/orte.json` (nur den neuen Ort `cedarCreek` anhängen und in
`mapleFalls` die Figuren aus der Bibel ergänzen: Juno, Abernathy, Lily), `inhalte/abenteuer/gegner.json`
(neue Profile anhängen; vorhandene nur, wenn die Bibel es verlangt, dann im Bericht nennen),
`inhalte/abenteuer/begegnungen.json` (anhängen), `inhalte/abenteuer/quests.json` (nur Quests mit
`ort: "cedarCreek"`), `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel, am Ende anhängen),
`docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py`
(Python-Umgebung: `python3 -m venv .venv && . .venv/bin/activate && pip install -r pipeline/requirements.txt`),
dann in `app/`: `npm ci` (einmal) und `node skripte/baue-abenteuerpaket.mjs`, zuletzt
`npx prettier --check ../inhalte/abenteuer`.

## Ziel

Die zweite Stadt als Daten, nach `05_Story_Bibel.md` (Welt und Szenen in Cedar Creek) und
`06_Regelwerk.md` (Zielstärken R4, Karten R27, Formate R11 bis R14). Die Schemas in
`schemas/abenteuer-*.schema.json` sind der Vertrag; `inhalte/abenteuer/README.md` erklärt die
Kennungen. Die Stellungnahme (Abschnitt 3) und `07_Aufgabenzuordnung.md` geben die Buchkapitel
und Aufgaben des Clubs (Club 2: Matt in 1 und 2; Themen `matt1`, `matt2`, `mattbilder`,
Buchübungen 36, 42, 43, 46, 47, 48, 49, 51, 52).

## Vorgaben

1. **Ort `cedarCreek`** mit den Karten der Bibel (Außen, Bibliothek, Archiv, Waschsalon),
   Figuren mit `sprite`, `dialog` (Knoten `cedar-creek-<karte>.<figur>`, die Ink-Dateien schreibt
   ein späterer Auftrag) und `gegner`, Auslöser mit Bedeutung (Übergänge zwischen den Karten und
   zurück nach `mapleFalls.park`), Club mit `kapitel: [7, 8]`, `chef`, `mitglieder`, `aufgaben`
   (Minuten nach Regelwerk R30 ff., Buchübungen als Labels aus `07_Aufgabenzuordnung.md`).
2. **Gegnerprofile** für alle Schach spielenden Figuren in Cedar Creek (Okafor E + 280 laut
   Bibel, Dex, Mae, Rosa, Victor dort) und die noch fehlenden in Maple Falls (Juno, Lily, falls
   sie spielen): Zielstärke nach R4, Gewichte auf Fehlerarten aus `app/src/engine/fehlerart-typen.ts`
   (Namen genau so), Stil, Eröffnung, Steckbrief (zwei bis drei Zeilen, aus dem Profil ableitbar).
3. **Begegnungen** für jede Partie der Szenenliste in Cedar Creek und die fehlenden in Maple
   Falls (Straßengegner Jo, Victor zu Beginn als Partie aus der Grundstellung mit `zaehltFuerApp:
false`, R33), Format nach Regelwerk (Stellungsduelle als `stellungsduell` mit Zugzahl und
   Mindestvorteil; die Startstellung als `abbildung` aus dem Buch oder `grundstellung`).
4. **Quests** für Cedar Creek (eine je Typ raetsel, hilfe, begegnung plus Hauptquest), Schritte
   mit Ereignissen und Wirkungen; Karten als Belohnung nur nach R27.
5. **Texte** als Schlüssel in `texte/de.json`, nur anhängen.

## Was nicht dazugehört

Ink-Dialoge, Tiled-Karten, Code, Änderungen an Schemas oder Verträgen (Vorschläge in den Bericht;
die V1 bis V9 aus deinem ersten Bericht prüft der Haupt-Chat mit Schritt 8).

## Bericht

**Fertig** auf dem Zweig `abenteuer-regelwerk` (Basis `claude/friendly-shannon-y8bf90`
hereingeholt). Alles nur angehängt; vorhandene Einträge sind unverändert.

**Neue Einträge**

- `orte.json`: Ort `cedarCreek` (Nummer 2, Staffel 1) mit Karten `cedarCreek.aussen`,
  `.bibliothek`, `.archiv`, `.waschsalon`; Figuren `cedarCreek.okafor`, `.dex`, `.mae`,
  `.boateng`, `.rosa`, `.victor` (ohne Gegner, Szene 21 ist nur Dialog); Auslöser
  `bushaltestelle` (start), `busZurueck` (dialog), Übergänge `bibliothekTuer`/`bibliothekAusgang`,
  `kellertreppe`/`kellerAusgang`, `waschsalonTuer`/`waschsalonAusgang`, Gegenstände `plakat`,
  `steg`, `trockner`, `karton1858`, `programmheft`; Club mit `kapitel: [7, 8]`, Chefin Okafor,
  Mitglieder Dex und Mae, Aufgaben 15 Minuten (R30: bei A = 800 drei Buchübungen und neun
  Motivaufgaben, also 12), neun Buchübungen als Vorrat (36, 42, 43, 46, 47, 48, 49, 51, 52; R30
  nimmt je Runde höchstens drei), Themen `matt1`, `matt2`, `mattbilder`, `grundreihenmatt`.
  In `mapleFalls` neu: Figuren `mapleFalls.juno` (mit Gegner), `.abernathy`, `.lily`.
- `gegner.json`: `mapleFalls.juno` (Clubmitglied, A − 100, hängende Figuren, Schlagreflex),
  `cedarCreek.okafor` (Clubchefin, E + 280, Endspiel +1, Taktiker/Verteidiger, langsam in der
  Eröffnung, sieht Grundreihen gut; Damengambit abgelehnt oder Philidor), `cedarCreek.dex`
  (A ± 0, Taktiker, König in der Mitte), `cedarCreek.mae` (A − 50, Angreiferin, übersieht
  Drohungen), `cedarCreek.rosa` (Straße, A − 50, Verteidigerin).
- `begegnungen.json`: `mapleFalls.joDuell` (Stellungsduell aus Abb. 1.21, 10 Züge, +1,0),
  `mapleFalls.victorHerausforderung` (Grundstellung, Leser Schwarz, `zaehltFuerApp: false`),
  `cedarCreek.rosaDuell` (Stellungsduell aus Abb. 1.41, 10 Züge, +1,0), `cedarCreek.clubkampf`.
- `quests.json`: Haupt `cedarCreek.archiv1858` und `cedarCreek.clubkampf`, rätsel
  `cedarCreek.trockner`, hilfe `cedarCreek.archivOrdnen`, begegnung `cedarCreek.sternennacht`
  (Okafor abgelenkt 1,3) und `cedarCreek.erinnerungNewYork` (Fragment 1).
- `texte/de.json`: 33 neue Schlüssel (Orte, Club, Figuren, Quests, `zustand.ueberheblich`).

**Annahmen und Entscheidungen**

1. **Victor zu Beginn aus der Grundstellung** wie Bibel (Szene 12) und Auftrag, nicht wie R33 im
   Regelwerk (schlechte Stellung). Karten erlaubt wie in der Bibel (R28 sperrt sie noch). Der
   Haupt-Chat sollte R28 und R33 an die Bibel anpassen; ich durfte das Regelwerk diesmal nicht
   ändern.
2. **Stellungsduelle mit Engine geprüft** (Stockfish 19 aus `app/node_modules`, Tiefe 12, nur
   lokal): Abb. 1.21 (nach 6… Kxf7, Kap. 1.3) Weiß am Zug +1,22, kein schnelles Matt, passt zu
   Jos Angriffsstil und zu R13. Für Rosa: Abb. 1.41 (Kap. 1.6, Goldene Angriffsregel, Weiß am Zug +1,09). Die Bibel wünscht ein Mattbild aus 7.4, aber alle Stellungen dort sind erzwungene Matts (R13 verbietet Matt in drei oder weniger); von 61 Abbildungen in Kap. 7 passte keine sauber in +0,8 bis +2,5. 1.41 ist die nächste Stellung mit Königsangriff. Kap. 3, 6, 8 und 11 habe ich nicht mehr durchgerechnet (zu langsam mit der WebAssembly-Engine); dort kann der Haupt-Chat mit der Pipeline eine bessere suchen.
3. **Übergang nach Maple Falls als Bus-Dialog** (`busZurueck`) statt `uebergang`: Der Test
   `test_querverweise_stimmen` erlaubt nur Übergänge innerhalb eines Ortes, und Cedar Creek liegt
   laut Bibel 20 Minuten mit dem Bus entfernt. Gegenstück im Park von Maple Falls fehlt noch
   (nicht erlaubt zu ändern, siehe Vorschläge).
4. **Übergänge mit getrennten Namen je Seite** (`bibliothekTuer` auf der Außenkarte,
   `bibliothekAusgang` in der Bibliothek), weil ein Auslöser genau ein Ziel hat. Das README sagt
   „Übergänge heißen auf beiden Karten gleich“; das geht mit einem Ziel je Name nicht.
5. **Erinnerung und Trockner-Rätsel als Aufgabenrunde** (`cedarCreek.erinnerungNewYork`,
   `cedarCreek.trocknerStellung`), weil das Schema kein Ereignis „Zugerraten“ und keine einzelne
   Stellung kennt.
6. **Karten nach R27:** Reihe Club 2 → Zweite Chance (an Schritt 3, Maes Runde), erste Nadel →
   Mentor-Zug (Remis gibt Bronze, zählt also), Rätsel → Flüstern, Hilfe → Flüstern, Erinnerung →
   Bauernvorgabe. Abweichung von der Bibel: Die Bibel gibt fürs Trockner-Rätsel nur die
   Steckbriefzeile und für die Erinnerung nur das Fragment; ich bin dem Regelwerk gefolgt, wie der
   Auftrag sagt. Straßensieg gegen Rosa (Zweite Chance) und „alle Nebenquests der Stadt“
   (Springervorgabe) sind Laufzeitregeln ohne Questeintrag.
7. **Okafors Steckbrief** beginnt mit dem Stil (Zeile 0, vom Trockner-Rätsel freigeschaltet),
   weil Boateng erzählt, dass sie früher Turniere mit Fallen gespielt hat.
8. **Juno spielt** (Clubmitglied, Bibel 2.7, Szene 6 stellt sie Aufgaben), Lily und Abernathy
   nicht; deshalb nur für Juno ein Profil.
9. Clubkampf `farbe: zufall` wie in Maple Falls (R12 will Weiß beim ersten Versuch, das Schema
   kennt nur white, black, zufall).

**Vorschläge (gesperrte Dateien)**

- `orte.json`, Ort `mapleFalls`: Juno in `club.mitglieder` (Runde `mapleFalls.reiheJuno`) und ein
  Auslöser `bus` im Park (dialog `maple-falls-park.bus`) als Gegenstück zu `busZurueck`.
- Quests für Maple Falls fehlen noch: `mapleFalls.lilysSpringer` (hilfe, Gefahrenradar),
  `mapleFalls.clubkampf`, `mapleFalls.victor` (Begegnung `mapleFalls.victorHerausforderung`,
  Ausgang alle drei).
- Schema `abenteuer-quests`: Ereignis `erinnerung` (Partiekennung, Startzug, Bestehensgrenze),
  Wirkung `dialogvariable` (für `ambroseVertrauen` +1 in Szene 19).
- Schema `abenteuer-begegnungen`: `farbe: "wechsel"` für R12 und `startstellung: meisterpartie`
  wie im Vertrag `partie.ts`.
- Test `test_abenteuer.py`: Übergänge zwischen Orten erlauben, wenn die Zielkarte in einem anderen
  Ort existiert; Begegnungen mit `abbildung` gegen die Buchdaten prüfen.
- `05_Story_Bibel.md`, Szene 23 nennt „Stellungsduell mit einem Mattbild“; Mattbild-Stellungen
  aus 7.4 sind erzwungene Matts und widersprechen R13 (kein Matt in drei oder weniger).

**Offen:** nichts Blockierendes.
