# 27 Kartengutachten Akt 1

Stand 13.11.2026, abends, Gutachter-Chat, im Auftrag des Hauptchats. Reiner Bericht: Keine Karte,
keine Szene und keine Daten sind geändert. Geprüft ist der Stand von
`claude/friendly-shannon-y8bf90`, Commit bad22170 (18:29 UTC), mit dem Grafikbestand des privaten
Repositorys (main cd4f3166). Die Bilder liegen nur im Arbeitsordner des Gutachters, nicht im
Repository.

## Wie geprüft wurde

- **Bilder:** alle 31 Szenen von Akt 1 gerendert mit `python -m pipeline.abenteuer.kartenbild`
  (17 Karten, dazu 14 Zustandsfassungen) und am Bild angesehen, große Karten in Ausschnitten mit
  Raster. Lage in Kacheln (x, y) ab oben links.
- **Maßstab:** `26_Akt1_Kartenliste.md` Punkt für Punkt, `20_Ortsblaetter.md`, `KARTENREGELN.md`
  10.51 bis 10.76, die Rückmeldungen R001 bis R151 des Autors zu Akt 1
  (`auftraege/rueckmeldung/sammlung.md`).
- **Übergänge:** `python -m pipeline.abenteuer.weltpuzzle` für Maple Falls, den Weg und Cedar Creek.
- **Spielbarkeit:** `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1 --sekunden 200`;
  Erreichbarkeit von Auslösern, Figuren und Ausgängen aus der Sperrmaske der Pipeline.
- **Arbeitsteilung:** Vier Helfer haben je eine Kartengruppe angesehen. Der Gutachter hat an vier
  Stellen am Bild nachgesehen (Dachboden ganz, Clubraum am Brett mit dem Zettel, Bibliotheksturm
  und roter Schuppen in Cedar Creek) und zwei Befunde an den Daten nachgeprüft (kein Figurenbild
  für Ada und Tessa im Grafikbestand; Zugang zum Zedernpfad aus Cedar Creek ohne Bedingung). Alle
  stimmen. Die übrigen Befunde sind nicht einzeln nachgesehen.

## Gesamturteil

| Karte                       | Größe    | abnahmereif           | Schwerster Punkt                                                  |
| --------------------------- | -------- | --------------------- | ----------------------------------------------------------------- |
| `mapleFalls.aussen`         | 64 × 43  | nein                  | Calloways Veranda fehlt, zwei flache Rückansichten                |
| `mapleFalls.park`           | 44 × 32  | nein                  | Halfpipe eingeklemmt, Jo nicht an ihrer Kante                     |
| `mapleFalls.wohnzimmer`     | 20 × 13  | ja, kleine Nacharbeit | Treppe ohne Tiefe                                                 |
| `mapleFalls.dachboden`      | 14 × 11  | nein                  | Brett ohne Stellung, Whitlock-Kiste als flacher Karton            |
| `mapleFalls.zimmer`         | 16 × 12  | ja, Nacharbeit        | Abgang liegt nicht über der Treppe unten                          |
| `mapleFalls.clubraum`       | 26 × 15  | nein                  | weiße statt schwarze Dame fehlt, Zettel statt Radiergummi         |
| `mapleFalls.diner`          | 16 × 13  | nein                  | Tür innen rechts, außen links; Jukebox fehlt                      |
| `wegMapleCedar.landstrasse` | 120 × 30 | nein                  | Gatter lässt sich umgehen; Ada und Tessa nicht zu sehen           |
| `wegMapleCedar.flussweg`    | 120 × 30 | nein                  | kein Stein mit eingeritztem Brett; Fluss endet vor Häusern        |
| `wegMapleCedar.zedernpfad`  | 240 × 34 | nein (nur das Bild)   | kein Zedernwald, Felsstufen ohne Tiefe                            |
| `kuerbishof.hof`            | 48 × 34  | ja, zwei Nacharbeiten | Kürbiswaage nicht zu sehen                                        |
| `cedarCreek.aussen`         | 60 × 50  | nein                  | Zwillinge nicht auf der Treppe, keine Turmuhr, Vogelhaus-Schuppen |
| `cedarCreek.bibliothek`     | 26 × 17  | nein                  | Fassung Clubkampf, Lampen, Saaltiefe                              |
| `cedarCreek.archiv`         | 14 × 11  | ja, kleine Nacharbeit | Programmheft liegt auf dem Stuhl                                  |
| `cedarCreek.waschsalon`     | 14 × 11  | knapp nein            | Tür innen in der Mitte statt im linken Drittel                    |
| `cedarCreek.drechslerei`    | 16 × 11  | nein                  | keine Drehbank                                                    |

Vier von sechzehn Karten sind abnahmereif. Spielbar sind alle: Nach der Sperrmaske sind auf jeder
Karte und in jeder Fassung alle Auslöser, Figuren und Ausgänge erreichbar. Die Ausnahme ist die
Landstraße, wo das geschlossene Gatter über eine Zaunlücke umgangen werden kann.

## Übergreifende Befunde

1. **Figuren ohne Bild.** In den Renderings fehlen Ada, Tessa (Landstraße, Flussweg, Zedernpfad),
   die Zwillinge (außen und drinnen), Mr. Kettering und Mr. Dunmore, obwohl sie in den Szenen
   stehen. Für Ada und Tessa gibt es im Grafikbestand kein Figurenbild; bei den übrigen ist die
   Ursache nicht geklärt. Ob die App eine Ersatzfigur zeigt, ist nicht geprüft.
2. **Die Kartenliste ist an mehreren Stellen überholt.** Das Zimmer des Helden, die Fassung
   `wohnzimmer-tisch`, die Auslöser `kisteWhitlock`, `fensterbank`, `tischPizzakarton`,
   `bildschirmPult`, `apfelstand`, `faehrstein`, `kreidebrett` und die Figuren `calloway`, `carla`,
   `hector`, `ada`, `tessa` gibt es inzwischen in den Daten. Die Tabelle „fehlende Auslöser“ in
   Dokument 26 stimmt deshalb nicht mehr.
3. **Aufgang im Whitlock-Haus uneinheitlich (10.76).** Die Treppe in Wohnzimmer und Zimmer ist
   eine flache Lattenfläche; im Zimmer liegt der Abgang nicht über der Treppe unten; zum Dachboden
   führt eine Luke mit Leiter, darunter steht eine feste Treppe.
4. **Weltpuzzle: neun Randbrüche.** Die Straßen passen an allen Nähten in der Höhe. Sichtbar
   stören zwei: Am Parkausgang wechselt der Belag hart von Asphalt mit Mittellinie zu unmarkiertem
   Graubraun (R036), und am Ostende des Flusswegs endet der Fluss vor Pflaster und Häusern von
   Cedar Creek. Die übrigen Brüche (Fluss gegen Schulrasen, Südufer) fallen nur auf einer
   Weltkarte auf.
5. **Gesamtsimulation, Akt 1.** Nie erreichte Knoten: `cedar-creek-archiv.karton_fremd`,
   `cedar-creek-aussen.steg_vor_archiv` und `.sterne_ambrose`, `cedar-creek-bibliothek.zwillinge_c`,
   `.clubkampf_bauer`, `.clubkampf_lass_mich`, `cedar-creek-drechslerei.dunmore_c`,
   `cedar-creek-waschsalon.trockner_danach`, `maple-falls-aussen.juno_zum_club` und
   `.calloway_auf_dem_weg`, `maple-falls-clubraum.juno_erst_sam`, `.juno_club_alltag`,
   `.victor_ueberrascht`, `.victor_weg`, `maple-falls-diner.hector_c`,
   `maple-falls-park.jo_nach_niederlage`, `maple-falls-wohnzimmer.ankunft` und `.nicht_ironwood`,
   `weg-maple-cedar.juno_weg`, `.apfelstand_c`, `.tessa_d`. Nach Einschätzung der Helfer liegt das
   meiste an Reihenfolge und Partieverlauf. An der Karte liegt es bei dreien: Juno hat im Clubraum
   keinen Platz (`juno_*`), auf den Wegkarten gibt es für `juno_weg` weder Figur noch Auslöser, und
   für die Sternennacht am Steg (`sterne_ambrose`) gibt es weder Fassung noch Auslöser.
6. **Gesamtsimulation, außerhalb von Akt 1.** Der Durchlauf erreicht den Abspann nicht (26 von 34
   Orten besucht); die Hauptquest `pinewoodCamp.sommercamp` hängt bei Schritt 0
   (`pinewood-camp-aussen.ankunft_camp`). Nur gemeldet, nicht untersucht; das Zeitbudget von 200
   Sekunden kann mitspielen.
7. **Zedernpfad von Cedar Creek aus.** Der Zugang hat keine Bedingung; gesperrt ist nur der
   Ausgang zum Park (`nadelCedarCreek`). Man kann den Pfad also vor der zweiten Nadel betreten,
   aber nicht bis Maple Falls gehen.
8. **Entscheidung des Autors:** Fernseher im Wohnzimmer und Spielautomat im Diner reiben sich am
   Ortsblatt („Nicht hier: Bildschirme“).

## Zwingend vor der Abnahme durch den Autor

**Maple Falls außen und Park**

- Calloways Platz als Veranda mit Tisch und zwei Stühlen, sie sitzt; die Laterne steht nicht im
  Stuhl.
- Fahrrad am Zaun der Martínez; die zwei flachen Rückansichten (`mf11HausHintenBlau`,
  `mf11HausHintenBraun`) tauschen.
- Kreidebrett: neun Felder in einer Reihe oder die jetzige Fassung vom Autor bestätigen lassen;
  Fassung nach `lilyGeholfen`.
- Halfpipe auf den Pflasterplatz, Jo an ihre Kante; Mr. Abernathy an seine Bank.
- Gehwegreihen an der Brücke (man läuft im Bild über Wasser); blinde Wegenden an den Rändern.

**Maple Falls innen**

- Clubraum: Brett mit fehlender schwarzer Dame und Radiergummi (heute fehlt eine weiße Figur,
  daneben ein Zettel mit „?“; auch der Szenentext sagt „weiße Dame“).
- Clubraum: Sam sitzt am Brett, Juno und Mr. Pratt bekommen einen Platz, Statisten stecken nicht
  in den Stühlen; Bildschirm von Perfect Move erkennbar und auf dem Pult.
- Dachboden: Brett mit Stellung als eigenes, erkennbares Bild; Whitlock-Kiste als Kiste in
  tragbarer Größe.
- Diner: Tür innen auf die linke Seite wie außen; Jukebox; Hector den Gästen zugewandt.
- Whitlock-Haus: Aufgang vereinheitlichen (Befund 3 oben).

**Weg und Kürbishof**

- Landstraße: Zaunlücke (37–39, 11) schließen oder Felder sperren.
- Landstraße: Figurenbilder für Ada (mit zwei Eimern) und Tessa; Kasse am Apfelstand sichtbar;
  im Zustand „Flohmarkt leer“ auch Verkäuferin, Kunde, Wohnmobil und Plakate entfernen.
- Flussweg: Stein mit eingeritztem Brett an der Fährstelle; Zedern am Ostende; Fluss am Ostrand
  glaubwürdig beenden.
- Zedernpfad: Waldbild (Zedern mit roten Stämmen, Nadelboden, keine Reihen), Felskante mit Tiefe.
- Kürbishof: Kürbiswaage sichtbar, Oma Miller an den Hofladen.

**Cedar Creek**

- Außen: Zwillinge auf die Bibliothekstreppe (heute 23, 24 im Gras); Uhr an den Turm; die drei
  Schuppen in Vogelhausform ersetzen; Schilf an den Steg; Fahrgast aus der Anschlagtafel holen.
- Klären, warum Zwillinge, Mr. Kettering und Mr. Dunmore im Bild nicht erscheinen.
- Bibliothek: grüne Leselampen, Leiter, Fassung Clubkampf (geräumter Tisch, Halbkreis, Lampe),
  Matten nicht im Regalgang; Entscheidung zur Tiefe des Saals (10.75, R065).
- Waschsalon: Tür ins linke Drittel; Radio.
- Drechslerei: Drehbank; die drei Springer auf der Fensterbank.

## Nicht geprüft

- Licht, Teilchen, Musik und Geräusche: Die Bilder sind taghell und stumm; Abend, Nacht,
  Lichtkegel im Archiv und Lichtkreis im Clubkampf sind am Bild nicht zu beurteilen.
- Das Verhalten der App: Kartenwechsel beim Darüberlaufen (R060), Ersatzfiguren, Belebung,
  Blickrichtung und Bewegung. Die Erreichbarkeit stammt aus der Sperrmaske der Pipeline, nicht aus
  einem Lauf im Spiel; Statisten zählen dort nicht als Hindernis.
- Ink-Dialoge (ausgenommen). Die Einordnung der nie erreichten Knoten stützt sich nur auf Figuren
  und Bindungen in den Szenen und in `orte.json`.
- Die Renderings zeigen alle Figuren gleichzeitig, auch solche mit Bedingung.
- Kleine Schriften („1994“, „nicht wegwerfen“) sind in der Auflösung nicht lesbar.
- `katalog_korrekturen/grundrisse.json` ist nicht je Gebäude ausgewertet; innen gegen außen ist
  nach der Kartenliste und dem Außenbild verglichen.

---

## Maple Falls außen

Geprüft am Bild (Gesamtansicht und gerasterte Ausschnitte, teils zwei- bis sechsfach vergrößert), an den
Szenendateien, an `orte.json` und mit der Sperrmaske der Pipeline (`abkuerzung.gelaende`, Flutfüllung ab
`start`). Koordinaten sind Kacheln (x, y) ab oben links, am Raster abgelesen oder aus der Szenendatei.

Vorab: Die Kartenliste (Stand mittel-4) ist bei `mapleFalls.aussen` überholt. `calloway`, `carla`
und `kreidebrett` stehen inzwischen in Szene und `orte.json`; der Zustand `schulbus` ist aus `orte.json`
entfernt.

### mapleFalls.aussen – Birch Lane und Hauptstraße (64 × 43)

- **Gesamturteil:** abnahmereif **nein**. Der Ort liest sich sofort und alle Auslöser sind erreichbar,
  aber Mrs. Calloways Platz ist keine Veranda (zwei Stühle am Gehweg des Wendehammers, eine Laterne im
  rechten Stuhl, sie steht statt zu sitzen), Carlas Fahrrad fehlt, und zwei flache Rückansichten
  (Abziehbilder laut eigener Liste) stehen noch.

- **Kartenliste:**

| Punkt                                                             | Urteil        | Bemerkung                                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Whitlock-Haus als einziges grau, ungestrichen                     | erfüllt       | `mf4VillaWhitlock` (1, 10): graubraunes Dach, verwitterte Wand; daneben dieselbe Villa mit lila und rotem Dach. Tür und Auslöser `haustuer` (3, 20) liegen übereinander.                                            |
| Bunte Holzhäuser, „jedes eine andere Farbe“                       | teilweise     | Nordseite: nur die Dächer unterscheiden sich, die Wände sind alle cremefarben; Ortsblatt nennt hellblau, buttergelb, erbsengrün.                                                                                    |
| Calloways Veranda gegenüber, zwei Stühle                          | teilweise     | Zwei Stühle (4, 29) und (6, 29) stehen auf dem Gehweg am Wendehammer, nicht auf einer Veranda; kein Tisch (Stufe D, erst nach Akt 2).                                                                               |
| Haus Martínez mit Zaun und Fahrrad                                | teilweise     | Zaun (26–30, 23) da, Carla (28, 24) davor; **kein Fahrrad** im Bild und in den Objekten.                                                                                                                            |
| Kreidebrett vor Lilys Haus, schief, neun Felder in einer Reihe    | teilweise     | `mf12Kreidebrett` (15, 24): weißes, leicht schiefes Gitter mit einem braunen Stein darauf; ich zähle etwa neun Spalten, aber **drei Reihen**.                                                                       |
| Ahornallee, Briefkästen, Veranden                                 | teilweise     | Briefkästen (5/15/25, 22) und Veranden da. Ahorne nur in den Gärten hinter den Häusern (16, 5), (22, 5); an der Straße steht **kein Baum** (die Beschreibung der Szene nennt Straßenbäume, im Bild sind es Hecken). |
| Schule mit Schulhof und Fahnenmast                                | erfüllt       | Schule (39, 0), Freitreppe frei begehbar (45–54, 20–22), Fahnenmast (41, 15) links der Treppe. Ein Schulhof im engeren Sinn fehlt (nur Treppe und Gehweg).                                                          |
| Diner                                                             | erfüllt       | (30, 14) mit Leuchtschrift und Markise; siehe Befund 6.                                                                                                                                                             |
| Weg zum Park, Bushaltestelle                                      | erfüllt       | Straße nach Osten (63, 25–27); Haltestelle (57, 21) mit Bank und Tonne, **ohne Bus**.                                                                                                                               |
| Figuren Juno, Lily                                                | erfüllt       | (54, 24), (14, 24), frei und erreichbar.                                                                                                                                                                            |
| Figur Calloway, Stufen A bis D                                    | teilweise     | Figur (5, 30) da; A: steht zwischen den Stühlen; B (Kartenspiel) fehlt; C über Figur `owen` (5, 31) mit Bedingung; D fehlt.                                                                                         |
| Figur Carla, Stufen                                               | teilweise     | `carla` (28, 24) bis Ende Akt 1, `carlaSchule` (45, 23) danach, beide mit Bedingung; Fahrrad fehlt (A, B).                                                                                                          |
| Owen Fisk                                                         | erfüllt       | Statist `kindMitBall` (50, 36) auf dem Spielplatz, `owen` ab Stufe C.                                                                                                                                               |
| Auslöser `haustuer`, `schule`, `dinerTuer`, `park`, `kreidebrett` | erfüllt       | alle laut Maske erreichbar; `kreidebrett` an `ansehen-maple-falls.kreidebrett` gebunden.                                                                                                                            |
| Zustände (Kreidebrett nach `lilyGeholfen`, Veranda je Stufe)      | fehlt         | `orte.json` hat für die Karte keine `zustaende`; nur die Figuren haben Bedingungen.                                                                                                                                 |
| Licht, Ton                                                        | nicht prüfbar | `musik/maple-falls.ogg`, `klang/wasserfall.m4a` eingetragen; `voegel` nicht. Stille S1 nicht prüfbar.                                                                                                               |
| Eine einzige Ampel (Ortsblatt)                                    | fehlt         | keine Ampel im Bild.                                                                                                                                                                                                |

