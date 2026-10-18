"""Tests für die Holz-Figurensätze (``pipeline/figuren/holz_maserung.py``).

Prüft, dass jede Holzfigur das Maserungsmuster enthält, keine Grundfarbe des Originals
übrig bleibt und eingecheckte Dateien dem Ergebnis des Skripts entsprechen.
"""

from pathlib import Path

import pytest

from pipeline.figuren.holz_maserung import FARBEN, FIGUREN, HOLZSAETZE, QUELLE, SAETZE, erzeuge


@pytest.mark.parametrize("name", list(HOLZSAETZE))
def test_jede_figur_hat_maserung(name: str) -> None:
    """Weiße Figuren tragen das helle Muster gL, schwarze das dunkle gD."""
    for farbe in FARBEN:
        kennung = "gL" if farbe == "w" else "gD"
        for figur in FIGUREN:
            svg = (SAETZE / name / f"{farbe}{figur}.svg").read_text(encoding="utf-8")
            assert f'<pattern id="{kennung}"' in svg
            assert f"url(#{kennung})" in svg


@pytest.mark.parametrize("name", list(HOLZSAETZE))
def test_grundfarben_ersetzt(name: str) -> None:
    """Die Farben, die das Skript ersetzen soll, kommen in der Holzfigur nicht mehr vor."""
    satz = HOLZSAETZE[name]
    for farbe in FARBEN:
        zuordnung = satz.farben_weiss if farbe == "w" else satz.farben_schwarz
        for figur in FIGUREN:
            svg = (SAETZE / name / f"{farbe}{figur}.svg").read_text(encoding="utf-8").lower()
            for alt in zuordnung:
                assert f'fill="{alt}"' not in svg
                assert f"fill:{alt};" not in svg


@pytest.mark.parametrize("name", list(HOLZSAETZE))
def test_eingecheckt_wie_erzeugt(name: str, tmp_path: Path) -> None:
    """Das Skript liefert genau die eingecheckten Dateien (gleicher Startwert, gleiches Bild)."""
    assert (QUELLE / HOLZSAETZE[name].quelle).is_dir()
    erzeuge(name, HOLZSAETZE[name], ziel=tmp_path)
    for datei in (SAETZE / name).iterdir():
        assert (tmp_path / name / datei.name).read_text(encoding="utf-8") == datei.read_text(encoding="utf-8")
