# Auftrag niedrig-1: Karten für den Weg Cedar Creek → Riverton und für Riverton

**Stand:** fertig (niedrig-1, 08.11.2026)
**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/karten/weg-cedar-riverton-1.json`, `-2.json`,
`riverton-*.json` (fünf Dateien, neu), `inhalte/abenteuer/karten/cedar-creek-aussen.json` (nur
das Objekt `zedernwald` als Übergang am Rand, Rand dort offen), `docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q` (für die neuen
Karten darf nichts mehr übersprungen werden), in `app/` Prettier und Paketbau

## Ziel

Die sieben Karten aus `orte.json` (Orte `wegCedarRiverton` und `riverton`) zeichnen, mit allen
Objekten, die `orte.json` dort als Auslöser und Figuren nennt, belebt nach `09_Weltbeschreibung.md`
(Abschnitte 3, 4, 4a, 5.4, Checkliste 6) und passend zur Story-Bibel Akt 2 (Szenen in Riverton).

## Vorgaben

1. **Objekte:** jeder Auslöser und jede Figur des Ortes auf der Karte, auf die sie gehören
   (Auslöser mit `karte` nur dort; sonst nach Sinn: Türen außen und innen jeweils ihr Gegenstück).
   Namen genau wie in `orte.json`, `start` mit `richtung` je Karte.
2. **Größen:** Außen 32 × 24 (Riverton ist größer als Cedar Creek: Park mit Pavillon, Brücke,
   Bahnhof, Kanal), Wegkarten 28 × 20, Innen nach 09 (Pavillon offen und regnerisch, Bahnhofshalle
   groß, Wohnwagen eng, Schuppen klein mit Fahrrad).
3. **Belebung:** Statisten und Tiere nach 4a (Riverton: Pendler mit Schirmen, Straßenmusiker,
   Parkschachspieler, Tauben, Möwen; Weg: Bahndamm und Zedernwald nach Bibel).
4. **Cedar Creek:** Übergang `zedernwald` am Rand der Außenkarte (der Weg nach Riverton beginnt dort).

## Was nicht dazugehört

Ironwood und der Weg dorthin, `orte.json`, Grafik.

## Bericht

(vom Helfer auszufüllen)

Zweig: `abenteuer-aufgabenzuordnung`. Sieben Karten neu, `cedar-creek-aussen.json` um `zedernwald`
ergänzt (Kachel 0/9, linker Rand an der Straße offen). Prüfungen: 340 Pipeline-Tests bestanden;
die 35 übersprungenen betreffen nur Ironwood und den Weg dorthin (nicht Teil des Auftrags), für
die neuen Karten wird nichts übersprungen. Prettier und Paketbau sauber.

Zuordnung der Objekte aus `orte.json` (keine Angabe `karte` dort, also nach Sinn):

- `weg-cedar-riverton-1` Zedernwald (28 × 20): `start`, `zurueckCedar` (links), `tafel`,
  `fundPfeilspitze` (auf einer Lichtung im Wald, nur von unten), `fundHolzspringer` (Baumstumpf),
  Figur `fenwick`, `weiterBahndamm` (rechts); Belebung: `reh` (morgen), `specht`, `pilzsammlerin`.
- `weg-cedar-riverton-2` Bahndamm (28 × 20): Gleis auf dem Damm oben, Signale; `start`,
  `zurueckZedernwald`, `fundFahrkarte` (Kiste), Figur `schaffner`, `weiterRiverton`; Belebung:
  `streckenwaerter` (morgen), `kuehe`, `hase`.
- `riverton-aussen` (32 × 24): Fluss quer mit Brücke, Norden Bahnhof und Handyladen, Süden Park
  mit Pavillon, Bildschirmtische auf der Wiese, Werkstatt mit Schuppen, Wohnwagen am Fluss;
  `start` und `bahnhof` nebeneinander vor dem Bahnhof, `zugCedar` daneben; `bahndamm` links,
  `kanalweg` rechts am Rand; Türen `bahnhofTuer`, `pavillonEingang`, `wohnwagenTuer`,
  `schuppenTuer`; `bildschirmtische`, `handyladen`, `fundLaeufer`, `fundTaubenfeder`; Figuren
  `albescu`, `nova`, `victor` (bei den Bildschirmtischen); Belebung: `pendler` (Schirm, morgen),
  `strassenmusiker` (unter der Brücke), `parkschachspieler`, `zeitungsjunge`, `tauben`, `moewen`,
  `ratten`.
- `riverton-pavillon` (16 × 12, offen: Fenster ringsum, acht Marmorbretter): `pavillonAusgang`,
  `gedenktafel`, `limonadenglas`, Figuren `slick` (am Brett), `tamsin`, `ray`; `zuschauer`,
  `wettender`.
- `riverton-bahnhofshalle` (20 × 14, groß): `bahnhofAusgang`, `grosseUhr` (Wand oben),
  `zeitungsstand`, `fundZeitungsausschnitt`, Figuren `pops` (am Stand), `harlan` (an seiner Bank);
  `reisende`, `taube`.
- `riverton-wohnwagen` (12 × 10, eng): `wohnwagenAusgang`, `dosentrophaeen`.
- `riverton-schuppen` (12 × 10, klein): `schuppenAusgang`, `fahrrad`; `maus`.

Offen / Vorschläge (gesperrt oder Grafik): Die Uhr mit Klebeband im Pavillon und Fahrplantafel,
Fundbüro-Schild in der Halle (Abschnitt 5.4) stehen nicht in `orte.json`, deshalb nicht gezeichnet.
Bushaltestelle in Riverton nur als Lampe (kein Auslöser in `orte.json`). Regenpfützen, Fluss als
Wasser, Banner von Perfect Move: Grafik. Checkliste 6: Rand und Größe [x], belebt [x] (außen je
mindestens zwei Tiere und Statisten), drei Dinge zum Ansehen im Pavillon und in der Halle nur so
weit `orte.json` sie nennt, Geräusch/Musik/Tönung/Matten/Questspuren offen wie zuvor.

```text
weg-cedar-riverton-1.json
############################
#        KKKKK         KKK #
# KKKKK  KKKKK         KKK #
# KKKKK  KKKKKf KKKKK  KKK #
# KKKKK  KKKKK  KKKKK  KKK #
# KKKKK  KKKKK  KKKKK  KKK #
# KKKKK         KKKKK  KKK #
#                          #
#    t           F         #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#         f                #
#                  KKKKKK  #
#  KKKKKK   KKKK   KKKKKK  #
#  KKKKKK   KKKK   KKKKKK  #
#  KKKKKK   KKKK   KKKKKK  #
#  KKKKKK   KKKK   KKKKKK  #
#  KKKKKK   KKKK           #
#           KKKK           #
############################

