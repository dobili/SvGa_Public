"""Die erweiterte Besetzung für die Musik des Spiels: Streicher, Bläser, Stabspiele, Mundharmonika.

Warum: Die Hörproben kamen mit Klavier, Cembalo, Glockenspiel, Harfe und Cello aus. Die Ortsmusik
des Klangplans (``docs/spiel/21_Klangplan.md``) braucht zwei bis vier Instrumente je Ort, darunter
gezupften Kontrabass, Streicher, Horn, Trompete, Klarinette, Mundharmonika und Vibraphon. Alle stammen
aus denselben zwei CC0-Bibliotheken wie die Hörproben (``instrumente.py``, Dateikopf). Gitarren,
E-Bass, Ukulele, Orgel und das alte Klavier kommen als Klangfonts von FreePats (``klangfonts.py``),
Schlagwerk ohne Tonhöhe aus ``schlagwerk.py``.

``versatz`` wurde am 14.11.2026 mit ``python -m pipeline.abenteuer.ton.kalibrieren`` gemessen
(Grundfrequenz je Probe, Mittel über drei Töne). Sonderfall: Ein ``versatz`` von None heißt
„noch nicht gemessen“; ``proben`` wirft dann einen Fehler.
"""

from pipeline.abenteuer.ton.instrumente import VCSL, VSCO, Instrument

# Teile der Namensmuster: Ton mit Vorzeichen und Oktave; Anschlagstufe als Ziffer oder Wort.
TON = r"(?P<ton>[A-G]#?)(?P<oktave>-?\d)"
STUFE_ZIFFER = r"(?P<schicht>\d)"
STUFE_WORT = r"(?P<schicht>[a-z]+)"

