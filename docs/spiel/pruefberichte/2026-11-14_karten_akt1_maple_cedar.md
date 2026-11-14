# Kartengutachten Akt 1, zweite Runde: Maple Falls, Weg, Kürbishof, Cedar Creek

Stand 14.11.2026, nachts (Helfer k1 im Auftrag des Hauptchats, „Karten auf den neuesten Stand“).
Ausgangspunkt war `docs/spiel/27_Kartengutachten_Akt1.md` (Stand 13.11.); geprüft ist
`claude/friendly-shannon-y8bf90` ab df0d0c9e mit dem Werkzeug Übergangsbilder (eb1da792) und dem
Grafikbestand des privaten Repositorys. Alle 25 Szenen der Gruppe (Grundkarten und Zustände) sind
mit `pipeline.abenteuer.kartenbild` gerendert und am Bild angesehen, große Karten in Ausschnitten mit
Raster. Lage in Kacheln (x, y) ab oben links.

## Was seit dem 13.11. schon erledigt war

Laut git log und am Bild nachgesehen sind die meisten Punkte aus „Zwingend vor der Abnahme“ von
Dokument 27 umgesetzt: Calloways Terrasse mit zwei Stühlen, Fahrrad am Zaun der Martínez, Häuser mit
Tiefe statt flacher Rückansichten, Kreidebrett in einer Reihe; Halfpipe auf dem Pflasterplatz mit
Jo an der Kante, Abernathy auf seiner Bank, keine Gehwege über Wasser; Clubraum mit Radiergummi statt
schwarzer Dame, Juno und Figuren am Tisch; Dachboden mit Brett unter der Decke und Zustand ohne Brett
nach dem ersten Abend; Brett auf dem Schreibtisch im Zimmer (Epilog); Diner mit Tür links und Jukebox;
Whitlock-Aufgang einheitlich; Landstraße mit geschlossener Zaunlücke und leerem Flohmarkt; Flussweg
mit Fährstein, Zedern und Flussende; Zedernpfad von Cedar Creek aus gesperrt; Kürbishof mit Oma Miller
am Hofladen und sperrenden Kürbissen; Cedar Creek mit Turmuhr, Schuppen mit Tür, Schilf am Steg,
Zwillingen gegenüber der Bibliothek, Sternennacht am Steg; Bibliothek mit Leiter, Matten und
Clubkampf; Archiv mit Programmheft auf dem Tisch; Waschsalon mit Tür im linken Drittel und Radio;
Drechslerei mit Werkzeugschrank und drei Holzspringern. Figuren ohne Bild gibt es nicht mehr
(PixelLab-Bögen, Zwillinge getrennt).

## In dieser Runde behoben

