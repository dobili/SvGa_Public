"""Bildwunsch von niedrig-1: Figuren mit eigenem Bild schützt figuren.py vor dem Überschreiben.

Warum: Der Postreiter hat seit dem Gemini-Bogen ein eigenes Bild (``spiel/figuren/postreiter.png``,
gebaut von ``postreiter_bogen()`` in ``niedrig1_runde9_karten.py``). ``python werkzeuge/figuren.py``
baut aber jede Figur aus ``figuren.json`` neu und würde den Bogen mit der alten Figur aus dem
Generator überschreiben (Hinweis des Haupt-Chats, 10.11.2026).

Was das Skript im privaten Repository ändert:
1. ``werkzeuge/figuren.json``: Der Postreiter bekommt ``"eigenes_bild": true``.
2. ``werkzeuge/figuren.py``: ``baue()`` überspringt den Spielbogen aller Figuren mit
   ``eigenes_bild``; das Porträt baut es weiter aus den Teilen.
Beide Schritte prüfen, ob sie schon gemacht sind, und lassen sich mehrfach ausführen.

Aufruf: python niedrig1_figuren_eigenes_bild.py /home/user/schach-abenteuer-inhalte
"""

import json
import sys
from pathlib import Path

ALT = '        spielformat(zusammensetzen(f)).save(ZIEL / f"{name}.png")\n'
NEU = (
    "        # Figuren mit eigenem Bild (Gemini-Bogen, etwa der Postreiter) nicht überschreiben.\n"
    '        if not f.get("eigenes_bild"):\n'
    '            spielformat(zusammensetzen(f)).save(ZIEL / f"{name}.png")\n'
)
EIGENE = ("postreiter",)


def figurenliste_markieren(haupt: Path) -> None:
    """Setzt ``eigenes_bild`` bei den Figuren aus ``EIGENE`` in figuren.json."""
    pfad = haupt / "werkzeuge" / "figuren.json"
    daten = json.loads(pfad.read_text(encoding="utf-8"))
    for name in EIGENE:
        daten["figuren"][name]["eigenes_bild"] = True
    pfad.write_text(json.dumps(daten, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def bauskript_anpassen(haupt: Path) -> None:
    """Ersetzt in figuren.py die Zeile, die den Spielbogen speichert, durch die Abfrage."""
    pfad = haupt / "werkzeuge" / "figuren.py"
    text = pfad.read_text(encoding="utf-8")
    if NEU in text:
        return
    if ALT not in text:
        raise SystemExit("figuren.py: Zeile zum Speichern des Spielbogens nicht gefunden")
    pfad.write_text(text.replace(ALT, NEU), encoding="utf-8")


def main(haupt: Path) -> None:
    figurenliste_markieren(haupt)
    bauskript_anpassen(haupt)


if __name__ == "__main__":
    main(Path(sys.argv[1]))