- **Befunde:**
  1. **Calloways Platz, (4–6, 29–31):** Die zwei dunklen Stühle stehen auf dem Gehweg neben dem
     Schild „Sackgasse“ (2, 29); der Mast der Laterne (6, 26) läuft genau durch den rechten Stuhl.
     Mrs. Calloway steht auf dem Gras zwischen und hinter den Stühlen, Owen direkt unter ihr. Ihr Haus
     (3, 32) zeigt der Straße die Rückseite und hat keine Veranda. Vorschlag: am Haus eine Veranda zur
     Birch Lane bauen (oder Stühle auf eine kleine Holzterrasse bei (4–7, 31)), Laterne auf (8, 26)
     versetzen, Calloway auf den linken Stuhl setzen, Owen ab Stufe C auf den rechten; Kartenspiel
     (B) als Ding mit Bedingung.
  2. **Abziehbilder, `mf11HausHintenBlau` (3, 32) und `mf11HausHintenBraun` (30, 32):** flaches
     Schindelrechteck ohne First, flache Wand; beide stehen in `gutachten/ABZIEHBILDER.md` als
     auszutauschen. Das blaue ist ausgerechnet Calloways Haus. Vorschlag: gegen die Fassung mit
     Walmdach (`mf11HausHintenBBlau`, `…BRot`) oder die Gemini-Rückansichten tauschen.
  3. **Fahrrad fehlt, Zaun Martínez (26–30, 23):** Carla steht nur da. Vorschlag: Fahrrad auf
     (29, 23/24) an den Zaun lehnen, Carla daneben auf (28, 24); ab Stufe B aufrecht abgestellt.
  4. **Pforten (3–4, 23), (13–14, 23), (23–24, 23), (54–55, 31):** `mf10TorOffen` liest sich im
     Bild als geschlossenes Gatter mit Querlatten, ist aber begehbar. Vorschlag: Flügel sichtbar nach
     innen geöffnet oder Durchgang ohne Latten.
  5. **Unsichtbare Kartenränder:** Die Gasse (1–62, 41) und die Gehwege (y 24 und 28) laufen
     im Bild bis an den West- und Ostrand, sind dort aber gesperrt (`#`, ohne sichtbare Hecke; auch
     Reihe 42 ist als Pflaster gezeichnet). Das sieht nach Ausgängen aus. Vorschlag: Gasse bei x 2
     und x 61 mit Hecke oder Zaun schließen, Reihe 42 als Hecke zeichnen.
  6. **Diner, (30–38, 14–23):** Die Tür liegt auf x 31–32, der Pflasterstich davor auf x 32–33;
     Auslöser (31, 23) liegt auf Gras. Das Flachdach wirkt wie eine türkise Glasfläche. Außen etwa
     9 × 9, nicht „lang und schmal“. Vorschlag: Stich auf x 31–32 legen; Dach mit Aufbauten
     (Lüfter, Kante) oder anderes Dachbild.
  7. **Laubharker (23, 9):** steht in einer rundum gesperrten Tasche (22–28, 9–10) hinter Haus
     Martínez und hat einen Sprechtext; man kommt nicht an ihn heran. Vorschlag: Busch (21, 8) oder
     `mf4BuschKlein` (29, 9) um ein Feld versetzen.
  8. **Kleinigkeiten:** `svHausGruen` steht zweimal (33, 7) und (14, 31), als 4 Kacheln breites
     Häuschen neben 9 Kacheln breiten Villen (als Gartenhaus lesbar, aber doppelt). Blockhütte
     `sc7Ferienhuette` (58, 33) ist stilfremd neben dem Spielplatz. Der Statist `maler` (9, 24)
     „streicht den Gartenzaun“ ausgerechnet vor dem Whitlock-Zaun, obwohl das Haus das einzige
     ungestrichene sein soll: vor Lilys Zaun (18, 24) stellen. Zweite Schultür (52–55, 20) hat
     keinen Auslöser. Bank (55, 22) überdeckt die rechte Treppenwange.

- **Rückmeldungen des Autors:**
  - R002 (Schuppen als Abziehbild): **erledigt.** An der Stelle steht ein Häuschen mit grünem Dach
    und Tiefe (14, 31).
  - R055 (Abziehbilder): **teilweise.** Zwei flache Rückansichten offen (Befund 2); das blaue
    Gartenhaus `mf7Gartenhaus` (3, 3) hat Dach und Seitenfläche, wirkt aber grell.
  - R042 (Bodenübergänge): **erledigt** nach Augenschein: Gehwege mit Bordstein, Sand und Erdweg mit
    weichem Saum.
  - R008/R020 (Figuren): **teilweise.** Calloway steht statt zu sitzen; sonst plausible Plätze.
  - R034 (Weltpuzzle): siehe unten.
  - R060 (Kartenwechsel erst beim Gehen zur Tür): am Bild nicht prüfbar.

- **Simulation:** `juno_zum_club` und `calloway_auf_dem_weg` sind Zweige im Knoten `juno`; Juno und
  Calloway stehen erreichbar auf der Karte. Es liegt an der Reihenfolge der Bedingungen, nicht an
  einem fehlenden Auslöser.

- **Weltpuzzle (Ostrand zum Park):** Die Straße (y 25–27) und beide Gehwege passen genau an den
  Park (y 15–17). Der Fluss, der im Park am Westrand bei y 1–4 liegt, träfe hier auf den Rasen neben
  der Schule (y 11–14); der Bach dieser Karte verlässt sie oben bei x 35–37. Beim Spielen sieht man
  beide Ränder nie zugleich, es stört also nicht sichtbar; auf einer Weltkarte ist es ein Bruch.
  Uferweg (Park y 7–8) und Gasse (y 41) enden jeweils blind am Rand (Befund 5).

- **Zustände:** keine Fassung vorhanden; Stufen laufen nur über Figuren mit Bedingung.

- **Gut gelungen:**
  - Das Whitlock-Haus fällt neben zwei gleichen, farbigen Villen sofort auf.
  - Schule mit Freitreppe, Fahnenmast und Haltestelle ist ein klares Ziel am Ende der Straße.
  - Spielplatz auf Sand mit Trampelpfad, Tor und Bänken wirkt gebaut, nicht hingestellt.
  - Ruhige Ordnung: Zäune, Briefkästen, Laternen in gleichem Abstand; nichts aus „Nicht hier“.

### mapleFalls.park – Stadtpark (44 × 32)

- **Gesamturteil:** abnahmereif **nein**. Wasserfall, Asphaltplatz, Steg und Brücke sind gut gelöst,
  aber die Halfpipe klemmt hinter dem Wartehäuschen und Jo steht sieben Felder entfernt, Mr. Abernathy
  steht auf dem Gehweg statt an seiner Bank, und an der Brücke läuft man auf den Gehwegreihen über
  Wasser.

- **Kartenliste:**

| Punkt                                                                               | Urteil        | Bemerkung                                                                                                                                                                      |
| ----------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Blick auf den Wasserfall                                                            | teilweise     | `mf4Wasserfall` (31, 0), 3 breit, 3 hoch, mit Felswangen, speist den Fluss; gut lesbar, aber klein und am Rand. Kein Platz, von dem aus man „schaut“ (der Nordosten ist leer). |
| Bank mit Thermoskanne, Reiseschach                                                  | teilweise     | Bank (3, 11) mit Brett; eine Thermoskanne erkenne ich nicht.                                                                                                                   |
| Kiosk am Parkeingang (Mr. Patel)                                                    | teilweise     | Limowagen (24, 10) in der Kartenmitte, nicht am Eingang; Verkäufer nur Statist `limoverkaeuferin` (27, 12).                                                                    |
| Halfpipe zurück                                                                     | teilweise     | `mf12HalfpipeHolz` (23, 22), 4 × 3, mit Podesten und Stützen; Lage und Jo siehe Befund 1.                                                                                      |
| Asphaltierter Basketballplatz                                                       | erfüllt       | `mf6Basketballplatz` (1, 20), 13 × 11, Linien, zwei Körbe mit Masten.                                                                                                          |
| Enten am Wasser                                                                     | erfüllt       | drei Enten und Seerosen im Teich (22–28, 25–29), schwimmend ohne Füße.                                                                                                         |
| Figuren Jo, Abernathy                                                               | teilweise     | Jo (16, 25), Abernathy (2, 14): beide frei und erreichbar, beide am falschen Platz (Befunde 1, 2).                                                                             |
| Auslöser `bushaltestelle`, `kiosk`, `landstrasse`, `parkbank`, `steg`, `zedernpfad` | erfüllt       | alle erreichbar; `parkbank` (4, 12) auf der Bank, vom Nachbarfeld aus.                                                                                                         |
| Zustand Steg neu                                                                    | erfüllt       | `nadelMapleFalls >= 1`.                                                                                                                                                        |
| Zustand `schulbus` entfällt                                                         | erfüllt       | nicht mehr in `orte.json`, keine Szene; im Bild **kein Bus**. Rest: `app/public/abenteuer/karten/maple-falls-park-schulbus.json` liegt noch im Auslieferungsordner.            |
| Licht, Ton                                                                          | nicht prüfbar | `wasserfall` eingetragen; `enten`, `rollen`, `voegel` nicht.                                                                                                                   |

- **Befunde:**
  1. **Halfpipe (23–26, 22–24) und Jo (16, 25):** Die Halfpipe stößt oben an das Wartehäuschen
     (24–28, 19–21), links an die Bank (22, 22) und unten fast an den Teich (ab y 25); sie steht
     auf Gras. Jo steht sieben Felder westlich zwischen zwei Seitenbänken am Basketballplatz, ohne
     Brett. Daneben liegt ein leerer Pflasterplatz (17–21, 21–25). Vorschlag: Halfpipe auf den
     Pflasterplatz setzen, Feld (17, 22) („Rollen auf Beton“), Bank (22, 22) bleibt als
     Zuschauerbank; Jo auf (17, 25) oder (16, 24) direkt an die Kante, Blick zur Rampe.
  2. **Abernathy (2, 14):** steht mit dem Rücken zur Bank auf dem Gehweg, zwei Reihen unter seiner
     Bank mit dem Brett (3–4, 11–12). Vorschlag: sitzend auf die Bank neben das Brett, sonst auf
     (5, 12) der Bank zugewandt; Thermoskanne als Ding auf die Bank.
  3. **Brücke, (31–33, 14) und (31–33, 18):** Das Brückenbild deckt nur die Fahrbahn (y 15–17).
     In den Gehwegreihen 14 und 18 ist im Bild Wasser mit Uferkante, die Felder sind aber als
     Dielen `h` begehbar: Man läuft sichtbar über Wasser. Vorschlag: Brücke fünf Reihen hoch (mit
     Gehwegen) oder die sechs Felder sperren, sodass man über die Fahrbahn geht.
  4. **Wartehäuschen `mf6Haltestelle` (24, 19):** steht südlich der Straße und öffnet sich nach
     Süden, also mit dem Rücken zur Fahrbahn. Vorschlag: Haltestelle auf die Nordseite (etwa
     (22, 12), Auslöser (23, 13) am Gehweg) oder ein Bild in Rückansicht mit Tiefe.
  5. **Leere Flächen:** Nordosten (34–42, 1–13) mit drei Bäumen und einer einzelnen Laterne
     (38, 10) ohne Weg; Südosten (29–42, 24–30) mit zwei Bäumen. Vorschlag: im Nordosten ein
     Aussichtsplatz zum Wasserfall (Erdweg ab (34, 14) nach oben, Bank bei (35, 5), Blick nach
     Westen), damit „Blick auf den Wasserfall“ einen Ort bekommt.
  6. **Uferweg am Westrand, (0–1, 7–8):** läuft im Bild aus der Karte, ist bei x 0 gesperrt.
     Vorschlag: bei der Laterne (2, 7) rund enden lassen oder Hecke am Rand zeichnen.
  7. **`mf6Moos` (sechsmal, Reihe 1, etwa (13, 1), (14, 1), (16, 1), (17, 1) …):** blasse
     Umrisszeichnungen, die neben den vollen Büschen wie halb durchsichtige Platzhalter wirken.
     Vorschlag: durch Schilf oder kleine Büsche ersetzen.
  8. **Parkausgang zur Landstraße, (43, 15–17):** Asphalt mit gelber Mittellinie und Gehwegen
     endet am Rand; die Landstraße beginnt auf derselben Höhe als graubrauner, unmarkierter Belag.
     Vorschlag: die letzten Felder (38–43) nach Regel 10.73 ausdünnen (Gehweg endet bei 38,
     Mittellinie endet, Belag wechselt innerhalb der Karte), dasselbe Stück am Anfang der Landstraße.

- **Rückmeldungen des Autors:**
  - R021 (Basketballplatz): **erledigt.** Außenplatz auf Asphalt mit Körben an Masten.
  - R022 (Holzgebilde, Halfpipe): **teilweise.** Neues Bild mit Podesten, Stützen und sichtbarer
    Fahrfläche, klar als Halfpipe lesbar; es bleibt eine frontale Schnittansicht, und der Platz
    ist schlecht (Befund 1).
  - R023 (Brücke zu kurz): **teilweise.** Das Bild (etwa x 30,8–34,2) überdeckt den Fluss
    (x 31,4–33,6) jetzt ganz, ohne Spalt; offen sind die Gehwegreihen (Befund 3).
  - R024 (kaputter Steg halb auf dem Ufer): **erledigt.** Die Planken (5–6, 3–4) liegen ganz
    im Wasser, davor Absperrbock „GESPERRT“ (4–6, 5–6).
  - R025 (zwei Stege): **erledigt** im Sinn einer Klärung: links der Steg zur Aussicht (endet im
    Fluss, Auslöser `steg` (5, 7)), rechts die Fußbrücke (10–11, 2–4) zum Zedernpfad mit Wegweiser.
  - R026 (Stege nicht umgehbar): **erledigt.** Links reicht das Wasser bis zum Kartenrand (y 1–4,
    x 0–9), das Nordufer ab x 12 ist mit Bewuchs gesperrt; vom Steg kommt man nicht hinüber.
  - R036 (Übergang zur Landstraße): **offen** (Befund 8).
  - R008/R020: **offen** für Abernathy, **teilweise** für Jo; der Rentner auf der Bank (17, 11)
    sitzt gut, mit Blick zum Fluss.
  - R031 (Abkürzungen): hier ohne Belang, der Park ist offen.

- **Simulation:** `jo_nach_niederlage` setzt eine verlorene Partie gegen Jo voraus; Jo steht
  erreichbar auf der Karte. Es liegt am Verlauf, nicht an der Karte.

- **Weltpuzzle (Ostrand zur Landstraße):** Die Fahrbahn (y 15–17) trifft die Fahrbahn der
  Landstraße; der gemeldete Bruch y 14–18 betrifft nur die Gehwegreihen 14 und 18 und fällt neben
  dem Belagwechsel (R036) nicht eigens auf. Der Fluss verlässt den Park bei y 20–23, auf der
  Landstraße ist das Wasser am Westrand von etwa y 20 bis 30 breit: Das Nordufer passt, das Südufer
  springt um sechs Kacheln (Park y 24–29 Gras gegen Wasser). Im Spiel sieht man es nicht, auf der
  Weltkarte schon. Vorschlag: den Fluss im Park in den letzten vier Spalten nach Süden aufweiten.

- **Zustände:**
  - `steg-neu` (`nadelMapleFalls >= 1`): Die Pixel-Differenz liegt allein in (4–6, 2–6): morsche
    Planken und Absperrbock sind weg, ein neuer Steg mit Geländer (5–6, 2–4) führt gerade in den
    Fluss und endet im Wasser; die Stegfelder sind begehbar, sonst ist alles gleich. Passt zur
    Kartenliste. Anmerkung: Der Steg sieht genauso aus wie die Fußbrücke daneben, und die „Aussicht
    auf den Wasserfall“ ist von dort 25 Felder entfernt.
  - `schulbus`: entfällt; in keiner der beiden Fassungen steht ein Bus (Szene 13 ohne Schulbus ist
    damit erfüllt).

