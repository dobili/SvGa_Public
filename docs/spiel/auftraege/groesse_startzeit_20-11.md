# Größe und Startzeit des Spiels (Auftrag 20.11.2026)

Auftrag des Hauptchats: Was macht das Spielpaket aus, wie lange dauert der erste Start, wo lässt
sich verlustarm sparen, was kann später nachladen, ohne dass offline danach etwas fehlt.

## Ergebnis in einem Satz

Der erste Start wartete auf das ganze Maia-Paket (92 MB). Gedrosselt wie Mobilfunk mit 10 Mbit/s
kam die Welt erst nach **95 s**, jetzt nach **11 s**. Maia, die Geräusche des Akts und die
Großbilder laden jetzt im Hintergrund. Erst wenn alles da ist, meldet das Spiel „vollständig“, und
dann geht es offline wie vorher.

## Messung

Werkzeug: `app/tests/e2e/abenteuer-messung.spec.ts`. Neu dazu sind die Drosselung
(`ABENTEUER_DROSSEL_MBIT=10`: 10 Mbit/s, 40 ms Laufzeit) und die Aufschlüsselung der Bytes nach
Paketgruppe mit der Zeit der ersten und letzten Datei. Gemessen wurde gegen `npm run build` und die
Vorschau, mit leerem Cache in Chromium.

Aufruf:

```bash
ABENTEUER_MESSUNG=1 ABENTEUER_DROSSEL_MBIT=10 CHROMIUM_PFAD=… PLAYWRIGHT_NUR_CHROMIUM=1 \
  npx playwright test abenteuer-messung --trace off
```

| Messung (Tippen auf „Spiel herunterladen“ bis zur spielbaren Welt) | vorher | Maia im Hintergrund | dazu Großbilder im Hintergrund |
| --- | ---: | ---: | ---: |
| Kaltstart, gedrosselt 10 Mbit/s | 95,1 s | 13,9 s | **10,9 s** |
| Kaltstart, ungedrosselt | 8,5 s | 4,9 s | **3,9 s** |
| Bytes unter /abenteuer/ bis zur Welt (gedrosselt) | 24,4 MB | 16,4 MB | **13,1 MB** |
| dazu Maia vor der Welt | 91,7 MB | 0 | 0 |
| Warmstart aus dem Cache | 1,1 s | 1,3 s | **0,6 bis 1,1 s** |

Die Ursache der 95 s zeigte die Zeitleiste:
- Grundpaket fertig nach 13 s.
- Geräusche von Akt 1 fertig nach 22 s.
- Danach sechs Maia-Teile und die Laufzeit (92 MB) bis 94 s.
- Erst dann erschien die Welt.

Seit dem 18.11. war Maia Pflicht, und „Spiel laden“ wartete darauf (`anbindung/maiapflicht.ts`).

Die Vorschau komprimiert nicht. Die Live-Seite liefert über Cloudflare mit HTTP/2 und Brotli aus
(am 20.11. geprüft: `content-encoding: br` für `paket.json` und die Karten). Die Tiled-Karten
(5,7 MB) gehen dort mit etwa 0,4 MB über die Leitung. Am Handy sind es bis zur Welt also eher
**7 bis 8 MB** statt 13 MB. Die gedrosselten Zeiten oben sind deshalb eher zu lang.

## Was macht die 124 MB aus

Paket 0.3.56, Bytes wie gespeichert. „Leitung“ ist geschätzt mit gzip für JSON; Bilder und Ton
lassen sich nicht weiter packen.

