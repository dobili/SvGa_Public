# 26 Akt 1: Kartenliste für den Vertikalschnitt

Stand 13.11.2026, mittel-4. Für jede Karte von Akt 1 eine Prüfliste: was auf der Karte sein muss,
bevor der Vertikalschnitt (Akt 1 von Anfang bis Ende) gebaut und geprüft wird. Dieses Dokument
ändert keine Karte; es ist die Arbeitsliste für die Kartenbauer und die Prüfliste für den Gutachter.

**Quellen:** Roman Akt 1 (Randnotizen `[Karte: …]`, `[Bild: …]`, `[Klang: …]`), `20_Ortsblaetter.md`
(Abschnitt „Was aus den Blättern für Akt 1 an den Karten zu prüfen ist“), `22_Dialogpruefung.md`
Teil J4, die Ink-Dateien von Akt 1 (Knoten und Variablen), `inhalte/abenteuer/orte.json` und die
Szenen, `21_Klangplan.md`, `23_Technik_Atmosphaere.md`, KARTENREGELN 10.74 bis 10.76 mit
`katalog_korrekturen/grundrisse.json`, die Rückmeldungen des Autors in
`auftraege/rueckmeldung/sammlung.md` (nur Akt 1; dort steht fast alles noch als offen, der
Gutachter hakt nach der Prüfung ab).

## Aufbau je Karte

| Teil       | Inhalt                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Pflicht    | Dinge und Bauten, die man sehen muss, mit Quelle                                                   |
| Figuren    | Hauptfiguren und Bewohner mit eigener Geschichte; bei diesen die Stufe A bis D (Ortsblatt)         |
| Auslöser   | Name im Spiel → Ink-Knoten; **fehlt** heißt: der Knoten existiert, aber keine Karte erreicht ihn   |
| Zustände   | Fassungen der Karte mit der Bedingung (Variable aus den Ink-Dateien oder `orte.json`)              |
| Licht, Ton | Licht (T6), Teilchen (T8), Musik und Dauergeräusch (Kennungen aus `21_Klangplan.md`), Klangquellen |
| Grundriss  | nur Innenräume: Gebäude außen, Faktor nach 10.75, Aufgang nach 10.76                               |
| Mängel     | offene Rückmeldungen des Autors (R-Nummern) und Befunde                                            |

Stufen der kleinen Geschichten (Ortsblatt): **A** Ankunft, **B** nach der Nadel des Orts,
**C** nach Akt 1 (`endeAkt1Gesehen`), **D** nach Akt 2 (in den Ink-Dateien meist `nadelIronwood > 0`).

## Übersicht: fehlende Auslöser

Diese Ink-Knoten sind geschrieben, aber keine Karte und kein anderer Knoten führt zu ihnen
(geprüft am 13.11.2026: Bindungen in `orte.json` und Weiterleitungen in den Ink-Dateien).

| Karte                                         | Fehlender Auslöser (Vorschlag)    | Ink-Knoten                                  | Was dort stehen muss                                        |
| --------------------------------------------- | --------------------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| `mapleFalls.aussen`                           | Figur `calloway`                  | `maple-falls-aussen.calloway` (A bis D)     | Mrs. Calloway auf ihrer Veranda gegenüber dem Whitlock-Haus |
| `mapleFalls.aussen`                           | Figur `carla`                     | `maple-falls-aussen.carla` (A bis D)        | Carla am Zaun vor Haus Martínez mit Fahrrad                 |
| `mapleFalls.aussen`                           | Ding `kreidebrett`                | `ansehen-maple-falls.kreidebrett`           | Kreidebrett auf dem Gehweg vor Lilys Haus                   |
| `mapleFalls.diner`                            | Figur `hector`                    | `maple-falls-diner.hector` (A bis D)        | Hector hinter dem Tresen                                    |
| `mapleFalls.dachboden`                        | Ding `kisteWhitlock`              | `ansehen-maple-falls.kiste_whitlock`        | Kiste mit Schrift neben der Treppe                          |
| `mapleFalls.dachboden` oder Zimmer des Helden | Ding `fensterbank`                | `maple-falls-dachboden.fensterbank`         | Fensterbank mit den Funden (T15)                            |
| `mapleFalls.wohnzimmer`                       | Ding `tischPizzakarton` (Zustand) | `ansehen-maple-falls.tisch_pizzakarton`     | Tisch mit gefaltetem Pizzakarton unter einem Bein           |
| `mapleFalls.wohnzimmer`                       | Szene `aufbruchFreitag`           | `maple-falls-wohnzimmer.aufbruch_freitag`   | wird von der Handlung gestartet; Einstieg prüfen            |
| `mapleFalls.clubraum`                         | Ding `bildschirmPult` (Zustand)   | `ansehen-maple-falls.bildschirm_pult`       | Bildschirm von Perfect Move auf dem Pult                    |
| `wegMapleCedar.landstrasse`                   | Ding `apfelstand`                 | `weg-maple-cedar.apfelstand` (A bis D)      | Apfelstand am Gatter mit Ehrlichkeitskasse                  |
| `wegMapleCedar.landstrasse`                   | Figur `ada`                       | `weg-maple-cedar.ada`                       | Ada Brennan auf der Wiese, zwei Eimer                       |
| `wegMapleCedar.landstrasse` und `.flussweg`   | Figur `tessa`                     | `weg-maple-cedar.tessa` (A bis D)           | Tessa Vance läuft (heute nur Statistin `joggerin`)          |
| `cedarCreek.aussen`                           | Figur `zwillinge` (Treppe)        | `cedar-creek-aussen.zwillinge` (A, B)       | Ivy und Jonah auf der Bibliothekstreppe                     |
| `cedarCreek.bibliothek`                       | Figur `zwillinge` (drinnen)       | `cedar-creek-bibliothek.zwillinge` (C, D)   | ab Stufe C drinnen am Tisch, Strichliste am Tresen          |
| `cedarCreek.drechslerei`                      | Figur `dunmore`                   | `cedar-creek-drechslerei.dunmore` (A bis D) | Mr. Dunmore an der Drehbank (heute nur Statist)             |

