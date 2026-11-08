# Auftrag mittel-1: Dialoge für den Weg Cedar Creek → Riverton und für Riverton (Akt 2, erster Teil)

**Stand:** fertig (Helfer mittel-1, 08.11.2026, siebter Auftrag)
**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/*.ink` (neue Dateien für `wegCedarRiverton` und
`riverton`; in `cedar-creek-aussen.ink` nur den Knoten `zedernwald` ergänzen),
`inhalte/abenteuer/quests.json` (nur Quests mit `ort` riverton oder wegCedarRiverton anpassen,
dazu neu `cedarCreek.partieformular`, E4.1), `inhalte/abenteuer/texte/de.json` (nur neue
Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** wie bisher (pytest alle, Paketbau, Prettier, Durchspielen mit inkjs,
dazu eine Simulation der Riverton-Quests wie bei Cedar Creek)

## Ziel

Alle Dialoge, auf die `orte.json` für `wegCedarRiverton` und `riverton` verweist (Feld `dialog` an
Figuren und Auslösern, auch an Übergängen), nach Akt 2 der Story-Bibel (`05_Story_Bibel.md`, Teil
2, Szenen in Riverton und auf dem Weg) und der Weltbeschreibung (`09`, Abschnitte 4a und 5.4).
Ironwood folgt in einem eigenen Auftrag.

## Vorgaben

1. **Knotennamen** genau wie in `orte.json` (Datei = Teil vor dem Punkt). Fehlt ein Knoten, scheitert
   der Paketbau nicht, aber das Spiel meldet „Dialog fehlt“; deshalb vollständig.
2. **Übergänge mit Dialog** laufen vor dem Wechsel; mit `wenn` sperren sie, solange die Variable
   nicht wahr ist (siehe `inhalte/abenteuer/README.md`). mittel-2 nennt neue Bedingungsvariablen:
   `nadelRiverton`, `clubkampfRivertonBesprochen`, `schuppenOffen`, `elmStreetBekannt`; du setzt
   sie im passenden Knoten.
3. **Externe Funktionen**, die es jetzt gibt: `gibKarte`, `setzeSzene`, `beginnePartie`,
   `beginneAufgaben`, `setzeZustand`, `schalteSteckbrief`, `reise`, `gibFund`, `oeffneLaden`.
   Die Funde von Akt 2 stehen in `funde.json` (Kennungen: pfeilspitze, fahrkarte1958,
   holzspringer, pavillonspringer, zeitungsausschnitt, taubenfeder, holzlaeufer; für Ironwood
   zahnrad, nietenkopf, foto2001, umschlag, holzturm, glasfunke), aufrufen mit `~ gibFund("…")`, Läden in `laeden.json` (Riverton hat noch keinen; den
   Zeitungsstand vorerst als Gespräch ohne `oeffneLaden`).
4. **E4.1** `cedarCreek.partieformular`: Mr. Boateng entziffert das alte Partieformular aus Route 1
   (Voraussetzung: Fund `formular1857`), Belohnung ein Fragment; Knoten im Waschsalon oder Archiv.
5. Alles Übrige wie bisher (Sprecher-Tags, geschlechtsneutral, Variablen nach R42).

## Was nicht dazugehört

Ironwood und der Weg dorthin (nächster Auftrag), Karten, Code.

## Bericht

**Fertig:** sechs neue Dateien (`weg-cedar-riverton.ink`, `riverton-aussen.ink`,
`riverton-pavillon.ink`, `riverton-bahnhofshalle.ink`, `riverton-wohnwagen.ink`,
`riverton-schuppen.ink`), in `cedar-creek-aussen.ink` der Knoten `zedernwald` (Szene 26), in
`cedar-creek-waschsalon.ink` das Partieformular (E4.1). Alle Verweise aus `orte.json` für
`wegCedarRiverton` und `riverton` und alle Dialogknoten der Quests haben jetzt einen Knoten
(per Skript geprüft; offen sind nur Ironwood und Route 3, nächster Auftrag). Prüfungen: pytest
alle (305 bestanden), Paketbau, Prettier, Durchspielen aller Knoten (8100 Läufe ohne Fehler),
Variablen-Durchsicht, `npm run pruefen` (2382 Tests). Simulation wie Oberwelt und
`regeln/quests.ts` (Übergänge: erst Dialog, dann Wechsel nur bei `wenn` = true; Clubkampf zuerst
abgebrochen, dann verloren, dann gewonnen): **„Der letzte Tisch“, Tafel am Wegweiser,
Zuschauen, Odums Aufgabe, Flashback London und das Partieformular werden fertig;** „Der
verrostete Schlüssel“ beginnt nicht (Befund 2). Die Simulation von Akt 1 läuft weiterhin mit
allen 13 Quests durch.

**Knoten je Datei** (Einstiege fett):

- `weg-cedar-riverton`: **fenwick**; **tafel**; **schaffner** → quinn_erstes_treffen (Juno
  verliert zuerst), quinn_angebot, quinn_nach_sieg, quinn_nach_niederlage; **fund_pfeilspitze**,
  **fund_holzspringer**, **fund_fahrkarte**.
- `riverton-aussen`: **ankunft_zu_fuss** → ankunft (Szene 28); **bahndamm**, **kanalweg**,
  **wohnwagen_zu**, **schuppen_zu** (Übergänge); **albescu** → albescu_erstes_treffen,
  albescu_wartet, albescu_schluessel, albescu_alltag; **nova**; **victor** → victor_alltag;
  **bildschirmtische** (Ambrose `fern`); **handyladen**; **fund_laeufer**.
- `riverton-pavillon`: **slick** (eine Zeile vor dem Verteilen) → slick_erstes_treffen,
  slick_reihe_offen, slick_clubkampf, slick_nach_niederlage, slick_nach_sieg, slick_alltag
  (mit Revanche auf der Treppe für eine bessere Nadel); **tamsin** → tamsin_erstes_treffen,
  tamsin_reihe, tamsin_zuschauen, tamsin_zuschauen_wieder, tamsin_alltag; **ray** →
  ray_erstes_treffen, ray_erst_tamsin, ray_reihe, ray_alltag; **gedenktafel**,
  **limonadenglas**.
- `riverton-bahnhofshalle`: **harlan** → harlan_erstes_treffen, harlan_angebot, harlan_nach_sieg,
  harlan_nach_niederlage; **pops**; **zug** (`reise("cedarCreek.aussen", "bushaltestelle")`);
  **uhr** (Flashback erst nach den Bildschirmtischen); **zeitungsstand**;
  **fund_zeitungsausschnitt** → odum_aufgabe; **fund_taubenfeder**.
- `riverton-wohnwagen`: **dosentrophaeen** → slick_abschied (Szene 37, Fund pavillonspringer).
- `riverton-schuppen`: **fahrrad**.
- `cedar-creek-aussen`: **zedernwald** (Sperre vor dem Ende von Akt 1, dann Aufbruch mit Juno).
- `cedar-creek-waschsalon`: boateng (neuer Zweig) → boateng_formular → boateng_formular_entziffert.

**Quest-Änderungen:**

1. `riverton.parkclub`, Schritt 1: Dialog `weg-cedar-riverton.aufbruch` → Ort
   `wegCedarRiverton.bahndamm` (Szene `akt2.aufbruch` bleibt am Schritt). Kein Auslöser erreicht
   einen Knoten `aufbruch` auf der Route, und der Aufbruch mit Juno läuft im Übergang am Steg,
   also vor dem Betreten des Zedernwalds, mit dem die Quest erst beginnt. Der Schritttext („Geh
   durch den Zedernwald Richtung Riverton“) passt genau zum Erreichen des Bahndamms.
2. Neu `cedarCreek.partieformular` (hilfe): Start `cedar-creek-waschsalon.boateng_formular`,
   Schritt `….boateng_formular_entziffert` mit Partiefragment 2 (0, 1 und 3 sind vergeben). Texte
   `quest.partieformular.titel` („Eine alte Handschrift“) und `.schritt1`. Die Voraussetzung
   „Fund formular1857“ prüft Ink über `formularGefunden` (gesetzt in `weg-maple-cedar.ink`), weil
   die Hülle Funde nicht als Dialogvariable meldet und `voraussetzung` nur Quests kennt.
3. Alle übrigen Riverton-Quests unverändert; ihre Knoten existieren. „Der letzte Tisch“ wartet
   auf `riverton-pavillon.slick`, dort steht deshalb vor dem Verzweigen eine Zeile (gemeldet wird
   der Knoten der ersten Zeile); `riverton-wohnwagen.slick_abschied` erreicht man über die
   Dosentrophäen, den einzigen Auslöser im Wohnwagen.

**Befunde für den Haupt-Chat:**

1. **Kanalweg öffnet nie:** `orte.json` setzt am Übergang `kanalweg` `wenn: nadelRiverton`; die
   Oberwelt prüft `=== true`, `nadelRiverton` ist aber eine Zahl (1 bis 3, R42). In der Simulation
   bleibt der Weg auch mit Silbernadel gesperrt. Vorschlag: `wenn` als „wahr oder Zahl größer 0“
   auswerten, oder eine eigene Variable (etwa `kanalwegOffen`, die ich in `slick_nach_sieg` setzen
   würde). Der Dialog `kanalweg` sagt schon heute das Richtige (mit Nadel: „Gehen wir“).
2. **Der verrostete Schlüssel fehlt:** In `funde.json` gibt es keinen Fund „schluessel“, und am
   Steg in Cedar Creek keinen Knoten, der ihn gibt. `albescu` verzweigt deshalb über
   `schluesselGefunden`, die niemand setzt; die Quest `riverton.schuppen` beginnt nie. Vorschlag:
   Fund `schluesselRostig` (Ort cedarCreek) und am Steg ein Knoten `fund_schluessel` mit
   `~ schluesselGefunden = true` und `~ gibFund("schluesselRostig")`, etwa ab dem Ende von Akt 1
   (Rosa: „Den hab ich beim Angeln rausgezogen. Willst du ihn?“). Der Knoten gehört in
   `cedar-creek-aussen.ink` (für mich in diesem Auftrag gesperrt).
3. **Zwei Tafeln, eine Variable:** `wegMapleCedar.tafel` und `wegCedarRiverton.tafel` ergeben
   beide `tafelBestanden`. Die Tafel im Zedernwald prüft deshalb keine Variable und bleibt
   lösbar; die Quest zählt trotzdem nur einmal. Vorschlag: Runden nach dem Ort benennen
   (`tafelZedernwald`) oder die Hülle `<ort><Runde>Bestanden` setzen lassen.
4. **Zugfahrt:** `zug` reist ohne Fahrkarte (es gibt noch keine Münzabfrage aus Ink). Für W2
   (10 Münzen, nach der Clubnadel frei) bräuchte es eine Funktion wie `bezahle(muenzen)` oder den
   Fahrkartenkauf im Laden.
5. **Zeitkarten aus Szene 27 und 34** (Zeitbonus beim ersten Sieg gegen den Schaffner, Zeitdruck
   für das Zuschauen) stehen nicht in den Quests; sie sind Regeln (R27) bzw. Wirkungen in
   `quests.json`, die ich nicht anfassen durfte.

**Neue Variablen** (alle von Ink gesetzt, Wahrheitswerte mit Startwert false, außer
`clubkampfRivertonNadel` als Zahl 0): `aufbruchRivertonGesehen`, `formularEntziffert`,
`fenwickGetroffen`, `quinnGetroffen`, `pfeilspitzeGefunden`, `holzspringerGefunden`,
`fahrkarte1958Gefunden`, `ankunftRivertonGesehen`, `novaGesehen`, `victorRivertonGesehen`,
`bildschirmtischeGesehen`, `albescuGetroffen`, `schuppenOffen` (Bedingung im Übergang),
`holzlaeuferGefunden`, `slickGetroffen`, `tamsinGetroffen`, `rayGetroffen`, `zuschauenAngeboten`,
`slickAbschiedGesehen`, `clubkampfRivertonBesprochen` (Bedingung im Übergang),
`clubkampfRivertonNadel`, `odumGedenktafelGesehen`, `limonadenglasGesehen`, `harlanGetroffen`,
`popsGetroffen`, `zeitungsausschnittGefunden`, `taubenfederGefunden`, `fahrradErhalten`;
gelesen, aber noch von niemandem gesetzt: `schluesselGefunden` (Befund 2). Von der Hülle gelesen:
`ausgangWegCedarRivertonSchaffner`, `ausgangRivertonHarlan`, `ausgangRivertonClubkampf`,
`reiheTamsinBestanden`, `reiheRayBestanden`, `slickBeobachtenBestanden`, `odumAufgabeBestanden`,
`flashbackLondonBestanden`, `nadelRiverton`.

**Offene Fragen:** keine, die blockieren; die fünf Befunde oben liegen beim Haupt-Chat.
