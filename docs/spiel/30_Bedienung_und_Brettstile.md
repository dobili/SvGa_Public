# 30 Bedienung mit dem Daumen, Querformat, Farben und Brettstile

Stand 14.11.2026. Wünsche des Autors vom selben Tag. Nach Regel 9 gilt alles als geplant und wird
umgesetzt; Widerspruch genügt.

## 1. Grundsatz: alles mit dem Daumen

Das Handy liegt in einer Hand (Hochformat) oder in beiden Händen (Querformat). Was man antippen
muss, liegt dort, wo der Daumen ohnehin ist. Den Zeigefinger braucht man nur am Brett, wenn man
Figuren zieht; auch dort liegen die Knöpfe in Daumennähe.

Daumenzonen:

- **Hochformat:** das untere Drittel des Bildschirms, bei der rechten Hand rechts unten am besten.
  Oben nur, was man liest (Kopf mit Porträt, Ortsname, Meldungen).
- **Querformat:** die linke und die rechte Bildschirmkante, jeweils das mittlere und untere
  Drittel. Die Mitte ist Spielfläche.

## 2. Hochformat

- **Oberwelt:** Steuerkreuz unten, Aktionsknopf („Sprechen“, „Ansehen“) daneben. In den
  Einstellungen des Spiels gibt es „Steuerkreuz rechts“ (Vorgabe, Einhand mit rechts) und
  „Steuerkreuz links“; der Aktionsknopf liegt jeweils auf der anderen Seite. Menü, Tagebuch und
  Reisen rücken von oben nach unten in eine schmale Leiste über dem Steuerkreuz.
- **Dialog:** Fenster unten (wie schon), Antwortwahlen als große Knöpfe am unteren Rand, „Weiter“
  ganz unten auf der Seite des Aktionsknopfs. Antippen des Textfensters geht auch weiter.
- **Partie und Rätsel:** Kopf mit Porträt oben, Brett in der Mitte, darunter Sprechblase,
  Kartenfächer und eine Zeile mit den Knöpfen („Ambrose fragen“, „Aufgeben“, „Weiter“). Kein
  Knopf über dem Brett.

## 3. Querformat

- **Oberwelt:** Die Welt füllt den Bildschirm. Das Steuerkreuz liegt links unten, halb
  durchsichtig, über der Welt. Rechts unten liegt der Aktionsknopf, darüber Menü, Tagebuch und
  Reisen als runde Knöpfe in einer Spalte.
- **Dialog:** Porträt links, Textfenster unten über zwei Drittel der Breite; Wahlen und „Weiter“
  rechts in einer Spalte, im Daumenbereich der rechten Hand.
- **Partie:** Brett links in voller Höhe. Rechts eine Spalte: oben Porträt mit Name und Uhr des
  Gegners, darunter die Sprechblase, dann eigene Uhr, Kartenfächer (senkrecht wischbar) und unten
  die Knöpfe. So zieht die linke Hand am Brett, die rechte spielt Karten und tippt Knöpfe.
- **Rätsel:** wie die Partie; Aufgabe, Antwortknöpfe und „Weiter“ in der rechten Spalte.
- **Wechsel:** Drehen des Geräts mitten im Spiel ist erlaubt; nichts geht verloren, die Ansicht
  baut sich neu.

## 4. Ein Farbsystem für alles

Die Schachansichten übernehmen das Farbsystem des Spiels, nicht das der App:

| Rolle        | Farbe             | Verwendung                                   |
| ------------ | ----------------- | -------------------------------------------- |
| Grund        | Navy              | Hintergrund der Hülle, Uhren, Kopf           |
| Fläche       | Creme (Pergament) | Dialogfenster, Karten, Rätseltext            |
| Akzent       | Gold              | Hauptknopf, eigene Uhr, Hervorhebung, Nadeln |
| Stufe leicht | Grün              | Karten, richtige Antwort                     |
| Stufe mittel | Blau              | Karten, Hinweis                              |
| Warnung      | gedämpftes Rot    | falsche Antwort, Zeitnot, Aufgeben-Nachfrage |

- Knöpfe bekommen den Pixelrahmen des Spiels statt der runden App-Knöpfe; der Hauptknopf ist Gold
  auf Navy.
- Überschriften in einer Pixelschrift (Pixelify Sans, SIL Open Font License, im Paket mitgeliefert,
  damit es offline bleibt); Fließtext bleibt in der gut lesbaren Schrift der App mit der
  Schriftgröße des Lesers.
- Rätsel verlieren die weiße Trainerkarte: Aufgabe auf Pergament, Rückmeldung mit Ambroses Porträt
  in der Sprechblase statt grün-roter Kästen, Fortschritt als kleine Reihe von Figuren statt Balken.
- Die Ergebnisblende ist eine Karte des Spiels (Pergament, Pixelrahmen, Porträt des Gegners in der
  passenden Stimmung).

## 5. Brettstile je Ort und Gegner

Das Brett zeigt, wo man ist und gegen wen man spielt. Jeder Ort bekommt einen Stil, einzelne
Gegner dürfen ihn ändern (Feld `brett` in `begegnungen.json`, Vorgabe aus `orte.json`).

| Ort oder Lage           | Brett                         | Figuren        |
| ----------------------- | ----------------------------- | -------------- |
| Dachboden (Ambrose)     | altes Holzbrett, warm         | Pixel, Holz    |
| Maple Falls, Schulclub  | Turnier-Vinyl grün und weiß   | Pixel, Plastik |
| Diner, Straßengegner    | abgegriffenes Holz            | Pixel, Holz    |
| Cedar Creek, Bibliothek | Intarsie Ahorn                | Pixel, Holz    |
| Riverton, Park          | Steintisch grau               | Pixel, Stein   |
| Ironwood                | Stahlplatten, blau angelaufen | Pixel, Metall  |
| Silicon Bay, Konzern    | Glas, kühles Weiß und Cyan    | Pixel, glatt   |
| Port Delacroix          | verwittertes Holz, Salzspuren | Pixel, Holz    |
| Desert Springs          | Sandstein                     | Pixel, Ton     |
| Summit City             | Schiefer                      | Pixel, Stein   |
| Capital Arena           | Turnierbrett, edel            | Pixel, poliert |
| Erinnerungen 1857/1858  | Sepia-Holz                    | Pixel, Sepia   |

- **Pixelfiguren:** ein eigener Satz im Pixelstil des Spiels, abgeleitet vom gemeinfreien Satz
  „Kiefer & Kirsche“ (RhosGFX, CC0) auf ein grobes Raster gerechnet und von Hand nachgebessert;
  Farbvarianten je Material als Tönung, nicht als neue Zeichnung.
- **Bretter:** als Farbpaare mit feiner Pixelstruktur gezeichnet (kein Bild nötig), Rand im
  Pixelrahmen; die drei Materialbretter der App bleiben für besondere Orte.
- **Lesbarkeit:** Markierungen (letzter Zug, Pfeile, Karten wie Fingerzeig) bekommen je Stil eine
  Farbe mit genug Abstand; Blindschach bleibt wie es ist.
- In der App selbst ändert sich nichts; die Wahl des Lesers für Brett und Figuren gilt dort weiter.

## 6. Reihenfolge

1. Farbsystem und Knöpfe in der Hülle (wirkt überall, kleiner Umbau).
2. Hochformat nach Daumenzonen, Einstellung „Steuerkreuz links/rechts“.
3. Querformat für Oberwelt, Dialog, Partie und Rätsel.
4. Pixelfiguren und Brettstile je Ort.
5. Rätsel ohne Trainerkarte (nach den Anmerkungen des Autors zur Vorschau).
