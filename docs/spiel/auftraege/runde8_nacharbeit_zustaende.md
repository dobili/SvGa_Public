# Auftrag Runde 8: Notizen des Autors einarbeiten und Zustände je Karte (10.11.2026)

**Basis:** `claude/friendly-shannon-y8bf90` hereinholen (Commit dieses Auftrags oder neuer). Bilder
nur in einem eigenen Zweig des privaten Repositorys (`<helfer>-runde8`), nie auf main. Keine
Rückfragen an den Autor.

## Warum

Der Autor hat auf der Revisionsseite Akt 1, Riverton, Weg 2, Weg 3, Lockport und Ironwood
beurteilt. Seine Bitte:

> Erst einmal mein Feedback einbauen und die Fehler beheben. Dann für jede Karte alle Varianten
> zeichnen, die es in der Geschichte gibt. Wenn sich etwas Festes in der Karte ändert (eine
> Absperrung kommt dazu oder geht weg, ein Bus steht da oder geht weg), hätte ich das gern als
> Variante, mit der Beschreibung, wo das in der Geschichte ist, was sich geändert hat und warum.
> Figuren und Tiere zählen nicht.

Er sieht gerade die übrigen Karten durch. Diese Runde betrifft nur die schon beurteilten Karten.

## Grundlagen

1. **Notizen:** `docs/spiel/auftraege/revision2_notizen.md`. Zuerst „Allgemeine Punkte“, dann der
   Abschnitt je Karte. Jede Notiz wird umgesetzt, oder die Ortsdokumente begründen, warum nicht.
   Fragen des Autors beantwortet ihr im Ortsdokument (Teil 3) mit einer Empfehlung und setzt sie
   um.
2. **Neue Regeln:** KARTENREGELN 10.56 bis 10.63, ganz am Ende:
   - 10.56 Innenräume nach der Größe des Gebäudes, nicht mehr „ein Bildschirm“;
   - 10.57 Kanäle mit befestigtem Ufer, Maße für Frachtkähne, Brücke;
   - 10.58 Weg zu jeder Tür;
   - 10.59 Waren auf Ständen;
   - 10.60 nur Bilder in unserer Ansicht;
   - 10.61 Grund für jedes auffällige Objekt;
   - 10.62 Gleise;
   - 10.63 Zustände.
     Dazu die alten Regeln 23 (natürliches Wasser nicht gerade) und 24 (Boote längs), die mehrfach
     verletzt waren.
3. **Gewählte Varianten sind schon zur Hauptfassung gemacht** (die alte A liegt als `-a`):
   - Variante C: riverton.schuppen, wegCedarRiverton.bahndamm, wegCedarRiverton.zedernwald,
     lockport.gasthaus, ironwood.aussen.
   - Variante A: alle übrigen.
   - Für riverton.wohnwagen fehlt eine Wahl. Dort gilt A.
   - Gebaut wird nur noch an der Hauptfassung, B und C bleiben liegen.
4. **Zustände:**
   - Die Geschichte steht in der Story-Bibel (`docs/spiel/05_Story_Bibel.md`, Szenen je Akt).
   - Die Sperren stehen in `13_Wegenetz.md` und `auftraege/runde6_sammlung.md`, die Ereignisse
     „später“ in `15_Routen_Ereignisse.md`.
   - Das Ortsdokument nennt die Zustände.
   - Technik: `zustaende` in `orte.json`, Vorbild Musikhaus `musikhausOffen` und Diner
     `neonRepariert`. mittel-2 erweitert die Technik zuerst (siehe unten).

## Was je Karte zu tun ist

1. Notizen und neue Regeln umsetzen, Kartenbauer ohne Befund, Vorschaubild rendern und selbst
   ansehen. Es zählt das Bild, nicht nur die Prüfung.
2. Bei Innenräumen die logische Größe festlegen (Gebäude außen, Zweck) und den Raum danach bauen.
3. Zustände der Karte auflisten. Je Zustand eine Szene `<basis>-<zustand>.json` mit Eintrag in
   `zustaende`. Die `beschreibung` beginnt mit „Zustand: …“ (wann, was, warum). Beispiele:
   - Park: Steg gesperrt bis zur ersten Nadel, danach der neue Steg.
   - Park: Schulbus an der Haltestelle in Szene 13.
   - Musikhaus: alt oder neu.
4. Ortsdokument Teil 3 nachziehen: Liste der Zustände, Antworten auf die Fragen des Autors.

## Verteilung

| Helfer    | Karten                                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| niedrig-1 | Akt 1 außen: Maple Falls (Straße, Park), Cedar Creek, Weg 1 (Flussweg, Landstraße, Zedernpfad), Rest: „GESPERRT“ passt nicht, Limostand ohne Waren. Lockport außen und Gasthaus. Weg 2 (Bahndamm, Zedernwald) |
| mittel-1  | Akt-1-Innenräume nach 10.56 (Maple Falls: Wohnzimmer, Dachboden, Clubraum, Diner; Cedar Creek: alle Innenräume). Daneben Weltschachtag in der Simulation                                                      |
| mittel-3  | Riverton: außen, Bahnhofshalle, Pavillon, Slicks Wohnwagen, Schuppen                                                                                                                                          |
| mittel-4  | Weg 3 (Eisenbrücke, Kanalweg), Ironwood außen und Kantine                                                                                                                                                     |
| mittel-2  | **Technik der Zustände zuerst**, dann `zahle(muenzen)`, dann Aufteilen der Oberwelt                                                                                                                           |

### mittel-2: Technik der Zustände

1. **Bedingungen:**
   - Schlüssel in `zustaende` dürfen dieselben Bedingungen sein wie `wenn` an Übergängen, also
     Variable, Vergleich (`nadelMapleFalls >= 1`), `und`, `oder`, Besitz.
   - Reihenfolge: Der letzte passende Zustand gilt.
   - Ohne passenden Zustand gilt die Grundkarte.
   - Schema, App und pytest anpassen.
2. **Bilder:** `kartenbild.py` rendert für jede Zustandsszene ein eigenes Bild
   `grafik/karten/<kennung>-<zustand>.png` und überschreibt nicht das Bild der Grundkarte. B und C
   schreiben heute auf dieselbe Datei wie A.
3. **Liste für die Seite:** `python -m pipeline.abenteuer.zustaende` listet je Karte die Zustände
   mit Bedingung und dem „Zustand:“-Satz. Der Haupt-Chat baut daraus die neue Seite für den Autor.

## Ende

- Kartenbauer und Übergänge ohne Befund, pytest, `npm run pruefen`, e2e Abenteuer.
- Commit, Push (öffentlich auf euren Zweig, Bilder privat auf `<helfer>-runde8`), Meldung mit Liste
  der Karten, Zustände und Antworten auf die Fragen des Autors.
