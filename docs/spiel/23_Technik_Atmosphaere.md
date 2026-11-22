# Technik für Atmosphäre (T1 bis T10)

Stand 13.11.2026, mittel-2. Grundlage: `19_Ton_und_Spannungsbogen.md` Abschnitt 8,
`roman/akt1_befunde.md` Abschnitte 2 und 3, Randnotizen [Klang], [Bild], [Karte] im Roman.
Karten und Kartenzeichner bleiben unberührt; alles hier ist Technik in der App und Datenformat.

## 1. Was es heute gibt

| Was                                  | Stand                                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dialogmarken                         | `dialog/geschichte.ts` liest alle Marken (`name:wert`, ohne Wert „ja“). Ausgewertet wird nur `#sprecher` und `#stimmung` (Porträt, nur „jung“).          |
| `#pause` (49-mal), `#klang` (14-mal) | stehen in den Dialogen, **die App tut damit nichts**.                                                                                                    |
| Musikfeld                            | `orte.json`, je Karte `musik` (5 Karten, Schema `musik/<name>.(ogg\|m4a)`). Kein Code liest es, es gibt keine Datei.                                     |
| Tonerzeugung                         | `app/ton.ts`: Zugtöne aus Web Audio ohne Dateien, Einstellung „ton“ (an/aus, Vorgabe aus), Entsperren nach dem ersten Tipp (iPhone).                     |
| Paket                                | Dateigruppen `musik` und `klang` sind vorgesehen (`schnittstelle/paket.ts`), höchstens 15 MB je Datei, eigener Cache außerhalb des Precache, offline da. |
| Licht                                | `oberwelt/toenung.ts`: Schleier nebel, dunst, nacht, abend, serverblau, sepia, dunkel; Szene `toenung`, Dialog `setzeToenung(name)`. Ohne Übergang.      |
| Porträts                             | `portraets/<sprecher>.svg`, Fassung nur `-jung`.                                                                                                         |

## 2. Grundsätze

- **Ohne Tondatei fehlerfrei.** Jede Ton- und Bildangabe ist ein Wunsch: Fehlt die Datei im Paket,
  bleibt es still (oder ohne Bild), ohne Meldung, ohne Fehler im Protokoll. Heute gibt es keine
  einzige Tondatei, und so bleibt das Spiel spielbar.
- **Abschaltbar.** Eigene Einstellungen für das Abenteuer: Musik (Lautstärke 0 bis 100 %),
  Geräusche (Lautstärke) und ein Stummschalter. Vorgabe: Musik 60 %, Geräusche 80 %, nicht stumm,
  aber nur wirksam, wenn der allgemeine Schalter „Ton“ der App an ist (am iPhone nötig). Im
  Spielmenü des Abenteuers und in den Einstellungen der App.
- **Offline und Größe.** Ton kommt nur aus dem Paket (Gruppen `musik`, `klang`), also offline.
  Format **m4a (AAC)**: Safari auf älteren iPhones spielt kein ogg. Musik als Schleife von 1 bis 2
  Minuten, 96 kbit/s, Stereo: etwa 0,7 bis 1,5 MB je Stück; Geräusche Mono, kurz, unter 100 KB.
  Für Akt 1 etwa 12 Stücke und 30 Geräusche: rund 15 MB. Musik wird als letzte Gruppe geladen.
- **Schlüssel statt Pfade.** Im Dialog stehen Kennungen (`#musik:ambrose`), die App macht daraus
  `musik/ambrose.m4a`. So ändert sich bei einem Formatwechsel keine einzige Dialogzeile.
- **Reine Logik getrennt.** Was spielen soll, entscheidet reine, getestete Logik
  (`ton/tonplan.ts`); das Abspielen mit Web Audio ist eine dünne Schicht darüber.

## 3. Die Punkte

### T3 Pause mit Dauer (klein, zuerst)

- **Fehlt:** `#pause` wirkt gar nicht.
- **Format:** `#pause` = 1 Sekunde, `#pause:3` = 3 Sekunden (Kommazahl erlaubt, höchstens 10).
- **Wirkung:** Die Zeile erscheint, der Knopf „Weiter“ ist für die Dauer gesperrt und blendet dann
  ein. Ein Tipp auf die Zeile vorher tut nichts (die Pause soll wirken). Ohne Ton genauso.
- **Dateien:** `dialog/dialogtakt.ts` (neu, Dauer aus den Marken), `dialog/Dialog.tsx`, Test.

