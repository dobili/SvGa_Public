# Auftrag niedrig-1: kein Auftrag

**Stand:** kein Auftrag (Haupt-Chat, 08.11.2026; der achte Auftrag, Ironwood-Karten, ist
zusammengeführt, danke. Alle Karten von Akt 1 und 2 stehen. Bis der nächste Auftrag per Nachricht
kommt, bitte nichts tun und warten.)

## Letzter Auftrag (erledigt, zur Nachlese)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/karten/weg-riverton-ironwood-1.json`, `-2.json`,
`ironwood-*.json` (fünf Dateien, neu), `docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q` (danach darf nichts
mehr übersprungen werden), in `app/` Prettier und Paketbau

## Ziel

Die sieben Karten aus `orte.json` (Orte `wegRivertonIronwood` und `ironwood`) wie beim siebten
Auftrag: alle Auslöser und Figuren des Ortes, belebt nach `09_Weltbeschreibung.md` (Abschnitte 3,
4, 4a, 5.5, Checkliste 6) und passend zur Story-Bibel Akt 2 (Szenen in Ironwood, Kanalweg).

## Vorgaben

1. **Größen:** Außen 32 × 24 (Werkstor, Brücke, Reihenhäuser, Kantine, Museum, Bushaltestelle;
   Rauch und Funken als Statisten-Objekte), Wegkarten 28 × 20 (Kanalweg mit leeren Fabriken,
   Brücke), Innen nach 09 (Kantine mit langen Tischen und Ofen, Mamas Zimmer klein, Umkleide mit
   Schließfächern, Museum mit Schaukästen).
2. **Belebung:** Schichtwechsel am Werkstor, Kinder mit Kreidebrett, Werkskatze am Ofen, Krähen auf
   Trägern, Fledermäuse mit `wann: abend`.
3. **Fehlende Dinge** wie Fahrplantafel oder Schilder, die 09 nennt, aber `orte.json` nicht: nicht
   zeichnen, im Bericht nennen (wie beim letzten Mal; der Haupt-Chat sammelt sie für mittel-1).

## Was nicht dazugehört

`orte.json`, andere Orte, Grafik.

## Bericht

(vom Helfer auszufüllen)

Zweig: `abenteuer-aufgabenzuordnung`. Sieben Karten neu. Prüfungen: 375 Pipeline-Tests bestanden,
0 übersprungen; Prettier und Paketbau sauber.

Zuordnung (orte.json nennt keine `karte`, also nach Sinn):

- `weg-riverton-ironwood-1` Kanalweg (28 × 20): Kanal oben, drei leere Fabriken unten; `start`,
  `zurueckRiverton`, `tafel`, `fundZahnrad`, Figur `dale`, `weiterBruecke`; Belebung `angler`,
  `radfahrerin` (morgen), `enten`, `ratten`.
- `weg-riverton-ironwood-2` Brücke (28 × 20): Fluss quer, Brücke in Reihe 9–10; `start`,
  `zurueckKanalweg`, `fundNietenkopf` (vor der Brücke), `zeitnotTrick`, `weiterIronwood`;
  `brueckenwaerter`, `kraehen`, `moewe`.
- `ironwood-aussen` (32 × 24): Werk oben links (Werkstor mit `umkleideTuer`), Kantine, Eisenwaren
  mit `eisenwarenfenster`, Straße, Güterbahnhof mit Kabeltrommeln, Elm Street mit
  `haustuerRuth`, alter Bahnhof mit `museumTuer`; `start`, `bushaltestelle`, `busRiverton`,
  `busSiliconBay` an der Haltestelle rechts; `kanalweg` links am Rand; `kreidebrett`,
  `fundGlasfunke`; Figuren `gus` (an der Kabeltrommel), `edna` (am Verkaufsfenster), `victor`,
  `grahamHale` (am Werkstor); Belebung `schichtwechsel` (morgen), `kreidekinder`,
  `kohlentraegerin` (abend), `taubenfuetterer`, `rauch`, `funken` (abend), `kraehen`,
  `fledermaeuse` (abend), `werkskatzeAussen`.
- `ironwood-kantine` (18 × 12): drei lange Tische, Ofen, `pokalregal`, `stahlbrett`, Figuren
  `bigJoe` (am Stahlbrett), `hank`, `priya`; `kantinenkoch`, `werkskatze` (am Ofen, sitzen).
- `ironwood-mamas-zimmer` (12 × 10): `medaille`, `partieformular2001`, Figuren `mama`, `omaRuth`.
- `ironwood-umkleide` (12 × 10): Spinde, `schliessfach`; `arbeiter`.
- `ironwood-museum` (16 × 12): Schaukästen, Standuhr, `postsack`, `vitrine1858`, Figur `teague`;
  `besucherin`.

Laut 09 (5.5), aber nicht in `orte.json`, daher nicht gezeichnet: Nieten „J. H.“ an der Brücke in
Ironwood selbst (nur `fundNietenkopf` auf der Wegkarte), Schichtplan, Kaffeemaschine mit Beule,
Foto der Werksmannschaft (Kantine), Poster (Mamas Zimmer), Standuhr als Auslöser (Museum).
`rauch` steht auf einer begehbaren Kachel neben dem Werk, weil der Kartentest Laufwege nur auf
erreichbaren Feldern zulässt; die eigentliche Rauchanimation am Schornstein ist Grafik.

```text
weg-riverton-ironwood-1.json
############################
#                          #
#                          #
#                          #
############################
############################
############################
#                     L    #
#   t       D              #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#               f          #
#                          #
# ######  ######  ######   #
# #F##F#  #F##F#  #F##F#   #
# ######  ######  ######   #
# ######  ######  ######   #
# ######  ######  ######   #
#                          #
############################

weg-riverton-ironwood-2.json
############################
#        ##########        #
#        ##########        #
#        ##########        #
#        ##########        #
#        ##########        #
#        ##########        #
#        ########## L      #
#      f ##########        #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#        ##########        #
#        ##########  z     #
#        ##########        #
#        ##########        #
#        ##########        #
#        ##########        #
#        ##########        #
#        ##########        #
############################

ironwood-aussen.json
################################
#  ##############              #
#  ##############  ####### #####
#  ##F#######F###  ##F#### #####
#  ##############  ####### #####
#  ##############  ####### #####
#  ######u#######  ###k### #e###
#                           bE #
#          G               bsLb#
kTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#
#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#
#              G               #
#             KKK              #
#     k       KKK V            #
#                              #
#                              #
#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#
#                              #
# ##h## #####       ####m####  #
# ##### #####       #########  #
# ##### #####       #########  #
# ##### #####       #########  #
#           f                  #
################################

ironwood-kantine.json
####F########F####
#KpK            L#
#                #
#                #
#  KKKKKK  KKKK  #
#    H      P    #
#                #
#  KKKKKK   sB   #
#                #
#                #
#        s       #
#########k########

ironwood-mamas-zimmer.json
#####F######
#KKK     mK#
#KKK       #
#          #
#   M      #
#         p#
#       O  #
#          #
#     s    #
######z#####

ironwood-umkleide.json
############
#KKKKKKKsKK#
#          #
#          #
#K         #
#K  KKKK   #
#K         #
#K         #
#     s    #
######u#####

ironwood-museum.json
####F######F####
#             L#
#              #
# KKK  KvK     #
#              #
#              #
#          KKK #
# KpK      KKK #
#         T    #
#              #
#       s      #
########m#######
```
