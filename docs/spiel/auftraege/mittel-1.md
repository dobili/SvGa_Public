# Auftrag mittel-1: Dialoge und Quests für Weg 5 und Port Delacroix

**Stand:** fertig (Helfer mittel-1, 08.11.2026, fünfzehnter Auftrag, beide Pushes)

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

**Erledigt (zweiter Push: Weg 6 und Desert Springs).**

- Vier Ink-Dateien: `weg-delacroix-desert.ink` (Szene 71 Mrs. Holloway mit der Goldenen
  Angriffsregel, Kapitel 1, Abschnitt 1.6, Rätseltafel, Fund Eidechsenhaut; Szene 72 Mira auf dem
  Stein; Szene 73 Versöhnung am Felsbogen mit drei Wahlen, 1866 und der Lektion zum romantischen
  Opfer; Fund Nieten J. H.), `desert-springs-aussen.ink` (Ankunft, Szene 74 Buck mit Großes Maul
  beim ersten Sieg, Szene 79 Abend am Motel, Szene 80 Ende von Akt 3 mit Reise nach Port Delacroix
  oder Maple Falls), `desert-springs-garage.ink` (Mira, Tomás, Dot, Szene 75 und 78, Dots Hinweis
  auf das Antiquariat), `desert-springs-antiquariat.ink` (Szene 76 Der Brief). Alle Knoten aus
  `orte.json` sind vorhanden.
- Vier Runden: `wegDelacroixDesert.tafel` (3 Aufgaben, Mattbilder), `desertSprings.reiheTomas`
  (Mattbilder mit Opfer, Übungen a10 und a11), `desertSprings.reiheDot` (Königsangriff,
  Morphy-Checkliste und a14), `desertSprings.siegel` (1 Aufgabe, Fesselung).
- Drei Quests: Hauptquest `desertSprings.versoehnung` (Mira auf dem Stein, Versöhnung, Tomás mit
  Zweiter Chance, Dot, Clubkampf mit Nadel und Mentor-Zug, Abend am Motel, Ende von Akt 3, sieben
  Schritte mit den Szenen `akt3.miraStein` bis `akt3.ende`), `desertSprings.brief` (raetsel,
  Fragment 7, Flüstern), `wegDelacroixDesert.tafelCanyon` (raetsel). 13 neue Textschlüssel.
- Prüfungen: Die Simulation läuft von der Fähre bis zum Schild in Port Delacroix nach der
  Rückreise; alle acht Quests von Akt 3 aus beiden Pushes sind fertig. Dabei sind auch „zu früh am
  Felsbogen“ und eine Niederlage im Clubkampf durchgespielt. Zufallsdurchläufe aller Knoten ohne
  Fehler, pytest grün, Abenteuerpaket baut. `npm run pruefen`: wie im ersten Push bleibt nur der
  Zähltest der Erinnerungen offen.

**Nachtrag nach dem Hereinholen von `claude/friendly-shannon-y8bf90`.** Die Reihen von Remy
und Lou nutzen jetzt das neue Thema `struktur` statt des Ersatzthemas `umwandlung`. Mit allen
Karten von Akt 3 laufen die Kartentests mit: pytest 470 bestanden. `npm run pruefen`: 2411 von
2412, offen bleibt nur der Zähltest der Erinnerungen.

**Entscheidungen (zweiter Push).**

7. _Der Club wartet auf die Versöhnung._ Die Hauptquest läuft streng der Reihe nach. Deshalb
   stellen Tomás und Dot ihre Reihen erst nach der Versöhnung; vorher schickt Tomás den Helden zu
   Mira in den Canyon oder an den Felsbogen. Die Versöhnung wartet auf Miras Stein („noch früh am
   Tag“). So kann kein Schritt verloren gehen.
8. _Ambrose auf Weg 6._ Seine Zeilen vor der Versöhnung hängen an `ambroseSprichtWieder`. Wer die
   Nachfahren ausgelassen hat, hört ihn erst am Felsbogen wieder; die Versöhnung setzt die Variable
   selbst.
9. _Lektion ohne zwei Bildschirme._ Das romantische Opfer erzählt Ambrose mit zwei Stellungen auf
   dem alten Brett und den Fundstellen (Kapitel 1, Abschnitt 1.6; Kapitel 11, Abschnitt 11.2), ohne
   Buchtext. Eine echte Lektion mit zwei Brettern bräuchte ein eigenes Format in der Hülle.
