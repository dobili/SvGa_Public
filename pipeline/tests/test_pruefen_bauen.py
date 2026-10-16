"""Tests für Prüfen und Bauen (Schritte 2, 8 und 9 der Pipeline)."""

from pathlib import Path

from pipeline.bauen.__main__ import main, pruefe_schema
from pipeline.bauen.kapitel import baue_kapitel, pruefsumme
from pipeline.lesen.diagramme import lies_kapitel
from pipeline.pruefen.abbildungen import pruefe_fen, pruefe_matt, pruefe_nummern, zugseite_laut_text

BEISPIEL = Path(__file__).parent / "beispiel" / "kap09_testkapitel.tex"


def test_fen_abb_1_26_ist_regelgerecht():
    assert pruefe_fen("r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 4 6", "x") == []


def test_lehrbild_ohne_koenig_ist_erlaubt():
    # Wie pruefe_buch.py: Fehlt ein König, ist es ein Lehrbild (Kapitel 0, Kapitel 5).
    befunde = pruefe_fen("8/8/8/8/8/8/8/K7 w - - 0 1", "x")
    assert [(b.schwere.value, b.kennung) for b in befunde] == [("hinweis", "ohne-koenig")]
    assert [b.kennung for b in pruefe_fen("8/8/8/8/8/8/8/8 w - - 0 1", "x")] == ["ohne-koenig"]


def test_lehrbild_mit_bauer_auf_grundreihe_bleibt_fehler():
    befunde = pruefe_fen("P7/8/8/8/8/8/8/K7 w - - 0 1", "x")
    assert [(b.schwere.value, b.kennung) for b in befunde] == [("fehler", "fen")]


def test_matt_ohne_nennung_ist_hinweis():
    matt = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3"
    assert [b.kennung for b in pruefe_matt(matt, "Nach 2... Dh4", "x")] == ["matt-ungenannt"]
    assert pruefe_matt(matt, "Nach 2... Dh4#", "x") == []
    assert pruefe_matt(matt, "Weiß ist matt.", "x") == []


def test_zugseite_aus_unterschrift():
    assert zugseite_laut_text("Nach 2. Lf4 – Ziel 1") == "b"
    assert zugseite_laut_text("Nach 5... Db6, Weiß am Zug.") == "w"
    assert zugseite_laut_text("Nach 2... Kg8 3. Dh5 – die dritte Figur") == "b"
    assert zugseite_laut_text("Nach 4. Sc3! Lc5 5. Sd5! – der Springer") == "b"
    assert zugseite_laut_text("Nach 6. O-O – Ziel 3") == "b"
    assert zugseite_laut_text("Der Fehlversuch.") is None
    # Satzende-Punkt hinter dem letzten Zug (Abb. 3.8 und 11.9 im Datenlauf vom 13.10.2026)
    assert zugseite_laut_text("Nach 4. h4 g4 5. Se5. Rote Pfeile") == "b"
    assert zugseite_laut_text("Nach 16... Sxb8 17. Td8#. Rot: das Schach.") == "b"
    # Die erste ausdrückliche Nennung zählt (wie pruefe_buch.py)
    assert zugseite_laut_text("Schwarz am Zug, aber Weiß am Zug wäre besser") == "b"


def test_nummern_doppelt_und_luecke():
    befunde = pruefe_nummern(9, [("9.1", "a"), ("9.3", "b"), ("9.3", "c")])
    assert sorted(b.kennung for b in befunde) == ["nummer-doppelt", "nummer-luecke"]


def test_testkapitel_baut_ohne_fehler_und_passt_zum_schema():
    ergebnis = baue_kapitel(lies_kapitel(BEISPIEL), auflage=1)
    assert pruefe_schema(ergebnis.daten, "kapitel.schema.json") == []
    kennungen = [b.kennung for b in ergebnis.befunde]
    # 9.4: „Schwarz am Zug“ in der Unterschrift, die FEN sagt Weiß → Warnung
    assert kennungen == ["zugseite"]
    abbildungen = {a["id"]: a for a in ergebnis.daten["abbildungen"]}
    assert abbildungen["9.2"]["reihe"] == ["9.3"]
    assert abbildungen["9.3"]["unterschrift"][-2] == {"art": "zug", "text": "Sxe5"}


def test_pruefsumme_haengt_nicht_an_der_fundstelle():
    abbildung = {"fen": "x", "pfeile": [], "felder": [], "unterschrift": [], "quelle": {"zeile": 1}}
    verschoben = dict(abbildung, quelle={"zeile": 99})
    assert pruefsumme(abbildung) == pruefsumme(verschoben)


def test_datenlauf_schreibt_dateien(tmp_path):
    buch = tmp_path / "buch"
    (buch / "chapters").mkdir(parents=True)
    (buch / "chapters" / BEISPIEL.name).write_text(BEISPIEL.read_text(encoding="utf-8"), encoding="utf-8")
    ziel = tmp_path / "daten"
    code = main(
        [
            "--buch",
            str(buch),
            "--ziel",
            str(ziel),
            "--kapitel",
            "9",
            "--datum",
            "2026-10-13",
            "--bericht",
            str(tmp_path / "berichte"),
            "--zugfolgen",
            str(tmp_path / "zugfolgen"),  # nie in inhalte/ des Repositorys schreiben
            "--freigabe",
            str(tmp_path / "freigabe"),  # ebenso nie in buch/arbeit/freigabe/
            "--texte",
            str(tmp_path / "texte"),  # die echten Erklärungen passen nicht zum Testbuch
        ]
    )
    assert code == 0
    assert (ziel / "kap09.json").exists()
    assert (ziel / "index.json").exists()
    bericht = (tmp_path / "berichte" / "datenlauf-2026-10-13.md").read_text(encoding="utf-8")
    assert "zugseite" in bericht and "## Zugfolgen" in bericht
    assert (tmp_path / "zugfolgen" / "kap09" / "k09-a1.pgn").exists()
    pruefhilfe = (tmp_path / "freigabe" / "kap09.md").read_text(encoding="utf-8")
    assert pruefhilfe.startswith("# Freigabe Kapitel 9")
    assert "## k09-a1" in pruefhilfe and "Hauptlinie: " in pruefhilfe
    assert not (tmp_path / "freigabe" / "README.md").exists()  # Übersicht nur bei allen Kapiteln
