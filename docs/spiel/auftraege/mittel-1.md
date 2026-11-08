# Auftrag mittel-1: Route 1 (Maple Falls → Cedar Creek): Dialoge, Gegnerin, Funde, Laden

**Stand:** offen (Haupt-Chat, 08.11.2026, fünfter Auftrag; Grundlage ist
`docs/spiel/08_Wege_und_Entdeckungen.md`, vom Autor abgesegnet, inklusive Geldsystem)
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

(vom Helfer auszufüllen)
