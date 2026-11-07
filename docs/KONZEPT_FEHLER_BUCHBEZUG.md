# Fehler mit Buchbezug: Vorschlag für Zeitleiste, Rückblick und Startseite

Stand 6.11.2026 · Wunsch des Autors vom selben Tag · Recherche, noch kein Code

## Kurz gesagt

- **Die Hälfte gibt es schon.** Die App ordnet Fehlzüge bereits nach den Regeln des Buches ein
  (rund zwanzig „Fehlerarten“: Drohung ignoriert, Figur hängen lassen, Schlagreflex, verfrühte
  Dame, König passiv …). Sie tut das für die absichtlichen Fehler der Bots, für den Rückblick Zug
  für Zug und für den Vorschlag in der Fehlerdatenbank. Diese Erkennung wurde an über 6000
  Lichess-Zügen mit einer tieferen Engine nachgeprüft: Die starken Arten stimmen zu 89 bis 96 %.
  Die Zeitleiste nutzt sie nur noch nicht.
- **Neu zu bauen ist die Gegenrichtung:** nicht „warum war mein Zug schlecht“, sondern „mit
  welcher Idee des Buches hätte ich den besseren Zug gefunden“. Dafür prüft die App den besten
  Zug der Engine und seine gespeicherte Fortsetzung (bis sechs Halbzüge) mit vorhandenen
  Erkennern: Schach-Röntgen-Regel, Zählen, die zwölf Grundmotive, Mattsuche, Quadrat, Opposition,
  Schlüsselfelder, Zielbilanz, LAP, Buchvarianten.
- **Vorschlag: 20 Kategorien**, zehn für den gespielten Zug („Warum“) und zehn für den besseren
  Zug („So findest du ihn“). Nur Kategorien mit hoher oder mittlerer Zuverlässigkeit; was nicht
  sicher erkennbar ist, bleibt ausdrücklich draußen (Abschnitt 6).
- **Auf der Karte stehen höchstens zwei Zeilen**: eine Warum-Zeile, eine Findezeile, dazu ein
  kleiner Knopf „Üben“ mit Trainer und Kapitel.
- **Rechenzeit ist kein Problem für eine Partie** (gemessen: etwa 10 ms je Fehlzug am Rechner,
  am Handy geschätzt 30 bis 50 ms). Für die Empfehlungen über viele Partien sollte das Ergebnis
  einmal nach der Auswertung gespeichert werden.
- **Empfehlung auf der Startseite** erst ab 5 ausgewerteten Partien und wenn eine Kategorie in
  mindestens 3 der letzten 10 Partien auftaucht.
- **Nebenbefund:** Der Rückblick gibt der Fehlererkennung heute nur den ersten Zug der
  Widerlegung. Gespeichert sind aber sechs. Mit nur einem Zug sieht die Erkennung kein
  Zurückschlagen, und das kann falsche Gründe ergeben („Bauer eingestellt“ bei einem
  gewöhnlichen Abtausch). Die Lösung ist klein (Anhang B).

---

## 1. Was die App heute schon erkennt

### 1.1 Fehlerarten des gespielten Zuges

Die App kennt schon diese Fehlerarten. Die Prüfung braucht die Stellung vor dem Zug, den Zug und
die Widerlegung der Engine. Die Zahl dahinter sagt, wie oft eine tiefere Engine (Tiefe 20)
den Fehler bestätigt hat.

| Fehlerart (Name in der App)            | Buchbezug                      | Regel in Kurzform                                                                     | bestätigt |
| -------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------- | --------- |
| eine Drohung ignoriert                 | Kap. 1 Röntgen-Regel, Kap. 7   | Vor dem Zug drohte Matt oder Gewinn, nach dem Zug droht dasselbe noch                  | 89–96 %   |
| eine Figur hängen lassen (W1)          | Kap. 4 W1, Kap. 1 Zählen       | Nach dem Zug ist eine Figur laut Abtauschrechnung verloren, vorher nicht               | 89–96 %   |
| einen Bauern eingestellt               | Kap. 1 Zählen                  | Die Widerlegung schlägt einen Bauern mit Gewinn                                        | 89–96 %   |
| aus Schlagreflex geschlagen (W5)       | Kap. 4 W5, Glossar             | Schlag sieht nach Gewinn aus, die Strafe folgt erzwungen in höchstens vier Halbzügen   | 96 %      |
| die Dame auf Bauernraub geschickt      | Kap. 4 Köder, Kap. 1 Todsünde  | Dame nimmt einen Bauern, Leichtfiguren noch zu Hause                                   | 89–96 %   |
| eine Taktik übersehen                  | Kap. 7, W2, W6                 | Die Widerlegung spielt Gabel, Fesselung, Spieß, Abzug oder Doppelschach und gewinnt    | 89–96 %   |
| einen guten Schlag ausgelassen         | Kap. 1 Zählen                  | Der beste Zug war ein Schlag mit Gewinn, gespielt wurde keiner                         | 89–96 %   |
| die Dame zu früh gezogen               | Kap. 1 Todsünde                | Dame vom Startfeld, zwei Leichtfiguren zu Hause                                        | 82–85 %   |
| den König in der Mitte gelassen        | Kap. 1 Todsünde                | Ab Zug 10 eine mögliche Rochade ausgelassen                                            | 82–85 %   |
| ein Tempo verschenkt                   | Kap. 1 Entwicklung             | Entwickelte Figur zieht noch einmal, andere stehen zu Hause                            | 82–85 %   |
| einen Bauernzug ohne Not gemacht       | Kap. 5, Kap. 8                 | Ruhiger Bauernzug mit Verlust                                                          | 82–85 %   |
| den König ohne Not gezogen             | Kap. 11                        | Königszug vor dem Endspiel, keine Rochade                                              | 82–85 %   |
| den Königsschild geschwächt            | Kap. 2, 3, 5 (Luftloch)        | Bauer vor dem rochierten König zieht                                                   | 79 %      |
| den König passiv gelassen              | Kap. 8 Regel 1                 | Endspiel, keine Dame des Gegners, bester Zug bringt den König näher ans Ziel           | 75–85 %   |
| einen Bauern vorschnell vorgeschoben   | Kap. 8                         | Bauernzug im Endspiel mit Verlust                                                      | 74 %      |
| im Rückstand abgetauscht               | Kap. 8 Regel 4                 | Zwei Bauern zurück, gleichwertiger Figurentausch, kein Zurückschlagen                  | 96 %*     |
| patt gesetzt                           | Kap. 8 Pattfalle               | Patt trotz Vorsprung (genau)                                                           | genau     |

