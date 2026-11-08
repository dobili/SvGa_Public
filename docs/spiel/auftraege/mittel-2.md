# Auftrag mittel-2: kein Auftrag

**Stand:** kein Auftrag (Haupt-Chat, 08.11.2026; der sechste Auftrag, Spieldaten für Akt 2, ist
zusammengeführt, danke. Bis der nächste Auftrag per Nachricht kommt, bitte nichts tun und warten.)

## Letzter Auftrag (erledigt, zur Nachlese)

**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-regelwerk`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/orte.json` (nur neue Orte anhängen: `riverton`, `ironwood`,
`wegCedarRiverton`, `wegRivertonIronwood`; in `cedarCreek` nur einen Übergang zum Bahnhof/Weg
ergänzen), `inhalte/abenteuer/gegner.json`, `begegnungen.json`, `runden.json` (anhängen),
`inhalte/abenteuer/quests.json` (nur Quests mit `ort` riverton, ironwood oder den beiden Wegen),
`inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q` (alle), in `app/`
`node skripte/baue-abenteuerpaket.mjs` und `npx prettier --check ../inhalte/abenteuer`

## Ziel

Akt 2 als Spieldaten, so wie du Cedar Creek angelegt hast: Orte mit Karten (Kennungen und
Dateinamen, die Karten selbst zeichnet später niedrig-1), Figuren, Gegnerprofile, Begegnungen,
Aufgabenrunden, Quests und Texte. Danach können mittel-1 die Dialoge und niedrig-1 die Karten
bauen, ohne etwas zu erfinden.

## Vorgaben

1. **Orte:** `riverton` (Nummer 3) und `ironwood` (Nummer 4) mit Club (Kapitel nach
   `07_Aufgabenzuordnung.md`, Zeitbudget, Buchübungen, Themen), Karten und Auslösern nach 09;
   Wege `wegCedarRiverton` und `wegRivertonIronwood` als `art: "weg"`, Nummer 0, je zwei Karten,
   Stationen als Auslöser (Tafel, Fund, Gegner, Wanderer). Übergänge mit Dialog und `wenn` dürfen
   benutzt werden (siehe `inhalte/abenteuer/README.md`, neu: Abschied, Ankunft, Sperre).
2. **Gegner:** Clubchefs nach R4 (`eingang`, 160 + 60 · Nummer: Slick +340, Big Joe +400; die
   Pipeline prüft das), Clubmitglieder −100 bis +50, Straßengegner −150 bis 0; Stil, Schwächen und
   Steckbrief aus der Bibel.
3. **Begegnungen:** Clubkämpfe, Straßenduelle (Stellungsduell aus den Abbildungen, die du schon
   geprüft hast: 3.77, 3.75, 6.14, 6.5, 8.44), Wiedereinstieg und Karten nach Regelwerk.
4. **Runden:** Reihenblöcke der Clubmitglieder (`reihe: true`, Buchübungen nur aus dem Club, die
   als Taktikaufgabe mit Lösungszug vorliegen; sonst Themen), Rätseltafeln der Wege mit `anzahl`.
5. **Quests:** Haupt- und Nebenquests der Bibel, Funde als Wirkung `gegenstand` (Fahrrad im
   Schuppen von Riverton), übergreifende Quests E4 mit `voraussetzung`.
6. Läden, Münzen und Zeitkarten noch nicht als Daten (die Formate kommen mit Schritt 12 und 13);
   Angebote und Preise stehen schon in deiner Bibel.

## Was nicht dazugehört

Dialoge (Ink), Karten (Tiled), Code, Änderungen an Maple Falls.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis c84d3af9 hereingeholt). Prüfungen: `pytest pipeline/tests`
(303 bestanden, 70 übersprungen), Paketbau (31 Dateien, 286 KB), Prettier, zusätzlich die
Vitest-Tests des Abenteuers (50 bestanden). Nur angehängt; in `cedarCreek` ein Übergang.

**Neue Einträge**

- **Orte:** `wegCedarRiverton` (Weg, Karten `zedernwald`, `bahndamm`; Figuren `fenwick`,
  `schaffner`; Tafel, drei Funde, Ankunft in Riverton mit Dialog), `riverton` (Nummer 3; Karten
  `aussen`, `pavillon`, `bahnhofshalle`, `wohnwagen`, `schuppen`; Figuren `slick`, `tamsin`, `ray`,
  `harlan`, `pops`, `albescu`, `nova`, `victor`; Club Kapitel [7, 4], 15 Minuten, Buchübungen 35,
  40, 4, 10, Thema `doppelangriff`), `wegRivertonIronwood` (Weg, `kanalweg`, `bruecke`; Figur
  `dale`; Tafel, Funde Zahnrad und Nietenkopf, Auslöser `zeitnotTrick`), `ironwood` (Nummer 4;
  Karten `aussen`, `kantine`, `mamasZimmer`, `umkleide`, `museum`; Figuren `bigJoe`, `hank`,
  `priya`, `gus`, `edna`, `teague`, `omaRuth`, `mama`, `victor`, `grahamHale`; Club Kapitel [7, 4],
  Buchübungen 37, 38, 17, 22, Themen `fesselung`, `spiess`). In `cedarCreek`: Übergang
  `zedernwald` zum Weg mit `wenn: endeAkt1Gesehen` und Dialog.
