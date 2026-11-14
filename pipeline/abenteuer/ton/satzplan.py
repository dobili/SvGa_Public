"""Ein Stück als Plan: Tonart, Tempo, Teile mit Akkorden und Melodie, Stimmen mit Muster.

Warum: Der Klangplan verlangt für jeden Ort ein Thema in mehreren Fassungen (schneller, gespannter,
leiser), alle aus einer Hand. Als Plan notiert ist eine Fassung nur eine andere Besetzung derselben
Teile. ``baue`` macht daraus ein ``Stueck`` mit Noten, das der Sampler spielt.

Schreibweise:
- Akkorde je Teil: Takte durch ``|`` getrennt, mehrere Akkorde in einem Takt teilen ihn gleich.
  Beispiel: ``"I | IV | vi V | I"``. Symbole in ``harmonie.py``.
- Melodie: ``stufe:dauer`` durch Leerzeichen, ``r`` für Pause, ``>`` davor betont, Dauer als Zahl
  oder Bruch (``1/3`` für Triolen). ``|`` darf zur Übersicht stehen; geprüft wird die Gesamtlänge.
  Beispiel (Maple Falls, Kopf): ``"1:1 2:1 3:1 5:1 | 6:3 5:1"``.
"""

import zlib
from dataclasses import dataclass, field
from fractions import Fraction

from pipeline.abenteuer.ton.harmonie import Akkord, akkord
from pipeline.abenteuer.ton.motive import DUR, HALBTOENE_JE_OKTAVE, MOLL, Tonart, tonhoehe
from pipeline.abenteuer.ton.muster import MUSTER, Abschnitt
from pipeline.abenteuer.ton.rhythmus import RHYTHMEN
from pipeline.abenteuer.ton.satz import LEISE, Note, Spur, Stueck
from pipeline.abenteuer.ton.schlagwerk import SCHLAGWERK

# Grundtöne in der kleinen Oktave (C3 = 48), deutsche Namen: H ist B-Dur-los, B ist das erniedrigte H.
GRUNDTOENE = {
    "c": 48,
    "cis": 49,
    "des": 49,
    "d": 50,
    "es": 51,
    "e": 52,
    "f": 53,
    "fis": 54,
    "ges": 54,
    "g": 55,
    "as": 56,
    "a": 57,
    "b": 58,
    "h": 59,
}
MELODIE = "melodie"
NOTEN = "noten"
PAUSE = "r"
BETONT = ">"
BETONUNG = 12
# Wie stark Anschläge zufällig schwanken (±), damit es gespielt klingt.
SCHWANKUNG = 5
GENAUIGKEIT = 1e-6
# Grundpegel je Rolle in dBFS (klingende Stellen), bevor ``lautstaerke`` ihn verschiebt: Die
# Melodie liegt vorn, Gegenstimmen und Bass dahinter, Flächen und Schlagwerk weiter hinten.
ROLLENPEGEL = {MELODIE: -24.0, NOTEN: -29.0, "halten": -33.0, "stoss": -28.0}
BASSPEGEL = -29.0
BEGLEITPEGEL = -31.0
SCHLAGPEGEL = -34.0


def tonart(name: str) -> Tonart:
    """Tonart aus deutschem Namen: Großbuchstabe Dur, Kleinbuchstabe Moll. Beispiel: „d“ ist d-Moll."""
    return Tonart(GRUNDTOENE[name.lower()], MOLL if name[0].islower() else DUR)


@dataclass(frozen=True)
class Stimme:
    """Eine Stimme: Instrument, Rolle und Mischung.

    ``rolle`` ist ``melodie`` (die Melodie des Teils), ``noten`` (eine eigene Linie des Teils unter
    ``kennung``), ein Muster aus ``muster.MUSTER`` oder ein Rhythmus aus ``rhythmus.RHYTHMEN``.
    ``oktave`` verschiebt Melodie und Lage. ``teile`` begrenzt die Stimme auf diese Teile.
    """

    instrument: str
    rolle: str
    lautstaerke: float = 0.8
    panorama: float = 0.0
    hall: float = 0.25
    oktave: int = 0
    staerke: int = LEISE
    teile: frozenset[str] | None = None
    kennung: str = ""


@dataclass(frozen=True)
class Teil:
    """Ein Teil der Form: Akkorde, Melodie und eigene Linien einzelner Stimmen (nach Kennung)."""

    akkorde: str
    melodie: str = ""
    linien: dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class Satz:
    """Ein Stück als Plan. ``form`` ist die Reihenfolge der Teile, ``akt`` die Paketgruppe."""

    kennung: str
    titel: str
    tonart: str
    tempo: float
    taktart: int
    teile: dict[str, Teil]
    form: tuple[str, ...]
    stimmen: tuple[Stimme, ...]
    swing: float = 0.0
    schleife: bool = True
    akt: int = 1
    pegel_db: float = 0.0
    beschreibung: str = ""


def dauer(text: str) -> float:
    """Eine Dauer aus Zahl oder Bruch. Beispiel: „1/3“ ist eine Triolenachtel."""
    return float(Fraction(text))


def linie(text: str, tonart_: Tonart, beginn: float, oktave: int, staerke: int) -> tuple[list[Note], float]:
    """Noten einer Melodiezeile ab ``beginn``. Ausgabe: Noten und Gesamtdauer in Schlägen.

    Beispiel: linie("1:1 r:1 5:2", G-Dur, 0, 1, 50) ergibt G4 (0, 1) und D5 (2, 2), Dauer 4.
    Sonderfälle: Unbekannte Stufen werfen ValueError (motive.tonhoehe).
    """
    noten: list[Note] = []
    zeit = beginn
    for wort in text.replace("|", " ").split():
        betont = wort.startswith(BETONT)
        stufe, _, wert = wort.lstrip(BETONT).partition(":")
        laenge = dauer(wert or "1")
        if stufe != PAUSE:
            hoehe = tonhoehe(stufe, tonart_) + oktave * HALBTOENE_JE_OKTAVE
            noten.append(Note(hoehe, zeit, laenge, staerke + (BETONUNG if betont else 0)))
        zeit += laenge
    return noten, zeit - beginn


