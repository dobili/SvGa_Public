"""Schreibt ein Stück als Standard-MIDI-Datei (Format 1), ohne Zusatzpakete.

Warum: Die Noten sollen auch außerhalb unseres Samplers zu hören und zu bearbeiten sein, etwa in
MuseScore oder bei einem Komponisten, der später einzelne Stücke übernimmt
(``docs/spiel/28_Tonquellen.md``, Abschnitt 3.4). Jede Spur bekommt ein General-MIDI-Instrument,
das dem Instrument der Hörprobe ungefähr entspricht.
"""

import struct
from pathlib import Path

from pipeline.abenteuer.ton.satz import Stueck

TICKS_JE_SCHLAG = 480
MIKROSEKUNDEN_JE_MINUTE = 60_000_000
# General-MIDI-Programme (0-basiert) für die Instrumente aus instrumente.INSTRUMENTE.
GM_PROGRAMME = {
    "klavier_alt": 0,
    "klavier": 0,
    "klavier_trocken": 1,
    "cembalo": 6,
    "glockenspiel": 9,
    "harfe": 24,
    "digitalpiano": 5,
    "cello": 42,
}
NOTE_AN = 0x90
NOTE_AUS = 0x80
PROGRAMMWECHSEL = 0xC0
META = 0xFF
META_TEMPO = 0x51
META_NAME = 0x03
META_ENDE = 0x2F
MIDI_KANAELE = 16
SCHLAGZEUGKANAL = 9


def zahl_variabel(wert: int) -> bytes:
    """Zahl in variabler Länge (7 Bit je Byte). Beispiel: 480 wird zu b'\\x83\\x60'."""
    teile = [wert & 0x7F]
    wert >>= 7
    while wert:
        teile.append((wert & 0x7F) | 0x80)
        wert >>= 7
    return bytes(reversed(teile))


def _spur_bytes(ereignisse: list[tuple[int, bytes]]) -> bytes:
    """Sortierte Ereignisse (Tick, Daten) mit Zeitabständen als Spurblock „MTrk“."""
    daten = bytearray()
    vorher = 0
    for tick, nachricht in sorted(ereignisse, key=lambda e: (e[0], e[1][0] != NOTE_AUS)):
        daten += zahl_variabel(tick - vorher) + nachricht
        vorher = tick
    daten += zahl_variabel(0) + bytes([META, META_ENDE, 0])
    return b"MTrk" + struct.pack(">I", len(daten)) + bytes(daten)


def _kanal(index: int) -> int:
    """Kanal einer Spur; Kanal 10 (Index 9) bleibt frei, weil er in General MIDI Schlagzeug ist."""
    kanal = index % (MIDI_KANAELE - 1)
    return kanal + 1 if kanal >= SCHLAGZEUGKANAL else kanal


def midi_bytes(stueck: Stueck) -> bytes:
    """Das ganze Stück als MIDI-Datei. Beispiel: 3 Spuren ergeben 4 Blöcke „MTrk“ (mit Tempospur)."""
    tempo = round(MIKROSEKUNDEN_JE_MINUTE / stueck.tempo)
    name = stueck.titel.encode("utf-8")
    tempospur = [
        (0, bytes([META, META_NAME]) + zahl_variabel(len(name)) + name),
        (0, bytes([META, META_TEMPO, 3]) + tempo.to_bytes(3, "big")),
    ]
    bloecke = [_spur_bytes(tempospur)]
    for index, spur in enumerate(stueck.spuren):
        kanal = _kanal(index)
        ereignisse = [(0, bytes([PROGRAMMWECHSEL | kanal, GM_PROGRAMME.get(spur.instrument, 0)]))]
        for note in spur.noten:
            an = round(note.beginn * TICKS_JE_SCHLAG)
            aus = round((note.beginn + note.dauer) * TICKS_JE_SCHLAG)
            ereignisse.append((an, bytes([NOTE_AN | kanal, note.tonhoehe, note.staerke])))
            ereignisse.append((aus, bytes([NOTE_AUS | kanal, note.tonhoehe, 0])))
        bloecke.append(_spur_bytes(ereignisse))
    kopf = b"MThd" + struct.pack(">IHHH", 6, 1, len(bloecke), TICKS_JE_SCHLAG)
    return kopf + b"".join(bloecke)


def schreibe_midi(stueck: Stueck, ziel: Path) -> None:
    """Schreibt ``stueck`` als MIDI-Datei nach ``ziel``."""
    ziel.write_bytes(midi_bytes(stueck))