### T1 und T2 Musik und Geräusche (mittel)

- **Fehlt:** Abspielen überhaupt, Ein- und Ausblenden, Lautstärke, Stumm.
- **Formate:**
  - Karte: `orte.json` `musik` (vorhanden) und neu `geraeusch` (Dauergeräusch, Schleife),
    `klang/<name>.(ogg|m4a)`. Fehlt `musik` an der Karte, gilt keine Musik (nicht die des Ortes:
    Innenräume sollen still sein dürfen).
  - Dialog: `#musik:kennung` (wechselt mit Überblendung), `#musik:aus` (blendet aus, zwei
    Sekunden), `#musik:karte` (zurück zur Musik der Karte); `#klang:kennung` spielt ein Geräusch
    einmal; `#geraeusch:kennung` und `#geraeusch:aus` für ein Dauergeräusch während der Szene.
  - Nach dem Dialog gilt wieder, was die Karte vorgibt (außer die letzte Marke war
    `#musik:bleibt`, für eine Musik, die über den Kartenwechsel geht).
- **Ablauf:** Kartenwechsel → Musik der neuen Karte blendet über (1,5 s aus, 1,5 s ein); gleiche
  Musik läuft ohne Unterbrechung weiter. Partie: Musik der Begegnung (`musik` in
  `begegnungen.json`, neu) oder leiser weiter.
- **Dateien:** `ton/tonplan.ts` (rein: was soll laufen), `ton/tonspieler.ts` (Web Audio, Gain je
  Spur, Überblenden, Puffer aus dem Paket), `ton/tonstand.ts` (Einstellungen),
  Anbindung in Oberwelt und Dialog, Einstellungszeilen, Schema `abenteuer-orte`.

### T7 Großansicht eines Bildes (klein)

- **Format:** `#bild:kennung` → `bilder/<kennung>.webp` im Paket (Gruppe grafik). Das Bild liegt
  groß über dem Dialog, die Zeile darunter; „Weiter“ schließt es. `#bild:aus` schließt früher.
- **Fehlt die Datei:** keine Großansicht, die Zeile erscheint normal.
- **Dateien:** `dialog/Grossansicht.tsx` (neu), `Dialog.tsx`, CSS, Test.

### T5 Dialog mitten in einer Partie (mittel)

- **Format** in `begegnungen.json` je Begegnung:
  ```json
  "momente": [
    { "wenn": { "zug": 12 }, "sprecher": "ambrose", "text": "moment.clubkampf.zaehl", "klang": "herzschlag" },
    { "wenn": { "merkmal": "schachGegen" }, "sprecher": "ambrose", "text": "moment.okafor.lassMich", "musik": "aus" }
  ]
  ```
  `zug` ist die Nummer des Zugs des Helden (1, 2, …). Merkmale (einfach, aus der Stellung nach
  dem Zug lesbar): `schachGegen` (der Held steht im Schach), `schachGegeben`, `damenTausch`,
  `materialMinus3` (der Held liegt drei Bauerneinheiten zurück), `geschlagen:<figur>`. Jeder
  Moment kommt höchstens einmal je Partie.
- **Wirkung:** Eine Sprechzeile mit Porträt über dem Brett, sie blockiert das Brett nicht und
  verschwindet nach Tipp oder nach einer Lesedauer. Die Engine rechnet weiter; der nächste Zug des
  Gegners wartet nicht. Texte aus den Spieltexten (übersetzbar), keine Ink-Datei nötig.
- **Dateien:** `regeln/partiemomente.ts` (rein: welcher Moment ist fällig), `anbindung/Momentzeile.tsx`,
  Anbindung in `PartieHuelle.tsx`, Schema `abenteuer-begegnungen`, Test.

### T6 Lichtstimmung (mittel)

- **Vorhanden:** Schleier und `setzeToenung`.
- **Neu:**
  - `licht` je Karte in `orte.json` (`tag`, `abend`, `nacht`, `nebel`, sonst wie `toenung`) und je
    Zustand (`licht_zustaende`: Bedingung → Licht), ohne die Szene des Kartenbauers anzufassen;
    die Szene darf ihre `toenung` weiter selbst setzen, `licht` aus `orte.json` geht vor.
  - Dialogmarke `#licht:abend` (für die Szene, danach zurück) und Übergang: Der Schleier blendet
    in zwei Sekunden um statt zu springen. `tag` heißt: kein Schleier.
