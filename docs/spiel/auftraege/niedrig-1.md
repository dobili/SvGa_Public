# Auftrag niedrig-1: Maple Falls und Cedar Creek beleben (Statisten, Tiere, Dinge zum Ansehen)

**Stand:** fertig (niedrig-1, 08.11.2026; Kartentest wartet auf mittel-1)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-aufgabenzuordnung`), bitte frisch auf
`origin/claude/friendly-shannon-y8bf90` aufsetzen (dein Zweig hat die Statisten der Route wieder
entfernt; der Hauptzweig hat sie, und der Kartentest überspringt `type` statist/tier)
**Darf ändern:** alle Karten in `inhalte/abenteuer/karten/` von Maple Falls und Cedar Creek,
`docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q`, in `app/`
`npx prettier --check ../inhalte/abenteuer` und `node skripte/baue-abenteuerpaket.mjs`

## Ziel

Die neun Karten der beiden Städte nach 09 lebendig machen, wie du es bei der Route schon getan hast.

## Vorgaben

1. **Außenkarten** (`maple-falls-aussen`, `maple-falls-park`, `cedar-creek-aussen`): je mindestens
   zwei Tiere und zwei Statisten nach Abschnitt 4 und 4a (`type` tier/statist mit `von`, `bis`,
   `tun`, `wann`, `verhalten` wie auf der Route), Laufwege frei.
2. **Innenräume:** Objekte zum Ansehen mit genau diesen Namen (`type` ausloeser, Kollision oder
   freies Nachbarfeld, mittel-1 trägt sie gleichzeitig in `orte.json` ein): Wohnzimmer
   `fotoGrandma`, `kartonKueche`, `pizzakarton`; Dachboden `hutschachtel`, `spiegel`,
   `zeitungen1961`; Clubraum `pokalvitrine`, `brettOhneDame`, `plakatZaehlen`; Bibliothek
   `zeitungsregal`, `globus`, `schildFluestern`; Archiv `boxerfoto`, `wasserfleck`; Waschsalon
   `zettelTurm`, `comicheft`, `automat`. Dazu je Innenraum ein Statist, wo es passt (Kellnerin,
   Leserin, Mr. Boateng ist schon Figur).
3. Bis mittel-1 fertig ist, scheitert dein Kartentest an den neuen Namen („fehlt in orte.json“).
   Dann bitte die Karten trotzdem pushen und im Bericht vermerken; der Haupt-Chat führt beide
   zusammen.
4. Checkliste aus Abschnitt 6 je Karte im Bericht abhaken.

## Was nicht dazugehört

Neue Karten, Grafik, `orte.json`.

## Bericht

(vom Helfer auszufüllen)

Zweig: `abenteuer-aufgabenzuordnung`, frisch auf `c84d3af9` aufgesetzt. Ein Force-Push war nicht
erlaubt; der alte Zweigstand ist deshalb per `git merge -s ours` angehängt, sein Inhalt (das
Entfernen der Statisten auf der Route) ist verworfen. Alle Positionen von Hand gesetzt und per
Skript geprüft: Objekte zum Ansehen auf freier Kachel oder auf Kollision mit erreichbarem
Nachbarfeld; Laufwege nur über von `start` erreichbare Felder; keine zwei Objekte auf einer Kachel.

- maple-falls-wohnzimmer: `fotoGrandma` (2,0 Wand), `kartonKueche` (12,2 Kiste), `pizzakarton`
  (9,7 Boden); kein Statist (Mama ist Figur).
- maple-falls-dachboden: `hutschachtel` (2,1 Kiste), `spiegel` (11,5 Wand), `zeitungen1961`
  (9,8 Kiste); kein Statist.
- maple-falls-clubraum: `pokalvitrine` (2,1 Pokale), `brettOhneDame` (9,8 Brett), `plakatZaehlen`
  (0,6 Wand); Statist `schuelerin` (räumt Figuren ein).
- maple-falls-aussen: `brieftraegerin` (morgen), `laubharker`, `kindMitBall`; `eichhoernchen`
  (ausweichen), `katze` (sitzen).
- maple-falls-park: `rentner` (auf der Bank), `kioskbesucher`; `enten` (folgen), `kraehen` (fliegen).
- cedar-creek-aussen: `busfahrer`, `stegbauer`; `hund` (folgen, vor dem Waschsalon), `reiher`
  (sitzen), `eichelhaeher` (morgen, fliegen).
- cedar-creek-bibliothek: `zeitungsregal` (6,3 Regal), `globus` (13,6 Boden), `schildFluestern`
  (0,4 Wand); Statist `leserin`.
- cedar-creek-archiv: `boxerfoto` (13,4 Wand), `wasserfleck` (6,9 Wand); kein Statist.
- cedar-creek-waschsalon: `zettelTurm` (11,3 Wand), `comicheft` (6,4 Stuhl), `automat` (10,7);
  Statist `kundin`.

Prüfungen: Prettier und Paketbau sauber. Pytest: 296 bestanden, 7 erwartet fehlgeschlagen
(Vorgabe 3): `test_ausloeser_und_figuren_erklaert` für die sechs Innenräume und
`test_ink_szene_und_tiled_karte_liegen_bereit`, alle nur wegen der 17 neuen Namen, die mittel-1
in `orte.json` einträgt.

Checkliste Abschnitt 6 (für alle neun Karten gleich, die Platzhalter begrenzen es):

- [x] Größe und Rand unverändert.
- [x] Außen vier bewegte Dinge: je zwei bis drei Tiere und Statisten; die animierte Kachel
      (Wasserfall, Flagge, Bach, Neon) fehlt mangels Grafik.
- [x] Innen drei Dinge zum Ansehen (Archiv zwei wie vorgegeben, dazu das Programmheft); mit
      Schachbezug: `brettOhneDame`, `plakatZaehlen`, `zettelTurm`, `wasserfleck` (Springer).
- [ ] Geräusch und Musik in `orte.json`: für mich gesperrt.
- [ ] Tönung (`toenung`): kommt mit der Grafik.
- [ ] Matten, Vordächer, hellere Wege: Wege sind Teppichkacheln, Matten fehlen im Platzhaltersatz.
- [ ] Spur einer Quest (Ebene `objekte` mit Bedingung): braucht die Technik aus Abschnitt 7.
- [x] Figuren an ihren Orten aus der Bibel (unverändert).