10. _Mentor-Zug nach der Versöhnung._ Die Sperre R29 endet mit `versoehnungGesehen`; die Hülle
    sollte diese Variable für die Freigabe abfragen.
11. _Brief auch ohne Umschlag._ Wer den Umschlag aus Ironwood hat (`gefundenUmschlag`), sieht, dass
    das Siegel passt; ohne ihn geht die Quest trotzdem. Dots Hinweis startet die Quest.
12. _Mama am Bahnsteig._ Für Szene 80 wartet Mama in Desert Springs am Bahnhof; die Abfahrt bietet
    Port Delacroix (für das Schild) und Maple Falls an.

**Fehlt noch (zweiter Push).**

- `funde.json`: `eidechsenhaut`, `nietenCanyonbruecke`, der Gegenstand „Hales Brief“ (Szene 76,
  Wirkung der Quest `desertSprings.brief`); die Aufrufe stehen als Kommentar bereit.
- `laeden.json`: Laden von Mr. Okoro im Antiquariat (Karten, Fahrkarten, alte Bücher).
- Szene 77 „Erinnerung 1858“: Es gibt noch keine Begegnung und keine Stellung (Folgeauftrag mit der
  Engine); Quest und Dialog fehlen deshalb.
- Buck: Die 10 Münzen aus der Bibel fehlen; Ink kann keine Münzen geben, und `begegnungen.json` hat
  für Buck keine Belohnung. Die Startstellung ist Abbildung 1.36, die Bibel nennt 8.44 (bitte prüfen).

## Bericht des vierzehnten Auftrags (Akt 3 in orte.json), zur Nachlese

**Fertig:**

- `orte.json`: sechs Orte nach Abschnitt 19 der Bibel, alle mit `staffel: 2` (Akt 3 gehört zu
  Staffel 2, Dokument 02, 3.1): `wegIronwoodSilicon`, `siliconBay` (Nummer 5),
  `wegSiliconDelacroix`, `portDelacroix` (6), `wegDelacroixDesert`, `desertSprings` (7); Wege mit
  `art: "weg"`, Nummer 0. Muster wie Riverton: Der Ankunftspunkt einer Stadt ist zugleich der
  Übergang zurück auf den Weg (`glasbruecke`, `deich`, `canyon`, mit Dialog), jede Karte bekommt
  ihren eigenen `start`, Türen als Paare mit `karte`, die Weiterreise zum nächsten Weg mit `wenn`
  auf die Clubnadel (`faehre` mit `nadelSiliconBay`, `wuestenzug` mit `nadelPortDelacroix`). Der
  Serverraum ist mit `wenn: serverraumOffen` gesperrt (Szene 56, setzt der Dialog später).
- **Clubs:** Silicon Bay Kapitel 1, 2, 4 (Chef `siliconBay.lin`, Mitglieder Theo, Nova), Port
  Delacroix Kapitel 5, 6 (`portDelacroix.odile`, Remy, Lou), Desert Springs Kapitel 7, 1
  (`desertSprings.mira`, Tomás, Dot); je 15 Minuten und vier Buchübungen aus
  `07_Aufgabenzuordnung.md` (Club 5, 6 „Old Harbor“ = Port Delacroix, 7).
- `gegner.json`: Dr. Lin (E + 460), Miss Odile (E + 520), Mira (E + 580) genau nach dem Bericht von
  mittel-2; der Test für E + 160 + 60 · Clubnummer ist grün.
- `begegnungen.json`: `siliconBay.clubkampf`, `portDelacroix.clubkampf` (`kartenErlaubt: false`,
  Szene 67 ohne Ambrose, R28), `desertSprings.clubkampf`, alle mit `zeit: "wahl"`.
- `texte/de.json`: 34 neue Schlüssel (Orts- und Kartennamen, drei Clubnamen, acht Figurennamen:
  Rosie, Empfangsroboter, Mrs. Kowalczyk, Mr. Guidry, Mrs. Arceneaux, Henri Whitlock-Duval,
  Mrs. Holloway, Mr. Okoro).

Prüfungen: pytest alle (385 bestanden, 85 übersprungen: genau die 17 noch nicht gezeichneten
Karten), Paketbau, Prettier für meine Dateien, `npm run pruefen` (2409 Tests).