\* nach der Schärfung vom 22.10.2026; davor 60 %.

Die Zeitleiste zeigt davon heute nichts. Der Rückblick (Zug für Zug) zeigt einen Satz dazu, etwa
„lässt die Drohung Dxe5+ stehen“, mit Markierungen am Brett.

### 1.2 Erkenner, die den besseren Zug prüfen können

Diese Bausteine sind fertig. Bisher prüft keiner von ihnen den besten Zug der Engine.

| Baustein                         | Was er sicher kann                                                                                 | aus welcher Stellung                      | Zuverlässigkeit                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| Erzwingende Züge (Röntgen-Regel) | alle Schachs (mit Matt-Kennzeichen), Schläge mit Abtauschbilanz, drohende Züge                     | vor dem Zug                               | genau (reine Regel)                                                                        |
| Abtauschrechnung (Zählen)        | Bilanz eines Schlags auf einem Feld, auch mit Figuren hinter Figuren                               | vor dem Zug                               | genau im Rahmen der Regel; verdeckte Taktik sieht sie nicht                                |
| Motiverkennung (12 Grundmotive)  | Gabel, Doppelangriff, Fesselung, Spieß, Abzug, Doppelschach, Umwandlung, Rettung, Folge-Motive     | Zugfolge ab der Stellung vor dem Zug      | Ein-Zug-Motive gut; Folge-Motive (Hinlenkung, Überlastung …) eher grob                      |
| Mattbilder                       | zehn Mattbilder des Kapitels 7 an einer Mattstellung                                               | Stellung am Ende der Folge                | hoch                                                                                       |
| Mattsuche                        | beweist Matt in höchstens drei Zügen (eigene Züge nur Schachs)                                     | vor dem Zug                               | meldet nie ein falsches Matt, übersieht stille Mattzüge                                   |
| Quadratregel                     | Holt der König den Freibauern ein? Mit Zugrecht, Doppelschritt und den Ausnahmen des Autors        | vor und nach dem Zug                      | hoch in Bauernendspielen                                                                   |
| Opposition, Schlüsselfelder      | wer die Opposition hat, welche Züge sie nehmen; Schlüsselfelder und wer sie erreicht               | vor dem Zug                               | hoch; für König und Bauer gegen König genau (Datenbank)                                    |
| Königsweg                        | Abstand des Königs zu seinem Ziel                                                                  | vor und nach dem Zug                      | hoch                                                                                       |
| Zielbilanz, Todsünden            | Zentrum, Entwicklung, Rochade; die vier Todsünden an der Zugfolge                                  | Zugfolge                                  | mittel (die App nennt Todsünden bewusst als „mögliche“)                                    |
| LAP (Kap. 6)                     | freie Felder je Figur, am wenigsten aktive Figur                                                   | vor dem Zug                               | Felder zählen genau; ob die LAP-Figur gerade dran ist, ist eine Faustregel                 |
| Buchvarianten (Kap. 2, 3)        | Ist die Stellung in einer Variante des Buches, und welche Züge spielt das Buch?                    | vor dem Zug                               | genau                                                                                      |
| Zugart taktisch oder ruhig       | ruhig, wenn kein Schach, keine Drohung und kein Schlag mit Gewinn                                  | vor dem Zug                               | hoch (läuft heute schon je Stellung für die Spielstärke)                                   |
| Phase                            | Eröffnung, Mittelspiel, Endspiel nach den Fragen des Buches                                        | je Stellung                               | hoch (läuft schon je Stellung)                                                             |
| Dauerschach                      | Wiederholung mit Schach in einer Folge                                                             | Zugfolge                                  | hoch                                                                                       |
| Bauernschwächen, Skelett         | Isolani, Doppelbauer, rückständiger Bauer, Löcher, was ein Bauernzug hinten aufgibt                | vor und nach dem Zug                      | genau als Befund; ob er den Wert der Engine erklärt, ist offen                              |

**Was gespeichert ist:** Für jede ausgewertete Partie (höchstens 50) liegen je Stellung der Wert,
der beste Zug, der Abstand zum zweitbesten Zug und die Hauptvariante der Engine (bis sechs
Halbzüge, Tiefe 18). Für die Prüfung „Hättest du den besseren Zug finden können?“ reicht das: Die
Variante ab der Stellung vor dem Zug ist der bessere Zug mit Fortsetzung. Die Variante ab der
Stellung danach ist die Widerlegung des gespielten Zuges. Eine neue Engine-Rechnung ist nicht
nötig.

### 1.3 Rechenzeit (gemessen)

Gemessen habe ich an Morphys Opernpartie (33 Halbzüge) am Rechner, Node, ein Kern:

| Prüfung                                                 | je Zug     |
| ------------------------------------------------------- | ---------- |
| Lage vor dem Zug und Fehlerart des gespielten Zuges     | etwa 2 ms  |
| Erzwingende Züge der Stellung (Röntgen-Regel)           | etwa 2 ms  |
| Motiverkennung an fünf Halbzügen                        | etwa 4 ms  |
| Zugart taktisch oder ruhig                              | unter 1 ms |
| Endspielregeln (Kap. 8)                                 | unter 1 ms |
| Todsünden (ganze Zugfolge)                              | unter 1 ms |

Ein Fehlzug mit allen Prüfungen kostet also etwa 10 ms, am Handy geschätzt 30 bis 50 ms. Eine
Partie hat für eine Seite meist 8 bis 15 Züge ab „ungenau“. Das ergibt am Handy rund eine halbe
Sekunde je Partie. Für die Zeitleiste einer Partie ist das tragbar. Für die Startseite über zehn
Partien (etwa 5 Sekunden am Handy) ist es zu langsam, um bei jedem Öffnen zu rechnen. Deshalb gibt
es in Abschnitt 4 einen Vorschlag zur Speicherung.

---

## 2. Was jedes Kapitel lehrt (Kurznamen)

Die rechte Spalte sagt, ob die App das Werkzeug an einer Partiestellung zuverlässig prüfen kann.

