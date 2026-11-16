"""Was ein Übergang darstellen soll und was sein Bild darstellt (Grundlage von ``uebergangsbilder``).

Warum: Wunsch des Autors (14.11.2026): „eine Prüfung einbauen, die bei den Assets von Übergängen
(Türen, Treppen usw.) prüft, dass die Assets wirklich das darstellen, was sie sollen, und zu den
Orten passt, die es verbinden soll.“ Dieses Modul beschreibt jede Seite eines Übergangs: Karte,
Auslöser, Felder, die Möbel am Auslöser mit ihrer Bildart und die Art, die der Übergang erwartet
(Tür, Treppe, Weg am Rand …). Die Regeln selbst stehen in ``uebergangsbilder.py`` (KARTENREGELN
10.77).

Bildart eines Möbels: aus ``art`` in ``inhalte/abenteuer/moebel/`` (``tuer``, ``treppe``, ``gebaeude``
…), verfeinert über Name und Bildpfad (eine ``treppe`` mit „luke“ im Bild ist eine Luke). Ohne
``art`` heißt sie ``unbekannt``: Das Bild muss im Katalog benannt werden, bevor die Prüfung es
beurteilen kann.
"""

import re
from dataclasses import dataclass, field

from pipeline.abenteuer.kartenbau import WAND, K, platziere, raster
from pipeline.abenteuer.objektrichtung import ausgerichtet
from pipeline.abenteuer.uebergaenge import felder, rand, regel_fuer

Feld = tuple[int, int]

# Bildarten, die ein Übergang erwartet, und welche Bildarten am Auslöser dafür genügen.
AKZEPTIERT = {
    "weg": {"weg", "steg", "treppe", "tor", "bruecke"},
    "tuer": {"tuer"},
    "gebaeude": {"gebaeude", "tuer", "stollen"},
    "treppe": {"treppe", "luke", "leiter", "aufzug", "wendeltreppe"},
    "stollen": {"stollen", "tuer", "gebaeude"},
    "steg": {"steg", "boot", "bruecke"},
    "reise": {"steg", "boot", "bruecke", "gebaeude", "haltestelle", "fahrzeug", "weg", "tuer", "treppe"},
}
# Wörter im Namen des Auslösers oder der Karte, die die erwartete Art festlegen.
TREPPENWORT = re.compile(r"treppe|keller|dachboden|oben|unten|stockwerk|luke|leiter|aufzug|fahrstuhl", re.I)
STOLLENWORT = re.compile(r"stollen|mine|hoehle|schacht", re.I)
UBAHNWORT = re.compile(r"ubahn", re.I)
STEGWORT = re.compile(r"steg|boot|faehre|anleger", re.I)
REISEWORT = re.compile(r"faehre|wuestenzug|seilbahn|(^|\s)bus", re.I)
# Erinnerungen (Rückblenden) sind Reisen in der Zeit, kein Weg: Ein Bild muss dort nicht passen.
ZEITREISE = re.compile(r"(^|\s)erinnerung", re.I)
# Böden, die als Weg gelten, auch wenn sie der Grundboden der Karte sind.
BEFESTIGT = {
    "pflaster",
    "erde",
    "asphalt",
    "asphaltMitte",
    "asphaltMitteSenkrecht",
    "schotter",
    "platten",
    "landstrasse",
    "sandplatz",
    "erdeRot",
    "pisteRot",
    "sandRotRand",
    "stein",
    "dielen",
    "holzHell",
    "holzDunkel",
    "hallenboden",
}
# Grundböden, auf denen ein Weg zu sehen sein muss (auf Sand oder Fels ist der Boden selbst Weg).
WIESE = {"gras", "sumpfboden"}
# Möbelarten, die für die Prüfung gleich sind.
ARTGRUPPE = {
    "haus": "gebaeude",
    "kiosk": "gebaeude",
    "gebaeude": "gebaeude",
    "haltestelle": "haltestelle",
    "steg": "steg",
    "bruecke": "bruecke",
    "boot": "boot",
    "tor": "tor",
    "stollen": "stollen",
    "leiter": "leiter",
    "luke": "luke",
    "aufzug": "aufzug",
    "fenster": "fenster",
    "schrank": "schrank",
    "fahrzeug": "fahrzeug",
    "gleis": "gleis",
}


