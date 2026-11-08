# Auftrag mittel-1: Ink-Dialoge für Cedar Creek (Akt 1, Szenen 14 bis 23)

**Stand:** fertig (Helfer mittel-1, 08.11.2026, dritter Auftrag)
**Zweig:** dein fester Sitzungszweig (zuletzt `claude/schach-abenteuer-mittel-1-cl431d`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/cedar-creek-*.ink` (neu), `inhalte/abenteuer/quests.json`
(nur Quests mit `ort: "cedarCreek"`, die mittel-2 angelegt hat: Knoten anpassen, keine neuen
Quests ohne Bericht), `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel, am Ende anhängen),
`docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py`
(der Test prüft jetzt auch `beginnePartie`- und `reise`-Aufrufe in den Ink-Dateien), dann in
`app/`: `node skripte/baue-abenteuerpaket.mjs` und `npx prettier --check ../inhalte/abenteuer`;
Durchspielen aller Knoten mit inkjs wie beim zweiten Auftrag.

## Ziel

Alle Dialoge von Cedar Creek aus `05_Story_Bibel.md` (Szenen 14 bis 23) als Ink-Dateien, passend
zu den Spieldaten von mittel-2 in `orte.json`, `begegnungen.json` und `quests.json` (Ort
`cedarCreek`). Der Haupt-Chat baut parallel die Aufgabenrunden (Schritt 8f); die Karten zeichnet
niedrig-1.

## Vorgaben

1. **Eine Datei je Karte:** `cedar-creek-aussen.ink`, `cedar-creek-bibliothek.ink`,
   `cedar-creek-archiv.ink`, `cedar-creek-waschsalon.ink`. Einstiegsknoten genau wie in
   `orte.json`: Figuren `cedar-creek-bibliothek.okafor`, `.dex`, `.mae`,
   `cedar-creek-waschsalon.boateng`, `cedar-creek-aussen.rosa`, `.victor`; Gegenstände
   `cedar-creek-aussen.plakat`, `.steg`, `cedar-creek-waschsalon.trockner`,
   `cedar-creek-archiv.karton`, `.programmheft`; Dialog `cedar-creek-aussen.bus_zurueck`.
2. **Quests von mittel-2 bedienen:** Die Knoten, auf die `quests.json` wartet (etwa
   `cedar-creek-bibliothek.okafor`, `cedar-creek-archiv.erzaehlung_1858`), müssen existieren und
   in der richtigen Reihenfolge erreichbar sein (Quest-Auswertung streng der Reihe nach, wie du es
   für Maple Falls geprüft hast). Passt ein Knotenname nicht, lieber den Quest-Eintrag ändern
   als die Geschichte verbiegen; jede Änderung in den Bericht.
3. **Begegnungen und Runden:** `~ beginnePartie("cedarCreek.rosaDuell")`,
   `~ beginnePartie("cedarCreek.clubkampf")`; Aufgabenrunden mit `~ beginneAufgaben("…")` wie
   in `quests.json` genannt (die Runden baut der Haupt-Chat gerade; der Aufruf ist schon richtig).
4. **Rückfahrt:** `bus_zurueck` bietet die Fahrt nach Maple Falls an:
   `~ reise("mapleFalls.park", "bushaltestelle")` (mit `EXTERNAL reise(karte, ausloeser)` oben).
5. **Variablen** wie in Maple Falls (gleiche Namen, neue in den Bericht); Zustand „abgelenkt“ für
   Okafor über `setzeZustand` wie die Quest `cedarCreek.sternennacht` es vorsieht.
6. Alle Regeln des zweiten Auftrags gelten weiter (Sprecher-Tags, geschlechtsneutral, keine
   Buchtexte über kurze Zitate hinaus, Buchbezug nur mit Abschnitt oder Abbildung).

## Was nicht dazugehört

Karten, Spieldaten anderer Orte, Code in `app/`, Änderungen an Maple Falls.

## Bericht

