# Auftrag mittel-1: Ink-Dialoge für Maple Falls (Akt 1, Szenen der Story-Bibel)

**Stand:** fertig (Helfer mittel-1, 07.11.2026, zweiter Auftrag)
**Zweig:** dein fester Sitzungszweig (zuletzt `claude/schach-abenteuer-mittel-1-cl431d`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/*.ink` (neu, außer `maple-falls-dachboden.ink`:
nur ergänzen, vorhandene Knoten behalten), `inhalte/abenteuer/quests.json` (nur Quests mit
`ort: "mapleFalls"`), `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel, am Ende anhängen),
`docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py`
(Python-Umgebung: `python3 -m venv .venv && . .venv/bin/activate && pip install -r pipeline/requirements.txt`),
dann in `app/`: `npm ci` (einmal) und `node skripte/baue-abenteuerpaket.mjs` (übersetzt jede
Ink-Datei; ein Ink-Fehler bricht ab), zuletzt `npx prettier --check ../inhalte/abenteuer`.

## Ziel

Alle Dialoge von Maple Falls aus `05_Story_Bibel.md` (Szenen in Maple Falls, Akt 1) als
Ink-Dateien, so wie `inhalte/abenteuer/dialoge/de/maple-falls-dachboden.ink` und
`inhalte/abenteuer/README.md` es vorgeben. Der Prototyp (Schritt 5) spielt heute nur den Dachboden;
mit diesen Dateien wird Maple Falls spielbar, sobald die Spielsysteme (Schritt 8) da sind.

## Vorgaben

1. **Eine Datei je Karte:** `maple-falls-wohnzimmer.ink`, `maple-falls-aussen.ink`,
   `maple-falls-clubraum.ink`, `maple-falls-park.ink`; den Dachboden ergänzen (Szenen nach der
   ersten Partie: Ambrose erklärt den Fingerzeig, Hinweis auf die Schule).
2. **Knoten je Figur und Zustand:** Jede Figur hat einen Einstiegsknoten (wie in `orte.json`,
   Feld `dialog`, etwa `maple-falls-clubraum.coach`), der nach Spielstand verzweigt. Dafür die
   globalen Variablen aus der Bibel benutzen (`VAR`-Zeilen am Dateianfang, gleiche Namen in
   allen Dateien; neue Variablen in den Bericht). Quests warten auf Knoten mit `datei.knoten`;
   diese Knotennamen in `quests.json` eintragen.
3. **Externe Funktionen** nur die sechs aus dem README. `beginnePartie` nur mit Kennungen aus
   `begegnungen.json` (`mapleFalls.ersteLektion`, `mapleFalls.samRevanche`,
   `mapleFalls.clubkampf`); braucht eine Szene eine weitere Begegnung (Straßengegner Jo, Victor),
   in den Bericht schreiben, die Datei ist für dich gesperrt.
4. **Stilregeln** aus der Bibel (Abschnitt Dialog-Stilregeln): höchstens zwei Sätze je Zeile,
   Lesealter 10, Held geschlechtsneutral, Ambroses fünf Regeln, Tags `#sprecher`, `#stimmung`,
   `#klang`, `#pause`. Keine Seitenzahlen, keine Buchzitate über kurze Regelzitate hinaus.
5. **Quests:** Für jede Szene mit Quest einen Eintrag in `quests.json` nach dem Schema
   (`schemas/abenteuer-quests.schema.json`): Schritte mit Ereignis (Dialogknoten, Partie,
   Aufgabenrunde, Ort) und Wirkungen (Karte nach `06_Regelwerk.md` R27, Steckbrief, Zustand, Szene).
   Vorhandene drei Quests dürfen angepasst werden.
6. **Texte:** Namen, Questtitel und Schritttexte als Schlüssel in `texte/de.json` (Muster
   `bereich.name.feld`), nur anhängen.

## Was nicht dazugehört

Cedar Creek (eigener Auftrag), Karten (Tiled), Gegnerprofile, Begegnungen, Code.

## Bericht

**Fertig:** vier neue Ink-Dateien und der ergänzte Dachboden, alle Szenen von Maple Falls aus
`05_Story_Bibel.md` (Szenen 1 bis 13), sechs Quests für Maple Falls in `quests.json`, 24 neue
Schlüssel am Ende von `texte/de.json`. Prüfungen: `pytest pipeline/tests/test_abenteuer.py`
(8 bestanden), `node skripte/baue-abenteuerpaket.mjs` (alle Ink-Dateien übersetzt),
`npx prettier --check ../inhalte/abenteuer` (sauber), dazu Vitest `src/abenteuer` (17 bestanden).
Zusätzlich habe ich jeden Knoten jeder Datei mit inkjs durchgespielt: sieben Spielstände, je vier
Läufe mit zufälligen Wahlen, 1904 Läufe ohne Laufzeitfehler und ohne Sackgasse.

**Dateien und Knoten** (Einstiege fett):

- `maple-falls-wohnzimmer.ink`: **mutter** → ankunft (Szene 1), erster_abend (4), aufbruch (13),
  mutter_alltag.
- `maple-falls-dachboden.ink` (ergänzt, alle alten Knoten unverändert bis auf eine Zeile): neuer
  Verteiler **ambrose** → ambrose_wartet (wie bisher, solange die erste Partie fehlt),
  nach_erster_partie (Szene 3 Nachgespräch: Fingerzeig, „Was hängt?“, Hinweis auf die Schule),
  ambrose_rat (Hinweis auf das nächste Ziel, Erzählungen). Die einzige Änderung im Beispiel:
  In `dachboden_brett` springt der Zweig „Brett schon berührt“ jetzt nach `ambrose` statt
  direkt nach `ambrose_wartet`; der Verteiler leitet ohne gespielte Partie genau dorthin weiter,
  der Prototyp verhält sich also gleich.
- `maple-falls-aussen.ink`: **juno** → juno_frueh, juno_trifft (Szene 5, erster Teil),
  juno_zum_club, juno_alltag; **lily** → lily_fragt, lily_wartet, lily_lektion (Szene 8),
  lily_danke, lily_alltag.
- `maple-falls-clubraum.ink`: **coach** → coach_erstes_treffen (Szene 5), coach_reihe_offen,
  coach_clubkampf, coach_partie, coach_nach_sieg (Szene 11), coach_nach_niederlage, coach_alltag;
  **sam** → sam_erstes_treffen, sam_reihe (Szene 6), sam_klagt, sam_klagt_wieder (Szene 9),
  sam_revanche_angebot, sam_nach_revanche, sam_alltag; **juno** (im Club) → juno_reihe (Szene 6),
  juno_club_alltag; **victor** → victor_trifft, victor_wartet, victor_partie, victor_nachher,
  victor_niederlage, victor_ueberrascht, victor_ambrose (Szene 12), victor_weg.
- `maple-falls-park.ink`: **bibliothekar** → bibliothekar_sucht, bibliothekar_wartet,
  bibliothekar_brief (Szene 7), bibliothekar_alltag; **parkbank** → parkbank_fund,
  parkbank_raetsel; **skater_jo** → jo_erstes_treffen, jo_angebot, jo_duell, jo_nach_sieg,
  jo_nach_niederlage (Szene 10); **bushaltestelle** (Szene 13, zweiter Teil).

**Quests** (`quests.json`, nur `ort: "mapleFalls"`): `mapleFalls.dasBrett` (um Ankunft,
Nachgespräch und Abend erweitert), `mapleFalls.viertesBrett` (Aufgabenreihe, Clubkampf),
`mapleFalls.besserWerden` (Victor, Aufbruch), `mapleFalls.samsDame` (unverändert),
`mapleFalls.verlorenesBrett` (Rätsel in drei Schritten), `mapleFalls.lilysSpringer` (Hilfe).
Karten nach R27: Fingerzeig (Ambrose erwacht), Gefahrenradar (erste Aufgabenreihe Club 1, am
zweiten Block), Mentor-Zug (erste Clubnadel), zweimal Zweite Chance (Sam), Flüstern (Rätsel und
Hilfe), Partiefragment 0 (Abernathy). Der erste Straßensieg (Zweite Chance) und „alle
Nebenquests“ (Springervorgabe) sind Regeln, keine Quests, und stehen deshalb nicht in den Daten.

**Entscheidungen mit Begründung:**

1. **Victor nach R33, nicht nach der Bibel.** Das Regelwerk (mittel-2) legt eine schlechte
   Stellung um Zug 12 mit gesperrten Karten fest; die Bibel hatte eine echte Partie vorgeschlagen.
   Regeln gehören ins Regelwerk, deshalb gilt R33. Damit es ehrlich bleibt, begründet Victor die
   Stellung selbst: Er spielt nicht von vorn gegen Anfänger, sondern gibt eine Trainingsstellung
   mit einer Figur weniger für Schwarz („Halt sie, wenn du kannst“). Ambrose sagt offen, dass sie
   verloren ist. Vorschlag für die Stellung (Spanisch, Tschigorin-Aufbau, Schwarz am Zug, Springer
   a5 fehlt): `r1b2rk1/2q1bppp/p2p1n2/1pp1p3/3PP3/2P2N1P/PPBN1PP1/R1BQR1K1 b - - 2 12`. Legal
   (geprüft mit python-chess); die Bewertung (Ziel −2,5 bis −4) habe ich ohne
   Engine nicht gemessen, bitte mit Tiefe 12 prüfen. Die Bibel (Szene 12) sollte an R33 angepasst
   werden; die Datei ist für mich gesperrt.
2. **Wirkungen stehen in `quests.json`, nicht im Ink.** Ink ruft nur `beginnePartie`,
   `beginneAufgaben` und für Szenen mit Varianten `setzeSzene` auf (erster Schultag, Clubnadel,
   Victor-Niederlage oder -Überraschung). So gibt es keine doppelten Karten. Ausnahme ist das
   vorhandene Beispiel (`gibKarte("fingerzeig")` und die Szene im Dachboden), das ich nicht
   ändern durfte; Fingerzeig ist dauerhaft, ein zweiter Erhalt schadet nach R27 nicht.
3. **Satzlänge:** Zeilen mit vier und mehr Sätzen und lange Zeilen mit drei vollen Sätzen sind
   geteilt. Kurze Fragmente wie „Fast immer.“ zählen nicht als eigener Satz, wie im Beispiel des
   Haupt-Chats („Ein Meister. Einst.“). Keine Zeile ist länger als etwa 110 Zeichen.
4. **Mr. Abernathy siezt den Helden** als altmodischer Bibliothekar; das ist geschlechtsneutral
   und passt zu ihm. Alle anderen duzen.
5. **Juno hat zwei Einstiege** (draußen und im Club), je Datei einer, weil eine Figur in
   `orte.json` nur einen Dialog hat (siehe Vorschlag 3).

**Neue Variablen** (gleiche Namen in allen Dateien, jede Datei deklariert die, die sie braucht).
Setzt Ink selbst: `ankunftGesehen`, `ersterAbendGesehen`, `aufbruchGesehen`,
`ersteLektionBesprochen`, `junoGetroffen`, `clubBeigetreten`, `lilyGetroffen`, `lilyGeholfen`,
`samGetroffen`, `samKlagt`, `samVersoehnt`, `clubkampfBesprochen` (Zahl: Nadel, die der Coach
schon gewürdigt hat), `victorGesehen`, `victorUeberrascht` (0 oder 1, R33), `kenntHale`,
`abernathyGetroffen`, `parkbankBrettGefunden`, `abernathyBrief`, `joGetroffen`.
Soll die Hülle setzen (**Vorschlag V-Dialog**, siehe unten): `ausgangErsteLektion`,
`ausgangSamRevanche`, `ausgangClubkampf`, `ausgangVictor`, `ausgangSkaterJo` (jeweils "",
"sieg", "remis", "niederlage"), `reiheSamBestanden`, `reiheJunoBestanden`,
`todsuendenBestanden`, `springerLilyBestanden`, `parkbankRaetselBestanden` (wahr nach bestandener
Runde), `nadelMapleFalls` (0 keine, 1 Bronze, 2 Silber, 3 Gold).

**Vorschläge für gesperrte Dateien (Haupt-Chat):**

1. **V-Dialog (Hülle, Schritt 8):** Ink kennt den Spielstand nur über Dialogvariablen. Nach einer
   Begegnung schreibt die Hülle `ausgang<Name>` (Name der Begegnung nach dem Punkt, erster
   Buchstabe groß: `mapleFalls.clubkampf` → `ausgangClubkampf`), nach einer bestandenen Runde
   `<Name>Bestanden` (`mapleFalls.reiheSam` → `reiheSamBestanden`), nach einer Clubnadel
   `nadel<Ort>` (`nadelMapleFalls`) in `dialogvariablen`. Danach öffnet sie wieder den
   Einstiegsknoten der Figur, mit der die Partie oder Runde begann; der verzweigt dann ins
   Nachgespräch. `Geschichte.setzeVariable` ignoriert unbekannte Namen schon, das passt. Für Ambrose
   nach der ersten Lektion: Einstieg `maple-falls-dachboden.ambrose`.
2. **`begegnungen.json`:** `mapleFalls.victor` (Gegner `mapleFalls.victor`, Farbe Weiß für Victor,
   Startstellung FEN oben, `kartenErlaubt: false`, R33) und `mapleFalls.skaterJo` (Stellungsduell
   nach C1, Stellung aus Kapitel 1 mit leichtem Vorteil). Danach in `victor_partie` und
   `jo_duell` die vorbereitete Zeile `~ beginnePartie(…)` einkommentieren (bei Jo auch
   `EXTERNAL beginnePartie(begegnung)` oben). Die Quest `mapleFalls.besserWerden` wartet schon auf
   `mapleFalls.victor`.
3. **`orte.json`:** Figuren `mapleFalls.juno` (Dialog `maple-falls-aussen.juno`; im Clubraum
   `maple-falls-clubraum.juno`, also entweder zwei Figureneinträge oder ein Dialog je Karte),
   `mapleFalls.lily` (`maple-falls-aussen.lily`), `mapleFalls.abernathy`
   (`maple-falls-park.bibliothekar`), `mapleFalls.victor` und `mapleFalls.grahamHale`
   (`maple-falls-clubraum.victor`, nur sichtbar ab Clubnadel und bis `kenntHale`); Auslöser
   `bushaltestelle` (gegenstand, `maple-falls-park.bushaltestelle`); der Auslöser `brett` sollte
   auf `maple-falls-dachboden.ambrose` zeigen, sobald V-Dialog steht (heute
   `dachboden_brett`, das funktioniert auch, nur mit dem Fund-Text vorweg). Juno als Clubmitglied
   in `club.mitglieder` braucht nach dem Test ein Gegnerprofil (schwach, `aktuell − 150`,
   fröhlich).
4. **Aufgabenrunden** ohne Definition bisher: `mapleFalls.reiheSam` (Zählen, hängende Figuren,
   Buchübungen `droh-ignorieren`, `zaehlen-vorstoss`, `angriff-zaehlen`), `mapleFalls.reiheJuno`
   (Notation aus Kapitel 0, Matt in eins), `mapleFalls.todsuenden` (Kapitel 1, Abschnitt 1.2),
   `mapleFalls.springerLily` (drei bis vier Springerzüge, Kapitel 0), `mapleFalls.parkbankRaetsel`
   (eine Zählaufgabe „Weiß gewinnt eine Figur“, Kapitel 1, Abschnitt 1.4). Wo sie leben sollen
   (eigene Datei oder `orte.json`), entscheidet der Haupt-Chat.
5. **Szenenkennungen** aus Ink und Quests, die der Spielstand kennen sollte: `akt1.ankunft`,
   `akt1.ambroseErwacht`, `akt1.erstePartie`, `akt1.ersterAbend`, `akt1.ersterSchultag`,
   `akt1.clubnadelMapleFalls`, `akt1.victorTrifft`, `akt1.victorNiederlage`,
   `akt1.victorUeberrascht`, `akt1.aufbruch`.
6. **Bibel, Szene 12** an R33 anpassen (Trainingsstellung statt echter Partie), damit beide
   Dokumente gleich sagen.

**Offene Fragen:** keine, die blockieren. Zu prüfen bleibt die Bewertung der vorgeschlagenen
Victor-Stellung mit der Engine.
