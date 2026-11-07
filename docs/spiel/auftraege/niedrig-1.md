# Auftrag niedrig-1: Tiled-Karten für Maple Falls in Platzhalterkacheln

**Stand:** erledigt (niedrig-1, 07.11.2026)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-aufgabenzuordnung`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/karten/*.json` (neu; `maple-falls-dachboden.json` nur, wenn
nötig, dann im Bericht nennen), `docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py`
(Python-Umgebung: `python3 -m venv .venv && . .venv/bin/activate && pip install -r pipeline/requirements.txt`),
dann in `app/`: `npm ci` (einmal), `node skripte/baue-abenteuerpaket.mjs`, zuletzt
`npx prettier --check ../inhalte/abenteuer`.

## Ziel

Die vier übrigen Karten von Maple Falls aus `inhalte/abenteuer/orte.json` (`mapleFalls.wohnzimmer`,
`mapleFalls.aussen`, `mapleFalls.clubraum`, `mapleFalls.park`) als Tiled-JSON, genau im Aufbau
der vorhandenen `karten/maple-falls-dachboden.json` und nach den Regeln in
`inhalte/abenteuer/README.md` (Abschnitt Tiled-Karten). Grafik ist noch Platzhalter (acht
Kacheln: 1 Boden, 2 Wand, 3 Kiste, 4 Teppich, 5 Brett, 6 Treppe, 7 Lampe, 8 Fenster; Kollision
tragen 2, 3, 5, 7, 8). Die Karten sollen trotzdem die Räume der Story-Bibel (`05_Story_Bibel.md`,
Abschnitt Welt) in Größe und Anordnung abbilden, damit später nur die Kacheln getauscht werden.

## Vorgaben

1. **Größen:** Innenräume 12 × 10 bis 16 × 12 Kacheln, Außenkarten 24 × 18 bis 32 × 24. Immer ein
   geschlossener Rand aus Wandkacheln (außen: Kachel 2 als Hecke oder Zaun).
2. **Ebenen:** `boden`, `waende`, `objekte` als Kachelebenen, `ausloeser` als Objektebene, Namen
   und Reihenfolge wie im Beispiel. Kachelsatz eingebettet wie im Beispiel (`platzhalter`,
   `../grafik/platzhalter.png`, 4 × 4, Kollision je Kachel).
3. **Auslöser:** Für jeden Übergang aus `orte.json` ein Objekt mit genau dem Namen
   (`treppe`/`treppeOben`, `haustuer`, …) auf beiden Seiten; auf jeder Karte ein `start`-Objekt
   mit `richtung`; Gegenstände (`parkbank`, `brett`) als Objekte; Figuren als Objekte mit
   `type = "figur"` und dem Figurnamen aus `orte.json` (`name` = Teil nach dem Punkt, etwa
   `coachDelgado`), an sinnvollen Stellen (Coach am Lehrertisch, Sam an einem Brett, Jo im Park).
   Fehlende Übergänge oder Figuren in `orte.json` nicht selbst ergänzen, sondern im Bericht nennen.
4. **Begehbarkeit:** Jeder Auslöser muss von `start` aus erreichbar sein (zu Fuß, ohne
   Kollisionskacheln zu durchqueren); vor jedem Gegenstand und jeder Figur mindestens eine freie
   Kachel, von der aus man sie ansieht.
5. **Erzeugung:** Mit einem kleinen Python-Skript (mit `-I`, nicht ins Repository), damit die
   Datenfelder (`data`, 120 bis 768 Zahlen) fehlerfrei sind; die JSON-Dateien mit Einrückung 1 wie
   das Beispiel. Im Bericht je Karte eine ASCII-Skizze (Zeichen je Kachel), damit der Haupt-Chat sie
   ohne Tiled prüfen kann.

## Was nicht dazugehört

Grafik, `orte.json`, Code; Cedar Creek (späterer Auftrag).

## Bericht

Vier Karten neu in `inhalte/abenteuer/karten/`: `maple-falls-wohnzimmer.json` (14 × 10),
`maple-falls-aussen.json` (28 × 20), `maple-falls-clubraum.json` (16 × 12),
`maple-falls-park.json` (28 × 20). Aufbau, Ebenen und Kachelsatz kopiert aus der Dachbodenkarte
(unverändert). Das Erzeugungsskript prüft per Breitensuche, dass jeder Auslöser von `start` aus
erreichbar ist und jede Figur und jeder Gegenstand ein freies Nachbarfeld hat. Prüfungen: pytest
8 bestanden, Paket gebaut, Prettier sauber.

Fehlt in `orte.json` (nicht ergänzt, aber in den Karten schon als Auslöser angelegt):

- Übergang `schule` (aussen ↔ clubraum), auf beiden Karten gleich benannt.
- Übergang `park` (aussen ↔ park), auf beiden Karten gleich benannt.
- Übergang `landstrasse` am rechten Parkrand (Weg nach Cedar Creek), Ziel noch offen.
- Die Figuren Lily, Juno, Mr. Abernathy und Victor aus der Story-Bibel fehlen in `orte.json`;
  in den Karten stehen sie deshalb nicht.
- Nach `orte.json` ist `start` ein einziger Auslöser je Ort; jede Karte hat ihr eigenes `start`.
  Beim Betreten über einen Übergang gilt der Zielauslöser.

Skizzen (Legende: `#` Wand/Hecke, `T` Teppich als Weg/Straße, `K` Kiste (Möbel, Halfpipe, Bank),
`B` Brett, `L` Lampe (im Clubraum: Pokale), `F` Fenster, `t` Treppe; Kleinbuchstaben = Auslöser
(`s` start, sonst Anfangsbuchstabe: `h` haustuer, `s` an der Wand/Tür auch `schule`, `p` park bzw.
parkbank, `l` landstrasse), Großbuchstaben = Figuren (`M` mutter, `C` coachDelgado, `S` sam bzw.
skaterJo). Im Park sind die Wandblöcke rechts Platzhalter für Fluss/Ufer.

```text
maple-falls-wohnzimmer.json
####F####F####
#t     L     #
#          KK#
#            #
#   TTTTT M  #
#   TTTTT    #
#   TTTTT    #
#K           #
#K    s     K#
######h#######

maple-falls-aussen.json
############################
#                          #
# #######        ######### #
# #F###F#        ##F###F## #
# #######        ######### #
# #######        ######### #
# ###h###        ####s#### #
#    s               T     #
#    T      K        T     #
#TTTTTTTTTTTTTTTTTTTTTTTTTTp
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#                          #
#              L        L  #
#  ##F#F##                 #
#  #######                 #
#  #######                 #
#  #######                 #
#  #######                 #
#                          #
############################

maple-falls-clubraum.json
####F###F###F###
# LL           #
#            KC#
#            K #
#              #
#  BS B  B     #
#              #
#              #
#  B  B  B     #
#              #
#       s      #
########s#######

maple-falls-park.json
############################
#                     #### #
#                     #### #
#     KKKKK           #### #
#     KKKKK           #### #
#     KKKKK           #### #
#       S             #### #
#                     #### #
#           pK             #
psTTTTTTTTTTTTTTTTTTTTTTTTTl
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#                          #
#                     #### #
#    L         L      #### #
#                     #### #
#                     #### #
#                     #### #
#                     #### #
#                     #### #
############################
```
