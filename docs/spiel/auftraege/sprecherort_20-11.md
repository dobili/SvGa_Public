# Haltung und Ort der Sprechenden, geführte Wege, Möbelwagen (20.11.2026, mittel-4)

Auftrag nach den Notizen des Autors vom 20.11. abends:

- **A:** Dialoge auf die Positionen der Sprechenden prüfen.
- **B:** Geführte Wege bauen.
- **C:** Den Möbelwagen nachtragen und genannte, aber fehlende Gegenstände suchen.

## Befund des Autors

In der ersten Nacht im Zimmer stand der Held direkt vor Ambrose am Fenster. Der Text erzählte
dazu das Wachliegen:

- „Unten summt der Kühlschrank. Von weit her rauscht der Wasserfall.“
- Antworten: „Bist du wach?“ und „Kannst du auch nicht schlafen?“

Der Held hätte im Bett liegen müssen.

**Behoben:** Die Nacht beginnt jetzt im Bett (`#stelle:held>13,8>liegt`). Nach den ersten
Fragen kommt die neue Zeile „Du schlägst die Decke zurück und tappst barfuß zu ihm hinüber.“
mit `#gehe:held>ambrose`: Der Held steht auf und geht von selbst neben Ambrose ans Fenster. Vor
dem Einschlafen liegt er wieder im Bett. Am Ende des Dialogs steht er neben dem Bett auf.

## B: Geführte Wege

Neues erzählerisches Mittel, gesteuert aus Ink. Die Beschreibung für Schreibende steht in
`docs/spiel/23_Technik_Atmosphaere.md`, Abschnitt T11.

- **`#gehe:<wer>><ziel>`:** Das Ziel ist eine Figur der Karte, ein Auslöser oder ein Feld `x,y`.
  - Neben einer Figur endet der Weg mit Blick auf sie.
  - Mehrere `#gehe` in einer Zeile laufen zugleich.
  - Die Zeile wartet, bis alle angekommen sind: „Weiter“ und die Wahlen sind so lange gesperrt.
- **`#stelle:<wer>><x,y>>liegt`:** setzt die Figur sofort an die Stelle, liegend gekippt und über
  dem Bett gezeichnet.
- **Bewegung:** Der Held läuft mit seiner gewöhnlichen Laufbewegung, also mit Animation, Kamera und
  Kollision. Er löst unterwegs nichts aus. Hängt er an einer Ecke, rückt er nach einer Sekunde
  eine Kachel weiter. Andere Figuren gehen Kachel für Kachel mit ihrer Laufanimation.
- **Wegsuche:** kürzester Weg auf den Kacheln um Wände, Möbel und Figuren. Gibt es keinen Weg,
  bleibt die Figur stehen, und der Dialog läuft weiter.
- **Neuladen mitten im Weg:**
  - Die Szene meldet als Position des Helden schon das Ziel.
  - Der Spielstand wird gleich beim Start des Wegs damit gesichert.
  - Nach dem Neuladen steht der Held am Ziel, geprüft im e2e-Test.
  - Andere Figuren stehen danach wieder an ihrem Platz auf der Karte (sie stehen nicht im
    Spielstand).
- **Warum `>` statt `->`:** Ink liest `->` auch in einem Tag als Sprung, die Übersetzung scheitert.

Umgesetzt an sieben Stellen:

| Stelle                                                            | Weg                                                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Erste Nacht, Zimmer (`maple-falls-dachboden.erste_nacht`)         | im Bett, dann `held>ambrose`, am Ende wieder im Bett                                |
| Einleitung (`maple-falls-aussen.einleitung_hinein`)               | Mama geht zur Haustür, der Held folgt ihr; dann die Reise ins Wohnzimmer wie bisher |
| Arena, Aussage (`capital-arena-halle.aussage_victor`)             | Victor geht quer durch die Halle zu Nova                                            |
| Arena, vor dem Finale (`capital-arena-halle.vor_dem_finale_mama`) | Mama kommt den Gang herunter zum Helden                                             |
| Museum (`ironwood-museum.postsack`)                               | Mr. Teague kommt herüber                                                            |
| Akademie (`silicon-bay-akademie.lin_erstes_treffen`)              | Dr. Lin kommt auf den Helden zu                                                     |
| Wohnzimmer (`maple-falls-wohnzimmer.mama_foto`)                   | Mama steht auf und geht zum Fenster                                                 |