Zusätzlich ohne Figurenplatz, obwohl sie sprechen: Mr. Pratt (`maple-falls-clubraum.pratt_und_heimweg`,
an der Tür des Clubraums oder am Schulhof), Mr. Kettering (an der Haltestelle von Cedar Creek, heute
Statist `busfahrer`), Silas Reed (Angler am Flussweg, heute Statist `angler`, ohne eigenen Knoten).

---

## Maple Falls

### `mapleFalls.aussen` – Birch Lane und Hauptstraße

- **Pflicht**
  - Whitlock-Haus als einziges älteres, ungestrichenes Haus, grau zwischen bunten Holzhäusern
    (Ortsblatt; Roman Kap. 5).
  - Mrs. Calloways Veranda gegenüber, mit **zwei Stühlen** (Ortsblatt, Roman Kap. 5).
  - Haus Martínez mit Zaun, an dem ein Fahrrad lehnt (Carla).
  - Kreidebrett auf dem Gehweg vor Lilys Haus, schief, neun Felder in einer Reihe; bleibt als Spur
    und verblasst über die Akte (Roman Kap. 6, Ink `kreidebrett`).
  - Ahornbäume als Allee, Briefkästen an der Straße, Veranden (Ortsblatt „Ordnung“).
  - Schule mit Schulhof und Fahnenmast (Pratt), Diner, Weg zum Park, Bushaltestelle.
- **Figuren**
  - Juno (54, 24), Lily (14, 24): vorhanden.
  - Mrs. Calloway: **fehlt.** A: allein, ein Stuhl leer. B: Kartenspiel auf dem leeren Stuhl.
    C: Owen Fisk sitzt auf dem zweiten Stuhl. D: kleiner Tisch mit Schachbrett zwischen den Stühlen.
  - Carla: **fehlt.** A: repariert das Fahrrad am Zaun. B: Fahrrad fertig. C: steht am Fenster des
    Clubraums (an der Schule, von außen). D: nicht hier (im Clubraum).
  - Owen Fisk (Kind mit Ball): als Statist `kindMitBall` da; ab Stufe C bei Mrs. Calloway.
  - Victors schwarzer Wagen vor der Schule nur während der Szene (Roman Kap. 9).
- **Auslöser:** `haustuer`, `schule`, `dinerTuer`, `park` vorhanden; `calloway`, `carla`,
  `kreidebrett` fehlen (siehe Übersicht). Mrs. Calloway am ersten Schultag auf dem Weg zur
  Haltestelle: `maple-falls-aussen.calloway_auf_dem_weg` (Pflichtgespräch).
- **Zustände:** Kreidebrett nach `lilyGeholfen` mit dazugemalten Springerzügen; Veranda nach den
  Stufen A bis D (Ding oder Zustandsfassung, Ortsblatt Punkt 4).
- **Licht, Ton:** Spätsommer, Nachmittagslicht. Musik `mapleFalls`; Dauergeräusch `wasserfall` leise,
  `voegel`. Erste Ankunft (Kap. 1): bis zur Pizza ohne Musik (Stille S1).
- **Mängel:** R002 (Schuppen als Abziehbild zwischen zwei Häusern), R055, R042.

### `mapleFalls.wohnzimmer` – Wohnzimmer und Küche im Whitlock-Haus

- **Pflicht:** Lichtstreifen durch das Fenster, Ahornast vor dem Fenster, Umzugskisten (Roman Kap. 1);
  Treppe nach oben; Küche mit Kühlschrank (Nachtszene).
