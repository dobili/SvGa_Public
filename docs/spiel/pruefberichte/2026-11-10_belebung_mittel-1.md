# Gegenprüfung der Belebung bei mittel-1 (Runde 7)

Stand: 10.11.2026, Gegenprüfung durch mittel-4 im Auftrag des Haupt-Chats. Geprüft nach
`docs/spiel/16_Statisten_und_Tiere.md` (Mindestzahlen, Satzregeln 3.1 und 3.2, Vorrat 4) und
Regel 10.53 auf dem Stand `120d0763`:

- Weg 5: `wegSiliconDelacroix.faehre`, `wegSiliconDelacroix.deich`;
- Bayou: `bayou.steg`;
- Capital: `capitalArena.aussen`, `capitalArena.innenstadt`, `capitalArena.halle`.

Grundlage sind die Szenen (Variante A; B und C haben laut Kartenbauer dieselben Statisten) und die
Sätze in `inhalte/abenteuer/texte/de.json`. An den Karten und Texten ist nichts geändert.

## Ergebnis in Kürze

Die Belebung ist gut. Alle Mindestzahlen sind erfüllt. Die Sätze passen zu Ort, Jahreszeit und
Figur: Winter auf Weg 5, Sommer und Finale in Capital. Die Schachgeschichte stammt in allen Fällen
aus dem Vorrat (Abschnitt 4). Befunde gibt es nur zu Länge, Vorführungen und Kleinigkeiten.

## Zahlen (Regel 10.53)

| Karte                           | Statisten | mit Satz | Tiere | Soll       | Ergebnis                  |
| ------------------------------- | --------- | -------- | ----- | ---------- | ------------------------- |
| `wegSiliconDelacroix.faehre`    | 4         | 4        | 6     | 4 / 3 / 6  | erfüllt                   |
| `wegSiliconDelacroix.deich`     | 4         | 4        | 6     | 4 / 3 / 6  | erfüllt                   |
| `bayou.steg`                    | 4         | 3        | 6     | 4 / 3 / 6  | erfüllt                   |
| `capitalArena.aussen`           | 12        | 9        | 4     | 12 / 6 / 4 | erfüllt, knapp bei Tieren |
| `capitalArena.innenstadt`       | 12        | 8        | 4     | 12 / 6 / 4 | erfüllt, knapp bei Tieren |
| `capitalArena.halle` (öffentl.) | 4         | 4        | –     | 2–6, alle  | erfüllt                   |

Jede Wegkarte hat eine kleine Tiergeschichte (16, 5.3):

- Fähre: der Delfin bis zur Boje;
- Deich: der Reiher, der eine Stunde wartet;
- Bayou: der Alligator Fernand.

## Schachgeschichte (nur Vorrat 16, 4)

| Karte, Statist                            | Aussage                                         | Vorrat | Befund                          |
| ----------------------------------------- | ----------------------------------------------- | ------ | ------------------------------- |
| `bayou.steg`, mundharmonika               | Anderssen 1851 London, beide Türme und Dame     | Nr. 17 | richtig                         |
| `capitalArena.aussen`, rentnerin          | Lasker 27 Jahre Weltmeister                     | Nr. 20 | richtig                         |
| `capitalArena.aussen`, student            | Deep Blue 1997 New York gegen Kasparow          | Nr. 26 | richtig                         |
| `capitalArena.innenstadt`, kellner        | Washington Square Park, Steintische, Blitz      | Nr. 36 | richtig                         |
| `capitalArena.innenstadt`, schueler       | Polgár mit 15 Großmeisterin, jünger als Fischer | Nr. 23 | richtig                         |
| `capitalArena.halle`, zuschauer           | Kiebitze dürfen im Turnier nicht reden          | Nr. 40 | richtig                         |
| `capitalArena.halle`, reporter            | erste Schacholympiade 1927 in London            | Nr. 32 | richtig                         |
| `wegSiliconDelacroix.deich`, alterFischer | Fernschach per Post, eine Partie sechs Jahre    | Nr. 37 | richtig (als eigene Erinnerung) |

Keine Aussage geht über den Vorrat hinaus. Nicht aus dem Vorrat und auch keine Geschichte sind die
Motive (Spieß, Abzugsschach) und die Ratschläge. Die Erklärungen der Motive sind sachlich richtig.

