"""Befehl: PixelLab-Sammelexporte des Autors in die Figurenordner figuren-neu/<name>/ übernehmen.

Warum: Der Autor hat alle Menschen des Spiels in PixelLab gezeichnet und als Sammelexporte geliefert
(privates Repository, ki-roh/selected_characters*.zip; je Zip mehrere Gruppen mit Zuständen,
Richtungen und Animationen). Der Haupt-Chat hat die Gruppen über die Prompts den Figuren
zugeordnet (ki-roh/zuordnung_23-11.json). Der Paketbau (app/skripte/figurenbogen.mjs) erwartet je
Figur einen Ordner ``spiel/figuren-neu/<name>/`` mit ``rotations/<richtung>.png``,
``animations/Walking|Running/<richtung>/frame_NNN.png`` und ``zustaende/<sitzstuhl|sitzboden|
schlaf>/rotations/``. Dieses Werkzeug baut genau diese Ordner (Auftrag des Haupt-Chats, 23.11.2026).

Entscheidungen:
- Nur die vier Richtungen, die das Spiel braucht (Süd, Nord, Ost, West); Schrägen bleiben weg.
- Das Standbild kommt aus dem Zustand nach pixellabtabelle.STANDBILD, sonst aus dem Zustand, an
  dem die Laufanimation hängt. Gehen und Rennen kommen je aus dem Zustand, an dem sie hängen.
- Zustände Sitzen auf dem Stuhl, Sitzen am Boden und Schlafen nach pixellabtabelle.ZUSTANDSORDNER.
- Doppelte Gruppen (identische Exporte) zählen einmal; Tiere (``tier.*``) macht ein anderer Helfer.
- Die 40 alten Statistenbögen (statist-NN) bekommen den Ordner ihres neuen Typs
  (pixellabtabelle.statistentyp), damit Szenen und Belebung ohne Änderung die neuen Bilder zeigen.
- Ein vorhandener Ordner einer exportierten Figur wird ersetzt; Figuren ohne Export (etwa owen,
  statist.bauer) bleiben unberührt, so behalten sie ihren alten Bogen.

Ablauf (im Hauptordner, PRIVAT ist das private Repository):
    python -m pipeline.abenteuer.pixellabimport PRIVAT            # alle Menschen
    python -m pipeline.abenteuer.pixellabimport PRIVAT --nur abe   # einzelne Figuren
Danach baut der Paketbau die Bögen (figurenbogen.mjs). Bericht der Standbildwahl nach
buch/arbeit/pixellab/import.md (nur lokal).
"""

import argparse
import json
import re
import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer import pixellabtabelle as T

ZUORDNUNG = Path("ki-roh") / "zuordnung_23-11.json"
ZIEL = Path("spiel") / "figuren-neu"
BERICHT = Path("buch") / "arbeit" / "pixellab" / "import.md"
RICHTUNGEN = ("south", "north", "east", "west")
LAUFEN = "Walking"
RENNEN = "Running"
TIERE = "tier."
GROESSE = 32


@dataclass(frozen=True)
class Zustand:
    """Ein Zustand einer Gruppe: Name, Ordner im Zip, Animationen (Name → Richtungen)."""

    name: str
    ordner: str
    animationen: dict


@dataclass(frozen=True)
class Gruppe:
    """Eine Figur im Export: Name, Zip-Datei und ihre Zustände."""

    name: str
    zip: str
    zustaende: tuple[Zustand, ...]


def lade_gruppen(privat: Path) -> list[Gruppe]:
    """Die Menschen aus der Zuordnung, je Name einmal, dazu die Zweitfiguren (ZWEITFIGUR)."""
    daten = json.loads((privat / ZUORDNUNG).read_text(encoding="utf-8"))["gruppen"]
    gruppen: dict[str, Gruppe] = {}
    for g in daten:
        if g["name"].startswith(TIERE) or g["name"] in gruppen:
            continue
        zustaende = tuple(Zustand(z["name"], z["ordner"], z.get("animationen", {})) for z in g["zustaende"])
        gruppen[g["name"]] = Gruppe(g["name"], g["zip"], zustaende)
    for neu, (quelle, anfang) in T.ZWEITFIGUR.items():
        if quelle in gruppen:
            gruppen[quelle], gruppen[neu] = _teile_zweitfigur(gruppen[quelle], neu, anfang)
    return list(gruppen.values())


