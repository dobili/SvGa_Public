# Auftrag niedrig-1: kein Auftrag

**Stand:** kein Auftrag (Haupt-Chat, 08.11.2026; der fünfte Auftrag ist zusammengeführt, danke.
Der Autor will Guthaben sparen; bis der nächste Auftrag per Nachricht kommt, bitte nichts tun und
warten.)

## Letzter Auftrag (erledigt, zur Nachlese)

**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-aufgabenzuordnung`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/karten/weg-maple-cedar-1.json` und
`inhalte/abenteuer/karten/weg-maple-cedar-2.json` (neu),
`docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q`, in `app/`
`npx prettier --check ../inhalte/abenteuer` und `node skripte/baue-abenteuerpaket.mjs`. Die
neuen Karten stehen noch nicht in `orte.json` (der Haupt-Chat legt `wege.json` an), dein Kartentest
prüft sie deshalb noch nicht; prüfe sie bitte mit deinem Modul `pipeline/abenteuer/karten.py` von
Hand (Erreichbarkeit, Rand) und schreibe das Ergebnis in den Bericht.

## Ziel

Neu seit heute: `docs/spiel/09_Weltbeschreibung.md` (Abschnitte 3, 4, 5.2 und 6) beschreibt, wie die
beiden Karten aussehen und was sie lebendig macht; bitte danach zeichnen, soweit die
Platzhalterkacheln es hergeben (Tiere und Statisten als Objekte `type = "tier"` bzw. `"statist"`
mit zwei Punkten `von`/`bis` als Eigenschaften, die Technik dafür kommt vom Haupt-Chat).

Die erste begehbare Route (W5): Karte 1 „Landstraße“ (28 × 20, Felder, Zaun, Straße von links nach
rechts, Rätseltafel am Anfang), Karte 2 „Flussweg“ (28 × 20, Bach rechts wie in Cedar Creek, Steg,
Bank, Ortsschild am Ende). Platzhalterkacheln wie bisher.

## Vorgaben

1. **Objekte Karte 1** (Namen genau so): `start` (links, Richtung rechts), `zurueckPark`
   (Übergang links am Rand, zurück nach Maple Falls), `tafel` (Gegenstand, Kollision, neben dem
   Weg), `wanderer` (Figur, auf dem Weg, kurz vor der Mitte), `gegnerin` (Figur, bei einer Bank
   rechts), `fundFormular` (Gegenstand, versteckt hinter einem Busch: Kollision, nur von einer
   Seite erreichbar), `weiterFluss` (Übergang rechts am Rand).
2. **Objekte Karte 2:** `start` (links, Richtung rechts), `zurueckLandstrasse` (Übergang links),
   `rast` (Gegenstand: Bank am Fluss), `fundMuenzen` (Gegenstand, sichtbar: Kiste), `schildCedar`
   (Gegenstand am Ende), `weiterCedar` (Übergang rechts am Rand).
3. **Rand:** nur an den Übergängen offen; alles von `start` erreichbar; Figuren und Gegenstände von
   einem freien Nachbarfeld aus ansprechbar.
4. **Park:** erledigt vom Haupt-Chat (Übergang `landstrasse` auf Kachel 27/10, Rand dort offen);
   `orte.json` kennt den Weg schon als Ort `wegMapleCedar` mit beiden Karten, deshalb prüft dein
   Kartentest die neuen Dateien sofort (Namen der Objekte genau wie hier).
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

**Nachtrag nach `09_Weltbeschreibung.md`** (Abschnitte 3, 4, 4a, 5.2, 6): Beide Routenkarten haben
jetzt Statisten (`type = "statist"`, Eigenschaften `von`, `bis` als „x,y“ in Kacheln, `tun`, `wann`)
und Tiere (`type = "tier"`, `von`, `bis`, `verhalten`, bei Bedarf `wann`); jeder Laufweg ist eine
gerade Linie über freie Kacheln (geprüft).

- Landstraße: `bauer` (Traktor auf dem Feld, tag), `joggerin` (Straße, morgen), `radfahrer`
  (Straße, tag); `kuehe` (sitzen, am unteren Zaun), `hase` (ausweichen), `reh` (ausweichen,
  morgen, oben am Feldrand). `gegnerin` ist Nia auf der Bank.
- Flussweg: `angler` (am Steg, tag), `joggerin` (morgen); `reiher` (sitzen, am Ufer), `hase`
  (ausweichen), `schmetterling` (fliegen, tag).

Checkliste Abschnitt 6, was die Platzhalter nicht hergeben (offen für die Grafik): animierte
Kachel (Wasser, Laub), Ahorn am Rand, Vordächer/Matten, Tönung (`toenung`), Nebel am Morgen,
Spur einer Quest (Ebene `objekte` mit Bedingung, braucht die Technik aus Abschnitt 7), Geräusch
und Musik (gehören in `orte.json`/`wege.json`, für mich gesperrt). Der Kartentest kennt die Typen
`statist` und `tier` noch nicht; sobald die Karten in `orte.json`/`wege.json` stehen, würden sie
als nicht erklärte Auslöser gemeldet. Vorschlag: im Test Objekte dieser Typen von der
Erklärungspflicht ausnehmen und nur ihre Laufwege auf freie Kacheln prüfen.
