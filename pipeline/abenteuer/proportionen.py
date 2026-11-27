"""Proportionen der Möbel und Bauteile gegen die Figur (20.11.2026).

Warum: Der Autor sah im Karteneditor eine Parkbank, deren Lehne Kettering bis an die Schultern
reichte, und innen Stühle so hoch wie der Held. Die gekauften Grafiksätze (LimeZu) sind für Figuren
von 22 bis 24 Pixeln gezeichnet (Median 23, gemessen an 96 Figuren des Pakets), unser Held ist auf
der Karte 20 Kartenpixel hoch (Variante B, ``app/src/abenteuer/oberwelt/weltmassstab.ts``). Das
Werkzeug misst und meldet nur; welche Lösung gilt (Möbel verkleinern, Figur innen größer oder
beides), entscheidet der Autor (Vergleichsseite, ``python -m pipeline.abenteuer.proportionsvergleich``).

Regel: Für jedes gesetzte Objekt mit einer Art aus ``BAENDER`` und Blick nach vorn (``blick`` unten
oder ohne Angabe) ist das Verhältnis „deckende Bildhöhe mal Maßstab durch Figurhöhe“ im Band der Art.
Die Bänder sind Bildhöhen in der Draufsicht von schräg oben: echte Höhe nach vorn plus die sichtbare
Oberseite (Sitzfläche, Tischplatte). Beispiel Bank: Lehne 0,45 bis 0,6 der Figur, dazu die Sitzfläche
von oben, zusammen 0,7 bis 0,95. Seitlich gedrehte Objekte zeigen ihre Länge, nicht ihre Höhe, und
bleiben ungeprüft.

Bildhöhen: ``inhalte/abenteuer/katalog_korrekturen/bildhoehen.json`` (deckende Höhe je Katalog-
eintrag, nur Zahlen). Neu messen mit ``python -m pipeline.abenteuer.proportionen --messen PRIVAT``;
ohne privates Paket (GitHub Actions) prüft das Werkzeug mit den gespeicherten Zahlen.

Aufruf: ``python -m pipeline.abenteuer.proportionen [--alle]`` druckt die Befunde je Katalogeintrag
mit Karten, Verhältnis und dem Maßstab, der in die Mitte des Bandes führt. Ausnahmen mit Grund in
``AUSNAHMEN``. Tests: ``pipeline/tests/test_abenteuer_proportionen.py``.

Erweiterung AP8a (24.11.2026): Außenteile (Bäume, quer gestellte Zäune, Büsche; ``AUSSEN_BAENDER``)
und „unscharf“ für jeden Maßstab unter 0,7. Beide stehen noch nicht im Dauertest „0 Befunde“,
sondern mit Obergrenze in ``pipeline/tests/test_abenteuer_querschnitt.py`` (Ziel 0).
"""

import argparse
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

from pipeline.abenteuer.deckrahmen import lade as lade_rahmen

WURZEL = Path(__file__).resolve().parents[2]
INHALTE = WURZEL / "inhalte" / "abenteuer"
BILDHOEHEN = INHALTE / "katalog_korrekturen" / "bildhoehen.json"

# Figur auf der Karte (Kartenpixel): außen 20; innen derzeit gleich (``--innenfaktor`` zum Durchspielen
# einer größeren Figur in Innenräumen, etwa 1,33).
FIGUR_AUSSEN = 20.0
INNEN_FIGURFAKTOR = 4 / 3  # wie app/src/abenteuer/oberwelt/weltmassstab.ts (Autor, 20.11.2026)
# Ab dieser Deckkraft (0 bis 255) zählt ein Bildpunkt zur Höhe.
DECKEND_AB = 40

