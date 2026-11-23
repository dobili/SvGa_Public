"""PixelLab-Tiere: welcher Zustand je Art Standbild, Bewegung, Zustand und Schwimmen ist, mit Grund.

Warum: PixelLab hat viele Tiere auf den Hinterbeinen stehend erzeugt (Hinweis des Autors,
23.11.2026). Der Autor hat dann einen Zustand „auf allen vieren“ oder bei Vögeln und Fischen „in
Bewegungsrichtung gestreckt“ angelegt und die Animation an diesem Zustand erzeugt. Je Animation
gilt deshalb der Zustand, an dem sie hängt; für das Standbild wählt diese Tabelle den passendsten
Zustand je Art und Ort (aufrecht stehend ist meist falsch, Vögel am Boden stehen oder sitzen,
Schwimmer liegen im Wasser).

Felder (``Wahl``): Zustände über den Anfang ihres Namens in ``zuordnung_23-11.json`` (klein, ohne
Anführungszeichen; „idle“, „walking on“, „sitting“ …).
- ``stand``: Zustand der Standbilder (Reihe 0 des Bogens).
- ``bewegung``: Zustand mit der Animation für Gehen, Rennen oder Fliegen (Reihe 1). „wippen:<z>“:
  keine Animation, das Standbild von <z> wippt (wie die Gemini-Tiere); „wechsel:<a>:<b>“: zwei
  Haltungen im Wechsel (Frosch hüpft).
- ``zustaende``: Verhalten der Belebung → Zustand (Reihe 2: sitzen, schlafen, grasen).
- ``schwimmen``: Zustand mit Schwimmanimation (Reihen 3 und 4), sonst None.
- ``wasser``: Palette für das mitgezeichnete Wasser (pixellab_wasser.py), dort, wo die Art schwimmt.
- ``grund``: warum so (für die Tabelle der Übersichtsseite).

Saugroboter, Drohne und Waschbär kamen mit der Nachlieferung des Autors (23.11.2026,
ki-roh/selected_characters_new.zip; die neuen Gruppen stehen in der Zuordnung vorn und ersetzen
die alten).
"""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Wahl:
    """Wahl der Zustände einer Art (siehe Dateikopf)."""

    stand: str
    bewegung: str
    grund: str
    zustaende: dict[str, str] = field(default_factory=dict)
    schwimmen: str | None = None
    wasser: str = "standard"
    # Fester Maßstab, wenn Höhe und Länge von der Seite das Tier falsch messen (Grund in ``grund``).
    massstab: float | None = None


SITZ = {"sitzen": "sitting"}
VOGEL_IDLE = "Vogel steht am Boden (Idle); Fliegen ist die Animation am gestreckten Flugzustand."
VOGEL_SITZT = VOGEL_IDLE + " Verhalten „sitzen“ zeigt den Sitzzustand."
VIERBEINER = "Idle steht schon auf vier Beinen, die Animation hängt an Idle."
AUFRECHT = (
    "Idle steht aufrecht auf den Hinterbeinen: Standbild ist der Vierbeiner-Zustand, "
    "an dem auch die Animation hängt."
)
NUR_WASSER = "Lebt nur im Wasser: Standbild und Bewegung sind der Schwimmzustand (Wasser umgefärbt)."
MASCHINE = "Maschine: Idle mit Fahranimation."