- **Gut gelungen:**
  - Der Fluss mit Wasserfall, Biegung unter der Brücke und Ausfluss nach Osten gibt dem Park eine
    klare Form.
  - Morscher Steg mit Absperrung und Trampelstich davor erzählt sofort, was hier los ist.
  - Limowagen, Zebrastreifen und Haltestelle bilden eine glaubwürdige Mitte.
  - Rentner in Rückansicht auf der langen Bank, Krähen auf dem Weg, Enten im Teich.

### Zwingend vor der Abnahme

- `mapleFalls.aussen`: Calloways Platz als Veranda mit zwei Stühlen, sie sitzend, Laterne aus dem
  Stuhl (Befund 1); Fahrrad am Zaun der Martínez (Befund 3); die zwei flachen Rückansichten
  tauschen (Befund 2).
- `mapleFalls.aussen`: Kreidebrett auf neun Felder in einer Reihe bringen oder vom Autor als
  Fassung bestätigen lassen; Fassung nach `lilyGeholfen` fehlt.
- `mapleFalls.park`: Halfpipe auf den Pflasterplatz und Jo an ihre Kante (Befund 1).
- `mapleFalls.park`: Abernathy an oder auf seine Bank (Befund 2).
- `mapleFalls.park`: Gehwegreihen an der Brücke (Befund 3).
- Beide: blinde Wegenden an den Kartenrändern schließen (außen Befund 5, Park Befund 6).

### Nicht geprüft

- Licht, Musik, Geräusche, Teilchen und die Stille S1: nur die Einträge in `orte.json` gelesen.
- Kartenwechsel im laufenden Spiel (R060), Bewegung der Statisten, Blickrichtungen im Spiel: Die
  Bilder zeigen alle Figuren gleichzeitig und von vorn, auch die mit Bedingung (Owen, `carlaSchule`).
- Erreichbarkeit stammt aus der Sperrmaske der Pipeline, nicht aus der App.
- Victors Wagen vor der Schule (nur während der Szene) und die Fassungen `maple-falls-aussen-b/-c`
  unter `szenen/varianten` nicht angesehen.
- Ink-Dialoge nur so weit gelesen, wie nötig, um die drei unerreichten Knoten einzuordnen.
- Innenräume (Tür innen gegen außen, 10.74 bis 10.76) gehören nicht zu meinen Karten; außen gemessen:
  Whitlock-Tür auf x 3, Dinertür auf x 31–32, Schultür mit Auslöser auf x 47–48.
- Thermoskanne auf Abernathys Bank: im Bild nicht zu erkennen, ich kann nicht sagen, ob sie fehlt
  oder nur zu klein ist.

## Maple Falls innen

Geprüft am Bild (alle 12 Fassungen zweifach vergrößert mit Kachelraster, Ausschnitte bis achtfach), an den Szenendateien, an `orte.json`, an der Laufmaske (`pipeline.abenteuer.karten.blockiert/erreichbar`, nur gelesen) und an drei Ausschnitten der Außenkarte (Whitlock-Haus, Schule, Diner). Koordinaten sind Kacheln ab oben links, am Raster abgelesen oder aus der Szenendatei.

Vorweg, quer über alle fünf Räume:

- Laut Laufmaske ist in allen 12 Fassungen jeder Auslöser, jede Figur und jeder Ausgang vom Startfeld aus erreichbar; kein Befund „nicht erreichbar“.
- Die Kartenliste ist an mehreren Stellen überholt: Zimmer des Helden, Fassung `wohnzimmer-tisch`, Auslöser `kisteWhitlock`, `fensterbank`, `tischPizzakarton`, `bildschirmPult` und Figur `hector` gibt es inzwischen. Diner ist von 30 × 16 auf 16 × 13 verkleinert.
- Fensterseite: Alle Fenster hängen (bauartbedingt) an der Nordwand, die Türen liegen im Süden. „Fenster zur Straße“ (Zimmer) und „Blick auf den Fahnenmast“ (Clubraum) lassen sich so im Bild nicht einlösen; siehe Befunde.

---

### mapleFalls.wohnzimmer – Wohnzimmer und Küche im Whitlock-Haus (20 × 13)

- **Gesamturteil:** abnahmereif ja, mit kleinen Nacharbeiten; der Ort liest sich sofort (Umzugstag, zwei Räume, Treppe, Mama in der Küche), alle drei Fassungen sind schlüssig.

- **Kartenliste:**

| Punkt                                                            | Urteil    | Bemerkung                                                                                                                                                                                 |
| ---------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lichtstreifen durch das Fenster                                  | fehlt     | im Bild kein Streifen auf dem Boden (kann Sache der Lichtschicht T6 sein; im gerenderten Bild nicht zu sehen)                                                                             |
| Ahornast vor dem Fenster                                         | erfüllt   | Fenster (4–5, 1–2) zeigt Rot/Orange; die Kommode davor verdeckt das untere Drittel                                                                                                        |
| Umzugskisten                                                     | erfüllt   | 5 Gruppen im Wohnzimmer, 3 in der Küche, Tischpaket (14, 7)                                                                                                                               |
| Treppe nach oben                                                 | teilweise | steht bei (1–3, 1–4), Auslöser auf (1–3, 3–4); wirkt als flaches Frontbild (siehe Befund 1)                                                                                               |
| Küche mit Kühlschrank                                            | erfüllt   | Zeile (13–16, 2–3), Herd (17), Kühlschrank (18, 1–3)                                                                                                                                      |
| Figur Mama                                                       | erfüllt   | (16, 7) frei stehend, blickt in den Raum; in `-tisch` (17, 8), in `-ausgepackt` (17, 7)                                                                                                   |
| Auslöser `haustuer`, `treppeOben`, `kartonKueche`, `pizzakarton` | erfüllt   | alle erreichbar                                                                                                                                                                           |
| Auslöser `tischPizzakarton` (Zustand)                            | erfüllt   | (15, 7) in `-tisch` und `-ausgepackt`, in `orte.json` gebunden                                                                                                                            |
| Zustand Tisch nach `ersterAbendGesehen`                          | erfüllt   | neue Fassung `-tisch`                                                                                                                                                                     |
| Grundriss 10.74–10.76                                            | teilweise | 20 breit statt höchstens 18 (bekannt, bleibt laut Szenentext); Tür innen Spalte 5 von 20, außen Spalte 3 von 9: beide im linken Drittel, passt; Treppe hinten links hinter der Tür, passt |

- **Befunde:**
  1. Treppe `mf4Treppe` (1–3, 1–4): flaches Frontbild aus waagerechten Latten zwischen zwei Pfosten, ohne Wange und ohne Tiefe; die Pfosten ragen oben über die Wandkante in den Deckenstreifen (y 1). Liest sich eher als Sprossenwand oder Lattenrost als als Treppe (10.71). Vorschlag: Treppenbild mit sichtbaren Trittflächen und Seitenwange, Pfosten auf Wandhöhe kürzen. Betrifft auch `mapleFalls.zimmer`.
  2. Fernseher (7–8, 1.7–2.7): großer Flachbildschirm mitten an der Nordwand. Ortsblatt „Nicht hier: Bildschirme“ (Ausnahmen: Victors Tablet, schwarzer Wagen, der eine Bildschirm im Clubraum). Vorschlag: Autor entscheiden lassen; sonst Radio, Bücherbord oder ein noch verpackter Fernseher im Karton.
  3. Auslöser `pizzakarton` liegt auf (7, 11), das Bild des Kartons auf (7, 10) (Szenendatei: Möbel `mf12Pizzakarton` Feld (7, 10); Pixel-Differenz zur Fassung `-tisch` nur in Kachel (7, 10)). Der Auslöser sitzt also auf dem freien Dielenfeld darunter. Vorschlag: Auslöser auf (7, 10) legen, wie bei den anderen Dingen mit `auf_moebel`.
  4. Stehlampe (10, 5.5–7.4) steht mit dem Fuß am Durchgang zur Küche (11, 7–8); die Maske sperrt (10, 7), frei bleibt nur (10, 8) → (11, 8). Der zwei Felder breite Durchgang wird so auf ein Feld verengt. Vorschlag: Lampe nach (10, 4) neben die Schlafzimmertür.
  5. Fassung `-ausgepackt`: grauer Gegenstand auf (18, 7.4–8.7) neben der Kommode ist im Bild nicht eindeutig zu erkennen (Szenendatei nennt ihn `ca7Muelleimer`; sieht eher wie ein Ofen oder eine Kanne aus). Steht direkt rechts neben Mama (17, 7). Vorschlag: in die Ecke (18, 11) oder neben den Herd.
  6. Grundfassung, Küche: Fläche (13–16, 9–11) und (13–17, 4–5) ist leer, das ist am Umzugstag stimmig; kein Mangel, nur Hinweis.
  7. Mama steht in `-tisch` auf (17, 8) schräg unter dem rechten Stuhl, ohne Bezug zum Tisch. Vorschlag: (17, 7) wie in `-ausgepackt`, Blick zum Tisch.

- **Rückmeldungen des Autors:** R001 erledigt (in `-ausgepackt` unten jetzt Esstisch mit Obstkorb (17–18, 9–10), Palme (14, 10–11), Pflanze (16, 10–11), Sideboard, Bild an der Wand). R005 hier erledigt (Schlafzimmertür (10, 1.6–3) ist ein eigenes kleineres Türbild in Wandhöhe). R065 teilweise (2 Spalten zu breit, vom Szenentext begründet).

- **Zustände:**
  - `-tisch`: Tischpaket (14, 7) und Pizzakarton (7, 10) sind weg; dafür runder Esstisch (14–15, 6.5–8) mit zwei Stühlen und der Pizzakarton unter dem rechten vorderen Bein (15, 7.4–8.1), gut lesbar (als ganzer flacher Karton, nicht gefaltet); passt zur Kartenliste.
  - `-ausgepackt`: alle Kartons bis auf „Küche?“ (12, 10) weg, dafür zwei Bücherregale (1, 6–7) und (9, 9–10), Couchtisch auf dem Teppich, Sideboard, runder Teppich unter dem Esstisch, zweiter Tisch mit Obstkorb, Pflanzen; Tisch mit Pizzakarton bleibt stehen. Passt.

- **Gut gelungen:** klare Zweiteilung Dielen/Fliesen mit offenem Durchgang; die Kartons erzählen den Umzug ohne Laufwege zu verstellen; der Pizzakarton unter dem Tischbein ist als Pointe sofort zu lesen; Tür und Treppe liegen wie am Haus außen.

---

### mapleFalls.dachboden – Dachboden mit dem Brett (14 × 11)

- **Gesamturteil:** abnahmereif nein, weil das Hauptding des Raums, das Brett unter der Decke, im Bild nur ein kleines leeres grün-weißes Brett ohne Decke und ohne Stellung ist; der Rest des Raums ist stimmig.

- **Kartenliste:**

| Punkt                                                                                   | Urteil    | Bemerkung                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brett mit der Stellung                                                                  | teilweise | Brett `mf3BrettKlein` auf dem Rundtisch (7–8, 5.5–6.9), Auslöser (7, 6); im Bild leeres Karomuster, keine Figuren zu erkennen                                                             |
| Decke auf dem Brett, staubfrei, glänzend                                                | fehlt     | keine Decke zu sehen                                                                                                                                                                      |
| Kiste aus Holz mit Schrift neben der Treppe                                             | teilweise | (3–5, 3.3–4.8) direkt neben der Luke, Auslöser `kisteWhitlock` (4, 4) gebunden; Schrift nur „WHITLOCK“, Bild ist ein Pappkarton mit Klebestreifen, keine Holzkiste, und drei Felder breit |
| Hutschachtel, Spiegel, Zeitungen von 1961                                               | erfüllt   | (5, 9), (1, 6–7), (3, 8); alle mit Auslöser                                                                                                                                               |
| Fenster mit Lichtwechsel                                                                | teilweise | rundes Giebelfenster (7–8, 1–2) mit Ahornrot; Lichtkegel darunter (6–8, 3–4) nur sehr blass                                                                                               |
| Treppe mit knarrender neunter Stufe                                                     | teilweise | im Bild Bodenluke mit Leiter (1–2, 2–4); eine Leiter hat keine „neunte Stufe“, und im Geschoss darunter steht eine feste Treppe                                                           |
| Auslöser `brett`, `treppe`, `hutschachtel`, `spiegel`, `zeitungen1961`, `kisteWhitlock` | erfüllt   | alle erreichbar                                                                                                                                                                           |
| Auslöser `fensterbank`                                                                  | erfüllt   | liegt jetzt im Zimmer des Helden                                                                                                                                                          |
| Zustand ohne Brett                                                                      | erfüllt   | nur das Brett fehlt                                                                                                                                                                       |
| Grundriss 10.74–10.76                                                                   | erfüllt   | 14 × 11 im Rahmen; rundes Giebelfenster mittig wie außen im Giebel der Villa; Aufgang in der Nordwestecke wie unten                                                                       |

- **Befunde:**
  1. Brett (7.5, 5.6–6.0): rund 20 Pixel großes grün-weißes Karo ohne Figuren, ohne Decke. Pflicht der Kartenliste (Stellung, Decke ohne Staub, leicht glänzend) nicht erfüllt. Vorschlag: eigenes Bild „Brett unter Decke“ (Tuch mit Faltenwurf, eine Ecke des Bretts mit zwei, drei Figuren schaut heraus, ein heller Glanzpunkt), ruhig 1,5 Felder breit.
  2. Kiste „Whitlock“ (3–5, 3.3–4.8): flaches Frontbild mit weißem Schriftschild, 3 Felder breit, also größer als der Tisch mit dem Brett und viel zu groß für eine Kiste, die der Held allein hinaufträgt; wirkt aufgeklebt (10.71), und es ist Pappe statt Holz. Text nur „WHITLOCK“. Vorschlag: Holzkiste von 1 bis 1,5 Feldern mit sichtbarem Deckel; „nicht wegwerfen“ darf im Ansehen-Text stehen.
  3. Luke mit Leiter (1–2, 2–4): Die Leiter lehnt aus dem dunklen Loch an die Wand, gut lesbar. Aber 10.76 erlaubt Leitern nur zu Heuböden, Rohbau und Stellwerk, der Roman spricht von einer Treppe mit neunter Stufe, und in `mapleFalls.zimmer` führt an derselben Stelle eine feste Treppe hinauf. Vorschlag: Luke mit Treppenkopf (oberste Stufen und Geländer) statt Leiter, oder im Zimmer ebenfalls eine steile Stiege; eines von beiden angleichen.
  4. Kistenstapel (11–12, 6.9–8.9): drei gleiche gelbliche Kartons übereinander als flache Fläche ohne Oberseite, wirkt wie ein Abziehbild (10.71). Vorschlag: zwei Kartons versetzt, einer davon mit sichtbarer Oberseite.
  5. Lichtkegel (6–8, 3–4): nur ein blasser heller Fleck vor der Wand, endet vor dem Teppich; das „Staubgold im Fensterlicht“ des Ortsblatts trägt die Karte allein nicht. Vorschlag: Kegel bis auf Tisch und Teppich (bis y 6) ziehen, etwas wärmer.
  6. Schaukelstuhl aus dem Roman fehlt (steht auch so im Szenentext als Bildwunsch); Platz wäre bei (2–4, 5–6), dort ist die größte leere Fläche.
  7. Zwei kleine eingeschlossene Bodenflächen laut Maske: (11–12, 6) zwischen Truhe und Kistenstapel und (3–4, 9) zwischen Karton und Hutschachtel; ohne Folgen, nur unschön.

- **Rückmeldungen des Autors:** keine eigenen R-Nummern. R055/10.71 (Abziehbilder) offen für Whitlock-Kiste und Kistenstapel.

- **Zustände:** `-ohne-brett`: einzige Änderung ist das fehlende Brett auf dem Tisch (Differenz nur in den Kacheln (7–8, 5–6)); Auslöser `brett` entfällt; passt zur Kartenliste.

- **Gut gelungen:** das runde Giebelfenster entspricht dem runden Fenster im Giebel des Hauses außen; Tisch mit zwei Stühlen auf dem Teppich unter dem Fenster ist klar der Mittelpunkt; nichts Gruseliges (Teddy auf der Truhe, abgedeckte Möbel), „Nicht hier“ ist eingehalten; Laufwege frei.

---

### mapleFalls.zimmer – Zimmer des Helden (16 × 12)

- **Gesamturteil:** abnahmereif ja, mit Nacharbeit an der Treppe; alle Pflichtdinge sind da und erreichbar, das Zimmer wirkt aber noch kahl.

- **Kartenliste:**

