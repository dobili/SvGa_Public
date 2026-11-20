"""Tests für pipeline/abenteuer/ton/codecprobe.py: Befehle und Seite der Hörprobe (ohne ffmpeg)."""

from pathlib import Path

from pipeline.abenteuer.ton.codecprobe import PROBEN, Probe, befehle, fassungen, seite

PROBE = Probe("maple", "Maple Falls", "musik/maple-falls.m4a", 10, 20, ("64k", "48k"))


def test_aac_bleibt_unveraendert_und_opus_je_bitrate():
    liste = befehle(PROBE, Path("/spiel"), Path("/ziel"))
    assert len(liste) == 3
    assert liste[0][-3:] == ["-c", "copy", "/ziel/maple-aac.m4a"]
    assert "libopus" in liste[1] and "64k" in liste[1] and liste[1][-1] == "/ziel/maple-opus64k.webm"
    # Begrenzte variable Bitrate, damit die Größe zur Angabe passt.
    assert liste[2][liste[2].index("-vbr") + 1] == "constrained"
    assert all(b[b.index("-ss") + 1] == "10" and b[b.index("-t") + 1] == "20" for b in liste)


def test_fassungen_nennen_das_heutige_format():
    assert fassungen(PROBE)[0] == ("AAC 80k (heute)", "maple-aac.m4a")
    geraeusch = Probe("fluss", "Fluss", "klang/fluss.m4a", 5, 15, ("40k",))
    assert fassungen(geraeusch)[0][0] == "AAC 64k (heute)"


def test_seite_hat_je_fassung_einen_knopf_mit_groesse():
    html = seite(PROBEN, {"maple-aac.m4a": 205 * 1024})
    assert html.count('class="spiel"') == sum(len(fassungen(p)) for p in PROBEN)
    assert 'data-datei="maple-opus48k.webm"' in html
    assert "205 KB" in html
    assert "decodeAudioData" in html  # spielt wie das Spiel über Web Audio
