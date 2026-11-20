# Schwierigkeitskurve gemessen (20.11.2026, mittel-4)

Auftrag des Hauptchats: die wichtigen Partien gegen Leser in drei Lesestärken messen. Gemessen
wurden die acht Clubchefs, die Wegsperren S15 bis S17, Victor (Maple Falls und Summit City), das
Halbfinale und das Finale. Gegen das Design halten:

- Die Kurve steigt.
- Ein Leser mit 1200 schafft Akt 1 gut und kämpft ab Akt 3.
- Ein Leser mit 800 kommt mit Karten und Hilfen durch.

Ausreißer über die Stellschrauben korrigieren, ohne Maia anzufassen. Dazu prüfen, wie die halbe
Blitzwertung und Maia ohne fertige Ladung wirken.

## Messweg

Der Messlauf ist `app/src/abenteuer/wegsperren.messung.ts` (Aufruf in `CLAUDE.md`). Gegner und
Leser sind dieselben wie in `wegsperren_staerke_18-11.md`.

- **Gegner wie in der App:** Profil aus `gegner.json`, Stärke über `regeln/gegnerstaerke.ts` mit
  A = E, nicht abgelenkt und nicht überheblich, Maia an.
- **Leser:** drei Bots der App je Lesestärke im Wechsel, ohne Karten und ohne Zurücknehmen:
  - 800: Mara, Leyla, Holger
  - 1200: Frau Demir, Frau Romero, Katrin
  - 1600: Herr Vogel, Günter, Herr Kühn
- **Feste Saat je Partie.**

Neu in diesem Auftrag:

1. **Ganze Partien:** Begegnungen ohne Kurzform (Clubkampf, Victor, Turnier) spielt der Lauf
   jetzt bis zum Ende. Höchstens 200 Halbzüge, danach wertet Stockfish: ab +3 Sieg, ab −3
   Niederlage, dazwischen Remis. Vorher brach die Messung bei diesen Begegnungen ab, weil sie nur
   Kurzformen kannte.
2. **Ohne Maia:** `WEGSPERRE_OHNE_MAIA=1` lässt Maia beim Gegner weg. So spielt die App, solange
   Maia im Hintergrund noch lädt.

Je Zelle wurden 10 Partien gespielt, je Begegnung also 30. Bei 30 Partien schwankt eine Quote um
etwa ±6 Prozentpunkte, bei 10 um bis zu ±15. Einzelne Zellen sind deshalb nur ein grober Hinweis,
belastbar ist die Summe je Begegnung.

Gezählt wird in Punkten: Sieg 1, Remis ½.

## Vorher (Stand vor diesem Auftrag)

Zellen: Sieg/Remis/Niederlage (Punkte), dazu die Stufen des Gegners je Phase (Eröffnung,
Mittelspiel, Endspiel) und seine Fehlerhäufigkeit h.

| Begegnung (Versatz)  | E 800                   | E 1200                  | E 1600                  | zusammen | Elo-Erwartung |
| -------------------- | ----------------------- | ----------------------- | ----------------------- | -------- | ------------- |
| Delgado (+220)       | 4/0/6 (40 %) 332 h 0,76 | 2/0/8 (20 %) 554 h 1,2  | 2/0/8 (20 %) 665 h 0,96 | 27 %     | 22 %          |
| Okafor (+280)        | 0/0/10 (0 %) 445 h 1,31 | 3/0/7 (30 %) 556 h 1,05 | 1/1/8 (15 %) 667 h 0,84 | 15 %     | 17 %          |
| Slick (+340)         | 1/0/9 (10 %) 443 h 1,14 | 2/0/8 (20 %) 554 h 0,91 | 0/1/9 (5 %) 665 h 0,73  | 12 %     | 12 %          |
| Big Joe (+400)       | 2/0/8 (20 %) 444 h 1    | 1/1/8 (15 %) 555 h 0,8  | 0/0/10 (0 %) 777 h 1,25 | 12 %     | 9 %           |
| Lin (+460)           | 1/0/9 (10 %) 534 h 0,87 | 1/1/8 (15 %) 756 h 1,37 | 0/0/10 (0 %) 867 h 1,09 | 8 %      | 7 %           |
| Odile (+520)         | 2/1/7 (25 %) 443 h 0,76 | 0/0/10 (0 %) 665 h 1,2  | 1/0/9 (10 %) 776 h 0,96 | 12 %     | 5 %           |
| Mira (+580)          | 1/2/7 (20 %) 554 h 1,31 | 0/1/9 (5 %) 665 h 1,05  | 1/1/8 (15 %) 776 h 0,84 | 13 %     | 3 %           |
| Ward (+640)          | 1/1/8 (15 %) 456 h 1,14 | 1/0/9 (10 %) 567 h 0,91 | 0/1/9 (5 %) 678 h 0,73  | 10 %     | 2 %           |
| Victor, Akt 1 (+500) | 0/2/8 (10 %) 444 h 0,8  | 0/1/9 (5 %) 666 h 1,25  | 0/0/10 (0 %) 777 h 1    | 5 %      | 5 %           |
| Victor, Akt 4 (+400) | 1/0/9 (10 %) 444 h 1    | 0/1/9 (5 %) 555 h 0,8   | 1/0/9 (10 %) 777 h 1,25 | 8 %      | 9 %           |
| Halbfinale (+650)    | 0/1/9 (5 %) 555 h 1,12  | 2/1/7 (25 %) 666 h 0,89 | 1/0/9 (10 %) 888 h 1,4  | 13 %     | 2 %           |
| Finale (+700)        | 1/0/9 (10 %) 555 h 1    | 0/0/10 (0 %) 666 h 0,8  | 0/0/10 (0 %) 888 h 1,25 | 3 %      | 2 %           |
| S15 (+260, 10 Züge)  | 6/2/2 (70 %) 444 h 1,37 | 4/2/4 (50 %) 555 h 1,09 | 4/1/5 (45 %) 666 h 0,87 | 55 %     | –             |
| S16 (+380, 12 Züge)  | 4/2/4 (50 %) 444 h 1,05 | 3/2/5 (40 %) 555 h 0,84 | 3/4/3 (50 %) 777 h 1,31 | 47 %     | –             |
| S17 (+560, 15 Züge)  | 2/5/3 (45 %) 555 h 1,37 | 1/7/2 (45 %) 666 h 1,09 | 5/4/1 (70 %) 777 h 0,87 | 53 %     | –             |

