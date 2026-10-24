"""Prüfpunkte mit Ampel und ihre Ausgabe als JSON und Markdown (R57).

Ampeln:
    rot    Kaputt, der Autor muss handeln (Lauf scheitert, GitHub schickt eine Mail).
    gelb   Auffällig, bei Gelegenheit ansehen (etwa ein Link, der 403 liefert).
    gruen  In Ordnung.
    info   Nur zur Kenntnis (etwa die Zahl offener Testpunkte).

Die Felder entsprechen dem Vertrag mit dem Worker (app/worker/bericht.ts, ``Pruefpunkt``).
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from enum import StrEnum


class Ampel(StrEnum):
    ROT = "rot"
    GELB = "gelb"
    GRUEN = "gruen"
    INFO = "info"


REIHENFOLGE = {Ampel.ROT: 0, Ampel.GELB: 1, Ampel.INFO: 2, Ampel.GRUEN: 3}
SYMBOL = {Ampel.ROT: "🔴", Ampel.GELB: "🟡", Ampel.GRUEN: "🟢", Ampel.INFO: "🔵"}

#: Höchstlänge des Texts eines Punkts (Grenze des Workers).
TEXT_ZEICHEN = 4000


@dataclass(frozen=True)
class Pruefpunkt:
    """Ein Punkt des Berichts, etwa ``Pruefpunkt("links-buch", "Links", "Buchdaten", Ampel.GRUEN, "")``."""

    id: str
    gruppe: str
    titel: str
    ampel: Ampel
    text: str

    def als_json(self) -> dict[str, str]:
        daten = asdict(self)
        daten["ampel"] = self.ampel.value
        daten["text"] = self.text[:TEXT_ZEICHEN]
        return daten


def schlimmste(ampeln: list[Ampel]) -> Ampel:
    """Die schlimmste Ampel einer Liste (rot vor gelb vor grün); leer → grün.

    Info zählt nicht: Eine Liste aus Info und Grün ist grün.
    """
    for ampel in (Ampel.ROT, Ampel.GELB):
        if ampel in ampeln:
            return ampel
    return Ampel.GRUEN


def markdown(punkte: list[Pruefpunkt], zeit: str) -> str:
    """Zusammenfassung für die Seite des Actions-Laufs (GITHUB_STEP_SUMMARY)."""
    zeilen = [f"## Wartung ({zeit})", "", "| | Prüfung | Ergebnis |", "|---|---|---|"]
    for p in sorted(punkte, key=lambda p: REIHENFOLGE[p.ampel]):
        text = p.text.replace("\n", "<br>").replace("|", "\\|") or "in Ordnung"
        zeilen.append(f"| {SYMBOL[p.ampel]} | {p.gruppe}: {p.titel} | {text} |")
    return "\n".join(zeilen) + "\n"
