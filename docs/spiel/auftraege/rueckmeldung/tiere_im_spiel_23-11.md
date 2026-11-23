# PixelLab-Tiere im Spiel: Prüfung mit Fotos (23.11.2026, Nachtauftrag)

Auftrag des Hauptchats: Tiere im Spiel mit den echten Bildern prüfen (Größe neben Figuren,
Bewegung, Ruhezustände, Wasserfarbe, Tiefe, Platz), Fehler beheben, Fotos zweimal vergleichen,
Vergleichsfotos für sehr kleine Tiere mit 6 und 8 px. Die Fotos liegen nur lokal
(`buch/arbeit/tiere/pixellab/fotos/index.html`, Paketbilder); dieser Bericht hat keine Bilder.

## Vorgehen

- Privat `main` 848333b9 (danach 5acde49c), App mit `ABENTEUER_PRIVAT=…/spiel` gebaut, Stand
  der Simulation zu Beginn von Akt 4 (`aktstand.cjs --akt 4`).
- Je Art eine Stelle, an der sie im Spiel vorkommt (61 Arten, auch Drohne, Saugroboter,
  Waschbär), Held drei Felder darüber, Serie von sechs Fotos (`tierfoto.spec.ts`,
  `TIERFOTO_STELLE`). Für die Fotos hält die Belebung an (`window.__belebungStill`, nur im Test
  gesetzt); ohne das waren scheue und fliegende Tiere beim Foto schon weg.
- Bewegung: Serien mit laufenden Tieren (`TIERFOTO_BEWEGT=1`) für Kuh, Schaf, Huhn, Ente,
  Waschbär, Saugroboter, Hase, Krebs, Drohne, Kehrroboter.
- Bögen zusätzlich am Rechner geprüft: Ruhebilder auf der Fußlinie, Blickrichtung der
  Bewegungsbilder gegen das Standbild.

## Befunde und was geschah

| Befund | Ort | Behoben |
| --- | --- | --- |
| Eidechse hinter einem Kaktus (Kaktus auf ihrem Startfeld, sperrt nicht) | desertSprings.aussen, auch Meisterschaft | Start und Weg zwei Felder nach rechts (52,35 bis 56,35) |
| Murmeltier im Kaktus | hochebene.felsentuerme | 52,21 bis 55,21 |
| Bisons im Kaktus | hochebene.felsentuerme | Start 77,20 |
| Hund auf einer gesperrten Kachel | cedarCreek.aussen, auch Samstag | 17,20 bis 19,20 |

Neuer Dauertest `pipeline/tests/test_abenteuer_tierplatz.py`: kein Tier am Boden auf einer
gesperrten Kachel oder im Wasser, kein Schwimmer an Land (fliegende Tiere ausgenommen). Nach dem
Beheben 0 Befunde; die zweite Fotorunde zeigt alle vier frei.

## Ohne Befund

- **Größe:** Kuh knapp unter dem Erwachsenen, Pony und Roboterhund neben Erwachsenen stimmig,
  Hund reicht einem Erwachsenen etwa bis zum Gürtel, einem Kind bis zur Schulter. Faktoren wie in
  tierarten.json (gezeichnete Höhe von der Seite, Ziel aus dem Tierplan).
- **Ruhezustände:** Ruhebilder (sitzen, schlafen, grasen) stehen höchstens 3 Bogenpixel neben der
  Fußlinie des Standbilds, im Spiel unter einem Pixel; sie bleiben auf ihrem Feld (schlafende
  Katze, liegende Ziegen, sitzender Reiher, Pelikane auf den Pfählen).
- **Wasser:** Ente, Delfin, Qualle, Robbe, Schwan in unserer Wasserfarbe ohne Rand; Alligator,
  Schildkröte, Nutria im Moorwasser des Bayou.
