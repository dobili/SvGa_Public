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
