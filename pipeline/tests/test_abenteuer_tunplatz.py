"""Tests der Liste „Stellung gegen tun“ (tunplatz.py), Kartenblick M11 (24.11.2026).

65 Statisten haben „sitzt“ im ``tun``, aber keine Eigenschaft ``sitzt``; Spiel und Vorschau zeichnen
sie stehend. Die Liste ist die Vorlage für Welle 2; hier wird geprüft, dass sie stimmt und nicht wächst.
"""

from pipeline.abenteuer import tunplatz as T


def test_arten_eines_statisten():
    assert T.arten({"tun": "sitzt am Tresen über einem Kaffee", "von": "3,4", "bis": "3,4"}) == [
        "sitzt_fehlt"
    ]
    assert T.arten({"tun": "sitzen in der Nische", "von": "1,1", "bis": "5,1"}) == ["sitzt_fehlt", "laeuft"]
    assert T.arten({"tun": "schaut zu", "verhalten": "sitzen"}) == ["verhalten"]
    # Wer die Eigenschaft trägt, ist in Ordnung; „besitzt“ ist kein Sitzen.
    assert T.arten({"tun": "sitzt am Tresen", "sitzt": "oben"}) == []
    assert T.arten({"tun": "sitzt am Boden", "zustand": "sitzboden"}) == []
    assert T.arten({"tun": "besitzt drei Schachuhren"}) == []


def test_befunde_einer_szene_mit_moebelhinweis():
    szene = {
        "belebung": [
            {"name": "gast", "typ": "statist", "feld": [2, 2], "eigenschaften": {"tun": "sitzt beim Essen"}},
            {"name": "katze", "typ": "tier", "feld": [3, 2], "eigenschaften": {"verhalten": "sitzen"}},
        ]
    }
    befunde = T.befunde_der_szene("gibt-es-nicht", szene, {})
    assert [(b.name, b.art, b.moebel) for b in befunde] == [
        ("gast", "sitzt_fehlt", "kein Möbel unter dem Feld")
    ]
    assert "gast (2, 2) [sitzt_fehlt]" in befunde[0].text()
    assert T.bericht(befunde).startswith("# Stellung der Statisten gegen ihr tun (1 offen; sitzt_fehlt: 1)")


def test_liste_fuer_welle_2_waechst_nicht():
    # Offene Arbeit für Welle 2, keine Null-Prüfung: Die Zahl darf nur sinken.
    befunde = T.alle_befunde()
    assert len(befunde) <= T.OFFEN_HOECHSTENS
    sitzen = [b for b in befunde if b.art == "sitzt_fehlt"]
    assert all("sitz" in b.tun.lower() for b in sitzen)


def test_hinweis_nennt_das_moebel_der_gebauten_karte():
    # Am Klapptisch unter der Brücke steht ein Hocker unter dem Feld, im Park steht der Rentner
    # neben der Bank (Befund des Kartenblicks: „sitzt auf der Bank“, steht aber daneben).
    moebel = T.katalog()
    assert T.moebel_am_platz("weg-riverton-ironwood-2", (25, 64), moebel).startswith(
        "Sitzmöbel ri8Klapphocker"
    )
    assert T.moebel_am_platz("gibt-es-nicht", (1, 1), moebel) == "kein Möbel unter dem Feld"