# Band der Bildhöhe je Art als Vielfaches der Figurhöhe (Draufsicht von schräg oben, siehe oben).
BAENDER: dict[str, tuple[float, float]] = {
    "tuer": (0.85, 1.3),  # Tür 1,1 bis 1,25; LimeZu zeichnet Innentüren knapp (Rahmen in der Wand)
    "bank": (0.6, 1.0),  # Lehne 0,45 bis 0,6, dazu die Sitzfläche von oben
    "stuhl": (0.7, 1.0),  # Lehne 0,5 bis 0,6, dazu die Sitzfläche von oben
    "tisch": (0.5, 1.05),  # Platte 0,4 bis 0,5, dazu die Platte von oben; Beistelltische kleiner
    "theke": (0.9, 1.3),  # Tresen 0,55 bis 0,65, dazu die Arbeitsfläche
    "bett": (0.9, 1.7),  # liegt: Höhe 0,3, dazu die ganze Liegefläche von oben
    # 0,9 bis 1,2 hoch nach Vorgabe; Archiv-, Wand- und Kleiderschränke bis unter die Decke
    # (2,5 m bei 1,6 m Figur), Anrichten und Kommoden niedrig: dazu die Oberseite.
    "regal": (0.7, 2.0),
    "buecherregal": (0.7, 2.0),
    "schrank": (0.65, 2.0),
    "lampe": (1.5, 3.2),  # nur Straßenlaternen (außen, LAMPENMAST): 1,6 bis 2,2, echte Masten 4 bis 5 m
}
# Blickrichtungen, in denen die Bildhöhe die Höhe des Dings ist (von vorn oder von hinten).
VORN = {None, "unten", "oben"}
# Von hinten (Blick oben) zeigen Stuhl und Bank nur die Lehne, ohne Sitzfläche: niedriger.
VON_HINTEN = {"stuhl": (0.55, 1.0), "bank": (0.5, 1.0)}
# Sitze ohne Lehne (Hocker, Bahnsteigbänke ohne Rücken; im Katalog eine Kachel hoch).
OHNE_LEHNE = (0.3, 0.85)
# Picknicktische zeigen von vorn die Bank davor mit: Tisch 0,45 und Bank, dazu die Platte.
PICKNICK = (0.9, 1.3)
# Lampen zählen nur außen und ab dieser Kataloghöhe (Laternen); Tisch- und Stehlampen sind frei.
LAMPENMAST = 48
# Bis zu dieser Kataloghöhe (Kartenpixel) ist ein Sitz ohne Lehne und eine Tür eine Bodentür in der
# unteren Wand, die die Draufsicht nur von oben zeigt (ungeprüft).
EINE_KACHEL = 16

INNENTUER = "Innentür von LimeZu, knapp gezeichnet; kleiner als die Figur innen (Rückfrage an den Autor)"

# Katalogeinträge mit Grund, die vom Band abweichen dürfen.
AUSNAHMEN: dict[str, str] = {
    "ca7Pressetisch": "eigene Zeichnung mit Mikrofonen und Namensschildern; die Höhe enthält die Aufbauten",
    "ca8KlapptischBrett": "Klapptisch mit aufgestelltem Brett und Figuren; die Höhe enthält das Brett",
    "n9Sternatlas": "Atlas aufgeschlagen auf dem Tisch; die Höhe enthält das aufgestellte Buch",
    "n9Beobachterstuhl": "hoher Beobachtungsstuhl am Teleskop, mit Trittleiter; höher als ein Stuhl",
    "el7Lederbank3": "Teil einer längs gestellten Lederbank im Kaffeehaus; die Bildhöhe ist ihre Länge",
    "rv15BankLangSenkrecht": "senkrecht gestellte Gartenbank; die Bildhöhe ist ihre Länge",
    "ri8Klapptisch": "Klapptisch mit aufgestelltem Brett und Figuren; die Höhe enthält das Brett",
    "wds6Spieltisch": "Tisch unter einem Sonnenschirm; die Höhe ist der Schirm",
    "rv9Bildschirmtisch": "Perfect-Move-Tisch mit hohem Bildschirm (Absicht: Kiosk, kein Tisch)",
    "rv9BildschirmtischKaputt": "wie rv9Bildschirmtisch, umgestürzt",
    "cc4Hobelbank": "Hobelbank mit Werkzeugwand dahinter; die Höhe ist die Wand",
    "cc4Werktisch": "Werktisch mit Werkzeugwand dahinter; die Höhe ist die Wand",
    "pd9Werkbank": "Werkbank mit Werkzeugwand dahinter; die Höhe ist die Wand",
    "rv5Werkbank": "Werkbank mit Werkzeugwand dahinter; die Höhe ist die Wand",
    "hb7Steintisch": "Steintisch aus einem Felsblock bei den Felstürmen, kein Möbel",
    "ca7Tribuene": "Tribüne mit mehreren Sitzreihen übereinander",
    "n6Tribuene": "Tribüne mit mehreren Sitzreihen übereinander",
    "n6Flutlicht": "Flutlichtmast am Festplatz, höher als eine Straßenlaterne",
    "wzArbeitsplatte": "Küchenzeile an der Wand: Bild zeigt Platte und Front, die Wand trägt die Höhe",
    "mf5Buffet": "Küchenzeile an der Wand: Bild zeigt Platte und Front, die Wand trägt die Höhe",
    "rv8Wandbord": "Wandbord, hängt an der Wand und steht nicht auf dem Boden",
    # Erstmals gemessen am 27.11.2026 (vorher ohne Bildhöhe, daher ungeprüft); im Spiel angesehen.
    "fzKioskGemini": "Kiosk-Häuschen mit Blechdach am Fähranleger, ein kleines Gebäude; Theke ist "
    "nur das Verkaufsfenster in Hüfthöhe",
    "rv14Fahrkartenschalter": "Schalterwand mit Glasaufsatz bis unter die Decke der Bahnhofshalle; "
    "der Tresen davor ist das untere Drittel",
    "n15TribueneBlickOben": "Tribüne mit mehreren Sitzreihen übereinander, von hinten",
    "sc17Drachenbrett": "Schachtisch am Drachenbrunnen mit großem Brett, damit Zuschauer und Spieler "
    "die Stellung mit dem Drachen sehen; Brett von oben, Maßstab unter 0,7 wäre unscharf",
    "caFanshopStand": "Marktstand mit Markise auf Stangen; die Höhe ist das Dach, der Tresen darunter "
    "in Hüfthöhe",
    "sb5Empfang": "Empfangstresen mit zwei Felder tiefer Arbeitsfläche von oben; die Vorderseite "
    "steht in Hüfthöhe",
    "kt10KlapptischTablet": "Klapptisch mit aufgestelltem Tablet und Wasserflasche; die Höhe enthält "
    "die Aufbauten",
    # Innentüren von LimeZu (21 px) sind seit Figur innen × 4/3 (26⅔ px) kleiner als die Figur. Der
    # Autor hat die größere Figur gewählt (20.11.2026); neue Türbilder wären Kartenarbeit, Rückfrage
    # in docs/AUFGABEN_AUTOR.md. Durchgänge bleiben eine Kachel breit (Körper 12 px).
    "cc4Kellertuer": INNENTUER,
    "wzTuer": INNENTUER,
    "mf2Haustuer": INNENTUER,
    "sb5Tuer": INNENTUER,
}


