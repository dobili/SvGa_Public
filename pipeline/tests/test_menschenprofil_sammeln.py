"""Tests des Sammlers für das Menschenprofil: PGN mit Uhrzeiten lesen, Bänder, Auswahl."""

from pipeline.menschenprofil.sammeln import Bestand, band_von, partien, zuege_und_uhren

ZUGTEXT = (
    "1. e4 { [%clk 0:05:00] } 1... e5 { [%clk 0:04:58] } 2. Nf3?! { [%clk 0:04:57.5] } "
    "2... Nc6 { [%clk 0:04:50] } 1-0"
)


def test_zuege_und_uhren():
    zuege, uhren = zuege_und_uhren(ZUGTEXT)
    assert zuege == ["e4", "e5", "Nf3", "Nc6"]
    assert uhren == [30000, 29800, 29750, 29000]


def test_band():
    assert band_von(1234) == 1200
    assert band_von(399) is None
    assert band_von(2600) is None


def _pgn(halbzuege: int, event: str = "Rated Blitz game") -> list[str]:
    paare = " ".join(
        f"{i}. Nf3 {{ [%clk 0:03:00] }} {i}... Nf6 {{ [%clk 0:03:00] }} {i + 1}. Ng1 {{ [%clk 0:02:59] }} "
        f"{i + 1}... Ng8 {{ [%clk 0:02:59] }}"
        for i in range(1, halbzuege // 2, 2)
    )
    return [
        f'[Event "{event}"]',
        '[Site "https://lichess.org/abcd1234"]',
        '[WhiteElo "1210"]',
        '[BlackElo "1650"]',
        '[WhiteRatingDiff "+5"]',
        '[TimeControl "180+2"]',
        '[Termination "Normal"]',
        "",
        paare + " 1/2-1/2",
        "",
    ]


def test_partien_und_bestand(tmp_path):
    gefunden = list(partien(_pgn(24) + _pgn(24, "Casual Blitz game") + _pgn(6)))
    assert len(gefunden) == 1
    partie = gefunden[0]
    assert (partie["tempo"], partie["start"], partie["zuschlag"]) == ("blitz", 180, 2)
    assert len(partie["zuege"]) == len(partie["uhren"]) >= 20
    bestand = Bestand(tmp_path, je_band=1)
    assert bestand.nimm(partie)
    assert not bestand.nimm(partie)
    assert bestand.zahl[("blitz", 1200)] == 1 and bestand.zahl[("blitz", 1600)] == 1
