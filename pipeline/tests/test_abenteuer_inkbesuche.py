"""Prüfung der Besuchszähler in Ink-Dialogen (pipeline/abenteuer/inkbesuche.py).

Warum: Die App beginnt jeden Dialog als neue Ink-Geschichte; ein Besuchszähler, der einen früheren
Dialog voraussetzt, ist immer 0 (Befund vom 17.11.2026, desert-springs-garage.ink). Der erste Test
hält den Stand der echten Dateien fest, die übrigen die Regeln an kleinen Beispielen.
"""

import json

from pipeline.abenteuer.inkbesuche import main, pruefe_alles, pruefe_datei, startknoten
from pipeline.abenteuer.inkfluss import erreichbar, lies

# Wie desert-springs-garage.ink vor der Berichtigung: Der zweite Dialog sollte kürzer beginnen.
UEBER_DIALOGE = """
VAR besprochen = false
=== mira ===
{
- not besprochen: -> erinnerung
- else: -> alltag
}
=== erinnerung ===
{erinnerung_wahl:
    Die Stellung liegt noch da.
    -> erinnerung_wahl
}
Abend in der Garage.
-> erinnerung_wahl
=== erinnerung_wahl ===
+ [Spielen]
    -> END
+ [„Ein andermal.“]
    -> END
=== alltag ===
Hallo.
-> END
"""

# Zulässig: Der Dialog kehrt im selben Gespräch zur Auswahl zurück.
IM_SELBEN_DIALOG = """
=== wirt ===
{wirt > 1: Noch etwas?|Was darf es sein?}
+ {not wirt.kaffee} [Kaffee]
    -> kaffee
+ [Nichts]
    -> END
= kaffee
Bitte sehr.
-> wirt
"""


def _einstufungen(quelle: str, *starts: str) -> list[tuple[str, str]]:
    return [(b.name, b.einstufung) for b in pruefe_datei("t.ink", quelle, set(starts))]


def test_echte_dialoge_ohne_befunde():
    befunde = [b for b in pruefe_alles() if b.einstufung == "befund"]
    assert befunde == [], "Besuchszähler (python -m pipeline.abenteuer.inkbesuche):\n" + "\n".join(
        str(b) for b in befunde
    )
    assert main([]) == 0


def test_zaehler_ueber_dialoge_hinweg_ist_befund():
    (bedingung,) = pruefe_datei("t.ink", UEBER_DIALOGE, {"mira"})
    assert (bedingung.name, bedingung.einstufung) == ("erinnerung_wahl", "befund")
    assert bedingung.grund.startswith("immer 0") and bedingung.knoten == "erinnerung"
    assert bedingung.zeile == UEBER_DIALOGE.split("\n").index("{erinnerung_wahl:") + 1


def test_zaehler_im_selben_dialog_ist_in_ordnung():
    assert _einstufungen(IM_SELBEN_DIALOG, "wirt") == [
        ("wirt", "in Ordnung"),
        ("wirt.kaffee", "in Ordnung"),
    ]


def test_variablen_und_funktionen_zaehlen_nicht():
    quelle = """
VAR slickGetroffen = false
CONST GRENZE = 2
EXTERNAL gibFund(kennung)
=== function punkte(wert) ===
~ return wert + GRENZE
=== slick(zahl) ===
~ temp gefragt = slickGetroffen
{slickGetroffen and gefragt and zahl > GRENZE and punkte(zahl) > 3: Wieder du.}
{~Hallo.|Na.} Text mit slick und frage im Satz.
~ gibFund("slick")
-> frage
=== frage ===
Was?
-> END
"""
    assert _einstufungen(quelle, "slick") == []
    mit_knoten = quelle.replace("gefragt and zahl", "frage and zahl")
    assert _einstufungen(mit_knoten, "slick") == [("frage", "befund")]


def test_alle_schreibweisen_werden_gefunden():
    quelle = """
VAR x = 0
=== start ===
{not anderer: Erstes Mal.}
Du warst {anderer} Mal dort.
* {anderer.teil > 0} [Wahl]
    ~ x = anderer
- {TURNS_SINCE(-> anderer) >= 0: Eben erst.}
{READ_COUNT(-> anderer.teil) > 1: Oft.}
{
- anderer: -> anderer
- else: -> END
}
=== anderer ===
-> teil
= teil
-> END
"""
    gefunden = _einstufungen(quelle, "start")
    assert [name for name, _ in gefunden] == [
        "anderer",
        "anderer",
        "anderer.teil",
        "anderer",
        "anderer",
        "anderer.teil",
        "anderer",
    ]
    assert {einstufung for _, einstufung in gefunden} == {"befund"}