@dataclass
class Seite:
    """Eine Seite eines Übergangs: Auslöser ``name`` auf ``karte`` mit seinen Feldern und Möbeln.

    ``moebel`` sind (gesetztes Stück, Angabe, Bildart) aller Möbel, deren Bild ein Feld des
    Auslösers berührt oder direkt daneben liegt.
    """

    karte: str
    name: str
    szene: dict
    felder: list[Feld]
    moebel: list[tuple[dict, dict, str]] = field(default_factory=list)

    @property
    def innen(self) -> bool:
        return self.szene.get("art") == "innen"

    @property
    def am_rand(self) -> bool:
        return not self.innen and any(rand(self.szene, f) for f in self.felder)

    @property
    def mitte(self) -> tuple[float, float]:
        return (
            sum(x for x, _ in self.felder) / len(self.felder),
            sum(y for _, y in self.felder) / len(self.felder),
        )

    @property
    def groesse(self) -> tuple[int, int]:
        zeilen = raster(self.szene)
        return len(zeilen[0]), len(zeilen)

    def bildarten(self) -> set[str]:
        """Alle Bildarten am Auslöser, dazu „weg“, wenn er auf einem sichtbaren Weg liegt."""
        arten = {b for _, _, b in self.moebel}
        return arten | ({"weg"} if auf_weg(self.szene, self.felder) else set())


def bildart(name: str, angabe: dict) -> str | None:
    """Bildart eines Möbels für die Übergangsprüfung, ``None`` für Möbel ohne Bedeutung hier.

    Beispiel: ``mf4Luke`` (``art`` treppe, Bild luke_leiter.png) → „luke“; ``sb5Aufzug`` → „aufzug“;
    ``gt7Stollen`` ohne ``art`` → „unbekannt“ (bis der Katalog es benennt).
    """
    art = angabe.get("art")
    text = f"{name} {angabe.get('quelle', '')}".lower()
    if art is None:
        return "unbekannt"
    if "aufzug" in text or "elevator" in text:
        return "aufzug"
    if art in ("treppe", "tuer", "luke", "leiter"):
        if "luke" in text:
            return "luke"
        if "wendel" in text:
            return "wendeltreppe"
        if art == "tuer" and "stollen" in text:
            return "stollen"
        return "leiter" if art == "leiter" else art
    if art == "zaun" and re.search(r"tor|gatter", text):
        return "tor"
    return ARTGRUPPE.get(art)


def boden_an(szene: dict, feld: Feld) -> str:
    """Name des Bodens unter einem Feld (Szene „boeden“, sonst der Grundboden der Karte)."""
    zeichen = raster(szene)[feld[1]][feld[0]]
    return szene.get("boeden", {}).get(zeichen, szene.get("boden", "gras"))


def auf_weg(szene: dict, liste: list[Feld]) -> bool:
    """Liegt der Auslöser auf einem sichtbaren Weg? Ja, wenn ein Feld einen befestigten Boden oder
    einen anderen Boden als den Grundboden der Karte hat (Erdweg im roten Sand)."""
    grund = szene.get("boden", "gras")
    if grund not in WIESE:
        return True  # Wüste, Fels, Platz: Der Boden selbst ist begehbarer Weg (Canyonpfad).
    return any(boden_an(szene, f) in BEFESTIGT or boden_an(szene, f) != grund for f in liste)


def moebel_am(szene: dict, liste: list[Feld], moebel: dict) -> list[tuple[dict, dict, str]]:
    """(Stück, Angabe, Bildart) aller Möbel, deren Bild ein Feld berührt oder daneben liegt. Die Angabe
    gilt so, wie das Bild auf der Karte liegt (Größe und Blick gedreht, ``objektrichtung.ausgerichtet``)."""
    ergebnis = []
    for s in platziere(szene, moebel)[0]:
        angabe = ausgerichtet(moebel.get(s["name"], {}), s)
        art = bildart(s["name"], angabe)
        if art is None:
            continue
        x0, y0 = s["x"] // K, s["y"] // K
        x1, y1 = (s["x"] + s["breite"] - 1) // K, (s["y"] + s["hoehe"] - 1) // K
        if any(x0 - 1 <= x <= x1 + 1 and y0 - 1 <= y <= y1 + 1 for x, y in liste):
            ergebnis.append((s, angabe, art))
    return ergebnis


