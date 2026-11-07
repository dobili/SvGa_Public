# Auftrag mittel-2: Spieldaten für Cedar Creek (Ort, Figuren, Gegner, Begegnungen, Quests)

**Stand:** offen (Haupt-Chat, 07.11.2026, zweiter Auftrag; das Regelwerk ist zusammengeführt)
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

(vom Helfer auszufüllen: Kennungen aller neuen Einträge, Annahmen, offene Fragen)
