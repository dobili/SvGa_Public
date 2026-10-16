"""Tests für die Lernziele je Kapitel (Abhakliste der Gesamt-Checkliste), Ausschnitte im Buchstil."""

from pipeline.lesen.lernziele import baue_lernziele, lies_lernziele
from pipeline.lesen.quellen import Quelldatei

AUFZAEHLUNG = r"""
Damit hast du die Denkroutine beisammen. Bevor du mit Kapitel~2 weiterliest, solltest du Folgendes
sicher können:

\begin{itemize}
\item die drei Eröffnungsziele an einer Stellung prüfen;
\item die typischen Fehler erkennen, etwa \zugfolge{4... Sf6??} in der Russischen Verteidigung;
\item vor einem Angriff die Übermacht zählen.
\end{itemize}

Die Übungen auf den folgenden Seiten helfen dir dabei.
"""

FLIESSTEXT = r"""
Gratulation! Bevor du mit Kapitel~1 weiterliest, solltest du Folgendes sicher können: das Brett
orientieren, Schach abwehren, en passant erkennen sowie die Remisarten kennen. Die Übungen helfen.
"""


def test_aufzaehlung_wird_zu_punkten_ohne_semikolon():
    daten, befunde = lies_lernziele(Quelldatei("kap01_grundprinzipien.tex", AUFZAEHLUNG), 1)
    assert befunde == []
    assert daten == {
        "kapitel": 1,
        "einleitung": "Bevor du mit Kapitel 2 weiterliest, solltest du Folgendes sicher können:",
        "punkte": [
            "die drei Eröffnungsziele an einer Stellung prüfen",
            "die typischen Fehler erkennen, etwa 4... Sf6?? in der Russischen Verteidigung",
            "vor einem Angriff die Übermacht zählen",
        ],
    }


def test_fliesstext_wird_an_komma_und_sowie_geteilt():
    daten, _ = lies_lernziele(Quelldatei("kap00_notation.tex", FLIESSTEXT), 0)
    assert daten is not None
    assert daten["punkte"] == [
        "das Brett orientieren",
        "Schach abwehren",
        "en passant erkennen",
        "die Remisarten kennen",
    ]


def test_kapitel_ohne_liste_gibt_hinweis_und_anhaenge_zaehlen_nicht():
    quellen = [
        Quelldatei("kap01_grundprinzipien.tex", AUFZAEHLUNG),
        Quelldatei("kap02_klassische_eroeffnungen.tex", "Kein solcher Satz."),
        Quelldatei("anhang_glossar.tex", FLIESSTEXT),
    ]
    lernziele, befunde = baue_lernziele(quellen)
    assert [eintrag["kapitel"] for eintrag in lernziele] == [1]
    assert [befund.kennung for befund in befunde] == ["lernziele"]
