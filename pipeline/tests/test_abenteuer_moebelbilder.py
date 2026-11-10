"""Listenprüfung: Möbelnamen und Bilder passen zusammen (Querauftrag (m) und (o), 10.11.2026).

Warum: Die Gutachten fanden mehrfach dieselben Fehlgriffe über viele Karten: ein Regal voller bunter
Dosen als Bücher-, Noten-, Ordner-, Zeitungs- oder Werkzeugregal und eine rot-weiße Straßenbake als
Prellbock. Ein Name verspricht etwas, das Bild zeigt etwas anderes. Die Prüfung läuft über die
Möbellisten (inhalte/abenteuer/moebel), also ohne die gekaufte Grafik.
"""

import re

from pipeline.abenteuer.moebelliste import lade_moebel

# Regale mit bunten Dosen und Gläsern (LimeZu Classroom and Library 43 bis 45) und Supermarktregale.
DOSENREGAL = re.compile(r"Classroom_and_Library_Singles_4[345]\.png$|Grocery_Store")
# Namen, die Bücher, Papier oder Werkzeug versprechen.
VERSPRICHT_INHALT = re.compile(r"buch|buecher|ordner|noten|zeitung|akten|werkzeug|bretter", re.I)
# Der rot-weiße Absperrbock von der Straße (spiel/eigene/prellbock.png und prellbock_quer.png).
STRASSENBAKE = re.compile(r"spiel/eigene/prellbock(_quer)?\.png$")


def test_kein_dosenregal_als_buecher_oder_werkzeugregal():
    falsch = [
        f"{name}: {angabe['quelle'].rsplit('/', 1)[-1]}"
        for name, angabe in lade_moebel().items()
        if VERSPRICHT_INHALT.search(name) and DOSENREGAL.search(angabe["quelle"])
    ]
    assert falsch == []


def test_prellbock_ist_keine_strassenbake():
    falsch = [
        name
        for name, angabe in lade_moebel().items()
        if "prellbock" in name.lower() and STRASSENBAKE.search(angabe["quelle"])
    ]
    assert falsch == []


def test_pruefung_erkennt_die_alten_fehlgriffe():
    """Die Muster greifen bei den Fällen aus den Gutachten (sonst prüften die Tests ins Leere)."""
    dosen = "modern-interiors/…/Classroom_and_Library_Singles_44.png"
    assert VERSPRICHT_INHALT.search("pd6Notenregal") and DOSENREGAL.search(dosen)
    assert STRASSENBAKE.search("spiel/eigene/prellbock.png")
    assert not STRASSENBAKE.search("spiel/eigene/prellbock_stahl_oben.png")


# Arten, über die man läuft (KARTENREGELN 10.69): Sie brauchen keine Kollision und keine Begründung.
FLACH = {
    "bordstein", "markierung", "teppich", "boden", "boden_teil", "schatten",
    "steg", "bruecke", "gleis", "treppe", "tuer",
}  # fmt: skip


def test_ohne_kollision_nur_flach_oder_mit_begruendung():
    """Regel 10.69: Der Autor lief durch einen Zeitungsstapel. Ein Möbel ohne Kollision ist flach
    (nach ``art``) oder trägt ``begehbar`` mit einem Grund."""
    falsch = [
        f"{name} ({angabe.get('art')})"
        for name, angabe in lade_moebel().items()
        if not angabe.get("kollision")
        and angabe.get("art") not in FLACH
        and not (angabe.get("begehbar") is True and angabe.get("begehbar_grund"))
    ]
    assert falsch == []


def test_begehbar_und_kollision_schliessen_sich_aus():
    beides = [n for n, a in lade_moebel().items() if a.get("kollision") and a.get("begehbar")]
    assert beides == []
