"""Alle Stücke des Spiels als Satzpläne, je Ort oder Figur eine Datei (Klangplan, Teil A je Akt).

Warum: ``musikbau`` braucht eine Liste aller Pläne; neue Dateien werden hier eingetragen.
"""

from pipeline.abenteuer.ton.satzplan import Satz
from pipeline.abenteuer.ton.stuecke import maple


def alle() -> list[Satz]:
    """Alle Satzpläne in der Reihenfolge der Dateien."""
    return [*maple.STUECKE]