- **Dateien:** `oberwelt/toenung.ts`, `oberwelt/toenungsschicht.ts`, `weltdaten.ts`, Schema, Test.

### T9 Figur ein- und ausblenden (klein)

- **Porträt im Dialog:** `#erscheint` blendet das Porträt in zwei Sekunden ein, `#geist` zeigt es
  halb durchsichtig (Ambrose im Kapitel 2).
- **Figur auf der Karte:** `#figur:<name>:aus`, `#figur:<name>:ein`, `#figur:<name>:halb` blenden
  eine Figur der aktuellen Karte in einer Sekunde aus, ein oder auf halbe Deckkraft (nur während
  des Besuchs, nicht im Spielstand).
- **Dateien:** `dialog/Portraet.tsx`, `oberwelt/szene.ts` (Figuren), Wirkung aus der Oberwelt.

### T11 Geführte Wege (fertig, 20.11.2026)

Figuren, auch der Held, gehen einen Weg, den der Dialog vorgibt; der Spieler greift nicht ein.

- `#gehe:<wer>><ziel>`: Ziel ist eine Figur der Karte (der Weg endet neben ihr, mit Blick auf sie),
  ein Auslöser der Karte (etwa `haustuer`) oder ein Feld `x,y`. `wer` ist `held` oder der Name einer
  Figur auf der Karte. Mehrere `#gehe` in einer Zeile laufen zugleich.
- `#gehe:<wer>><ziel>>rennt` (21.11.2026): Die Figur rennt, doppelt so schnell und mit der
  Rennanimation (Reihe 6 des Figurenbogens, sonst die Laufbilder mit höherer Bildrate). Gilt für
  andere Figuren; der Held geht auch dann in seinem Tempo. Eine Sitzende steht dazu auf.
- `#stelle:<wer>><x,y>>liegt`: sofort dorthin, liegend (im Bett); ohne `>liegt` stehend. Liegend
  zeigt die Figur ihr Liegebild aus dem Bogen (Kopf zur Seite des Betts), sonst das gekippte
  Standbild. `#stelle` vor `#gehe` in derselben Zeile: erst versetzen, dann losgehen (Kira kommt
  vom Bus gerannt).
- Die Zeile wartet, bis alle angekommen sind: „Weiter“ und die Wahlen sind so lange gesperrt.
  Kamera, Laufanimation und Kollision laufen wie beim Spieler; der Weg folgt den Kacheln (kürzester
  Weg um Wände, Möbel und andere Figuren).
- Neuladen mitten im Weg: Der Spielstand hat schon das Ziel als Position, der Held steht danach dort.
  Andere Figuren stehen nach dem Neuladen wieder an ihrem Platz auf der Karte (nichts im Spielstand).
- Am Ende des Dialogs steht ein liegender Held neben dem Bett auf.
- Warum `>` und nicht `->`: Ink liest `->` auch in einem Tag als Sprung.
- **Beispiele:** erste Nacht im Zimmer (Bett, dann zu Ambrose ans Fenster), Einleitung (Mama geht zur
  Haustür, der Held folgt), Victor zu Nova und Mama zum Helden in der Arena, Teague im Museum,
  Dr. Lin in der Akademie, Mama zum Fenster im Wohnzimmer. Rennen: Victor durch den Mittelgang und Juno in den
  Helden hinein (Arena, Finale), Kira vom Bus (Hochebene), Tessa an der Landstraße (heran und
  wieder weg). Nicht in der Hütte von Summit City: Dort rennt Victor draußen, unsichtbar.
- **Statisten** mit `"verhalten": "rennen"` in den Eigenschaften rennen auch (bisher nur Tiere):
  Kinder zwischen den Fahnenmasten vor der Arena (`kindA`, `kindB`).
- **Dateien:** `oberwelt/gefuehrterweg.ts` (Tags, Wegsuche), `oberwelt/fuehrungsschicht.ts`
  (Szene), `oberwelt/useBuehne.ts` (Dialog wartet), Tests `tests/e2e/abenteuer-gefuehrt.spec.ts`
  und `tests/e2e/abenteuer-rennen.spec.ts`.

### T12 Zuwendung (fertig, 22.11.2026)

Wunsch des Autors: „Spricht man mit einer Figur, sollte sie einen anschauen, sich zu einem drehen.“

