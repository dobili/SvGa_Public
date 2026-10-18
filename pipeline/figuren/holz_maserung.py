"""Erzeugt die drei Holz-Figurensätze der App aus freien SVG-Figurensätzen.

Wozu diese Datei da ist:
    Einen frei lizenzierten Figurensatz aus Holz gibt es nicht. Deshalb nimmt dieses Skript
    drei freie Sätze und ersetzt ihre Füllfarben durch ein SVG-Muster (``<pattern>``) aus
    gewellten Linien, das wie Holzmaserung aussieht. Die Formen bleiben unverändert.
    Konturen werden dunkelbraun, helle Innenlinien der dunklen Figuren hellbraun.

Rolle im Gesamtbild:
    Ein einmaliger Schritt der Pipeline, wie ``erzeuge_figuren.py``. Er muss nur erneut laufen,
    wenn sich die Farben oder die Maserung ändern sollen. Auswahl der Sätze durch den Autor am
    18.10.2026 (Einstellungen → Figurensatz, Kategorien Klassisch, Modern, Holz).

Die drei Holzsätze:
    holz-kiefer-kirsche   aus RhosGFX (CC0)          Kiefer und Kirsche, weiche Schattierung
    holz-eiche-mahagoni   aus Fantasy (MIT)          Eiche und Mahagoni, mit Rundung durch Licht
    holz-esche-ebenholz   aus Livius (CC0)           Esche und Ebenholz, kräftige Maserung

Lizenz:
    Jede Bearbeitung steht unter der Lizenz ihres Originals (``saetze/LIZENZEN.md``).

Aufruf:
    python -m pipeline.figuren.holz_maserung
"""

from __future__ import annotations

import math
import random
import re
from dataclasses import dataclass, field
from pathlib import Path

HIER = Path(__file__).parent
SAETZE = HIER / "saetze"
QUELLE = SAETZE / "quelle"

FARBEN = ("w", "b")
FIGUREN = ("K", "Q", "R", "B", "N", "P")
# Anzahl der Stützpunkte je Maserungslinie: genug für eine glatte Welle, wenig für kleine Dateien.
STUETZPUNKTE = 40


@dataclass(frozen=True)
class Holz:
    """Farben eines Holzes: Grundton, dunkle Maserung, helle Maserung."""

    grund: str
    maserung: str
    hell: str


@dataclass(frozen=True)
class Maserung:
    """Wie kräftig die Maserung ausfällt (Maße als Anteil der Bildgröße)."""

    linien: int = 11
    breite_min: float = 0.006
    breite_max: float = 0.02
    deckkraft_min: float = 0.35
    deckkraft_max: float = 0.8
    ringe: int = 0
    rundung: bool = False


@dataclass(frozen=True)
class Holzsatz:
    """Bauplan eines Holzsatzes: Quelle, Hölzer und die Farbersetzungen je Seite.

    ``farben_weiss`` und ``farben_schwarz`` ordnen alten Farben neue zu; ``url(#gL)`` und
    ``url(#gD)`` sind die Maserungsmuster für helles und dunkles Holz. ``alle_verlaeufe``
    ersetzt jede Verlaufsfüllung (``url(#…)``) des Originals durch die Maserung.
    """

    quelle: str
    saat: int
    hell: Holz
    dunkel: Holz
    maserung: Maserung
    farben_weiss: dict[str, str]
    farben_schwarz: dict[str, str]
    alle_verlaeufe: bool = False
    ersetzungen: dict[str, str] = field(default_factory=dict)


KRAEFTIG = Maserung(
    linien=16, breite_min=0.01, breite_max=0.03, deckkraft_min=0.55, deckkraft_max=0.95, ringe=3
)
MITTEL = Maserung(
    linien=14, breite_min=0.008, breite_max=0.025, deckkraft_min=0.5, deckkraft_max=0.9, ringe=2, rundung=True
)

