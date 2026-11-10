# Nebenort N6: Sommerjahrmarkt (`jahrmarkt`)

Stand: 9.11.2026, nachts, Entwurf von mittel-3. Ortsdokument nach `docs/spiel/orte/README.md`.
Quellen: `13_Wegenetz.md` Abschnitt 5 (Nebenort N6, Sperre S13), `auftraege/runde5c_akt4.md`
(Nachtrag Nebenorte), `orte/crossroads.md`. Feld = (Spalte, Reihe), Norden oben.

## 1. Ortsplan

Der Jahrmarkt liegt „auf dem Feld hinter der Raststätte“ in Crossroads. Von crossroads.aussen führt
ein Erdweg (zwei Felder) vom Wanderweg westlich der Raststätte durch das Feld nach Norden zum
Nordrand (`jahrmarkt`, Spalten 6–7). Dort beginnt die eigene Karte `jahrmarkt.festplatz` (48 × 36):
Der Weg kommt am Südrand (23–24) auf einen großen Festplatz aus festgetretener Erde (3–44 / 4–28), ringsum Wiese und Bäume.

| Auslöser hier                             | Gegenstück                             |
| ----------------------------------------- | -------------------------------------- |
| festplatz `zurueckCrossroads` (23–24, 35) | crossroads.aussen `jahrmarkt` (6–7, 0) |

Neu in `orte.json`: Ort `jahrmarkt` (art `weg`, Staffel 2) mit Karte `jahrmarkt.festplatz`, Auslöser
`start` und `zurueckCrossroads`; in Crossroads der Auslöser `jahrmarkt`. Texte `ort.jahrmarkt.*`.

## 2. Ortsbild

Ein reisender Jahrmarkt mit Riesenrad, Karussell, Zuckerwatte und Dosenwerfen, auf einer Bühne
spielen Country-Bands. Tagsüber laut und bunt, abends Lichterketten bis zum Horizont. Mittendrin der
Kasten „Der Schachtürke“ von Schaustellerin Dolores; drin sitzt ihr Sohn Ike und freut sich über jeden,
der das Geheimnis errät. Buster verkauft Lose, Juno fotografiert alles.

## 3. Abgleich mit der Geschichte

| Element                           | Entscheidung                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| Schachautomat, Riesenrad, Losbude | als Bilder auf der Karte; Auslöser `schachautomat`, `riesenrad`, `losbude` in Runde 6 |
| Dolores, Ike, Buster              | Dolores und Ike als Figuren in Runde 6; Buster und Juno als Belebung                  |
| Lieferung von Darlene (S13)       | Abzweig ist offen, die Quest kommt mit Runde 6                                        |

Bestellte Bilder: Riesenrad, Karussell, Schachautomat, Bude Dosenwerfen, Losbude, Lichterkette,
Zuckerwatte, Schild „Summer Fair“, Lichtermast. Alle sind geliefert und eingesetzt. Die
Lichterketten hängen zwischen Holzmasten (`n6Lichtermast`, nur der Fuß sperrt) über den Gängen.

### 3.1 Runde 9: Mängel, Muster, Zustände (mittel-3, 10.11.2026)

Auftrag `runde9_uebrige_karten.md`: drei Mängel aus `variantenwahl.md`, die fünf Muster, Zustände (10.63).

**Festplatz** (`jahrmarkt-festplatz`)

- Mangel 1: Riesenrad oben in der Mitte (Wahrzeichen, mit Warteschlange), Karussell links daneben ohne Überlappung, Bühne nach rechts. Beide bleiben in Seitenansicht: so zeigt sie das Paket, ein Riesenrad sieht man immer von der Seite.
- Mangel 2: An jeder Bude und jedem Wagen steht ein Verkäufer daneben (unter der Markise wäre er verdeckt, wie in Riverton), dazu zwölf Besucher mehr (Schlange, Familie, Kinder am Karussell, Zuschauer an der Bühne).
- Mangel 3: Platz unregelmäßig mit gewellten Rändern und Grasbuchten, Strohballen, Holzzaun hinten und vorn mit Pfosten und Lücke am Torbogen. Fahrspuren: kein Bodenbild (offen).
- Zustände: keine.

### 3.2 Runde 9: Gutachten (mittel-3, 10.11.2026)

`gutachten/jahrmarkt-pelikaninsel.md`: Riesenrad und Bühne eine Reihe tiefer, dahinter ein
durchgehender Zaun; die Bühne ist begehbar (`n9BuehneBegehbar`, flach), darauf die Band mit
Sängerin, Gitarre und Fiedel; Hot-Dog- und Eisverkäuferin stehen an der Klappe ihres Wagens.

### 3.3 Runde 9: zweite Prüfung (mittel-3, 10.11.2026)

Reif für den Autor. „Am Abend“ ist jetzt zu sehen: Tönung `abend` in der Szene.

## 4. Bühnenbild

A: Riesenrad oben Mitte, Karussell links, Bühne mit Gerüst, Lautsprechern und Tribüne rechts,
Schachautomat in der Mitte, Lichterketten vor den Buden, Budenreihe unten. B: schlicht mittags, Bühne
links ohne Gerüst, Losbude, Dosenwerfen und zwei Stände. C: reich am Abend, zwei Tribünen, zwei Laternenreihen, zwei Lichterketten, alle Buden, Süßigkeitenwagen und beide Imbisswagen.

## 5. Belebung (Runde 7)

Der Jahrmarkt ist ein Ort der Art `weg` und braucht nach Regel 10.53 vier Statisten, drei davon
ansprechbar, und sechs Tiere. Er hat sieben Statisten: Juno, Buster und die Band ohne Satz (ihre
Dialoge kommen mit Runde 6), Besucher, Karussellbetreiber, Zuckerwattefrau und Ponykind mit Satz
(`statist.jahrmarkt.festplatz.*`; das Ponykind erzählt die kleine Tiergeschichte). Tiere: Pony,
Tauben, Spatzen, Hund, Katze, Krähen.

## 6. Runde 6: spielbar

Neue Datei `dialoge/de/jahrmarkt.ink`. Auslöser `schachautomat` (Dolores, Kempelens Türke von 1770;
wer errät, dass Ike im Kasten sitzt, bekommt den Fund `geheimnisTuerke` mit zehn Münzen; dort gibt
{held} auch Darlenes Lieferung ab), `riesenrad` und `losbude` zum Ansehen. Dolores steht als Figur
`jahrmarkt.dolores` neben dem Automaten (A (26, 16), B (24, 12), C (22, 16)); Ike bleibt im Kasten.

| Auslöser        | A        | B        | C        |
| --------------- | -------- | -------- | -------- |
| `schachautomat` | (24, 17) | (22, 13) | (20, 17) |
| `riesenrad`     | (21, 14) | (33, 14) | (7, 14)  |
| `losbude`       | (6, 22)  | (31, 22) | (5, 22)  |