| Punkt                                     | Urteil    | Bemerkung                                                                                                                                           |
| ----------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bett                                      | erfüllt   | (12.7–14.9, 7.8–9.3), Kopf rechts                                                                                                                   |
| Schreibtisch mit dem Brett                | erfüllt   | Schreibtisch (13–14, 2.5–3.9), Stuhl (12, 3–4); Brett nur in `-brett`                                                                               |
| Fenster zur Straße mit Laterne davor      | teilweise | Fenster (9–10, 1–2) an der Nordwand; Laterne oder Straße nicht zu sehen                                                                             |
| Fensterbank mit Platz für Funde           | erfüllt   | Brett unter dem Fenster (9–10, 2.8), ein kleiner heller Gegenstand links (der Springer ist nicht als solcher zu erkennen); Auslöser (9, 3), (10, 3) |
| Tür zum Flur                              | fehlt     | keine Tür; Zimmer und Treppenabsatz sind ein Raum                                                                                                   |
| Auslöser `treppe` (hoch/runter)           | erfüllt   | `treppeDachboden` (1–3, 3–4), `treppeUnten` (3–4, 5–9), beide gebunden                                                                              |
| Auslöser `fensterbank`                    | erfüllt   | gebunden an `maple-falls-dachboden.fensterbank`                                                                                                     |
| Auslöser `brett` (nachts) → `erste_nacht` | teilweise | `brettSchreibtisch` (13, 3) nur in `-brett`; gebunden an `maple-falls-dachboden.ambrose`, nicht an `erste_nacht` (nur aus den Daten gelesen)        |
| Zustand Nacht                             | fehlt     | keine eigene Fassung; als Lichtschicht (T6) nicht im Bild prüfbar                                                                                   |
| Grundriss 10.74–10.76                     | teilweise | 16 × 12 im Rahmen; Treppe nach oben an derselben Stelle wie im Wohnzimmer; die Treppe nach unten liegt aber südlich davon (siehe Befund 1)          |

- **Befunde:**
  1. Treppenlauf: Im Wohnzimmer steigt die Treppe bei (1–3, 1–4) nach Norden an. Im Zimmer steht an genau dieser Stelle die Treppe zum Dachboden, und die Öffnung nach unten liegt bei (2.5–5.5, 5.5–9.9) als breiter Lauf nach Süden. Die beiden Karten lassen sich so nicht übereinanderlegen (gleiche Art Bruch wie R066 Bibliothek/Keller). Vorschlag: Öffnung nach unten als schmaler Schacht mit Geländer direkt vor der Nordwandtreppe (1–3, 4–5), oder den Lauf nach unten an die Westwand (1, 5–8) legen.
  2. Treppe nach unten (2.5–5.5, 5.5–9.9): 3 Felder breit, 4,5 Felder lang, mit Pfosten und Geländer; nimmt ein Fünftel des Raums ein und ist breiter als die Haustür. Außerdem ist ihr unteres Ende von Süden über Reihe 10 betretbar: (3, 10) → (3, 9) löst `treppeUnten` aus, man steigt also „von unten“ in eine Treppe nach unten. Vorschlag: Lauf auf 2 Felder Breite kürzen, Felder (3–4, 9) von Süden sperren, Auslöser nur auf (3–4, 5–6).
  3. Leere Mitte: (5–12, 4–9) sind rund 45 freie Dielenfelder mit nur einem rosa Teppich (9–10, 6.2–7.8). Vorschlag: Teppich größer und unter das Bett ziehen, Regal oder Kleiderschrank an die Südwand, ein Karton neben das Bett.
  4. Poster (11.3–12.7, 1.7–2.9): vier grelle Pop-Art-Gesichter, das bunteste Ding im ganzen Haus; passt zur Altersgruppe, beißt sich aber mit „Holzweiß, Ahornrot“ des Ortsblatts. Vorschlag: gedeckteres Poster oder eine Landkarte.
  5. Aufgeschlagenes Buch auf dem Schreibtisch (13.3–14.3, 2.5–3.1) ragt über die Wandkante; in `-brett` liegt das Brett auf dem Buch (halb verdeckt). Vorschlag: Buch in `-brett` entfernen oder Brett nach links setzen.
  6. Fenster ohne Straße: „Fenster zur Birch Lane mit Laterne davor“ ist im Bild nicht einzulösen (Nordwand). Vorschlag: Laternenschein als Lichtfleck auf dem Boden in der Nachtfassung; der Ansehen-Text trägt den Rest.

- **Rückmeldungen des Autors:** keine eigenen (Karte ist neu). Rückfrage R3 (Zimmer bauen) ist damit im Bild beantwortet.

- **Zustände:** `-brett` (nach `ersterAbendGesehen`): einzige Änderung ist das kleine Brett auf dem Schreibtisch (Differenz nur in (13–14, 2–3)) mit dem Auslöser `brettSchreibtisch`; passt zum Dachboden, wo das Brett zur selben Bedingung verschwindet.

- **Gut gelungen:** Brett wandert sichtbar vom Dachboden auf den Schreibtisch (beide Fassungen an derselben Bedingung); Fensterbank ist ein eigenes, gut erkennbares Brett mit freiem Feld davor; Treppe nach oben steht deckungsgleich mit dem Erdgeschoss.

---

### mapleFalls.clubraum – Clubraum der Maple Falls High (26 × 15)

- **Gesamturteil:** abnahmereif nein, weil am Brett weiterhin die weiße statt der schwarzen Dame fehlt und ein Zettel mit Fragezeichen statt des Radiergummis daliegt; außerdem stehen die drei Hauptfiguren wie Säulen im Raum (R020).

- **Kartenliste:**

| Punkt                                                               | Urteil    | Bemerkung                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brett ohne schwarze Dame, Radiergummi an ihrer Stelle               | fehlt     | Tisch (18–19, 7.4–8.8): oben 3 schwarze Punkte, unten nur 2 weiße (die anderen Bretter haben 3 und 3), also fehlt eine weiße Figur; daneben Zettel mit rotem „?“ (19.3–19.8, 7.5–8), kein Radiergummi; auch der Szenentext sagt noch „weiße Dame“ |
| Plakat „Erst zählen“                                                | erfüllt   | (17–18.9, 1.4–2.9), gut lesbar, innerhalb der Wand                                                                                                                                                                                                |
| Pokalvitrine                                                        | erfüllt   | (4–5, 2.2–4.9), Glas, Oberseite sichtbar, zwei Pokale obenauf; „1994“ ist im Bild nicht lesbar                                                                                                                                                    |
| Pult für den Bildschirm                                             | teilweise | Lehrertisch (13–14, 4.4–5.9) ist das Pult; der Bildschirm steht aber auf einem eigenen Ständer bei (19, 4–5.6)                                                                                                                                    |
| Figuren Coach (15, 4), Sam (9, 9)                                   | teilweise | beide da; dazu `carlaClub` (16, 9); alle drei stehen                                                                                                                                                                                              |
| Juno, Mr. Pratt                                                     | fehlt     | keine Figur, kein Platz an der Tür                                                                                                                                                                                                                |
| „Wer Schach spielt, sitzt“ (R020)                                   | teilweise | nur die Statisten (11, 7) und (14, 10) sitzen, halb hinter den Stuhllehnen                                                                                                                                                                        |
| Auslöser `schule`, `brettOhneDame`, `plakatZaehlen`, `pokalvitrine` | erfüllt   | alle erreichbar                                                                                                                                                                                                                                   |
| Auslöser `bildschirmPult` (Zustand)                                 | erfüllt   | (19, 5) in `-bildschirm`, gebunden                                                                                                                                                                                                                |
| Zustände Pokal, Bildschirm                                          | erfüllt   | beide vorhanden; Carla am Brett ab Stufe D nicht als Fassung (Carla steht schon in der Grundfassung auf (16, 9))                                                                                                                                  |
| Grundriss 10.74–10.76                                               | teilweise | 26 × 15 formal im Rahmen (Schule außen 23 breit); als einzelner „Raum 12“ aber breiter als das ganze Gebäude; kein Hinweis auf Flur oder Treppenhaus                                                                                              |

- **Befunde:**
  1. Brett ohne Dame (18.3–19, 7.6–8.1) und Zettel (19.3–19.8, 7.5–8): falsche Farbe und falscher Ersatz, siehe Tabelle. Vorschlag: Bild `mfc9BrettOhneDame` mit zwei statt drei dunklen Punkten oben und drei hellen unten, auf dem leeren Feld ein kleiner rosa-blauer Radiergummi; Zettel weg (das Ortsblatt kennt einen Zettel erst ab Stufe C, mit drei Ausrufezeichen).
  2. Figuren: Sam (9, 9) steht mitten im Gang zwischen vier Tischen, Carla (16, 9) ebenso, beide mit Blick nach unten, niemand am Brett; Coach (15, 4) steht rechts neben dem Lehrertisch, das ist in Ordnung. Vorschlag: Sam auf den Stuhl links von Tisch (6, 10) oder (12, 10) setzen, Carla nach Kartenliste erst ab Stufe D an den Tisch (18, 7), vorher gar nicht im Raum (Ortsblatt Stufe C: sie schaut von außen durchs Fenster).
  3. Sitzende Statisten: `schuelerin` (11.2, 7–7.9) ist nur als oranger Haarschopf mit halbem Körper hinter der Stuhllehne zu sehen und deutlich kleiner als Sam; `clubmitglied` (14.1–14.9, 9.6–10.9) steht halb vor, halb im Stuhl; `mutterWartet` (1, 10) ist auf der Bank nur als brauner Fleck über der Sitzfläche zu ahnen. R019 („Stuhl auf einer Figur“) ist damit nicht gelöst, nur verlagert. Vorschlag: eigenes Sitzbild oder die Figur auf das Stuhlfeld setzen und den Stuhl dahinter zeichnen.
  4. Bildschirm (19.1–19.8, 4–5.6): kleiner grauer Kasten auf einem dünnen Standfuß, sieht aus wie ein Kartenterminal oder Parkautomat; Aufkleber „Perfect Move – Pilotschule“ nicht erkennbar; steht eingeklemmt zwischen Regal (17–18) und Spinden (20–21), nicht „auf dem Pult“. Vorschlag: Bildschirm doppelt so breit, mit erkennbarem Logo-Aufkleber, auf den Lehrertisch (13, 4.4) oder auf ein Rollpult vor der Tafel bei (11, 5); der Pokal bleibt daneben.
  5. Raum 12 im Erdgeschoss mit Blick auf den Fahnenmast: Der Mast steht außen bei (41, 15–21) vor dem linken Bogenfenster der Schule. Innen liegen die drei Fenster (2–3, 8–9, 23–24) in der Nordwand, die einzige Tür (13, 14) führt als Auslöser `schule` direkt auf den Schulhof (Außenkarte (47–48, 20), linkes der beiden Portale). Es gibt weder Flur noch Raumnummer noch Mast. Vorschlag: neben die Südtür ein Schild „12“; an der Ost- oder Westwand eine zweite, verschlossene Innentür als Andeutung des Flurs mit Treppenhaus (R065, 10.76); der Fahnenmast gehört in den Ansehen-Text eines Fensters.
  6. Raumbreite: Der Raum ist 26 breit, die Schule außen 23; als ganzes Gebäude wäre das im Rahmen (bis 1,5-fach), als ein Zimmer davon nicht plausibel. Die Seitenstreifen (1–3, 5–9) und (20–24, 6–9) sind leer. Vorschlag: nicht verkleinern (Autor kennt den Raum), aber die Streifen nutzen: Flurtür, Garderobe, Demonstrationsbrett an der Wand.
  7. Türlage: außen Portal bei Spalte 8–10 von 23 (linkes Drittel), innen Spalte 13 von 26 (Mitte). Für einen Raum im Gebäude unkritisch, aber nach 10.75 nicht dieselbe Stelle. Vorschlag: Tür innen auf (9, 14) oder so lassen und als Flurtür deuten (dann Befund 5).
  8. Spinde (20–23.9, 3–4.9): Oberseite jetzt sichtbar, aber sehr blass und kontrastarm gegenüber allem anderen im Raum; wirken wie ausgegraut. Vorschlag: Kontrast und Türfugen kräftiger.

- **Rückmeldungen des Autors:**
  - R011 erledigt (Vitrine und Spinde mit sichtbarer Oberseite; Spinde blass, Befund 8).
  - R012 erledigt (seitliche Regale weg, dafür Bänke an West- und Ostwand).
  - R013 erledigt (die drei bunten Rechtecke sind nicht mehr da).
  - R014 erledigt (Plakat endet an der Wandkante).
  - R015 erledigt (Globus steht auf dem Regal (7–8, 2.6–3.8)).
  - R016 erledigt (Pixel-Differenz Grund → Pokal nur in (13–14, 4–5); das Plakat bleibt stehen).
  - R017 erledigt (keine zusätzlichen Stühle in den Fassungen).
  - R018 unverändert in Ordnung (Pokal steht frei auf dem Lehrertisch neben dem Buch).
  - R019 teilweise (kein Stuhl kommt mehr hinzu; aber `clubmitglied` (14, 10) steckt im Stuhl).
  - R020 offen (Hauptfiguren stehen; Statisten sitzen nur halb erkennbar).
  - R005 hier ohne Fall (keine Innentür); R065 teilweise (Flur nicht angedeutet).

- **Zustände:**
  - `-pokal`: ein Pokal auf dem Lehrertisch (13.7–14.4, 4.1–5), sonst nichts verändert; passt.
  - `-bildschirm`: zusätzlich der Bildschirmständer bei (19, 4–5.6) mit Auslöser, Pokal bleibt; passt zur Kartenliste bis auf Form und Ort des Bildschirms (Befund 4). In `orte.json` steht `victorGesehen` nach `nadelMapleFalls >= 1`; ob bei beiden erfüllten Bedingungen die Bildschirm-Fassung gewinnt, habe ich nicht geprüft.

- **Gut gelungen:** sechs Tische mit Brett und Uhr auf dem roten Teppich lesen sich sofort als Schachclub; Nordwand mit Fenstern, Karte, Uhr, Tafel, Pinnwand, Plakat und Urkunde ist auf einer Höhe und ohne Überstand gehängt; alle neun alten Bildmängel an Möbeln sind behoben; Gänge zwischen den Tischen sind überall mindestens zwei Felder breit.

---

### mapleFalls.diner – Diner (16 × 13)

- **Gesamturteil:** abnahmereif nein, weil die Tür innen rechts liegt und außen links (10.75/10.76), die Jukebox fehlt und Theke samt Personal so nicht als Diner-Tresen zu lesen sind.

- **Kartenliste:**

| Punkt                                       | Urteil    | Bemerkung                                                                                              |
| ------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| Lang und schmal wie ein Wagen               | fehlt     | Bodenfläche 14 × 9, fast quadratisch; außen ein Kastenbau mit Flachdach, 8 breit                       |
| Stapel ungelöster Tischsets neben der Kasse | erfüllt   | (3.2–4.1, 7–7.8) am linken Thekenende, Kasse (1–2, 6.5–8.8) daneben                                    |
| Gerahmtes Tischset ab Stufe B               | erfüllt   | Fassung `-tischset`, Rahmen (9, 1.4–2.1)                                                               |
| Jukebox (Klangquelle)                       | fehlt     | nicht vorhanden; in der Ecke steht ein Spielautomat (14, 3.5–5.6)                                      |
| Theke mit Hockern auf der Kundenseite       | teilweise | drei Hocker (3, 5, 7 / 5.7–6.7) nördlich der Theke; Theke selbst wirkt wie ein Tisch auf dünnen Beinen |
| Hector hinter dem Tresen                    | teilweise | Figur (5, 9) vorhanden und gebunden; steht südlich der Theke mit dem Rücken zu Theke und Gästen        |
| Kellnerin, Lkw-Fahrer, Rentnerinnen         | teilweise | alle drei da, aber Fahrer und Rentnerin stehen im Gang statt zu sitzen                                 |
| Mama am Tisch (Abend)                       | fehlt     | keine Fassung, keine Figur (Szene; im Bild nicht prüfbar)                                              |
| Auslöser `dinerAusgang`, `hector`           | erfüllt   | beide erreichbar                                                                                       |
| Grundriss 10.74–10.76                       | teilweise | Größe jetzt im Rahmen (16 × 13 bei erlaubt 16 × 15); Türlage falsch                                    |

