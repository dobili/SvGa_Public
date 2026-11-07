# Auftrag mittel-1: Story-Bibel, Teil 1 (Akt 1, Maple Falls und Cedar Creek)

**Stand:** fertig (Helfer mittel-1, 07.11.2026)
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

**Fertig:** `docs/spiel/05_Story_Bibel.md` mit allen fünf geforderten Teilen: Figuren (Held,
Ambrose, Mama, Victor mit Vater, Coach Delgado, Sam, Juno als beste Freundin, Mrs. Okafor, je drei
bis vier Nebenfiguren in Maple Falls und Cedar Creek, jeweils Hintergrund, Sprechweise mit drei
Beispielsätzen, Rolle, Verhältnis zum Schach), Zeitlinie 1831 bis 2026, Welt (je Stadt
Außenkarte und drei Innenräume, vorhandene Kennungen aus `orte.json` übernommen), 25 Szenen mit
Ort, Figuren, Zweck, Ereignis und Kennung samt Zeitrechnung, Dialog-Stilregeln (Länge,
Lesealter, Geschlechtsneutralität, Ambroses Sprache in fünf Regeln, Tags und Funktionen), zehn
offene Fragen mit Empfehlung. Prüfung `npx prettier --check ../docs/spiel` bestanden.

**Entscheidungen mit Begründung:**

- **Zweig:** Gearbeitet auf `claude/schach-abenteuer-mittel-1-cl431d` (Basis
  `claude/friendly-shannon-y8bf90`) statt `abenteuer-story-bibel`, weil die Sitzung des Helfers
  fest auf diesen Zweig eingestellt ist und nur dorthin pushen darf. Inhaltlich ändert das nichts.
- **Erzwungene Niederlage gegen Victor:** echte Partie aus der Grundstellung (E + 500) mit zwei
  Dialogvarianten statt gestellter Verluststellung, weil das Spiel „echtes Schach ohne Tricks“
  verspricht.
- **Zeitlinie:** Ambrose 1831 bis 1866, Match 1858, Revanche als Fernpartie 1865/66; die
  unbeendete Fernpartie ist die Quelle der Partiefragmente und die Stellung auf dem Brett. So
  passen alle Sätze des vorhandenen Ink-Beispiels („New Orleans, 1858“, „hundertsechzig Jahre“,
  „Später“).
- **Erinnerung (C3):** `klassik-paulsen-morphy` (New York 1857), weil Ambrose sie als Augenzeuge
  erzählen kann und das Damenopfer zu Club 2 (Matt) passt.
- **Park** bleibt eigene kleine Außenkarte und wird der Stadtrand mit dem Weg nach Cedar Creek.
- **Beste Freundin** Juno statt bester Freund, weil Sam schon ein Junge im Team ist.
- **Zustände:** „analysiert“ in Maple Falls (vorhandene Quest „Sams Dame“), „abgelenkt“ in Cedar
  Creek (Sternennacht, ohne Absicht des Helden).

**Offen (Folgeaufträge):** Ink-Dateien der Szenen 1 und 4 bis 25; Quests und Gegnerprofile für
Cedar Creek (Okafor E + 280, Dex, Mae, Rosa); neue Einträge in `orte.json`, `quests.json`,
`texte/de.json`; Züge der erfundenen Fernpartie von 1866 (mit Engine bauen, Endspiel am Schluss).

**Fragen an den Autor:** stehen in Abschnitt 6 der Bibel (zehn Stück, je mit Empfehlung, keine
blockiert den Auftrag). Wichtigste: Wie offen über die Jahre 1860 bis 1865 sprechen (Empfehlung:
gar nicht konkret); „Urenkel“ stimmt rechnerisch nicht (Empfehlung: „Nachfahre“).

**Vorschläge für gesperrte Dateien (Haupt-Chat):**

1. `inhalte/abenteuer/orte.json`: Ort `cedarCreek` mit Karten `cedarCreek.aussen`, `.bibliothek`,
   `.archiv`, `.waschsalon`; Figuren `juno`, `abernathy`, `lily` in Maple Falls und `okafor`,
   `dex`, `mae`, `boateng`, `rosa`, `victor` in Cedar Creek; Club `club.cedarCreek.name` mit
   Kapitel 7 und 8.
2. `inhalte/abenteuer/gegner.json`: Profil für Ambrose als Lehrer in `mapleFalls.ersteLektion`
   (feste Stärke etwa 900, hohe Fehlerhäufigkeit) und für `cedarCreek.okafor`
   (Zielstärke Eingang + 280, Fallensteller, Grundreihe).
3. `schnittstelle/partie.ts` (nur Idee): Die Einstufung aus der ersten Partie sollte die
   Genauigkeit der Züge nutzen, nicht nur das Ergebnis; sonst verfälscht Ambroses hohe
   Fehlerhäufigkeit die Eingangswertung.
4. Optional für die Victor-Partie: eine Zuggrenze im `Partieauftrag` (etwa 40 Züge, danach ruft
   der Vater Victor weg und die Stellung entscheidet die Dialogvariante). Das würde lange Partien
   gegen einen fast unschlagbaren Gegner kürzen; nur nötig, wenn die Testpartien des Autors das
   zeigen.
5. `texte/de.json`: Schlüssel `figur.juno.name`, `figur.okafor.name`, `ort.cedarCreek.*`,
   `quest.lilysSpringer.*`, `quest.trockner.*`, `quest.archivOrdnen.*`, `quest.sternennacht.*`,
   `quest.erinnerungNewYork.*`.
