# Auftrag mittel-1: Ink-Dialoge für Cedar Creek (Akt 1, Szenen 14 bis 23)

**Stand:** offen (Haupt-Chat, 08.11.2026, dritter Auftrag; die Dialoge von Maple Falls sind
zusammengeführt, Victor und Jo haben ihre Begegnungen: `mapleFalls.victor` nach R33 mit deiner
Stellung, `mapleFalls.skaterJo` als Stellungsduell aus Abbildung 1.21; die vorbereiteten
`beginnePartie`-Zeilen sind frei. Neue externe Funktion `reise(karte, ausloeser)` für den Bus, die
Haltestelle im Park nutzt sie schon.)
**Zweig:** dein fester Sitzungszweig (zuletzt `claude/schach-abenteuer-mittel-1-cl431d`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/cedar-creek-*.ink` (neu), `inhalte/abenteuer/quests.json`
(nur Quests mit `ort: "cedarCreek"`, die mittel-2 angelegt hat: Knoten anpassen, keine neuen
Quests ohne Bericht), `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel, am Ende anhängen),
`docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py`
(der Test prüft jetzt auch `beginnePartie`- und `reise`-Aufrufe in den Ink-Dateien), dann in
`app/`: `node skripte/baue-abenteuerpaket.mjs` und `npx prettier --check ../inhalte/abenteuer`;
Durchspielen aller Knoten mit inkjs wie beim zweiten Auftrag.

## Ziel

Alle Dialoge von Cedar Creek aus `05_Story_Bibel.md` (Szenen 14 bis 23) als Ink-Dateien, passend
zu den Spieldaten von mittel-2 in `orte.json`, `begegnungen.json` und `quests.json` (Ort
`cedarCreek`). Der Haupt-Chat baut parallel die Aufgabenrunden (Schritt 8f); die Karten zeichnet
niedrig-1.

## Vorgaben

1. **Eine Datei je Karte:** `cedar-creek-aussen.ink`, `cedar-creek-bibliothek.ink`,
   `cedar-creek-archiv.ink`, `cedar-creek-waschsalon.ink`. Einstiegsknoten genau wie in
   `orte.json`: Figuren `cedar-creek-bibliothek.okafor`, `.dex`, `.mae`,
   `cedar-creek-waschsalon.boateng`, `cedar-creek-aussen.rosa`, `.victor`; Gegenstände
   `cedar-creek-aussen.plakat`, `.steg`, `cedar-creek-waschsalon.trockner`,
   `cedar-creek-archiv.karton`, `.programmheft`; Dialog `cedar-creek-aussen.bus_zurueck`.
2. **Quests von mittel-2 bedienen:** Die Knoten, auf die `quests.json` wartet (etwa
   `cedar-creek-bibliothek.okafor`, `cedar-creek-archiv.erzaehlung_1858`), müssen existieren und
   in der richtigen Reihenfolge erreichbar sein (Quest-Auswertung streng der Reihe nach, wie du es
   für Maple Falls geprüft hast). Passt ein Knotenname nicht, lieber den Quest-Eintrag ändern
   als die Geschichte verbiegen; jede Änderung in den Bericht.
3. **Begegnungen und Runden:** `~ beginnePartie("cedarCreek.rosaDuell")`,
   `~ beginnePartie("cedarCreek.clubkampf")`; Aufgabenrunden mit `~ beginneAufgaben("…")` wie
   in `quests.json` genannt (die Runden baut der Haupt-Chat gerade; der Aufruf ist schon richtig).
4. **Rückfahrt:** `bus_zurueck` bietet die Fahrt nach Maple Falls an:
   `~ reise("mapleFalls.park", "bushaltestelle")` (mit `EXTERNAL reise(karte, ausloeser)` oben).
5. **Variablen** wie in Maple Falls (gleiche Namen, neue in den Bericht); Zustand „abgelenkt“ für
   Okafor über `setzeZustand` wie die Quest `cedarCreek.sternennacht` es vorsieht.
6. Alle Regeln des zweiten Auftrags gelten weiter (Sprecher-Tags, geschlechtsneutral, keine
   Buchtexte über kurze Zitate hinaus, Buchbezug nur mit Abschnitt oder Abbildung).

## Was nicht dazugehört

Karten, Spieldaten anderer Orte, Code in `app/`, Änderungen an Maple Falls.

## Bericht

(vom Helfer auszufüllen)
