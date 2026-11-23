"""Tabellen zum Import der PixelLab-Figuren: Standbild je Figur, Statistentypen, Altersgruppen.

Warum: Die Sammelexporte des Autors (privates Repository, ki-roh/selected_characters*.zip, Zuordnung
ki-roh/zuordnung_23-11.json) haben je Figur einen oder mehrere Zustände. Bei vielen hielt der erste
Zustand (Idle) einen Gegenstand, der in der Laufanimation in der Luft hing; dann hat der Autor einen
Hilfszustand ohne Gegenstand gemacht und dort laufen lassen (Auftrag des Haupt-Chats, 23.11.2026).
Welches Bild die Figur im Stehen zeigt, entscheidet diese Tabelle je Figur, mit Grund. Dazu die
Zuordnung der 40 alten Statistenbögen (statist-01 … statist-40) zu den 16 neuen Statistentypen und
die Altersgruppe je Figur für die Zielhöhe (pixellabhoehen.py).

Rolle im Gesamtbild: Daten für pipeline/abenteuer/pixellabimport.py und pixellabhoehen.py.
"""

# Standbild: Figur → (Anfang des Zustandsnamens im Export, höchstens 20 Zeichen, Grund). Ohne
# Eintrag gilt der Zustand, an dem die Laufanimation hängt (beim Losgehen wechselt nur die Bewegung).
STANDBILD: dict[str, tuple[str, str]] = {
    "abe": (
        "Idle",
        "Abe steht an der Sternwarte mit seinem Teleskop; er geht kaum. Beim Gehen ist es weg, das "
        "fällt bei den wenigen Schritten weniger auf als ein Abe ohne Teleskop.",
    ),
    "blaeser": (
        "Idle",
        "Der Bläser steht und spielt die Posaune; er geht nur selten (Musikhaus, Straße).",
    ),
    "statist.musik": (
        "Instrument on his",
        "Statisten laufen umher; mit dem Instrument auf dem Rücken bleibt das Bild beim Losgehen gleich.",
    ),
    "celeste": ("With the skateboard", "Nur dieser Zustand; Céleste trägt das Brett unter dem Arm."),
    "empfangsroboter": (
        "Without the shadow",
        "Der Roboter rollt; der Zustand ohne Schatten passt zu allen Figuren (Schatten entfernt).",
    ),
}

# Zweite Figur aus einem weiteren Zustand derselben Gruppe: neuer Name ← (Gruppe, Zustandsanfang).
# Victoria im Pullover (Prompt „unsure … moss green knitted sweater“) wie victor-pullover.
ZWEITFIGUR: dict[str, tuple[str, str]] = {
    "victoria-pullover": ("victoria", "15 year old girl"),
}

# Zustände außer Stehen und Laufen: Wortanfang im Namen → Ordner unter zustaende/
# (figurenzustaende.mjs). Die Namen der Zustandsordner im Export sind nach 20 Zeichen abgeschnitten
# („Sitting on an invisi“, „New State: sitting d“), darum zählen kurze Anfänge.
ZUSTANDSORDNER: tuple[tuple[str, str], ...] = (
    ("sitting on", "sitzstuhl"),
    ("chair", "sitzstuhl"),
    ("cross", "sitzboden"),
    ("sitting d", "sitzboden"),
    ("sleep", "schlaf"),
    ("lying", "schlaf"),
)

# Alte Statistenbögen → neuer Typ. 01–08 waren Kinder, 09–16 Ältere, 17–40 Erwachsene
# (belebungsbilder.py). Kinder abwechselnd Mädchen und Junge, Ältere abwechselnd Rentnerin und
# Rentner. Erwachsene nach dem Ort, an dem sie stehen (Szenen), sonst reihum im Alltag.
_ERWACHSENE_REIHUM = ("studentin", "anzug", "service", "wanderer", "fahrer", "arbeiter")
_ERWACHSENE_ORT = {
    # Ironwood, Kantine (Werk): Arbeiterinnen und Arbeiter.
    21: "arbeiter",
    25: "arbeiter",
    27: "arbeiter",
    29: "arbeiter",
    31: "arbeiter",
    33: "arbeiter",
    # Diner-Hinterzimmer am Weg nach Summit City: Fernfahrer.
    19: "fahrer",
    24: "fahrer",
    # Weg Riverton–Ironwood: Wandernde.
    20: "wanderer",
    26: "wanderer",
    32: "wanderer",
    35: "wanderer",
    # Clubraum Maple Falls: Herr im Anzug (Turnierbesuch).
    18: "anzug",
    # Wegsperre (32_Wegsperren.md): Imani, Benji, Zoe sind Jugendliche.
    22: "jugend",
    23: "jugend",
    36: "jugend",
}
KINDER_BIS = 8
AELTERE_BIS = 16
STATISTEN = 40


def statistentyp(nummer: int) -> str:
    """Neuer Statistentyp (Ordnername) zu einem alten Statistenbogen. Beispiel: 7 → „statist.kindA“."""
    if nummer <= KINDER_BIS:
        return "statist.kindA" if nummer % 2 else "statist.kindB"
    if nummer <= AELTERE_BIS:
        return "statist.rentnerin" if nummer % 2 else "statist.rentner"
    typ = _ERWACHSENE_ORT.get(nummer, _ERWACHSENE_REIHUM[nummer % len(_ERWACHSENE_REIHUM)])
    return f"statist.{typ}"


# Altersgruppe von Hand, wo der Prompt kein Alter nennt (sonst pixellabhoehen.altersgruppe).
ALTER_VON_HAND: dict[str, str] = {
    "empfangsroboter": "keine",
}
