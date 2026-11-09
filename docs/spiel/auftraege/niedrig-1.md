# Auftrag niedrig-1: Port Delacroix, Fähre/Deich und Bayou einrichten

**Stand:** kein Auftrag (Haupt-Chat, 09.11.2026; der achtzehnte Auftrag, Port Delacroix, ist zusammengeführt, danke; Wasser kommt jetzt über den Kachelstil „kueste“. Bis der nächste Auftrag per Nachricht kommt, bitte nichts tun und warten.)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen, Stand c2751464)
**Darf ändern:** `inhalte/abenteuer/karten/port-delacroix-*.json`, `inhalte/abenteuer/karten/weg-silicon-delacroix-*.json`,
`inhalte/abenteuer/karten/bayou-*.json`, `inhalte/abenteuer/moebel.json` (nur neue Einträge, Vorsilbe `pd`),
`docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** wie beim letzten Auftrag; vorher `claude/friendly-shannon-y8bf90` erneut hereinholen
(mittel-1 richtet parallel Silicon Bay ein, Vorsilben `sb`, `ld`)

## Ziel

Port Delacroix (Hafenstadt im Süden, nach dem Sturm im Wiederaufbau): draußen (Hafen, Holzhäuser,
Baustellenteile aus „worksite“, Boote), Turnhalle (Notunterkunft: Feldbetten, Kisten), Werkstatt
(Werkbänke, Werkzeug), Musikhaus (Instrumente, Bühne; hier steht der Varianten-Tisch mit Schach960);
Fähre und Deich; Bayou mit Steg (Wasser, Steg, Schilf; Serene Village hat Teiche und Stege).

## Bericht

Zweig: `abenteuer-aufgabenzuordnung` (vor dem Push erneut hereingeholt, ohne Konflikt). Neu in
`moebel.json`, alle mit Vorsilbe `pd`: `pdFeldbett` (16 × 32), `pdKlavier` (32 × 48),
`pdSchlagzeug` (32 × 32), `pdGitarrenkoffer` (32 × 32), `pdBoot` (Ruderboot, 64 × 32), `pdEimer`
(16 × 16), `pdSeil` (16 × 16), `pdWerkzeugregal` (48 × 32). Wiederverwendet: `iwFass`,
`iwFassGross`, `laterne`, `kisteRot`. Kein Möbel verstellt Auslöser, Figuren oder Laufwege (ein
Leitkegel auf dem Platz des Reihers wurde wieder entfernt).

Bildschirmfotos (je ein Satz):

- **Fähre:** Fässer an Deck statt Lampen und Kistenstapel, ein Tau am Weg; der Schiffskoch frei
  erreichbar.
- **Deich:** Laterne am Deich, ein Eimer neben den Sandsäcken (die Säcke bleiben Kisten, im
  Register gibt es keine).
- **Port Delacroix draußen:** Ruderboot und Tau am Kai bei Mr. Batiste, Eimer an der Baustelle
  vor dem Musikhaus, Laterne vor der Turnhalle; die Zelte bleiben Kistenblöcke (keine Zelte als
  Einzelbild).
- **Turnhalle:** vier Feldbetten an den Wänden, eine Kiste mit Hilfsgütern, die Spieltische bleiben.
- **Werkstatt:** zwei Klaviere, Werkzeugregal mit Gießkannen und Pflanze; Werkbank bleibt Auslöser.
- **Musikhaus:** Klavier, Schlagzeug und ein Gitarrenkoffer, eine Kiste mit geretteten Sachen;
  der Bläser steht vor dem Schlagzeug.
- **Bayou:** ein Ruderboot am Steg.

Prüfungen: 624 Pipeline-Tests bestanden (3 Simulationen übersprungen), Prettier, Paketbau und
`npm run build` sauber, Oberflächentests Abenteuer (Chromium) 9 von 9 bestanden.

Befund für den Haupt-Chat: Auf Fähre, Deich und Bayou zeigen die Kachelsätze dort, wo Wasser sein
soll (Wandkacheln am Rand), Gras; Wasser, Schilf und Stege aus `SERENE_VILLAGE_REVAMPED` sind
Kachelsätze und brauchen einen Wasser-Stil im Kachelsatz, nicht Möbel. Den Varianten-Tisch im
Musikhaus gibt es in `orte.json` nicht als Auslöser; deshalb nicht gesetzt.

## Bericht des letzten Auftrags, zur Nachlese

Zweig: `abenteuer-aufgabenzuordnung`. Neu in `moebel.json` (nur Pfade, alle mit Vorsilbe `iw`):
`iwSpind` (Schließfach schwarz, 32 × 32), `iwVitrine` (Holz-Glas-Vitrine, 32 × 48), `iwBild`
(Gemälde mit Goldrahmen, 16 × 32), `iwFass` (16 × 16), `iwFassGross` (32 × 32), `iwStrommast`
(16 × 64), `iwPylon` (Leitkegel, 16 × 32), `iwHantel` (16 × 16). Wiederverwendet ohne Änderung:
`laterne`, `parkbank`, `muelltonne`, `busch`, `baum`, `fels`, `felsKlein`, `holztisch`,
`kuehlschrank`, `sofaRund`, `pflanzeKlein`, `wartebank`, `aktenschrank`, `pokal`. Eine Dusche
(„Dusche mit rotem Kreuz“) sah im Spiel wie ein Warnschild aus; an ihrer Stelle stehen graue
Schränke, der Eintrag ist wieder entfernt. Kein Möbel verstellt Auslöser, Figuren oder Laufwege
von Statisten und Tieren.

Bildschirmfotos (je ein Satz):

- **Kanalweg:** Strommast und Laterne am Kanal, Fässer und Leitkegel vor den Fabrikhallen, eine
  Bank am Weg; Dale steht frei auf dem Weg.
- **Brücke:** Laterne am Brückenkopf, Felsen, Büsche und ein Baum am Ufer, Fässer neben dem
  Zeitnot-Trick.
- **Ironwood draußen:** Kabeltrommeln als Fässer am Güterbahnhof (Gus davor), Strommast an der
  Straße, Leitkegel als Baustelle, Laterne, Mülltonne und Bank vor den Reihenhäusern.
- **Kantine:** zwei lange Tischreihen aus Holztischen, zwei Kühlschränke an der Küchenwand; Hank,
  Priya und Big Joe frei erreichbar, das Stahlbrett bleibt Auslöser.
- **Mamas Zimmer:** rundes Sofa und Pflanzen, ein kleiner Tisch neben Oma Ruth; Medaille und
  Partieformular bleiben Auslöser.
- **Umkleide:** schwarze Schließfächer an der Rückwand (das Schließfach mit dem Fund bleibt
  Auslöser), graue Schränke links, zwei Bänke in der Mitte, eine Hantel in der Ecke.
- **Museum:** zwei Glasvitrinen, kleine Pokale als Ausstellungsstücke, ein Gemälde, Pflanzen;
  Vitrine 1858 und Postsack bleiben Auslöser.

Prüfungen: 624 Pipeline-Tests bestanden (3 Simulationen übersprungen), Prettier, Paketbau und
`npm run build` sauber, Oberflächentests Abenteuer (Chromium) 9 von 9 bestanden.

Nicht gefunden im Register: Schornsteine und Fabrikhallen als Einzelbilder (die Hallen bleiben die
Wandblöcke der Kachelsätze), Duschen in brauchbarer Form, Statuen für drinnen.

## Bericht des letzten Auftrags, zur Nachlese

Zweig: `abenteuer-aufgabenzuordnung`. Privates Repository aktualisiert (df308d81), als
`app/inhalte-privat/quelle` verlinkt. Neu in `moebel.json` (nur Pfade): `busch` (16 × 32), `fels`,
`felsKlein` (16 × 16), `baumstumpf` (32 × 16), `wegweiser` (16 × 32), `leselampe` (16 × 32),
`kisteGrau` (16 × 32), `aktenschrank` (16 × 32, niedriger grauer Schrank), `waschmaschine`
(32 × 32), `waschmaschineHoch` (16 × 32), `wartebank` (32 × 32), `automatBunt` (32 × 48, angelegt,
noch nicht gesetzt). Wiederverwendet: `baum`, `baumRund`, `parkbank`, `laterne`,
`haltestellenschild`, `blumen`, `muelltonne`, `buecherregal`, `holztisch`, `pflanzeKlein`,
`stuhl`. Platzhalter unter Möbeln durch Boden ersetzt; Platzhalter mit Auslöser bleiben. Mein
Skript prüft zusätzlich, dass kein Möbel den Laufweg eines Statisten oder Tiers verstellt (keine
Treffer); Gänge bleiben mindestens eine Kachel breit.

Bildschirmfotos (Entwicklungsserver mit Grafik, Spielstand auf die Karte gesetzt):

- **Landstraße:** Der Kistenblock oben ist jetzt ein Busch, hinter dem das Formular nur von oben
  erreichbar bleibt; Bäume, Felsen, Baumstumpf und ein Wegweiser am Ortsausgang säumen die Straße.
- **Flussweg:** Bäume, Büsche, Felsen und ein Baumstumpf am Weg zum Bach; Bank und Münzkiste
  bleiben Auslöser.
- **Cedar Creek draußen:** Haltestellenschild und Bank an der Bushaltestelle, Laterne am Ufer,
  Mülltonne vor dem Waschsalon, Bäume und Büsche unten, Blumen am Weg zur Bibliothek.
- **Bibliothek:** Bücherregale oben links, Holztische als Lesetische, Leselampe in der Ecke, eine
  Pflanze; Dex und Mae sitzen an den Tischen.
- **Archiv:** zwei Reihen grauer Kisten mit Akten, niedrige Aktenschränke an der Wand und unten
  links; Karton 1858 und Programmheft bleiben Auslöser.
- **Waschsalon:** vier Waschmaschinen an der Rückwand, drei hohe Maschinen links, ein Stuhl neben
  Mr. Boateng, eine Wartebank vorn.

Prüfungen: 624 Pipeline-Tests bestanden (3 Simulationen übersprungen), Prettier und Paketbau
sauber, `npm run build` sauber, Oberflächentests des Abenteuers (Chromium, `tests/e2e/abenteuer*`)
9 von 9 bestanden.

Nicht umgesetzt: Teile aus `SERENE_VILLAGE_REVAMPED` und `modern-farm` (Teiche, Steg) brauchen
Kachelsätze statt Einzelbilder; die Einzelbilder aus `modern-exteriors` reichten für Felsen und
Bäume. Einen Getränkeautomaten (`automatBunt`) habe ich im Waschsalon nicht gestellt, weil der
Platz neben dem Auslöser `automat` an der Wand zu eng ist.

## Bericht des letzten Auftrags, zur Nachlese

Zweig: `abenteuer-aufgabenzuordnung`. Privates Repository angehängt (lesen) und nach
`/home/user/schach-abenteuer-inhalte` geklont, als `app/inhalte-privat/quelle` verlinkt (nicht im
Repository, steht in `.gitignore`). In `moebel.json` stehen nur Pfade aus dem Register.

Neue Möbel in `moebel.json` (Schlüssel: Register-Name, Breite × Höhe): `kisteRot`/`kisteBlau`
(Holzkisten 16 × 32), `regalAlt` (32 × 32), `stehlampe` (16 × 48), `truhe` (32 × 32),
`sofaRund` (32 × 32), `holztisch` (16 × 16), `stuhl` (16 × 32), `kuehlschrank` (16 × 32), `herd`
(32 × 32), `pflanzeGross` (32 × 48), `pflanzeKlein` (16 × 32), `buecherregal` (32 × 32),
`schreibtisch` (16 × 32), `tafel` (32 × 48), `pokal` (16 × 16), `baum`/`baumRund` (48 × 64),
`blumen` (16 × 16), `blumenbusch` (32 × 16), `muelltonne` (32 × 32), `briefkasten` (16 × 32),
`haltestellenschild` (16 × 48), `zaun` (16 × 16), `rampe` (64 × 32, Schuleingangsrampe als
Halfpipe-Ersatz; eine Halfpipe gibt es im Register nicht), `brunnen` (32 × 48). Alle mit
`kollision`. Platzhalterkacheln 3/5/7 unter jedem Möbel durch Boden ersetzt; Platzhalter, auf denen
ein Auslöser liegt (Kiste `kartonKueche`, Brett `brettOhneDame`, Bank `parkbank`, Lampe
`pokalvitrine` …), bleiben, weil ein Möbel keinen Auslöser zustellen darf.

Bildschirmfotos im Spiel (Entwicklungsserver mit verlinkter Grafik, Spielstand auf die Karte
gesetzt; Bilder nur lokal):

- **Wohnzimmer:** rundes Sofa links oben, Küchenzeile mit Herd und Kühlschrank rechts oben neben
  dem Umzugskarton, Holztisch auf dem Teppich, zwei Zimmerpflanzen, Holzkisten in den Ecken; Mama
  frei erreichbar. Die Stehlampe oben blieb Platzhalter (siehe unten).
- **Clubraum:** sechs Schachtische (Brettkacheln) mit je einem Holzstuhl, Tafel und Bücherregal an
  der Wand, Pokal neben der Pokalvitrine, Schreibtisch des Coachs, Pflanze rechts unten.
- **Draußen:** Bäume über und unter der Straße, Laternen, Mülltonne am Gehweg, blauer Briefkasten
  vor dem Haus, Blumen, ein Zaun vor dem Nachbarhaus, Haltestellenschild am Weg zum Park. Die
  Häuser bleiben die Wandblöcke der Kachelsätze; Haus-Grafiken aus dem Register (etwa „Country
  House“) würden die Türen neu ordnen und sind deshalb nicht gesetzt.
- **Park:** Rampe statt Kistenblock, Brunnen, Bäume, Blumenbusch, Laternen, Blumen neben der
  Bank; Skater Jo und Abernathy erreichbar.

Prüfungen: 624 Pipeline-Tests bestanden (3 übersprungen: Gesamtsimulation, nur mit
`ABENTEUER_SIMULATION=1`), Prettier und Paketbau sauber.

**Frage (Dachboden, nicht umgesetzt):** Zwei Tests lassen Möbel auf dem Dachboden bzw. an Wänden
nicht zu, und die Tests sind für mich gesperrt:

1. `test_ink_szene_und_tiled_karte_liegen_bereit` (`pipeline/tests/test_abenteuer.py`) verlangt,
   dass jedes Objekt der Dachbodenkarte ein Auslöser aus `orte.json` ist; Möbel fallen durch.
   Vorschlag: dort Objekte mit `type` `moebel`, `statist`, `tier` ausnehmen.
2. `test_alles_von_start_erreichbar` prüft auch Möbel und verlangt, dass ihre linke obere Kachel
   erreichbar ist; hohe Möbel an der Wand (Stehlampe, Kisten am oberen Rand) liegen mit der oberen
   Reihe auf der Wand und fallen durch. Vorschlag: Möbel dort ausnehmen (ihre Kollision zählt
   schon in `blockiert`). Deshalb blieb die Lampe im Wohnzimmer ein Platzhalter.

Für den Dachboden sind `kisteRot`, `kisteBlau`, `regalAlt`, `stehlampe` und `truhe` schon in
`moebel.json` angelegt; nach der Teständerung setze ich sie in wenigen Minuten.

**Nachtrag (nach bf3f7c8a, Tests nehmen Möbel aus):** Dachboden eingerichtet: Holzkisten
(`kisteRot`, `kisteBlau`) in den Ecken, altes Regal mit Leiter (`regalAlt`), Stehlampe am oberen
Rand, Truhe mit Büchern links neben dem Teppich; das Reisebrett von Ambrose bleibt Auslöser in der
Mitte, `hutschachtel`, `spiegel`, `zeitungen1961` unverändert. Im Wohnzimmer ist die Lampe jetzt
ebenfalls eine `stehlampe`. Bildschirmfoto Dachboden: alles erreichbar, der Held steht vor dem
Brett. 624 Tests bestanden, Paketbau sauber. Damit sind alle fünf Karten von Maple Falls
eingerichtet.

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
