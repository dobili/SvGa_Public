"""Ortsthemen als Spuren rendern, die die App mischt (Klangplan A0, Version 2, 22.11.2026).

Warum: Nachtrag des Haupt-Chats nach den Spielen der DS-Zeit. In Schwarz/Weiß kommt die Spur eines
Musikers dazu, wenn man ihn anspricht, und im Battle Subway je Sieg ein Instrument. Für uns: Ein
Ortsthema besteht aus Spuren (Melodie, Begleitung, Bass, Zusatz); Innenraum und Nacht spielen
weniger davon, ein Musiker in der Nähe bringt seine Spur mit, die ausgedünnte Fassung lässt Spuren
weg, und im Clubkampf kommt je Sieg eine Spur dazu.

Damit die App die Spuren übereinanderlegen kann, gilt:
- Jede Spur hat genau die Länge der Form (Schleife, Nachklang an den Anfang gelegt wie in
  sampler.rendere); dieselbe Anzahl Abtastwerte, also laufen sie ohne Versatz zusammen.
- Alle Spuren eines Stücks bekommen dieselbe Verstärkung, gemessen an der vollen Mischung
  (ZIEL_RMS_DB wie musikbau.angleichen, aber linear, ohne Begrenzer je Spur): Die Summe der Spuren
  ist genau die volle Mischung.

Rolle im Gesamtbild: Werkzeug für ortsthemenprobe.py (Version 2). Abhängigkeiten: numpy, sampler.py,
satzplan.py, musikbau.py (Pegelziel).
"""

from pathlib import Path

from pipeline.abenteuer.ton.musikbau import PROBEN, SPITZE_DB, ZIEL_RMS_DB
from pipeline.abenteuer.ton.satzplan import Satz, baue

# Dekodierter Puffer im Browser: 48 kHz, 4 Byte je Wert (Web Audio rechnet in float32).
BROWSER_RATE = 48_000
BYTES_JE_WERT = 4


def rendere_spuren(satz: Satz, gruppen: dict[str, tuple[int, ...]]):  # noqa: ANN201 (numpy)
    """Rendert je Gruppe von Stimmen eine Spur gleicher Länge mit gemeinsamer Verstärkung.

    Eingaben: Plan und Gruppen (Name → Indizes in ``satz.stimmen``). Ausgabe: Name → Stereo-Ton.
    Beispiel: Maple Falls mit {"melodie": (0, 1), "begleitung": (2,), …} → vier Spuren zu 50 s.
    Sonderfall: Eine Stimme in keiner Gruppe fehlt in allen Spuren (nur für Proben gedacht).
    """
    import numpy as np

    from pipeline.abenteuer.ton.sampler import ABTASTRATE, NACHKLANG, mit_hall, raumantwort, rendere_spur

    stueck = baue(satz)
    form = int(stueck.sekunden(stueck.ende()) * ABTASTRATE)
    laenge = form + int(NACHKLANG * ABTASTRATE)
    antwort = raumantwort()
    spuren = {}
    for name, indizes in gruppen.items():
        summe = np.zeros((laenge + len(antwort) - 1, 2), dtype=np.float32)
        for i in indizes:
            spur = stueck.spuren[i]
            summe += mit_hall(rendere_spur(spur, stueck, PROBEN, laenge), spur.hall, antwort)
        spuren[name] = _als_schleife(summe, form)
    return _gemeinsam_angeglichen(spuren)


def _als_schleife(ton, form: int):  # noqa: ANN001, ANN202 (numpy)
    """Legt den Nachklang über das Formende auf den Anfang (wie sampler.rendere mit Schleife)."""
    ueberhang = ton[form:]
    ton = ton[:form].copy()
    for start in range(0, len(ueberhang), form):
        teil = ueberhang[start : start + form]
        ton[: len(teil)] += teil
    return ton


def _gemeinsam_angeglichen(spuren: dict):  # noqa: ANN202 (numpy)
    """Eine Verstärkung für alle Spuren: volle Mischung auf ZIEL_RMS_DB, Spitze höchstens SPITZE_DB."""
    import numpy as np

    voll = sum(spuren.values())
    rms = float(np.sqrt(np.mean(voll**2))) or 1e-9
    spitze = float(np.max(np.abs(voll))) or 1e-9
    faktor = min(10 ** (ZIEL_RMS_DB / 20) / rms, 10 ** (SPITZE_DB / 20) / spitze)
    return {name: ton * faktor for name, ton in spuren.items()}


def mische(spuren: dict, pegel: dict[str, float]):  # noqa: ANN201 (numpy)
    """Eine Mischung: Summe der Spuren mit linearen Pegeln (fehlend: 0). Für Demos."""
    return sum(ton * pegel.get(name, 0.0) for name, ton in spuren.items())


def puffer_mb(sekunden: float, kanaele: int = 2) -> float:
    """Speicher eines dekodierten Puffers im Browser in MB. Beispiel: 50 s Stereo → 19,2 MB."""
    return sekunden * BROWSER_RATE * kanaele * BYTES_JE_WERT / 1e6


def dateigroesse_kb(pfad: Path) -> float:
    """Größe einer Datei in KB."""
    return pfad.stat().st_size / 1e3