# Außenteile (AP8a, 24.11.2026): Bänder für Arten, die nur draußen stehen. Höhen aus deckrahmen.py
# (alle Katalogeinträge gemessen). Zäune nur quer gestellt (senkrechte Stücke zeigen ihre Länge),
# Baumstümpfe sind keine Bäume.
AUSSEN_BAENDER: dict[str, tuple[float, float]] = {
    "baum": (1.5, 4.5),  # junger Baum 3 m bis alter Baum 7 m, die Krone von oben dazu
    "zaun": (0.5, 1.3),  # Gartenzaun 0,6 bis Weidezaun 1,2, Pfostenköpfe von oben
    "busch": (0.3, 2.5),  # Grasbüschel bis Strauch
}
AUSSEN_AUSNAHMEN: dict[str, str] = {
    "cp7Mammutbaum": "Mammutbaum am Riesenbaumweg: soll riesig sein (Name des Wegs)",
    "sx7RangerTor": "Torbogen mit Schild am Eingang des Nationalparks, kein Weidetor",
}
# Unter diesem Maßstab wird Pixelkunst unscharf (Bildpunkte fallen weg oder verschmieren).
UNSCHARF_UNTER = 0.7
UNSCHARF_AUSNAHMEN: dict[str, str] = {}


@dataclass
class Befund:
    """Ein Katalogeintrag außerhalb seines Bandes, mit allen Stellen."""

    moebel: str
    art: str
    verhaeltnis: float
    band: tuple[float, float]
    stellen: list[str] = field(default_factory=list)

    @property
    def vorschlag(self) -> float:
        """Maßstab, der das Verhältnis in die Mitte des Bandes bringt (auf 0,05 gerundet)."""
        mitte = (self.band[0] + self.band[1]) / 2
        return round(mitte / self.verhaeltnis * 20) / 20


def lade_katalog() -> dict:
    """Alle Katalogeinträge aus ``inhalte/abenteuer/moebel/*.json``."""
    katalog: dict = {}
    for datei in sorted((INHALTE / "moebel").glob("*.json")):
        katalog.update(json.loads(datei.read_text()).get("moebel", {}))
    return katalog


def figurhoehe(szene: dict, innenfaktor: float = INNEN_FIGURFAKTOR) -> float:
    """Figurhöhe in Kartenpixeln für die Szene: innen mal ``innenfaktor``.

    Beispiel: Clubraum (``art`` innen) mit 1,25 → 25; Park (außen) → 20.
    """
    return FIGUR_AUSSEN * (innenfaktor if szene.get("art") == "innen" else 1)


def verhaeltnis(hoehe: float, massstab: float, figur: float) -> float:
    """Bildhöhe mal Maßstab durch Figurhöhe. Beispiel: Bank 22 px, 1,0, Figur 20 → 1,1."""
    return hoehe * massstab / figur


