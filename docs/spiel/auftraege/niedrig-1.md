# Auftrag niedrig-1: Aufgabenzuordnung je Club auszählen

**Stand:** erledigt (niedrig-1, 07.11.2026)
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

Ergebnis in `docs/spiel/07_Aufgabenzuordnung.md`: je Club Buchübungen (Nummer, Label, Motiv) und
Tabelle Thema/Quelle/S1–S5, dazu eine Lückenliste.

- Die drei Labels in `orte.json` existieren: `ueb:droh-ignorieren` (Nr. 4), `ueb:zaehlen-vorstoss`
  (Nr. 5), `ueb:angriff-zaehlen` (Nr. 7). Keine Korrektur nötig.
- Taktiktrainer kennt kein Thema „Matt in 1/2“; Club 2 bekommt das nur über die Zusatzthemen
  `matt1`, `matt2` (je 50) und `mattbilder` (Taktik und Zusatz).
- Echte Lücken: Club 6 (Struktur nur Buch, fast alles S3, viele Strukturen unter 15) und Club 8
  (Buchendspiele einzeln klein, kaum S1–S2; Lichess nur Bauern-, Turm-, Damen-,
  Leichtfigurenendspiele). Club 1 hat außer `haengend` keine gezählten Trainerdaten.
- Vorschlag (nicht umgesetzt): In Stellungnahme Abschnitt 3 bei Club 2 fehlen Übung 43
  (Erstickungsmatt) und 48 (Damiano-Matt), die auch zu Mattbildern gehören (48 steht bei Club 7).
  `falle.json` hat 137 Aufgaben (17 Buch, 60 `falle`, 60 `geschenk` von Lichess).