**Für niedrig-1: zu zeichnende Karten** (Ebenen `boden`, `waende`, `objekte`, `ausloeser`;
genau ein `start` mit `richtung`; Außen 28 × 20, Innen 16 × 12; Figuren als Objekte mit dem Namen
nach dem Punkt):

| Karte                            | Datei                                          | Größe   | Objekte (Ebene ausloeser)                                                                                                                                 | Figuren                     |
| -------------------------------- | ---------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `wegIronwoodSilicon.raststaette` | `karten/weg-ironwood-silicon-raststaette.json` | 28 × 20 | `start`, `zurueckIronwood`, `tafel`, `fundAnstecker`, `weiterGlasbruecke`                                                                                 | `kowalczyk`                 |
| `wegIronwoodSilicon.glasbruecke` | `karten/weg-ironwood-silicon-glasbruecke.json` | 28 × 20 | `start`, `zurueckRaststaette`, `fundOhrstoepsel`, `weiterSilicon`                                                                                         | `joggerin`                  |
| `siliconBay.aussen`              | `karten/silicon-bay-aussen.json`               | 28 × 20 | `start`, `glasbruecke`, `akademieTuer`, `lobbyTuer`, `hotel`, `busIronwood`, `faehre`                                                                     | `dash`, `rosie`             |
| `siliconBay.akademie`            | `karten/silicon-bay-akademie.json`             | 16 × 12 | `start`, `akademieAusgang`, `serverraumTuer`                                                                                                              | `lin`, `nova`, `theo`       |
| `siliconBay.serverraum`          | `karten/silicon-bay-serverraum.json`           | 16 × 12 | `start`, `serverraumAusgang`, `schummelgeraete`                                                                                                           | –                           |
| `siliconBay.lobby`               | `karten/silicon-bay-lobby.json`                | 16 × 12 | `start`, `lobbyAusgang`, `vitrineHale`                                                                                                                    | `victor`, `empfangsroboter` |
| `wegSiliconDelacroix.faehre`     | `karten/weg-silicon-delacroix-faehre.json`     | 28 × 20 | `start`, `zurueckSilicon`, `tafel`, `fundFlaschenpost`, `weiterDeich`                                                                                     | `schiffskoch`               |
| `wegSiliconDelacroix.deich`      | `karten/weg-silicon-delacroix-deich.json`      | 28 × 20 | `start`, `zurueckFaehre`, `fundMuschel`, `weiterDelacroix`                                                                                                | `guidry`                    |
| `portDelacroix.aussen`           | `karten/port-delacroix-aussen.json`            | 28 × 20 | `start`, `deich`, `turnhalleTuer`, `werkstattTuer`, `musikhausTuer`, `brettHaus1`, `brettHaus2`, `brettHaus3`, `brettHaus4`, `gebaeckstand`, `wuestenzug` | `batiste`, `arceneaux`      |
| `portDelacroix.turnhalle`        | `karten/port-delacroix-turnhalle.json`         | 16 × 12 | `start`, `turnhalleAusgang`                                                                                                                               | `odile`, `remy`, `lou`      |
| `portDelacroix.werkstatt`        | `karten/port-delacroix-werkstatt.json`         | 16 × 12 | `start`, `werkstattAusgang`, `werkbank`                                                                                                                   | `henri`, `celeste`          |
| `portDelacroix.musikhaus`        | `karten/port-delacroix-musikhaus.json`         | 16 × 12 | `start`, `musikhausAusgang`, `schild`                                                                                                                     | –                           |
| `wegDelacroixDesert.canyonpfad`  | `karten/weg-delacroix-desert-canyonpfad.json`  | 28 × 20 | `start`, `zurueckDelacroix`, `tafel`, `fundEidechsenhaut`, `stein`, `weiterFelsbogen`                                                                     | `holloway`                  |
| `wegDelacroixDesert.felsbogen`   | `karten/weg-delacroix-desert-felsbogen.json`   | 28 × 20 | `start`, `zurueckCanyon`, `aussichtspunkt`, `fundNieten`, `weiterDesert`                                                                                  | –                           |
| `desertSprings.aussen`           | `karten/desert-springs-aussen.json`            | 28 × 20 | `start`, `canyon`, `garageTuer`, `antiquariatTuer`, `motel`, `bahnhof`                                                                                    | `buck`                      |
| `desertSprings.garage`           | `karten/desert-springs-garage.json`            | 16 × 12 | `start`, `garageAusgang`                                                                                                                                  | `mira`, `tomas`, `dot`      |
| `desertSprings.antiquariat`      | `karten/desert-springs-antiquariat.json`       | 16 × 12 | `start`, `antiquariatAusgang`                                                                                                                             | `okoro`                     |

