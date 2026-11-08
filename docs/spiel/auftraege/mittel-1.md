# Auftrag mittel-1: Akt 3 in orte.json, Clubchefs und Clubkämpfe

**Stand:** offen (Haupt-Chat, 08.11.2026, vierzehnter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/orte.json` (neue Orte), `inhalte/abenteuer/gegner.json` (nur die
drei Clubchefs), `inhalte/abenteuer/begegnungen.json` (nur die drei Clubkämpfe),
`inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`

## Ziel

Akt 3 steht in der Story-Bibel (Abschnitte 19 und 20), die Gegner stehen in `gegner.json`. Damit
Karten (niedrig-1) und Dialoge folgen können, braucht es die Orte mit festen Kennungen.

## Vorgaben

1. Sechs Orte nach Abschnitt 19: `wegIronwoodSilicon`, `siliconBay` (Nummer 5),
   `wegSiliconDelacroix`, `portDelacroix` (6), `wegDelacroixDesert`, `desertSprings` (7); Wege mit
   `art: "weg"`, Nummer 0. Je Ort die Karten (Kennung `<ort>.<raum>`, Datei
   `karten/<ort-mit-bindestrichen>-<raum>.json`, auch wenn die Datei noch fehlt), Figuren mit
   Dialog-Einstiegen (`<datei>.<knoten>`, die Ink-Dateien kommen später), Auslöser und Übergänge,
   Clubs mit Chef, Mitgliedern und Kapiteln, wie bei Akt 1 und 2.
2. Die drei Clubchefs aus dem Bericht von mittel-2 (`docs/spiel/auftraege/mittel-2.md`, neunter
   Auftrag): Dr. Lin, Miss Odile, Mira, Stärke genau E + 160 + 60 · Clubnummer, und ihre Clubkämpfe
   mit `zeit: "wahl"`.
3. Fehlen Karten-Dateien, darf die Pipeline das melden; dann im Bericht die Liste der Dateien und
   Objektnamen, die niedrig-1 zeichnen soll. Was der Kartentest sonst verlangt (etwa `start`), mit
   aufnehmen.

## Bericht

(vom Helfer auszufüllen)

