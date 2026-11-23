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
- Kinder von 7 bis 11 Jahren: Leinwand 24×24 (Probe mit Lily, 13.11.2026: auf 32×32 füllte das
  Kind trotz „child height“ die Leinwand und wurde größer als Juno). Die Figur wird etwa 22 Pixel
  hoch; der Paketbau füllt die Bilder auf 32×32 auf, Füße unten.
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
4. Porträt in Gemini, in zwei Schritten im selben Chat (Stand 14.11.2026, nach den Proben mit
   Victor): Schritt 1 ein einzelnes neutrales Porträt mit zwei Vorlagen, der Stilvorlage
   (`ki-roh/stilvorlage_portraet.png`, Victors gelungenes Blatt) für Pixelgröße und Feinheit und
   dem Standbild „south“ nur für Farben, Frisur und Kleidung; Schritt 2 das Blatt (oder bei
   Nebenfiguren das Lächeln) mit dem neutralen Porträt als Vorlage. Grund: Mit der 32-Pixel-Figur
   allein malte Gemini grobe Blöcke, vor allem im Haar, und ein Nachsatz half nur halb. Ausdrücke
   neutral, lächelt, nachdenklich, überrascht, bitter, lacht, grüner Grund. Der Hauptchat schneidet
   und rechnet auf 64×64 herunter (`python -m pipeline.abenteuer.portraetblatt`).
5. Nebenfiguren mit wenig Text brauchen nur das neutrale Porträt und eines mit Lächeln.
   Probe mit Victor (14.11.2026): Mit der kleinen Spielfigur als Vorlage übernimmt Gemini deren
   grobe Pixel (ein Gesicht aus etwa 16 Pixeln), Einzelporträts geraten dagegen fein und in anderem
   Stil. Deshalb verlangt der Prompt ausdrücklich etwa 64 × 64 Pixel je Feld und nur Farben, Frisur
   und Kleidung aus der Vorlage; Einzelporträts nehmen ein Feld des fertigen Blatts als Vorlage. Zweite Probe (14.11.2026):
   gelungen; im selben Chat hält Gemini den feinen Stil, wenn das erste Bild fein war. Je Figur ein
   eigener Chat. Keine Schrift auf Kleidung verlangen (Gemini malt sonst Zeichensalat).
6. Sitzen und Liegen (berichtigt am 21.11.2026 nach den Proben des Autors): „Template motion →
   Sitting“ gibt es in PixelLab nicht. Stattdessen „New State“: eine Fassung derselben Figur mit
   eigenen Ansichten in acht Richtungen (`<ordner>/rotations/<richtung>.png`, 32 × 32). Diese
   Beschreibungen haben funktioniert:
   - Stuhl: „Sitting on an invisible chair, eyes open, hands on lap“. Ohne „eyes open“ döst die
     Figur.
   - Boden: „sitting down cross-legged on the floor“ (Juno auf der Tribüne, Nova an der
     Podiumskante, Mira auf dem Bordstein).
   - Liegen: „Sleeping, lying on the side in an invisible bed“. Brauchbar sind nur Ost und West
     (seitlich im Profil); Süd steht mit geschlossenen Augen, Nord steht auf dem Kopf.

   Ablage: Jeden Zustand als eigenes ZIP herunterladen und in `spiel/figuren-neu/<kennung>/zustaende/`
   entpacken, in einen Ordner mit festem Namen: `sitzstuhl`, `sitzboden` oder `schlaf`. Die Namen
   bei PixelLab werden abgeschnitten („Sitting on a invisib“), deshalb zählt der Ordnername. Wird
   eine ganze Gruppe in einem ZIP exportiert, erkennt der Paketbau die Zustände ersatzweise an
   Wörtern im Namen oder in der Beschreibung (chair, cross-legged/floor, sleep/lying).

   Der Paketbau (`app/skripte/figurenzustaende.mjs`) verkleinert die Zustände auf die Kopfbreite
   des Standbilds (PixelLab zeichnet sie etwa ein Fünftel größer) und legt sie in den Bogen:
   - Reihe 3 (ab Rahmen 48): Stuhl, rechts, oben, links, unten.
   - Reihe 4 (ab Rahmen 72): Boden, ebenso.
   - Reihe 5 (Rahmen 96 und 97): Liegen, Kopf rechts (West) und Kopf links (Ost).

   Welches Bild die App zeigt: Sitzt die Figur auf einem Sitzmöbel, das Stuhlbild; ohne Sitzmöbel
   das Bodenbild. Im Bett (`#stelle … >liegt`) das Liegebild mit dem Kopf zur Seite des Betts
   (`KopfRechts`/`KopfWest` im Katalognamen; ohne Angabe Kopf rechts). Fehlt ein Zustand, gilt der
   bisherige Ersatz: Standbild sechs Pixel höher auf dem Stuhl, Standbild am Boden, im Bett das
   gekippte Standbild. Ein alter Export mit `animations/Sitting/` füllt Reihe 3 weiterhin.

