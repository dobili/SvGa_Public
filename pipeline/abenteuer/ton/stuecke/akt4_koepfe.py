"""Die Köpfe der acht Ortsthemen als Zitate für die Rückblicke von Akt 4.

Warum: Akt 4 sammelt die Orte ein (Klangplan 4A1, 4A2): Crossroads spielt fünf Ortsthemen
nacheinander, das Lagerfeuer singt alle acht Köpfe als Strophen, die Arena-Treppe legt sie
darunter, die Fernpartie zitiert sieben Fundorte, der Abspann alle acht. Alle diese Stücke stehen in
G-Dur; deshalb steht jeder Kopf hier dreimal über G: in seiner eigenen Farbe (Moll mit ♭3, ♭6, ♭7
für Cedar Creek, Riverton und Ironwood, lydisch für Silicon Bay), in Dur für den fröhlichen
Crossroads-Zug und in zwei Takten nur mit I, IV und V für Ezras Gitarre.

Maple Falls und Cedar Creek stammen aus ``maple.py`` und ``cedar.py`` (dieselben Töne). Miss Odiles
Lied steht in A1 (5 – 6 – 1' – 6 – 5 – 3 – 2 – 1), das Endspielmotiv auch (1 – 5 – 2' – 6' – 3'').
**Riverton, Ironwood, Silicon Bay und Desert Springs** waren beim Setzen von Akt 4 noch nicht
gesetzt (Akt 2 und 3 entstanden gleichzeitig); ihre Köpfe hier sind nach den Tabellen 2A1 und 3A1
entworfen (Riverton Swing in Moll, Ironwood schwer, Silicon Bay lydisch, Desert Springs sparsam).
Sobald die Ortsthemen stehen, sollten diese vier Köpfe aus deren Teilen übernommen werden.
"""

from dataclasses import dataclass

from pipeline.abenteuer.ton.satzplan import Stimme, Teil


@dataclass(frozen=True)
class Kopf:
    """Ein Ortsthema als Zitat: Instrument des Orts, Lage und drei Fassungen über G."""

    ort: str
    instrument: str
    oktave: int
    eigen: Teil
    dur: Teil
    zwei: Teil


