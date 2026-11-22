"""Gleichmäßige Lautheit der Musik prüfen (Klangplan A0.6, Wunsch des Autors, 22.11.2026).

Warum: „Nervig, wenn eine Melodie immer wieder loopt und ein Ton da immer ein ganzes Stück lauter
ist.“ Gemessen am Probestück: Maple Falls hatte Spitzen der Momentanlautheit etwa 10 dB über dem
Rest, bei jeder Schleife hörbar. Vorbild ist die gleichmäßig laute, sequenzierte Musik der
Rollenspiele (Pokémon auf Game Boy und DS): feste Anschlagstärken je Stimme, kaum Dynamik.

Gemessen wird nach ITU-R BS.1770 / EBU R128 (K-Filter, Torung bei −70 LUFS und relativ):
- integrierte Lautheit (LUFS), Ziel ZIEL_LUFS für alle Ortsthemen;
- Lautheitsbereich LRA (LU) aus der Kurzzeitlautheit (3 s), Grenze GRENZE_LRA, bei Kampfthemen
  GRENZE_LRA_KAMPF;
- Momentanlautheit (400 ms): das 98. Perzentil höchstens GRENZE_P98 über dem Median, und kein
  Ausreißer mehr als GRENZE_AUSREISSER darüber; gemeldet mit Zeitpunkt;
- echte Spitze (vierfach überabgetastet) höchstens GRENZE_SPITZE dBTP;
- Naht der Schleife: Lautheit der letzten und der ersten 2 s höchstens GRENZE_NAHT auseinander.

Aufruf: ``python -m pipeline.abenteuer.ton.lautheit DATEI_ODER_ORDNER … [--spuren]``; gibt je Datei
die Werte und die Verstöße aus (Rückgabe 1 bei Verstößen). Braucht numpy, scipy und ffmpeg.
Rolle im Gesamtbild: geprüft von musikbau.py und ortsthemenprobe.py nach dem Rendern, und vom Test
pipeline/tests/test_abenteuer_lautheit.py, wo die Dateien vorliegen.
"""

import argparse
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

RATE = 48_000
ZIEL_LUFS = -18.0
GRENZE_LRA = 5.0
GRENZE_LRA_KAMPF = 4.0
GRENZE_P98 = 4.0
GRENZE_AUSREISSER = 6.0
GRENZE_SPITZE = -3.0
GRENZE_NAHT = 2.0
NAHT_SEKUNDEN = 2.0
# Reserve für den Kodierer: AAC legt auf die Spitzen etwa 1 dB (gemessen am Probestück).
KODIERER_RESERVE = 1.0
# So viele dB darf der weiche Begrenzer (begrenze) an einer Spitze höchstens abfangen.
BEGRENZER_SPIELRAUM = 3.0
# Messfenster nach EBU R128: momentan 400 ms, kurzzeitig 3 s, Schritt 100 ms.
MOMENTAN_S = 0.4
KURZ_S = 3.0
SCHRITT_S = 0.1
ABSOLUT_TOR = -70.0
RELATIV_TOR_INTEGRIERT = -10.0
RELATIV_TOR_LRA = -20.0
UEBERABTASTUNG = 4


@dataclass
class Messung:
    """Ergebnis einer Datei: Werte, die Momentanlautheit und die Verstöße als Sätze."""

    name: str
    lufs: float
    lra: float
    p98_ueber_median: float
    spitze_dbtp: float
    naht_lu: float
    momentan: list[float] = field(default_factory=list)
    verstoesse: list[str] = field(default_factory=list)
    # Befunde, die den Dauertest nicht scheitern lassen (dünne Mischungen, lautheitspruefung.py).
    hinweise: list[str] = field(default_factory=list)


def lies(pfad: Path):  # noqa: ANN201 (numpy)
    """Dekodiert eine Tondatei mit ffmpeg als Stereo float32 in RATE."""
    import numpy as np

    befehl = ["ffmpeg", "-v", "error", "-i", str(pfad), "-f", "f32le", "-ac", "2", "-ar", str(RATE), "-"]
    roh = subprocess.run(befehl, check=True, capture_output=True).stdout
    return np.frombuffer(roh, dtype=np.float32).reshape(-1, 2)


