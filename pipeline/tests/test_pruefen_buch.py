"""Tests der buchweiten Prüfungen (übernommen aus pruefe_buch.py), mit kleinen Beispielquellen."""

from pipeline.pruefen.buch import (
    Quelldatei,
    pruefe_abbildungsnummern,
    pruefe_glossaranker,
    pruefe_kapitel12_hinweise,
    pruefe_stil,
    pruefe_verweise,
)


def kennungen(befunde):
    return [(b.schwere.value, b.kennung) for b in befunde]


def test_nummern_lueckenlos_und_ohne_doppelte():
    gut = Quelldatei("kap03_x.tex", "\\abbziel{3.1} \\abbziel{3.2} \\abb{3.1}")
    assert pruefe_abbildungsnummern([gut]) == []
    luecke = Quelldatei("kap03_x.tex", "\\abbziel{3.1}\n\\abbziel{3.3}")
    befunde = pruefe_abbildungsnummern([luecke])
    assert kennungen(befunde) == [("fehler", "abb-reihenfolge")]
    assert befunde[0].fundstelle == "kap03_x.tex:2"


def test_doppelte_nummer_und_verweis_ohne_ziel():
    quellen = [
        Quelldatei("kap01_a.tex", "\\abbziel{1.1}"),
        Quelldatei("kap02_b.tex", "\\abbziel{1.1} \\abbnr{9.9}"),
    ]
    assert ("fehler", "abb-doppelt") in kennungen(pruefe_abbildungsnummern(quellen))
    assert ("warnung", "abb-verweis") in kennungen(pruefe_abbildungsnummern(quellen))


def test_glossaranker():
    quellen = [
        Quelldatei("kap01_a.tex", "\\glanker{a-1} \\glanker{a-1} \\glanker{b-1}"),
        Quelldatei("anhang_glossar.tex", "\\glseite{a-1} \\glseite{c-1}"),
    ]
    assert kennungen(pruefe_glossaranker(quellen)) == [
        ("fehler", "glanker-doppelt"),
        ("fehler", "glseite-ohne-anker"),
        ("hinweis", "glanker-unbenutzt"),
    ]


def test_verweise_und_literatur():
    quellen = [
        Quelldatei("kap01_a.tex", "\\label{sec:x} \\ref{sec:x} \\pageref{fehlt} \\cite{winter,unbekannt}"),
        Quelldatei("anhang_quellen.tex", "\\bibitem{winter}"),
    ]
    assert kennungen(pruefe_verweise(quellen)) == [
        ("hinweis", "ref-ohne-label"),
        ("warnung", "cite-ohne-bibitem"),
    ]


def test_kapitel12_nur_im_trainingskasten():
    text = "Kapitel~12 \\begin{trainingskasten} Kapitel~12 \\end{trainingskasten}"
    assert kennungen(pruefe_kapitel12_hinweise([Quelldatei("kap05_a.tex", text)])) == [
        ("hinweis", "r10-4-kapitel12")
    ]
    assert pruefe_kapitel12_hinweise([Quelldatei("kap12_a.tex", text)]) == []


def test_stil_stein_und_gerade_anfuehrung():
    befunde = pruefe_stil([Quelldatei("kap01_a.tex", 'ein Stein und "so" aber \\"a')])
    assert kennungen(befunde) == [
        ("hinweis", "r7-8-stein"),
        ("hinweis", "r7-6-anfuehrung"),
        ("hinweis", "r7-6-anfuehrung"),
    ]