- Beim Ansprechen dreht sich die Figur zum Helden; die größere Achse zwischen beiden entscheidet.
  Im Gespräch dreht sich, wer spricht (`#sprecher`), wenn er auf der Karte steht. Die anderen
  bleiben, wie sie stehen: Sie hören zu, statt bei jeder Zeile hin und her zu drehen.
- Nach dem Gespräch dreht sich jede gedrehte Figur nach einer Sekunde in ihre alte Richtung
  (`blick` der Szene) zurück; die Grundrichtung (R008, `blickrichtung.py`) bleibt also.
- Nicht gedreht werden Sitzende (ihr Bild gehört zum Möbel), Liegende und Figuren in einem
  geführten Weg (dort bestimmt der Weg die Richtung; danach gilt die neue).
- Statisten, die zuhören (der Held steht still vor ihnen), schauen ihn an und gehen danach weiter.
- **Dateien:** `oberwelt/zuwendung.ts` (Regeln), `oberwelt/zuwendungsschicht.ts` (Szene),
  `useAusloeser.ts` (Ansprechen), `useBuehne.ts` (Sprecher, Ende), `belebungsbewegung.ts`
  (Statisten); Tests `zuwendung.test.ts`, `tests/e2e/abenteuer-zuwendung.spec.ts`.

### T4 Porträtfassungen (nur Format)

- `#stimmung:<fassung>` mit den neuen Fassungen `ertappt`, `riss`, `alt`, `lachtOhneSpott`,
  `muede` → `portraets/<sprecher>-<fassung>.svg` (kebab: `lacht-ohne-spott`). Fehlt die Datei,
  zeigt das Porträt die Grundfassung. Die Liste steht in `dialog/portraetpfad.ts`. Bilder: Gemini.

### T8 Teilchen (nur Plan)

- Phaser-Partikel je Karte oder Szene: `staub` (langsam drehend im Lichtstreifen), `sternschnuppen`
  (kurze Striche, selten), `nebel` (ziehende Schwaden). Angabe `teilchen` in `orte.json` und
  `#teilchen:staub` im Dialog. Ein Bild je Teilchen (4 × 4 Pixel), Anzahl je Gerät begrenzt
  (Handy: höchstens 40). Aufwand mittel; nach T6, weil es dieselbe Schicht nutzt.

### T10 Sepia-Rahmen für Dialoge (nur Plan)

- `#erinnerung` an einer Zeile bis `#erinnerung:aus`: Dialogfenster mit Sepia-Filter und dem Rahmen
  der Erinnerungskarten (`anbindung/ErinnerungsRunde.tsx` hat ihn schon), dazu die Karte in Sepia
  (Tönung `sepia` gibt es). Aufwand klein; nach T7.

## 4. Reihenfolge und Aufwand

| Schritt | Punkte                     | Aufwand | Grund für die Stelle                                                |
| ------- | -------------------------- | ------- | ------------------------------------------------------------------- |
| a       | T3                         | klein   | wirkt sofort auf 49 vorhandene Marken                               |
| b       | T1, T2                     | mittel  | größte Wirkung; Datenformat steht, damit Musik bestellt werden kann |
| c       | T7                         | klein   | braucht nur das Paket                                               |
| d       | T5                         | mittel  | Kapitel 8, 9, 15 hängen daran                                       |
| e       | T6, T9 (und T4 als Format) | mittel  | baut auf der vorhandenen Tönung auf                                 |
| später  | T8, T10                    | mittel  | nur geplant                                                         |

Jeder Schritt ist für sich lauffähig, mit Tests, `npm run pruefen` grün, eigener Commit.

## 5. Was andere liefern müssen

- **Musik und Geräusche** (Liste je Kapitel in `roman/akt1_befunde.md` Abschnitt 2): Dateien als
  m4a in `musik/` und `klang/` des privaten Repositorys; Kennungen wie in den Dialogmarken.
- **Bilder für die Großansicht** (Zeitung 1858, Foto der Bildschirmtische, Sternenhimmel) als
  `bilder/<kennung>.webp`, höchstens 1024 Pixel breit.
- **Porträtfassungen** (T4) und die Dialogmarken selbst (Ton, Pause, Licht in den Ink-Dateien)
  setzt, wer die Dialoge schreibt.

## 6. Stand (13.11.2026)

