# Querschnitt: Umsetzung durch mittel-2 (17.11.2026)

Auftrag des Hauptchats zu den Teilen 3 bis 5 von `akt1_und_querschnitt.md` (Regel 9: Empfehlungen
umsetzen). Die Texte in den Dateien von Akt 3 und 4 passen andere Helfer an.

## 1. Victor steht immer nur an einem Ort

Bisher stand Victor in Cedar Creek, Riverton, Silicon Bay und an der Bergstation ohne Bedingung.
Wer zurückkam, traf ihn am Tablet oder am Podium, und Erstszenen liefen erst, als er längst ein
Freund war. Jetzt hat jede Victor-Figur in `orte.json` ein `wenn`. Jedes Fenster endet dort, wo
das nächste beginnt, in der Reihenfolge der Geschichte:

| Figur                 | `wenn`                                             | Grund                                                                     |
| --------------------- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| `cedarCreek.victor`   | `nicht endeAkt1Gesehen`                            | Tablet an der Haltestelle gehört zu Akt 1                                 |
| `riverton.victor`     | `nadelRiverton == 0`                               | Eröffnung der Bildschirmtische; „Zwei.“ (Nadeln) stimmt nur bis zur Nadel |
| `ironwood.victor`     | `nadelIronwood > 0 und nicht einladungGesehen`     | unverändert: Kauf und Einladung                                           |
| `siliconBay.victor`   | `einladungGesehen und nicht endeAkt3Gesehen`       | Lobby während Akt 3                                                       |
| `summitCity.victor`   | `endeAkt3Gesehen und nicht grabGesehen`            | Bergstation bis zum Grab in Ghost Town                                    |
| `ghostTown.victor`    | `grabGesehen und nicht ankunftCapitalArenaGesehen` | Saloon und Fernpartie, nicht mehr nach dem Finale                         |
| `capitalArena.victor` | `ankunftCapitalArenaGesehen`                       | Halle der Hauptstadt                                                      |

Die Fenster sind ohne Lücke für die Quests geprüft:

- Riverton erreicht man erst nach `endeAkt1Gesehen`.
- Ironwood erreicht man nur über den Kanalweg nach der Nadel von Riverton.
- `summitCity.endspiel` braucht `victor_seite` vor dem Clubkampf, also vor dem Grab.
- `ghostTown.fernpartie` endet im Saloon, bevor der Weg in die Hauptstadt aufgeht.

**Tischsätze getrennt.** Statt der allgemeinen `tisch.figur.victor.*` gibt es jetzt eigene Sätze je
Gegner:

- `mapleFalls.victor`: Akt 1, kühl. Ohne Eröffnung, weil Victor die Stellung selbst wählt, ohne Lob
  und ohne „letztes Mal“.
- `summitCity.victor`: Bergstation, tastend. „Ohne Uhr. Es zählt für nichts.“
- `ghostTown.victor`: neuer Gegner für die Fernpartie, still. Feste Stellung, Hales Seite.
- `capitalArena.kapuze`: neuer Gegner für die dritte Runde der Kreidenacht. Name „Junge mit
  Kapuze“, eigenes Porträt `portraets/kapuze.svg` (Kapuze, Gesicht im Schatten). Seine Tischzeilen
  sind nur „…“, denn er „hat kein Wort gesagt“. Der Steckbrief nennt nur den Stil, nicht Victors
  Spanisch.

Die Begegnungen `ghostTown.fernpartie` und `capitalArena.kreidenacht3` zeigen auf die neuen Gegner.

## 2. Fernpartie, Züge 38 und 39 (erinnerung-siedlung)

Nachgespielt mit python-chess:

- **38. Td8+:** Der Springer von c6 schlägt den Turm (Sxd8). Diese vierte Stelle stand nicht im
  Bericht, ist aber ebenso falsch.
- **38. Dxc6:** Der Springer von a5 schlägt die Dame zurück (Sxc6).
- **39. Dxa7:** Der Springer von c6 schlägt die Dame (Sxa7).
- **39. Td8+:** Der Springer von c6 schlägt den Turm (Sxd8).

Alle vier Erklärungen sind berichtigt. Die Tipps zu Zug 37 und 40 stimmen.

