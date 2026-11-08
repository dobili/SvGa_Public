# Auftrag mittel-1: Limo für Jo (Dialoge und Quest)

**Stand:** fertig (Helfer mittel-1, 08.11.2026, zwölfter Auftrag)

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

**Fertig:**

- `maple-falls-park.ink`: neue Knoten `jo_limo` (Jo bittet um Zitronenlimo, nach einer Niederlage
  „Wer verliert, holt Limo“, nach einem Sieg „Limo geht eigentlich auf mich. Aber ich bin pleite.“)
  und `jo_limo_gebracht` (nur mit `hatLimo`; nach einer Niederlage erzählt Jo ihre Schwäche, nach
  einem Sieg nur kurz und „Revanche, wenn ich satt bin“; Ambrose: „Eine Limonade für eine Schwäche.
  Ein guter Handel.“). Abzweigung in `skater_jo`: Limo bringen geht vor; nach dem ersten Duell
  fragt Jo einmal nach Limo. Im Kiosk sagt Mr. Patel „Für Jo? … Die trinkt nur Zitrone.“, solange
  Jo wartet und der Leser noch keine Limo hat (ohne neue Technik, nur über Variablen). Nach dem
  Überbringen verlangt Jo bei der nächsten Niederlage keine Limo mehr. Neue Variablen:
  `hatLimo` (Hülle), `limoGefragt`, `limoGebracht` (Ink).
- `quests.json`: `mapleFalls.limo` (begegnung). **Abweichung vom Entwurf der Bibel:** Start ist der
  Dialog `jo_limo` statt der Niederlage, und es gibt keinen Schritt `patel_limo` mit der Wirkung
  `gegenstand limo`. Gründe: Die Limo wird jetzt im Laden gekauft (eine Quest-Wirkung würde sie
  verschenken), und die Bibel will die Limo auch nach einem Sieg erlauben; mit dem Start „Partie
  verloren“ würde die Quest für Sieger nie beginnen und die Limo nie abgenommen. Einziger Schritt:
  `jo_limo_gebracht` mit `gegenstandWeg` limo, Steckbriefzeile 0 für Jo und `zustand analysiert`.
- `texte/de.json`: `quest.limo.titel` („Limo für Jo“), `quest.limo.schritt1`.

**Vorschlag:** Die Bibel gibt „analysiert“ nur, wenn man Jo noch nicht geschlagen hat; Quest-Wirkungen
kennen keine Bedingung, deshalb bekommt jeder den Zustand. Das ist harmlos (Jo bleibt schlagbar).
Wer es genau will, bräuchte eine Bedingung an Wirkungen (etwa `wenn: ausgangMapleFallsSkaterJo ==
niederlage`) oder `setzeZustand` aus Ink.

Prüfungen: pytest alle (375), Paketbau, Prettier, Durchspielen (10116 Läufe ohne Fehler),
Simulation beider Wege (erst verloren, erst gewonnen; jeweils Limo kaufen und bringen: Quest
fertig), Simulation Akt 1 weiterhin mit allen 13 Quests, `npm run pruefen` (2405 Tests).

**Offene Fragen:** keine.
