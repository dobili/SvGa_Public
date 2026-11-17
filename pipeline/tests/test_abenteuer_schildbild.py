"""Tests für pipeline/abenteuer/schildbild.py: Holzschilder mit Pixelschrift und Zeichen.

Ohne das private Repository: Die Bilder entstehen ganz aus dem Werkzeug.
"""

import pytest

Image = pytest.importorskip("PIL.Image")

from pipeline.abenteuer import schildbild as s  # noqa: E402


def farben(bild) -> set[tuple[int, int, int, int]]:
    px = bild.load()
    return {px[x, y] for x in range(bild.width) for y in range(bild.height)}


def test_alle_buchstaben_sind_fuenf_zeilen_hoch_und_gleichmaessig_breit():
    for buchstabe, muster in s.BUCHSTABEN.items():
        assert len(muster) == s.SCHRIFT_HOEHE, buchstabe
        assert len({len(zeile) for zeile in muster}) == 1, buchstabe


def test_textbreite_zaehlt_buchstaben_und_abstaende():
    assert s.textbreite("KIOSK") == 19
    assert s.textbreite("RANGER") == 24  # N ist vier Pixel breit
    with pytest.raises(KeyError):
        s.textbreite("CAFÉ")


def test_brett_hat_rahmen_kante_und_schrift():
    brett = s.brett(s.Schild("KIOSK", rand=1))
    assert brett.size == (23, s.BRETT_HOEHE)
    px = brett.load()
    assert all(px[x, 0] == s.RAND and px[x, s.BRETT_HOEHE - 1] == s.RAND for x in range(brett.width))
    assert all(px[0, y] == s.RAND and px[brett.width - 1, y] == s.RAND for y in range(brett.height))
    assert all(px[x, 1] == s.KANTE for x in range(1, brett.width - 1))
    # K beginnt gleich hinter Rand und einer Spalte Holz: linker Balken über alle fünf Zeilen.
    assert all(px[2, s.SCHRIFT_OBEN + zeile] == s.SCHRIFT for zeile in range(s.SCHRIFT_HOEHE))
    assert s.WIMPEL not in farben(brett)


def test_wimpel_steht_links_vor_der_schrift():
    brett = s.brett(s.Schild("RANGER", zeichen="wimpel"))
    assert brett.width == 36
    px = brett.load()
    assert all(px[3, s.SCHRIFT_OBEN + zeile] == s.SCHRIFT for zeile in range(s.SCHRIFT_HOEHE))  # Stock
    assert px[4, s.SCHRIFT_OBEN] == s.WIMPEL
    assert px[4, s.SCHRIFT_OBEN + 4] == s.HOLZ


def test_schildbild_liegt_mittig_im_kachelraster():
    bild = s.schildbild(s.SCHILDER["schild_bergladen"])
    assert bild.size == (48, 16)
    assert bild.getbbox() == (3, s.BRETT_OBEN, 45, s.BRETT_OBEN + s.BRETT_HOEHE)


def test_kreuz_der_bergwacht_passt_unter_das_dach():
    brett = s.brett(s.SCHILDER["schild_bergwacht"])
    assert brett.width == 47  # Wand unter dem Dach der Blockhütte: 49 Pixel
    px = brett.load()
    assert px[4, s.SCHRIFT_OBEN] == s.ROT and px[2, s.SCHRIFT_OBEN + 2] == s.ROT
    assert px[2, s.SCHRIFT_OBEN] == s.WEISS
    assert px[8, s.SCHRIFT_OBEN] == s.SCHRIFT  # B beginnt nach einer Spalte Holz


def test_main_schreibt_alle_bilder(tmp_path, capsys):
    assert s.main([str(tmp_path), "--ziel", str(tmp_path / "aus")]) == 0
    namen = sorted(p.name for p in (tmp_path / "aus").glob("*.png"))
    assert namen == sorted(f"{name}.png" for name in list(s.SCHILDER))
    assert "schild_kiosk.png" in capsys.readouterr().out
