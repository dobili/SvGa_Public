"""Schnellprüfung der PGN-Dateien eines Kapitels nach dem Bearbeiten von Hand.

Wozu diese Datei da ist:
    Nach Korrekturen mit ``bearbeiten.py`` soll sofort sichtbar sein, ob jede Datei lesbar ist,
    jede Abbildung an einem Zug steht, der ihre Stellung erreicht, und keine Abbildung in zwei
    Beispielen steht. Grundlage sind die FEN aus den App-Daten, die Buchquellen braucht es nicht.

Aufruf: ``python -m pipeline.zugfolgen.pruefe_pgn 4 5`` (Kapitelnummern). Ausgabe: Befunde je
Datei; Rückgabewert 1, wenn es welche gibt.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from pipeline.zugfolgen.pgn import STATUS_VERWORFEN, _lies_datei, lies_status

HAUPTORDNER = Path(__file__).resolve().parents[2]
ZUGFOLGEN = HAUPTORDNER / "inhalte" / "de" / "zugfolgen"
DATEN = HAUPTORDNER / "app" / "public" / "daten" / "de" / "a1"


def pruefe_kapitel(kapitel: int) -> list[str]:
    """Befunde zu allen nicht verworfenen PGN-Dateien eines Kapitels (leer = alles in Ordnung)."""
    daten = json.loads((DATEN / f"kap{kapitel:02d}.json").read_text(encoding="utf-8"))
    fen = {a["id"]: a["fen"] for a in daten["abbildungen"]}
    meldungen: list[str] = []
    gesehen: dict[str, str] = {}
    for pfad in sorted((ZUGFOLGEN / f"kap{kapitel:02d}").glob("*.pgn")):
        status = lies_status(pfad)
        if status == STATUS_VERWORFEN:
            continue
        gelesen = _lies_datei(pfad, kapitel, fen, status)
        meldungen += [f"{pfad.name}: {b.kennung}: {b.text}" for b in gelesen.befunde]
        for nummer in gelesen.verknuepfungen:
            if nummer in gesehen:
                meldungen.append(f"{pfad.name}: Abb. {nummer} steht auch in {gesehen[nummer]}")
            gesehen[nummer] = pfad.name
    return meldungen


def main(argumente: list[str]) -> int:
    meldungen = [m for k in argumente for m in pruefe_kapitel(int(k))]
    for meldung in meldungen:
        print(meldung)
    print(f"{len(meldungen)} Befunde")
    return 1 if meldungen else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