def ausserhalb(wert: float, band: tuple[float, float]) -> bool:
    """Liegt das Verhältnis außerhalb des Bandes (mit einem Spiel von 0,01 für Rundung)?"""
    return wert < band[0] - 0.01 or wert > band[1] + 0.01


def band_fuer(angabe: dict) -> tuple[float, float] | None:
    """Das Band eines Katalogeintrags, oder None (ungeprüft).

    Beispiel: Schulstuhl von vorn → BAENDER["stuhl"]; derselbe von hinten (Blick oben) → VON_HINTEN;
    Hocker 16 × 16 → OHNE_LEHNE; Glastür im Süden (16 hoch) → None.
    """
    art, blick, hoch = angabe.get("art"), angabe.get("blick"), angabe.get("hoehe", 0)
    if art not in BAENDER or blick not in VORN:
        return None
    if art == "tuer" and hoch <= EINE_KACHEL:
        return None
    if art == "lampe" and hoch < LAMPENMAST:
        return None
    if art == "tisch" and "icknick" in angabe.get("quelle", "") + angabe.get("kennung", ""):
        return PICKNICK
    if art in VON_HINTEN and "ocker" in angabe.get("quelle", "") + angabe.get("kennung", ""):
        return OHNE_LEHNE
    if art in VON_HINTEN and hoch <= EINE_KACHEL:
        return OHNE_LEHNE
    if blick == "oben" and art in VON_HINTEN:
        return VON_HINTEN[art]
    return BAENDER[art]


def pruefe(
    szenen: dict[str, dict],
    katalog: dict,
    hoehen: dict[str, int],
    innenfaktor: float = INNEN_FIGURFAKTOR,
) -> list[Befund]:
    """Alle Befunde über alle Szenen, je Katalogeintrag und Verhältnis zusammengefasst.

    Eingaben: Szenen (Dateiname → Inhalt), Katalog, gemessene Bildhöhen. Ausgabe: Befunde, größte
    Abweichung zuerst. Sonderfälle: Objekte ohne gemessene Höhe, seitlich gedrehte und Ausnahmen
    zählen nicht.
    """
    befunde: dict[tuple[str, float], Befund] = {}
    for name, szene in sorted(szenen.items()):
        figur = figurhoehe(szene, innenfaktor)
        for objekt in szene.get("objekte", []):
            kennung = objekt.get("moebel")
            angabe = katalog.get(kennung)
            if not angabe or kennung in AUSNAHMEN or kennung not in hoehen:
                continue
            band = band_fuer({**angabe, "kennung": kennung})
            innen_lampe = angabe.get("art") == "lampe" and szene.get("art") == "innen"
            if band is None or innen_lampe or objekt.get("drehung", 0) % 180:
                continue
            massstab = float(objekt.get("massstab", 1)) * float(angabe.get("massstab", 1))
            wert = round(verhaeltnis(hoehen[kennung], massstab, figur), 2)
            if ausserhalb(wert, band):
                schluessel = (kennung, wert)
                befund = befunde.setdefault(schluessel, Befund(kennung, angabe["art"], wert, band))
                befund.stellen.append(f"{name} {objekt.get('feld')}")
    return sorted(befunde.values(), key=lambda b: -abs(b.verhaeltnis - sum(b.band) / 2))


def _aussen_band(angabe: dict, kennung: str) -> tuple[float, float] | None:
    """Band eines Außenteils oder None (ungeprüft). Beispiel: Absperrbock (zaun, quer) → (0,5, 1,3)."""
    art = angabe.get("art")
    if art not in AUSSEN_BAENDER or angabe.get("blick") not in VORN or kennung in AUSSEN_AUSNAHMEN:
        return None
    if art == "zaun" and angabe["hoehe"] > angabe["breite"]:
        return None
    if art == "baum" and "Stumpf" in kennung:
        return None
    return AUSSEN_BAENDER[art]


def pruefe_aussen(szenen: dict[str, dict], katalog: dict, rahmen: dict) -> list[Befund]:
    """Bäume, Zäune und Büsche draußen gegen die Figur (Höhe aus den deckenden Bildrändern)."""
    befunde: dict[tuple[str, float], Befund] = {}
    for name, szene in sorted(szenen.items()):
        if szene.get("art") != "aussen":
            continue
        for objekt in szene.get("objekte", []):
            kennung = objekt.get("moebel")
            angabe = katalog.get(kennung)
            band = _aussen_band(angabe, kennung) if angabe else None
            if band is None or objekt.get("drehung", 0) % 180:
                continue
            _, oben, _, unten = rahmen.get(kennung, (0, 0, angabe["breite"], angabe["hoehe"]))
            massstab = float(objekt.get("massstab", 1)) * float(angabe.get("massstab", 1))
            wert = round(verhaeltnis(unten - oben, massstab, FIGUR_AUSSEN), 2)
            if ausserhalb(wert, band):
                befund = befunde.setdefault((kennung, wert), Befund(kennung, angabe["art"], wert, band))
                befund.stellen.append(f"{name} {objekt.get('feld')}")
    return sorted(befunde.values(), key=lambda b: (b.moebel, b.verhaeltnis))


