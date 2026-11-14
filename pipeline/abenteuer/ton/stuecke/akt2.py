"""Sammlung der Stücke von Akt 2 (Klangplan, Akt 2, Teil A, und Gesamtübersicht Ü1).

Warum: Die Stücke eines Akts stehen in eigenen Dateien je Ort oder Figur (``akt2_*.py``);
diese Datei trägt sie zusammen, damit ``stuecke.alle`` sie findet. Alle haben ``akt=2`` und
landen im Nachladepaket des Akts (``musik/akt2``).
"""

from pipeline.abenteuer.ton.satzplan import Satz
from pipeline.abenteuer.ton.stuecke import akt2_ambrose, akt2_ironwood, akt2_motive, akt2_riverton, akt2_wege

STUECKE: tuple[Satz, ...] = (
    *akt2_riverton.STUECKE,
    *akt2_ironwood.STUECKE,
    *akt2_wege.STUECKE,
    *akt2_ambrose.STUECKE,
    *akt2_motive.STUECKE,
)
