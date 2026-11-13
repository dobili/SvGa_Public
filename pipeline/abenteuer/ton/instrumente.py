"""Instrumente der Hörproben: freie Probenbibliotheken, Ordner, Namensmuster und Lizenz.

Warum: Die Proben (Aufnahmen einzelner Töne) liegen nie im öffentlichen Repository. Sie werden mit
``laden`` lokal geholt (Standardort ``buch/arbeit/ton/proben``, in ``.gitignore``). Beide
Bibliotheken stehen unter CC0 1.0 (gemeinfrei, keine Namensnennung nötig, kommerziell erlaubt):

- Versilian Community Sample Library (VCSL), Versilian Studios, https://github.com/sgossner/VCSL,
  Lizenz laut https://versilian-studios.com/vcsl/: „Creative Commons 0“.
- VSCO 2 Community Edition, Versilian Studios, https://github.com/sgossner/VSCO-2-CE,
  Datei LICENSE: „CC0 1.0 Universal“.

Die Bibliotheken benennen Oktaven verschieden. ``versatz`` gibt an, wie die Oktavzahl im Dateinamen
in eine MIDI-Nummer umzurechnen ist: MIDI = 12 · (Oktave + versatz) + Ton. Die Werte wurden am
13.11.2026 an je einer Probe durch Messen der Grundfrequenz bestimmt (zum Beispiel ist
„Upright1_Sus_C3“ 261,6 Hz, also C4 = MIDI 60, versatz 2).
"""

import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

VCSL = "vcsl"
VSCO = "vsco"
QUELLEN = {
    VCSL: "https://github.com/sgossner/VCSL",
    VSCO: "https://github.com/sgossner/VSCO-2-CE",
}
TONNAMEN = {
    "C": 0,
    "C#": 1,
    "D": 2,
    "D#": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "G": 7,
    "G#": 8,
    "A": 9,
    "A#": 10,
    "B": 11,
}
HALBTOENE_JE_OKTAVE = 12
# Anschlagstufen in Worten, von leise nach laut (Glockenspiel, Harfe).
SCHICHTEN = ("soft", "p", "mp", "medium", "mf", "f", "loud")


@dataclass(frozen=True)
class Instrument:
    """Ein Instrument aus einer Bibliothek.

    ``muster`` findet Ton und Oktave im Dateinamen (Gruppen ``ton`` und ``oktave``), ``ausklang`` ist
    die Zeit in Sekunden, in der ein Ton nach seinem Ende abgedämpft wird.
    """

    bibliothek: str
    ordner: str
    muster: str
    versatz: int
    ausklang: float
    beschreibung: str


INSTRUMENTE = {
    "klavier_alt": Instrument(
        VCSL,
        "Chordophones/Zithers/Upright Piano, Yamaha/Sustains",
        r"_Sus_(?P<ton>[A-G]#?)(?P<oktave>-?\d)_vl(?P<schicht>\d)_rr1",
        2,
        0.5,
        "Klavier (Yamaha, aufrecht), als altes Klavier",
    ),
    "klavier": Instrument(
        VCSL,
        "Chordophones/Zithers/Grand Piano, Steinway B/Sus",
        r"_Sus_Close_(?P<ton>[A-G]#?)(?P<oktave>-?\d)_vl(?P<schicht>\d)_rr1",
        1,
        0.4,
        "Flügel (Steinway B), mit Pedal aufgenommen",
    ),
    "klavier_trocken": Instrument(
        VCSL,
        "Chordophones/Zithers/Grand Piano, Steinway B/NoSus",
        r"_NoSus_Close_(?P<ton>[A-G]#?)(?P<oktave>-?\d)_vl(?P<schicht>\d)_rr1",
        1,
        0.08,
        "Flügel (Steinway B), ohne Pedal, nah",
    ),
    "cembalo": Instrument(
        VCSL,
        "Chordophones/Zithers/Harpsichord, Flemish/Sustains/Low",
        r"_Far_(?P<ton>[A-G]#?)(?P<oktave>-?\d)_rr1",
        2,
        0.25,
        "Cembalo (flämisch)",
    ),
    "glockenspiel": Instrument(
        VCSL,
        "Idiophones/Struck Idiophones/Glockenspiel",
        r"glock_(?P<schicht>soft|medium|loud)_(?P<ton>[A-G]#?)(?P<oktave>-?\d)_",
        2,
        1.5,
        "Glockenspiel",
    ),
    "harfe": Instrument(
        VCSL,
        "Chordophones/Composite Chordophones/Concert Harp",
        r"KSHarp_(?P<ton>[A-G]#?)(?P<oktave>-?\d)_(?P<schicht>mp|mf|f)\d",
        1,
        0.6,
        "Konzertharfe (hier statt Gitarre)",
    ),
    "digitalpiano": Instrument(
        VCSL,
        "Electrophones/TX81Z/FM Piano",
        r"FMPiano_(?P<ton>[A-G]#?)(?P<oktave>-?\d)_vl(?P<schicht>\d)",
        1,
        0.03,
        "FM-Piano (Yamaha TX81Z), als trockenes Digitalpiano",
    ),
    "cello": Instrument(
        VSCO,
        "Strings/Cello Section/susvib",
        r"susvib_(?P<ton>[A-G]#?)(?P<oktave>-?\d)_v(?P<schicht>\d)_1",
        2,
        0.6,
        "Celli, gehalten mit Vibrato",
    ),
}


