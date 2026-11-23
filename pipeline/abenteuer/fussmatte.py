"""Befehl: Liegt jede Fußmatte perspektivisch direkt hinter ihrer Tür? (Wunsch des Autors, 20.11.2026)

Warum: Notiz des Autors im Karteneditor (Drechslerei, 20.11.2026): „Fußmatten sollten perspektivisch
direkt hinter der Tür liegen.“ In den Karten seines Pakets hat er alle Matten so gelegt (Clubraum,
Diner, Wohnzimmer, Bibliothek, Drechslerei, Waschsalon). Daraus die Regel:

- Gemessen wird an den sichtbaren Pixeln: Die Unterkante der Matte reicht ``UEBERLAPPUNG`` Pixel
  (5 bis 7, im Mittel 6) unter die Oberkante der Tür in der Südwand. Die Matte liegt darunter
  (``ebene`` −2, unter allem), die Tür darüber mit ``DECKKRAFT`` 75 %. Notiz des Autors (Clubraum):
  „Die Transparenz verdeutlicht, dass es hier rausgeht. Darüber hinaus erkennt man so besser, dass
  es Fußmatten sind, die dahinter liegen.“ Ohne sie verdeckte die volle Tür die halbe Matte.
- Eine Matte gehört zu der Tür, deren sichtbare Fläche sie waagerecht überdeckt. Liegt eine Matte
  ohne eigene Tür bündig neben einer Türmatte in derselben Reihe (Kantine Ironwood: drei Matten vor
  zwei Türflügeln), rückt sie mit.
- Nur innen: Außen liegen keine Fußmatten (Stand 23.11.2026); 10.86 verlangt sie innen
  (anordnung_raum.pruefe_fussmatten).

Die sichtbaren Ränder der Tür- und Mattenbilder stehen in ``fussmatte_masse.json`` (gemessen mit
``--messen PRIVAT``, braucht Pillow und das private Paket), damit der Dauertest ohne Bilder läuft.
Ausnahmen mit Grund stehen in GEPRUEFT. Dauertest (pipeline/tests): „0 Befunde“.

Ablauf (im Hauptordner): python -m pipeline.abenteuer.fussmatte [--messen PRIVAT] [--beheben]
[--bericht DATEI]
"""

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.kartenbau import INHALTE, K, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel

MASSE = Path(__file__).with_name("fussmatte_masse.json")
MATTE = re.compile(r"fussmatte", re.I)
UEBERLAPPUNG = 6  # so viele Pixel liegt die Matte unter der Türoberkante (Paketkarten des Autors)
SPIEL = 1  # erlaubte Abweichung in Pixeln (der Autor legte 5 bis 7)
EBENE = -2  # Matte flach unter allem, wie in den Paketkarten des Autors
DECKKRAFT = 75  # Tür über der Matte durchscheinend, wie in den Paketkarten des Autors
SUCHRAUM = K  # so weit über oder unter der Türoberkante darf eine Matte liegen, um dazuzugehören
NACHBAR = 2  # Lücke in Pixeln, bis zu der eine Matte als Nachbarin gilt (je 1 px durchsichtiger Rand)
DECKT = 40  # Deckkraft (0–255), ab der ein Pixel sichtbar ist (wie sitzumriss.ts)
# (Szene, Feld der Matte) → Grund.
GEPRUEFT: dict[tuple[str, tuple[int, int]], str] = {}

Rechteck = tuple[int, int, int, int]  # links, oben, rechts, unten (unten und rechts ausschließlich)


