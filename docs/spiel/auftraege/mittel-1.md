# Auftrag mittel-1: Ink-Dialoge für Maple Falls (Akt 1, Szenen der Story-Bibel)

**Stand:** offen (Haupt-Chat, 07.11.2026, zweiter Auftrag; der erste, die Story-Bibel, ist
zusammengeführt)
**Zweig:** dein fester Sitzungszweig (zuletzt `claude/schach-abenteuer-mittel-1-cl431d`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/*.ink` (neu, außer `maple-falls-dachboden.ink`:
nur ergänzen, vorhandene Knoten behalten), `inhalte/abenteuer/quests.json` (nur Quests mit
`ort: "mapleFalls"`), `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel, am Ende anhängen),
`docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py`
(Python-Umgebung: `python3 -m venv .venv && . .venv/bin/activate && pip install -r pipeline/requirements.txt`),
dann in `app/`: `npm ci` (einmal) und `node skripte/baue-abenteuerpaket.mjs` (übersetzt jede
Ink-Datei; ein Ink-Fehler bricht ab), zuletzt `npx prettier --check ../inhalte/abenteuer`.

## Ziel

Alle Dialoge von Maple Falls aus `05_Story_Bibel.md` (Szenen in Maple Falls, Akt 1) als
Ink-Dateien, so wie `inhalte/abenteuer/dialoge/de/maple-falls-dachboden.ink` und
`inhalte/abenteuer/README.md` es vorgeben. Der Prototyp (Schritt 5) spielt heute nur den Dachboden;
mit diesen Dateien wird Maple Falls spielbar, sobald die Spielsysteme (Schritt 8) da sind.

## Vorgaben

1. **Eine Datei je Karte:** `maple-falls-wohnzimmer.ink`, `maple-falls-aussen.ink`,
   `maple-falls-clubraum.ink`, `maple-falls-park.ink`; den Dachboden ergänzen (Szenen nach der
   ersten Partie: Ambrose erklärt den Fingerzeig, Hinweis auf die Schule).
2. **Knoten je Figur und Zustand:** Jede Figur hat einen Einstiegsknoten (wie in `orte.json`,
   Feld `dialog`, etwa `maple-falls-clubraum.coach`), der nach Spielstand verzweigt. Dafür die
   globalen Variablen aus der Bibel benutzen (`VAR`-Zeilen am Dateianfang, gleiche Namen in
   allen Dateien; neue Variablen in den Bericht). Quests warten auf Knoten mit `datei.knoten`;
   diese Knotennamen in `quests.json` eintragen.
3. **Externe Funktionen** nur die sechs aus dem README. `beginnePartie` nur mit Kennungen aus
   `begegnungen.json` (`mapleFalls.ersteLektion`, `mapleFalls.samRevanche`,
   `mapleFalls.clubkampf`); braucht eine Szene eine weitere Begegnung (Straßengegner Jo, Victor),
   in den Bericht schreiben, die Datei ist für dich gesperrt.
4. **Stilregeln** aus der Bibel (Abschnitt Dialog-Stilregeln): höchstens zwei Sätze je Zeile,
   Lesealter 10, Held geschlechtsneutral, Ambroses fünf Regeln, Tags `#sprecher`, `#stimmung`,
   `#klang`, `#pause`. Keine Seitenzahlen, keine Buchzitate über kurze Regelzitate hinaus.
5. **Quests:** Für jede Szene mit Quest einen Eintrag in `quests.json` nach dem Schema
   (`schemas/abenteuer-quests.schema.json`): Schritte mit Ereignis (Dialogknoten, Partie,
   Aufgabenrunde, Ort) und Wirkungen (Karte nach `06_Regelwerk.md` R27, Steckbrief, Zustand, Szene).
   Vorhandene drei Quests dürfen angepasst werden.
6. **Texte:** Namen, Questtitel und Schritttexte als Schlüssel in `texte/de.json` (Muster
   `bereich.name.feld`), nur anhängen.

## Was nicht dazugehört

Cedar Creek (eigener Auftrag), Karten (Tiled), Gegnerprofile, Begegnungen, Code.

## Bericht

(vom Helfer auszufüllen: Dateien, Knotenliste je Datei, neue Variablen, fehlende Begegnungen und
Figuren in `orte.json`, offene Fragen)
