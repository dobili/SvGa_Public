"""Paket des Karteneditors: Editorseite und alle Daten in einem Ordner, offline per Doppelklick.

Warum: Der Autor will Karten selbst zurechtrücken (Wunsch des Autors, 15.11.2026). Der Code des
Editors liegt öffentlich in ``werkzeuge/karteneditor/``; die Bilder (u. a. LimeZu) dürfen aber nicht
öffentlich als Bibliothek herumliegen. Deshalb baut dieses Skript ein privates Paket: die Editorseite
und ``daten.js`` (``window.EDITOR_DATEN = {…}``, per ``<script src>`` geladen, damit die Seite auch
über file:// läuft) mit allen Szenen, der Bibliothek, jedem Bild als data-URL, den Hintergründen
der Karten und den Boden- und Wandkacheln, dazu (ab Editor 1.4) die Übergänge aller Orte aus
``orte.json`` (nur Name, Karte, Art, Ziel) und das Verzeichnis der Karten als Ziele, (ab Editor
1.7) die Standbilder der Figuren und Statisten je Blickrichtung (``editorpersonen.py``).

Aufruf: ``python -m pipeline.abenteuer.editorpaket PRIVAT ZIEL`` (ZIEL üblich: ``PRIVAT/editor``).
Optionen: ``--nur maple-falls-diner`` (nur diese Szenen, für Tests), ``--szenen`` und ``--moebel``
(andere Ordner, für Tests). Braucht Pillow nicht: Bilder gehen unverändert als PNG ins Paket, nur
die Kacheln werden ausgeschnitten (dafür Pillow).
"""

import argparse
import base64
import json
import shutil
import sys
from datetime import UTC, datetime
from pathlib import Path

from pipeline.abenteuer.editorkatalog import UMGEBUNG, bibliothekseintrag
from pipeline.abenteuer.kartenbau import HAUPT, INHALTE, K, lade
from pipeline.abenteuer.katalog import katalogeintraege
from pipeline.abenteuer.moebelliste import ORDNER as MOEBELORDNER
from pipeline.abenteuer.moebelliste import moebeldateien

EDITOR = HAUPT / "werkzeuge" / "karteneditor"
# Version des Datenformats im Paket; der Editor nennt seine eigene Version in js/zustand.js.
PAKETFORMAT = 1
VARIANTEN = "varianten"  # Unterordner der Varianten B und C (szenen/varianten/README.md)
# Was aus werkzeuge/karteneditor/ ins Paket kommt (der Test bleibt draußen).
EDITORDATEIEN = ("index.html", "editor.css", "js")


def data_url(pfad: Path) -> str:
    """Eine Bilddatei als data-URL. Beispiel: sofa.png → ``data:image/png;base64,iVBOR…``."""
    art = "image/webp" if pfad.suffix == ".webp" else "image/png"
    return f"data:{art};base64," + base64.b64encode(pfad.read_bytes()).decode("ascii")


def bildpfad(privat: Path, quelle: str) -> Path | None:
    """Das Bild eines Möbels wie im Spiel: die umgefärbte Schattenfassung geht vor (kartenbild.py)."""
    for pfad in (privat / "spiel" / "schatten" / quelle, privat / quelle):
        if pfad.exists():
            return pfad
    return None


def lade_szenen(ordner: Path, nur: list[str] | None = None) -> list[tuple[str, dict]]:
    """Alle Szenen als (Dateiname, Szene), nach Namen sortiert, danach die Varianten B und C aus dem
    Unterordner ``varianten/`` (Dateiname ``varianten/<name>.json``, Editor ab 1.2).

    Beispiel: ``nur=["maple-falls-diner"]`` → nur ``maple-falls-diner.json``.
    """
    szenen = []
    for pfad in [*sorted(ordner.glob("*.json")), *sorted((ordner / VARIANTEN).glob("*.json"))]:
        if nur and pfad.stem not in nur:
            continue
        name = pfad.name if pfad.parent == ordner else f"{VARIANTEN}/{pfad.name}"
        szenen.append((name, lade(pfad)))
    return szenen


