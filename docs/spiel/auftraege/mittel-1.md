# Auftrag mittel-1: Erinnerung London 1851 begehbar (Ort und Dialoge)

**Stand:** fertig (Helfer mittel-1, 08.11.2026, dreizehnter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/orte.json` (neuer Ort), `inhalte/abenteuer/dialoge/de/erinnerung-london.ink`
(neu), `inhalte/abenteuer/dialoge/de/riverton-bahnhofshalle.ink` (Knoten der großen Uhr),
`inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`
(die Karten zeichnet niedrig-1 parallel; fehlen sie noch, im Bericht nennen)

## Ziel

Ort `erinnerungLondon` (neue Ort-Art `erinnerung`, `nummer` 0): Ambrose ist 20, London 1851.
Die Technik steht (Haupt-Chat, 08.11.2026): Karten eines Ortes mit `art: "erinnerung"` erscheinen in
Sepia, der Held ist das Figurbild (Ambrose), Tagebuch und Münzen sind ausgeblendet; Übergänge in
und aus einer Erinnerung dürfen in andere Orte führen. Feste Namen, damit beide Helfer parallel
arbeiten können:

- Karte `erinnerungLondon.strand`, Datei `karten/erinnerung-london-strand.json` (28 × 20, außen):
  Straße „Strand“ mit Gaslaternen, Droschken, Ladenfronten, Themse am Rand. Objekte: `ankunft`
  (Start), `kaffeehausTuer` (Übergang), `droschke` (ansehen), `zeitungsjunge` (Figur), Belebung
  `passanten`, `tauben`, `laternenanzuender` (abend).
- Karte `erinnerungLondon.kaffeehaus`, Datei `karten/erinnerung-london-kaffeehaus.json` (16 × 12,
  innen): Kaffeehaus mit Tischen, Zeitungsständer, Theke. Objekte: `tuer` (Übergang zurück auf die
  Straße), `schachtisch` (Anderssen und Kieseritzky, startet das Zugerraten), `rueckkehr`
  (die große Uhr an der Wand: zurück in die Gegenwart), Figuren `kellner`, `zeitungsleser`;
  Belebung `gaeste`.

Szene 35 der Story-Bibel wird begehbar: Die große Uhr in der Bahnhofshalle schickt mit
`reise("erinnerungLondon.strand", "ankunft")` in die Erinnerung; der Gang über den Strand ins
Kaffeehaus (zwei Minuten, Zeitungsleser, Kaffeeduft), am `schachtisch` startet
`beginneAufgaben("riverton.flashbackLondon")` (das Zugerraten der Unsterblichen Partie, schon
gebaut). Die Uhr im Kaffeehaus (`rueckkehr`) bringt zurück: `reise("riverton.bahnhofshalle",
"grosseUhr")` mit Ambroses leisen Sätzen aus der Bibel („Diese Maschinen würden das nie spielen.
Oder doch?“). Die Quest `riverton.flashbackLondon` startet weiter an der großen Uhr.

## Vorgaben

1. Eintrag in `orte.json` mit `art: "erinnerung"`, `nummer` 0, beiden Karten, Figuren und Auslösern.
2. Neue Ink-Datei `erinnerung-london.ink` mit allen Einstiegen; in der Bahnhofshalle die Uhr umbauen
   (statt direkt `beginneAufgaben` jetzt `reise` in die Erinnerung).
3. Stilregeln der Bibel, Ambrose als Held: Er spricht in der Erinnerung als junger Mann, {held}
   erscheint nur als Stimme aus der Gegenwart („Was hättest du getan?“).

## Bericht

**Fertig:**

- `orte.json`: Ort `erinnerungLondon` (`art: "erinnerung"`, `nummer` 0, Staffel 1) mit den Karten
  `erinnerungLondon.strand` (`karten/erinnerung-london-strand.json`, außen) und
  `erinnerungLondon.kaffeehaus` (`karten/erinnerung-london-kaffeehaus.json`, innen), den Figuren
  `zeitungsjunge`, `kellner`, `zeitungsleser` (Sprites `figuren/<name>.png`) und den Auslösern
  `ankunft` (Start), `kaffeehausTuer` (Übergang mit Dialog `kaffeehaus_betreten`), `tuer` (zurück
  auf die Straße), `droschke`, `schachtisch` (Gegenstände), `rueckkehr` (Dialog, reist zurück).
  Die Belebung (`passanten`, `tauben`, `laternenanzuender`, `gaeste`) gehört in die Karten und hat
  in `orte.json` keinen Eintrag. Kein `musik`-Feld, weil es noch kein Stück gibt.
- `erinnerung-london.ink` (neu): alle Einstiege; Ambrose spricht als junger Mann mit
  `#stimmung:jung` (neue Porträtvariante, bitte bei den Porträts vormerken). {held} erscheint nur als
  Stimme aus der Gegenwart, als Erzählzeile mit dem Namen („Ganz fern, wie durch Wasser, hört
  Ambrose eine Stimme: „Ambrose? Wo sind wir?“ Es ist {held}.“), weil die Hülle den Sprechernamen
  aus `figur.<sprecher>.name` liest und es für den frei gewählten Namen keinen Schlüssel gibt.
  Am `schachtisch` beginnt `beginneAufgaben("riverton.flashbackLondon")`; `rueckkehr` sagt nach der
  Partie die leisen Sätze der Bibel („Diese Maschinen würden das nie spielen. Oder doch?“), davor
  „Noch nicht“, und reist mit `reise("riverton.bahnhofshalle", "grosseUhr")` zurück (Juno: „Du bist
  ganz still. Alles gut?“). Tabakrauch nur als Wort.
- `riverton-bahnhofshalle.ink`, Knoten `uhr`: statt `beginneAufgaben` jetzt
  `reise("erinnerungLondon.strand", "ankunft")` mit einem Übergangssatz. Die Quest startet weiter
  an der großen Uhr.
- `texte/de.json`: `ort.erinnerungLondon.name` („London, 1851“), `.strand`, `.kaffeehaus`,
  `figur.zeitungsjunge.name`, `figur.kellner.name`, `figur.zeitungsleser.name`.

**Karten:** Die beiden Tiled-Dateien von niedrig-1 fehlen im heutigen Stand noch
(`inhalte/abenteuer/karten/erinnerung-london-*.json`); die Namen der Objekte oben sind genau die
aus diesem Auftrag. Der Paketbau und alle Tests laufen trotzdem.

**Hinweis:** `inhalte/abenteuer/runden.json` (Stand 4e4b3a80, nicht von mir) besteht
`prettier --check` nicht.

Prüfungen: pytest alle (375), Paketbau, Prettier für meine Dateien, Durchspielen (10368 Läufe ohne
Fehler), Simulation des Flashbacks (Uhr → Strand → Kaffeehaus → vorzeitige Rückkehr abgelehnt →
Schachtisch → Rückkehr → Bahnhofshalle: Quest `riverton.flashbackLondon` fertig),
`npm run pruefen` (2407 Tests).

**Offene Fragen:** keine.
