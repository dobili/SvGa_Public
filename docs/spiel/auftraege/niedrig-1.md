# Auftrag niedrig-1: Zwei Routenkarten Maple Falls → Cedar Creek

**Stand:** offen (Haupt-Chat, 08.11.2026, fünfter Auftrag; Grundlage ist
`docs/spiel/08_Wege_und_Entdeckungen.md`, Abschnitt 1, vom Autor abgesegnet)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-aufgabenzuordnung`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/karten/weg-maple-cedar-1.json` und
`inhalte/abenteuer/karten/weg-maple-cedar-2.json` (neu), `inhalte/abenteuer/karten/maple-falls-park.json`
(nur: am rechten Rand ein Übergang `landstrasse` neben der Bushaltestelle, Rand dort offen),
`docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q`, in `app/`
`npx prettier --check ../inhalte/abenteuer` und `node skripte/baue-abenteuerpaket.mjs`. Die
neuen Karten stehen noch nicht in `orte.json` (der Haupt-Chat legt `wege.json` an), dein Kartentest
prüft sie deshalb noch nicht; prüfe sie bitte mit deinem Modul `pipeline/abenteuer/karten.py` von
Hand (Erreichbarkeit, Rand) und schreibe das Ergebnis in den Bericht.

## Ziel

Die erste begehbare Route (W5): Karte 1 „Landstraße“ (28 × 20, Felder, Zaun, Straße von links nach
rechts, Rätseltafel am Anfang), Karte 2 „Flussweg“ (28 × 20, Bach rechts wie in Cedar Creek, Steg,
Bank, Ortsschild am Ende). Platzhalterkacheln wie bisher.

## Vorgaben

1. **Objekte Karte 1** (Namen genau so): `start` (links, Richtung rechts), `zurueckPark`
   (Übergang links am Rand, zurück nach Maple Falls), `tafel` (Gegenstand, Kollision, neben dem
   Weg), `wanderer` (Figur, auf dem Weg, kurz vor der Mitte), `gegnerin` (Figur, bei einer Bank
   rechts), `fund_formular` (Gegenstand, versteckt hinter einem Busch: Kollision, nur von einer
   Seite erreichbar), `weiterFluss` (Übergang rechts am Rand).
2. **Objekte Karte 2:** `start` (links, Richtung rechts), `zurueckLandstrasse` (Übergang links),
   `rast` (Gegenstand: Bank am Fluss), `fund_muenzen` (Gegenstand, sichtbar: Kiste), `schild_cedar`
   (Gegenstand am Ende), `weiterCedar` (Übergang rechts am Rand).
3. **Rand:** nur an den Übergängen offen; alles von `start` erreichbar; Figuren und Gegenstände von
   einem freien Nachbarfeld aus ansprechbar.
4. **Park:** Übergang `landstrasse` am rechten Rand (Kachel 27, Reihe 9 oder 10 frei), die
   Bushaltestelle bleibt, wo sie ist.
5. Kein Code, keine Änderung an `orte.json`.

## Was nicht dazugehört

Weitere Routen, Grafik.

## Bericht

(vom Helfer auszufüllen)