- **Figuren:** Mama (17, 7).
- **Auslöser:** `haustuer`, `treppeOben`, `kartonKueche`, `pizzakarton` vorhanden; `tischPizzakarton`
  fehlt (nur im Zustand mit Tisch).
- **Zustände:**
  - Grund: Ankunft, Kisten, kein Tisch.
  - Nach `ersterAbendGesehen`: **Tisch steht, gefalteter Pizzakarton unter einem Bein** (Roman Kap. 4,
    Ink `tisch_pizzakarton`). Heute fehlt diese Fassung; vorhanden ist nur `ausgepackt` nach
    `aufbruchGesehen`.
  - Abend im Diner (`dinerAbendGesehen`) ändert hier nichts.
- **Licht, Ton:** Tag; Kap. 3 Abenddämmerung im Fenster (T6 `abend`). Musik `mapleFalls` leiser
  (Innenraum); Dauergeräusch `wasserfall` sehr leise; nachts `kueche` (Kühlschrank).
- **Grundriss:** Villa aus Holz (`mf4VillaOrange`, Breite 9, Tiefe 6, 2 Geschosse, Tür Spalte 3).
  Innen bis 18 × 15 erlaubt (10.75); heute 20 × 13, also zwei Spalten zu breit. Treppe nach 10.76
  **hinten links hinter der Tür** (Feld `aufgang`); im Obergeschoss an derselben Stelle.
- **Mängel:** R001 (Küche im Zustand `ausgepackt` kahl).

### `mapleFalls.dachboden` – Dachboden mit dem Brett

- **Pflicht**
  - Das Brett mit der Stellung, die in allen Zuständen unverändert stehen bleibt (Roman Kap. 2,
    `[Karte]`).
  - Decke auf dem Brett als einziges Ding ohne Staub, leicht glänzend (Roman Kap. 2).
  - Kiste aus Holz mit Schrift neben der Treppe (Roman Kap. 1, Ink `kiste_whitlock`); darin das Foto
    von Mrs. Whitlock (Entscheidung Hauptchat 13.11.2026).
  - Hutschachtel, Spiegel, Zeitungen von 1961 (vorhanden), Fenster mit Lichtwechsel.
  - Treppe mit der knarrenden neunten Stufe (Klang).
- **Auslöser:** `brett`, `treppe`, `hutschachtel`, `spiegel`, `zeitungen1961` vorhanden;
  `kisteWhitlock` fehlt; `fensterbank` fehlt (gehört ins Zimmer des Helden, wenn es gebaut wird).
- **Zustände:** Grund; nach `ersterAbendGesehen` ohne Brett (vorhanden, `-ohne-brett`).
- **Licht, Ton, Teilchen:** Staub, der sich im Lichtstreifen langsam dreht (T8 `staub`); Lichtwechsel
  beim Anheben des Königs; Ambrose blendet halb durchsichtig ein (T9 `#geist`). **Keine Musik** bis
  Ambrose spricht (S2), dann `ambrose`; Dauergeräusche `wind_fenster`, `holzknacken`; Geräusche
  `koenig_heben`, `glocke_hell`, `treppe`, `knarren`. Abend nach Victor (Kap. 9): nur Wind (S11).
- **Grundriss:** Dachgeschoss der Villa; 14 × 11 liegt im Rahmen. Treppe an derselben Stelle wie
  unten (hinten links).
- **Mängel:** keine eigenen R-Nummern.

### Zimmer des Helden (neu, Kennung-Vorschlag `mapleFalls.zimmer`)

- **Warum:** Roman Kap. 4 (`[Karte]`: „Zimmer des Helden mit Schreibtisch für das Brett fehlt
  bisher“), T15 (Fensterbank zeigt Funde), Ink `erste_nacht` und `fensterbank`. Rückfrage R3 an
  den Autor ist offen; der Hauptchat nimmt das Zimmer in die Liste auf.
- **Pflicht:** Bett, Schreibtisch mit dem Brett, Fenster zur Straße mit Laterne davor, **Fensterbank**
  mit Platz für die Funde (Springer mit abgestoßener Mähne, Postkarten …), Tür zum Flur.
- **Auslöser:** `treppe` (nach oben zum Dachboden oder nach unten), `fensterbank` →
  `maple-falls-dachboden.fensterbank`, `brett` (nachts) → `maple-falls-dachboden.erste_nacht`.
- **Zustände:** Tag; Nacht (`ersteNachtGesehen` setzt die Szene ab): Zimmer in Blau, Laternenlicht durch
  das Fenster, Ambrose als heller Umriss (Roman Kap. 4, `[Bild]`).