| Kap. | Werkzeug, Regel, Merksatz (Kurzname)                                                                 | in Partien prüfbar?                                   |
| ---- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 0    | Gangarten, Schach, Matt, Notation                                                                    | nein (kein Fehler in Partien)                         |
| 1    | Drei Eröffnungsziele (Zentrum, Entwicklung, Königssicherheit)                                        | mittel                                                |
| 1    | Vier Todsünden (verfrühte Dame, Materialgier, Passivität, König in der Mitte)                         | mittel                                                |
| 1    | Schach-Röntgen-Regel (Schach, Schlag, Drohung, Optimierung), in beide Richtungen                      | hoch für die ersten drei Fragen                       |
| 1    | Angreifer und Verteidiger zählen, Bauernhebel                                                        | hoch                                                  |
| 1    | Nicht vorschnell schlagen (Spannung), Drohung ignorieren (wer zuerst kommt)                           | nur „Drohung ignoriert“ hoch, Spannung nein           |
| 1    | Goldene Angriffsregel (Übermacht im Angriffssektor)                                                  | nein (Faustregel, keine Fehlerursache)                |
| 2    | Zielbilanz, Steckbriefe, Idee der Eröffnung, Zugumstellungen                                         | Zielbilanz mittel, Buchzüge genau                     |
| 3    | Kasparows vier Faktoren, Faktorenbilanz, Gambit zurückgeben                                          | nein (Kompensation beurteilt nur die Engine)          |
| 4    | Goldene Verteidigungsregel, Warnsignale W1–W5, Prüffragen F1–F3, Stopp-Moment, Fallencheck            | W1 und W5 hoch; Fallen genau, wenn die Stellung passt |
| 5    | Grundgesetz der Bauern, Skelett-Röntgen (Vorher, Felder, Bauern, Richtung, Figuren)                   | Bauernzug „ohne Not“ mittel; Leitfragen 3 und 4 nein  |
| 6    | Drei Planfragen (Wo spiele ich? Was will mein Gegner? Welche Figur?), LAP, Tauschfrage, Planbilanz    | Frage 2 über Drohungen hoch; LAP mittel; Rest nein    |
| 7    | Taktik in drei Schritten, W6 und W7, zwölf Grundmotive, Abtausch auf einem Feld, Mattbilder           | hoch                                                  |
| 8    | Sechs goldene Endspielregeln, Elementarmatt, Opposition, Schlüsselfelder, Quadrat, Freibauern        | Regel 1, 2, 4 und 6 mittel bis hoch                   |
| 8    | Triangulation, Reserve-Tempo                                                                         | nein (zu selten, keine sichere Prüfung)               |
| 9    | Abschneiden, Schachdistanz, kurze und lange Seite; Philidor, Lucena, Vancura; Erkennungsbilder       | nein (ohne Endspieldatenbank offline zu unsicher)     |
| 10   | Studien-Werkzeug (Plan des Gegners, Umwandlung, Patt, stiller Zug)                                   | nur Umwandlung und Patt (siehe Kap. 7, 8)             |
| 11   | Werkzeug je Phase                                                                                    | Phase hoch (dient als Filter)                         |
| 12   | Denkroutine (vier Schritte), Sicherheitsblick (drei Fragen), Gesamt-Checkliste, Fehlerdatenbank       | Sicherheitsblick hoch (über W1 und Matt)              |

Die **Gesamt-Checkliste** in Kapitel 12 ordnet jedem Kapitel eine Fehlerart zu (Schach oder
Schlag übersehen, Eröffnungsidee, Falle oder Köder, Bauernstruktur, Taktik übersehen,
Elementarendspiel …). Die Kategorien unten passen in diese Zeilen. So bleiben die Partieauswertung,
die Fehlerdatenbank und das Buch in einer Sprache.

---

## 3. Die Kategorien

**Zwei Richtungen:**

- **W (Warum):** Der gespielte Zug war schlecht, *weil* … Die Prüfung läuft an der Stellung vor
  dem Zug, am gespielten Zug und an seiner Widerlegung (Variante nach dem Zug).
- **F (Finden):** Den besseren Zug *hättest du finden können*, weil … Die Prüfung läuft an der
  Stellung vor dem Zug, am besten Zug und seiner Fortsetzung (Variante vor dem Zug).

**Wann geprüft wird:** W bei Fehler, Patzer und verpasstem Gewinn, für Statistiken auch bei
„ungenau“. F bei ungenau, Fehler, Verpasst und Patzer, also bei jedem Zug mit „Besser war …“
außer „gut“ und „sehr gut“. Dort ist der Unterschied unter einem halben Bauern; eine Buchidee zu
nennen, wäre dort Haarspalterei.

**Zwei Bedingungen gelten für alle F-Kategorien:**

1. Die Idee muss den Vorteil *selbst* erklären. Bei taktischen Kategorien gewinnt die
   Fortsetzung innerhalb weniger Halbzüge sichtbar Material oder setzt matt. Sonst hätte die Engine
   den Zug vielleicht aus ganz anderen Gründen gewählt.
2. Der gespielte Zug erfüllt die Idee nicht ebenso. Sonst wäre der Hinweis keiner.

### 3.1 Warum-Kategorien (gespielter Zug)