def takte(text: str, tonart_: Tonart) -> list[list[Akkord | None]]:
    """Akkorde je Takt. Beispiel: „I | IV V“ ergibt [[G], [C, D]]."""
    return [[akkord(s, tonart_) for s in takt.split()] for takt in text.split("|")]


def _abschnitte(satz: Satz) -> list[tuple[str, int, list[tuple[Akkord | None, float, float]]]]:
    """Für jeden Takt der Form: Teil, Taktnummer und Akkorde mit Beginn und Dauer."""
    ton = tonart(satz.tonart)
    ergebnis = []
    zeit, nummer = 0.0, 0
    for name in satz.form:
        for akkorde in takte(satz.teile[name].akkorde, ton):
            anteil = satz.taktart / len(akkorde)
            ergebnis.append((name, nummer, [(a, zeit + i * anteil, anteil) for i, a in enumerate(akkorde)]))
            zeit += satz.taktart
            nummer += 1
    return ergebnis


def _begleitung(satz: Satz, stimme: Stimme) -> list[Note]:
    """Noten einer Muster- oder Rhythmusstimme über alle Takte ihrer Teile."""
    abschnitte = _abschnitte(satz)
    folge = [a for _, _, takt in abschnitte for a in takt]
    noten: list[Note] = []
    index = 0
    for name, nummer, takt in abschnitte:
        aktiv = stimme.teile is None or name in stimme.teile
        if aktiv and stimme.rolle in RHYTHMEN:
            noten += RHYTHMEN[stimme.rolle](takt[0][1], satz.taktart, nummer, stimme.staerke)
        for akk, beginn, laenge in takt:
            index += 1
            if not aktiv or akk is None or stimme.rolle not in MUSTER:
                continue
            naechster = next((a for a, _, _ in folge[index:] if a is not None), None)
            abschnitt = Abschnitt(
                akk, beginn, laenge, satz.taktart, naechster, nummer, stimme.staerke, stimme.oktave
            )
            noten += MUSTER[stimme.rolle](abschnitt)
    return noten


def _linienstimme(satz: Satz, stimme: Stimme) -> list[Note]:
    """Melodie oder eigene Linie über alle Teile; prüft, dass jede Zeile ihren Teil genau füllt."""
    ton = tonart(satz.tonart)
    noten: list[Note] = []
    zeit = 0.0
    for name in satz.form:
        teil = satz.teile[name]
        laenge = len(teil.akkorde.split("|")) * satz.taktart
        text = teil.melodie if stimme.rolle == MELODIE else teil.linien.get(stimme.kennung, "")
        if text and (stimme.teile is None or name in stimme.teile):
            gesetzt, gesamt = linie(text, ton, zeit, stimme.oktave, stimme.staerke)
            if abs(gesamt - laenge) > GENAUIGKEIT:
                raise ValueError(f"{satz.kennung}, Teil {name}: Linie {gesamt} statt {laenge} Schläge")
            noten += gesetzt
        zeit += laenge
    return noten


def _gespielt(noten: list[Note], satz: Satz, stimme: Stimme) -> list[Note]:
    """Swing auf den Achteln und leichte Schwankung der Anschläge (fest je Stück und Stimme)."""
    samen = zlib.crc32(f"{satz.kennung}/{stimme.instrument}/{stimme.rolle}".encode())
    ergebnis = []
    for i, n in enumerate(noten):
        beginn = n.beginn
        if satz.swing and abs(beginn % 1 - 0.5) < GENAUIGKEIT:
            beginn += satz.swing
        schwankung = (samen >> (i % 24)) % (2 * SCHWANKUNG + 1) - SCHWANKUNG
        ergebnis.append(Note(n.tonhoehe, beginn, n.dauer, max(1, min(127, n.staerke + schwankung))))
    return ergebnis


def rollenpegel(rolle: str) -> float:
    """Grundpegel einer Rolle. Beispiel: „bass_wechsel“ ergibt −29 dB, „besen“ −34 dB."""
    if rolle in ROLLENPEGEL:
        return ROLLENPEGEL[rolle]
    if rolle.startswith("bass"):
        return BASSPEGEL
    return SCHLAGPEGEL if rolle in RHYTHMEN else BEGLEITPEGEL


def baue(satz: Satz) -> Stueck:
    """Der Plan als Stück mit Spuren. Beispiel: baue(MAPLE_FALLS) für den Sampler."""
    spuren = []
    for stimme in satz.stimmen:
        if stimme.rolle in (MELODIE, NOTEN):
            noten = _linienstimme(satz, stimme)
        else:
            noten = _begleitung(satz, stimme)
        instrument = SCHLAGWERK if stimme.rolle in RHYTHMEN else stimme.instrument
        spuren.append(
            Spur(
                instrument,
                _gespielt(noten, satz, stimme),
                stimme.lautstaerke,
                stimme.hall,
                stimme.panorama,
                pegel_db=rollenpegel(stimme.rolle),
            )
        )
    laenge = sum(len(satz.teile[n].akkorde.split("|")) for n in satz.form) * satz.taktart
    return Stueck(
        satz.kennung,
        satz.titel,
        satz.tempo,
        spuren,
        satz.beschreibung,
        schleife=satz.schleife,
        laenge=float(laenge),
    )
