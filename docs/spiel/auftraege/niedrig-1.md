# Auftrag: Runde 3 der zehn Karten (Rückmeldungen des Autors einarbeiten)

**Stand:** fertig (niedrig-1, 09.11.2026)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen, Stand b957d636);
privates Repository auf `origin/main` holen (Stand d7dc36de), nur lesen, nicht pushen
**Darf ändern:** deine Szenen in `inhalte/abenteuer/szenen/`, die zugehörigen Karten, `inhalte/abenteuer/moebel.json`
(neue Einträge mit Vorsilbe `cc3`; Angaben `art`, `blick`, `zustand`, `stil` an allen Einträgen, die deine
Szenen benutzen), deine Auftragsdatei
**Prüfung vor dem Push:** `kartenbau` und `kartenbild` ohne Befunde (oder begründet), `python -m pytest
pipeline/tests -q`, in `app/` Prettier, Build mit verlinktem privaten Repository, `npx playwright test
tests/e2e/abenteuer`; vorher erneut hereinholen (der andere Helfer arbeitet parallel an moebel.json)

## Ziel

Der Autor hat alle zehn Karten mit „bitte nochmal ansehen“ bewertet. Der Kartenbauer hat neue Regeln
(Drehung, Beziehungen, Zustand, Stil, Abstand zu Figuren, Treppenantritt, Bauteilerkennung; Gras mit
Abwechslung, Wege und Wasser mit Rändern). Lies `inhalte/abenteuer/szenen/README.md` neu: Dort stehen
alle Hinweise des Autors als Regeln. Baue deine Karten neu (die Beschreibung darf bleiben, wo sie
trägt) und prüfe am Ende jede Notiz des Autors einzeln: Im Bericht je Notiz ein Satz, wie sie gelöst
ist. Lieber weniger, dafür stimmige Möbel als viele unpassende.

Deine Karten und die Notizen des Autors:

- **cedarCreek.aussen:** Was ist dieser Mast oben rechts, diese Anzeigentafel? Da steht sale, aber was wird verkauft und passt das Geschichtlich an diesen Ort? Sieht eher aus wie eine Anzeigetafel, die an eine Autobahn gehört, oder so.
- **cedarCreek.bibliothek:** - Die Bretter liegen hier auf einer Bühne, nicht auf einen Tisch.
  - Der Globus steht auf dem Boden
  - Das Regal links scheint eher in einen Supermarkt zu gehören und ist abgeschnitten.
  - Oben Rechts ist der Tresen abgeschnitten.
- **cedarCreek.archiv:** - Wieder viel zerstörtes Möbiliar, zufällige Anordnung der Möbel
  - Die strukturen links an der Wand scheinen nicht sinnvolles zu ergeben.
  - Was hängt da oben in der Mitte von der Decke? Ist das etwas zum runterziehen, ein Rollo?
  - Was sollen die drei großen Objekte vor der oberen Wand sein?
- **cedarCreek.waschsalon:** Ziemlich gut,
  - Nur einige Möbel stehen falsch orientiert,
  - Der Tisch und der Stuhl machen für einen waschsalon vom Stil her wenig sinn.
  - das NotizBrett an der Wand oben wird verdeckt von einer Waschmaschine.
- **wegMapleCedar.landstrasse:** - Der Zaun geht an der einen Ecke nicht richtig ineinander über
  - Die Pflanzen oben rechts sind nicht als solche erkennbar. Sie sehen aus wie wie grüne Säulen
  - Das Feld ist etwas klein für ein richtiges Feld eiens Bauern, das man mit einem Traktor bearbeitet, oder?
  - Das Gras ist wieder sehr regelmäßig.
  - Der Weg hat keine Textur.

Allgemein vom Autor: Möbel stehen in logischer Beziehung (Stühle am Tisch zum Tisch gewandt; Fernseher
an der Wand mit Sitzplätzen davor; Pflanzen und Lampen nicht allein mitten im Raum); Schubladen und
Türen zeigen in den Raum; Zustand und Stil einheitlich; draußen Bäume gepflanzt statt zufällig,
Laternen an der Straße, Bushaltestelle zur Straße, Gras nicht zu regelmäßig, Wege mit Textur;
Häuser draußen passen zu den Räumen drinnen; keine Industriebauten neben der Villa.

## Bericht

