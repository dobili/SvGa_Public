"""Bibliothek des Karteneditors: Name, Kurzbeschreibung, Kategorie und Unterkategorie je Möbel.

Warum: Die Möbelliste (``inhalte/abenteuer/moebel/<ort>.json``) kennt nur Kennungen wie
``mf4Sofa`` und eine ``art``. Der Autor sucht im Editor (``werkzeuge/karteneditor/``) aber nach
„Sofa“ oder „Brücke“ und will die Bilder sinnvoll gruppiert sehen (Wunsch des Autors, 15.11.2026).
Dieses Modul leitet daraus eine lesbare Bibliothek ab; die Kurzbeschreibung kommt aus der Angabe
(``beschreibung``, ``hinweis``) oder dem Katalog des privaten Repositorys.

Außerdem legt es fest, welche Arten als **Umgebung** gelten (Schalter „Nur Umgebung zeigen“ und
„Umgebung sperren“): Gebäude, Fassaden, Brücken, Stege, Wasser, Felsen, Gleise, Bodenbilder,
Bordsteine und Straßenmarkierungen. Möbel, Deko, Fahrzeuge, Pflanzen, Zäune und Türen sind Objekte.
"""

import re

from pipeline.abenteuer.objektkollision import FLACH

# Arten, die zur Umgebung gehören (Dokumentation: docs/spiel/KARTENEDITOR.md).
UMGEBUNG = (
    "gebaeude",
    "gebaeude_teil",
    "haus",
    "turm",
    "stollen",
    "tribuene",
    "bruecke",
    "steg",
    "wasser",
    "fels",
    "gleis",
    "boden",
    "boden_teil",
    "bordstein",
    "markierung",
)

# Kategorie → Arten. Die Unterkategorie ist die Art selbst (lesbar gemacht).
KATEGORIEN: dict[str, tuple[str, ...]] = {
    "Gebäude": ("gebaeude", "gebaeude_teil", "haus", "turm", "stollen", "kiosk", "zelt", "tribuene"),
    "Wasser, Brücken, Fels": ("bruecke", "steg", "wasser", "fels", "brunnen"),
    "Boden und Straße": ("boden", "boden_teil", "bordstein", "markierung", "gleis", "signal"),
    "Möbel": (
        "stuhl",
        "tisch",
        "sofa",
        "sessel",
        "bank",
        "schrank",
        "regal",
        "buecherregal",
        "bett",
        "kommode",
        "schreibtisch",
        "theke",
        "tresen",
        "vitrine",
        "garderobe",
        "spind",
        "kuechenzeile",
        "trennwand",
        "buehne",
        "stand",
    ),  # fmt: skip
    "Geräte": (
        "geraet",
        "fernseher",
        "herd",
        "kuehlschrank",
        "waschmaschine",
        "automat",
        "ofen",
        "spuele",
        "dusche",
        "waage",
        "licht",
    ),  # fmt: skip
    "Wand, Tür, Fenster": ("tuer", "fenster", "fensterbank", "treppe", "saeule", "kamin", "stuetze"),
    "Deko und Kleinkram": (
        "deko",
        "bild",
        "teppich",
        "lampe",
        "stehlampe",
        "pokal",
        "globus",
        "spiegel",
        "kerze",
        "schmuck",
        "wandschmuck",
        "plakat",
        "pinnwand",
        "tafel",
        "karton",
        "kiste",
        "koffer",
        "behaelter",
        "ware",
        "material",
        "spiel",
        "sport",
        "tier_deko",
        "fund",
        "schatten",
    ),  # fmt: skip
    "Pflanzen und Natur": (
        "pflanze",
        "blume",
        "baum",
        "busch",
        "stein",
        "baumstumpf",
        "feldfrucht",
        "heu",
        "haufen",
        "klotz",
        "feuer",
        "trog",
        "hecke",
    ),  # fmt: skip
    "Draußen: Straßenmöbel": (
        "strassenmoebel",
        "schild",
        "laterne",
        "haltestelle",
        "mulleimer",
        "briefkasten",
        "absperrung",
        "mast",
        "fahne",
        "zaun",
        "gelaender",
        "tor",
        "denkmal",
        "windrad",
        "spielgeraet",
    ),  # fmt: skip
    "Fahrzeuge": ("fahrzeug", "boot", "fahrrad", "karren"),
}
SONSTIGES = "Sonstiges"
# Lesbare Namen der Arten, wo die Kennung allein schlecht liest.
ARTNAMEN = {
    "gebaeude": "Gebäude",
    "gebaeude_teil": "Gebäudeteil",
    "bruecke": "Brücke",
    "boden_teil": "Bodenteil",
    "buecherregal": "Bücherregal",
    "geraet": "Gerät",
    "kuehlschrank": "Kühlschrank",
    "kuechenzeile": "Küchenzeile",
    "spuele": "Spüle",
    "buehne": "Bühne",
    "tuer": "Tür",
    "saeule": "Säule",
    "stuetze": "Stütze",
    "behaelter": "Behälter",
    "tier_deko": "Tierfigur",
    "strassenmoebel": "Straßenmöbel",
    "mulleimer": "Mülleimer",
    "gelaender": "Geländer",
    "spielgeraet": "Spielgerät",
    "tribuene": "Tribüne",
}
KURZ_HOECHSTENS = 160