| Schritt | Punkte     | Stand                                                                                        |
| ------- | ---------- | -------------------------------------------------------------------------------------------- |
| a       | T3         | fertig: `#pause:3` (dialog/dialogtakt.ts)                                                    |
| b       | T1, T2     | fertig: Tonregie, Regler im Spielmenü, `geraeusch` in orte.json                              |
| c       | T7         | fertig: `#bild:kennung` (dialog/Grossansicht.tsx)                                            |
| d       | T5         | fertig: `momente` in begegnungen.json (regeln/partiemomente.ts)                              |
| e       | T6, T9, T4 | fertig: `licht`, `licht_zustaende`, `#licht`, `#figur`, `#erscheint`/`#geist`, Fassungsnamen |
| später  | T8, T10    | fertig (13.11. abends): `teilchen`, `#teilchen`, `#erinnerung`                               |

Abweichungen vom Plan: Das Licht eines Dialogs (`#licht`) gilt bis zum Dialogende, nicht nur für
eine Zeile. Eine ausgeblendete Figur (`#figur:<name>:aus`) sperrt den Weg nicht mehr; ansprechen
lässt sie sich weiter, bis die Karte neu geladen wird. Partiemomente kommen ohne Speicher aus,
weil sie allein aus dem Partieverlauf folgen.

## 7. Weitere Punkte (Roman Akt 2 bis 4 und Helfer, 13.11.2026 nachmittags)

Quellen: `roman/akt2_befunde.md` Abschnitt 5 (T11 bis T15), `akt3_befunde.md` Abschnitt 6 (T16
bis T21), `akt4_befunde.md` Abschnitt 6 (T22 bis T28); Steckbrief-Freitext von mittel-3.

### Jetzt (für Akt 1 oder schon bestellt)

**f) T11 Geführter Moment als Ink-Dialog in der Partie** (mittel). Erweitert T5:

- Ein Moment trägt statt `text` einen `dialog` (`datei.knoten`, wie bei Figuren). Dann öffnet die
  Spielhülle den Dialog über dem Brett, mit Wahlen; die Uhr des Helden hält an, solange er offen
  ist (der Gegner „hält sichtbar inne“), die Engine rechnet nicht, weil der Held am Zug ist.
  Variablen des Dialogs gehen in den Spielstand wie in der Oberwelt. Der Dialog führt keinen Zug
  aus.
- `wenn` darf Bedingungen verbinden (alle müssen gelten): `zug`, `merkmal`, neu `uhrUnter`
  (Sekunden auf der Uhr des Helden), `abZug` (frühestens ab diesem Zug des Helden).
- Neue Merkmale, geprüft in der Stellung, in der der Held am Zug ist (also bevor er zieht):
  - `koeder`: Der Held kann einen Bauern schlagen, und danach setzt der Gegner in höchstens zwei
    Zügen matt (schach/mattsuche.ts). Fall Mrs. Okafor, Grundreihe (Kapitel 15).
  - `turmopfer`: Ein Turm des Helden kann auf ein Feld neben dem gegnerischen König ziehen oder
    dort schlagen und ginge dabei nach dem Abtausch verloren (schach/abtausch.ts). Ob das Opfer
    korrekt wäre, prüft die App nicht; der Roman will gerade den Zweifel.
- Erster Anwendungsfall: `cedarCreek.clubkampf` mit `cedar-creek-bibliothek.clubkampf_bauer`
  (`koeder`, ab Zug 12) und `clubkampf_lass_mich` (`turmopfer` und `uhrUnter: 240`). Die Knoten
  liegen auf dem Zweig von mittel-3; der Eintrag in `begegnungen.json` kommt, sobald die Zweige
  zusammengeführt sind (die Prüfung verlangt, dass es den Knoten gibt).

**g) Steckbriefzeile mit freiem Text** (klein): neue Zeilenart `text` in `gegner.json`
(`{"art": "text", "wert": "steckbrief.okafor.lagos"}`), der Wert ist ein Textschlüssel der
Spieltexte; Schema, Clubtagebuch und Lupe zeigen den Satz, pytest prüft den Schlüssel. Erste Zeile:
Mrs. Okafor.

**h) T28 Klangquelle mit Reichweite** (mittel): `klangquellen` je Karte in `orte.json`:
`{"objekt": "rosiesWagen", "musik": "rosie", "reichweite": 20}`. Das Objekt ist eine Figur oder
ein Auslöser der Karte (Name in Tiled), so bleibt die Karte unberührt. Die Lautstärke folgt dem
Abstand des Helden (voll bis zur halben Reichweite, dann linear bis still); die Kartenmusik wird
im selben Maß leiser. Eine eigene Spur der Tonregie; ohne Datei still.

