# `tour/` – App-Tour (R52)

| Datei                   | Aufgabe                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| `touren.ts`             | Alle Touren als Daten: je Schritt Ziel (`data-tour`) und Textschlüssel |
| `tourlogik.ts`          | Rein: Schritt zeigen oder überspringen, Lage der Karte                 |
| `TourEbene.tsx`         | Laufende Tour: Abdunklung, Rahmen, Karte, Tastatur, Fokus              |
| `useZielbeobachtung.ts` | Rechteck des Ziels und zeigbare Schritte je Bildschirmbild             |
| `TourKnopf.tsx`         | Kompass oben rechts (Kopfzeile, Seitenköpfe, Einstellungen)            |
| `TourAngebot.tsx`       | Frage nach dem Rundgang beim ersten Start                              |
| `tourMerker.ts`         | Merker auf dem Gerät: angeboten, Symbol aus, gesehene Touren           |
| `tourStand.ts`          | Welche Tour gerade läuft                                               |
| `haltFokus.ts`          | Tab bleibt im Dialog                                                   |

Eine Tour ergänzen: in `touren.ts` eine Zeile `ziel("kennung", "tour.bildschirm.schritt")`
hinzufügen, am Element `data-tour="kennung"` setzen und den Text in `de.json` und `en.json`
schreiben. Eine neue Tour für einen Bildschirm braucht zusätzlich eine Kennung in `TourKennung`
und einen Fall in `tourFuerAnsicht`. `touren.test.ts` meldet Ziele ohne Element und fehlende Texte.
