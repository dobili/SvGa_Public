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

## 4. Bühnenbild

A: Riesenrad oben Mitte, Karussell links, Bühne mit Gerüst, Lautsprechern und Tribüne rechts,
Schachautomat in der Mitte, Lichterketten vor den Buden, Budenreihe unten. B: schlicht mittags, Bühne
links ohne Gerüst, Losbude, Dosenwerfen und zwei Stände. C: reich am Abend, zwei Tribünen, zwei Laternenreihen, zwei Lichterketten, alle Buden, Süßigkeitenwagen und beide Imbisswagen.
