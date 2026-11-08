# Auftrag mittel-1: Dialoge für den Weg Riverton → Ironwood und für Ironwood (Akt 2, zweiter Teil)

**Stand:** offen (Haupt-Chat, 08.11.2026, achter Auftrag; Riverton ist zusammengeführt, danke;
die Karten von Ironwood und dem Kanalweg stehen schon)
**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/*.ink` (neue Dateien für `wegRivertonIronwood` und
`ironwood`; in `cedar-creek-aussen.ink` und `riverton-aussen.ink` nur die Befunde unten),
`inhalte/abenteuer/quests.json` (nur Quests mit `ort` ironwood, wegRivertonIronwood und
`riverton.schuppen`), `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel),
`docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** wie bisher (pytest alle, Paketbau, Prettier, Durchspielen, Simulation
der Ironwood-Quests und von `riverton.schuppen`)

## Ziel

Alle Dialoge, auf die `orte.json` für `wegRivertonIronwood` und `ironwood` verweist, nach Akt 2
der Story-Bibel (Szenen in Ironwood, Mamas Partie, Victors Einladung als Cliffhanger) und 09,
Abschnitte 4a und 5.5.

## Antworten auf deine Befunde (schon umgesetzt, Stand nach dem Hereinholen)

1. **`wenn` an Übergängen** gilt jetzt als erfüllt bei true, einer Zahl über 0 oder einem nicht
   leeren Text; `wenn: nadelRiverton` öffnet den Kanalweg also nach der Nadel.
2. **Verrosteter Schlüssel:** Fund `schluessel` steht in `funde.json`. Bitte am Steg in
   `cedar-creek-aussen.ink` vergeben (Szene 23 nach mittel-2: im passenden Zweig
   `~ gibFund("schluessel")`). Die Hülle setzt bei jedem Fund die Dialogvariable
   `gefunden<Fund>` (hier `gefundenSchluessel`); damit kann `albescu_schluessel` in
   `riverton-aussen.ink` den Schuppen anbieten, und `riverton.schuppen` beginnt.
3. **Tafel-Runden:** Zusätzlich zur Kurzform setzt die Hülle jetzt die Langform mit Ort
   (`wegMapleCedarTafelBestanden`, `wegCedarRivertonTafelBestanden` …); bitte für die Tafeln die
   Langform benutzen und bestehende Kurzform-Abfragen der Tafeln umstellen.
4. **Fahrkarte im Zug:** bleibt vorerst ohne Abfrage (kommt mit der Schnellreise-Regel).

## Vorgaben

1. Knotennamen genau wie in `orte.json`; Übergänge mit Dialog und `wenn` wie bisher.
2. Die Funde von Ironwood und dem Kanalweg stehen in `funde.json` (zahnrad, nietenkopf, foto2001,
   umschlag, holzturm, glasfunke); `zeitnotTrick` am Kanalweg erklärt und verschenkt die Karte
   (Name in `karten.json` folgt mit Schritt 13; bis dahin `~ gibKarte("zeitbonus")` als Platzhalter
   und im Bericht vermerken).
3. Dinge zum Ansehen, die 09 für Riverton und Ironwood nennt, aber `orte.json` nicht hat (Uhr mit
   Klebeband, Fahrplantafel, Fundbüro-Schild; Schichtplan, Kaffeemaschine, Werksfoto, Poster,
   Standuhr, Nieten „J. H.“): nicht anlegen, nur im Bericht vorschlagen, welche sich lohnen.

## Was nicht dazugehört

Karten, Code, Akt 3.

## Bericht

(vom Helfer auszufüllen)
