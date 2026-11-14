"""Gemeinsamer Stoff der Stücke von Akt 4: Ambrose rein, Held, Victor in Dur, die eine Melodie.

Warum: Akt 4 löst die Leitmotive ein (Klangplan, Akt 4, Teil A): Ambroses Thema ist seit Kapitel 45
rein (die ♯4 wird zur 4, A1 „Ambrose, rein“), das Heldenthema wird vollständig, Victors Thema
bekommt eine Dur-Begleitung, und Ambrose und Held werden eine Melodie. Damit alle Stücke dieselben
Töne benutzen, stehen die Teile hier einmal (eine Hand, Grundsatz 2). Tonart überall G-Dur.

Die Stufen folgen ``motive.py``: Kopf 5 – 3 – ♯4 – 2 und Antwort 3 – 1 – 2 – 1 (aus ``ambrose1``),
Held 2 – 3 – 5 · 2 – 3 – 5 – 6 · 5 – 3 – 2 – 1, Mama 1 – 2 – 3 – 5 – 6 – 5, Nova ♯4 – 5 · 6 – 5 – 3 ·
2 – 3 – 1, die eine Melodie 5 – 3 – 4 – 2 – 3 – 5 · 6 – 5 – 3 – 2 – 1.
"""

from pipeline.abenteuer.ton.satzplan import Teil
from pipeline.abenteuer.ton.stuecke.ambrose1 import ANTWORT, KOPF

TONART = "G"
OBEN = 1

# Ambroses Kopf ohne den fremden Ton: Unter der reinen 4 steht die zweite Stufe in Moll (a-Moll),
# weil der A-Dur-Akkord der alten Fassung das Cis enthält.
KOPF_REIN = KOPF.replace("#4", "4")
KOPF_REIN_AKKORDE = "I ii | V"
# Die Antwort schließt jetzt über V – I auf dem Grundton (kein Trugschluss mehr, A1 „Schlusston“).
ANTWORT_AKKORDE = "I V | I"
AMBROSE_REIN = Teil(f"{KOPF_REIN_AKKORDE} | {ANTWORT_AKKORDE}", f"{KOPF_REIN} | {ANTWORT}")
# Die vier fragenden Töne vom Dachboden, mit der ♯4 (Klangplan A1, „Schlussklang“; `abschied`).
KOPF_DACHBODEN = KOPF
KOPF_DACHBODEN_AKKORDE = "I II | II"

# Held vollständig (A1): 2 – 3 – 5 · 2 – 3 – 5 – 6 · 5 – 3 – 2 – 1, landet auf dem Grundton.
HELD_MELODIE = "2:1 3:1 5:2 | 2:1 3:1 5:1 6:1 | 5:1 3:1 2:2 | 1:4"
HELD = Teil("ii V | ii V | I V | I", HELD_MELODIE)
# Dieselbe Folge mit offenem Schluss auf der 2, damit eine Schleife weiterläuft.
HELD_OFFEN = Teil("ii V | ii V | I IV | V", "2:1 3:1 5:2 | 2:1 3:1 5:1 6:1 | 5:1 3:1 4:1 3:1 | 2:4")
# Nur Akkorde I, IV und V (Lagerfeuer, Gitarre mit zwei fehlenden Saiten).
HELD_DREI = Teil("V | V | I V | I", HELD_MELODIE)

# Victors Thema in Dur: die vier Töne in Achteln, die ♯4 über dem A-Dur-Akkord (II), dann eine
# freundliche Antwort, die auf dem Grundton landet (Klangplan 4A2, `victor.warm`).
VICTOR_KOPF = "5:0.5 3:0.5 #4:0.5 2:2.5"
VICTOR_DUR = Teil(
    "I II II II | IV IV ii V | I II II II | IV V I I",
    f"{VICTOR_KOPF} | r:2 4:1 2:1 | {VICTOR_KOPF} | 6:0.5 5:0.5 2:1 1:2",
)
# Hale (A1): Victors Töne in gleichen Vierteln, halb so schnell, warm.
HALE = "5:1 3:1 #4:1 2:1"
HALE_AKKORDE = "I I II II"

# Die eine Melodie von Ambrose und Held (A1): Ambroses reiner Kopf, vom Helden zu Ende geführt.
EINE_MELODIE = Teil("I | ii V | IV I | V I", "5:1 3:2 4:1 | 2:1 3:1 5:2 | 6:2 5:1 3:1 | 2:2 1:2")

# Mama vollständig (A1): 1 – 2 – 3 – 5 – 6 – 5 mit den Dauern aus motive.MAMA, drei Takte.
MAMA = Teil("I | I IV | I", "1:1 2:1 3:1 5:3 | 6:1.5 5:4 r:0.5")


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)
