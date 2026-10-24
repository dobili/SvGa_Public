"""Tests für die Trainingskästen der Website (pipeline/training.py, pipeline/training_bloecke.py).

Die Beispiele sind den Kästen des Buches nachgebildet, ohne die Buchquellen zu brauchen (die
liegen nur lokal, CLAUDE.md Regel 2). Dazu prüft ein Test die eingecheckten Dateien in
inhalte/de/training/ gegen das Schema.
"""

from __future__ import annotations

import json
import re
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


# --- Abbildungsverweise der eingecheckten Trainingsseiten (Wunsch des Autors, 24.10.2026) ---

APPDATEN = Path(ZIELORDNER).parents[2] / "app" / "public" / "daten" / "de" / "a1"
# Nummern „9.8“ im Fließtext; davor darf keine Ziffer stehen (sonst „15.10.2026“), danach kein Punkt.
_NUMMER = re.compile(r"(?<![\d.])(\d{1,2})\.(\d{1,3})(?![\d.])")
# Steht eines dieser Wörter kurz vor der Nummer, meint sie Abschnitt oder Tabelle, keine Abbildung.
_KEIN_BILD = ("Abschnitt", "Abschnitte", "Tabelle", "Tab.", "Kapitel")
_RUECKBLICK = 40


def _absaetze(daten: object):
    """Alle Teilelisten (Absätze, Listenpunkte) einer Trainingsseite, rekursiv."""
    if isinstance(daten, dict):
        if isinstance(daten.get("teile"), list):
            yield daten["teile"]
        for wert in daten.values():
            yield from _absaetze(wert)
    elif isinstance(daten, list):
        for eintrag in daten:
            yield from _absaetze(eintrag)


def _abbildungsnummern_im_text(teile: list[dict]) -> list[str]:
    """Nummern wie „9.8“ in Textteilen eines Absatzes, die kein Verweis sind.

    Der Absatz wird zusammengesetzt (Verweise als Marke), damit „Abschnitt “ im Teil davor und
    „12.2“ im Teil danach zusammen gelesen werden (kap12.json). Beispiel: „(Philidor), 9.8
    (Lucena)“ → ["9.8"]; „Abschnitt 12.2 und 12.5“ → [].
    """
    text = "".join(
        t.get("text", "") if t.get("art") == "text" else " «» " for t in teile
    )
    gefunden = []
    for treffer in _NUMMER.finditer(text):
        davor = text[max(0, treffer.start() - _RUECKBLICK) : treffer.start()]
        if not any(wort in davor for wort in _KEIN_BILD):
            gefunden.append(treffer.group(0))
    return gefunden


def _abbildungskennungen() -> set[str]:
    kennungen: set[str] = set()
    for datei in sorted(APPDATEN.glob("kap*.json")):
        daten = json.loads(datei.read_text(encoding="utf-8"))
        kennungen.update(a["id"] for a in daten.get("abbildungen", []))
    return kennungen


@pytest.mark.skipif(not APPDATEN.exists(), reason="App-Daten nicht gebaut")
def test_trainingsseiten_verweisen_auf_vorhandene_abbildungen() -> None:
    """Jeder Verweis zeigt auf eine Abbildung der App-Daten (sonst öffnet die App ins Leere)."""
    kennungen = _abbildungskennungen()
    assert kennungen, "keine Abbildungen in den App-Daten"
    fehlend = [
        (datei.name, teil["abbildung"])
        for datei in sorted(Path(ZIELORDNER).glob("*.json"))
        for teile in _absaetze(json.loads(datei.read_text(encoding="utf-8")))
        for teil in teile
        if teil.get("art") == "verweis" and teil["abbildung"] not in kennungen
    ]
    assert fehlend == []


def test_trainingsseiten_abbildungsnummern_sind_verweise() -> None:
    """Abbildungsnummern im Fließtext sind Verweise (Wunsch des Autors, 24.10.2026).

    Befund damals: kap09.json nannte 9.8, 9.15 und 9.28, kap10.json 10.9 und 10.14 nur als Text,
    ohne Link in die App.
    """
    nur_text = [
        (datei.name, nummer)
        for datei in sorted(Path(ZIELORDNER).glob("*.json"))
        for teile in _absaetze(json.loads(datei.read_text(encoding="utf-8")))
        for nummer in _abbildungsnummern_im_text(teile)
    ]
    assert nur_text == []


def test_abbildungsnummern_im_text_erkennt_nur_abbildungen() -> None:
    teile = [
        {"art": "text", "text": "Gib "},
        {"art": "verweis", "text": "Abb. 9.3", "abbildung": "9.3"},
        {"art": "text", "text": " (Philidor), 9.8 (Lucena) ein, siehe Abschnitt 12.2 und 12.5, "},
        {"art": "text", "text": "Tabelle 9.1 und Stand 15.10.2026."},
    ]
    assert _abbildungsnummern_im_text(teile) == ["9.8"]
