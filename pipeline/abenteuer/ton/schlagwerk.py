"""Schlagwerk ohne Tonhöhe: Besen, Schellen, Klatschen, Holzblock, Trommeln, Becken (VCSL, CC0).

Warum: Viele Ortsthemen brauchen einen leisen Puls (Klangplan A2: „Besen auf kleiner Trommel“,
„Klatschen auf 2 und 4“). Eine Schlagwerkspur benutzt die Notennummern von General MIDI als
Schlüssel; jede Nummer zeigt auf einen Ordner und ein Namensmuster. Mehrere Dateien zu einem
Schlag (Wiederholungen „rr1“, „rr2“ …) werden reihum gespielt, damit es nicht maschinell klingt.
Ein Besen gibt es in den freien Bibliotheken nicht: Das Wischen ersetzt ein Schellenei, den
Schlag eine leise Seiltrommel.
"""

import re
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.ton.instrumente import VCSL

SCHLAGWERK = "schlagwerk"
STRUCK = "Idiophones/Struck Idiophones"
MEMBRAN = "Membranophones/Struck Membranophones"


@dataclass(frozen=True)
class Schlag:
    """Ein Schlaginstrument: Ordner in der Bibliothek, Namensmuster, Ausklang in Sekunden."""

    ordner: str
    muster: str
    ausklang: float
    beschreibung: str


# Schlüssel: Notennummern wie in General MIDI, damit die MIDI-Dateien auch anderswo passen.
GROSSE_TROMMEL = 36
SEITLICH = 37
KLEINE_TROMMEL = 38
KLATSCHEN = 39
HIHAT = 42
HIHAT_OFFEN = 46
BECKEN = 49
TAMBURIN = 54
SCHELLENEI = 70
HOLZBLOCK = 76
TRIANGEL = 81

SCHLAEGE = {
    GROSSE_TROMMEL: Schlag(f"{MEMBRAN}/Bass Drum 1", r"BDrumNew_hit_v\d_rr\d", 0.6, "große Trommel"),
    SEITLICH: Schlag(f"{STRUCK}/Cajon", r"Cajon_hit1_f_rr\d", 0.3, "Cajón (statt Randschlag)"),
    KLEINE_TROMMEL: Schlag(
        f"{MEMBRAN}/Snare Drum, Rope Tension/Hi",
        r"RopeSnare_hi_sn_Main_vl\d_rr\d",
        0.4,
        "Seiltrommel, leise (statt Besen)",
    ),
    KLATSCHEN: Schlag(f"{STRUCK}/Claps", r"Clap_rr\d", 0.3, "Händeklatschen"),
    HIHAT: Schlag(f"{STRUCK}/Hi-Hat Cymbal", r"HiHat_Close_rr\d_Mid", 0.2, "Hi-Hat, geschlossen"),
    HIHAT_OFFEN: Schlag(f"{STRUCK}/Hi-Hat Cymbal", r"HiHat_HitO_rr\d_Mid", 0.8, "Hi-Hat, offen"),
    BECKEN: Schlag(f"{STRUCK}/Suspended Cymbal 1", r"susCymb1_.*", 2.5, "hängendes Becken"),
    TAMBURIN: Schlag(f"{STRUCK}/Tambourine 1", r"Tamb1_Hit_v\d_rr\d_Mid", 0.4, "Tamburin"),
    SCHELLENEI: Schlag(f"{STRUCK}/Shaker, Small", r"Mid_ShakerDouble_(Down|Up)_rr\d", 0.3, "Schellenei"),
    HOLZBLOCK: Schlag(f"{STRUCK}/Woodblock", r"wood_click\d_.*", 0.3, "Holzblock"),
    TRIANGEL: Schlag(f"{STRUCK}/Triangles", r"Triangle1_HitM_v\d_rr\d_Mid", 1.5, "Triangel"),
}
BIBLIOTHEK = VCSL


def ordner() -> list[str]:
    """Alle Ordner des Schlagwerks (für den sparsamen Klon in ``instrumente.laden``)."""
    return sorted({schlag.ordner for schlag in SCHLAEGE.values()})


def dateien(nummer: int, wurzel: Path) -> list[Path]:
    """Alle Aufnahmen eines Schlags, sortiert. Sonderfall: unbekannte Nummer wirft KeyError."""
    schlag = SCHLAEGE[nummer]
    verzeichnis = wurzel / BIBLIOTHEK / schlag.ordner
    gefunden = sorted(d for d in verzeichnis.glob("*.wav") if re.match(schlag.muster, d.stem))
    if not gefunden:
        raise FileNotFoundError(f"Keine Aufnahme für Schlag {nummer} in {verzeichnis}")
    return gefunden
