"""Tests des Figurstils (pipeline/abenteuer/figurstil.py): chibi oder realistisch.

Die Messung von Hand (GEMESSEN) ist die Grundlage; die Tests laufen ohne das private Grafikpaket.
Liegt es lokal unter FIGURSTIL_FIGUREN (Ordner figuren-neu), prüft ein weiterer Test, dass jede
PixelLab-Figur vermessen ist.
"""

import os
from pathlib import Path

import pytest

Image = pytest.importorskip("PIL.Image")  # misst Bilder; ohne Pillow (Actions) übersprungen

from pipeline.abenteuer import figurstil as f  # noqa: E402


def test_einteilung_nach_kopfanteil():
    assert f.einteilung(0.52) == "chibi"
    assert f.einteilung(0.44) == "chibi"
    assert f.einteilung(0.42) == "grenzfall"
    assert f.einteilung(0.32) == "realistisch"


def test_kopfanteil_ambrose():
    assert round(f.kopfanteil(*f.GEMESSEN["ambrose"][:3]), 2) == 0.32


def test_messungen_sind_stimmig():
    for name, (scheitel, kinn, sohle, urteil) in f.GEMESSEN.items():
        assert 0 <= scheitel < kinn < sohle < 32, name
        assert urteil is None or urteil.split(":")[0] in {"chibi", "realistisch", "grenzfall"}, name


def test_realistisch_sind_ambrose_und_carla():
    """Befund vom 21.11.2026: die Frau mit Dutt und Jeansjacke ist Carla, nicht Juno."""
    leer = Image.new("RGBA", (32, 32))
    stufen = {name: f.miss(name, leer).einteilung for name in f.GEMESSEN}
    assert sorted(n for n, s in stufen.items() if s == "realistisch") == [
        "ambrose",
        "ambrose-jung",
        "carla",
        "skater-jo",
    ]
    assert stufen["juno"] == stufen["held-0"] == stufen["coach-delgado"] == "chibi"


def test_ungemessene_figur_bekommt_lineal(tmp_path: Path):
    bild = Image.new("RGBA", (32, 32))
    bild.paste((200, 50, 50, 255), (12, 4, 20, 30))
    assert f.miss("neu", bild).einteilung == "ungemessen"
    blatt = f.lineal(bild, "neu")
    assert blatt.width > 32 * f.LINEAL_ZOOM


def test_farbwerte_kontur_und_saettigung():
    bild = Image.new("RGBA", (32, 32))
    bild.paste((0, 0, 0, 255), (10, 10, 20, 20))
    bild.paste((255, 0, 0, 255), (11, 11, 19, 19))
    kontur, saettigung = f.farbwerte(bild)
    assert kontur == 1.0 and 0.5 < saettigung < 1.0


@pytest.mark.skipif(not os.environ.get("FIGURSTIL_FIGUREN"), reason="privates Paket nicht da")
def test_jede_pixellab_figur_ist_vermessen():
    ordner = Path(os.environ["FIGURSTIL_FIGUREN"])
    namen = {p.name for p in ordner.iterdir() if (p / "rotations" / "south.png").exists()}
    assert sorted(namen - set(f.GEMESSEN)) == []


# ---------- Teil 2 bis 4: Vorbild Coach, Alter und Höhe, Animationen, Plan ----------
from pipeline.abenteuer import figurstil_bedarf as b  # noqa: E402
from pipeline.abenteuer import figurstil_plan as plan  # noqa: E402


def test_altersgruppe_aus_dem_prompt():
    assert b.altersgruppe("14 year old girl, short") == "Jugendlich"
    assert b.altersgruppe("8 year old girl") == "Kind"
    assert b.altersgruppe("Latina woman in her late thirties") == "Erwachsen"
    assert b.altersgruppe("old woman about 79") == "Alt"
    assert b.altersgruppe("man about 35") == "Erwachsen"