| Karte | vorher | nachher |
| --- | --- | --- |
| `mapleFalls.aussen` | Terrasse der Calloways schwebte eine Reihe vor dem Haus; Gasse und Reihe 42 liefen als Pflaster aus der Karte; Stichweg zum grünen Häuschen hinter dem Diner endete eine Reihe vor der Tür | Terrasse reicht bis ans Haus (4–7, 30–32); Hecke an beiden Gassenenden und durchgehend in Reihe 42; Stichweg bis an die Stufen (34–35, 11) |
| `mapleFalls.park` (+ `steg-neu`) | Stadtstraße mit Gehwegen und Mittellinie stieß am Ostrand auf die Landstraße (10.72, R036); Fluss endete am Ostrand vier Reihen vor dem Fluss der Landstraße | letzte fünf Spalten Landstraße, Gehwege enden an der Laterne; Fluss am Ostrand bis zum Südrand aufgeweitet (Weltpuzzle ohne Bruch zur Landstraße) |
| `mapleFalls.zimmer` (+ `brett`) | Kleiderschrank stand frei mitten im Raum (5, 7) | an der Nordwand zwischen Treppenabsatz und Bücherregal (5, 1) |
| `mapleFalls.wohnzimmer-ausgepackt` | Mülleimer mitten in der Küche (13, 8), wie ein Kessel | neben dem Kühlschrank (18, 4), wie die Beschreibung sagt |
| `mapleFalls.clubraum` (3 Fassungen) | einfache Tür innen, außen die grüne Doppeltür der Schule (10.77) | Doppeltür innen, zwei Felder Ausgang |
| `mapleFalls.diner` (2 Fassungen) | einfache Glastür innen, außen Doppeltür (10.77) | doppelte Glastür (`rv8GlastuerSued`), zwei Felder Ausgang |
| `wegMapleCedar.landstrasse` (4 Fassungen) | Schuppen am Apfelstand war eine blaue Gartenkiste (Vogelhausform, ohne figurenhohe Tür); Plakate wanderten im leeren Zustand auf die Straße (92, 16); Ostufer endete vier Reihen vor dem Fluss des Flusswegs | brauner Schuppen mit Tür (`cc12SchuppenBraun`); im leeren Zustand dieselben zwei Plakate wie später (92/95, 12); Fluss am Ostrand angeschlossen; Beschreibung nennt die Landstraße statt „Feldweg aus Erde“ |
| `wegMapleCedar.zedernpfad` | Bäume in geraden Reihen (Baumschule), schnurgerade Felsbänder von Rand zu Rand, Pfad in rechten Winkeln, Sturmholz sperrte beide Pfadreihen, Kuppe ohne Steinkreis, Kinder ohne Eimer | Wald ohne Reihen aus sechs Nadelbaumbildern (dazu `pw7Tanne`, `pw7TanneHoch`, `pw7KieferHoch`), Unterholz (Farn, Äste, Pilze) im Wald; Felskanten mit Versätzen um eine Reihe (Abschnitte 7–18 Felder, gerade an den Treppen); Innenecken des Pfads gerundet; Sturmholz begehbar („man steigt darüber“); Steinkreis um die Bank ergänzt; Zapfeneimer am Rastplatz |
| `kuerbishof.hof` | Kürbiswaage nicht zu sehen | kleine Marktwaage links neben der Kürbiskiste (`kh13Kuerbiswaage`) |
| `cedarCreek.aussen` (+ `samstag`) | Wartehäuschen, Anschlagtafel und Tonne standen auf Rasen; Wegstummel endete im Gras; gepflasterte Spalte am Westrand und Gasse am Südrand liefen als Pflaster aus der Karte | Pflasterfläche unter Haltestelle, Tafel und Tonne, an den Uferweg angeschlossen; Stummel weg; Hecken am West- und Südrand |
| `cedarCreek.bibliothek` (3 Fassungen), `drechslerei`, `waschsalon` | einfache Tür innen, außen zwei Felder breit (10.77) | Doppeltür innen (Bibliothek, Drechslerei aus zwei Holztüren; Waschsalon doppelte Glastür `cc13GlastuerSuedDoppel`, Stil modern) |

Außerdem: die grauen Festschatten von `mf12Treppenschacht` (Zimmer, Dachboden) und
`cc13Bibliotheksleiter` sind mit `werkzeuge/schatten.py` im privaten Repository umgefärbt.
In `pipeline/abenteuer/abkuerzung.py` zählt die Landstraße jetzt als Wegboden; vorher meldete die
Prüfung auf Flussweg und Landstraße (Gatter offen) „kein durchgehender Weg“, obwohl man der Straße
folgt. Der Flussweg führt danach als einzige Karte noch „Umgehung ohne den Weg“ (über die Wiese
neben der Straße); er hat keine Sperre der Geschichte und trägt deshalb jetzt
`"abkuerzung_ok": "offenesGelaende"` wie die übrigen offenen Strecken.

## Gutachten mit frischem Blick (nach der Nacharbeit)

### Maple Falls

- **außen (64 × 43):** Liest sich als ruhige Wohnstraße mit Schule am Ende. Offen: Die Nordseite
  hat dreimal dasselbe Villenbild in drei Dachfarben (Whitlock grau, lila, rot); erlaubt (Farb-
  varianten), aber nebeneinander. Das Diner-Flachdach wirkt türkis wie Glas (Bild von LimeZu). Die
  Prüfung meldet, dass Schule (Carla bei der Schule, 45, 23) und Zaun (Carla, 28, 24) die Köpfe der
  Figuren überdecken; im Bild stehen beide davor, nur die Regel ist streng.
- **park (44 × 32):** gut. Das Wartehäuschen öffnet sich nach Süden (Rücken zur Fahrbahn), wie in
  Cedar Creek; ein Bild in Rückansicht gibt es nicht (Bildwunsch unten). Der Wasserfall hat nur
  schmale Felswangen.
