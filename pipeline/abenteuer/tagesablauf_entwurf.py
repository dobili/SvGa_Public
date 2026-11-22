"""Tagesabläufe der benannten Figuren, Entwurf: schreibt inhalte/abenteuer/tagesablaeufe.json.

Warum: Wunsch des Autors (22.11.2026, über den Hauptchat): Jede Figur hat einen Tag, der zu ihr
passt, mit Arbeit, Freizeit und drei Stunden Schlaf, versetzt, damit keine Geisterstädte entstehen.
Der Entwurf leitet ihn aus dem ab, was schon da ist, statt 125 Figuren von Hand zu setzen:

- Person = Bild der Figur (``sprite``); ihre Plätze aus den Szenen des Orts (``figuren``).
- Arbeit am ersten Platz ohne Bedingung (dort stand sie bisher immer), Beginn 8, 9 oder 10 Uhr.
- Freizeit auf einem freien echten Sitzmöbel draußen im selben Ort (Bank, Stuhl), sonst am Platz.
- Schlaf drei Stunden, Beginn zwischen 22 und 2 Uhr; je Ort so verteilt, dass nie mehr als ein
  Drittel schläft (reicht das Fenster nicht, rückt der Beginn auf 21 oder 3 Uhr, siehe Bericht).
  Mit Bett auf einer Karte des Orts liegt die Figur dort, sonst ist sie im Schlaf unsichtbar.
- Ohne Schlaf (Regel 2 und 3 des Hauptchats): Geist, Roboter und alle, die der Spieler zum
  Weiterkommen braucht (Laden, Theke, Fähre, Turnierleitung, Wärter, Ranger auf Nachtstreife),
  nach der Rolle in docs/spiel/25_Figurenprompts.md.
- Figuren in mehreren Orten (Victor, Nova, Mama in der Arena …) folgen der Geschichte, ohne Ablauf.
  Erinnerungen haben ihre eigene Zeit und bleiben draußen.

Die Geschichte geht immer vor (Regel 1): Das setzt die App um (Questschritt hält die Figur fest).
``festhalten`` nennt in den Daten, wo eine Questfigur sonst nicht an ihrem Questort wäre.
Aufruf: ``python -m pipeline.abenteuer.tagesablauf_entwurf`` (überschreibt die Datei).
Prüfung: pipeline/abenteuer/tagesablauf.py.
"""

import json
import re
from collections import defaultdict

from pipeline.abenteuer.kartenbau import INHALTE
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.tagesablauf_grundlagen import (
    personen,
    personennamen,  # noqa: F401 (für tagesablauf.py)
    rollen,
    streu,
    umgebung_des_orts,
)
from pipeline.abenteuer.uebergaenge import szenen

