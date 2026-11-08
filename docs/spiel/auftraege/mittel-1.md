# Auftrag mittel-1: Dialoge und Quests für Weg 5 und Port Delacroix

**Stand:** fertig (Helfer mittel-1, 08.11.2026, fünfzehnter Auftrag; Weg 6 und Desert Springs folgen in einem zweiten Push)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/weg-silicon-delacroix.ink`, `port-delacroix-*.ink` (neu),
`inhalte/abenteuer/quests.json`, `inhalte/abenteuer/runden.json`, `inhalte/abenteuer/texte/de.json`
(nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`

## Ziel

Wie mittel-2 für Silicon Bay schreibst du die Dialoge und Quests für Weg 5 und Port Delacroix
(Szenen der Bibel unter „Weg 5 und Port Delacroix“), danach, falls Zeit bleibt, Weg 6 und Desert
Springs in einem zweiten Push. Port Delacroix: Clubkampf ohne Ambrose (R28), Ambroses Geburtsort.

## Vorgaben

1. Die Knoten, auf die `orte.json` verweist, stehen im Bericht des vierzehnten Auftrags von
   mittel-1 in `docs/spiel/auftraege/mittel-1.md` (Abschnitt „Für die Dialoge“). Jede Ink-Datei
   mit Dateikopf wie die vorhandenen (Einstiege, Variablen, EXTERNAL nur was gebraucht wird).
2. Szenen nach Abschnitt 20 der Story-Bibel, Stilregeln aus Abschnitt 5; Partien über
   `beginnePartie` mit den Begegnungen aus `begegnungen.json`, Runden über `beginneAufgaben`,
   Karten über `gibKarte`, Funde über `gibFund`, Weiterreise mit `reise`.
3. Quests deiner Szenen in `quests.json` (Hauptquest der Stadt und Nebenquests), Runden in
   `runden.json`, neue Texte in `texte/de.json`. Hängt bitte neue Einträge jeweils in einem eigenen
   Block hinter die Einträge von Akt 2; der Haupt-Chat führt die Arbeit beider Helfer zusammen.
4. Prüfung mit der Simulation wie bei der Limo-Quest: Jede Hauptquest muss durchspielbar sein.

## Bericht

**Erledigt (erster Push: Weg 5 und Port Delacroix).**

- Fünf Ink-Dateien: `weg-silicon-delacroix.ink` (Szene 62: Schiffskoch Mr. Ruiz mit Uhr, Mr. Guidry
  mit Weisheit Kapitel 5, Rätseltafel, Funde Flaschenpost und Muschel, Mama an Bord),
  `port-delacroix-aussen.ink` (Ankunft, Bretter sammeln an vier Häusern, Batiste, Mrs. Arceneaux,
  Wüstenzug), `port-delacroix-turnhalle.ink` (Szene 63 Vorwurf, Reihen bei Remy und Lou, Szene 67
  Clubkampf ohne Karten, Szene 69 Simultan mit Remys Entschuldigung), `port-delacroix-werkstatt.ink`
  (Szene 66 Flashback an der Werkbank, Szene 68 Nachfahren mit Foto und Céleste),
  `port-delacroix-musikhaus.ink` (Szene 70 Das Schild). Alle Knoten aus `orte.json` sind vorhanden.
- Fünf Runden in `runden.json`: `wegSiliconDelacroix.tafel` (3 Aufgaben), `portDelacroix.reiheRemy`
  (Bauernstrukturen), `portDelacroix.reiheLou` (Pläne, Läufer), `portDelacroix.simultan` (3 Aufgaben
  Doppelangriff und Fesselung, Kinder der Stadt), `portDelacroix.flashbackWerkstatt` (Zugraten
  `klassik-unsterbliche` ab Zug 1 mit Weiß).
- Fünf Quests in `quests.json`: Hauptquest `portDelacroix.tiefpunkt` (Vorwurf, Remy, Lou, Clubkampf
  mit Szene `akt3.clubnadelPortDelacroix` und Mentor-Zug, Handschlag bei Miss Odile), Nebenquests
  `portDelacroix.wiederaufbau` (hilfe, vier Schritte über drei Besuche, 20 Münzen, Springervorgabe),
  `portDelacroix.nachfahren` (begegnung, Partie gegen Céleste bei jedem Ausgang, Szene
  `akt3.nachfahren`), `portDelacroix.flashbackWerkstatt` (Fragment 5, Szene
  `akt3.flashbackWerkstatt`), `wegSiliconDelacroix.tafelSalon` (raetsel). 20 neue Textschlüssel.