7. Rennen (Nachtrag 21.11.2026): Animation „Running“ für die vier Richtungen, wie das Gehen. Im
   Export `animations/Running/<richtung>/`; der Paketbau legt sie als Reihe 6 in den Bogen (ab
   Rahmen 120, sechs Bilder je Richtung). Ohne sie rennt die Figur mit den Gehbildern bei höherer
   Bildrate. Brauchen: der Held (draußen), Victor, Juno, Kira, die Joggerin und die rennenden
   Kinder vor der Arena; die volle Liste schreibt `python -m pipeline.abenteuer.figurenzustaende`.

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

## Heldin (Wunsch des Autors, 22.11.2026)

Beim Spielbeginn und im Spielmenü wählt der Leser Held oder Heldin (Spielstand `held.figur`:
`held-0` oder `heldin-0`, `app/src/abenteuer/regeln/heldfigur.ts`). Die Wahl ändert nur das Bild;
die Texte sind geschlechtsneutral (Bibel 5.2, Dauertest `python -m pipeline.abenteuer.heldneutral`).

- **Bogen:** `spiel/figuren-neu/heldin-0/` im privaten Paket, gleiche Einstellungen und Animationen
  wie `held-0` (Stehen, Gehen, Rennen, Liegen, Sitzen am Stuhl und am Boden; Liste:
  `python -m pipeline.abenteuer.figurenzustaende`). Der Paketbau legt ihn wie jeden PixelLab-Bogen
  nach `figuren32/heldin-0.png`.
- **Bis er da ist:** Die Wahl zeigt einen Platzhalter („Bild folgt“), im Spiel steht der Held.
- **Porträt:** Der Held spricht ohne Porträt (unten in der Sprechblase); ein Porträt der Heldin
  braucht es erst, wenn der Held eines bekommt.

## Rivalin Victoria (Wunsch des Autors, 22.11.2026)

Nach der Heldenwahl wählt der Leser Rivale Victor oder Rivalin Victoria (Dialogvariable
`rivalin`, `app/src/abenteuer/regeln/rivalform.ts`; Schreibregel: Story-Bibel 5.2a).

- **Bögen:** `victoria` und `victoria-pullover` (wie `victor` und `victor-pullover`, gleiche
  Animationen). Die Welt lädt sie in der Rivalin-Fassung zuerst; fehlen sie, steht Victors Bogen da.
- **Porträts:** `portraets/victoria…` (Blatt, Sprechbogen, groß), gleiche Stimmungen wie Victor. Der
  Dialog sucht für `#sprecher:victor` zuerst Victoria, sonst Victor.
- **Bis sie da sind:** Die Wahl zeigt einen Platzhalter, im Spiel stehen Victors Bilder.

## PixelLab-Import der Menschen (23.11.2026)

Der Autor hat alle Menschen in PixelLab gezeichnet und als Sammelexporte geliefert
(`ki-roh/selected_characters*.zip` im privaten Repository; Zuordnung Gruppe → Figur über die
Prompts in `ki-roh/zuordnung_23-11.json`).