ZIEL = INHALTE / "tagesablaeufe.json"
PROMPTS = INHALTE.parents[1] / "docs" / "spiel" / "25_Figurenprompts.md"
STUNDEN = 24
WEG_VON_DER_ARBEIT = 6  # so weit (Felder) liegt der Feierabend mindestens vom Arbeitsplatz
ZUHAUSE = {  # Wohnungen: nur für ihre Bewohner Feierabend- und Nachtplatz
    "mapleFalls.wohnzimmer",
    "mapleFalls.zimmer",
    "mapleFalls.dachboden",
    "ironwood.mamasZimmer",
    "riverton.wohnwagen",
}
KARTENART: dict[str, str] = {}  # Karte → „aussen“ oder „innen“ (aus den Szenen, in bauen gefüllt)
KLEINER_ORT = 6  # darunter darf höchstens eine Figur zugleich schlafen
SCHLAFDAUER = 3
ARBEITSDAUER = 8
SCHLAFBEGINN = (23, 0, 22, 1, 2)  # Fenster 22 bis 2 Uhr (Entscheidung des Hauptchats, 22.11.2026)
SCHLAFBEGINN_JUGEND = (22, 23)  # Jugendliche (Sam, Skater-Jo) früh
KIND_BIS = 13  # bis zu diesem Alter: nachts zu Hause (unsichtbar), kein Schlaf im Sinn der Achtel-Regel
ZUHAUSE_VON, ZUHAUSE_BIS = 21, 7
NACHT_VON, NACHT_BIS = 21, 6  # wer in dieser Zeit wach ist, sitzt drinnen oder unter einer Laterne
TIEFE_NACHT = range(0, 4)  # 0 bis 4 Uhr: höchstens die Hälfte schläft, sonst ein Drittel
DIENST_NAMEN = {"mags"}  # Mags hält das Diner nachts offen, Earl schläft (Hauptchat, 22.11.2026)
ARBEITSBEGINN = (8, 9, 10)
EIGENE_ZEIT = ("erinnerung",)  # Orte mit eigener Zeit (Erinnerungen)
DIENST = re.compile(
    r"Kiosk|Zeitungsstand|Eisenwaren|Food-Truck|Gebäckstand|Antiquariat|Raststätte|Koch|Wirt"
    r"|Fähr|Kapitän|Schaffner|Turnierleit|Roboter|[Ww]ärter|Motel|Tankwart|Leuchtturm|Hofladen"
    r"|Bus nach|Lastkahn|Kellner|Gastgeberin|Seilbahn|Ranger"
)


def stunden(von: int, bis: int) -> list[int]:
    """Stunden eines Blocks, über Mitternacht hinweg. Beispiel: (23, 2) → [23, 0, 1]."""
    return [(von + i) % STUNDEN for i in range((bis - von) % STUNDEN or STUNDEN)]


def heimatort(info: dict) -> str | None:
    """Ort mit den meisten Plätzen, wenn er mindestens die Hälfte hat; sonst folgt die Person der
    Geschichte (Victor, Nova). Beispiel: Mama (Wohnzimmer, vor dem Haus, einmal Arena) → mapleFalls."""
    zaehler: dict[str, int] = defaultdict(int)
    for p in info["plaetze"]:
        zaehler[p["karte"].split(".")[0]] += 1
    if not zaehler:
        return None
    ort, n = max(zaehler.items(), key=lambda e: (e[1], e[0]))
    return ort if n * 2 >= sum(zaehler.values()) else None


def questorte(orte: list[dict]) -> dict[str, set[str]]:
    """Kennung einer Figur („mapleFalls.lily“) → Karten, auf denen ein Questschritt sie anspricht."""
    quests = json.loads((INHALTE / "quests.json").read_text(encoding="utf-8"))["quests"]
    figuren = {f["kennung"] for o in orte for f in o["figuren"]}
    ziele: dict[str, set[str]] = defaultdict(set)
    for q in quests:
        for s in q["schritte"]:
            z = s.get("ziel") or {}
            kennung = f"{z.get('karte', '').split('.')[0]}.{z.get('objekt')}"
            if kennung in figuren:
                ziele[kennung].add(z["karte"])
    return ziele


class Belegung:
    """Wer wann wo: Feld je Karte und Stunde, und Schläfer je Ort und Stunde."""

    def __init__(self) -> None:
        self.felder: dict[tuple[str, tuple[int, int]], set[int]] = defaultdict(set)
        self.schlaf: dict[str, list[int]] = defaultdict(lambda: [0] * STUNDEN)

    def frei(self, karte: str, feld: tuple[int, int], zeit: list[int]) -> bool:
        return not self.felder[(karte, feld)] & set(zeit)

    def setze(self, karte: str, feld: tuple[int, int], zeit: list[int]) -> None:
        self.felder[(karte, feld)] |= set(zeit)


