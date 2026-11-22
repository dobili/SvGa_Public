"""Tests für pipeline/abenteuer/ton/lautheit.py (Klangplan A0.6, gleichmäßige Lautheit).

Ohne numpy oder scipy (GitHub Actions hat nur pipeline/requirements.txt) übersprungen. Die
Hörproben im privaten Repository werden gemessen, wo sie vorliegen, sonst übersprungen.
"""

from pathlib import Path

import pytest

np = pytest.importorskip("numpy")
pytest.importorskip("scipy")

from pipeline.abenteuer.ton import lautheit as L  # noqa: E402

SEKUNDEN = 20
HZ = 440.0
PRIVAT = Path(__file__).resolve().parents[2].parent / "schach-abenteuer-inhalte"
PROBE = PRIVAT / "hoerprobe" / "ortsthemen"
# Probestücke, die keine Schleifen sind (Demos): nur Spitze und Ausreißer zählen.
EINMAL = {"mapleFalls.allein.m4a"}


def _ton(pegel: float = 0.1, sekunden: int = SEKUNDEN):
    t = np.arange(int(sekunden * L.RATE)) / L.RATE
    welle = (pegel * np.sin(2 * np.pi * HZ * t)).astype(np.float32)
    return np.stack([welle, welle], axis=1)


def test_gleichmaessiger_ton_haelt_alle_grenzen():
    m = L.miss(_ton(), "sinus")
    assert m.lra < 1 and m.p98_ueber_median < 1 and m.naht_lu < 1
    assert m.verstoesse == []


def test_ein_lauter_ton_wird_mit_zeitpunkt_gemeldet():
    ton = _ton()
    beginn = int(10 * L.RATE)
    ton[beginn : beginn + L.RATE // 2] *= 4
    m = L.miss(ton, "spitze")
    assert any(v.startswith("Ausreißer bei 9.") or v.startswith("Ausreißer bei 10.") for v in m.verstoesse)


def test_verdichter_und_ziel_bringen_den_ausreisser_unter_die_grenze():
    ton = _ton()
    beginn = int(10 * L.RATE)
    ton[beginn : beginn + L.RATE // 2] *= 4
    geglaettet = ton * L.verdichtungskurve(ton)
    geglaettet = geglaettet * L.zielfaktor(geglaettet)
    m = L.miss(geglaettet, "geglättet")
    assert abs(m.lufs - L.ZIEL_LUFS) < 1
    assert m.p98_ueber_median <= L.GRENZE_P98


@pytest.mark.skipif(not PROBE.exists(), reason="Hörprobe Ortsthemen liegt nicht vor")
def test_probestueck_haelt_a06():
    for datei in sorted(PROBE.glob("*.m4a")):
        m = L.miss(L.lies(datei), datei.name, L.ist_kampf(datei.name), datei.name not in EINMAL)
        assert m.verstoesse == [], f"{datei.name}: {m.verstoesse}"
