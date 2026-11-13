# 11 Weitere Karten und Gegenstände (Ideen, 8.11.2026)

Wunsch des Autors (8.11.2026): weitere Karten und sinnvolle Gegenstände, die das Schachspiel
beeinflussen, freischaltbar oder kaufbar. Dieses Dokument sammelt die Ideen, prüft sie gegen die
Grundsätze und nennt eine Reihenfolge. Bestand: acht Hilfskarten (Fingerzeig, Gefahrenradar, Zweite
Chance, Flüstern, Mentor-Zug, Bauern- und Springervorgabe, Sanduhr), drei Sprüche (Kühler Kopf,
Grübelfalle, Großes Maul), Gegenstände Fahrrad und Laterne.

## 1. Grundsätze (gelten für alles hier)

- **G1 Nie die Zugregeln ändern.** Karten ändern Informationen, Züge, Zeit oder die Startstellung
  (Regelwerk R24). Was auf dem Brett erlaubt ist, bleibt Schach.
- **G2 Jede Karte lehrt ein Werkzeug des Buches.** Die Hilfe zeigt, was ein guter Spieler sich
  selbst fragt; wer sie oft spielt, lernt die Frage. Der Buchbezug steht nur in den Daten, nicht auf der Karte (Entscheidungen vom 10.11. und 13.11.2026: Das Spiel steht für sich).
- **G3 Gold gibt es nur ohne Karten.** Neue Karten bekommen eine Stufe (leicht, mittel, stark) und
  zählen für die Clubnadel wie die alten; Sprüche nur gegen Straßengegner (10, S2).
- **G4 Kaufen ersetzt kein Lernen.** Starke Karten (Vorgaben, Mentor-Zug) bleiben unverkäuflich;
  Läden verkaufen leichte und mittlere Karten, Gegenstände nur einmal.
- **G5 Technik wiederverwenden.** Jede Karte nutzt ein vorhandenes Werkzeug der App (Analyse,
  Engine, Zustand der Gegner), damit sie wenig Code und keine neue Engine braucht.

## 2. Neue Hilfskarten

| Nr. | Karte               | Stufe  | Wirkung                                                                                                                                                           | Buch, Werkzeug der App                                      | Woher                     |
| --- | ------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------- |
| K1  | **Was droht?**      | leicht | Zeigt als roten Pfeil, was der Gegner spielen würde, wenn er jetzt am Zug wäre (Nullzug der Engine).                                                              | Kapitel 4 und 12, Frage „Was will der Gegner?“              | Laden, dauerhaft          |
| K2  | **Abzählen**        | leicht | Ein Feld antippen: Zahl der Angreifer und Verteidiger, grün oder rot.                                                                                             | Kapitel 1, Zählen von Angreifern und Verteidigern           | Aufgabenrunde Kapitel 1   |
| K3  | **Waage**           | leicht | Sagt grob, wer besser steht (deutlich Weiß, ausgeglichen, deutlich Schwarz), ohne Zahl und ohne Zug.                                                              | Kapitel 12, Stellungsbeurteilung                            | Laden                     |
| K4  | **Schutzengel**     | mittel | Für die nächsten fünf eigenen Züge: Verliert ein Zug Material (zwei Bauern oder mehr), hält Ambrose ihn einmal mit einer Zeile auf (Entscheidung vom 13.11.2026). | Kapitel 4, Vorsichtsprüfung vor jedem Zug (W1–W7)           | Nebenquest, Verbrauch     |
| K5  | **Remisangebot**    | mittel | Der Gegner nimmt Remis an, wenn die Stellung etwa ausgeglichen ist (Engine ±0,5); sonst lehnt er ab, die Karte ist trotzdem weg.                                  | Kapitel 12, Remis als Ergebnis, Stellung ehrlich beurteilen | Laden Riverton, Verbrauch |
| K6  | **Plan des Buches** | mittel | Nennt ein Merkmal der Stellung aus den Werkzeugen der Kapitel 5 bis 7 (schwacher Bauer, offene Linie, schlechter Läufer) als Satz.                                | Kapitel 5–7, Werkzeuge der App                              | Clubchef-Sieg (Akt 3)     |
| K7  | **Spickzettel**     | leicht | Vor der Partie: Der Gegner spielt die Eröffnung aus seinem Steckbrief sicher, und der Leser sieht ihren Namen.                                                    | Kapitel 11, Eröffnungen; Eröffnungsnamen der App            | Vorbereitungsquest (C7)   |
| K8  | **Auszeit**         | leicht | Hält die eigene Uhr für einen Zug an (nur mit Uhr).                                                                                                               | Kapitel 12, Zeiteinteilung                                  | Laden, Verbrauch          |

