# Auftrag niedrig-1: Antworten der Gegner aus Akt 3 auf Sprüche

**Stand:** fertig (niedrig-1, 08.11.2026)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py -q`

## Ziel

Straßengegner antworten auf Sprüche des Helden (`docs/spiel/10_Sprueche_Schauplaetze_Varianten.md`,
S4). Für Akt 1 und 2 gibt es die Antworten schon (`spruch.konter.skaterJo.1` usw. in `texte/de.json`,
dort als Vorbild ansehen). Akt 3 steht in `docs/spiel/05_Story_Bibel.md` (Teil „Akt 3“).

## Vorgaben

1. Für jeden Straßengegner aus Akt 3 der Story-Bibel zwei Antworten:
   `spruch.konter.<name>.1` und `.2`, wobei `<name>` der letzte Teil der geplanten Gegnerkennung ist
   (bei „portDelacroix.marisol“ also „marisol“; steht keine Kennung in der Bibel, eine kurze in
   Kleinbuchstaben ohne Umlaute vorschlagen und im Bericht nennen).
2. Ton wie die Vorbilder: eine Zeile, frech oder gelassen, passend zum Steckbrief der Figur, nie
   beleidigend, nichts über Aussehen, Herkunft oder Familie.
3. Im Bericht: welche Gegner gegen welchen Spruch immun sein sollten (grossesMaul, gruebelfalle,
   schmeichelei, ablenkung) und warum.

## Bericht

(vom Helfer auszufüllen)

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

Zweig: `abenteuer-aufgabenzuordnung`. Zehn neue Schlüssel in `inhalte/abenteuer/texte/de.json`
(direkt nach `spruch.konter.slick.2`), Prüfung `test_abenteuer.py`: 11 bestanden.

Straßengegner aus Akt 3 laut Story-Bibel (Abschnitt 18 und Welt in Akt 3):

| Gegner                                    | Kennung (letzter Teil) | Quelle der Kennung                    |
| ----------------------------------------- | ---------------------- | ------------------------------------- |
| Dash, Lieferradfahrer, Silicon Bay        | `dash`                 | Bibel: `siliconBay.dash`              |
| Mr. Batiste, Bootsflicker, Port Delacroix | `batiste`              | Bibel: `portDelacroix.batiste`        |
| Buck, Tankwart, Desert Springs            | `buck`                 | Bibel: `desertSprings.buck`           |
| Joggerin mit Smartwatch, Glasbrücke       | `joggerin`             | Vorschlag (Bibel nennt keine Kennung) |
| Schiffskoch, Küstenfähre                  | `schiffskoch`          | Vorschlag (Bibel nennt keine Kennung) |

Bei Batiste und Buck ist je eine Antwort wörtlich aus der Bibel übernommen („Junge Leute reden.
Das Wasser hört nicht zu.“, „Na, jetzt willst du's aber wissen!“, „Hier draußen fährt keiner
langsam …“), damit Steckbrief und Spiel übereinstimmen.

Immunität (Vorschlag; „immun“ heißt: `spruch.immun`, Karte trotzdem verbraucht):

- **Dash:** immun gegen `grossesMaul` (Bibel: spielt immer schnell, Tempo ist sein Alltag) und
  gegen `ablenkung` (redet selbst ununterbrochen, Lärm stört ihn nicht); anfällig für
  `gruebelfalle` (Bibel) und `schmeichelei` (fühlt sich gern bewundert).
- **Mr. Batiste:** immun gegen `grossesMaul` und `gruebelfalle` (Bibel: gelassen, „das Wasser hört
  nicht zu“) und gegen `ablenkung` (spielt nebenbei beim Bootflicken, Ablenkung ist sein
  Normalzustand); anfällig nur für `schmeichelei` (ein Lob für seine Boote macht ihn redselig),
  damit Vorbereitung sich bei ihm überhaupt lohnt.
- **Buck:** gegen nichts immun (Bibel: „nicht immun“); passt zum lauten, herzlichen Tankwart, der
  auf jeden Spruch einsteigt.
- **Joggerin:** immun gegen `grossesMaul` (Stellungsduell 3 + 2, Tempo ist ihr Element); anfällig
  für `gruebelfalle` und `ablenkung` (schaut ständig auf die Smartwatch).
- **Schiffskoch:** immun gegen `ablenkung` (arbeitet in einer lauten Kombüse); anfällig für
  `grossesMaul` (steht unter Zeitdruck, die Suppe muss raus) und `gruebelfalle`.