- **Licht, Ton:** T6 `nacht`; Musik aus (S5), Dauergeräusch `kueche` (Kühlschrank von unten),
  `wasserfall`, ein Auto (`auto_nacht`), am Schluss vier Töne `ambrose`.
- **Grundriss:** im Obergeschoss der Villa (Fenster OG1 in den Spalten 2–3, 4–5, 7), Treppe hinten links;
  die Karte liegt zwischen Wohnzimmer und Dachboden.

### `mapleFalls.park` – Stadtpark

- **Pflicht**
  - **Blick auf den Wasserfall** (Ortsblatt Punkt 1, Roman Kap. 6 `[Karte]`).
  - Bank mit Thermoskanne (Abernathy, Reiseschach mit Zettel), Kiosk am Parkeingang (Mr. Patel).
  - **Halfpipe zurück auf die Karte** (J4); asphaltierter Basketballplatz aus der Git-Geschichte
    zurück (R021).
  - Enten am Wasser, Rollen auf Beton (Klang).
- **Figuren:** Jo (16, 25), Abernathy (2, 14). Mr. Patel am Kiosk (Ink liest `patelGetroffen`) ohne
  eigene Figur.
- **Auslöser:** `bushaltestelle`, `kiosk`, `landstrasse` (ab `aufbruchGesehen`), `parkbank`, `steg`,
  `zedernpfad` (ab `nadelCedarCreek`) vorhanden.
- **Zustände:** Steg neu nach `nadelMapleFalls >= 1` (vorhanden). **Zustand `schulbus` entfällt**
  (J4); heute noch in `orte.json` als `aufbruchGesehen und nicht ankunftCedarCreekGesehen`.
- **Licht, Ton:** Musik `mapleFalls` (Lernen: `mapleFalls.lernen`); Dauergeräusche `wasserfall` lauter,
  `enten`, `rollen`, `voegel`.
- **Mängel:** R021, R022 (Holzgebilde unklar, Abziehbild), R023 (Brücke zu kurz), R024 (kaputter Steg
  halb auf dem Ufer), R025 (zwei Stege), R026 (Ufer oben: Stege nicht umgehbar), R036 (Übergang zur
  Landstraße: Straßenart wechselt ohne Übergang; jetzt mit Regel 10.73 lösbar).

### `mapleFalls.clubraum` – Clubraum der Maple Falls High

- **Pflicht**
  - Am Brett fehlt die schwarze Dame; ein Radiergummi steht an ihrer Stelle, ansprechbar (J4, Roman
    Kap. 5 `[Bild]`).
  - Plakat „Erst zählen“, Pokalvitrine (vorhanden).
  - Pult für den Bildschirm.
- **Figuren:** Coach Delgado (15, 4), Sam (9, 9); Juno während der Szenen; Mr. Pratt an der Tür
  (**fehlt**); Victor und Graham Hale nur in Kap. 9. Wer Schach spielt, sitzt (R020).
- **Auslöser:** `schule`, `brettOhneDame`, `plakatZaehlen`, `pokalvitrine` vorhanden; `bildschirmPult`
  fehlt.
- **Zustände:**
  - Pokal nach `nadelMapleFalls >= 1` (vorhanden).
  - **Bildschirm auf dem Pult nach Victors Besuch** (`victorGesehen`; J4, Roman Kap. 9 `[Karte]`);
    bleibt bis Akt 2 stehen.
  - Ab Stufe D: Carla sitzt am Brett mit der fehlenden Dame (Ortsblatt).
- **Licht, Ton:** Musik `mapleFalls.club`, Lernreihen `mapleFalls.lernen`, Clubkampf
  `mapleFalls.clubkampf`; Geräusche `pfiff`, `schulglocke`, `spindtuer`; Victors Partie mit `metronom`
  ohne Musik (S10).
- **Grundriss:** Schule (`mf4Schule`, Breite 23, Tiefe 11, 2 Geschosse); ein Raum von 26 × 15 liegt im
  Rahmen (10.75, groß: bis 1,5-fach). Treppenhaus hinten in der Mitte (10.76) liegt außerhalb dieses
  Raums; eine Tür zum Flur soll es andeuten (R065).
- **Mängel:** R011 (Vitrine und Spinde ohne Oberseite), R012 (Regal von der Seite), R013 (drei bunte
  Rechtecke), R014 (Schild ragt in die Decke), R015 (Globus auf dem Buch), R016 (Plakat verschiebt sich
  zwischen den Fassungen), R017 (Stühle kommen hinzu), R019 (Stuhl auf einer Figur), R020 (Figuren
  sitzen nicht), R005 (Innentür).

### `mapleFalls.diner` – Diner

- **Pflicht**
  - Lang und schmal wie ein Wagen (Roman Kap. 7 `[Karte]`).
  - Stapel ungelöster Tischsets neben der Kasse (Roman Kap. 7, Ortsblatt Hector A); ab Stufe B ein
    gerahmtes Tischset an der Wand.
  - Jukebox (Klangquelle), Theke mit Hockern auf der Kundenseite.
