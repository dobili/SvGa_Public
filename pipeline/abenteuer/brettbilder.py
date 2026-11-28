"""Brett und Figuren eines Brettstils aus einer Gemini-Lieferung einbauen: ein Befehl.

Warum: Der Autor lässt je Ort des Schach-Abenteuers ein Brett und einen Figurensatz zeichnen
(Wunsch des Autors, 14.11.2026). Der Einbau soll nur ein Befehl sein: zuschneiden, prüfen, ins
private Repository legen. Der Paketbau (app/skripte/baue-abenteuerpaket.mjs) nimmt die Dateien
dann mit, die App zeigt sie statt der gerechneten Pixelfiguren (abenteuer/brett/brettbilder.ts).

Aufruf::

    python -m pipeline.abenteuer.brettbilder BRETTBILD FIGURENBLATT --stil schiefer PRIVAT
        [--vorschau VORSCHAU.png]

BRETTBILD oder FIGURENBLATT darf „-“ sein, wenn nur eines neu kommt; die Prüfungen nehmen dann
das schon abgelegte andere. PRIVAT ist die Wurzel des privaten Repositorys (mit Ordner spiel/).

Ablage: spiel/brett/<stil>/brett.webp (512 × 512), brett.json (mittlere Feldfarben für die
Koordinaten der App) und wK.webp … bP.webp (128 × 128 mit Alpha).
Prüfungen: zwölf Figuren gefunden (sonst Abbruch), Kontrast der schwarzen Figuren gegen die
dunklen Felder und der weißen gegen die hellen (Warnung), Bildgrößen (Warnung).
Abhängigkeiten: brettbild.py, figurenblatt.py, numpy, Pillow.
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from pipeline.abenteuer.brettbild import FELDER, schneide_brett
from pipeline.abenteuer.figurenblatt import DECKEND, FIGURENFOLGE, schneide_figuren

# Die zwanzig Kennungen wie in app/src/abenteuer/brett/brettstile.ts (ein Test vergleicht beide).
BRETTSTILE = (
    "dachboden",
    "turniervinyl",
    "abgegriffen",
    "nussbaum",
    "ahorn",
    "steintisch",
    "stahl",
    "glas",
    "treibholz",
    "sandstein",
    "schiefer",
    "turnier",
    "sepia",
    "kreidetafel",
    "sternenhimmel",
    "grubenlampe",
    "resopal",
    "rotholz",
    "zypresse",
    "scheune",
)
FIGURNAMEN = tuple(f"{farbe}{f}" for farbe in "wb" for f in FIGURENFOLGE)
WEBP_GUETE = 90
# Mindestkontrast (WCAG-Verhältnis) einer Figur gegen das Feld ihrer Gegenfarbe: Körper oder Kante.
KONTRAST_KOERPER = 2.0
KONTRAST_KANTE = 3.0
# Hellster und dunkelster Anteil der Figur, die als Kante zählen (Perzentile der Leuchtdichte).
KANTENPERZENTILE = (10, 90)
# Größe, ab der eine Datei das Paket merklich vergrößert.
BRETT_BYTES_MAX = 200_000
FIGUR_BYTES_MAX = 30_000
# Startstellung für die Vorschau (FEN-Zeilen von a8 nach h1).
STARTSTELLUNG = ("rnbqkbnr", "pppppppp", "8", "8", "8", "8", "PPPPPPPP", "RNBQKBNR")


def relative_leuchtdichte(rgb: np.ndarray) -> np.ndarray:
    """Relative Leuchtdichte nach WCAG 2.x, Eingabe 0 bis 1 (letzte Achse R, G, B)."""
    linear = np.where(rgb <= 0.03928, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    return linear @ np.array([0.2126, 0.7152, 0.0722])


def kontrast(a: float, b: float) -> float:
    """Kontrastverhältnis zweier Leuchtdichten (1 bis 21), wie abenteuer/brett/kontrast.ts."""
    hell, dunkel = max(a, b), min(a, b)
    return (hell + 0.05) / (dunkel + 0.05)


def figurleuchte(bild: Image.Image) -> tuple[float, list[float]]:
    """(Körper, Kanten): Median und die Perzentile KANTENPERZENTILE der Leuchtdichte der deckenden
    Pixel. Die Kanten stehen für einen dunklen Umriss (weiße Figuren) oder einen hellen Glanz
    (schwarze Figuren)."""
    feld = np.asarray(bild.convert("RGBA"), dtype=np.float64) / 255.0
    werte = relative_leuchtdichte(feld[..., :3][feld[..., 3] >= DECKEND])
    if werte.size == 0:
        return 0.0, [0.0]
    return float(np.median(werte)), [float(np.percentile(werte, p)) for p in KANTENPERZENTILE]


def pruefe_kontrast(
    figuren: dict[str, Image.Image], hell: tuple[int, ...], dunkel: tuple[int, ...]
) -> tuple[list[str], list[str]]:
    """Kontrast je Figur gegen das Feld, auf dem sie am schwersten zu sehen ist.

    Regel: docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5 „Lesbarkeit“: Schwarz auf den
    dunklen Feldern, Weiß auf den hellen klar erkennbar. Eine Figur genügt, wenn ihr Körper
    (KONTRAST_KOERPER) oder ein Umriss oder Glanz (KONTRAST_KANTE) genug absticht.
    """
    hinweise, warnungen = [], []
    for name, bild in figuren.items():
        feldfarbe = dunkel if name.startswith("b") else hell
        feld = float(relative_leuchtdichte(np.array(feldfarbe[:3]) / 255.0))
        koerper, kanten = figurleuchte(bild)
        k_koerper = kontrast(koerper, feld)
        k_kante = max(kontrast(kante, feld) for kante in kanten)
        felder = "dunkle" if name[0] == "b" else "helle"
        text = f"{name} gegen {felder} Felder: Körper {k_koerper:.1f}:1, Kante {k_kante:.1f}:1"
        if k_koerper < KONTRAST_KOERPER and k_kante < KONTRAST_KANTE:
            warnungen.append(f"Kontrast schwach: {text}")
        else:
            hinweise.append(text)
    return hinweise, warnungen


def hexfarbe(rgb: tuple[int, ...]) -> str:
    """RGB als „#RRGGBB“ für die Stildatei der App. Beispiel: (240, 217, 181) → „#F0D9B5“."""
    return "#{:02X}{:02X}{:02X}".format(*rgb[:3])


