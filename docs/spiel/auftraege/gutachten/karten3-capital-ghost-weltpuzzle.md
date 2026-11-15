# Kartengutachten karten3 (15.11.2026): Capital, Ghost Town Laden, Ironwood ↔ Steinbruch, Weltpuzzle

Geprüft nach `KARTENPRUEFUNG.md` (Abschnitte 1–3) und `KARTENREGELN.md` 10.x bis 10.78 am Vorschaubild
von `python -m pipeline.abenteuer.kartenbild`, ganz und in Ausschnitten mit Raster. Lage in Kacheln
(x, y) ab oben links. Grundlage: `orte/capital.md`, `orte/ghost-town.md`, `orte/ironwood.md`.

## 1. Capital Arena (bisher nur auf Übergänge geprüft)

### `capitalArena.aussen` (80 × 60)

Gesamteindruck: ein Stadtplatz an einem Sommerabend. Der Prachtbau mit Glasdach und Kuppeln steht
auf Rasen in der Mitte, die Freitreppe führt hinunter zur Allee; südlich davon der Platz mit Brunnen,
Fahnen, Bänken und Wagen, dahinter Läden. Der Blick geht zur Freitreppe. Die Karte liest sich so, wie
die Beschreibung sie nennt.

| Befund | Lage | Warum falsch | Nacharbeit |
| --- | --- | --- | --- |
| Kein Übergang über die Allee zwischen Platz und Freitreppe | 37–41 / 36–38 | Die Achse Brunnen–Treppe ist der Hauptweg zur Arena; ohne Zebrastreifen überquert man eine Stadtstraße mit Mittellinie mitten im Verkehr | zwei `mf12Zebrastreifen` (38, 36) und (40, 36) |
| Reporterin läuft auf der Fahrbahn hin und her | von 44,37 bis 50,37 | Statisten laufen nicht auf der Allee (10.70) | läuft auf dem Platz (48–52, 43), „filmt vom Platz aus die Freitreppe“ |
| Polizist „regelt den Verkehr“ in der Fußgängerstraße | (70, 57) | Dort fährt kein Verkehr | steht am neuen Zebrastreifen (36, 39) |
| Limonadenwagen ohne Verkäufer, Eisverkäuferin mit Kühlbox mitten auf dem Platz | (62, 40), (48, 45) | Ein offener Stand hat einen Verkäufer (10.59), eine Kühlbox gibt es nicht | Verkäuferin am Wagen (65, 41) |
| Fahnen stehen auf dem Platz, nicht an der Treppe | (31, 38), (45, 38) | Beschreibung „links und rechts der Treppe“; sie flankieren aber die Achse Brunnen–Treppe | gelassen (lesbar), Beschreibung unverändert |
| Allee läuft im Westen in die Randhecke | 1–79 / 36–38 | 10.47: Straße endet sichtbar; jenseits liegt der Leuchtturmweg | offen (Stadtrand), siehe Weltpuzzle |

### `capitalArena.innenstadt` (80 × 60)

Gesamteindruck: dichte Innenstadt in drei Häuserreihen, Allee mit zwei Zebrastreifen, unten der Platz
mit Kaffeebecher-Kiosk, verschlossenem U-Bahn-Abgang („Bald“) und Bürohaus. Stimmig mit der Geschichte
(U-Bahnhof erst zur Kreidenacht offen).

| Befund | Lage | Warum falsch | Nacharbeit |
| --- | --- | --- | --- |
| Taxifahrer „wartet am Steuer“, steht aber ohne Wagen auf der Fahrbahn | (72, 34) | Figur auf der Straße, kein Taxi | gelbes Taxi `ci15Taxi` (Car_Left_11 mit Dachschild) am Nordrand der Allee (68–72, 32–34), Fahrer lehnt am Heck (73, 32) |
| Wartehäuschen öffnet sich zum Platz, nicht zur Allee | (47–50, 37–38) | 10.17 | offen: Bildwunsch „Wartehäuschen von hinten“ (Rückseite zum Platz, Bank zur Straße), Platz auf dem schmalen Nordgehweg fehlt |

### `capitalArena.ubahnhof` (36 × 20)