def figurangaben(orte: list[dict], ort: str) -> dict[str, dict]:
    """Bedingung (``wenn``) und Dialog der Figuren eines Ortes aus orte.json, nach Namen auf der Karte.

    Warum: Der Editor zeigt Figuren als Hindernis; steht eine nur unter einer Bedingung da, bekommt
    sie eine gestrichelte Umrandung. Beispiel: mapleFalls → {"ambrose": {"wenn": "nicht
    abschiedGesehen", "dialog": "maple-falls-dachboden.ambrose"}, …}.
    """
    ergebnis = {}
    for o in (o for o in orte if o["kennung"] == ort):
        for f in o.get("figuren", []):
            name = f["kennung"].removeprefix(f"{ort}.")
            ergebnis[name] = {k: f[k] for k in ("wenn", "dialog") if k in f}
    return ergebnis


def geschwister(orte: list[dict], szenen: list[tuple[str, dict]]) -> dict[str, list[str]]:
    """Zustandsfassungen derselben Karte (orte.json, ``zustaende``) je Szenendatei.

    Beispiel: ``maple-falls-diner.json`` → [``maple-falls-diner-tischset.json``] und umgekehrt.
    """
    nach_karte = {sz.get("datei"): name for name, sz in szenen}
    ergebnis: dict[str, list[str]] = {}
    for ort in orte:
        for karte in ort["karten"]:
            gruppe = [karte.get("datei"), *karte.get("zustaende", {}).values()]
            namen = [nach_karte[d] for d in dict.fromkeys(gruppe) if d in nach_karte]
            for name in namen:
                ergebnis[name] = [n for n in namen if n != name]
    return {k: v for k, v in ergebnis.items() if v}


def uebergangsdefinitionen(orte: list[dict]) -> dict[str, list[dict]]:
    """Je Ort die Übergänge aus orte.json, nur Name, Karte (falls angegeben), Art und Ziel (Editor 1.4).

    Warum: Der Editor zeigt an jedem Übergang Zielkarte und Zielauslöser, springt „Zum Ziel“ und legt
    neue Übergänge an; der Rücklauf (editoruebergaenge.py) schreibt die Änderungen zurück.
    Beispiel: mapleFalls → [{"name": "treppe", "art": "uebergang", "ziel": {"karte":
    "mapleFalls.zimmer", "ausloeser": "treppeDachboden"}}, …].
    """
    from pipeline.abenteuer.editoruebergaenge import ART, kurz

    return {o["kennung"]: [kurz(a) for a in o.get("ausloeser", []) if a.get("art") == ART] for o in orte}


def kartenverzeichnis(orte: list[dict], szenen: list[tuple[str, dict]], texte: dict) -> list[dict]:
    """Alle Karten aus orte.json mit Ort, Namen und der Szenendatei im Paket (Grundkarte, nicht ein
    Zustand), für die Zielwahl eines neuen Übergangs. Karten ohne Szene im Paket fehlen.
    Beispiel: {"kennung": "mapleFalls.zimmer", "ort": "mapleFalls", "ortsname": "Maple Falls",
    "kartenname": "Zimmer", "datei": "maple-falls-zimmer.json"}.
    """
    nach_datei = {sz.get("datei"): name for name, sz in szenen if not sz.get("variante")}
    ergebnis = []
    for o in orte:
        for karte in o["karten"]:
            if karte.get("datei") in nach_datei:
                ergebnis.append(
                    {
                        "kennung": karte["kennung"],
                        "ort": o["kennung"],
                        "ortsname": texte.get(f"ort.{o['kennung']}.name", o["kennung"]),
                        "kartenname": texte.get(f"ort.{karte['kennung']}", karte["kennung"]),
                        "datei": nach_datei[karte["datei"]],
                    }
                )
    return ergebnis


def kachelbild(privat: Path, bogen: str, feld: list[int]) -> str:
    """Eine Kachel aus einem Bogen als data-URL (braucht Pillow)."""
    return ausschnittbild(privat / bogen, [feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K])


