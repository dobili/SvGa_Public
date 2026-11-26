"""Dauertest der Auftrittsprüfung (pipeline/abenteuer/auftritt.py).

Warum: Befund des Autors (26.11.2026): Nach der gewonnenen Partie gegen den Coach standen Hale und
{rivale} plötzlich im Clubraum, der Dialog erzählte erst danach, wie sie hereinkommen; nach der Partie
gegen {rivale} blieben beide vor der Tür stehen. Wer kommt oder geht, während der Held da ist, tut es
sichtbar: allgemein durch den nächsten Übergang (app/src/abenteuer/regeln/auftritt.ts) oder mit dem
``#gehe`` der Erzählzeile. Ziel und Stand: 0 Befunde.
"""

from pipeline.abenteuer.auftritt import (
    Kartenlage,
    _ausgangsart,
    befunde,
    funde,
    gesetzte_variablen,
    kann_kommen,
)
from pipeline.abenteuer.auftritt_geprueft import GEPRUEFT


def test_keine_befunde():
    """Jede Stelle im ganzen Spiel ist behoben oder mit Grund in GEPRUEFT."""
    offen = [f"{f.schluessel}  {f.text[:90]}" for f in befunde(funde())]
    assert offen == [], "beheben oder mit Grund in auftritt_geprueft.GEPRUEFT:\n" + "\n".join(offen)


def test_eintraege_gibt_es_noch():
    """Jeder Eintrag in GEPRUEFT trifft noch einen Fund (sonst ist er veraltet)."""
    schluessel = {f.schluessel for f in funde()}
    assert [s for s in GEPRUEFT if s not in schluessel] == []


def test_clubraum_victor_kommt_mit_gehe():
    """Hale und {rivale} warten in der Tür und kommen mit dem #gehe der Erzählzeile herein."""
    stellen = {f.schluessel for f in funde() if f.pruefung == "erzaehlt"}
    assert not any("victor_trifft" in s for s in stellen)


def test_ergebnisse_setzen_variablen():
    """Partie, Runde und Fund setzen die Variablen der Hülle (regeln/dialogvariablen.ts)."""
    partie = gesetzte_variablen('~ beginnePartie("mapleFalls.clubkampf")')
    assert {"ausgangMapleFallsClubkampf", "nadelMapleFalls"} <= partie
    assert "reiheSamBestanden" in gesetzte_variablen('~ beginneAufgaben("mapleFalls.reiheSam")')
    assert gesetzte_variablen("~ kenntHale = true") == {"kenntHale"}


def test_kommen_und_gehen():
    """Die Richtung eines Umschlags: Juno kommt mit clubBeigetreten, Pratt geht mit dem Heimweg."""
    juno = "clubBeigetreten und (nicht aufbruchGesehen oder endeAkt1Gesehen)"
    assert kann_kommen(juno, "clubBeigetreten", (True,))
    pratt = "nadelMapleFalls > 0 und nicht heimwegNadelGesehen"
    assert not kann_kommen(pratt, "heimwegNadelGesehen", (True,))


def test_ausgang_und_davor():
    """Ein #gehe in den Übergang führt hinaus, eines auf das Feld davor nicht."""
    lage = Kartenlage({"schule": {(13, 14), (14, 14)}}, {"prattClub"})
    assert _ausgangsart("schule", lage) == "hinein"
    assert _ausgangsart("14,14", lage) == "hinein"
    assert _ausgangsart("13,13", lage) == "davor"
    assert _ausgangsart("9,3", lage) is None
