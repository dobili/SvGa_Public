# Leistung nach Variante B: Bildrate beim Laufen, 17.11.2026

Frage des Autors: Seit Variante B hat das Spielbild die volle Auflösung der Seite (Kamera-Zoom 3,
`app/src/abenteuer/oberwelt/weltmassstab.ts`), etwa neunmal so viele Pixel wie vorher. Ruckelt das
auf älteren Handys?

**Ergebnis: nicht spürbar schlechter. Eine automatische Grafikstufe („scharf / schnell /
automatisch“) ist nach diesen Messungen nicht nötig und wurde nicht gebaut.**

## So gemessen

- Werkzeug: `app/tests/e2e/abenteuer-bildrate.spec.ts` (nur mit `ABENTEUER_BILDRATE=1`), gegen
  `npm run build` mit der echten Grafik aus dem privaten Repository, Chromium (Projekt
  „android-chromium“) ohne Bildschirm.
- CPU gedrosselt über CDP `Emulation.setCPUThrottlingRate` auf 4×, 6× und 10×.
- Fenster in Handygröße: hoch 420 × 800, quer 800 × 420.
- Karten: Maple Falls außen (64 × 43), Riverton außen (72 × 56), Capital Arena außen (80 × 60).
- Der Held läuft 5 s nach rechts und 5 s nach links. Ein `requestAnimationFrame`-Zähler misst
  Bildrate und Bildzeiten (Phaser zeichnet im selben Takt). Ein Bildschirmfoto vor und nach der
  ersten Strecke zeigt, dass der Held wirklich lief.
- Als „Ruckler“ zählt ein Bild, das länger als 33 ms dauert (unter 30 Bilder je Sekunde).
- Vergleich: derselbe Lauf mit dem Stand vor Variante B (Commit 0e5ea2eb, Spielbild ein Drittel so
  groß, die Seite vergrößert es).

Aufruf:

```bash
ABENTEUER_BILDRATE=1 ABENTEUER_DROSSELUNG=4,6,10 CHROMIUM_PFAD=/opt/pw-browsers/…/chrome PLAYWRIGHT_NUR_CHROMIUM=1 npx playwright test abenteuer-bildrate --trace off --workers 1
```

## Messwerte

Bilder je Sekunde, in Klammern der Anteil der Ruckler. Bildzeit im Mittel bei 4× und 6× jeweils
16,7 bis 17,9 ms (60 Hz), bei 10× 21 bis 27 ms.

| Karte               | Bild | 4× jetzt   | 4× vorher  | 6× jetzt   | 6× vorher  | 10× jetzt   | 10× vorher  |
| ------------------- | ---- | ---------- | ---------- | ---------- | ---------- | ----------- | ----------- |
| Maple Falls außen   | hoch | 59,8 (0 %) | 59,7 (0 %) | 57,0 (1 %) | 58,7 (1 %) | 36,9 (25 %) | 37,6 (22 %) |
| Maple Falls außen   | quer | 60,0 (0 %) | 60,0 (0 %) | 55,9 (2 %) | 59,1 (1 %) | 37,2 (23 %) | 39,8 (21 %) |
| Riverton außen      | hoch | 60,0 (0 %) | 60,0 (0 %) | 59,8 (0 %) | 59,7 (0 %) | 41,0 (20 %) | 41,8 (15 %) |
| Riverton außen      | quer | 60,0 (0 %) | 60,0 (0 %) | 57,9 (1 %) | 59,7 (0 %) | 38,9 (21 %) | 44,5 (13 %) |
| Capital Arena außen | hoch | 60,0 (0 %) | 60,0 (0 %) | 59,5 (0 %) | 59,6 (1 %) | 44,5 (12 %) | 45,5 (13 %) |
| Capital Arena außen | quer | 60,0 (0 %) | 60,0 (0 %) | 59,5 (0 %) | 59,5 (0 %) | 45,1 (12 %) | 47,5 (9 %)  |

Gegenprobe: Bei 20× fällt dieselbe Messung auf 23 Bilder je Sekunde (61 % Ruckler). Das Werkzeug
erkennt Last also.

## Bewertung

- Bei 4× und 6× (etwa ein Mittelklasse-Handy von vor fünf bis sieben Jahren) laufen beide Stände
  flüssig, praktisch mit vollen 60 Bildern je Sekunde.
- Erst bei 10× ruckelt es, und zwar vorher wie nachher. Der Unterschied beträgt 0 bis 6 Bilder je
  Sekunde, im Mittel etwa 2. Die Last liegt also in der Spiellogik (Figuren, Statisten, Tiere,
  Kollision), nicht in der Pixelzahl.
- Grenze der Messung: Die Drosselung bremst nur den Hauptfaden. Das Füllen der Pixel erledigt die
  Grafikeinheit, und die bremst die Drosselung nicht. Das Spielbild hat aber Seitengröße in
  CSS-Pixeln (420 × 800 = 336 000 Pixel), auf einem Handy mit dreifacher Pixeldichte also nur ein
  Neuntel der Bildschirmpixel. Diese Fläche füllt jede Handy-Grafikeinheit der letzten Jahre um ein
  Vielfaches schneller, als sie den ganzen Bildschirm zusammensetzt. Ein Engpass ist dort nicht zu
  erwarten.
- Empfehlung: keine Grafikstufe einbauen. Sollte der Autor auf einem bestimmten alten Gerät doch
  Ruckeln sehen, bitte Gerät und Karte nennen. Dann lässt sich gezielt messen. Ansatz wäre dann das
  Spielbild in halber Größe mit Kamera-Zoom 1,5, ohne an Kollision und Wegen etwas zu ändern.
