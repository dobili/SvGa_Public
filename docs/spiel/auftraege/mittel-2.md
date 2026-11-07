# Auftrag mittel-2: Regelwerk final

**Stand:** offen (Haupt-Chat, 07.11.2026)
**Zweig:** `abenteuer-regelwerk`, Basis `claude/friendly-shannon-y8bf90`
**Darf ändern:** `docs/spiel/06_Regelwerk.md` (neu), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `cd app && npx prettier --check ../docs/spiel`

## Ziel

Schritt 2 des Projektplans (Dokument 02, Abschnitt 4): ein Dokument mit allen Spielregeln als
Tabellen, so geschrieben, dass sie später direkt in JSON und reine Funktionen übernommen werden
können. Quellen: `01_Konzeptsammlung.md` (Entwurf Regelwerk), `02_…` (Abschnitt 2.7 und 5),
`04_Architektur.md` (Abschnitt 4 Stärkekurve, 5 Zeitbudget), `ENTSCHEIDUNGEN.md` (A2, A5, A6,
A7, B1, B2, C1, C6, C7), die Verträge in `app/src/abenteuer/schnittstelle/` (Typen, an die sich
die Regeln halten müssen) und die Beispiele in `inhalte/abenteuer/`.

## Inhalt von `06_Regelwerk.md`

1. **Spielstärke:** Eingangswertung E (Einfrieren nach 10 Partien), aktuelle Wertung A,
   Zielstärke je Rolle (Tabelle), Umrechnung Ziel-Elo → Stufe je Phase und Fehlerhäufigkeit
   (Formel mit Beispielen für E = 600, 800, 1200), Zustandsfaktoren (abgelenkt 1,3 bis 1,5,
   überheblich nach Niederlage des Lesers: +0,15 je Versuch, höchstens 1,6), Post-Game +300.
2. **Partieformate:** ganze Partie, Stellungsduell (Zugzahl, Mindestvorteil, Quellen der
   Stellungen nach Entscheidung C1), Wiedereinstieg am Kipppunkt (Bedingungen: nach Zug 10,
   Bewertung ±1 Bauer, einmal je Begegnung).
3. **Clubnadeln:** Gold, Silber, Bronze nach Karten und Wiedereinstieg (Tabelle aller Fälle),
   Remis gegen Clubchef = Bronze mit Revanche, Remis auf der Straße = Sieg, Verbesserung durch
   erneute Partie, Punkte für die Liga (Gold 3, Silber 2, Bronze 1; Bronze-Liga ab 8, Silber ab
   16, Gold ab 22 von 24).
4. **Hilfskarten:** die neun Sorten aus `inhalte/abenteuer/karten.json` mit Wirkung, Stufe, Art,
   Zeitpunkt, Erhalt (welche Belohnungen welche Karten geben), Deckgröße 3, Story-Sperren
   (Tiefpunkt, Finale), Mentor-Zug in Akt 3 gesperrt. Vorgabe-Karten: Spiegelung je Farbe.
5. **Aufgabenreihen:** Zeitbudget je Club, Zahl und Schwierigkeit der Aufgaben aus der Wertung,
   Mischung Buchübungen/Trainer, Bestehen ab 70 Prozent, zweite Runde, Zählung in der App
   (Entscheidung A8).
6. **Niederlage und Tempo:** Ablauf nach einer Niederlage (Ambrose zeigt den Fehler, Angebot
   Wiedereinstieg, Gegner wird sichtbar überheblich), was eine verlorene Story-Partie mit festem
   Verlauf (Victor zu Beginn) macht.
7. **Zählen in der App:** welche Partie wofür zählt (Entscheidung A2), was ungewertet ist.
8. **Spielzeit-Richtwerte** je Clubbesuch und je Staffel, als Tabelle zum Nachmessen.
9. **Offene Fragen an den Autor** mit Empfehlung.

Jede Regel bekommt eine Kennung (R1, R2 …), damit Code und Tests sie nennen können.

## Was nicht dazugehört

Kein Code, keine JSON-Dateien; Vorschläge für Änderungen an den Verträgen in den Bericht.

## Bericht

(vom Helfer auszufüllen)
