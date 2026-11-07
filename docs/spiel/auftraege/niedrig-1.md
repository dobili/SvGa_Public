# Auftrag niedrig-1: Aufgabenzuordnung je Club auszählen

**Stand:** offen (Haupt-Chat, 07.11.2026)
**Zweig:** `abenteuer-aufgabenzuordnung`, Basis `claude/friendly-shannon-y8bf90`
**Darf ändern:** `docs/spiel/07_Aufgabenzuordnung.md` (neu), `docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** `cd app && npx prettier --check ../docs/spiel`

## Ziel

Für jeden der acht Clubs (Zuordnung in `03_Technische_Stellungnahme.md`, Abschnitt 3) eine
belastbare Liste, welche Aufgaben die App dafür schon hat. Das Ergebnis füllt später
`orte.json` (Feld `club.aufgaben`) und zeigt, wo Aufgaben fehlen.

## Vorgehen

1. Buchübungen: `app/public/daten/de/a1/kap00.json` bis `kap12.json`, Schlüssel `uebungen`
   (Felder `id`, `nummer`, `kapitel`, `abbildungen`, `erklaerung.motiv`). Je Club die passenden
   Labels (`ueb:…`) mit Nummer und Motiv auflisten.
2. Trainer-Aufgaben: `inhalte/de/trainer/taktik.json`, `endspiel.json`, `falle.json`,
   `struktur.json` (Schemas in `schemas/trainer-*.schema.json`) und
   `app/public/daten/zusatzaufgaben.json` (Themen in `app/src/training/zusatzaufgaben.ts`,
   `ZUSATZTHEMEN`). Je Club und Thema die Anzahl je Schwierigkeit 1 bis 5 auszählen (kleines
   Python-Skript mit `-I`, nicht ins Repository; nur die Tabellen ins Dokument).
3. Für jeden Club eine Tabelle: Thema, Quelle, Anzahl je Schwierigkeit, Kennungen der Themen
   so, wie `app/src/training/taktiktrainer.ts` (`MOTIVE`, `TAKTIKTHEMEN`) und die Trainer sie
   erwarten.
4. Lücken benennen: Themen mit weniger als 15 Aufgaben oder ohne Schwierigkeit 1–2 (für
   Einsteiger), mit Vorschlag, woher Nachschub käme (Lichess-Themen, Buchabbildungen).
5. Prüfen, ob die drei Beispiel-Labels in `inhalte/abenteuer/orte.json` (`ueb:droh-ignorieren`,
   `ueb:zaehlen-vorstoss`, `ueb:angriff-zaehlen`) existieren; wenn nicht, die richtigen Labels
   im Bericht nennen (die Datei selbst ist gesperrt).

## Was nicht dazugehört

Keine Änderung an Daten oder Code; keine neuen Aufgaben erfinden.

## Bericht

(vom Helfer auszufüllen)
