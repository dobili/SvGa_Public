"""Raumgröße innen gegen das Gebäude außen (KARTENREGELN 10.75, Rückmeldung R065).

Warum: Der Autor (R065): „Bei jedem Gebäude, das man von außen sieht, prüfen, ob Form und Größe des
Innenraums zum Gebäude-Asset passen könnten. Der Raum darf nicht so riesig sein, dass er nicht ins
Gebäude passen würde. Ist er kleiner, muss es Hinweise auf weitere Räume geben (Türen, auch
verschlossene).“ Die Messung INNEN_AUSSEN.md vom 11.11.2026 war Handarbeit und wurde nie wiederholt;
dieses Werkzeug misst bei jedem Lauf neu.

Vorgehen:
1. Jeder Übergang von einer Außenkarte in einen Innenraum (``uebergangsarten.paare``) nennt das
   Gebäude am Auslöser. Gibt es dort mehrere (Anbau mit Tür neben dem großen Bau, Bibliothek Cedar
   Creek), zählt das größte Bild mit Grundriss (10.74, ``katalog_korrekturen/grundrisse.json``).
2. Innenräume ohne eigenen Eingang von draußen (Obergeschoss, Keller, Hinterzimmer) erben das
   Gebäude über Übergänge zwischen Innenräumen; jedes Geschoss zählt für sich (10.75).
3. Maße außen: ``breite`` und ``tiefe`` (Dachreihen) des Grundrisses mal Maßstab des Bildes auf der
   Karte. Maße innen: Spalten und Reihen mit Boden (alles außer Wand ``#``), also ohne Wände.
4. Grenzen nach 10.75 (Tabelle unten) plus ``SPIELRAUM``.

Grenzen (10.75), ``b`` und ``t`` außen in Kacheln:

| Gebäude außen   | Breite innen               | Tiefe innen          |
| --------------- | -------------------------- | -------------------- |
| klein (b ≤ 5)   | höchstens 2,5 b, mind. 8   | mindestens 6 Reihen  |
| mittel (6–11)   | höchstens 2 b              | höchstens 2,5 t      |
| groß (b ≥ 12)   | 1 bis 1,5 b                | höchstens 2 t        |

Spielraum: eine Kachel nach oben (``SPIELRAUM``). Begründung: Die Grundrisse sind am Bild mit
Kachelraster abgelesen (eine halbe Kachel Unschärfe an Vordach und Traufe), und innen zählt nur der
Boden; die Wände (je Seite eine Reihe, oben drei) kommen dazu. Ein Raum, der eine Kachel über der
Grenze liegt, ist im Spiel nicht von einem passenden zu unterscheiden; zwei Kacheln sind es.

Kleiner als das Gebäude (R065, zweiter Satz): Ist ein Raum schmaler als das Gebäude außen (bei
Bauten bis 5 breit: schmaler als 8), braucht er einen Hinweis auf weitere Räume, also eine Tür, die
nicht der Eingang ist. Fehlt sie, meldet das Werkzeug „kleiner, ohne weitere Tür“.

Aufruf: ``python -m pipeline.abenteuer.raumgroesse [--ort KENNUNG] [--bericht DATEI]``. Ohne
``--bericht`` druckt es die Liste; mit schreibt es den Abschnitt R065 in die Berichtsdatei (der
Abschnitt R008 von ``blickrichtung.py`` bleibt erhalten). Beispiel:
``python -m pipeline.abenteuer.raumgroesse --bericht docs/spiel/auftraege/rueckmeldung/raumgroesse_16-11.md``
"""

import math
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.kartenbau import WAND, K, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.uebergaenge import regel_fuer, szenen, uebergaenge
from pipeline.abenteuer.uebergangsarten import Seite, paare
from pipeline.abenteuer.uebergangsbilder import lade_grundrisse