**Fertig:** vier Ink-Dateien für Cedar Creek mit allen Einstiegen aus `orte.json`, Szenen 14 bis
25 der Bibel (auch 24 Clubkampf und 25 Ende von Akt 1, weil die Quest `cedarCreek.clubkampf`
auf `cedarCreek.clubkampf` und `cedar-creek-aussen.ende_akt1` wartet). Drei Quest-Knoten
angepasst, ein neuer Textschlüssel. Prüfungen: `pytest pipeline/tests/test_abenteuer.py`
(8 bestanden, mit den neuen Prüfungen für `beginnePartie` und `reise`), Paketbau, Prettier,
Durchspielen aller Knoten (neun Spielstände, 4500 Läufe ohne Fehler), `npm run pruefen`
(2360 Tests). Dazu eine Simulation wie Oberwelt und `regeln/quests.ts` (Knoten gemeldet, sobald
eine Zeile in ihnen steht; Quests streng der Reihe nach): Ein Durchgang, der nach dem Aussteigen
sofort in die Bibliothek geht und Nebenquests in ungünstiger Reihenfolge anfasst (Programmheft
vor dem Karton, Trockner vor Mr. Boateng), erledigt alle sechs Quests von Cedar Creek.

**Dateien und Knoten** (Einstiege fett):

- `cedar-creek-bibliothek.ink`: **okafor** → okafor_erstes_treffen (Szene 15), okafor_reihe_offen,
  okafor_clubkampf, okafor_partie, okafor_nach_sieg (24), okafor_nach_niederlage, okafor_alltag;
  **dex** → dex_erstes_treffen, dex_reihe (16), dex_alltag; **mae** → mae_erstes_treffen,
  mae_erst_dex, mae_reihe (16), mae_einladung (22), mae_alltag.
- `cedar-creek-archiv.ink`: **karton** → karton_fremd, ordnen, ordnen_wahl, ordnen_fertig (18),
  karton_1858, erzaehlung_1858 (19), karton_alltag; **programmheft** → programmheft_zu,
  erinnerung (20), programmheft_danach.
- `cedar-creek-waschsalon.ink`: **boateng** → boateng_erstes_treffen, boateng_wartet,
  boateng_lagos, boateng_alltag; **trockner** → trockner_raetsel (17).
- `cedar-creek-aussen.ink`: ankunft (14); **plakat**; **steg** → sterne_angebot, sterne (22),
  ende_akt1 (25), steg_alltag; **rosa** → rosa_erstes_treffen, rosa_angebot, rosa_duell (23),
  rosa_nach_sieg, rosa_nach_niederlage; **victor** → victor_tablet, victor_tablet_ende (21),
  victor_alltag; **bus_zurueck** (Rückfahrt mit `reise("mapleFalls.park", "bushaltestelle")`).

**Geänderte Quest-Einträge** (alle von mittel-2, Knoten statt Geschichte geändert):

1. `cedarCreek.archiv1858`, Schritt 1: `cedar-creek-bibliothek.okafor` →
   `cedar-creek-bibliothek.okafor_erstes_treffen`. `Dialog.tsx` meldet den Knoten, in dem die
   erste Zeile steht; ein Verteiler ohne Text wird nie gemeldet, die Quest bliebe hängen.
2. `cedarCreek.trockner`, Start: `cedar-creek-waschsalon.boateng` →
   `cedar-creek-waschsalon.boateng_erstes_treffen`, aus demselben Grund.
3. `cedarCreek.clubkampf`, Schritt 1: Dialog `cedar-creek-aussen.ankunft` → Ort
   `cedarCreek.bibliothek` (Szene `akt1.ankunftCedarCreek` bleibt an diesem Schritt), neuer
   Text `quest.clubkampfCedarCreek.bibliothek`. Grund: Beim Aussteigen startet kein Dialog von
   selbst; wer gleich in die Bibliothek geht, hätte die Ankunft nie gehört, und die Quest hätte
   die Aufgaben von Dex nie gezählt. Die Ankunft läuft jetzt beim ersten Gespräch mit irgendetwas
   draußen (Plakat, Steg, Rosa, Victor, Bus). Der alte Schlüssel
   `quest.clubkampfCedarCreek.schritt1` wird nicht mehr benutzt; ich habe ihn stehen lassen (nur
   anhängen erlaubt), er kann weg.

**Entscheidungen:**

- **Reihenfolge Dex vor Mae** im Dialog erzwungen (Mae: „Erst Dex, dann ich“), weil die Quest
  erst auf Dex wartet, wie in Maple Falls bei Sam und Juno.
- **Gegenstände erst nach dem Gespräch:** Der Trockner bietet das Rätsel erst nach Mr. Boateng
  an, der Karton öffnet sich erst nach Mrs. Okafor, das Programmheft erst nach der Erzählung von
  1858, damit keine Runde vor dem Start ihrer Quest gelöst wird.
