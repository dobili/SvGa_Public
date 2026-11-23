"""Tierplan (pipeline/abenteuer/tierplan.py): Zielhöhen, Zuordnung der Belebung, Maßstäbe.

Warum: Auftrag des Hauptchats (21.11.2026): Tiere im richtigen Größenverhältnis zu den PixelLab-
Figuren (Erwachsener außen 20 Spielpixel, Kind 14), PixelLab-Plan für Ersatz- und fehlende Arten.
Der erste Test hält fest, dass tierarten.json die Maßstäbe aus der Zielhöhe trägt; die übrigen
prüfen Regeln und Daten ohne Bilder.
"""

import json

import pytest

from pipeline.abenteuer import tierplan as tp
from pipeline.abenteuer.tierplan_daten import ARTEN, GESCHICHTE


def test_massstaebe_in_tierarten_folgen_der_zielhoehe():
    """Jeder gemessene Bogen hat massstab = Zielhöhe / gemessene Höhe (auf 0,05 gerundet)."""
    arten = json.loads(tp.TIERARTEN.read_text(encoding="utf-8"))["arten"]
    alt = {art: a for art, a in arten.items() if a["schnitt"] != "pixellab"}
    abweichend = {
        art: (a.get("massstab", 1), tp.massstab_vorschlag(art))
        for art, a in alt.items()
        if tp.massstab_vorschlag(art) is not None
        and abs(a.get("massstab", 1) - tp.massstab_vorschlag(art)) > 1e-9
    }
    assert abweichend == {}
    assert set(alt) <= set(tp.GEMESSEN), sorted(set(alt) - set(tp.GEMESSEN))


def test_pixellab_massstab_aus_dem_echten_bild():
    """PixelLab-Bögen (23.11.2026): massstab = Zielhöhe / am Bogen gemessene Höhe (``gemessen``,
    pipeline/abenteuer/pixellab_tiere.py), auf 0,01 gerundet; die Art steht in der Tierplan-Tabelle."""
    arten = json.loads(tp.TIERARTEN.read_text(encoding="utf-8"))["arten"]
    neu = {art: a for art, a in arten.items() if a["schnitt"] == "pixellab"}
    assert len(neu) >= 50
    for art, a in neu.items():
        assert art in ARTEN, art
        assert a["massstab"] == pytest.approx(tp.zielhoehe(ARTEN[art]) / a["gemessen"], abs=0.006), art
        assert 0 < a["fuss"] <= a["hoehe"], art


def test_zielhoehen_im_verhaeltnis_zu_den_figuren():
    """Pferd und Kuh etwa wie ein Erwachsener, Hund über dem Knie, kleine Tiere mit Zuschlag."""
    assert 18 <= tp.zielhoehe(ARTEN["pferd"]) <= 24
    assert 15 <= tp.zielhoehe(ARTEN["kuh"]) <= 20
    assert tp.zielhoehe(ARTEN["hund"]) == 13
    assert tp.zielhoehe(ARTEN["katze"]) in (10, 11)
    assert tp.zielhoehe(ARTEN["hase"]) == 9
    assert tp.zielhoehe(ARTEN["maus"]) == 6
    assert tp.zielhoehe(ARTEN["ente"]) < tp.KIND_PX


def test_zuschlag_kehrt_die_reihenfolge_nicht_um():
    """Ein größeres Tier wird durch den Zuschlag nie kleiner als ein kleineres (Reh nicht über Pony)."""
    werte = [tp.zuschlag(z) for z in range(1, 30)]
    assert werte == sorted(werte)
    assert tp.zuschlag(14) <= tp.zuschlag(15) <= tp.zielhoehe(ARTEN["kuh"])


def test_leinwand_reicht_fuer_die_zeichnung():
    """Die Leinwand fasst Höhe und Länge mit 2/3 gezeichnet, höchstens 64."""
    for art in ARTEN.values():
        groesse = tp.leinwand(art)
        assert groesse in tp.LEINWAENDE
        noetig = max(tp.zielhoehe(art), tp.ziellaenge(art)) / tp.FIGURMASSSTAB
        assert groesse >= min(noetig, tp.LEINWAENDE[-1] * tp.FUELLUNG)


def test_jedes_tier_der_belebung_hat_eine_art():
    """Alle Tiernamen der Szenen gehören zu einer Art (außer Wind, Nebel, Staubteufel)."""
    b = tp.bestand()
    assert sum(b.stellen.values()) > 0
    assert set(b.stellen) <= set(ARTEN)
    assert tp.art_von("praeriehunde") == "praeriehund"
    assert tp.art_von("roboterhund") == "roboterhund"
    assert tp.art_von("werkskatzeAussen") == "katze"
    assert tp.art_von("staubteufel") is None


def test_daten_sind_vollstaendig():
    """Jede Art hat einen gültigen Typ und eine Animation; Geschichte nennt nur bekannte Arten."""
    ts = pytest.importorskip("pipeline.abenteuer.tierplan_seite")  # zeichnet mit Pillow
    assert set(GESCHICHTE) <= set(ARTEN)
    for art in ARTEN.values():
        assert art.typ in ("quadruped", "custom")
        assert (art.typ, art.bewegung) in ts.BEWEGUNG
        assert art.motiv in ts.prompt(art)


def test_maschinen_ohne_tierzusatz():
    """Roboter und Drohne: Maschinenstil, Tiermerkmale im Negativ (sonst Fuchs-Wesen, 22.11.2026)."""
    ts = pytest.importorskip("pipeline.abenteuer.tierplan_seite")  # zeichnet mit Pillow
    for name in ts.MASCHINEN:
        art = ARTEN[name]
        assert "animal" not in ts.prompt(art) and "machine" in ts.prompt(art)
        assert "fur" in ts.negativ(art)
    assert "ears" in ts.negativ(ARTEN["kehrroboter"])
    assert "ears" not in ts.negativ(ARTEN["roboterhund"])
    assert ts.negativ(ARTEN["katze"]) == ts.NEGATIV