SPIELRAUM = 1
KLEIN_BIS, GROSS_AB = 5, 12
MINDESTBREITE_KLEIN, MINDESTTIEFE_KLEIN = 8, 6
FAKTOR_BREITE = {"klein": 2.5, "mittel": 2.0, "gross": 1.5}
FAKTOR_TIEFE = {"mittel": 2.5, "gross": 2.0}
GEBAEUDEARTEN = ("gebaeude", "haus")
# So viele Vorschläge für ein anderes Gebäudebild nennt der Bericht höchstens (die kleinsten passenden).
VORSCHLAEGE = 2
# Eigene Bilder, die aus einem Paketbild abgeleitet sind und dessen Grundriss teilen (10.74).
ABGELEITET = {
    "spiel/eigene/villa_whitlock.png": (
        "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/7_Villas_Singles_16x16/"
        "ME_Singles_Villas_16x16_Villa_2.png"
    ),
}


@dataclass
class Raum:
    """Ein Innenraum mit seinem Gebäude außen, den Maßen und dem Befund (für Liste und Bericht)."""

    karte: str
    gebaeude: str = ""
    quelle: str = ""
    ueber: str = ""
    aussen_breite: float = 0.0
    aussen_tiefe: float = 0.0
    form: str = ""
    innen_breite: int = 0
    innen_tiefe: int = 0
    weitere_tueren: int = 0
    befund: str = ""
    vorschlag: str = ""

    @property
    def klasse(self) -> str:
        """Größenklasse nach 10.75: klein (bis 5), mittel (6 bis 11), groß (ab 12)."""
        if self.aussen_breite <= KLEIN_BIS:
            return "klein"
        return "gross" if self.aussen_breite >= GROSS_AB else "mittel"


def innenmasse(szene: dict) -> tuple[int, int]:
    """Breite und Tiefe des Bodens eines Innenraums in Kacheln (Spalten und Reihen ohne Wand).

    Beispiel: Diner Maple Falls, Raster 16 × 13 mit Wänden → 14 × 9.
    """
    zeilen = raster(szene)
    spalten = {x for zeile in zeilen for x, z in enumerate(zeile) if z != WAND}
    reihen = {y for y, zeile in enumerate(zeilen) if any(z != WAND for z in zeile)}
    if not spalten:
        return 0, 0
    return max(spalten) - min(spalten) + 1, max(reihen) - min(reihen) + 1


def grenzen(breite: float, tiefe: float) -> dict[str, float | None]:
    """Erlaubte Maße innen nach 10.75 ohne Spielraum: höchste und kleinste Breite, höchste und kleinste
    Tiefe (``None``: keine Grenze). ``tiefe`` 0 heißt im Grundriss „frei“, dann keine Tiefengrenze.

    Beispiel: Fassade 8 × 6 (Diner) → Breite bis 16, Tiefe bis 15.
    """
    if breite <= KLEIN_BIS:
        return {
            "breite_max": FAKTOR_BREITE["klein"] * breite,
            "breite_min": MINDESTBREITE_KLEIN,
            "tiefe_max": None,
            "tiefe_min": MINDESTTIEFE_KLEIN,
        }
    klasse = "gross" if breite >= GROSS_AB else "mittel"
    return {
        "breite_max": FAKTOR_BREITE[klasse] * breite,
        "breite_min": breite if klasse == "gross" else None,
        "tiefe_max": FAKTOR_TIEFE[klasse] * tiefe if tiefe else None,
        "tiefe_min": None,
    }


def grundriss_von(quelle: str, grundrisse: dict) -> dict | None:
    """Grundriss eines Bildes, bei abgeleiteten eigenen Bildern der des Vorbilds (``ABGELEITET``).

    Beispiel: ``spiel/eigene/villa_whitlock.png`` (verblasste Villa_2) → Grundriss der Villa_2.
    """
    return grundrisse.get(quelle) or grundrisse.get(ABGELEITET.get(quelle, ""))


def _hat_grundriss(stueck: dict, angabe: dict, grundrisse: dict) -> bool:
    return grundriss_von(angabe.get("quelle", ""), grundrisse) is not None


