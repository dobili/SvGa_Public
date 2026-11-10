"""Tests der Vorführungen: Stellung passt zur Partie, Züge legal, Texte und Verweise vorhanden."""

from pipeline.abenteuer.vorfuehrungen import pruefe_alles, pruefe_verweise, pruefe_vorfuehrung

SCHAEFERMATT = "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6 4.Qxf7#"
NACH_ZWEI = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
TEXTE = {"vorfuehrung.schaefer.titel": "Schäfermatt", "vorfuehrung.schaefer.5": "Matt."}


def _vorfuehrung(**mehr: object) -> dict:
    v = {"kennung": "schaefer", "pgn": SCHAEFERMATT, "ab": 2, "fen": NACH_ZWEI}
    v["zuege"] = ["Bc4", "Nc6", "Qh5", "Nf6", "Qxf7#"]
    return {**v, **mehr}


def test_richtige_vorfuehrung_ohne_befund() -> None:
    assert pruefe_vorfuehrung(_vorfuehrung(), TEXTE) == []


def test_falsche_fen_gemeldet() -> None:
    befunde = pruefe_vorfuehrung(_vorfuehrung(ab=3), TEXTE)
    assert any("fen passt nicht" in b for b in befunde)


def test_illegaler_zug_gemeldet() -> None:
    befunde = pruefe_vorfuehrung(_vorfuehrung(zuege=["Bc4", "Qh4", "Ke3"]), TEXTE)
    assert any("Zug 3 „Ke3“ ist in der Stellung nicht legal" in b for b in befunde)


def test_fehlende_texte_gemeldet() -> None:
    befunde = pruefe_vorfuehrung(_vorfuehrung(), {})
    assert len(befunde) == 2 and all("fehlt in texte/de.json" in b for b in befunde)


def test_verweis_auf_fehlende_vorfuehrung() -> None:
    szene = {"karte": "ortA.aussen", "belebung": [{"name": "opa", "eigenschaften": {"zeigt": "gibtsNicht"}}]}
    assert pruefe_verweise([szene], {"operPartie"}) == [
        "ortA.aussen: opa zeigt „gibtsNicht“, die Vorführung fehlt"
    ]


def test_echte_daten_in_ordnung() -> None:
    assert pruefe_alles() == []