- **Bewegung:** Die automatische Prüfung der Blickrichtung (Bewegung gegen Standbild, rechts und
  links) fand keinen Spiegelfehler; auf den Serien schwimmt die Ente in Blickrichtung. Rutschen
  lässt sich auf Standfotos nicht sicher beurteilen (Testpunkt für den Autor).
- **Tiefe:** Fliegende Tiere über allem, Tiere am Boden hinter Möbeln, deren Fuß tiefer liegt;
  sonst keine Überdeckung gefunden.

## Nicht auf dem Foto (kein Fehler im Bogen)

Eule (Ghost Town) und Kojote (Felsnase) stehen auf dunklen Karten bzw. zur Nachtzeit und sind auf
dem Foto kaum zu sehen; den Eichelhäher in Cedar Creek fand ich an seiner Stelle nicht (Ursache
nicht geklärt, eventuell eine andere Kartenfassung im Akt-4-Stand). Im Spiel zu prüfen.

## Offen für den Autor

- Sehr kleine Tiere (Zielhöhe 6 Spielpixel: Maus, Spatz, Specht, Libelle, Krebs): Vergleichsfotos
  mit 6 und 8 px auf der Fotoseite. Mit 8 px sind Spatz, Libelle und Krebs deutlich besser zu
  erkennen. Nicht geändert (Entscheidung des Autors).
- Hund: Vergleich 13 px (jetzt) und 9 px (bis zur Hüfte eines Erwachsenen). Nicht geändert.
- Gehen ohne Rutschen und in der richtigen Richtung: im Spiel ansehen (Kuh, Schaf, Hund, Waschbär,
  Saugroboter).

## Nachtrag (Hauptchat, 23.11.2026 spät, nach Regel 9 umgesetzt)

- **Kleine Tiere auf 8 Spielpixel:** Mindestzielhöhe im Tierplan 8 statt 5 (`tierplan.py`,
  MINDESTHOEHE). Betrifft alle Arten, die vorher bei 6 lagen: Maus, Spatz, Specht, Libelle, Krebs,
  Eichhörnchen, Eidechse, Ratte, Fledermaus, Schmetterling, Frosch, Schildkröte, Hecht, Eisvogel,
  Strandläufer, Drohne (Saugroboter hat seinen festen Maßstab). Hund bleibt (Autor entscheidet).
- **Eichelhäher Cedar Creek:** Er hat `wann: morgen` und erscheint nur morgens; die Fotos waren am
  Tag. Morgens saß er hinter einem Nadelbaum: Fliegende Tiere bekamen im Sitzen die Tiefe ihrer
  Fußlinie, so verdeckten Baum und Wasserturm Eichelhäher und Eule ganz. Jetzt liegen fliegende
  Tiere immer über allem (sie sitzen auf Baum, Turm, Dach).
- **Spieluhr ging beim Laden verloren** (gefunden beim Stellen der Uhr für die Nachtfotos):
  `abenteuerstandAus` übernahm `spieluhr` nicht, nach jedem Neuladen stand die Uhr wieder am ersten
  Morgen. Behoben, Test in `spieluhr.test.ts`.
- **Eule und Kojote bei Nacht** (23 Uhr, `TIERFOTO_STUNDE`): beide zu sehen, die Eule auf dem
  Wasserturm.
- **Rutschen beim Gehen:** Gemessen am Bogen: Weg der Füße je Gehzyklus (6 Bilder) gegen den Weg
  des Tiers (Tempo × 16 px × 0,6 s). Vorher liefen Kuh, Fuchs, Saugroboter 2,5-mal, Hund und
  Waschbär gut 3-mal so weit, wie die Füße gingen. Jetzt läuft die Gehanimation je nach Tempo bis
  2,5-mal schneller (`tiere.ts`, gangfaktor; Fußweg je Art als `schritt` in tierarten.json).
  Verhältnis danach: Kuh, Schaf, Pferd, Fuchs 1,0; Saugroboter 1,1; Hund 1,24; Waschbär 1,28.
  Flieger und Schwimmer bleiben bei ihrer Bildrate.
