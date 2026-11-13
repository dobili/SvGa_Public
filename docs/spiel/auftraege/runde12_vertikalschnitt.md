# Runde 12: Vertikalschnitt Akt 1, Karten überarbeiten

Stand 13.11.2026. Ziel: Akt 1 vollständig spielbar und schön, damit der Autor ihn auf der
interaktiven Weltkarte und auf dem Handy abnehmen kann (Optik und Durchgänge).

## Grundlage

- Prüfliste je Karte: `docs/spiel/26_Akt1_Kartenliste.md` (alles dort Genannte umsetzen).
- Regeln: `docs/spiel/KARTENREGELN.md`, besonders 10.74 bis 10.76 (Grundriss, Innenraumfaktor,
  Aufgang), Rückmeldungen R001 bis R151 (`docs/spiel/auftraege/rueckmeldung/sammlung.md`).
- Stimmung: `docs/spiel/20_Ortsblaetter.md` (Akt 1), Roman Akt 1 (Randnotizen `[Karte: …]`).
- Technik der Karte: `inhalte/abenteuer/README.md` (licht, licht_zustaende, teilchen,
  klangquellen, Zustände, Auslöser), Klangkennungen aus `docs/spiel/21_Klangplan.md`.
- Grafik nur aus dem Katalog (`register/katalog.json`, privat, nur lesen); fehlt etwas, Bildwunsch in
  der Rückmeldung nennen, nicht selbst zeichnen (außer Flaches).

## Verteilung

- **mittel-4:** Maple Falls: außen, Wohnzimmer, Dachboden, Zimmer des Helden (neu,
  `mapleFalls.zimmer`, mit Fensterbank), Park, Clubraum, Diner, dazu Kürbishof.
- **mittel-2:** Weg und Cedar Creek: Landstraße, Flussweg, Zedernpfad, Cedar Creek außen mit Steg,
  Bibliothek mit Lesesaal, Archiv, Waschsalon, Drechslerei.

Grenzen: Wer eine Karte überarbeitet, ändert dafür auch `orte.json` (Auslöser, Figurenplätze mit
Stufen, Zustände, Licht, Musik, Klangquellen, Teilchen). Ink-Dateien nur, wenn ein Knoten anders
heißen muss, und dann melden. Übergänge zwischen Karten müssen zur Weltkarte passen
(`python -m pipeline.abenteuer.weltpuzzle --bild …`).

## Ablauf je Karte

1. Prüfliste lesen, Karte bauen oder ändern, Hintergrund rendern.
2. Prüfungen: pytest, `npm run pruefen`, Gesamtsimulation (Abspann, keine unerreichbaren Knoten der
   Karte mehr).
3. Bildschirmfoto der Karte (alle Zustände) für den Hauptchat; ein Commit je Karte.
4. Am Ende kurze Liste: erledigt, offen (mit Grund), Bildwünsche.

Der Hauptchat baut daraus die interaktive Weltkarte für den Autor.