HOLZSAETZE: dict[str, Holzsatz] = {
    "holz-kiefer-kirsche": Holzsatz(
        quelle="rhosgfx",
        saat=11,
        hell=Holz("#f1cd97", "#d5a564", "#fbe6c4"),
        dunkel=Holz("#8a4a2b", "#5f2c17", "#a8653f"),
        maserung=Maserung(),
        farben_weiss={
            "#fff2d4": "#fbe9c8",
            "#ffdfb5": "url(#gL)",
            "#f4c38e": "#e2b277",
            "#eba969": "#c9965a",
            "#1a1a1a": "#2a1a0f",
        },
        farben_schwarz={
            "#d1774b": "#b07049",
            "#bb5938": "url(#gD)",
            "#9c3d29": "#5a2a17",
            "#1a1a1a": "#22140b",
        },
    ),
    "holz-eiche-mahagoni": Holzsatz(
        quelle="fantasy",
        saat=51,
        hell=Holz("#ecd3a5", "#b98a52", "#f8e8c8"),
        dunkel=Holz("#6b2f1f", "#3a140b", "#9a5034"),
        maserung=MITTEL,
        farben_weiss={"#fff": "#f3e0bb"},
        farben_schwarz={"#7f899b": "#8a4a33"},
        alle_verlaeufe=True,
        ersetzungen={"stroke:#000": "stroke:#24140a"},
    ),
    "holz-esche-ebenholz": Holzsatz(
        quelle="livius",
        saat=71,
        hell=Holz("#f6e6c4", "#b8854b", "#fff4de"),
        dunkel=Holz("#2b1b12", "#0b0603", "#5e4130"),
        maserung=KRAEFTIG,
        farben_weiss={"#ffffff": "url(#gL)", "#000000": "#2b190c"},
        farben_schwarz={"#000000": "url(#gD)", "#ffffff": "#ecd2a6"},
    ),
}


def wellenlinie(x0: float, groesse: float, amplitude: float, phasen: tuple[float, float], wellen: int) -> str:
    """Punkte einer senkrechten, leicht gewellten Linie über die ganze Bildhöhe.

    Die Welle wiederholt sich genau über die Bildhöhe, damit das Muster nahtlos kachelt.
    """
    punkte = []
    for schritt in range(STUETZPUNKTE + 1):
        y = groesse * schritt / STUETZPUNKTE
        winkel = 2 * math.pi * y / groesse
        welle = math.sin(wellen * winkel + phasen[0]) + 0.4 * math.sin(3 * winkel + phasen[1])
        x = x0 + amplitude * welle
        punkte.append(f"{x:.3f},{y:.3f}")
    return " ".join(punkte)


def maserungsmuster(kennung: str, groesse: float, holz: Holz, art: Maserung, saat: int) -> str:
    """Baut das SVG-Muster mit Grundton, Maserungslinien, Jahresringen und optionaler Rundung.

    Eingaben: Kennung des Musters (``gL`` oder ``gD``), Bildgröße in Benutzereinheiten der Figur,
    Holzfarben, Stärke der Maserung und ein Startwert, damit jeder Lauf dasselbe Bild liefert.
    """
    zufall = random.Random(saat)
    wellen = zufall.choice([1, 2])
    teile = [f'<rect width="{groesse}" height="{groesse}" fill="{holz.grund}"/>']
    for nummer in range(art.linien):
        x0 = groesse * (nummer + zufall.random() * 0.6) / art.linien
        amplitude = groesse * zufall.uniform(0.008, 0.03)
        phasen = (zufall.uniform(0, 2 * math.pi), zufall.uniform(0, 2 * math.pi))
        breite = groesse * zufall.uniform(art.breite_min, art.breite_max)
        deckkraft = zufall.uniform(art.deckkraft_min, art.deckkraft_max)
        farbe = holz.maserung if zufall.random() < 0.8 else holz.hell
        punkte = wellenlinie(x0, groesse, amplitude, phasen, wellen)
        teile.append(
            f'<polyline points="{punkte}" fill="none" stroke="{farbe}" '
            f'stroke-width="{breite:.3f}" stroke-opacity="{deckkraft:.2f}"/>'
        )
    for _ in range(art.ringe):
        x0 = groesse * zufall.random()
        punkte = wellenlinie(x0, groesse, groesse * zufall.uniform(0.02, 0.05), (0, 0), wellen)
        breite = groesse * zufall.uniform(0.04, 0.08)
        teile.insert(
            1,
            f'<polyline points="{punkte}" fill="none" stroke="{holz.maserung}" '
            f'stroke-width="{breite:.3f}" stroke-opacity="0.35"/>',
        )
    verlauf = ""
    if art.rundung:
        # Links Licht, rechts Schatten: die Figur wirkt gedrechselt.
        verlauf = (
            f'<linearGradient id="{kennung}s" x1="0" x2="1" y1="0" y2="0">'
            '<stop offset="0" stop-color="#fff" stop-opacity="0.28"/>'
            '<stop offset="0.45" stop-color="#fff" stop-opacity="0"/>'
            '<stop offset="1" stop-color="#000" stop-opacity="0.22"/></linearGradient>'
        )
        teile.append(f'<rect width="{groesse}" height="{groesse}" fill="url(#{kennung}s)"/>')
    muster = f'<pattern id="{kennung}" patternUnits="userSpaceOnUse" width="{groesse}" height="{groesse}">'
    return verlauf + muster + "".join(teile) + "</pattern>"


