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
- Engine: ein einziger Dienst für die ganze Sitzung. In den 10 Übungspartien entstand kein Worker
  (Zähler 0); ob der Gegner hier ohne Worker zieht, wurde nicht weiter untersucht.
- Aufgaben (25) und Dialoge (30): kein Zuwachs außer wenigen Listenern beim ersten Öffnen.

## Grenzen der Messung

Kopflos in Chromium, ohne echtes Handy; der Speicher von iOS und Safari kann anders aussehen. Die
Kartenwechsel laufen über „Reisen“ zwischen Außenkarten, nicht durch Türen in Innenräume; der
Musikvorrat sieht deshalb nur sieben Städte.
