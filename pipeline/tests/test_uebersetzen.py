"""Tests: Übersetzungsschicht für die englischen App-Daten (Paket P6, R25)."""

import json
from pathlib import Path

import pytest

from pipeline.pruefen.daten import pruefe_datenordner
from pipeline.uebersetzen.__main__ import QUELLE, TABELLEN, ZIEL, alle_tabellen, baue, datendateien
from pipeline.uebersetzen.felder import einheiten
from pipeline.uebersetzen.pruefen import deutsche_zuege, restdeutsch
from pipeline.uebersetzen.tabellen import kennung
from pipeline.uebersetzen.uebertragen import begriffsuebersetzer, uebersetze
from pipeline.uebersetzen.vorlage import (
    VorlagenFehler,
    teile_aus_vorlage,
    vorlage_aus_teilen,
    zug_auf_englisch,
)

# Unterschrift von Abb. 1.2 (gekürzt): Text, Zug, fett, kursiv.
TEILE_1_2 = [
    {"art": "text", "text": "Nach ", "stil": "normal"},
    {"art": "zug", "text": "2. Lf4"},
    {"art": "text", "text": " – ", "stil": "normal"},
    {"art": "text", "text": "Ziel 1", "stil": "fett"},
    {"art": "text", "text": ": Der Läufer geht ", "stil": "normal"},
    {"art": "text", "text": "bevor", "stil": "kursiv"},
    {"art": "text", "text": " e3 kommt.", "stil": "normal"},
]


def test_zuege_werden_englisch():
    assert zug_auf_englisch("4. Sc3! Lc5 5. Sd5!") == "4. Nc3! Bc5 5. Nd5!"
    assert zug_auf_englisch("26. Tea1") == "26. Rea1"
    assert zug_auf_englisch("e8=D+ Kxd7") == "e8=Q+ Kxd7"
    assert zug_auf_englisch("3. Dg8+!! Txg8 4. Sf7#") == "3. Qg8+!! Rxg8 4. Nf7#"
    # schon englisch: unverändert
    assert zug_auf_englisch("2. Bf4 Nf6") == "2. Bf4 Nf6"


def test_vorlage_aus_teilen():
    erwartet = "Nach {z1} – <b>Ziel 1</b>: Der Läufer geht <i>bevor</i> e3 kommt."
    assert vorlage_aus_teilen(TEILE_1_2) == erwartet


def test_englische_vorlage_ergibt_teile_mit_englischem_zug():
    teile = teile_aus_vorlage("After {z1} – <b>Goal 1</b>: the bishop moves <i>before</i> e3.", TEILE_1_2)
    assert teile == [
        {"art": "text", "text": "After ", "stil": "normal"},
        {"art": "zug", "text": "2. Bf4"},
        {"art": "text", "text": " – ", "stil": "normal"},
        {"art": "text", "text": "Goal 1", "stil": "fett"},
        {"art": "text", "text": ": the bishop moves ", "stil": "normal"},
        {"art": "text", "text": "before", "stil": "kursiv"},
        {"art": "text", "text": " e3.", "stil": "normal"},
    ]


def test_zug_darf_im_satz_wandern():
    teile = teile_aus_vorlage("White develops with {z1}.", TEILE_1_2[:2])
    assert [t["text"] for t in teile] == ["White develops with ", "2. Bf4", "."]


def test_verweis_stelle_zeichen_absatz_und_begriff():
    deutsch = [
        {"art": "text", "text": "Siehe ", "stil": "normal"},
        {"art": "verweis", "text": "Abb.\xa01.8", "abbildung": "1.8"},
        {"art": "text", "text": " und ", "stil": "normal"},
        {"art": "stelle", "text": "Abschnitt 7.2", "anker": "abzug-7"},
        {"art": "absatz", "text": "¶"},
        {"art": "zeichen", "text": "✓", "zeichen": "ja"},
        {"art": "begriff", "text": "Bauernkette", "begriff": "Bauernkette"},
    ]
    vorlage = vorlage_aus_teilen(deutsch)
    assert vorlage == "Siehe {v1} und {s1}{p}{c1}<g1>Bauernkette</g1>"
    englisch = teile_aus_vorlage(
        "See {v1} and {s1}{p}{c1}<g1>pawn chain</g1>", deutsch, {"Bauernkette": "Pawn chain"}.get
    )
    assert englisch[1] == {"art": "verweis", "text": "Fig.\xa01.8", "abbildung": "1.8"}
    assert englisch[3] == {"art": "stelle", "text": "Section 7.2", "anker": "abzug-7"}
    assert englisch[4]["art"] == "absatz" and englisch[5]["zeichen"] == "ja"
    assert englisch[6] == {"art": "begriff", "text": "pawn chain", "begriff": "Pawn chain"}


@pytest.mark.parametrize(
    "falsch",
    [
        "After – <b>Goal 1</b>: before.",  # {z1} fehlt
        "After {z1} {z1} – <b>Goal 1</b>",  # doppelt
        "After {z1} {z2} – <b>Goal 1</b>",  # gibt es nicht
        "After {z1} – <b>Goal <i>1</i></b>",  # verschachtelt
    ],
)
def test_unpassende_vorlage_ist_fehler(falsch):
    with pytest.raises(VorlagenFehler):
        teile_aus_vorlage(falsch, TEILE_1_2)


