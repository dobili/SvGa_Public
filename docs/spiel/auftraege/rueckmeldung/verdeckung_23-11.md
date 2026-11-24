# Verdeckung beim Sitzen und Liegen: Sichtprüfung im Spiel (23.11.2026)

Auftrag des Hauptchats (Nacht 23.11.2026): An allen Sitz- und Liegestellen im Spiel mit den echten
Bildern fotografieren, Fehler beheben, vorher und nachher vergleichen. Die Fotos und die
Vergleichsseite liegen nur lokal in `buch/arbeit/verdeckung/fotos/` (Paketbilder, nie ins
öffentliche Repository). Dieser Bericht kommt ohne Bilder aus.

## Verfahren

- Stellen: `python -m pipeline.abenteuer.verdeckung` (312 Stellen, 0 Befunde) und daraus 56 zum
  Fotografieren: je Möbelart und Blickrichtung mindestens zwei, dazu Diner-Theke, Clubraum,
  Wohnzimmer, Parkbank, Wards Sessel, Oma Ruth nachts im Bett, Lucia in der Sternwarte und zwölf
  Stellen hinter Theke, Kasse, Schreibtisch, Marktstand, Boot und Zaun.
- Aufnahme: `app/tests/durchlauf/verdeckungsfoto.spec.ts` (Aufruf im Dateikopf). Je Stelle der
  Stand der Gesamtsimulation zu Beginn des passenden Akts (`aktstand.cjs`), die Spieluhr auf die
  Stunde des Tagesablaufs (Blockbeginn + 1, am zweiten Spieltag), der Held auf einem freien Feld
  nahe der Stelle, ein Foto der ganzen Seite und ein Ausschnitt von sechs Kacheln um die Stelle
  (über die Kamera gerechnet, auch am Kartenrand).
- Prüfpunkte: Rumpf frei bei seitlichem Blick, Beine verdeckt von vorn, Kopf über der Lehne von
  hinten, Kopf frei im Bett, Figur sitzt auf dem Möbel, Größe passt; Tiefe hinter Theken,
  Schreibtischen, Ständen und Zäunen.

## Ergebnis

56 Stellen, zweimal verglichen (nachher, dann noch einmal nach den Bettkorrekturen): 11 behoben,
3 warten auf neue Bilder, 4 offen, 38 in Ordnung. Unter den 38 sind alle zwölf Stellen hinter
Theke, Kasse, Schreibtisch, Marktstand, Boot und Zaun (Tiefe stimmt) und einige, an denen die Figur
zur gewählten Stunde nicht da ist (Bedingung oder Tagesablauf, kein Fehler der Verdeckung: Mama in
der Kantine, Carla im Clubraum, Zwillinge und Jonah in der Bibliothek).

## Befunde und Korrekturen (behoben)

1. **Spieluhr ging beim Neuladen verloren** (`regeln/spielstand.ts`, abenteuerstandAus): Jeder
   geladene Stand begann um 6 Uhr; Ruth stand nachts in der Küche. (mittel-2 hat denselben Fehler
   parallel behoben; beim Mischen nur eine Fassung behalten.)
2. **Liegende neben dem Bett und verkehrt herum.** Oma Ruth lag eine Kachel über ihrem Bett, Lucia
   oben links daneben; Ruth mit dem Kopf am Fußende.
   - Schlafplätze im Tagesablauf auf die Bettmitte: Ruth (9, 5), Lucia (2, 7).
   - Kopfseite eines Betts aus dem Namen, sonst aus der Katalogangabe `ende` (waagrechte Betten:
     Seite des Kopfendes; `iw5BettLila` „west“). Gilt in App (`sitzrichtung.ts`), Editor 1.9.2
     (`bettvordergrund.js`, `editorkatalog.py` gibt `ende` mit) und `verdeckung.py`.
   - Liegebild und gekipptes Standbild um die Mitte der Kachel; gekippt mit dem Kopf zur Kopfseite
     (`kippwinkel`), vorher immer nach rechts.
   - Kopf aufs Kissen (`oberwelt/liegelage.ts`): Die Figur ist kürzer als das Bett; mittig lag der
     Kopf unter der Decke. Ihr Bild rückt jetzt mit dem Kopf zwei Pixel vor das Kopfende (nur das
     Bild über den Ursprung; Lage und Kachel bleiben, sonst stand der Held nach der ersten Nacht
     eine Kachel daneben).
