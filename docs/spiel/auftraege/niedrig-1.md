# Auftrag niedrig-1: Maple Falls mit echten Möbeln einrichten (erste spielbare Demo)

**Stand:** offen (Haupt-Chat, 09.11.2026, fünfzehnter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen, Stand 90d3448b)
**Darf ändern:** `inhalte/abenteuer/karten/maple-falls-*.json`, `inhalte/abenteuer/moebel.json`,
`docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q`, in `app/` Prettier und Paketbau

## Ziel

Die Karten haben jetzt echte Böden und Wände aus der gekauften Grafik. Möbel und Schmuck kommen als
Objekte vom Typ `moebel` dazu (Regeln in `inhalte/abenteuer/README.md`, Abschnitt Tiled-Karten;
Beispiel im Park: `parkbank`, `laterne`). Richte die fünf Karten von Maple Falls ein (Dachboden,
Wohnzimmer, Clubraum, draußen, Park), damit der Autor eine erste schöne Demo spielen kann.

## Grafik finden

Die Bilder liegen im **privaten** Repository `dobili/schach-abenteuer-inhalte`. Hänge es mit dem
Werkzeug add_repo an deine Sitzung (lesen genügt) und klone es nach `/home/user/schach-abenteuer-inhalte`.
Dort steht `register/register.csv` (Pfad, Paket, Thema, Name oder Beschreibung, Breite, Höhe,
Verwendung); suchen etwa mit `grep -i "sofa\|couch" register/register.csv`. Übersichtsbilder mit
Nummern: `register/uebersicht/`. Gelingt das Anhängen nicht, melde es sofort und warte.
Nichts aus dem privaten Repository ins öffentliche kopieren; in `moebel.json` stehen nur Pfade.

## Vorgaben

1. Je Möbel ein Eintrag in `moebel.json` (sprechender Schlüssel wie `sofaRot`, `buecherregal1`)
   mit `quelle` (Pfad aus dem Register), `breite`, `hoehe` (aus dem Register) und `kollision`.
   Dasselbe Möbel darf auf mehreren Karten stehen.
2. Dachboden: Kisten, altes Regal, Lampe, das Reisebrett von Ambrose (bleibt Auslöser). Wohnzimmer:
   Sofa, Tisch, Küchenzeile, Pflanzen. Clubraum: Tische mit Stühlen, Regale, Pokalvitrine (Auslöser
   bleibt). Draußen: Häuser, Bäume, Zäune, Bushaltestelle, Laternen. Park: Bäume, Bänke, Blumen,
   Halfpipe (falls es eine gibt; sonst Rampe aus Holzteilen).
3. Platzhalterkacheln „Kiste“, „Lampe“, „Brett“ (Kacheln 3, 7, 5) dort durch Boden ersetzen, wo
   jetzt ein Möbel steht. Kollision muss danach stimmen: Wege bleiben frei, jeder Auslöser und jede
   Figur erreichbar (die Tests prüfen das).
4. Mit dem Paketbau (in `app/`: `node skripte/baue-abenteuerpaket.mjs`) und, wenn du das private
   Repository als `app/inhalte-privat/quelle` verlinkst (`ln -s /home/user/schach-abenteuer-inhalte
   app/inhalte-privat/quelle`), im Spiel ansehen; ein Bildschirmfoto je Karte im Bericht beschreiben.

## Bericht des letzten Auftrags, zur Nachlese

(vom Helfer auszufüllen)

## Bericht des letzten Auftrags, zur Nachlese

(vom Helfer auszufüllen)

## Bericht des letzten Auftrags, zur Nachlese

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

**Teil 2: Weg 8 und Crossroads (4 Karten, gepusht).** 520 Tests bestanden.

- `weg-summit-crossroads-geysirbecken`: Geysirkegel (Wand), `tafel`, `fundBisonhaar`, `bisons`
  (Herde als Gegenstand), `bell`; `rangerin`, `touristen`, `bison`, `rabe`.
- `weg-summit-crossroads-praerie`: Weizenfeld oben, Farmhaus, `sturmkeller`, `ray`; `sturmjaeger`,
  `bauer`, `praeriehund`, `falke`.
- `crossroads-aussen`: Kreuzung zweier Straßen, Raststätte (`raststaetteTuer`), Zapfsäulen,
  `wegweiser`, `nova`, `slick`, `mira`, `bigJoe` am Gehweg; `fernfahrer`, `reisende`, `tankwart`,
  `streuner` (folgt), `kraehe`.
- `crossroads-raststaette`: Theke, `variantenTisch`, `postkarten`, `darlene`, `rosie`; `kellnerin`.

**Teil 3: Weg 9 und Pinewood Camp (3 Karten, gepusht).** 535 Tests bestanden.

- `weg-crossroads-pinewood-huetten`: zwei Wanderhütten, Holzstapel, `tafel`; `wanderin`, `baer`
  (abend, weicht aus), `reh`.
