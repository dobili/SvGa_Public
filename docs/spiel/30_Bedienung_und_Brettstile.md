# 30 Bedienung mit dem Daumen, Querformat, Farben und Brettstile

Stand 14.11.2026. Wünsche des Autors vom selben Tag. Nach Regel 9 gilt alles als geplant und wird
umgesetzt; Widerspruch genügt.

## 1. Grundsatz: alles mit dem Daumen

Das Handy liegt in einer Hand (Hochformat) oder in beiden Händen (Querformat). Was man antippen
muss, liegt dort, wo der Daumen ohnehin ist. Den Zeigefinger braucht man nur am Brett, wenn man
Figuren zieht; auch dort liegen die Knöpfe in Daumennähe.

Daumenzonen:

- **Hochformat:** das untere Drittel des Bildschirms, bei der rechten Hand rechts unten am besten.
  Oben nur, was man liest (Kopf mit Porträt, Ortsname, Meldungen).
- **Querformat:** die linke und die rechte Bildschirmkante, jeweils das mittlere und untere
  Drittel. Die Mitte ist Spielfläche.

## 2. Hochformat

- **Oberwelt:** Joystick unten (seit 26.11.2026 statt des Steuerkreuzes, Wunsch des Autors),
  Aktionsknopf („Sprechen“, „Ansehen“) auf der anderen Seite. In den Einstellungen des Spiels gibt
  es „Joystick rechts“ (Vorgabe, Einhand mit rechts) und „Joystick links“. Menü ☰, Tagebuch 📖,
  Übungspartie ♞ und Reisen 🎫 stehen als kleine Symbolknöpfe (44 px, nur Zeichen, Name als
  zugänglicher Name) in einer Reihe unten links unter dem Aktionsknopf, das Menü außen (Wunsch des
  Autors, 26.11.2026); mit dem Joystick links liegt die Reihe rechts. Im Dialog stehen Tagebuch und
  Menü oben rechts.
- **Joystick** (Joystick.tsx, joystick.ts): fest, nicht schwebend; ein durchscheinender Ring
  (Navy, goldener Rand, 112 px) mit einem Knopf (Creme, 52 px), der dem Daumen bis zum Ring folgt;
  die Fangfläche ist 20 px größer als der Ring. Totzone 15 % des Daumenradius (56 px), acht
  Richtungen in Sektoren zu 45 Grad mit 8 Grad Hysterese; der Held läuft schräg mit derselben
  Geschwindigkeit wie geradeaus und rutscht an Wänden entlang (schraeglauf.ts). Blick für
  Ansprechen, Auslöser und die Kachel vor dem Helden bleibt die vorherrschende Hauptrichtung
  (steuerrichtung.ts), das Laufbild zeigt die Schräge (Bögen mit Schrägen: Held, Heldin, Juno,
  Mama; alle anderen Figuren bleiben bei vier Richtungen). Tastatur: Pfeile oder WASD, zwei
  zugleich ergeben eine Schräge.
- **Rennen draußen** (Wunsch des Autors, 21.11.2026): Steht der Knopf am Ring (ab 80 % des
  Radius, zurück unter 70 %), rennt der Held 1,8-mal so schnell; Tastatur: Umschalttaste. Nur auf
  Außenkarten und nicht auf dem Fahrrad (gangart.ts). Ein Steuerhinweis „Schieb den Joystick bis
  an den Rand, dann rennst du.“ kommt ab Akt 2 beim ersten Mal draußen.
- **Kurze Hinweise** (Steuerhinweis, Meldungen) liegen am Rand fern vom Helden: steht er in der
  oberen Bildhälfte, unten über dem Joystick, sonst oben (heldhaelfte.ts, 20.11.2026).
- **Dialog:** Fenster unten (wie schon), Antwortwahlen als große Knöpfe am unteren Rand, „Weiter“
  ganz unten auf der Seite des Aktionsknopfs. Antippen des Textfensters geht auch weiter.
- **Partie und Rätsel:** Kopf mit Porträt oben, Brett in der Mitte, darunter Sprechblase,
  Kartenfächer und eine Zeile mit den Knöpfen („Ambrose fragen“, „Aufgeben“, „Weiter“). Kein
  Knopf über dem Brett.

