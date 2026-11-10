"""Partieformen der Runde 6 (``inhalte/abenteuer/partieformen.json``): Stellungen gültig, Verweise da.

Warum: Gedächtnisstellungen zeigt die App ohne weitere Prüfung; eine kaputte FEN fiele erst im
Spiel auf. Simultan spielt Begegnungen nacheinander; jede muss es in ``begegnungen.json`` geben,
und die Mindestzahl der Siege darf nicht größer sein als die Zahl der Bretter.
"""

import json
from pathlib import Path

import chess

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"


def _lade(name: str) -> dict:
    return json.loads((INHALTE / name).read_text(encoding="utf-8"))


def test_gedaechtnisstellungen_sind_gueltig():
    for eintrag in _lade("partieformen.json")["gedaechtnis"]:
        brett = chess.Board(eintrag["fen"])
        assert brett.is_valid(), f"{eintrag['kennung']}: Stellung ungültig ({brett.status()!r})"


def test_simultan_verweist_auf_begegnungen():
    begegnungen = {b["kennung"] for b in _lade("begegnungen.json")["begegnungen"]}
    for eintrag in _lade("partieformen.json")["simultan"]:
        fehlend = [b for b in eintrag["begegnungen"] if b not in begegnungen]
        assert not fehlend, f"{eintrag['kennung']}: Begegnungen fehlen: {fehlend}"
        assert eintrag["mindestens"] <= len(eintrag["begegnungen"]), eintrag["kennung"]
