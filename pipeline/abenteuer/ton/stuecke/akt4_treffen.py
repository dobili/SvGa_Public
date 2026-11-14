"""Akt 4, Stücke aus vielen Orten: Crossroads, Lagerfeuer, Fernpartie und Abspann.

Warum: In Akt 4 kommen die Orte zusammen (Klangplan 4A1, 4A2). Crossroads spielt fünf Ortsthemen
nacheinander über einem fröhlichen Rhythmus, am Lagerfeuer werden alle acht Köpfe zu Strophen eines
Kinderlieds mit dem Heldenthema als Refrain, die Fernpartie sammelt sieben Fundorte (immer leiser),
der Abspann zeigt alle acht Orte mit Mamas, Victors und Ambroses Thema zwischen den Akten. Die Köpfe
kommen aus ``akt4_koepfe.py``, die Themen aus ``akt4_themen.py``; alles in G-Dur.

Ersatz: „Mitsingen ohne Worte“ am Lagerfeuer singt die Flöte, im Refrain mit der Mundharmonika.
Ezras Gitarre mit zwei fehlenden Saiten ist die Gitarre mit allen Saiten; dass ihr Saiten fehlen,
hört man an den Akkorden (nur I, IV, V). Stimmengewirr, Geschirr und Kinderstimmen sind Geräusche
(Teil B) und fehlen hier.
"""

from dataclasses import replace

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke import akt4_koepfe as koepfe
from pipeline.abenteuer.ton.stuecke.akt4_themen import (
    AMBROSE_REIN,
    HELD_DREI,
    MAMA,
    OBEN,
    TONART,
    VICTOR_DUR,
    nur,
)

AKT = 4

# Crossroads: Rosies Gitarre spielt Silicon Bay, der Rest im Instrument seines Orts.
_CROSSROADS = (
    koepfe.IRONWOOD,
    koepfe.RIVERTON,
    replace(koepfe.SILICON, instrument="gitarre"),
    koepfe.DESERT,
    koepfe.MAPLE,
)
CROSSROADS = Satz(
    "crossroads",
    "Crossroads",
    TONART,
    112,
    4,
    {"vor": Teil("I | V"), **koepfe.teile(_CROSSROADS, "dur", "c"), "tag": Teil("IV | V")},
    ("vor", *(f"c_{k.ort}" for k in _CROSSROADS), "tag"),
    (
        Stimme("gitarre", "schlagen", 0.6, -0.35, 0.2, 0, 46),
        *koepfe.stimmen(_CROSSROADS, "c", 62),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.7, 0.0, 0.15, 1, 58),
        Stimme("schlagwerk", "besen", 0.4, 0.25, 0.15, staerke=50),
    ),
    akt=AKT,
    beschreibung="Bunt, alle sind da: fünf Ortsthemen nacheinander über Gitarre, Kontrabass und Besen.",
)

STROPHEN_1 = tuple(f"s_{k.ort}" for k in koepfe.ALLE[:4])
STROPHEN_2 = tuple(f"s_{k.ort}" for k in koepfe.ALLE[4:])
LAGERFEUER = Satz(
    "lagerfeuer",
    "Lagerfeuer",
    TONART,
    96,
    4,
    {"vor": Teil("I | V"), **koepfe.teile(koepfe.ALLE, "zwei", "s"), "refrain": HELD_DREI},
    ("vor", *STROPHEN_1, "refrain", *STROPHEN_2, "refrain"),
    (
        Stimme("gitarre", "schlagen", 0.75, -0.25, 0.3, 0, 48),
        *koepfe.stimmen(koepfe.ALLE, "s", 56, 0.75, "floete"),
        Stimme("floete", "melodie", 0.7, 0.1, 0.3, OBEN, 58, nur("refrain")),
        Stimme("mundharmonika", "melodie", 0.6, 0.3, 0.3, OBEN, 58, nur("refrain")),
        Stimme("schlagwerk", "klatschen", 0.3, 0.2, 0.3, staerke=42, teile=nur("refrain")),
    ),
    akt=AKT,
    beschreibung="Warm, kindlich: die Köpfe aller Ortsthemen als Strophen, Refrain ist das Thema des Helden.",
)

# Fernpartie: sieben Fundorte, je vier Takte aus ihrem Thema, jeder leiser als der davor.
_FUNDORTE = (
    koepfe.MAPLE,
    koepfe.CEDAR,
    koepfe.RIVERTON,
    koepfe.IRONWOOD,
    koepfe.PORT,
    koepfe.DESERT,
    koepfe.SUMMIT,
)
LAUT_ERSTER_FUND = 0.9
LEISER_JE_FUND = 0.09
# Der Akkord darunter liegt halb so laut wie die Melodie des Fundorts.
BEGLEITUNG_ANTEIL = 0.5