def kategorie(art: str | None) -> tuple[str, str]:
    """Kategorie und Unterkategorie zu einer Art.

    Beispiel: „sofa“ → („Möbel“, „Sofa“); unbekannt oder ohne Art → („Sonstiges“, „ohne Art“).
    """
    for name, arten in KATEGORIEN.items():
        if art in arten:
            return name, artname(art)
    return SONSTIGES, artname(art) if art else "ohne Art"


def artname(art: str) -> str:
    """Lesbarer Name einer Art. Beispiel: „tuer“ → „Tür“, „sofa“ → „Sofa“."""
    return ARTNAMEN.get(art, art.replace("_", " ").capitalize())


def anzeigename(kennung: str) -> str:
    """Lesbarer Name aus der Kennung: Vorsilbe der Karte weg, Wörter getrennt.

    Beispiel: „mf4SofaGruen“ → „Sofa Gruen“, „parkbank“ → „Parkbank“, „rvZederngruppe“ →
    „Zederngruppe“.
    """
    rest = re.sub(r"^[a-z]+\d*(?=[A-Z])", "", kennung) or kennung
    woerter = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", rest)
    return woerter[:1].upper() + woerter[1:]


def kurzbeschreibung(angabe: dict, katalogeintrag: dict | None) -> str:
    """Ein bis zwei Sätze zum Bild: aus der Angabe, sonst aus dem Katalog, sonst leer.

    Sonderfall: Lange Texte werden nach KURZ_HOECHSTENS Zeichen am Wortende gekürzt („…“).
    """
    text = angabe.get("beschreibung") or angabe.get("hinweis") or ""
    if not text and katalogeintrag:
        text = katalogeintrag.get("beschreibung") or katalogeintrag.get("kurz") or ""
    if len(text) <= KURZ_HOECHSTENS:
        return text
    return text[:KURZ_HOECHSTENS].rsplit(" ", 1)[0] + " …"


def bibliothekseintrag(kennung: str, angabe: dict, ortsdatei: str, katalogeintrag: dict | None) -> dict:
    """Ein Eintrag der Bibliothek, wie der Editor ihn liest (ohne Bild).

    Beispiel: („mf4Sofa“, {"art": "sofa", "breite": 64, …}, „maple-falls“, None) →
    {"name": "Sofa", "kategorie": "Möbel", "unterkategorie": "Sofa", "ort": "maple-falls", …}.
    """
    # Ohne eigene Art hilft die Art aus dem Katalog des privaten Repositorys.
    art = angabe.get("art") or (katalogeintrag or {}).get("art")
    haupt, unter = kategorie(art)
    eintrag = {
        "name": anzeigename(kennung),
        "kurz": kurzbeschreibung(angabe, katalogeintrag),
        "kategorie": haupt,
        "unterkategorie": unter,
        "ort": ortsdatei,
        "umgebung": art in UMGEBUNG,
    }
    # Kollision des Katalogs (Maske, Grund) für die Übersteuerung im Editor (objektkollision.py);
    # „flach“: Art, über die man läuft (dann braucht „durchgehbar“ keinen Grund, Regel 10.69).
    felder = (
        "breite",
        "hoehe",
        "kollision",
        "art",
        "blick",
        "zustand",
        "stil",
        "maske",
        "frei_unten",
        "vordergrund",
    )
    felder += ("begehbar_grund", "richtung", "maske_fein")  # feine Maske: feinmasken.py (10.88)
    eintrag.update({k: angabe[k] for k in felder if k in angabe} | ({"art": art} if art else {}))
    eintrag["flach"] = art in FLACH
    if katalogeintrag and katalogeintrag.get("thema"):
        eintrag["thema"] = katalogeintrag["thema"]
    return eintrag
