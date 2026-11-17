# Spieltest mit echter Grafik nach den nächtlichen Umbauten, 17.11.2026

Stand: Zweig beta (6c0ec420), echte Grafik aus dem privaten Repository (bcd5d6c1, mit den neuen
Hintergründen, Schildern und Vitrinen), `npm run build`, Chromium.

## So getestet

- **Türen-Rundreise:** Alle Übergänge mit einem Innenraum ohne Bedingung (`wenn`), zusammen 73 (je
  Richtung einer). Der Held steht vor dem Auslöser, schaut in den Durchgang und geht hinein.
  Geprüft wurde, ob die Zielkarte erreicht wird, dazu je ein Bildschirmfoto vor und nach dem
  Übergang.
- Das alles einmal in 420 × 800 (hoch) und einmal in 800 × 420 (quer). Die Bilder liegen nur lokal;
  das Werkzeug (Plan aus den Szenen und ein Playwright-Lauf) ist nicht eingecheckt.
- Durchgesehen: alle Ankünfte, alle Außentüren von vorn, die umgebauten Innenräume (Kantine, Museum,
  Turnhalle, Raststätte, Bibliothek, Archiv, Gasthaus Lockport, Kaffeehaus London, Wohnwagen,
  Schuppen, Garage, Umkleide, Mamas Zimmer, Akademie, Serverraum, Hütte) in beiden Lagen und die neu
  gesetzten Außengebäude (alter Bahnhof als Museum, Turnhalle Port Delacroix, Kantinenhalle,
  Speisewagen in Crossroads und an der Wüstenstraße, Blockhütten mit Schildern in Summit City).

## Ergebnis

- **73 von 73 Übergängen** laufen ohne Fehler.
- **68** führen sofort auf die Zielkarte. Ankunft neben der Tür, Blick vom Durchgang weg, der Held ist
  sichtbar und frei.
- **5** öffnen wie vorgesehen zuerst einen Dialog: Arena-Eingang, Treppe der U-Bahn, Kaffeehaus der
  London-Erinnerung, Rückkehr aus der Siedlungshütte, Seilbahn. Die Rundreise lässt den Dialog
  offen; das ist kein Fehler.
- Der Held passt sichtbar durch alle geprüften Türen. Die zu kleinen Türen nach Regel 10.92 stehen
  im Bericht `tuermasse_17-11.md`, nicht hier.
- Kein Absturz, keine Konsolenfehler, keine leere Karte.

## Befunde

| Nr  | Karte                         | Feld                                    | Schwere | Befund                                                                                                                                                                                                | Vorschlag                                                                                                                                                 | An        |
| --- | ----------------------------- | --------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | wegPinewoodGhost.staubstrasse | Tankstelle, Auslöser (101, 12)          | mittel  | Die Tankstelle hat außen keine sichtbare Tür, nur eine Holzwand mit Läden. Der Held geht durch die Wand hinein.                                                                                       | Gebäudebild mit Tür (Kiosk, Werkstatt) oder ein Türbild an der Stelle des Auslösers.                                                                      | Fable     |
| 2   | riverton.aussen               | Fahrradschuppen, Auslöser (16, 53)      | klein   | Die Tür liegt im Bild mittig zwischen den Feldern 16 und 17, der Auslöser auf 16. Der Held tritt eine halbe Kachel links neben der Tür heraus.                                                        | Schuppen um 8 Pixel nach links versetzen (`versatz`), damit die Tür über Feld 16 liegt.                                                                   | Fable     |
| 3   | summitCity.aussen             | Hütte der Großmeisterin, vor der Treppe | klein   | Ein Statist steht direkt rechts neben den Türstufen; ankommend steht der Held Schulter an Schulter mit ihm.                                                                                           | Statist zwei Felder vom Weg weg.                                                                                                                          | Fable     |
| 4   | ironwood.mamasZimmer          | oben rechts                             | klein   | Quer (800 × 420) steht eine Figur in der obersten Reihe genau unter der Münzanzeige und ist halb verdeckt.                                                                                            | Figur eine Reihe tiefer oder weiter links.                                                                                                                | mittel-2  |
| 5   | mapleFalls.wohnzimmer         | Ausgang unten                           | klein   | Hoch (420 × 800): Bei der Ankunft von oben (Treppe aus dem Zimmer) liegt die Haustür hinter dem Pfeil ▲ des Steuerkreuzes.                                                                            | Nur ein Hinweis. Die Kamera folgt, sobald der Held läuft; kein Handlungsbedarf.                                                                           | –         |
| 6   | alle großen Außenkarten       | –                                       | Hinweis | Quer sieht man über dem Helden nur etwa vier Kacheln. Steht er vor einem großen Gebäude (Kantinenhalle, Turnhalle, Bahnhof Riverton), ist das Gebäude nur zur Hälfte im Bild, Schild und Dach fehlen. | App: Kamera schaut in Laufrichtung voraus (etwa zwei Kacheln Versatz nach oben, wenn der Held nach oben geht). Das wäre ein eigener Auftrag, nicht klein. | Hauptchat |
| 7   | riverton.aussen               | vor dem Bahnhof, (36, 19)               | Hinweis | Die große Pfütze liegt direkt vor der Bahnhofstür; der Held steht beim Hineingehen in ihr. Sie sperrt nicht, sieht aber ungewollt aus.                                                                | Pfütze zwei Felder zur Seite.                                                                                                                             | Fable     |

Sitzende und Blickrichtungen in den geprüften Räumen sahen richtig aus. Statisten und Figuren
schauen zu Tisch, Tresen oder Brett, Sitzende sitzen auf ihrem Möbel.

## Affentests „Affe: Deckwahl“ und „Affe: Oberwelt“

- In CI brach „Affe: Deckwahl“ am 17.11. (Lauf 43986498731) in beiden Versuchen mit „Kein Ausweg
  (welt)“ ab. Letzte Schritte: Pfeiltasten, Enter, „kein Knopf“, Fläche tippen.
- Lokal liefen beide Tests auf dem heutigen Stand durch, auch unter Last (6 × wiederholt, 6
  parallel, 12 von 12). Das Bildschirmfoto steckt nur im 277 MB großen Bericht aus CI; die Ursache
  ließ sich deshalb nicht sicher bestimmen. Wahrscheinlich ein Fenster, das die Knöpfe überdeckt,
  oder ein Dialogschritt, dessen „Weiter“ gesperrt war.
- Geändert, nur im Test:
  - Antippbarer Dialogtext zählt jetzt als Ausweg.
  - „Kein Ausweg“ nennt ein Lagebild: sichtbare Testkennungen, gesperrte Knöpfe, oberstes Element an
    Bildmitte und Steuerkreuz, Fenstergröße.
  - Die Hilfen dafür stehen in `app/tests/e2e/abenteuer-lage.ts`; `abenteuer-affe.ts` bleibt damit
    unter 400 Zeilen.
- Tritt der Fehler wieder auf, sagt die Meldung, was den Weg versperrt.
