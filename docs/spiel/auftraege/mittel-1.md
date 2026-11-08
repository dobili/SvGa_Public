# Auftrag mittel-1: Limo für Jo (Dialoge und Quest)

**Stand:** offen (Haupt-Chat, 08.11.2026, zwölfter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/maple-falls-park.ink`, `inhalte/abenteuer/quests.json`
(nur die neue Quest), `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`

## Ziel

Szene 10a der Story-Bibel („Limo für Jo“, mit Quest-Schritten) spielbar machen. Die Technik steht:
Die Limo ist ein Gegenstand im Kiosk (5 Münzen, `laeden.json`), Ink sieht den Besitz als Variable
`hatLimo`, und Quest-Wirkungen können sie wieder abnehmen: `{ "art": "gegenstandWeg",
"gegenstand": "limo" }`. Jo hat jetzt die Steckbriefzeile „fleck rueckzug“.

## Vorgaben

1. Quest `mapleFalls.limo` in `quests.json` nach dem Entwurf in der Bibel; die Wirkungen beim
   Bringen: `gegenstandWeg` limo, `steckbrief` für Jo (Zeile 0), und Jos Zustand „analysiert“, falls
   das Format es hergibt (sonst im Bericht vorschlagen).
2. In `maple-falls-park.ink` die Knoten `jo_limo` (Jo will nach einer Niederlage Limo),
   `jo_limo_gebracht` (nur mit `hatLimo`; Jo erzählt von ihrer Schwäche, Ambroses Satz) und die
   Abzweigung in `skater_jo`, damit beide erreichbar sind. Mr. Patels Zeile („Die trinkt nur
   Zitrone.“) gern im Kiosk-Dialog, wenn der Leser die Limo kauft, nur falls das ohne neue Technik geht.
3. Stilregeln der Bibel (Abschnitt 5), Texte neu als Schlüssel `quest.limo.*`.

## Bericht

(vom Helfer auszufüllen)

