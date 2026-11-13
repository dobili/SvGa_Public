# 24 Figuren und Porträts: Arbeitsweise

Stand 13.11.2026. Entscheidung des Autors nach den Proben mit Juno und Ambrose: Die Kartenfiguren
entstehen mit PixelLab, die Porträts danach mit Gemini, mit dem Frontbild der Figur als Vorlage.
So passen Figur und Porträt zusammen. Die gekauften LimeZu-Figuren bleiben als Rückfall, bis eine
Figur neu ist.

## Warum so

- Die LimeZu-Figuren wirken dem Autor zu plump im Gesicht. Ein etwas größerer Kopf ist erwünscht,
  das Gesicht soll fein und lesbar sein.
- Gemini zeichnet schöne Porträts und Standbilder, hält eine Figur aber über Laufbilder nicht
  fest und trifft keine feste Pixelgröße.
- PixelLab erzeugt die Figur in der Zielgröße und in allen Richtungen; die Laufanimation mit
  „Template motion, Skeleton v3“ verändert die Figur nicht.
- Mit einer Bildvorlage („Create from Reference“) übernimmt PixelLab die Größe der Vorlage; deshalb
  entstehen die Figuren aus Text mit fester Leinwand.

## Größe

- Leinwand 32×32, Ansicht „Low Top-Down“, Detail „Highly detailed“, Umriss „Default“.
- Kinder und Jugendliche: im Prompt „short, child height“; sie werden etwa 28 Pixel hoch und passen
  unter den Türsturz (Türöffnungen sind zwei Kacheln hoch).
- Erwachsene: ohne diesen Zusatz; geprüft wird nach dem Erzeugen, dass sie höchstens 32 Pixel hoch
  sind.

## Prompt-Vorlage (englisch, für PixelLab)

```
<Alter und Art>, <child height bei Kindern>, <Wesen in zwei Wörtern>, <Haar>, <Gesicht>,
<Oberteil mit Farbe>, <Hose>, <Schuhe>, <ein Erkennungszeichen>,
slightly stylized proportions with a larger head (about one third of the body height),
detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Beispiel Juno: „14 year old girl, short, child height, curious and lively, dark curly hair in a
low loose ponytail, freckles, bright lemon yellow rain jacket over a navy and white striped shirt,
blue jeans, white sneakers, slightly stylized proportions …“

Für Ambrose: Figur farbig erzeugen (natürliche, blasse Haut), das Geisterhafte macht das Spiel
(`#geist`, halb durchsichtig).

## Ablauf je Figur

1. PixelLab, „Create from Text“, Humanoid, v3, Einstellungen wie oben.
2. Animation: „Template motion“, Skeleton v3, Movement → Walking (ruhiger Gang), für die Richtungen
   South, East, North, West. Schrägrichtungen werden nicht gebraucht.
3. Als ZIP herunterladen. Ablage im privaten Repository unter `spiel/figuren-neu/<kennung>/` in der
   Ordnerform von PixelLab (`rotations/`, `animations/Walk/<richtung>/frame_000.png` …,
   `metadata.json`).
4. Porträt in Gemini: das Standbild „south“ anhängen, Prompt für ein Blatt mit sechs Ausdrücken
   (neutral, lächelt, nachdenklich, überrascht, bitter, lacht), 3 Spalten × 2 Zeilen, einfarbig
   hellgrüner Hintergrund. Der Hauptchat schneidet und rechnet auf 64×64 herunter.
5. Nebenfiguren mit wenig Text brauchen nur das neutrale Porträt und eines mit Lächeln.
6. Figuren, die irgendwo sitzen (Schachspieler, Leser, Gäste; Wunsch des Autors R020):
   zusätzlich „Template motion“ → Sitting für dieselben vier Richtungen. Im Export heißt der
   Ordner `animations/Sitting/<richtung>/` (`frame_000.png` …); der Paketbau nimmt je Richtung das
   erste Bild und legt die vier Sitzbilder als dritte Reihe in den Bogen (ab Rahmen 48, Ordnung
   rechts, oben, links, unten). Ohne Sitzbilder zeigt die App das Standbild der Richtung sechs
   Pixel höher, sodass die Figur hinter dem Tisch zu sitzen scheint.

## Kosten

Eine Figur mit vier Laufrichtungen kostet etwa 6 Generierungen (2 für die Figur, 4 für die
Animation). Für rund 100 Figuren reicht die Gratisprobe nicht; das Abo kostet 24 $ im Monat
(Entscheidung des Autors, wann).

## Technik

- **Sitzen in den Szenen:** Figur `{ "name": …, "feld": …, "sitzt": "unten" }` (oder `true` für
  unten) auf einem Stuhl-, Bank-, Sessel- oder Sofafeld; Statist mit `"eigenschaften": { "sitzt":
  "unten" }`, er läuft dann nicht. Kartenbau und Regel 10.55 akzeptieren das
  (`pipeline/abenteuer/kartenbau.py`, `sitzrichtung`), die App liest es in
  `app/src/abenteuer/oberwelt/sitzrichtung.ts`.
- **Kleinere Leinwand (jüngere Kinder 24×24):** Der Paketbau liest die Leinwand aus
  `metadata.json` und füllt jedes Bild unten bündig und mittig auf 32×32 auf
  (`app/skripte/figurenbogen.mjs`).

Die App zeigt das neue Format mit Fußpunkt unten Mitte; Kollision bleibt bei den Füßen. Umsetzung
bei mittel-2 (Auftrag 13.11.2026), mit LimeZu-Figur als Rückfall je Figur.
