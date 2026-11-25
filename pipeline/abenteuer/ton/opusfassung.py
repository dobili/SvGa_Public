"""Befehl: legt neben jede Tondatei des Spiels (AAC, ``.m4a``) eine Opus-Fassung (``.webm``).

Warum (Entscheidung des Autors RO41, 26.11.2026): Ton ist der größte Teil des Spielpakets; Opus
spart bei gleicher hörbarer Qualität 20 bis 40 % (Hörprobe ``codecprobe.py``). Safari spielt
Opus erst ab iOS 17.4, deshalb bleibt AAC daneben: Die App prüft beim Start einmal, ob das Gerät
Opus dekodiert, und lädt nur die passende Fassung (``app/src/abenteuer/paket/tonfassung.ts``).

Warum WebM und nicht Ogg: Safari dekodiert Opus in WebM über ``decodeAudioData`` ab iOS 17.4
(so spielt das Spiel jeden Ton); Ogg/Opus kann Safari erst seit iOS 18.4. Chrome, Firefox und
Edge können beides. WebM erreicht also mehr iPhones; die Hörprobe nutzte dasselbe Format.

Warum die Fassungen im privaten Repository liegen und nicht beim Paketbau entstehen: Der Bau bei
Cloudflare hat kein ffmpeg. Der Paketbau (``app/skripte/baue-abenteuerpaket.mjs``) kopiert die
``.webm`` nur, wenn ihr Vermerk zur heutigen ``.m4a`` passt (``spiel/opusquellen.json``:
Pfad → SHA-256 der AAC-Datei, aus der oder neben der sie entstand, und Quelle ``wav`` oder
``aac``). Eine veraltete Fassung bleibt draußen; das Gerät spielt dann dort AAC.

Quellen: Die Musik schreibt ``musikbau`` aus derselben WAV wie das AAC (``aus_wav``, beste
Qualität). Für alles andere, auch alle Geräusche (es gibt keine verlustfreien Quellen), entsteht
Opus aus dem AAC (``erneuere``); ein späterer ``musikbau`` ersetzt diese Musik durch die aus WAV.

Bitraten (Opus, begrenzt variabel wie in der Probe): Musik Stereo 64k, Mono 48k; Geräusche
Stereo 48k, Mono 32k; nie über der Bitrate der AAC-Quelle.

Aufruf (im Hauptordner; braucht ffmpeg mit libopus):
    python -m pipeline.abenteuer.ton.opusfassung PRIVAT            # fehlende und veraltete bauen
    python -m pipeline.abenteuer.ton.opusfassung PRIVAT --pruefen  # nur melden (Ausgang 1 bei Rest)
"""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

VERMERK = "opusquellen.json"
OPUS_ENDUNG = ".webm"
AAC_ENDUNG = ".m4a"
TONORDNER = ("musik", "klang")
LETZTER_AKT = 4
# Bitraten in kbit/s je Ordner und Kanalzahl (Hörprobe 20.11.2026, Auftrag RO41).
BITRATEN = {("musik", 2): 64, ("musik", 1): 48, ("klang", 2): 48, ("klang", 1): 32}
UNTERSTE_BITRATE = 16
BIT_JE_KBIT = 1000
GLEICHZEITIG = 8
FFPROBE = "ffprobe -v error -select_streams a:0 -show_entries stream=channels,bit_rate -of json"
FFMPEG = "ffmpeg -y -loglevel error -i"


def opuspfad(m4a: Path) -> Path:
    """Die Opus-Fassung neben einer AAC-Datei. Beispiel: musik/weg.m4a → musik/weg.webm."""
    return m4a.with_suffix(OPUS_ENDUNG)


def pruefsumme(datei: Path) -> str:
    """SHA-256 einer Datei als Hexzahl (wie der Paketbau)."""
    return hashlib.sha256(datei.read_bytes()).hexdigest()


def spielwurzel(datei: Path) -> Path | None:
    """Der Ordner über musik/ oder klang/ (spiel/), sonst None. Beispiel: spiel/musik/akt2/x.m4a → spiel."""
    for ordner in datei.parents:
        if ordner.name in TONORDNER:
            return ordner.parent
    return None


def schluessel(datei: Path, wurzel: Path) -> str:
    """Pfad im Vermerk, relativ zu spiel/ mit Schrägstrich. Beispiel: „musik/akt2/ambrose.cello.m4a“."""
    return datei.relative_to(wurzel).as_posix()


def bitrate(ordner: str, kanaele: int, quelle_kbit: int | None) -> int:
    """Ziel in kbit/s: Tabelle BITRATEN, nie über der Quelle, nie unter UNTERSTE_BITRATE.

    Beispiel: („klang“, 1, 64) → 32; („musik“, 2, 80) → 64; („musik“, 1, 16) → 16.
    """
    ziel = BITRATEN[(ordner, min(kanaele, 2))]
    if quelle_kbit:
        ziel = min(ziel, quelle_kbit)
    return max(ziel, UNTERSTE_BITRATE)


def miss_quelle(datei: Path) -> tuple[int, int | None]:
    """Kanäle und Bitrate (kbit/s) der ersten Tonspur über ffprobe."""
    ausgabe = subprocess.run(
        [*FFPROBE.split(), str(datei)], check=True, capture_output=True, text=True
    ).stdout
    spur = json.loads(ausgabe)["streams"][0]
    rate = spur.get("bit_rate")
    return int(spur["channels"]), (round(int(rate) / BIT_JE_KBIT) if rate else None)


