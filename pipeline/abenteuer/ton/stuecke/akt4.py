"""Sammlung der Stücke von Akt 4 (Klangplan, Akt 4, Teil A, und Gesamtübersicht Ü1).

Warum: Die Stücke eines Akts stehen in eigenen Dateien je Ort oder Figur (``akt4_*.py``);
diese Datei trägt sie zusammen, damit ``stuecke.alle`` sie findet. Alle haben ``akt=4`` und
landen im Nachladepaket des Akts (``musik/akt4``). Gemeinsamer Stoff (Ambrose rein, Held, Victor
in Dur, die eine Melodie) steht in ``akt4_themen.py``, die Köpfe aller Ortsthemen in
``akt4_koepfe.py``.
"""

from pipeline.abenteuer.ton.satzplan import Satz
from pipeline.abenteuer.ton.stuecke import (
    akt4_ambrose,
    akt4_finale,
    akt4_motive,
    akt4_summit,
    akt4_treffen,
    akt4_victor,
    akt4_wege,
)

STUECKE: tuple[Satz, ...] = (
    *akt4_wege.STUECKE,
    *akt4_summit.STUECKE,
    *akt4_treffen.STUECKE,
    *akt4_ambrose.STUECKE,
    *akt4_victor.STUECKE,
    *akt4_finale.STUECKE,
    *akt4_motive.STUECKE,
)
