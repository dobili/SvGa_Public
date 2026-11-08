# Auftrag mittel-2: Regelwerk und Story-Bibel nachziehen, Stellungen prüfen

**Stand:** fertig (mittel-2, 08.11.2026; vorher offen, Haupt-Chat, dritter Auftrag; die Spieldaten für Cedar Creek sind
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

**Fertig** auf `abenteuer-regelwerk` (Basis hereingeholt). `begegnungen.json` ist **nicht**
geändert; die Victor-Stellung wartet auf deine Bestätigung (Vorgabe 3).

**1. Regelwerk** (`06_Regelwerk.md`)

- R14: Absatz „Umsetzung“ mit dem Stand von `kipppunkt.ts` (rückwärts ab Partieende, höchstens 20
  Leserstellungen ab Halbzug 20, Tiefe 10, 0,6 s je Stellung, erste Stellung innerhalb ±1,0).
  Hinweis darin: R14 Punkt 2/3 sprach vom „größten Verlust“; der Code sucht ab dem Ende. Das ist in
  fast allen Partien dieselbe Stellung; ich habe die Regel an den Code angepasst, nicht umgekehrt.
- R15: Dauerhafte Karten nach dem Kipppunkt kehren ins Deck zurück (`kartenFuerWiedereinstieg`).
- R30: Grenze 8 bis 15 als „im Prototyp noch nicht umgesetzt“ markiert (`motivanzahl` hat sie
  nicht). Neue Regel **R30a** mit dem Datenformat `runden.json`, Verteilung des Zeitbudgets auf die
  Reihenblöcke (mit Beispiel Cedar Creek), Schwierigkeit aus der App-Wertung bis A steht, und den
  vier Grenzen des Prototyps (kein „mit Hilfe“, nur Buchübungen mit Lösungszug, `zaehlen` ohne
  Trainer, Erinnerung als Mattbilder-Runde).
- R31: Steller aus `runden.json`, jeder Block einzeln bestanden und wiederholt, jeder weitere
  Versuch eine Stufe leichter (wie `schwierigkeitDesVersuchs`).
- R33: Satz „Die Stellung legt die Story-Bibel fest“ ersetzt: Victors Begründung aus
  `victor_wartet`, feste Begegnung `mapleFalls.victor`, Hinweis auf das Prüfergebnis unten.
- Neuer Abschnitt 9 „Welt“ mit **R41 Reise zwischen Orten** (Übergänge nur im Ort, `reise` im
  Dialog, Feld `karte` am Auslöser, Pipeline-Test); „Offene Fragen“ ist jetzt Abschnitt 10.

**2. Story-Bibel** (`05_Story_Bibel.md`): Szene 12 auf R33 (Trainingsstellung, Karten gesperrt,
Victors und Ambroses Sätze aus `victor_wartet`, Begründung); Szene 13 Bushaltestelle im Park mit
`reise`; Szene 14 Ankunft an `bushaltestelle`, Rückweg `busZurueck`; Szene 23 Rosa aus Abb. 1.41
mit Begründung (Mattbilder aus 7.4 sind erzwungene Matts, R13) und einem Satz für Rosa, den
mittel-1 übernehmen oder ersetzen kann.

**3. Engine-Prüfung** (Stockfish 19 lite aus `app/node_modules`, über python-chess, nur lokal)

- **`mapleFalls.victor` liegt außerhalb von R33:** heutige FEN
  `r1b2rk1/2q1bppp/p2p1n2/1pp1p3/3PP3/2P2N1P/PPBN1PP1/R1BQR1K1 b - - 2 12` aus Sicht von Schwarz
  **−6,94 (Tiefe 12), −6,54 (Tiefe 16)**. Grund: Stockfish skaliert seine Bewertung seit Version 15
  auf Gewinnwahrscheinlichkeit; ein glatter Springer weniger zeigt dort −5 bis −7, nicht −3.
- **Vorschlag (Springer gegen zwei Bauern, sonst gleich):** weiße Bauern d4 und b2 fehlen,
  `r1b2rk1/2q1bppp/p2p1n2/1pp1p3/4P3/2P2N1P/P1BN1PP1/R1BQR1K1 b - - 2 12`, legal, Schwarz am Zug,
  **−3,18 (Tiefe 12), −3,10 (Tiefe 16)**, Mitte des Bereichs. Erzählbar: Der schwarze Springer hat
  zwei Bauern gefressen und kam nicht mehr heim. Victors Satz „du hast eine Figur weniger“ bleibt
  wahr. Weitere Kandidaten im Bereich, falls du eine andere Geschichte willst: ohne h3 und b2
  −3,37/−3,48; ohne a2 und b2 −2,99/−3,34 (Tiefe 12/16).
- Alternative ohne neue Stellung: R33 auf die Skala der Engine umstellen („−5 bis −8“). Ich empfehle
  den Vorschlag oben, weil eine Stellung mit −3 für Kinder noch spielbar wirkt und ein seltener
  Sieg möglich bleibt (Variante „Glück“).
- **Ersatzkandidaten für Stellungsduelle** (Tiefe 12, Seite am Zug = Leser, kein Matt gefunden):

| Kapitel | Abbildung | Am Zug | Bewertung | Inhalt (Bildunterschrift, gekürzt)                               |
| ------- | --------- | ------ | --------- | ---------------------------------------------------------------- |
| 3       | 3.77      | Weiß   | +1,64     | Bilanz nach 12… Le7 13. Tae1 O-O, vier entwickelte Leichtfiguren |
| 3       | 3.75      | Weiß   | +1,66     | Nach 9… Dg4 10. De3+ De6, Damen stehen sich gegenüber            |
| 6       | 6.14      | Weiß   | +0,85     | Nach 1… f5 2. exf6 Sxf6, der Springer bewacht wieder h7          |
| 6       | 6.5       | Weiß   | +0,84     | Nach 8… Sc6, Gegenschlag …d5, 9. Lc4                             |
| 8       | 8.44      | Weiß   | +0,88     | Skelett des Berliner Endspiels, Doppelbauern                     |
| 8       | 8.48      | Weiß   | +2,50     | Bauernendspiel nach 1. a6 Kc6 2. a7 Kb7 (genau am oberen Rand)   |

Weitere in Kapitel 3 (alle Weiß am Zug, Gambit-Stellungen aus 3.9/3.10): 3.55 +1,54, 3.56 +1,65,
3.62 +1,81, 3.64 +1,66, 3.66 +1,52, 3.71 +1,44. In Kapitel 6 liegt sonst nur 6.25 (+0,81) im
Bereich; 6.9 (+2,41) ist eine schematische Skelettstellung. Kapitel 6 und 8 haben wenige
Kandidaten, weil die meisten Abbildungen dort ausgeglichen oder klar gewonnen sind.

- Jo (1.21, +1,22) und Rosa (1.41, +1,09) sind im zweiten Auftrag geprüft und unverändert.

**Offen:** Bestätigung der Victor-Stellung, dann trage ich die FEN in `begegnungen.json` ein
(oder du direkt). Sonst nichts.
