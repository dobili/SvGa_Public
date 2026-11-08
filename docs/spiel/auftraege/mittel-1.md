# Auftrag mittel-1: Route 1 (Maple Falls → Cedar Creek): Dialoge, Gegnerin, Funde, Laden

**Stand:** fertig (Helfer mittel-1, 08.11.2026, fünfter Auftrag)
**Zweig:** dein fester Sitzungszweig (zuletzt `claude/schach-abenteuer-mittel-1-cl431d`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/weg-maple-cedar.ink` (neu),
`inhalte/abenteuer/dialoge/de/maple-falls-park.ink` und `cedar-creek-aussen.ink` (nur Knoten für
den Laden und den Ortsausgang ergänzen), `inhalte/abenteuer/gegner.json` und
`inhalte/abenteuer/begegnungen.json` (nur anhängen: die Straßengegnerin der Route),
`inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests/test_abenteuer.py` im Hauptordner,
`node skripte/baue-abenteuerpaket.mjs` und `npx prettier --check ../inhalte/abenteuer` in `app/`,
Durchspielen der neuen Knoten mit inkjs.

## Ziel

Die Inhalte der ersten begehbaren Route (W5): zwei Karten „Landstraße“ und „Flussweg“ zwischen
Maple Falls (Park, Ortsausgang `landstrasse`) und Cedar Creek (Außenkarte, `bushaltestelle`).
Der Haupt-Chat baut parallel das Datenformat `wege.json` und die Technik (Schritt 10); niedrig-1
zeichnet die Karten. Deine Knoten werden über Auslösernamen angesprochen, die hier festliegen.

## Vorgaben

1. **Datei `weg-maple-cedar.ink`** mit den Einstiegen: `tafel` (Rätseltafel am Ortsausgang: ein
   Satz, dann `~ beginneAufgaben("wegMapleCedar.tafel")` (Runde steht schon in `runden.json`)), `wanderer` (Figur, drei Varianten je
   nach Besuch, eine Schachweisheit mit Abschnittsangabe aus Kapitel 1 bis 3, kein Zitat über einen
   Satz), `gegnerin` (Jos Freundin „Nia“, Skaterin, Straßengegnerin: Angebot einer Blitzpartie
   3 + 2, `~ beginnePartie("wegMapleCedar.nia")`, Knoten nach Sieg und Niederlage mit
   `ausgangWegMapleCedarNia`), `fund_formular` (Auslöser heißt `fundFormular`; das alte Partieformular, E4: ein Satz von Ambrose,
   `~ gibFund("formular1857")`), `rast` (Bank am Fluss: Ambrose erzählt zwei Sätze über Reisen
   zu Fuß im 19. Jahrhundert, ohne Jahreszahl-Streit), `schild_cedar` (Auslöser `schildCedar`, Ortsschild Cedar Creek), `fund_muenzen` (Auslöser
   `fundMuenzen`: eine Kiste mit Münzen, `~ gibFund("muenzenFlussweg")`). Die Knoten heißen wie
   in `orte.json` unter `dialog` eingetragen (`weg-maple-cedar.<knoten>`).
2. **Externe Funktion `gibFund(kennung)`** darfst du benutzen, sie kommt mit Schritt 11
   (deklarieren mit `EXTERNAL gibFund(kennung)`; der Paketbau übersetzt das schon).
3. **Gegnerin Nia** steht vorläufig in `gegner.json` (`wegMapleCedar.nia`, Rolle `strasse`,
   A − 100); passe Stil, Schwäche (übersieht Rückzüge) und zwei Steckbriefzeilen an. Begegnung
   `wegMapleCedar.nia` in `begegnungen.json` (Stellungsduell nach C1 aus Kapitel 2 oder 3, Abbildung mit leichtem
   Vorteil für Weiß wählen und nennen; `uhr` darf noch fehlen, die Wahl der Zeitklasse kommt mit
   Schritt 13).
4. **Laden in Maple Falls** (G2): Kiosk im Park, Figur „Mr. Patel“, Knoten `kiosk` in
   `maple-falls-park.ink` mit `~ oeffneLaden("mapleFalls.kiosk")` (EXTERNAL deklarieren, kommt mit
   Schritt 12) und zwei Sätzen Begrüßung; Angebot als Vorschlag im Bericht (Karten, Fahrkarte,
   Extras, Preise nach G2/G4).
5. **Ortsausgang:** In `maple-falls-park.ink` ein Knoten `landstrasse` (Ambrose: „Zu Fuß? Gut.
   Der Bus fährt später auch.“), in `cedar-creek-aussen.ink` ein Knoten `ankunft_zu_fuss` für die
   Ankunft über den Flussweg (statt mit dem Bus).
6. **Texte:** Namen der neuen Figuren (`figur.nia.name`, `figur.patel.name`, `figur.wanderer.name`),
   Fundname `fund.formular1857.name` und ein Satz `fund.formular1857.text`.
7. Alles Übrige wie bisher (Sprecher-Tags, geschlechtsneutral, Variablen nach R42 mit Ort).

## Was nicht dazugehört

Karten (niedrig-1), `wege.json`, `laeden.json`, Code.

## Bericht

**Fertig:** `weg-maple-cedar.ink` (neu), Kiosk und Ortsausgang in `maple-falls-park.ink`, Ankunft zu
Fuß in `cedar-creek-aussen.ink` (nur angehängt, keine vorhandenen Knoten geändert), Nia in
`gegner.json` und `begegnungen.json` (angehängt), fünf neue Texte. Prüfungen: `pytest
pipeline/tests/test_abenteuer.py` (9 bestanden), Paketbau, Prettier, Durchspielen aller Knoten
(5112 Läufe ohne Fehler), gezielt alle Zweige von Nia (leer, Sieg, Remis, Niederlage, Abbruch),
drei Besuche beim Wanderer, Fund zweimal, `npm run pruefen` (2377 Tests), Variablen-Durchsicht wie
im vierten Auftrag (keine Probleme).

**Knoten** (Einstiege fett):

- `weg-maple-cedar.ink`: **tafel**; **wanderer** → wanderer_erstes, wanderer_zweites,
  wanderer_drittes; **gegnerin** → nia_erstes_treffen, nia_angebot, nia_duell, nia_nach_sieg,
  nia_nach_niederlage; **fund_formular**; **rast**; **schild_cedar**.
- `maple-falls-park.ink`: **kiosk** (Mr. Patel, `~ oeffneLaden("mapleFalls.kiosk")`),
  **landstrasse** (vor dem Aufbruch: „lieber in der Stadt“; erster Weg: Ambrose „Zu Fuß? Gut.
  Der Bus fährt später auch.“; danach: „Du kennst den Weg schon.“).
- `cedar-creek-aussen.ink`: **ankunft_zu_fuss** (Juno und Coach warten an der Haltestelle; setzt
  `ankunftCedarCreekGesehen` wie die Ankunft mit dem Bus, damit sie nicht doppelt läuft).

**Entscheidungen mit Begründung:**

1. **Kennungen zweiteilig.** Die Schemas für Gegner, Begegnungen, Quests und Runden erlauben nur
   `ort.name`; `weg.mapleCedar.nia` wäre am Schematest gescheitert. Deshalb `wegMapleCedar.nia`
   für Gegner und Begegnung. Die Hülle macht daraus genau die verlangte Variable
   `ausgangWegMapleCedarNia`. Die Runde heißt `wegMapleCedar.tafelLandstrasse` statt
   `….tafel`, weil die Variable sonst `tafelBestanden` hieße und mit jeder späteren Route
   kollidierte; so heißt sie `tafelLandstrasseBestanden`.
2. **Rätseltafel ohne Aufruf.** Der Test prüft jetzt jedes `beginneAufgaben` gegen
   `runden.json`, und Runden brauchen dort einen Ort mit Club. Die Runde der Tafel fehlt also
   noch (für mich gesperrt). Der Aufruf steht als Kommentar bereit, wie damals bei Victor; bis
   dahin sagt die Tafel einen Satz und endet.
3. **Stellung für Nia: Abbildung 3.77** (Abschnitt 3.10, Lettisches Gambit, Bilanz nach 13.
   Tae1 O-O, Weiß am Zug): Weiß ist besser entwickelt und hat die offene f-Linie, Stockfish lite
   Tiefe 14 sagt +1,78. Gewählt aus allen Abbildungen der Kapitel 2 und 3 mit Weiß am Zug
   (bewertet mit derselben Engine); andere mit +1,2 bis +1,8 waren Eröffnungsstellungen um Zug 3
   (3.54, 3.55, 3.62, 3.70), in denen Nia als Angreiferin wenig zu tun hätte. Format wie Jo und
   Rosa: 10 Züge, Mindestvorteil 1,0, Karten erlaubt; `uhr` fehlt noch (Schritt 13).
4. **Nia** (`gegner.json`): Rolle `strasse`, A − 100, Stil angreifer 120 und taktiker 90
   („schnell“ kommt über die Uhr), Gewichte `rueckzug` 2 (blinder Fleck: übersieht Rückzüge) und
   `schlagreflex` 1,3; Steckbrief: Stil Angreiferin, Fleck Rückzug. Ambrose verrät den Fleck
   vor dem Duell („Sie zieht nie zurück“), damit der Steckbrief im Spiel einen Sinn hat.
5. **Weisheiten des Wanderers** in eigenen Worten mit Abschnitt: 1.1 (erst entwickeln, dann
   angreifen), 1.5 (nicht vorschnell schlagen), 3.1 (Gambit tauscht Bauer gegen Zeit); ab dem
   dritten Besuch wechselnd mit zwei Abschiedssätzen.
6. **Fund:** `gibFund("formular1857")` einmal; Ambrose erkennt die Handschrift, kann sie aber
   nicht lesen. Das bereitet E4 vor (Mr. Boateng entschlüsselt sie im Archiv).

**Neue Variablen** (alle von Ink gesetzt, außer den beiden der Hülle):
`wandererBesuche` (Zahl, 0), `niaGetroffen`, `formularGefunden`, `patelGetroffen` (Wahrheitswerte,
false); von der Hülle: `ausgangWegMapleCedarNia` (Text, „“), `tafelLandstrasseBestanden`
(Wahrheitswert, false). Im Park neu gelesen: `ankunftCedarCreekGesehen` (war dort schon
deklariert), `aufbruchGesehen`.

**Vorschläge für gesperrte Dateien (Haupt-Chat):**

1. **`runden.json`:** Runde `wegMapleCedar.tafelLandstrasse` mit `anzahl` 3, Thema `matt1`,
   Steller „Tafel“ ohne Figur (W4a); dafür muss der Test Runden ohne Club für Routen erlauben
   (etwa Ort beginnt mit `weg`). Danach in `tafel` den Kommentar einkommentieren.
2. **`wege.json`** (Schritt 10): Stationen als Auslöser `tafel`, `wanderer` (Figur), `gegnerin`
   (Figur, Gegner `wegMapleCedar.nia`), `fund_formular`, `rast`, `schild_cedar`; Ankunft über den
   Flussweg an `cedarCreek.aussen` Auslöser `bushaltestelle` mit Dialog
   `cedar-creek-aussen.ankunft_zu_fuss`; Ausgang im Park über Auslöser `landstrasse` mit Dialog
   `maple-falls-park.landstrasse`.
3. **Bus erst nach dem Fußweg (W2):** `maple-falls-park.bushaltestelle` bietet den Bus heute nach
   dem Aufbruch sofort an. Für W2 sollte er erst nach `ankunftCedarCreekGesehen` fahren (davor
   ein Satz: „Den ersten Weg gehst du zu Fuß. Die Landstraße beginnt am Parkausgang.“). Der Knoten
   ist für diesen Auftrag gesperrt; ich ändere ihn gern im nächsten.
4. **Kiosk `mapleFalls.kiosk`** (`laeden.json`, G2/G4), Vorschlag:

   | Angebot                                  | Preis | Vorrat   | Hinweis                                                           |
   | ---------------------------------------- | ----- | -------- | ----------------------------------------------------------------- |
   | Zweite Chance                            | 20    | 3        | Verbrauchskarte                                                   |
   | Ambroses Flüstern                        | 40    | 1        | Verbrauchskarte, nach der ersten Clubnadel                        |
   | Fahrkarte Bus nach Cedar Creek           | 10    | beliebig | erst nach dem ersten Fußweg; frei nach Nadel von Cedar Creek (W2) |
   | Taschenlampe (zeigt versteckte Funde)    | 60    | 1        | Gegenstand                                                        |
   | Bretthintergrund „Maple Falls im Herbst“ | 50    | 1        | Extra (E3)                                                        |

   Fingerzeig und Gefahrenradar nicht im Laden: Beide sind in `karten.json` dauerhafte Karten und
   kommen aus der Geschichte (R27); G2 nennt „Fingerzeig 15“, das passt nicht zur Kartensorte.
   Mentor-Zug und Sanduhr sind nach G3 nicht käuflich. Mit 60 bis 100 Münzen je Clubbesuch (G4)
   reicht es für eine Karte oder Fahrkarten, die Taschenlampe nach etwa einer Stadt.

**Offene Fragen:** keine.