## 3. Querformat

- **Oberwelt:** Die Welt füllt den Bildschirm. Der Joystick liegt links unten, halb
  durchsichtig, über der Welt, darunter dieselbe Reihe Symbolknöpfe wie hochkant (Menü am linken
  Rand, also auch quer unten links). Rechts unten liegt der Aktionsknopf. Hinweise stehen ganz
  oben oder unten zwischen Joystick und Aktionsknopf.
- **Dialog:** Porträt links, Textfenster unten über zwei Drittel der Breite; Wahlen und „Weiter“
  rechts in einer Spalte, im Daumenbereich der rechten Hand.
- **Partie:** Brett links in voller Höhe. Rechts eine Spalte: oben Porträt mit Name und Uhr des
  Gegners, darunter die Sprechblase, dann eigene Uhr, Kartenfächer (senkrecht wischbar) und unten
  die Knöpfe. So zieht die linke Hand am Brett, die rechte spielt Karten und tippt Knöpfe.
- **Rätsel:** wie die Partie; Aufgabe, Antwortknöpfe und „Weiter“ in der rechten Spalte.
- **Wechsel:** Drehen des Geräts mitten im Spiel ist erlaubt; nichts geht verloren, die Ansicht
  baut sich neu.

## 4. Ein Farbsystem für alles

Die Schachansichten übernehmen das Farbsystem des Spiels, nicht das der App:

| Rolle        | Farbe             | Verwendung                                   |
| ------------ | ----------------- | -------------------------------------------- |
| Grund        | Navy              | Hintergrund der Hülle, Uhren, Kopf           |
| Fläche       | Creme (Pergament) | Dialogfenster, Karten, Rätseltext            |
| Akzent       | Gold              | Hauptknopf, eigene Uhr, Hervorhebung, Nadeln |
| Stufe leicht | Grün              | Karten, richtige Antwort                     |
| Stufe mittel | Blau              | Karten, Hinweis                              |
| Warnung      | gedämpftes Rot    | falsche Antwort, Zeitnot, Aufgeben-Nachfrage |

- Knöpfe bekommen den Pixelrahmen des Spiels statt der runden App-Knöpfe; der Hauptknopf ist Gold
  auf Navy.
- Überschriften in einer Pixelschrift (Pixelify Sans, SIL Open Font License, im Paket mitgeliefert,
  damit es offline bleibt); Fließtext bleibt in der gut lesbaren Schrift der App mit der
  Schriftgröße des Lesers.
- Rätsel verlieren die weiße Trainerkarte: Aufgabe auf Pergament, Rückmeldung mit Ambroses Porträt
  in der Sprechblase statt grün-roter Kästen, Fortschritt als kleine Reihe von Figuren statt Balken.
- Die Ergebnisblende ist eine Karte des Spiels (Pergament, Pixelrahmen, Porträt des Gegners in der
  passenden Stimmung).

## 5. Brettstile je Ort und Gegner

Das Brett zeigt, wo man ist und gegen wen man spielt. Jeder Ort bekommt einen Stil, einzelne
Gegner dürfen ihn ändern (Feld `brett` in `begegnungen.json`, Vorgabe aus `orte.json`).

| Ort oder Lage           | Brett                         | Figuren        |
| ----------------------- | ----------------------------- | -------------- |
| Dachboden (Ambrose)     | altes Holzbrett, warm         | Pixel, Holz    |
| Maple Falls, Schulclub  | Turnier-Vinyl grün und weiß   | Pixel, Plastik |
| Diner, Straßengegner    | abgegriffenes Holz            | Pixel, Holz    |
| Cedar Creek, Bibliothek | Intarsie Ahorn                | Pixel, Holz    |
| Riverton, Park          | Steintisch grau               | Pixel, Stein   |
| Ironwood                | Stahlplatten, blau angelaufen | Pixel, Metall  |
| Silicon Bay, Konzern    | Glas, kühles Weiß und Cyan    | Pixel, glatt   |
| Port Delacroix          | verwittertes Holz, Salzspuren | Pixel, Holz    |
| Desert Springs          | Sandstein                     | Pixel, Ton     |
| Summit City             | Schiefer                      | Pixel, Stein   |
| Capital Arena           | Turnierbrett, edel            | Pixel, poliert |
| Erinnerungen 1857/1858  | Sepia-Holz                    | Pixel, Sepia   |