Die Elo-Erwartung ist 1/(1 + 10^(Versatz/400)): Sie gibt an, was ein Leser gegen einen Gegner
dieser Stärke ohne Karten erwarten kann.

## Befund

1. **Akt 1 und 2 stimmen.** Von Delgado bis Lin liegt jede Begegnung höchstens 5 Punkte neben der
   Elo-Erwartung. Die Kurve fällt gleichmäßig von 27 % auf 8 %.
2. **Ab Akt 3 wurde die Kurve flach.** Odile, Mira und Ward lagen mit 10 bis 13 % gleichauf mit
   Club 3 und 4 statt bei 2 bis 5 %. Zusammen sind das 32 Punkte aus 90 Partien, erwartet waren
   etwa 9. Das ist weit über dem Rauschen. Ursache ist der Phasenversatz:
   - Odile und Mira hatten Endspiel −1, Ward Eröffnung −1.
   - Club 1 bis 5 hatten dagegen 0 oder +1, oder ein −1 mit +1 ausgeglichen (Lin).
   - Eine Stufe weniger in einer Phase entspricht etwa 300 Elo in dieser Phase.
     Für keinen der drei Gegner sagt der Steckbrief oder die Story, dass er im Endspiel schwach sei.
     Ward ist sogar Endspielerin; nur ihre schwache Eröffnung passt zur Figur („In der Eröffnung
     kann man schwindeln“).
3. **Sprung vor dem Finale:** Das Halbfinale (Kade, +650) war mit 13 % leichter als Victor in Akt 4
   (+400, 8 %), das Finale (+700) dann mit 3 % viel schwerer.
4. **Victor** liegt in beiden Partien genau auf der Erwartung. Die geplante Niederlage in Akt 1
   (5 %) ist gewollt.
5. **Wegsperren S15 bis S17** öffnen in 45 bis 70 % der Fälle schon im ersten Versuch. Das passt zu
   ihrem Ziel aus `wegsperren_staerke_18-11.md` („meist im ersten oder zweiten Versuch“). Sie
   beginnen im Vorteil und werden nach 10 bis 15 Zügen gewertet, deshalb stehen sie bewusst
   außerhalb der Clubkurve. S17 bei E 1600 (70 %) liegt über S15; das ist eine Zelle mit 10
   Partien, also innerhalb des Rauschens. Daran ist nichts geändert.

## Korrektur

Die Korrektur steht nur in `inhalte/abenteuer/gegner.json` und ändert nur den Phasenversatz.
Unverändert bleiben:

- der Versatz der Clubchefs (R4)
- Maia
- Steckbriefe, Fehlerarten und Stile

| Gegner            | vorher                    | nachher                                   | Warum                                                                                         |
| ----------------- | ------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| Odile             | Endspiel −1               | ohne Versatz                              | Ihre Schwäche ist der Königsflügel (`koenigsschild` 1,6), nicht das Endspiel.                 |
| Mira              | Endspiel −1               | ohne Versatz                              | Ihre Schwäche ist der falsche Abtausch (1,6), nicht das Endspiel.                             |
| Ward              | Eröffnung −1, Endspiel +1 | Eröffnung −1, Mittelspiel +1, Endspiel +1 | Die schwache Eröffnung bleibt; als letzter Clubchef braucht sie mehr Gewicht.                 |
| Kade (Halbfinale) | ohne Versatz              | Mittelspiel +1                            | ZERO rechnet für ihn im Mittelspiel. Das Halbfinale soll zwischen Ward und dem Finale liegen. |

## Nachher, je 30 Partien