ORCHESTER = {
    "kontrabass_pizz": Instrument(
        VSCO,
        "Strings/Solo Contrabass/Pizz",
        rf"_Pizz_{TON}_v{STUFE_ZIFFER}_rr1",
        2,
        0.15,
        "Kontrabass, gezupft",
    ),
    "kontrabass": Instrument(
        VSCO,
        "Strings/Solo Contrabass/SusNV",
        rf"_SusNV_{TON}_v{STUFE_ZIFFER}_rr1",
        2,
        0.3,
        "Kontrabass, gestrichen",
    ),
    "violinen": Instrument(
        VSCO,
        "Strings/Violin Section/susVib",
        rf"_susVib_{TON}_v{STUFE_ZIFFER}",
        2,
        0.5,
        "Violinen (Gruppe), gestrichen",
    ),
    "violinen_pizz": Instrument(
        VSCO,
        "Strings/Violin Section/Pizz",
        rf"_Pizz_{TON}_v{STUFE_ZIFFER}_rr1",
        2,
        0.2,
        "Violinen (Gruppe), gezupft",
    ),
    "bratschen": Instrument(
        VSCO,
        "Strings/Viola Section/susvib",
        rf"_susvib_{TON}_v{STUFE_ZIFFER}_1",
        2,
        0.5,
        "Bratschen (Gruppe), gestrichen",
    ),
    "geige": Instrument(
        VSCO,
        "Strings/Solo Violin/Arco Vib",
        rf"_ArcoVib_{TON}_{STUFE_WORT}\.wav",
        1,
        0.35,
        "Geige allein (auch als Fiedel)",
    ),
    "horn": Instrument(
        VSCO,
        "Brass/F Horn/sus",
        rf"_sus_{TON}_v{STUFE_ZIFFER}_1",
        2,
        0.4,
        "Waldhorn",
    ),
    "trompete": Instrument(
        VSCO,
        "Brass/Trumpet/sus",
        rf"_sus_{TON}_v{STUFE_ZIFFER}_rr1",
        2,
        0.25,
        "Trompete",
    ),
    "trompete_gedaempft": Instrument(
        VSCO,
        "Brass/Trumpet/straightM-sus",
        rf"_straightM-sus_{TON}_v{STUFE_ZIFFER}_rr1",
        2,
        0.25,
        "Trompete mit Dämpfer",
    ),
    "posaune": Instrument(
        VSCO,
        "Brass/Tenor Trombone/sus",
        rf"_sus_{TON}_v{STUFE_ZIFFER}_1",
        2,
        0.3,
        "Posaune",
    ),
    "tuba": Instrument(
        VSCO,
        "Brass/Tuba/sus",
        rf"_sus_{TON}_v{STUFE_ZIFFER}_rr1_Mid",
        2,
        0.3,
        "Tuba",
    ),
    "klarinette": Instrument(
        VSCO,
        "Woodwinds/Clarinet/susLong",
        rf"_susLong_{TON}_v{STUFE_ZIFFER}_rr1_sum",
        2,
        0.25,
        "Klarinette",
    ),
    "floete": Instrument(
        VSCO,
        "Woodwinds/Flute/susNV",
        rf"_susNV_{TON}_v{STUFE_ZIFFER}_1",
        2,
        0.25,
        "Querflöte",
    ),
    "oboe": Instrument(
        VSCO,
        "Woodwinds/Oboe/Sus",
        rf"_Sus_{TON}_v{STUFE_ZIFFER}_Main",
        2,
        0.25,
        "Oboe",
    ),
    "fagott": Instrument(
        VSCO,
        "Woodwinds/Bassoon/sus",
        rf"PSBassoon_{TON}_v{STUFE_ZIFFER}_1",
        2,
        0.25,
        "Fagott",
    ),
    "marimba": Instrument(
        VCSL,
        "Idiophones/Struck Idiophones/Marimba",
        rf"_Outrigger_{TON}_{STUFE_WORT}_01",
        2,
        0.6,
        "Marimba",
    ),
    "vibraphon": Instrument(
        VCSL,
        "Idiophones/Struck Idiophones/Vibraphone/Soft Mallets",
        rf"Vibes_soft_{TON}_v{STUFE_ZIFFER}_rr1",
        2,
        1.2,
        "Vibraphon, weiche Schlägel",
    ),
    "roehrenglocken": Instrument(
        VCSL,
        "Idiophones/Struck Idiophones/Tubular Bells 1",
        rf"chimes_{TON}_{STUFE_WORT}_rr1",
        2,
        2.5,
        "Röhrenglocken (auch als Turmuhr)",
    ),
    "glasharfe": Instrument(
        VCSL,
        "Idiophones/Friction Idiophones/Wine Glasses/Sustains/Slow",
        rf"glass\d_{TON}_Slow",
        2,
        1.0,
        "Gläser, gestrichen (Glasharfe)",
    ),
    "saxophon": Instrument(
        VCSL,
        "Aerophones/Reed Aerophones/Tenor Saxophone/Non-Vibrato",
        rf"_NV_Main_{TON}_vl{STUFE_ZIFFER}_rr1",
        2,
        0.25,
        "Tenorsaxofon",
    ),
    "mundharmonika": Instrument(
        VCSL,
        "Aerophones/Free Aerophones/Harmonica-Hohner-Special20-C/Sustains/Normal",
        rf"_Normal_{TON}\.wav",
        2,
        0.2,
        "Mundharmonika (Hohner Special 20)",
    ),
    "strumstick": Instrument(
        VCSL,
        "Chordophones/Composite Chordophones/Strumstick/Finger",
        rf"_Str\d_Main_{TON}_vl{STUFE_ZIFFER}_rr1",
        2,
        0.3,
        "Strumstick, gezupft (statt Banjo)",
    ),
    "orgel": Instrument(
        VCSL,
        "Aerophones/Edge-blown Aerophones/Pipe Organ/Quiet",
        rf"_Man3Quiet_{TON}_rr1",
        2,
        0.6,
        "Pfeifenorgel, leises Register",
    ),
}
