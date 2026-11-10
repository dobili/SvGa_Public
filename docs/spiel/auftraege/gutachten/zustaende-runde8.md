# Gutachten: Zustände aus Runde 8 (10.11.2026)

Unabhängiger Gutachter (Gutachter-Chat). Je Zustand wurde die Grundkarte und die Zustandskarte mit
`kartenbild` gezeichnet (privates main 8cad9e3d bzw. c0febaac) und Kachel für Kachel verglichen.
Geprüft ist nur, ob das Bild zum Satz „Zustand: …“ passt (Liste aus
`python -m pipeline.abenteuer.zustaende`, 26 Zustände). Lage in Kacheln (x, y) ab oben links.

## Übersicht

| Karte                     | Zustand            | Urteil            |
| ------------------------- | ------------------ | ----------------- |
| mapleFalls.dachboden      | ohne-brett         | passt             |
| mapleFalls.wohnzimmer     | ausgepackt         | passt weitgehend  |
| mapleFalls.clubraum       | pokal              | passt             |
| mapleFalls.park           | steg-neu           | passt             |
| mapleFalls.park           | schulbus           | passt, Bus falsch |
| cedarCreek.archiv         | geordnet           | passt halb        |
| wegMapleCedar.landstrasse | flohmarkt-leer     | passt             |
| wegMapleCedar.landstrasse | gatter-offen       | passt             |
| wegMapleCedar.landstrasse | gatter-offen-leer  | passt             |
| riverton.aussen           | trainingszentrum   | passt nicht ganz  |
| riverton.aussen           | tische-kaputt      | passt             |
| riverton.aussen           | unterschriften     | passt             |
| riverton.aussen           | nachspiel          | passt             |
| riverton.pavillon         | perfect-move       | passt             |
| riverton.bahnhofshalle    | slick-auf-der-bank | passt             |
| riverton.bahnhofshalle    | plakat             | passt knapp       |
| riverton.schuppen         | ohne-fahrrad       | passt             |
| wegRivertonIronwood (1)   | graffiti           | passt             |
| wegRivertonIronwood (2)   | ohne-tische        | passt             |
| lockport.aussen           | steg-offen         | passt             |
| lockport.aussen           | boot-an-land       | passt             |
| ironwood.aussen           | vermietet          | passt             |
| ironwood.aussen           | meisterschaft      | passt             |
| ironwood.kantine          | logo               | passt             |
| portDelacroix.musikhaus   | neu                | passt             |
| wegDesertSummit.diner     | neon               | **passt nicht**   |

## Schwerster Befund

**wegDesertSummit.diner, Zustand „neon“:** Das Schild zeigt „KING'S DINER“ mit K (x 43–49, y 4–6),
das lose K im Hinterhof ist weg – so weit richtig. Der Zustand ist aber aus einer anderen Fassung
der Karte gebaut als die jetzige Hauptfassung (seit der Variantenwahl C): 28 Bereiche mit rund 640
Kacheln weichen ab. Die Felskante oben links verläuft anders (x 52–54, y 0–4), Kakteen und Felsen
stehen an anderen Stellen (x 7–53, y 3–25; x 66–105, y 0–10), neben der Tankstelle steht statt des
grauen Autos ein Autowrack, der Hund läuft woanders. Beim Wechsel des Zustands spränge die halbe
Landschaft. Der Zustand muss aus der Hauptfassung neu abgeleitet werden. Dasselbe ist bei allen
Zuständen zu prüfen, deren Grundkarte bei der Variantenwahl von A auf C gewechselt hat.

## Zustände im Einzelnen

### Maple Falls

- **Dachboden, ohne-brett:** Der runde Tisch (x 4–5, y 6–7) ist leer, alles andere gleich. Kein
  Mangel.
- **Wohnzimmer, ausgepackt:** Kartons im Wohnzimmer weg, links Sofa (x 0–3, y 6–7) und runder
  Couchtisch (x 2–3, y 8–9), am Durchgang zur Küche bleibt eine Kiste (x 12–13, y 8). Mängel:
  1. Auch die Kartons oben in der Küche (x 12, y 3–4) sind weg; der Satz sagt, die Kiste in der
     Küche bleibe.
  2. Neu steht im Wohnzimmer ein Warenregal mit bunten Dosen (x 8–10, y 8–10), das der Satz
     nicht nennt.
  3. Das Sofa ist von hinten gezeichnet, Rücken zum Raum.