## 3. Neue Sprüche (nur gegen Straßengegner)

| Nr. | Spruch           | Stufe  | Wirkung                                                                                                                            | Grundlage in der App                       |
| --- | ---------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| S7  | **Schmeichelei** | leicht | Vor der Partie: „Du bist bestimmt der Beste im Park.“ Der Gegner wird überheblich (Zustand wie R8).                                | Zustand der Gegner (Regelwerk R8, R9)      |
| S8  | **Pokerface**    | mittel | Der Held tut, als hätte er etwas übersehen; der Gegner greift drei Züge lang lieber an als zu verteidigen (Stil „angriffslustig“). | Stilmischung der Bots (engine/stil)        |
| S9  | **Ablenkung**    | leicht | „Schau mal, ein Waschbär!“ Der nächste Zug des Gegners kommt aus einer schwächeren Stufe.                                          | Stufen je Zug (botzug.ts), wie Großes Maul |

## 4. Gegenstände (dauerhaft, einmal)

| Nr. | Gegenstand              | Wirkung                                                                                                                             | Woher                              |
| --- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| I1  | **Lupe des Uhrmachers** | Vor jeder Partie zwei Zeilen aus dem Steckbrief des Gegners sehen (Schwächen, Immunität gegen Sprüche).                             | Mr. Harlan nach drei Siegen        |
| I2  | **Kartentasche**        | Vier statt drei Karten im Deck (nur Akt 3 und Post-Game, nicht im Finale).                                                          | Laden Ironwood, teuer (300 Münzen) |
| I3  | **Reisebrett**          | Überall in der Welt eine freie Partie gegen Ambrose oder Juno (Übungspartie, zählt nicht für Nadeln).                               | Juno, nach Akt 2                   |
| I4  | **Partienotizbuch**     | Nach jeder Partie hält Ambrose die drei wichtigsten Momente im Tagebuch fest (Kipppunkt, bester Zug, Fehler).                       | Bibliothek Cedar Creek             |
| I5  | **Limo**                | Verbrauch: Geschenk für Straßengegner (Jo: „Wer verliert, holt Limo.“); bringt eine Steckbriefzeile oder eine Revanche mit Vorteil. | Kiosk, 5 Münzen                    |
| I6  | **Monatskarte**         | Schnellreise zwischen besuchten Städten (Fahrkarten-Regel aus 08).                                                                  | Bahnhof Riverton                   |

## 5. Brücke zum Buch (Lernkarten)

Wer in der App ein Kapitel des Buches abschließt (alle Übungen bestanden), bekommt im Abenteuer die
Karte dieses Kapitels geschenkt: Kapitel 1 → Abzählen, Kapitel 4 → Gefahrenradar, Kapitel 12 →
Was droht? Ambrose nennt das Buch dabei nicht (der frühere Satz „… sondern im Buch“ entfällt). **Offen:** Nach der Entscheidung des Autors vom 13.11.2026 (das Spiel steht für sich, nichts schickt den Spieler zum Buch) ist zu klären, ob es die Lernkarten als Brücke zum Buch überhaupt noch gibt.

## 6. Empfehlung und Reihenfolge

Stand 08.11.2026 (achter Auftrag an mittel-2): Gebaut sind 27 Karten (darunter 11 Lernkarten),
die Gegenstände Fahrrad, Laterne und Kartentasche und die Läden in Maple Falls, Riverton und
Ironwood. Die Verteilung aller Karten und Gegenstände auf Szenen und Läden steht in Abschnitt 7;
die Szenen für die neuen Gegenstände stehen in `05_Story_Bibel.md` (Szenen 10a, 30a, 31a, 39a,
51a). Reihenfolge für das, was noch nicht gebaut ist:

