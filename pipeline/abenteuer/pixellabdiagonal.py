"""Befehl: Diagonale Geh- und Rennbilder von Held, Heldin und den Begleitern aus PixelLab übernehmen.

Warum: Der Autor hat beiden Helden Animationen für die vier Schrägen gegeben (Wunsch des Autors,
26.11.2026: „Ich habe Animationen für diagonale Bewegung hinzugefügt … diagonales Laufen für den
Protagonisten“). Die Einzelexporte liegen im privaten Repository unter
``ki-roh/held_diagonal_26-11.zip`` und ``ki-roh/heldin_diagonal_26-11.zip``, je mit acht
Standbildern (``Idle/rotations``), Gehen in acht Richtungen und Rennen in acht (die Heldin in
sieben, Südwest fehlt; figurdiagonalen.mjs spiegelt es aus Südost). Dazu am selben Tag die
Begleiter (Nachtrag des Haupt-Chats, 26.11.2026): Juno (``juno_diagonal_26-11.zip``) und Mama
(``mutter_diagonal_26-11.zip``, Ordner ``mutter``), beide mit Gehen und Rennen in acht Richtungen;
sie folgen dem Helden schräg (oberwelt/gefolgeschicht.ts).

Was geschieht: Aus dem Zustand des Exports, an dem die Gehanimation hängt (metadata.json), kommen
Standbilder, Gehen und Rennen in allen acht Richtungen nach ``spiel/figuren-neu/<figur>/``. Die
geraden Richtungen werden mit übernommen; sie waren am 26.11.2026 byte-gleich mit dem früheren
Import (geprüft), ändern also nichts; nur Mama hatte bisher kein Rennen und bekommt es jetzt.
Die Zustände (Sitzen, Schlafen) bleiben, wie sie sind (Junos Export hat zusätzlich ein Sitzbild
auf dem Stuhl; es bleibt bis zur Entscheidung des Haupt-Chats draußen).
Andere Figuren laufen nur in vier Richtungen (Auftrag des Haupt-Chats): Nur die Tabelle
DIAGONALEXPORTE bekommt Schrägen. Der Paketbau legt sie als zusätzliche Reihen ans Ende des Bogens
(app/skripte/figurdiagonalen.mjs).

Ablauf (im Hauptordner, PRIVAT ist das private Repository):
    python -m pipeline.abenteuer.pixellabdiagonal PRIVAT
Der volle Import (pixellabimport.py) ruft dasselbe nach dem Neubau des Ordners auf.
"""

import argparse
import json
import zipfile
from pathlib import Path

ZIEL = Path("spiel") / "figuren-neu"

# Figur → Einzelexport mit den Schrägen (Lieferung des Autors, 26.11.2026).
DIAGONALEXPORTE: dict[str, str] = {
    "held-0": "ki-roh/held_diagonal_26-11.zip",
    "heldin-0": "ki-roh/heldin_diagonal_26-11.zip",
    "juno": "ki-roh/juno_diagonal_26-11.zip",
    "mutter": "ki-roh/mutter_diagonal_26-11.zip",
}
GERADE = ("south", "north", "east", "west")
SCHRAEG = ("north-east", "north-west", "south-west", "south-east")
ANIMATIONEN = ("Walking", "Running")


def gehordner(archiv: zipfile.ZipFile) -> str:
    """Ordner des Zustands, an dem die Gehanimation hängt (metadata.json des Exports).

    Beispiel: held_diagonal_26-11.zip → „Idle“. Ohne Metadaten oder Gehanimation „Idle“.
    """
    if "metadata.json" not in archiv.NameToInfo:
        return "Idle"
    daten = json.loads(archiv.read("metadata.json"))
    for zustand in daten.get("states", []):
        if "Walking" in zustand.get("frames", {}).get("animations", {}):
            return str(zustand.get("folder", "Idle"))
    return "Idle"


def _kopiere(archiv: zipfile.ZipFile, quelle: str, ziel: Path) -> bool:
    """Kopiert eine Datei aus dem Zip, falls vorhanden."""
    if quelle not in archiv.NameToInfo:
        return False
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_bytes(archiv.read(quelle))
    return True


def uebernimm(archiv: zipfile.ZipFile, ziel: Path) -> dict[str, int]:
    """Standbilder, Gehen und Rennen in acht Richtungen aus dem Zip nach ``ziel``.

    Ausgabe: Anzahl der Bilder je Art („rotations“, „Walking“, „Running“) und die Zahl der
    Schrägen, die fehlen (``fehlt``, etwa 1 bei der Heldin: Rennen Südwest).
    """
    ordner = gehordner(archiv)
    zahl = {"rotations": 0, "Walking": 0, "Running": 0, "fehlt": 0}
    for r in GERADE + SCHRAEG:
        zahl["rotations"] += _kopiere(archiv, f"{ordner}/rotations/{r}.png", ziel / "rotations" / f"{r}.png")
        for name in ANIMATIONEN:
            praefix = f"{ordner}/animations/{name}/{r}/"
            bilder = sorted(n for n in archiv.namelist() if n.startswith(praefix) and n.endswith(".png"))
            if not bilder and r in SCHRAEG:
                zahl["fehlt"] += 1
            for datei in bilder:
                zahl[name] += _kopiere(archiv, datei, ziel / "animations" / name / r / Path(datei).name)
    return zahl


def uebernimm_figur(privat: Path, figur: str) -> dict[str, int] | None:
    """Übernimmt die Schrägen einer Figur aus DIAGONALEXPORTE; None ohne Eintrag oder Zip."""
    quelle = DIAGONALEXPORTE.get(figur)
    if quelle is None or not (privat / quelle).exists():
        return None
    with zipfile.ZipFile(privat / quelle) as archiv:
        return uebernimm(archiv, privat / ZIEL / figur)


def main() -> None:
    """Übernimmt die Schrägen aller Figuren aus DIAGONALEXPORTE und nennt die Zahlen."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("privat", type=Path, help="privates Repository (schach-abenteuer-inhalte)")
    args = parser.parse_args()
    for figur in DIAGONALEXPORTE:
        print(figur, uebernimm_figur(args.privat, figur) or "kein Export")


if __name__ == "__main__":
    main()