- **Befunde:**
  1. Tür: außen Glastüren bei (31–32, 21.5–22.5), also Spalte 2–3 von 8, linkes Drittel, unter der Markise. Innen liegt die Glastür bei (11, 12) von 16, rechtes Drittel. Verstoß gegen „Tür innen an derselben Stelle der Breite wie außen“. Vorschlag: Raum spiegeln oder Tür nach (4, 12) oder (5, 12) legen und die Nischen an die linke, die Theke an die rechte Seite.
  2. Jukebox fehlt (Pflicht, Klangquelle der Musik `diner`). Der Spielautomat (14, 3.5–5.6) mit buntem Bildschirm steht stattdessen da und reibt sich an „Nicht hier: Bildschirme“. Vorschlag: Spielautomat durch Jukebox ersetzen.
  3. Theke (3.7–8.2, 6.8–8.3): rosa Platte auf vier dünnen Beinen, darunter sieht man den Fliesenboden; liest sich als langer Tisch, nicht als geschlossener Tresen. Die Kaffeemaschine (3.6–4.4, 6.4–7) sitzt als grauer Kasten auf der hinteren linken Ecke und wird von den Tischsets überdeckt; ob sie steht oder schwebt, ist nicht zu entscheiden. Vorschlag: Thekenbild mit geschlossener Front; Kaffeemaschine mittig auf die Platte, Tischsets links daneben.
  4. Personalseite: Hector (5, 9) und Kellnerin (3, 9) stehen südlich der Theke und schauen nach Süden in den leeren Raum, die Gäste sitzen nördlich in ihrem Rücken. Die Durchreiche zur Küche (4–5, 1–2.6) liegt hinter den Gästen an der Nordwand, das Personal müsste um die Theke herum. Zugleich ist die „Personalzone“ die offene Fläche vor der Eingangstür; der Held spricht Hector von der Personalseite aus an. R004 ist dem Wortlaut nach umgesetzt, im Ergebnis aber unlogischer als vorher. Vorschlag: Theke an die Nordwand unter die Durchreiche rücken (Reihe 4–5), Hector dahinter (Reihe 3, Blick nach unten zum Gast), Hocker südlich davor; dann stimmen Blickrichtung, Durchreiche und Gesprächsseite.
  5. Statisten: `lkwFahrer` (9, 5) steht frei im Gang neben der Rückenlehne der Nischenbank, weder an der Theke noch auf einem Hocker („isst Pfannkuchen am Ende der Theke“). `rentnerinnen` (12, 6) ist eine einzelne Figur, die zwischen den beiden Nischentischen im Durchgang steht und laut Maske das einzige freie Feld der Reihe 6 zwischen x 11 und x 13 belegt; der Weg über die Ostseite (14, 6–8) zu den Hockern ist damit zu, es bleibt nur der ein Feld breite Durchlass (9, 7–8) zwischen Thekenende und Bank. Vorschlag: Fahrer auf den Hocker (7, 5), zwei Rentnerinnen auf die Bänke (10, 4) und (13, 4).
  6. Leere Flächen: Reihen 3–4 von x 1 bis 9 (zwischen Nordwand und Hockern) und Reihen 10–11 fast über die ganze Breite sind blanke weiße Fliesen; der Raum wirkt halb eingeräumt. Vorschlag: dritte Nische unten rechts, Garderobenständer und Zeitungsständer am Eingang, Läufer von der Tür zur Theke (R010).
  7. Wand: Durchreiche (4–5, 1–2.6) ragt oben bis an die Deckenkante und unten mit dem Tellerbord über die Sockelleiste; die Toilettentür (1, 1.2–2.9) ist jetzt wandhoch. Beides lesbar; die Durchreiche um zwei Pixel tiefer setzen.

- **Rückmeldungen des Autors:**
  - R003 teilweise (Kaffeemaschine sitzt an der Thekenecke, nicht mehr daneben in der Luft; Stand unklar, Befund 3).
  - R004 teilweise (Hocker oben, Personal unten wie gewünscht; neue Unstimmigkeiten, Befund 4).
  - R005a erledigt (Toilettentür als wandhohe Innentür; Tür zum Hinterzimmer entfällt, weil Küche nur noch Durchreiche ist).
  - R006 erledigt (Hinterraum mit Kommode gibt es nicht mehr).
  - R007 gegenstandslos (Küche nicht mehr als Raum gebaut).
  - R008 offen (Hector und Kellnerin mit dem Rücken zu den Gästen; Fahrer und Rentnerin ohne Bezug).
  - R009 erledigt (kein einzelner Barhocker mehr bei den roten Bänken).
  - R010 teilweise (nur eine Fußmatte (11, 11); Fläche weiter leer).
  - R065 erledigt für die Größe, offen für die Türlage.

- **Zustände:** `-tischset`: einzige Änderung ist das gerahmte Tischset an der Nordwand (9, 1.4–2.1) zwischen dem Schulfoto und dem Tellerbild; Bedingung `nadelMapleFalls >= 1 und dinerAbendGesehen` passt zur Kartenliste. Eine Abendfassung mit Mama am Tisch gibt es als Karte nicht.

- **Gut gelungen:** rote Wand, weiße Fliesen, rote Polsternischen und Hocker ergeben sofort „Diner“; der Tischset-Stapel hängt sichtbar über die Thekenkante und ist das erste, was man neben der Kasse sieht; Pinnwand und gerahmtes Set erzählen Hectors Geschichte an der Wand; Raumgröße ist nach 10.75 jetzt in Ordnung.

---

### Knoten, die die Gesamtsimulation nie erreicht (meine Karten)

Nur aus Szenendateien und `orte.json` eingeordnet, Ink nicht gelesen.

- **clubraum** `juno_erst_sam`, `juno_club_alltag`: Auf der Karte gibt es keine Figur Juno (Figuren: `coachDelgado`, `sam`, `carlaClub`); in `orte.json` ist Juno nur an `maple-falls-aussen.juno` gebunden. Vermutlich fehlt der Figurenplatz im Clubraum. `victor_ueberrascht`, `victor_weg`: Victor ist bewusst keine Kartenfigur (nur Szene Kap. 9); also Reihenfolge oder Szenenstart, kein Kartenmangel.
- **dachboden** `epilog`, `epilog_zettel`, `epilog_lily`: Epilog, liegt an der Reihenfolge; auf der Karte fehlt dafür nichts Sichtbares.
- **diner** `hector_c`: Stufe C nach Akt 1; Hector steht auf der Karte und ist gebunden, also Reihenfolge.
- **wohnzimmer** `ankunft`, `nicht_ironwood`: Einstiegsszene und späterer Akt; kein Auslöser auf der Karte nötig, also Reihenfolge oder Einstieg.

---

### Zwingend vor der Abnahme

1. **Clubraum:** Brett mit fehlender **schwarzer** Dame und Radiergummi statt Zettel mit Fragezeichen (heute fehlt eine weiße Figur; auch der Szenentext sagt „weiße Dame“).
2. **Dachboden:** Brett mit Stellung unter der staubfreien Decke als eigenes, erkennbares Bild; Whitlock-Kiste als Holzkiste in tragbarer Größe.
3. **Diner:** Tür innen auf die linke Seite wie außen (oder Raum spiegeln); Jukebox aufstellen; Theke und Hector so stellen, dass er den Gästen zugewandt ist.
4. **Clubraum:** Hauptfiguren sinnvoll platzieren (R020): Sam sitzt am Brett, Carla nicht vor Stufe D im Raum; sitzende Statisten nicht in den Stühlen versenken.
5. **Zimmer/Wohnzimmer/Dachboden:** Aufgang vereinheitlichen: Treppenbild mit Tiefe statt Lattenfläche, Abgang im Zimmer an die Stelle der Treppe im Erdgeschoss, Leiter oder Treppe zum Dachboden einheitlich.
6. **Clubraum:** Bildschirm von Perfect Move als Bildschirm erkennbar und auf dem Pult.

Entscheidung des Autors nötig (kein Bildfehler): Fernseher im Wohnzimmer und Spielautomat im Diner gegen „Nicht hier: Bildschirme“.

### Nicht geprüft

- Ink-Dialoge und Knoteninhalte (auftragsgemäß); die Einordnung der unerreichten Knoten stützt sich nur auf Figuren und Bindungen.
- Licht, Teilchen, Musik, Geräusche (Lichtstreifen, Staub, Nacht- und Abendtönung, Ambrose-Einblendung): im gerenderten PNG nicht enthalten, daher nur als „im Bild nicht zu sehen“ vermerkt.
- Blickrichtungen und Bewegung der Figuren im laufenden Spiel; ich habe nur das Standbild des Renderers gesehen (dort blicken alle stehenden Figuren nach unten). Ob Statisten im Spiel wirklich sitzen oder gehen (Kellnerin „von 1,9 bis 8,9“), ist nur aus den Daten gelesen.
- Die Laufmaske stammt aus `pipeline.abenteuer.karten` (Möbelfelder der Tiled-Karten in `inhalte/abenteuer/karten/`); wie die App Auslöser mit `auf_moebel` auslöst (Betreten oder Ansehen vom Nachbarfeld), habe ich nicht im Code nachgesehen. Der Befund zum Pizzakarton-Auslöser steht unter diesem Vorbehalt.
- `grundrisse.json` habe ich nicht geöffnet; Außenmaße und Türspalten stammen aus der Kartenliste, den Szenentexten und dem Bild der Außenkarte (Ausschnitte Whitlock-Haus x 0–10, Diner x 28–38, Schule x 37–63).
- Welche Fassung gewinnt, wenn zwei Zustandsbedingungen zugleich gelten (Clubraum Pokal/Bildschirm, Wohnzimmer Tisch/ausgepackt).
- `docs/spiel/orte/maple-falls.md` nur an einer Stelle (Tabelle Clubraum) gelesen; die Varianten `szenen/varianten/maple-falls-wohnzimmer-b/c.json` nicht angesehen.
- „1994“ an den Pokalen, „nicht wegwerfen“ auf der Kiste, Aufkleber am Bildschirm und der Springer auf der Fensterbank sind in der Auflösung der Karte nicht lesbar; ob das am Bild liegt oder gar nicht gezeichnet ist, kann ich nicht sagen.

## Der Weg nach Cedar Creek und der Kürbishof

Geprüft am 13.11.2026 an den gerenderten Bildern (alle Karten in Ausschnitten mit Raster angesehen,
Zedernpfad in zehn Ausschnitten), dazu Szenendateien, `orte.json` und eine eigene Laufprüfung
(Breitensuche über Raster und Möbelsperren mit `pipeline.abenteuer.durchgang.gesperrte_felder`, nur
gelesen). Vorab drei Dinge, die für alle Wegkarten gelten:

- **Die Kartenliste ist an drei Stellen überholt.** `apfelstand`, `ada`, `tessa` (Landstraße),
  `tessaFluss` und `faehrstein` (Flussweg), `tessaZedern` (Zedernpfad) stehen inzwischen in den
  Szenendateien und in `orte.json`. Bewertet ist der heutige Stand.
- **Ada und Tessa sind in keinem Bild zu sehen.** Die Figuren stehen in den Daten, aber die Sprites
  `figuren/ada.png` und `figuren/tessa.png` gibt es im Grafikbestand nicht (dort liegen nur
  `wanderer`, `nia`, `walt`, `clover`, `oma-miller` für diese Karten). Der Zeichner lässt sie deshalb
  weg. Ob die App eine Ersatzfigur zeigt, habe ich nicht geprüft.
- **Tiere in der Vorschau:** „Eichhörnchen“ wird als Hase gezeichnet, „Specht“ als Krähe. Ob das nur
  die Vorschau betrifft oder auch die App, ist offen.

---

### wegMapleCedar.landstrasse – Landstraße (120 × 30)

- **Gesamturteil:** abnahmereif **nein**: Die Sperre am Gatter lässt sich durch eine Zaunlücke und das
  Kornfeld umgehen, Ada und Tessa fehlen im Bild, und am Apfelstand ist keine Kasse zu sehen.

- **Kartenliste:**

| Punkt                                                   | Urteil        | Bemerkung                                                                                                                             |
| ------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Rätseltafel am Ortsausgang                              | erfüllt       | Holztafel mit Dach bei (3–4, 12–13), Auslöser `tafel` (4, 13) von der Straße erreichbar; ein Brett ist darauf nicht zu erkennen       |
| Apfelstand am Gatter mit Ehrlichkeitskasse, ansprechbar | teilweise     | Stand mit Äpfeln bei (46–48, 14–17), Auslöser (47, 18); **keine Kasse, kein Zettel** im Bild; steht sechs Felder westlich des Gatters |
| Ortsschild                                              | teilweise     | kleines leeres Holzschild (7, 13), als Ortsschild nicht lesbar                                                                        |
| Großer Himmel                                           | fehlt         | in der Aufsicht nicht darstellbar; die Felder reichen bis an den oberen Rand                                                          |
| Zäune, Felder in langen geraden Linien                  | erfüllt       | zwei Feldreihen, durchgehender Zaun bei y 11                                                                                          |
| Otis' Traktor am Feldrand, Kühe                         | teilweise     | Traktor steht mitten im Kornfeld (32–35, 5–10) über Rahmen und Ähren; drei Kühe und ein Pferd auf der Weide                           |
| Straßenart Landstraße                                   | erfüllt       | grauer Belag, drei Felder breit, deutlich anders als der Trampelpfad                                                                  |
| Figuren Wanderer, Nia                                   | erfüllt       | (67, 16) und (82, 14) an der Bank                                                                                                     |
| Figur Ada                                               | fehlt im Bild | in den Daten bei (49, 16), Sprite fehlt; keine Eimer                                                                                  |
| Figur Tessa                                             | fehlt im Bild | in den Daten bei (54, 13) am Zettelschild, Sprite fehlt                                                                               |
| Otis als Statist                                        | erfüllt       | (30, 12), steht mit dem Rücken zum Korn                                                                                               |
| Auslöser                                                | erfüllt       | alle 14 vorhanden und erreichbar                                                                                                      |
| Zustände Flohmarkt leer, Gatter offen                   | teilweise     | siehe „Zustände“; Zettel und Apfelkern an der Kasse haben kein Bild                                                                   |
| Licht, Ton                                              | nicht prüfbar | `licht: tag`, Musik `weg.m4a`, ein Dauergeräusch (`zaun_wind`); die übrigen Geräusche der Liste stehen nicht in `orte.json`           |

- **Befunde:**
  1. **Gatter umgehbar (52–53, 11).** Im Zaun ist bei (37–39, 11) eine Lücke mit Feldweg. Korn und
     Ackerrahmen sperren nicht, also läuft man durchs Kornfeld nach Osten auf den Hofweg nördlich
     des geschlossenen Gatters, bis (52, 0). Der Übergang selbst hängt an
     `wegMapleCedarTafelBestanden`, aber das Gatter verliert seinen Sinn; über die Felder erreicht
     man auch die Wiese im Nordosten. Vorschlag: Lücke schließen oder mit einem zweiten Tor
     versehen, Ackerflächen sperren.
  2. **Ada und Tessa unsichtbar** (49, 16) und (54, 13): Sprites anlegen. Ada braucht zwei Eimer als
     Möbel neben sich; laut Liste steht sie „auf der Wiese“, in den Daten steht sie direkt am Stand.
  3. **Apfelstand ohne Kasse** (46–48, 14–17): zwei Apfelhaufen auf der Theke, zwei daneben am
     Boden (43, 17) und (49, 17), über die man hinwegläuft (keine Sperre). Vorschlag: kleine
     Blechkasse mit Zettel als eigenes Möbel auf die Theke, Zustandsbilder für Zettel und Apfelkern.
  4. **Übergang vom Park** (Westrand, y 14–18): Im Park endet Asphalt mit gelber Mittellinie,
     Gehwegen und Laternen genau am Kartenrand, hier beginnt sofort der graue Schotterbelag ohne
     Gehweg. Der Bruch stört sichtbar. Vorschlag: die ersten vier bis sechs Felder Asphalt mit
     auslaufendem Gehweg, dann der Wechsel wie am Ostende des Flusswegs.
  5. **Flohmarktplakat auf der Fahrbahn** (92–93, 16–18): Das Schild steht mit zwei Dritteln auf
     der Straße und sperrt (92–93, 17). Vorschlag: ein Feld nach Süden auf das Gras.
  6. **Kurven der Straße in Treppenstufen** (16–20, 13–17), (40–44, 15–20), (61–64, 15–19): rechte
     Winkel, wirkt wie gebaut. Vorschlag: Bogenkacheln des Belags oder flachere Versätze.
  7. **Hase immer noch zu groß** (106, 13): ein Feld breit, Körper so hoch wie der Rumpf des Rehs
     (104, 13–14). Derselbe Hase steht als „Eichhörnchen“ bei (72, 20). Vorschlag: halbe Größe.
  8. **Blauer Schuppen** (56–58, 14–17): leuchtend blaues Dach, in der Tür ein dunkler Kopf. Fällt
     aus der Farbwelt der Karte; Vorschlag: Holzschuppen.

- **Rückmeldungen des Autors:** R036 teilweise (Belag jetzt Straße, der Wechsel am Rand bleibt hart) ·
  R037 erledigt · R038 erledigt (Ähren und Mais liegen in den Rahmen) · R039 erledigt · R040
  teilweise (Ware da, Figur am Stand nicht sichtbar) · R041 erledigt (Kiesfläche mit weichem Saum) ·
  R043 teilweise · R044 erledigt (Flügel stehen offen; die Pfosten wechseln dabei von Holz zu grauem
  Metall) · R031 offen (Befund 1) · R127 nach Augenschein in Ordnung (Seiten der Kuhweide) · R060
  nicht am Bild prüfbar.

- **Zustände:**
  - `-flohmarkt-leer`: Tische, Kartons und Kiste fehlen (89–99, 19–25), sonst gleich. Wohnmobil,
    beide Plakate „Flohmarkt SA“ und die Statisten Verkäuferin (95, 22) und Kunde mit Lampe (94, 21)
    bleiben auf dem leeren Hof stehen; das passt nicht.
  - `-gatter-offen`: einzige Änderung (51–55, 11), Torflügel zur Seite geklappt, Durchgang frei.
  - `-gatter-offen-leer`: beide Änderungen zusammen, sonst nichts.

- **Gut gelungen:** die langen Feldreihen mit sauber gefüllten Rahmen; der Flohmarkthof mit weichem
  Kiesrand und Wohnmobil; Kuhweide mit Tor, Tränke und Zettelschild; die Straße liest sich als
  Busstrecke.

---

### wegMapleCedar.flussweg – Flussweg (120 × 30)

