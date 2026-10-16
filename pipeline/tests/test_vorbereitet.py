"""Tests für die vorbereiteten Texte (AP 14): Prüfung gegen Abbildungen und Werkzeuge, Übernahme."""

import json
from pathlib import Path

from pipeline.bauen.__main__ import pruefe_schema
from pipeline.texte.vorbereitet import (
    erfragter_zug,
    lies_vorbereitet,
    lies_werkzeuge,
    pruefe_vorbereitet,
    texte_fuer_app,
)

HAUPTORDNER = Path(__file__).resolve().parents[2]
DATEN = HAUPTORDNER / "app/public/daten/de/a1"
WERKZEUGE = lies_werkzeuge(HAUPTORDNER / "app/src/i18n/de.json")


def _kapitel(nummer: int) -> dict:
    return json.loads((DATEN / f"kap{nummer:02d}.json").read_text(encoding="utf-8"))


def _eintrag(**anders):
    eintrag = {
        "abbildung": "1.26",
        "status": "entwurf",
        "einschaetzungen": [
            {
                "werkzeug": "k1-zaehlen",
                "hinweise": ["Zähle am Feld d4.", "Achte auf die Dame b6.", "Drei gegen drei."],
                "text": "Am Feld d4 stehen drei Angreifer gegen drei Verteidiger.",
            }
        ],
        "fragen": [
            {
                "zug": "6. Ld3",
                "frage": "Warum ist 6. Ld3 ungenau?",
                "antworten": ["Er lässt d4 fallen.", "Er stellt die Dame ein."],
                "richtig": 0,
                "erklaerung": "Der Läufer verlässt die Verteidigung von d4 nicht, aber …",
            }
        ],
    }
    return eintrag | anders


def _kennungen(*eintraege) -> list[str]:
    texte = {"schemaVersion": 1, "kapitel": 1, "texte": list(eintraege)}
    return [b.kennung for b in pruefe_vorbereitet(texte, _kapitel(1), WERKZEUGE, "vorbereitet-kap01.json")]


def test_werkzeuge_aus_den_oberflaechentexten():
    assert WERKZEUGE["k1-zaehlen"] == 1
    assert WERKZEUGE["k12-sicherheitsblick"] == 12
    assert len(WERKZEUGE) >= 34  # 35 bis 0.2.26; „Vier Prüfungen“ (k10) entfiel in 0.2.27


def test_passender_eintrag_ohne_befund_und_schema_gueltig():
    assert _kennungen(_eintrag()) == []
    texte = {"schemaVersion": 1, "kapitel": 1, "texte": [_eintrag()]}
    assert pruefe_schema(texte, "vorbereitet.schema.json") == []


def test_befunde_zu_abbildung_werkzeug_zug_und_antwort():
    assert _kennungen(_eintrag(abbildung="1.99")) == ["vorbereitet-abbildung"]
    assert _kennungen(_eintrag(), _eintrag()) == ["vorbereitet-doppelt"]
    fremd = [_eintrag()["einschaetzungen"][0] | {"werkzeug": "k1-gibtsnicht"}]
    assert _kennungen(_eintrag(einschaetzungen=fremd)) == ["vorbereitet-werkzeug"]
    spaeter = [_eintrag()["einschaetzungen"][0] | {"werkzeug": "k5-bauern"}]
    assert _kennungen(_eintrag(einschaetzungen=spaeter)) == ["vorbereitet-freischaltung"]
    frage = _eintrag()["fragen"][0]
    assert _kennungen(_eintrag(fragen=[frage | {"zug": "6. Dh8"}])) == ["vorbereitet-zug"]
    assert _kennungen(_eintrag(fragen=[frage | {"richtig": 3}])) == ["vorbereitet-antwort"]
    ohne_zug = {k: v for k, v in frage.items() if k != "zug"}
    assert _kennungen(_eintrag(fragen=[ohne_zug])) == []


def test_erfragter_zug_in_deutscher_notation():
    fen = next(a["fen"] for a in _kapitel(1)["abbildungen"] if a["id"] == "1.26")
    assert erfragter_zug(fen, "6. Ld3?!") is not None
    assert erfragter_zug(fen, "Ld3") is None  # ohne Zugnummer wie im Buch nicht lesbar
    assert erfragter_zug(fen, "kein Zug") is None


def test_nur_freigegebene_ausser_mit_entwuerfen():
    texte = {"schemaVersion": 1, "kapitel": 1, "texte": [_eintrag()]}
    assert texte_fuer_app(texte, mit_entwuerfen=False) == {}
    app = texte_fuer_app(texte, mit_entwuerfen=True)["1.26"]
    assert app["status"] == "entwurf"
    # Seit 0.2.27 nur die Warum-Fragen in der App, keine Einschätzungen.
    assert set(app) == {"status", "fragen"}
    kapitel = _kapitel(1)
    kapitel["abbildungen"][0]["vorbereitet"] = app
    assert pruefe_schema(kapitel, "kapitel.schema.json") == []


def test_ohne_warum_frage_nichts_fuer_die_app():
    texte = {"schemaVersion": 1, "kapitel": 1, "texte": [_eintrag(fragen=[])]}
    assert texte_fuer_app(texte, mit_entwuerfen=True) == {}


def test_entwuerfe_im_repository_passen_zu_buch_und_werkzeugen():
    """Alle vorhandenen Dateien: Schema gültig, keine Befunde (Daten ohne Buchquellen)."""
    for kapitel in range(13):
        texte = lies_vorbereitet(HAUPTORDNER / "inhalte/de/texte", kapitel)
        if texte is None:
            continue
        assert pruefe_schema(texte, "vorbereitet.schema.json") == []
        assert pruefe_vorbereitet(texte, _kapitel(kapitel), WERKZEUGE, "test") == []