| Teil | Dateien | gespeichert | Leitung | wann geladen |
| --- | ---: | ---: | ---: | --- |
| Musik (AAC 80 kbit/s Stereo, 137 min) | 153 | 83,8 MB | 83,8 MB | ein Stück, wenn es spielt, die der Nachbarkarten vorab; alles nur auf Wunsch im Spielmenü |
| davon Akt 1 / 2 / 3 / 4 | | 18,5 / 15,0 / 22,1 / 28,2 MB | | |
| Geräusche (AAC 64 kbit/s, 56 min, 153 Mono, 68 Stereo) | 222 | 27,5 MB | 27,5 MB | Akt 1 im Hintergrund nach dem Start, spätere Akte beim Betreten |
| davon Akt 1 / 2 / 3 / 4 | | 8,2 / 5,4 / 6,0 / 7,9 MB | | |
| Grafik (WebP verlustfrei): Möbelbögen 1,5, Grafik 1,0, Porträts 1,1, Figuren 0,3, Tiere, Spielkarten 0,7 | 687 | 4,7 MB | 4,6 MB | Grundpaket |
| Großbilder der Dialoge und Fundbilder (`bilder/`) | 118 | 3,3 MB | 3,3 MB | **neu: Hintergrund** |
| Tiled-Karten (JSON, schon ohne Leerzeichen) | 128 | 5,9 MB | 0,4 MB | Grundpaket |
| Daten (Orte, Quests, Texte …) | 15 | 1,6 MB | 0,2 MB | Grundpaket |
| Dialoge (Ink als JSON) | 71 | 1,2 MB | 0,3 MB | Grundpaket |
| **Summe Spielpaket** | 1394 | **128 MB** | | |
| Maia (Modelle Blitz und Rapid, ONNX-Laufzeit) | 7 | 91,7 MB | 91,7 MB | **neu: Hintergrund** (vorher vor dem Start) |

Zum Start nötig sind jetzt 13,4 MB gespeichert, über die Leitung etwa 5,5 MB. Vorher waren es
16,7 MB plus 92 MB Maia.

## Umgesetzt

1. **Maia im Hintergrund.**
   - Was sich ändert:
     - „Spiel herunterladen“ lädt nur noch das Spielpaket.
     - Maia lädt danach mit den Geräuschen des Akts. Das geschieht in `paket/aktton.ts`,
       `ladeTonImHintergrund`, über `anbindung/maiapflicht.ts`, `ladeMaiaImHintergrund`, und lädt
       nie doppelt.
     - Die Ladezeile über dem Spiel zählt beides zusammen. „Spiel geladen“ erscheint erst, wenn
       auch Maia da ist.
     - Ein vorhandenes Spiel startet auch dann sofort, wenn Maia fehlt; es lädt mit Netz im
       Hintergrund weiter. Vorher bot die Startkarte dann erneut den Download an.
   - Pflicht bleibt Maia trotzdem: Jedes Spiel lädt es von selbst.
   - Eine Partie, die beginnt, bevor Maia da ist, spielt ohne Maia (`useMaiaBereit`). Die nächste
     spielt mit Maia. Bis zur ersten Partie in Akt 1 vergehen mehrere Minuten, und Maia braucht bei
     10 Mbit/s etwa 75 s.
   - Texte:
     - Die Startkarte sagt jetzt, dass man nach dem ersten Teil spielen kann.
     - Die Ladezeile heißt „Geräusche und Maia werden geladen …“.
2. **Großbilder im Hintergrund.**
   - Neues Feld `hintergrund` in `paket.json`, gesetzt vom Paketbau `kopiereBilder` für `bilder/`.
     Diese Dateien gehören nicht zum Grundpaket, laden aber mit dem Ton jedes Akts nach und zählen
     zu „vollständig“.
   - Braucht ein Dialog ein Bild vorher, holt es der Paketlader aus dem Netz und legt es in den
     Cache. Das ist derselbe Weg wie bei der Musik.
   - Die Einleitung läuft direkt nach dem Download, also mit Netz.
3. **Messung erweitert:** Drosselung und Zeitleiste je Gruppe; das Werkzeug ist oben beschrieben.

## Geprüft, nichts zu holen

- **Kartenbilder verlustfrei besser packen:** Schon verlustfreies WebP. Mühe 6 statt 4 bringt laut
  Messung vom 15.11.2026 0,1 %.