- `weg-crossroads-pinewood-riesenbaeume`: Riesenbäume als Kistenblöcke, `rangerhaus`, `greta`;
  `ranger`, `eichhoernchen`, `specht`.
- `pinewood-camp-aussen`: vier Hütten, See unten links, Kanus, `lagerfeuer`, `kiosk`, `ezra`,
  `hollis`, `dex`, `mae`, `lou`, `tamsin`; `betreuer` (abend), `kanufahrer`, `campkinder`,
  `libellen`, `reh`, `froesche` (abend).

**Teil 4: Weg 10, Ghost Town und Erinnerung (5 Karten, gepusht).** 560 Tests bestanden.

- `weg-pinewood-ghost-canyonrand`: Canyonwand oben, Abgrund unten, `tafel`; `kletterer`, `geier`,
  `eidechse`.
- `weg-pinewood-ghost-staubstrasse`: Kakteen, Felsen, `juniper`; `staubteufel` (als Statist,
  wirbelt über die Straße), `klapperschlange`, `geier`.
- `ghost-town-aussen`: Saloon (`saloonTuer`), verlassene Häuser, Friedhof unten links mit `grab`,
  `sternenhimmel`, `victor`; `metallsucher`, `plakat` (flattert), `eule` (abend), `geier`.
- `ghost-town-saloon`: Theke, `fernpartieBrett`, `pruitt`, `abzeichen` als Übergang in der oberen
  Wand (geschlossen, von unten ansprechbar); `wind` (Schwingtür, abend).
- `erinnerung-siedlung-huette` (12 × 10): ohne Ausgang am Rand; `start` und `ankunft`
  nebeneinander, `rueckkehr` in der oberen Wand, `kerze`, `postreiter`; `pferd`.

**Teil 5: Weg 11 und Capital Arena (4 Karten, gepusht).** 580 Tests bestanden.

- `weg-ghost-capital-seeufer`: See unten, Bootshaus, `tafel`; `fischer` (morgen),
  `spaziergaenger` (abend), `moewen`, `enten`.
- `weg-ghost-capital-leuchtturm`: Felsen, Leuchtturm mit Lampe oben, See unten, `fundLinse`, `abe`;
  `faehrmann`, `moewe`, `seehund`.
- `capital-arena-aussen`: Arena (`halleTuer`), Vorplatz, `treppe`, `mama`, `juno`; nur ein
  Ortsübergang (`wegGhost` links), rechter Rand geschlossen; `zuschauer`, `reporter`, `eltern`,
  `tauben`, `hund`.
- `capital-arena-halle` (24 × 14): `turniertafel`, `pressetisch`, `fanshop`, Tribünen, neun
  Figuren in zwei Reihen (`turnierleiterin`, `lin`, `grahamHale`, `bea`, `marcus`, `nova`,
  `tobias`, `kade`, `victor`); `schiedsrichter`, `publikum`.

**Teil 6: Bayou, Hochebene und Port Delacroix (3 Karten neu, 2 geändert, gepusht).** 595 Tests
bestanden, 0 übersprungen. Damit sind alle 25 Karten von Akt 4 gezeichnet.

- `bayou-steg`: Wasser oben und unten, Steg, `nebel`, `theron`; `luftbootfahrer` (morgen),
  `alligator`, `reiher`. Nur ein Übergang (`zurueckDelacroix` links).
- `hochebene-felsentuerme` und `hochebene-schule`: neutral ohne Figuren und Statisten (Q21-1
  offen), nur Felstürme bzw. ein Gebäude und Tiere (`adler`, `eidechse`, `ziegen`).
- `port-delacroix-aussen`: `bayou` rechts am Straßenrand (Kachel 31/11, direkt unter
  `wuestenzug`), Rand dort offen. Der Statist `blaeser` heißt jetzt `trompeter`, damit er nicht
  mit der neuen Figur verwechselt wird.
- `port-delacroix-musikhaus`: Figur `blaeser` (Kachel 11/9).

Prettier meldet weiter `inhalte/abenteuer/runden.json` (nicht von mir); alle Karten sind sauber.

Checkliste 6 für alle 25 Karten: Größe und Rand [x] (Kartentest), Belebung [x], Figuren [x];
Geräusch, Musik, Tönung, Matten und Questspuren offen wie bisher. Die Karten sind schematisch
(Baukasten); wer später die Grafik tauscht, sollte die Anordnung je Ort nach 09 verfeinern.

