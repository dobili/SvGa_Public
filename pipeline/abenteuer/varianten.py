"""Prüfung, ob sich die Varianten B und C einer Karte genug von A unterscheiden (KARTENREGELN 10.37).

Warum: Der Autor wählt aus drei Varianten und soll „auf den ersten Blick“ drei Räume oder Orte
sehen (Wunsch des Autors, 9.11.2026). In der Nacht 9./10.11.2026 kamen Varianten, die A fast
gleichen: Dreiviertel der Möbel standen auf denselben Feldern (Ironwood außen, Campus Silicon Bay),
oder dieselben Möbel waren nur gespiegelt (Bahnhofshalle Riverton). Die Bildprüfung von Hand
merkt das spät; diese Prüfung meldet es beim Bauen.

Maße:
- Anteil gleicher Stellen: Möbel mit gleichem Namen auf gleichem Feld, bezogen auf alle Möbel
  beider Varianten (Jaccard). Ab ``GLEICHE_STELLEN`` ist die Variante zu ähnlich.
- Anteil gleicher Möbel: dieselben Möbelnamen, gleich wo (Jaccard über die Mehrfachmenge). Ab
  ``GLEICHE_MOEBEL`` und bei gleichem Boden und gleicher Wand ist sie nur umgestellt.
Sonderfall: Nach der Wahl des Autors liegt die frühere A als ``<datei>-a.json`` bei den Varianten;
dann ist die Wahl getroffen und die übrigen Varianten werden nicht mehr verglichen.
"""

from collections import Counter
from pathlib import Path

GLEICHE_STELLEN = 0.5
GLEICHE_MOEBEL = 0.9


def _stellen(szene: dict) -> set[tuple[str, tuple[int, ...]]]:
    return {(o.get("moebel", ""), tuple(o.get("feld", ()))) for o in szene.get("objekte", [])}


def _moebel(szene: dict) -> Counter:
    return Counter(o.get("moebel", "") for o in szene.get("objekte", []))


def aehnlichkeit(a: dict, b: dict) -> tuple[float, float]:
    """Anteil gleicher Stellen und Anteil gleicher Möbel zweier Szenen, je zwischen 0 und 1.

    Beispiel: A und B mit denselben zehn Möbeln, vier davon auf anderen Feldern ergibt
    (6/14, 1.0): Stellen 6 gleich von 14 verschiedenen, Möbel alle gleich.
    """
    sa, sb = _stellen(a), _stellen(b)
    ma, mb = _moebel(a), _moebel(b)
    stellen = len(sa & sb) / max(len(sa | sb), 1)
    moebel = sum((ma & mb).values()) / max(sum((ma | mb).values()), 1)
    return stellen, moebel


def pruefe_varianten(b: dict, a: dict) -> list[str]:
    """Befunde, wenn Variante ``b`` der Variante ``a`` zu sehr gleicht (Regel 10.37)."""
    stellen, moebel = aehnlichkeit(a, b)
    befunde = []
    if stellen >= GLEICHE_STELLEN:
        befunde.append(
            f"Variante zu ähnlich: {stellen:.0%} der Möbel stehen wie in A auf denselben Feldern "
            "(Regel 10.37, andere Anordnung, andere Gebäude oder Böden)"
        )
    gleiche_flaechen = a.get("boden") == b.get("boden") and a.get("wandart") == b.get("wandart")
    if moebel >= GLEICHE_MOEBEL and gleiche_flaechen:
        befunde.append(
            f"Variante nur umgestellt: {moebel:.0%} gleiche Möbel, gleicher Boden und gleiche Wand "
            "wie A (Regel 10.37, andere Möbel oder Böden wählen)"
        )
    return befunde


def vergleiche_mit_a(pfad: Path, szene: dict, lade) -> list[str]:
    """Für eine Szene mit ``variante`` b oder c: Vergleich mit A aus dem übergeordneten Ordner.

    Eingaben: Pfad der Variante (``szenen/varianten/<datei>-b.json``), ihre Szene und die
    Ladefunktion des Kartenbauers. Ausgabe: Befunde, leer, wenn A fehlt oder schon gewählt wurde.
    """
    if szene.get("variante") not in ("b", "c"):
        return []
    stamm = pfad.stem[: -len("-b")]
    a_pfad = pfad.parent.parent / f"{stamm}.json"
    if not a_pfad.exists() or (pfad.parent / f"{stamm}-a.json").exists():
        return []
    return pruefe_varianten(szene, lade(a_pfad))
