"""Tests für pipeline/abenteuer/ton/opusfassung.py: Bitraten, Befehle, Vermerk, veraltete Fassungen.

Der letzte Test baut eine echte Fassung und läuft nur, wenn ffmpeg mit libopus da ist.
"""

import shutil
import subprocess
from pathlib import Path

import pytest

from pipeline.abenteuer.ton import opusfassung as of


def test_bitraten_je_ordner_und_kanal_nie_ueber_der_quelle():
    assert of.bitrate("musik", 2, 80) == 64
    assert of.bitrate("musik", 1, 80) == 48
    assert of.bitrate("klang", 2, 64) == 48
    assert of.bitrate("klang", 1, 64) == 32
    # Leise Quelle mit 24 kbit/s: nicht aufblähen; nie unter der Untergrenze.
    assert of.bitrate("klang", 1, 24) == 24
    assert of.bitrate("musik", 1, 8) == of.UNTERSTE_BITRATE
    assert of.bitrate("musik", 2, None) == 64


def test_befehl_schreibt_opus_in_webm_mit_begrenzter_bitrate():
    befehl = of.befehl(Path("a.m4a"), Path("a.webm"), 48, mono=True)
    assert befehl[0] == "ffmpeg" and befehl[-1] == "a.webm"
    assert befehl[befehl.index("-c:a") + 1] == "libopus"
    assert befehl[befehl.index("-b:a") + 1] == "48k"
    assert befehl[befehl.index("-vbr") + 1] == "constrained"
    assert befehl[befehl.index("-f") + 1] == "webm"
    assert befehl[befehl.index("-ac") + 1] == "1"


def test_pfade_und_spielwurzel():
    datei = Path("/p/spiel/musik/akt2/ambrose.cello.m4a")
    assert of.opuspfad(datei).name == "ambrose.cello.webm"
    assert of.spielwurzel(datei) == Path("/p/spiel")
    assert of.schluessel(datei, Path("/p/spiel")) == "musik/akt2/ambrose.cello.m4a"
    # Hörproben und Arbeitsordner liegen nicht unter musik/ oder klang/.
    assert of.spielwurzel(Path("/p/hoerprobe/maple.m4a")) is None


def test_veraltet_ohne_fassung_oder_mit_geaendertem_aac(tmp_path: Path):
    (tmp_path / "klang" / "akt2").mkdir(parents=True)
    (tmp_path / "musik").mkdir()
    alt = tmp_path / "klang" / "akt2" / "regen.m4a"
    neu = tmp_path / "musik" / "weg.m4a"
    alt.write_bytes(b"regen")
    neu.write_bytes(b"weg")
    of.opuspfad(alt).write_bytes(b"opus")
    of.opuspfad(neu).write_bytes(b"opus")
    vermerk = {"klang/akt2/regen.m4a": {"aac": of.pruefsumme(alt), "aus": "aac"}}
    assert of.veraltet(tmp_path, vermerk) == [neu]
    alt.write_bytes(b"neues regen")
    assert set(of.veraltet(tmp_path, vermerk)) == {alt, neu}


def test_vermerk_sortiert_und_lesbar(tmp_path: Path):
    of.schreibe_vermerk(tmp_path, {"musik/b.m4a": {"aac": "2"}, "klang/a.m4a": {"aac": "1"}})
    text = (tmp_path / of.VERMERK).read_text(encoding="utf-8")
    assert text.index("klang/a.m4a") < text.index("musik/b.m4a")
    assert of.lies_vermerk(tmp_path)["musik/b.m4a"] == {"aac": "2"}
    assert of.lies_vermerk(tmp_path / "fehlt") == {}


def _mit_libopus() -> bool:
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        return False
    liste = subprocess.run(["ffmpeg", "-hide_banner", "-encoders"], capture_output=True, text=True).stdout
    return "libopus" in liste


@pytest.mark.skipif(not _mit_libopus(), reason="braucht ffmpeg mit libopus")
def test_erneuere_baut_fassung_vermerkt_und_raeumt_verwaiste_auf(tmp_path: Path):
    klang = tmp_path / "klang"
    klang.mkdir()
    quelle = klang / "ton.m4a"
    erzeuge = "ffmpeg -y -v error -f lavfi -i sine=frequency=440:duration=0.5 -c:a aac -b:a 64k"
    subprocess.run([*erzeuge.split(), str(quelle)], check=True)
    (klang / "weg.webm").write_bytes(b"verwaist")
    of.schreibe_vermerk(tmp_path, {"klang/weg.m4a": {"aac": "x", "aus": "aac"}})
    assert of.erneuere(tmp_path) == [quelle]
    assert of.opuspfad(quelle).read_bytes()[:4] == b"\x1a\x45\xdf\xa3"  # WebM (EBML)
    assert not (klang / "weg.webm").exists()
    assert of.lies_vermerk(tmp_path) == {"klang/ton.m4a": {"aac": of.pruefsumme(quelle), "aus": "aac"}}
    assert of.veraltet(tmp_path, of.lies_vermerk(tmp_path)) == []
