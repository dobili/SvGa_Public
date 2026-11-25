"""Ansprechziele der Hauptquests: Figur auf ihrer Karte, vom Eingang aus erreichbar (Dauertest).

Warum: Wunsch des Autors (25.11.2026). Hauptfiguren sprechen den Helden an, wenn er vor ihnen
vorbeigeht (app/src/abenteuer/regeln/ansprechen.ts); ``pipeline/abenteuer/ansprechziel.py`` prüft,
dass jede Zielfigur eines Hauptquestschritts dort steht und erreichbar ist.
"""

from pipeline.abenteuer.ansprechziel import Ziel, kegel, main, pruefe, schrittziele


def test_keine_befunde():
    befunde, _ = pruefe()
    assert befunde == []


def test_kegel_nach_blickrichtung():
    assert (54, 25) in kegel({"name": "juno", "feld": [54, 24]})
    assert (54, 23) not in kegel({"name": "juno", "feld": [54, 24]})
    links = kegel({"name": "x", "feld": [5, 5], "blick": "links"})
    assert (2, 6) in links and (6, 5) not in links
    assert len(links) == 9


def test_umweg_und_gegner_als_ziele():
    daten = {"begegnungen": [{"kennung": "o.kampf", "gegner": "o.mira"}], "runden": [], "orte": []}
    schritt = {
        "ereignis": {"art": "partie", "begegnung": "o.kampf"},
        "umwege": [{"wenn": "nicht brief", "ziel": {"karte": "o.laden", "objekt": "okoro"}}],
    }
    assert schrittziele("q#0", schritt, daten) == [
        Ziel("q#0", "okoro", karte="o.laden"),
        Ziel("q#0", "mira", ort="o"),
    ]


def test_aufruf_ohne_befund(capsys):
    assert main([]) == 0
    assert capsys.readouterr().out.strip().startswith("0 Befunde")
