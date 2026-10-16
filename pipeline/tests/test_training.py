"""Tests für die Trainingskästen der Website (pipeline/training.py, pipeline/training_bloecke.py).

Die Beispiele sind den Kästen des Buches nachgebildet, ohne die Buchquellen zu brauchen (die
liegen nur lokal, CLAUDE.md Regel 2). Dazu prüft ein Test die eingecheckten Dateien in
inhalte/de/training/ gegen das Schema.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from pipeline.lesen.quellen import Quelldatei
from pipeline.lesen.verzeichnis import Verweisverzeichnis
from pipeline.training import (
    ZIELORDNER,
    Trainingsfehler,
    adresse_als_link,
    pruefe,
    pruefe_alte_kaesten,
    wandle,
)
from pipeline.training_bloecke import bloecke_aus

VERZEICHNIS = Verweisverzeichnis(labels={"tab:gambitlandkarte": "3.3", "sec:analyse": "12.2"})
ADRESSEN = {"dsb-regeln": "https://www.schachbund.de"}


def _wandle(latex: str) -> list[dict[str, str]]:
    return wandle(latex, "test.tex:1", VERZEICHNIS, ADRESSEN)


def test_adressen_werden_links() -> None:
    assert adresse_als_link("lichess.org") == "https://lichess.org"
    assert adresse_als_link("/training/coordinate") == "https://lichess.org/training/coordinate"
    assert adresse_als_link("Masters") is None


def test_quelle_wird_link_in_klammern() -> None:
    teile = _wandle(r"stellt die FIDE-Regeln bereit~\cite{dsb-regeln}. Lies dort")
    assert [t["text"] for t in teile] == ["stellt die FIDE-Regeln bereit (", "schachbund.de", "). Lies dort"]
    assert teile[1] == {"art": "link", "text": "schachbund.de", "ziel": "https://www.schachbund.de"}


def test_werkzeugkasten_und_buchtabelle() -> None:
    teile = _wandle(
        r"Den Weg zeigt Tabelle~\ref{tab:werkzeugkasten}, die Landkarte (Tabelle~\ref{tab:gambitlandkarte})"
    )
    assert teile[1] == {
        "art": "link",
        "text": "die Tabelle „Werkzeugkasten“",
        "ziel": "/training/werkzeugkasten/",
    }
    assert teile[2]["text"] == ", die Landkarte (Tabelle 3.3)"


def test_leerzeichen_zwischen_fett_und_link_bleibt() -> None:
    teile = _wandle(r"\textbf{Ein Werkzeug für fast alles: Lichess.} \texttt{lichess.org} ist werbefrei")
    assert (
        "".join(t["text"] for t in teile) == "Ein Werkzeug für fast alles: Lichess. lichess.org ist werbefrei"
    )
    assert teile[0]["stil"] == "fett"


def test_abbildungen_und_zuege() -> None:
    teile = _wandle(r"Baue \abb{0.12}, \abbnr{0.16} nach und spiele \zugfolge{5... d5}.")
    assert {"art": "verweis", "text": "Abb.\u00a00.12", "abbildung": "0.12"} in teile
    assert {"art": "verweis", "text": "0.16", "abbildung": "0.16"} in teile
    assert {"art": "zug", "text": "5... d5"} in teile


def test_seitenverweis_wird_im_buch() -> None:
    text = "".join(t["text"] for t in _wandle(r"als Merkseite auf Seite~\pageref{merkseite}"))
    assert text == "als Merkseite im Buch"


def test_unbekannter_befehl_bricht_ab() -> None:
    with pytest.raises(Trainingsfehler):
        _wandle(r"Text mit \unbekannt{x}")


def test_bloecke_absatz_liste_klein_tabelle() -> None:
    latex = r"""
\textbf{Erster.} Text eins.

\medskip
\textbf{Zweiter.} Text zwei.
\begin{table}[!tb]
\centering
\begin{tabular}{@{}p{3cm}p{3cm}@{}}
\toprule
\textbf{Wofür} & \textbf{Weg} \\
\midrule
Koordinaten & Lernen $\rightarrow$ Koordinaten \\
Stellung & Werkzeuge \\[0.3em]
\bottomrule
\end{tabular}
\caption{Lichess-Funktionen.}
\label{tab:x}
\end{table}
\begin{itemize}
\item \textbf{Stockfish} (\texttt{stockfishchess.org})
\item Listudy
\end{itemize}
{\footnotesize Den Weg zeigt Tabelle~\ref{tab:werkzeugkasten}.\par}
"""
    bloecke = bloecke_aus(latex, _wandle)
    assert [b["art"] for b in bloecke] == ["absatz", "absatz", "tabelle", "liste", "klein"]
    tabelle = bloecke[2]
    assert [z[0]["text"] for z in tabelle["kopf"]] == ["Wofür", "Weg"]
    assert len(tabelle["zeilen"]) == 2
    assert "".join(t["text"] for t in tabelle["zeilen"][0][1]) == "Lernen → Koordinaten"
    assert tabelle["unterschrift"] == [{"art": "text", "text": "Lichess-Funktionen.", "stil": "normal"}]
    assert len(bloecke[3]["punkte"]) == 2


def test_eingecheckte_dateien_passen_zum_schema() -> None:
    dateien = sorted(Path(ZIELORDNER).glob("*.json"))
    assert len(dateien) == 14  # Kapitel 0 bis 12 und der Werkzeugkasten
    for datei in dateien:
        daten = json.loads(datei.read_text(encoding="utf-8"))
        assert pruefe(daten) == [], datei.name


def test_buch_mit_verweis_statt_kasten_bricht_ab() -> None:
    """Nach der Umstellung des Buches überschreibt ein Lauf die gepflegten Dateien nicht."""
    alt = Quelldatei("kap07_taktik.tex", r"\begin{trainingskasten}Text\end{trainingskasten}")
    pruefe_alte_kaesten([alt])  # alte Fassung: kein Abbruch
    neu = Quelldatei("kap07_taktik.tex", r"\trainingsverweis{07}{ein Motiv am Stück}{Taktiktrainer}")
    with pytest.raises(Trainingsfehler, match="kap07_taktik.tex"):
        pruefe_alte_kaesten([alt, neu])