```text
bayou-steg.json
############################
############################
############################
############################
############################
############################
#                          #
#                   KK     #
#    T                     #
zTTTTTTTTTTTTTTTTTTTTTTTTTT#
#sTTTTTTTTTTTTTTTTTTTTTTTTT#
#  n                       #
#         KKK              #
############################
############################
############################
############################
############################
############################
############################

hochebene-felsentuerme.json
############################
#         ###              #
#  ###    ###     ###  ### #
#  ###    ###     ###  ### #
#  ###    ###     ###  ### #
#  ###            ###      #
#  ###            ###      #
#                          #
#                          #
zTTTTTTTTTTTTTTTTTTTTTTTTTTw
#sTTTTTTTTTTTTTTTTTTTTTTTTT#
#                          #
#                          #
#   ###              ###   #
#   ###      ###     ###   #
#   ###      ###     ###   #
#   ###      ###     ###   #
#   ###      ###           #
#            ###           #
############################

hochebene-schule.json
############################
#                          #
#        ##########        #
#        ##F####F##        #
#        ##########        #
#        ##########        #
#        ##########        #
#                          #
#                          #
zTTTTTTTTTTTTTTTTTTTTTTTTTT#
#sTTTTTTTTTTTTTTTTTTTTTTTTT#
#                          #
#                          #
#    KKK            KKK    #
#    KKK            KKK    #
#    KKK            KKK    #
#                          #
#                          #
#                          #
############################
```

Zweig: `abenteuer-aufgabenzuordnung`. Beide Karten der Hochebene neu erzeugt (gleiche Größe und
Übergänge), Objekte nach der Tabelle in `mittel-2.md`. Prüfungen: 595 Tests bestanden, Prettier für
die Karten und Paketbau sauber.

- `hochebene-felsentuerme`: Felstürme wie bisher; `steintisch` (Brettkachel) auf einer flachen
  Stelle zwischen zwei Türmen, `kira` direkt daneben; Belebung `wanderer`, `adler`, `eidechse`.
- `hochebene-schule`: schlichte, moderne Siedlung: Schulgebäude mit `aushang` an der Wand (neben
  der Tür, von der Straße aus ansprechbar), Turnhalle mit Basketballkorb (Lampenkachel) und `annek`
  davor, Werkstatt unterhalb der Straße mit `werkstatt`, Schulbus (Kisten) daneben, `joss` zwischen
  Werkstatt und Straße; Belebung `schulkinder`, `lehrerin` (morgen), `hund`, `adler`.
- Keine Zeichen, Muster oder Deko aus realen Kulturen, nur Platzhalterkacheln.

```text
hochebene-felsentuerme.json
############################
#         ###              #
#  ###    ###     ###  ### #
#  ###    ###     ###  ### #
#  ###    ###     ###  ### #
#  ###            ###      #
#  ###          sK###      #
#                          #
#                          #
zTTTTTTTTTTTTTTTTTTTTTTTTTTw
#sTTTTTTTTTTTTTTTTTTTTTTTTT#
#                          #
#                          #
#   ###              ###   #
#   ###      ###     ###   #
#   ###      ###     ###   #
#   ###      ###     ###   #
#   ###      ###           #
#            ###           #
############################

hochebene-schule.json
############################
#                          #
#  #########   ########    #
#  ##F###F##   ###F####    #
#  #########   ########    #
#  #########   ########    #
#  ####a####   ########    #
#                       L  #
#                      A   #
zTTTTTTTTTTTTTTTTTTTTTTTTTT#
#sTTTTTTTTTTTTTTTTTTTTTTTTT#
#                          #
#                   J      #
#              ##w##       #
#              ##### KKK   #
#              ##### KKK   #
#              #####       #
#                          #
#                          #
############################
```

Zweig: `abenteuer-aufgabenzuordnung`. Fünf Figuren gesetzt (Typ `figur`, 16 × 16, begehbare Kachel,
kein Übergang und nicht davor; die Dialogdateien passen zu den vermuteten Karten):

- `maple-falls-aussen`: `juno` auf Kachel 14/7 (Gehweg zwischen Haus und Schule), `lily` auf 17/11
  (Gehweg unter der Straße, gut sichtbar).
- `maple-falls-park`: `abernathy` auf 11/8, direkt links neben der Parkbank.
- `pinewood-camp-aussen`: `lou` auf 4/14 und `tamsin` auf 5/14, nebeneinander am Lagerfeuer.

Ursache bei Pinewood: Mein Kartengenerator vom zwölften Auftrag hatte nur vier Plätze für Figuren
am Gehweg und hat die übrigen zwei stillschweigend weggelassen. Ich habe danach alle Orte gegen
`orte.json` geprüft: Außer diesen fünf Figuren fehlt auf keiner gezeichneten Karte eine Figur oder
ein Auslöser. Vorschlag für den Kartentest (für mich gesperrt): zusätzlich prüfen, dass jede Figur
und jeder Auslöser eines Ortes auf mindestens einer seiner Karten steht.

Prüfungen: 595 Tests bestanden, Prettier und Paketbau sauber. Im Spiel geprüft (Entwicklungsserver,
Chromium, Spielstand auf die Karte gesetzt): Alle fünf Figuren stehen im Bild neben dem Helden.
Bildschirmfotos liegen nur lokal beim Helfer, nicht im Repository.
