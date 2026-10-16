"""Tests für die Lösungserklärungen (AP 6): Prüfung gegen das Buch und Übernahme in die App."""

import json
from pathlib import Path

from pipeline.bauen.__main__ import pruefe_schema
from pipeline.texte.loesungen import (
    Loesungsstellung,
    erklaerungen_fuer_app,
    lies_loesungstexte,
    pruefe_loesungstexte,
    stellungen_der_uebungen,
)

HAUPTORDNER = Path(__file__).resolve().parents[2]
# Abb. 1.40 (Übung 4): 1. Sc7+! gabelt König, Dame und Turm.
FEN_UEBUNG_4 = "rn2kb1r/1p3ppp/p3pn2/1Npq4/3P4/5N2/PPP2PPP/R1BQ1RK1 w kq - 0 1"


def _eintrag(**anders):
    eintrag = {
        "uebung": "ueb:droh-ignorieren",
        "nummer": 4,
        "status": "entwurf",
        "loesung": "1. Sc7+!",
        "akzeptiert": [],
        "motiv": "Springergabel mit Schach",
        "text": "1. Sc7+! gabelt König, Dame und Turm.",
    }
    return eintrag | anders


def _stellungen():
    return {"ueb:droh-ignorieren": Loesungsstellung(4, FEN_UEBUNG_4, {"Nc7", "Nxd5", "Nc3"})}


def _kennungen(*eintraege):
    texte = {"schemaVersion": 1, "kapitel": 1, "erklaerungen": list(eintraege)}
    return [b.kennung for b in pruefe_loesungstexte(texte, _stellungen(), "loesungen-kap01.json")]


def test_passende_erklaerung_ohne_befund():
    assert _kennungen(_eintrag()) == []


def test_befunde_bei_falscher_nummer_falschem_zug_und_fremdem_zug():
    assert _kennungen(_eintrag(nummer=5)) == ["erklaerung-nummer"]
    assert _kennungen(_eintrag(loesung="1. Sc7")) == []  # fehlendes „+“ ist kein Grund
    assert _kennungen(_eintrag(loesung="1. Sd7+")) == ["erklaerung-zug"]
    assert _kennungen(_eintrag(loesung="1. Sd6+")) == ["erklaerung-buch"]
    assert _kennungen(_eintrag(uebung="ueb:gibt-es-nicht")) == ["erklaerung-uebung", "erklaerung-fehlt"]


def test_nur_freigegebene_kommen_in_die_app():
    texte = {"schemaVersion": 1, "kapitel": 1, "erklaerungen": [_eintrag()]}
    assert erklaerungen_fuer_app(texte) == {}
    texte["erklaerungen"][0]["status"] = "freigegeben"
    app = erklaerungen_fuer_app(texte)["ueb:droh-ignorieren"]
    assert app == {k: _eintrag()[k] for k in ("loesung", "akzeptiert", "motiv", "text")}
    uebung = json.loads((HAUPTORDNER / "app/public/daten/de/a1/kap01.json").read_text(encoding="utf-8"))
    kapitel = uebung | {"uebungen": [uebung["uebungen"][0] | {"erklaerung": app}]}
    assert pruefe_schema(kapitel, "kapitel.schema.json") == []


def test_entwuerfe_im_repository_passen_zum_buch():
    """Alle 86 Entwürfe: Schema gültig, Züge spielbar, erster Zug in der Buchlösung (Daten ohne Buch)."""
    anzahl = 0
    for kapitel in range(13):
        texte = lies_loesungstexte(HAUPTORDNER / "inhalte/de/texte", kapitel)
        assert texte is not None
        assert pruefe_schema(texte, "loesungstexte.schema.json") == []
        daten = json.loads(
            (HAUPTORDNER / f"app/public/daten/de/a1/kap{kapitel:02d}.json").read_text(encoding="utf-8")
        )
        assert pruefe_loesungstexte(texte, stellungen_der_uebungen(daten), "test") == []
        anzahl += len(texte["erklaerungen"])
    assert anzahl == 86
