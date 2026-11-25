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
    # Weitere Standbilder für die Zustandswahl im Editor (mittel-1): nur der Standard, denn
    # „Without“ ist der Hilfszustand fürs Gehen und „Sitting“ ein Sitzzustand.
    standbilder = json.loads((figur / "standbilder.json").read_text())
    assert standbilder == [{"kennung": "idle", "name": "Idle", "standard": True}]
    assert I.kennung("Without the telescop") == "without-the-telescop"
    assert I.kennung("Instrument on his back, ä") == "instrument-on-his-ba"
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


def test_verdeckung_jede_sitz_und_liegestelle_hat_vordergrund_oder_grund():
    # Vordergrund über Sitzenden und Liegenden (verdeckung.py, vordergrund.ts): „0 Befunde“.
    from pipeline.abenteuer import verdeckung

    assert verdeckung.befunde() == []
    assert len(verdeckung.stellen()) > 100


def test_verdeckung_seitlich_nur_unter_der_sitzflaeche():
    # Nachgebauter Seitenstuhl (Lehnenstange links, Sitzblock 11 bis 13, Beine, Querstrebe auf 18):
    # Blick seitlich deckt erst ab der Unterkante der Sitzfläche, die Rumpfzeilen bleiben frei.
    from pipeline.abenteuer import verdeckung as V

    sichtbar = (3, 1, 12, 21)
    deckend = [12 if 11 <= y <= 13 or y == 18 else 2 if y < 11 else 4 for y in range(1, 22)]
    assert V.sitzunterkante(deckend, 1, 12) == 13
    for blick in ("links", "rechts"):
        assert V.sitzgrenze(deckend, sichtbar, blick, "stuhl") == 13
    assert V.sitzgrenze(deckend, sichtbar, "oben", "stuhl") == round(1 + 21 * 0.55)
    assert V.sitzgrenze(deckend, sichtbar, "unten", "stuhl") is None
    assert V.sitzgrenze([2] * 21, sichtbar, "links", "stuhl") == round(1 + 21 * V.VORGABE_SEITE)
    assert V.sitzgrenze(deckend, sichtbar, "links", "stuhl", {"ab": 1}) is None


def _png_kopf(breite: int, hoehe: int) -> bytes:
    """Nur der Kopf eines PNG (Kennung und IHDR): genug für bildgroesse."""
    return I.PNG_KENNUNG + b"\x00\x00\x00\rIHDR" + breite.to_bytes(4, "big") + hoehe.to_bytes(4, "big")


def test_hohe_leinwand_aus_dem_png_kopf_und_neueste_zuordnung(tmp_path):
    """Schiffskoch auf 32 × 48 (25.11.2026): metadata.json nennt die Höhe, die neue Zuordnung gilt."""
    _export(tmp_path)
    assert I.bildgroesse(_png_kopf(32, 48)) == (32, 48)
    assert I.bildgroesse(PNG) is None
    # Quadratische Leinwand bleibt 32 × 32 wie bisher (nur der Koch ist eine Ausnahme).
    archiv = tmp_path / "ki-roh" / "koch.zip"
    with zipfile.ZipFile(archiv, "w") as z:
        for r in I.RICHTUNGEN:
            z.writestr(f"k/Idle/rotations/{r}.png", _png_kopf(32, 48))
    neu = {
        "gruppen": [
            {
                "name": "abe",
                "zip": "ki-roh/koch.zip",
                "zustaende": [{"name": "Idle", "ordner": "k/Idle", "prompt": "old man about 70"}],
            }
        ]
    }
    (tmp_path / "ki-roh" / "zuordnung_25-11.json").write_text(json.dumps(neu), encoding="utf-8")
    assert [p.name for p in I.zuordnungsdateien(tmp_path)] == ["zuordnung_25-11.json", "zuordnung_23-11.json"]
    gruppe = I.lade_gruppen(tmp_path)[0]
    assert gruppe.zip == "ki-roh/koch.zip"
    I.schreibe_figur(tmp_path, gruppe)
    meta = json.loads((tmp_path / I.ZIEL / "abe" / "metadata.json").read_text())
    assert meta["states"][0]["character"]["size"] == {"width": 32, "height": 48}


def test_sichtbare_hoehe_hohe_leinwand_und_koch_ohne_faktor(tmp_path):
    """32 × 48: Schatten in den unteren acht Zeilen; der Schiffskoch bekommt keinen Faktor (Mütze)."""
    bild_modul = pytest.importorskip("PIL.Image")
    bild = bild_modul.new("RGBA", (32, 48), (0, 0, 0, 0))
    for y in range(8, 46):
        bild.putpixel((16, y), (200, 100, 50, 255))
    for x in range(10, 22):
        bild.putpixel((x, 46), (*H.SCHATTEN, 255))
    ordner = tmp_path / H.FIGUREN / "schiffskoch" / "rotations"
    ordner.mkdir(parents=True)
    bild.save(ordner / "south.png")
    assert H.sichtbare_hoehe(ordner / "south.png") == 38
    zuordnung = {"gruppen": [{"name": "schiffskoch", "zustaende": [{"prompt": "cook about 50"}]}]}
    (tmp_path / H.ZUORDNUNG).parent.mkdir(parents=True)
    (tmp_path / H.ZUORDNUNG).write_text(json.dumps(zuordnung), encoding="utf-8")
    assert "schiffskoch" in T.OHNE_FAKTOR
    zeile = H.messe(tmp_path)[0]
    assert (zeile["hoehe"], zeile["faktor"]) == (38, None)
