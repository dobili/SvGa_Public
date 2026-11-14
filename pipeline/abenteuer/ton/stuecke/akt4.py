"""Sammlung der Stücke von Akt 4 (Klangplan, Akt 4, Teil A, und Gesamtübersicht Ü1).

Warum: Die Stücke eines Akts stehen in eigenen Dateien je Ort oder Figur (``akt4_*.py``);
diese Datei trägt sie zusammen, damit ``stuecke.alle`` sie findet. Alle haben ``akt=4`` und
landen im Nachladepaket des Akts (``musik/akt4``).
"""

from pipeline.abenteuer.ton.satzplan import Satz

STUECKE: tuple[Satz, ...] = ()
