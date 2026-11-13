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