Gesamteindruck: stillgelegter Bahnhof mit weißen Fliesen, Graffiti, abgestelltem Zug, drei
Klapptischen für das Blitzturnier, Drehkreuze an der Treppe hinauf. Stimmig.

| Befund | Lage | Warum falsch | Nacharbeit |
| --- | --- | --- | --- |
| Stufe in der Westwand: eine Kachel Wand ragt in den Bahnsteig | (1, 7) | Wand ohne Grund, sieht wie ein Zeichenfehler aus | Boden |

### `capitalArena.halle` (30 × 20)

Gesamteindruck: festliche Turnierhalle, Bühne mit Finaltisch unter dem Banner, Tribünen, neun Tische,
Presse und Fanshop.

| Befund | Lage | Warum falsch | Nacharbeit |
| --- | --- | --- | --- |
| Fanshop ohne Verkäufer | (25–27, 11–13) | 10.59 | Statist `fanverkaeufer` (28, 12) |
| Ausgang aus Glas-Doppeltür und einzelner Glastür in anderem Stil | (15–17, 19) | Material soll einheitlich sein | offen: Außen ist die Tür 3 Felder breit (10.77 verlangt dieselbe Breite); Bildwunsch dreiflügelige Glastür |
| Schultafel an der Nordwand | (19, 1) | in einer Arena ungewöhnlich | gelassen: Auslöser `turniertafel` (Paarungen) |

## 2. Ghost Town: Laden (neu)

Neu gebaut: `ghostTown.laden` (Szene, orte.json, Text `ort.ghostTown.laden`), Übergänge
außen `ladenTuer` (4, 20) ↔ `ladenAusgang` (7, 11) und `treppe` (10–12, 3–5) ↔ Erinnerung
`rueckkehr`. Das Postreiterabzeichen im Saloon ist jetzt ein Fund (`art: gegenstand`); die Treppe
führt nur nach dem Fund (`abzeichenGefunden`) und bis zur Kerze (`kerzeGesehen`) in die Erinnerung,
Dialog `ghost-town-laden.treppe` (neue Datei, drei Fälle: vorher leeres Zimmer, Erinnerung, danach
Tapete). Einzelheiten in `orte/ghost-town.md`, Abschnitt „Laden“. Gesamtsimulation: Abspann erreicht,
alle Orte besucht.

## 3. Ironwood ↔ Steinbruch

Gleise enden im Osten an Prellböcken (Empfehlung umgesetzt, `orte/ironwood.md`, „Gleisende im Osten“).

## 4. Weltpuzzle (`python -m pipeline.abenteuer.weltpuzzle`): 48 → 28 Befunde

Behoben (im Spiel sichtbar):

- Ironwood ↔ Steinbruch: Gleise am Ostrand (Abschnitt 3).
- Pinewood ↔ Canyonrand: Der See in Pinewood lief in voller Breite in die Schlucht; er verengt sich am
  Ostrand mit Sandufer zum Fluss (Reihen 35–37), der in der Schlucht weiterfließt. Der Erdweg ist am
  Canyonrand am Rand zwei statt drei Felder breit.
- Canyonrand ↔ Staubstraße, Staubstraße ↔ Ghost Town: Die Piste wird am Rand auf die Breite der
  Nachbarkarte verjüngt (je eine Kachel pro Schritt, 10.34).
- Ghost Town ↔ Seeufer: Der See begann am Westrand im Wüstensand; jetzt endet er mit einem Strand vor
  dem Rand.
- Leuchtturm ↔ Capital: Der See lief gegen die Stadt; er endet mit einem Strand vor dem Stadtrand.
- Port Delacroix ↔ Bayou: Der Bayou hatte am Westrand nur Wasser, Port Delacroix dort Marsch; jetzt ein
  schmaler Marschstreifen mit dem Marschpfad, der Eingangssteg beginnt am Ufer (`by6StegQuer4` ab
  Spalte 3). Der gepflasterte Weg (Port, Reihen 44–45) wird vor dem Rand zu Erde wie drüben.
- Desert Springs ↔ Diner: Die Gehwege der Hauptstraße enden zwei Felder vor dem Westrand; der Highway
  hat keine Gehwege.
