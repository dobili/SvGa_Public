# Auftrag niedrig-1: Maple Falls und Cedar Creek beleben (Statisten, Tiere, Dinge zum Ansehen)

**Stand:** offen (Haupt-Chat, 08.11.2026, sechster Auftrag; Grundlage `09_Weltbeschreibung.md`,
Abschnitte 3, 4, 4a, 5.1, 5.3 und 6)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-aufgabenzuordnung`), bitte frisch auf
`origin/claude/friendly-shannon-y8bf90` aufsetzen (dein Zweig hat die Statisten der Route wieder
entfernt; der Hauptzweig hat sie, und der Kartentest überspringt `type` statist/tier)
**Darf ändern:** alle Karten in `inhalte/abenteuer/karten/` von Maple Falls und Cedar Creek,
`docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q`, in `app/`
`npx prettier --check ../inhalte/abenteuer` und `node skripte/baue-abenteuerpaket.mjs`

## Ziel

Die neun Karten der beiden Städte nach 09 lebendig machen, wie du es bei der Route schon getan hast.

## Vorgaben

1. **Außenkarten** (`maple-falls-aussen`, `maple-falls-park`, `cedar-creek-aussen`): je mindestens
   zwei Tiere und zwei Statisten nach Abschnitt 4 und 4a (`type` tier/statist mit `von`, `bis`,
   `tun`, `wann`, `verhalten` wie auf der Route), Laufwege frei.
2. **Innenräume:** Objekte zum Ansehen mit genau diesen Namen (`type` ausloeser, Kollision oder
   freies Nachbarfeld, mittel-1 trägt sie gleichzeitig in `orte.json` ein): Wohnzimmer
   `fotoGrandma`, `kartonKueche`, `pizzakarton`; Dachboden `hutschachtel`, `spiegel`,
   `zeitungen1961`; Clubraum `pokalvitrine`, `brettOhneDame`, `plakatZaehlen`; Bibliothek
   `zeitungsregal`, `globus`, `schildFluestern`; Archiv `boxerfoto`, `wasserfleck`; Waschsalon
   `zettelTurm`, `comicheft`, `automat`. Dazu je Innenraum ein Statist, wo es passt (Kellnerin,
   Leserin, Mr. Boateng ist schon Figur).
3. Bis mittel-1 fertig ist, scheitert dein Kartentest an den neuen Namen („fehlt in orte.json“).
   Dann bitte die Karten trotzdem pushen und im Bericht vermerken; der Haupt-Chat führt beide
   zusammen.
4. Checkliste aus Abschnitt 6 je Karte im Bericht abhaken.

## Was nicht dazugehört

Neue Karten, Grafik, `orte.json`.

## Bericht

(vom Helfer auszufüllen)
