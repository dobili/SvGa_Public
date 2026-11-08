# Auftrag niedrig-1: die 25 Karten von Akt 4

**Stand:** offen (Haupt-Chat, 08.11.2026, zwölfter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** die neuen Kartendateien von Akt 4, dazu in den vorhandenen Karten
`desert-springs-aussen.json` den Auslöser `highway` und in `port-delacroix-aussen.json` den
Auslöser `bayou` und die Figur `blaeser` (im Musikhaus: `port-delacroix-musikhaus.json`),
`docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q` (125 übersprungene Tests
werden mit jeder Karte weniger), in `app/` Prettier und Paketbau

## Ziel

Akt 4 steht in `orte.json`. Die Tabelle aller Karten mit Dateien, Größen, Objekten und Figuren
steht im Bericht des siebzehnten Auftrags von mittel-1 in `docs/spiel/auftraege/mittel-1.md`
(Abschnitt „Für niedrig-1“); wenn sie dort fehlt, Objekte und Zuordnung wie beim letzten Mal direkt
aus `orte.json`. Orte: Story-Bibel Teil 4 (Abschnitt 27 bis 31), Weltbeschreibung 5.9 bis 5.14.

## Vorgaben

Wie bei Akt 3; nach jeder Stadt pushen (Summit City mit Weg, Crossroads mit Weg, Pinewood Camp mit
Weg, Ghost Town mit Weg und Erinnerung, Capital Arena, Bayou und Hochebene zuletzt). Die Hochebene
neutral ohne Figuren (Rückfrage Q21-1 offen).

## Bericht

(vom Helfer auszufüllen)

## Bericht des letzten Auftrags, zur Nachlese

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

Zweig: `abenteuer-aufgabenzuordnung`. Zwei Karten neu. Prüfungen: 375 Pipeline-Tests bestanden,
Paketbau sauber, Prettier für die neuen Karten sauber (`inhalte/abenteuer/runden.json` meldet
Prettier, die Datei ist nicht von mir). Handprüfung mit `pipeline/abenteuer/karten.py`: beide Karten
alles von `start` erreichbar, Rand geschlossen.

- `erinnerung-london-strand` (28 × 20): drei Häuserzeilen mit Ladenfronten, Kaffeehaustür im
  dritten Haus, Straße Reihe 9–11 mit Droschke, Gaslaternen beidseits, Themse unten (Reihen 15–18,
  als Wand). Objekte: `start` (Richtung oben) und `ankunft` nebeneinander am Gehweg (Kartentest
  verlangt `start`, wie bei `bushaltestelle`), `kaffeehausTuer`, `droschke`, Figur
  `zeitungsjunge`; Belebung `passanten` (tag), `tauben`, `laternenanzuender` (abend),
  `droschkenpferd` (sitzen, vor der Droschke; zusätzlich zur Vorgabe).
- `erinnerung-london-kaffeehaus` (16 × 12): Theke, Zeitungsständer, Tische, `schachtisch` (Brett
  in der Mitte), `rueckkehr` (große Uhr in der oberen Wand, von unten ansprechbar), `tuer` unten,
  `start` vor der Tür; Figuren `kellner` (hinter der Theke), `zeitungsleser` (am Ständer);
  Belebung `gaeste` (schauen der Partie zu).

Kein Übergang am Kartenrand: Die Erinnerung beginnt über `ankunft`, endet über `rueckkehr`.
Sobald mittel-1 den Ort in `orte.json` einträgt, prüft der Kartentest beide Karten selbst.

```text
erinnerung-london-strand.json
############################
#                          #
# ###### ###### ######     #
# #F##F# #F##F# #F##F#     #
# ###### ###### ######     #
# ###### ###### ######     #
# ###### ###### ##k###     #
#                          #
#   L      L  Z   L     L  #
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#TTTTTdKTTTTTTTTTTTTTTTTTTT#
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
# sa                       #
#   L      L      L     L  #
#                          #
############################
############################
############################
############################
############################

erinnerung-london-kaffeehaus.json
###F####r###F###
#              #
#K         KKKK#
#KZ          K #
#  K           #
#      s       #
#          K   #
#              #
#  K        K  #
#              #
#       s      #
########t#######
```

Zweig: `abenteuer-aufgabenzuordnung`. Die Tabelle aus `mittel-1.md` habe ich dort nicht gefunden;
Objekte, Figuren und Kartenzuordnung (Feld `karte`) stammen deshalb direkt aus `orte.json`.
Figuren ohne `karte` sind nach Bibel und 09 verteilt.

**Teil 1: Weg 4 und Silicon Bay (6 Karten, gepusht).** 415 Tests bestanden, keiner der sechs
übersprungen; Prettier und Paketbau sauber.

- `weg-ironwood-silicon-raststaette` (28 × 20): Leitplanke der Schnellstraße oben, Lkw, Raststätte
  mit Kaffeeautomat (`tafel`), `fundAnstecker`, Fernfahrerin `kowalczyk` am Lkw; `fernfahrer`,
  `reisende`, `kraehe`, `hund`.
- `weg-ironwood-silicon-glasbruecke` (28 × 20): Brücke über der Autobahn, `fundOhrstoepsel`,
  `joggerin`; `pendlerin` (morgen), `lieferroboter`, `drohne`.
- `silicon-bay-aussen` (32 × 24): Akademie und Konzernzentrale (Lobby) oben, Straßenbahngleis,
  Straße, `hotel` unten links, Food-Truck mit Bank (`rosie`, `dash`), `victor`, `busIronwood` an
  der Haltestelle, `glasbruecke` links, `faehre` rechts; `angestellte`, `wachmann`, `besucher`;
  nur Maschinen als „Tiere“ (09, 4): `lieferroboter`, `drohne`.
- `silicon-bay-akademie` (18 × 12): sechs Bildschirmbretter, Lins Schreibtisch, `lin`, `nova` an
  der Fensterbank, `theo` an der Datenwand, `serverraumTuer` rechts am Rand; `schueler`,
  `saugroboter`.
- `silicon-bay-serverraum` (12 × 10): drei Serverreihen, `schummelgeraete` in einer Schublade.
- `silicon-bay-lobby` (14 × 10): `vitrineHale`, `empfangsroboter`; `besuchergruppe`.
- Nicht in `orte.json`, daher nicht gezeichnet: Rangliste, Glaspokal, Zettel „Drei Ziele“
  (Akademie, 09 5.6).

```text
weg-ironwood-silicon-raststaette.json
############################
#                          #
############################
############################
#                          #
#                          #
#  KKK              KKKK   #
#  KKKK             KKKK   #
#       L          L       #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#          t               #
#         #### ####        #
#         ##F###F##        #
#         #########        #
#         #########     f  #
#         #########        #
#                          #
#                          #
############################

weg-ironwood-silicon-glasbruecke.json
############################
############################
############################
############################
############################
############################
############################
############################
#TTTTTTTTLTTTTTTTTLTTTTTTTT#
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTJTTTTTT#
#TTTTTTTTTTTTfTTTTTTTTTTTTT#
############################
############################
############################
############################
############################
############################
############################
############################

silicon-bay-aussen.json
################################
#  ##########     ###########  #
#  ##F####F##     ##F#####F##  #
#  ##########     ###########  #
#  ##########     ###########  #
#  ####a#####     #####l#####  #
#                              #
##############  ################
#                              #
#                              #
gTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTf
#sTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#
#           b             V    #
#           L                  #
#     h                LL      #
#  #######     RKKKK           #
#  ##F##F#      KKKK           #
#  #######                     #
#  #######       KKD           #
#  #######                     #
#  #######                     #
#                              #
#                              #
################################

silicon-bay-akademie.json
####F########F####
#L  N       L    #
# T        KKK   #
#                #
#  B  B          #
#                s
#                #
#  B  B   B  B   #
#                #
#                #
#        s       #
#########a########

silicon-bay-serverraum.json
############
# KKKKKKKK #
#          #
#          #
# KKKKKKKK #
ss         #
#          #
# KKKKKKKK #
#         s#
############

silicon-bay-lobby.json
###F######F###
#            #
#            #
#    KvKK    #
#            #
#          E #
#KK          #
#            #
#      s     #
#######l######
```

**Teil 2: Weg 5 und Port Delacroix (6 Karten, gepusht).** 445 Tests bestanden, keine der sechs
übersprungen; Prettier und Paketbau sauber.

- `weg-silicon-delacroix-faehre` (28 × 20): Fährdeck, Wasser rundum, Salon mit `tafel` am Eingang,
  `fundFlaschenpost`, `schiffskoch`; `passagierin`, `matrose`, `moewen`, `pelikan`.
- `weg-silicon-delacroix-deich` (28 × 20): Deich zwischen Wasser und Sumpf, Sandsäcke,
  `fundMuschel`, `guidry`; `helfer`, `reiher`, `moewe`.
- `port-delacroix-aussen` (32 × 24): Turnhalle und Klavierwerkstatt oben, Straße mit Brettern vor
  den Häusern (`brettHaus1` bis `4`), Gebäckstand mit `arceneaux`, zwei Zelte, Ruine des
  Musikhauses am Kai, Boot mit `batiste`, Wasser unten; `deich` links, `wuestenzug` rechts;
  `handwerker`, `sandsackhelfer`, `ballkinder`, `blaeser` (abend), `pelikane`, `moewen`, `reiher`
  am Bauzaun, `katze` auf dem Boot.
- `port-delacroix-turnhalle` (18 × 12): Körbe, acht Klapptische mit Brettern, `odile`, `remy`,
  `lou`; `clubkinder`.
- `port-delacroix-werkstatt` (16 × 12): Klaviere unter Planen, Hobelbank (`werkbank`), `henri`,
  `celeste`.
- `port-delacroix-musikhaus` (16 × 12): Ruine mit Trümmern, `schild` an der Wand; `aufraeumer`.
- Nicht in `orte.json`, daher nicht gezeichnet: Spendenkasse, nasses Notenheft, Plakat „Wir
  spielen weiter“ (Turnhalle), Foto des jungen Ambrose und Célestes Laptop als Auslöser
  (Werkstatt). Gerüste gibt der Platzhaltersatz nicht her (Bretter und Kisten stehen dafür).

```text
weg-silicon-delacroix-faehre.json
############################
############################
############################
############################
############################
#  L                    L  #
#         ########         #
#         #F#t##F#         #
#         ### ####         #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#                 S        #
#    f              KKK    #
#                   KKK    #
#                          #
############################
############################
############################
############################
############################

weg-silicon-delacroix-deich.json
############################
############################
############################
############################
############################
############################
############################
#                     L    #
#     KK       KKK         #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#                   G      #
#          f               #
#                          #
############################
############################
############################
############################
############################
############################

port-delacroix-aussen.json
################################
#                              #
# ########  #######            #
# ##F##F##  ##F##F#            #
# ########  #######            #
# ########  #######            #
# ########  #######            #
# ###t####  ###w###            #
#   b     b        b      b    #
#                   gA         #
dTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTw
#sTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#
#                    K     L   #
#  KKK   KKK          ###m#### #
#  KKK   KKK          ######## #
#                     ######## #
#             KKK              #
#TTTTTTTTTTTTTTBTTTTTTTTTTTTTTT#
#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#
################################
################################
################################
################################
################################

port-delacroix-turnhalle.json
#L##############L#
#                #
#        O       #
#                #
#  BR B    B  B  #
#                #
#                #
#  B  B    BL B  #
#                #
#                #
#        s       #
#########t########

port-delacroix-werkstatt.json
####F######F####
#              #
# KKK      KKK #
# KKK      KKK #
#           C  #
#       KwK    #
#        H     #
# KKK          #
# KKK          #
#              #
#       s      #
########w#######

port-delacroix-musikhaus.json
########s#######
#              #
#              #
# KK           #
# KK           #
#              #
#          KKK #
#          KKK #
#   K          #
#              #
#       s      #
########m#######
```

**Teil 3: Weg 6 und Desert Springs (5 Karten, gepusht).** 470 Tests bestanden, 0 übersprungen;
Prettier und Paketbau sauber. Damit sind alle 17 Karten von Akt 3 gezeichnet.

- `weg-delacroix-desert-canyonpfad` (28 × 20): roter Fels oben und unten, `tafel` am Bahnhof,
  Miras flacher `stein`, `fundEidechsenhaut`; `eidechsen`, `roadrunner`, `wanderin` (morgen).
- `weg-delacroix-desert-felsbogen` (28 × 20): Felsbogen mit Pfeilern, `aussichtspunkt` darunter,
  Eisenbahnbrücke unten mit `fundNieten`, `holloway` am Abstieg; `geier`, `eidechse`,
  `fotograf` (abend).
- `desert-springs-aussen` (32 × 24): Motel mit `dot`, Garage (`garageTuer`), Diner, Tankstelle mit
  `buck` am Auto, alter Bahnhof mit `antiquariatTuer` und `bahnhof`, Kakteen; `canyon` links;
  `tankwartlehrling`, `touristen`, `wartender`, `eidechsen`, `geier`, `hund` vor dem Diner.
- `desert-springs-garage` (14 × 10): Werkbank, Reifenstapel mit Brett, `mira`, `tomas`.
- `desert-springs-antiquariat` (14 × 10): Bücherregale, Kisten mit Briefen, `okoro`; `kundin`.
- Nicht in `orte.json`, daher nicht gezeichnet: Miras Dosenpokal (Garage), Nachlass des
  Brückenbauers als Auslöser (Antiquariat). Desert Springs hat keinen Übergang nach Akt 4; die
  rechte Straßenseite ist deshalb geschlossen.

Checkliste 6 für alle 17 Karten: Größe und Rand [x] (Kartentest), Belebung [x] (außen je mindestens
zwei Statisten und Tiere, Silicon Bay nur Maschinen), Figuren an ihren Orten [x]; Geräusch, Musik,
Tönung, Matten und Questspuren offen wie bisher (Grafik oder `orte.json`).

```text
weg-delacroix-desert-canyonpfad.json
############################
############################
############################
############################
############################
############################
#                sK        #
#            L             #
#   t                      #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#                          #
#       #####         f    #
#       #####              #
############################
############################
############################
############################
############################
############################

weg-delacroix-desert-felsbogen.json
############################
############################
############################
############################
############################
#         ##TTTT##         #
#         ##TaTT##         #
#         ##TTTT##         #
#                    H     #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#                          #
#     KfKK                 #
############################
############################
############################
############################
############################
############################
############################

desert-springs-aussen.json
################################
#                              #
# ###########      #######     #
# ##F###F########  ##F#F##     #
# ###############  #######     #
# ###############  #######     #
# ############g##  #######     #
#  D  m                        #
#                L             #
#                              #
cTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#
#sTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#
#                              #
#             L             L  #
#        b                     #
#  ####a####        KK  KK     #
#  #F#######        KK         #
#  #########          B        #
#  #########          K        #
#  #########                   #
#                              #
#                              #
#                              #
################################

desert-springs-garage.json
##############
#KKKKK     L #
#            #
#            #
#   M   TKK  #
#   B    KK  #
#            #
#            #
#      s     #
#######g######

desert-springs-antiquariat.json
####F#####F###
#            #
#K   O      K#
#K  KKK     K#
#K          K#
#K          K#
#K      KKK K#
#            #
#      s     #
#######a######
```

Zweig: `abenteuer-aufgabenzuordnung`. Die Tabelle aus `mittel-1.md` fehlt auch diesmal; Objekte,
Kartenzuordnung (`karte`) und Ziele stammen aus `orte.json`. Figuren ohne `karte` sind nach Sinn
verteilt (unten je Karte). Die 25 Karten sind mit einem Baukasten-Skript erzeugt (Straße in der
Mitte, Ortsübergänge links/rechts/oben/unten am Rand, Häuser mit Türen oben und unten an der
Straße, Gegenstände als Kisten am Straßenrand, Figuren am Gehweg, Innenräume mit Ausgang unten),
dazu je Karte Landschaftsbausteine (Felsen, Gebäude, Wasser). Das Skript prüft Erreichbarkeit
und freie Laufwege; danach prüft der Kartentest. Skizzen am Ende.

**Teil 1: Weg 7 und Summit City (6 Karten) und `highway` in Desert Springs, gepusht.** 500 Tests
bestanden, die sechs Karten nicht mehr übersprungen.

- `weg-desert-summit-diner`: Diner, parkende Lkw, `tafel`, `fundNeonK`, `earl`; `trucker`,
  `kellnerin`, `kojote` (abend), `eidechse`.
- `weg-desert-summit-bergstrasse`: Serpentine zwischen Felsen, `abzweigHochebene` oben; `radler`,
  `ziegen`, `adler`.
- `summit-city-aussen`: Hütte, Bergladen, Talstation (`seilbahnTal`), `drachenbrunnen`, `kit`,
  `victor`, Bergsee unten; `wanderer`, `seilbahnwaerter`, `holzhacker`, `murmeltier`, `ziegen`,
  `adler`.
- `summit-city-huette`: Kamin, `pokal`, `kaminfeuer`, `ward`; `gast` (abend).
- `summit-city-bergstation`: `fundMurmeltierpfeife`, `haraldsen`; `skifahrerin`.
- `summit-city-bergladen`: `theke`, `sol`; `kunde`.
- `desert-springs-aussen`: `highway` rechts am Straßenrand (Kachel 31/10), Rand dort offen.