**h2) Räumliche Geräusche** (Auftrag des Hauptchats, 22.11.2026): Das Dauergeräusch einer Karte
liegt auf einem Grundpegel von −11 dB gegenüber der Datei. Mit den Reglern der Grundeinstellung
(Musik 60 %, Geräusche 80 %) sind das gut 12 dB unter der Musik (gemessen: Musik −20,3 dB,
Wasserfall −23,8 dB mittlere Lautheit). Beim Betreten einer Karte mit anderem Geräusch schwillt es
3,5 s auf den Pegel der Datei an und sinkt in 3 s weich zurück. Auf Wegen mit demselben Geräusch
(Park und Birch Lane) schwillt nichts an. In der Nähe einer Quelle wird es lauter: voll bis
2 Kacheln, still ab 12, dazwischen eine Kosinuskurve. Mehrere Stellen gleicher Art addieren sich
nicht, das Größere aus Nähe und Ankunft zählt. Die Quellen leitet
`pipeline/abenteuer/geraeuschquellen.py` aus der Szene ab: Wasserkacheln bei Fluss, Bach, Meer;
Möbel nach Namen wie Wasserfall, Brunnen, Turmuhr. Der Kartenbau schreibt sie als Eigenschaft
`geraeuschquellen` in die Tiled-Karte, die App lädt keine weitere Datei. Von Hand in der Szene:
`"geraeuschquellen": false` oder `{"ohne": […], "dazu": […]}`. Die App
(`ton/geraeuschraum.ts`, `ton/raumregie.ts`) rechnet höchstens alle 100 ms; Web Audio glättet
(Zeitkonstante 0,25 s). Einzelne Geräusche aus Zeilen (`#klang`) laufen am Raumpegel vorbei.
Hörprobe: `python -m pipeline.abenteuer.ton.raumprobe TONORDNER ZIEL`.

**h3) Musik in Spuren** (Klangplan A0.1 und A0.6, Auftrag des Hauptchats, 22.11.2026): Ein
Ortsthema kann aus bis zu drei Spuren gleicher Länge bestehen: Grund (Begleitung und Bass), Melodie
und Zusatz (Mono: Musiker, Jukebox, Steigerung).

- **Vertrag mit der Pipeline:** `musik/spuren.json` im Paket, je Stamm
  `{"proben": Abtastwerte, "rate": 44100, "spuren": ["grund", "melodie", "zusatz"], "zusatz": "musiker",
"lufs": {"grund": -24.1, "grund+melodie": -18.3}}`. `zusatz` ist musiker, jukebox, steigerung
  oder farbe; „steigerung“ (oder `"kampf": true`) macht ein Kampfthema, `lufs` ist freiwillig.
  Statt `proben` geht auch `form`. Die Dateien heißen
  `musik/<stamm>.<spur>.m4a` (etwa `musik/maple-falls.grund.m4a`). orte.json und die Marken
  `#musik` bleiben unverändert. Steht ein Stück nicht in der Tabelle oder fehlt sein Grund, spielt
  die volle Mischung `musik/<stamm>.m4a` wie bisher.
- **Abspielen** (`ton/spurenspieler.ts`): Alle Spuren starten im selben Augenblick und schleifen mit
  `loopStart`/`loopEnd` über die Form. Enthält der Puffer den AAC-Vorlauf (2112 Werte, Safari),
  beginnt die Schleife danach.
- **Mischungen** (`ton/spurenmischung.ts`):
  - Tag: Grund und Melodie. Innenraum: dieselben, 2 dB leiser (−20 LUFS).
  - Nacht: eigenes Stück über `musik_nacht`.
  - Ausdünnen: nach 2 bis 3 vollen Schleifen (mindestens 2 Minuten) eine Schleife nur der Grund,
    dann wieder voll. Gezählt wird ab dem Betreten der Karte.
  - Musiker nah: Zusatz nach der Abstandskurve der räumlichen Geräusche. Die Quellen stehen als Art
    `musik` in der Karteneigenschaft `geraeuschquellen`: jede Jukebox und was die Szene unter
    `musikquellen` nennt.
  - Steigerung bei `kampf`: Grund, nach dem ersten Sieg (Partie oder Runde) die Melodie, nach dem
    zweiten der Zusatz (`ton/mischregie.ts`).
  - Pegel: Jede Mischung wird auf −18 LUFS angehoben, gemessen (`lufs`) oder ohne Messung nur der
    Grund +5 dB; höchstens +8 dB.