weg-cedar-riverton-2.json
############################
#                          #
#                          #
#                          #
############################
############################
#                          #
#       L           L      #
#                    S     #
zsTTTTTTTTTTTTTTTTTTTTTTTTTw
#TTTTTTTTTTTTTTTTTTTTTTTTTT#
#                          #
#                          #
#     f       KKKK         #
#             KKKK         #
#                          #
#                          #
#                          #
#                          #
############################

riverton-aussen.json
################################
#                              #
#  ##########       ######     #
#  ##F####F##       ##F###     #
#  ##########       ######     #
#  ##########       ######     #
#  ####b#####       ##h###     #
#      bsz    L                #
bTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#
#TTTTTTTTTTTTTTTTTTTNTTTTTTTTTT#
#                              #
###############TT###############
###############TT###############
#              TT         #### #
#              TT         #w## #
#  f           TT              #
#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTk
#           A                  #
#   ###p####        ##### #s## #
#   ######## BBbBB  ##### #### #
#   ######## V      ##### #### #
#   ########        #####      #
#                 f            #
################################

riverton-pavillon.json
##F##F####F##F##
#      g       #
#              #
F  BS B  B  B  F
#              #
#              #
#  B  BR BT B  #
F              F
#              #
#            l #
#       s      #
########p#######

riverton-bahnhofshalle.json
####F#####g####F####
#                  #
#                  #
# KKKK             #
# KKKz        KKK  #
#  P           H   #
#                  #
#       KKKK       #
#                  #
#                  #
#                f #
#                  #
#         s        #
##########b#########

riverton-wohnwagen.json
###F####F###
#KKKK     K#
#KKKK     d#
#          #
#          #
#      KKK #
#          #
#          #
#     s    #
######w#####

riverton-schuppen.json
######F#####
#KKK       #
#KKK       #
#KKK       #
#       f  #
#          #
#        KK#
#        KK#
#    s     #
#####s######
```
