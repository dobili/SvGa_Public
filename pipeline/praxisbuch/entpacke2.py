"""Lädt die Lichess-Datei ab einer Byte-Stelle (Rahmengrenze) und entpackt sie nach stdout.

Verbindet sich bei einem Abbruch an genau der Stelle neu, an der die Daten abrissen (Range-Anfrage),
damit der zstd-Strom nahtlos weiterläuft. Aufruf: python entpacke2.py URL START
"""

import sys
import time
import urllib.request

import zstandard

URL, START = sys.argv[1], int(sys.argv[2])
VERSUCHE = 30


class Quelle:
    """Dateiartiges Objekt über HTTP mit Wiederaufnahme ab der aktuellen Stelle."""

    def __init__(self, url, start):
        self.url, self.stelle, self.antwort = url, start, None

    def _oeffne(self):
        anfrage = urllib.request.Request(self.url, headers={"Range": f"bytes={self.stelle}-"})
        self.antwort = urllib.request.urlopen(anfrage, timeout=60)

    def read(self, n=-1):
        for versuch in range(VERSUCHE):
            try:
                if self.antwort is None:
                    self._oeffne()
                daten = self.antwort.read(n)
                self.stelle += len(daten)
                return daten
            except Exception as fehler:  # noqa: BLE001 – jede Netzstörung: neu verbinden
                print(f"Neuverbindung bei {self.stelle}: {fehler}", file=sys.stderr)
                self.antwort = None
                time.sleep(min(60, 2**versuch))
        raise RuntimeError(f"Abbruch nach {VERSUCHE} Versuchen bei {self.stelle}")


quelle = Quelle(URL, START)
leser = zstandard.ZstdDecompressor(max_window_size=2**31).stream_reader(
    quelle, read_size=1 << 22, read_across_frames=True
)
aus = sys.stdout.buffer
while True:
    stueck = leser.read(1 << 22)
    if not stueck:
        break
    aus.write(stueck)
print(f"Ende bei Byte {quelle.stelle}", file=sys.stderr)
