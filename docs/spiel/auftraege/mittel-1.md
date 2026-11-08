# Auftrag mittel-1: Akt 3 in orte.json, Clubchefs und Clubkämpfe

**Stand:** fertig (Helfer mittel-1, 08.11.2026, vierzehnter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/orte.json` (neue Orte), `inhalte/abenteuer/gegner.json` (nur die
drei Clubchefs), `inhalte/abenteuer/begegnungen.json` (nur die drei Clubkämpfe),
`inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`

## Ziel

Akt 3 steht in der Story-Bibel (Abschnitte 19 und 20), die Gegner stehen in `gegner.json`. Damit
Karten (niedrig-1) und Dialoge folgen können, braucht es die Orte mit festen Kennungen.

## Vorgaben

1. Sechs Orte nach Abschnitt 19: `wegIronwoodSilicon`, `siliconBay` (Nummer 5),
   `wegSiliconDelacroix`, `portDelacroix` (6), `wegDelacroixDesert`, `desertSprings` (7); Wege mit
   `art: "weg"`, Nummer 0. Je Ort die Karten (Kennung `<ort>.<raum>`, Datei
   `karten/<ort-mit-bindestrichen>-<raum>.json`, auch wenn die Datei noch fehlt), Figuren mit
   Dialog-Einstiegen (`<datei>.<knoten>`, die Ink-Dateien kommen später), Auslöser und Übergänge,
   Clubs mit Chef, Mitgliedern und Kapiteln, wie bei Akt 1 und 2.
2. Die drei Clubchefs aus dem Bericht von mittel-2 (`docs/spiel/auftraege/mittel-2.md`, neunter
   Auftrag): Dr. Lin, Miss Odile, Mira, Stärke genau E + 160 + 60 · Clubnummer, und ihre Clubkämpfe
   mit `zeit: "wahl"`.
3. Fehlen Karten-Dateien, darf die Pipeline das melden; dann im Bericht die Liste der Dateien und
   Objektnamen, die niedrig-1 zeichnen soll. Was der Kartentest sonst verlangt (etwa `start`), mit
   aufnehmen.

## Bericht

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