Gesucht wurde nach Ankünften, Begleitungen und Hereinkommen in den Erzählzeilen (kommt herüber,
herein, auf dich zu, setzt sich zu dir, geht zum Fenster …). Diese Stellen habe ich nicht
umgesetzt:

- **Juno setzt sich auf die Treppe** (`capital-arena-aussen.abschied_ende`): Juno steht nach dem
  Abschied nicht auf der Außenkarte.
- **Ezra kommt angelaufen** (Pinewood Camp): Das Gespräch beginnt erst, wenn man ihn anspricht. Er
  steht dann schon neben dem Helden.
- **Odile setzt sich ans Brett** (Clubkampf): Die Partie öffnet gleich, ein Weg wäre nur ein
  Schritt.
- **Victor setzt sich in Ghost Town neben den Helden:** Man spricht ihn selbst an, er steht schon
  daneben.
- **Ein Gast kommt ins Diner:** ein Statist ohne Figur.

Später lohnend:

- Die Heimfahrten mit Mama: erst zum Auto, dann die Reise.
- Juno, die am Park wartet und mitgeht.

Beides braucht Figuren auf der Karte, die heute nur im Dialog sprechen.

## A: Werkzeug `sprecherort`

`python -m pipeline.abenteuer.sprecherort [--alle]`. Dauertest:
`pipeline/tests/test_abenteuer_sprecherort.py`. Ausnahmen mit Grund stehen in
`pipeline/abenteuer/sprecherort_geprueft.py`:

- `GEPRUEFT`: Die Stelle passt.
- `GEMELDET`: Kartenbefund in einer Szene, gemeldet.

Vier Prüfungen:

1. **liegen:** Ein Knoten erzählt Schlaf, Bett oder Wachliegen („Bist du wach?“, „kannst nicht
   schlafen“, „die Augen fallen zu“), legt den Helden aber nicht mit `#stelle … >liegt` ins Bett.
2. **kommt:** Eine Figur derselben Karte kommt laut Erzählzeile herüber, herein, auf den Helden zu
   oder setzt sich zu ihm, ohne `#gehe` für sie.
3. **sitzt:** Die Erzählung lässt eine Figur sitzen, auf keiner Karte des Orts sitzt sie.
4. **ruft:** Die angesprochene Figur ruft von unten, von draußen oder aus der Küche, steht aber
   neben dem Helden.

Gegenprobe: Auf dem alten Stand meldet die Prüfung „liegen“ die erste Nacht (`Bist du wach`). Stand
jetzt: 19 Kandidaten, alle angesehen. Die erste Nacht ist behoben, die Gänge sind durch die
geführten Wege versorgt.

**Passt (8):**

- Ein Gast kommt ins Diner, nicht Hector.
- Victor sitzt im Pullover von Mr. Haraldsen; Haraldsen ist nur als Besitzer genannt.
- Vorausblick „In der Nacht kannst du nicht schlafen“ am Ende des Abends.
- Der Saloon in Ghost Town: Der Held steht auf und sucht hinter dem Tresen.
- Zwei Fälle: Der Abend am Lagerfeuer ist ein Zeitsprung.
- Juno nach dem Abschied steht nicht auf der Außenkarte.
- Odile am Brett, siehe oben.

**Kartenbefunde, gemeldet (11):** Der Text lässt diese Figuren sitzen, auf der Karte stehen sie.

