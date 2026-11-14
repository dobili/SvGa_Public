"""Sammlung der Stücke von Akt 3 (Klangplan, Akt 3, Teil A, und Gesamtübersicht Ü1).

Warum: Die Stücke eines Akts stehen in eigenen Dateien je Ort oder Figur (``akt3_*.py``);
diese Datei trägt sie zusammen, damit ``stuecke.alle`` sie findet. Alle haben ``akt=3`` und
landen im Nachladepaket des Akts (``musik/akt3``).
"""

from pipeline.abenteuer.ton.satzplan import Satz

STUECKE: tuple[Satz, ...] = ()
