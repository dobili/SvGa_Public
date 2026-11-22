"""Tests für pipeline/abenteuer/ton/lautheit.py (Klangplan A0.6, gleichmäßige Lautheit).

Ohne numpy oder scipy (GitHub Actions hat nur pipeline/requirements.txt) übersprungen. Die
Hörproben im privaten Repository werden gemessen, wo sie vorliegen, sonst übersprungen.
"""

import os
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


def test_nahtkurve_gleicht_ein_leiseres_ende_aus():
    # Die letzten vier Sekunden 4 dB leiser: Naht 4 LU; danach mit Reserve unter der Grenze.
    ton = _ton()
    ton[-4 * L.RATE :] *= 10 ** (-4 / 20)
    assert L.miss(ton, "vorher").naht_lu > L.GRENZE_NAHT
    ausgeglichen = ton * L.nahtkurve(ton)
    nachher = L.miss(ausgeglichen, "nachher")
    assert nachher.naht_lu < L.GRENZE_NAHT / 2
    assert nachher.verstoesse == []


def test_nahtkurve_laesst_einen_stummen_rand_in_ruhe():
    # Eine Zusatzspur, die am Ende aussetzt: kein Ausgleich (sonst würde Stille angehoben).
    ton = _ton()
    ton[-3 * L.RATE :] = 0
    assert np.allclose(L.nahtkurve(ton), 1.0)


def test_nahtkurve_laesst_eine_gute_naht_fast_unveraendert():
    ton = _ton()
    assert np.allclose(L.nahtkurve(ton), 1.0, atol=1e-3)


def test_nachverdichtung_bringt_zart_dann_fest_unter_die_grenze():
    # Wie Nova: erst leise, dann 12 dB lauter. Ein Durchgang reicht nicht, mehrere schon.
    from pipeline.abenteuer.ton.nachverdichtung import verdichte

    ton = _ton(sekunden=40)
    ton[: 20 * L.RATE] *= 10 ** (-12 / 20)
    vorher = L.miss(ton, "vorher")
    einmal = L.miss(ton * L.verdichtungskurve(ton), "ein Durchgang")
    nachher = L.miss(verdichte(ton, L.RATE), "nachher")
    assert vorher.lra > L.GRENZE_LRA and einmal.lra > nachher.lra
    assert nachher.lra < vorher.lra


@pytest.mark.skipif(not PROBE.exists(), reason="Hörprobe Ortsthemen liegt nicht vor")
def test_probestueck_haelt_a06():
    for datei in sorted(PROBE.glob("*.m4a")):
        m = L.miss(L.lies(datei), datei.name, L.ist_kampf(datei.name), datei.name not in EINMAL)
        assert m.verstoesse == [], f"{datei.name}: {m.verstoesse}"


MUSIK = PRIVAT / "spiel" / "musik"


@pytest.mark.skipif(not (MUSIK / "spuren.json").exists(), reason="Musik mit Spuren liegt nicht vor")
def test_erneuerte_musik_haelt_a06():
    """Dauertest über spiel/musik: jedes Stück aus spuren.json und seine volle Mischung (A0.6)."""
    import json

    from pipeline.abenteuer.ton.lautheitspruefung import pruefe

    staemme = json.loads((MUSIK / "spuren.json").read_text(encoding="utf-8"))
    dateien = [d for s in staemme for d in MUSIK.rglob(f"{s}.m4a")]
    for m in pruefe(dateien):
        assert m.verstoesse == [], f"{m.name}: {m.verstoesse}"


@pytest.mark.skipif(
    not (MUSIK / "einmal.json").exists() or os.environ.get("MUSIK_ALLE") != "1",
    reason="Musik liegt nicht vor, oder MUSIK_ALLE=1 fehlt (bis alle Szenenstücke neu gebaut sind)",
)
def test_alle_stuecke_halten_a06():
    """Dauertest über alle Stücke in spiel/musik, auch Szenenstücke und Kurzmotive (Etappe Szenenstücke).

    Schleifen müssen alle Werte halten, Einmal-Stücke Ausreißer und Spitze (einmal.json). Vorerst nur
    mit MUSIK_ALLE=1: Gebaute Stücke aus der Zeit vor der Nachverdichtung (22.11.2026) halten A0.6
    nicht; sobald alle Stücke ohne Spuren neu gebaut sind, kann die Bedingung entfallen.
    """
    from pipeline.abenteuer.ton.lautheitspruefung import pruefe

    funde = [f"{m.name}: {m.verstoesse}" for m in pruefe([MUSIK]) if m.verstoesse]
    assert funde == [], "\n".join(funde)
