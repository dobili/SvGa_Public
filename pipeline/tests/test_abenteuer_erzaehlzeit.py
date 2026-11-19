"""Prüfung der Erzählzeilen, die zeitlich nicht ins Gespräch passen (pipeline/abenteuer/erzaehlzeit.py).

Warum: Wunsch des Autors (19.11.2026): Was auf dem Weg geschieht (Treppe, Tür, Ankommen), steht beim
Betreten der Karte, nicht im Gespräch mit einer Figur. Der erste Test verlangt, dass jeder Kandidat
angesehen ist; die übrigen halten die Erkennung und die drei Umbauten fest.
"""

import json

from pipeline.abenteuer.erzaehlzeit import DATEN, GEPRUEFT, kandidaten, verdaechtig


def test_jeder_kandidat_ist_angesehen():
    """Neue Erzählzeilen mit Weg- oder Ankunftswörtern in Figurendialogen brauchen einen Blick."""
    offen = [
        f"{k.datei}:{k.zeile} ({k.knoten}) {k.text.strip()}" for k in kandidaten() if k.geprueft() is None
    ]
    assert offen == [], (
        "Erzählzeile im Gespräch prüfen (an den Eingang verlegen oder in GEPRUEFT):\n" + "\n".join(offen)
    )


def test_gepruefte_gibt_es_noch():
    """Jeder Eintrag in GEPRUEFT trifft noch eine Zeile (sonst ist er veraltet)."""
    alle = kandidaten()
    for schluessel in GEPRUEFT:
        datei, knoten, anfang = schluessel.split(":", 2)
        assert any((k.datei, k.knoten) == (datei, knoten) and anfang in k.text for k in alle), schluessel


def test_erkennung():
    """Treppe, Knarren, Gehen und Ankommen fallen auf; Sitzen am Tisch nicht."""
    assert verdaechtig("Du kommst mit dem alten Brett die Treppe herunter.")
    assert verdaechtig("Drinnen ist es laut und warm.")
    assert not verdaechtig("Sie lacht, ein bisschen zu kurz.")


def test_wege_stehen_im_eingang():
    """Treppe im Wohnzimmer, Raststätte und Hütte erzählen ihr Ankommen beim Betreten."""
    orte = json.loads((DATEN / "orte.json").read_text(encoding="utf-8"))["orte"]
    eingaenge = {k["kennung"]: k.get("eingang", {}).get("dialog") for o in orte for k in o["karten"]}
    assert eingaenge["mapleFalls.wohnzimmer"] == "maple-falls-wohnzimmer.eingang"
    assert eingaenge["crossroads.raststaette"] == "crossroads-raststaette.eingang"
    assert eingaenge["summitCity.huette"] == "summit-city-huette.eingang"
    wohnzimmer = (DATEN / "dialoge" / "de" / "maple-falls-wohnzimmer.ink").read_text(encoding="utf-8")
    abend = wohnzimmer.split("=== erster_abend ===")[1].split("=== ")[0]
    assert "knarrt" not in abend
