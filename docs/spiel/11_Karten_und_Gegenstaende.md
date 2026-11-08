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
  selbst fragt; wer sie oft spielt, lernt die Frage. Buchbezug steht auf der Karte.
- **G3 Gold gibt es nur ohne Karten.** Neue Karten bekommen eine Stufe (leicht, mittel, stark) und
  zählen für die Clubnadel wie die alten; Sprüche nur gegen Straßengegner (10, S2).
- **G4 Kaufen ersetzt kein Lernen.** Starke Karten (Vorgaben, Mentor-Zug) bleiben unverkäuflich;
  Läden verkaufen leichte und mittlere Karten, Gegenstände nur einmal.
- **G5 Technik wiederverwenden.** Jede Karte nutzt ein vorhandenes Werkzeug der App (Analyse,
  Engine, Zustand der Gegner), damit sie wenig Code und keine neue Engine braucht.

## 2. Neue Hilfskarten

| Nr. | Karte               | Stufe  | Wirkung                                                                                                                            | Buch, Werkzeug der App                                      | Woher                     |
| --- | ------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------- |
| K1  | **Was droht?**      | leicht | Zeigt als roten Pfeil, was der Gegner spielen würde, wenn er jetzt am Zug wäre (Nullzug der Engine).                               | Kapitel 4 und 12, Frage „Was will der Gegner?“              | Laden, dauerhaft          |
| K2  | **Abzählen**        | leicht | Ein Feld antippen: Zahl der Angreifer und Verteidiger, grün oder rot.                                                              | Kapitel 1, Zählen von Angreifern und Verteidigern           | Aufgabenrunde Kapitel 1   |
| K3  | **Waage**           | leicht | Sagt grob, wer besser steht (deutlich Weiß, ausgeglichen, deutlich Schwarz), ohne Zahl und ohne Zug.                               | Kapitel 12, Stellungsbeurteilung                            | Laden                     |
| K4  | **Schutzengel**     | mittel | Für die nächsten fünf eigenen Züge: Verliert ein Zug Material (zwei Bauern oder mehr), fragt die App einmal „Bist du sicher?“.     | Kapitel 4, Vorsichtsprüfung vor jedem Zug (W1–W7)           | Nebenquest, Verbrauch     |
| K5  | **Remisangebot**    | mittel | Der Gegner nimmt Remis an, wenn die Stellung etwa ausgeglichen ist (Engine ±0,5); sonst lehnt er ab, die Karte ist trotzdem weg.   | Kapitel 12, Remis als Ergebnis, Stellung ehrlich beurteilen | Laden Riverton, Verbrauch |
| K6  | **Plan des Buches** | mittel | Nennt ein Merkmal der Stellung aus den Werkzeugen der Kapitel 5 bis 7 (schwacher Bauer, offene Linie, schlechter Läufer) als Satz. | Kapitel 5–7, Werkzeuge der App                              | Clubchef-Sieg (Akt 3)     |
| K7  | **Spickzettel**     | leicht | Vor der Partie: Der Gegner spielt die Eröffnung aus seinem Steckbrief sicher, und der Leser sieht ihren Namen.                     | Kapitel 11, Eröffnungen; Eröffnungsnamen der App            | Vorbereitungsquest (C7)   |
| K8  | **Auszeit**         | leicht | Hält die eigene Uhr für einen Zug an (nur mit Uhr).                                                                                | Kapitel 12, Zeiteinteilung                                  | Laden, Verbrauch          |

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
Was droht? Ambrose sagt dazu: „Das hast du nicht im Park gelernt, sondern im Buch.“ So lohnt sich das
Buch im Spiel, ohne dass das Spiel das Buch ersetzt.

## 6. Empfehlung und Reihenfolge

1. **K1 Was droht?** und **K2 Abzählen**: billig (Werkzeuge vorhanden), stark im Lernwert.
2. **I5 Limo** und **S7 Schmeichelei**: kleine Geschichten im Park, nutzen Zustand und Steckbrief.
3. **K5 Remisangebot** und **K4 Schutzengel**: brauchen je einen kleinen Ablauf in der Partie.
4. **I1 Lupe**, **I4 Notizbuch**: zusammen mit der Steckbriefansicht (C7).
5. **Lernkarten (Abschnitt 5)**: sobald der Lernstand der App im Spiel lesbar ist.
6. **I2 Kartentasche**, **I3 Reisebrett**, **I6 Monatskarte**, **K6–K8**, **S8**, **S9**: mit Akt 3.

Nicht empfohlen: Karten, die Figuren verschieben, Züge des Gegners verbieten oder den König
schützen (bricht G1), und kaufbare Vorgaben (bricht G4).