- **Figuren:** Hector hinter dem Tresen (**fehlt**), Kellnerin, Lkw-Fahrer, Rentnerinnen (Statisten).
  Im Zustand Abend Mama am Tisch.
- **Auslöser:** `dinerAusgang` vorhanden; `hector` fehlt. Die Szene `diner_abend` startet aus dem
  Wohnzimmer (`maple-falls-wohnzimmer.diner_einladung`).
- **Zustände:** Abend (`dinerAbendGesehen` noch nicht gesetzt: Szene `akt1.dinerAbend`) mit Mama am
  Tisch und Abendlicht; gerahmtes Set ab `nadelMapleFalls > 0 und dinerAbendGesehen` (Hector B).
- **Licht, Ton:** Musik `diner` (Jukebox), Dauergeräusch `diner_kueche`, `tuerglocke`; bei Hectors
  Bericht ein Takt Stille (S7).
- **Grundriss:** Fassade `fassade_diner` (Breite 8, Tiefe 6, Tür Spalte 2–3). Innen bis 16 × 15 erlaubt;
  heute 30 × 16, fast doppelt so breit. Nach 10.75 erst das Gebäude außen verlängern (der Roman will ein
  langes Diner), sonst den Raum kürzen.
- **Mängel:** R003 (Kaffeemaschine schwebt), R004 (Theke falsch herum), R005a (Innentüren), R006
  (zerstörte Kommode), R007 (Arbeitstische in der Küche), R008 (Person mit Gesicht zur Wand), R009
  (Barhocker), R010 (leerer Eingangsbereich).

---

## Der Weg nach Cedar Creek

### `wegMapleCedar.landstrasse` – Landstraße

- **Pflicht**
  - Rätseltafel am Ortsausgang (vorhanden), **Apfelstand am Gatter mit Ehrlichkeitskasse**,
    ansprechbar (Roman Kap. 10, Ortsblatt Punkt 2), Ortsschild.
  - Großer Himmel: viel freie Fläche oben (Roman Kap. 10 `[Bild]`).
  - Zäune, Felder in langen geraden Linien; Otis' Traktor am Feldrand; Kühe.
  - Straßenart **Landstraße** (Belag `landstrasse`, Regel 10.73), weil hier der Bus fährt (R037).
- **Figuren:** Wanderer (67, 16), Nia (82, 14) vorhanden. Ada (**fehlt**, A: zählt die Kasse und seufzt;
  B: Zettel an der Kasse; C: Kasse stimmt, Apfelkern; D: unverändert). Tessa (**fehlt**, A: läuft nur
  hier, bleibt am Gatter stehen; B: läuft bis zum Flussweg; C: ganze Strecke; D: Zeitungsausschnitt an
  Adas Stand). Otis als Statist `bauer`.
- **Auslöser:** `tafel`, `fundFormular`, `seite00`, `ereignisFlohmarkt`, `kuerbishof` (ab
  `wegMapleCedarTafelBestanden`), `weiterFluss`, `zurueckPark` vorhanden; `apfelstand`, `ada`, `tessa`
  fehlen.
- **Zustände:** Flohmarkt leer vor `nadelMapleFalls >= 1`; Gatter offen nach
  `wegMapleCedarTafelBestanden` (vorhanden). Für die Kasse: Zettel ab `nadelCedarCreek`, Apfelkern ab
  `nadelRiverton` (Ink `apfelstand`).
- **Licht, Ton:** heller Vormittag (Ortsblatt: die drei Karten von hell zu schattig). Musik `weg`
  (heute `musik/landstrasse.ogg` für alle drei Wegkarten); Dauergeräusche `traktor_fern`, `zaun_wind`,
  `kuehe`, `grillen`; Geräusche `kasse_muenzen`, `kraehen`.
- **Mängel:** R036, R037 (Landstraße wie Trampelpfad), R038 (Pflanzen außerhalb der Felder), R039
  (Pflanzen auf dem Dach des Stands), R040 (Stand leer, Figur zu weit oben), R041 (Kante des
  Flohmarkts, mit Saum 10.72 erledigt), R043 (Hase so groß wie das Reh), R044 (Tor verschwindet statt
  offen zu stehen), R031 (Abkürzungen).

### `wegMapleCedar.flussweg` – Flussweg

- **Pflicht**
  - Fährstelle mit **Stein mit eingeritztem Brett**, ansprechbar, und dem Angler Silas (Roman Kap. 10
    `[Karte]`, `[Bild]`).
  - Die Zedern stehen am Ende des Flusswegs (Übergang zu Cedar Creek).
  - Pfad folgt dem Ufer, nichts gerade (Ortsblatt „Ordnung“).
