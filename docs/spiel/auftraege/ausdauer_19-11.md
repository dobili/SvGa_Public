# Ausdauer über lange Spielzeit (19.11.2026)

Nachtauftrag: Das Spiel dauert 13 bis 18 Stunden, der Autor spielt am Handy oft lange am Stück.
Gemessen wurde eine lange Sitzung ohne Neuladen; zwei Lecks sind behoben.

## Messprogramm

`app/tests/e2e/abenteuer-ausdauer.spec.ts` mit `abenteuer-ausdauer-messfuehler.ts`, nur mit
Schalter, nicht in CI (rund 25 Minuten):

```
npm run build
ABENTEUER_AUSDAUER=1 CHROMIUM_PFAD=… PLAYWRIGHT_NUR_CHROMIUM=1 npx playwright test abenteuer-ausdauer --trace off
```

Ablauf in Chromium (Pixel 7), Ton an wie beim Autor, ohne Neuladen:

1. Kits Runde mit 25 Aufgaben (so viel wie fünf Runden), jede mit der Testhilfe „Bestehen“.
2. 30 Gespräche am Kiosk im Park von Maple Falls (Dialog, danach der Laden).
3. 200 Kartenwechsel über „Reisen“ zwischen sieben Städten; alle 20 Wechsel eine Übungspartie
   (Königsbauer, Antwort abwarten, aufgeben), zusammen 10.

Gemessen nach zweifacher Speicherbereinigung: Heap, DOM-Knoten, Event-Listener und Dokumente über
CDP; lebende WebGL-Kontexte mit ihren Texturen, Worker, AudioContexte und dekodierte Tonpuffer
über ein Skript, das vor der App läuft (FinalizationRegistry); Leinwände und Bildrate.
Rot wird die Prüfung, wenn von der Basis (nach 10 Wechseln) bis zum Ende Heap um mehr als 25 MB,
Knoten oder Listener um mehr als ein Viertel (plus Sockel), WebGL-Kontexte um mehr als 2,
Texturen um mehr als 200, Worker um mehr als 2 oder AudioContexte um mehr als 1 wachsen, oder
wenn der dekodierte Ton über 200 MB liegt. Optionen: `AUSDAUER_KARTEN`, `AUSDAUER_DIALOGE`,
`AUSDAUER_PARTIEN`, `AUSDAUER_AUFGABEN`, `AUSDAUER_ZIEL` (Messreihe als JSON).

## Vorher und nachher

| Messpunkt | Listener vorher | Listener nachher | Ton vorher | Ton nachher | Heap vorher | Heap nachher |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Start | 273 | 273 | 51 MB | 51 MB | 15,4 MB | 15,4 MB |
| nach Runde und Dialogen | 281 | 280 | 51 MB | 51 MB | 19,1 MB | 19,0 MB |
| Basis (10 Wechsel) | 304 | 293 | 300 MB | 159 MB | 24,2 MB | 24,2 MB |
| 100 Wechsel | 400 | 294 | 300 MB | 159 MB | 32,2 MB | 32,3 MB |
| 200 Wechsel | 508 | 297 | 300 MB | 135 MB | 32,4 MB | 32,4 MB |
| Ergebnis | rot | grün | | | | |

Gleich geblieben, vorher wie nachher: ein WebGL-Kontext (26 bis 28 Texturen), eine Leinwand,
ein AudioContext, 2 Dokumente, rund 155 DOM-Knoten, Bildrate 58 bis 61 je Sekunde.

## Behoben

**Dekodierter Ton ohne Grenze.** Der Tonspieler hielt jedes einmal gehörte Stück dekodiert, bis
die Seite neu lud. Dekodiert (48 kHz, Stereo, 32 Bit) sind die 152 Musikstücke zusammen rund
3,0 GB, die 221 Geräusche 1,2 GB; das mittlere Stück 18 MB, das längste 86 MB. Schon die Musik der
sieben Städte belegte 300 MB, im ganzen Spiel wären es mehrere GB gewesen; das Handy hätte den Tab
vorher beendet. Dieser Speicher liegt außerhalb des JS-Heaps und war deshalb in keiner früheren
Messung zu sehen. Jetzt hält `app/src/abenteuer/ton/puffervorrat.ts` höchstens 160 MB
(das längste Stück, ein Geräusch und kurze Klänge) und gibt die am längsten nicht gehörten Puffer
zuerst frei. Ein Puffer, der gerade spielt, gehört seiner Quelle; Aussortieren bricht nichts ab,
das nächste Abspielen dekodiert neu.

**Phaser lässt je Karte einen Hörer zurück.** Phaser 4 hängt beim Start eines Spiels
(Game.start → VisibilityHandler) einen namenlosen Hörer „visibilitychange“ an das Dokument und
setzt window.onblur/onfocus; `game.destroy(true)` nimmt beides nicht zurück. Jede Karte startet
ein eigenes Phaser-Spiel, also blieb je Kartenwechsel ein toter Hörer, der ein beendetes Spiel
festhält und beim Weglegen des Handys feuert (vorher +204 Listener in 190 Wechseln).
`app/src/abenteuer/oberwelt/phaserNachlass.ts` merkt sich ab READY bis zum Ende des Takts die
Sichtbarkeitshörer und baut sie bei DESTROY ab.

## Geprüft, ohne Befund

- WebGL: Jede Karte startet ein neues Phaser-Spiel, der alte Kontext wird eingesammelt (immer ein
  lebender Kontext, Texturen gleichbleibend).
