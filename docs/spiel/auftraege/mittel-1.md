# Auftrag mittel-1: Erinnerung London 1851 begehbar (Ort und Dialoge)

**Stand:** offen (Haupt-Chat, 08.11.2026, dreizehnter Auftrag)

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

(vom Helfer auszufüllen)

