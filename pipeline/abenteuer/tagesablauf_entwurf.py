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
ZUHAUSE = {"mapleFalls.wohnzimmer", "ironwood.mamasZimmer", "riverton.wohnwagen"}  # Wohnungen
KARTENART: dict[str, str] = {}  # Karte → „aussen“ oder „innen“ (aus den Szenen, in bauen gefüllt)
KLEINER_ORT = 6  # darunter darf höchstens eine Figur zugleich schlafen
SCHLAFDAUER = 3
ARBEITSDAUER = 8
SCHLAFBEGINN = (23, 0, 22, 1, 2)  # Wunschfenster 22 bis 2 Uhr, bevorzugt um Mitternacht
SCHLAFBEGINN_KIND = (22, 23, 0, 1, 2)  # Kinder lieber früh
SCHLAFBEGINN_NOT = (21, 3, 20, 4, 19, 5)  # nur wenn das Drittel sonst nicht reicht
ARBEITSBEGINN = (8, 9, 10)
EIGENE_ZEIT = ("erinnerung",)  # Orte mit eigener Zeit (Erinnerungen)
DIENST = re.compile(
    r"Kiosk|Zeitungsstand|Eisenwaren|Food-Truck|Gebäckstand|Antiquariat|Raststätte|Diner|Koch|Wirt"
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


def schlafbeginn(ort: str, platz: int, belegung: Belegung, kind: bool = False) -> tuple[int, bool]:
    """Erster Beginn im Wunschfenster, bei dem höchstens ``platz`` gleichzeitig schlafen; sonst der
    am wenigsten belegte (zweiter Wert True: über dem Drittel)."""
    last = belegung.schlaf[ort]
    for beginn in (SCHLAFBEGINN_KIND if kind else SCHLAFBEGINN) + SCHLAFBEGINN_NOT:
        if all(last[h] < platz for h in stunden(beginn, beginn + SCHLAFDAUER)):
            return beginn, False
    beginn = min(SCHLAFBEGINN, key=lambda b: max(last[h] for h in stunden(b, b + SCHLAFDAUER)))
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


def ablauf(person: str, info: dict, ort: str, rolle: dict, umgebung: dict, belegung: Belegung) -> dict:
    """Ablauf einer Person in ihrem Heimatort (siehe Dateikopf)."""
    eigene = [p for p in info["plaetze"] if p["karte"].startswith(ort + ".")]
    basis = next((p for p in eigene if not p["wenn"]), eigene[0])
    tut = ("sitzt" if basis["sitzt"] == "moebel" else "sitzt am Boden") if basis["sitzt"] else "steht"
    eintrag = {"ort": ort, "kind": rolle.get("kind", False)}
    if info["geist"] or "roboter" in person or DIENST.search(rolle.get("rolle", "")):
        grund = "geist" if info["geist"] else "roboter" if "roboter" in person else "dienst"
        belegung.setze(basis["karte"], tuple(basis["feld"]), list(range(STUNDEN)))
        return eintrag | {
            "ohne_schlaf": grund,
            "bloecke": [block("arbeit", 0, 0, basis["karte"], basis["feld"], tut)],
        }
    schlaf, ueber = schlafbeginn(ort, umgebung["platz"], belegung, rolle.get("kind", False))
    for h in stunden(schlaf, schlaf + SCHLAFDAUER):
        belegung.schlaf[ort][h] += 1
    wach = (schlaf + SCHLAFDAUER) % STUNDEN
    arbeit = streu(person, ARBEITSBEGINN)
    ende = arbeit + ARBEITSDAUER
    frei = freizeitplatz(info, basis, stunden(ende, schlaf), umgebung["sitze"], belegung)
    belegung.setze(basis["karte"], tuple(basis["feld"]), stunden(wach, ende))
    bloecke = [block("arbeit", arbeit, ende, basis["karte"], basis["feld"], tut)]
    if wach != arbeit:  # Schläft die Figur bis zum Arbeitsbeginn, gibt es keinen Morgen
        bloecke.insert(0, block("freizeit", wach, arbeit, basis["karte"], basis["feld"], tut))
    if frei:
        belegung.setze(frei[0], tuple(frei[1]), stunden(ende, schlaf))
        bloecke.append(block("freizeit", ende, schlaf, frei[0], frei[1], "sitzt"))
    elif ende % STUNDEN != schlaf:
        belegung.setze(basis["karte"], tuple(basis["feld"]), stunden(ende, schlaf))
        bloecke.append(block("freizeit", ende, schlaf, basis["karte"], basis["feld"], tut))
    bett = next((b for b in umgebung["betten"] if belegung.frei(*b, list(range(STUNDEN)))), None)
    if bett and any(p["karte"] == bett[0] for p in eigene):
        belegung.setze(*bett, list(range(STUNDEN)))  # ein Bett gehört einer Person
        bloecke.append(block("schlaf", schlaf, wach, bett[0], bett[1], "liegt"))
    else:
        bloecke.append(block("schlaf", schlaf, wach))
    if ueber:
        eintrag["hinweis"] = "ueber_drittel"  # zu wenige Figuren im Ort
    elif schlaf not in SCHLAFBEGINN:
        eintrag["hinweis"] = "schlaf_verschoben"  # außerhalb 22 bis 2, damit höchstens ein Drittel schläft
    return eintrag | {"bloecke": bloecke}


def schlafplaetze_im_ort(anzahl: int) -> int:
    """Wie viele zugleich schlafen dürfen: ein Drittel, in Orten unter sechs Figuren eine."""
    return max(1, anzahl // 3) if anzahl >= KLEINER_ORT else 1


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
        anzahl = len(heimisch) + sum(
            1 for i in infos.values() if heimatort(i) is None and ort["kennung"] in i["orte"]
        )
        umgebung["platz"] = schlafplaetze_im_ort(anzahl)
        for person in heimisch:
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
    "freizeit, schlaf), von, bis (bis ausschließlich, über Mitternacht möglich, 0 bis 0 heißt den "
    "ganzen Tag), karte und feld, tut (steht, sitzt, liegt). Schlaf ohne Karte: unsichtbar, ohne "
    "Kollision, nicht ansprechbar. ohne_schlaf: geist, roboter, dienst (für den Spieler). "
    "hinweis: schlaf_verschoben (außerhalb 22 bis 2), ueber_drittel. "
    "folgt_geschichte: Figur in mehreren Orten ohne Heimat, steht immer, wo die Szene sie hinstellt. "
    "Regel 1: Ein offener Questschritt hält seine Figur wach an ihrem Questort (questorte; festhalten"
    " = regel1, wo der Ablauf sie sonst woanders hätte). Wechsel nur beim Kartenwechsel."
)


RUNDEN = 6  # so oft wird neu gebaut, wenn Sitzende einen Weg sperren


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
            if b.get("karte") == karte and b["art"] == "freizeit" and b.get("tut") == "sitzt":
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
