# Auftrag mittel-1: Dialoge für den Weg Cedar Creek → Riverton und für Riverton (Akt 2, erster Teil)

**Stand:** offen (Haupt-Chat, 08.11.2026, siebter Auftrag; Spieldaten von mittel-2 sind
zusammengeführt, 686bc02d)
**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/*.ink` (neue Dateien für `wegCedarRiverton` und
`riverton`; in `cedar-creek-aussen.ink` nur den Knoten `zedernwald` ergänzen),
`inhalte/abenteuer/quests.json` (nur Quests mit `ort` riverton oder wegCedarRiverton anpassen,
dazu neu `cedarCreek.partieformular`, E4.1), `inhalte/abenteuer/texte/de.json` (nur neue
Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** wie bisher (pytest alle, Paketbau, Prettier, Durchspielen mit inkjs,
dazu eine Simulation der Riverton-Quests wie bei Cedar Creek)

## Ziel

Alle Dialoge, auf die `orte.json` für `wegCedarRiverton` und `riverton` verweist (Feld `dialog` an
Figuren und Auslösern, auch an Übergängen), nach Akt 2 der Story-Bibel (`05_Story_Bibel.md`, Teil
2, Szenen in Riverton und auf dem Weg) und der Weltbeschreibung (`09`, Abschnitte 4a und 5.4).
Ironwood folgt in einem eigenen Auftrag.

## Vorgaben

1. **Knotennamen** genau wie in `orte.json` (Datei = Teil vor dem Punkt). Fehlt ein Knoten, scheitert
   der Paketbau nicht, aber das Spiel meldet „Dialog fehlt“; deshalb vollständig.
2. **Übergänge mit Dialog** laufen vor dem Wechsel; mit `wenn` sperren sie, solange die Variable
   nicht wahr ist (siehe `inhalte/abenteuer/README.md`). mittel-2 nennt neue Bedingungsvariablen:
   `nadelRiverton`, `clubkampfRivertonBesprochen`, `schuppenOffen`, `elmStreetBekannt`; du setzt
   sie im passenden Knoten.
3. **Externe Funktionen**, die es jetzt gibt: `gibKarte`, `setzeSzene`, `beginnePartie`,
   `beginneAufgaben`, `setzeZustand`, `schalteSteckbrief`, `reise`, `gibFund`, `oeffneLaden`.
   Die Funde von Akt 2 stehen in `funde.json` (Kennungen: pfeilspitze, fahrkarte1958,
   holzspringer, pavillonspringer, zeitungsausschnitt, taubenfeder, holzlaeufer; für Ironwood
   zahnrad, nietenkopf, foto2001, umschlag, holzturm, glasfunke), aufrufen mit `~ gibFund("…")`, Läden in `laeden.json` (Riverton hat noch keinen; den
   Zeitungsstand vorerst als Gespräch ohne `oeffneLaden`).
4. **E4.1** `cedarCreek.partieformular`: Mr. Boateng entziffert das alte Partieformular aus Route 1
   (Voraussetzung: Fund `formular1857`), Belohnung ein Fragment; Knoten im Waschsalon oder Archiv.
5. Alles Übrige wie bisher (Sprecher-Tags, geschlechtsneutral, Variablen nach R42).

## Was nicht dazugehört

Ironwood und der Weg dorthin (nächster Auftrag), Karten, Code.

## Bericht

(vom Helfer auszufüllen)