def test_pruefungen_deutsche_zuege_und_restdeutsch():
    assert deutsche_zuege("With 5. Lf4 and Sxd5 White …") == ["Lf4", "Sxd5"]
    assert deutsche_zuege("With 5. Bf4 and Nxd5, the rook on d1 …") == []
    assert restdeutsch("The bishop und the knight") == ["und"]
    assert restdeutsch("the Göring Gambit") == []


def test_schluessel_bleiben_unuebersetzt():
    daten = {
        "uebungen": [
            {
                "id": "ueb:droh-ignorieren",
                "aufgabe": TEILE_1_2[:2],
                "erklaerung": {
                    "loesung": "1. Sc7+!",
                    "akzeptiert": ["1. exd5"],
                    "motiv": "Gabel",
                    "text": "Satz.",
                },
            }
        ],
        "abbildungen": [
            {"id": "1.40", "vorbereitet": {"einschaetzungen": [{"werkzeug": "k1-zaehlen", "text": "T."}]}}
        ],
    }
    orte = [e.ort for e in einheiten(daten)]
    assert ".uebungen[ueb:droh-ignorieren].aufgabe" in orte
    assert ".uebungen[ueb:droh-ignorieren].erklaerung.motiv" in orte
    assert not any("loesung" in ort or "akzeptiert" in ort or "werkzeug" in ort for ort in orte)


def test_loesungszuege_und_fragezuege_werden_englisch():
    daten = {
        "uebungen": [{"erklaerung": {"loesung": "1. Sc7+! Kd8 2. Sxa8", "akzeptiert": ["1. Lb5"]}}],
        "abbildungen": [{"vorbereitet": {"fragen": [{"zug": "4. Sc3", "frage": "Warum?"}]}}],
    }
    englisch, _ = uebersetze(daten, "kap01.json", {}, lambda begriff: begriff)
    erklaerung = englisch["uebungen"][0]["erklaerung"]
    assert erklaerung == {"loesung": "1. Nc7+! Kd8 2. Nxa8", "akzeptiert": ["1. Bb5"]}
    assert englisch["abbildungen"][0]["vorbereitet"]["fragen"][0]["zug"] == "4. Nc3"


def test_glossar_verweise_und_reihenfolge():
    glossar = {
        "schemaVersion": 1,
        "eintraege": [
            {
                "begriff": "Abzug",
                "text": [{"art": "text", "text": "A.", "stil": "normal"}],
                "stellen": [],
                "verweise": [],
            },
            {
                "begriff": "Zugzwang",
                "text": [{"art": "begriff", "text": "Abzug", "begriff": "Abzug"}],
                "stellen": [],
                "verweise": ["Abzug"],
            },
        ],
    }
    tabelle = {kennung("Abzug"): "Discovered attack", kennung("<g1>Abzug</g1>"): "<g1>discovered attack</g1>"}
    englisch, bericht = uebersetze(glossar, "glossar.json", tabelle, begriffsuebersetzer(glossar, tabelle))
    assert [e["begriff"] for e in englisch["eintraege"]] == ["Discovered attack", "Zugzwang"]
    assert englisch["eintraege"][1]["verweise"] == ["Discovered attack"]
    assert englisch["eintraege"][1]["text"][0]["begriff"] == "Discovered attack"
    # „A.“ und „Zugzwang“ sind offen: auch ein gleichlautender Begriff braucht eine Zeile.
    assert bericht.uebersetzt == 2 and len(bericht.offen) == 2


def test_eingecheckte_englische_daten_passen_zu_den_tabellen(tmp_path: Path):
    """Wer eine Tabelle ändert, muss die englischen Daten neu bauen (und umgekehrt)."""
    if not ZIEL.exists():
        pytest.skip("noch keine englischen Daten")
    berichte = baue(QUELLE, tmp_path, TABELLEN)
    assert [m for b in berichte for m in b.fehler] == []
    for datei in datendateien(QUELLE):
        gebaut = json.loads((tmp_path / datei).read_text(encoding="utf-8"))
        eingecheckt = json.loads((ZIEL / datei).read_text(encoding="utf-8"))
        assert gebaut == eingecheckt, f"{datei}: python -m pipeline.uebersetzen neu laufen lassen"
    assert pruefe_datenordner(ZIEL) == []


def test_tabellen_ohne_verwaiste_kennungen():
    """Jede Kennung einer Tabelle gehört zu einem Satz der heutigen deutschen Daten."""
    for datei, tabelle in alle_tabellen(TABELLEN, datendateien(QUELLE)).items():
        daten = json.loads((QUELLE / datei).read_text(encoding="utf-8"))
        heute = {kennung(e.vorlage) for e in einheiten(daten)}
        assert set(tabelle) - heute == set(), f"{datei}: verwaiste Kennungen"
