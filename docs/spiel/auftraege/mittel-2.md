# Auftrag mittel-2: Regelwerk final

**Stand:** fertig (mittel-2, 07.11.2026)
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

**Fertig:** `docs/spiel/06_Regelwerk.md` mit den Regeln R1 bis R40 in neun Abschnitten wie
beauftragt (Spielstärke, Partieformate, Clubnadeln, Hilfskarten, Aufgabenreihen, Niederlage und
Tempo, Zählen in der App, Spielzeit-Richtwerte, offene Fragen F1 bis F7 mit Empfehlung). Prüfung
`npx prettier --check ../docs/spiel` besteht. Zweig `abenteuer-regelwerk`.

Hinweis zum Start: Die Anweisung im Chat nannte die Datei `mittel-1.md`, mich aber „mittel-2“.
Ich habe `mittel-2.md` bearbeitet (Regelwerk), weil der Name des Helfers die Datei bestimmt
(README der Aufträge). `mittel-1.md` (Story-Bibel) ist unberührt.

**Entscheidungen, die ich getroffen habe (alle im Dokument begründet):**

1. **Eigene Abenteuerwertung A (R2, R38):** Story-Partien zählen nicht für die Elo der App (A2);
   ohne eigene Wertung stiegen Straßengegner bei Kindern, die nur das Abenteuer spielen, nie mit.
   A startet mit der App-Wertung (sonst 600), übernimmt Änderungen der App-Wertung und rechnet
   Story-Partien aus der Grundstellung ohne mittlere oder starke Karte nach der Elo-Formel der App.
2. **Stufe gerundet statt aufgerundet (R6):** Die Formel aus `04_Architektur.md`, Abschnitt 4
   („aufrunden, Häufigkeit 1,4 am unteren bis 0,7 am oberen Rand“) lässt den Gegner am oberen
   Rand stärker spielen als sein Ziel, wenn Stufe s auf 300 · s geeicht ist. Neu: s = Z/300
   gerundet, h₀ = 1,4^(−d/150); Eichpunkt in der Mitte, Ränder bleiben 1,4 und etwa 0,7.
3. **Überheblichkeit aus dem Protokoll gezählt (R9):** Niederlagen in Folge gegen diesen Gegner,
   ohne neues Feld; gilt für Clubchef, Clubmitglied, Turnier; Gesamtfaktor höchstens 2,0.
4. **Sanduhr zählt nicht als Karte** (sonst gäbe sie als „mittel“ Bronze und wäre sinnlos) und
   wird nach der Partie aus dem Besitz gespielt (R25).
5. **Höchstens eine Vorgabe je Partie, keine Remisangebote, Farbe im Clubkampf abwechselnd**
   (R12, R24).
6. **Liga bestimmt die Stärke der Landesmeisterschaft** (R22), Silber = Werte der Architektur,
   Bronze −100, Gold +100.
7. **Erhalt der Karten** (R27) als vollständige Tabelle; starke Karten für Erinnerungen und
   vollständige Nebenquests einer Stadt, nicht für Goldnadeln (wer Gold holt, braucht sie nicht).
8. **Victor zu Beginn** (R33): schlechte Stellung um Zug 12 **und** zwei Dialogvarianten,
   zählt nirgends.

**Vorschläge für gesperrte Dateien (Verträge, Haupt-Chat):**

- **V1** `spielstand.ts`: Felder `wertung: number` (Abenteuerwertung A) und
  `appWertungZuletzt: number | null` (zuletzt gelesene App-Wertung, um Änderungen zu übernehmen),
  dazu `wertungPartien: number` für K = 32/20. Ohne V1 lässt sich R2 nicht umsetzen.
- **V2** `04_Architektur.md`, Abschnitt 4: Umrechnung auf R6 ändern (Runden, Eichpunkt Mitte).
- **V3** `karten.ts`: `Kartensorte.zeitpunkt` um `"nachher"` erweitern (Sanduhr); in
  `karten.json` Sanduhr auf `"nachher"` setzen.
- **V4** `karten.ts`: Kommentar zu `vorgabe.feld` an die Daten anpassen: „Feld aus Sicht eines
  weißen Gegners (f2, g1); bei schwarzem Gegner wird die Reihe gespiegelt“.
- **V5** `spielstand.ts`: Clubnadeln des zweiten Durchlaufs getrennt führen, etwa
  `Clubstand.nadelPostGame: Nadelstufe | null` (R10, R27 Sanduhr).
- **V6** `partie.ts`: im `Partieauftrag` ein optionales Feld `freieKarten?: readonly string[]`
  für Karten ohne Besitz und ohne Verbrauch (Mentor-Zug im Halbfinale, R29).
- **V7** `spielstand.ts`: `spielzeitJeOrt: Readonly<Record<string, number>>`, damit die
  Richtwerte R39 und R40 nachgemessen werden können (`04_Architektur.md`, Abschnitt 11 nennt das
  schon, der Vertrag hat nur die Summe).
- **V8** `gegnerprofil.ts`: `Gegnerzustand` um `ueberheblich: number` (Faktor) ergänzen, damit die
  Anzeige vor der Partie Grund und Faktor getrennt von „abgelenkt“ zeigen kann; oder
  `haeufigkeitsfaktor` als Produkt behalten und nur ein zweites Grund-Feld.
- **V9** `test_abenteuer.py`: Versatzbereiche je Rolle aus R4 als Prüfregel.
- Texte: `zustand.ueberheblich` fehlt in `inhalte/abenteuer/texte/de.json`.

**Offen:** nichts, was den Auftrag blockiert. Fragen F1 bis F7 an den Autor stehen im Dokument,
Abschnitt 9, mit Empfehlung (schon so eingetragen).
