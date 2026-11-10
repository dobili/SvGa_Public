"""Katalog neu bauen, ohne die Bilder der neuen Pakete zu verlieren (mittel-2, 10.11.2026).

Warum: ``werkzeuge/katalog.py --neu`` löscht register/katalog.json und baut es nur aus
register/register.csv neu. Die 1182 Bilder aus Hafen, Containerterminal und Winterwald
(werkzeuge/neue_pakete.py) stehen nicht im Register; ihre Korrekturen (10-neue_pakete.json)
fänden dann keinen Eintrag mehr, und die Bilder fielen aus dem Katalog. Deshalb wurde seit
den Korrekturen für Fußmatte, Lampen und Glasscheibe nicht neu gebaut.

Was das Werkzeug tut (gleiche Schritte wie ``katalog.neu_aufbauen``):
1. Grundeinträge aus dem Register (``katalog.baue`` mit leerem Altbestand, wie bei --neu).
2. Einträge des alten Katalogs, deren Bild nicht im Register steht, aber auf der Platte liegt,
   werden übernommen (heute genau die 1182 Bilder der neuen Pakete).
3. Alle Antworten, dann alle Korrekturen in register/korrekturen (nach Dateinamen), dann die
   maschinellen Regeln. Mit ``--oeffentlich ORDNER`` kommen die Korrekturen des öffentlichen
   Repositorys (inhalte/abenteuer/katalog_korrekturen/<name>.json) als 10-<name>.json dazu und gehen
   gleichnamigen privaten vor. Warum: Die Probe am 10.11.2026 zeigte sechs Körbe (Äpfel, Bananen,
   Kohl, Möhren, Mais, Trauben) aus mittel-3.json, die in 10-mittel-3.json fehlen; ohne die
   öffentlichen Dateien verlören sie ihre Beschreibung.
4. Vergleich mit dem alten Katalog: verlorene und neue Bilder, geänderte Felder je Feld.

Aufruf (Hauptordner des privaten Repositorys, Pillow nötig):
  python <pfad>/katalog_neubau.py --oeffentlich ../SvGa_Public/inhalte/abenteuer/katalog_korrekturen \
      --probe /tmp/katalog-probe.json                               # nur bauen und vergleichen
  python <pfad>/katalog_neubau.py --oeffentlich … --schreiben       # register/katalog.json ersetzen
--schreiben bricht ab, wenn dabei Bilder verloren gingen.
"""

import json
import sys
from pathlib import Path

HAUPT = Path.cwd()
sys.path.insert(0, str(HAUPT / "werkzeuge"))
import katalog as kw  # noqa: E402  (das Katalogwerkzeug des privaten Repositorys)

ALT = HAUPT / "register" / "katalog.json"


def korrekturdateien(oeffentlich: Path | None) -> list[Path]:
    """Private Korrekturen, mit ``oeffentlich`` dazu die öffentlichen als 10-<name>, nach Namen."""
    dateien = {d.name: d for d in (kw.REGISTER / "korrekturen").glob("*.json")}
    if oeffentlich is not None:
        dateien.update({f"10-{d.name}": d for d in oeffentlich.glob("*.json")})
    return [dateien[name] for name in sorted(dateien)]


def baue_neu(alt: dict, ziel: Path, oeffentlich: Path | None = None) -> dict:
    """Katalog nach den Schritten 1 bis 3 im Dateikopf; schreibt nach ``ziel``."""
    kw.KATALOG = ziel
    if ziel.exists():
        ziel.unlink()
    katalog = kw.baue()  # liest den (leeren) Altbestand aus ziel, also wie --neu
    behalten = {p: dict(e) for p, e in alt.items() if p not in katalog and (HAUPT / p).exists()}
    katalog.update(behalten)
    for datei in sorted((kw.REGISTER / "antworten").glob("*.json")):
        if datei.name != "living-room_probe.json":
            kw.uebernimm(katalog, json.loads(datei.read_text(encoding="utf-8")))
    for datei in korrekturdateien(oeffentlich):
        kw.uebernimm(katalog, json.loads(datei.read_text(encoding="utf-8")))
    print("Regeln:", kw.regeln(katalog))
    print("ohne Register übernommen:", len(behalten))
    ziel.write_text(json.dumps(katalog, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return katalog


def vergleiche(alt: dict, neu: dict) -> list[str]:
    """Verlorene Bilder (Pfade); druckt dazu neue Bilder und geänderte Felder je Feld."""
    verloren = sorted(set(alt) - set(neu))
    print("verloren:", len(verloren), verloren[:10])
    print("neu:", len(set(neu) - set(alt)), sorted(set(neu) - set(alt))[:10])
    felder: dict[str, int] = {}
    beispiele: dict[str, str] = {}
    for p in set(alt) & set(neu):
        for k in set(alt[p]) | set(neu[p]):
            if alt[p].get(k) != neu[p].get(k):
                felder[k] = felder.get(k, 0) + 1
                beispiele.setdefault(k, f"{p}: {alt[p].get(k)!r} → {neu[p].get(k)!r}")
    for k, n in sorted(felder.items(), key=lambda e: -e[1]):
        print(f"  {k}: {n} Bilder, etwa {beispiele[k][:160]}")
    return verloren


def main() -> None:
    alt = json.loads(ALT.read_text(encoding="utf-8"))
    schreiben = "--schreiben" in sys.argv
    ziel = (
        Path(sys.argv[sys.argv.index("--probe") + 1])
        if "--probe" in sys.argv
        else ALT.with_suffix(".neu.json")
    )
    oeffentlich = Path(sys.argv[sys.argv.index("--oeffentlich") + 1]) if "--oeffentlich" in sys.argv else None
    neu = baue_neu(alt, ziel, oeffentlich)
    verloren = vergleiche(alt, neu)
    if not schreiben:
        return
    if verloren:
        sys.exit(f"Abbruch: {len(verloren)} Bilder gingen verloren, register/katalog.json bleibt.")
    ziel.replace(ALT)
    print("register/katalog.json ersetzt:", len(neu), "Bilder")


if __name__ == "__main__":
    main()