@dataclass
class Befund:
    """Eine Matte, die nicht hinter ihrer Tür liegt: Szene, Index des Objekts, Verschiebung."""

    szene: str
    index: int
    feld: tuple[int, int]
    tuer: str
    abstand: int
    ebene_fehlt: bool
    tuer_index: int = -1
    deckkraft_fehlt: bool = False

    @property
    def verschiebung(self) -> int:
        """Pixel nach unten (positiv), damit die Matte UEBERLAPPUNG unter der Tür liegt."""
        return self.abstand + UEBERLAPPUNG

    def text(self) -> str:
        teile = []
        if abs(self.verschiebung) > SPIEL:
            teile.append(f"{-self.abstand} px unter der Türoberkante statt {UEBERLAPPUNG}")
        if self.ebene_fehlt:
            teile.append(f"nicht unter allem (ebene {EBENE})")
        if self.deckkraft_fehlt:
            teile.append(f"Tür nicht durchscheinend ({DECKKRAFT} %)")
        return f"{self.szene}: Fußmatte {self.feld} an {self.tuer}: " + ", ".join(teile)


def ist_matte(name: str) -> bool:
    """Fußmatte am Namen (Turnmatten und Teppiche zählen nicht)."""
    return bool(MATTE.search(name))


def lade_masse() -> dict[str, list[int]]:
    """Sichtbare Ränder je Bild (Name → [links, oben, rechts, unten] im Bild)."""
    return json.loads(MASSE.read_text(encoding="utf-8")) if MASSE.exists() else {}


def sichtbar(stueck: dict, masse: dict) -> Rechteck | None:
    """Sichtbares Rechteck eines gesetzten Stücks in Kartenpixeln, oder None ohne Messung."""
    rand = masse.get(stueck["name"])
    if rand is None:
        return None
    return (stueck["x"] + rand[0], stueck["y"] + rand[1], stueck["x"] + rand[2], stueck["y"] + rand[3])


def _nummern(szene: dict) -> dict[str, int]:
    """Kennung eines gesetzten Stücks (id oder „möbel@index“) → Index des Objekts in der Szene."""
    return {o.get("id", f"{o['moebel']}@{j}"): j for j, o in enumerate(szene.get("objekte", []))}


Tuer = tuple[str, Rechteck, str]  # Name, sichtbares Rechteck, Kennung des gesetzten Stücks


def _tuer_zur_matte(matte: Rechteck, tueren: list[Tuer]) -> Tuer | None:
    """Die Tür, deren sichtbare Fläche die Matte waagerecht überdeckt und nahe darunter liegt."""
    mitte = (matte[0] + matte[2]) / 2
    for tuer in tueren:
        t = tuer[1]
        if t[0] <= mitte < t[2] and abs(t[1] - matte[3]) <= SUCHRAUM:
            return tuer
    return None


def pruefe_szene(name: str, szene: dict, moebel: dict, masse: dict) -> list[Befund]:
    """Befunde einer Szene (nur innen)."""
    if szene.get("art") != "innen":
        return []
    wand = (len(raster(szene)) - 1) * K
    gesetzt, _ = platziere(szene, moebel)
    nummern, objekte = _nummern(szene), szene.get("objekte", [])
    tueren = [
        (s["name"], r, s["id"])
        for s in gesetzt
        if moebel.get(s["name"], {}).get("art") == "tuer" and (r := sichtbar(s, masse)) and r[3] > wand
    ]
    matten = [(s, r) for s in gesetzt if ist_matte(s["name"]) and (r := sichtbar(s, masse))]
    zuordnung = {s["id"]: (t, r) for s, r in matten if (t := _tuer_zur_matte(r, tueren))}
    for s, r in matten:  # Nachbarinnen in derselben Reihe rücken mit ihrer Türmatte
        for andere, ar in matten:
            if s["id"] not in zuordnung and andere["id"] in zuordnung and ar[3] == r[3]:
                if min(abs(ar[2] - r[0]), abs(r[2] - ar[0])) <= NACHBAR:
                    zuordnung[s["id"]] = (zuordnung[andere["id"]][0], r)
    befunde = []
    for kennung, ((tuer, t, tuer_kennung), r) in zuordnung.items():
        index, tuer_index = nummern[kennung], nummern[tuer_kennung]
        feld = tuple(objekte[index].get("feld", (0, 0)))
        befund = Befund(name, index, feld, tuer, t[1] - r[3], objekte[index].get("ebene", 0) >= 0)
        befund.tuer_index = tuer_index
        befund.deckkraft_fehlt = objekte[tuer_index].get("deckkraft") != DECKKRAFT
        falsch = abs(befund.verschiebung) > SPIEL or befund.ebene_fehlt or befund.deckkraft_fehlt
        if falsch and (name, feld) not in GEPRUEFT:
            befunde.append(befund)
    return sorted(befunde, key=lambda b: b.index)


