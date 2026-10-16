"""Tests für Verweisverzeichnis, Textwandler, Übungen, Bilanzen und Glossar.

Die Beispielquellen sind eigene Kurztexte im Aufbau des Buches, kein Buchtext (CLAUDE.md, Regel 2).
"""

from pipeline.bauen.__main__ import pruefe_schema
from pipeline.bauen.inhalte import baue_glossar, baue_kapitelinhalte
from pipeline.lesen.quellen import Quelldatei
from pipeline.lesen.text import wandle_text
from pipeline.lesen.verzeichnis import baue_verzeichnis

KAPITEL = Quelldatei(
    "kap03_test.tex",
    r"""\chapter[Test]{}
\section{Erster Abschnitt}
\label{sec:t-eins}
Text \glanker{gabel-3}
\diagramm[\abbziel{3.1}: Weiß am Zug.]{8/8/8/8/8/8/8/K6k w - - 0 1}
\begin{table}\caption{Tabelle}\label{tab:t-werte}\end{table}
\begin{eroeffnungssteckbrief}{Testeröffnung}
\steckbriefzeile{Wer wählt sie?}{Weiß, mit \zugfolge{1. e4}.}
\steckbriefzeile{Charakter}{Ruhig.}
\end{eroeffnungssteckbrief}
\begin{zielbilanz}{Test nach \zugfolge{1. e4}}
Erste Variante (\abb{3.1}):

\begin{zieltabelle}
\zielzeile{Zentrum}{\zielja{} Bauer e4.}{\zielteils{} Noch nichts.}
\end{zieltabelle}
\end{zielbilanz}
\begin{faktorenbilanz}{Gambit}
\begin{faktortabelle}{Weiß (Gambit)}{Schwarz}
\faktorzeile{Material}{--}{\faktorvornrechts{} +1 Bauer}
\end{faktortabelle}
\faktorhaltbarkeit{kurz.}
\faktorurteil{ausgeglichen.}
\end{faktorenbilanz}
\begin{skelettbilanz}[2]{Testskelett (\abb{3.1})}
\begin{skeletttabelle}
\skelettzeile{Felder}{d5 ist ein Loch.}{Kein Loch.}
\skelettzeile{Bauern}{Gesund.}{e5 besteht den Deckungstest nicht.}
\end{skeletttabelle}
\skelettfolgerung{Weiß besetzt d5.}
\end{skelettbilanz}
\begin{planbilanz}{Testplan nach \zugfolge{1. e4}}
\begin{plantabelle}
\planzeile{Wo spiele ich?}{Im Zentrum.}{Am Königsflügel.}
\end{plantabelle}
\planplan{Weiß: \glqq Ich nutze d5.\grqq{}}
\end{planbilanz}
\begin{uebungenkasten}
\begin{zugamzug}
\label{ueb:t-erste}
\diagrammbox[\abbziel{3.2}: Weiß am Zug.]{8/8/8/8/8/8/8/K6k w - - 0 1}
Was spielst du? Siehe Abschnitt~\ref{sec:t-eins} und Tabelle~\ref{tab:t-werte}.
\end{zugamzug}
\begin{zugamzug}[Ohne Brett]
\label{ueb:t-zweite}
Schreibe die Züge auf.
\end{zugamzug}
\end{uebungenkasten}
\begin{loesungen}
\loesungeintrag{ueb:t-erste}{Mit \zugfolge{1. Kb2} gewinnt Weiß.\\ Zweiter Satz~\cite{quelle-a}.}
\loesungeintrag{ueb:t-zweite}{Siehe Übung~\ref{ueb:t-erste}.}
\end{loesungen}
""",
)
GLOSSAR = Quelldatei(
    "anhang_glossar.tex",
    r"""\begin{description}
\item[Doppelangriff] Zwei Angriffe zugleich, etwa die $\rightarrow$~Gabel (Kapitel~3,
S.~\glseite{gabel-3}).
\item[Gabel (Springergabel)] Ein Doppelangriff.
\item[Fork] $\rightarrow$~Gänsefuß.
\end{description}""",
)
QUELLEN = Quelldatei("anhang_quellen.tex", r"\bibitem{quelle-a} A. \bibitem{quelle-b} B.")


