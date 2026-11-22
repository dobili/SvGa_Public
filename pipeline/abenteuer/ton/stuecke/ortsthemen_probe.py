"""Probestück einprägsame Ortsthemen (Klangplan A0, Wunsch des Autors, 22.11.2026).

Warum: Der Autor wünscht sich Ortsmelodien wie in den Rollenspielen seiner Kindheit: einfach,
einprägsam, zur Atmosphäre passend, ohne auf Dauer zu nerven. Dieses Probestück zeigt den Weg an
zwei Orten, bevor alle umgestellt werden. Es steht nicht in ``stuecke.alle()`` und ersetzt nichts;
gebaut wird es von ``pipeline/abenteuer/ton/ortsthemenprobe.py`` in den Hörprobenordner.

Bauregeln (A0): Kopf von zwei Takten mit 4 bis 7 Tönen, Umfang höchstens eine Oktave, erst steigend,
dann fallend, ein kennzeichnender Sprung. Form A (Kopf, Kopf variiert, Halbschluss), A' (Ganzschluss),
B (Kontrast, die Melodie schweigt, eine Gegenstimme in tieferer Lage), A' offen über die Dominante
zurück zum Anfang. 16 Takte.

- **Maple Falls, G-Dur, 96:** Kopf G A H D | G' E D. Mamas Kopf (1 – 2 – 3 – 5, Leitmotiv A1) steigt,
  dann der Quartsprung D–G' als Kennzeichen, punktiert, und fallend zurück auf D. Flöte singt,
  Gitarre zupft, Bass gezupft; im B-Teil schweigt die Flöte und das Cello antwortet tief.
- **Clubkampf Akt 1, e-Moll, 132:** derselbe Kopf in Moll, in Achteln geschärft, treibender Bass.
- **Cedar Creek, d-Moll, 66:** Kopf D F E G | A A F. Die Umkehrung von Ambroses Kopf (1 – 3 – 2 – 4 – 5,
  A1), dann eine Tonwiederholung auf der Quinte als Kennzeichen. Klavier allein, die Turmuhr als
  Puls, kein Schlagwerk sonst.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil

MELODIE_OKTAVE = 1


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


# ---------------------------------------------------------------- Maple Falls

MAPLE_KOPF = "1:1 2:1 3:1 5:1 | 1':3/2 6:1/2 5:2"
MAPLE_A = Teil("I | IV | I | IV V", f"{MAPLE_KOPF} | 1:1 2:1 3:1 5:1 | 6:3/2 5:1/2 2:2")
MAPLE_A2 = Teil("I | IV | ii V | I", f"{MAPLE_KOPF} | 6:1 5:1 3:1 2:1 | 1:4")
MAPLE_A_OFFEN = Teil("I | IV | ii | V", f"{MAPLE_KOPF} | 6:1 5:1 3:1 2:1 | 2:4")
# B: Die Flöte schweigt; das Cello antwortet eine Oktave tiefer, endet auf der Dominante.
MAPLE_B = Teil(
    "vi | IV | I | V | vi | IV | ii | V7",
    linien={"gegen": "3:2 2:1 1:1 | 6,:4 | 1:2 3:2 | 2:4 | 3:2 2:1 1:1 | 6,:2 1:2 | 2:3 3:1 | 2:2 5,:2"},
)
MAPLE_TEILE = {"a": MAPLE_A, "a2": MAPLE_A2, "b": MAPLE_B, "a3": MAPLE_A_OFFEN}
MAPLE_FORM = ("a", "a2", "b", "a3")
MELODIE_TEILE = nur("a", "a2", "a3")


def _maple(kennung: str, titel: str, tempo: float, stimmen: tuple[Stimme, ...], text: str) -> Satz:
    """Eine Fassung von Maple Falls: dieselben Teile und Form, andere Besetzung und Tempo."""
    return Satz(kennung, titel, "G", tempo, 4, MAPLE_TEILE, MAPLE_FORM, stimmen, beschreibung=text)


MAPLE = _maple(
    "probe.mapleFalls",
    "Maple Falls (neu)",
    96,
    (
        Stimme("floete", "melodie", 0.8, 0.15, 0.3, MELODIE_OKTAVE, 60, MELODIE_TEILE),
        Stimme("gitarre", "zupfen", 0.75, -0.3, 0.25, staerke=50),
        Stimme("kontrabass_pizz", "bass_grund", 0.6, 0.0, 0.2, 1, 52),
        Stimme("cello", "noten", 0.7, 0.1, 0.3, 1, 58, nur("b"), "gegen"),
    ),
    "Der Kopf singt die Flöte über Gitarre und Bass; im B-Teil antwortet das Cello tief.",
)

MAPLE_WEG = _maple(
    "probe.mapleFalls.weg",
    "Maple Falls, Weg (neu)",
    112,
    (
        Stimme("klarinette", "melodie", 0.75, 0.15, 0.25, MELODIE_OKTAVE, 60, MELODIE_TEILE),
        Stimme("gitarre", "schlagen", 0.6, -0.3, 0.2, staerke=48),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.65, 0.0, 0.15, 1, 54),
        Stimme("schlagwerk", "schellen", 0.25, 0.35, 0.2, staerke=40),
        Stimme("cello", "noten", 0.65, 0.1, 0.25, 1, 56, nur("b"), "gegen"),
    ),
    "Unterwegs: schneller, Gitarre geschlagen, Klarinette, leise Schellen.",
)

MAPLE_WOHNZIMMER = _maple(
    "probe.mapleFalls.wohnzimmer",
    "Maple Falls, Wohnzimmer (neu)",
    84,
    (
        Stimme("klavier", "melodie", 0.6, 0.1, 0.3, MELODIE_OKTAVE, 46, MELODIE_TEILE),
        Stimme("klavier", "wiegen", 0.5, -0.1, 0.3, -1, 36),
        Stimme("klavier", "noten", 0.5, -0.05, 0.3, 1, 42, nur("b"), "gegen"),
    ),
    "Innen: dieselbe Melodie, nur Klavier, leise und dünn.",
)

MAPLE_NACHT = _maple(
    "probe.mapleFalls.nacht",
    "Maple Falls, Nacht (neu)",
    72,
    (
        Stimme("vibraphon", "melodie", 0.55, 0.15, 0.45, MELODIE_OKTAVE, 44, MELODIE_TEILE),
        Stimme("harfe", "harfe", 0.5, -0.2, 0.45, staerke=38),
        Stimme("cello", "noten", 0.45, 0.0, 0.4, 1, 42, nur("b"), "gegen"),
    ),
    "Nacht: langsamer, Vibraphon über Harfe, viel Raum.",
)

MAPLE_DUENN = _maple(
    "probe.mapleFalls.duenn",
    "Maple Falls, ausgedünnt (neu)",
    96,
    (
        Stimme("gitarre", "zupfen", 0.7, -0.3, 0.25, staerke=46),
        Stimme("kontrabass_pizz", "bass_grund", 0.55, 0.0, 0.2, 1, 48),
    ),
    "Nach zwei bis drei Durchläufen: nur Begleitung und Bass, die Melodie ruht (A0, Regel 3).",
)

# Probe „trägt der Kopf allein?“: nur die Flöte, A und A' ohne jede Begleitung.
MAPLE_ALLEIN = Satz(
    "probe.mapleFalls.allein",
    "Maple Falls, Kopf ohne Begleitung",
    "G",
    96,
    4,
    {"a": MAPLE_A, "a2": MAPLE_A2},
    ("a", "a2"),
    (Stimme("floete", "melodie", 0.85, 0.0, 0.3, MELODIE_OKTAVE, 62),),
    schleife=False,
    beschreibung="Nur die Melodie, ohne Begleitung: trägt sie allein?",
)

# ---------------------------------------------------------------- Clubkampf Akt 1

# Derselbe Kopf in e-Moll, in Achteln geschärft: E Fis G H | E' C H.
KAMPF_KOPF = "1:1/2 2:1/2 3:1/2 5:1/2 5:1 r:1 | 1':3/4 6:1/4 5:1 r:1/2 5:1/2 5:1"
KAMPF_A = Teil("i | VI | i | VI V", f"{KAMPF_KOPF} | 1:1/2 2:1/2 3:1/2 5:1/2 6:1 5:1 | 2:2 #7,:2")
KAMPF_A2 = Teil("i | VI | iv V | i", f"{KAMPF_KOPF} | 6:1/2 5:1/2 3:1/2 2:1/2 #7,:2 | 1:4")
KAMPF_B = Teil(
    "VI | VII | III | VI | iv | i | iv | V",
    linien={
        "gegen": "3:1 3:1 2:1 1:1 | 2:2 7,:2 | 3:1 3:1 5:1 3:1 | 1:4 | 6,:2 1:2 | 3:2 1:2 | 4:2 6,:2 | #7,:4"
    },
)
KAMPF_OFFEN = Teil("i | VI | iv | V", f"{KAMPF_KOPF} | 6:1/2 5:1/2 3:1/2 2:1/2 2:2 | #7,:4")

CLUBKAMPF = Satz(
    "probe.mapleFalls.clubkampf",
    "Clubkampf Akt 1 (neu)",
    "e",
    132,
    4,
    {"a": KAMPF_A, "a2": KAMPF_A2, "b": KAMPF_B, "a3": KAMPF_OFFEN},
    ("a", "a2", "b", "a3"),
    (
        Stimme("violinen", "melodie", 0.75, 0.15, 0.2, MELODIE_OKTAVE, 70, nur("a", "a2", "a3")),
        Stimme("kontrabass_pizz", "bass_laufend", 0.85, 0.0, 0.1, 1, 70),
        Stimme("klavier", "stoss", 0.55, -0.2, 0.15, staerke=58),
        Stimme("schlagwerk", "schlagzeug", 0.4, 0.2, 0.1, staerke=56),
        Stimme("cello", "noten", 0.75, 0.1, 0.2, 1, 66, nur("b"), "gegen"),
    ),
    beschreibung="Partie: der Kopf von Maple Falls in Moll, geschärft, treibender Bass, 132.",
)

# ---------------------------------------------------------------- Cedar Creek

CEDAR_KOPF = "1:1 3:1 2:1 4:1 | 5:1 5:1 3:2"
CEDAR_A = Teil("i | i | iv | V", f"{CEDAR_KOPF} | 1:1 3:1 2:1 4:1 | 6:1 5:1 2:2")
CEDAR_A2 = Teil("i | i | iv V | i", f"{CEDAR_KOPF} | 4:1 3:1 2:1 #7,:1 | 1:4")
CEDAR_A_OFFEN = Teil("i | i | iv | V", f"{CEDAR_KOPF} | 4:1 3:1 2:1 #7,:1 | 2:4")
# B: Die rechte Hand schweigt; die linke Hand singt eine tiefe Antwort, endet auf der Dominante.
CEDAR_B = Teil(
    "VI | III | iv | V | VI | III | iv | V",
    linien={"gegen": "3:2 2:2 | 1:2 7,:2 | 1:2 3:2 | 2:4 | 6,:2 1:2 | 3:2 1:2 | 2:3 3:1 | #7,:4"},
)

CEDAR = Satz(
    "probe.cedarCreek",
    "Cedar Creek (neu)",
    "d",
    66,
    4,
    {"a": CEDAR_A, "a2": CEDAR_A2, "b": CEDAR_B, "a3": CEDAR_A_OFFEN},
    ("a", "a2", "b", "a3"),
    (
        Stimme("klavier", "melodie", 0.8, 0.1, 0.35, MELODIE_OKTAVE, 54, nur("a", "a2", "a3")),
        Stimme("klavier", "wiegen", 0.6, -0.1, 0.35, -1, 36),
        Stimme("klavier", "noten", 0.7, -0.05, 0.35, 0, 50, nur("b"), "gegen"),
        Stimme("schlagwerk", "uhr", 0.35, -0.35, 0.3, staerke=50),
    ),
    beschreibung="Still und einprägsam: Klavier allein, die Turmuhr als Puls, kein Schlagwerk sonst.",
)

STUECKE = (MAPLE, MAPLE_ALLEIN, MAPLE_WEG, MAPLE_WOHNZIMMER, MAPLE_NACHT, MAPLE_DUENN, CLUBKAMPF, CEDAR)
# Vergleich: neue Probe → bisheriges Stück im privaten Repository (spiel/musik/).
ALT = {
    "probe.mapleFalls": "maple-falls.m4a",
    "probe.mapleFalls.wohnzimmer": "maple-falls.lernen.m4a",
    "probe.mapleFalls.clubkampf": "maple-falls.clubkampf.m4a",
    "probe.cedarCreek": "cedar-creek.m4a",
}
