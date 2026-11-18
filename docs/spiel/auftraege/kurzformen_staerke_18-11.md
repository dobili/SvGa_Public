# Kurze Partieformen: Stärke gemessen (18.11.2026, nachts)

Auftrag des Hauptchats: die kurzen Formate wie die Wegsperren messen (Muster
`wegsperren_staerke_18-11.md`): Dime (fremde Eröffnung, dann Vorteil), Schiffskoch (Endspiel Remis
halten), Kreideblitz (Vorteil), Kreidenacht 1 und Sol (Endspiel gewinnen) sowie die drei
Begegnungen mit Stellungen aus dem Vorrat (Gus, Joggerin, Hollis), gegen Leser in Lesestärke
E = 800, 1200 und 1600. Ziel nach dem Regelwerk: Straßengegner fair, der Leser gewinnt oder
erreicht das Ziel meist, aber nicht geschenkt. Alle acht sind Straßengegner (Rolle `strasse`,
Versatz −100 bis −25 unter A); Story-Partien sind nicht darunter.

## Messweg

Derselbe Lauf wie bei den Wegsperren, jetzt für jede Begegnung:
`app/src/abenteuer/wegsperren.messung.ts` nimmt in `WEGSPERRE` auch die Kennung einer Begegnung
(etwa `summitCity.sol`). Der Ablauf steht in `begegnungsmessung.testhilfe.ts` und löst wie die App
auf: Farbe der Begegnung (bei Dime „zufall“ je Partie gewürfelt), fremde Eröffnung (Dimes vier
Eröffnungen reihum; die App nimmt die seltenste des Lesers), Vorratsstellung (Band zur
Zielstärke des Gegners, die acht Einträge reihum; Farbe ist die Seite am Zug). Gegner, Leser-Bots
(800: Mara, Leyla, Holger; 1200: Frau Demir, Frau Romero, Katrin; 1600: Herr Vogel, Günter,
Herr Kühn), Maia, Wertung (Tiefe 12 aus Sicht des Lesers) wie bei den Wegsperren. Je Zelle 45
Partien; eine Quote schwankt dabei um etwa ±7 Prozentpunkte. Neue Probe-Schalter:
`WEGSPERRE_ZUEGE` (Zugzahl), dazu wie bisher `WEGSPERRE_VERSATZ`. Gegenprobe: Der umgebaute Lauf spielt für S15 und S17
(je drei Saaten) dieselben Partien mit denselben Werten wie der alte.

„Ziel erreicht“ ist der Sieg im Sinne der Kurzform: Vorteil oder Duell mit Bewertung ≥
Mindestvorteil, Endspiel gewonnen (≥ +3) oder beim Schiffskoch gehalten (Remis nach den Regeln
oder Bewertung ≥ −1,5). „Wert Median“ ist die Bewertung am Ende aus Sicht des Lesers; Werte um
+995 sind Matt.

## Vorher, je 45 Partien