- **Figuren:** Silas Reed als Statist `angler` (ohne eigenen Knoten); Tessa ab Stufe B.
- **Auslöser:** `rast`, `fundMuenzen`, `finchBauerA`, `schildCedar`, `weiterCedar`, `zurueckLandstrasse`
  vorhanden. Die Fährstelle (`weg-maple-cedar.faehrstein`) ist über die Handlung erreichbar; auf der
  Karte braucht der Stein einen eigenen Auslöser am Ufer.
- **Zustände:** keine.
- **Licht, Ton:** Schattengrün. Musik `weg.fluss`; Dauergeräusch `fluss`, `voegel`;
  Schritte `schritt_kies`.
- **Mängel:** R049 (harter Übergang des Pflasters zur Hauptstraße; mit Saum und Straßenart lösbar),
  R050 (Boot ohne Seil am Pfosten).

### `wegMapleCedar.zedernpfad` – Zedernpfad

- Öffnet erst nach der zweiten Nadel (`nadelCedarCreek`), gehört also nicht zum ersten Durchlauf des
  Vertikalschnitts, aber zu Akt 1 (Rückweg).
- **Pflicht:** dichter, stiller Wald; Rotbraun unter den Zedern; Treppen im Fels vollständig.
- **Licht, Ton:** schattig. Musik `weg.zedern`; Dauergeräusch `wald_still`; Schritte `schritt_nadeln`.
- **Mängel:** R027 (Treppen lückenhaft; Technik in Arbeit), R028, R029 (Felswände enden frei;
  Regel 10.74 der Höhen), R030, R031 (Abkürzung durch den Wald), R032, R033 (Weltlogik).

### `kuerbishof.hof` – Kürbishof

- **Pflicht:** Irrgarten (Clover baut ihn jedes Jahr neu), Vogelscheuche mit Schachbrett, Kürbiswaage,
  Hofladen (Oma Miller), Windrad, Hühner.
- **Figuren:** Walt (41, 23), Clover (10, 22), Oma Miller (7, 26) vorhanden.
- **Auslöser:** `irrgarten`, `vogelscheuche`, `kuerbiswaage`, `zurueckLandstrasse` vorhanden.
- **Licht, Ton:** Orange und Strohgelb. Musik `weg.kuerbishof` (Banjo); Dauergeräusche `huehner`,
  `windrad`.
- **Mängel:** R045 (Endpfosten des Zauns), R046 (Kürbisse auf der Graskante), R047 (Boden des
  Kürbisfelds wie ein Weg), R048 (Ähren auf den Rahmen der Feldbilder; Irrgarten braucht einen
  durchgehenden Boden), R033 (Lage in der Weltkarte).

---

## Cedar Creek

### `cedarCreek.aussen` – Ortskern mit Bibliothek und Steg

- **Pflicht**
  - **Bibliothek deutlich das größte Gebäude, mit Uhr im Türmchen** (Roman Kap. 11 `[Karte]`,
    Ortsblatt Punkt 3); die Turmuhr ist Klangquelle.
  - Häuser weiter auseinander als in Maple Falls; **keine Bilder aus modernen Paketen** (Ortsblatt).
  - Glänzendes Plakat von Perfect Move als Fremdkörper (vorhanden, `plakat`).
  - Bibliothekstreppe (Zwillinge), Bushaltestelle mit Fahrplan (Kettering), Waschsalon, Drechslerei,
    Steg am Bach mit Schilf (Schlüssel als Fund), Kanuverleih.
  - Schulbus am Samstagmorgen (J4, Zustand nach `teamAngekommen`).
- **Figuren**
  - Rosa (53, 14), Victor (47, 19) vorhanden; Victor an der Haltestelle nur in Kap. 13, im Abendlicht.
  - Zwillinge auf der Treppe (**fehlen**): A streiten, B Miss Ashby führt Strichliste; ab C drinnen.
  - Mr. Kettering an der Haltestelle (heute Statist `busfahrer`): A erzählt, B Linie wird „geprüft“,
    C neuer Fahrplan mit weniger Fahrten, D Fahrplan überklebt „Fährt doch.“ (Ortsblatt; Ink
    `kettering`).
- **Auslöser:** `bibliothekTuer`, `waschsalonTuer`, `drechslereiTuer`, `steg`, `plakat`, `busZurueck`,
  `flussweg`, `zedernpfad`, `zedernwald` (ab `endeAkt1Gesehen`) vorhanden; `zwillinge` fehlt. Ein
  eigener Auslöser für den Fahrplan an der Haltestelle (Kettering C, D) fehlt.