| #   | Anzeige                         | Buchbezug                                                      | Prüfbedingung                                                                                                                                                                                                                                                       | Zuverl.                                | Trainer · Kapitel                                  | Beispieltext für die Karte                                                                                                         |
| --- | ------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| W1  | **Falle aus dem Buch**          | Kap. 4, Fallenkabinett, Stopp-Moment                           | Die Stellung vor dem Zug gleicht dem Stopp-Moment einer Falle des Buches (Stellungsvergleich wie bei den Buchvarianten), und der gespielte Zug ist der Fehlzug der Falle                                                                                             | hoch (genau, selten)                   | Falle oder Köder · 4                               | „Das ist die Elefantenfalle aus Kapitel 4. Der Fallencheck dort zeigt, woran du sie erkennst.“                                       |
| W2  | **Matt zugelassen**             | Kap. 1 Röntgen-Frage „Was droht?“; Kap. 12 Sicherheitsblick    | Eine Mattdrohung von vorher bleibt stehen (Fehlerart „Drohung ignoriert“ mit Matt), oder die Widerlegung endet in Matt bzw. die Bewertung danach ist Matt gegen dich                                                                                                 | hoch                                   | Schach-Röntgen · 1; Denkroutine · 12               | „Nach diesem Zug setzt Dxh7 matt. Der Sicherheitsblick fragt vor jedem Zug: Erlaube ich ein Schach oder ein Matt? (Kapitel 12)“     |
| W3  | **Drohung stehen gelassen**     | Kap. 1 Röntgen-Regel; Kap. 6 Frage 2 „Was will mein Gegner?“   | Fehlerart „Drohung ignoriert“ mit Materialdrohung ab einem Bauern                                                                                                                                                                                                   | hoch                                   | Schach-Röntgen · 1                                 | „Die Drohung Lxf7+ stand schon vor deinem Zug, und sie steht danach noch. Die Röntgen-Regel fragt: Was droht mein Gegner?“           |
| W4  | **Material eingestellt**        | Kap. 4 W1 „ungedeckte Figur“; Kap. 12 Sicherheitsblick         | Fehlerart „Figur hängen lassen“ ohne eigenen Schlag, oder „Bauer eingestellt“. Ist es die eben gezogene Figur, heißt der Hinweis „Sicherheitsblick“, sonst „W1“                                                                                                     | hoch                                   | Schach-Röntgen · 1; Zählen · 1                     | „Dein Springer auf d5 hängt danach. Kann der Gegner die gezogene Figur sofort schlagen? Das ist die zweite Frage des Sicherheitsblicks.“ |
| W5  | **Abtausch verrechnet**         | Kap. 1 Angreifer und Verteidiger zählen; Kap. 7 Abtausch       | Der gespielte Zug ist ein Schlag, und die Abtauschbilanz auf diesem Feld ist mindestens einen Bauern negativ                                                                                                                                                       | hoch (genaue Rechnung)                 | Zählen · 1                                         | „Auf e5 greifen drei Figuren an, aber vier verteidigen. Zählen hätte gezeigt: Der Schlag kostet Material.“                          |
| W6  | **Köder geschluckt**            | Kap. 4 W5 „Geschenk“, Schlagreflex; Kap. 1 Materialgier        | Fehlerart „Schlagreflex“ oder „Bauernraub“                                                                                                                                                                                                                          | hoch                                   | Falle oder Köder · 4                               | „Der Bauer sah frei aus, war aber ein Köder: Nach Sb5 kommt die Strafe erzwungen. Warum lässt mein Gegner das zu? (Kapitel 4)“       |
| W7  | **Taktik des Gegners übersehen**| Kap. 7, Warnsignale W2 und W6                                  | Fehlerart „Taktik übersehen“ mit ihrem Motiv (Gabel, Fesselung, Spieß, Abzug, Doppelschach)                                                                                                                                                                         | hoch                                   | Taktik mit Motiv · 7                               | „Nach deinem Zug gabelt Sc7 König und Turm. Das Warnsignal W6 (Gabelgeometrie) leuchtete schon.“                                    |
| W8  | **Todsünde der Eröffnung**      | Kap. 1, vier Todsünden; Kap. 2 Zielbilanz                      | Nur in der Eröffnungsphase und nur, wenn kein taktischer Grund (W1 bis W7) passt: Fehlerart „Dame zu früh“, „König in der Mitte“, „Tempo verschenkt“, dazu die Todsünde „Passivität“ (Randbauernzug ohne Drohung, drei Leichtfiguren zu Hause) aus der Todsünden-Prüfung | mittel                                 | Zielbilanz · 2                                     | „Die Dame kommt früh, Springer und Läufer stehen noch zu Hause. Kapitel 1 nennt das eine der vier Todsünden.“                       |
| W9  | **Bauernzug mit Folgen**        | Kap. 5, Grundgesetz der Bauern; Leitfrage 1 (Löcher, Luftloch) | Fehlerart „Bauernzug ohne Not“ oder „Königsschild geschwächt“, Eröffnung oder Mittelspiel, kein taktischer Grund. Wenn das Skelett-Röntgen „Vorher“ ein dauerhaft aufgegebenes Feld findet, nennt die Karte es                                                         | mittel                                 | Strukturerkenner · 5                               | „g4 schwächt die Felder vor deinem König (f4, h4). Bauern gehen nicht zurück: Vorn gewinnt der Zug, hinten verliert er für immer.“   |
| W10 | **Endspielregel**               | Kap. 8, Regeln 1 und 4, Pattfalle                              | Endspiel: „König passiv“, „Bauer vorschnell“, „im Rückstand getauscht“, „patt gesetzt“                                                                                                                                                                              | mittel (Patt: hoch)                    | Endspieltrainer · 8                                | „Im Endspiel ist der König eine Figur: Kf3 war der Weg ins Zentrum. (Kapitel 8, Regel 1)“                                          |

### 3.2 Finde-Kategorien (besserer Zug)

