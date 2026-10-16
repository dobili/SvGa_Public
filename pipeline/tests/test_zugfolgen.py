"""Tests für das Lesen und Nachspielen der Zugfolgen (AP 3), mit eigenem Testkapitel."""

from pathlib import Path

import chess

from pipeline.lesen.diagramme import lies_kapitel
from pipeline.lesen.quellen import Quelldatei
from pipeline.lesen.verzeichnis import baue_verzeichnis
from pipeline.lesen.zugfolgen import lies_unterschriftszuege, lies_zuege, lies_zugfolgen
from pipeline.zugfolgen.baum import Beispiel, Knoten, neuer_knoten, stabile_kennung
from pipeline.zugfolgen.kapitel import spiele_kapitel
from pipeline.zugfolgen.pgn import (
    STATUS_FREIGEGEBEN,
    abweichung_von_der_datei,
    als_pgn,
    lies_freigegebene,
    raeume_entwuerfe_auf,
    schreibe_entwurf,
)

BEISPIELORDNER = Path(__file__).parent / "beispiel"
TESTKAPITEL = BEISPIELORDNER / "kap10_zugfolgen.tex"


def test_zuege_lesen_deutsch_nach_englisch():
    zuege = lies_zuege("3... g6! 4. Df3 Sf6 5. O-O Lxf7+ e8=D")
    assert [(z.nummer, z.farbe, z.san, z.zeichen) for z in zuege] == [
        (3, "b", "g6", "!"),
        (4, "w", "Qf3", ""),
        (4, "b", "Nf6", ""),
        (5, "w", "O-O", ""),
        (5, "b", "Bxf7+", ""),
        (6, "w", "e8=Q", ""),
    ]
    assert lies_zuege("Sa3") is None
    assert lies_zuege("...axb5") is None
    assert lies_zuege("1. Dd8+!! Kxd8 2. Lg5++")[2].san == "Bg5+"
    assert lies_zuege("8...\nSxd4! 9. Sxd4")[0].nummer == 8


def test_unterschriftszuege():
    zuege = lies_unterschriftszuege("Nach 4. Sc3! Lc5 5. Sd5! – der Springer greift an")
    assert [z.san for z in zuege] == ["Nc3", "Bc5", "Nd5"]
    assert [z.san for z in lies_unterschriftszuege("Nach 5... Db6, Weiß am Zug.")] == ["Qb6"]
    assert lies_unterschriftszuege("Weiß am Zug.") is None
    mitten = lies_unterschriftszuege("Das Königsgambit aus Kapitel 3 nach 1. e4 e5 2. f4, Weiß am Zug.")
    assert [z.san for z in mitten] == ["e4", "e5", "f4"]
    assert lies_unterschriftszuege("Nach b4 und b5, Schwarz am Zug.") is None  # ohne Zugnummer
    assert lies_unterschriftszuege("Stellung nach dem Tausch, 3. Zug.") is None


def _spiele():
    text = TESTKAPITEL.read_text(encoding="utf-8")
    quelle = Quelldatei(TESTKAPITEL.name, text)
    verzeichnis = baue_verzeichnis([quelle])
    return spiele_kapitel(quelle, lies_kapitel(TESTKAPITEL), verzeichnis)


def test_zugfolgen_mit_kontext():
    quelle = Quelldatei(TESTKAPITEL.name, TESTKAPITEL.read_text(encoding="utf-8"))
    gelesen = lies_zugfolgen(quelle)
    assert gelesen.erwaehnungen == 1  # „Sa3“; „9. Lc4?!“ hat eine Nummer und zählt erst beim Nachspielen
    kontexte = [(z.kontext, z.bezug) for z in gelesen.zugfolgen]
    assert ("loesung", "ueb:k10-matt") in kontexte
    erste = gelesen.zugfolgen[0]
    assert erste.abschnitt == "10.1" and erste.ziel is None
    mit_ziel = next(z for z in gelesen.zugfolgen if z.ziel)
    assert mit_ziel.ziel == "10.3"
    assert gelesen.zugfolgen[1].verweise == ["10.2", "10.1"]  # „2... Sc6“ nach „siehe Abb. 10.1–10.2“
    taktik = next(z for z in gelesen.zugfolgen if z.buchtext == "1. Dxf7\\#")
    assert taktik.verweise == ["10.4"]


