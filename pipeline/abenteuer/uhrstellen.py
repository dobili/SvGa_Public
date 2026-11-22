"""Stellen, an denen die Geschichte eine Tageszeit verlangt (Spieluhr, Wunsch des Autors, 22.11.2026).

Warum: Die Spieluhr (app/src/abenteuer/regeln/spieluhr.ts) läuft in freier Oberwelt; wo die
Geschichte eine Zeit erzählt („Am Abend …“, „Nacht.“, ``#licht:nacht``), muss sie die Uhr setzen
(``#uhr:abend`` oder ``#uhr:22``), sonst stünde die Erzählung im hellen Mittag. Dieses Werkzeug
findet Erzählzeilen (``#sprecher:erzaehler``) mit Tageszeit ohne ``#uhr`` und die Lichtwechsel
``#licht:abend``, ``#licht:nacht`` und ``#licht:tag`` ohne ``#uhr``.

Bewusst ohne ``#uhr`` (GEPRUEFT, mit Grund): Ortsbeschreibungen, die bei jedem Besuch kommen (sie
würden die Uhr jedes Mal weiterdrehen), Erinnerungen und Zeilen in Sprechrollen. Ein Dauertest
verlangt 0 Befunde.

Aufruf: ``python -m pipeline.abenteuer.uhrstellen`` (Liste der Befunde und der gesetzten Stellen).
"""

import re
import sys
from pathlib import Path

DIALOGE = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "dialoge" / "de"
ZEITWORTE = re.compile(
    r"(Am (nächsten )?(Abend|Morgen)|^\s*-?\s*(Abend|Nacht)\.|In der Nacht|Es wird dunkel|dämmert"
    r"|Mitternacht|Sonnenuntergang|Sonnenaufgang|Sonne berührt den Rand)"
)
LICHTWECHSEL = re.compile(r"#licht:(abend|nacht|tag)\b")

# (Datei, Anfang des Textes): Grund, warum hier keine Uhr gesetzt wird.
GEPRUEFT = {
    ("capital-arena-aussen.ink", "Die breite Treppe vor der Arena. Am Abend wird hier gefeiert"): (
        "Ortsbeschreibung bei jedem Besuch; „am Abend“ ist eine Ankündigung, nicht die Zeit"
    ),
    ("cedar-creek-aussen.ink", "Mrs. Okafor hatte gesagt, eine halbe Stunde."): (
        "folgt auf das Nachtstück mit #uhr:nacht; „nach Mitternacht“ ist schon Nacht"
    ),
    ("cedar-creek-aussen.ink", "{nachtImLesesaal: Am Morgen liegt Nebel"): (
        "bedingter Satz im Steg-Alltag (bei jedem Besuch); setzte sonst immer den Morgen"
    ),
    ("cedar-creek-aussen.ink", "Der Steg liegt still in der Abendsonne."): (
        "Steg-Alltag bei jedem Besuch nach Akt 1; Stimmung, keine Zeitansage der Geschichte"
    ),
    ("maple-falls-dachboden.ink", "Eine Figur steht anders als am Abend."): (
        "Epilog: „als am Abend“ blickt zurück; die Zeit setzt die Szene davor"
    ),
    ("jahrmarkt.ink", "{~Das Riesenrad dreht sich langsam."): (
        "zufällige Ansichten des Riesenrads bei jedem Ansehen, eine davon „am Abend“"
    ),
    ("port-delacroix-musikhaus.ink", "Sie gibt dir ein zerknittertes Blatt"): (
        "„die Startstellung des Abends“ meint das Programm, nicht die Uhrzeit"
    ),
}


def befunde(ordner: Path = DIALOGE) -> list[str]:
    """Erzählzeilen mit Tageszeit und Lichtwechsel ohne ``#uhr``, ohne die GEPRUEFT-Stellen."""
    ergebnis = []
    for datei in sorted(ordner.glob("*.ink")):
        for nummer, zeile in enumerate(datei.read_text(encoding="utf-8").splitlines(), 1):
            text = zeile.strip()
            if text.startswith("//") or "#uhr:" in zeile:
                continue
            erzaehlt = "#sprecher:erzaehler" in zeile and ZEITWORTE.search(zeile.split("#")[0])
            if not (erzaehlt or LICHTWECHSEL.search(zeile)):
                continue
            if any(datei.name == d and text.lstrip("- ").startswith(a) for d, a in GEPRUEFT):
                continue
            ergebnis.append(f"{datei.name}:{nummer}: {text[:100]}")
    return ergebnis


def gesetzt(ordner: Path = DIALOGE) -> list[str]:
    """Alle Stellen mit ``#uhr`` (Datei, Zeile, Angabe)."""
    ergebnis = []
    for datei in sorted(ordner.glob("*.ink")):
        for nummer, zeile in enumerate(datei.read_text(encoding="utf-8").splitlines(), 1):
            if treffer := re.search(r"#uhr:(\w+)", zeile):
                ergebnis.append(f"{datei.name}:{nummer}: #uhr:{treffer.group(1)}")
    return ergebnis


def main() -> int:
    funde = befunde()
    print(f"{len(gesetzt())} Stellen mit #uhr, {len(funde)} Befunde")
    for f in funde:
        print("  " + f)
    return 1 if funde else 0


if __name__ == "__main__":
    sys.exit(main())