def tonhoehe_aus_namen(dateiname: str, instrument: Instrument) -> tuple[int, int] | None:
    """MIDI-Nummer und Rang der Anschlagstufe aus einem Dateinamen der Bibliothek.

    Beispiel: „Upright1_Sus_C3_vl2_rr1.wav“ im Instrument „klavier_alt“ ist (60, 2).
    Sonderfälle: Passt das Muster nicht (andere Wiederholung, Begleitdatei), ist das Ergebnis None.
    Ohne Gruppe ``schicht`` ist der Rang 0; Wörter wie „soft“ oder „mf“ zählen nach SCHICHTEN.
    """
    treffer = re.search(instrument.muster, dateiname)
    if treffer is None:
        return None
    hoehe = HALBTOENE_JE_OKTAVE * (int(treffer["oktave"]) + instrument.versatz) + TONNAMEN[treffer["ton"]]
    schicht = treffer.groupdict().get("schicht") or "0"
    rang = int(schicht) if schicht.isdigit() else SCHICHTEN.index(schicht)
    return hoehe, rang


def proben(instrument: Instrument, wurzel: Path) -> dict[int, list[Path]]:
    """Alle Proben eines Instruments nach Tonhöhe, je Ton von leise nach laut sortiert."""
    ordner = wurzel / instrument.bibliothek / instrument.ordner
    if not ordner.is_dir():
        raise FileNotFoundError(f"Proben fehlen: {ordner} (erst mit --laden holen)")
    gefunden: dict[int, list[tuple[int, Path]]] = {}
    for datei in sorted(ordner.glob("*.wav")):
        erkannt = tonhoehe_aus_namen(datei.name, instrument)
        if erkannt is not None:
            gefunden.setdefault(erkannt[0], []).append((erkannt[1], datei))
    if not gefunden:
        raise FileNotFoundError(f"Keine Probe passt zu {instrument.muster} in {ordner}")
    return {hoehe: [datei for _, datei in sorted(liste)] for hoehe, liste in gefunden.items()}


def laden(wurzel: Path) -> None:
    """Holt nur die gebrauchten Ordner beider Bibliotheken (sparsamer Git-Klon, etwa 2 GB).

    Warum: Die ganze VCSL ist viel größer; ein sparsamer Klon lädt nur die Ordner der Instrumente.
    Sonderfälle: Ist eine Bibliothek schon da, werden nur die Ordner neu gesetzt.
    """
    wurzel.mkdir(parents=True, exist_ok=True)
    for bibliothek, adresse in QUELLEN.items():
        ziel = wurzel / bibliothek
        ordner = sorted({i.ordner for i in INSTRUMENTE.values() if i.bibliothek == bibliothek})
        if not ziel.exists():
            befehl = ["git", "clone", "--depth", "1", "--filter=blob:none", "--sparse", adresse, str(ziel)]
            subprocess.run(befehl, check=True)
        subprocess.run(["git", "-C", str(ziel), "sparse-checkout", "set", *ordner], check=True)