def _fernpartie_stimmen() -> tuple[Stimme, ...]:
    """Je Fundort Melodie und ein leiser Akkord darunter, mit jedem Fund leiser."""
    ergebnis: list[Stimme] = []
    for i, kopf in enumerate(_FUNDORTE):
        laut = LAUT_ERSTER_FUND - i * LEISER_JE_FUND
        teil = nur(f"f_{kopf.ort}")
        ergebnis.append(Stimme(kopf.instrument, "melodie", laut, 0.15, 0.4, kopf.oktave, 56, teil))
        ergebnis.append(Stimme("bratschen", "halten", laut * BEGLEITUNG_ANTEIL, -0.2, 0.45, 0, 34, teil))
    return tuple(ergebnis)


FERNPARTIE = Satz(
    "fernpartie",
    "Fernpartie, Aufbau",
    TONART,
    120,
    4,
    koepfe.teile(_FUNDORTE, "eigen", "f"),
    tuple(f"f_{k.ort}" for k in _FUNDORTE),
    _fernpartie_stimmen(),
    schleife=False,
    akt=AKT,
    beschreibung="Sammlung: vier Takte aus dem Thema jedes Fundorts, immer leiser.",
)

# Abspann: jeder Ort acht Takte (sein Kopf zweimal, beim zweiten Mal mit dem Cello), zwischen den
# Akten Mama, Victor und Ambrose; am Ende der Kopf von Maple Falls, geschlossen.
_AKT_GRENZEN = {"cedar": "mama", "ironwood": "victor", "desert": "ambrose"}
ZWISCHEN = {
    "mama": Teil(f"{MAMA.akkorde} | I", f"{MAMA.melodie} | r:4"),
    "victor": VICTOR_DUR,
    "ambrose": AMBROSE_REIN,
}
ABSPANN_SCHLUSS = Teil("I | IV | V | I", "1:1 2:1 3:1 5:1 | 6:3 5:1 | 2:4 | 1:4")


def _abspann_form() -> tuple[str, ...]:
    """vor, je Ort zwei Teile, nach jedem Akt das Zwischenstück, zum Schluss Maple Falls."""
    form = ["vor"]
    for kopf in koepfe.ALLE:
        form += [f"{kopf.ort}1", f"{kopf.ort}2"]
        if kopf.ort in _AKT_GRENZEN:
            form.append(_AKT_GRENZEN[kopf.ort])
    return (*form, "schluss")


def _abspann_teile() -> dict[str, Teil]:
    """Die Teile des Abspanns: Köpfe in eigener Farbe, Zwischenstücke, Schluss."""
    erste = {f"{k.ort}1": k.eigen for k in koepfe.ALLE}
    zweite = {f"{k.ort}2": k.eigen for k in koepfe.ALLE}
    return {"vor": Teil("I | IV"), **erste, **zweite, **ZWISCHEN, "schluss": ABSPANN_SCHLUSS}


def _abspann_stimmen() -> tuple[Stimme, ...]:
    """Je Ort sein Instrument (beide Male), das Cello beim zweiten Mal; Zwischenstücke am Klavier."""
    orte = tuple(
        Stimme(k.instrument, "melodie", 0.8, 0.15, 0.35, k.oktave, 56, nur(f"{k.ort}1", f"{k.ort}2"))
        for k in koepfe.ALLE
    )
    celli = tuple(
        Stimme("cello", "melodie", 0.45, -0.15, 0.35, k.oktave - 1, 44, nur(f"{k.ort}2")) for k in koepfe.ALLE
    )
    return (
        *orte,
        *celli,
        Stimme("klavier", "melodie", 0.8, 0.1, 0.4, OBEN, 52, nur("mama", "victor")),
        Stimme("klavier_alt", "melodie", 0.85, 0.1, 0.45, OBEN, 54, nur("ambrose")),
        Stimme("gitarre", "melodie", 0.8, 0.2, 0.3, OBEN, 54, nur("schluss")),
        Stimme("gitarre", "zupfen", 0.6, -0.3, 0.3, 0, 40),
        Stimme("violinen", "halten", 0.3, 0.25, 0.45, 0, 30),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.55, 0.0, 0.2, 1, 46),
    )


ABSPANN = Satz(
    "abspann",
    "Abspann",
    TONART,
    84,
    4,
    _abspann_teile(),
    _abspann_form(),
    _abspann_stimmen(),
    schleife=False,
    akt=AKT,
    beschreibung="Rückblick: alle Ortsthemen nacheinander, dazwischen Mamas, Victors und Ambroses Thema.",
)

STUECKE = (CROSSROADS, LAGERFEUER, FERNPARTIE, ABSPANN)
