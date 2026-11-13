"""Rendert ein Stück aus Noten und Instrumentenproben zu Stereo-Ton (braucht numpy und scipy).

Warum: Ein einfacher Sampler genügt für die Hörproben und läuft ohne Bildschirm in der Cloud-
Umgebung: Je Note wird die nächstgelegene Probe gewählt, auf die Tonhöhe verstimmt, am Notenende
abgedämpft und mit Lage und Nachhall gemischt. numpy und scipy sind keine Pakete der Pipeline
(``pipeline/requirements.txt``); sie werden nur für dieses Werkzeug gebraucht:
``pip install numpy scipy``.
"""

from functools import lru_cache
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve

from pipeline.abenteuer.ton.instrumente import INSTRUMENTE, proben
from pipeline.abenteuer.ton.satz import Note, Spur, Stueck

ABTASTRATE = 44_100
HALBTOENE_JE_OKTAVE = 12
STAERKE_MAX = 127
# Nachhall: Länge der künstlichen Raumantwort und Zeit, in der sie um 60 dB abfällt.
HALL_LAENGE = 2.5
HALL_ABFALL = 1.8
HALL_DAEMPFUNG = 60.0
HALL_GLAETTUNG = 6
# Nachklang am Ende des Stücks und Ziel der Spitze (−2 dBFS, Reserve für die Kodierung).
NACHKLANG = 2.0
SPITZE = 10 ** (-2 / 20)
# Wie stark die Anschlagstärke die Lautstärke zusätzlich zur Probenwahl formt.
ANSCHLAG_KURVE = 1.3
ANSCHLAG_BEZUG = 100


@lru_cache(maxsize=512)
def lade_probe(pfad: Path) -> np.ndarray:
    """Liest eine WAV-Datei als Stereo-Gleitkomma im Bereich −1 bis 1 (zwischengespeichert)."""
    rate, daten = wavfile.read(pfad)
    if rate != ABTASTRATE:
        raise ValueError(f"{pfad.name}: {rate} Hz statt {ABTASTRATE} Hz")
    skala = float(np.iinfo(daten.dtype).max) if np.issubdtype(daten.dtype, np.integer) else 1.0
    ton = daten.astype(np.float32) / skala
    return np.stack([ton, ton], axis=1) if ton.ndim == 1 else ton[:, :2]


