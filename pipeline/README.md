# Pipeline – Wegweiser

Die Pipeline macht aus den LaTeX-Quellen des Buches die Daten der App (Konzept Abschnitt 5).
Sie läuft auf Claudes Arbeitsrechner oder in GitHub Actions, nie auf dem Gerät des Lesers.

| Ordner/Datei | Aufgabe | Anfangen mit |
|---|---|---|
| `befunde.py` | Was die Pipeline dem Autor meldet | `Befund`, `Schwere` |
| `lesen/latex.py` | Kommentare, Klammern, Zeilennummern | `lies_gruppe` |
| `lesen/quellen.py` | Alle Kapitel und Anhänge in Buchreihenfolge | `lies_quellen` |
| `lesen/verzeichnis.py` | Ziele von `\ref`, `\cite`, `\glseite` wie in LaTeX | `baue_verzeichnis` |
| `lesen/diagramme.py` | Diagrammbefehle eines Kapitels finden | `lies_kapitel` |
| `lesen/text.py` | LaTeX-Text in Textteile wandeln (Stil, Züge, Verweise, Zeichen) | `wandle_text` |
| `lesen/uebungen.py` | Übungen (`zugamzug`) und Lösungen (`\loesungeintrag`) | `lies_uebungen` |
| `lesen/nachschlagen.py` | Denkroutine (Kopiervorlage) und Gesamt-Checkliste (Kapitel 12) | `baue_nachschlagen` |
| `lesen/glossar.py` | Glossar mit Stellen und Pfeilverweisen | `lies_glossar` |
| `lesen/bilanzen.py` | Steckbriefe, Ziel- und Faktorenbilanzen | `lies_bilanzen` |
| `lesen/zugfolgen.py` | `\zugfolge{…}` lesen: deutsche Notation, Zusammenhang, Verweise | `lies_zugfolgen` |
| `zugfolgen/baum.py` | Variantenbaum eines Beispiels (Knoten, Abbildungen) | `Beispiel` |
| `zugfolgen/nachspielen.py` | Zugfolgen nachspielen, Abbildungen zuordnen | `Nachspieler` |
| `zugfolgen/anschluss.py` | An welcher Stellung setzt eine Zugfolge an? (Kandidaten, Zugnummern, Schachzeichen) | `Anschlusssuche` |
| `zugfolgen/zuordnung.py` | Abbildungen an Knoten hängen, Unterschriften prüfen, Kopien aus früheren Kapiteln | `Abbildungszuordnung` |
| `zugfolgen/kapitel.py` | Lesen und Nachspielen je Kapitel verbinden | `spiele_kapitel` |
| `zugfolgen/pgn.py` | PGN-Entwürfe schreiben, freigegebene lesen und abgleichen | `schreibe_entwurf` |
| `zugfolgen/zugzeichen.py` | Zugzeichen mit Stockfish prüfen (Schritt 5) | `Zugzeichenpruefer` |
| `zugfolgen/freigabe.py` | Prüfhilfe für die Freigabe (AP 4): `buch/arbeit/freigabe/kapNN.md` | `schreibe_pruefhilfe` |
| `zugfolgen/empfehlungen.py` | Einschätzungen und Empfehlungen von Hand lesen und in der Prüfhilfe zeigen | `lies_empfehlungen` |
| `texte/loesungen.py` | Lösungserklärungen (AP 6) prüfen, freigegebene in die Übungsdaten | `pruefe_loesungstexte` |
| `pruefen/abbildungen.py` | FEN, Zugseite, Matt, Nummern, Verweise je Kapitel | `pruefe_zugseite` |
| `pruefen/buch.py` | Prüfungen aus `pruefe_buch.py` über das ganze Buch | `pruefe_buch` |
| `pruefen/daten.py` | Fertige Daten gegen die Schemas (ohne Buchquellen, für die CI) | `pruefe_datenordner` |
| `bauen/kapitel.py` | Abbildungen im Format der Schemas | `baue_kapitel` |
| `bauen/inhalte.py` | Übungen, Steckbriefe, Bilanzen, Glossar im Format der Schemas | `baue_kapitelinhalte` |
| `bauen/__main__.py` | Der ganze Datenlauf mit Schema-Prüfung | `main` |
| `bauen/bericht.py` | Bericht für den Autor in `buch/arbeit/berichte/` | `schreibe_bericht` |
| `figuren/erzeuge_figuren.py` | Figuren aus SkakNew als Vektorpfade | `lies_figuren` |
| `tests/` | pytest, mit eigenem Testkapitel statt Buchtext | `test_lesen.py` |

Datenlauf:

```bash
python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1             # alle Kapitel
python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1 --kapitel 1  # nur Kapitel 1
python -m pipeline.bauen --buch buch/a1 --ziel app/public/daten/de/a1 --zugzeichen  # dazu Engine-Prüfung (≈ 8 min)
python -m pipeline.pruefen.daten app/public/daten/de/a1                            # ohne Buchquellen
python -m pipeline.wartung                                                         # Wartung (R57): Live-Seite, Links, CI, Abhängigkeiten
python -m pytest
```

Die Buchquellen liegen nur lokal in `buch/a1/` (siehe `CLAUDE.md`, Regel 2).

Ergebnis: `kap00.json` bis `kap12.json` (Abbildungen, Übungen, Steckbriefe, Bilanzen, freigegebene
Beispiele), `glossar.json`, `index.json`, die PGN-Entwürfe in `inhalte/de/zugfolgen/` (siehe
`inhalte/de/README.md`), die Prüfhilfe für die Freigabe `buch/arbeit/freigabe/` und der Bericht
`buch/arbeit/berichte/datenlauf-<datum>.md`. Prüfhilfe und Bericht bleiben lokal (wie die
Buchquellen nie im Repository), weil sie Buchtext zitieren können.
