"""Tests für Denkroutine und Gesamt-Checkliste (AP 5) mit kleinen LaTeX-Ausschnitten im Stil des Buches."""

from pipeline.lesen.nachschlagen import baue_nachschlagen, lies_checkliste, lies_denkroutine
from pipeline.lesen.quellen import Quelldatei

KOPIERVORLAGE = r"""
\node[anchor=north west, inner sep=0pt, font=\sffamily\bfseries\Large,
  text=chessnavy] at (14,-12) {Vor jedem Zug: die Denkroutine};
\kvschritt{k1}{(22,-26)}{1}{\textbf{\color{chessnavy}Stellung erfassen.}
  Was droht er? Dann das Werkzeug von Karte~2.}
\node[dr/sicher, anchor=north west, text width=112mm] (ks) at ($(k4.south west)+(0,-4)$)
  {\parbox{112mm}{\raggedright\leftskip=6mm\linespread{1.05}\selectfont
   \textbf{\color{fallenrot}Sicherheitsblick.} Steht mein König danach sicher?}};
\node[dr/ziehen, anchor=west] (kz) at ($(ks.east)+(8,0)$) {\faCheck\ Ziehen};
\node[rotate=90, font=\sffamily\scriptsize\bfseries, text=fallenrot, anchor=north]
  at ($(a)!0.5!(b)$) {widerlegt oder unsicher?};
\node[anchor=north west, inner sep=0pt, font=\sffamily\bfseries\Large,
  text=chessnavy] at (14,-160.5) {Welche Phase? Welches Werkzeug?};
\kvphase{q1}{14}{\faChessPawn\ Eröffnung}{%
  {\color{chessgrey}\itshape Du bist hier, solange die Ziele offen sind.}
  \kvzwischen{Ruhiger Zug mit}
  \drpunkt deinem Repertoire (Kap.~2)
  \kvzwischen{Achte besonders auf}
  \drpunkt die vier Todsünden (Kap.~1)
  \drpunkt Gambits: die Faktorenbilanz (Kap.~3)}
\node[anchor=north, font=\sffamily\small, text=chessnavy, align=center]
  at (105,-272) {In jeder Phase zuerst: Warnsignale.};
"""

CHECKLISTE = r"""
\begin{tabular}{@{}llll@{}}
\toprule
\textbf{Kap.} & \textbf{Kernfrage} & \textbf{Werkzeug} & \textbf{Fehlerart} \\
\midrule
1 & Was passiert jetzt? & Schach-Röntgen-Regel & Schach oder Schlag
übersehen \\
4 & Warum lässt mein Gegner das zu? & Prüffragen \regelkz{F1}--\regelkz{F3} & Falle oder Köder \\
\bottomrule
\end{tabular}
\caption{Gesamt-Checkliste für Training und Partieanalyse.}
\label{tab:checkliste}
"""


def test_denkroutine_mit_schritten_sicherheitsblick_und_phasen():
    daten, befunde = lies_denkroutine(Quelldatei("anhang_kopiervorlage.tex", KOPIERVORLAGE))
    assert befunde == []
    assert daten["titel"] == "Vor jedem Zug: die Denkroutine"
    assert daten["schritte"] == [
        {"nummer": 1, "titel": "Stellung erfassen.", "text": "Was droht er? Dann das Werkzeug von Karte 2."}
    ]
    assert daten["sicherheitsblick"]["text"] == "Steht mein König danach sicher?"
    assert (daten["abschluss"], daten["zurueck"]) == ("Ziehen", "widerlegt oder unsicher?")
    (phase,) = daten["phasen"]
    assert phase["name"] == "Eröffnung" and phase["wann"].startswith("Du bist hier")
    assert phase["abschnitte"][1] == {
        "titel": "Achte besonders auf",
        "punkte": ["die vier Todsünden (Kap. 1)", "Gambits: die Faktorenbilanz (Kap. 3)"],
    }
    assert daten["zuerst"] == "In jeder Phase zuerst: Warnsignale."


def test_checkliste_mit_regelkennzeichen_und_zeilenumbruch():
    daten, befunde = lies_checkliste(Quelldatei("kap12_training.tex", CHECKLISTE))
    assert befunde == []
    assert daten["titel"] == "Gesamt-Checkliste für Training und Partieanalyse"
    assert daten["spalten"] == ["Kap.", "Kernfrage", "Werkzeug", "Fehlerart"]
    assert daten["zeilen"][0]["fehlerart"] == "Schach oder Schlag übersehen"
    assert daten["zeilen"][1]["werkzeug"] == "Prüffragen F1–F3"


def test_fehlende_quellen_ergeben_leere_teile_und_kaputte_einen_befund():
    daten, befunde = baue_nachschlagen([])
    assert daten == {"schemaVersion": 1, "denkroutine": None, "checkliste": None, "lernziele": []}
    assert befunde == []
    _, befunde = lies_checkliste(Quelldatei("kap12_training.tex", "ohne Tabelle"))
    assert [b.kennung for b in befunde] == ["checkliste"]
