"""Tests für das Gemini-Stapelwerkzeug: Mappe lesen und Anfragen bauen, ohne Netz."""

import base64
import json

from pipeline.abenteuer import geminibilder as g
from pipeline.abenteuer.geminimappe import STILVORLAGE_KARTE, STILVORLAGE_PORTRAET, auftraege_lesen

PNG = b"\x89PNG-probe"
STAND = base64.b64encode(b"standbild").decode()
GEMINI = '<span class="marke gemini">Gemini</span>'
MAPPE = f"""
<section class="auftrag"><h3>{GEMINI}<span class="nr">B14</span> Porträtblatt <code>wren</code></h3>
<img class="stand" src="data:image/png;base64,{STAND}" alt="Standbild">
<div class="prompt"><pre>Schritt &amp; eins</pre></div>
<div class="prompt"><pre>Schritt zwei</pre></div></section>
<section class="auftrag"><h3><span class="marke pixellab">P</span><span class="nr">P9.1</span> Theo</h3>
<pre>x</pre></section>
<section class="auftrag" data-alt="n26"><h3>
  <span class="nr">K20</span> Kegelbahn
</h3><a href="#vorlage-K">Vorlage K</a><div class="prompt"><pre>Kegel</pre></div></section>
"""


def _auftraege(tmp_path):
    (tmp_path / "m.html").write_text(MAPPE, encoding="utf-8")
    (tmp_path / STILVORLAGE_PORTRAET).write_bytes(PNG)
    (tmp_path / STILVORLAGE_KARTE).write_bytes(b"karte")
    return auftraege_lesen(tmp_path / "m.html", tmp_path)


def test_mappe_lesen_nur_gemini(tmp_path):
    a = _auftraege(tmp_path)
    assert [(x.nr, x.titel) for x in a] == [("B14", "Porträtblatt wren"), ("K20", "Kegelbahn")]
    assert a[0].schritte == ["Schritt & eins", "Schritt zwei"]
    assert a[0].vorlagen == [PNG, b"standbild"]
    assert a[1].vorlagen == [b"karte"]


def test_schritt2_bekommt_porträt_und_blattformat(tmp_path):
    b14 = _auftraege(tmp_path)[0]
    inhalt = g.inhalt_fuer(b14, 2, b"portraet")
    teile = inhalt["contents"][0]["parts"]
    assert len(teile) == 2 and teile[-1] == {"text": "Schritt zwei"}
    assert inhalt["generationConfig"]["imageConfig"]["aspectRatio"] == "3:2"


def test_stapel_schritt2_wartet_auf_schritt1(tmp_path):
    auftraege = _auftraege(tmp_path)
    ziel = tmp_path / "ziel"
    ziel.mkdir()
    assert g.stapel_eintraege(auftraege, ziel, 2) == []
    (ziel / "B14_schritt1.png").write_bytes(b"x")
    assert [e["metadata"]["key"] for e in g.stapel_eintraege(auftraege, ziel, 2)] == ["B14"]
    assert [e["metadata"]["key"] for e in g.stapel_eintraege(auftraege, ziel, 1)] == ["K20"]


def test_abholen_speichert_bilder(tmp_path, monkeypatch):
    bild = base64.b64encode(b"fertig").decode()
    antwort = {
        "metadata": {
            "state": "BATCH_STATE_SUCCEEDED",
            "output": {
                "inlinedResponses": {
                    "inlinedResponses": [
                        {
                            "metadata": {"key": "K20"},
                            "response": {
                                "candidates": [
                                    {"content": {"parts": [{"text": "hier"}, {"inlineData": {"data": bild}}]}}
                                ]
                            },
                        }
                    ]
                }
            },
        }
    }
    monkeypatch.setattr(g, "anfrage", lambda m, p, i=None: antwort)
    merker = [{"name": "batches/1", "schritt": 1, "fertig": False, "nummern": ["K20"]}]
    (tmp_path / g.STAPELDATEI).write_text(json.dumps(merker))
    g.abholen(tmp_path)
    assert (tmp_path / "K20_schritt1.png").read_bytes() == b"fertig"
    assert json.loads((tmp_path / g.STAPELDATEI).read_text())[0]["fertig"] is True