MAPLE = Kopf(
    "maple",
    "gitarre",
    1,
    Teil("I | IV | vi | V", "1:1 2:1 3:1 5:1 | 6:3 5:1 | 3:2 2:1 3:1 | 2:4"),
    Teil("I | IV | vi | V", "1:1 2:1 3:1 5:1 | 6:3 5:1 | 3:2 2:1 3:1 | 2:4"),
    Teil("I | IV", "1:1 2:1 3:1 5:1 | 6:3 5:1"),
)
CEDAR = Kopf(
    "cedar",
    "klavier",
    1,
    Teil("i | V | iv i | V", "1:2 b3:2 | 2:3 r:1 | 4:2 5:2 | 5:3 r:1"),
    Teil("I | V | IV I | V", "1:2 3:2 | 2:3 r:1 | 4:2 5:2 | 5:3 r:1"),
    Teil("I | V", "1:2 3:2 | 2:3 r:1"),
)
RIVERTON = Kopf(
    "riverton",
    "trompete_gedaempft",
    1,
    Teil(
        "i | iv | V7 | i",
        "5:0.5 b3:0.5 1:1 b3:0.5 5:0.5 1':1 | 4:0.5 b6:0.5 1':1 b6:0.5 4:0.5 1:1 | "
        "2:0.5 4:0.5 7,:1 2:0.5 4:0.5 5:1 | 1':0.5 b7:0.5 5:1 1:2",
    ),
    Teil(
        "I | IV | V7 | I",
        "5:0.5 3:0.5 1:1 3:0.5 5:0.5 1':1 | 4:0.5 6:0.5 1':1 6:0.5 4:0.5 1:1 | "
        "2:0.5 4:0.5 7,:1 2:0.5 4:0.5 5:1 | 1':0.5 6:0.5 5:1 1:2",
    ),
    Teil("I | V7", "5:0.5 3:0.5 1:1 3:0.5 5:0.5 1':1 | 2:0.5 4:0.5 7,:1 5:2"),
)
IRONWOOD = Kopf(
    "ironwood",
    "klarinette",
    1,
    Teil("i | i bVI | bVII | i", "1:2 b3:1 4:1 | 5:2 b6:1 5:1 | 4:2 2:1 b7,:1 | 1:4"),
    Teil("I | I vi | V7 | I", "1:2 3:1 4:1 | 5:2 6:1 5:1 | 4:2 2:1 7,:1 | 1:4"),
    Teil("I | V", "1:2 3:1 4:1 | 5:4"),
)
# Silicon Bay ist lydisch: die ♯4 liegt oben, über dem A-Dur-Akkord (II). Im Kinderlied am Feuer
# wird sie zur reinen 4 (Kinder kennen den fremden Ton nicht, wie Mira, A1).
SILICON = Kopf(
    "silicon",
    "digitalpiano",
    1,
    Teil(
        "I II | II | I | II",
        "1:0.5 5:0.5 3:0.5 5:0.5 #4:2 | 2:0.5 6,:0.5 2:0.5 3:0.5 #4:2 | "
        "5:0.5 3:0.5 1:0.5 3:0.5 5:1 6:1 | #4:4",
    ),
    Teil(
        "I II | II | I | II",
        "1:0.5 5:0.5 3:0.5 5:0.5 #4:2 | 2:0.5 6,:0.5 2:0.5 3:0.5 #4:2 | "
        "5:0.5 3:0.5 1:0.5 3:0.5 5:1 6:1 | #4:4",
    ),
    Teil("I V7 | V I", "1:0.5 5:0.5 3:0.5 5:0.5 4:2 | 2:0.5 6,:0.5 2:0.5 3:0.5 5:2"),
)
PORT = Kopf(
    "port",
    "trompete",
    1,
    Teil("I | IV I | V | I", "5:1 6:1 1':2 | 6:1 5:1 3:2 | 2:3 r:1 | 1:4"),
    Teil("I | IV I | V | I", "5:1 6:1 1':2 | 6:1 5:1 3:2 | 2:3 r:1 | 1:4"),
    Teil("I IV | I I V I", "5:1 6:1 1':1 6:1 | 5:1 3:1 2:1 1:1"),
)
DESERT = Kopf(
    "desert",
    "egitarre",
    1,
    Teil("I | iii | IV | V", "3:2 r:1 5:1 | 5:3 r:1 | 6:2 1':1 6:1 | 5:3 r:1"),
    Teil("I | iii | IV | V", "3:2 r:1 5:1 | 5:3 r:1 | 6:2 1':1 6:1 | 5:3 r:1"),
    Teil("I | IV V", "3:2 r:1 5:1 | 6:1 5:1 2:2"),
)
# Summit City: der Quintenturm des Endspielmotivs, jeder Ton einzeln (A1, „Endspiel“).
SUMMIT = Kopf(
    "summit",
    "klavier",
    0,
    Teil("I | V IV | I | I", "1:2 5:2 | 2':2 6':2 | 3'':4 | r:4"),
    Teil("I | V IV | I | I", "1:2 5:2 | 2':2 6':2 | 3'':4 | r:4"),
    Teil("I I V IV | I", "1:1 5:1 2':1 6':1 | 3'':4"),
)

# Reihenfolge der Akte: Maple Falls und Cedar Creek (1), Riverton und Ironwood (2), Silicon Bay,
# Port Delacroix und Desert Springs (3), Summit City (4).
ALLE = (MAPLE, CEDAR, RIVERTON, IRONWOOD, SILICON, PORT, DESERT, SUMMIT)


def teile(koepfe: tuple[Kopf, ...], fassung: str, praefix: str) -> dict[str, Teil]:
    """Die Köpfe als Teile, benannt „praefix_ort“. ``fassung`` ist „eigen“, „dur“ oder „zwei“.

    Beispiel: teile(ALLE, "zwei", "s") ergibt s_maple, s_cedar … für die Strophen am Lagerfeuer.
    """
    return {f"{praefix}_{k.ort}": getattr(k, fassung) for k in koepfe}


def stimmen(
    koepfe: tuple[Kopf, ...],
    praefix: str,
    staerke: int,
    lautstaerke: float = 0.8,
    instrument: str = "",
    oktave: int | None = None,
) -> tuple[Stimme, ...]:
    """Je Kopf eine Melodiestimme im Instrument des Orts (oder ``instrument``), nur in seinem Teil.

    ``oktave`` ersetzt die Lage des Kopfs, wenn ein anderes Instrument alle Köpfe spielt.
    """
    return tuple(
        Stimme(
            instrument or k.instrument,
            "melodie",
            lautstaerke,
            0.15,
            0.3,
            k.oktave if oktave is None else oktave,
            staerke,
            frozenset({f"{praefix}_{k.ort}"}),
        )
        for k in koepfe
    )
