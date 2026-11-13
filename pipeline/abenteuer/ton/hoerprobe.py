"""Befehl: Hörproben der Leitmotive als MIDI, m4a und mp3 bauen.

Warum: Der Autor entscheidet anhand der Proben, ob selbst gesetzte und mit freien Instrumenten
gerenderte Musik genügt (``docs/spiel/28_Tonquellen.md``, Abschnitt 5). Die Instrumentenproben und
die Ergebnisse liegen nur lokal unter ``buch/arbeit/ton/`` (in ``.gitignore``); ins öffentliche
Repository kommt nur dieses Werkzeug.

Aufruf (im Hauptordner; braucht git, ffmpeg, numpy und scipy):
    python -m pipeline.abenteuer.ton.hoerprobe --laden
    python -m pipeline.abenteuer.ton.hoerprobe --nur ambrose
"""

import argparse
import subprocess
from pathlib import Path

from pipeline.abenteuer.ton.hoerproben import ALLE
from pipeline.abenteuer.ton.instrumente import INSTRUMENTE, QUELLEN, laden
from pipeline.abenteuer.ton.maple_falls import maple_falls
from pipeline.abenteuer.ton.midi import schreibe_midi
from pipeline.abenteuer.ton.satz import Stueck

PROBEN = Path("buch/arbeit/ton/proben")
ZIEL = Path("buch/arbeit/ton/hoerproben")
# Bitraten: m4a wie im Klangplan (Ü3, 96 kbit/s), mp3 etwas höher für ältere Abspieler.
M4A_BITRATE = "96k"
MP3_BITRATE = "128k"


def alle_stuecke() -> list[Stueck]:
    """Die fünf Motivproben und das Ortsthema Maple Falls, in der Reihenfolge zum Anhören."""
    return [erzeuge() for erzeuge in ALLE] + [maple_falls()]


def kodiere(wav: Path, ziel: Path) -> None:
    """Wandelt die WAV-Datei mit ffmpeg in m4a (AAC) und mp3 neben ``ziel`` um."""
    for endung, codec, bitrate in ((".m4a", "aac", M4A_BITRATE), (".mp3", "libmp3lame", MP3_BITRATE)):
        befehl = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-c:a", codec, "-b:a", bitrate]
        subprocess.run([*befehl, str(ziel.with_suffix(endung))], check=True)


def liesmich(stuecke: list[Stueck], ziel: Path) -> None:
    """Schreibt eine kurze Übersicht der Proben mit Instrumenten und Herkunft der Klänge."""
    zeilen = ["Hörproben Leitmotive (selbst gesetzt, gerendert mit freien Proben)", ""]
    for stueck in stuecke:
        instrumente = sorted({INSTRUMENTE[spur.instrument].beschreibung for spur in stueck.spuren})
        zeilen += [f"{stueck.kennung}: {stueck.titel}", f"  {stueck.beschreibung}"]
        zeilen += [f"  Instrumente: {', '.join(instrumente)}", ""]
    zeilen += ["Proben: CC0 1.0, Versilian Studios", *[f"  {name}: {url}" for name, url in QUELLEN.items()]]
    (ziel / "LIESMICH.txt").write_text("\n".join(zeilen) + "\n", encoding="utf-8")


def baue(stuecke: list[Stueck], proben: Path, ziel: Path) -> None:
    """MIDI, m4a und mp3 je Stück; die WAV-Zwischendatei wird danach gelöscht."""
    from pipeline.abenteuer.ton.sampler import rendere, schreibe_wav

    ziel.mkdir(parents=True, exist_ok=True)
    for stueck in stuecke:
        basis = ziel / stueck.kennung
        schreibe_midi(stueck, basis.with_suffix(".mid"))
        wav = basis.with_suffix(".wav")
        schreibe_wav(rendere(stueck, proben), wav)
        kodiere(wav, basis)
        wav.unlink()
        print(f"{basis}.m4a  ({stueck.sekunden(stueck.ende()):.0f} s)")
    liesmich(stuecke, ziel)


def main() -> None:
    """Liest die Aufrufargumente, holt bei Bedarf die Proben und baut die Hörproben."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--proben", type=Path, default=PROBEN, help="Ordner der Instrumentenproben")
    parser.add_argument("--ziel", type=Path, default=ZIEL, help="Ordner für MIDI, m4a und mp3")
    parser.add_argument("--laden", action="store_true", help="Proben vorher holen (sparsamer Git-Klon)")
    parser.add_argument("--nur", nargs="*", help="nur diese Kennungen bauen, etwa ambrose mama")
    argumente = parser.parse_args()
    if argumente.laden:
        laden(argumente.proben)
    stuecke = [s for s in alle_stuecke() if not argumente.nur or s.kennung in argumente.nur]
    baue(stuecke, argumente.proben, argumente.ziel)


if __name__ == "__main__":
    main()
