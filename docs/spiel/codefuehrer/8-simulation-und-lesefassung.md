# Codeführer: Simulation und Lesefassung

Zwei Werkzeuge in Node spielen das ganze Spiel ohne Oberfläche durch, mit echtem inkjs und den
Regeln der App.

## Gesamtsimulation

`node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1 [--sekunden 300]`

Ein Spieler im Programm geht vom Dachboden in Maple Falls bis zum Abspann alles ab und wählt in
Dialogen nach Zufall (wiederholbar über den Startwert). Am Ende stehen hängende und nie begonnene
Quests, nie erreichte Knoten, Figuren ohne Karte und nie besuchte Orte. Rückgabewert 1, wenn eine
Hauptquest nicht fertig wird, der Abspann fehlt oder Daten fehlen.

Warum ein Simulator statt einzelner Tests: Sackgassen entstehen aus der Reihenfolge, und die zeigt
nur ein ganzer Durchlauf.

Teile:

- `gesamtsimulation-regeln.cjs`: Welt laden, Stand anlegen, Regeln wie in der App.
- `gesamtsimulation-dialoge.cjs`, `-rueckkehr.cjs`, `-sammlung.cjs`: Dialoge, Rückwege, Funde.
- `gesamtsimulation-bericht.cjs`: der Bericht.
- `gesamtsimulation-wirtschaft.cjs` (`--wirtschaft`): Münzen je Ort für einen sparsamen und einen
  verschwenderischen Spieler.
- `gesamtsimulation-chaos.cjs`, `-chaoslauf.cjs`: ein Spieler, der alles in falscher Reihenfolge
  versucht.
- `bedingung.cjs`: dieselben Bedingungen wie `regeln/bedingung.ts`.

## Lesefassung

`node pipeline/abenteuer/lesefassung.cjs --ziel DATEI.md [--akte]`

Statt des zufälligen Spielers spielt ein Leser mit festen Entscheidungen
(`lesefassung-spieler.cjs`) und schreibt jeden Dialog mit: Sprecher, Ort, Questschritt und
gewählte Antwort. Von jedem Gespräch bleibt nur der erste Durchlauf. Das Ergebnis ist die ganze
Geschichte als Lesetext für Lektorat und Durchsicht; mit `--akte` je Akt eine Teildatei.
Die Lesefassung bleibt lokal und kommt nicht ins Repository.