def pruefe_unscharf(szenen: dict[str, dict], katalog: dict) -> list[str]:
    """Objekte mit Maßstab unter UNSCHARF_UNTER (Objekt mal Katalog), je Möbel und Maßstab einmal.

    Beispiel: Picknicktisch mit 0,65 → „cr9PicknicktischLang × 0.65 unscharf: …“.
    """
    stellen: dict[tuple[str, float], list[str]] = {}
    for name, szene in sorted(szenen.items()):
        for objekt in szene.get("objekte", []):
            kennung = objekt.get("moebel")
            angabe = katalog.get(kennung)
            if not angabe or kennung in UNSCHARF_AUSNAHMEN:
                continue
            massstab = round(float(objekt.get("massstab", 1)) * float(angabe.get("massstab", 1)), 3)
            if massstab < UNSCHARF_UNTER:
                stellen.setdefault((kennung, massstab), []).append(f"{name} {objekt.get('feld')}")
    return [f"{k} × {m} unscharf: {', '.join(s)}" for (k, m), s in sorted(stellen.items())]


def lade_szenen() -> dict[str, dict]:
    """Alle Szenen aus ``inhalte/abenteuer/szenen``."""
    return {p.stem: json.loads(p.read_text()) for p in sorted((INHALTE / "szenen").glob("*.json"))}


def lade_hoehen() -> dict[str, int]:
    """Gespeicherte Bildhöhen (leer, wenn noch nicht gemessen)."""
    return json.loads(BILDHOEHEN.read_text()) if BILDHOEHEN.exists() else {}


def miss(privat: Path, katalog: dict) -> dict[str, int]:
    """Misst die deckende Höhe jedes Katalogeintrags mit Art aus BAENDER im privaten Paket."""
    from PIL import Image

    hoehen: dict[str, int] = {}
    for kennung, angabe in sorted(katalog.items()):
        if angabe.get("art") not in BAENDER:
            continue
        for basis in (privat, privat / "spiel"):
            pfad = basis / angabe["quelle"]
            if pfad.exists():
                alpha = Image.open(pfad).convert("RGBA").getchannel("A")
                rahmen = alpha.point(lambda a: 255 if a > DECKEND_AB else 0).getbbox()
                if rahmen:
                    hoehen[kennung] = rahmen[3] - rahmen[1]
                break
    return hoehen


def main() -> int:
    """Befunde drucken; mit --messen erst die Bildhöhen neu messen. Rückgabe 1 bei Befunden."""
    teile = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teile.add_argument("--messen", type=Path, help="privates Paket: Bildhöhen neu messen")
    teile.add_argument("--alle", action="store_true", help="jede Stelle drucken")
    teile.add_argument("--innenfaktor", type=float, default=INNEN_FIGURFAKTOR, help="Figur innen größer")
    args = teile.parse_args()
    katalog = lade_katalog()
    if args.messen:
        BILDHOEHEN.write_text(json.dumps(miss(args.messen, katalog), indent=1, sort_keys=True) + "\n")
    szenen = lade_szenen()
    befunde = pruefe(szenen, katalog, lade_hoehen(), args.innenfaktor)
    befunde += pruefe_aussen(szenen, katalog, lade_rahmen())
    for b in befunde:
        stellen = b.stellen if args.alle else b.stellen[:3]
        mehr = "" if args.alle or len(b.stellen) <= 3 else f" (+{len(b.stellen) - 3})"
        print(
            f"{b.moebel} ({b.art}): {b.verhaeltnis:.2f} der Figur, Band {b.band[0]}–{b.band[1]}, "
            f"Maßstab etwa {b.vorschlag}: {', '.join(stellen)}{mehr}"
        )
    unscharf = pruefe_unscharf(szenen, katalog)
    for zeile in unscharf:
        print(zeile)
    print(f"{len(befunde)} Befunde zur Höhe, {len(unscharf)} unscharf")
    return 0  # nur melden: die Lösung wählt der Autor


if __name__ == "__main__":
    sys.exit(main())