- **Zustände:**
  - Ankunft zu Fuß am Freitag (`ankunftCedarCreekGesehen`).
  - Samstagmorgen: Schulbus steht da (`teamAngekommen`).
  - **Steg bei Nacht** mit Decken und Teleskop (Sternennacht, `sternennachtGesehen` wird dort gesetzt)
    und **Steg in der Abenddämmerung** (Ende von Akt 1, `endeAkt1Gesehen`) (Roman Kap. 14, 16
    `[Karte]`).
  - Fahrplan an der Haltestelle nach den Stufen (C, D).
- **Licht, Ton, Teilchen:** später Nachmittag, schräges Licht; Kap. 13 Abendlicht, „Backstein glüht“;
  Kap. 14 Nacht mit Sternenhimmel als eigener Ansicht (T7) und Sternschnuppen (T8), Morgen mit Nebel
  über dem Bach (T8 `nebel`); Kap. 16 rotes Abendlicht, Ringe im Wasser. Musik `cedarCreek`, am Steg
  `nachtstueck` (Kap. 14) und `cedarCreek.steg` (Kap. 16); Dauergeräusche `bach`, `uhr_ticken` leise;
  Geräusche `turmuhr4` bei der Ankunft (S12), `bus`, `bus_hupe`, `sternschnuppe`, `angelschnur`.
- **Mängel:** R051 (Bank der Haltestelle auf dem Gras), R052 (Übergang Trampelpfad zur Haltestelle), R053
  (Lücke zwischen Eingang und Bibliothek), R054 (Häuser als Abziehbilder), R056 (Mittellinie
  verrutscht), R057 (Wendeplatz ohne Randsteine; mit Saum 10.72 teilweise erledigt), R059 (zwei
  Schilder am Waschsalon), R060 (Kartenwechsel beim Darüberlaufen).

### `cedarCreek.bibliothek` – Stadtbibliothek mit Lesesaal

- **Pflicht**
  - Grüne Leselampen; Tresen (Miss Ashby); Leiter, auf der Mrs. Okafor bei der ersten Begegnung steht
    (Roman Kap. 11 `[Bild]`); Zeitungsregal, Globus, Schild „Flüstern“ (vorhanden).
  - **Vorraum unter dem Balkon** mit dem Eingang, Tür zum Hauptraum (R063).
  - **Tür zum Treppenhaus** (verschlossen, nur Andeutung der oberen Etagen, R064).
  - **Kellertreppe in einem eigenen kleinen Bereich** mit Tür, nicht direkt hinter einer Tür
    (R066).
  - Ab Stufe C: Strichliste der Zwillinge am Tresen, „14 zu 14“.
- **Figuren:** Mrs. Okafor (13, 7), Dex (8, 7), Mae (10, 11) vorhanden; Zwillinge ab Stufe C drinnen
  (**fehlt**); Statisten Leserin, Student, Rentner mit Zeitung.
- **Auslöser:** `bibliothekAusgang`, `kellertreppe`, `zeitungsregal`, `globus`, `schildFluestern`,
  `treppenhaus` vorhanden; `zwillinge` (drinnen) fehlt.
- **Zustände**
  - Erste Begegnung: Mrs. Okafor auf der Leiter.
  - **Lesesaal mit Matten** für die Nacht vor dem Clubkampf (`nachtImLesesaal`; J4, Roman Kap. 11
    `[Karte]`). Hauptchat nennt den Lesesaal eigens: entweder als Zustandsfassung dieser Karte oder als
    eigene kleine Karte hinter dem Hauptraum.
  - **Clubkampf**: Tisch geräumt, Stühle im Halbkreis, Lichtkreis der grünen Lampe (Roman Kap. 15
    `[Karte]`, `[Bild]`), während `clubkampfCedarCreek`.
- **Licht, Ton:** innen grüne Leselampen; im Clubkampf Halbdunkel um den Lichtkreis. Musik
  `cedarCreek.bibliothek`, Clubkampf `cedarCreek.clubkampf`; Dauergeräusche `uhr_ticken`, `bibliothek`;
  bei „Whitlock“ Stille (S13); Sieg mit `turmuhr12` (S24). Schritte `schritt_stein`.
- **Grundriss:** Bibliothek `mf2Bibliothek` (L-Form, Breite 17, Tiefe 4, 2 Geschosse, keine Tür im Bild,
  Eingang als Seiteneingang `cc5Seiteneingang` angesetzt). Innen bis 25 breit und 8 tief erlaubt
  (10.75); heute 26 × 17, also mehr als doppelt so tief. Nach 10.75 erst das Gebäude außen vergrößern
  (die Bibliothek soll ohnehin das größte Haus sein), sonst den Raum teilen (Vorraum, Hauptraum,
  Lesesaal). Treppenhaus nach 10.76 **im Turm links am hohen Fenster** (Spalten 2–5): dort liegt die
  Tür zum Treppenhaus.