| Begegnung     | E    | Gegner: Stufen, Häufigkeit | Sieg | Remis | Niederlage | Ziel erreicht | Wert Median |
| ------------- | ---- | -------------------------- | ---- | ----- | ---------- | ------------- | ----------- |
| Dime          | 800  | 3/3/3, 1,40                | 30   | 0     | 15         | 66 %          | +5,2        |
| Dime          | 1200 | 4/4/4, 1,12                | 26   | 3     | 16         | 57 %          | +2,9        |
| Dime          | 1600 | 5/5/5, 0,89                | 27   | 2     | 16         | 60 %          | +2,0        |
| Schiffskoch   | 800  | 3/3/3, 1,40                | 28   | 0     | 17         | 62 %          | 0,0         |
| Schiffskoch   | 1200 | 4/4/4, 1,12                | 27   | 0     | 18         | 60 %          | 0,0         |
| Schiffskoch   | 1600 | 5/5/5, 0,89                | 31   | 0     | 14         | 68 %          | 0,0         |
| Kreideblitz   | 800  | 3/3/3, 1,40                | 30   | 5     | 10         | 66 %          | +5,2        |
| Kreideblitz   | 1200 | 4/4/4, 1,12                | 32   | 4     | 9          | 71 %          | +3,6        |
| Kreideblitz   | 1600 | 5/5/5, 0,89                | 26   | 10    | 9          | 57 %          | +1,3        |
| Kreidenacht 1 | 800  | 3/3/3, 1,32                | 39   | 6     | 0          | 86 %          | Matt        |
| Kreidenacht 1 | 1200 | 4/4/4, 1,06                | 36   | 6     | 3          | 80 %          | Matt        |
| Kreidenacht 1 | 1600 | 5/5/5, 0,85                | 35   | 9     | 1          | 77 %          | Matt        |
| Sol           | 800  | 3/3/3, 1,40                | 34   | 11    | 0          | 75 %          | Matt        |
| Sol           | 1200 | 4/4/4, 1,12                | 28   | 17    | 0          | 62 %          | Matt        |
| Sol           | 1600 | 5/5/5, 0,89                | 25   | 20    | 0          | 55 %          | Matt        |
| Gus           | 800  | 3/3/3, 1,40                | 39   | 0     | 6          | 86 %          | +8,0        |
| Gus           | 1200 | 4/4/4, 1,12                | 37   | 0     | 8          | 82 %          | +4,8        |
| Gus           | 1600 | 5/5/5, 0,89                | 38   | 2     | 5          | 84 %          | +5,1        |
| Joggerin      | 800  | 2/2/2, 0,80                | 40   | 0     | 5          | 88 %          | +9,5        |
| Joggerin      | 1200 | 4/4/4, 1,25                | 41   | 1     | 3          | 91 %          | +7,8        |
| Joggerin      | 1600 | 5/5/5, 1,00                | 40   | 3     | 2          | 88 %          | +5,8        |
| Hollis        | 800  | 2/2/2, 0,80                | 36   | 1     | 8          | 80 %          | +5,5        |
| Hollis        | 1200 | 4/4/4, 1,25                | 36   | 2     | 7          | 80 %          | +7,6        |
| Hollis        | 1600 | 5/5/5, 1,00                | 40   | 2     | 3          | 88 %          | +5,3        |

## Empfehlung je Begegnung, umgesetzt (Widerspruch genügt)

- **Dime, Schiffskoch, Kreideblitz: unverändert.** Ziel erreicht in 57 bis 71 %, mit echten
  Niederlagen (9 bis 18 von 45). Das ist „meist, aber nicht geschenkt“.
- **Sol: unverändert.** Gewonnen in 55 bis 75 %, sonst Remis, nie verloren (Abb. 8.27, König und
  Bauer gegen König: wer die Opposition nicht findet, hält nur remis). Das Ergebnis hängt an der
  Technik des Lesers, nicht am Gegner; der Versatz würde nichts ändern.
- **Kreidenacht 1: unverändert, aber an der oberen Grenze.** Gewonnen in 77 bis 86 %, fast immer
  mit Matt (Abb. 9.8, Lucena-Stellung, 20 Züge). Auch hier entscheidet die Technik des Lesers: Der
  Verteidiger kann in der Lucena-Stellung objektiv nichts halten, ein stärkerer Gegner änderte
  wenig. Die Leser-Bots rechnen die Brücke besser, als ein Mensch, der das Kapitel 9 gerade liest,
  sie findet; gegen echte Leser liegt die Quote vermutlich tiefer.
