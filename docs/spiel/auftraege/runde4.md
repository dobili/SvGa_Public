# Auftrag: Runde 4 der Karten (Akt 1 im neuen Maßstab)

**Stand:** offen (9.11.2026). **Zweig:** dein fester Sitzungszweig, Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen). Privates Repository auf `origin/main` holen
(Katalog `register/katalog.json`, Feldbeschreibung `register/KATALOG.md`), nur lesen, nicht pushen.

## Ziel

Die Karten von Akt 1 entstehen neu nach dem abgestimmten Verfahren: Ortsdokument → Bühnenbild →
Szene → Kartenbauer → Bildprüfung. Der Autor hat die Prüfung der Dokumente an den Haupt-Chat
übergeben; er sieht sich die fertigen Karten an. Grundlagen, in dieser Reihenfolge:

1. `docs/spiel/KARTENREGELN.md` (alle Abschnitte, Maßstab 7a.2, Vorbilder 8 und 9)
2. `docs/spiel/orte/README.md` (Aufbau der Ortsdokumente, große Außenkarten)
3. `docs/spiel/orte/maple-falls.md`, `docs/spiel/orte/cedar-creek.md` (Ortspläne, Übergänge, Muster
   Bühnenbild Erdgeschoss Whitlock)
4. `docs/spiel/12_Akt1_Leben.md`, `docs/spiel/13_Wegenetz.md` (Abschnitt 2 und 7.4)
5. `inhalte/abenteuer/ortsprofile.json`, `inhalte/abenteuer/szenen/README.md`

## Verteilung

| Helfer    | Karten                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------- |
| mittel-1  | `mapleFalls.wohnzimmer` (Erdgeschoss, Bühnenbild steht), `.dachboden`, `.clubraum`, `.diner` (neu), `.aussen`, `.park` |
| mittel-2  | `cedarCreek.aussen`, `.bibliothek`, `.archiv`, `.waschsalon`, `.drechslerei` (neu)                                     |
| niedrig-1 | `wegMapleCedar.landstrasse`, `.flussweg`, `.zedernpfad` (neu)                                                          |

## Schritte je Karte

1. **Bühnenbild** ins Ortsdokument (Abschnitt 4, nach dem Muster Erdgeschoss): Größe, Wände, Türen,
   Fenster, Böden, Laufwege, Zonen, Inventar mit Feld, Ausrichtung, Material, Stil, Zustand, Zweck;
   außen zusätzlich Abschnitte etwa in Bildschirmgröße mit je einer Entdeckung (7a.2, Regel 4),
   Plätze für die Rückkehr (13 §7.4) und die neuen Dinge aus 12 (als Möbel ohne Auslöser, siehe 3).
2. **Bilder aus dem Katalog** wählen. Für jedes Bild gilt:
   - Es ist `ganz`, oder es wird mit allen seinen Gegenstücken gesetzt.
   - Es ist sicher beschrieben (`sicher` ≥ 0,7 oder von Opus nachgeprüft). Ist es das nicht, sieh dir
     das Bild vergrößert selbst an und trag deine Beschreibung in
     `inhalte/abenteuer/katalog_korrekturen/<dein-name>.json` ein, im Format der Korrekturen in
     `register/korrekturen/` (`{"<pfad>": {feld: wert, "sicher": 0.9, "korrektur": "<dein-name>"}}`,
     dazu `"nur_pfad": true`, wenn sie nur für dieses eine Bild gilt). Das ist Text über die Bilder,
     keine Grafik, und darf deshalb ins öffentliche Repository.
   - Schatten: immer die `schatten`-Fassung, wenn es eine gibt.
   - Eine Möbelserie je Raum (Feld `serie`), passende Ansichten (Feld `ansichten`) für die Drehung.
3. **Möbel** in `inhalte/abenteuer/moebel.json` mit Vorsilbe je Karte (etwa `mf4`, `cc4`, `wg4`);
   `art`, `blick`, `zustand`, `stil` aus dem Katalog übernehmen.
4. **Szene** in `inhalte/abenteuer/szenen/` (vorhandene Datei ersetzen, neue Karten neu anlegen).
   Vorhandene Auslöser und Figuren bleiben mit ihren Namen. Neue Karten und Übergänge kommen in
   `inhalte/abenteuer/orte.json`, so wie sie in den Ortsdokumenten stehen (Felder auf beiden Seiten).
   Neue Nebenaufgaben, Dialoge und Auslöser für Gegenstände aus 12 kommen **nicht** in dieser Runde:
   Ihre Dinge stehen als Möbel bereit, die Auslöser folgen in Runde 5 (Inhalte).
5. **Bau und Prüfung:** `python -m pipeline.abenteuer.kartenbau <szene>` ohne Befunde,
   `python -m pipeline.abenteuer.uebergaenge` ohne Befunde für deine Karten, dann
   `python -m pipeline.abenteuer.kartenbild <privat> <vorschauordner> <szene>` (braucht Pillow) und
   **Bildprüfung**: Vorschau ansehen, jede Regel aus KARTENREGELN durchgehen, höchstens drei Runden
   verbessern. Katalogbefunde der Bildprüfung abarbeiten (unsicher → selbst ansehen und korrigieren).
6. `python -m pytest pipeline/tests -q`, in `app/` Prettier; committen und pushen auf deinen Zweig.

## Bericht

Je Karte: Größe, Zahl der Möbel, Befunde vor und nach der Bildprüfung, offene Punkte; dazu die Liste
deiner Katalogkorrekturen. Die Hintergründe im privaten Repository zeichnet der Haupt-Chat neu.

### niedrig-1 (Status: fertig)

| Karte                     | Größe    | Möbel | Befunde vorher → nachher                                    | Commit   |
| ------------------------- | -------- | ----- | ----------------------------------------------------------- | -------- |
| wegMapleCedar.landstrasse | 120 × 30 | 698   | Rand, Zaun auf Wand, Blick zum Wasser → keine               | 19a67053 |
| wegMapleCedar.flussweg    | 120 × 30 | 252   | Boot auf Wasser → keine                                     | 06377b49 |
| wegMapleCedar.zedernpfad  | 100 × 24 | 299   | Zedern mit Blick zur Wand, Zederngruppe als Bauteil → keine | a8ee840c |

Offene Punkte:

- Gegenstücke fehlen auf fremden Karten:
  - `cedarCreek.aussen` braucht ein Gegenstück am Westrand für `weiterCedar` (Flussweg) und für `zedernWeiterCedar` (Reihen 4–5).
  - `mapleFalls.park` braucht am Nordrand bei den Spalten 10–11 den Auslöser `zedernpfad`.
  - Bis dahin zeigen die Übergänge des Zedernpfads vorläufig auf `landstrasse` und `bushaltestelle`.
- Park ↔ Landstraße sind ungleich breit (2 ↔ 3 Felder); das wartet auf den Umbau des Parks.
- Der Stamm S2 ist ein Stapel liegender Stämme, der den Pfad sperrt; der lockere Wald daneben ist begehbar.
- Auslöser für Runde 5: Hufeisen, Weidetor, `aussichtKuppe`, Zedernzapfen, S2.

Katalogkorrekturen (`katalog_korrekturen/niedrig-1.json`):

- Vogelscheuche, Heuhaufen und Traktor (farm, Complete Tileset)
- Camping Wood_Board_1
- City_Props Tree_5 und Tree_6: `blick` keine
- Tree_15 hat `blick` keine, wird aber nicht benutzt, weil es ein Bauteil ist