def befehl(quelle: Path, ziel: Path, kbit: int, mono: bool = False) -> list[str]:
    """ffmpeg-Befehl für Opus in WebM mit begrenzt variabler Bitrate (wie die Hörprobe)."""
    kanal = ["-ac", "1"] if mono else []
    opus = ["-c:a", "libopus", "-b:a", f"{kbit}k", "-vbr", "constrained", "-f", "webm"]
    return [*FFMPEG.split(), str(quelle), "-vn", "-map_metadata", "-1", *kanal, *opus, str(ziel)]


def lies_vermerk(wurzel: Path) -> dict[str, dict[str, str]]:
    """Der Vermerk spiel/opusquellen.json (fehlt er, leer)."""
    datei = wurzel / VERMERK
    return json.loads(datei.read_text(encoding="utf-8")) if datei.exists() else {}


def schreibe_vermerk(wurzel: Path, vermerk: dict[str, dict[str, str]]) -> None:
    """Schreibt den Vermerk sortiert (stabile Unterschiede im privaten Repository)."""
    text = json.dumps(dict(sorted(vermerk.items())), ensure_ascii=False, indent=1) + "\n"
    (wurzel / VERMERK).write_text(text, encoding="utf-8")


def aus_wav(wav: Path, m4a: Path, mono: bool = False) -> None:
    """Opus aus derselben WAV wie das eben geschriebene AAC (musikbau) und Vermerk dazu.

    Außerhalb von spiel/musik oder spiel/klang (Proben, Hörseiten) geschieht nichts.
    """
    wurzel = spielwurzel(m4a)
    if wurzel is None:
        return
    ordner = m4a.relative_to(wurzel).parts[0]
    kanaele = 1 if mono else 2
    subprocess.run(befehl(wav, opuspfad(m4a), bitrate(ordner, kanaele, None), mono), check=True)
    vermerk = lies_vermerk(wurzel)
    vermerk[schluessel(m4a, wurzel)] = {"aac": pruefsumme(m4a), "aus": "wav"}
    schreibe_vermerk(wurzel, vermerk)


def tondateien(wurzel: Path) -> list[Path]:
    """Alle AAC-Dateien unter musik/ und klang/ samt akt2 … akt4, sortiert."""
    dateien: list[Path] = []
    for ordner in TONORDNER:
        for unter in [wurzel / ordner, *(wurzel / ordner / f"akt{a}" for a in range(2, LETZTER_AKT + 1))]:
            if unter.is_dir():
                dateien += sorted(unter.glob(f"*{AAC_ENDUNG}"))
    return dateien


def veraltet(wurzel: Path, vermerk: dict[str, dict[str, str]]) -> list[Path]:
    """AAC-Dateien ohne passende Opus-Fassung (fehlt, oder das AAC änderte sich seitdem)."""
    return [
        d
        for d in tondateien(wurzel)
        if not opuspfad(d).exists() or vermerk.get(schluessel(d, wurzel), {}).get("aac") != pruefsumme(d)
    ]


def _aus_aac(wurzel: Path, m4a: Path) -> tuple[str, dict[str, str]]:
    """Eine Opus-Fassung aus dem AAC; Ausgabe: Eintrag für den Vermerk."""
    kanaele, kbit = miss_quelle(m4a)
    ordner = m4a.relative_to(wurzel).parts[0]
    subprocess.run(befehl(m4a, opuspfad(m4a), bitrate(ordner, kanaele, kbit)), check=True)
    return schluessel(m4a, wurzel), {"aac": pruefsumme(m4a), "aus": "aac"}


def erneuere(wurzel: Path) -> list[Path]:
    """Baut alle fehlenden oder veralteten Fassungen aus dem AAC, entfernt verwaiste ``.webm``.

    Ausgabe: die neu gebauten AAC-Quellen.
    """
    vermerk = lies_vermerk(wurzel)
    offen = veraltet(wurzel, vermerk)
    with ThreadPoolExecutor(GLEICHZEITIG) as pool:
        for pfad, eintrag in pool.map(lambda d: _aus_aac(wurzel, d), offen):
            vermerk[pfad] = eintrag
    vorhanden = {schluessel(d, wurzel) for d in tondateien(wurzel)}
    for pfad in [p for p in vermerk if p not in vorhanden]:
        opuspfad(wurzel / pfad).unlink(missing_ok=True)
        del vermerk[pfad]
    schreibe_vermerk(wurzel, vermerk)
    return offen


def groessen(wurzel: Path) -> tuple[int, int]:
    """Bytes aller AAC- und aller Opus-Fassungen (für den Bericht)."""
    dateien = tondateien(wurzel)
    aac = sum(d.stat().st_size for d in dateien)
    opus = sum(opuspfad(d).stat().st_size for d in dateien if opuspfad(d).exists())
    return aac, opus


def main() -> None:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    teile = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    teile.add_argument("privat", type=Path, help="Pfad zu schach-abenteuer-inhalte (oder dessen spiel/)")
    teile.add_argument("--pruefen", action="store_true", help="nur melden, was fehlt oder veraltet ist")
    args = teile.parse_args()
    wurzel = args.privat / "spiel" if (args.privat / "spiel").is_dir() else args.privat
    if args.pruefen:
        rest = veraltet(wurzel, lies_vermerk(wurzel))
        for datei in rest:
            print(f"veraltet oder fehlend: {schluessel(datei, wurzel)}")
        print(f"{len(rest)} von {len(tondateien(wurzel))} ohne passende Opus-Fassung")
        raise SystemExit(1 if rest else 0)
    neu = erneuere(wurzel)
    aac, opus = groessen(wurzel)
    print(
        f"{len(neu)} Opus-Fassungen gebaut; AAC {aac / 1e6:.1f} MB, Opus {opus / 1e6:.1f} MB "
        f"({(1 - opus / aac) * 100 if aac else 0:.0f} % kleiner)"
    )


if __name__ == "__main__":
    main()
