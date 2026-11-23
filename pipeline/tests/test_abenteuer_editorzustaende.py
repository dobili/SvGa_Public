"""Editor 1.9: Vorschauen der Zustände und Standbilder im Editorpaket, Bericht des Rückwegs."""

import json

import pytest

Image = pytest.importorskip("PIL.Image")

from pipeline.abenteuer import editorzustaende  # noqa: E402 (braucht Pillow)

RICHTUNGEN = ("east", "north", "west", "south")


def _rotationen(ordner, farbe):
    (ordner / "rotations").mkdir(parents=True)
    for r in RICHTUNGEN:
        bild = Image.new("RGBA", (32, 32))
        for y in range(10, 30):
            for x in range(12, 20):
                bild.putpixel((x, y), farbe)
        bild.save(ordner / "rotations" / f"{r}.png")


def test_personenzustaende_mit_standbildern_und_boden(tmp_path):
    figur = tmp_path / "spiel" / "figuren-neu" / "abe"
    _rotationen(figur, (200, 30, 30, 255))
    _rotationen(figur / "zustaende" / "sitzboden", (30, 200, 30, 255))
    _rotationen(figur / "standbilder" / "ohne-teleskop", (30, 30, 200, 255))
    liste = [
        {"kennung": "idle", "name": "Idle", "standard": True},
        {"kennung": "ohne-teleskop", "name": "Without telescope", "standard": False},
    ]
    (figur / "standbilder.json").write_text(json.dumps(liste), encoding="utf-8")
    ergebnis = editorzustaende.personenzustaende(tmp_path, {"figuren/abe.png"})["figuren/abe.png"]
    assert len(ergebnis["sitzboden"]) == 4
    assert "sitzstuhl" not in ergebnis
    assert [s["kennung"] for s in ergebnis["standbilder"]] == ["idle", "ohne-teleskop"]
    assert all(b.startswith("data:image/png;base64,") for b in ergebnis["standbilder"][1]["bilder"])


def test_tierarten_der_szene():
    szene = {"belebung": [{"name": "kuhWeide", "typ": "tier"}, {"name": "gast", "typ": "statist"}]}
    assert editorzustaende.tierarten_der_szene(szene) == {"kuhWeide": "kuh"}