def vorschau(brett: Image.Image, figuren: dict[str, Image.Image]) -> Image.Image:
    """Das Brett mit der Grundstellung, wie die App es zeigt (Kontrolle für den Autor)."""
    bild = brett.convert("RGBA").copy()
    feld = bild.width // FELDER
    for zeile, text in enumerate(STARTSTELLUNG):
        spalte = 0
        for zeichen in text:
            if zeichen.isdigit():
                spalte += int(zeichen)
                continue
            name = ("w" if zeichen.isupper() else "b") + zeichen.upper()
            figur = figuren[name].resize((feld, feld), Image.Resampling.LANCZOS)
            bild.alpha_composite(figur, (spalte * feld, zeile * feld))
            spalte += 1
    return bild


def speichere(bild: Image.Image, pfad: Path, grenze: int, warnungen: list[str]) -> None:
    """WebP schreiben, Größe prüfen (Warnung, wenn die Datei das Paket merklich vergrößert)."""
    bild.save(pfad, "WEBP", quality=WEBP_GUETE, alpha_quality=100, method=6)
    if pfad.stat().st_size > grenze:
        warnungen.append(f"{pfad.name}: {pfad.stat().st_size // 1000} KB, größer als erwartet")


def lade_vorhandene(ziel: Path) -> tuple[Image.Image | None, dict, dict[str, Image.Image]]:
    """Was schon abgelegt ist: Brett, Feldfarben, Figuren (für eine Lieferung nur eines Teils)."""
    brett = Image.open(ziel / "brett.webp") if (ziel / "brett.webp").exists() else None
    angaben = json.loads((ziel / "brett.json").read_text()) if (ziel / "brett.json").exists() else {}
    figuren = {n: Image.open(ziel / f"{n}.webp") for n in FIGURNAMEN if (ziel / f"{n}.webp").exists()}
    return brett, angaben, figuren