1. **I5 Limo** mit der Limo-Quest in Maple Falls (Szene 10a): kleinster Schritt, zeigt Steckbrief
   und Verbrauchsgegenstand; braucht eine Wirkung, die einen Gegenstand verbraucht.
2. **I4 Partienotizbuch** und **I1 Lupe**: zusammen mit der Steckbriefansicht (C7), weil beide
   Steckbrief und Schlüsselmomente sichtbar machen.
3. **K7 Spickzettel**: Belohnung der Vorbereitungsquest in Riverton (Szene 34), nutzt die
   Eröffnung aus dem Steckbrief.
4. **I6 Monatskarte** und **I3 Reisebrett**: mit der Schnellreise (W2) und Akt 3.
5. **S8 Pokerface** und **K4 Schutzengel**: mit Akt 3; der Schutzengel braucht die Bewertung jedes eigenen Zuges, während der Bot rechnet, damit Ambrose den Zug aufhalten kann (ENTSCHEIDUNGEN, Eintrag vom 13.11.2026), deshalb zuletzt.

Nicht empfohlen: Karten, die Figuren verschieben, Züge des Gegners verbieten oder den König
schützen (bricht G1), und kaufbare Vorgaben (bricht G4).

## 7. Verteilung und Preise

### 7.1 Münzen, die man realistisch hat

Grundlage: `regeln/muenzen.ts` (Straßensieg 10, bestandene Runde 10, erste Clubnadel 50),
Quest-Wirkung `muenzen`, Funde aus `funde.json` (08, G1). Gerechnet für jemanden, der jede Runde
einmal besteht, jeden Straßengegner einmal schlägt, jede Clubnadel holt und die Funde findet,
**ohne etwas zu kaufen**. Wer weniger macht, hat etwa ein Drittel weniger; wer Straßengegner
wiederholt schlägt, mehr (siehe 7.4).

| Bis einschließlich              | Neu dazu                                                      | Summe |
| ------------------------------- | ------------------------------------------------------------- | ----- |
| Maple Falls (Akt 1)             | 5 Runden 50, Jo 10, Nadel 50                                  | ≈ 110 |
| Weg 1 Maple Falls → Cedar Creek | Tafel 10, Nia 10, Funde 15                                    | ≈ 145 |
| Cedar Creek (Ende Akt 1)        | 4 Runden 40, Rosa 10, Nadel 50                                | ≈ 245 |
| Weg 2 → Riverton                | Tafel 10, Schaffner 10, Funde 15                              | ≈ 280 |
| Riverton                        | 5 Runden 50, Harlan 10, Nadel 50, Funde 15                    | ≈ 405 |
| Weg 3 → Ironwood                | Tafel 10, Funde 5                                             | ≈ 420 |
| Ironwood (Ende Akt 2)           | 4 Runden 40, Gus 10, Nadel 50, Funde 10                       | ≈ 530 |
| Weg 4 und Silicon Bay (Akt 3)   | Tafel, Joggerin, 3 Runden, Dash, Nadel, Funde (Plan)          | ≈ 670 |
| Weg 5 und Port Delacroix        | Tafel, Koch, 2 Runden, Batiste, Nadel, Wiederaufbau 50 (Plan) | ≈ 845 |
| Weg 6 und Desert Springs        | Tafel, 4 Runden, Buck, Nadel, Erinnerung 20 (Plan)            | ≈ 990 |

Faustregel daraus: Ein Akt bringt 250 bis 450 Münzen, ein Clubbesuch mit Weg 100 bis 140 (etwas
mehr als G4 mit 60 bis 100, weil die Runden zählen).

### 7.2 Karten

Stufe: L leicht, M mittel, S stark; Art: d dauerhaft, v Verbrauch. „Lernkarte“ heißt: geschenkt,
sobald das Buchkapitel in der App fertig ist (Abschnitt 5), unabhängig vom Akt.