def erwartet(seite: Seite, gegen: Seite | None, reise: bool) -> str:
    """Die Art, die ein Übergang an dieser Seite darstellen muss.

    Regeln: am Kartenrand draußen ein Weg; eine Reise (Fähre, Bus, Zug: Gegenstück ist ein Dialog)
    ein Steg, eine Haltestelle oder ein Gebäude; innen zwischen Geschossen eine Treppe, innen nach
    draußen eine Tür; draußen in einen Innenraum ein Gebäude mit Tür. Stollen und U-Bahn nach Namen.
    Beispiel: „kellertreppe“ in der Bibliothek → „treppe“; „bibliothekTuer“ draußen → „gebaeude“.
    """
    text = f"{seite.name} {gegen.name if gegen else ''} {gegen.karte if gegen else ''}"
    if seite.am_rand:
        return "weg"
    if reise or REISEWORT.search(text) or ZEITREISE.search(f"{seite.karte} {gegen.karte if gegen else ''}"):
        return "reise"
    if gegen is None:
        return "tuer" if seite.innen else "weg"
    if STOLLENWORT.search(text) or STOLLENWORT.search(seite.karte):
        return "stollen"
    if UBAHNWORT.search(text):
        return "treppe"
    if seite.innen and gegen.innen:
        return "treppe" if TREPPENWORT.search(f"{seite.name} {gegen.name}") else "tuer"
    if seite.innen:
        return "tuer"
    if gegen.innen:
        return "gebaeude"
    return "steg" if STEGWORT.search(text) else "weg"


def seite_von(karte: str, name: str, szene: dict, moebel: dict) -> Seite:
    """Die Seite eines Auslösers mit Feldern und Möbeln am Auslöser."""
    liste = felder(szene, name)
    return Seite(karte, name, szene, liste, moebel_am(szene, liste, moebel))


def paare(alle: dict[str, dict], liste: list[dict], moebel: dict) -> list[tuple[Seite, Seite | None, bool]]:
    """Alle Übergänge einmal: (diese Seite, Gegenstück oder None, Reise?).

    Jeder Übergang wird von beiden Seiten geprüft; Paare (A→B und B→A) kommen nur einmal vor,
    damit die Kontaktbögen jeden Übergang einmal zeigen. ``reise``: Der Rückweg ist ein Dialog
    (Bus, Fähre), dann gibt es kein Bild-Gegenstück, das passen muss.
    """
    ergebnis, gesehen = [], set()
    for karte, szene in sorted(alle.items()):
        for name in sorted({a["name"] for a in szene.get("ausloeser", [])}):
            regel = regel_fuer(liste, karte, name)
            if not regel or regel.get("art") != "uebergang" or "ziel" not in regel:
                continue
            ziel_karte, ziel_name = regel["ziel"]["karte"], regel["ziel"]["ausloeser"]
            if frozenset({(karte, name), (ziel_karte, ziel_name)}) in gesehen:
                continue
            gesehen.add(frozenset({(karte, name), (ziel_karte, ziel_name)}))
            hier = seite_von(karte, name, szene, moebel)
            ziel = alle.get(ziel_karte)
            gegen = (
                seite_von(ziel_karte, ziel_name, ziel, moebel) if ziel and felder(ziel, ziel_name) else None
            )
            zurueck = regel_fuer(liste, ziel_karte, ziel_name)
            ergebnis.append((hier, gegen, bool(zurueck and zurueck.get("art") == "dialog")))
    return ergebnis


def wand_der_tuer(seite: Seite) -> str | None:
    """Wand eines Innenraums, in der der Auslöser liegt: die Seite, auf der neben einem seiner
    Felder Wand oder Kartenrand ist (sued zuerst, weil Haustüren meist dort liegen)."""
    zeilen = raster(seite.szene)
    breite, hoehe = len(zeilen[0]), len(zeilen)

    def zu(x: int, y: int) -> bool:
        return not (0 <= x < breite and 0 <= y < hoehe) or zeilen[y][x] == WAND

    for wand, (dx, dy) in (("sued", (0, 1)), ("nord", (0, -1)), ("west", (-1, 0)), ("ost", (1, 0))):
        if any(zu(x + dx, y + dy) for x, y in seite.felder):
            return wand
    return None