def _teile_zweitfigur(gruppe: Gruppe, neu: str, anfang: str) -> tuple[Gruppe, Gruppe]:
    """Trennt den Zustand ``anfang`` als eigene Figur ``neu`` ab. Beispiel: Victoria im Pullover."""
    zweit = tuple(z for z in gruppe.zustaende if z.name.startswith(anfang))
    rest = tuple(z for z in gruppe.zustaende if not z.name.startswith(anfang))
    return Gruppe(gruppe.name, gruppe.zip, rest), Gruppe(neu, gruppe.zip, zweit)


def zustandsordner(name: str) -> str | None:
    """Ordner unter zustaende/ für einen Zustandsnamen, oder None (Stehen, Hilfszustand)."""
    klein = name.lower()
    return next((ordner for wort, ordner in T.ZUSTANDSORDNER if wort in klein), None)


def mit_animation(gruppe: Gruppe, animation: str) -> Zustand | None:
    """Der Zustand, an dem eine Animation hängt (Gehen, Rennen), oder None."""
    return next((z for z in gruppe.zustaende if animation in z.animationen), None)


def standzustand(gruppe: Gruppe) -> tuple[Zustand, str]:
    """Zustand für das Standbild und der Grund (Tabelle, sonst der Zustand mit der Laufanimation)."""
    if gruppe.name in T.STANDBILD:
        anfang, grund = T.STANDBILD[gruppe.name]
        treffer = next((z for z in gruppe.zustaende if z.name.startswith(anfang)), None)
        if treffer:
            return treffer, grund
    lauf = mit_animation(gruppe, LAUFEN)
    if lauf:
        return lauf, "Zustand mit der Laufanimation: beim Losgehen wechselt nur die Bewegung."
    erster = next(z for z in gruppe.zustaende if not zustandsordner(z.name))
    return erster, "Kein Zustand mit Laufanimation: der erste stehende Zustand."


def _kopiere(archiv: zipfile.ZipFile, quelle: str, ziel: Path) -> bool:
    """Kopiert eine Datei aus dem Zip, falls vorhanden."""
    if quelle not in archiv.NameToInfo:
        return False
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_bytes(archiv.read(quelle))
    return True


def _rotationen(archiv: zipfile.ZipFile, zustand: Zustand, ziel: Path) -> int:
    """Die vier Standbilder eines Zustands nach ``ziel/rotations``."""
    return sum(
        _kopiere(archiv, f"{zustand.ordner}/rotations/{r}.png", ziel / "rotations" / f"{r}.png")
        for r in RICHTUNGEN
    )


def _animation(archiv: zipfile.ZipFile, zustand: Zustand, name: str, ziel: Path) -> int:
    """Alle Bilder einer Animation in den vier Richtungen nach ``ziel/animations/<name>``."""
    anzahl = 0
    for r in RICHTUNGEN:
        praefix = f"{zustand.ordner}/animations/{name}/{r}/"
        for datei in sorted(n for n in archiv.namelist() if n.startswith(praefix) and n.endswith(".png")):
            anzahl += _kopiere(archiv, datei, ziel / "animations" / name / r / Path(datei).name)
    return anzahl


KENNUNG_LAENGE = 20
UMLAUTE = str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"})


def kennung(name: str) -> str:
    """Kennung eines Zustands: klein, ohne Umlaute, Bindestriche, höchstens 20 Zeichen.

    Beispiel: „Without the telescop“ → „without-the-telescop“, „Idle“ → „idle“.
    """
    klein = re.sub(r"[^a-z0-9]+", "-", name.lower().translate(UMLAUTE)).strip("-")
    return klein[:KENNUNG_LAENGE].rstrip("-")


def _weitere_standbilder(archiv: zipfile.ZipFile, gruppe: Gruppe, stand: Zustand, ziel: Path) -> None:
    """Weitere stehende Zustände nach standbilder/<kennung>/rotations und standbilder.json.

    Abstimmung mit mittel-1 (Editor 1.9, Zustandswahl je Figur, 23.11.2026): alle Zustände außer
    dem gewählten Standbild, den Hilfszuständen fürs Gehen und Rennen und den Sitz- und
    Liegezuständen. Die Liste nennt auch den Standard (das Bild unter rotations/).
    """
    hilfe = {z.name for a in (LAUFEN, RENNEN) if (z := mit_animation(gruppe, a)) and z != stand}
    liste = [{"kennung": kennung(stand.name), "name": stand.name, "standard": True}]
    for z in gruppe.zustaende:
        if z == stand or z.name in hilfe or zustandsordner(z.name):
            continue
        if _rotationen(archiv, z, ziel / "standbilder" / kennung(z.name)):
            liste.append({"kennung": kennung(z.name), "name": z.name, "standard": False})
    daten = json.dumps(liste, ensure_ascii=False, indent=2) + "\n"
    (ziel / "standbilder.json").write_text(daten, encoding="utf-8")