| Karte                    | Stufe/Art | Herkunft (Szene, Laden, Lernkarte)                                                           | Preis      | Akt   | Münzen bis dahin |
| ------------------------ | --------- | -------------------------------------------------------------------------------------------- | ---------- | ----- | ---------------- |
| Fingerzeig               | L/d       | Szene 2 (Ambrose); Laden Riverton                                                            | 15         | 1, 2  | 0 / ≈ 280        |
| Gefahrenradar            | L/d       | Quest `mapleFalls.viertesBrett`; Laden Maple Falls; Lernkarte Kapitel 4                      | 35         | 1     | ≈ 0–110          |
| Zweite Chance            | L/v       | Sams Dame (2), Straßensiege, erste Reihe je Club; Läden Maple Falls, Riverton, Ironwood      | 20         | 1–3   | ab ≈ 50          |
| Ambroses Flüstern        | M/v       | Rätsel und Hilfe-Quests (R27); Läden Maple Falls, Ironwood, Akt 3                            | 40         | 1–3   | ab ≈ 50          |
| Mentor-Zug               | M/v       | erste Clubnadel je Club (R27); nie im Laden (G4)                                             | –          | 1–3   | –                |
| Bauernvorgabe            | S/v       | erste Erinnerung je Staffel (Cedar Creek; Staffel 2: Flashback Port Delacroix); nie im Laden | –          | 1, 3  | –                |
| Springervorgabe          | S/v       | alle Nebenquests einer Stadt (R27); nie im Laden                                             | –          | 2, 3  | –                |
| Sanduhr                  | M/v       | Post-Game (R27); nie im Laden                                                                | –          | 5     | –                |
| Kühler Kopf (Spruch)     | L/v       | Weg 2, Sieg gegen den Schaffner (`weg-cedar-riverton`); nie im Laden (Z4)                    | –          | 2     | –                |
| Grübelfalle (Spruch)     | L/v       | Slicks Wohnwagen nach dem Clubkampf; Szene 54 (Dash)                                         | –          | 2, 3  | –                |
| Großes Maul (Spruch)     | M/v       | Weg 3, Ambrose auf der Brücke; Szene 74 (Buck)                                               | –          | 2, 3  | –                |
| Schmeichelei (Spruch S7) | L/v       | Laden Riverton                                                                               | 15         | 2     | ≈ 280            |
| Ablenkung (Spruch S9)    | L/v       | Laden Maple Falls                                                                            | 10         | 1     | ≈ 0–110          |
| Was droht? (K1)          | L/d       | Laden Ironwood; Lernkarte Kapitel 12                                                         | 45         | 2     | ≈ 420            |
| Waage (K3)               | L/v       | Laden Riverton                                                                               | 15         | 2     | ≈ 280            |
| Remisangebot (K5)        | M/v       | Laden Riverton                                                                               | 35         | 2     | ≈ 280            |
| Auszeit (K8)             | L/v       | Laden Ironwood                                                                               | 15         | 2     | ≈ 420            |
| Abzählen (K2)            | L/d       | Lernkarte Kapitel 1; Vorschlag: auch Runde Kapitel 1 in Maple Falls                          | –          | jeder | –                |
| Röntgenblick             | L/d       | Laden Maple Falls                                                                            | 30         | 1     | ≈ 0–110          |
| Zielkompass              | L/d       | Lernkarte Kapitel 2                                                                          | –          | jeder | –                |
| Faktorenwaage            | L/d       | Lernkarte Kapitel 3                                                                          | –          | jeder | –                |
| Bauernkompass            | L/d       | Lernkarte Kapitel 5; Vorschlag: Clubsieg Port Delacroix (Bauernstruktur)                     | –          | jeder | –                |
| Planfinder (K6)          | M/d       | Lernkarte Kapitel 6; Vorschlag: Clubsieg Port Delacroix                                      | –          | jeder | –                |
| Taktikspürnase           | M/d       | Lernkarte Kapitel 7                                                                          | –          | jeder | –                |
| Endspielkompass          | L/d       | Lernkarte Kapitel 8                                                                          | –          | jeder | –                |
| Turmregel                | L/d       | Lernkarte Kapitel 9                                                                          | –          | jeder | –                |
| Phasenblick              | L/d       | Lernkarte Kapitel 11                                                                         | –          | jeder | –                |
| Spickzettel (K7, neu)    | L/v       | Szene 34 Riverton (Vorbereitungsquest), später Laden Silicon Bay                             | 20 (Akt 3) | 2, 3  | ≈ 670            |
| Pokerface (S8, neu)      | M/v       | Szene 65, erster Sieg gegen Mr. Batiste; Laden Port Delacroix                                | 30         | 3     | ≈ 845            |
| Schutzengel (K4, neu)    | M/v       | Szene 69, Benefiz-Simultan; Laden Desert Springs                                             | 50         | 3     | ≈ 990            |

