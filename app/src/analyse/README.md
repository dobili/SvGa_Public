# `analyse/` – Werkzeuge des Buches

| Datei                     | Aufgabe                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `werkzeug.ts`             | Gemeinsame Form aller Werkzeuge und ihres Ergebnisses (Konzept 7.1, 4.6)                                         |
| `register.ts`             | Anmeldung der Werkzeuge, `werkzeugeFuer`, `wende`                                                                |
| `stellungsprofil.ts`      | Je Stellung einmal: Angriffskarte, Abtausch, Strahlen, sichere Felder, Bauern, König, Drohungen (Konzept 7.2)    |
| `k1-zaehlen.ts`           | Angreifer und Verteidiger zählen, Abtauschbilanz (Kapitel 1)                                                     |
| `k1-…` bis `k4-…`         | Werkzeuge der Kapitel 1 bis 4 (AP 8): Röntgen, Angriffsregel, Todsünden, Zielbilanz, Eröffnung, …                |
| `skelett.ts`              | Felder, Richtung, Figuren je Seite aus dem Profil (Kapitel 5), Feld- und Flügelnamen                             |
| `k5-vorher.ts`            | Skelett-Röntgen „Vorher“: was ein Bauernzug vorn gewinnt und hinten aufgibt, die vier Gründe                     |
| `k5-felder.ts`            | Leitfrage 1: Löcher, sichere Felder, Springerfelder, Königsflügel                                                |
| `k5-bauern.ts`            | Leitfrage 2: schwache Bauern mit Kürzel, Inseln, offene Linien                                                   |
| `k5-richtung.ts`          | Leitfrage 3: Ketten, Raum, Mehrheit und Minderheit, Hebel, Spannung                                              |
| `k5-figuren.ts`           | Leitfrage 4: Stellungstyp, guter und schlechter Läufer, Zielfelder, Tauschfrage                                  |
| `k5-kalibrierung…`        | Kalibrierung an allen Skelettbilanzen des Buches, je Zeile und Seite                                             |
| `planlage.ts`             | Planfrage 1 als Lage: Zentrum, Könige, Sturm, drei Bedingungen, fixierte Schwächen (Kapitel 6)                   |
| `planfragen.ts`           | Gemeinsame Texte der Planfragen, LAP mit Ziel, der Plan in einem Satz                                            |
| `k6-wo.ts`                | Planfrage 1: Wo spiele ich? Die fünf Lagen der Buchtabelle                                                       |
| `k6-gegner.ts`            | Planfrage 2: sein Plan, Drohungen, Sichern, fünf Verteidigungsmittel (Engine in GegnerKarte)                     |
| `k6-lap.ts`               | Planfrage 3: freie Felder je Figur, LAP, Vorschlag mit Weg, Tauschfrage                                          |
| `k6-planbilanz.ts`        | Die drei Planfragen für beide Seiten, Plan in einem Satz, Planbilanz des Buches                                  |
| `k7-warnsignale.ts`       | W1 bis W7 mit Gabelfeldern und der Motivtabelle des Buches (Kapitel 7)                                           |
| `k7-erzwingend.ts`        | Kandidaten in Rechenreihenfolge: Schachs, Schläge, Drohungen, nummeriert                                         |
| `k7-motiv.ts`             | Motiv benennen: die zwölf Grundmotive und Mattbilder an der Lösungszugfolge, Motiv laut Buch                     |
| `k7-ruhe.ts`              | Prüfpunkte und Abwehrfragen (Engine rechnet bis zur Ruhe in RuheKarte)                                           |
| `k8-regeln.ts`            | Die sechs goldenen Endspielregeln an der Stellung, Weg des Königs (Kapitel 8)                                    |
| `k8-opposition.ts`        | Opposition direkt, fern, diagonal: wer sie hat, welche Züge sie nehmen                                           |
| `k8-schluesselfelder.ts`  | Schlüsselfelder der Freibauern, Stand der Könige, Sonderfälle Randbauer und 6. Reihe                             |
| `k8-quadrat.ts`           | Regel des Quadrats je Freibauer mit Zugrecht, Doppelschritt und Vorbehalten                                      |
| `k9-turmbegriffe.ts`      | Abschneiden, Schachdistanz, kurze und lange Seite im Turmendspiel (Kapitel 9)                                    |
| `k9-erkennungsbilder.ts`  | Die Rückblick-Tabelle: Bild, Erkennungsfrage, Merkmale (E bei Standardnähe), Plan                                |
| `k11-phase.ts`            | Phase der Partie (Eröffnungsziele, vier Endspielfragen) und das Werkzeug dazu, Tabellenzeile der Beispielpartien |
| `k12-erfassen.ts`         | Denkroutine Schritt 1: letzter Zug und Drohungen, Warnsignale beider Seiten, Phase                               |
| `k12-kandidaten.ts`       | Denkroutine Schritte 2 bis 4: Kandidaten, stärkste Antwort, Bilanz                                               |
| `k12-sicherheitsblick.ts` | Die drei Fragen vor dem Ziehen zu einem Zug (Buchzug oder eigener Zug)                                           |
| `k8-elementarmatt.ts`     | Kasten, Matt- und Pattzüge, Sperr-, Abwarte- und Treibezüge bei Dame, Turm, zwei Läufern                         |

Ein neues Werkzeug: Datei `kN-name.ts` anlegen, in `register.ts` eintragen, Grundbausteine über
`profil(stellung)` holen, Referenztests mit Buchabbildungen schreiben (siehe `k1-zaehlen.test.ts`
und `schach/buchabbildungen.testhilfe.ts`).