## 3. Finch-Jagd

- Die Quest `wegGhostCapital.finchJagd` startet nicht mehr beim Betreten des Flohmarkts, auch
  nicht bei geschlossenem Wohnmobil. Sie beginnt erst, wenn Odette die Karte gibt
  (`weg-maple-cedar.flohmarkt_karte`).
- Schritt 1 nennt weder Odette noch den Leuchtturm.
- Odette sagt am Flohmarkt: sechzehn Figuren, fünfzehn davon an den Wegen, den König behält sie.
- Ambrose zählt fünfzehn.

## 4. Juno in Ironwood

Juno zitierte „nicht zum Turnier“ aus einem Telefonat, das sie nicht gehört hat. Mama sagt am
Telefon „Nicht Ironwood“. Jetzt sagt Juno in beiden Zweigen: „Wir gucken nur. Gucken ist kein
Turnier.“

## 5. Victors Stellung in Akt 1

Stockfish (Tiefe 16) bewertet die Stellung mit +3,2 für Weiß. Schwarz hat einen Springer weniger
und zwei Bauern mehr.

- Victor sagt jetzt beides an: „Du hast Schwarz, einen Springer weniger und zwei Bauern mehr.“
- Ambrose sagt statt „verloren“: „Ein Springer gegen zwei Bauern. Das ist schwer, ehrlich gesagt.“
- Nach einem Sieg oder Remis heißt es: „eine schwere Stellung … mit einem Springer weniger“.

## 6. Verlorenes Brett

`quest.verlorenesBrett.schritt2` passt jetzt zur Parkbank des Fable-Chats (drei Aufgaben, Matt in
einem Zug): „Die drei Aufgaben auf Mr. Abernathys Zettel lösen: Weiß setzt in einem Zug matt.“

## Prüfungen

Alle mit `set -o pipefail`:

- Sprachprüfung: 0 Funde
- pytest: 1585 bestanden
- vitest `src/abenteuer`: 566 bestanden
- Gesamtsimulation 300 Sekunden: „Meldungen: keine“, alle Orte besucht, alle Sammelstränge
  vollständig

## Nachtrag: Alltag von Mrs. Okafor und Mama (17.11.2026)

Zweiter Auftrag des Hauptchats nach dem Querschnitt (Teil 4, Okafor; Teil 3, Familie). Es gibt keine
neuen Szenen. Die vorhandenen Alltagsknoten bekommen Stufen. Alle Stufen hängen an Variablen, die
andere Dateien setzen, nicht an Knotenbesuchen.

- **Mrs. Okafor** (`cedar-creek-bibliothek.okafor_alltag`):
  - Nach Akt 2 (`nadelIronwood > 0`) zeigt sie, dass sie die Sache verfolgt: der Herr mit den zwei
    Telefonen im Rathaus, „Ich habe Geduld, und ich habe den Schlüssel“, Junos Bilder.
  - Nach dem Vorwurf in Port Delacroix (`tiefpunktGesehen`) steht sie zu {held}: „Ich habe deine
    Partien hier im Ordner. Jede einzelne.“
- **Mama** (`maple-falls-wohnzimmer.mutter_alltag`), eine Stufe je Akt:
  - Akt 2 (`endeAkt1Gesehen`): Sorge um Riverton, nach `verbotGesehen` das Verbot („Ironwood
    nicht. Ich weiß, dass du fragen willst.“).
  - Nach ihrer Partie (`mamaSpielt`): Taschenschach und das blaue Heft.
  - Akt 3 (`einladungGesehen`): Nähe am Telefon statt Kuchen und Pizza.
  - Nach dem Vorwurf (`tiefpunktGesehen`): „Ich kenne deine Züge.“
  - Akt 4 (`endeAkt3Gesehen`): Stolz („Ich bin stolz auf dich, weißt du das?“).
- **In der Kantine** (`ironwood-kantine.mama_alltag`) spricht Mama nach dem Kauf (`kaufGesehen`)
  von Joes Pokalen in der Garage und dem neuen Raum, den sie suchen.

Prüfungen wie oben: Sprachprüfung 0 Funde, pytest 1585, vitest 566, Simulation ohne Meldungen.