- **Clubraum, pokal:** Goldpokal auf dem Lehrertisch rechts neben dem Buch (x 13, y 4–5). Mangel:
  Er ragt über die hintere Tischkante.
- **Park, steg-neu:** Bretterhaufen und Absperrung weg, neuer Steg mit Pfosten (x 5–6, y 2–4).
  Mängel:
  1. Der Pfadstummel (x 5–6, y 5,5–7) endet eine Kachel vor dem Steg im Gras.
  2. Der Zustandssatz bricht ab: „Nach der ersten Clubnadel (S5): Mr.“ Die Satzerkennung in
     `zustaende.py` schneidet am Punkt nach „Mr“.
- **Park, schulbus:** Bus an der Straße (x 21–27, y 14–17), Steg schon neu. Mängel:
  1. Bus in Seitenansicht, 6,5 × 4 Kacheln, auf einer Fahrbahn in Draufsicht; er überdeckt
     Nordgehweg und ganze Fahrbahn (Soll nach 10.64: 7–9 × 3).
  2. Er steht nicht an der Haltestelle (x 24–28, y 19–22 südlich), sondern auf der Gegenseite.
  3. Die Laterne (x 21) steht vor dem Bus.

### Cedar Creek

- **Archiv, geordnet:** Statt zwei Stapeln aus je drei Kartons (x 1–3, y 7–9) steht je ein Karton.
  Mangel: Die Kartons sehen vorher und nachher gleich aus (trocken, geschlossen); „nass und
  aufgeweicht“ zeigt die Grundkarte nicht, der Unterschied ist nur die Zahl.

### Landstraße

- **flohmarkt-leer:** Tische, Kisten und Sessel weg, Wohnmobil und Plakate bleiben (x 88–98,
  y 19–24). Mangel: Verkäuferin und Kunde stehen weiter auf dem leeren Hof (x 94–95, y 21–22).
- **gatter-offen:** Gatterflügel weg (x 51–54, y 11). Mangel: Das Gatter ist verschwunden statt
  aufgeschwenkt, und die zwei Endpfosten sind grau statt aus Holz wie der Zaun.
- **gatter-offen-leer:** Beides zusammen; gleiche Mängel.

### Riverton

- **außen, trainingszentrum:** Schild „PERFECT MOVE“ über dem rechten Unterstand (x 38–43,
  y 46–47), Absperrbock „GESPERRT“ auf dem Pflaster (x 43–44, y 51–52). Mangel: Der Satz spricht
  von Pavillon, Eingang und Treppe; im Bild gab es beim Zeichnen keinen Pavillon, das Schild hängt
  quer über zwei offenen Dächern. (Mit dem neuen Bahnhof und Pavillon ab c0febaac in der dritten
  Prüfung neu ansehen.)
- **außen, tische-kaputt:** Zwei Laptops fehlen (x 22–23 und x 32–33, y 49–50). Mangel: „Kaputt“
  und „Winter“ sind nicht zu sehen; die Tische sind heil und nur leer, die Wiese ist grün.
- **außen, unterschriften:** Alle Laptops weg, neuer Picknicktisch (x 36–37, y 51–52). Mangel: Auf
  dem Tisch liegt nichts (keine Liste, kein Stift), er steht direkt an einem zweiten Tisch.
- **außen, nachspiel:** Tische und Dächer weg (x 22–33, y 46–50), Schild und Bock fort. Mangel:
  Die Fläche ist blanker Rasen von zwölf mal fünf Kacheln.
- **Pavillon, perfect-move:** Schild an der Nordwand (x 8–13, y 1–2), Laptops statt Bretter,
  Limonadenstand fort. Mängel:
  1. Unter dem Schild schaut der Rahmen des Gründungsbilds heraus.
  2. Die Laptops hängen wie zuvor die Bretter über die Tischenden.
  3. Drei gleiche Pflanzen in einer Reihe füllen die Lücke des Stands (x 19–21, y 14–15).
- **Bahnhofshalle, slick-auf-der-bank:** Brett auf der Zweierbank im Westen (x 2–3, y 11),
  Rucksack davor (x 3–4, y 12–13). Mängel: Das Brett liegt auf der Lehnenkante; die
  „Kuriertasche“ ist ein Wanderrucksack; Slick selbst ist nicht da.
