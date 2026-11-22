"""Befehl: Hörseite für den Autor mit allen neuen Stücken eines Akts (Umstellung auf Klangplan A0).

Warum: Die Ortsthemen werden in Etappen je Akt umgestellt (Auftrag des Haupt-Chats, 22.11.2026). Je
Etappe hört der Autor alle neuen Stücke auf einer Seite, wie beim Probestück
(``hoerprobe/ortsthemen/index.html``): je Stück die volle Mischung, ein Mischpult für die Spuren
(ausgedünnt, Tag, mit Zusatzspur), die Werte und die Kurve der Lautheit, und, falls vorher
gesichert, die bisherige Fassung daneben.

Ablauf (im Hauptordner, PRIVAT ist das private Repository):
    python -m pipeline.abenteuer.ton.hoerseite PRIVAT --akt 1 --sichere-alt   # vor dem Musikbau
    python -m pipeline.abenteuer.ton.musikbau PRIVAT --nur …                  # die neuen Stücke
    python -m pipeline.abenteuer.ton.hoerseite PRIVAT --akt 1                 # Seite schreiben
Die Seite liegt in ``PRIVAT/hoerprobe/akt1/index.html`` und verweist auf ``spiel/musik``; die alten
Fassungen kopiert ``--sichere-alt`` nach ``hoerprobe/akt1/alt/``. Nichts davon kommt ins öffentliche
Repository. Abhängigkeiten: lautheit.py, musikbau.py, ortsthemenprobe_spuren.py (Mischpult).
"""

import argparse
import html
import json
import shutil
from pathlib import Path

from pipeline.abenteuer.ton.lautheit import kurve_svg, kurzbeschreibung, lies, miss
from pipeline.abenteuer.ton.musikbau import stamm, zielordner
from pipeline.abenteuer.ton.ortsthemenprobe_spuren import MISCHPULT_SKRIPT
from pipeline.abenteuer.ton.satzplan import Satz
from pipeline.abenteuer.ton.stuecke import alle

# Voreinstellungen des Mischpults: Name → Spuren mit Pegel 1.
LAGEN = {
    "Ausgedünnt": ("grund",),
    "Tag / innen": ("grund", "melodie"),
    "Mit Zusatzspur": ("grund", "melodie", "zusatz"),
}
ZUSATZ_TEXT = {
    "farbe": "Farbstimme",
    "steigerung": "Steigerung (nächster Sieg)",
    "musiker": "Musiker in der Nähe",
    "jukebox": "Jukebox",
}


def neue_stuecke(akt: int) -> list[Satz]:
    """Die Stücke eines Akts mit Spuren (die nach A0 umgestellten Ortsthemen und Kampfthemen)."""
    return [s for s in alle() if s.akt == akt and s.spuren]


def sichere_alt(privat: Path, akt: int, ziel: Path) -> int:
    """Kopiert die heutigen Dateien der neuen Stücke nach ``ziel/alt`` (nur, was es schon gibt)."""
    (ziel / "alt").mkdir(parents=True, exist_ok=True)
    anzahl = 0
    for satz in neue_stuecke(akt):
        quelle = zielordner(privat, satz) / f"{stamm(satz.kennung)}.m4a"
        if quelle.exists():
            shutil.copy(quelle, ziel / "alt" / quelle.name)
            anzahl += 1
    return anzahl


def _mischpult(kennung: str, pfad: str, spuren: list[str]) -> str:
    """Knöpfe je Voreinstellung und Regler je Spur (Skript MISCHPULT_SKRIPT)."""
    knoepfe = "".join(
        f"<button data-pult='{kennung}' data-lage='{html.escape(json.dumps(dict.fromkeys(teile, 1)))}'>"
        f"{html.escape(name)}</button>"
        for name, teile in LAGEN.items()
    )
    regler = "".join(
        f"<label>{s} <input type=range min=0 max=1 step=0.05 value=0 data-pult='{kennung}' data-spur='{s}'"
        f" data-datei='{pfad}.{s}.m4a'></label>"
        for s in spuren
    )
    return (
        f"<div class=pult id='{kennung}'>{knoepfe}<button data-halt='{kennung}'>Stopp</button>{regler}</div>"
    )