def ausschnittbild(pfad: Path, ausschnitt: list[int]) -> str:
    """Ein Ausschnitt (links, oben, rechts, unten) eines Bildes als data-URL (braucht Pillow).
    Beispiel: Dielen aus dem Bodenbogen, [80, 208, 96, 224] (Katalog bodenkacheln.json)."""
    import io

    from PIL import Image

    teil = Image.open(pfad).convert("RGBA").crop(tuple(ausschnitt))
    puffer = io.BytesIO()
    teil.save(puffer, "PNG")
    return "data:image/png;base64," + base64.b64encode(puffer.getvalue()).decode("ascii")


def kacheln(privat: Path, materialien: dict) -> dict:
    """Je Boden die Innenkachel, je Wandstil Fläche oben, unten und (falls vorhanden) Krone.

    Warum: Für Felder, die der Autor im Editor mit dem Pinsel umfärbt; den genauen Rand zeichnet
    erst der Kartenbau beim Rücklauf (kartenbild.py).
    """
    boegen = materialien["boegen"]
    boeden = {}
    for name, art in materialien["boeden"].items():
        feld = [art["rand"][0] + 1, art["rand"][1] + 1] if "rand" in art else art["feld"]
        boeden[name] = kachelbild(privat, boegen[art["bogen"]], feld)
    waende = {}
    for name, art in materialien["waende"].items():
        teile = {t: kachelbild(privat, boegen[art["bogen"]], art[t]) for t in ("oben", "unten") if t in art}
        if art.get("krone"):
            teile["krone"] = kachelbild(privat, boegen[art["bogen"]], art["krone"][0])
        waende[name] = teile
    return {"boeden": boeden, "waende": waende}


def hintergrundbild(privat: Path, szene: dict) -> str | None:
    """Der Hintergrund der Karte wie im Spiel (``spiel/grafik/karten/<name>.png``), sonst None."""
    from pipeline.abenteuer.zustaende import bildname

    pfad = privat / "spiel" / "grafik" / "karten" / f"{bildname(szene)[0]}.png"
    return data_url(pfad) if pfad.exists() else None


def bibliothek(privat: Path, moebelordner: Path) -> tuple[dict, list[str], list[str]]:
    """Alle Möbel als Bibliothek, die Bilder (je Quelle einmal) und Befunde (fehlende Bilder)."""
    katalog = katalogeintraege(privat)
    eintraege, bilder, befunde = {}, [], []
    nummer: dict[str, int] = {}
    for datei in moebeldateien(moebelordner):
        for kennung, angabe in lade(datei)["moebel"].items():
            pfad = bildpfad(privat, angabe["quelle"])
            if pfad is None:
                befunde.append(f"{kennung}: Bild {angabe['quelle']} fehlt")
                continue
            # Kacheln aus einem Bogen (bodenkacheln.py): je Ausschnitt ein eigenes Bild.
            schluessel = f"{angabe['quelle']}#{angabe.get('ausschnitt', '')}"
            if schluessel not in nummer:
                nummer[schluessel] = len(bilder)
                ausschnitt = angabe.get("ausschnitt")
                bilder.append(ausschnittbild(pfad, ausschnitt) if ausschnitt else data_url(pfad))
            eintrag = bibliothekseintrag(kennung, angabe, datei.stem, katalog.get(angabe["quelle"]))
            eintraege[kennung] = {**eintrag, "bild": nummer[schluessel]}
    return eintraege, bilder, befunde