def test_nachspielen_baut_beispiele_und_ordnet_abbildungen_zu():
    ergebnis = _spiele()
    statistik = ergebnis.statistik
    assert statistik.abbildungen == 8
    assert statistik.verknuepft == 8
    # „9. Lc4?!“ und „1. Dxf7“: Ein Einzelzug, der ohne „+“ Schach gäbe, wird nicht angehängt.
    assert statistik.einzelzuege == 2
    assert statistik.ohne_anschluss == 1  # „1. Th8+ Kxh8 2. Dh7#“
    beispiele = {b.id: b for b in ergebnis.beispiele}
    spanisch = beispiele["k10-a1"]
    assert spanisch.abbildungen() == ["10.1", "10.2", "10.3", "10.7", "10.8"]
    assert spanisch.anzahl_abzweigungen() == 1  # 2... d6
    assert spanisch.titel == "Eine Eröffnung"
    taktik = beispiele["k10-a4"]
    assert taktik.wurzel_abbildung == "10.4"
    assert sorted(k.san for k in taktik.wurzel.kinder) == ["Bxf7+", "Qxe5+", "Qxf7#"]
    assert next(k for k in taktik.wurzel.kinder if k.san == "Qxe5+").zeichen == "??"
    uebung = beispiele["k10-a5"]
    assert uebung.wurzel_abbildung == "10.5"
    assert [k.san for k in uebung.wurzel.kinder] == ["Rd8#", "Rd7"]
    # Relative Zählung: „1. Te8+! … 1... Txe8 … 2. Txe8#“ in einer Stellung beim 20. Zug; die
    # Nebenvariante „1. Td7?“ der vorigen Übung zieht die Lösung nicht in den falschen Baum.
    relativ = beispiele["k10-a6"]
    assert relativ.wurzel_abbildung == "10.6"
    assert relativ.wurzel.brett.fullmove_number == 20
    knoten = relativ.wurzel
    for erwartet in ["Re8+", "Rxe8", "Rxe8#"]:
        (knoten,) = knoten.kinder
        assert knoten.san == erwartet
    kennungen = sorted(b.kennung for b in ergebnis.befunde)
    # „1. Lxf7 Ke7“ ohne „+“; „Nach 4. Dxd4“ unter Abb. 10.8 passt nicht zu 4. Sxd4. „Nach 4. Sxd4“
    # unter Abb. 10.7 nennt nur den letzten Zug, den der Text danach erreicht: kein Befund.
    assert kennungen == ["schachzeichen", "unterschrift-stellung", "zugfolge-ohne-anschluss"]


def test_pgn_schreiben_lesen_und_freigegebene_schuetzen(tmp_path):
    ergebnis = _spiele()
    spanisch = next(b for b in ergebnis.beispiele if b.id == "k10-a1")
    pgn = str(als_pgn(spanisch))
    assert '[Status "entwurf"]' in pgn and '[Abbildungen "10.1 10.2 10.3 10.7 10.8"]' in pgn
    assert "2. Nf3 { Abb. 10.1 } 2... Nc6 ( 2... d6 3. d4 exd4 4. Nxd4 { Abb. 10.7, Abb. 10.8 } )" in pgn
    pfad, geschrieben = schreibe_entwurf(spanisch, tmp_path)
    assert geschrieben and pfad == tmp_path / "kap10" / "k10-a1.pgn"
    # Freigabe durch den Autor: Status umstellen; danach wird die Datei nie überschrieben.
    pfad.write_text(
        pfad.read_text(encoding="utf-8").replace('[Status "entwurf"]', f'[Status "{STATUS_FREIGEGEBEN}"]'),
        encoding="utf-8",
    )
    _, geschrieben = schreibe_entwurf(spanisch, tmp_path)
    assert not geschrieben
    fen = {d.nummer: d.fen for d in lies_kapitel(TESTKAPITEL).diagramme if d.nummer}
    (freigegeben,) = lies_freigegebene(tmp_path, 10, fen)
    assert freigegeben.befunde == []
    assert freigegeben.daten["id"] == "k10-a1" and freigegeben.daten["status"] == "freigegeben"
    assert freigegeben.verknuepfungen["10.3"] == ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O"]
    hauptvariante = freigegeben.daten["zuege"][0]
    assert hauptvariante["zug"] == "e4"
    assert chess.Board(freigegeben.daten["startFen"]).fen() == chess.STARTING_FEN


def test_entwuerfe_nur_auf_wunsch_und_hinter_freigegebenen(tmp_path):
    ergebnis = _spiele()
    for beispiel in ergebnis.beispiele:
        schreibe_entwurf(beispiel, tmp_path)
    fen = {d.nummer: d.fen for d in lies_kapitel(TESTKAPITEL).diagramme if d.nummer}
    assert lies_freigegebene(tmp_path, 10, fen) == []
    pfad = tmp_path / "kap10" / "k10-a6.pgn"
    pfad.write_text(
        pfad.read_text(encoding="utf-8").replace('[Status "entwurf"]', '[Status "freigegeben"]'),
        encoding="utf-8",
    )
    mit = lies_freigegebene(tmp_path, 10, fen, mit_entwuerfen=True)
    assert [b.daten["status"] for b in mit][0] == "freigegeben"
    assert {b.daten["status"] for b in mit[1:]} == {"entwurf"}
    assert len(mit) == len([b for b in ergebnis.beispiele if b.anzahl_zuege() > 0])


