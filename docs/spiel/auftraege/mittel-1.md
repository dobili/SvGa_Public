# Auftrag mittel-1: Story-Bibel, Teil 1 (Akt 1, Maple Falls und Cedar Creek)

**Stand:** offen (Haupt-Chat, 07.11.2026)
**Zweig:** `abenteuer-story-bibel`, Basis `claude/friendly-shannon-y8bf90`
**Darf ändern:** `docs/spiel/05_Story_Bibel.md` (neu), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `cd app && npx prettier --check ../docs/spiel`

## Ziel

Schritt 1 des Projektplans (Dokument 02, Abschnitt 4), begrenzt auf Akt 1: das Dokument, aus dem
später alle Dialoge, Quests und Gegnerprofile geschrieben werden. Es gilt als abgesegnet, sobald
der Autor nicht widerspricht (CLAUDE.md, Regel 9).

## Inhalt von `05_Story_Bibel.md`

1. **Figuren** (Held, Ambrose, Mutter, Victor, Coach Delgado, Sam, bester Freund oder beste
   Freundin, Mrs. Okafor in Cedar Creek, zwei bis drei Nebenfiguren je Stadt): je ein Absatz
   Hintergrund, ein Absatz Sprechweise mit drei Beispielsätzen, ihre Rolle in der Haupthandlung,
   ihr Verhältnis zum Schach. Ambrose nach `01_Konzeptsammlung.md` (Charakterentwicklung des
   Geistes) und Dokument 02 (Zeitgenosse Morphys, New Orleans, 1850er; sein Rivale „der
   Ingenieur“). Victors Vater überfordert, nicht böse (Dokument 02, 2.3).
2. **Welt:** Maple Falls und Cedar Creek mit je einer Außenkarte und zwei bis drei Innenräumen
   (Dokument 02, 2.1: Pokémon-Städte sind klein). Je Raum: Zweck, Figuren darin, ein Satz
   Atmosphäre. Vorhandene Beispielkennungen in `inhalte/abenteuer/orte.json` übernehmen.
3. **Szenenliste Akt 1** (Clubs 1 und 2, etwa 3 bis 4 Stunden Spielzeit): nummerierte Szenen mit
   Ort, Figuren, Zweck, Ereignis (Dialog, Partie, Aufgaben, Fund), Kennung nach dem Muster in
   `inhalte/abenteuer/README.md`. Enthalten: Fund des Bretts (schon als Ink-Beispiel vorhanden,
   `inhalte/abenteuer/dialoge/de/maple-falls-dachboden.ink`, daran anschließen), erste Partie gegen
   Ambrose als Einstufung (Entscheidung A5), erstes Treffen mit Victor mit erzwungener
   Niederlage (Dokument 02, 2.7: in schlechter Stellung beginnen oder zwei Dialogvarianten),
   Clubkampf Maple Falls, erste Hilfskarte, Cedar Creek mit Mrs. Okafor und Ambroses Erzählung
   von 1858, zwei bis drei Nebenquests je Stadt in den drei Typen rätsel, hilfe, begegnung
   (Dokument 02, 3.3), eine „Erinnerung“ Ambroses als Zugerraten (Entscheidung C3; Partien aus
   `inhalte/zusatzpartien/klassiker.json` wählen).
4. **Dialog-Stilregeln:** Länge je Zeile (höchstens zwei Sätze), Lesealter 10, keine Ironie, die
   Kinder nicht verstehen, Ambroses altmodische Sprache in fünf Regeln mit Beispielen, Tags und
   externe Funktionen wie in `inhalte/abenteuer/README.md`.
5. **Offene Fragen an den Autor** am Ende, mit Empfehlung je Frage.

## Was nicht dazugehört

Keine Ink-Dateien, keine JSON-Daten, kein Code; das kommt in Folgeaufträgen aus der Bibel.

## Bericht

(vom Helfer auszufüllen)
