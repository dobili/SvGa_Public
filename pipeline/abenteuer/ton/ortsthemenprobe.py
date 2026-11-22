"""Befehl: baut das Probestück einprägsame Ortsthemen als Hörprobe mit Vergleichsseite.

Warum: Der Autor entscheidet am Probestück (Klangplan A0, 22.11.2026), ob alle Ortsthemen auf
einprägsame Melodien umgestellt werden. Gebaut werden die Pläne aus
``stuecke/ortsthemen_probe.py`` (Maple Falls mit Fassungen und Clubkampf, Cedar Creek) in den
privaten Hörprobenordner ``hoerprobe/ortsthemen/``, dazu ``index.html``: je Stück ein Player, die
bisherige Fassung daneben (aus ``spiel/musik/``) und der Kopf als Notenzeile. Ins öffentliche
Repository kommen nur Noten und Werkzeug, nie die Tondateien.

Aufruf (im Hauptordner; braucht ffmpeg, fluidsynth, numpy, scipy und die Proben aus
``python -m pipeline.abenteuer.ton.musikbau PRIVAT --laden``):
    python -m pipeline.abenteuer.ton.ortsthemenprobe PRIVAT
"""

import argparse
import html
import shutil
import subprocess
from pathlib import Path

from pipeline.abenteuer.ton.musikbau import BITRATE, MIDI, PROBEN, angleichen, klangbild, ohne_stille_am_ende
from pipeline.abenteuer.ton.ortsthemenprobe_spuren import MISCHPULT_SKRIPT, baue_version2
from pipeline.abenteuer.ton.satzplan import Satz, baue, linie, tonart
from pipeline.abenteuer.ton.stuecke.ortsthemen_probe import ALT, CEDAR_KOPF, MAPLE_KOPF, STUECKE

ORDNER = Path("hoerprobe/ortsthemen")
# Notenzeile: Abstand der Linien, Breite je Schlag, Rand (Pixel im SVG).
LINIE = 8
SCHLAG = 34
RAND = 36
# Diatonische Stufen ab C für die Lage im Notensystem; E4 liegt auf der untersten Linie.
DIATONISCH = {0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6}
VORZEICHEN = {1, 3, 6, 8, 10}
E4_STUFE = 5 * 7 + 2  # MIDI 64 liegt in der Oktave 64 // 12 = 5
NAMEN = ["C", "Cis", "D", "Es", "E", "F", "Fis", "G", "Gis", "A", "B", "H"]


def rendere(satz: Satz, ziel: Path) -> float:
    """Rendert einen Plan als m4a nach ``ziel``; Ausgabe: Dauer in Sekunden."""
    from pipeline.abenteuer.ton.sampler import rendere as sampler
    from pipeline.abenteuer.ton.sampler import schreibe_wav

    stueck = baue(satz)
    MIDI.mkdir(parents=True, exist_ok=True)
    wav = MIDI / f"{satz.kennung}.wav"
    ton = angleichen(klangbild(sampler(stueck, PROBEN), satz.klangbild), satz.pegel_db)
    schreibe_wav(ton if satz.schleife else ohne_stille_am_ende(ton), wav)
    befehl = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-c:a", "aac", "-b:a", BITRATE]
    subprocess.run([*befehl, str(ziel)], check=True)
    wav.unlink()
    return stueck.sekunden(stueck.ende())


