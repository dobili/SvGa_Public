"""Alle Stücke des Spiels als Satzpläne, je Ort oder Figur eine Datei (Klangplan, Teil A je Akt).

Warum: ``musikbau`` braucht eine Liste aller Pläne; neue Dateien werden hier eingetragen.
"""

from pipeline.abenteuer.ton.satzplan import Satz
from pipeline.abenteuer.ton.stuecke import akt1, akt2, akt3, akt4, ambrose1, cedar, kurz, maple


def alle() -> list[Satz]:
    """Alle Satzpläne in der Reihenfolge der Dateien."""
    return [
        *maple.STUECKE,
        *cedar.STUECKE,
        *ambrose1.STUECKE,
        *akt1.STUECKE,
        *kurz.STUECKE,
        *akt2.STUECKE,
        *akt3.STUECKE,
        *akt4.STUECKE,
    ]