## Mischung der Satzarten (16, 3.2: keine Art mehr als dreimal je Karte)

Auf keiner Karte kommt eine Art mehr als zweimal vor:

- **Capital außen:** Welt, Missverständnis, zweimal Geschichte, Perfect Move, Lieblingszug, Rat,
  Motiv, Geschichte in zwei Teilen (Autogrammjunge).
- **Innenstadt:** Welt, zweimal Geschichte, Motiv, Lieblingszug, Geschichte in zwei Teilen (Sprayer
  mit Kreidespringer, gut als Hinweis auf K5), Perfect Move, Rat.
- **Wegkarten:** jeweils drei bis vier verschiedene Arten.

## Ambrose (höchstens jeder fünfte Statist)

Nur ein Statist hat eine Antwort von Ambrose: der Sprayer in der Innenstadt, zu einem Springer aus
Kreide. Das sind 1 von 40 Statisten. Die Regel ist eingehalten. Für mehr Wärme sind bis zu sieben
Antworten erlaubt (Vorschlag unten).

## Befunde

1. **Länge (16, 3.1: ein bis drei kurze Sätze).** Drei Sätze haben vier Sätze:
   - `statist.bayou.steg.mundharmonika`: „Die Unsterbliche Partie.“ als eigenen Satz in den ersten
     einfügen.
   - `statist.wegSiliconDelacroix.deich.vogelbeobachterin`: „Geduld ist alles.“ streichen oder mit
     dem Satz davor verbinden.
   - `statist.wegSiliconDelacroix.deich.techniker`: „Für wen? Steht auf dem Wagen.“ zu einem Satz
     zusammenziehen („Für wen, steht auf dem Wagen.“).
2. **Vorführungen (16, 3.4).** Keine der sechs Karten hat ein `zeigt`. Der Mundharmonikaspieler im
   Bayou erzählt genau von der Unsterblichen Partie, und `unsterblichePartie` ist bisher nirgends
   gesetzt. Vorschlag: `"zeigt": "unsterblichePartie"` beim Mundharmonikaspieler.
   Für Capital sind ebenfalls noch frei:
   - `operPartie`;
   - `immergruenePartie`;
   - `botwinnikCapablanca`;
   - `partieDesJahrhunderts`;
   - `timmanShort`;
   - `rosenthalDeVere`.

   Sie passen zur Halle oder zum Reporter (Partie des Jahrhunderts), falls sie mittel-1 zugeteilt
   sind. Die `operPartie` (Morphy, New Orleans) würde am besten nach Port Delacroix passen. Das liegt
   außerhalb dieses Prüfumfangs.

3. **Tageszeit (16, 3.1: Tätigkeit passend zur Tageszeit).** In `capitalArena.aussen` haben alle
   zwölf Statisten `wann: tag`. Vorschlag:
   - Polizist und Zeitungs- oder Eisverkauf auf `morgen`;
   - Straßenmusiker auf `abend`.

   So wechselt der Platz über den Tag. Die Innenstadt macht das schon (Straßenkehrer und Jogger am
   Morgen).

4. **Tiere in Capital nur knapp.** Außen und Innenstadt haben genau 4 Tiere (Tauben, Spatzen, Hund
   oder Dackel, Katze). Für eine große Stadt im Sommer würden Enten am Wasser oder ein Eichhörnchen
   im Park die Belebung verstärken. Das ist ein Vorschlag, kein Regelverstoß.
5. **Kleinigkeit Fähre:** `fliegendeFische` im Winter auf der Bucht sind ungewöhnlich, im warmen
   Golf aber möglich. Kein Befund, nur ein Hinweis, falls die Bucht kälter gedacht ist.
6. **Wiederholung zwischen Karten.** Die Rochade als Lieblingszug erzählt sowohl der Matrose auf der
   Fähre (mittel-1) als auch der Tankwart in Desert Springs (mittel-4). Das erlaubt die Regel. Wenn
   einer abgeändert werden soll, ändere ich den Tankwart.

## Ohne Befund

- Neutral für {held}: Kein Statist redet {held} mit Junge oder Mädchen an.
- Keine Markennamen außer Perfect Move.
- Die Sätze in zwei Teilen (`.2`) sind gut gesetzt: Autogrammjunge und Sprayer.
- Die Halle: alle vier Statisten sprechen, die Ordner-Zeile ist ein schönes Missverständnis.