def baue_daten(privat: Path, szenenordner: Path, moebelordner: Path, nur: list[str] | None = None) -> dict:
    """Alles, was der Editor braucht, als ein Wörterbuch (Inhalt von daten.js)."""
    orte = lade(INHALTE / "orte.json")["orte"]
    texte = lade(INHALTE / "texte" / "de.json")
    szenen = lade_szenen(szenenordner, nur)
    paare = geschwister(orte, szenen)
    moebel, bilder, befunde = bibliothek(privat, moebelordner)
    # Standbilder der Personen (Editor 1.7, Blickrichtung R008); braucht Pillow wie die Kacheln.
    from pipeline.abenteuer.editorpersonen import boegen_der_szene, sitzbilder, standbilder

    liste = []
    for name, szene in szenen:
        ort = szene["karte"].split(".")[0]
        kartenname = texte.get(f"ort.{szene['karte']}", szene["karte"])
        variante = szene.get("variante")
        liste.append(
            {
                "datei": name,
                "ort": ort,
                "ortsname": texte.get(f"ort.{ort}.name", ort),
                # Varianten stehen in der Kartenliste in einer eigenen Gruppe (listen.js).
                **({"gruppe": "Varianten"} if variante else {}),
                "kartenname": f"{kartenname}, Variante {variante.upper()}" if variante else kartenname,
                # Varianten haben keinen Hintergrund für das Spiel; der Editor zeichnet die Kacheln.
                "hintergrund": None if variante else hintergrundbild(privat, szene),
                "geschwister": paare.get(name, []),
                "figurangaben": figurangaben(orte, ort),
                "personen": boegen_der_szene(szene, orte),
                "szene": szene,
            }
        )
    return {
        "format": PAKETFORMAT,
        "erstellt": datetime.now(UTC).isoformat(timespec="seconds"),
        "kachel": K,
        "szenen": liste,
        # Übergänge (Editor 1.4): Definitionen je Ort und alle Karten als Ziele.
        "uebergaenge": uebergangsdefinitionen(orte),
        "karten": kartenverzeichnis(orte, szenen, texte),
        "moebel": moebel,
        "bilder": bilder,
        "personenbilder": standbilder(privat, {b for e in liste for b in e["personen"].values()}),
        # Sitzbilder (Editor 1.8): je Bogen mit Stuhlzustand aus PixelLab; sonst zeigt der Editor
        # das Standbild angehoben wie die App.
        "personensitzbilder": sitzbilder(privat, {b for e in liste for b in e["personen"].values()}),
        "kacheln": kacheln(privat, lade(INHALTE / "materialien.json")),
        "umgebung": list(UMGEBUNG),
        "befunde": befunde,
    }


def schreibe_paket(daten: dict, ziel: Path) -> Path:
    """Editorseite und daten.js nach ZIEL; gibt den Pfad von daten.js zurück."""
    ziel.mkdir(parents=True, exist_ok=True)
    for teil in EDITORDATEIEN:
        quelle = EDITOR / teil
        if quelle.is_dir():
            shutil.copytree(quelle, ziel / teil, dirs_exist_ok=True)
        else:
            shutil.copy2(quelle, ziel / teil)
    datei = ziel / "daten.js"
    inhalt = json.dumps(daten, ensure_ascii=False, separators=(",", ":"))
    datei.write_text(f"window.EDITOR_DATEN = {inhalt};\n", encoding="utf-8")
    return datei


def main(argumente: list[str] | None = None) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    teiler = argparse.ArgumentParser(description="Paket des Karteneditors bauen")
    teiler.add_argument("privat", type=Path, help="Klon des privaten Repositorys")
    teiler.add_argument("ziel", type=Path, help="Zielordner, üblich PRIVAT/editor")
    teiler.add_argument("--szenen", type=Path, default=INHALTE / "szenen")
    teiler.add_argument("--moebel", type=Path, default=MOEBELORDNER)
    teiler.add_argument("--nur", nargs="*", help="nur diese Szenen (Dateinamen ohne .json)")
    a = teiler.parse_args(argumente)
    daten = baue_daten(a.privat, a.szenen, a.moebel, a.nur)
    datei = schreibe_paket(daten, a.ziel)
    groesse = sum(p.stat().st_size for p in a.ziel.rglob("*") if p.is_file())
    print(f"Paket in {a.ziel}: {len(daten['szenen'])} Karten, {len(daten['moebel'])} Bilder der Bibliothek,")
    print(f"  daten.js {datei.stat().st_size / 1e6:.1f} MB, zusammen {groesse / 1e6:.1f} MB")
    for befund in daten["befunde"]:
        print(f"  - {befund}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