def test_verzeichnis_loest_labels_wie_latex_auf():
    verzeichnis = baue_verzeichnis([KAPITEL, GLOSSAR, QUELLEN])
    assert verzeichnis.ziel("sec:t-eins") == "3.1"
    assert verzeichnis.ziel("tab:t-werte") == "3.1"
    assert verzeichnis.ziel("ueb:t-zweite") == "2"
    assert verzeichnis.literatur == {"quelle-a": 1, "quelle-b": 2}
    stelle = verzeichnis.anker["gabel-3"]
    assert (stelle.kapitel, stelle.abschnitt, stelle.abbildung) == (3, "3.1", "3.1")


def test_textwandler_mit_verweisen_zeichen_und_absaetzen():
    verzeichnis = baue_verzeichnis([KAPITEL, QUELLEN])
    teile = wandle_text(
        r"\zielja{} gut\\ Abschnitt~\ref{sec:t-eins} \cite{quelle-b}, S.~\glseite{gabel-3}", "x", verzeichnis
    )
    assert teile.befunde == []
    assert [t.als_daten() for t in teile.teile] == [
        {"art": "zeichen", "text": "✓", "zeichen": "ja"},
        {"art": "text", "text": " gut", "stil": "normal"},
        {"art": "absatz", "text": "¶"},
        {"art": "text", "text": "Abschnitt 3.1 [2], ", "stil": "normal"},
        {"art": "stelle", "text": "Abschnitt 3.1", "anker": "gabel-3"},
    ]


def test_unbekannter_verweis_wird_gemeldet():
    verzeichnis = baue_verzeichnis([KAPITEL])
    befunde = wandle_text(r"\ref{sec:fehlt}", "x", verzeichnis).befunde
    assert [b.kennung for b in befunde] == ["ref-unbekannt"]


def test_uebungen_steckbriefe_bilanzen():
    verzeichnis = baue_verzeichnis([KAPITEL, QUELLEN])
    inhalte, befunde = baue_kapitelinhalte(KAPITEL, verzeichnis)
    assert befunde == []
    erste, zweite = inhalte["uebungen"]
    assert (erste["id"], erste["nummer"], erste["abbildungen"]) == ("ueb:t-erste", 1, ["3.2"])
    assert "Abschnitt 3.1 und Tabelle 3.1" in "".join(t["text"] for t in erste["aufgabe"])
    assert {"art": "absatz", "text": "¶"} in erste["loesung"]
    assert (zweite["titel"], zweite["abbildungen"]) == ("Ohne Brett", [])
    assert inhalte["steckbriefe"][0]["zeilen"][0]["frage"] == "Wer wählt sie?"
    ziel, faktor, skelett, plan = inhalte["bilanzen"]
    assert [b["art"] for b in ziel["bloecke"]] == ["text", "tabelle"]
    zeile = ziel["bloecke"][1]["zeilen"][0]
    assert (zeile["name"], zeile["links"]["wertung"], zeile["rechts"]["wertung"]) == (
        "Zentrum",
        "ja",
        "teils",
    )
    assert faktor["bloecke"][0]["spalten"] == ["Weiß (Gambit)", "Schwarz"]
    assert faktor["bloecke"][0]["zeilen"][0]["links"]["wertung"] is None
    assert faktor["bloecke"][0]["zeilen"][0]["rechts"]["wertung"] == "vornrechts"
    assert faktor["urteil"] == [{"art": "text", "text": "ausgeglichen.", "stil": "normal"}]
    # Skelettbilanz: Stand in eckigen Klammern übersprungen, Abbildung aus dem Titel, Folgerung
    # als Urteil. Planbilanz: keine Abbildung im Titel, also die letzte vor der Bilanz.
    assert (skelett["art"], skelett["abbildung"]) == ("skelett", "3.1")
    assert [z["name"] for z in skelett["bloecke"][0]["zeilen"]] == ["Felder", "Bauern"]
    assert skelett["bloecke"][0]["zeilen"][1]["rechts"]["wertung"] is None
    assert skelett["urteil"] == [{"art": "text", "text": "Weiß besetzt d5.", "stil": "normal"}]
    assert (plan["art"], plan["abbildung"]) == ("plan", "3.1")
    assert plan["bloecke"][0]["zeilen"][0]["name"] == "Wo spiele ich?"
    assert "Ich nutze d5." in "".join(t["text"] for t in plan["urteil"])
    daten = {"schemaVersion": 1, "kapitel": 3, "titel": "Test", "abschnitte": [], "abbildungen": []}
    daten = daten | inhalte | {"beispiele": []}
    assert pruefe_schema(daten, "kapitel.schema.json") == []


