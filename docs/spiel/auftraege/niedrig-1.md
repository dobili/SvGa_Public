# Auftrag niedrig-1: Tiled-Karten für Cedar Creek

**Stand:** fertig (niedrig-1, 08.11.2026)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-aufgabenzuordnung`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/karten/cedar-creek-*.json` (neu, vier Dateien),
`pipeline/tests/test_abenteuer_karten.py` (nur, wenn eine Regel für Cedar Creek fehlt; im Bericht
begründen), `docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q` (die Kartentests
dürfen für Cedar Creek nicht mehr übersprungen werden: „skipped“ muss 0 sein), `ruff check pipeline`,
dann in `app/`: `npx prettier --check ../inhalte/abenteuer` und `node skripte/baue-abenteuerpaket.mjs`

## Ziel

mittel-2 hat Cedar Creek als Spieldaten angelegt (`orte.json`, Ort `cedarCreek`): vier Karten,
sechs Figuren, Übergänge und Gegenstände. Die Tiled-Dateien dazu fehlen; dein Kartentest
überspringt sie deshalb („noch nicht gezeichnet“). Zeichne die vier Karten mit den
Platzhalterkacheln wie bei Maple Falls, damit der Haupt-Chat die Busfahrt und Cedar Creek spielen
kann.

## Vorgaben

1. **Dateien und Größen** (Kennung → Datei, laut `orte.json`): `cedarCreek.aussen` →
   `cedar-creek-aussen.json` (außen, etwa 28 × 20 wie der Park), `cedarCreek.bibliothek` →
   `cedar-creek-bibliothek.json` (innen, etwa 16 × 12), `cedarCreek.archiv` →
   `cedar-creek-archiv.json` (Keller, innen, etwa 14 × 10), `cedarCreek.waschsalon` →
   `cedar-creek-waschsalon.json` (innen, etwa 12 × 10). Aufbau wie `maple-falls-park.json`:
   Ebenen `boden`, `waende`, `objekte`, `ausloeser`, eingebetteter Kachelsatz `platzhalter` mit
   `../grafik/platzhalter.png`, Kollision an den Kacheln.
2. **Objekte je Karte** (Namen genau so, alle sind in `orte.json` erklärt):
   - aussen: `start` (Richtung unten; der Held kommt mit dem Bus an, der Start liegt an der
     Bushaltestelle), `bushaltestelle` (Startauslöser laut `orte.json`, also derselbe Platz wie
     `start`: zwei Objekte auf derselben Kachel oder nebeneinander), `busZurueck` (Dialog, ein
     Schild an der Haltestelle), `bibliothekTuer`, `waschsalonTuer` (Übergänge, in der Hauswand),
     `plakat`, `steg` (Gegenstände, Kollision, von einem freien Nachbarfeld aus ansprechbar),
     Figuren `rosa` und `victor` (`type = "figur"`).
   - bibliothek: `start` (an der Eingangstür), `bibliothekAusgang` (Übergang, unten),
     `kellertreppe` (Übergang zum Archiv), Figuren `okafor`, `dex`, `mae`.
   - archiv: `start` (an der Treppe), `kellerAusgang` (Übergang), `karton1858`, `programmheft`
     (Gegenstände).
   - waschsalon: `start` (an der Tür), `waschsalonAusgang` (Übergang), `trockner` (Gegenstand),
     Figur `boateng`.
     Übergänge liegen am Rand (die einzigen offenen Randfelder), alles ist von `start` aus zu Fuß
     erreichbar; dein Test prüft genau das.
3. **Aussehen:** Platzhalterkacheln wie bei Maple Falls (Boden, Wand, Kiste, Teppich, Lampe,
   Fenster, Wasser für den Fluss am Steg). Keine neue Grafik.
4. Kein Code in `app/`, keine Änderung an `orte.json` (fehlt dir dort etwas, in den Bericht).

## Was nicht dazugehört

Weitere Städte, Grafik, Änderungen an Maple Falls.

## Bericht

(vom Helfer auszufüllen)

Zweig: `abenteuer-aufgabenzuordnung`. Vier Karten neu: `cedar-creek-aussen.json` (28 × 20),
`cedar-creek-bibliothek.json` (16 × 12), `cedar-creek-archiv.json` (14 × 10),
`cedar-creek-waschsalon.json` (12 × 10), alle Objekte mit den Namen aus der Vorgabe. Prüfungen:
292 Pipeline-Tests bestanden, 0 übersprungen; ruff, Prettier und Paketbau sauber.

- Teständerung (erlaubt, weil eine Regel fehlte): `start` gilt im Test jetzt immer als erklärt.
  Cedar Creek hat in `orte.json` keinen Auslöser `start` (nur `bushaltestelle` mit Art `start`),
  das README nennt `start` aber als Standardeinstieg jeder Karte. Alternative: `start` in
  `orte.json` bei Cedar Creek eintragen, dann kann die Ausnahme im Test wieder weg.
- Wasser: Der Platzhalter-Kachelsatz hat keine Wasserkachel (1–8). Der Bach rechts auf der
  Außenkarte ist deshalb aus Wandkacheln (2), der Steg eine Kiste (3) am Ufer. Beim Tausch der
  Grafik braucht es eine Wasserkachel mit Kollision.
- `bushaltestelle` und `start` liegen auf derselben Kachel, das Schild `busZurueck` direkt darüber
  (betretbar, also ein Auslöser zum Draufgehen; soll es Kollision haben, dort eine Lampe setzen).
- Die Türen auf der Außenkarte liegen in den Hauswänden, nicht am Kartenrand; innen liegen alle
  Übergänge am Rand.

Skizzen (Legende wie beim zweiten Auftrag; `#` Wand, im Bach rechts Wasser, `T` Weg, `K` Kiste,
`L` Lampe, `F` Fenster; Kleinbuchstaben Auslöser mit Anfangsbuchstaben, bei `start` und
`bushaltestelle` sichtbar nur einer; Großbuchstaben Figuren: `V` victor, `R` rosa, `O` okafor,
`D` dex, `M` mae, `B` boateng; im Waschsalon `t` = trockner):

```text
cedar-creek-aussen.json
############################
#                      #####
#         #########    #####
#         ##F###F##    #####
#         #########    #####
#         #########    #####
#         ####b####    #####
#  b      p   T        #####
#  b          T     V  #####
#TTTTTTTTTTTTTTTTTTTTTT#####
#TTTTTTTTTTTTTTTTTTTTTT#####
#     T               s#####
#     T         R  L   #####
#  ###w###             #####
#  #F###F#             #####
#  #######             #####
#  #######             #####
#  #######             #####
#                      #####
############################

cedar-creek-bibliothek.json
####F######F####
#          O  L#
# KKKKK   KKK  #
# KKKKK        #
#              #
#              k
#  KKD         #
#              #
#  KK    KKM   #
#              #
#       s      #
########b#######

cedar-creek-archiv.json
##k###########
# s         L#
#          p #
#    KKKKK   #
#            #
#            #
#    KKkKK   #
#            #
#KK          #
##############

cedar-creek-waschsalon.json
###F####F###
# KKKKKKKK #
#          #
#K         #
#K    KKB  #
#t         #
#K         #
#         L#
#     s    #
######w#####
```
