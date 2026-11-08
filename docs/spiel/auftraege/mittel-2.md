# Auftrag mittel-2: Regelwerk und Story-Bibel nachziehen, Stellungen prüfen

**Stand:** offen (Haupt-Chat, 08.11.2026, dritter Auftrag; die Spieldaten für Cedar Creek sind
zusammengeführt, die Aufgabenrunden haben ihr Datenformat `inhalte/abenteuer/runden.json`)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-regelwerk`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `docs/spiel/06_Regelwerk.md`, `docs/spiel/05_Story_Bibel.md` (nur die genannten
Stellen), `inhalte/abenteuer/begegnungen.json` (nur die Felder `startstellung` der genannten
Begegnungen, wenn die Prüfung es verlangt; im Bericht begründen), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `npx prettier --check ../docs/spiel ../inhalte/abenteuer` in `app/`,
im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py`

## Ziel

Die Dokumente sollen wieder zum Stand des Codes passen, und die Stellungen der Begegnungen sollen
mit der Engine geprüft sein (Regelwerk R13, R33). Die Entscheidungen des Haupt-Chats dazu stehen in
`docs/spiel/ENTSCHEIDUNGEN.md` (Einträge vom 08.11.2026).

## Vorgaben

1. **Regelwerk ergänzen** (knapp, im Stil der vorhandenen Regeln):
   - R14/R15: Umsetzung wie gebaut (Suche rückwärts über höchstens 20 Leserstellungen ab Halbzug
     20, Tiefe 10; dauerhafte Karten nach dem Kipppunkt kehren ins Deck zurück).
   - R30/R31: Datenformat `runden.json` (Steller, Buchübungen, Themen, `reihe`, `anzahl`), Verteilung
     des Zeitbudgets auf die Reihenblöcke, Schwierigkeit aus der Wertung der App bis A steht.
     Grenzen des Prototyps nennen: kein „mit Hilfe“, Buchübungen nur mit Lösungszug, Thema
     „zaehlen“ noch ohne Trainer in der Runde.
   - Neue Regel „Reise zwischen Orten“: Übergänge nur innerhalb eines Ortes; zwischen Orten über
     einen Dialog mit `reise(karte, ausloeser)` (Bus). Auslöser mit Feld `karte` für Rückwege.
   - R33: Die Stellung steht jetzt fest (`mapleFalls.victor`, FEN in `begegnungen.json`); Satz „Die
     Stellung legt die Story-Bibel fest“ anpassen.
2. **Story-Bibel anpassen:** Szene 12 (Victor) auf R33 (Trainingsstellung ohne Springer, Karten
   gesperrt, Begründung im Dialog von mittel-1 in `maple-falls-clubraum.ink`, Knoten `victor_*`);
   Szene 23 (Rosa): Stellungsduell aus Abbildung 1.41 statt „Mattbild aus 7.4“, mit deiner
   Begründung aus dem zweiten Bericht; Szene 13/14: Bus über die Haltestelle im Park
   (`bushaltestelle`) und `busZurueck` in Cedar Creek.
3. **Stellungen mit der Engine prüfen** (Stockfish aus `app/node_modules`, Tiefe 12, nur lokal wie
   beim zweiten Auftrag): `mapleFalls.victor` muss aus Sicht von Schwarz zwischen −2,5 und −4
   liegen (R33); liegt sie außerhalb, eine passende Stellung vorschlagen (Spanisch, Zug 12, ein
   Springer weniger) und im Bericht nennen, `begegnungen.json` erst nach Bestätigung des Haupt-Chats
   ändern. Dazu je zwei Ersatzkandidaten für Stellungsduelle aus Kapitel 3, 6 und 8 (für die
   nächsten Städte), Bewertung +0,8 bis +2,5, kein Matt in drei oder weniger, mit Abbildungsnummer.
4. Keine Änderung an Code, Schemas oder `orte.json`.

## Was nicht dazugehört

Neue Orte, Dialoge (mittel-1), Karten (niedrig-1), Aufgabenrunden-Daten (liegen schon vor).

## Bericht

(vom Helfer auszufüllen)
