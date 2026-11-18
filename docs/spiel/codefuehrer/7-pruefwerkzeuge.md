# Codeführer: Prüfwerkzeuge

Für die Welt des Spiels gibt es viele kleine Prüfungen in `pipeline/abenteuer/`. Jede hat eine
Regel aus `docs/spiel/KARTENREGELN.md` oder eine Rückmeldung des Autors als Grund. Die meisten
geben Rückgabewert 1 bei Befunden; viele laufen zusätzlich als Test in `pipeline/tests` mit.

## Übergänge

- `python -m pipeline.abenteuer.uebergaenge`: Gegenstücke, Ränder und Türen passen zusammen.
- `python -m pipeline.abenteuer.uebergangsbilder [--ort KENNUNG]`: Tür, Treppe oder Weg passen
  zur Art und zu beiden Orten (Regel 10.77); mit `--boegen ORDNER --privat PRIVAT` Kontaktbögen
  beider Seiten.
- `durchgang.py`, `ankunftsfeld.py`, `uebergangstueren.py`, `tuergroesse.py`,
  `tuermessung.py`: der ganze Durchgang ist gedeckt, die Ankunft frei, Türen in Menschengröße.

## Räume und Anordnung

- `python -m pipeline.abenteuer.raumgroesse`: Innenraum gegen Gebäude außen (Regel 10.75).
- `python -m pipeline.abenteuer.ausrichtung`: Bilder stehen in ihrer Richtung (Regel 10.78).
- `python -m pipeline.abenteuer.anordnung`, `tischlage`, `gedeck`: Möbelanordnung, Lage am Tisch,
  Essen nur bei Gästen.
- `python -m pipeline.abenteuer.blickrichtung`: stehende Figuren blicken zu Tresen, Brett oder
  Gesprächspartner.
- `figurensperre.py`, `engstelle.py`, `feinmasken_pruefung.py`: niemand und nichts versperrt
  den Weg.
- `python -m pipeline.abenteuer.kopfkachel`: Kacheln über stehenden und sitzenden Figuren, die
  seit dem 18.11.2026 begehbar sind (Figuren sperren nur ihre Fußkachel), und Bereiche, die dadurch
  erreichbar wurden.
- `zusammenhang.py`, `stadtgroesse.py`, `abkuerzung.py`, `varianten.py`, `fahrzeuge.py`.

## Texte und Dialoge

- `python -m pipeline.abenteuer.sprache [--woerterbuch]`: Zeichen, Anrede, Namen, Tippfehler der
  Spieltexte.
- `python -m pipeline.abenteuer.inkbesuche [--alle]`: Besuchszähler in Bedingungen, die einen
  früheren Dialog voraussetzen (dafür `VAR` nehmen).

## Daten

`pipeline/abenteuer/__init__.py` und `pipeline/tests/test_abenteuer*.py` prüfen die Spieldaten
gegen die Schemas und untereinander (Kennungen, Verweise, Quests).

Eine vollständige Liste aller Module mit Aufruf steht auf der Seite „Werkzeuge der Pipeline“.
