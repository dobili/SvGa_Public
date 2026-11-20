"""Tests zu pipeline/abenteuer/bildpruefung.py: fehlende, ungenutzte und falsch geformte Bilder
der Großansicht (#bild) und der Fundbilder, mit erfundenen Dialogen und Bildern."""

from pathlib import Path

from PIL import Image

from pipeline.abenteuer.bildpruefung import bericht, dateiname, pruefe


def lege_bild(ordner: Path, name: str, mass: tuple[int, int]) -> None:
    ordner.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", mass).save(ordner / name)


def aufbau(tmp_path: Path) -> tuple[Path, Path, Path]:
    dialoge = tmp_path / "dialoge" / "de"
    dialoge.mkdir(parents=True)
    (dialoge / "haus.ink").write_text(
        "Zeile eins. #bild:einzug_fahrt\nZeile zwei. #bild:aus\nZeile drei. #bild:sternenHimmel\n",
        encoding="utf-8",
    )
    daten = tmp_path / "daten"
    daten.mkdir()
    (daten / "funde.json").write_text(
        '{"funde": [{"kennung": "schluessel", "bild": "bilder/fund-schluessel.webp"},'
        ' {"kennung": "finchBauerB"}]}',
        encoding="utf-8",
    )
    (daten / "code.ts").write_text(' * Beispiel: "bilder/nur-im-kommentar.webp"\n', encoding="utf-8")
    bilder = tmp_path / "privat" / "spiel" / "bilder"
    lege_bild(bilder, "sternen-himmel.webp", (1024, 768))
    lege_bild(bilder, "fund-schluessel.webp", (1024, 768))
    lege_bild(bilder, "alt.webp", (1024, 768))
    return tmp_path / "dialoge", daten, tmp_path / "privat"


def test_dateiname_wie_in_der_app() -> None:
    assert dateiname("sternenHimmel") == "sternen-himmel"
    assert dateiname("blaues_heft") == "blaues-heft"
    assert dateiname("zeitung1858") == "zeitung1858"


def test_fehlend_ungenutzt_und_groesse(tmp_path: Path) -> None:
    dialoge, daten, privat = aufbau(tmp_path)
    lage = pruefe(privat, dialoge, (daten,))
    assert lage.fehlend == ["einzug-fahrt", "fund-finch-bauer-b"]
    assert lage.ungenutzt == ["alt"]
    assert "`fund-finch-bauer-b` (funde.json: finchBauerB)" in bericht(lage)
    text = bericht(lage)
    assert "`einzug-fahrt` (de/haus.ink:1)" in text
    assert "`fund-schluessel`: 1024 × 768 statt 512 × 512" in text
    assert "nur-im-kommentar" not in text


def test_hochgeladenes_png_zaehlt_und_wird_umgewandelt(tmp_path: Path) -> None:
    dialoge, daten, privat = aufbau(tmp_path)
    lege_bild(privat / "spiel" / "bilder", "einzug-fahrt.png", (1408, 1056))
    lege_bild(privat / "spiel" / "bilder", "fund-finch-bauer-b.jpg", (1024, 1024))
    lage = pruefe(privat, dialoge, (daten,))
    assert lage.fehlend == []
    assert "`einzug-fahrt`: wird beim Bau umgewandelt" in bericht(lage)