def bildgroesse(svg: str) -> float:
    """Breite des Bildes aus ``viewBox`` oder, falls keine da ist, aus ``width``."""
    treffer = re.search(r'viewBox="0 0 ([\d.]+) [\d.]+"', svg)
    if treffer:
        return float(treffer.group(1))
    breite = re.search(r'width="([\d.]+)', svg)
    if breite is None:
        raise ValueError("SVG ohne viewBox und ohne width")
    return float(breite.group(1))


def farben_ersetzen(svg: str, zuordnung: dict[str, str]) -> str:
    """Ersetzt Füll- und Linienfarben, als Attribut (``fill="#fff"``) wie als Stil (``fill:#fff``)."""

    def ersetze(treffer: re.Match[str]) -> str:
        farbe = treffer.group(3).lower()
        if farbe not in zuordnung:
            return treffer.group(0)
        return f"{treffer.group(1)}{treffer.group(2)}{zuordnung[farbe]}"

    return re.sub(r"(fill|stroke)(=\"|:)(#[0-9a-fA-F]{3,6})\b", ersetze, svg)


def holzfigur(svg: str, satz: Holzsatz, farbe: str) -> str:
    """Macht aus einer Figur des Originals die Holzfigur (``farbe`` ist ``w`` oder ``b``)."""
    weiss = farbe == "w"
    kennung = "gL" if weiss else "gD"
    holz = satz.hell if weiss else satz.dunkel
    saat = satz.saat + (0 if weiss else 1)
    muster = maserungsmuster(kennung, bildgroesse(svg), holz, satz.maserung, saat)
    svg = farben_ersetzen(svg, satz.farben_weiss if weiss else satz.farben_schwarz)
    for alt, neu in satz.ersetzungen.items():
        svg = svg.replace(alt, neu)
    if satz.alle_verlaeufe:
        svg = re.sub(r"fill(=\"|:)url\(#[^)]+\)", lambda t: f"fill{t.group(1)}url(#{kennung})", svg)
    return re.sub(r"(<svg[^>]*>)", r"\1<defs>" + muster.replace("\\", "\\\\") + "</defs>", svg, count=1)


def erzeuge(name: str, satz: Holzsatz, ziel: Path = SAETZE) -> None:
    """Schreibt die 12 Figuren eines Holzsatzes nach ``ziel/name``."""
    ordner = ziel / name
    ordner.mkdir(parents=True, exist_ok=True)
    for farbe in FARBEN:
        for figur in FIGUREN:
            original = (QUELLE / satz.quelle / f"{farbe}{figur}.svg").read_text(encoding="utf-8")
            (ordner / f"{farbe}{figur}.svg").write_text(holzfigur(original, satz, farbe), encoding="utf-8")


def main() -> None:
    """Erzeugt alle drei Holzsätze neu."""
    for name, satz in HOLZSAETZE.items():
        erzeuge(name, satz)
        print(f"{name}: 12 Figuren geschrieben")


if __name__ == "__main__":
    main()
