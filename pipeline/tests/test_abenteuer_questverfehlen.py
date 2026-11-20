"""Prüfung „Quests verfehlen“ (pipeline/abenteuer/questverfehlen.py).

Warum: Auftrag „Quests verfehlen“ (20.11.2026). Kein Start und kein Schritt einer Quest darf an
einem Auslöser hängen, den der Spieler durch ein späteres Ereignis für immer verliert (Figur nach
einem Abschied fort, Zustandskarte ohne die Figur, einmaliger Eingang), außer die Sperre folgt aus
der Quest selbst oder steht begründet in questverfehlen_geprueft.py. Der erste Test hält den Stand
der echten Daten fest, die übrigen die Regeln an kleinen Beispielen.
"""

from pipeline.abenteuer.questsperren import sperrmengen
from pipeline.abenteuer.questverfehlen import (
    AUSNAHMEN,
    GEMELDET,
    Welt,
    fassungssperren,
    pruefe,
    verneinte,
)


def test_kein_start_und_kein_schritt_ist_verpassbar():
    """Alle Starts und Schritte: sicher, folgt aus der Quest oder begründete Ausnahme."""
    offen = [str(b) for b in pruefe() if b.stufe in ("befund", "ohne")]
    assert offen == [], "Auslöser kann verloren gehen:\n" + "\n".join(offen)


def test_ausnahmen_sind_noch_noetig():
    """Jede Ausnahme und jeder gemeldete Befund gehört zu einer Stelle, die ohne sie ein Befund wäre."""
    befunde = pruefe()
    ausnahmen = {b.schluessel for b in befunde if b.stufe == "ausnahme"}
    gemeldet = {b.schluessel for b in befunde if b.stufe == "gemeldet"}
    assert set(AUSNAHMEN) <= ausnahmen, sorted(set(AUSNAHMEN) - ausnahmen)
    assert set(GEMELDET) <= gemeldet, sorted(set(GEMELDET) - gemeldet)


def test_sperrmengen_bei_oder():
    """Bei „oder“ sperrt nur die gemeinsame Menge; was später wieder gelten kann, sperrt nicht."""
    assert sperrmengen("nicht a oder (b und nicht c)") == [frozenset({"a", "c"})]
    assert sperrmengen("nicht (nacht und nicht team)") == []
    assert sperrmengen("nadelIronwood > 0 und nicht einladungGesehen") == [frozenset({"einladungGesehen"})]


def test_verneinte_variablen():
    """„nicht x“ und „x == falsch“ sperren, positive Bedingungen nicht."""
    assert verneinte("endeAkt1Gesehen und nicht ankunftRivertonGesehen") == {"ankunftRivertonGesehen"}
    assert verneinte("a == falsch oder b") == {"a"}
    assert verneinte("nadelIronwood > 0") == set()
    assert verneinte(None) == set()


def test_zustandskarte_ohne_objekt_sperrt():
    """Fehlt ein Objekt der Grundkarte auf einer Zustandskarte, sperrt deren Bedingung."""
    welt = Welt()
    sperren = fassungssperren(welt, "mapleFalls.dachboden", "brett")
    assert "ersterAbendGesehen" in sperren
    # Vorübergehend: Die Nacht im Lesesaal endet, wenn das Team ankommt.
    assert fassungssperren(welt, "cedarCreek.bibliothek", "dex") == {}
    assert fassungssperren(welt, "mapleFalls.dachboden", "gibtsNicht") == {}