def k_filter(ton):  # noqa: ANN001, ANN201 (numpy)
    """K-Gewichtung nach BS.1770 (Kuhfilter und Hochpass, Koeffizienten für 48 kHz)."""
    from scipy.signal import lfilter

    stufe1 = (
        [1.53512485958697, -2.69169618940638, 1.19839281085285],
        [1.0, -1.69065929318241, 0.73248077421585],
    )
    stufe2 = ([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621])
    return lfilter(*stufe2, lfilter(*stufe1, ton, axis=0), axis=0)


def _fensterlautheit(gefiltert, fenster_s: float):  # noqa: ANN001, ANN202 (numpy)
    """Lautheit (LUFS) gleitender Fenster im Schritt von SCHRITT_S."""
    import numpy as np

    quadrat = (gefiltert**2).sum(axis=1)
    kumuliert = np.concatenate([[0.0], np.cumsum(quadrat)])
    breite, schritt = int(fenster_s * RATE), int(SCHRITT_S * RATE)
    anfaenge = np.arange(0, max(1, len(quadrat) - breite + 1), schritt)
    mittel = (kumuliert[anfaenge + min(breite, len(quadrat))] - kumuliert[anfaenge]) / breite
    return -0.691 + 10 * np.log10(np.maximum(mittel, 1e-12))


def _integriert(momentan):  # noqa: ANN001, ANN202 (numpy)
    """Integrierte Lautheit mit absolutem und relativem Tor (aus den 400-ms-Blöcken)."""
    import numpy as np

    werte = momentan[momentan > ABSOLUT_TOR]
    if len(werte) == 0:
        return ABSOLUT_TOR
    tor = 10 * np.log10(np.mean(10 ** (werte / 10))) + RELATIV_TOR_INTEGRIERT
    werte = werte[werte > tor]
    return float(10 * np.log10(np.mean(10 ** (werte / 10))))


def _lra(kurz):  # noqa: ANN001, ANN202 (numpy)
    """Lautheitsbereich: 10. bis 95. Perzentil der getorten Kurzzeitlautheit."""
    import numpy as np

    werte = kurz[kurz > ABSOLUT_TOR]
    if len(werte) == 0:
        return 0.0
    tor = 10 * np.log10(np.mean(10 ** (werte / 10))) + RELATIV_TOR_LRA
    werte = werte[werte > tor]
    return float(np.percentile(werte, 95) - np.percentile(werte, 10))


def _spitze(ton):  # noqa: ANN001, ANN202 (numpy)
    """Echte Spitze in dBTP (vierfach überabgetastet)."""
    import numpy as np
    from scipy.signal import resample_poly

    hoch = resample_poly(ton, UEBERABTASTUNG, 1, axis=0)
    return float(20 * np.log10(max(float(np.max(np.abs(hoch))), 1e-9)))


def miss(ton, name: str, kampf: bool = False, schleife: bool = True) -> Messung:  # noqa: ANN001 (numpy)
    """Misst einen Stereo-Ton (RATE) und sammelt die Verstöße gegen A0.6 mit Zeitpunkten.

    Ohne ``schleife`` (Einmal-Stücke, Kurzmotive: einmal.json) zählen nur Ausreißer und Spitze;
    Lautheitsbereich und Naht gehören zur Schleife.
    """
    import numpy as np

    gefiltert = k_filter(ton)
    momentan = _fensterlautheit(gefiltert, MOMENTAN_S)
    kurz = _fensterlautheit(gefiltert, KURZ_S)
    klingend = momentan[momentan > ABSOLUT_TOR]
    median = float(np.median(klingend)) if len(klingend) else ABSOLUT_TOR
    naht_n = int(NAHT_SEKUNDEN * RATE)
    anfang = _integriert(_fensterlautheit(gefiltert[:naht_n], MOMENTAN_S))
    ende = _integriert(_fensterlautheit(gefiltert[-naht_n:], MOMENTAN_S))
    messung = Messung(
        name,
        _integriert(momentan),
        _lra(kurz),
        float(np.percentile(klingend, 98) - median) if len(klingend) else 0.0,
        _spitze(ton),
        abs(anfang - ende),
        [round(float(w), 1) for w in momentan],
    )
    messung.verstoesse = verstoesse(messung, momentan, median, kampf, schleife)
    return messung


