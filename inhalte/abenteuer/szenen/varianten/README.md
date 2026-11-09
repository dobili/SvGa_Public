# Varianten der Szenen (KARTENREGELN 10.37)

Jede Karte entsteht in drei Varianten; der Autor wählt auf der Prüfseite eine aus.

- **Variante A** ist die Szene in `inhalte/abenteuer/szenen/<datei>.json` (die das Spiel lädt).
- **Varianten B und C** liegen hier als `<datei>-b.json` und `<datei>-c.json`. Sie sind Kopien der
  Szene mit zwei Änderungen: `"variante": "b"` (oder `"c"`) und `"datei":
"karten/varianten/<datei>-b.json"`. `karte` bleibt die Kennung der Karte.
- Bauen und prüfen wie jede Szene:
  `python -m pipeline.abenteuer.kartenbau inhalte/abenteuer/szenen/varianten/<datei>-b.json`,
  zeichnen mit `kartenbild` (die Vorschau heißt `<kennung>-b.png`; ein Hintergrund für das Spiel
  entsteht nur für Variante A). Die gebauten Karten unter `inhalte/abenteuer/karten/varianten/`
  werden nicht versioniert.
- Möbel aller drei Varianten stehen in derselben Möbeldatei des Ortes; Namen eindeutig (Vorsilbe
  der Runde, etwa `mf7…`).
- Nach der Wahl: Die gewählte Variante wird zur Szene (Felder `variante` entfernen, `datei` zurück
  auf `karten/<datei>.json`), die anderen bleiben hier liegen.