- Prüfungen: Simulation des ganzen Wegs mit Abbruch, Niederlage und Sieg im Clubkampf und
  Niederlage gegen Céleste: alle fünf Quests fertig, keine Sackgasse. Zufallsdurchläufe aller Knoten
  ohne Fehler, keine Zeile über zwei Sätze. pytest 385 bestanden, 85 übersprungen; Abenteuerpaket
  baut. `npm run pruefen`: 2408 von 2409 bestanden. **Ein Test schlägt fehl, bitte im Haupt-Chat
  nachziehen:** `app/src/abenteuer/anbindung/erinnerung.test.ts`, Zeile 20, zählt die Erinnerungen
  in `runden.json` fest mit `toBe(3)`; mit dem Werkstatt-Flashback sind es 4. Mit `toBe(4)` bestehen
  beide Tests der Datei (lokal geprüft). Die Datei gehört nicht zu meinen erlaubten Dateien, deshalb
  habe ich sie nicht geändert.

**Entscheidungen.**

1. _Ambroses Schweigen._ Nach dem Vorwurf hat Ambrose je Szene höchstens einen Satz („Spiel deine
   Partie.“ vor dem Clubkampf, „Hier. Hier war es.“ an der Werkbank, „Das bin ich.“ beim Foto), bis
   die Partie gegen Céleste `ambroseSprichtWieder` setzt. Die Variable setzt der Dialog nach der
   Partie, nicht die Hülle; die Quest wartet auf diesen Knoten.
2. _Vorwurf beim ersten Ansprechen._ Wer in der Turnhalle Odile, Remy oder Lou anspricht, erlebt
   zuerst den Vorwurf. Die Hauptquest beginnt beim Betreten der Turnhalle (Start und erster Schritt
   dürfen nicht gleich sein).
3. _Reihenfolge._ Remy vor Lou vor Miss Odile, wie in den anderen Clubs. Die Nachfahren und der
   Flashback setzen den Vorwurf voraus (sonst bräche Ambrose ein Schweigen, das es noch nicht gibt);
   vorher stellt sich Henri nur vor.
4. _Wiederaufbau mit vier Schritten._ Bretter, Simultan, Dank bei Odile (mit Remys Entschuldigung
   und der Karte Schutzengel), Schild. Das Schild hängt erst, wenn `simultanGedankt` und
   `nadelDesertSprings > 0` gelten; so kann kein Schritt übersprungen werden. Die 30 Münzen der
   Simultan gehen laut Bibel in die Kasse; deshalb keine Münzen für den Helden.
5. _Flashback ohne Sepia-Karte._ `orte.json` durfte ich nicht ändern; der Flashback läuft als
   Zugraten an der Werkbank, Teil 1 (1840) wird erzählt. Das Zugraten-Format kennt kein Endzug; die
   Bibel will Zug 1 bis 11. Vorschlag: Feld `bisZug` im Erinnerungsformat oder eine eigene
   Erinnerungskarte `flashback.werkstatt`.
6. _Geburtsort._ Ambrose sagt bei der Ankunft, er sei hier geboren, nicht in New Orleans; das folgt
   der Zeitlinie 1831 und der Empfehlung im Bibelbericht.

**Fehlt in anderen Dateien (bitte nachtragen, die Aufrufe stehen als Kommentar bereit).**

- `karten.json`: `pokerface` (Batiste, erster Sieg; die Zeile „Mach ein Gesicht wie das Wasser“ steht
  schon in `batiste_nach_sieg`) und `schutzengel` (`port-delacroix-turnhalle.odile_nach_simultan`).
- `funde.json`: `flaschenpost`, `muschelMitLoch` (Weg 5), `erstesBrettMusikhaus`
  (`port-delacroix-musikhaus.schild_aufhaengen`); das Trompetenmundstück aus der Fundtabelle hat noch
  keinen Auslöser in `orte.json`.
- Laden bei Mrs. Arceneaux: noch kein Laden, sie spricht nur.
- Mentor-Zug aus dem Clubkampf: Die Bibel will ihn erst nach der Versöhnung spielbar (R29); die
  Sperre gehört in die Hülle.
