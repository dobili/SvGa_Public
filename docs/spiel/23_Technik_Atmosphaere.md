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