- **Bahnhofshalle, plakat:** Kleines Plakat an der Nordwand neben dem Kiosk (x 5, y 0–1). Mangel:
  Eine halbe Kachel groß, grau, über die Wandkrone ragend; als Plakat der Landesmeisterschaft
  nicht lesbar.
- **Schuppen, ohne-fahrrad:** Fahrrad weg, gefaltete Plane am Boden (x 1–2, y 4–5). Mangel: Die
  Plane war grün und ist jetzt grau.

### Weg Riverton–Ironwood

- **Kanalweg, graffiti:** Auf der Hofmauer (x 1–15, y 30–32) Turm, rosa Springer und zweiter Turm
  statt Turm und grauer Krone; Sprayerin weg. Mängel: „Die Wand ist ganz bemalt“ – drei Figuren
  auf 15 Kacheln; eine Leiter gab es in der Grundkarte nicht.
- **Eisenbrücke, ohne-tische:** Klapptische und Hocker weg (x 19–28, y 63–64), Leiter und Fass am
  Nordkopf weg (x 15, y 50–52). Mangel: Dime und der Kiebitz stehen weiter am leeren Kai; Corwin
  steht unverändert mitten auf der Brücke.

### Lockport

- **steg-offen:** Beide Absperrungen weg (x 30–31 und x 42–43, y 14–15), am Torkopf ein Brett als
  Auftritt. Mangel: Der Torsteg bleibt ein schmaler geknickter Balken; dass man darüber geht,
  sieht man nicht.
- **boot-an-land:** Boot nicht mehr am Kai (x 21–25, y 18–19), sondern auf dem Werftplatz
  (x 44–48, y 21–22). Mängel:
  1. Es ist das weiße Motorboot, der Satz sagt „Ruderboot“.
  2. Der Bootsbauer steht mitten im Boot (x 46, y 21).
  3. Keine Böcke oder Keile; das Boot ragt in die Schuppenwand.

### Ironwood

- **außen, vermietet:** Schild „PERFECT MOVE“ am Werkstor (x 55–60, y 26), Werksbus im Hof
  (x 53–59, y 19–22). Mängel: Das Schild liegt als Balken auf dem Boden der Toröffnung, an
  nichts befestigt; der Bus (Seitenansicht, 6,5 × 4) steht in den Fässern und vor dem
  Automatenhäuschen.
- **außen, meisterschaft:** Schild bleibt, Bus fehlt. Mangel wie oben beim Schild.
- **Kantine, logo:** Schild an der Nordwand (x 8–13, y 0–1), offener Karton mit Goldpokal an der
  Tür (x 16–17, y 16–17). Mängel:
  1. Das Schild hängt über der Küchenzeile hinter der Trennwand, nicht über der Ausgabe im
     Gastraum, und verdeckt die Speiseplan-Tafel halb.
  2. Die Pokale der Schachecke (x 26–28, y 1–2) stehen unverändert da, obwohl der Karton „die
     Pokale des Clubs“ enthält.

### Port Delacroix

- **Musikhaus, neu:** Ganz neuer Raum mit heller Wand, gelben Dielen, Schild „MUSIK UND SCHACH
  SEIT 1889“, Klavier, Regalen, vier Tischen mit Brettern, Teppich. Mängel:
  1. Regal oben rechts mit bunten Dosen statt Noten oder Büchern (x 16–17, y 3–5).
  2. Alle vier Figuren stehen frei in der Mitte; niemand sitzt oder spielt Klavier.

## Wiederkehrende Punkte

1. Figuren bleiben stehen, wo ihr Anlass weg ist (leerer Flohmarkt, leerer Kai, leere Brücke).
2. Schilder von Perfect Move liegen als Balken über Dächern, Böden oder Bildern statt an einer
   Wand oder einem Pfosten zu hängen.
3. Der Bus ist eine Seitenansicht auf Flächen in Draufsicht und steht nicht an der Haltestelle.
4. „Kaputt“, „nass“, „Winter“ sind in den Bildern nicht zu sehen; der Unterschied ist jeweils nur
   ein fehlender Gegenstand.
5. Das Dosenregal dient als Bücher-, Noten- und Wohnzimmerregal.