def test_tunnel_liegt_hinter_dem_aufruf():
    # Wie „Warum atme?“: Die Bedingung steht vor dem Tunnel, der Stitch kann nie davor liegen.
    einmal = """
=== sieg ===
Noch mal.
{not sieg.warum: -> warum ->}
-> END
= warum
Warum?
->->
"""
    assert _einstufungen(einmal, "sieg") == [("sieg.warum", "befund")]
    # Nach dem Tunnel ist der Stitch durchlaufen: Hier kann die Bedingung wahr werden.
    danach = einmal.replace("-> END\n= warum", "{sieg.warum: Gut.}\n-> END\n= warum")
    assert _einstufungen(danach, "sieg")[1] == ("sieg.warum", "in Ordnung")
    fluss = lies(danach)
    assert fluss.namen[("sieg", "warum")] in erreichbar(fluss, fluss.namen[("sieg",)])


def test_immer_eins_ist_befund():
    # Wie die Rätseltafel: „tafel == 1“ sollte den ersten Besuch meinen, gilt aber in jedem Dialog.
    quelle = "=== tafel ===\n{tafel == 1: Das macht Mr. Pratt.}\n-> END\n"
    (bedingung,) = pruefe_datei("t.ink", quelle, {"tafel"})
    assert bedingung.einstufung == "befund" and bedingung.grund.startswith("immer 1")


def test_wahlen_und_sammler():
    quelle = """
=== start ===
* [Links]
    Links.
    -> links
* [Rechts]
    Rechts.
    * * [Weiter]
        Weiter.
    * * [Zum Hof]
        -> hof
- {links: Du warst links.}
{rechts: Du warst rechts.}
{hof: Du warst im Hof.}
-> rechts
=== hof ===
Der Hof.
-> END
=== links ===
-> start
=== rechts ===
-> END
"""
    # Der Sammler folgt auf „Weiter.“ (Ende der inneren Wahl), nie auf „-> hof“ oder „-> rechts“.
    assert _einstufungen(quelle, "start") == [
        ("links", "in Ordnung"),
        ("rechts", "befund"),
        ("hof", "befund"),
    ]


def test_unsicheres_wird_gelistet_aber_nicht_gezaehlt():
    quelle = """
VAR hof = false
=== start ===
* (gefragt) [Fragen]
    -> start
* {gefragt} [Nachhaken]
    -> END
=== verwaist ===
{start: Nie erreicht.}
{hof: Variable oder Knoten?}
-> END
=== hof ===
-> END
"""
    gefunden = pruefe_datei("t.ink", quelle, {"start"})
    assert [(b.name, b.einstufung) for b in gefunden] == [
        ("gefragt", "unsicher"),
        ("start", "unsicher"),
        ("hof", "unsicher"),
    ]
    mit_include = pruefe_datei("t.ink", "INCLUDE andere.ink\n" + IM_SELBEN_DIALOG, {"wirt"})
    assert {b.einstufung for b in mit_include} == {"unsicher"}


def test_startknoten_aus_den_daten(tmp_path):
    orte = {"orte": [{"figuren": [{"dialog": "garage.mira"}], "ausloeser": [{"dialog": "garage.tor"}]}]}
    runden = {"runden": [{"kennung": "garage.reihe", "danach": "archiv.heft_danach"}]}
    quests = {"quests": [{"schritte": [{"art": "dialog", "knoten": "garage.nur_quest"}]}]}
    for name, inhalt in (("orte", orte), ("runden", runden), ("quests", quests)):
        (tmp_path / f"{name}.json").write_text(json.dumps(inhalt), encoding="utf-8")
    assert startknoten(tmp_path) == {"garage": {"mira", "tor"}, "archiv": {"heft_danach"}}
    echte = startknoten()
    assert "mira" in echte["desert-springs-garage"] and "clubkampf_atme" in echte["desert-springs-garage"]