def gebaeude_zum_eingang(seite: Seite, grundrisse: dict) -> tuple[dict, dict] | None:
    """(Stück, Angabe) des Gebäudes an einem Eingang draußen: das größte Gebäudebild am Auslöser mit
    Grundriss, sonst das größte ohne. Warum nicht ``uebergangsbilder.gebaeude_an``: Dort zählt das Bild
    mit Tür zuerst (Seiteneingang der Bibliothek), hier zählt das Haus, in dem der Raum liegt."""
    liste = [(s, a) for s, a, art in seite.moebel if art in GEBAEUDEARTEN or a.get("art") in GEBAEUDEARTEN]
    if not liste:
        return None
    return max(liste, key=lambda t: (_hat_grundriss(*t, grundrisse), t[0]["breite"] * t[0]["hoehe"]))


def zuordnung(alle: dict, liste: list[dict], moebel: dict, grundrisse: dict) -> dict[str, tuple]:
    """Innenraum → (Stück, Angabe, über welche Karte). Erst die Eingänge von draußen, dann über
    Innen-Innen-Übergänge weiter (Obergeschoss erbt vom Erdgeschoss, Keller von der Bibliothek)."""
    direkt: dict[str, tuple] = {}
    innen_paare: list[tuple[str, str]] = []
    for hier, gegen, _ in paare(alle, liste, moebel):
        if gegen is None:
            continue
        for aussen, innen in ((hier, gegen), (gegen, hier)):
            if not aussen.innen and innen.innen:
                gefunden = gebaeude_zum_eingang(aussen, grundrisse)
                alt = direkt.get(innen.karte)
                if gefunden and (alt is None or gefunden[0]["breite"] > alt[0]["breite"]):
                    direkt[innen.karte] = (*gefunden, "")
        if hier.innen and gegen.innen:
            innen_paare.append((hier.karte, gegen.karte))
    geaendert = True
    while geaendert:
        geaendert = False
        for a, b in innen_paare:
            for von, nach in ((a, b), (b, a)):
                # Nur innerhalb eines Ortes: Eine Erinnerung (Zeitreise) liegt in keinem Haus der Gegenwart.
                gleich = von.split(".")[0] == nach.split(".")[0]
                if gleich and von in direkt and nach not in direkt:
                    direkt[nach] = (direkt[von][0], direkt[von][1], von)
                    geaendert = True
    return direkt


def weitere_tueren(karte: str, szene: dict, moebel: dict, liste: list[dict]) -> int:
    """Türbilder im Raum, die nicht an einem Übergang liegen (Hinweise auf weitere Räume, R065).

    Ein Türbild gehört zu einem Übergang, wenn eines seiner Felder oder ein Nachbarfeld ein Feld eines
    Auslösers mit Übergang ist (die Haustür, die Treppe ins Obergeschoss)."""
    uebergangsfelder = {
        tuple(a["feld"])
        for a in szene.get("ausloeser", [])
        if (regel_fuer(liste, karte, a["name"]) or {}).get("art") == "uebergang"
    }
    zahl = 0
    for s in platziere(szene, moebel)[0]:
        if moebel.get(s["name"], {}).get("art") != "tuer":
            continue
        x0, y0 = s["x"] // K, s["y"] // K
        x1, y1 = (s["x"] + s["breite"] - 1) // K, (s["y"] + s["hoehe"] - 1) // K
        if not any(x0 - 1 <= x <= x1 + 1 and y0 - 1 <= y <= y1 + 1 for x, y in uebergangsfelder):
            zahl += 1
    return zahl


def bewerte(raum: Raum) -> None:
    """Befund und Vorschlag nach 10.75 mit Spielraum (schreibt in ``raum``)."""
    g = grenzen(raum.aussen_breite, raum.aussen_tiefe)
    teile, vorschlag = [], []
    if raum.innen_breite > g["breite_max"] + SPIELRAUM:
        erlaubt = math.floor(g["breite_max"])
        teile.append(f"zu breit ({raum.innen_breite} statt höchstens {erlaubt})")
        vorschlag.append(f"Breite innen auf {erlaubt}")
    if g["tiefe_max"] is not None and raum.innen_tiefe > g["tiefe_max"] + SPIELRAUM:
        erlaubt = math.floor(g["tiefe_max"])
        teile.append(f"zu tief ({raum.innen_tiefe} statt höchstens {erlaubt})")
        vorschlag.append(f"Tiefe innen auf {erlaubt}")
    if g["tiefe_min"] is not None and raum.innen_tiefe < g["tiefe_min"]:
        teile.append(f"zu flach ({raum.innen_tiefe} statt mindestens {g['tiefe_min']})")
    untergrenze = g["breite_min"] if g["breite_min"] is not None else raum.aussen_breite
    if raum.innen_breite < untergrenze and raum.weitere_tueren == 0:
        teile.append(f"kleiner als das Gebäude ({raum.innen_breite} gegen {untergrenze:g}), ohne weitere Tür")
        vorschlag.append("verschlossene Tür als Hinweis auf weitere Räume (R065)")
    raum.befund = "; ".join(teile) or "passt"
    raum.vorschlag = "; ".join(vorschlag)