def test_prompts_rollen_und_kennungen():
    prompts = b.lies_prompts()
    assert prompts["held-0"].rolle == "Hauptfigur" and prompts["held-0"].alter == "Jugendlich"
    assert prompts["coach-delgado"].rolle == "Hauptfigur"
    assert prompts["abernathy"].rolle == "Nebenfigur"
    assert prompts["statist.kindA"].rolle == "Statist"
    assert b.kebab("omaRuth") == "oma-ruth"


def test_nutzung_aus_szenen_und_ink():
    nutzung = b.lies_nutzung()
    assert "rechts" in nutzung["sam"].sitzt  # sitzt im Clubraum am Brett
    assert nutzung["held-0"].liegt  # #stelle:held>…>liegt (Bett)
    assert nutzung["ambrose"].geist


def test_animationen_pflicht_und_bedarf():
    pflicht, noetig, _ = b.animationen("sam", b.Nutzung(sitzt={"rechts"}))
    assert len(pflicht) == 2 and noetig == ["Sitzen rechts"]
    assert plan.sitz_richtungen({"links", "rechts"}) == 1
    assert plan.sitz_richtungen({"oben", "unten", "links"}) == 3


def test_neuer_prompt_im_stil_des_coachs():
    alt = (
        "man about 35, thin, upright, long charcoal coat, black boots, slightly stylized proportions with "
        "a larger head (about one third of the body height), detailed face, soft shading"
    )
    neu = b.neuer_prompt(alt, "Erwachsen")
    assert "thin" not in neu and "long" not in neu and "one third" not in neu
    assert neu.endswith(b.COACH_SCHLUSS) and len(neu) <= b.PROMPT_HOECHSTENS
    assert "black boots" in neu and b.vollstaendig(alt, neu)
    assert "stooped" in b.neuer_prompt("old man about 80, kind, tweed jacket", "Alt")
    assert all(
        len(b.neuer_prompt(e.prompt, e.alter)) <= b.PROMPT_HOECHSTENS for e in b.lies_prompts().values()
    )


def _messung(name, kopf, hoehe, sattig=0.58, kontur=0.93, farben=52):
    stufe = f.einteilung(kopf)
    return f.Messung(name, kopf, stufe, kontur, sattig, f.rolle(name), None, farben, hoehe)


def test_gruppen_zum_coach():
    coach = _messung("coach-delgado", 0.47, 31)
    assert b.gruppe_zum_coach(_messung("sam", 0.50, 30), coach) == "wie der Coach"
    assert b.gruppe_zum_coach(_messung("juno", 0.54, 27), coach) == "nah dran"
    assert b.gruppe_zum_coach(_messung("ambrose", 0.32, 31), coach) == "anders"


def test_hoehenbefund_kind_groesser_als_erwachsener():
    prompts = b.lies_prompts()
    messungen = [
        _messung("clover", 0.48, 30),
        _messung("calloway", 0.45, 29),
        _messung("coach-delgado", 0.47, 31),
    ]
    befunde = plan.hoehenbefunde(messungen, prompts)
    assert befunde == ["clover (Kind, 30 px) ist größer als calloway"]


def test_reihenfolge_hauptfiguren_zuerst_ambrose_zuletzt():
    prompts, nutzung = b.lies_prompts(), b.lies_nutzung()
    plaene = [
        plan.plane("ambrose", "PixelLab", "anders", prompts, nutzung),
        plan.plane("victor-pullover", "PixelLab", "anders", prompts, nutzung),
        plan.plane("carla", "PixelLab", "anders", prompts, nutzung),
        plan.plane("statist.kindA", "Typ", "anders", prompts, nutzung),
    ]
    stufen = plan.reihenfolge(plaene)
    assert stufen[0][1][0].name == "victor-pullover"
    assert stufen[-1][1][0].name == "ambrose"
    assert any(p.name == "statist.kindA" and p.sitz_richtungen == 3 for _, ps in stufen for p in ps)