def abschnitt(satz: Satz, privat: Path, ziel: Path) -> str:
    """Ein Stück: volle Mischung, bisherige Fassung, Mischpult, Lautheit."""
    ordner = zielordner(privat, satz)
    name = stamm(satz.kennung)
    datei = ordner / f"{name}.m4a"
    if not datei.exists():
        return f"<section><h2>{html.escape(satz.titel)}</h2><p>Noch nicht gebaut.</p></section>"
    pfad = Path("../..") / datei.relative_to(privat)
    messung = miss(lies(datei), datei.name)
    alt = ziel / "alt" / datei.name
    teile = [
        f"<section><h2>{html.escape(satz.titel)}</h2><p>{html.escape(satz.beschreibung)}</p>",
        f'<p>Neu: <audio controls preload="none" src="{pfad}"></audio></p>',
        f'<p>Bisher: <audio controls preload="none" src="alt/{datei.name}"></audio></p>'
        if alt.exists()
        else "",
        f"<p><small>Zusatzspur: {html.escape(ZUSATZ_TEXT.get(satz.zusatz, satz.zusatz))}</small></p>",
        _mischpult(satz.kennung.replace(".", "-"), str(pfad.with_suffix("")), list(satz.spuren)),
        f"<p><small>Lautheit: {html.escape(kurzbeschreibung(messung))}</small></p>{kurve_svg(messung)}",
        "</section>",
    ]
    return "".join(teile)


def seite(akt: int, abschnitte: list[str]) -> str:
    """Die ganze Seite."""
    stil = (
        "body{font:17px system-ui;margin:16px;max-width:44em;background:#faf7f0;color:#222}"
        "section{background:#fff;border-radius:8px;padding:8px 14px;margin:12px 0}audio{width:100%}"
        ".pult button{margin:4px;padding:8px 12px;font:inherit}.pult label{display:block}"
        "svg{max-width:100%;height:auto}"
        "@media (prefers-color-scheme:dark){body{background:#1d1d1f;color:#eee}section{background:#2c2c2e}}"
    )
    einleitung = (
        f"<p>Alle neuen Ortsthemen von Akt {akt} nach Klangplan A0: je Stück die volle Mischung, "
        "darunter das Mischpult (ausgedünnt, Tag oder innen, mit Zusatzspur) und die Lautheit.</p>"
    )
    return (
        '<!doctype html><html lang="de"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f"<title>Musik Akt {akt}</title><style>{stil}</style></head><body>"
        f"<h1>Neue Musik, Akt {akt}</h1>{einleitung}{''.join(abschnitte)}{MISCHPULT_SKRIPT}</body></html>\n"
    )


def main() -> None:
    """Sichert die alten Fassungen oder schreibt die Hörseite eines Akts."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("privat", type=Path, help="privates Repository (schach-abenteuer-inhalte)")
    parser.add_argument("--akt", type=int, required=True)
    parser.add_argument(
        "--sichere-alt", action="store_true", help="vor dem Musikbau: alte Fassungen kopieren"
    )
    args = parser.parse_args()
    ziel = args.privat / "hoerprobe" / f"akt{args.akt}"
    if args.sichere_alt:
        print(f"{sichere_alt(args.privat, args.akt, ziel)} alte Fassungen nach {ziel / 'alt'}")
        return
    ziel.mkdir(parents=True, exist_ok=True)
    abschnitte = [abschnitt(s, args.privat, ziel) for s in neue_stuecke(args.akt)]
    (ziel / "index.html").write_text(seite(args.akt, abschnitte), encoding="utf-8")
    print(ziel / "index.html")


if __name__ == "__main__":
    main()