- Bildadressen des Pakets (Blob-URLs, `paketlader.ts`): ein Eintrag je Datei, wiederverwendet;
  höchstens die Bilder des Pakets (rund 15 MB).
- Heap: Nach dem Einspielen (erste Partien, Zwischenspeicher) flach um 31 bis 32 MB. Ein Vergleich
  zweier Heap-Abbilder (nach 14 und 42 Wechseln) zeigte als Zuwachs fast nur Puffer der
  Entwicklerwerkzeuge (Netzwerkdaten, Leistungseinträge), keine Objekte der App.
- Engine: ein einziger Dienst für die ganze Sitzung (siehe Nachtrag: Wo der Gegner rechnet).
- Aufgaben (25) und Dialoge (30): kein Zuwachs außer wenigen Listenern beim ersten Öffnen.

## Grenzen der Messung

Kopflos in Chromium, ohne echtes Handy; der Speicher von iOS und Safari kann anders aussehen. Die
Kartenwechsel laufen über „Reisen“ zwischen Außenkarten, nicht durch Türen in Innenräume; der
Musikvorrat sieht deshalb nur sieben Städte.

## Nachtrag 20.11.2026

### Wo der Gegner rechnet

Kein Zählfehler: Auf 1.e4 antwortet der Gegner aus dem Eröffnungsbuch, also startete die Engine
in der ersten Messung nie. Der Zug des Bots (`ui/komponenten/partie/botzug.ts`) geht über den
Engine-Dienst (`engine/engineDienst.ts`): Stockfish 19 lite als Web Worker, auf Wunsch mit Maia
(eigener Worker; in der Übungspartie ohne Maia, nur deren Kenndaten laden). Außerhalb des Buchs
(Randbauernzüge) startet der Worker beim ersten Rechnen und bleibt für die Sitzung (Zähler 1/1
über 10 Partien). Der Hauptfaden bleibt frei: Während der Gegner 0,3 bis 0,7 s rechnet, 61 Bilder
je Sekunde, längstes Bild 17 ms. Die Ausdauerprüfung spielt jetzt drei Züge außerhalb des Buchs.

### Innenräume

Zweite Prüfung in `abenteuer-ausdauer.spec.ts` („Türen und Treppen im Haus“): Einleitung vor dem
Haus, Ankunft im Wohnzimmer, dann 120 Durchgänge durch Haustür, Treppe ins Zimmer, Treppe zum
Dachboden und zurück; im Zimmer jedes Mal die Fensterbank (Dialog und Ansicht mit 30 Fundbildern).
Gelaufen wird mit den Bausteinen des Spieler-Durchlaufs (`abenteuer-ausdauer-haus.ts`).

| Durchgänge | 24 (Basis) | 48 | 72 | 96 | 120 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Heap MB | 17,1 | 17,5 | 18,3 | 18,4 | 17,8 |
| Knoten | 332 | 332 | 332 | 332 | 332 |
| Listener | 315 | 315 | 318 | 318 | 315 |
| WebGL-Kontexte (Texturen) | 2 (13) | 2 (13) | 2 (14) | 2 (14) | 2 (13) |
| Ton MB | 51 | 68 | 68 | 68 | 68 |

Ergebnis grün, 108 Dialoge, 99-mal Fensterbank, 30 verschiedene Bilder. Kein neues Leck. Im Haus
leben dauerhaft zwei WebGL-Kontexte statt einer (der vorige wird erst später eingesammelt); die
Zahl wächst nicht. Die Bilder der Einleitung (#bild einzug_…) fehlen noch im Paket (Gemini E1 bis
E4), deshalb zählen hier die Fundbilder der Fensterbank als lange Dialoge mit Bildern. Ein
Simultan ist nicht dabei: Es braucht einen bestimmten Spielstand mitten in Akt 3 und mehrere
Bretter mit Engine; das Leckrisiko liegt in denselben Bausteinen (Partie, Engine-Dienst), die
schon gemessen sind.

Die erweiterte Reiseprüfung (jetzt mit echten Gegnerzügen) bleibt grün: nach 200 Wechseln Heap
32,9 MB, Listener 299, ein Worker, Ton 135 MB.

### Drosselung (Chromium, CDP, 4×)

Messwerkzeug `abenteuer-kartenwechsel.spec.ts` (ABENTEUER_KARTENWECHSEL=1): Dauer eines
Kartenwechsels vom Verschwinden bis zum Wiedererscheinen des Steuerkreuzes mit neuer Leinwand.

| | ungedrosselt | 4× gedrosselt |
| --- | --- | --- |
| Kartenwechsel im Haus (12) | Median 56 ms, längster 96 ms | Median 244 ms, längster 284 ms |
| Reisen zwischen Städten (14) | Median 64 ms, längster 91 ms | Median 263 ms, längster 389 ms |
| Laufen außen | 60/s, längstes Bild 33 ms | 47 bis 52/s, längstes Bild 117 ms |
| Gegnerzug (3 Züge außerhalb des Buchs) | 61/s, längstes Bild 17 ms | 54 bis 57/s, längstes Bild 133 ms |

Kein Kartenwechsel über 1 s, auch gedrosselt nicht; keine groben Ausreißer. Einzelne lange
Bilder (117 und 133 ms) fallen beim Anlaufen und beim Ziehen an, nicht während der Engine rechnet.
