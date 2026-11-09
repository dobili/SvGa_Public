# Ortsdokumente

Je Ort ein Dokument, bevor Karten gebaut werden (Wunsch des Autors, 9.11.2026: erst eine
ausführliche Beschreibung, damit Karten nicht nur einzeln gut aussehen, sondern zusammenpassen).

Jedes Dokument hat vier Teile:

1. **Ortsplan:** Skizze aller Karten des Ortes mit Himmelsrichtungen (Norden oben), Lage und Maße der
   Gebäude außen und innen, Tabelle aller Übergänge mit Auslöser und Feld auf beiden Seiten.
2. **Ortsbild:** erzählende Beschreibung wie in einem Roman: Licht, Geräusche, Gerüche, Geschichte,
   Bewohner, Spuren von Leben.
3. **Abgleich mit der Geschichte:** was die Szenen verlangen (Figuren, Auslöser, Gegenstände,
   Belebung) und je Element des Ortsbilds: bleibt, ändert sich oder entfällt, mit Grund.
4. **Bühnenbilder:** je Karte Größe, Wände, Türen, Fenster, Böden, Laufwege, Zonen und eine
   Inventarliste (Gegenstand, Feld, Ausrichtung, Material, Stil, Zustand, Zweck). Daraus entsteht
   die Szene für den Kartenbauer (`inhalte/abenteuer/szenen/`).

Regeln für alle Karten stehen in `docs/spiel/KARTENREGELN.md`, die Eigenschaften je Ort in
`inhalte/abenteuer/ortsprofile.json`. Die Übergänge prüft `pipeline/abenteuer/uebergaenge.py`.

## Große Außenkarten (Städte und Wege)

Ergänzung (9.11.2026, nach dem Maßstab in `KARTENREGELN.md`, Abschnitt 7a). Eine Außenkarte, die
größer als drei bis vier Bildschirme ist, braucht im Bühnenbild zusätzlich:

1. **Abschnitte von etwa Bildschirmgröße:** Die Karte wird in Abschnitte von etwa 8 × 15 Kacheln
   (Hochformat) gegliedert, mit Namen und Feldbereich, zum Beispiel „A1 Ortseingang (0–15, 0–20)“.
   Die Skizze zeigt die Abschnitte als Raster.
2. **Je Abschnitt ein Thema und etwas zum Entdecken:** ein Satz, was dort ist (Feldrand mit Traktor,
   Bachufer mit Steg, Marktplatz), und mindestens eine Sache zum Ansehen oder Mitnehmen (Fund,
   Statist, Tier, Schild, Aussicht). Benachbarte Abschnitte haben verschiedene Themen; dasselbe Bild
   wiederholt sich nicht über mehrere Abschnitte.
3. **Wegeführung:** Der Hauptweg verläuft mit Kurven und Richtungswechseln, nicht als gerader Flur;
   die Zahl der Abzweigungen nach Regel 7a.2.3, jede mit einem Ziel. Die Skizze zeigt Hauptweg und
   Abzweige mit Breite in Kacheln.
4. **Sichtachsen:** Wo der Blick an einem Ziel hängen bleiben soll (Bibliothek am Ende der Straße,
   Leuchtturm hinter der Kurve, Brücke über dem Bach), steht es so, dass man es vom Weg aus schon einen
   Bildschirm vorher sieht. Das Bühnenbild nennt je Sichtachse Standort und Ziel.
5. **Ränder:** Was am Kartenrand liegt (Feld, Wald, Wasser, Häuserzeile) und warum man dort nicht
   weiterkommt; nur Übergänge öffnen den Rand. Große Gewässer und Felder reichen bis zum Rand
   (Regeln 6.3, 6.4), Wald schließt dicht ab (Regel 9.8.1).
6. **Laufzeit:** gemessene Länge des Hauptwegs in Kacheln und die Zeit bei 3,5 Kacheln je Sekunde,
   im Rahmen der Tabelle 7a.2.
