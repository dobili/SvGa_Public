"""Tests für die Prüfhilfe der Freigabe (AP 4) mit dem eigenen Testkapitel."""

import json
from pathlib import Path

from pipeline.tests.test_zugfolgen import TESTKAPITEL, _spiele
from pipeline.zugfolgen.freigabe import (
    Kapitelpruefhilfe,
    lies_einschaetzungen,
    schreibe_freigabeuebersicht,
    schreibe_pruefhilfe,
)
from pipeline.zugfolgen.pgn import schreibe_entwurf


def _hilfe():
    ergebnis = _spiele()
    hilfe = Kapitelpruefhilfe(10, "Zugfolgen im Test", TESTKAPITEL.name, ergebnis.beispiele, [])
    return hilfe, ergebnis.befunde


def _einschaetzungen(tmp_path):
    pfad = tmp_path / "einschaetzungen.json"
    eintrag = {
        "datei": TESTKAPITEL.name,
        "kennung": "unterschrift-stellung",
        "enthaelt": "4. Dxd4",
        "urteil": "Buchfehler",
        "begruendung": "Weiß schlägt mit dem Springer.",
        "vorschlag": "Unterschrift: „Nach 4. Sxd4“.",
    }
    erledigt = eintrag | {"enthaelt": "gibt es nicht mehr"}
    pfad.write_text(json.dumps({"einschaetzungen": [eintrag, erledigt]}), encoding="utf-8")
    return lies_einschaetzungen(pfad)


def test_pruefhilfe_in_deutscher_notation_mit_abbildungen_und_abzweigungen(tmp_path):
    hilfe, befunde = _hilfe()
    for beispiel in hilfe.beispiele:
        schreibe_entwurf(beispiel, tmp_path / "zugfolgen")
    pfad = schreibe_pruefhilfe(
        hilfe,
        befunde,
        _einschaetzungen(tmp_path),
        tmp_path / "zugfolgen",
        tmp_path / "freigabe",
        "2026-10-13",
    )
    text = pfad.read_text(encoding="utf-8")
    assert "Hauptlinie: 1. e4 e5 2. Sf3 **[Abb. 10.1]** 2... Sc6 3. Lb5 **[Abb. 10.2]** 3... a6" in text
    assert "- statt 2... Sc6: 2... d6 3. d4 exd4 4. Sxd4 **[Abb. 10.7, 10.8]** · Z. " in text
    # Relative Zählung bleibt sichtbar wie im Buch: Die Stellung steht beim 20. Zug.
    assert "Start: Abb. 10.6, Weiß am Zug (Zug 20)" in text
    assert "Hauptlinie: 20. Te8+! Txe8 21. Txe8#" in text
    assert "- Warnung (unterschrift-stellung, Abb. 10.8, Z. " in text
    assert "  - **Buchfehler.** Weiß schlägt mit dem Springer." in text
    assert "| [k10-a1](#k10-a1) | 10.1 |" in text and "| entwurf |" in text
    assert "Bereits freigegeben" not in text


def test_freigabeuebersicht_zaehlt_offene_warnungen(tmp_path):
    hilfe, befunde = _hilfe()
    pfad = schreibe_freigabeuebersicht([hilfe], befunde, _einschaetzungen(tmp_path), tmp_path, "2026-10-13")
    text = pfad.read_text(encoding="utf-8")
    # Zwei Warnungen (Unterschrift 10.8, „1. Th8+“ ohne Anschluss), eine davon eingeschätzt.
    assert "| [10: Zugfolgen im Test](kap10.md) | 4 | 3 | 2 | 1 |" in text
    assert "„gibt es nicht mehr“" in text and "„4. Dxd4“" not in text


def test_einschaetzungen_im_repository_sind_lesbar():
    pfad = Path(__file__).resolve().parents[2] / "inhalte" / "de" / "einschaetzungen.json"
    eintraege = lies_einschaetzungen(pfad)
    assert eintraege
    assert all(e.datei.endswith(".tex") and e.urteil and e.begruendung and e.vorschlag for e in eintraege)