def grenze(stunde: int, anzahl: int) -> int:
    """Wie viele Figuren eines Orts zugleich schlafen dürfen (Entscheidung des Hauptchats,
    22.11.2026): von 0 bis 4 Uhr die Hälfte, sonst ein Drittel; in Orten unter sechs Figuren
    außerhalb der tiefen Nacht eine. Kinder zu Hause zählen nicht mit."""
    if stunde in TIEFE_NACHT:
        return max(1, anzahl // 2)
    return max(1, anzahl // 3) if anzahl >= KLEINER_ORT else 1


def schlafbeginn(ort: str, anzahl: int, belegung: Belegung, jugend: bool = False) -> tuple[int, bool]:
    """Beginn im Fenster, bei dem die Grenze in jeder Schlafstunde hält (der mit dem meisten
    Spielraum); sonst der am wenigsten belegte (zweiter Wert True: über der Grenze, die Prüfung
    meldet das, außer auf Wegen)."""
    last = belegung.schlaf[ort]
    fenster = SCHLAFBEGINN_JUGEND if jugend else SCHLAFBEGINN
    # Der Beginn mit dem meisten Spielraum (gleich viel: die Reihenfolge des Fensters)
    passend = [b for b in fenster if all(last[h] < grenze(h, anzahl) for h in stunden(b, b + SCHLAFDAUER))]
    if passend:
        return max(
            passend, key=lambda b: min(grenze(h, anzahl) - last[h] for h in stunden(b, b + SCHLAFDAUER))
        ), False
    beginn = min(fenster, key=lambda b: max(last[h] - grenze(h, anzahl) for h in stunden(b, b + SCHLAFDAUER)))
    return beginn, True


def freizeitplatz(info: dict, basis: dict, zeit: list[int], kandidaten: list, belegung: Belegung):
    """Freier Sitzplatz für den Feierabend: draußen und spürbar weg vom Arbeitsplatz (mindestens
    ``WEG_VON_DER_ARBEIT`` Felder oder eine andere Karte), sonst der nächste freie.

    Warum: Der Spieler soll den Tag sehen (Wunsch des Autors: Freizeit an einem anderen Ort). Ein
    Stuhl neben dem Tresen ist keine Freizeit. Beispiel: Boateng arbeitet im Waschsalon, abends
    sitzt er auf einer Bank an der Hauptstraße von Cedar Creek.
    """
    bx, by = basis["feld"]

    def vorrang(k):
        karte, (x, y) = k
        weg = abs(x - bx) + abs(y - by)
        anders = karte != basis["karte"] or weg >= WEG_VON_DER_ARBEIT
        return (not anders, karte not in umgebung_draussen, karte != basis["karte"], weg)

    umgebung_draussen = {k for k, _ in kandidaten if KARTENART.get(k) == "aussen"}
    if basis["karte"] in ZUHAUSE:  # Feierabend zu Hause (Mama auf dem Sofa, nicht nachts im Park)
        kandidaten = [k for k in kandidaten if k[0] == basis["karte"]]
        vorrang = lambda k: abs(k[1][0] - bx) + abs(k[1][1] - by)  # noqa: E731
    for karte, feld in sorted(kandidaten, key=vorrang):
        if belegung.frei(karte, feld, zeit):
            return karte, list(feld)
    return None


def block(art: str, von: int, bis: int, karte: str | None = None, feld=None, tut: str | None = None) -> dict:
    """Ein Block des Ablaufs; ohne Karte unsichtbar (nur Schlaf)."""
    b: dict = {"art": art, "von": von, "bis": bis % STUNDEN}
    if karte:
        b.update({"karte": karte, "feld": list(feld)})
    if tut:
        b["tut"] = tut
    return b


def ist_kind(rolle: dict) -> bool:
    """Kind bis 13 (Alter aus Dokument 25); Jugendliche wie Sam (15) zählen als Erwachsene."""
    return bool(rolle.get("kind")) and (rolle.get("alter") or KIND_BIS + 1) <= KIND_BIS


def ohne_schlaf(person: str, info: dict, rolle: dict) -> str | None:
    """Grund, warum jemand nie schläft (Geist, Roboter, Dienst für den Spieler), sonst None."""
    if info["geist"]:
        return "geist"
    if "roboter" in person:
        return "roboter"
    if person in DIENST_NAMEN or DIENST.search(rolle.get("rolle", "")):
        return "dienst"
    return None


def setze(
    belegung: Belegung, bloecke: list, art: str, von: int, bis: int, platz: tuple | None, tut: str
) -> None:
    """Block anhängen und den Platz für seine Stunden belegen (leere Blöcke fallen weg)."""
    if von % STUNDEN == bis % STUNDEN:
        return
    if platz:
        belegung.setze(platz[0], tuple(platz[1]), stunden(von, bis))
    bloecke.append(block(art, von, bis, *(platz or (None, None)), tut if platz else None))


def ablauf_kind(basis: dict, tut: str, umgebung: dict, belegung: Belegung, person: str) -> list:
    """Kinder: morgens und tagsüber am Platz, nachmittags draußen auf einer Bank, 21 bis 7 zu Hause."""
    ende = streu(person, ARBEITSBEGINN) + ARBEITSDAUER
    platz = (basis["karte"], basis["feld"])
    frei = freizeitplatz({}, basis, stunden(ende, ZUHAUSE_VON), umgebung["sitze"], belegung)
    bloecke: list = []
    setze(belegung, bloecke, "arbeit", ZUHAUSE_BIS, ende, platz, tut)
    setze(belegung, bloecke, "freizeit", ende, ZUHAUSE_VON, frei or platz, "sitzt" if frei else tut)
    bloecke.append(block("zuhause", ZUHAUSE_VON, ZUHAUSE_BIS))
    return bloecke


def ablauf_erwachsen(
    person: str, basis: dict, tut: str, ort: str, umgebung: dict, belegung: Belegung, jugend: bool
):
    """Erwachsene und Jugendliche: Morgen, Arbeit, Abend draußen, Nacht drinnen, drei Stunden Schlaf."""
    schlaf, ueber = schlafbeginn(ort, umgebung["anzahl"], belegung, jugend)
    for h in stunden(schlaf, schlaf + SCHLAFDAUER):
        belegung.schlaf[ort][h] += 1
    wach = (schlaf + SCHLAFDAUER) % STUNDEN
    arbeit = streu(person, ARBEITSBEGINN)
    ende = arbeit + ARBEITSDAUER
    platz = (basis["karte"], basis["feld"])
    frei = freizeitplatz({}, basis, stunden(ende, NACHT_VON), umgebung["sitze"], belegung)
    nacht_zeit = stunden(NACHT_VON, schlaf) + stunden(wach, NACHT_BIS)
    # Eine Wohnung ist nur für ihre Bewohner ein Nachtplatz (Sam nicht im Wohnzimmer des Helden).
    nachtsitze = [s for s in umgebung["nachtsitze"] if s[0] not in ZUHAUSE or s[0] == basis["karte"]]
    nacht = freizeitplatz({}, basis, nacht_zeit, nachtsitze, belegung) or frei
    bloecke: list = []
    setze(belegung, bloecke, "freizeit", NACHT_BIS, arbeit, platz, tut)
    setze(belegung, bloecke, "arbeit", arbeit, ende, platz, tut)
    setze(belegung, bloecke, "freizeit", ende, NACHT_VON, frei or platz, "sitzt" if frei else tut)
    setze(belegung, bloecke, "nacht", NACHT_VON, schlaf, nacht or platz, "sitzt" if nacht else tut)
    bett = next((b for b in umgebung["betten"] if belegung.frei(*b, list(range(STUNDEN)))), None)
    if bett and bett[0] == basis["karte"]:
        belegung.setze(*bett, list(range(STUNDEN)))  # ein Bett gehört einer Person
        bloecke.append(block("schlaf", schlaf, wach, bett[0], bett[1], "liegt"))
    else:
        bloecke.append(block("schlaf", schlaf, wach))
    setze(belegung, bloecke, "nacht", wach, NACHT_BIS, nacht or platz, "sitzt" if nacht else tut)
    return bloecke, ueber


def ablauf(person: str, info: dict, ort: str, rolle: dict, umgebung: dict, belegung: Belegung) -> dict:
    """Ablauf einer Person in ihrem Heimatort (siehe Dateikopf)."""
    eigene = [p for p in info["plaetze"] if p["karte"].startswith(ort + ".")]
    basis = next((p for p in eigene if not p["wenn"]), eigene[0])
    tut = ("sitzt" if basis["sitzt"] == "moebel" else "sitzt am Boden") if basis["sitzt"] else "steht"
    kind = ist_kind(rolle)
    eintrag = {"ort": ort, "kind": kind}
    grund = ohne_schlaf(person, info, rolle)
    if grund:
        belegung.setze(basis["karte"], tuple(basis["feld"]), list(range(STUNDEN)))
        return eintrag | {
            "ohne_schlaf": grund,
            "bloecke": [block("arbeit", 0, 0, basis["karte"], basis["feld"], tut)],
        }
    if kind:
        return eintrag | {"bloecke": ablauf_kind(basis, tut, umgebung, belegung, person)}
    bloecke, ueber = ablauf_erwachsen(person, basis, tut, ort, umgebung, belegung, bool(rolle.get("kind")))
    if ueber:
        eintrag["hinweis"] = "ueber_grenze"
    return eintrag | {"bloecke": bloecke}


def bauen(ausgeschlossen: set | None = None) -> dict:
    """Alle Abläufe; Personen in mehreren Orten ohne Heimat folgen der Geschichte."""
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    karten, katalog, alle_rollen = szenen(), lade_moebel(), rollen()
    KARTENART.update({k: s.get("art", "aussen") for k, s in karten.items()})
    infos = personen(orte, karten, set(alle_rollen))
    quest = questorte(orte)
    belegung = Belegung()
    figuren: dict[str, dict] = {}
    for ort in orte:
        heimisch = sorted(p for p, i in infos.items() if heimatort(i) == ort["kennung"])
        if not heimisch:
            continue
        umgebung = umgebung_des_orts(ort, karten, katalog, ausgeschlossen or set())
        # Kinder gehören zum Ort (sie zählen im Nenner), schlafen aber nicht im Sinn der Grenze.
        anzahl = len(heimisch) + sum(
            1 for i in infos.values() if heimatort(i) is None and ort["kennung"] in i["orte"]
        )
        umgebung["anzahl"] = anzahl
        # Jugendliche zuerst: Ihr Schlaffenster (22 oder 23 Uhr) ist am engsten.
        for person in sorted(heimisch, key=lambda p: not alle_rollen.get(p, {}).get("kind")):
            figuren[person] = ablauf(
                person, infos[person], ort["kennung"], alle_rollen.get(person, {}), umgebung, belegung
            )
    for person, info in sorted(infos.items()):
        if person not in figuren:
            figuren[person] = {
                "orte": sorted(info["orte"]),
                "folgt_geschichte": True,
            }
    for person, eintrag in figuren.items():
        kennungen = {p["kennung"] for p in infos[person]["plaetze"]}
        orte_quest = sorted({k for kennung in kennungen for k in quest.get(kennung, set())})
        if orte_quest:
            eintrag["questorte"] = orte_quest
            if not eintrag.get("folgt_geschichte") and not any(
                b.get("karte") in orte_quest for b in eintrag["bloecke"]
            ):
                eintrag["festhalten"] = "regel1"
    return {"figuren": dict(sorted(figuren.items()))}


ERKLAERUNG = (
    "Tagesabläufe der benannten Figuren (Wunsch des Autors, 22.11.2026; Entwurf aus "
    "pipeline/abenteuer/tagesablauf_entwurf.py, Prüfung pipeline/abenteuer/tagesablauf.py). Stunden "
    "der Spieluhr 0 bis 23 (Morgen 6–9, Tag 9–18, Abend 18–21, Nacht 21–6). bloecke: art (arbeit, "
    "freizeit, nacht, schlaf, zuhause), von, bis (bis ausschließlich, über Mitternacht möglich, 0 bis"
    " 0 heißt den ganzen Tag), karte und feld, tut (steht, sitzt, sitzt am Boden, liegt). Ohne Karte "
    "unsichtbar, ohne Kollision, nicht ansprechbar: schlaf (drei Stunden, Beginn 22 bis 2 Uhr) und "
    "zuhause (Kinder bis 13, 21 bis 7 Uhr). nacht: wach zwischen 21 und 6 Uhr, drinnen (Diner, "
    "Kantine, eigene Wohnung) oder unter einer Laterne. ohne_schlaf: geist, roboter, dienst (für den "
    "Spieler). hinweis: ueber_grenze (Wege, zu wenige Figuren). folgt_geschichte: Figur in mehreren "
    "Orten ohne Heimat, steht immer, wo die Szene sie hinstellt. Regel 1: Ein offener Questschritt "
    "hält seine Figur wach an ihrem Questort (questorte; festhalten = regel1, wo der Ablauf sie sonst"
    " woanders hätte). Wechsel nur beim Kartenwechsel."
)


RUNDEN = 15  # so oft wird neu gebaut, wenn Sitzende einen Weg sperren


def sperrende_sitze(daten: dict) -> set:
    """Sitzplätze, deren Sitzende laut Prüfung einen Weg sperren (Karte, Feld)."""
    from pipeline.abenteuer import tagesablauf as pruefung

    karten = pruefung.Karten()
    plaene = {n: pruefung.stundenplan(e) for n, e in daten.items() if e.get("bloecke")}
    sitze = set()
    for befund in pruefung.pruefe_aufstellungen(daten, karten):
        m = re.match(r"(\S+): Figuren versperren .* \(um (\d+) Uhr\)", befund)
        if not m:
            continue
        karte, h = m.group(1), int(m.group(2))
        for plan in plaene.values():
            b = plan[h]
            if b.get("karte") == karte and b["art"] in ("freizeit", "nacht") and b.get("tut") == "sitzt":
                sitze.add((karte, tuple(b["feld"])))
    return sitze


ZEILENBREITE = 100  # wie printWidth in app/.prettierrc


def kurze_liste(m: re.Match) -> str:
    """Eine Liste in eine Zeile, wie Prettier sie schreibt. Beispiel: „[16, 7]“."""
    teile = re.split(r",\s+", m.group(3))
    zeile = f"{m.group(1)}{m.group(2)}[{', '.join(teile)}]"
    # Prettier zählt das folgende Komma mit.
    return zeile if len(zeile) + 1 <= ZEILENBREITE else m.group(0)


def main() -> None:
    """Datei schreiben; Sitze, die einen Weg sperren, fallen weg und es wird neu gebaut."""
    ausgeschlossen: set = set()
    for _ in range(RUNDEN):
        daten = bauen(ausgeschlossen)["figuren"]
        neu = sperrende_sitze(daten) - ausgeschlossen
        if not neu:
            break
        ausgeschlossen |= neu
    inhalt = {"erklaerung": ERKLAERUNG, "schemaVersion": 1, "figuren": daten}
    text = json.dumps(inhalt, ensure_ascii=False, indent=2)
    text = re.sub(r"(?m)^( *)(.*)\[\s+([^\[\]{}]*?)\s+\]", kurze_liste, text)
    ZIEL.write_text(text + "\n", encoding="utf-8")
    print(f"{ZIEL}: {len(daten)} Figuren, {len(ausgeschlossen)} Sitze ausgeschlossen")


if __name__ == "__main__":
    main()