- **Großbilder als Raster 256 × 192 speichern** und im Browser vergrößern: Nur 5 von 118 Bildern
  liegen exakt auf dem 4×-Raster. Der Rest wäre verlustbehaftet, also nicht umgesetzt.
- **Karten- und Daten-JSON verkleinern:** Schon ohne Leerzeichen. Brotli auf dem Server packt sie
  auf etwa 7 %.
- **Ton:**
  - Stille am Anfang und Ende: zusammen 0,1 MB.
  - Stereo mit zwei gleichen Kanälen: eine Datei (20 KB).
  - Die Geräusche sind schon zu zwei Dritteln Mono.
- **Doppelte Dateien:** 27 Gruppen mit zusammen 0,39 MB. Die größte ist
  `klang/kantine_jubel.m4a` = `klang/jubel-2.m4a` (80 KB). Der Rest sind Kartenzustände, deren Bild
  dem Grundbild gleicht (je 10 bis 28 KB). Lohnt keinen Umbau.

## Empfehlungen (nicht umgesetzt)

1. **Musik und Geräusche als Opus statt AAC.** Das ist der einzige große Hebel; Ton ist 111 von
   128 MB.
   - Ersparnis bei gleicher hörbarer Qualität: Opus 64 kbit/s Stereo statt AAC 80 kbit/s etwa
     20 %, Opus 48 kbit/s etwa 40 %. Für die Musik wären das 17 bis 33 MB.
   - Für Geräusche in Mono genügen 32 bis 40 kbit/s; das spart etwa 40 %.
   - Neu kodiert werden muss aus den WAV-Dateien, nicht aus den m4a: AAC zu Opus verlöre ein
     zweites Mal Qualität.
     - Die Musik baut `python -m pipeline.abenteuer.ton.musikbau PRIVAT --laden` neu (Proben aus
       dem Netz, Einstellung `BITRATE` in `musikbau.py`).
     - Für die Geräusche gibt es keine verlustfreien Quellen im privaten Repository.
   - Haken: iPhone-Safari dekodiert Opus über Web Audio (`decodeAudioData`, WebM) zuverlässig erst
     ab iOS 17.4. Auf älteren Geräten bliebe das Spiel stumm, außer man liefert beide Formate.
     - Das kostet einen Umbau von Paketbau und Tonspieler (je Gerät nur ein Format laden).
     - Vorher bitte die iOS-Version des Autors erfragen und eine Hörprobe am Handy machen.
   - Wirkung: Der Start wird dadurch nicht schneller (Ton lädt schon im Hintergrund), nur das
     Datenvolumen über das ganze Spiel.
2. **Weniger Anfragen.**
   - Das Grundpaket sind rund 900 Dateien, viele davon kleiner als 2 KB (Figuren, Porträts, Grafik).
   - `paket/paketlader.ts` lädt je 6 zugleich. Das war für HTTP/1.1 gedacht, die Live-Seite spricht
     HTTP/2.
   - Bei einer Laufzeit im Mobilfunk von 60 bis 100 ms sind allein das 9 bis 15 s Wartezeit.
   - Abhilfe:
     - `GLEICHZEITIG` für HTTP/2 auf 16 bis 24 erhöhen. Das geht schnell, lässt sich aber
       lokal nicht messen, weil die Vorschau HTTP/1.1 spricht.
     - Oder kleine Dateien je Ordner zu Bögen beziehungsweise einer Sammeldatei bündeln; das ist
       größer.
   - Empfehlung: zuerst die Zahl erhöhen und am Handy messen.

## Für den Hauptchat

Im privaten Repository muss **nichts** ersetzt werden. Alles steckt in App und Paketbau.

Optional: `spiel/klang/jubel-2.m4a` und `spiel/klang/kantine_jubel.m4a` sind byte-gleich. Eine
davon könnte weg, wenn der Tonplan dann auf die andere zeigt. Das spart 80 KB.