- **Gesamturteil:** abnahmereif **nein**: Das Wahrzeichen, der Stein mit dem eingeritzten Brett, ist
  im Bild nicht zu erkennen, die Zedern am Ende fehlen, und der Fluss endet am Ostrand vor den
  Häusern von Cedar Creek.

- **Kartenliste:**

| Punkt                                                    | Urteil        | Bemerkung                                                                                                                                                                      |
| -------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fährstelle mit Stein mit eingeritztem Brett, ansprechbar | teilweise     | Auslöser `faehrstein` (58, 21) vorhanden und erreichbar; dort liegt aber das Finkenzeichen (`mf8Finkenzeichen`), ein kleiner Feldstein auf blauer Platte, kein Brett erkennbar |
| Angler Silas                                             | teilweise     | Statist auf dem Steg (56, 24), ohne Angel, schaut zum Betrachter; kein eigener Knoten                                                                                          |
| Zedern am Ende des Flusswegs                             | fehlt         | am Ostende nur Laubbäume, keine Zeder in der Szene                                                                                                                             |
| Pfad folgt dem Ufer, nichts gerade                       | teilweise     | Schwünge im Westen und in der Mitte; x 75–106 dreißig Felder schnurgerade                                                                                                      |
| Tessa ab Stufe B                                         | fehlt im Bild | `tessaFluss` (58, 19), Sprite fehlt; Wasserflasche am Steg fehlt                                                                                                               |
| Auslöser                                                 | erfüllt       | alle vorhanden und erreichbar; `rast` (86, 13) Bank, `schildCedar` (112, 20)                                                                                                   |
| Zustände                                                 | erfüllt       | keine                                                                                                                                                                          |
| Licht, Ton                                               | teilweise     | Bild so hell wie die Landstraße, kein Schattengrün; `licht: tag`, Musik `weg.fluss.m4a`, Geräusch `fluss`                                                                      |

- **Befunde:**
  1. **Stein mit Brett nicht da** (58, 21): Das Ding unter dem Auslöser ist das Finkenzeichen; der
     Auslöser `finchBauerA` liegt dagegen bei (54, 21) im Gras vor der Bank. Vorschlag: einen
     flachen, zwei Felder breiten Stein mit sichtbaren Feldern bauen, an die Fährstelle legen, und
     Finkenzeichen und `finchBauerA` auf dasselbe Feld bringen.
  2. **Fluss endet am Ostrand** (119, 21–29): Daneben liegt in Cedar Creek Pflaster mit Häusern.
     Vorschlag: das Ufer ab etwa x 112 nach Süden schließen (der Fluss biegt ab) oder Cedar Creek
     bekommt am Westrand Wasser.
  3. **Keine Zedern am Ende** (x 105–119, y 0–12): Vorschlag: die Laubbäume dort durch
     `wg4Zeder` ersetzen, dichter gestellt, damit der Weg ins Rot der Stämme läuft.
  4. **Zwei Figuren auf einem Feld** (58, 19): `tessaFluss` und der Statist `kindSteinehuepfen`.
     Dazu joggt Tessa als Statistin `joggerin` (100–116, 15) in jeder Stufe, also auch in Stufe A,
     in der sie laut Ortsblatt nur die Landstraße läuft. Vorschlag: Statistin streichen, Kind um
     zwei Felder versetzen.
  5. **Übergang zum Asphalt** (106–110, 14–18): Vor dem Ort weitet sich der Schotter, dann beginnt
     bei x 110 der Asphalt mit einer senkrechten Kante, der Gehweg setzt ohne Anfang ein, ein Stein
     liegt auf seinem ersten Feld (110, 18). Besser als vorher, aber noch ein Schnitt.
  6. **Boote nicht festgemacht** (100–102, 22–23), (52–54, 23–24), (58–60, 23–24): Am Poller (99, 20)
     liegt eine Seilrolle (99, 21), sie führt nicht zum Boot.
  7. **Ufer springt am Westrand** (0, 20–25): Auf der Landstraße liegt am Ostrand bis y 25 Wiese,
     hier beginnt das Wasser bei y 20. Die Straße selbst (y 15–17) schließt sauber an.
  8. **Enten zu groß** (50–54, 25–26): etwa so breit wie eine Figur.

- **Rückmeldungen des Autors:** R049 teilweise (Befund 5) · R050 teilweise (Poller und Seilrolle da,
  Boot nicht angebunden) · R034 für diese Karte offen (Befunde 2 und 7) · R031 ohne Befund (kein
  Weg, den man abkürzen dürfte).

- **Zustände:** keine Fassungen.

- **Gut gelungen:** der Steg mit Booten, Fässern, Bank und Kisten als klarer Mittelpunkt; das
  gebuchtete Ufer; viel Kleinkram am Wegrand ohne Gedränge; die Straße ist durchgehend drei bis fünf
  Felder frei, nichts steht im Weg. Ein Schlüssel oder Schilf liegt hier nicht, weder im Bild noch
  in den Daten, wie verlangt.

---

### wegMapleCedar.zedernpfad – Zedernpfad (240 × 34)

- **Gesamturteil:** abnahmereif **nein**: Spielerisch ist die Karte in Ordnung (der Pfad ist der
  einzige Weg, vier vollständige Treppen), aber sie sieht aus wie eine hellgrüne Baumschule in
  Reihen statt wie ein dichter, rotbrauner Zedernwald, und die Felsstufen lesen sich als braune
  Bänder.

- **Kartenliste:**

| Punkt                              | Urteil        | Bemerkung                                                                                                                                               |
| ---------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Öffnet erst nach der zweiten Nadel | teilweise     | am Park gesperrt (`zedernpfad` und `zedernZurueckPark` mit `nadelCedarCreek`); der Zugang aus Cedar Creek (`cedarCreek.zedernpfad`) hat keine Bedingung |
| Dichter, stiller Wald              | teilweise     | lückenlos gestellt, aber in geraden Reihen wie gepflanzt                                                                                                |
| Rotbraun unter den Zedern          | fehlt         | Boden überall hellgrünes Gras, Bäume hellgrün; die meisten sind `wg4Kegelbaum` und `wg4ZederSchmal`, keine roten Stämme                                 |
| Treppen im Fels vollständig        | erfüllt       | vier Holztreppen (59–60, 22–24), (109–110, 10–12), (149–150, 10–12), (194–195, 22–24), ohne Lücken                                                      |
| Licht, Ton                         | nicht prüfbar | `licht: dunst`, Musik `weg.zedern.m4a`, Geräusch `wald_still`; im Bild heller Tag                                                                       |

- **Befunde:**
  1. **Wald wie eine Plantage** (ganze Karte): drei Baumbilder in waagerechten Reihen im
     Zweifelderabstand, 666 Bäume. Vorschlag: Reihen versetzen und überlappen, `wg4Zeder` mit
     rotem Stamm als Hauptbaum, Unterholz (Farn, Stümpfe, Äste) auch abseits des Pfads.
  2. **Kein Waldboden** (ganze Karte): Vorschlag: Boden „Nadelstreu“ rotbraun unter den Bäumen,
     Gras nur auf den Lichtungen; passt dann zu `schritt_nadeln`.
  3. **Felsstufen als Bänder** (y 10–12 und y 22–24, x 0–239): durchgehend drei Felder hoch,
     schnurgerade, ohne Oberkante, Vorsprünge oder Schatten; oben und unten dasselbe Gras. Die Höhe
     ist nicht zu spüren. Vorschlag: Kante mit Versätzen, oberer Rand mit Grasnase, Schattenreihe
     am Fuß.
  4. **Zugang aus Cedar Creek offen:** Wer in Cedar Creek ankommt, kann den Pfad sofort betreten
     und bis an den Parkausgang laufen; erst dort hält ihn der Stamm auf. Vorschlag: dieselbe
     Bedingung `nadelCedarCreek` am Auslöser in Cedar Creek. (Aus den Daten geschlossen.)
  5. **Sturmholz sperrt den Pfad** (85–88, 15–16): Beide Pfadreihen sind gesperrt, man geht über
     das Gras bei y 14 oder 17 herum. Die Beschreibung sagt „man steigt darüber“. Vorschlag: einen
     Stamm ohne Sperre oder die Lücke sichtbar machen.
  6. **Pfad in rechten Winkeln** (z. B. 38–39, 26–30; 74–76, 15–20; 124–125, 3–7): Vorschlag:
     Bögen über zwei bis drei Felder.
  7. **Tiere:** Hase (204, 28) und das „Eichhörnchen“ (162, 17) sind so breit wie das Kind
     daneben (164, 18); „Kinder mit Zapfen“ ist ein einzelnes Kind, kein Eimer zu sehen.
  8. **Leere Kuppe** (130–150, 0–9): Lichtung mit Baumstammbank und Maler (135, 7), aber ohne
     Staffelei und ohne den Steinkreis aus der Beschreibung (nur vier lose Steine).

- **Rückmeldungen des Autors:** R027 erledigt · R028 erledigt und R029 erledigt (beide Stufen laufen
  von Rand zu Rand, nur Treppen führen hinauf) · R030 erledigt (Laufprüfung: 650 freie Felder im Wald
  sind abgeschnitten, kein Weg am Gebirge vorbei) · R031 erledigt für diese Karte · R032 erledigt
  (240 Felder, so lang wie Landstraße und Flussweg zusammen) · R033 offen (in Cedar Creek mündet der
  Pfad bei y 4–5, nur 15 Felder über der Straße des Flusswegs; laut Weltpuzzle liegt er damit auf
  dem Flussweg; Verbindungsstücke gibt es nicht).

- **Zustände:** keine Fassungen.

- **Gut gelungen:** die Höhenlogik stimmt jetzt lückenlos; saubere, vollständige Treppen; kleine
  Halte am Weg (Pilzlichtung, Sturmholz, Kuppe, Rastplatz mit Hackklotz); Ein- und Ausgang liegen
  passend zu Park (oben) und Cedar Creek (Westrand oben).

---

### kuerbishof.hof – Kürbishof (48 × 34)

- **Gesamturteil:** abnahmereif **ja, mit zwei Nacharbeiten**: Der Hof liest sich sofort (Irrgarten
  mit Morphy, Kürbisfeld, Scheune, Windrad), offen sind die unsichtbare Kürbiswaage und Oma Millers
  Platz.

- **Kartenliste:**

| Punkt                            | Urteil        | Bemerkung                                                                                                                                   |
| -------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Irrgarten                        | erfüllt       | Maisgänge auf durchgehender Erde (1–13, 0–18), Eingang unten bei (10–11, 15–19)                                                             |
| Vogelscheuche mit Schachbrett    | erfüllt       | Morphy mit Zylinder und Brett auf der Brust (6–8, 5–7), Auslöser (7, 9) erreichbar                                                          |
| Kürbiswaage                      | fehlt im Bild | Auslöser (2, 25) liegt auf dem nackten Hofweg; keine Waage, die Kürbiskisten stehen zwei Felder weiter                                      |
| Hofladen (Oma Miller)            | teilweise     | Stand (4–6, 21–24) mit leerer Theke und zwei Kürbiskisten; davor steht die Statistin, Oma Miller steht bei (7, 26) vor dem Weidetor         |
| Windrad                          | erfüllt       | (24–26, 0–5) zwischen den Obstbäumen                                                                                                        |
| Hühner                           | teilweise     | drei Hühner bei (20–22, 10) direkt am Dachfirst des Hauses, wirken wie auf dem Dach                                                         |
| Figuren Walt, Clover, Oma Miller | erfüllt       | (41, 23), (10, 22), (7, 26), alle erreichbar                                                                                                |
| Auslöser                         | erfüllt       | alle vier vorhanden und betretbar                                                                                                           |
| Licht, Ton                       | teilweise     | Orange und Strohgelb durch Kürbisse, Heu, Mais; Musik `weg.kuerbishof.m4a`, Geräusch `huehner`; kein `licht`, kein `windrad` in `orte.json` |

- **Befunde:**
  1. **Kürbiswaage unsichtbar** (2, 25): Vorschlag: Waage mit drei Kürbissen als Möbel links
     neben den Laden bei (1–2, 23–24), Auslöser darauf (`auf_moebel`).
  2. **Oma Miller nicht am Laden** (7, 26): Sie steht neben der fast gleich aussehenden
     „Pferdefrau“ (9, 26), zwei graue Köpfe nebeneinander; am Laden steht die Statistin (4, 25).
     Vorschlag: Oma Miller auf (4, 25) oder hinter die Theke, Statistin streichen, Kuchen oder
     Kürbisse auf die Theke.
  3. **Kürbisfeld begehbar** (33–46, 2–18): Weder Kürbisse noch Rahmen sperren, man läuft über
     die Ernte; der Erntehelfer (36, 10) steht auf dem Rahmen. Vorschlag: Feld sperren bis auf
     eine Gasse, Helfer in die Zaunlücke (41–42, 19).
  4. **Hofweg läuft an beiden Seiten aus der Karte** (0, 25–26) und (47, 25–26): Die Randfelder
     sind gesperrt, das Bild verspricht Ausgänge. Vorschlag: Weg zwei Felder vorher enden lassen
     oder mit Zaun und Tor schließen.
  5. **Weg führt am Wohnhaus vorbei** (19–20, 19–24): Der Stichweg endet unter dem Fenster, die
     Tür liegt bei (22, 17–18). Vorschlag: Stichweg auf x 22.
  6. **Pferd läuft durch den Apfelbaum** (13–21, 30): Kopf des Pferdes überdeckt den Stamm
     (15, 28–31). Vorschlag: Laufstrecke auf y 32 oder Baum versetzen.
  7. **Wiederholung zum Nachbarn:** Das Wohnhaus (15–24, 10–18) ist dasselbe Bild in denselben
     Farben wie das Haus am Flohmarkt der Landstraße, der Hofladen dasselbe wie Adas Apfelstand.
     Vorschlag: eines der Häuser umfärben, dem Hofladen ein eigenes Dach geben.
  8. **Oberer Ausgang im Irrgarten** (7, 1–2): Lücke in der obersten Maisreihe führt an den
     gesperrten Kartenrand, eine Sackgasse ohne Sinn. Vorschlag: schließen.

- **Rückmeldungen des Autors:** R045 erledigt (Endpfosten an allen vier Enden) · R046 erledigt · R047
  erledigt (dunkle Ackererde mit Holzrahmen) · R048 erledigt (Mais auf durchgehendem Boden, Gänge
  klar) · R033 offen (Lage in der Welt, am Bild nicht prüfbar; Ausgang unten 23–24 passt zum Hofweg
  52–53 der Landstraße) · R127 nach Augenschein in Ordnung (Seiten der Kuhweide).

- **Zustände:** keine Fassungen.

- **Gut gelungen:** Morphy mit Zylinder und Schachbrett in der Mitte des Irrgartens; das Kürbisfeld
  in Reihen mit Krähen und zweiter Vogelscheuche; Scheune mit Traktor von vorn; Walt am Schwein,
  Clover am Eingang des Irrgartens.

---

### Übergänge und Randbrüche (am Bild geprüft)

| Naht                               | Was man sieht                                                                            | Stört es?                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------ |
| Park → Landstraße (y 14–18)        | Asphalt mit Mittellinie, Gehweg und Laterne enden am Rand; drüben Schotter ohne Gehweg   | ja (Landstraße Befund 4, R036) |
| Park → Landstraße (y 24–29)        | Nordufer passt (y 20); im Park Südufer mit Wiese, auf der Landstraße Wasser bis zum Rand | wenig, der Fluss wird breiter  |
| Landstraße → Flussweg (y 15–17)    | Straße schließt sauber an                                                                | nein                           |
| Landstraße → Flussweg (y 20–25)    | Ufer springt um fünf bis sechs Felder nach Norden                                        | etwas (Flussweg Befund 7)      |
| Flussweg → Cedar Creek (Straße)    | Asphalt, Mittellinie und Gehwege laufen durch                                            | nein                           |
| Flussweg → Cedar Creek (y 21–29)   | Wasser gegen Pflaster und Häuser                                                         | ja (Flussweg Befund 2)         |
| Cedar Creek y 5 gegen Flussweg y 0 | Zedernpfad mündet direkt über dem Flussweg                                               | Weltlogik, R033                |

### Nie erreichte Knoten (Einordnung)

- `apfelstand_c`: Auslöser `apfelstand` ist da; Stufe C kommt erst nach Akt 1, also Reihenfolge.
- `tessa_d`: Für Stufe D (`nadelIronwood > 0`) steht keine Tessa mehr auf einer Karte (drei
  Figuren, alle mit Bedingung bis Ironwood); der Knoten braucht einen Einstieg, etwa über den
  Zeitungsausschnitt am Apfelstand. Kein Fehler des ersten Durchlaufs, aber eine Lücke.
- `juno_weg`: Auf keiner der drei Wegkarten gibt es eine Figur oder einen Auslöser für Juno. Wenn
  die Handlung den Knoten nicht selbst startet, fehlt hier ein Auslöser.

### Zwingend vor der Abnahme

- Landstraße: Zaunlücke (37–39, 11) schließen oder Felder sperren, damit das Gatter nicht
  umgangen wird.