- **Gus, Joggerin, Hollis (Stellungsduell aus dem Vorrat): 7 statt 10 Züge.** Vorher in 80 bis
  91 % gewonnen, fast immer hoch (Median +5 bis +10): Der Leser beginnt mit +0,8 bis +2,5
  (Fenster des Vorrats), der Gegner spielt unter A, und in zehn Zügen unterläuft ihm fast immer
  ein grober Fehler. Geprüfte Hebel:
  - Versatz auf 0 (das Höchste für Straßengegner, Regelwerk R4) an Gus und Joggerin: 75 bis 88 %,
    kein Unterschied über dem Rauschen.
  - Höherer Mindestvorteil: R13 erlaubt höchstens den Startvorteil (ab +0,8); aus den Partien
    gerechnet brächte selbst 3,0 nur 67 bis 84 %.
  - Weniger Züge: Joggerin mit 7 Zügen (Probe) 77, 66 und 86 % statt 88, 91 und 88 % (im Mittel
    76 statt 89 %). Das wirkt und bleibt in den Regeln. Umgesetzt in `begegnungen.json`, dazu die
    Ansagen „Sieben Züge“ (`erzaehlung.gus.vorher`, `erzaehlung.joggerin.vorher`,
    `erzaehlung.hollis.vorher`, Gus in `ironwood-aussen.ink`, Joggerin in
    `weg-ironwood-silicon.ink`).

## Nachher (7 Züge), je 45 Partien

Gus und Hollis mit der neuen `begegnungen.json` gemessen; die Joggerin mit der Probe
`WEGSPERRE_ZUEGE=7` (gleiche Partien wie mit der neuen Datei).

| Begegnung | E    | Gegner: Stufen, Häufigkeit | Sieg | Remis | Niederlage | Ziel erreicht (vorher) | Wert Median |
| --------- | ---- | -------------------------- | ---- | ----- | ---------- | ---------------------- | ----------- |
| Gus       | 800  | 3/3/3, 1,40                | 31   | 4     | 10         | 68 % (86 %)            | +3,6        |
| Gus       | 1200 | 4/4/4, 1,12                | 28   | 5     | 12         | 62 % (82 %)            | +2,4        |
| Gus       | 1600 | 5/5/5, 0,89                | 39   | 3     | 3          | 86 % (84 %)            | +4,2        |
| Joggerin  | 800  | 2/2/2, 0,80                | 35   | 3     | 7          | 77 % (88 %)            | +5,8        |
| Joggerin  | 1200 | 4/4/4, 1,25                | 30   | 5     | 10         | 66 % (91 %)            | +4,6        |
| Joggerin  | 1600 | 5/5/5, 1,00                | 39   | 4     | 2          | 86 % (88 %)            | +3,4        |
| Hollis    | 800  | 2/2/2, 0,80                | 35   | 3     | 7          | 77 % (80 %)            | +4,7        |
| Hollis    | 1200 | 4/4/4, 1,25                | 34   | 2     | 9          | 75 % (80 %)            | +4,8        |
| Hollis    | 1600 | 5/5/5, 1,00                | 37   | 3     | 5          | 82 % (88 %)            | +4,1        |

Im Mittel 75 statt 85 %. Bei E = 1600 bleibt es hoch (82 bis 86 %): Dort spielen die Leser-Bots
die Vorteilsstellung sicher heraus, auch in sieben Zügen. Weiter senken ließe es sich nur mit
weniger Zügen oder einem engeren Fenster des Vorrats (R13); beides würde auch die schwächeren Leser
treffen, deshalb bleibt es vorerst bei sieben.

## Was bleibt

1. **Gemessen gegen Bots, nicht gegen Menschen.** Die Leser-Bots kennen das Thema einer Stellung
   nicht besser als andere; ein Leser, der das Kapitel gerade gelesen hat, schon. Umgekehrt
   rechnen sie Endspieltechnik (Lucena, Opposition) sicherer als Einsteiger.
2. **Karten nicht gemessen.** Hilfskarten machen jede Begegnung leichter.
3. **Die Vorratsstellungen streuen.** Die acht Einträge eines Bandes starten zwischen +0,8 und
   +2,5; wer eine Stellung mit +2,4 zieht, hat es deutlich leichter als mit +0,9.
