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

| Fund                                                                                                                                                       | Ursache                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Korrektur                                                                                                                                                                                                                                                                                                        | Test                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Kits Hütte, Rätselrunde von Mr. Haraldsen: „Weiter“ nach einer falschen Antwort ist sekundenlang von der Sprechblase verdeckt (zweimal, je mehrere Zeilen) | Spielfehler. Die Blase meidet nur das Brett (anbindung/blasenlage.ts). Unten liegt sie über dem Fuß der Hülle, und dort erscheint nach der Antwort „Weiter“. Ambrose spricht im selben Augenblick.                                                                                                                                                                                                                                                                                   | Die Blase meidet jetzt das Brett zusammen mit den sichtbaren Hauptknöpfen darunter oder darüber (`sperrflaeche`). Knöpfe neben dem Brett im Querformat zählen nicht. Ein Knopf, der nach der Antwort erscheint, verschiebt die Blase sofort (MutationObserver in anbindung/brettfrei.ts).                        | anbindung/blasenlage.test.ts                      |
| Weltschachtag am Seeufer, Simultan: Nachfrage „Wirklich aufgeben?“ ohne Absicht                                                                            | Durchlauf, kein Spielfehler. Zwischen dem Lesen der Lage und dem Tippen auf „Weiter“ der Meldung öffnete das Simultan das nächste Brett. Der Tipp auf die alte Stelle traf „Aufgeben“. Die Nachfrage schützte vor dem Aufgeben, wie sie es auch bei einem Menschen täte.                                                                                                                                                                                                             | `tippeKnopf` (tests/durchlauf/eingabe.ts) tippt nur noch, wenn an der Stelle noch derselbe Knopf liegt, sonst liest es die Lage neu.                                                                                                                                                                             | tests/durchlauf (Typen); Wirkung im nächsten Lauf |
| Summit City außen: Ward „steht davor, kein Aktionsknopf“                                                                                                   | Durchlauf und Planung, kein Spielfehler, aber auch nicht die Bank-Erklärung aus dem eiligen Lauf. Ansprechprobe (Stand Akt 4, 18 Uhr) bestätigt: Der Durchlauf fand um Ward (41, 38) kein freies Feld, weil `sitzkacheln` (oberwelt/begehbar.ts) bei jeder Sitzenden die Kachel darüber sperrt. Die Parkbank beginnt aber erst auf Wards Fußkachel und reicht darunter; ihr Bild rückt nach unten. Im Spiel geht der Held von (41, 35) nach unten bis (41, 37) und sieht „Sprechen“. | `sitzkacheln` sperrt die Kachel darüber nicht mehr, wenn ein niedriges Möbel erst auf der Fußkachel beginnt und darunter weiterreicht (`rueckeNachUnten`); Sams Schulstuhl beginnt darüber und sperrt weiter. Dasselbe in pipeline/abenteuer/figurensperre.py. Danach Ansprechprobe: Ward, Kit und Sol „aktion“. | begehbar.test.ts, test_abenteuer_figurensperre.py |

## Weitere Befunde

- **Ward abends auf der Parkbank, Text:** Ihr erstes Gespräch begann dort mit „Eleanor Ward sitzt im
  Sessel am Feuer und liest den Absatz zu Ende.“, und im Alltag bot sie Tee aus der Kanne an. Nach
  dem Tagesablauf sitzt sie von 17 bis 6 Uhr (außer im Schlaf) draußen. Behoben: Dialoge bekommen
  die Karte unter dem Helden als `hierKarte` (regeln/dialogvariablen.ts, variablenAusBesitz; in der
  Simulation besitzvariablen). In summit-city-huette.ink sitzt Ward draußen „auf der Parkbank, ein
  Taschenschach auf den Knien“, und statt des Tees sieht sie der Seilbahn zu. Test:
  dialog/wardort.test.ts. Die übrigen Hüttenszenen (Mama am Kamin, Nadel vom Kaminsims) laufen
  nur, solange Ward Questziel ist (Partie oder Gespräch); dann hält Regel 1 sie in der Hütte.

## Werkzeug

- Ansprechprobe: `PROBE_DING=ward,kit` prüft nur diese Dinge; führt ein Ding von der Karte fort
  (Gondel zur Bergstation), bleiben die übrigen ungeprüft und werden so gemeldet (vorher lief die
  Probe mit den Feldern der alten Karte auf der neuen weiter). Hinweise nach dem Start („Deine
  ersten Münzen“) tippt sie weg, sonst fehlt der Aktionsknopf. `PROBE_FELD=x,y,richtung` setzt den
  Helden; die erste Zeile nennt Startfeld und Aufbaustunde.

## Querformat (24.11.2026, nachmittags)

Erster Lauf (200 Minuten, Stand Akt 4 ab Desert Springs): Er kam nicht über Akt 3 hinaus. Die
Ursache lag im Durchlauf, nicht im Spiel:

- **Wahlen zu früh getippt:** Neue Dialogwahlen nehmen 300 ms lang keinen Tipp an
  (dialog/wahlschutz.ts). Der Lauf wählte schon in dieser Zeit; der Tipp verpuffte, und beim
  zweiten Anlauf galt die Antwort als genommen. Am Viehgitter (S17, Zoe) nahm er so nie „Eine
  Stellung.“ oder „Noch einmal.“, nur „Später.“ und „Nicht jetzt.“. Jetzt wartet der Lauf, bis alle
  Wahlen frei sind (tests/durchlauf/lage.ts `wahlenFrei`, fenster.ts).
- **800-mal zwischen Diner und Desert Springs:** Die Ziele Tafel und Odile wechselten je Ort.
  Highway und Rückweg haben eine Erzählzeile, und Übergänge mit Dialog zählten nie für die
  Kreiserkennung. Jetzt zählen sie, sobald der Held auf der neuen Karte steht
  (tests/durchlauf/weltschritt.ts).

Zweiter Lauf: Dreimal am Viehgitter verloren, Zoe ließ durch („Dreimal ehrlich versucht“).
Abspann nach 47 Minuten. Ein Fund blieb:

| Fund                                                                                                         | Ursache                                                                                                                                                                                                   | Korrektur                                                                                                                                                                                        | Test                         |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| Aufgabenrunde quer (Tafel im Diner, Ward in der Hütte): „Weiter“ am Ende sekundenlang von der Blase verdeckt | Spielfehler. Quer liegen Blasen und Knöpfe gemeinsam in der rechten Spalte. `sperrflaeche` lässt Knöpfe neben dem Brett bewusst aus, damit die Blase am Brett Platz findet; ihnen wich sie gar nicht aus. | Zweiter Schritt in anbindung/brettfrei.ts: Hauptknöpfe neben dem Brett in der Spalte der Blase (`knopfflaeche` in blasenlage.ts) meidet sie wie das Brett, darüber oder darunter, je nach Platz. | anbindung/blasenlage.test.ts |

Dritter Lauf (mit der Korrektur): Abspann nach 60 Minuten, keine Funde. Die Abenteuer-Oberflächentests
liefen parallel; zwei zeitkritische (Musikspuren, Rennen) scheiterten unter der Last und bestanden
einzeln wiederholt.