- Landstraße: Sprites für Ada (mit zwei Eimern) und Tessa; Kasse am Apfelstand sichtbar machen.
- Landstraße: Statisten und Plakate im Zustand „Flohmarkt leer“ entfernen.
- Flussweg: Stein mit eingeritztem Brett als eigenes, erkennbares Ding an der Fährstelle.
- Flussweg: Zedern am Ostende; Fluss am Ostrand glaubwürdig beenden.
- Zedernpfad: Waldbild (Zedern mit roten Stämmen, Nadelboden, keine Reihen) und Felskante mit
  Tiefe; Bedingung am Zugang aus Cedar Creek.
- Kürbishof: Kürbiswaage sichtbar, Oma Miller an den Laden.

### Nicht geprüft

- Ink-Dialoge, Bindungen der Auslöser an Knoten und die Bedingungen der Zustände nur aus
  `orte.json` gelesen, nicht gespielt.
- Die App selbst: ob sie für fehlende Sprites eine Ersatzfigur zeigt, wie die Belebung (Statisten,
  Tiere, Tageszeiten) wirklich aussieht, Licht („dunst“), Musik und Geräusche. Die Vorschau zeigt
  alle Statisten gleichzeitig und von vorn.
- Die Sperre des Zedernpfads aus Cedar Creek ist aus den Daten geschlossen; die Karte
  `cedarCreek.aussen` habe ich nur am Westrand für die Naht angesehen.
- Begehbarkeit stammt aus meiner Laufprüfung mit den Regeln der Pipeline, nicht aus der App
  (`begehbar.ts`); R060 (Kartenwechsel erst beim Gehen in Richtung Durchgang) ist am Bild nicht
  prüfbar.
- Regeln 10.74 bis 10.76 entfallen: keine Innenräume in diesem Teil.
- Weltpuzzle nicht selbst laufen lassen; die gemeldeten Brüche nur an den zusammengelegten
  Kartenrändern nachgesehen.

## Cedar Creek

Geprüft am 13.11.2026 an den gerenderten Bildern (Gesamtansicht, Ausschnitte mit Raster, zweifach und dreifach vergrößert), an den Szenendateien, an `orte.json` und mit der Laufmaske der Pipeline (`gelaende` aus `pipeline/abenteuer/abkuerzung.py`, Suche ab dem Auslöser `start`). Koordinaten sind Kacheln (x, y) ab oben links.

Vorweg, gilt für alle fünf Karten: Die Figuren `zwillinge`, `kettering`, `zwillingeDrinnen` und `dunmore` stehen in den Szenendateien, sind in den gerenderten Bildern aber nicht zu sehen (Rosa, Victor, Okafor, Dex, Mae, Boateng und alle Statisten sind zu sehen). Ob im Spiel ein Bild für sie da ist, konnte ich nicht prüfen; im Bild fehlen sie.

---

### cedarCreek.aussen – Ortskern mit Bibliothek und Steg (60 × 50)

- **Gesamturteil:** abnahmereif nein. Der Ort liest sich sofort und die Bibliothek ist klar das größte Haus, aber die Zwillinge stehen laut Daten nicht auf der Treppe, die Turmuhr ist ein Rundfenster, am Steg fehlt das Schilf, und drei „Schuppen“ sind vergrößerte Vogelhäuschen.

- **Kartenliste:**

| Punkt                                          | Urteil            | Bemerkung                                                                                                                                                                             |
| ---------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bibliothek deutlich größtes Gebäude            | erfüllt           | Turm (24–29) und Flügel (29–41), Reihen 3–18, roter Backstein, Kellerfenster in Reihe 18                                                                                              |
| Uhr im Türmchen                                | fehlt             | bei (26–27, 9–10) sitzt ein rundes Speichenfenster ohne Zeiger und Ziffern                                                                                                            |
| Häuser weit auseinander, keine modernen Bilder | teilweise         | Nordseite locker; die Südzeile (Reihen 37–46) steht dicht an dicht; modern wirken Müllcontainer (45, 28) und die große Asphaltbucht                                                   |
| Plakat von Perfect Move als Fremdkörper        | teilweise         | Anschlagtafel (42, 28) mit zwei kleinen Zetteln; nichts Glänzendes zu erkennen; Auslöser `plakat` (42, 30) erreichbar                                                                 |
| Bibliothekstreppe mit Zwillingen               | teilweise         | Treppe (22–23, 16–18) da; Figur `zwillinge` steht in den Daten bei (23, 24), also südlich der Straße im Gras zwischen Hecke und Zeder, und ist im Bild nicht zu sehen                 |
| Bushaltestelle mit Fahrplan, Kettering         | teilweise         | Wartehäuschen (32–36, 28–30) mit H-Schild; kein Fahrplan an dieser Haltestelle (der Fahrplan steht am Bahnsteig, 19–20, 4); `kettering` (40, 28) in den Daten, im Bild nicht zu sehen |
| Waschsalon, Drechslerei                        | erfüllt           | Scheune (2–9, 9–18), Waschsalon (12–19, 10–18), Türen an den Auslösern                                                                                                                |
| Steg am Bach mit Schilf (Schlüssel)            | teilweise         | Steg (50–53, 14–15) mit Rosa und Stegbauer; kein Schilf auf der ganzen Karte; Schlüssel nur über den Dialog `steg` (49, 14)                                                           |
| Kanuverleih                                    | teilweise         | blauer Schuppen (50–52, 27–30) und Ruderboot (54, 28–31); kein Schild, kein Kanu                                                                                                      |
| Schulbus am Samstag                            | erfüllt           | nur in der Fassung Samstag, gelb, (33–39, 23–26)                                                                                                                                      |
| Rosa, Victor                                   | erfüllt           | Rosa (53, 14) auf dem Steg; Victor (47, 19) an der Ecke bei den Pollern, 11 Felder vom Wartehäuschen; er steht ohne Bedingung in der Grundkarte (Kartenliste: nur Kap. 13)            |
| Auslöser                                       | teilweise         | alle 20 Felder frei und erreichbar; ein Auslöser für den Fahrplan an der Haltestelle fehlt weiter                                                                                     |
| Zustände                                       | teilweise         | Samstag da; Abendlicht nach `endeAkt1Gesehen` in `orte.json`; Steg bei Nacht (Decken, Teleskop) und Fahrplan Stufe C und D fehlen                                                     |
| Licht, Ton                                     | teilweise (Daten) | Musik, Bach, Turmuhr als Klangquelle am Gebäude eingetragen; Nacht, Nebel, Sternschnuppen nicht                                                                                       |

- **Befunde:**
  1. **Zwillinge am falschen Platz** (`zwillinge`, 23, 24): Feld liegt jenseits der Straße im Gras. Vorschlag: auf die Stufen (22, 17) und (23, 17) oder, damit die Tür frei bleibt, an den Fuß der Treppe (21, 18) und (24, 19) mit Blick zueinander.
  2. **Keine Turmuhr** (`mf2Bibliothek`, 26–27, 9–10): Das Wahrzeichen des Orts ist die Uhr, die Geschichte zählt ihre Schläge. Vorschlag: Zifferblatt mit Zeigern über das Rundfenster legen (flaches Ding an der Wand, nach 10.71 erlaubt) oder ein Turmbild mit Uhr.
  3. **Schuppen sind Vogelhäuschen in falscher Größe** (`cc12SchuppenRot` 43–45, 9–12; `cc12SchuppenBlau` 50–52, 27–30; `cc12SchuppenBraun` 44–46, 43–46): Jeder hat statt einer Tür ein rundes Einflugloch mit Sitzstange, etwa eine halbe Kachel groß; neben einer Figur wirkt das wie eine Hundehütte. Vorschlag: durch Schuppen mit figurenhoher Tür ersetzen (Tür 1 × 2 Kacheln, Regel 10.71), der blaue als Bootsschuppen mit Tor zum Wasser.
  4. **Kein Schilf am Steg** (Westufer bei 50–51, 12–17): Der Schlüssel „liegt im Schilf“, im Bild ist nur Gras. Vorschlag: zwei bis drei Schilfbüschel bei (50, 13), (50, 16), (51, 17).
  5. **Haltestelle steht im Gras, Fahrgast verdeckt** (32–46, 28–30): Wartehäuschen, Picknicktisch (37–38, 28–29) direkt daneben, Anschlagtafel und Müllcontainer stehen auf Rasen; der Statist `fahrgast` (42, 28) steht auf dem Feld der Anschlagtafel, nur sein Scheitel schaut heraus. Vorschlag: Pflaster eine Reihe tiefer ziehen (Reihen 28–29, Spalten 31–46), Fahrgast nach (39, 28), Picknicktisch zur Wiese (etwa 36, 32), Container durch eine kleine Tonne ersetzen.
  6. **Plakat nicht als Fremdkörper zu lesen** (`cc3Anschlagtafel`, 42, 28): nur zwei beige Zettel. Vorschlag: ein helles, glattes Plakat mit Glanzkante auf die Tafel oder an die Seitenwand des Wartehäuschens.
  7. **Straße „wie mit dem Lineal“**: Die Hauptstraße läuft 47 Kacheln schnurgerade mit gelber Mittellinie (Reihen 20–22); das Ortsblatt schließt das aus, ebenso fehlen die Hecken um die Häuser (nur eine Hecke bei 21–22, 24–35). Vorschlag: mindestens Hecken vor den beiden Häusern der Südseite und vor der Südzeile; die gerade Straße als Rückfrage an den Autor.
  8. **Kleinigkeiten:** gepflasterter Fleck (44–47, 13–14) vor dem roten Schuppen ist gegen den Schuppen um eine Kachel versetzt und an keinen Weg angeschlossen; Wegstummel (46–47, 31–32) endet im Gras; `radfahrer` (1, 20) ist eine Figur ohne Rad mitten auf der Fahrbahn; der Kartenrand (Spalte 0, Reihe 49) sperrt, ohne dass eine Hecke gezeichnet ist.

- **Rückmeldungen des Autors:**
  - R051 erledigt (Bank 16–18, 5–6 und beide Schilder stehen auf dem Pflaster des Bahnsteigs).
  - R052 erledigt (Pfad trifft den Bahnsteig auf zwei Reihen, 11/12, 4–5).
  - R053 erledigt (zwischen Eingangsbau 21–24 und Turm ist bei dreifacher Vergrößerung kein Gras zu sehen; hinter dem Eingangsbau liegt Pflaster).
  - R054 teilweise (alle Wohnhäuser haben jetzt Dach und First; die drei Schuppen sind zwar keine Abziehbilder mehr, aber Vogelhäuschen, Befund 3).
  - R055 teilweise (wie R054).
  - R056 erledigt (Striche gleichmäßig bis Spalte 46).
  - R057 erledigt (Bucht 30–46, 23–26 ist ein sauberes Rechteck mit Pflastersaum links, unten und rechts).
  - R059 erledigt (ein einziges weißes Schild mit blauer Schrift).
  - R060 nicht am Bild prüfbar (Verhalten der App).

- **Zustände:** `-samstag`: Einziger Unterschied sind die Felder (31–39, 23–26); der blaue Linienbus wird durch den gelben Schulbus (33–39) ersetzt, sonst ist die Karte gleich. Das passt zur Kartenliste; vom Team steht niemand auf der Karte, und Mr. Kettering bleibt ohne seinen Bus stehen (Vorschlag: Linienbus in der Bucht weiter rechts lassen, 40–46).

- **Gut gelungen:**
  - Bibliothek mit Turm, Eingangsbau mit Balkon und Kellerfenstern; die Naht zum Eingangsbau ist sauber.
  - Bahnsteig oben mit Gleis, Prellbock, Schildern und Bank.
  - Ankunft vom Flussweg: Straße und beide Gehwege laufen sauber bis zum Westrand (0, 19–23), alle fünf Felder sind Auslöser.
  - Steg, Brücke, Reiher, Enten und Boot geben dem Bach Leben.

- **Weltpuzzle (West, „flussweg“):** Im Bild stört nichts. Der Bruch bei y 5 ist der Zedernpfad (eigener Übergang zum Zedernpfad, nicht zum Flussweg). Die Brüche y 24–34 betreffen die gepflasterte Spalte am Westrand (0–1, 24–48), die zur Südgasse führt; dort gibt es keinen Übergang, das Pflaster läuft aber bis an die Bildkante, als ginge es weiter. Vorschlag: Hecke oder Zaun in Spalte 0 von Reihe 24 bis 48 zeichnen.

- **Simulation:** `steg_vor_archiv`: Auslöser `steg` vorhanden, also Reihenfolge. `sterne_ambrose`: keine Fassung und kein eigener Auslöser für die Sternennacht am Steg; ob der Knoten über `steg` erreicht werden soll, habe ich nicht geprüft (Ink war ausgenommen).

---

### cedarCreek.bibliothek – Stadtbibliothek mit Lesesaal (26 × 17)

- **Gesamturteil:** abnahmereif nein. Vorraum, Treppenhaustür und Kellertreppe sind jetzt schlüssig, aber die grünen Leselampen und die Leiter fehlen, der Saal ist nach 10.75 weiter zu tief, und die Fassung Clubkampf zeigt weder geräumten Tisch noch Lichtkreis.

- **Kartenliste:**

| Punkt                                    | Urteil    | Bemerkung                                                                                                                  |
| ---------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| Grüne Leselampen                         | fehlt     | die zwei Lampen auf den Lesetischen (18, 13) und (21, 13) haben beige Schirme auf orangem Fuß; grün sind nur die Stühle    |
| Tresen (Miss Ashby)                      | teilweise | ein Pult mit Kasse (6–7, 12–13), etwa 1,5 Kacheln breit; keine Miss Ashby                                                  |
| Leiter für Mrs. Okafor                   | fehlt     | keine Leiter im Bild und in den Daten                                                                                      |
| Zeitungsregal, Globus, Schild „Flüstern“ | erfüllt   | (15–16, 2–3), (23, 11), Pinnwand (13–14, 1–2); Auslöser erreichbar                                                         |
| Vorraum unter dem Balkon                 | erfüllt   | Spalten 1–3, Reihen 9–14, Haustür (2, 15), Durchgang zum Saal bei (4, 10–11)                                               |
| Tür zum Treppenhaus                      | erfüllt   | Tür in der Rückwand des Vorraums (2, 7–8), Auslöser (2, 9)                                                                 |
| Kellertreppe in eigenem Bereich mit Tür  | teilweise | abgetrennter Bereich (19–24, 4–7) mit Geländer, Zugang über die Nordwand (17–24, 3); eine Tür gibt es nicht                |
| Strichliste ab Stufe C                   | fehlt     | nichts am Tresen                                                                                                           |
| Figuren                                  | teilweise | Okafor (13, 7), Dex (8, 7), Mae (10, 11) im Bild; `zwillingeDrinnen` (9, 13) nur in den Daten und ohne Bedingung (Stufe C) |
| Auslöser                                 | erfüllt   | alle acht Felder frei und erreichbar                                                                                       |
| Zustände                                 | teilweise | Lesesaal und Clubkampf vorhanden; „Okafor auf der Leiter“ fehlt                                                            |
| Grundriss                                | teilweise | siehe Regeln 10.74 bis 10.76                                                                                               |

- **Regeln 10.74 bis 10.76:** Außen ist die Bibliothek ein Turm (24–29) mit langem Flügel (29–41), zusammen 17 breit, 4 Dachreihen, zwei Geschosse, der Eingang als Vorbau links vom Turm (22–23). Innen: Saal 20 breit (5–24) und 12 Reihen tief (3–14), dazu der Vorraum. Breite 20 plus Vorraum liegt im Rahmen (bis 25). Tiefe 12 gegen erlaubte 8: weiter 50 % zu tief. Türlage stimmt (ganz links, unten). Die Kellertreppe liegt oben im Ostteil und führt nach Süden hinab; im Archiv kommt sie an derselben Stelle von Norden herunter (stimmig). Die Treppenhaustür liegt hinter dem Vorraum, nicht im Turm: Der Turm steht außen rechts neben dem Eingang, das wäre innen etwa Spalten 5–9 an der Nordwand, wo heute Regale und ein kleines Fenster stehen. Das hohe Turmfenster findet sich innen nicht wieder.

- **Befunde:**
  1. **Leselampen nicht grün** (`cc4Leselampe` auf `lese1`, `lese2`): Vorschlag: Bankerlampe mit grünem Glasschirm, auch eine auf den Schachtisch (sie wird im Clubkampf gebraucht).
  2. **Saal zu tief** (Reihen 3–14): Vorschlag ohne Verkleinern: außen den Flügel um zwei Dachreihen vertiefen, oder innen die Reihen 11–14 östlich von Spalte 18 als eigenen „Lesesaal“ mit Türrahmen abtrennen (dort stehen schon Lesetische und Globus).
  3. **Leiter fehlt:** Vorschlag: Rollleiter vor dem Regal `cc4RegalB` (11, 1), als Zustand der ersten Begegnung Mrs. Okafor darauf.
  4. **Engstelle am Eingang** (`cc4PflanzeK` 3, 9): Die Pflanze sperrt (3, 10); aus dem Vorraum kommt man nur über das eine Feld (3, 11) in den Saal. Vorschlag: Pflanze nach (1, 9).
  5. **Tresen zu klein und ohne Person** (`cc4Tresen` 6, 11): liest sich als Kassenpult. Vorschlag: Tresen drei Kacheln breit quer vor den Durchgang (6–8, 12), Miss Ashby dahinter, Strichliste als Zustand ab Stufe C.
  6. **Treppenhaus nicht im Turm** (`cc4Kellertuer` 2, 7): Vorschlag: Tür in die Nordwand bei Spalte 6–7 verlegen (statt `cc4RegalD` 7, 1) oder im Grundriss festhalten, dass das Treppenhaus hinter dem Vorbau liegt.
  7. **Kellertreppe ohne Tür** (Zugang 17–18, 3): Vorschlag: Türrahmen bei (18, 3); neben der Treppe liegen zwei unerreichbare Bodenstücke (19–20 und 23–24, 5–7), dort Kisten oder Regal.
  8. **Leser stehen neben den Möbeln:** `rentnerZeitung` (16, 13) steht links vom Lesetisch statt auf dem Stuhl (17, 12); `leserin` (14, 12) steht frei im Gang. Vorschlag: beide auf die Stühle (17, 12) und (20, 12) setzen.

