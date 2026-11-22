"""Lautheit eines ganzen Musikordners prüfen: Stücke und die Mischungen ihrer Spuren (Klangplan A0.6).

Warum: Seit dem 22.11.2026 kommen Ortsthemen in drei Spuren (grund, melodie, zusatz; spuren.json
des Musikbaus). Eine einzelne Spur für sich zu bewerten sagt wenig (die Melodie schweigt im B-Teil).
Die App spielt aber Mischungen daraus: nur den Grund (ausgedünnt, gegen Ermüdung), Grund und Melodie
(Tag, innen) und alle drei (Musiker nah, Steigerung). Jede dieser Mischungen muss A0.6 halten.

Gemessen wird (lautheit.py):
- jedes ganze Stück im Ordner (``<stamm>.m4a``), Einmal-Stücke nach einmal.json nur auf Ausreißer
  und Spitze;
- je Stamm aus spuren.json die Mischungen MISCHUNGEN. Die volle Mischung muss alle Werte halten;
  dünne Mischungen (nur Grund, Grund und Melodie) werden mit Werten als Hinweis gemeldet, ohne den
  Dauertest scheitern zu lassen. Warum: Ihre Naht liegt bei einigen Stücken 0,3 bis 1,1 LU über der
  Grenze, weil die Betonungen der Begleitung am Anfang anders fallen als im Schlusstakt; ein
  Pegelausgleich an der Naht ergäbe dort einen Sprung (Bericht vom 22.11.2026).

Rolle im Gesamtbild: Befehl hinter ``python -m pipeline.abenteuer.ton.lautheit`` und Dauertest
(pipeline/tests/test_abenteuer_lautheit.py) über ``spiel/musik``, wo die Dateien vorliegen.
Abhängigkeiten: lautheit.py (numpy, scipy, ffmpeg).
"""

import json
import re
from pathlib import Path

from pipeline.abenteuer.ton import lautheit as L

SPURDATEI = re.compile(r"\.(grund|melodie|zusatz)\.m4a$")
MISCHUNGEN = {
    "grund": ("grund",),
    "grund+melodie": ("grund", "melodie"),
    "voll": ("grund", "melodie", "zusatz"),
}
SPURENLISTE = "spuren.json"
VOLL = "voll"


def ganze_stuecke(pfade: list[Path]) -> list[Path]:
    """Alle m4a unter den Pfaden ohne die Spurdateien."""
    dateien = [d for p in pfade for d in (sorted(p.rglob("*.m4a")) if p.is_dir() else [p])]
    return [d for d in dateien if not SPURDATEI.search(d.name)]


def _spurenliste(datei: Path) -> dict:
    """spuren.json aus dem Ordner der Datei oder darüber (Akt 1 liegt oben, spätere Akte in aktN/)."""
    for ordner in datei.parents:
        liste = ordner / SPURENLISTE
        if liste.exists():
            return json.loads(liste.read_text(encoding="utf-8"))
    return {}


def mischungen(datei: Path) -> list[L.Messung]:
    """Die Mischungen der Spuren zu einem Stück (falls spuren.json es führt und die Dateien da sind)."""
    stamm = datei.name.removesuffix(".m4a")
    angabe = _spurenliste(datei).get(stamm)
    if not angabe:
        return []
    pfade = {s: datei.with_name(f"{stamm}.{s}.m4a") for s in angabe["spuren"]}
    if not all(p.exists() for p in pfade.values()):
        return []
    spuren = {s: L.lies(p) for s, p in pfade.items()}
    laenge = min(len(t) for t in spuren.values())
    ergebnis = []
    for name, teile in MISCHUNGEN.items():
        if not all(t in spuren for t in teile):
            continue
        ton = sum(spuren[t][:laenge] for t in teile)
        messung = L.miss(ton, f"{stamm} [{name}]", L.ist_kampf(stamm))
        if name != VOLL:
            messung.hinweise, messung.verstoesse = messung.verstoesse, []
        ergebnis.append(messung)
    return ergebnis


def pruefe(pfade: list[Path]) -> list[L.Messung]:
    """Alle Messungen: ganze Stücke und Mischungen ihrer Spuren."""
    messungen = []
    for datei in ganze_stuecke(pfade):
        schleife = datei.name.removesuffix(".m4a") not in L.einmalstuecke(datei)
        messungen.append(L.miss(L.lies(datei), datei.name, L.ist_kampf(datei.name), schleife))
        if schleife:
            messungen += mischungen(datei)
    return messungen


def drucke(messungen: list[L.Messung]) -> int:
    """Druckt Werte und Verstöße; Rückgabe 1 bei Verstößen."""
    fehler = 0
    for m in messungen:
        werte = (
            f"{m.lufs:6.1f} LUFS  LRA {m.lra:4.1f}  P98 +{m.p98_ueber_median:4.1f}  {m.spitze_dbtp:5.1f} dBTP"
        )
        print(f"{'!' if m.verstoesse else ' '} {m.name:44} {werte}  Naht {m.naht_lu:.1f}")
        for satz in m.verstoesse:
            print(f"    {satz}")
        for satz in m.hinweise:
            print(f"    Hinweis: {satz}")
        fehler += bool(m.verstoesse)
    print(f"{len(messungen)} Messungen, {fehler} mit Verstößen")
    return 1 if fehler else 0
