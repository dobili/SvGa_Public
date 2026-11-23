"""Stellenliste der Tierfotos (pipeline/abenteuer/pixellab_tierfotos.py).

Warum: Der Hauptchat baut die Fotos aller Arten mit einem Befehl nach (23.11.2026). Die Liste muss
jede Art mit Bild treffen, Tiere mit „wann“ zur richtigen Zeit zeigen und die Größenvergleiche
enthalten.
"""

import json

from pipeline.abenteuer.pixellab_tierfotos import TIERARTEN, VERGLEICH, stellen


def test_jede_art_mit_bild_hat_eine_stelle():
    arten = json.loads(TIERARTEN.read_text(encoding="utf-8"))["arten"]
    liste = stellen()
    gefunden = {s["datei"] for s in liste}
    pixellab = {a for a, v in arten.items() if v["schnitt"] == "pixellab"}
    assert pixellab <= gefunden, sorted(pixellab - gefunden)
    nach_datei = {s["datei"]: s for s in liste}
    assert nach_datei["eule"]["stunde"] == 23
    assert nach_datei["eichelhaeher"]["stunde"] == 7
    for art, (alt, _neu) in VERGLEICH.items():
        vergleich = nach_datei[f"{art}-{alt}px"]
        assert vergleich["massstab"][art] < arten[art]["massstab"], art