def farbe_aus_hex(text: str) -> tuple[int, int, int]:
    """„#RRGGBB“ als RGB, Gegenstück zu ``hexfarbe``."""
    return int(text[1:3], 16), int(text[3:5], 16), int(text[5:7], 16)


def baue(
    brettbild: Path | None, blatt: Path | None, stil: str, privat: Path
) -> tuple[list[str], list[str], Path]:
    """Schneidet, prüft und legt ab. Ausgabe: Hinweise, Warnungen, Zielordner.

    Beispiel: baue(Path("schiefer.png"), Path("figuren.png"), "schiefer", Path("~/inhalte"))
    → spiel/brett/schiefer/brett.webp, brett.json, wK.webp … bP.webp.
    Sonderfälle: unbekannter Stil oder PRIVAT ohne spiel/ → ValueError; Figuren fehlen → ValueError.
    """
    if stil not in BRETTSTILE:
        raise ValueError(f"Unbekannter Brettstil „{stil}“; bekannt: {', '.join(BRETTSTILE)}")
    if not (privat / "spiel").is_dir():
        raise ValueError(f"{privat} ist nicht das private Repository (Ordner spiel/ fehlt)")
    ziel = privat / "spiel" / "brett" / stil
    ziel.mkdir(parents=True, exist_ok=True)
    hinweise, warnungen = [], []
    brett, angaben, figuren = lade_vorhandene(ziel)
    if brettbild:
        schnitt = schneide_brett(Image.open(brettbild))
        hinweise += schnitt.hinweise
        warnungen += schnitt.warnungen
        brett = schnitt.bild
        angaben = {"stil": stil, "hell": hexfarbe(schnitt.hell), "dunkel": hexfarbe(schnitt.dunkel)}
        speichere(brett, ziel / "brett.webp", BRETT_BYTES_MAX, warnungen)
        (ziel / "brett.json").write_text(json.dumps(angaben, ensure_ascii=False, indent=1) + "\n")
    if blatt:
        geschnitten = schneide_figuren(Image.open(blatt))
        hinweise += geschnitten.hinweise
        warnungen += geschnitten.warnungen
        figuren = geschnitten.figuren
        for name, bild in figuren.items():
            speichere(bild, ziel / f"{name}.webp", FIGUR_BYTES_MAX, warnungen)
    if angaben and len(figuren) == len(FIGURNAMEN):
        h, w = pruefe_kontrast(figuren, farbe_aus_hex(angaben["hell"]), farbe_aus_hex(angaben["dunkel"]))
        hinweise += h
        warnungen += w
    return hinweise, warnungen, ziel


def main(argv: list[str]) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    teile = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    teile.add_argument("brettbild", help="Brettbild oder „-“")
    teile.add_argument("figurenblatt", help="Figurenblatt auf grünem Grund oder „-“")
    teile.add_argument("privat", type=Path, help="Wurzel des privaten Repositorys")
    teile.add_argument("--stil", required=True, choices=BRETTSTILE)
    teile.add_argument("--vorschau", type=Path, help="Brett mit Grundstellung als PNG")
    args = teile.parse_args(argv)
    brettbild = None if args.brettbild == "-" else Path(args.brettbild)
    blatt = None if args.figurenblatt == "-" else Path(args.figurenblatt)
    try:
        hinweise, warnungen, ziel = baue(brettbild, blatt, args.stil, args.privat)
    except ValueError as fehler:
        print(f"Fehler: {fehler}", file=sys.stderr)
        return 1
    for text in hinweise:
        print(f"  {text}")
    for text in warnungen:
        print(f"  WARNUNG: {text}")
    if args.vorschau:
        brett, _, figuren = lade_vorhandene(ziel)
        if brett and len(figuren) == len(FIGURNAMEN):
            vorschau(brett, figuren).save(args.vorschau)
            print(f"  Vorschau: {args.vorschau}")
    print(f"{ziel}: abgelegt, {len(warnungen)} Warnung(en)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
