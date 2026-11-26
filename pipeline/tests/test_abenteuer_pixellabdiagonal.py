"""Tests für pipeline/abenteuer/pixellabdiagonal.py: Schrägen von Held, Heldin und Begleitern."""

import json
import zipfile

from pipeline.abenteuer import pixellabdiagonal as D

PNG = b"\x89PNG-Probe"


def test_uebernimmt_acht_richtungen_aus_dem_zustand_mit_gehen(tmp_path):
    archiv = tmp_path / "ki-roh" / "held_diagonal_26-11.zip"
    archiv.parent.mkdir(parents=True)
    meta = {"states": [{"folder": "Idle", "frames": {"animations": {"Walking": {}, "Running": {}}}}]}
    with zipfile.ZipFile(archiv, "w") as z:
        z.writestr("metadata.json", json.dumps(meta))
        for r in D.GERADE + D.SCHRAEG:
            z.writestr(f"Idle/rotations/{r}.png", PNG)
            z.writestr(f"Idle/animations/Walking/{r}/frame_000.png", PNG)
            if r != "south-west":
                z.writestr(f"Idle/animations/Running/{r}/frame_000.png", PNG)
        z.writestr("Sitting_on_an_invisi/rotations/north-east.png", PNG)
    zahl = D.uebernimm_figur(tmp_path, "held-0")
    assert zahl == {"rotations": 8, "Walking": 8, "Running": 7, "fehlt": 1}
    ziel = tmp_path / D.ZIEL / "held-0"
    assert (ziel / "animations" / "Walking" / "north-east" / "frame_000.png").exists()
    assert not (ziel / "zustaende").exists()


def test_andere_figuren_und_fehlender_export_bleiben_unberuehrt(tmp_path):
    assert D.uebernimm_figur(tmp_path, "abe") is None
    assert D.uebernimm_figur(tmp_path, "juno") is None
    assert set(D.DIAGONALEXPORTE) == {"held-0", "heldin-0", "juno", "mutter"}