| #   | Anzeige                                  | Buchbezug                                                        | Prüfbedingung (am besten Zug und seiner Fortsetzung)                                                                                                                                                                                                                         | Zuverl.                                         | Trainer · Kapitel                                   | Beispieltext                                                                                                                          |
| --- | ---------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | **Matt war möglich**                     | Kap. 7 Mattbilder; Kap. 1 „Schach vor Schlag“                    | Die Mattsuche beweist Matt in höchstens drei Zügen mit dem besten Zug, oder die gespeicherte Fortsetzung endet in Matt. Das Mattbild wird genannt, wenn eines passt                                                                                                          | hoch                                            | Taktik, Thema Mattbilder · 7                        | „Hier ging Matt in zwei: 23. Dxh7+ Kxh7 24. Th3#. Ein Mattbild aus Kapitel 7: Grundreihenmatt.“                                         |
| F2  | **Rettung durch Dauerschach oder Patt**  | Kap. 7, Motiv 12                                                 | Vor dem Zug stehst du auf Verlust (Wert −3 oder schlechter), der beste Zug hält etwa den Ausgleich, und seine Fortsetzung wiederholt mit Schach oder endet patt                                                                                                               | mittel bis hoch                                 | Taktik, Thema Rettung · 7                           | „Du standst auf Verlust, aber Dg3+ hätte Dauerschach gegeben. Kapitel 7: Wer auf Verlust steht, sucht die Rettung.“                   |
| F3  | **Motiv im besseren Zug**                | Kap. 7, zwölf Grundmotive; W1, W2, W6                            | Die Fortsetzung gewinnt in fünf Halbzügen mindestens zwei Bauerneinheiten (dieselbe Schwelle wie beim Kommentar in „Zug erraten“) und die Motiverkennung findet ein Ein-Zug-Motiv: Gabel/Doppelangriff, Fesselung, Spieß, Abzug, Doppelschach, Umwandlung. Folge-Motive nur als „eine Kombination“ | hoch (Ein-Zug-Motive), mittel (Kombination)     | Taktik mit Motiv · 7                                | „Besser war 18. Sd5: eine Gabel gegen Dame und Turm. Das Warnsignal W6 hätte dich hingeführt.“                                          |
| F4  | **Guter Schlag ausgelassen**             | Kap. 1, Angreifer und Verteidiger zählen                         | Der beste Zug ist ein Schlag mit Abtauschbilanz ab einem Bauern, der gespielte Zug schlägt nicht dort. Sonderfall: Hat der Gegner gerade dort geschlagen, heißt es „nicht zurückgeschlagen“                                                                                   | hoch                                            | Zählen · 1                                          | „Der Läufer auf g4 war nur einmal gedeckt, aber zweimal angegriffen: Zählen hätte gezeigt, dass Lxg4 eine Figur gewinnt.“            |
| F5  | **Schach, Schlag oder Drohung zuerst**   | Kap. 1 Schach-Röntgen-Regel; Kap. 7 Schritt 2                    | Der beste Zug steht in der Liste der erzwingenden Züge (Schach, Schlag, drohender Zug), die Fortsetzung gewinnt in vier Halbzügen mindestens einen Bauern, und der gespielte Zug ist kein erzwingender Zug. Nur wenn F1 bis F4 nicht passen                               | hoch                                            | Schach-Röntgen · 1                                  | „Ein Schach hätte mehr gebracht: Lb5+ gewinnt danach den Turm. Die Röntgen-Regel fragt zuerst nach Schachs.“                         |
| F6  | **Opposition und Schlüsselfelder**       | Kap. 8, Regel 2; Schlüsselfelder                                 | Reines Bauernendspiel. König und Bauer gegen König: Die Datenbank zeigt, dass der beste Zug das Ergebnis hält und der gespielte nicht, *und* der beste Zug nimmt die Opposition oder betritt ein Schlüsselfeld. Mit mehr Bauern dieselbe Regel ohne Datenbank                | hoch (K+B gegen K), mittel (mehr Bauern)       | Endspiel, Thema Opposition / Schlüsselfelder · 8    | „Ke6 hätte die Opposition genommen, dann erreicht dein König ein Schlüsselfeld. So war es remis.“                                    |
| F7  | **Freibauer und Quadrat**                | Kap. 8, Freibauern, Regel des Quadrats, Regel 6                  | Endspiel. Entweder zieht der beste Zug einen Freibauern, den der gegnerische König laut Quadratregel nicht einholt, oder die Fortsetzung wandelt um. Oder der beste Zug bringt den eigenen König ins Quadrat eines gegnerischen Freibauern, und der gespielte Zug tut das nicht | hoch (Bauernendspiel), mittel (mit Figuren)    | Endspiel, Thema Quadrat / Freibauer · 8             | „Der a-Bauer läuft: Dein König ist außerhalb des Quadrats. Kd4 hätte ihn noch eingeholt.“                                             |
| F8  | **Buchzug deiner Eröffnung**             | Kap. 2 und 3, Steckbriefe                                        | Die Stellung vor dem Zug steht in einer Buchvariante, der gespielte Zug ist kein Buchzug und mindestens „ungenau“. Genannt werden der Buchzug und die Eröffnung. Ob der Buchzug auch der beste Zug der Engine ist, sagt die Karte nicht                                       | hoch (genauer Nachschlag)                       | Repertoire · 2; Abweichung · 2, 3                   | „Hier spielt das Buch 5... d6 (Italienisch, Kapitel 2). Dein Zug weicht ab und kostet etwas.“                                         |
| F9  | **Eröffnungsziel: Rochade, Entwicklung, Zentrum** | Kap. 1 drei Ziele; Kap. 2 Zielbilanz                     | Eröffnungsphase, ruhige Stellung (kein Schach, keine Drohung, kein Schlag mit Gewinn). Der beste Zug ist die Rochade, oder er zieht eine Leichtfigur vom Startfeld, oder er bringt einen Bauern nach d4, e4, d5 oder e5 bzw. schlägt dort. Der gespielte Zug erfüllt kein solches Ziel | mittel (Rochade: hoch)                          | Zielbilanz · 2                                      | „Die drei Eröffnungsziele: Sf3 hätte eine Figur entwickelt. Dein Zug brachte keine neue Figur ins Spiel.“                             |
| F10 | **Am wenigsten aktive Figur (LAP)**      | Kap. 6, Frage 3 „Welche Figur bringe ich dorthin?“               | Mittelspiel, ruhige Stellung, kein Grund aus W1 bis W7. Der beste Zug zieht die Figur mit den wenigsten freien Feldern (Zählung des LAP-Werkzeugs), der gespielte Zug eine andere. Verlust mindestens einen halben Bauern                                                    | mittel                                          | Planbilanz · 6                                      | „Dein Läufer auf c1 hatte kein freies Feld. Kapitel 6 fragt: Welche Figur bringe ich dorthin? Lb2 war der Anfang.“                    |

Damit sind es **20 Kategorien**. Der Endspieltrainer und der Taktiktrainer lassen sich schon heute
gleich mit einem Thema öffnen („taktik:fesselung“, „endspiel:opposition“). Die Empfehlung kann
also genau das passende Thema öffnen.

**Zur Fehlerdatenbank:** Für W1 bis W10 und F1 bis F10 steht das Kapitel fest. Der Vorschlag
„Fehlerart“ beim Eintragen aus einer Partie sollte dieselbe Zuordnung benutzen. Dann sagen Karte
und Datenbank dasselbe.

---

## 4. Priorität, Anzeige, Speicherung

### 4.1 Was die Karte zeigt, wenn mehreres zutrifft

Die Karte zeigt **höchstens eine Warum-Zeile und höchstens eine Findezeile**. Gewählt wird der
erste Treffer in dieser Reihenfolge:

- **Warum:** W1 Falle → W2 Matt zugelassen → W3 Drohung (ab Leichtfigur) → W10 Patt → W6 Köder
  → W5 verrechnet → W4 eingestellt → W3 Drohung (kleiner) → W7 Taktik → W8 Todsünde → W9 Bauernzug
  → W10 übrige Endspielregeln. Das ist im Kern die Reihenfolge, nach der die App die Fehlerarten
  schon heute prüft (die genaueste und schwerste Ursache zuerst).
- **Finden:** F1 Matt → F2 Rettung → F3 Motiv → F4 Schlag → F5 Röntgen → F6 Opposition → F7
  Freibauer → F8 Buchzug → F9 Eröffnungsziel → F10 LAP. Konkretes vor Faustregel.
- **Doppeltes weglassen:** Sagen beide Zeilen dasselbe, bleibt nur eine. Beispiel: W3 „Drohung
  stehen gelassen“ und als besserer Zug genau die Abwehr dieser Drohung. Oder W4 „Figur
  eingestellt“ und F4 „Schlag ausgelassen“ auf demselben Feld.
- **„Verpasst“** (der Gegner hatte gerade einen Fehler gemacht): Hier zählt fast immer die
  Findezeile. Die Warum-Zeile entfällt.
- **„Ungenau“** bekommt in der Zeitleiste keine eigene Karte, sonst wird sie zu lang. Die
  Findezeile erscheint im Rückblick Zug für Zug, dort steht „Besser war …“ ohnehin. Sie zählt auch
  für die Statistik.

**Aufbau der Karte (Vorschlag):**

> **14... Sf6?**
> Fehler: Gewinnchance 55 % → 21 %.
> ⚠ Die Drohung Lxf7+ stand vor deinem Zug, und sie steht danach noch (Kapitel 1, Röntgen-Regel).
> 💡 Besser war 14... Le6: Er deckt f7.
> [Üben: Schach-Röntgen]

Die Zeichen ⚠ und 💡 stehen hier nur für zwei verschiedene Markierungen. In der App wären es die
eigenen Symbole, wie in der Auswertung üblich. Am kleinen Brett kommen die Markierungen dazu, die
der Rückblick heute schon zeichnet (roter Pfeil für die Drohung, rotes Feld für die hängende
Figur).

### 4.2 Speichern oder bei der Anzeige rechnen?

- **Für die Zeitleiste einer Partie:** Bei der Anzeige rechnen ist tragbar (rund eine halbe
  Sekunde am Handy). Die Rechnung sollte aber nach dem ersten Bild laufen und die Zeilen
  nachreichen, damit die Auswertung nicht stockt. Das Ergebnis bleibt je Partie im Speicher der
  laufenden Sitzung.
- **Für die Startseite (zehn Partien):** Bei jedem Start zu rechnen, kostet am Handy mehrere
  Sekunden. Empfehlung: Wenn die Engine-Auswertung einer Partie fertig ist, werden die Kategorien
  einmal berechnet und als kleiner Zusatz zur Partie gespeichert, je Halbzug höchstens zwei
  Kürzel, dazu eine Versionsnummer der Regeln. Ändert sich eine Regel, steigt die Version, und die
  App rechnet die gespeicherten Partien im Leerlauf neu, eine Partie nach der anderen. Der Platz
  ist klein: bei 50 Partien wenige Kilobyte.
- **Rückbau** ist einfach: Der Zusatz lässt sich weglassen, weil sich alles aus den
  gespeicherten Werten neu rechnen lässt. Ältere App-Versionen ignorieren ihn. Weil es aber den
  Speicher der Leser berührt, sollte der Autor das kurz bestätigen (CLAUDE.md, Regel 9). Bis dahin
  geht dasselbe ohne Speicher: Die Startseite rechnet im Leerlauf und behält das Ergebnis bis zum
  Neustart der App.

### 4.3 Empfehlungen über mehrere Partien (Startseite)

Die Startseite hat schon Vorschläge für die schwächste Phase und für die Fehlerdatenbank. Neu
kommt eine Art „Muster aus deinen Partien“ dazu. Sie steht vor dem Phasen-Vorschlag, weil sie
genauer ist. Zeigen beide auf denselben Trainer, entfällt der Phasen-Vorschlag.

| Festlegung   | Vorschlag                                                                                                                                                                                                     | Warum                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Grundlage    | die letzten 10 ausgewerteten Partien, nur die Züge des Lesers (gegen die Engine nur seine Farbe)                                                                                                              | gleich wie beim Phasen-Vorschlag; alte Partien zeigen alte Schwächen                                     |
| Mindestens   | 5 ausgewertete Partien                                                                                                                                                                                        | wie beim Phasen-Vorschlag                                                                                 |
| Gezählt wird | je Kategorie die Zahl der *Partien*, in denen sie mindestens einmal bei Fehler, Patzer oder Verpasst vorkam (nicht die Zahl der Züge)                                                                            | Eine einzige wilde Partie mit fünf eingestellten Figuren soll nicht allein entscheiden                     |
| Schwelle     | mindestens 3 Partien und mindestens 30 % der betrachteten Partien; für die mittel-zuverlässigen Kategorien (W8, W9, W10, F9, F10) 4 Partien und 40 %                                                            | Wer zweimal eine Gabel übersieht, hat Pech gehabt; dreimal in zehn Partien ist ein Muster                 |
| Auswahl      | die Kategorie mit dem höchsten Anteil; bei Gleichstand die mit hoher Zuverlässigkeit, dann die mit dem kleineren Kapitel                                                                                       | Grundlagen zuerst, wie das Buch                                                                           |
| Ruhe         | Hat der Leser den empfohlenen Trainer seit der letzten gezählten Partie geübt, ruht die Empfehlung, bis eine neue Partie dazukommt                                                                             | sonst ein Dauerhinweis, der nervt                                                                         |
| Ungenau      | Kategorien aus „ungenau“-Zügen zählen nicht für die Startseite, nur für eine spätere Übersicht in der Auswertung                                                                                              | Bei kleinen Verlusten ist die Buchidee oft nur eine von mehreren guten Ideen                              |

**Beispieltexte** (vorsichtig, im Ton des Phasen-Vorschlags):

- „In 4 deiner letzten 10 Partien blieb eine Drohung des Gegners stehen. Die Schach-Röntgen-Regel
  aus Kapitel 1 fragt jedes Mal: Was droht mein Gegner? Dazu passt der Schach-Röntgen-Trainer.“
