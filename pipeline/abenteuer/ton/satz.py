"""Bausteine eines Notensatzes: Noten, Spuren, Stücke und Hilfen zum Setzen von Motiven.

Warum: Hörproben, MIDI-Dateien und der Sampler brauchen dieselbe einfache Beschreibung eines Stücks.
Zeiten stehen in Schlägen (Viertel = 1); erst beim Rendern werden sie mit dem Tempo in Sekunden
umgerechnet. Diese Datei braucht keine Zusatzpakete und ist deshalb ohne numpy testbar.
"""

from dataclasses import dataclass, field

from pipeline.abenteuer.ton.motive import G_DUR, HALBTOENE_JE_OKTAVE, Motiv, Tonart, tonhoehe

# Anschlagstärken wie in MIDI (1 bis 127).
LEISE = 45
MITTEL = 70
KRAEFTIG = 90
# Länge eines Vorschlags in Schlägen.
VORSCHLAG = 0.15
SEKUNDEN_JE_MINUTE = 60.0


@dataclass(frozen=True)
class Note:
    """Ein Ton: MIDI-Nummer, Beginn und Dauer in Schlägen, Anschlagstärke 1 bis 127."""

    tonhoehe: int
    beginn: float
    dauer: float
    staerke: int = MITTEL


@dataclass
class Spur:
    """Alle Noten eines Instruments mit Mischung.

    ``instrument`` ist eine Kennung aus ``instrumente.INSTRUMENTE``. ``hall`` ist der Anteil des
    Nachhalls (0 trocken bis 1), ``panorama`` die Lage von -1 (links) bis 1 (rechts). ``streuung``
    verschiebt jeden Anschlag zufällig um bis zu so viele Sekunden, damit es nicht maschinell klingt;
    0 für Victor, der streng im Takt spielt.
    """

    instrument: str
    noten: list[Note] = field(default_factory=list)
    lautstaerke: float = 1.0
    hall: float = 0.25
    panorama: float = 0.0
    streuung: float = 0.012


@dataclass
class Stueck:
    """Eine Hörprobe: Kennung (Dateiname), Titel, Tempo in Schlägen je Minute, Spuren."""

    kennung: str
    titel: str
    tempo: float
    spuren: list[Spur]
    beschreibung: str = ""

    def ende(self) -> float:
        """Letzter Schlag, an dem noch eine Note klingt. Beispiel: eine ganze Note ab 0 endet bei 4."""
        return max((note.beginn + note.dauer for spur in self.spuren for note in spur.noten), default=0.0)

    def sekunden(self, schlaege: float) -> float:
        """Schläge in Sekunden nach dem Tempo. Beispiel: 4 Schläge bei 120 sind 2 Sekunden."""
        return schlaege * SEKUNDEN_JE_MINUTE / self.tempo


def setze(
    motiv: Motiv,
    beginn: float,
    tonart: Tonart = G_DUR,
    oktave: int = 0,
    staerke: int = MITTEL,
) -> list[Note]:
    """Ein Motiv als Noten ab einem Schlag.

    Warum: Jede Fassung eines Motivs entsteht so aus denselben Stufen; nur Tonart, Lage, Beginn und
    Anschlag ändern sich.
    Eingaben: Motiv, Beginn in Schlägen, Tonart, Oktavlage, Anschlag. Ausgabe: Noten in Reihenfolge.
    Beispiel: setze(AMBROSE_KOPF, 0) ergibt D4 (0, 1 Schlag), H3 (1, 2), Cis4 (3, 1), A3 (4, 2,5).
    Sonderfälle: keine.
    """
    noten: list[Note] = []
    zeit = beginn
    for stufe, dauer in zip(motiv.stufen, motiv.dauern, strict=True):
        hoehe = tonhoehe(stufe, tonart) + HALBTOENE_JE_OKTAVE * oktave
        noten.append(Note(hoehe, zeit, dauer, staerke))
        zeit += dauer
    return noten


def mit_vorschlag(noten: list[Note], index: int, von: int) -> list[Note]:
    """Fügt vor der Note ``index`` einen kurzen Vorschlag mit der Tonhöhe ``von`` ein.

    Warum: Ambroses Kopf hat einen Vorschlag vor der ♯4 (Klangplan A1). Der Vorschlag nimmt seine
    Zeit der Note davor weg, damit die ♯4 auf ihrem Schlag bleibt.
    Beispiel: mit_vorschlag(kopf, 2, 62) setzt ein kurzes D vor das Cis.
    Sonderfälle: Index 0 hat keine Note davor; dann beginnt der Vorschlag vor dem Motiv.
    """
    ziel = noten[index]
    vorschlag = Note(von, ziel.beginn - VORSCHLAG, VORSCHLAG, max(ziel.staerke - 10, 1))
    ergebnis = list(noten)
    if index > 0:
        davor = ergebnis[index - 1]
        ergebnis[index - 1] = Note(davor.tonhoehe, davor.beginn, davor.dauer - VORSCHLAG, davor.staerke)
    ergebnis.insert(index, vorschlag)
    return ergebnis


def pedal(noten: list[Note], bis: float) -> list[Note]:
    """Alle Noten klingen bis zum Schlag ``bis`` (Haltepedal). Beispiel: Ambroses Kopf „viel Pedal“."""
    return [Note(n.tonhoehe, n.beginn, max(n.dauer, bis - n.beginn), n.staerke) for n in noten]


def akkord(toene: tuple[int, ...], beginn: float, dauer: float, staerke: int = LEISE) -> list[Note]:
    """Gleichzeitige Töne. Beispiel: akkord((43, 50, 59), 0, 4) ist ein G-Dur-Akkord über G2."""
    return [Note(ton, beginn, dauer, staerke) for ton in toene]


def gebrochen(
    toene: tuple[int, ...], muster: tuple[int, ...], beginn: float, schritt: float, staerke: int
) -> list[Note]:
    """Ein gebrochener Akkord (Zupfmuster einer Gitarre).

    Eingaben: Akkordtöne von unten nach oben, Muster als Indizes in diese Töne, Beginn, Notenwert eines
    Schritts, Anschlag. Jede Note klingt zwei Schritte lang, damit das Zupfen ineinander klingt.
    Beispiel: gebrochen(G, (0, 1, 2, 3), 0, 0.5, 50) zupft vier Achtel aufwärts.
    """
    nachklang = 2
    return [
        Note(toene[index], beginn + i * schritt, schritt * nachklang, staerke)
        for i, index in enumerate(muster)
    ]
