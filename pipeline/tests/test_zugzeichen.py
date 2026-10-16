"""Test der Engine-Prüfung der Zugzeichen mit der echten Engine (Stockfish 19 lite unter Node).

Übersprungen, wenn die Engine nicht installiert ist (``cd app && npm ci``).
"""

import chess
import pytest

from pipeline.lesen.zugfolgen import Zug
from pipeline.zugfolgen.baum import Beispiel, Knoten, neuer_knoten
from pipeline.zugfolgen.zugzeichen import ENGINE_DATEI, Zugzeichenpruefer

pytestmark = pytest.mark.skipif(not ENGINE_DATEI.exists(), reason="Engine fehlt: cd app && npm ci")

# Nach 1. e4 e5 2. Sf3 Sc6, Weiß am Zug: Sg5?? stellt den Springer ein (Dxg5), Lc4 ist ein guter Zug.
NACH_SC6 = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"


def _beispiel_mit(fen: str, san: str, zeichen: str) -> Beispiel:
    wurzel = Knoten(chess.Board(fen), None, "", "", "", "")
    zug = Zug(san, san + zeichen, zeichen, 1, "w")
    neuer_knoten(wurzel, wurzel.brett.parse_san(zug.san), zug.buchtext, zug.zeichen, "test:1")
    return Beispiel("k99-01", 99, None, "Test", wurzel)


def test_zugzeichen_grober_fehler_und_guter_zug():
    pruefer = Zugzeichenpruefer()
    try:
        passend = list(pruefer.pruefe([_beispiel_mit(NACH_SC6, "Ng5", "??")]))
        unpassend = list(pruefer.pruefe([_beispiel_mit(NACH_SC6, "Bc4", "??")]))
    finally:
        pruefer.schliesse()
    assert passend == []
    assert [b.kennung for b in unpassend] == ["zugzeichen"]
    assert "Bc4??" in unpassend[0].text
