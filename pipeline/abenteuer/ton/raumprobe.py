"""Befehl: Hörprobe der räumlichen Geräusche (Park von Maple Falls), vorher und nachher.

Warum: Ob der Grundpegel stimmt und das Anschwellen bei der Ankunft angenehm ist, entscheidet das
Ohr des Autors (Auftrag des Hauptchats, 22.11.2026). Die Probe spielt denselben Weg zweimal: vorher
(Dauergeräusch überall gleich laut, wie bis 0.2.x) und nachher (app/src/abenteuer/ton/
geraeuschraum.ts und raumregie.ts, hier in Python nachgerechnet): Ankunft im Park aus dem Diner
(anderes Geräusch, also Anschwellen), sieben Sekunden am Eingang stehen, dann zum Wasserfall gehen
und dort stehen. Dazu misst sie den Abstand von Musik und Geräusch im fertigen Mix.

Ausgabe nach ZIEL: ``raumprobe.mp4`` (Bild und Ton), ``raumprobe.m4a``, ``raumprobe.html`` (Seite
mit Pegelkurve, Karte und Ringen, ton/raumprobe_seite.py) und ``pegelprotokoll.txt``. Die Tondateien
kommen aus dem privaten Repository; die Ergebnisse gehören nie ins öffentliche.

Aufruf (im Hauptordner; braucht ffmpeg, numpy und Pillow):
    python -m pipeline.abenteuer.ton.raumprobe TONORDNER ZIEL
TONORDNER enthält ``maple-falls.m4a`` (Musik) und ``wasserfall.m4a`` (Geräusch).
"""

import argparse
import math
import subprocess
from pathlib import Path

import numpy as np

from pipeline.abenteuer import geraeuschquellen as gq
from pipeline.abenteuer.geraeuschquellen_bild import abstand, anteil

RATE = 44100
SCHRITT_S = 0.01  # Auflösung der Pegelkurve
TAKT_S = 0.1  # wie TAKT_MS in geraeuschraum.ts
RAUM_TAU_S = 0.25  # wie RAUM_S in tonspieler.ts
UEBERBLENDEN_S = 1.5  # wie UEBERBLENDEN_S in tonspieler.ts
GRUND_DB, NAH_DB = -11.0, 0.0  # wie geraeuschraum.ts
HALTEN_S, SINKEN_S = 3.5, 3.0
REGLER_MUSIK, REGLER_GERAEUSCHE = 0.6, 0.8  # Grundeinstellung der App
START, WASSERFALL_VOR = (1, 16), (31, 5)
STEHEN_EINGANG_S, KACHELN_JE_S, STEHEN_ENDE_S = 7.0, 4.0, 4.0
PAUSE_S = 1.0


def ankunft(sekunden: float) -> float:
    """Anteil der Ankunft wie ``ankunftsanteil`` in geraeuschraum.ts."""
    if sekunden < 0:
        return 0.0
    if sekunden <= HALTEN_S:
        return 1.0
    t = (sekunden - HALTEN_S) / SINKEN_S
    return 0.0 if t >= 1 else 0.5 + 0.5 * math.cos(math.pi * t)


def raumpegel(naehe: float, ankunftsanteil: float) -> float:
    """Verstärkung wie ``raumpegel`` in geraeuschraum.ts."""
    a = min(1.0, max(0.0, naehe, ankunftsanteil))
    return 10 ** ((GRUND_DB + (NAH_DB - GRUND_DB) * a) / 20)


def weg() -> list[tuple[float, tuple[int, int]]]:
    """Zeitpunkte und Felder des Helden: stehen, nach rechts, nach oben, stehen."""
    punkte = [(0.0, START)]
    t = STEHEN_EINGANG_S
    x, y = START
    while x < WASSERFALL_VOR[0]:
        x += 1
        punkte.append((t, (x, y)))
        t += 1 / KACHELN_JE_S
    while y > WASSERFALL_VOR[1]:
        y -= 1
        punkte.append((t, (x, y)))
        t += 1 / KACHELN_JE_S
    punkte.append((t + STEHEN_ENDE_S, (x, y)))
    return punkte


def feld_zu(punkte: list[tuple[float, tuple[int, int]]], t: float) -> tuple[int, int]:
    """Das Feld des Helden zur Zeit t."""
    aktuell = punkte[0][1]
    for zeit, feld in punkte:
        if zeit <= t:
            aktuell = feld
    return aktuell


def kurven(felder: list[list[int]], raeumlich: bool) -> dict[str, np.ndarray]:
    """Verstärkung von Musik und Geräusch je ``SCHRITT_S`` (Regler, Einblenden, Raum geglättet)."""
    punkte = weg()
    dauer = punkte[-1][0]
    zeiten = np.arange(0, dauer, SCHRITT_S)
    einblenden = np.minimum(1.0, 1e-4 ** np.maximum(0, 1 - zeiten / UEBERBLENDEN_S))
    raum = np.ones_like(zeiten)
    ziel, wert, naechster_takt = 1.0, raumpegel(0, 1) if raeumlich else 1.0, 0.0
    for i, t in enumerate(zeiten):
        if raeumlich and t >= naechster_takt:
            fx, fy = feld_zu(punkte, t)
            naehe = max((anteil(abstand(r, fx, fy)) for r in felder), default=0.0)
            ziel = raumpegel(naehe, ankunft(t))
            naechster_takt = t + TAKT_S
        wert += (ziel - wert) * (1 - math.exp(-SCHRITT_S / RAUM_TAU_S)) if raeumlich else 0
        raum[i] = wert if raeumlich else 1.0
    return {
        "zeit": zeiten,
        "musik": REGLER_MUSIK * einblenden,
        "geraeusch": REGLER_GERAEUSCHE * einblenden * raum,
        "raum": raum,
    }