### 7.3 Gegenstände

| Gegenstand               | Herkunft                                                                      | Preis               | Akt             | Münzen bis dahin |
| ------------------------ | ----------------------------------------------------------------------------- | ------------------- | --------------- | ---------------- |
| Limo (I5, Verbrauch)     | Kiosk Maple Falls (Mr. Patel), Szene 10a; später jeder Kiosk                  | 5                   | 1               | ≈ 10–50          |
| Fahrrad                  | Schuppen Riverton (Szene 33, Schlüssel vom Steg); Läden Maple Falls, Ironwood | 120                 | 1–2             | ≈ 110 / ≈ 420    |
| Laterne                  | Laden Ironwood                                                                | 60                  | 2               | ≈ 420            |
| Monatskarte (I6, neu)    | Zeitungsstand Riverton (Pops), Szene 30a                                      | 80                  | 2               | ≈ 280–405        |
| Lupe des Uhrmachers (I1) | Mr. Harlan nach drei Siegen, Szene 31a; nie im Laden                          | –                   | 2               | –                |
| Partienotizbuch (I4)     | Oma Ruth gibt Mamas altes Turnierheft, Szene 39a; nie im Laden                | –                   | 2               | –                |
| Kartentasche (I2)        | Laden Ironwood (heute); Vorschlag: Laden Silicon Bay                          | 300 (Vorschlag 350) | 2 (Vorschlag 3) | ≈ 530 / ≈ 670    |
| Reisebrett (I3)          | Juno zum Abschied, Szene 51a; nie im Laden                                    | –                   | 3               | –                |

**Ziel geprüft:** In jedem Akt gibt es etwas Neues zu kaufen (Akt 1: Röntgenblick, Ablenkung, Limo;
Akt 2: Waage, Schmeichelei, Remisangebot, Was droht?, Laterne, Monatskarte; Akt 3: Spickzettel,
Pokerface, Schutzengel, Kartentasche). Starke Karten und Mentor-Zug sind nie käuflich (G4).

### 7.4 Was zu stark oder zu früh wirkt (Vorschläge)

1. **Fahrrad im Laden von Maple Falls (120):** schon am Ende von Maple Falls bezahlbar (≈ 110 bis
   145), bevor der erste Weg gegangen ist; das nimmt dem Schlüssel in Riverton den Sinn.
   Vorschlag: aus Maple Falls streichen oder 180, bei Edna in Ironwood 120 lassen.
2. **Kartentasche in Ironwood (300):** mit ≈ 530 Münzen schon in Akt 2 erreichbar; vier Karten im
   Deck machen die Clubkämpfe von Akt 2 deutlich leichter. Vorschlag: nach Silicon Bay (Akt 3),
   350 Münzen, oder Wirkung erst ab Akt 3 (11, I2).
3. **Remisangebot (35) im Clubkampf:** In ausgeglichener Stellung gibt es damit eine sichere
   Bronzenadel (R19), ohne zu gewinnen. Vorschlag: im Clubkampf nicht spielbar oder Remis durch die
   Karte ohne Nadel; gegen Straßengegner und in Turnieren frei.
4. **Ablenkung im Laden (S9):** Z4 sagt „Zeitkarten nie im Laden“; Ablenkung wirkt wie Großes
   Maul (schwächere Stufe). Vorschlag: aus dem Laden nehmen und als Belohnung eines Straßengegners
   vergeben, oder Z4 ausdrücklich auf die drei Uhr-Sprüche beschränken.
5. **Straßensiege ohne Grenze:** Jeder Sieg bringt 10 Münzen, auch der zwanzigste gegen Jo; so
   lassen sich alle Läden leerkaufen. Vorschlag: 10 nur für den ersten Sieg je Gegner und Tag
   (oder je Akt), danach 2.
6. **Flüstern ab Maple Falls (40):** früh, aber mit ≈ 110 Münzen höchstens zweimal bezahlbar; in
   Ordnung, solange nur eines je Besuch verkauft wird.