- **Pixelfiguren:** ein eigener Satz im Pixelstil des Spiels, abgeleitet vom gemeinfreien Satz
  „Kiefer & Kirsche“ (RhosGFX, CC0) auf ein grobes Raster gerechnet und von Hand nachgebessert;
  Farbvarianten je Material als Tönung, nicht als neue Zeichnung.
- **Bretter:** als Farbpaare mit feiner Pixelstruktur gezeichnet (kein Bild nötig), Rand im
  Pixelrahmen; die drei Materialbretter der App bleiben für besondere Orte.
- **Lesbarkeit:** Markierungen (letzter Zug, Pfeile, Karten wie Fingerzeig) bekommen je Stil eine
  Farbe mit genug Abstand; Blindschach bleibt wie es ist.
- In der App selbst ändert sich nichts; die Wahl des Lesers für Brett und Figuren gilt dort weiter.

## 6. Reihenfolge

1. Farbsystem und Knöpfe in der Hülle (wirkt überall, kleiner Umbau).
2. Hochformat nach Daumenzonen, Einstellung „Joystick links/rechts“ (bis 26.11.2026 Steuerkreuz).
3. Querformat für Oberwelt, Dialog, Partie und Rätsel.
4. Pixelfiguren und Brettstile je Ort.
5. Rätsel ohne Trainerkarte (nach den Anmerkungen des Autors zur Vorschau).

## Spieluhr und Warten (22.11.2026)

Wunsch des Autors: Kinder sollen die Nacht erleben, ohne nachts spielen zu müssen.

- **Uhr:** Spielminuten seit Spielbeginn im Spielstand (`spieluhr`), ein neuer Stand beginnt am
  ersten Morgen um 6 Uhr. Die Uhr läuft nur in freier Oberwelt (nicht in Dialogen, Partien,
  Läden, im Tagebuch, nicht bei geschlossener App). Ein Spieltag dauert 2 echte Stunden: Morgen
  6–9 Uhr 15 Minuten, Tag 9–18 Uhr 50 Minuten, Abend 18–21 Uhr 15 Minuten, Nacht 21–6 Uhr
  40 Minuten (`regeln/spieluhr.ts`, PHASEN). Schnittstelle: `stundeJetzt(stand)`, `phase(stunde)`,
  `spieltag(stand)`.
- **Geschichte geht vor:** `#uhr:abend`, `#uhr:morgen`, `#uhr:nacht`, `#uhr:mittag` oder
  `#uhr:22` in Ink stellt die Uhr auf die nächste solche Zeit (nie zurück). Wo Erzählzeilen eine
  Tageszeit nennen oder `#licht:abend|nacht|tag` setzen, steht ein `#uhr`; Ausnahmen mit Grund
  prüft `python -m pipeline.abenteuer.uhrstellen` (Dauertest „0 Befunde“).
- **Tönung:** draußen Morgendämmerung, Tag ohne, Abend, Nacht; innen ohne, nachts leicht gedämpft;
  weich überblendet beim Stundenwechsel. Dialog, Licht aus orte.json und Tönung der Szene gehen
  vor (`oberwelt/uhrtoenung.ts`).
- **Statisten:** `wann` nach der Spieluhr, nur beim Aufbau einer Karte.
- **Warten:** Spielmenü „Warten …“ bis Morgen (7), Mittag (12), Abend (19), Nacht (22), nur in
  freier Welt; an einer Bank „Ausruhen“ mit derselben Wahl, am Bett im Zimmer des Helden
  „Schlafen bis morgen“. Kurze Abblende, dann wird die Karte neu aufgestellt.
- **Anzeige:** Tageszeitsymbol mit „Tag 2, Abend, 19 Uhr“ im Tagebuch und im Spielmenü.
- **Musik:** `musik_nacht` je Karte in orte.json spielt nachts beim Betreten statt `musik`.