def lies_ton(datei: Path, sekunden: float) -> np.ndarray:
    """Dekodiert eine Datei als Stereo (float), in Schleife auf die Länge gebracht."""
    roh = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", str(datei), "-f", "f32le", "-ac", "2", "-ar", str(RATE), "-"],
        check=True,
        capture_output=True,
    ).stdout
    ton = np.frombuffer(roh, dtype=np.float32).reshape(-1, 2)
    noetig = int(sekunden * RATE)
    return np.tile(ton, (noetig // len(ton) + 1, 1))[:noetig]


def mische(musik: np.ndarray, geraeusch: np.ndarray, k: dict[str, np.ndarray]) -> tuple[np.ndarray, ...]:
    """Mix aus Musik und Geräusch nach den Kurven; dazu beide Anteile einzeln (für die Messung)."""
    n = len(k["zeit"]) * int(SCHRITT_S * RATE)
    t = np.arange(n) / RATE
    gm = np.interp(t, k["zeit"], k["musik"])[:, None]
    gg = np.interp(t, k["zeit"], k["geraeusch"])[:, None]
    m, g = musik[:n] * gm, geraeusch[:n] * gg
    return m + g, m, g


def db(x: np.ndarray) -> float:
    """Effektivpegel in dBFS."""
    return 20 * math.log10(max(1e-9, float(np.sqrt(np.mean(x**2)))))


def protokoll(m: np.ndarray, g: np.ndarray, k: dict[str, np.ndarray]) -> list[str]:
    """Je Sekunde: Raumpegel, gemessene Pegel von Musik und Geräusch und ihr Abstand."""
    zeilen = ["Sekunde  Raum(dB)  Musik(dBFS)  Geräusch(dBFS)  Abstand(dB)"]
    for s in range(int(k["zeit"][-1])):
        a, b = s * RATE, (s + 1) * RATE
        raum = 20 * math.log10(float(k["raum"][int(s / SCHRITT_S)]))
        dm, dg = db(m[a:b]), db(g[a:b])
        zeilen.append(f"{s:7d}  {raum:8.1f}  {dm:11.1f}  {dg:14.1f}  {dm - dg:11.1f}")
    return zeilen


def schreibe_wav(ton: np.ndarray, ziel: Path) -> None:
    """Schreibt Stereo-Float als m4a über ffmpeg (weich begrenzt wie der Tonspieler)."""
    weich = np.tanh(ton).astype(np.float32)
    befehl = ["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ac", "2", "-ar", str(RATE), "-i", "-"]
    subprocess.run([*befehl, "-c:a", "aac", "-b:a", "128k", str(ziel)], input=weich.tobytes(), check=True)


def hauptprogramm(argv: list[str] | None = None) -> int:
    """Baut Ton, Video, Seite und Protokoll."""
    teiler = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    teiler.add_argument("tonordner", type=Path)
    teiler.add_argument("ziel", type=Path)
    a = teiler.parse_args(argv)
    a.ziel.mkdir(parents=True, exist_ok=True)
    szene, _, quellen, _ = gq.fuer_szene(gq.SZENEN / "maple-falls-park.json", gq.lade(gq.ORTE))
    felder = [r for q in quellen for r in q["felder"]]
    vorher, nachher = kurven(felder, False), kurven(felder, True)
    dauer = float(vorher["zeit"][-1]) + SCHRITT_S
    musik = lies_ton(a.tonordner / "maple-falls.m4a", dauer)
    geraeusch = lies_ton(a.tonordner / "wasserfall.m4a", dauer)
    mix_v, _, _ = mische(musik, geraeusch, vorher)
    mix_n, m, g = mische(musik, geraeusch, nachher)
    stille = np.zeros((int(PAUSE_S * RATE), 2), dtype=np.float32)
    ton = a.ziel / "raumprobe.m4a"
    schreibe_wav(np.concatenate([mix_v, stille, mix_n]), ton)
    zeilen = protokoll(m, g, nachher)
    (a.ziel / "pegelprotokoll.txt").write_text("\n".join(zeilen) + "\n", encoding="utf-8")
    from pipeline.abenteuer.ton.raumprobe_seite import seite, video

    video(szene, quellen, weg(), vorher, nachher, ton, a.ziel / "raumprobe.mp4", PAUSE_S)
    (a.ziel / "raumprobe.html").write_text(seite(szene, quellen, weg(), nachher, zeilen), encoding="utf-8")
    print("\n".join(zeilen))
    return 0


if __name__ == "__main__":
    raise SystemExit(hauptprogramm())