WAHL: dict[str, Wahl] = {
    # Vögel
    "taube": Wahl("idle", "flying", VOGEL_IDLE),
    "spatz": Wahl("idle", "flying", VOGEL_IDLE),
    "eichelhaeher": Wahl("idle", "flying", VOGEL_IDLE),
    "kraehe": Wahl("idle", "flying", VOGEL_SITZT, SITZ),
    "moewe": Wahl("idle", "flying", VOGEL_IDLE),
    "seeschwalbe": Wahl("idle", "flying", VOGEL_IDLE),
    "geier": Wahl("idle", "flying", VOGEL_IDLE),
    "adler": Wahl("idle", "flying", VOGEL_IDLE),
    "falke": Wahl("idle", "flying", VOGEL_IDLE),
    "eisvogel": Wahl("idle", "flying", VOGEL_IDLE),
    "fasan": Wahl("idle", "flying", VOGEL_IDLE + " Läuft weg mit Auffliegen (keine Gehanimation)."),
    "roadrunner": Wahl(
        "idle", "flying", VOGEL_IDLE + " Rennt im Spiel mit den Flugbildern (keine Laufanimation)."
    ),
    "specht": Wahl("idle", "flying", VOGEL_SITZT, SITZ),
    "eule": Wahl(
        "idle",
        "flying",
        VOGEL_SITZT + " „schlafen“ zeigt die eingerollte Eule.",
        {"sitzen": "sitting", "schlafen": "sleeping"},
    ),
    "reiher": Wahl(
        "idle",
        "flying",
        "Reiher steht hoch aufgerichtet im Flachwasser (Idle); „sitzen“ zeigt den geduckten Reiher.",
        SITZ,
    ),
    "strandlaeufer": Wahl("idle", "flying", VOGEL_SITZT, SITZ),
    "fledermaus": Wahl(
        "flying", "flying", "Fledermäuse stehen nicht am Boden: auch das Standbild ist der Flugzustand."
    ),
    "huhn": Wahl("idle", "walking", "Huhn steht (Idle); Bewegung ist Gehen und Picken am eigenen Zustand."),
    "gans": Wahl(
        "idle",
        "walking",
        "Gans steht (Idle), geht und pickt (Animation am Gehzustand); keine Schwimmfassung, "
        "schwimmende Gänse behalten die Wasserlinie.",
        SITZ,
    ),
    "kormoran": Wahl("idle", "flying", VOGEL_SITZT + " Schwimmt mit eigenem Zustand.", SITZ, "swimming"),
    "pelikan": Wahl(
        "idle",
        "wippen:idle",
        "Pelikan steht am Ufer (Idle); keine Geh- oder Fluganimation, Bewegung wippt. "
        "Schwimmt mit eigenem Zustand.",
        SITZ,
        "swimming",
    ),
    "ente": Wahl(
        "idle",
        "flying",
        "Ente steht am Ufer (Idle), fliegt auf; im Wasser der Schwimmzustand.",
        {},
        "swimming",
    ),
    "schwan": Wahl(
        "idle", "flying", "Schwan steht am Ufer (Idle); im Wasser der Schwimmzustand.", {}, "swimming"
    ),
    # Kleine Säuger und Kriechtiere
    "maus": Wahl("walking on", "walking on", AUFRECHT),
    "ratte": Wahl("standing in", "standing in", AUFRECHT),
    "eichhoernchen": Wahl("standing on", "standing on", AUFRECHT),
    "praeriehund": Wahl(
        "idle",
        "walking on",
        "Präriehunde halten aufrecht Wache: Idle bleibt das Standbild, Laufen am Vierbeiner-Zustand.",
    ),
    "murmeltier": Wahl(
        "idle",
        "walking on",
        "Murmeltiere halten aufrecht Wache: Idle bleibt das Standbild, Laufen am Vierbeiner-Zustand.",
    ),
    "eidechse": Wahl(
        "standing on",
        "standing on",
        AUFRECHT + " „schlafen“ zeigt die eingerollte Eidechse.",
        {"schlafen": "sleeping"},
    ),
    "frosch": Wahl(
        "sitting",
        "wechsel:sitting:running",
        "Frosch sitzt; ohne Animation hüpft er im Wechsel von Sitzen und Sprung.",
    ),
    "krebs": Wahl("idle", "idle", "Krebs krabbelt seitwärts (Animation an Idle)."),
    "schildkroete": Wahl(
        "walking on", "walking on", AUFRECHT + " Schwimmt im Moor des Bayou.", {}, "swimming", "moor"
    ),
    "nutria": Wahl(
        "walking on", "walking on", AUFRECHT + " Schwimmt im Moor des Bayou.", {}, "swimming", "moor"
    ),
    "alligator": Wahl(
        "standing on",
        "wippen:standing on",
        AUFRECHT.replace(", an dem auch die Animation hängt", "")
        + " Keine Laufanimation (wippt); schwimmt im Moor des Bayou (auch auf der Pelikaninsel; "
        "das Moorwasser ist halb durchsichtig).",
        {},
        "swimming",
        "moor",
    ),
    # Wasser
    "robbe": Wahl(
        "idle",
        "swimming",
        "Robbe liegt an Land (Idle); im Spiel schwimmt sie immer (Schwimmzustand).",
        {},
        "swimming",
    ),
    "delfin": Wahl("swimming", "swimming", NUR_WASSER, {}, "swimming"),
    "qualle": Wahl("swimming", "swimming", NUR_WASSER, {}, "swimming"),
    "hecht": Wahl("swimming", "swimming", NUR_WASSER, {}, "swimming"),
    # Insekten
    "schmetterling": Wahl(
        "idle",
        "flying",
        "Schmetterling mit offenen Flügeln; Flugbilder nur nach Süden, "
        "die anderen Richtungen nehmen sie mit.",
    ),
    "libelle": Wahl("idle", "idle", "Libelle schwebt (Animation an Idle)."),
    # Vierbeiner
    "hund": Wahl(
        "idle", "idle", VIERBEINER + " „schlafen“ zeigt den eingerollten Hund.", {"schlafen": "sleeping"}
    ),
    "dackel": Wahl(
        "idle",
        "idle",
        VIERBEINER + " Laufbilder nur nach Osten (Westen gespiegelt, Norden und Süden von der Seite).",
    ),
    "katze": Wahl(
        "idle",
        "idle",
        VIERBEINER + " „sitzen“ und „schlafen“ mit eigenen Zuständen.",
        {"sitzen": "sitting", "schlafen": "sleeping"},
    ),
    "fuchs": Wahl("idle", "idle", VIERBEINER),
    "kojote": Wahl("idle", "idle", VIERBEINER),
    "hase": Wahl("idle", "idle", "Hase sitzt geduckt (Idle) und hoppelt (Animation an Idle)."),
    "schwein": Wahl(
        "idle",
        "idle",
        VIERBEINER + " Von zwei Animationen das Traben (das Rennen fällt weg); „schlafen“ eigener Zustand.",
        {"schlafen": "sleeping"},
    ),
    "schaf": Wahl("idle", "idle", VIERBEINER),
    "ziege": Wahl("idle", "idle", VIERBEINER, SITZ),
    "reh": Wahl("idle", "idle", VIERBEINER + " „sitzen“: das liegende Reh.", SITZ),
    "hirsch": Wahl("idle", "idle", VIERBEINER + " „sitzen“: der liegende Hirsch.", SITZ),
    "kuh": Wahl(
        "idle",
        "idle",
        VIERBEINER + " „sitzen“: die liegende Kuh, „grasen“ mit gesenktem Kopf.",
        {"sitzen": "sitting", "grasen": "grazing"},
    ),
    "pferd": Wahl("idle", "idle", VIERBEINER + " „grasen“ mit gesenktem Kopf.", {"grasen": "grazing"}),
    "pony": Wahl("idle", "idle", VIERBEINER),
    "bison": Wahl("idle", "idle", VIERBEINER),
    # Maschinen
    "lieferroboter": Wahl("idle", "idle", MASCHINE),
    "kehrroboter": Wahl("idle", "idle", MASCHINE),
    "roboterhund": Wahl("idle", "idle", "Roboterhund auf vier Beinen (Idle), Gang an Idle."),
    # Nachlieferung des Autors (23.11.2026, ki-roh/selected_characters_new.zip).
    "drohne": Wahl("idle", "idle", "Drohne schwebt (Animation an Idle, auch im Stand)."),
    "saugroboter": Wahl(
        "idle",
        "idle",
        MASCHINE + " Flacher Saugroboter mit Bürste und Licht. Fester Maßstab 0,35: Von der Seite "
        "misst er 24 × 24 px, weil die Draufsicht die Oberseite zeigt; nach der Höhe wäre er nur "
        "6 Spielpixel breit. Vorgabe des Hauptchats etwa 9–10 hoch und 14 breit neben der "
        "30-px-Figur, also gut 6 × 9 Spielpixel; 0,35 gibt gut 8 × 8 dazwischen.",
        massstab=0.35,
    ),
    "waschbaer": Wahl(
        "walking on",
        "walking on",
        "Idle steht halb aufgerichtet; Standbild ist der Vierbeiner-Zustand. Dessen Animation heißt "
        "„shifts its weight onto its hind legs“, die Bilder zeigen aber einen Gehzyklus auf vier "
        "Beinen (Beine wechseln, geprüft 23.11.2026): Bewegung.",
    ),
}
