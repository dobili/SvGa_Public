# Aufträge an die Helfer-Chats des Schach-Abenteuers

Der Haupt-Chat (Fable) baut das Fundament und verteilt abgegrenzte Arbeit auf Helfer-Chats
(Opus). Jeder Helfer hat eine Auftragsdatei in diesem Ordner, benannt nach seinem Aufwand und
seiner Nummer: `mittel-1.md`, `mittel-2.md`, `niedrig-1.md` … Der Helfer liest nur seine Datei.

## Ablauf für einen Helfer

1. `CLAUDE.md` lesen (gilt vollständig, auch das Verbot und die Regeln zu Kommentaren, Tests und
   Deutsch), dann `docs/spiel/01_Konzeptsammlung.md`, `02_Pruefung_Vorschlaege_Projektplan.md`,
   `03_Technische_Stellungnahme.md`, `04_Architektur.md`, `ENTSCHEIDUNGEN.md`, zuletzt die eigene
   Auftragsdatei.
2. Steht in der Auftragsdatei unter **Stand** „kein Auftrag“: nichts tun, dem Autor melden und
   warten.
3. Sonst: auf dem in der Datei genannten Zweig arbeiten (`git checkout -b <zweig> origin/<basis>`
   oder den Zweig holen, wenn er schon existiert). Nie auf `main` oder auf dem Zweig des
   Haupt-Chats pushen.
4. Nur die Dateien anfassen, die unter **Darf ändern** stehen. Alles andere ist gesperrt; nötige
   Änderungen dort als Vorschlag in den Bericht schreiben.
5. Vor jedem Push: Prüfungen laut Auftrag (Dokumente: `npx prettier --check` im Ordner `app/`;
   Code: `npm run pruefen` in `app/`; Pipeline: `python -m pytest pipeline/tests`).
6. Kleine Commits, deutsche Commit-Texte mit dem Warum, spätestens alle 30 Minuten pushen.
7. Am Ende den Abschnitt **Bericht** der Auftragsdatei ausfüllen (was fertig ist, was offen ist,
   Fragen, Vorschläge für gesperrte Dateien), **Stand** auf „fertig“ setzen, committen, pushen,
   dem Autor melden. Danach warten; der Haupt-Chat führt den Zweig zusammen und schreibt den
   nächsten Auftrag in dieselbe Datei.
8. Bei Unklarheit, die den Auftrag blockiert: Frage in den Bericht, Stand „Frage“, pushen,
   dem Autor melden. Nicht raten, nicht den Auftrag erweitern.

## Regeln für alle Helfer

- Keine Namen realer Produkte im Spiel (Pokémon, Hikaru no Go, reale Großmeister außer als
  historische Figuren im Hintergrund, Entscheidung in Dokument 02).
- Keine Buchtexte über kurze Zitate mit Fundstelle hinaus; keine Seitenzahlen, nur Abschnitte und
  Abbildungsnummern.
- Alle Texte für die Oberfläche kommen in Lokalisierungsdateien (`inhalte/abenteuer/texte/de.json`
  für das Spiel), nie in Code.
- Dialoge geschlechtsneutral für den Helden schreiben (Name wählbar, Entscheidung Dokument 02).
- Alles auf Deutsch.

## Aufwand der Helfer

- **niedrig:** Fleißarbeit nach klarer Vorgabe: Tabellen auszählen, Listen prüfen, Lizenzeinträge,
  Formatierung, Karten aus Bausteinen nach Vorlage, Tests nach Muster.
- **mittel:** Inhalte mit Urteil: Dialoge, Quests, Gegnerprofile, Dokumente wie Story-Bibel und
  Regelwerk, kleinere Code-Bausteine nach Vertrag mit Tests.
- Was Architektur, Verträge in `app/src/abenteuer/schnittstelle/` oder die Einhängepunkte in der
  App berührt, bleibt beim Haupt-Chat.