Statisten und Tiere (09, 4a) kommen dazu, stehen aber nicht in `orte.json`.

**Für die Dialoge (späterer Auftrag): Knoten, auf die `orte.json` verweist**

- `weg-ironwood-silicon.ink`: `kowalczyk`, `joggerin`, `zurueck_ironwood`, `tafel`, `fund_anstecker`, `fund_ohrstoepsel`
- `silicon-bay-aussen.ink`: `ankunft_zu_fuss`, `dash`, `rosie`, `glasbruecke`, `hotel`, `bus_ironwood`, `faehre`
- `silicon-bay-akademie.ink`: `lin`, `nova`, `theo`, `serverraum_zu`
- `silicon-bay-lobby.ink`: `victor`, `empfangsroboter`, `vitrine`
- `silicon-bay-serverraum.ink`: `schummelgeraete`
- `weg-silicon-delacroix.ink`: `schiffskoch`, `guidry`, `zurueck_silicon`, `tafel`, `fund_flaschenpost`, `fund_muschel`
- `port-delacroix-aussen.ink`: `ankunft_zu_fuss`, `batiste`, `arceneaux`, `deich`, `brett_haus1`, `brett_haus2`, `brett_haus3`, `brett_haus4`, `gebaeckstand`, `wuestenzug`
- `port-delacroix-turnhalle.ink`: `odile`, `remy`, `lou`
- `port-delacroix-werkstatt.ink`: `henri`, `celeste`, `werkbank`
- `port-delacroix-musikhaus.ink`: `schild`
- `weg-delacroix-desert.ink`: `holloway`, `zurueck_delacroix`, `tafel`, `fund_eidechsenhaut`, `mira_stein`, `versoehnung`, `fund_nieten`
- `desert-springs-aussen.ink`: `ankunft_zu_fuss`, `buck`, `canyon`, `motel`, `bahnhof`
- `desert-springs-garage.ink`: `mira`, `tomas`, `dot`
- `desert-springs-antiquariat.ink`: `okoro`

**Befunde und Vorschläge:**

1. **Themen der Aufgabenreihen:** Die Runden kennen nur Taktikmotive, Zusatzthemen und
   `mattbilder` (`anbindung/rundenaufgaben.ts`); Fallen (`falle.json`) und Bauernstrukturen
   (`struktur.json`) fallen still weg. Silicon Bay hat deshalb `haengend`, `gefangen` (Figuren ohne
   Rückzugsfeld, typisch für Fallen), Port Delacroix nur `umwandlung` (Freibauern), Desert Springs
   die Angriffsmotive aus 07. Vorschlag: Die Runden lernen die Trainer Falle und Struktur, dann
   `themen: ["falle"]` bzw. `["kette", "isolani", "mehrheit"]`.
2. **Bus nach Silicon Bay:** `ironwood-aussen.bus_silicon_bay` reist noch nirgends hin; für den ersten
   Weg müsste er nach `wegIronwoodSilicon.raststaette` (Auslöser `start`) fahren (Szene 51/52).
   `wegIronwoodSilicon.zurueckIronwood` führt zurück zu `ironwood.aussen`, Auslöser `busSiliconBay`.
3. **Mira auf dem Stein** (Szene 72) ist auf dem Canyonpfad ein Gegenstand `stein`, weil eine Figur
   nur einem Ort gehört und Mira Clubchefin in Desert Springs ist.
4. **Flashback Werkstatt** (Szene 66): Auslöser `werkbank` in der Werkstatt; der Ort für die
   Sepia-Karte (`erinnerungWerkstatt`) fehlt noch, wie bei London.
5. **Läden** von Rosie, Mrs. Arceneaux (Gebäckstand) und Mr. Okoro stehen noch nicht in
   `laeden.json`; die Figuren und der Auslöser `gebaeckstand` sind vorbereitet.

**Offene Fragen:** keine.
