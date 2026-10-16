# Eröffnungsnamen von Lichess

Die Dateien `a.tsv` bis `e.tsv` sind eine unveränderte Kopie der freien Eröffnungsliste von
Lichess (<https://github.com/lichess-org/chess-openings>, Stand 15.10.2026): ECO-Schlüssel,
englischer Name und Zugfolge von rund 3.900 benannten Eröffnungsstellungen.

**Lizenz:** Laut Projekt gemeinfrei („As a collection of facts, this data set is in the public
domain … released under the CC0 Public Domain Dedication“), CC0 1.0
(<https://creativecommons.org/publicdomain/zero/1.0/>). Eintrag in `docs/LIZENZEN.md`.

**Verwendung:** `python -m pipeline.eroeffnungsliste` macht daraus
`app/public/daten/de/eroeffnungen-lichess.json` (Stellung → ECO und Name, die gängigen
Familiennamen auf Deutsch nach `inhalte/de/eroeffnungsfamilien.json`). Das Werkzeug „Eröffnung“
nennt damit Eröffnungen, die nicht im Buch stehen (Vorschlag G, Entscheidung des Autors vom
15.10.2026). Neue Fassung: die fünf Dateien aus dem Projekt neu herunterladen und den Befehl
erneut ausführen.