- Maple Falls ↔ Stadtpark: Der Fluss im Park begann an der Westgrenze im Gras der Stadt; er kommt jetzt
  von Norden in den Park (wie der Fluss in Maple Falls nach Norden abbiegt), der Uferweg beginnt am
  alten Steg statt an der Grenze. Auch im Zustand `steg-neu`.

Nicht behoben, mit Begründung:

- **Drei Überlappungen** (Jahrmarkt/Prärie, Bergstraße/Geysirbecken, Diner/Geysirbecken): Der Süden ist
  ein Ring (Summit City → Bergstraße → Diner → Desert Springs … Crossroads → Prärie → Geysirbecken →
  Summit City), dessen Wege zusammen nicht in die Ebene passen; beide Wege verlassen Summit City am
  Südrand nur 20 Spalten auseinander. Ein Zwischenstück mit Sprung am Geysirbecken ändert nichts, weil
  der Ring die Lage festlegt. Lösung braucht eine Entscheidung zur Weltkarte (Wege kürzen oder einen
  Ausgang von Summit City nach Osten legen) – Rückfrage an den Hauptchat.
- **Canyonrand ↔ Staubstraße, Wasser (Reihen 24–26):** Der Fluss in der Schlucht läuft am Ostrand
  hinaus, die Staubstraße hat dort Wüste. Ein Ende der Schlucht (Felswand quer) zeichnet der
  Kartenzeichner nicht als Wand (Probe: flacher Sandblock), eine Schlucht in der Staubstraße wäre ein
  neuer großer Teil. Bildwunsch/Werkzeug: Klippe als Querwand (`kante: klippe` senkrecht).
- **Bayou, Reihen 11–14:** Dort liegt das Hausboot direkt am Rand; ein Uferstreifen würde es aufs Land
  setzen.
- **Falsch positive, nicht sichtbar:** Summit City Südrand (Gasse in den Reihen 57–58 parallel zum Rand,
  die Prüfung schaut drei Reihen tief), Felstürme ↔ Bergstraße (die Bergstraße hat Erde als Grundboden),
  Desert Springs Reihen 3–5 (Gleisbett mit Prellbock am Rand), Silicon Bay Altstadt ↔ Campus
  (Grünstreifen mit Hecke gegen Platten des Platzes), Schule (Straße läuft südlich an den Felstürmen
  vorbei), einreihige Versätze an Kartenecken (Cedar Creek ↔ Flussweg Reihen 5 und 34, Maple Falls ↔
  Park Reihe 41, Port ↔ Deich Reihe 29, Diner ↔ Bergstraße Reihe 105, Capital ↔ Leuchtturm Reihen 20
  und 49, Crossroads ↔ Hütten Reihe 16 mit schrägem Weg, Crossroads ↔ Festplatz Spalte 30).
- **Capital ↔ Leuchtturm, Reihen 42–48:** Die Stadt endet am Westrand mit Hecke und Pflaster, der
  Weg kommt in den Reihen 40–41 durch; die Allee (36–38) läuft in die Hecke. Ein Stadtrand mit
  Übergang Weg → Stadt gehört auf eine Karte (10.72) und wäre ein eigener Auftrag.

## 5. Ältere Befunde des Kartenbaus

- `cc12TreppeAb` (Bibliothek Cedar Creek, drei Szenen): falsch positiv. Ein Abgang wird von oben
  betreten; die Prüfung schaut jetzt bei `richtung: runter` mit freier oberster Maskenreihe oben
  nach dem Antritt, beim Treppenschacht im Dachboden (Geländer oben) weiter unten
  (`kartenregeln.py`, Test `test_kartenregeln_antritt.py`).
- Nicht geändert (Akt 1, vom Autor durchgesehen): „überdeckt eine Figur“ bei Oma Miller, Carla,
  Hector – die Figur steht vor dem Möbel, die Prüfung zählt auch die Kopfreihe; Clubraum „karg“ mit
  genau 20 % (Untergrenze). Hinweise „Felswand endet frei“ (Port Delacroix, Summit City, Weg Riverton
  ↔ Ironwood 2) gehören zu anderen Gruppen.
