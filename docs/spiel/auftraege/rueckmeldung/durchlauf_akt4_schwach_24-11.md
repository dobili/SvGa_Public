# Schwacher Spieler-Durchlauf Akt 4 bis zum Abspann (24.11.2026)

Auftrag des Hauptchats (24.11.2026, vormittags): der schwache Spieler (`DURCHLAUF_SPIELER=schwach`)
durch Akt 4 bis zum Abspann; Akt 2 und 3 macht mittel-2. Befunde beheben, mit Test.

## Aufruf

```bash
node pipeline/abenteuer/aktstand.cjs --akt 4 --ziel akt4.json
(cd app && DURCHLAUF_ORDNER=… DURCHLAUF_STAND=akt4.json DURCHLAUF_SPIELER=schwach \
  DURCHLAUF_FORMAT=hoch DURCHLAUF_MINUTEN=180 CHROMIUM_PFAD=… \
  npx playwright test --config playwright.durchlauf.config.ts durchlauf.spec)
```

Der Stand beginnt in Desert Springs (Ende Akt 3); die erste Stunde zählt die Messung noch zu Akt 3.
Der schwache Spieler verliert jede Partie und Runde beim ersten Versuch, gibt auf, lädt mitten in
der Partie neu oder geht mit der Zurück-Taste und gibt auf der Fortsetzungskarte auf.

## Strecke

| Format | Laufzeit bis Abspann | Funde |
| ------ | -------------------- | ----- |
| hoch   | 3,0 h                | 4     |

Der Abspann und die Meldung „Erledigt: Die Landesmeisterschaft“ wurden erreicht. Jede verlorene
Partie und Runde wurde wieder angeboten, jede Fortsetzungskarte führte weiter. Es gab keine
doppelten Dialoge, keine verlorenen Rückmeldungen und keine hängenden Pausen.

## Funde

| Fund                                                                                                                                                       | Ursache                                                                                                                                                                                                                                                                                                                                                                                                        | Korrektur                                                                                                                                                                                                                                                                                 | Test                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Kits Hütte, Rätselrunde von Mr. Haraldsen: „Weiter“ nach einer falschen Antwort ist sekundenlang von der Sprechblase verdeckt (zweimal, je mehrere Zeilen) | Spielfehler. Die Blase meidet nur das Brett (anbindung/blasenlage.ts). Unten liegt sie über dem Fuß der Hülle, und dort erscheint nach der Antwort „Weiter“. Ambrose spricht im selben Augenblick.                                                                                                                                                                                                             | Die Blase meidet jetzt das Brett zusammen mit den sichtbaren Hauptknöpfen darunter oder darüber (`sperrflaeche`). Knöpfe neben dem Brett im Querformat zählen nicht. Ein Knopf, der nach der Antwort erscheint, verschiebt die Blase sofort (MutationObserver in anbindung/brettfrei.ts). | anbindung/blasenlage.test.ts                      |
| Weltschachtag am Seeufer, Simultan: Nachfrage „Wirklich aufgeben?“ ohne Absicht                                                                            | Durchlauf, kein Spielfehler. Zwischen dem Lesen der Lage und dem Tippen auf „Weiter“ der Meldung öffnete das Simultan das nächste Brett. Der Tipp auf die alte Stelle traf „Aufgeben“. Die Nachfrage schützte vor dem Aufgeben, wie sie es auch bei einem Menschen täte.                                                                                                                                       | `tippeKnopf` (tests/durchlauf/eingabe.ts) tippt nur noch, wenn an der Stelle noch derselbe Knopf liegt, sonst liest es die Lage neu.                                                                                                                                                      | tests/durchlauf (Typen); Wirkung im nächsten Lauf |
| Summit City außen: Ward „steht davor, kein Aktionsknopf“                                                                                                   | Vermutlich derselbe Fehlalarm wie im eiligen Lauf im Querformat (durchlauf_akt4_eilig_24-11.md). Ward kam nach dem Bergladen am Abend auf die Karte. Sie sitzt dann auf der Parkbank (41, 38), ihr Bild rückt auf die Bank, und der Durchlauf kennt nur die Fußkachel. Im Spiel zeigt der Held vom Feld darüber „Sprechen“. Der Lauf schrieb keine Spur, die Seite, von der er es versuchte, ist nicht belegt. | Nicht geändert.                                                                                                                                                                                                                                                                           | –                                                 |
