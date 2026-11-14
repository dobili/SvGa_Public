"""Befehl: baut die Musik des Spiels aus den Satzplänen in das private Repository.

Warum: Die Tondateien bleiben privat wie die Grafik (``docs/spiel/28_Tonquellen.md``, Abschnitt 1);
der Paketbau liest sie aus ``musik/`` (Akt 1) und ``musik/akt2`` … ``akt4``
(``app/skripte/baue-abenteuerpaket.mjs``, ``kopiereTon``). Der Dateiname folgt der Regel der App
(``app/src/abenteuer/ton/tonplan.ts``, ``dateienFuer``): „mapleFalls.club“ wird
„maple-falls.club.m4a“. Ins öffentliche Repository kommen nur die Noten (Satzpläne) und dieses
Werkzeug; die MIDI-Dateien landen zum Nachhören und Bearbeiten in ``buch/arbeit/ton/midi``.

Aufruf (im Hauptordner; braucht ffmpeg, fluidsynth, numpy und scipy):
    python -m pipeline.abenteuer.ton.musikbau PRIVAT [--nur mapleFalls diner] [--laden]
"""

import argparse
import json
import re
import subprocess
from pathlib import Path

from pipeline.abenteuer.ton.satzplan import Satz, baue
from pipeline.abenteuer.ton.stuecke import alle

PROBEN = Path("buch/arbeit/ton/proben")
MIDI = Path("buch/arbeit/ton/midi")
# AAC mit 80 kbit/s: für zwei bis vier Instrumente klar genug, hält das Paket klein (Klangplan Ü3).
BITRATE = "80k"
# Ziel der mittleren Lautheit (RMS) in dBFS, damit alle Stücke gleich laut wirken.
ZIEL_RMS_DB = -20.0
SPITZE_DB = -1.0


def dateiname(kennung: str) -> str:
    """Name im Paket wie in der App. Beispiel: „mapleFalls.club“ → „maple-falls.club.m4a“."""
    return re.sub(r"[A-Z]", lambda b: f"-{b.group().lower()}", kennung) + ".m4a"


def zielordner(privat: Path, satz: Satz) -> Path:
    """Akt 1 direkt in musik/, spätere Akte in musik/aktN (werden nachgeladen)."""
    return privat / "musik" if satz.akt == 1 else privat / "musik" / f"akt{satz.akt}"


def angleichen(ton, pegel_db: float):  # noqa: ANN001, ANN201 (numpy nur zur Laufzeit)
    """Gleiche Lautheit für alle Stücke, Spitzen weich begrenzt. ``pegel_db`` hebt oder senkt bewusst."""
    import numpy as np

    rms = float(np.sqrt(np.mean(ton**2))) or 1e-9
    ton = ton * (10 ** ((ZIEL_RMS_DB + pegel_db) / 20) / rms)
    grenze = 10 ** (SPITZE_DB / 20)
    return np.tanh(ton / grenze) * grenze


# Kleiner Lautsprecher: Tiefen unter 250 Hz und Höhen über 3,5 kHz fallen weg (Klangplan A2, Diner).
LAUTSPRECHER_HZ = (250.0, 3500.0)
FILTER_ORDNUNG = 4


def klangbild(ton, art: str):  # noqa: ANN001, ANN201 (numpy nur zur Laufzeit)
    """Färbt den Klang nach ``Satz.klangbild``; ohne Angabe bleibt er unverändert."""
    if art != "lautsprecher":
        return ton
    from scipy.signal import butter, sosfilt

    from pipeline.abenteuer.ton.sampler import ABTASTRATE

    filter_ = butter(FILTER_ORDNUNG, LAUTSPRECHER_HZ, btype="bandpass", fs=ABTASTRATE, output="sos")
    return sosfilt(filter_, ton, axis=0)


# Am Ende eines Kurzmotivs gilt als Stille, was leiser als −60 dB ist; 0,1 s bleiben als Rest.
STILLE_DB = -60
REST_SEKUNDEN = 0.1


def ohne_stille_am_ende(ton):  # noqa: ANN001, ANN201 (numpy nur zur Laufzeit)
    """Schneidet die Stille nach dem Ausklang ab (Kurzmotive sollen nicht nachhängen)."""
    import numpy as np

    from pipeline.abenteuer.ton.sampler import ABTASTRATE

    laut = np.where(np.abs(ton).max(axis=1) > 10 ** (STILLE_DB / 20))[0]
    ende = int(laut[-1]) + int(REST_SEKUNDEN * ABTASTRATE) if len(laut) else len(ton)
    return ton[:ende]


def baue_satz(satz: Satz, privat: Path) -> dict[str, object]:
    """Rendert einen Plan, kodiert ihn als m4a und gibt die Angaben für die Übersicht zurück."""
    from pipeline.abenteuer.ton.midi import schreibe_midi
    from pipeline.abenteuer.ton.sampler import rendere, schreibe_wav

    stueck = baue(satz)
    MIDI.mkdir(parents=True, exist_ok=True)
    schreibe_midi(stueck, MIDI / f"{satz.kennung}.mid")
    ordner = zielordner(privat, satz)
    ordner.mkdir(parents=True, exist_ok=True)
    ziel = ordner / dateiname(satz.kennung)
    wav = MIDI / f"{satz.kennung}.wav"
    ton = angleichen(klangbild(rendere(stueck, PROBEN), satz.klangbild), satz.pegel_db)
    schreibe_wav(ton if satz.schleife else ohne_stille_am_ende(ton), wav)
    befehl = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-c:a", "aac", "-b:a", BITRATE]
    subprocess.run([*befehl, str(ziel)], check=True)
    wav.unlink()
    sekunden = stueck.sekunden(stueck.ende())
    print(f"{ziel}  ({sekunden:.0f} s, {ziel.stat().st_size / 1e6:.2f} MB)")
    return {
        "kennung": satz.kennung,
        "titel": satz.titel,
        "akt": satz.akt,
        "datei": str(ziel.relative_to(privat)),
        "sekunden": round(sekunden),
        "schleife": satz.schleife,
        "beschreibung": satz.beschreibung,
        "instrumente": sorted({s.instrument for s in satz.stimmen}),
    }


def main() -> None:
    """Liest die Argumente, holt bei Bedarf Proben und Klangfonts und baut die Stücke."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("privat", type=Path, help="privates Repository (schach-abenteuer-inhalte)")
    parser.add_argument("--nur", nargs="*", help="nur diese Kennungen")
    parser.add_argument("--laden", action="store_true", help="Proben und Klangfonts vorher holen")
    argumente = parser.parse_args()
    if argumente.laden:
        from pipeline.abenteuer.ton import instrumente, klangfonts

        instrumente.laden(PROBEN)
        klangfonts.laden()
    plaene = [s for s in alle() if not argumente.nur or s.kennung in argumente.nur]
    # Je Stück eine Angabe in buch/arbeit/ton/midi/uebersicht/, damit parallele Läufe sich nicht stören.
    ordner = MIDI / "uebersicht"
    ordner.mkdir(parents=True, exist_ok=True)
    for satz in plaene:
        angaben = baue_satz(satz, argumente.privat)
        datei = ordner / f"{satz.kennung}.json"
        datei.write_text(json.dumps(angaben, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