- **Import** (`pipeline/abenteuer/pixellabimport.py`): je Figur `spiel/figuren-neu/<name>/` mit
  den vier Richtungen, Gehen und Rennen aus dem Zustand, an dem sie hängen, und den Zuständen
  Stuhl, Boden und Schlaf.
  - Das Standbild wählt `pixellabtabelle.py` je Figur mit Grund. Abe hält an der Sternwarte sein
    Teleskop, der Bläser seine Posaune; die Straßenmusikerin trägt das Instrument auf dem Rücken,
    weil Statisten umherlaufen. Sonst gilt der Zustand mit der Laufanimation.
  - Victoria im Pullover ist eine eigene Figur (`victoria-pullover`), wie `victor-pullover`.
  - Die 40 alten Statistenbögen (`statist-01` … `statist-40`) zeigen ihren neuen Typ: 1–8 Kinder
    (abwechselnd Mädchen, Junge), 9–16 Rentnerin und Rentner, ab 17 nach Ort (Kantine Arbeiter,
    Diner-Hinterzimmer Fahrer, Weg Wandernde, Wegsperre Jugendliche), sonst reihum Alltagstypen.
  - Ohne Export (`owen`, `statist.bauer`) bleibt der alte Bogen.
- **Höhen** (`pixellabhoehen.py`): PixelLab liefert alle auf 32 × 32 und übergeht „short, child
  height“ bei Jugendlichen. Je Figur ein Höhenfaktor auf die Zielhöhe der Altersgruppe
  (Erwachsene 30,5, Alte 29,5, Jugendliche 27,5, Kinder 22 Pixel; nur verkleinern, höchstens
  × 1,1). Die App zeichnet die Figur damit (`figurhoehen.json`, `figurbogen.ts`,
  `figurbilder.ts`): Die Füße bleiben auf der Kachel, der Körper für Kollisionen bleibt eine
  Kachel. Im Spiel statt im Bogen skaliert, damit die Pixelzeichnung nicht neu gerastert wird.
- **Übersicht für den Autor**: `pixellabuebersicht.py` (nur lokal, `buch/arbeit/pixellab/`).

## Verdeckung beim Sitzen und Liegen (23.11.2026)

Wunsch des Autors: Wer sitzt, wird vom vorderen Teil seines Möbels verdeckt; wer im Bett liegt, liegt
unter der Decke.

- **Sitzen** (`app/src/abenteuer/oberwelt/vordergrund.ts`, `figurensitz.ts`): Beim Hinsetzen legt die
  App das Möbelbild ein zweites Mal über die Figur, beschnitten ab der Sitzflächen-Vorderkante
  (Vorderkante, Beine, von hinten die Lehne).
  - Die Grenze ist ein Anteil der sichtbaren Höhe von oben: Stuhl und Bank 0,55, Hocker 0,45,
    Sessel, Sofa und Couch 0,6. Je Möbel im Katalog: `vordergrund: {"ab": …}`.
  - Wer zum Betrachter schaut, bekommt keinen Vordergrund: Die Füße baumeln vor dem Möbel.
  - Über einem leeren Möbel deckt sich der Ausschnitt mit dem Bild darunter und fällt nicht auf.
- **Liegen** (`deckeZu`): das Bettbild über der Liegenden, ohne die Kopfseite (30 % der Breite,
  `vordergrund: {"kopf": …}`).
  - Gilt für `#stelle … >liegt` und für Liegende aus den Tagesabläufen. Beim Aufstehen verschwindet
    die Decke.
  - Die Kopfseite steht im Namen des Betts (KopfRechts, KopfLinks), sonst rechts.
- **Werkzeug** `pipeline/abenteuer/verdeckung.py` mit Dauertest „0 Befunde“: alle 246 Sitz- und
  Liegestellen aus Szenen, Tagesabläufen und Ink, je mit Möbel und Art. Ausnahmen mit Grund:
  - Mira auf dem Bordstein: wie der Boden, nichts verdeckt.
  - Oma Ruths Bett: keine Kopfseite im Namen, darum die Vorgabe rechts.
  - Das Bett im Dachboden ist Kachelgrafik und kein Möbel: Dort deckt die App nicht zu, bis das Bett
    als Möbel steht.
- **Karteneditor 1.9** zeigt den Vordergrund der Sitzenden ebenso.