Zweig: `abenteuer-aufgabenzuordnung` (Hauptstand cc57941b und neuer hereingeholt). Alle fünf Szenen
neu gebaut, `kartenbau` und `kartenbild` ohne Befunde. Neue Möbel `cc3…` (Zeitungsregal mit Glastür,
zwei Ordnerregale, grüner Schreibtisch, Stuhl von hinten, Anschlagtafel, Rätseltafel mit Dach, drei
natürliche Büsche, zwei Zaun-Endpfosten, Kiesel); jedes Bild vorher angesehen. `art`, `blick`,
`zustand`, `stil` an allen benutzten Einträgen ergänzt, wo sie fehlten (keine Werte von mittel-1
überschrieben). Korn und Mais sind `feldfrucht` und begehbar (der Mais hatte sonst das Feld in
Kammern geteilt und das Versteck unerreichbar gemacht). Archiv und Ortskern erlauben den Zustand
„alt“ (Bibliothek von 1890, altes Foto).

Antworten auf die Notizen des Autors:

- **Cedar Creek draußen, Anzeigetafel:** Die Autobahn-Werbetafel ist ersetzt durch die hölzerne
  Anschlagtafel des Ortes mit Zetteln; das Perfect-Move-Plakat klebt darauf (Auslöser `plakat` davor).
- **Bibliothek, Bretter auf der Bühne:** Die beiden Schachbretter liegen jetzt auf zwei runden
  Lesetischen, an jedem zwei Stühle einander gegenüber, mit `zu` zum Tisch geprüft.
- **Bibliothek, Globus am Boden:** Der Globus steht auf einer niedrigen Kommode in der rechten Ecke.
- **Bibliothek, Supermarktregal links, abgeschnitten:** ersetzt durch ein ganzes Bücherregal mit
  Glastür als Zeitungsregal an der Nordwand.
- **Bibliothek, Tresen abgeschnitten:** Das Eckstück ist weg; Mrs. Okafor hat einen ganzen grünen
  Schreibtisch mit Buch und Lampe.
- **Archiv, zerstörtes Mobiliar, zufällige Anordnung:** Kartonstapel, Kistenhaufen und Schränke sind
  entfernt; jetzt zwei saubere Reihen geschlossener Archivkartons und der offene Karton 1850–1859.
- **Archiv, Strukturen links an der Wand:** Die grauen Blöcke (Aktenschränke) sind entfernt.
- **Archiv, Ding von der Decke:** Die Hängelampe ist entfernt; Licht kommt von einer Stehlampe in der
  Ecke.
- **Archiv, drei große Objekte an der Nordwand:** Die leeren Leiterregale sind durch drei volle
  Ordnerregale ersetzt; dazu ein Schreibtisch mit Stuhl, auf dem das Programmheft liegt.
- **Waschsalon, falsch orientierte Möbel:** Die seitlich an der Westwand stehenden Trockner sind weg;
  alle Maschinen stehen an der Nordwand mit der Tür zum Raum, die Wartesitze schauen in den Raum.
- **Waschsalon, Tisch und Stuhl passen nicht:** ersetzt durch eine lange Arbeitsplatte zum
  Zusammenlegen, an der Mr. Boateng steht.
- **Waschsalon, Pinnwand verdeckt:** Die Pinnwand hängt jetzt frei zwischen Trockner und Automat.
- **Landstraße, Zaunecke:** Keine Ecken mehr; die Zäune sind gerade Linien vom Kartenrand bis zum
  Gatter (mit Endpfosten), die Weide hat einen Zaun mit Endpfosten an beiden Enden.
- **Landstraße, grüne Säulen:** ersetzt durch drei runde, natürliche Büsche aus „Garden“.
- **Landstraße, Feld zu klein:** Das Feld ist jetzt 23 × 7 Kacheln, der Traktor steht darin.
- **Landstraße, Gras zu regelmäßig:** Der neue Kartenbauer zeichnet Gras mit Abwechslung.
- **Landstraße, Weg ohne Textur:** Der Weg hat Ränder und verstreute Kiesel; ein eigener Kiesboden
  wäre ein neuer Boden in `materialien.json`, dafür frage ich lieber nach.

Prüfungen: 624 Pipeline-Tests, Prettier, Paketbau, `npm run build`, Oberflächentests Abenteuer
(9 von 9) bestanden. Hintergründe nur lokal im privaten Klon (nicht gepusht).

(vom Helfer auszufüllen)