- **wohnzimmer, zimmer, dachboden:** stimmig; Aufgang an derselben Stelle auf allen drei Karten,
  Brett im Zimmer ab dem ersten Abend, auf dem Dachboden danach nur der Tisch. Der Fernseher bleibt
  Entscheidung des Autors (Ortsblatt „Nicht hier: Bildschirme“).
- **clubraum:** stimmig. Die Prüfung meldet „karg, 20 %“ (Grenzwert); im Bild nicht leer.
- **diner:** stimmig; die Kellnerin hinter der Theke, Gäste auf Hockern und in den Nischen.

### Weg und Kürbishof

- **landstrasse (120 × 30):** Felder mit Holzrahmen sehen eher nach Hochbeeten als nach Acker aus;
  der Traktor steht am Rand des Kornfelds im Beet. Die Kurven der Landstraße sind treppig (1 Reihe
  Versatz alle paar Spalten), weil es für die Landstraße keine Schrägstücke gibt.
- **flussweg (120 × 30):** dasselbe Treppenbild der Straße; Fährstelle und Steg gut.
- **zedernpfad (240 × 34):** siehe oben; offen bleibt der Waldboden (Nadelstreu, Bildwunsch) und
  die Staffelei des Malers.
- **kuerbishof.hof:** gut. Oma Miller steht vor statt hinter dem Hofladen (Regel meldet Kopf unter
  dem Dach; im Bild davor).

### Cedar Creek

- **außen (60 × 50):** Der Versatz der Hauptstraße vor Drechslerei und Waschsalon (x 5–18) wirkt am
  Bild wie ein Knick mit zwei Mittellinien, nicht wie eine Kurve; Entscheidung des Hauptchats vom
  13.11., hier nicht zurückgebaut. Der blaue Linienbus ist ein Wohnmobilbild von oben.
- **bibliothek:** Rechts unten (18–25, 9–10) ist die Wand ohne Bücher (Regel 46); ein Regal dort
  würde den einzigen Gang zum Globus schließen. Die Prüfung meldet an der Kellertreppe „ohne freien
  Antritt unten“ (vorher schon).
- **archiv, waschsalon:** stimmig.
- **drechslerei:** keine Drehbank (Bildwunsch); die Doppeltür innen ist aus zwei Holztüren, außen
  ist es ein großes Scheunentor.

## Prüfergebnisse

- `python -m pipeline.abenteuer.uebergaenge`: in Ordnung.
- `python -m pipeline.abenteuer.uebergangsbilder --ort …`: alle vier Orte in Ordnung.
- `python -m pipeline.abenteuer.weltpuzzle --ort …`: Kürbishof in Ordnung; verbleibend nur Brüche
  ohne Sicht im Spiel (Maple Falls außen ↔ Park: Bach und Uferweg; Cedar Creek ↔ Flussweg: Zugang
  Zedernpfad und Gasse).
- `python -m pipeline.abenteuer.kartenbau`: keine neuen Befunde; die gemeldeten (Kellertreppe der
  Bibliothek, Köpfe unter Schule, Zaun, Hofladen und Buffet, Clubraum „karg 20 %“) waren vorher
  schon da und sind am Bild unauffällig.
- `pytest pipeline/tests`: 1337 bestanden; der Chaoslauf lief unter Last in die Zeitgrenze und
  bestand einzeln.
- `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1 --sekunden 240`: Rückgabe 0, Abspann
  erreicht; die nie erreichten Knoten in Akt 1 liegen an Reihenfolge und Partieverlauf, nicht an
  einer Karte.

## Bildwünsche

1. **Nadelstreu** als Boden (rotbraun, mit Zapfen), für den Zedernpfad unter den Bäumen.
2. **Drehbank** (Drechselbank aus Holz und Eisen, 3 × 2 Kacheln, Schrägansicht) für die Drechslerei.
3. **Staffelei** mit kleiner Leinwand (1 × 2) für den Maler auf der Kuppe.
4. **Wartehäuschen in Rückansicht** (Rückwand aus Glas zur Straße) für Park und Cedar Creek.
5. **Hölzerne Doppeltür für die Südwand** (2 × 1, flach): Clubraum, Bibliothek und Drechslerei
   haben jetzt zwei einfache Holztüren nebeneinander, die man als zwei Türen liest.
6. **Schrägstücke für die Landstraße** (Kurven), damit Flussweg und Landstraße nicht treppig wirken.