| Begegnung  | E 800                   | E 1200                  | E 1600                  | zusammen | vorher |
| ---------- | ----------------------- | ----------------------- | ----------------------- | -------- | ------ |
| Odile      | 2/1/7 (25 %) 444 h 0,76 | 0/0/10 (0 %) 666 h 1,2  | 0/0/10 (0 %) 777 h 0,96 | 8 %      | 12 %   |
| Mira       | 1/2/7 (20 %) 555 h 1,31 | 0/1/9 (5 %) 666 h 1,05  | 0/1/9 (5 %) 777 h 0,84  | 10 %     | 13 %   |
| Ward       | 0/0/10 (0 %) 466 h 1,14 | 0/1/9 (5 %) 577 h 0,91  | 0/0/10 (0 %) 688 h 0,73 | 2 %      | 10 %   |
| Halbfinale | 0/1/9 (5 %) 565 h 1,12  | 0/0/10 (0 %) 676 h 0,89 | 1/0/9 (10 %) 898 h 1,4  | 5 %      | 13 %   |

Die Kurve der ganzen Partien ohne Karten heißt jetzt:

- Akt 1: 27, 15, 12
- Akt 2: 12, 8
- Akt 3: 8, 10
- Akt 4: Ward 2, Halbfinale 5, Finale 3 Prozent

Sie fällt also bis zum Schluss. Mira (10 %) liegt noch knapp über Odile (8 %), aber im Rauschen
von ±6 Punkten.

## Was das für Leser heißt

Die Messung ist bewusst streng:

- keine Karten
- nicht abgelenkt
- A = E, also ohne Lernen
- je Partie nur ein Versuch

Im Spiel schließen das Lernen, die Vorbereitung und die Karten die Lücke (Architektur, Abschnitt 4):

- **Lernen:** Steigt A über E + 200, rechnet jeder Clubchef von A − 200 aus.
- **Vorbereitung:** „Abgelenkt“ wiegt etwa 100 bis 200 Elo.
- **Karten:** Die Springervorgabe wiegt etwa 300 Elo.
- **Wiederholung:** „Überheblich“ (R9) erhöht nach jeder Niederlage die Fehlerhäufigkeit um 15 %,
  höchstens auf das 1,6-Fache.

- **1200, Akt 1:** 12 bis 27 % ohne Hilfen, mit der Springervorgabe rund 50 bis 65 %. Mit ein bis
  zwei Versuchen ist das „gut zu schaffen“.
- **1200, ab Akt 3:** 0 bis 5 % ohne Hilfen, mit Karte und Vorbereitung etwa 20 bis 30 %. Das heißt
  kämpfen, mit mehreren Versuchen oder nach echtem Lernen.
- **800:** In der Messung kommt der Leser mit 800 gegen späte Gegner etwas besser weg als die
  anderen Lesestärken (Odile 25 %, Mira 20 %). Ward ist ohne Hilfen bei 0 %. Mit Springervorgabe,
  „abgelenkt“ und zwei, drei Niederlagen (Faktor bis 1,6 auf h) liegt er grob bei 20 bis 30 % je
  Versuch und steckt nicht fest. Das ist eine Schätzung aus den Elo-Gewichten, nicht gemessen.

## Halbe Blitzwertung

Die halbe Blitzwertung (`regeln/zeitklassenwertung.ts`) verändert nur, wie stark eine Partie die
Abenteuerwertung A bewegt. Die Gegnerstärke ändert sie nicht. Für die Kurve heißt das:

- Wer viel blitzt, bewegt A langsamer.
- Clubchefs rechnen von max(E, A − 200). Eine Blitzserie lässt also die späten Clubchefs etwas
  später mitwachsen; nach Niederlagen sinkt A nur halb so schnell.
- Die Messung spielt ohne Uhr, also im Schnellschach-Maßstab, und ist davon nicht betroffen.

## Erste Partie ohne Maia

Gemessen wurden drei Begegnungen mit dem Gegner ohne Maia, mit denselben Saaten, je 30 Partien:

| Begegnung | mit Maia      | ohne Maia      |
| --------- | ------------- | -------------- |
| Delgado   | 27 % (8/0/22) | 40 % (10/4/16) |
| Lin       | 8 %           | 3 %            |
| Finale    | 3 %           | 5 %            |

- Eine durchgehende Richtung gibt es nicht.
- Nur bei Club 1, in niedrigen Stufen, ist der Gegner ohne Maia eher etwas schwächer (+13 Punkte,
  etwa zwei Standardfehler). Bei hohen Stufen ist kein Unterschied zu sehen.
- Für die erste Partie heißt das: Lädt Maia noch, ist der Gegner höchstens etwas leichter, nie
  deutlich stärker. Das ist unkritisch, die erste Partie soll ohnehin einladen.

## Nebenbefund für den Autor

Architektur, Abschnitt 4, nennt für das Finale gegen Victor E + 800. In `gegner.json` steht
E + 700. Gemessen sind es bei +700 bereits 3 %. Ich habe es so gelassen.