- **Übergänge mit Bedingung:** `riverton.kanalweg` (`wenn: nadelRiverton`), `wohnwagenTuer`
  (`clubkampfRivertonBesprochen`), `schuppenTuer` (`schuppenOffen`), `ironwood.haustuerRuth`
  (`elmStreetBekannt`); jeweils mit Dialog für die Sperre. Diese Variablen setzt mittel-1 in den
  Dialogen (neu fürs Verzeichnis R42).
- **Gegner:** `wegCedarRiverton.schaffner` (A − 100), `riverton.slick` (E + 340, Endspiel −1,
  übersieht Drohungen, Schottisch/Evans), `riverton.tamsin` (A − 50), `riverton.ray` (A ± 0),
  `riverton.harlan` (A ± 0), `ironwood.bigJoe` (E + 400, Damengambit/London, blinder Fleck
  `roentgen`), `ironwood.hank` (A ± 0), `ironwood.priya` (A + 50), `ironwood.gus` (A − 50),
  `ironwood.mama` (Story, E + 250, Mittelspiel −1, Damengambit, blinder Fleck `roentgen`).
- **Begegnungen:** `wegCedarRiverton.schaffner` (Abb. 3.75), `riverton.harlan` (Abb. 3.77),
  `ironwood.gus` (Abb. 6.14), alle Stellungsduell 10 Züge, +1,0; `riverton.clubkampf`,
  `ironwood.clubkampf` (zufall), `ironwood.mama` (Leser Schwarz, zählt für die App).
- **Runden:** Reihen `riverton.reiheTamsin`, `reiheRay`, `ironwood.reiheHank`, `reihePriya`;
  `riverton.slickBeobachten` (3), `riverton.odumAufgabe` (1), `riverton.flashbackLondon` (4),
  `ironwood.siegelStellung` (1), `ironwood.erinnerungBird` (4), Tafeln der Wege (3 und 2).
- **Quests:** Haupt `riverton.parkclub` (7 Schritte), `ironwood.mamasFinale` (4),
  `ironwood.clubkampf` (6); Nebenquests `riverton.schuppen` (Gegenstand `fahrrad`),
  `riverton.zuschauen` (Steckbrief, analysiert), `riverton.odum`, `riverton.flashbackLondon`
  (Fragment 3, Bauernvorgabe), `ironwood.postsack` (Gegenstand `umschlagOhneBrief`, Steckbrief),
  `ironwood.feier` (abgelenkt 1,4, Voraussetzung `ironwood.mamasFinale`), `ironwood.erinnerungBird`
  (Fragment 4), Tafeln `wegCedarRiverton.tafelWegweiser`, `wegRivertonIronwood.tafelHaltestelle`.
- **Texte:** 76 neue Schlüssel.

**Annahmen**

1. Der Rückweg vom Weg nach Cedar Creek kommt vorerst an `bushaltestelle` an, weil die schon
   gezeichnete Karte `cedar-creek-aussen.json` kein Objekt `zedernwald` hat (Kartentest). Für
   niedrig-1: Objekt `zedernwald` am Ortsrand zeichnen, dann Ziel auf `zedernwald` umstellen.
2. Buchübungen 17 (`ueb:elefant`) und 22 (`ueb:legal-verteidigung`) stehen im Club, aber in keiner
   Runde, weil sie nicht im Taktiktrainer liegen (kein Lösungszug); Ironwood-Reihen haben je eine
   Buchübung plus Themen.
3. Funde ohne Questbezug (Pfeilspitze, Fahrkarte, Holzfiguren, Taubenfeder, Zahnrad, Nietenkopf,
   Glasfunke) sind Auslöser mit Dialog; sie kommen über `gibFund` in den Dialogen (mittel-1). Als
   Quest-Wirkung `gegenstand` nur Fahrrad, Foto 2001 und der Umschlag.
4. Die Erinnerungen laufen wie in Cedar Creek als Mattbilder-Runde mit fester Zahl (Grenze des
   Prototyps, R30a); Steller `riverton.ambrose` und `ironwood.ambrose` über den Textschlüssel
   `figur.ambrose.name`.
5. Ambrose als Mentor auf Route 3 ist kein Gegner; der Weg hat daher keinen Straßengegner (die Bibel
   setzt dort den Zeitnot-Trick, Szene 40). Mamas Profil heißt `ironwood.mama` (Gegner heißen wie
   ihre Figur), Textschlüssel `figur.mutter.name`.

**Offen bis zu den Formaten (Schritt 12, 13):** Uhr der Begegnungen (Blitz beim Schaffner und bei
Mr. Harlan, Schnellschach bei Gus), Karten Zeitbonus/Zeitdruck/Zeitnot-Trick als Belohnung,
Münzen, Läden. Spare geprüfte Stellungen: 6.5, 8.44.

**Vorschläge:** Quest `cedarCreek.partieformular` (E4.1, Boateng entziffert das Formular →
Fragment 2) gehört nach Cedar Creek, durfte ich nicht anlegen.