- **Dialog:** Unter Dialogzeilen klingt alle Musik 3 dB leiser (Zeitkonstante 0,4 s).
- **Speicher:** Drei Spuren (zwei Stereo, eine Mono) liegen bei 50 s dekodiert bei etwa 48 MB.
  Beim Überblenden zweier Orte sind es 1,5 s lang etwa 96 MB; danach vergisst der Vorrat die
  Spuren des alten Orts sofort (`ton/musikspuren.ts`). Das Vorabladen der Nachbarkarten legt die
  Spurdateien in den Cache, nicht die volle Mischung.
- **Tonmesser:** `globalThis.__tonmesser()` meldet Musik, Pegel je Spur, Dialog, Raumpegel und Lage
  der Mischung (Oberflächentest `abenteuer-musikspuren.spec.ts`).

**i) T15 Fensterbank zeigt Funde** (klein): Ink-Funktion `zeigeFensterbank()` öffnet eine Ansicht
mit allen Funden des Spielstands (Bild aus funde.json, sonst Name), in der Reihenfolge des
Findens. Die Fensterbank im Zimmer des Helden ruft sie aus ihrem Dialog auf; keine Kartenänderung.

### Später (nur geplant)

| Nr. | Was                                                        | Weg                                                                                      |
| --- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| T12 | Gegnerprofil ändert sich mitten in der Partie              | wie `abgelenktAb` (Halbzug → Faktor), erweitert um Stufe und Bedenkzeit                  |
| T13 | Klang und Bild blenden in eine Erinnerung über             | `#musik` mit Überblendung (gibt es) plus Sepia-Übergang aus T10                          |
| T14 | Wetter als Zustand der Karte                               | `licht_zustaende` (gibt es) plus Teilchen aus T8 (`regen`, `schnee`; Schneefall gibt es) |
| T16 | Begleiter blasser oder fehlt                               | `#geist` (gibt es) als Dialogvariable je Zustand, Porträt liest sie                      |
| T17 | Karten im Menü gesperrt und grau, mit Grund                | Bedingung je Karte in der Deckwahl, Grund als Textschlüssel                              |
| T18 | Gegenstand zeitweise nicht im Inventar                     | Dialogvariable `verwahrt.<ding>`, Inventar blendet aus                                   |
| T19 | Wahl mitten in einer Partie mit Wirkung auf den Gegner     | f) plus Ink-Funktion `setzeGegnerzustand(faktor, halbzuege)`                             |
| T20 | Licht ändert sich in Stufen in einer Szene                 | `#licht` (gibt es) Zeile für Zeile, mit Umblenden                                        |
| T21 | Langer Brief als Großansicht in Handschrift                | `#brief:textschluessel` wie `#bild`, Schrift aus dem Paket                               |
| T22 | Sättigung einer Karte in Stufen                            | CSS-Filter `saturate` über `#licht`-Werte `farbe1` bis `farbe4`                          |
| T23 | Zuschauerpartie mit Geräuschen und Kommentar               | Vorführung (gibt es) mit `momente` aus f)                                                |
| T24 | Stellungsaufbau Zug um Zug, beschleunigt, Musikwechsel     | Vorführung mit Takt und `#musik` je Abschnitt                                            |
| T25 | Gegner wechselt den Zustand durch ein Ereignis             | f) mit Merkmal und T12                                                                   |
| T26 | Karte nur in einer Partie zusätzlich (goldener Rand)       | `freieKarten` (gibt es) plus Randfarbe in der Kartenleiste                               |
| T27 | Abspann aus Standbildern mit Musik, spielbare Schlussszene | Abspann (gibt es) mit `#bild`-Folge und `#musik`                                         |

Reihenfolge: f, g, h, i; jede für sich mit Tests, eigener Commit, Meldung an den Haupt-Chat.

Stand 13.11.2026 abends: f, g, h und i sind fertig. Offen für den Clubkampf ist nur der Eintrag
der beiden Momente in `begegnungen.json`, sobald die Knoten von mittel-3 auf demselben Zweig
liegen; Klangquellen und die Fensterbank warten auf ihre Einträge in `orte.json` und im Dialog
der Fensterbank.
