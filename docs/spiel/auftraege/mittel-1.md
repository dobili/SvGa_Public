# Auftrag mittel-1: Dialoge und Quests für Weg 5 und Port Delacroix

**Stand:** offen (Haupt-Chat, 08.11.2026, fünfzehnter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/weg-silicon-delacroix.ink`, `port-delacroix-*.ink` (neu),
`inhalte/abenteuer/quests.json`, `inhalte/abenteuer/runden.json`, `inhalte/abenteuer/texte/de.json`
(nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`

## Ziel

Wie mittel-2 für Silicon Bay schreibst du die Dialoge und Quests für Weg 5 und Port Delacroix
(Szenen der Bibel unter „Weg 5 und Port Delacroix“), danach, falls Zeit bleibt, Weg 6 und Desert
Springs in einem zweiten Push. Port Delacroix: Clubkampf ohne Ambrose (R28), Ambroses Geburtsort.

## Vorgaben

1. Die Knoten, auf die `orte.json` verweist, stehen im Bericht des vierzehnten Auftrags von
   mittel-1 in `docs/spiel/auftraege/mittel-1.md` (Abschnitt „Für die Dialoge“). Jede Ink-Datei
   mit Dateikopf wie die vorhandenen (Einstiege, Variablen, EXTERNAL nur was gebraucht wird).
2. Szenen nach Abschnitt 20 der Story-Bibel, Stilregeln aus Abschnitt 5; Partien über
   `beginnePartie` mit den Begegnungen aus `begegnungen.json`, Runden über `beginneAufgaben`,
   Karten über `gibKarte`, Funde über `gibFund`, Weiterreise mit `reise`.
3. Quests deiner Szenen in `quests.json` (Hauptquest der Stadt und Nebenquests), Runden in
   `runden.json`, neue Texte in `texte/de.json`. Hängt bitte neue Einträge jeweils in einem eigenen
   Block hinter die Einträge von Akt 2; der Haupt-Chat führt die Arbeit beider Helfer zusammen.
4. Prüfung mit der Simulation wie bei der Limo-Quest: Jede Hauptquest muss durchspielbar sein.

## Bericht

(vom Helfer auszufüllen)