def waehle(je_ton: dict[int, list[Path]], hoehe: int, staerke: int) -> tuple[Path, int]:
    """Probe für eine Note: der nächste aufgenommene Ton, die Anschlagstufe nach der Stärke.

    Ausgabe: Pfad und Verstimmung in Halbtönen. Beispiel: Glockenspiel hat C und G je Oktave; ein D
    nimmt das C und verstimmt um +2. Sonderfälle: Bei gleichem Abstand gewinnt der tiefere Ton.
    """
    naechster = min(je_ton, key=lambda ton: (abs(ton - hoehe), ton))
    stufen = je_ton[naechster]
    index = min(len(stufen) - 1, staerke * len(stufen) // (STAERKE_MAX + 1))
    return stufen[index], hoehe - naechster


def verstimme(ton: np.ndarray, halbtoene: int) -> np.ndarray:
    """Verstimmt durch Umrechnen der Abtastung (schneller und kürzer bei höheren Tönen)."""
    if halbtoene == 0:
        return ton
    faktor = 2 ** (halbtoene / HALBTOENE_JE_OKTAVE)
    alt = np.arange(len(ton))
    neu = np.arange(0, len(ton) - 1, faktor)
    return np.stack([np.interp(neu, alt, ton[:, kanal]) for kanal in range(2)], axis=1).astype(np.float32)


def note_klang(note: Note, stueck: Stueck, instrument: str, je_ton: dict[int, list[Path]]) -> np.ndarray:
    """Der Klang einer Note: Probe, verstimmt, nach Notenende im Ausklang des Instruments abgedämpft."""
    pfad, halbtoene = waehle(je_ton, note.tonhoehe, note.staerke)
    ton = verstimme(lade_probe(pfad), halbtoene)
    ende = int(stueck.sekunden(note.dauer) * ABTASTRATE)
    ausklang = int(INSTRUMENTE[instrument].ausklang * ABTASTRATE)
    ton = ton[: ende + ausklang].copy()
    if len(ton) > ende:
        rest = len(ton) - ende
        ton[ende:] *= np.cos(np.linspace(0, np.pi / 2, rest))[:, None] ** 2
    return ton * (note.staerke / ANSCHLAG_BEZUG) ** ANSCHLAG_KURVE


def raumantwort() -> np.ndarray:
    """Künstliche Raumantwort: geglättetes Rauschen, exponentiell abfallend, links und rechts verschieden."""
    zufall = np.random.default_rng(seed=1858)
    laenge = int(HALL_LAENGE * ABTASTRATE)
    zeit = np.arange(laenge) / ABTASTRATE
    huelle = 10 ** (-(HALL_DAEMPFUNG / 20) * zeit / HALL_ABFALL)
    rauschen = zufall.standard_normal((laenge, 2))
    kern = np.ones(HALL_GLAETTUNG) / HALL_GLAETTUNG
    rauschen = np.stack([np.convolve(rauschen[:, k], kern, mode="same") for k in range(2)], axis=1)
    antwort = rauschen * huelle[:, None]
    return (antwort / np.sqrt(np.sum(antwort**2))).astype(np.float32)


def mit_hall(ton: np.ndarray, anteil: float, antwort: np.ndarray) -> np.ndarray:
    """Mischt trockenen Ton und Nachhall. Ausgabe ist um die Länge der Raumantwort länger."""
    nass = np.stack([fftconvolve(ton[:, k], antwort[:, k]) for k in range(2)], axis=1)
    trocken = np.zeros_like(nass)
    trocken[: len(ton)] = ton
    return (1 - anteil) * trocken + anteil * nass


def rendere_spur(spur: Spur, stueck: Stueck, wurzel: Path, laenge: int) -> np.ndarray:
    """Alle Noten einer Spur, mit Lautstärke und Lage (gleichbleibende Leistung) gemischt."""
    je_ton = proben(INSTRUMENTE[spur.instrument], wurzel)
    summe = np.zeros((laenge, 2), dtype=np.float32)
    zufall = np.random.default_rng(seed=len(spur.noten))
    for note in spur.noten:
        klang = note_klang(note, stueck, spur.instrument, je_ton)
        versatz = zufall.uniform(0, spur.streuung) if spur.streuung else 0.0
        start = int((stueck.sekunden(note.beginn) + versatz) * ABTASTRATE)
        stueckchen = klang[: max(0, laenge - start)]
        summe[start : start + len(stueckchen)] += stueckchen
    winkel = (spur.panorama + 1) * np.pi / 4
    return summe * spur.lautstaerke * np.array([np.cos(winkel), np.sin(winkel)], dtype=np.float32)


def rendere(stueck: Stueck, wurzel: Path) -> np.ndarray:
    """Das ganze Stück als Stereo-Ton mit Nachhall, Spitze auf −2 dBFS, sanft ausgeblendet."""
    laenge = int((stueck.sekunden(stueck.ende()) + NACHKLANG) * ABTASTRATE)
    antwort = raumantwort()
    summe = np.zeros((laenge + len(antwort) - 1, 2), dtype=np.float32)
    for spur in stueck.spuren:
        summe += mit_hall(rendere_spur(spur, stueck, wurzel, laenge), spur.hall, antwort)
    summe = summe[:laenge]
    ausblenden = int(NACHKLANG * ABTASTRATE)
    summe[-ausblenden:] *= np.linspace(1, 0, ausblenden)[:, None]
    spitze = float(np.max(np.abs(summe))) or 1.0
    return summe * (SPITZE / spitze)


def schreibe_wav(ton: np.ndarray, ziel: Path) -> None:
    """Schreibt 16-Bit-Stereo. Beispiel: schreibe_wav(rendere(stueck, wurzel), Path("x.wav"))."""
    ganz = np.iinfo(np.int16).max
    wavfile.write(ziel, ABTASTRATE, (np.clip(ton, -1, 1) * ganz).astype(np.int16))