## Bericht des letzten Auftrags, zur Nachlese

Zweig: `abenteuer-aufgabenzuordnung` (Hauptstand ce11ffd9 und neuer hereingeholt, mein alter
Häuser-Zwischenstand von Cedar Creek draußen auf den Hauptstand zurückgesetzt). Vier Szenen in
`inhalte/abenteuer/szenen/`, Karten vom Kartenbauer geschrieben, Vorschau mit `kartenbild`
gezeichnet und angesehen. Jedes neue Möbelbild habe ich vorher als Kontaktbogen selbst angesehen
(die Registernamen stimmen oft nicht). Neue Möbel mit Vorsilbe `cc` (Regale, Tresen, Lesetisch aus
zwei Endstücken, Stühle mit Blickrichtung, eigenes Schachbrett mit Figuren, grüne Leselampe,
Zeitungsständer, Globus, Pinnwand, Stehlampe, Kistenstapel, Holzregal, Hängelampe, Bild,
Aktenkiste, Waschmaschine mit Korb, Holzzaun, Zaunpfosten, Korn, Mais).

- **Bibliothek** (18 × 14, dunkle Dielen, hellgraue Wände), 2 Runden: drei Bücherregale an der
  Nordwand, Fenster, Pinnwand „Bitte flüstern“ (Auslöser davor), viertes Regal, Kellertür (Auslöser
  `kellertreppe` davor); Zeitungsständer an der Westwand; langer Lesetisch mit zwei Schachbrettern
  und Stühlen an beiden Enden (Dex und Mae); Tresen mit grüner Lampe, dahinter Mrs. Okafor; runder
  Lesetisch mit zwei Stühlen und Lampe; Globus, Stehlampe, Pflanzen. Runde 2: Tisch-Mittelstück
  entfernt (saß versetzt). Offen: Das rechte Tischende hat im Bild eine kleine Stufe.
- **Archiv** (14 × 11, Steinboden, Backstein), 2 Runden: Kellertür mit Auslöser davor, Boxerfoto
  an der Wand, Hängelampe, drei Holzregale mit Aktenkisten (Programmheft auf dem rechten), zwei
  Reihen Kartonstapel, der offene Karton 1850–1859, Aktenschränke, Kistenstapel, Wasserfleck vorn.
  Runde 2: Regale gefüllt, mehr Kartons. Offen: Die Aktenschränke wirken als schlichte graue Blöcke.
- **Waschsalon** (14 × 11, weiße Fliesen), 2 Runden: vier Waschmaschinen (eine mit Wäschekorb),
  Pinnwand mit dem Zettel „Verloren: ein Turm“, Fenster, Getränkeautomat in der Ecke, zwei Trockner
  an der Westwand, runder Falttisch mit Stuhl und Mr. Boateng, Wartesitze mit dem Comicheft,
  Pflanze. Runde 2: Fenster neben den Wäschekorb gerückt. Offen: Das Steckschachbrett am Trockner
  gibt es nicht als Bild.
- **Landstraße** (32 × 20, Gras, Feldweg), 1 Runde: Feldweg von links nach rechts, Rätseltafel am
  Ortsausgang, Apfelbaum, Kornfeld mit Mais, Vogelscheuche und Traktor hinter einem Zaun mit
  Gatter, Buschgruppe mit dem Formular (nur von oben erreichbar), Kuhweide mit Zaun, Bank mit Nia,
  Heuhaufen, Ahorn, Laubbaum, Felsen, Wegweiser nach Cedar Creek. Der Traktor heißt im Register
  „Left Side“ (Blickrichtung), ist aber ganz; deshalb `bauteil_ok`.

Prüfungen: 624 Pipeline-Tests, Prettier, Paketbau mit verlinktem privaten Repository,
`npm run build`, Oberflächentests Abenteuer (Chromium, 9 von 9) bestanden; im Spiel zeigen
Bibliothek und Landstraße die neuen Hintergründe.

Hinweis: Die Hintergründe liegen nur in meinem Klon unter
`schach-abenteuer-inhalte/spiel/grafik/karten/` (nicht gepusht, das private Repository ist für mich
nur zum Lesen vorgesehen); mit `python -m pipeline.abenteuer.kartenbild …` aus den Szenen neu
zeichnen.

(vom Helfer auszufüllen)

## Bericht des letzten Auftrags, zur Nachlese

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
