"""Ein Feld eines Möbels im Katalog setzen oder löschen, ohne die übrige Formatierung anzufassen.

Warum: Die Möbeldateien (``inhalte/abenteuer/moebel/<ort>.json``) sind teils mit Prettier, teils mit
``json.dumps`` formatiert. Ein Werkzeug, das nur ein Feld ergänzt (``feinmasken.py``), soll im Diff
nur dieses Feld zeigen. Deshalb ändert diese Hilfe den Text: Jedes Möbel steht als Block
``    "<name>": {`` … ``    }`` mit einem Feld je Zeile (Einrückung 6).
Ausgabe wie Prettier (Breite 100): eine Liste in einer Zeile, wenn sie passt, sonst ein Wert je Zeile.
"""

import json

BREITE = 100
MOEBEL, FELD, WERT = " " * 4, " " * 6, " " * 8


def _block(zeilen: list[str], name: str) -> tuple[int, int] | None:
    """(Zeile der Kopfzeile, Zeile der schließenden Klammer) eines Möbels oder None."""
    kopf = f'{MOEBEL}"{name}": {{'
    for i, zeile in enumerate(zeilen):
        if zeile.rstrip() == kopf:
            for j in range(i + 1, len(zeilen)):
                if zeilen[j].startswith(MOEBEL + "}"):
                    return i, j
    return None


def _feldzeilen(zeilen: list[str], von: int, bis: int, feld: str) -> tuple[int, int] | None:
    """Erste und letzte Zeile (ausschließlich) eines Felds im Block oder None."""
    for i in range(von + 1, bis):
        if zeilen[i].startswith(f'{FELD}"{feld}":'):
            ende = i + 1
            if zeilen[i].rstrip().endswith(("[", "{")):
                while ende < bis and not zeilen[ende].startswith(
                    FELD + ("]", "}")[zeilen[i].rstrip()[-1] == "{"]
                ):
                    ende += 1
                ende += 1
            return i, ende
    return None


def _formatiert(feld: str, wert: object) -> list[str]:
    """Das Feld als Zeilen. Beispiel: („maske_fein“, ["..", "##"]) → ['      "maske_fein": ["..", "##"]']."""
    einzeilig = f'{FELD}"{feld}": {json.dumps(wert, ensure_ascii=False)}'
    if len(einzeilig) <= BREITE or not isinstance(wert, list):
        return [einzeilig]
    teile = [f"{WERT}{json.dumps(w, ensure_ascii=False)}," for w in wert]
    teile[-1] = teile[-1][:-1]
    return [f'{FELD}"{feld}": [', *teile, f"{FELD}]"]


def _komma(zeile: str, mit: bool) -> str:
    """Die Zeile mit oder ohne Komma am Ende."""
    ohne = zeile.rstrip().removesuffix(",")
    return ohne + "," if mit else ohne


def setze(text: str, name: str, feld: str, wert: object | None) -> str:
    """Setzt (``wert`` nicht None) oder löscht ein Feld eines Möbels; letztes Feld ohne Komma.

    Beispiel: ``setze(text, "laterne", "maske_fein", ["....", ".##."])`` hängt das Feld an.
    Sonderfall: Ein unbekanntes Möbel lässt den Text, wie er ist.
    """
    zeilen = text.split("\n")
    block = _block(zeilen, name)
    if block is None:
        return text
    von, bis = block
    if (alt := _feldzeilen(zeilen, von, bis, feld)) is not None:
        del zeilen[alt[0] : alt[1]]
        bis -= alt[1] - alt[0]
    if wert is not None:
        zeilen[bis:bis] = _formatiert(feld, wert)
        bis += len(_formatiert(feld, wert))
    # Kommas: jedes Feld außer dem letzten endet mit Komma (nur Zeilen der Einrückung 6 oder Enden).
    letzte = bis - 1
    zeilen[letzte] = _komma(zeilen[letzte], False)
    vorige = [
        i for i in range(von + 1, letzte) if zeilen[i].startswith(FELD) and not zeilen[i].startswith(WERT)
    ]
    for i in vorige:
        naechste = i + 1
        if naechste < letzte and zeilen[naechste].startswith(WERT):
            continue  # Kopf einer mehrzeiligen Liste
        if naechste <= letzte and zeilen[naechste].startswith(FELD):
            zeilen[i] = _komma(zeilen[i], True)
    return "\n".join(zeilen)
