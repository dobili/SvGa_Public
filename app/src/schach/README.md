# `schach/` – Schachlogik

| Datei                 | Aufgabe                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `stellung.ts`         | FEN lesen, Faustwerte der Figuren (Kapitel 1), Feldnamen                                    |
| `angreifer.ts`        | Angreifer eines Feldes, auch in Batterien (Kapitel 1, Abb. 1.26)                            |
| `angriffskarte.ts`    | Angreifer je Feld und Farbe, gemerkt; angegriffene, ungedeckte (W1), hängende Figuren       |
| `abtausch.ts`         | Schlagfolge mit der billigsten Figur zuerst, Bilanz (Kapitel 1 und 7)                       |
| `strahlen.ts`         | Je Langschrittfigur die erste und zweite Figur auf jedem Strahl (Kapitel 7)                 |
| `linienmotive.ts`     | Aus den Strahlen: Fesselung, Spieß, Abzug, Batterie (Kapitel 7, Motive 2 bis 4)             |
| `sichereFelder.ts`    | Je Figur die Felder ohne Materialverlust; Zugziele auch für die Seite nicht am Zug          |
| `bauernprofil.ts`     | Inseln, Ketten mit Basis und Stützen, Duos, offene Linien, Löcher, starke Felder, Mehrheit  |
| `bauernschwaechen.ts` | Deckungstest, Doppelbauern, Isolani, rückständige und hängende Bauern, Freibauern           |
| `koenigsumgebung.ts`  | Fluchtfelder (W3), Bauernschild, Linien zum König, rochiert                                 |
| `bauernzug.ts`        | Ein Bauernzug: neu gedeckte und aufgegebene Felder, neue Löcher, die vier Gründe (Kap. 5)   |
| `skelettfelder.ts`    | Leitfrage 1: nutzbare Löcher, sichere Felder, Springerfelder, Königsflügel                  |
| `skelettrichtung.ts`  | Leitfrage 3: Kettenrichtung, Raum, Mehrheit und Minderheit je Flügel, Hebel, Spannung       |
| `skelettfiguren.ts`   | Leitfrage 4: Stellungstyp, guter und schlechter Läufer, Zielfelder, schwache Bauern mit Art |
| `aktivitaet.ts`       | LAP-Prinzip: freie Zielfelder je Figur, am wenigsten aktive und aktivste Figur (Kapitel 6)  |
| `figurenziel.ts`      | Zielfeld und Weg für eine Figur nach Kapitel 5 (Springer, Türme, Läufer), Platzmacher       |
| `sturm.ts`            | Bauernzüge bis zum ersten Hebel gegen den Schild, Ziele im Schild, die nur der König deckt  |
| `gabeln.ts`           | Gabelgeometrie (W6): Felder, von denen ein Springer oder Bauer zwei Ziele trifft            |
| `taktikmotive.ts`     | Die zwölf Grundmotive aus Kapitel 7, erkannt an einer Lösungszugfolge                       |
| `mattbilder.ts`       | Mattbilder aus Kapitel 7: Erstickung, Grundreihe, Anastasia, Arabisch, Boden, Damiano, …    |
| `koenigsweg.ts`       | Königsabstand und kürzester sicherer Weg des Königs zu Zielfeldern (Kapitel 8, Regel 1)     |
| `opposition.ts`       | Opposition direkt, fern, diagonal; Züge, die sie nehmen (Kapitel 8, Regel 2)                |
| `kpk.ts`              | Endspieldatenbank König und Bauer gegen König, beim ersten Gebrauch berechnet (exakt)       |
| `ergebnispruefung.ts` | Halten die Oppositionszüge das Ergebnis? Sonst Patt, Quadrat, Bauernzug, Reserve-Tempo      |
| `schluesselfelder.ts` | Schlüsselfelder eines Bauern nach der Tabelle des Buches, Stand der Könige, 6. Reihe        |
| `quadrat.ts`          | Regel des Quadrats mit Zugrecht, Doppelschritt und den Vorbehalten des Schachtipps          |
| `elementarmatt.ts`    | Dame, Turm, zwei Läufer gegen König: Kasten, Matt, Patt, Sperr-, Abwarte-, Treibezüge       |
| `turmendspiel.ts`     | Turmendspiel mit Freibauer: Abschneiden, Schachdistanz, Seiten, Philidor (Kapitel 9)        |
| `erkennungsbilder.ts` | Die Bilder der Rückblick-Tabelle von Kapitel 9 mit ihren Merkmalen                          |
| `laeuferbilder.ts`    | Bilder mit Läufer: ungleichfarbig (getrennte Freibauern), falscher Läufer, gegen Springer   |
| `studienpruefung.ts`  | Umwandlungen, Pattprüfung mit Reserve, stille Züge, Idee des Gegners (Kapitel 10)           |
| `phase.ts`            | Partiephase nach der Denkroutine: Eröffnungsziele, die vier Endspielfragen aus Kapitel 8    |
| `drohungen.ts`        | Schachs, Schläge mit Bilanz, Drohungen (Konzept 7.2), erzwingende Züge (Kapitel 7)          |
| `notation.ts`         | Züge wie im Buch schreiben: „6. Le2 Sh6“ (Kapitel 0)                                        |
| `variantenbaum.ts`    | Zeile, Stellung nach Pfad, Abzweigungen eines Beispiels (Nachspielen)                       |
| `weiterspielen.ts`    | Eigene Züge ab einer Stellung, Rochade über das Königsfeld, Skelett-Ansicht                 |

Die Grundbausteine (Angriffskarte bis Drohungen) fasst `analyse/stellungsprofil.ts` zu einem
Profil je Stellung zusammen; Werkzeuge greifen nur darüber zu. Anfangen mit `angreifer.ts`; die
Tests daneben zeigen die Buchbeispiele. `buchabbildungen.testhilfe.ts` lädt Abbildungen aus den
erzeugten Daten für Referenztests.