- **Rückmeldungen des Autors:**
  - R063 erledigt (Vorraum links, Haustür unten, rechts in den Saal).
  - R064 erledigt (verschlossene Tür zum Treppenhaus; Lage siehe Befund 6).
  - R065 offen (Saal weiter zu tief).
  - R066 teilweise (eigener Bereich und stimmige Lage im Keller ja, Tür nein).
  - R005 offen (die Treppenhaustür ist eine niedrige Tür in der Wand, keine wandhohe Innentür; Durchgänge ohne Tür).

- **Zustände:**
  - `-lesesaal`: Leser, Dex und Mae sind weg, Okafor bleibt (13, 7); zwei Matten, grün (14–15, 7–8) und grau (16–17, 7–8), liegen im Gang zwischen den Regalreihen und überdecken den Fuß der oberen Regale. Sie sehen aus wie Teppiche (kein Kissen, keine Decke) und liegen im einzigen Durchgang der Regale. Vorschlag: auf die freie Fläche (6–12, 12–14), mit Schlafsack oder Kissen; Nachtlicht ist in `orte.json` gesetzt, im Bild nicht zu sehen.
  - `-clubkampf`: vier zusätzliche Stühle mit dem Rücken zum Betrachter bei (7, 10), (8, 11), (12, 11), (13, 11) und zwei stehende Zuschauer (8, 10), (13, 10). Der Tisch ist nicht geräumt (vier Bretter, acht Stühle wie sonst), kein Halbkreis (zwei Paare), keine grüne Lampe und kein Lichtkreis; die Zuschauer stehen vor ihren Stühlen, Mae steht zwischen den Stühlen bei (10, 11). Laut Kartenliste nur teilweise.

- **Gut gelungen:**
  - Vorraum mit Haustür, Fußmatte und Treppenhaustür erklärt den Eingang von außen.
  - Schachtisch mit vier Brettern und acht gleichen Stühlen, Dex und Okafor an den Enden.
  - Kellertreppe hinter dem Geländer, Lage passt zum Archiv.
  - Regalreihen und Zeitungsregal lassen den Raum sofort als Bibliothek lesen.

- **Simulation:** `zwillinge_c`: Figur `zwillingeDrinnen` ist da, also Reihenfolge (Stufe C). `clubkampf_bauer`, `clubkampf_lass_mich`: Knoten der Handlung, auf der Karte fehlt dafür nichts.

---

### cedarCreek.archiv – Archiv im Keller (14 × 11)

- **Gesamturteil:** abnahmereif ja, mit zwei Nacharbeiten (Programmheft liegt scheinbar auf dem Stuhl, nasse Kartons nicht als nass zu erkennen); der Lichtkegel ist im Bild nicht prüfbar.

- **Kartenliste:**

| Punkt                                      | Urteil        | Bemerkung                                                                                        |
| ------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------ |
| Eine einzige Lampe, Lichtkegel             | nicht prüfbar | eine Leselampe auf dem Tisch (12, 8); `licht: nacht` in `orte.json`; das Bild ist hell gerendert |
| Karton von 1858                            | erfüllt       | offener Karton „1850“ (3–4, 7) in der unteren Reihe, Auslöser (3, 8)                             |
| Zwei Reihen Archivkartons nach Jahrzehnten | erfüllt       | 1810–1840 (3–8, 5), 1850–1880 (3–8, 7), Gang dazwischen begehbar                                 |
| Programmheft                               | teilweise     | sehr klein bei (11, 8), sitzt im Bild auf der Stuhlfläche statt auf dem Tisch                    |
| Boxerfoto                                  | erfüllt       | (5, 1–2), Auslöser (5, 3)                                                                        |
| Wasserfleck in Springerform                | erfüllt       | (6–8, 8–9), klar als Springer zu lesen                                                           |
| Nasse Kartons am Boden                     | teilweise     | Stapel (1–2, 5–7) aus hellen und braunen Kartons; Nässe ist nicht zu erkennen                    |
| Lesetisch                                  | erfüllt       | runder Tisch (11–12, 8–9) mit offenem Buch, Stuhl dahinter                                       |
| Auslöser                                   | erfüllt       | alle erreichbar; Ausgang auf allen sechs Feldern der Treppe                                      |
| Zustände                                   | erfüllt       | `-geordnet` vorhanden                                                                            |
| Grundriss, Treppe                          | erfüllt       | Treppe oben rechts (10–12, 1–4), wie oben im Saal                                                |

- **Befunde:**
  1. **Programmheft auf dem Stuhl** (`cc12Programmheft`, Versatz −7, −7): Vorschlag: Versatz so, dass es rechts neben dem Buch auf der Tischplatte liegt, und etwas größer.
  2. **Nasse Kartons** (`cc4KartonHoch` 1, 4 und 1, 6): Vorschlag: dunklere, eingesunkene Kartons mit Wasserrand, einer umgekippt; so wird der Unterschied zur Fassung „geordnet“ deutlicher.
  3. **Treppe wirkt flach** (`cc4Treppe` 10–12, 1–4): gleichmäßige Querstreifen zwischen zwei Pfosten, wie ein Lattenrost an der Wand. Vorschlag: Stufen nach oben schmaler und dunkler werden lassen oder die Treppe aus dem Saal (`cc12TreppeAb`) gespiegelt verwenden.
  4. **Wasserfleck ist flach grau:** liest sich als Schatten (so hat ihn der Autor in R068 verstanden). Vorschlag: dunkler Rand, etwas Glanz, zwei Tropfen daneben.
  5. **Freie Ostseite** (9–12, 5–7): leer zwischen Treppe und Tisch; für den Lichtkegel um den Tisch ist das in Ordnung, sonst ein Karteikasten bei (9, 5).

- **Rückmeldungen des Autors:**
  - R067 erledigt (Kartons haben jetzt Deckel, Front und Schild mit Jahreszahl; kein Abziehbild mehr).
  - R068 teilweise (der „Schatten“ ist der Wasserfleck in Springerform und gehört zur Geschichte; als Wasser ist er noch nicht zu lesen, Befund 4).

- **Zustände:** `-geordnet`: Nur die Felder (1–2, 4–7) ändern sich; statt der drei hohen Stapel stehen zwei einzelne geschlossene Kartons bei (1–2, 5) und (1–2, 7), der Gang (1–2, 6) wird frei. Passt zur Kartenliste.

- **Gut gelungen:**
  - Zwei saubere Reihen mit Jahrzehnten, der offene Karton fällt sofort auf.
  - Springerfleck klar erkennbar.
  - Das vierte Regal im Schatten (8–9, 1–3).
  - Treppe an derselben Stelle wie im Saal.

- **Simulation:** `karton_fremd`: Auslöser `karton1858` vorhanden, also Reihenfolge.

---

### cedarCreek.waschsalon – Waschsalon (14 × 11)

- **Gesamturteil:** abnahmereif nein, knapp: Der Raum liest sich sofort, aber die Tür liegt innen in der Mitte statt im linken Drittel (10.74), und Radio und Tresen fehlen.

- **Kartenliste:**

| Punkt                              | Urteil    | Bemerkung                                                                                                                             |
| ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Trockner mit festgeklebtem Brett   | erfüllt   | kleines Schachbrett oben auf dem linken Trockner (6, 2); zwei Trockner mit orangem Glühen (6–7, 2–3)                                  |
| Radio                              | fehlt     | im Bild und in den Daten keines                                                                                                       |
| Tresen mit Mr. Boateng             | teilweise | kein Tresen; Boateng (8, 6) steht am Ende der beiden Falttische (4–7, 6)                                                              |
| Statisten Kundin, Mann mit Zeitung | erfüllt   | (10, 7) frei im Raum; (3, 8) sitzt auf der Wartebank                                                                                  |
| Auslöser                           | erfüllt   | Ausgang (7, 10), `trockner` (6, 4), `zettelTurm` (7, 4), `comicheft` (1, 9), `automat` (11, 5), alle erreichbar                       |
| Grundriss                          | teilweise | Größe im Rahmen (12 × 7 begehbar gegen 8 × 6 außen); Tür innen bei Spalte 7 von 12, außen im linken Drittel (Spalten 13–14 von 12–19) |

- **Befunde:**
  1. **Türlage** (`sb8GlastuerSued` 7, 10): Vorschlag: Tür und Fußmatte nach (3, 10) oder (4, 10); dann die Wartebank von der Südwestecke an die Ostwand oder unter das Fenster.
  2. **Radio fehlt:** Vorschlag: kleines Radio auf das Waschmittelregal (11, 1) oder auf einen Falttisch.
  3. **Kein Tresen:** Vorschlag: einen der Falttische durch einen Tresen mit Kasse ersetzen (etwa 9–10, 5), Boateng dahinter.
  4. **Comicheft wirkt wie ein Aufkleber** (`cc12Comicheft` auf `sitze`, 1, 8): blaues Quadrat mit rotem Fleck auf der orangen Fläche der Bank. Vorschlag: schräg gelegt, mit sichtbarem Heftrücken, eindeutig auf der Sitzfläche (gelber Streifen).
  5. **Automat** (`cc4AutomatLinks` 12, 5–7): oben ein grauer Kasten, darunter die bunte Front; liest sich erst auf den zweiten Blick als Getränkeautomat von der Seite. Vorschlag: Frontansicht an die Nordwand neben das Fenster (8, 1).
  6. **Rechte Raumhälfte leer** (8–11, 3–9): Vorschlag: zweite Sitzreihe oder Wäscheständer bei (9–10, 8).

- **Rückmeldungen des Autors:**
  - R061 teilweise (das „Schild“ ist das Comicheft, es gehört zur Geschichte und hat einen Auslöser; es sieht aber weiter aus wie aufgeklebt, Befund 4).

- **Zustände:** keine Fassungen.

- **Gut gelungen:**
  - Maschinenreihe lückenlos an der Nordwand, Trockner durch das Glühen unterscheidbar.
  - Steckschachbrett auf dem Trockner und Pinnwand darüber sitzen genau über den Auslösern.
  - Heller, sauberer Raum, klare Laufwege von der Tür zu den Trocknern.

- **Simulation:** `trockner_danach`: Auslöser `trockner` vorhanden, also Reihenfolge.

---

### cedarCreek.drechslerei – Drechslerei (16 × 11)

- **Gesamturteil:** abnahmereif nein. Tür, Leiter und Größe stimmen mit der Scheune außen, aber es gibt keine Drehbank, Mr. Dunmore ist im Bild nicht zu sehen, und der Raum ist in der Mitte leer.

- **Kartenliste:**

| Punkt                        | Urteil          | Bemerkung                                                                                                                                        |
| ---------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Drehbank                     | fehlt           | an der Nordwand steht eine „Hobelbank“ (1–5, 1–4), ein heller Kasten mit dunkler Nische, der eher wie ein Bett oder eine Eckbank aussieht        |
| Holzstapel aus roter Zeder   | teilweise       | Rundholz bei (1–3, 8–9) und (13, 4–5), graubraun, nicht rot                                                                                      |
| Späne                        | fehlt (im Bild) | laut Daten `cc4Spaene` auf der Hobelbank; nicht zu erkennen, am Boden nichts                                                                     |
| Fensterbank für die Springer | erfüllt         | Fenster (6–7, 1–2) mit Brett darunter (6–8, 2–3), frei für die drei Springer                                                                     |
| Mr. Dunmore an der Drehbank  | teilweise       | Figur `dunmore` (2, 6) in den Daten und an den Dialog gebunden; im Bild nicht zu sehen; zwischen ihm und der Bank liegt eine Reihe (2, 5)        |
| Auslöser                     | erfüllt         | Ausgang (4, 10) erreichbar                                                                                                                       |
| Zustand Fensterbank Stufe B  | fehlt           | keine Fassung und kein Ding für die drei Springer                                                                                                |
| Grundriss                    | erfüllt         | 14 × 7 begehbar gegen 8 × 6 außen; Tür innen links (Spalte 4), außen links (Rolltor 3–4); Leiter rechts an der Wand (14, 1–3) unter der Ladeluke |

- **Befunde:**
  1. **Keine Drehbank** (`cc4Hobelbank` 1, 1): Vorschlag: Drehbank mit Spindel, Werkstück und Handauflage vor das Fenster (5–8, 3–4) stellen, Dunmore davor (6, 5) mit Blick zur Bank; die Hobelbank kann als zweite Bank bleiben.
  2. **Dunmore** (2, 6): Vorschlag: bis die Drehbank steht, nach (2, 5) direkt an die Bank; Bild der Figur prüfen.
  3. **Bücherregal aus der Bibliothek in der Werkstatt** (`cc4Holzregal` 8–9, 1–3): dasselbe bunte Bücherregal wie im Lesesaal. Vorschlag: Werkzeugwand oder Regal mit Schalen und halbfertigen Figuren.
  4. **Leere Mitte** (5–12, 4–6 und 5–12, 8–9): zwei Werkbänke stehen allein im Raum. Vorschlag: Sägebock, Spänehaufen am Boden unter der Drehbank, ein Korb mit Rohlingen, Zedernbretter an der Ostwand.
  5. **Zustand Stufe B fehlt:** Vorschlag: Fassung nach `nadelCedarCreek` mit drei kleinen Springern auf `mf12Fensterbank` und einem Auslöser davor (7, 3).
  6. **Kiste** (`cc4KisteLeer` 13, 7–8): im Bild ein Rahmen mit dunklem Loch, als Kiste schwer zu lesen. Vorschlag: geschlossene Holzkiste mit Reststücken.

- **Rückmeldungen des Autors:**
  - R058 erledigt (die beiden Werkbänke 6–9, 6–7 haben jetzt Platte, Beine und Schatten; Leiste und Werkstück liegen ganz auf der Platte).

- **Zustände:** keine Fassungen (Stufe B fehlt, Befund 5).

- **Gut gelungen:**
  - Leiter an der Stelle, die der Grundriss der Scheune verlangt.
  - Werktisch mit Farbdosen und Pinseln (10–12, 1–3) ist lebendig und liest sich sofort.
  - Tür, Fußmatte und Rolltor außen liegen an derselben Stelle der Breite.
  - Neue Werkbänke ohne überhängendes Holz.

- **Simulation:** `dunmore_c`: Figur `dunmore` ist da und gebunden, also Reihenfolge (Stufe C).

---

### Zwingend vor der Abnahme

- **aussen:** Zwillinge auf die Bibliothekstreppe setzen (heute 23, 24); Uhr an den Turm; die drei Vogelhaus-Schuppen ersetzen; Schilf an den Steg; Fahrgast aus der Anschlagtafel holen.
- **aussen, bibliothek, drechslerei:** klären, warum Zwillinge, Kettering und Dunmore im Bild nicht erscheinen.
- **bibliothek:** grüne Leselampen; Leiter; Entscheidung zur Tiefe des Saals (10.75, R065); Fassung Clubkampf mit geräumtem Tisch, Halbkreis und Lampe; Matten aus dem Regalgang.
- **waschsalon:** Tür ins linke Drittel; Radio.
- **drechslerei:** Drehbank; Fassung oder Ding für die drei Springer auf der Fensterbank.
- **archiv:** nichts Zwingendes; Programmheft auf den Tisch.

### Nicht geprüft

- Licht (Abend, Nacht, Lichtkegel im Archiv, Lichtkreis im Clubkampf), Teilchen, Musik und Geräusche: nur die Einträge in `orte.json` gelesen, im Bild ist alles taghell.
- Kartenwechsel beim Darüberlaufen (R060) und alles andere Verhalten der App.
- Ink-Dialoge (ausgenommen); die Einordnung der nie erreichten Knoten ist nur aus Auslösern und Figuren der Szenen geschlossen.
- Erreichbarkeit stammt aus der Laufmaske der Pipeline, nicht aus einem Lauf in der App; Statisten zählen dort nicht als Hindernis.
- Ob die vier nicht gerenderten Figuren im Spiel ein Bild haben.
- Die Grundrisseinträge für `mf2Bibliothek`, `cc5Seiteneingang`, `mf2Waschsalon` und `cc4Drechslerei` habe ich in `grundrisse.json` nicht unter diesen Namen gefunden; verglichen habe ich mit den Angaben der Kartenliste und mit dem Außenbild.
- Die Südzeile (Reihen 36–48) und das Ostufer nur in einfacher Größe angesehen; `docs/spiel/orte/cedar-creek.md` nur nach Stichwörtern durchsucht.
