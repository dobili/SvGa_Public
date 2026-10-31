"""Tests für den Figurensatz „Gold“ (``pipeline/figuren/gold_umfaerben.py``).

Prüft, dass keine Grundfarbe von Cburnett übrig bleibt, weiße Figuren den goldenen Verlauf tragen
und die eingecheckten Dateien (Pipeline und App) dem Ergebnis des Skripts entsprechen.
"""

from pathlib import Path

from pipeline.figuren.gold_umfaerben import APP_ZIEL, FARBEN, FIGUREN, NAME, SAETZE, VERLAUF, erzeuge


def test_weisse_figuren_tragen_den_verlauf() -> None:
    """Jede weiße Figur füllt mit dem Verlauf; schwarze haben keinen."""
    for figur in FIGUREN:
        weiss = (SAETZE / NAME / f"w{figur}.svg").read_text(encoding="utf-8")
        schwarz = (SAETZE / NAME / f"b{figur}.svg").read_text(encoding="utf-8")
        assert f"url(#{VERLAUF})" in weiss
        assert VERLAUF not in schwarz


def test_keine_grundfarbe_uebrig() -> None:
    """Schwarz, Weiß und das helle Grau des Originals kommen nicht mehr vor."""
    for farbe in FARBEN:
        for figur in FIGUREN:
            svg = (SAETZE / NAME / f"{farbe}{figur}.svg").read_text(encoding="utf-8").lower()
            for alt in ("#000", "#fff", "#ececec"):
                assert f'="{alt}"' not in svg


def test_eingecheckt_wie_erzeugt(tmp_path: Path) -> None:
    """Das Skript liefert genau die eingecheckten Dateien, in der Pipeline und in der App."""
    erzeuge(tmp_path)
    for farbe in FARBEN:
        for figur in FIGUREN:
            datei = f"{farbe}{figur}.svg"
            neu = (tmp_path / datei).read_text(encoding="utf-8")
            assert neu == (SAETZE / NAME / datei).read_text(encoding="utf-8")
            assert neu == (APP_ZIEL / datei).read_text(encoding="utf-8")