def notenzeile(kopf: str, tonart_name: str) -> str:
    """Der Kopf als kleines Notenbild (SVG, Violinschlüssel gedacht) mit Tonnamen darunter.

    Ganze Schläge als hohle Köpfe ab zwei Schlägen, sonst gefüllt; Achtel und Punktierungen stehen
    als Dauer in der Beschriftung. Beispiel: Maple Falls „G A H D | G E D“.
    """
    noten, laenge = linie(kopf.replace("|", " "), tonart(tonart_name), 0, 1, 60)
    breite = int(RAND * 2 + laenge * SCHLAG)
    hoehe = LINIE * 14
    oben = LINIE * 5
    teile = [f'<svg viewBox="0 0 {breite} {hoehe}" width="{breite}" height="{hoehe}" role="img">']
    for i in range(5):
        y = oben + i * LINIE
        teile.append(
            f'<line x1="8" x2="{breite - 8}" y1="{y}" y2="{y}" stroke="currentColor" stroke-width="1"/>'
        )
    for note in noten:
        stufe = (note.tonhoehe // 12) * 7 + DIATONISCH[note.tonhoehe % 12]
        y = oben + 4 * LINIE - (stufe - E4_STUFE) * LINIE / 2
        x = RAND + note.beginn * SCHLAG
        hohl = note.dauer >= 2
        fuellung = "none" if hohl else "currentColor"
        teile.append(f'<ellipse cx="{x}" cy="{y}" rx="5.5" ry="4" fill="{fuellung}" stroke="currentColor"/>')
        teile.append(f'<line x1="{x + 5}" x2="{x + 5}" y1="{y}" y2="{y - 26}" stroke="currentColor"/>')
        if note.tonhoehe % 12 in VORZEICHEN:
            teile.append(f'<text x="{x - 15}" y="{y + 4}" font-size="12" fill="currentColor">♯</text>')
        name = NAMEN[note.tonhoehe % 12]
        teile.append(f'<text x="{x - 6}" y="{hoehe - 6}" font-size="11" fill="currentColor">{name}</text>')
    teile.append("</svg>")
    return "".join(teile)


def abschnitt(satz: Satz, datei: str, sekunden: float, alt: str | None) -> str:
    """Ein Abschnitt der Seite: Titel, Beschreibung, Player neu und (falls vorhanden) alt."""
    neu = f'<p>Neu ({sekunden:.0f} s): <audio controls preload="none" src="{datei}"></audio></p>'
    alt_html = f'<p>Bisher: <audio controls preload="none" src="alt/{alt}"></audio></p>' if alt else ""
    kopf = f"<h2>{html.escape(satz.titel)}</h2><p>{html.escape(satz.beschreibung)}</p>"
    return f"<section>{kopf}{neu}{alt_html}</section>"


def seite(abschnitte: list[str]) -> str:
    """Die Vergleichsseite mit den Notenzeilen der beiden Köpfe."""
    stil = (
        ".pult button{margin:4px;padding:8px 12px;font:inherit}.pult label{display:block}"
        "body{font:17px system-ui;margin:16px;max-width:44em;background:#faf7f0;color:#222}"
        "section{background:#fff;border-radius:8px;padding:8px 14px;margin:12px 0}audio{width:100%}"
        "svg{max-width:100%;height:auto}"
        "@media (prefers-color-scheme:dark){body{background:#1d1d1f;color:#eee}section{background:#2c2c2e}}"
    )
    koepfe = (
        "<section><h2>Die Köpfe</h2>"
        "<p>Maple Falls, G-Dur: Mamas Kopf steigt, Quartsprung, fällt zurück.</p>"
        f"{notenzeile(MAPLE_KOPF, 'G')}"
        "<p>Cedar Creek, d-Moll: Ambroses Kopf umgekehrt, die Quinte zweimal.</p>"
        f"{notenzeile(CEDAR_KOPF, 'd')}</section>"
    )
    einleitung = (
        "<p>Probestück einprägsame Ortsthemen (Klangplan A0). Zuerst „Kopf ohne Begleitung“ hören: "
        "Trägt die Melodie allein, kann man sie nach zweimal Hören nachsummen? Dann Ort für Ort neu "
        "gegen bisher.</p>"
    )
    return (
        '<!doctype html><html lang="de"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f"<title>Ortsthemen Probe</title><style>{stil}</style></head><body>"
        f"<h1>Einprägsame Ortsthemen</h1>{einleitung}{koepfe}{''.join(abschnitte)}"
        f"{MISCHPULT_SKRIPT}</body></html>\n"
    )


def main() -> None:
    """Rendert alle Probestücke, kopiert die bisherigen Fassungen und schreibt die Seite."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("privat", type=Path, help="privates Repository (schach-abenteuer-inhalte)")
    argumente = parser.parse_args()
    ziel = argumente.privat / ORDNER
    (ziel / "alt").mkdir(parents=True, exist_ok=True)
    abschnitte = []
    for satz in STUECKE:
        datei = f"{satz.kennung.removeprefix('probe.')}.m4a"
        sekunden = rendere(satz, ziel / datei)
        alt = ALT.get(satz.kennung)
        quelle = argumente.privat / "spiel" / "musik" / alt if alt else None
        if quelle and quelle.exists():
            shutil.copy(quelle, ziel / "alt" / alt)
        abschnitte.append(abschnitt(satz, datei, sekunden, alt if quelle and quelle.exists() else None))
        print(f"{ziel / datei}  ({sekunden:.0f} s)")
    abschnitte.append(baue_version2(ziel))
    (ziel / "index.html").write_text(seite(abschnitte), encoding="utf-8")
    print(ziel / "index.html")


if __name__ == "__main__":
    main()