def test_pgn_meldet_falsche_abbildung(tmp_path):
    ergebnis = _spiele()
    spanisch = next(b for b in ergebnis.beispiele if b.id == "k10-a1")
    pfad, _ = schreibe_entwurf(spanisch, tmp_path)
    text = pfad.read_text(encoding="utf-8").replace('[Status "entwurf"]', '[Status "freigegeben"]')
    pfad.write_text(text.replace("{ Abb. 10.2 }", "{ Abb. 10.3 }"), encoding="utf-8")
    fen = {d.nummer: d.fen for d in lies_kapitel(TESTKAPITEL).diagramme if d.nummer}
    (freigegeben,) = lies_freigegebene(tmp_path, 10, fen)
    assert [b.kennung for b in freigegeben.befunde] == ["pgn-stellung"]


def test_veraltete_entwuerfe_werden_geloescht_freigegebene_bleiben(tmp_path):
    ergebnis = _spiele()
    spanisch = next(b for b in ergebnis.beispiele if b.id == "k10-a1")
    pfad, _ = schreibe_entwurf(spanisch, tmp_path)
    veraltet = pfad.with_name("k10-09.pgn")
    veraltet.write_text(pfad.read_text(encoding="utf-8"), encoding="utf-8")
    freigegeben = pfad.with_name("k10-08.pgn")
    freigegeben.write_text('[Status "freigegeben"]\n\n*\n', encoding="utf-8")
    verworfen = pfad.with_name("k10-07.pgn")
    verworfen.write_text('[Status "verworfen"]\n\n*\n', encoding="utf-8")
    assert raeume_entwuerfe_auf(tmp_path, 10, {pfad}) == [veraltet]
    assert pfad.exists() and freigegeben.exists() and verworfen.exists() and not veraltet.exists()
    # Ein verworfenes Beispiel überschreibt die Pipeline so wenig wie ein freigegebenes.
    pfad.write_text('[Status "verworfen"]\n\n*\n', encoding="utf-8")
    assert schreibe_entwurf(spanisch, tmp_path) == (pfad, False)


def test_stabile_kennungen():
    beispiele = {b.id: b for b in _spiele().beispiele}
    # Nach der Abbildung, an der das Beispiel beginnt, sonst nach der kleinsten.
    assert sorted(beispiele) == ["k10-a1", "k10-a4", "k10-a5", "k10-a6"]
    wurzel = Knoten(chess.Board(), None, "", "", "", "")
    knoten = wurzel
    for san in ["d4", "Nf6", "c4", "e6"]:
        knoten = neuer_knoten(knoten, knoten.brett.parse_san(san), san, "", "test:1")
    ohne_abbildung = Beispiel("alt", 3, "3.1", "Test", wurzel)
    vergeben: set[str] = set()
    assert stabile_kennung(ohne_abbildung, vergeben) == "k03-z-d4-sf6-c4"
    assert stabile_kennung(ohne_abbildung, vergeben) == "k03-z-d4-sf6-c4-2"
    knoten.abbildungen += ["3.100", "3.9"]
    assert stabile_kennung(ohne_abbildung, set()) == "k03-a9"  # 3.9 vor 3.100, als Zahl verglichen


def test_abweichende_freigegebene_datei_wird_gemeldet(tmp_path):
    spanisch = next(b for b in _spiele().beispiele if b.id == "k10-a1")
    pfad, _ = schreibe_entwurf(spanisch, tmp_path)
    pfad.write_text(pfad.read_text(encoding="utf-8").replace("entwurf", "freigegeben"), encoding="utf-8")
    assert abweichung_von_der_datei(pfad, spanisch) is None
    spanisch.wurzel.kinder[0].abbildungen.append("10.9")
    meldung = abweichung_von_der_datei(pfad, spanisch)
    assert meldung is not None and "k10-a1" in meldung and "„freigegeben“" in meldung


