# Codeführer: Paket und Daten

Das Spiel kommt nicht mit der App, sondern als Zusatzpaket, das der Leser auf Wunsch lädt.

## Vom Quelltext zum Paket

1. **Quellen** in `inhalte/abenteuer/`: JSON-Verzeichnisse (Gegner, Karten, Quests, Orte,
   Begegnungen, Funde, Läden, Texte), Ink-Dialoge, Szenen und Tiled-Karten. Verträge in
   `schemas/abenteuer-*.schema.json`; `app/skripte/erzeuge-typen.mjs` macht daraus Typen.
2. **Private Grafik**: `app/skripte/hole-privatgrafik.mjs` holt beim Bau Grafik, Porträts und Ton
   aus dem privaten Repository (nur mit Zugangsschlüssel in der Bauumgebung). Ohne sie nimmt der
   Paketbau eigene Platzhalter.
3. **Paketbau**: `app/skripte/baue-abenteuerpaket.mjs` (Teil von `npm run vorbereiten`) kopiert die
   Daten, übersetzt die Ink-Dialoge, legt Möbel zusammen, wandelt Bilder nach WebP und schreibt
   `paket.json` mit Version, Dateien und Prüfsummen nach `app/public/abenteuer/` (erzeugt, nicht
   im Repository).

## In der App

- **`paket/paketlader.ts`**: lädt, hält vor, liest und löscht das Paket (`ladePaket`,
  `ladeNach`, `liesPaketdatei`, `liesPaketJson`, `loeschePaket`); Vertrag in
  `schnittstelle/paket.ts`. Hilfen (Zeitlimit, Prüfsumme, begrenzt gleichzeitige Abrufe) in
  `paket/ladehilfen.ts`.
- **`paket/aktton.ts`**: Ton gehört nicht zum Grundpaket und lädt im Hintergrund je Akt nach.
- **`daten/laden.ts`**: liest die Spieldaten (Gegner, Karten, Quests, Orte, Begegnungen) aus dem
  Paket und hält sie vor.
- **`modul/abenteuer.tsx`**: Einstieg des Bausteins, den die App erst auf Wunsch lädt; die Grenze
  zwischen App und Spiel beschreibt `schnittstelle/modul.ts` (Dienste der App, Ansichten des
  Spiels).
- **`texte/texte.ts`**: Spieltexte je Sprache, getrennt von den Texten der App;
  `texte/uebersetzung.ts` prüft eine Übersetzung gegen die deutsche Quelle.

## Schnittstellen zur App

`schnittstelle/` enthält nur Verträge: Partieauftrag und Partieergebnis (`partie.ts`),
Aufgabenrunden (`aufgaben.ts`), Gegnerprofil, Hilfskarten, Spielstand, Fehler mit Textschlüssel
und Tausch per QR-Code. `anbindung/` setzt sie mit den Teilen der App um (Partie in der
Spielhülle, Aufgabenrunde, Kartenleiste, Tischgespräch).