- „In 3 deiner letzten 8 Partien hätte eine Gabel Material gewonnen. Üben lohnt vermutlich:
  Taktiktrainer, Thema Doppelangriff und Gabel (Kapitel 7).“
- „Zuletzt hast du dreimal einen Abtausch verrechnet. Das Zählen von Angreifern und Verteidigern
  aus Kapitel 1 hilft dabei; dazu passt der Zähltrainer.“

**Idee für später:** Das Antwortprotokoll der Trainer kennt schon die Trefferquote je Thema. Ist
ein Leser im Taktiktrainer bei Gabeln sicher (über 80 %), übersieht sie aber in Partien, liegt es
eher an der Routine als am Motiv. Dann passt Kapitel 12 besser (Denkroutine, Sicherheitsblick)
als noch mehr Gabelaufgaben.

---

## 5. Grenzen und Risiken

1. **Engine-Wert gegen Buchregel.** Die Engine wählt ihren besten Zug, weil er am meisten bringt,
   nicht wegen einer Buchregel. Ein bester Zug, der zufällig ein Schach ist, macht das Schach noch
   nicht zum Grund. Deshalb verlangen die Finde-Kategorien, dass die Idee den Vorteil sichtbar
   selbst erklärt (Gewinn in wenigen Halbzügen, bewiesenes Matt, Datenbank, Buchzug). Die
   Faustregel-Kategorien (F9, F10, W8, W9) laufen nur in ruhigen Stellungen. Die Texte sagen „hätte
   dich hingeführt“ oder „Dazu passt“, nie „Die Engine spielt das wegen …“.
2. **Mehrere gute Züge.** Ist der Abstand zum zweitbesten Zug klein (unter 0,3), gibt es mehrere
   gleich gute Wege. F9 und F10 sollten dann schweigen. Die taktischen Kategorien dürfen bleiben,
   weil sie ihren Gewinn selbst zeigen.
3. **Rechentiefe.** Die Werte stammen aus Tiefe 18, die Fortsetzung hat höchstens sechs
   Halbzüge. Tiefere Kombinationen erkennt die App nicht als Motiv. Sie fallen dann unter „keine
   Kategorie“, und das ist ehrlicher als ein geratener Name. Die Nachprüfung mit Tiefe 20 ergab
   bei 8 % der Züge ohne Zeichen doch einen Fehler. Einzelne Karten können also fehlen oder in
   Grenzfällen (Verlust knapp über 0,5) unsicher sein.
4. **Folge-Motive.** Hinlenkung, Räumung, Überlastung, Ablenkung, Beseitigung, Zwischenzug und
   Desperado erkennt die App nur grob. Sie erscheinen nicht mit Namen, sondern als „eine
   Kombination“. In der Statistik zählen sie nicht als eigenes Thema.
5. **Mittel-zuverlässige Arten** (König passiv, Bauer vorschnell, Königsschild: 74–79 %). Auf der
   Karte sind sie vertretbar, weil der Leser das Brett vor sich hat. Für die Startseite gelten
   strengere Schwellen (Abschnitt 4.3).
6. **Nebenbefund Widerlegung.** Der Rückblick gibt der Fehlererkennung nur den ersten Zug der
   Widerlegung. Die Prüfung, ob der Gegner Material gewinnt, rechnet dann ohne Zurückschlagen. Ein
   gewöhnlicher Abtausch kann so als „Bauer eingestellt“ oder „Figur hängt“ erscheinen. Die
   gespeicherte Fortsetzung mit sechs Halbzügen sollte vor dem Einbau in die Zeitleiste übergeben
   werden (Anhang B).
7. **Zeitaufwand der Umsetzung (geschätzt).** Warum-Zeile in der Zeitleiste mit vorhandener
   Erkennung: klein (ein bis zwei Teilschritte). Finde-Erkenner F1 bis F10 mit Tests an
   Buchabbildungen: mittel (drei bis fünf Teilschritte). Speicherung und Startseiten-Empfehlung:
   klein bis mittel. Eichung an Lichess-Partien wie bei den Fehlerarten: ein Messlauf lokal.
8. **Prüfung vor dem Einbau.** Zwei Messungen werden empfohlen: (a) Häufigkeit je Kategorie an
   den lokal gespeicherten Lichess-Stellungen (Fortsetzungen mit acht Halbzügen liegen vor).
   (b) Etwa 100 zufällige Karten, die der Autor auf dem Handy auf Plausibilität ansieht. Als
   Referenztests dienen die Beispielpartien aus Kapitel 11 und die Abbildungen der Kapitel 1, 4, 7
   und 8.

---

## 6. Ausdrücklich ausgeschlossen

| Idee                                                                         | Warum nicht                                                                                                     |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Goldene Angriffsregel (Kap. 1)                                               | beschreibt Chancen, keine Fehlerursache; ob ein Angriff zu früh war, sagt keine sichere Regel                   |
| „Nicht vorschnell schlagen, Spannung halten“ (Kap. 1)                        | ob Spannung besser war, ist eine Einschätzung; die Engine-Werte trennen das nicht von anderen Gründen           |
| Planfrage 1 „Wo spiele ich?“, Planbilanz, Tauschfrage (Kap. 6)               | zu allgemein; wer auf dem falschen Flügel spielt, verliert selten sofort einen halben Bauern                    |
| Faktorenbilanz, Gambit-Kompensation (Kap. 3)                                 | das Buch selbst sagt: Ob die Kompensation reicht, beurteilt die Engine                                          |
| Skelett-Leitfragen 3 und 4 (Raum, Ketten, Flügelwahl, guter und schlechter Läufer, offene und geschlossene Stellung) | Befunde ja, aber keine Ursache eines einzelnen Zuges                                     |
| Turmendspiel-Begriffe, Philidor, Lucena, Vancura (Kap. 9)                    | die Erkennung kennt nur „nahe am Bild“; offline fehlt eine Endspieldatenbank für die Gegenprobe                 |
| Triangulation, Reserve-Tempo (Kap. 8), Studienmotive (Kap. 10)               | zu selten in Partien, keine sichere Prüfung                                                                     |
| Warnsignale W3, W4, W7 als Ursache                                           | ein leuchtendes Signal heißt nicht, dass es den Fehler verursacht hat; sie dürfen nur innerhalb von F3 als Hinweis vorkommen |
| Zeitnot (Kap. 12)                                                            | die App speichert keine Zeit je Zug                                                                             |
| Blinde Flecken der Bots                                                      | nur zu 71 % stabil; für Leserzüge nicht gemacht                                                                 |
| „Ungenau“ ohne Regel                                                         | bleibt ohne Kategorie; besser keine Erklärung als eine falsche                                                  |