- **Karton 1850–1859** nach dem Umräumen oder nach der Clubnadel (Bibel, Szene 18); ohne
  Umräumen bleibt „Nasse Kartons“ offen, die Hauptquest geht trotzdem weiter.
- **Sternennacht** nur vor dem Clubkampf und nur auf Wunsch (ablehnen geht, später wieder
  anbietbar). `sterne` ruft `setzeZustand("cedarCreek.okafor", 1.3,
"zustand.schlechtGeschlafen")` wie im Auftrag; die Quest setzt denselben Zustand, doppelt
  schadet nicht (gleicher Wert), und der Zustand gilt auch, wenn jemand die Einladung von Mae
  verpasst hat. Vor der Partie gähnt Okafor sichtbar, danach „Revanche, wenn ich ausgeschlafen
  bin!“.
- **Erinnerung:** Ambrose erzählt als Zuschauer in der dritten Reihe, mit Schwarz nachspielen;
  die Reibung „Zählen gegen Mut“ wie in der Bibel. Partie und Startzug bestimmt die Runde
  `cedarCreek.erinnerungNewYork` (Haupt-Chat).
- **1858:** Ambrose nennt weder 1866 noch Hales Vornamen; „Hale wie Victor?“ ist eine Wahl nur
  mit `kenntHale`. Die schweren Jahre bleiben unbestimmt (Bibel, Frage 2).
- **Victor** sitzt an der Bushaltestelle und spielt gegen das Programm, verliert und startet
  sofort neu; keine Partie mit dem Helden.

**Neue Variablen.** Setzt Ink selbst: `okaforGetroffen`, `okaforBittetHilfe`, `archivGeordnet`,
`erzaehlung1858Gesehen`, `dexGetroffen`, `maeGetroffen`, `maeEingeladen`,
`sternennachtGesehen`, `clubkampfCedarCreekBesprochen`, `boatengGetroffen`, `boatengLagos`,
`ankunftCedarCreekGesehen`, `plakatGesehen`, `rosaGetroffen`, `victorCedarCreekGesehen`,
`endeAkt1Gesehen`; dazu die vorhandenen `held`, `ambroseVertrauen`, `kenntHale`. Soll die Hülle
setzen (V-Dialog): `reiheDexBestanden`, `reiheMaeBestanden`, `trocknerStellungBestanden`,
`erinnerungNewYorkBestanden`, `ausgangCedarCreekClubkampf`, `ausgangCedarCreekRosaDuell`,
`nadelCedarCreek`.

**Vorschläge für gesperrte Dateien (Haupt-Chat):**

1. **V-Dialog, Namen mit Ort:** Die Kurzform `ausgang<Name>` aus Maple Falls ist mehrdeutig
   (`mapleFalls.clubkampf` und `cedarCreek.clubkampf` gäben beide `ausgangClubkampf`). Cedar
   Creek benutzt deshalb `ausgang` + ganze Kennung ohne Punkt (`ausgangCedarCreekClubkampf`).
   Vorschlag: Die Hülle setzt nur diese Langform; in Maple Falls dann `ausgangErsteLektion` →
   `ausgangMapleFallsErsteLektion`, `ausgangSamRevanche` → `ausgangMapleFallsSamRevanche`,
   `ausgangClubkampf` → `ausgangMapleFallsClubkampf`, `ausgangVictor` → `ausgangMapleFallsVictor`,
   `ausgangSkaterJo` → `ausgangMapleFallsSkaterJo` umbenennen (reines Suchen und Ersetzen in
   vier Dateien; für diesen Auftrag gesperrt, ich mache es gern als nächsten Auftrag). Runden
   bleiben `<Name>Bestanden` (die Namen sind eindeutig), Nadeln `nadel<Ort>`.
2. **Ankunftsdialog nach `reise`:** Schöner wäre, wenn `reise` optional einen Dialogknoten
   mitnimmt, der nach dem Aussteigen startet (`reise(karte, ausloeser)` plus etwa
   `cedar-creek-aussen.ankunft`). Dann könnte die Ankunft immer zuerst kommen und der
   Quest-Schritt wieder auf sie warten.
3. **Figuren nur zeitweise:** Victor an der Bushaltestelle passt nur vor der Clubnadel;
   Juno, Coach und Sam aus der Ankunft und der Sternennacht haben in Cedar Creek keine Figur,
   sie sprechen nur im Dialog. Wenn `orte.json` Sichtbarkeitsbedingungen bekommt, wären das die
   ersten Fälle.

**Offene Fragen:** keine.