7. **Was droht? (45, dauerhaft):** stark im Lernwert und dauerhaft; Vorschlag 60, weil es jede
   Partie mitspielt.

## 8. Neue Waren für Akt 3 und 4 (mittel-1, 09.11.2026)

Warum: Die Wirtschaftsauswertung der Gesamtsimulation (`node pipeline/abenteuer/gesamtsimulation.cjs
--wirtschaft`) zeigte, dass ein Spieler, der jede dauerhafte Karte einmal sammelt, am Ende noch über
1000 Münzen hat; ab Riverton gab es nichts mehr, wofür sich Sparen lohnt. Der Autor wünscht viele
Karten. Die elf neuen Karten nutzen nur vorhandene Wirkungsarten (Werkzeug des Buches, Flüstern mit
zwei Kandidaten, Zeit, Vorgabe); es braucht keinen neuen Code.

| Karte                 | Wirkung                          | Stufe/Art | Laden                        | Preis | Warum                                                                               |
| --------------------- | -------------------------------- | --------- | ---------------------------- | ----- | ----------------------------------------------------------------------------------- |
| Sieben Warnsignale    | Werkzeug k7-warnsignale          | M/d       | Silicon Bay (Rosie)          | 120   | Taktik in der Stadt der Maschinen: erst die Signale sehen, dann rechnen             |
| Schwache Felder       | Werkzeug k5-felder               | L/d       | Port Delacroix (Gebäckstand) | 70    | Bauernstrukturen sind das Thema von Miss Odiles Club                                |
| Figurenplatz          | Werkzeug k5-figuren              | L/d       | Port Delacroix (Gebäckstand) | 80    | ergänzt die Schwachen Felder: welche Figur zu welchem Skelett passt                 |
| Goldene Angriffsregel | Werkzeug k1-angriffsregel        | M/d       | Desert Springs (Mr. Okoro)   | 110   | Mira opfert gern; wer zählt, sieht, ob ihr Angriff trägt                            |
| Klares Flüstern       | Flüstern mit zwei Kandidaten     | M/v       | Desert Springs (Mr. Okoro)   | 70    | stärkere Stufe von Ambroses Flüstern (drei Kandidaten)                              |
| Läufervorgabe         | Vorgabe f1 (Königsläufer)        | S/v       | Desert Springs, Crossroads   | 200   | einzige starke Karte im Laden, erst ab Akt 3; teuer, damit Münzen zählen            |
| Opposition            | Werkzeug k8-opposition           | L/d       | Summit City (Bergladen)      | 90    | Großmeisterin Ward unterrichtet Endspiele                                           |
| Schlüsselfelder       | Werkzeug k8-schluesselfelder     | M/d       | Summit City (Bergladen)      | 120   | wie Opposition, für Freibauern                                                      |
| Erkennungsbild        | Werkzeug k9-erkennungsbilder     | M/d       | Crossroads (Darlene)         | 130   | der größte Laden vor der Meisterschaft; Endspiele entscheiden das Turnier           |
| Elementarmatt         | Werkzeug k8-elementarmatt        | L/d       | Crossroads (Darlene)         | 90    | damit kein gewonnenes Endspiel im Patt endet                                        |
| Lange Auszeit         | Zeit +180 Sekunden für den Leser | L/v       | Crossroads (Darlene)         | 35    | für die Turnierrunde mit fester Uhr (Tobias, 5 + 3); kein Spruch, also erlaubt (Z4) |

Stufe: L leicht, M mittel, S stark; Art: d dauerhaft, v Verbrauch. Die Werkzeugkarten brauchen nur
die Stellung (keine Engine, kein Zug), wie es das Schema für Werkzeugkarten verlangt. Bilder folgen
dem Muster `karten/<name>.webp`; Texte (Name, Spruch, Erklärung; die Buchstelle nur in den Daten) in
`inhalte/abenteuer/texte/de.json`.

Ergebnis der Auswertung (Startwerte 1 und 2): Der sparsame Spieler, der jede dauerhafte Karte
einmal kauft, hat am Ende 210 bis 260 Münzen übrig (vorher 1020 bis 1070); der verschwenderische
kann in Akt 4 sieben Waren nicht kaufen. Gold, Silber und die Kaufmöglichkeit vor jedem Clubkampf
bleiben unverändert erfüllt.
