"""Tierplan, Daten: jede Tierart der Belebung mit echter Größe, PixelLab-Typ, Bewegung und Motiv.

Warum: Der Autor hat alle Figuren in PixelLab im Stil von Coach Delgado neu gemacht und fragt, ob
die Tiere folgen sollen (21.11.2026). Heute zeigen viele Tiere einen Ersatz (Falke als Krähe) oder
gar nichts (Eidechse). Diese Tabelle ist die eine Quelle für tierplan.py: welche Art ein
Belebungsname meint, wie groß das Tier wirklich ist (für die Zielhöhe neben den Figuren), welcher
PixelLab-Typ passt und welches Motiv der Prompt beschreibt.

Felder je Art (``Art``): ``hoehe`` und ``laenge`` in Metern (Scheitel im Stehen, Körperlänge),
``typ`` „quadruped“ oder „custom“ (PixelLab „Create from Text“), ``bewegung`` (laufen, flitzen,
fliegen, schwimmen, krabbeln, fahren), ``motiv`` (englisch, für den Prompt), ``limezu`` (Name in
tierarten.json, wenn das heutige Bild genau diese Art zeigt, sonst None), ``ink`` (Muster für die
Fundstellen in den Dialogen).
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Art:
    """Eine Tierart des Spiels (siehe Dateikopf)."""

    name: str
    hoehe: float
    laenge: float
    typ: str
    bewegung: str
    motiv: str
    limezu: str | None = None
    ink: str = ""


Q, C = "quadruped", "custom"

ARTEN: dict[str, Art] = {
    a.name: a
    for a in [
        # Heute mit eigenem, richtigem Bild (LimeZu, Gemini oder eigene Zeichnung).
        Art("kraehe", 0.4, 0.45, C, "fliegen", "black crow", "kraehe", r"Krähe|Rabe"),
        Art("hund", 0.7, 0.9, Q, "laufen", "friendly brown labrador dog", "hund", r"\bHund"),
        Art("ente", 0.45, 0.5, C, "schwimmen", "mallard duck with green head", "ente", r"\bEnte"),
        Art("hase", 0.35, 0.4, Q, "flitzen", "brown wild rabbit", "hase", r"\bHase|Kaninchen"),
        Art("katze", 0.4, 0.5, Q, "laufen", "tabby cat", "katze", r"Katze|Kater\b"),
        Art("taube", 0.3, 0.3, C, "fliegen", "grey city pigeon", "taube", r"Taube"),
        Art("moewe", 0.45, 0.45, C, "fliegen", "white seagull", "moewe", r"Möwe"),
        Art("reiher", 1.2, 0.9, C, "fliegen", "great blue heron", "reiher", r"Reiher"),
        Art("reh", 1.2, 1.2, Q, "laufen", "roe deer", "reh", r"\bReh\b"),
        Art("huhn", 0.45, 0.45, C, "laufen", "brown hen", "huhn", r"Huhn|Hühner"),
        Art("kojote", 0.75, 1.1, Q, "laufen", "lean coyote", "kojote", r"Kojote"),
        Art("kuh", 1.6, 2.2, Q, "laufen", "black and white dairy cow", "kuh", r"\bKuh|Kühe|Rinder"),
        Art("pferd", 2.1, 2.2, Q, "laufen", "brown horse", "pferd", r"Pferd"),
        Art("drohne", 0.2, 0.4, C, "fliegen", "small quadcopter drone", "drohne", r"Drohne"),
        Art("lieferroboter", 0.9, 0.7, C, "fahren", "six-wheeled delivery robot", "lieferroboter"),
        Art("kehrroboter", 1.2, 1.4, C, "fahren", "street sweeper robot", "kehrroboter"),
        Art("gans", 0.8, 0.8, C, "laufen", "white goose", "gans", r"\bGans|Gänse"),
        Art("schaf", 1.0, 1.3, Q, "laufen", "fluffy white sheep", "schaf", r"\bSchaf"),
        Art("ziege", 1.1, 1.3, Q, "laufen", "brown goat with small horns", "ziege", r"Ziege"),
        Art("fuchs", 0.5, 1.0, Q, "flitzen", "red fox", "fuchs", r"Fuchs"),
        Art("bison", 1.9, 3.0, Q, "laufen", "american bison", "bison", r"Bison"),
        Art("hirsch", 2.0, 2.0, Q, "laufen", "red deer stag with antlers", "hirsch", r"Hirsch|Wapiti"),
        Art("schwein", 0.9, 1.4, Q, "laufen", "pink pig", "schwein", r"Schwein"),
        # Heute Ersatz oder nichts: neu in PixelLab.
        Art(
            "eichhoernchen",
            0.22,
            0.4,
            Q,
            "flitzen",
            "red squirrel with bushy tail",
            None,
            r"Eichhörnchen|Streifenhörnchen",
        ),
        Art("eidechse", 0.06, 0.25, Q, "flitzen", "desert lizard", None, r"Eidechse|Echse"),
        Art("ratte", 0.1, 0.3, Q, "flitzen", "grey rat with long tail", None, r"\bRatte"),
        Art("geier", 0.65, 0.7, C, "fliegen", "turkey vulture with bald red head", None, r"Geier"),
        Art("spatz", 0.14, 0.15, C, "fliegen", "small brown sparrow", None, r"Spatz|Lerche|Amsel"),
        Art("falke", 0.4, 0.45, C, "fliegen", "peregrine falcon", None, r"Falke"),
        Art("roadrunner", 0.45, 0.55, C, "flitzen", "roadrunner bird with crest", None, r"Roadrunner"),
        Art("specht", 0.22, 0.25, C, "fliegen", "woodpecker with red cap", None, r"Specht"),
        Art("fledermaus", 0.1, 0.3, C, "fliegen", "small brown bat", None, r"Fledermä?us"),
        Art("eule", 0.45, 0.4, C, "fliegen", "brown horned owl", None, r"\bEule"),
        Art("praeriehund", 0.35, 0.35, Q, "flitzen", "prairie dog", None, r"Präriehund"),
        Art("libelle", 0.05, 0.08, C, "fliegen", "blue dragonfly", None, r"Libelle"),
        Art("murmeltier", 0.45, 0.5, Q, "flitzen", "chubby marmot", None, r"Murmeltier"),
        Art("adler", 0.85, 0.9, C, "fliegen", "bald eagle", None, r"Adler"),
        Art("pelikan", 1.2, 1.4, C, "schwimmen", "brown pelican", None, r"Pelikan|Bishop"),
        Art("eichelhaeher", 0.3, 0.35, C, "fliegen", "blue jay", None, r"Eichelhäher"),
        Art("maus", 0.06, 0.1, Q, "flitzen", "tiny grey mouse", None, r"\bMaus\b|Mäuse"),
        Art("kormoran", 0.8, 0.8, C, "schwimmen", "black cormorant", None, r"Kormoran"),
        Art("robbe", 0.5, 1.6, C, "schwimmen", "grey harbor seal", None, r"Robbe|Seehund"),
        Art("alligator", 0.4, 3.0, Q, "schwimmen", "green alligator", None, r"Alligator"),
        Art("schmetterling", 0.05, 0.06, C, "fliegen", "orange butterfly", None, r"Schmetterling|Falter"),
        Art("krebs", 0.08, 0.15, C, "krabbeln", "red crab", None, r"Krebs|Krabbe"),
        Art("delfin", 0.6, 2.5, C, "schwimmen", "bottlenose dolphin", None, r"Delfin\b|Delfine\b"),
        Art("qualle", 0.3, 0.3, C, "schwimmen", "translucent jellyfish", None, r"Qualle"),
        Art("frosch", 0.08, 0.1, C, "flitzen", "green frog", None, r"Frosch|Frösche"),
        Art("schildkroete", 0.12, 0.3, Q, "schwimmen", "turtle", None, r"Schildkröte"),
        Art("nutria", 0.3, 0.6, Q, "schwimmen", "brown nutria", None, r"Nutria|Bisam"),
        Art("hecht", 0.15, 0.8, C, "schwimmen", "green pike fish", None, r"Hecht"),
        Art("schwan", 1.2, 1.3, C, "schwimmen", "white mute swan", None, r"Schwan"),
        Art("waschbaer", 0.4, 0.7, Q, "laufen", "raccoon with masked face", None, r"Waschbär"),
        Art("eisvogel", 0.16, 0.16, C, "fliegen", "kingfisher, bright blue and orange", None, r"Eisvogel"),
        Art("roboterhund", 0.55, 0.7, Q, "laufen", "robot dog, white plastic shell", None, r"Roboterhund"),
        Art("saugroboter", 0.1, 0.35, C, "fahren", "round robot vacuum cleaner", None, r"Saugroboter"),
        Art("fasan", 0.5, 0.8, C, "laufen", "ring-necked pheasant", None, r"Fasan"),
        Art("dackel", 0.3, 0.6, Q, "laufen", "brown dachshund", None, r"Dackel"),
        Art("pony", 1.3, 1.6, Q, "laufen", "small shetland pony", None, r"\bPony"),
        Art(
            "strandlaeufer",
            0.25,
            0.3,
            C,
            "flitzen",
            "oystercatcher shorebird",
            None,
            r"Strandläufer|Austernfischer",
        ),
        Art("seeschwalbe", 0.3, 0.35, C, "fliegen", "tern seabird", None, r"Seeschwalbe"),
    ]
}

# Belebungsname (Wortstamm, längster gewinnt) → Art. Wind, Nebel und Staubteufel sind keine Tiere.
STAEMME: dict[str, str] = {
    **{a: a for a in ARTEN},
    "kraehen": "kraehe",
    "rabe": "kraehe",
    "kaninchen": "hase",
    "hoernchen": "eichhoernchen",
    "katze": "katze",
    "kuehe": "kuh",
    "rind": "kuh",
    "huehner": "huhn",
    "gaense": "gans",
    "schafe": "schaf",
    "schafherde": "schaf",
    "ziegen": "ziege",
    "wildpferde": "pferd",
    "bisons": "bison",
    "bisonherde": "bison",
    "wapiti": "hirsch",
    "echse": "eidechse",
    "ratten": "ratte",
    "bisamratte": "nutria",
    "spatzen": "spatz",
    "lerchen": "spatz",
    "amseln": "spatz",
    "fledermaeuse": "fledermaus",
    "libellen": "libelle",
    "murmeltiere": "murmeltier",
    "praeriehunde": "praeriehund",
    "seeadler": "adler",
    "pelikane": "pelikan",
    "bishop": "pelikan",
    "schmetterlinge": "schmetterling",
    "nachtfalter": "schmetterling",
    "krebse": "krebs",
    "krabben": "krebs",
    "quallen": "qualle",
    "staubsaugerroboter": "saugroboter",
    "austernfischer": "strandlaeufer",
    "seeschwalben": "seeschwalbe",
    "taube": "taube",
    "tauben": "taube",
    "moewen": "moewe",
    "enten": "ente",
    "drohne": "drohne",
}
KEINE_TIERE = ("wind", "nebel", "staubteufel")

# Tiere mit Rolle in der Geschichte (Ink geprüft am 21.11.2026); die übrigen Ink-Treffer sind
# Zufall (Kosename „Spatz“, Adler auf einem Programmheft, Schmetterling auf einer Klingel).
GESCHICHTE: dict[str, str] = {
    "falke": "Kira erklärt Falke und Bison; über den Felstürmen der Hochebene kreist immer einer",
    "murmeltier": "Summit City: Mama „Murmeltiere. Die warnen sich.“, eins pfeift am Drachenbrunnen",
    "alligator": "Bayou: „Der Alligator dort heißt Bernard. Er spielt nicht mit.“",
    "pelikan": "Pelikaninsel: Pelikan Bishop; die Pelikane schauen zum Leuchtfeuer",
    "delfin": "Weg Silicon–Delacroix: eigener Moment mit Klang (angesehenDelfin)",
    "eidechse": "Weg Delacroix–Desert: Eidechse in der Sonne und ihre Haut im Erzähltext",
    "libelle": "Weg Riverton–Ironwood: Libellen über dem Schilf an der Bank",
    "specht": "Pinewood Camp: „Über euch arbeitet ein Specht.“",
}