def test_fortsetzung_aus_frueherem_kapitel_wird_kopiert(tmp_path):
    """Kapitel 11 setzt die Spanische Partie aus Kapitel 10 fort: Der Weg kommt als Kopie mit."""
    brett = chess.Board()
    for san in ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "b5", "Bb3"]:
        brett.push_san(san)
    text = (
        "\\chapter[Fortsetzung]{}\n\\kapitelauftakt{11}{Fortsetzung im Test}\n\n\\section{Weiter}\n\n"
        "Nach \\zugfolge{5... b5 6. Lb3} (\\abb{11.1}) zieht sich der Läufer zurück.\n\n"
        f"\\diagramm[\\abbziel{{11.1}}: Schwarz am Zug.]{{{brett.fen()}}}\n"
    )
    pfad = tmp_path / "kap11_fortsetzung.tex"
    pfad.write_text(text, encoding="utf-8")
    quelle = Quelldatei(pfad.name, text)
    ergebnis = spiele_kapitel(quelle, lies_kapitel(pfad), baue_verzeichnis([quelle]), _spiele().beispiele)
    (beispiel,) = ergebnis.beispiele
    assert beispiel.id == "k11-a1" and beispiel.kapitel == 11
    assert beispiel.wurzel.brett.fen() == chess.STARTING_FEN
    assert beispiel.abbildungen() == ["11.1"]
    knoten = next(k for k in beispiel.knoten() if k.abbildungen)
    assert knoten.pfad() == ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "b5", "Bb3"]


def test_stellung_aus_frueherem_kapitel_ohne_zuege_wird_kopiert(tmp_path):
    """Eine Abbildung zeigt eine Stellung aus Kapitel 10, die Unterschrift nennt keine Züge."""
    fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"  # Abb. 10.1
    text = (
        "\\chapter[Wiederholung]{}\n\\kapitelauftakt{11}{Wiederholung im Test}\n\n\\section{Zurück}\n\n"
        f"\\diagramm[\\abbziel{{11.1}}: Die Stellung aus Kapitel 10, Schwarz am Zug.]{{{fen}}}\n"
    )
    pfad = tmp_path / "kap11_wiederholung.tex"
    pfad.write_text(text, encoding="utf-8")
    quelle = Quelldatei(pfad.name, text)
    ergebnis = spiele_kapitel(quelle, lies_kapitel(pfad), baue_verzeichnis([quelle]), _spiele().beispiele)
    (beispiel,) = ergebnis.beispiele
    knoten = next(k for k in beispiel.knoten() if k.abbildungen == ["11.1"])
    assert knoten.pfad() == ["e4", "e5", "Nf3"]
    assert ergebnis.statistik.ohne_zugfolge == 0


def _kapitel(tmp_path, name: str, text: str, fruehere):
    pfad = tmp_path / name
    pfad.write_text(text, encoding="utf-8")
    quelle = Quelldatei(pfad.name, text)
    return spiele_kapitel(quelle, lies_kapitel(pfad), baue_verzeichnis([quelle]), fruehere)


def _fen_nach(zuege: list[str]) -> str:
    brett = chess.Board()
    for san in zuege:
        brett.push_san(san)
    return brett.fen()


def test_ziel_erst_nach_dem_satz_waehlt_die_passende_fruehere_linie(tmp_path):
    """Kapitel 6: „Zwischenstand nach 8. d5 Se7“, Abb. 6.20 folgt erst danach (Buch 16.10.2026).

    Die Züge sind in zwei Linien früherer Kapitel legal; gemeint ist die, die in der Abbildung endet.
    """
    linie_a, linie_b = ["e4", "e5", "Nf3", "Nc6"], ["d4", "d5", "Nf3", "Nc6"]
    frueher = _kapitel(
        tmp_path,
        "kap02_frueher.tex",
        "\\chapter[Früher]{}\n\\kapitelauftakt{2}{Früher im Test}\n\n\\section{A}\n\n"
        "Nach \\zugfolge{1. e4 e5 2. Sf3 Sc6} (\\abb{2.1}) ist alles ruhig.\n\n"
        f"\\diagramm[\\abbziel{{2.1}}: Weiß am Zug.]{{{_fen_nach(linie_a)}}}\n\n\\section{{B}}\n\n"
        "Nach \\zugfolge{1. d4 d5 2. Sf3 Sc6} (\\abb{2.2}) ebenso.\n\n"
        f"\\diagramm[\\abbziel{{2.2}}: Weiß am Zug.]{{{_fen_nach(linie_b)}}}\n",
        [],
    ).beispiele
    for ziel, linie in (("A", linie_a), ("B", linie_b)):
        ergebnis = _kapitel(
            tmp_path,
            f"kap06_ziel{ziel}.tex",
            "\\chapter[Später]{}\n\\kapitelauftakt{6}{Später im Test}\n\n\\section{Weiter}\n\n"
            "Wir beginnen beim Zwischenstand nach \\zugfolge{3. Sc3 Sf6}, gleich als Diagramm.\n\n"
            f"\\diagramm[\\abbziel{{6.1}}: Weiß am Zug.]{{{_fen_nach([*linie, 'Nc3', 'Nf6'])}}}\n",
            frueher,
        )
        knoten = next(k for b in ergebnis.beispiele for k in b.knoten() if k.abbildungen == ["6.1"])
        assert knoten.pfad() == [*linie, "Nc3", "Nf6"], ziel
