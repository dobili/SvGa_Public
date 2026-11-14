"""Instrumente aus Klangfonts (SF2) von FreePats, gespielt mit FluidSynth.

Warum: Die beiden CC0-Bibliotheken der Hörproben haben keine Gitarre, keinen E-Bass und kein altes
Kneipenklavier. Die Ortsthemen brauchen sie (Maple Falls: Gitarre im Fingerpicking; Diner: E-Gitarre
aus der Jukebox; Riverton: Jazz). FreePats stellt diese Instrumente unter CC0 1.0 bereit
(https://freepats.zenvoid.org, Lizenzangabe je Instrumentseite, abgerufen am 14.11.2026). FluidSynth
spielt SF2 mit Hüllkurven und Schleifen der Aufnahme besser als unser einfacher Sampler.

Die Klangfonts liegen nur lokal unter ``buch/arbeit/ton/freepats`` (in ``.gitignore``). ``laden``
holt sie; dafür braucht es curl und 7z, zum Spielen das Programm ``fluidsynth``.
"""

import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

FREEPATS = "https://freepats.zenvoid.org"
GITHUB = "https://github.com/freepats"
ORDNER = Path("buch/arbeit/ton/freepats")
ABTASTRATE = 44_100
# Verstärkung in FluidSynth; die Mischung gleicht danach ohnehin an.
VERSTAERKUNG = "0.6"


@dataclass(frozen=True)
class Klangfont:
    """Ein Instrument als SF2: Adresse des Archivs, Dateiname darin, Beschreibung."""

    adresse: str
    datei: str
    beschreibung: str


KLANGFONTS = {
    "gitarre": Klangfont(
        f"{FREEPATS}/Guitar/SpanishClassicalGuitar/SpanishClassicalGuitar-SF2-20190618.7z",
        "SpanishClassicalGuitar-20190618.sf2",
        "Konzertgitarre (Nylonsaiten)",
    ),
    "egitarre": Klangfont(
        f"{GITHUB}/electric-guitar-FSBS-clean/releases/download/2026-08-07/EGuitarFSBS-clean-SF2-20260807.7z",
        "EGuitarFSBS-clean bridge 20260807.sf2",
        "E-Gitarre, unverzerrt",
    ),
    "ebass": Klangfont(
        f"{GITHUB}/electric-bass-YR/releases/download/2019-09-30/PickedBassYR-SF2-20190930.7z",
        "PickedBassYR 20190930.sf2",
        "E-Bass, mit Plektrum",
    ),
    "ukulele": Klangfont(
        f"{GITHUB}/ukulele1/releases/download/2026-08-11/Ukulele-SF2-20260811.7z",
        "Ukulele 20260811.sf2",
        "Ukulele",
    ),
    "kneipenklavier": Klangfont(
        f"{GITHUB}/old-piano-FB/releases/download/2020-04-01/PianoFB-SF2-20200401.7z",
        "PianoFB 20200401.sf2",
        "altes Klavier, leicht verstimmt (Honky-Tonk)",
    ),
    "hammond": Klangfont(
        f"{FREEPATS}/Organ/DrawbarOrganEmulation/DrawbarOrganEmulation-SF2-20190712.tar.xz",
        "DrawbarOrganEmulation-20190712.sf2",
        "Zugriegelorgel (wie Hammond)",
    ),
}


def pfad(kennung: str, wurzel: Path = ORDNER) -> Path:
    """Die SF2-Datei eines Instruments (gesucht im Ordner und seinen Unterordnern)."""
    name = KLANGFONTS[kennung].datei
    treffer = sorted(wurzel.rglob(name))
    if not treffer:
        raise FileNotFoundError(f"Klangfont fehlt: {name} in {wurzel} (erst mit laden holen)")
    return treffer[0]


def laden(wurzel: Path = ORDNER) -> None:
    """Holt und entpackt alle Klangfonts, die noch fehlen; das Archiv wird danach gelöscht."""
    wurzel.mkdir(parents=True, exist_ok=True)
    for font in KLANGFONTS.values():
        if any(wurzel.rglob(font.datei)):
            continue
        archiv = wurzel / font.adresse.rsplit("/", 1)[1]
        subprocess.run(["curl", "-sSLf", "-o", str(archiv), font.adresse], check=True)
        if archiv.suffix == ".7z":
            subprocess.run(["7z", "x", "-y", "-bso0", f"-o{wurzel}", str(archiv)], check=True)
        else:
            subprocess.run(["tar", "xf", str(archiv), "-C", str(wurzel)], check=True)
        archiv.unlink()


def spiele(midi: bytes, kennung: str, wurzel: Path = ORDNER) -> Path:
    """Spielt eine MIDI-Datei mit dem Klangfont in eine WAV-Datei (ohne Hall von FluidSynth).

    Eingaben: MIDI-Bytes (eine Spur, Programm 0), Kennung des Klangfonts. Ausgabe: Pfad der WAV-Datei
    in einem temporären Ordner; der Aufrufer liest und löscht sie.
    """
    ordner = Path(tempfile.mkdtemp(prefix="klangfont-"))
    eingabe, ausgabe = ordner / "spur.mid", ordner / "spur.wav"
    eingabe.write_bytes(midi)
    befehl = [
        "fluidsynth",
        "-ni",
        "-q",
        "-R",
        "0",
        "-C",
        "0",
        "-g",
        VERSTAERKUNG,
        "-r",
        str(ABTASTRATE),
        "-F",
        str(ausgabe),
        str(pfad(kennung, wurzel)),
        str(eingabe),
    ]
    subprocess.run(befehl, check=True, capture_output=True)
    eingabe.unlink()
    return ausgabe