- **Mängel:** R063, R064, R065, R066, R005 (Innentüren).

### `cedarCreek.archiv` – Archiv im Keller

- **Pflicht:** eine einzige Lampe, Lichtkegel, außerhalb fast schwarz (Roman Kap. 12 `[Bild]`); Karton
  von 1858, Programmheft, Boxerfoto, Wasserfleck (vorhanden); nasse Kartons am Boden.
- **Auslöser:** `kellerAusgang`, `karton1858`, `programmheft`, `boxerfoto`, `wasserfleck` vorhanden.
- **Zustände:** vor dem Ordnen mit nassen Kartons; nach `archivGeordnet` geordnet (vorhanden).
- **Licht, Ton, Teilchen:** Lichtkegel (T6 `dunkel` mit Lichtkreis); Zeitung als Großansicht (T7);
  Erinnerung in Sepia (T10). Musik `cedarCreek.archiv`, Erzählung `ambrose.erinnerung`, New York
  `ambrose.walzer`; Dauergeräusch `archiv` (Tropfen, Lampe); `zeitung`, `spaeter`, am Ende `turmuhr7`
  (S17).
- **Grundriss:** Keller unter der Bibliothek. Die Treppe liegt im Keller dort, wo sie oben liegt (R066,
  Entscheidung 9 im Auftrag Runde 11): Wird die Kellertreppe oben in einen eigenen Bereich verlegt,
  wandert sie hier mit.
- **Mängel:** R067 (Kisten mit Zahlen als Abziehbilder), R068 (Schatten auf dem Boden ohne Grund).

### `cedarCreek.waschsalon` – Waschsalon

- **Pflicht:** Trockner mit festgeklebtem Brett, die Figuren zittern leicht (Roman Kap. 11 `[Bild]`);
  Radio; Tresen mit Mr. Boateng.
- **Figuren:** Mr. Boateng (8, 6); Statisten Kundin, Mann mit Zeitung.
- **Auslöser:** `waschsalonAusgang`, `trockner`, `zettelTurm`, `comicheft`, `automat` vorhanden.
- **Licht, Ton:** Dauergeräusch `waschmaschine` mit `radio`; `trockner_figuren` beim Ansehen. Musik
  `cedarCreek` leiser.
- **Grundriss:** Fassade `fassade_waschsalon` (Breite 8, Tiefe 6, Tür Spalte 2–3); 14 × 11 liegt im
  Rahmen; Tür innen im linken Drittel.
- **Mängel:** R061 (Schild an der Stuhllehne).

### `cedarCreek.drechslerei` – Drechslerei

- **Pflicht:** Drehbank, Holzstapel aus roter Zeder, Späne; Fensterbank für die missratenen Springer
  (Stufe B); fertiger Springer (C) steht dann im Club.
- **Figuren:** Mr. Dunmore an der Drehbank (**fehlt**, heute Statist `dunmore`): A ein Springer fehlt,
  B drei missratene Springer auf der Fensterbank, C Springer fertig, D zweiter Satz „weiter flussab“.
- **Auslöser:** `drechslereiAusgang` vorhanden; `dunmore` fehlt.
- **Zustände:** Fensterbank nach `nadelCedarCreek` mit drei Springern (Ink `dunmore_b`).
- **Grundriss:** kleine Scheune (`Barn_Small`, Breite 8, Tiefe 6); 16 × 11 liegt im Rahmen. Nach 10.76
  **Leiter zum Heuboden rechts an der Wand unter der Ladeluke**.
- **Mängel:** R058 (Werkbänke als Abziehbild, Holz ragt über).

---

## Was quer über alle Karten von Akt 1 gilt

- **Abziehbilder (R055, Regel 10.71):** Austausch nach `gutachten/ABZIEHBILDER.md`.
- **Bodenübergänge (R042):** mit den Säumen (10.72) und Straßenarten (10.73) des Kartenzeichners lösen;
  danach neu rendern.
- **Innentüren (R005):** wandhohe Innentür, sobald es sie gibt.
- **Innenräume gegen Außenbild (R065):** Faktor nach 10.75; zu groß sind heute Diner und Bibliothek,
  knapp zu breit das Wohnzimmer.
- **Figuren (R008, R020):** wer steht, steht sinnvoll; wer Schach spielt, sitzt.
- **Kartenwechsel (R060):** erst beim Gehen in Richtung des Durchgangs.
- **Abkürzungen (R031):** Wald, Fels, Zaun und Wasser sperren lückenlos, wo die Geschichte einen Weg
  vorgibt.
- **Musik in `orte.json`:** heute stehen nur sechs Einträge (`musik/*.ogg`). Nach dem Klangplan und
  Dokument 23 kommen die Kennungen aus `21_Klangplan.md` als `musik` und `geraeusch` je Karte dazu,
  Format m4a.
