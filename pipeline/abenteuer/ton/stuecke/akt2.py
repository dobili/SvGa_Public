"""Sammlung der Stücke von Akt 2 (Klangplan, Akt 2, Teil A, und Gesamtübersicht Ü1).

Warum: Die Stücke eines Akts stehen in eigenen Dateien je Ort oder Figur (``akt2_*.py``);
diese Datei trägt sie zusammen, damit ``stuecke.alle`` sie findet. Alle haben ``akt=2`` und
landen im Nachladepaket des Akts (``musik/akt2``).
"""

from pipeline.abenteuer.ton.satzplan import Satz

STUECKE: tuple[Satz, ...] = ()