def _metadaten(gruppe: Gruppe, stand: Zustand, ziel: Path) -> None:
    """metadata.json wie im Einzelexport (Leinwand für figurenbogen.mjs) mit der Herkunft."""
    daten = {
        "states": [{"name": stand.name, "character": {"size": {"width": GROESSE, "height": GROESSE}}}],
        "quelle": {"zip": gruppe.zip, "zustaende": [z.name for z in gruppe.zustaende]},
    }
    (ziel / "metadata.json").write_text(json.dumps(daten, ensure_ascii=False, indent=2) + "\n", "utf-8")


def schreibe_figur(privat: Path, gruppe: Gruppe) -> dict:
    """Baut figuren-neu/<name>/ neu aus dem Export; Rückgabe: was übernommen wurde (für den Bericht)."""
    ziel = privat / ZIEL / gruppe.name
    if ziel.exists():
        shutil.rmtree(ziel)
    ziel.mkdir(parents=True)
    stand, grund = standzustand(gruppe)
    with zipfile.ZipFile(privat / gruppe.zip) as archiv:
        bilder = _rotationen(archiv, stand, ziel)
        animationen = {}
        for name in (LAUFEN, RENNEN):
            quelle = mit_animation(gruppe, name)
            if quelle:
                animationen[name] = (quelle.name, _animation(archiv, quelle, name, ziel))
        _weitere_standbilder(archiv, gruppe, stand, ziel)
        zustaende = {}
        for z in gruppe.zustaende:
            ordner = zustandsordner(z.name)
            if ordner and ordner not in zustaende:
                zustaende[ordner] = _rotationen(archiv, z, ziel / "zustaende" / ordner)
    _metadaten(gruppe, stand, ziel)
    return {
        "stand": stand.name,
        "grund": grund,
        "bilder": bilder,
        "animationen": animationen,
        "zustaende": zustaende,
    }


def schreibe_statisten(privat: Path) -> dict[str, str]:
    """Die alten Statistenbögen statist-NN als Kopie ihres neuen Typs (falls der Typ da ist)."""
    zuordnung = {}
    for nummer in range(1, T.STATISTEN + 1):
        typ = T.statistentyp(nummer)
        quelle = privat / ZIEL / typ
        if not quelle.exists():
            continue
        name = f"statist-{nummer:02d}"
        ziel = privat / ZIEL / name
        if ziel.exists():
            shutil.rmtree(ziel)
        shutil.copytree(quelle, ziel)
        zuordnung[name] = typ
    return zuordnung


def bericht(ergebnisse: dict[str, dict], statisten: dict[str, str]) -> str:
    """Markdown-Bericht: je Figur Standbild mit Grund, Animationen, Zustände; Statistenzuordnung."""
    zeilen = [
        "# PixelLab-Import",
        "",
        "| Figur | Standbild | Grund | Gehen / Rennen | Zustände |",
        "|---|---|---|---|---|",
    ]
    for name, e in sorted(ergebnisse.items()):
        anim = ", ".join(f"{a} ({z})" for a, (z, _) in e["animationen"].items()) or "–"
        zst = ", ".join(e["zustaende"]) or "–"
        zeilen.append(f"| {name} | {e['stand']} | {e['grund']} | {anim} | {zst} |")
    zeilen += ["", "## Statisten", ""] + [f"- {n} → {t}" for n, t in sorted(statisten.items())]
    return "\n".join(zeilen) + "\n"


def main() -> None:
    """Übernimmt die Menschen aus den Sammelexporten und schreibt den Bericht."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("privat", type=Path, help="privates Repository (schach-abenteuer-inhalte)")
    parser.add_argument("--nur", nargs="*", default=None, help="nur diese Figuren")
    args = parser.parse_args()
    gruppen = [g for g in lade_gruppen(args.privat) if args.nur is None or g.name in args.nur]
    ergebnisse = {g.name: schreibe_figur(args.privat, g) for g in gruppen}
    statisten = schreibe_statisten(args.privat) if args.nur is None else {}
    BERICHT.parent.mkdir(parents=True, exist_ok=True)
    BERICHT.write_text(bericht(ergebnisse, statisten), encoding="utf-8")
    print(f"{len(ergebnisse)} Figuren, {len(statisten)} Statistenbögen; Bericht {BERICHT}")


if __name__ == "__main__":
    main()
