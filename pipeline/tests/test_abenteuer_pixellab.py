"""Tests des PixelLab-Imports (pixellabimport.py, pixellabtabelle.py, pixellabhoehen.py).

Ohne privates Repository: ein kleiner Sammelexport im Arbeitsordner. Pillow nur für die Höhenmessung.
"""

import json
import zipfile

import pytest

from pipeline.abenteuer import pixellabhoehen as H
from pipeline.abenteuer import pixellabimport as I
from pipeline.abenteuer import pixellabtabelle as T

PNG = b"\x89PNG-Probe"


def _export(tmp_path):
    """Ein Zip mit Abe: Idle (mit Teleskop, ohne Animation) und ein Hilfszustand mit Laufanimation."""
    archiv = tmp_path / "ki-roh" / "selected.zip"
    archiv.parent.mkdir(parents=True)
    with zipfile.ZipFile(archiv, "w") as z:
        for ordner in ("c/Idle/Idle", "c/Idle/Without", "c/Idle/Sitting on an invisi"):
            for r in (*I.RICHTUNGEN, "south-east"):
                z.writestr(f"{ordner}/rotations/{r}.png", PNG)
        for r in I.RICHTUNGEN:
            for bild in range(6):
                z.writestr(f"c/Idle/Without/animations/Walking/{r}/frame_{bild:03d}.png", PNG)
    zuordnung = {
        "gruppen": [
            {
                "name": "abe",
                "zip": "ki-roh/selected.zip",
                "zustaende": [
                    {"name": "Idle", "ordner": "c/Idle/Idle", "prompt": "old man about 70"},
                    {"name": "Without", "ordner": "c/Idle/Without", "animationen": {"Walking": {}}},
                    {"name": "Sitting on an invisi", "ordner": "c/Idle/Sitting on an invisi"},
                ],
            },
            {"name": "tier.hund", "zip": "ki-roh/selected.zip", "zustaende": []},
        ]
    }
    (tmp_path / I.ZUORDNUNG).write_text(json.dumps(zuordnung), encoding="utf-8")


def test_zustaende_werden_an_abgeschnittenen_namen_erkannt():
    assert I.zustandsordner("Sitting on an invisi") == "sitzstuhl"
    assert I.zustandsordner("New State: sitting d") == "sitzboden"
    assert I.zustandsordner("sitting down cross-l") == "sitzboden"
    assert I.zustandsordner("Sleeping, lying on t") == "schlaf"
    assert I.zustandsordner("Without the telescop") is None


def test_import_nimmt_standbild_nach_tabelle_und_laufen_vom_hilfszustand(tmp_path):
    _export(tmp_path)
    gruppen = I.lade_gruppen(tmp_path)
    assert [g.name for g in gruppen] == ["abe"]
    ergebnis = I.schreibe_figur(tmp_path, gruppen[0])
    figur = tmp_path / I.ZIEL / "abe"
    assert ergebnis["stand"] == "Idle" and ergebnis["animationen"]["Walking"][0] == "Without"
    assert sorted(p.name for p in (figur / "rotations").iterdir()) == sorted(f"{r}.png" for r in I.RICHTUNGEN)
    assert len(list((figur / "animations" / "Walking" / "south").iterdir())) == 6
    assert (figur / "zustaende" / "sitzstuhl" / "rotations" / "west.png").exists()
    groesse = json.loads((figur / "metadata.json").read_text())["states"][0]["character"]["size"]
    assert groesse == {"width": I.GROESSE, "height": I.GROESSE}


def test_alte_statistenboegen_bekommen_einen_neuen_typ():
    typen = {T.statistentyp(n) for n in range(1, T.STATISTEN + 1)}
    assert T.statistentyp(1) == "statist.kindA" and T.statistentyp(2) == "statist.kindB"
    assert T.statistentyp(9) == "statist.rentnerin" and T.statistentyp(36) == "statist.jugend"
    assert all(t.startswith("statist.") for t in typen) and "statist.bauer" not in typen


def test_alter_und_hoehenfaktor():
    assert H.alter_aus_prompt("woman in her early sixties, slightly stooped") == 62
    assert H.alter_aus_prompt("korean american boy, short, child height, 14, earnest") == 14
    assert H.altersgruppe("x", "16 year old girl") == "jugend"
    assert H.altersgruppe("x", "man about 70") == "alt"
    assert H.altersgruppe("empfangsroboter", "robot") == "keine"
    assert H.hoehenfaktor(31, "jugend") == pytest.approx(27.5 / 31, abs=1e-3)
    assert H.hoehenfaktor(27, "erwachsen") == H.HOECHSTENS
    assert H.hoehenfaktor(30, "erwachsen") is None
    assert H.hoehenfaktor(30, "keine") is None


def test_sichtbare_hoehe_ohne_bodenschatten(tmp_path):
    bild_modul = pytest.importorskip("PIL.Image")
    bild = bild_modul.new("RGBA", (32, 32), (0, 0, 0, 0))
    for y in range(2, 30):
        bild.putpixel((16, y), (200, 100, 50, 255))
    for x in range(10, 22):
        bild.putpixel((x, 30), (*H.SCHATTEN, 255))
    pfad = tmp_path / "south.png"
    bild.save(pfad)
    assert H.sichtbare_hoehe(pfad) == 28