---

## 7. Empfohlene Reihenfolge der Umsetzung

1. Die Widerlegung mit sechs Halbzügen an die Fehlererkennung übergeben (Nebenbefund). Das ist
   klein und hilft sofort auch dem Rückblick.
2. Warum-Zeile W2 bis W10 in der Zeitleiste aus der vorhandenen Erkennung, mit Kapitel und
   Knopf „Üben“.
3. Finde-Erkenner F1, F3, F4, F5 (taktisch, hohe Zuverlässigkeit), dann F6, F7, F8, danach F2,
   F9, F10. W1 (Fallen) zum Schluss, weil dafür der Stellungsvergleich mit den Fallen nötig ist.
4. Messlauf an den Lichess-Stellungen, Schwellen nachstellen.
5. Speicherung der Kürzel (nach Bestätigung durch den Autor) und die Empfehlung „Muster aus deinen
   Partien“ auf der Startseite. Danach dieselbe Zuordnung im Vorschlag der Fehlerdatenbank.

---

## Anhang A: Code-Verweise

- Fehlerarten des gespielten Zuges: `app/src/engine/fehlerart.ts` (`lageVon`, `fehlerbefundIn`,
  Reihenfolge der Prüfungen), Teile in `fehlerart-taktik.ts` (`uebersehneTaktik`,
  `widerlegungsgewinn`), `fehlerart-schlag.ts`, `fehlerart-phasen.ts`, `fehlerart-koenig.ts`,
  `fehlerart-eroeffnung.ts`, `fehlerart-neu.ts` (`eingestellt`, `schlagVerpasst`, `zugOhneNot`),
  Typen in `fehlerart-typen.ts`.
- Sätze und Markierungen dazu: `app/src/spiel/erklaerung.ts` (`erklaereZug`,
  `ausgelassenerSchlag`); Kapitel je Fehlerart: `app/src/spiel/fehlervorschlag.ts`
  (`KAPITEL_JE_ART`).
- Zeitleiste: `app/src/ui/komponenten/auswertung/momente.ts` (Momentquelle „fehler“),
  `momentdarstellung.ts` (`MOMENTDARSTELLUNG.fehler`; das Feld `zusatz` ist bei Fehlern noch frei),
  `Zeitleiste.tsx`.
- Gespeicherte Auswertung: `app/src/speicher/partieeintrag.ts` (`werte`, `beste`, `abstaende`,
  `varianten` mit bis sechs Halbzügen), höchstens 50 Partien (`speicher/partien.ts`,
  `MAX_PARTIEN`).
- Finde-Bausteine: `schach/drohungen.ts` (`erzwingendeZuege`, `schlaege`, `drohendeZuege`),
  `schach/abtausch.ts`, `schach/taktikmotive.ts` (`erkenneMotive`), `schach/mattbilder.ts`,
  `schach/mattsuche.ts` (`erzwingtMatt`), `schach/dauerschach.ts` (`wiederholtMitSchach`),
  `schach/quadrat.ts`, `schach/opposition.ts` (`oppositionszuege`), `schach/schluesselfelder.ts`,
  `schach/kpk.ts` (`kpkErgebnis`), `analyse/k8-regeln.ts` (`koenigsabstandZumZiel`),
  `schach/zielbilanz.ts`, `schach/todsuenden.ts`, `schach/aktivitaet.ts` und `analyse/k6-lap.ts`,
  `schach/eroeffnungsindex.ts` (`buchzuegeAb`), `spiel/taktik.ts` (`zugartVon`), `spiel/phasen.ts`.
- Vorbild für die Taktik-Schwelle (Gewinn ab zwei Bauern in fünf Halbzügen):
  `app/src/training/zugkommentar.ts` (`istTaktisch`). Motiv zu Trainer-Thema:
  `training/taktikmotivwahl.ts` (`GRUNDMOTIV_JE_MOTIV`).
- Startseite: `app/src/training/vorschlagsarten.ts` (neue Zeile etwa mit Rang 52, vor „phase“ 55),
  Vorbild für Schwellen und Zwischenspeicher: `training/phasenschwaeche.ts`; Trainer mit Thema
  öffnen: `ui/trainer/trainerthema.ts`, `training/themennamen.ts`; Trainerliste:
  `training/trainer.ts`.
- Gegenprüfung der Fehlerarten (Zahlen in Abschnitt 1.1): `docs/FORTSCHRITT.md`, Teil A
  „Doppelprüfung mit der Engine“ (22.10.2026), Messdatei `engine/fehlerpruefung.messung.ts`.

## Anhang B: Nebenbefund im Detail

`ui/komponenten/rueckblick/useRueckblick.tsx` (`erklaerungFuer`) und
`ui/komponenten/partie/SpielEngine.tsx` rufen `erklaereZug(..., antwort: string, ...)` mit nur
einem Zug auf (`rb.beste[index + 1]` bzw. `danach.besterZug`). `erklaereZug` reicht ihn als
`[antwort]` an `fehlerbefundIn` weiter. `widerlegungsgewinn` (fehlerart-taktik.ts) wertet bei
einer Antwort mit nur einem Halbzug den Stand direkt nach dem Schlag des Gegners, ohne den
Rückschlag. Das betrifft `eingestellt` („Bauer eingestellt“, „Figur hängen“), `uebersehneTaktik`
und `istSchlagreflex`. Vorschlag: `erklaereZug` nimmt die Widerlegung als Liste, und die Aufrufer
übergeben `varianten[index + 1]`, sofern vorhanden (der Rückblick hat `rb.varianten` schon).

## Anhang C: Messung der Rechenzeit

Gebündelt mit esbuild, ausgeführt mit Node 22 auf einem Kern. Partie: Morphy gegen Herzog von
Braunschweig und Graf Isouard (Opernpartie), 33 Halbzüge, je Prüfung fünf Durchläufe. Als
Widerlegung dienten die nächsten fünf Partiezüge. Das Skript liegt nur im Arbeitsordner der
Sitzung, nicht im Repository.
