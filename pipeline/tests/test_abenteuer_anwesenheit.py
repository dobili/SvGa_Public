"""Dauertest der Anwesenheitsprüfung (pipeline/abenteuer/anwesenheit.py).

Warum: Befund des Autors (25.11.2026): Dialoge passten „ganz häufig“ nicht zu Ort und Anwesenden
(Hector redete im Wohnzimmer, Mama sprach im Zimmer des Helden, ohne dort zu stehen). Regel des
Autors: Wer spricht oder im Text vorkommt, ist anwesend. Die offenen Funde dürfen nur weniger werden
(OBERGRENZE senken, sobald Stellen behoben sind); Akt 1 ist vollständig angesehen.
"""

from pipeline.abenteuer.anwesenheit import SCHAUPLATZ, funde, offene
from pipeline.abenteuer.anwesenheit_geprueft import GEMELDET, GEPRUEFT

# Offene Funde (ohne Grund in GEPRUEFT); darf nur sinken. Stand 25.11.2026 nach Akt 1.
OBERGRENZE = 147


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