3. **Sitzende aus dem Tagesablauf sahen immer nach vorn.** Der Tagesablauf kennt nur „sitzt“; die
   App setzte „unten“. Ward im Ohrensessel BlickLinks, Calloway und Lily auf Seitenbänken,
   Abernathy auf der Bank von hinten, Sam am Clubtisch. Jetzt sitzen sie mit dem Blick des Möbels
   (Katalog `blick`; Eigenschaft `sitzrichtung: moebel` am Kartenobjekt, `blickDesSitzes`).
4. **Einzelsitz breiter als eine Kachel.** Stühle, Sessel und Hocker setzen die Figur auf ihre
   sichtbare Mitte, auch wenn das Bild 32 Pixel breit ist (Ward saß vor dem linken Rand seines
   Sessels). Bänke und Sofas behalten den Feinschub (mehrere Plätze). App und
   `pipeline/abenteuer/sitzplatz.py` gleich.
5. **Nischenbänke im Diner** (`mf12NischenbankLinks/Rechts`, flach von oben gezeichnet): Der
   Vordergrund deckte den Rumpf, sichtbar blieb nur der Haarschopf (Rentnerinnen, Carla). Katalog
   `vordergrund: {"ab": 1}` (kein Vordergrund).
6. **Kinder auf Stühlen** (Kinderhub, `figurensitz.ts`): Ein Sitzbild, das kleiner ist als ein
   erwachsenes (sichtbar weniger als 31 Zeilen), sitzt um die Hälfte des Unterschieds höher, mit
   baumelnden Beinen. Owen verschwand bis auf Scheitel und Schuhe hinter dem Stuhl.

## Neue Bilder nötig (nicht behoben)

- Ohne Sitzbild stehen neben ihrem Platz (wie vorgesehen, `ohnesitzbild.json`): Guidry
  (Liegestuhl Fähre), Coach Delgado (Park, Diner), Juno (Park, Diner), skaterJo (Park, Diner),
  Ruth Keene (Bank vor dem Diner am Weg Desert–Summit).
- Ohne Liegebild (gekippt, sieht im Bett ordentlich aus): Oma Ruth, Lucia.

## Offen (gemeldet, nicht behoben)

- **Ersatzfelder ohne Sitzbild** (`figurenzustaende_ablauf.py` → `ohnesitzbild.json`): Im Diner
  liegen sie hinter der rechten Wand außerhalb des Raums (Coach Delgado 15,4; Juno 15,10; skaterJo
  15,9), im Park halb unter dem Dach des Nachbarhauses (Juno 22,25; skaterJo 21,23). Vorschlag:
  Ersatzfeld nur auf begehbarem Boden innerhalb des Raums und nicht unter Dachkacheln.
- **Mutter im Wohnzimmer um 18 Uhr** steht rechts neben ihrem Stuhl statt darauf (Feld 18,6 liegt
  auf dem Stuhl). Ursache nicht geklärt.
- **Diner 22 Uhr:** ein Haarschopf zwischen zwei Nischenbank-Teilen (rechte Reihe, um Zeile 8),
  nur in einem von zwei Läufen; Figur nicht bestimmt.
- **Erste Nacht des Helden** (`#stelle:held>13,8>liegt`, Bett `rv5BettKopfRechts`) nicht
  fotografiert: Sie entsteht nur im Dialog. Sie nutzt dieselbe Regel (`fuehrungsschicht.ts`
  legeHin mit Kopfseite, Mitte, Kissen, Decke); Kopfseite steht im Namen.