def ersatzbilder(raum: Raum, grundrisse: dict, moebel: dict) -> list[str]:
    """Gebäudebilder aus dem Katalog, in die der Raum ohne Änderung passen würde: gleiche Form, gleich
    viele Geschosse, Grenzen nach 10.75 eingehalten; die schmalsten zuerst, damit der Raum nicht
    verloren wirkt. Ausgabe: Möbelnamen (die Bilder sind schon eingetragen)."""
    namen_je_quelle: dict[str, str] = {}
    for name, angabe in sorted(moebel.items()):
        namen_je_quelle.setdefault(angabe.get("quelle", ""), name)
    alt = grundriss_von(raum.quelle, grundrisse) or {}
    treffer = []
    for quelle, gr in sorted(grundrisse.items(), key=lambda t: t[1].get("breite", 0)):
        b, t = gr.get("breite", 0), gr.get("tiefe", 0)
        if quelle == raum.quelle or quelle not in namen_je_quelle or gr.get("form") != alt.get("form"):
            continue
        if gr.get("geschosse") != alt.get("geschosse") or not b:
            continue
        g = grenzen(b, t)
        passt_breite = g["breite_max"] + SPIELRAUM >= raum.innen_breite
        passt_tiefe = g["tiefe_max"] is None or g["tiefe_max"] + SPIELRAUM >= raum.innen_tiefe
        # Außen nicht breiter als der Raum innen, sonst wäre der Raum zu klein (zweite Hälfte von R065).
        if passt_breite and passt_tiefe and b <= raum.innen_breite:
            treffer.append(f"{namen_je_quelle[quelle]} ({b} × {t})")
        if len(treffer) >= VORSCHLAEGE:
            break
    return treffer


def miss(ort: str | None = None) -> list[Raum]:
    """Alle Innenräume (Grundkarten) mit Maßen und Befund, nach Karte sortiert."""
    alle, liste, moebel, grundrisse = szenen(), uebergaenge(), lade_moebel(), lade_grundrisse()
    zu = zuordnung(alle, liste, moebel, grundrisse)
    raeume = []
    for karte, szene in sorted(alle.items()):
        if szene.get("art") != "innen" or (ort and not karte.startswith(f"{ort}.")):
            continue
        raum = Raum(karte)
        raum.innen_breite, raum.innen_tiefe = innenmasse(szene)
        raum.weitere_tueren = weitere_tueren(karte, szene, moebel, liste)
        if karte not in zu:
            raum.befund = "kein Gebäude außen gefunden (Reise, Erinnerung oder Eingang ohne Gebäudebild)"
            raeume.append(raum)
            continue
        stueck, angabe, ueber = zu[karte]
        raum.gebaeude, raum.quelle, raum.ueber = stueck["name"], angabe.get("quelle", ""), ueber
        gr = grundriss_von(raum.quelle, grundrisse)
        if not gr:
            raum.befund = "Gebäudebild ohne Grundriss (10.74), nicht messbar"
            raeume.append(raum)
            continue
        massstab = stueck["breite"] / angabe["breite"] if angabe.get("breite") else 1.0
        raum.aussen_breite = round(gr.get("breite", 0) * massstab, 1)
        raum.aussen_tiefe = round(gr.get("tiefe", 0) * massstab, 1)
        raum.form = gr.get("form", "")
        bewerte(raum)
        if raum.befund != "passt" and "zu " in raum.befund:
            andere = ersatzbilder(raum, grundrisse, moebel)
            if andere:
                raum.vorschlag += ("; " if raum.vorschlag else "") + "oder Gebäudebild " + ", ".join(andere)
        raeume.append(raum)
    return raeume