def verstoesse(m: Messung, momentan, median: float, kampf: bool, schleife: bool = True) -> list[str]:  # noqa: ANN001
    """Die Verstöße einer Messung als Sätze, Ausreißer mit Zeitpunkt."""
    import numpy as np

    funde = []
    grenze_lra = GRENZE_LRA_KAMPF if kampf else GRENZE_LRA
    if schleife and m.lra > grenze_lra:
        funde.append(f"LRA {m.lra:.1f} LU über {grenze_lra:.0f}")
    if schleife and m.p98_ueber_median > GRENZE_P98:
        funde.append(f"98. Perzentil {m.p98_ueber_median:.1f} LU über dem Median (bis {GRENZE_P98:.0f})")
    for i in np.flatnonzero(momentan > median + GRENZE_AUSREISSER)[:5]:
        funde.append(f"Ausreißer bei {i * SCHRITT_S:.1f} s: {momentan[i] - median:+.1f} LU")
    if m.spitze_dbtp > GRENZE_SPITZE:
        funde.append(f"Spitze {m.spitze_dbtp:.1f} dBTP über {GRENZE_SPITZE:.0f}")
    if schleife and m.naht_lu > GRENZE_NAHT:
        funde.append(f"Naht: Ende und Anfang {m.naht_lu:.1f} LU auseinander")
    return funde


# Sicherheitsnetz Verdichter: über dem Median plus VERDICHTER_SCHWELLE wird im Verhältnis
# VERDICHTER_VERHAELTNIS:1 abgesenkt; die Kurve wird über VERDICHTER_GLAETTUNG Schritte geglättet
# (500 ms), damit nichts pumpt.
VERDICHTER_SCHWELLE = 1.0
VERDICHTER_VERHAELTNIS = 4.0
VERDICHTER_GLAETTUNG = 5
# So viel Ton (s) wird bei einer Schleife vorn und hinten angesetzt, damit die Ränder ringförmig sind.
RING_SEKUNDEN = 2.0


