"""Befehl: misst je Instrument, wie die Oktavzahl im Dateinamen zur echten Tonhöhe steht.

Warum: Die Bibliotheken zählen Oktaven verschieden (``instrumente.py``, ``versatz``). Ein falscher
Versatz lässt ein Instrument eine Oktave zu hoch oder zu tief spielen; im Zusammenspiel mehrerer
Instrumente fällt das sofort auf. Dieses Werkzeug misst die Grundfrequenz von drei Proben je
Instrument und nennt den Versatz, der dazu passt. Braucht numpy und die geladenen Proben.

Aufruf: ``python -m pipeline.abenteuer.ton.kalibrieren [kennung …]``
"""

import argparse
import math
from pathlib import Path

import numpy as np

from pipeline.abenteuer.ton.instrumente import HALBTOENE_JE_OKTAVE, INSTRUMENTE, Instrument, proben
from pipeline.abenteuer.ton.sampler import ABTASTRATE, lade_probe

PROBEN = Path("buch/arbeit/ton/proben")
A4_HZ = 440.0
A4_MIDI = 69
# Gemessen wird ab 0,1 s nach dem Anschlag über 0,5 s; gesucht zwischen 25 Hz und 4 kHz.
ANFANG, FENSTER = 0.1, 0.5
TIEFST_HZ, HOECHST_HZ = 25.0, 4000.0
OBERTOENE = 4


def grundfrequenz(ton: np.ndarray) -> float:
    """Grundfrequenz über das Produkt der gestauchten Spektren (Obertöne stützen den Grundton)."""
    mono = ton[int(ANFANG * ABTASTRATE) : int((ANFANG + FENSTER) * ABTASTRATE)].mean(axis=1)
    spektrum = np.abs(np.fft.rfft(mono * np.hanning(len(mono)), n=1 << 17))
    produkt = spektrum.copy()
    for faktor in range(2, OBERTOENE + 1):
        gestaucht = spektrum[::faktor]
        produkt[: len(gestaucht)] *= gestaucht
    frequenzen = np.fft.rfftfreq(1 << 17, 1 / ABTASTRATE)
    bereich = (frequenzen > TIEFST_HZ) & (frequenzen < HOECHST_HZ)
    return float(frequenzen[bereich][np.argmax(produkt[bereich])])


def messe(instrument: Instrument) -> list[int]:
    """Gemessener Versatz an drei Proben (tief, mittel, hoch). Gleiche Werte heißen: sicher."""
    je_ton = proben(Instrument(**{**instrument.__dict__, "versatz": 0}), PROBEN)
    hoehen = sorted(je_ton)
    auswahl = [hoehen[len(hoehen) // 4], hoehen[len(hoehen) // 2], hoehen[3 * len(hoehen) // 4]]
    ergebnis = []
    for genannt in auswahl:
        hz = grundfrequenz(lade_probe(je_ton[genannt][-1]))
        gemessen = A4_MIDI + HALBTOENE_JE_OKTAVE * math.log2(hz / A4_HZ)
        ergebnis.append(round((gemessen - genannt) / HALBTOENE_JE_OKTAVE))
    return ergebnis


def main() -> None:
    """Misst die genannten Instrumente oder alle und gibt Soll und Ist aus."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("kennungen", nargs="*")
    argumente = parser.parse_args()
    for kennung in argumente.kennungen or sorted(INSTRUMENTE):
        instrument = INSTRUMENTE[kennung]
        try:
            werte = messe(instrument)
        except (FileNotFoundError, ValueError) as fehler:
            print(f"{kennung:22} Fehler: {fehler}")
            continue
        zeichen = "ok" if all(w == instrument.versatz for w in werte) else "PRÜFEN"
        print(f"{kennung:22} eingetragen {instrument.versatz}, gemessen {werte}  {zeichen}")


if __name__ == "__main__":
    main()