def zeile(raum: Raum) -> str:
    """Eine Zeile der Liste: Karte, Gebäude, Maße außen und innen, Befund, Vorschlag."""
    aussen = f"{raum.aussen_breite:g} × {raum.aussen_tiefe:g}" if raum.aussen_breite else "–"
    ueber = f" (über {raum.ueber})" if raum.ueber else ""
    return (
        f"| {raum.karte} | {raum.gebaeude or '–'}{ueber} | {raum.form or '–'} | {aussen} | "
        f"{raum.innen_breite} × {raum.innen_tiefe} | {raum.weitere_tueren} | {raum.befund} | "
        f"{raum.vorschlag or '–'} |"
    )


KOPF = (
    "| Raum | Gebäude außen | Form | außen B × T | innen B × T | weitere Türen | Befund | Vorschlag |\n"
    "| ---- | ------------- | ---- | ----------- | ----------- | ------------- | ------ | --------- |"
)


def abschnitt(raeume: list[Raum]) -> str:
    """Der Abschnitt R065 des Berichts (Markdown): Regeln, Zählung, auffällige Räume, alle Räume."""
    auffaellig = [r for r in raeume if r.befund != "passt"]
    zeilen = [
        "## R065: Raumgröße innen gegen das Gebäude außen (Regel 10.75)",
        "",
        "Erzeugt mit `python -m pipeline.abenteuer.raumgroesse --bericht <diese Datei>`. Grenzen nach "
        f"10.75 mit einem Spielraum von {SPIELRAUM} Kachel (Begründung im Dateikopf des Werkzeugs). "
        "Innen zählt nur der Boden ohne Wände; außen der Grundriss mal Maßstab des Bildes. Obergeschosse "
        "und Keller erben das Gebäude über die Treppe.",
        "",
        f"Gemessen: {len(raeume)} Innenräume, davon {len(auffaellig)} auffällig.",
        "",
        "### Auffällige Räume",
        "",
        KOPF,
        *[zeile(r) for r in auffaellig],
        "",
        "### Alle Räume",
        "",
        KOPF,
        *[zeile(r) for r in raeume],
    ]
    return "\n".join(zeilen) + "\n"


def schreibe_abschnitt(datei: Path, marke: str, inhalt: str, titel: str) -> None:
    """Ersetzt den Abschnitt zwischen ``<!-- marke -->`` und ``<!-- /marke -->`` in ``datei`` (oder hängt
    ihn an); legt die Datei mit ``titel`` an, wenn es sie nicht gibt. So schreiben Raumgröße (R065)
    und Blickrichtung (R008) in dieselbe Berichtsdatei, ohne sich zu überschreiben."""
    anfang, ende = f"<!-- {marke} -->", f"<!-- /{marke} -->"
    alt = datei.read_text(encoding="utf-8") if datei.exists() else f"# {titel}\n\n"
    block = f"{anfang}\n\n{inhalt}\n{ende}\n"
    if anfang in alt and ende in alt:
        vorn, rest = alt.split(anfang, 1)
        neu = vorn + block + rest.split(ende, 1)[1].lstrip("\n")
    else:
        neu = alt.rstrip("\n") + "\n\n" + block
    datei.write_text(neu, encoding="utf-8")


BERICHTSTITEL = "Raumgröße (R065) und Blickrichtung (R008), Prüfwerkzeuge vom 16.11.2026"


def main(argumente: list[str]) -> int:
    ort = argumente[argumente.index("--ort") + 1] if "--ort" in argumente else None
    raeume = miss(ort)
    if "--bericht" in argumente:
        datei = Path(argumente[argumente.index("--bericht") + 1])
        schreibe_abschnitt(datei, "R065", abschnitt(raeume), BERICHTSTITEL)
        print(f"R065: {len(raeume)} Räume, Abschnitt in {datei}")
        return 0
    for r in raeume:
        print(zeile(r))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