def _auf_messrate(ton, rate: int):  # noqa: ANN001, ANN202 (numpy)
    """Für die Messung auf RATE umgerechnet (die K-Filter-Werte gelten für 48 kHz)."""
    from math import gcd

    from scipy.signal import resample_poly

    if rate == RATE:
        return ton
    teiler = gcd(rate, RATE)
    return resample_poly(ton, RATE // teiler, rate // teiler, axis=0)


def verdichtungskurve(ton, rate: int = RATE, schleife: bool = True):  # noqa: ANN001, ANN201 (numpy)
    """Verstärkung je Abtastwert (linear) eines sanften Verdichters, gemessen an der Momentanlautheit.

    Warum: Erst die Ursache beheben (feste Aufnahmestufe je Stimme, Gegenstimme im B-Teil), dann
    fängt die Kurve übrig gebliebene Spitzen ab. Für Spuren wird sie aus der vollen Mischung berechnet
    und auf jede Spur gelegt; so bleibt die Summe der Spuren die volle Mischung.
    """
    import numpy as np

    # Eine Schleife wird ringförmig gerechnet: Ende und Anfang stoßen aneinander, also liegt vor dem
    # Anfang das Ende (und umgekehrt); sonst würden die Ränder anders verdichtet und die Naht spränge.
    rand = int(RING_SEKUNDEN * rate) if schleife and len(ton) > 2 * RING_SEKUNDEN * rate else 0
    if rand:
        kurve = verdichtungskurve(np.concatenate([ton[-rand:], ton, ton[:rand]]), rate, schleife=False)
        return kurve[rand:-rand]
    momentan = _fensterlautheit(k_filter(_auf_messrate(ton, rate)), MOMENTAN_S)
    klingend = momentan[momentan > ABSOLUT_TOR]
    if len(klingend) == 0:
        return np.ones((len(ton), 1), dtype=np.float32)
    schwelle = float(np.median(klingend)) + VERDICHTER_SCHWELLE
    absenkung = -np.maximum(0.0, momentan - schwelle) * (1 - 1 / VERDICHTER_VERHAELTNIS)
    absenkung = np.convolve(absenkung, np.ones(VERDICHTER_GLAETTUNG) / VERDICHTER_GLAETTUNG, mode="same")
    mitten = (np.arange(len(absenkung)) * SCHRITT_S + MOMENTAN_S / 2) * rate
    kurve = np.interp(np.arange(len(ton)), mitten, absenkung)
    return (10 ** (kurve / 20)).astype(np.float32)[:, None]


def zielfaktor(ton, rate: int = RATE, mit_begrenzer: bool = False) -> float:  # noqa: ANN001 (numpy)
    """Linearer Faktor auf ZIEL_LUFS, höchstens so viel, dass die echte Spitze GRENZE_SPITZE bleibt."""
    gemessen = _auf_messrate(ton, rate)
    lufs = _integriert(_fensterlautheit(k_filter(gemessen), MOMENTAN_S))
    faktor = 10 ** ((ZIEL_LUFS - lufs) / 20)
    spitze = 10 ** (_spitze(gemessen) / 20)
    # Mit Begrenzer danach darf die Spitze darüber; er fängt sie weich ab (bis BEGRENZER_SPIELRAUM dB).
    spielraum = BEGRENZER_SPIELRAUM if mit_begrenzer else 0.0
    grenze = 10 ** ((GRENZE_SPITZE - KODIERER_RESERVE + spielraum) / 20)
    return float(min(faktor, grenze / max(spitze, 1e-9)))


def begrenze(ton):  # noqa: ANN001, ANN201 (numpy)
    """Weicher Begrenzer (tanh) mit Decke GRENZE_SPITZE minus KODIERER_RESERVE; nur für ganze Stücke.

    Für Spuren nicht: Begrenzte Spuren ergäben addiert nicht mehr die volle Mischung.
    """
    import numpy as np

    decke = 10 ** ((GRENZE_SPITZE - KODIERER_RESERVE) / 20)
    return np.tanh(ton / decke) * decke


def einmalstuecke(datei: Path) -> set[str]:
    """Die Stämme der Einmal-Stücke aus der nächsten einmal.json über der Datei (musikbau.py)."""
    import json

    for ordner in datei.parents:
        liste = ordner / "einmal.json"
        if liste.exists():
            return set(json.loads(liste.read_text(encoding="utf-8")))
    return set()


# Lautheitskurve als kleines SVG: Breite, Höhe, dargestellter Bereich in LUFS.
KURVE_BREITE = 320
KURVE_HOEHE = 64
KURVE_OBEN = -6.0
KURVE_UNTEN = -42.0


def kurve_svg(m: Messung) -> str:
    """Die Momentanlautheit als Linie, dazu das Ziel (gestrichelt). Für die Hörprobenseite."""
    werte = m.momentan or [KURVE_UNTEN]

    def y(lufs: float) -> float:
        anteil = (min(KURVE_OBEN, max(KURVE_UNTEN, lufs)) - KURVE_OBEN) / (KURVE_UNTEN - KURVE_OBEN)
        return round(anteil * KURVE_HOEHE, 1)

    schritt = KURVE_BREITE / max(1, len(werte) - 1)
    punkte = " ".join(f"{round(i * schritt, 1)},{y(w)}" for i, w in enumerate(werte))
    ziel = y(ZIEL_LUFS)
    return (
        f'<svg viewBox="0 0 {KURVE_BREITE} {KURVE_HOEHE}" width="{KURVE_BREITE}" height="{KURVE_HOEHE}">'
        f'<line x1="0" x2="{KURVE_BREITE}" y1="{ziel}" y2="{ziel}" stroke="currentColor" '
        'stroke-dasharray="3 3" stroke-width="0.5"/>'
        f'<polyline points="{punkte}" fill="none" stroke="currentColor" stroke-width="1"/></svg>'
    )


def kurzbeschreibung(m: Messung) -> str:
    """Eine Zeile mit den Werten und ggf. den Verstößen."""
    werte = f"{m.lufs:.1f} LUFS, LRA {m.lra:.1f} LU, P98 +{m.p98_ueber_median:.1f}, {m.spitze_dbtp:.1f} dBTP"
    return werte + (f" — {'; '.join(m.verstoesse)}" if m.verstoesse else " — hält A0.6")


def miss_ton(ton, rate: int, name: str, kampf: bool = False, schleife: bool = True) -> Messung:  # noqa: ANN001
    """Misst einen Ton in beliebiger Abtastrate (für Mischungen, die nur im Speicher liegen)."""
    return miss(_auf_messrate(ton, rate), name, kampf, schleife)


def ist_kampf(name: str) -> bool:
    """Kampfthema am Namen: Clubkampf, Turnier, Finale, Partie."""
    return any(w in name.lower() for w in ("kampf", "turnier", "finale", "partie"))


def main(argumente: list[str] | None = None) -> int:
    """Misst Stücke und die Mischungen ihrer Spuren (lautheitspruefung.py) und druckt die Verstöße."""
    from pipeline.abenteuer.ton.lautheitspruefung import drucke, pruefe

    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("pfade", nargs="+", type=Path)
    return drucke(pruefe(parser.parse_args(argumente).pfade))


if __name__ == "__main__":
    sys.exit(main())
