# Auftrag niedrig-1: Zwei Routenkarten Maple Falls → Cedar Creek

**Stand:** Frage (niedrig-1, 08.11.2026; Routenkarten fertig, Park offen)
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

Zweig: `abenteuer-aufgabenzuordnung`. Neu: `weg-maple-cedar-1.json` (Landstraße, 28 × 20) und
`weg-maple-cedar-2.json` (Flussweg, 28 × 20), Kennungen in der Kartendatei `weg.mapleCedar1` und
`weg.mapleCedar2` (bitte in `wege.json` anpassen, falls anders gewünscht). Alle Objekte mit den
Namen aus der Vorgabe. Prüfungen: 293 Pipeline-Tests bestanden, Prettier und Paketbau sauber.

Handprüfung mit `pipeline/abenteuer/karten.py` (Breitensuche von `start`, offene Randfelder außer
an den Übergängen): beide Karten ohne Befund, alles erreichbar, Rand nur an `zurueck…`/`weiter…`
offen. `fund_formular` liegt im Busch (Kisten) und ist nur von oben (Reihe 2, durch die Lücke im
Zaun) ansprechbar. `wanderer` steht auf dem Weg (Kachel 12, Reihe 10), `gegnerin` vor der Bank.
Der Bach im Flussweg ist wie in Cedar Creek aus Wandkacheln, der Weg führt in Reihe 9–10 als
Steg hindurch zum Übergang `weiterCedar`.

**Frage (Park, nicht umgesetzt):** Der Übergang `landstrasse` im Park (Kachel 27, Reihe 10; Reihe 9
belegt `bushaltestelle`) ist fertig vorbereitet, lässt aber zwei Kartentests scheitern: `orte.json`
erklärt `landstrasse` beim Ort `mapleFalls` nicht mehr (`test_ausloeser_und_figuren_erklaert` und
`test_rand_geschlossen` für `mapleFalls.park`). `orte.json` und der Test sind für mich gesperrt,
und ein Stand mit roten Tests wird nicht gepusht (CLAUDE.md, Regel 5). Deshalb ist die Parkkarte
unverändert. Vorschlag: `landstrasse` (Art `uebergang`, `karte: mapleFalls.park`, Ziel
`weg.mapleCedar1` / `zurueckPark`) in `orte.json` oder `wege.json` eintragen und dem Kartentest
die Auslöser aus `wege.json` mitgeben; dann setze ich die Parkänderung in einer Minute nach.

Skizzen (Legende wie zuvor; `z`/`w` Übergänge zurück/weiter, `t` tafel, `f` fund_formular bzw.
fund_muenzen, `W` wanderer, `G` gegnerin, `r` rast, `s` start bzw. schild_cedar, `#` Zaun/Wand,
im Flussweg rechts Wasser):

```text
weg-maple-cedar-1.json
############################
#                          #
#                          #
#     KfKK                 #
#     KKK                  #
#     KKK                  #
# ########### ###########  #
#                          #
#   t                      #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTWTTTTTTTTTTTTTT#
#                   KK     #
#                    G     #
# #########   ###########  #
#                          #
#                          #
#                          #
#                          #
#                          #
############################

weg-maple-cedar-2.json
############################
#                      #####
#                      #####
#                      #####
#                 L    #####
#                      #####
#         f            #####
#                      #####
#                    s #####
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#                      #####
#              rK      #####
#                      #####
#    L                 #####
#                      #####
#                      #####
#                      #####
#                      #####
############################
```