def test_glossar_mit_querverweis_und_stelle():
    verzeichnis = baue_verzeichnis([KAPITEL, GLOSSAR])
    glossar, befunde = baue_glossar(GLOSSAR, verzeichnis)
    assert [b.kennung for b in befunde] == ["glossar-pfeil"]  # „Gänsefuß“ gibt es nicht
    doppelangriff = glossar["eintraege"][0]
    assert doppelangriff["verweise"] == ["Gabel (Springergabel)"]
    assert doppelangriff["stellen"] == [
        {"anker": "gabel-3", "kapitel": 3, "abschnitt": "3.1", "abbildung": "3.1"}
    ]
    begriff = next(t for t in doppelangriff["text"] if t["art"] == "begriff")
    assert begriff == {"art": "begriff", "text": "Gabel", "begriff": "Gabel (Springergabel)"}
    assert pruefe_schema(glossar, "glossar.schema.json") == []


def test_bilanz_gehoert_zur_abbildung_mit_dem_zug_aus_dem_titel():
    """Steht zwischen der Stellung aus dem Titel und der Bilanz noch eine Abbildung (wie beim
    Stafford-Gambit, Abb. 3.65 und 3.66), gehört die Bilanz zur Abbildung mit dem Titelzug."""
    from pipeline.lesen.bilanzen import _abbildung_zur_bilanz

    text = (
        r"\diagramm[\abbziel{3.65}: Nach 6. Le2!. Gold: die Figuren.]{fen}"
        r"\diagramm[\abbziel{3.66}: Nach 6... Sg4 7. Lxg4 Dh4, Weiß am Zug.]{fen}"
    )
    assert _abbildung_zur_bilanz(text, r"Stafford-Gambit nach \zugfolge{6. Le2!}") == "3.65"
    assert _abbildung_zur_bilanz(text, r"Gambit nach \zugfolge{9. O-O}") == "3.66"
    assert _abbildung_zur_bilanz(text, "Ohne Zug") == "3.66"
    assert _abbildung_zur_bilanz("kein Bild", "Ohne Zug") is None


def test_fallencheck_wird_gelesen():
    """Ein Fallencheck mit Stopp-Moment, zwei Prüfzeilen, Rettung und Fallensteller-Test."""
    from pipeline.lesen.fallenchecks import lies_fallenchecks

    quelle = Quelldatei(
        "kap04_test.tex",
        r"""\chapter[Test]{}
\section{Fallen}
\begin{fallencheck}{Testfalle}
\checkwer{Schwarz, mit \zugfolge{3... b5?}. Stopp-Moment: \abb{4.2}.}
\begin{checktabelle}
\checkzeile{\regelkz{W1} Ungedeckte Figur}{Der Turm hat keinen Verteidiger.}{\checkteils}
\checkzeile{\regelkz{F3} Fesselungs-Check}{Keine Fesselung im Spiel.}{\checkentfaellt}
\end{checktabelle}
\checkrettung{Erst entwickeln.}
\checkfallensteller{\checkja}{Normale Züge.}
\end{fallencheck}
""",
    )
    check = lies_fallenchecks(quelle).fallenchecks[0]
    assert check.name == "Testfalle"
    assert check.stopp == "4.2"
    assert [(z.kennung, z.titel_latex, z.wertung) for z in check.zeilen] == [
        ("W1", "Ungedeckte Figur", "teils"),
        ("F3", "Fesselungs-Check", "entfaellt"),
    ]
    assert check.rettung_latex == "Erst entwickeln."
    assert check.fallensteller == ("ja", "Normale Züge.")
