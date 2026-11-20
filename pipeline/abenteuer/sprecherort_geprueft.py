"""Angesehene Kandidaten des Werkzeugs pipeline/abenteuer/sprecherort.py, jeder mit Grund.

Schlüssel: „Prüfung:Figur:Datei.Knoten“ (Prüfung „liegen“, „kommt“, „sitzt“ oder „ruft“).

- ``GEPRUEFT``: Die Stelle passt, obwohl das Werkzeug sie meldet (Zeitsprung, eine andere Figur ist
  gemeint, die Figur steht nicht auf der Karte).
- ``GEMELDET``: Kartenbefund, der eine Szene im privaten Repository betrifft (Figur steht, der Text
  lässt sie sitzen). An den Hauptchat gemeldet; bis die Szene geändert ist, steht er hier.

Neue Kandidaten erst ansehen, dann beheben (``#stelle``, ``#gehe``, Text oder Karte) oder hier mit
Grund eintragen. Stand 20.11.2026 (mittel-4).
"""

GEPRUEFT: dict[str, str] = {
    "kommt:juno:capital-arena-aussen.abschied_ende": (
        "Juno steht nach dem Abschied nicht mehr vor der Arena (wenn: nicht abschiedGesehen); sie "
        "kommt nur in der Erzählung dazu, die Szene endet mit der Reise nach Hause."
    ),
    "kommt:hector:maple-falls-diner.hector_c": (
        "Ein Gast kommt herein, nicht Hector; Hector dreht sich nur um (Name im selben Satz)."
    ),
    "sitzt:haraldsen:summit-city-huette.ward_laurie": (
        "Victor sitzt am Kamin, im Pullover von Mr. Haraldsen; Haraldsen ist nur als Besitzer genannt."
    ),
    "liegen:held:maple-falls-wohnzimmer.erster_abend": (
        "Vorausblick am Ende des Abends; die Nacht selbst spielt seit dem 20.11.2026 im Zimmer, im "
        "Bett (maple-falls-dachboden.erste_nacht, #stelle)."
    ),
    "liegen:held:ghost-town-saloon.fund_abzeichen": (
        "{held} kann nicht schlafen, steht auf und leuchtet hinter den Tresen: Er steht zu Recht am "
        "Tresen, wo er das Abzeichen findet."
    ),
    "sitzt:mae:pinewood-camp-aussen.lagerfeuer_abend": (
        "Erzählter Abend am Lagerfeuer (Zeitsprung „Am Abend“), keine Szene auf der Karte."
    ),
    "sitzt:dex:pinewood-camp-aussen.lagerfeuer_abend": (
        "Erzählter Abend am Lagerfeuer (Zeitsprung „Am Abend“), keine Szene auf der Karte."
    ),
    "kommt:odile:port-delacroix-turnhalle.odile_clubkampf": (
        "Beginn des Clubkampfs: Odile setzt sich ans Brett, die Partie öffnet gleich; sie steht schon "
        "neben {held}, ein Weg wäre nur ein Schritt."
    ),
}

GEMELDET: dict[str, str] = {
    "sitzt:juno:capital-arena-halle.pause_nach_runde2": "Juno sitzt auf der Tribünenstufe; Karte: steht.",
    "sitzt:jonahDrinnen:cedar-creek-bibliothek.zwillinge_d": "Jonah sitzt am Brett; Karte: steht.",
    "sitzt:dex:cedar-creek-bibliothek.zwillinge_d": "Dex sitzt Jonah gegenüber; Karte: steht.",
    "sitzt:zwillingeDrinnen:cedar-creek-bibliothek.zwillinge_d": "Ivy sitzt daneben; Karte: steht.",
    "sitzt:mira:crossroads-aussen.mira": "Mira sitzt im Schneidersitz auf einem Tisch; Karte: steht.",
    "sitzt:mama:ironwood-kantine.big_joe_clubkampf": "Mama sitzt in der ersten Reihe; Karte: steht.",
    "sitzt:bigJoe:ironwood-kantine.big_joe_nach_kauf": "Big Joe sitzt auf einer Kiste; Karte: steht.",
    "sitzt:albescu:riverton-aussen.albescu_alltag": "Mrs. Albescu sitzt auf einem Hocker; Karte: steht.",
    "sitzt:nova:riverton-aussen.nova": "Nova sitzt auf der Kante des Podiums; Karte: steht.",
    "sitzt:theo:silicon-bay-akademie.theo": "Theo sitzt vor zwei Bildschirmen; Karte: steht.",
    "sitzt:ward:summit-city-huette.ward_lektion": "Ward sitzt im Sessel am Feuer; Karte: steht.",
}