| Figur           | Karte, Gespräch                          | Text                                  |
| --------------- | ---------------------------------------- | ------------------------------------- |
| Juno            | Capital Arena, Halle, Pause nach Runde 2 | sitzt auf der untersten Tribünenstufe |
| Jonah, Dex, Ivy | Cedar Creek, Bibliothek, `zwillinge_d`   | Jonah und Dex am Brett, Ivy daneben   |
| Mira            | Crossroads, außen                        | im Schneidersitz auf einem Tisch      |
| Mama            | Ironwood, Kantine, Clubkampf             | in der ersten Reihe                   |
| Big Joe         | Ironwood, Kantine, nach dem Kauf         | auf einer Kiste                       |
| Mrs. Albescu    | Riverton, außen                          | auf einem Hocker vor der Werkstatt    |
| Nova            | Riverton, außen                          | auf der Kante des Podiums             |
| Theo            | Silicon Bay, Akademie                    | vor zwei Bildschirmen                 |
| Ward            | Summit City, Hütte                       | im Sessel am Feuer                    |

Behebbar mit `sitzt` an der Figur der Szene (und einem Sitzmöbel), oder mit einem kleinen Satz,
der das Stehen erzählt. Die Szenen gehören zum Teil anderen Helfern (Figurengröße, Tore); deshalb
gemeldet statt geändert.

**Grenzen:** Die Muster kennen nur die gängigen Wendungen. Wer „hockt“, „lehnt“ oder „wartet am
Fenster“ schreibt, fällt nicht auf. Die Figur erkennt das Werkzeug an ihrem Namen im Text; „sie“
und „er“ bleiben unerkannt.

## C: Möbelwagen und fehlende Gegenstände

- **Möbelwagen:** Die Einleitung sagt „Am Bordstein steht der Umzugswagen mit offener Klappe.“ Auf
  der Karte fehlte er. Jetzt steht er vor dem Haus an der Birch Lane auf der Straße:
  - Szene `maple-falls-aussen`, Feld (6, 25), Katalog `fz11LkwRechts` (eigener LKW,
    `spiel/eigene/lkw_rechts_rot.png`), Maßstab 0,6.
  - Gehweg und Gartentor bleiben frei, ebenso die Kachel unter Mama (5, 25). Nur von dort ist sie
    ansprechbar, neben ihr steht der Zaun. Auf (5, 25) meldete die Prüfung „Übergänge zu Fuß“ sie
    als unerreichbar.
  - Er steht bis zur Ankunft im Wohnzimmer (`wenn: nicht ankunftGesehen`), denn dort heißt es „Am
    Abend ist der Umzugswagen weg.“
  - Ein eigenes Bild war nicht nötig. Die LimeZu-Pakete haben nur Autos, Busse und Wohnmobile, aber
    der eigene LKW passt.
- **Suche nach genannten, aber fehlenden Gegenständen:**
  - Gesucht wurden Erzählzeilen mit „steht“, „liegt“, „hängt“, „parkt“ oder „wartet“ und einem
    Gegenstand oder Tier (Wagen, Bus, Kiste, Schild, Plakat, Hund, Katze, Pferd, Leiter, Brunnen,
    Boot, Zelt, Ofen, Uhr, Bildschirm …).
  - Verglichen mit Möbeln, Belebung und Figuren aller Szenen des Orts.
  - 15 Treffer; die meisten meinen etwas in der Hand (Bildschirm eines Telefons), eine Erinnerung
    oder eine Uhrzeit.
  - Drei kleine echte Lücken, gemeldet:
    - Flohmarkt am Flussweg (`weg-maple-cedar.ereignis_flohmarkt`): ein Fahrrad ohne Kette auf dem
      Tisch.
    - Raststätte Crossroads (`varianten_tisch`): Kisten mit seltsamen Figuren auf dem langen Tisch.
    - Sternwarte (`finch_bauer_g`): eine Kiste mit Fotoplatten, hinter der der weiße Bauer steht.
