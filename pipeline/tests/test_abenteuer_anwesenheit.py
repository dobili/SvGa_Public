"""Dauertest der Anwesenheitsprüfung (pipeline/abenteuer/anwesenheit.py).

Warum: Befund des Autors (25.11.2026): Dialoge passten „ganz häufig“ nicht zu Ort und Anwesenden
(Hector redete im Wohnzimmer, Mama sprach im Zimmer des Helden, ohne dort zu stehen). Regel des
Autors: Wer spricht oder im Text vorkommt, ist anwesend. Die offenen Funde dürfen nur weniger werden
(OBERGRENZE senken, sobald Stellen behoben sind); Akt 1 ist vollständig angesehen.
"""

import re
from pathlib import Path

from pipeline.abenteuer.anwesenheit import BEGLEITUNG, SCHAUPLATZ, funde, offene
from pipeline.abenteuer.anwesenheit_geprueft import GEMELDET, GEPRUEFT

# Offene Funde (ohne Grund in GEPRUEFT); darf nur sinken. Stand 26.11.2026: Akt 1 behoben, Juno ab
# Akt 2 und Mama ab Desert Springs als Begleiterinnen (orte.json, Feld begleiter).
OBERGRENZE = 89


def test_offene_funde_unter_der_obergrenze():
    """Neue Stellen, an denen jemand spricht, der nicht da ist, kommen nicht hinzu."""
    offen = offene(funde())
    liste = "\n".join(f"A{f.akt} {f.schluessel} {f.text[:80]}" for f in offen)
    assert len(offen) <= OBERGRENZE, f"{len(offen)} offen, Obergrenze {OBERGRENZE}:\n{liste}"


def test_akt1_ist_vollstaendig_angesehen():
    """In Akt 1 ist jede Stelle behoben oder mit Grund eingetragen (Auftrag 25.11.2026)."""
    offen = [f"{f.schluessel} {f.text[:80]}" for f in offene(funde()) if f.akt <= 1]
    assert offen == [], "Akt 1: beheben oder mit Grund in GEPRUEFT:\n" + "\n".join(offen)


def test_eintraege_gibt_es_noch():
    """Jeder Eintrag in GEPRUEFT trifft noch einen Fund (sonst ist er veraltet)."""
    schluessel = {f.schluessel for f in funde()}
    assert [s for s in [*GEPRUEFT, *GEMELDET] if s not in schluessel] == []


def test_muster():
    """Schauplätze: „Im Diner“ und „Das Diner …“ am Satzanfang, nicht „vor dem Diner“."""
    assert SCHAUPLATZ.search("Das Diner an der Hauptstraße ist lang und schmal.")
    assert SCHAUPLATZ.search("Im Diner riecht es nach Kaffee.")
    assert not SCHAUPLATZ.search("Vor dem Diner parkt ein Pick-up.")


def test_begleiter_werden_in_ink_gesetzt():
    """Jeder Begleiter der Prüfung wird in Ink gesetzt (`~ begleiter = "juno"`), sonst ist er veraltet."""
    ordner = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "dialoge" / "de"
    gesetzt = {
        m.group(1)
        for datei in ordner.glob("*.ink")
        for m in re.finditer(r'~\s*begleiter\s*=\s*"(\w+)"', datei.read_text(encoding="utf-8"))
    }
    assert set(BEGLEITUNG) <= gesetzt


def test_tagebuch_ohne_begleiter_ist_ein_fund(monkeypatch):
    """Ohne Juno als Begleiterin wäre „Mit Juno zu Fuß nach Cedar Creek gehen“ ein Fund."""
    from pipeline.abenteuer import anwesenheit

    monkeypatch.setattr(anwesenheit, "BEGLEITUNG", {})
    stellen = {f.stelle for f in anwesenheit.tagebuchfunde(anwesenheit.lade_welt())}
    assert "quest.besserWerden.schritt5" in stellen
