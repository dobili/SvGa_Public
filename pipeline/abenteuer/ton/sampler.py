"""Rendert ein Stück aus Noten und Instrumentenproben zu Stereo-Ton (braucht numpy und scipy).

Warum: Ein einfacher Sampler genügt für die Hörproben und läuft ohne Bildschirm in der Cloud-
Umgebung: Je Note wird die nächstgelegene Probe gewählt, auf die Tonhöhe verstimmt, am Notenende
abgedämpft und mit Lage und Nachhall gemischt. numpy und scipy sind keine Pakete der Pipeline
(``pipeline/requirements.txt``); sie werden nur für dieses Werkzeug gebraucht:
``pip install numpy scipy``.
"""

import warnings
from functools import lru_cache
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve, resample_poly

from pipeline.abenteuer.ton.instrumente import INSTRUMENTE, proben
from pipeline.abenteuer.ton.satz import Note, Spur, Stueck
from pipeline.abenteuer.ton.schlagwerk import SCHLAEGE, SCHLAGWERK

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
    with warnings.catch_warnings():
        # Manche Proben tragen Zusatzblöcke (Schleifenpunkte), die scipy überspringt.
        warnings.simplefilter("ignore", wavfile.WavFileWarning)
        rate, daten = wavfile.read(pfad)
    skala = float(np.iinfo(daten.dtype).max) if np.issubdtype(daten.dtype, np.integer) else 1.0
    ton = daten.astype(np.float32) / skala
    if rate != ABTASTRATE:
        # Einige Proben (Saxofon) sind mit 48 kHz aufgenommen; umrechnen statt abbrechen.
        from math import gcd

        teiler = gcd(rate, ABTASTRATE)
        ton = resample_poly(ton, ABTASTRATE // teiler, rate // teiler, axis=0).astype(np.float32)
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


def schlag_klang(note: Note, index: int, wurzel: Path) -> np.ndarray:
    """Ein Schlag ohne Tonhöhe: Aufnahmen reihum, Lautstärke nach der Anschlagstärke."""
    from pipeline.abenteuer.ton.schlagwerk import dateien

    aufnahmen = dateien(note.tonhoehe, wurzel)
    ton = lade_probe(aufnahmen[index % len(aufnahmen)])
    ton = ton[: int(SCHLAEGE[note.tonhoehe].ausklang * ABTASTRATE)].copy()
    rest = min(len(ton), int(0.05 * ABTASTRATE))
    ton[-rest:] *= np.linspace(1, 0, rest)[:, None]
    return ton * (note.staerke / ANSCHLAG_BEZUG) ** ANSCHLAG_KURVE


def rendere_spur(spur: Spur, stueck: Stueck, wurzel: Path, laenge: int) -> np.ndarray:
    """Alle Noten einer Spur, geeicht, mit Lautstärke und Lage (gleichbleibende Leistung) gemischt.

    Mit ``pegel_db`` wird die Spur so gesetzt, dass ihre klingenden Stellen diesen Pegel haben; so
    liegt eine Melodie über der Begleitung, ganz gleich, wie laut die Aufnahme des Instruments ist.
    """
    roh = _roh(spur, stueck, wurzel, laenge)
    if spur.pegel_db is None:
        return _mit_lage(roh, spur, wurzel)
    winkel = (spur.panorama + 1) * np.pi / 4
    faktor = spur.lautstaerke * 10 ** (spur.pegel_db / 20) / aktiver_pegel(roh)
    return roh * faktor * np.array([np.cos(winkel), np.sin(winkel)], dtype=np.float32)


# Fenster für den Pegel der klingenden Stellen (0,1 s); leiser als −60 dB gilt als Stille.
PEGEL_FENSTER = ABTASTRATE // 10
STILLE_DB = -60


def aktiver_pegel(ton: np.ndarray) -> float:
    """Mittlerer Pegel (RMS) nur über die Fenster, in denen etwas klingt."""
    mono = ton.mean(axis=1)
    anzahl = len(mono) // PEGEL_FENSTER
    if anzahl == 0:
        return 1.0
    fenster = np.sqrt(np.mean(mono[: anzahl * PEGEL_FENSTER].reshape(anzahl, -1) ** 2, axis=1))
    klingend = fenster[fenster > 10 ** (STILLE_DB / 20) * float(fenster.max() or 1)]
    return float(np.sqrt(np.mean(klingend**2))) if len(klingend) else 1.0


def _roh(spur: Spur, stueck: Stueck, wurzel: Path, laenge: int) -> np.ndarray:
    """Alle Noten einer Spur ungeeicht und in der Mitte (Sampler, Klangfont oder Schlagwerk)."""
    from pipeline.abenteuer.ton.klangfonts import KLANGFONTS

    if spur.instrument in KLANGFONTS:
        return _klangfont_spur(spur, stueck, laenge)
    je_ton = proben(INSTRUMENTE[spur.instrument], wurzel) if spur.instrument != SCHLAGWERK else {}
    summe = np.zeros((laenge, 2), dtype=np.float32)
    zufall = np.random.default_rng(seed=len(spur.noten))
    for index, note in enumerate(spur.noten):
        if spur.instrument == SCHLAGWERK:
            klang = schlag_klang(note, index, wurzel)
        else:
            klang = note_klang(note, stueck, spur.instrument, je_ton)
        versatz = zufall.uniform(0, spur.streuung) if spur.streuung else 0.0
        start = int((stueck.sekunden(note.beginn) + versatz) * ABTASTRATE)
        stueckchen = klang[: max(0, laenge - start)]
        summe[start : start + len(stueckchen)] += stueckchen
    return summe


def _mit_lage(summe: np.ndarray, spur: Spur, wurzel: Path) -> np.ndarray:
    """Eichung, Lautstärke und Lage im Stereobild (gleichbleibende Leistung)."""
    winkel = (spur.panorama + 1) * np.pi / 4
    faktor = spur.lautstaerke * eichung(spur.instrument, wurzel)
    return summe * faktor * np.array([np.cos(winkel), np.sin(winkel)], dtype=np.float32)


# Eichung: Ein Bezugston (Anschlag 80, eine Sekunde) soll bei Lautstärke 1 diesen Pegel haben.
EICH_PEGEL = 10 ** (-20 / 20)
EICH_STAERKE = 80
EICH_TON = {
    "kontrabass": 40,
    "kontrabass_pizz": 40,
    "tuba": 40,
    "ebass": 40,
    "fagott": 48,
    "posaune": 52,
    "cello": 52,
    "horn": 57,
    "glockenspiel": 84,
    "roehrenglocken": 67,
}


@lru_cache(maxsize=64)
def eichung(instrument: str, wurzel: Path) -> float:
    """Faktor, der die Instrumente gleich laut macht (die Aufnahmen sind verschieden ausgesteuert).

    Warum: Ohne Eichung klingt etwa das Cello der VSCO-Bibliothek 15 dB leiser als das Klavier der
    VCSL; die Lautstärken in den Satzplänen sollen aber Absicht sein, nicht Zufall der Aufnahme.
    """
    from pipeline.abenteuer.ton.schlagwerk import KLEINE_TROMMEL

    ton = KLEINE_TROMMEL if instrument == SCHLAGWERK else EICH_TON.get(instrument, 60)
    probe = Stueck("eichung", "Eichung", 60, [Spur(instrument, [Note(ton, 0, 1, EICH_STAERKE)], streuung=0)])
    laenge = ABTASTRATE
    roh = _roh(probe.spuren[0], probe, wurzel, laenge)
    rms = float(np.sqrt(np.mean(roh**2))) or 1.0
    return EICH_PEGEL / rms


def _klangfont_spur(spur: Spur, stueck: Stueck, laenge: int) -> np.ndarray:
    """Eine Spur über FluidSynth (Klangfont), mit derselben Streuung der Anschläge wie im Sampler."""
    from pipeline.abenteuer.ton.klangfonts import spiele
    from pipeline.abenteuer.ton.midi import midi_bytes

    zufall = np.random.default_rng(seed=len(spur.noten))
    schlaege_je_sekunde = stueck.tempo / 60
    gestreut = [
        Note(
            n.tonhoehe,
            max(0.0, n.beginn + zufall.uniform(0, spur.streuung) * schlaege_je_sekunde),
            n.dauer,
            n.staerke,
        )
        for n in spur.noten
    ]
    einzeln = Stueck(stueck.kennung, stueck.titel, stueck.tempo, [Spur("klavier", gestreut)])
    wav = spiele(midi_bytes(einzeln), spur.instrument)
    ton = lade_probe.__wrapped__(wav)
    wav.unlink()
    wav.parent.rmdir()
    ergebnis = np.zeros((laenge, 2), dtype=np.float32)
    stueckchen = ton[:laenge]
    ergebnis[: len(stueckchen)] = stueckchen
    return ergebnis


def rendere(stueck: Stueck, wurzel: Path) -> np.ndarray:
    """Das ganze Stück als Stereo-Ton mit Nachhall, Spitze auf −2 dBFS.

    Ohne Schleife klingt das Ende aus und wird sanft ausgeblendet. Mit Schleife ist die Datei genau
    so lang wie die Form; der Nachklang über das Ende hinaus wird auf den Anfang gelegt, so läuft
    die Schleife ohne Naht (Klangplan A2: Ende und Anfang auf derselben Harmonie).
    """
    form = int(stueck.sekunden(stueck.ende()) * ABTASTRATE)
    laenge = form + int(NACHKLANG * ABTASTRATE)
    antwort = raumantwort()
    summe = np.zeros((laenge + len(antwort) - 1, 2), dtype=np.float32)
    for spur in stueck.spuren:
        summe += mit_hall(rendere_spur(spur, stueck, wurzel, laenge), spur.hall, antwort)
    if stueck.schleife:
        ueberhang = summe[form:]
        summe = summe[:form].copy()
        for start in range(0, len(ueberhang), form):
            teil = ueberhang[start : start + form]
            summe[: len(teil)] += teil
    else:
        summe = summe[:laenge]
        ausblenden = int(NACHKLANG * ABTASTRATE)
        summe[-ausblenden:] *= np.linspace(1, 0, ausblenden)[:, None]
    spitze = float(np.max(np.abs(summe))) or 1.0
    return summe * (SPITZE / spitze)


def schreibe_wav(ton: np.ndarray, ziel: Path) -> None:
    """Schreibt 16-Bit-Stereo. Beispiel: schreibe_wav(rendere(stueck, wurzel), Path("x.wav"))."""
    ganz = np.iinfo(np.int16).max
    wavfile.write(ziel, ABTASTRATE, (np.clip(ton, -1, 1) * ganz).astype(np.int16))