def szenendateien() -> list[Path]:
    """Alle Szenen (auch Varianten)."""
    return sorted((INHALTE / "szenen").glob("**/*.json"))


def alle_befunde(masse: dict | None = None) -> list[Befund]:
    """Befunde aller Szenen."""
    moebel, masse = lade_moebel(), masse if masse is not None else lade_masse()
    befunde = []
    for pfad in szenendateien():
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        befunde += pruefe_szene(str(pfad.relative_to(INHALTE / "szenen")), szene, moebel, masse)
    return befunde


def behebe(befunde: list[Befund]) -> list[str]:
    """Setzt Versatz und Ebene der Matten und die Deckkraft ihrer Tür (nichts wird gelöscht).
    Ausgabe: geänderte Szenen."""
    from pipeline.abenteuer.editorrueck import als_text

    geaendert = []
    for datei in sorted({b.szene for b in befunde}):
        pfad = INHALTE / "szenen" / datei
        alt = pfad.read_text(encoding="utf-8")
        szene = json.loads(alt)
        for b in (b for b in befunde if b.szene == datei):
            objekt = szene["objekte"][b.index]
            dx, dy = objekt.get("versatz", [0, 0])
            objekt["versatz"] = [dx, dy + b.verschiebung]
            objekt["ebene"] = EBENE
            szene["objekte"][b.tuer_index]["deckkraft"] = DECKKRAFT
        pfad.write_text(als_text(szene, alt), encoding="utf-8")
        geaendert.append(datei)
    return geaendert


def messe(privat: Path) -> dict[str, list[int]]:
    """Sichtbare Ränder aller Tür- und Mattenbilder des Katalogs (braucht Pillow und das Paket)."""
    from pipeline.abenteuer.kartenbild import moebelbild

    masse = {}
    for name, angabe in sorted(lade_moebel().items()):
        if angabe.get("art") != "tuer" and not ist_matte(name):
            continue
        try:
            bild = moebelbild(privat, angabe)
        except (OSError, KeyError, ValueError):
            continue
        rand = bild.getchannel("A").point(lambda a: 255 if a > DECKT else 0).getbbox()
        if rand:
            masse[name] = list(rand)
    return masse


def main() -> None:
    """Prüft (und behebt) alle Szenen; Aufruf im Dateikopf."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--messen", type=Path, help="privates Paket: Ränder neu messen")
    teiler.add_argument("--beheben", action="store_true")
    teiler.add_argument("--bericht", type=Path, default=Path("buch/arbeit/fussmatte/bericht.md"))
    a = teiler.parse_args()
    if a.messen:
        MASSE.write_text(json.dumps(messe(a.messen), indent=1, sort_keys=True) + "\n", encoding="utf-8")
    befunde = alle_befunde()
    zeilen = [b.text() for b in befunde]
    if a.beheben and befunde:
        geaendert = behebe(befunde)
        zeilen.append(f"behoben in {len(geaendert)} Szenen: {', '.join(geaendert)}")
    a.bericht.parent.mkdir(parents=True, exist_ok=True)
    a.bericht.write_text(
        "# Fußmatten hinter der Tür\n\n" + "".join(f"- {z}\n" for z in zeilen), encoding="utf-8"
    )
    print(f"{len(befunde)} Befunde → {a.bericht}")
    for z in zeilen:
        print(f"  {z}")


if __name__ == "__main__":
    main()
