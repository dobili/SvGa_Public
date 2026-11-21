"""Figurstil, Teil 4: der Neubau-Plan als Seite (HTML) und als Text (Markdown), 21.11.2026.

Warum: Der Autor liest den Plan am Handy; der Hauptchat übernimmt Teile in docs/AUFGABEN_AUTOR.md.
Beide Fassungen entstehen aus denselben Blöcken (Überschrift, Absätze, Tabellen), damit sie nicht
auseinanderlaufen. Gerufen von figurstil_plan.py. Abhängigkeiten: figurstil_bedarf.py.
"""

import html as htmltext

from pipeline.abenteuer import figurstil_bedarf as bedarf

COACH_MERKMALE = (
    "Großer runder Kopf (Kopfanteil 0,47), breites Gesicht von etwa 9 Pixeln mit großen dunklen "
    "Augen (2 Pixel breit, mit hellem Lichtpunkt) und klaren Brauen; harte, fast schwarze Kontur "
    "rundum; kräftige, gesättigte Farben (rot-weiße Jacke, schwarzes Haar, graues Shirt) mit "
    "zwei bis drei Stufen je Fläche; kurze Beine, kompakter Körper, Füße breit."
)
APP_HEUTE = [
    "Bogen 32 × 32: Reihe 1 vier Standbilder, Reihe 2 Laufen 6 Bilder je Richtung, Reihe 3 "
    "wahlweise ein Sitzbild je Richtung (skripte/figurenbogen.mjs, sitzrichtung.ts).",
    "Stehen = Standbild der Blickrichtung (`blick`); ohne Sitzbild sitzt das Standbild 6 Pixel höher.",
    "Liegen (`#stelle:…>liegt`) kippt das Standbild um eine Vierteldrehung; nur der Held liegt.",
    "Geführtes Gehen (`#gehe`) und Statisten (von–bis, Pause) nutzen die Laufbilder.",
    "Geister färbt die App selbst (geistfigur.ts); kein eigenes Bild nötig.",
]
APP_FUER_WUENSCHE = [
    "Ruhebewegung (Atmen): vierte Reihe im Bogen, Abspielen im Stand (figurbilder.ts, belebungsschicht.ts).",
    "Sitzen am Brett mit Zug: Sitzreihe mit mehreren Bildern je Richtung, Abspielen während einer Partie "
    "am Tisch.",
    "Nicken und Gestik im Gespräch: neuer Ink-Tag (etwa `#geste:juno>nicken`) und eine Reihe im Bogen.",
    "Eigenes Liegebild: Reihe im Bogen statt der gekippten Standfigur (fuehrungsschicht.ts).",
]


def bloecke(messungen, plaene, stufen, befunde, coach, prompts) -> list:
    """Inhalt des Plans als Liste von ("h2"|"p"|"ul"|"table", Daten)."""
    coachprompt = prompts[bedarf.COACH].prompt
    teile: list = [("h2", "Vorbild: Coach Delgado")]
    teile.append(("p", COACH_MERKMALE))
    teile.append(
        (
            "p",
            f"Gemessen: Kopfanteil {coach.kopfanteil:.2f}, Höhe {coach.hoehe} px, Kontur "
            f"{coach.kontur:.2f}, Sättigung {coach.saettigung:.2f}, {coach.farben} Farben.",
        )
    )
    teile.append(
        (
            "p",
            "Einstellungen (wie alle PixelLab-Figuren, metadata.json): Create from Text, Humanoid, v3, "
            "Vorlage mannequin, Leinwand 32 × 32, Low Top-Down, Highly detailed, Umriss Default. Sein "
            "Prompt:",
        )
    )
    teile.append(("code", coachprompt))
    teile.append(("h2", "Vorlage für den Neubau"))
    teile.append(
        (
            "ul",
            [
                f"Prompt-Schluss statt „slightly stylized proportions …“: „{bedarf.COACH_SCHLUSS}“. "
                f"Fertige Prompts je Figur stehen unten.",
                "Keine schlanken oder langen Wörter (thin, slim, narrow, long, oversized); das Kostüm "
                "bleibt.",
                "Wenn PixelLab es anbietet: Coach-Standbild (coach-delgado/rotations/south.png) als "
                "Stil-Referenz, „Create from Reference“ (gleiche Leinwand 32 × 32, ungeprüft).",
                "Danach messen (figurstil.py): Ziel Kopfanteil 0,45 bis 0,50 und Höhe nach Altersgruppe.",
            ],
        )
    )
    teile.append(
        (
            "table",
            (
                ["Altersgruppe", "Zielhöhe (px)", "Leinwand und Prompt"],
                [
                    ["Erwachsen", bedarf.ZIELHOEHE["Erwachsen"], "32 × 32, ohne Zusatz"],
                    ["Alt", bedarf.ZIELHOEHE["Alt"], "32 × 32, „slightly stooped“"],
                    [
                        "Jugendlich",
                        bedarf.ZIELHOEHE["Jugendlich"],
                        "32 × 32, „short, child height“; Held als Maß",
                    ],
                    ["Kind", bedarf.ZIELHOEHE["Kind"], "24 × 24, „short, child height“ (füllt auf 32 auf)"],
                ],
            ),
        )
    )
    teile.extend(_vergleich(messungen, coach, prompts, befunde))
    teile.extend(_animationen(plaene))
    teile.extend(_reihenfolge(stufen))
    teile.extend(_prompts(stufen))
    return teile


def _prompts(stufen) -> list:
    """Fertige Prompts je Figur in der Reihenfolge des Neubaus; gekürzte sind markiert."""
    teile: list = [("h2", "Prompts für PixelLab, in der Reihenfolge des Neubaus")]
    teile.append(
        (
            "p",
            "Gekürzt heißt: Die alte Beschreibung war zu lang für 400 Zeichen; am Ende fehlt ein Teil "
            "(meist Schuhe oder ein Gegenstand). Bitte vor dem Erzeugen kurz prüfen.",
        )
    )
    for titel, plaene in stufen:
        teile.append(("h3", titel))
        for p in plaene:
            marke = " (gekürzt)" if p.gekuerzt else ""
            teile.append(
                ("p", f"{p.name}, {p.alter}, Zielhöhe in Pixeln {bedarf.ZIELHOEHE.get(p.alter, '?')}{marke}:")
            )
            teile.append(("code", p.prompt or "(keine Beschreibung gefunden)"))
    return teile


def _alter(name, prompts) -> str:
    from pipeline.abenteuer.figurstil_plan import eintrag_fuer

    e = eintrag_fuer(name, prompts)
    return e.alter if e else "?"


def _vergleich(messungen, coach, prompts, befunde) -> list:
    zeilen = []
    for m in sorted(messungen, key=lambda m: (bedarf.gruppe_zum_coach(m, coach), -(m.kopfanteil or 0))):
        zeilen.append(
            [
                m.name,
                m.rolle,
                _alter(m.name, prompts),
                str(m.hoehe),
                f"{m.kopfanteil:.2f}" if m.kopfanteil else "–",
                f"{(m.kopfanteil or 0) - coach.kopfanteil:+.2f}",
                f"{m.saettigung - coach.saettigung:+.2f}",
                f"{m.kontur - coach.kontur:+.2f}",
                f"{m.farben} ({m.farben - coach.farben:+d})",
                bedarf.gruppe_zum_coach(m, coach),
            ]
        )
    kopf = ["Figur", "Rolle", "Alter", "Höhe", "Kopf", "Δ Kopf", "Δ Sätt.", "Δ Kontur", "Farben", "Gruppe"]
    teile: list = [("h2", "PixelLab-Figuren im Vergleich zum Coach"), ("table", (kopf, zeilen))]
    teile.append(("h2", "Größe: Kinder und Jugendliche, die größer sind als Erwachsene"))
    teile.append(("ul", befunde or ["keine"]))
    return teile


def _animationen(plaene) -> list:
    zeilen = [
        [
            p.name,
            p.quelle,
            p.rolle,
            p.alter,
            "; ".join(p.noetig) or "–",
            "; ".join(p.wunsch) or "–",
            str(p.generierungen),
        ]
        for p in plaene
    ]
    return [
        ("h2", "Animationen"),
        ("ul", APP_HEUTE),
        (
            "p",
            "Pflicht für jede Figur: Stehen in 4 Richtungen und Laufen 4 × 6 Bilder (wie der heutige "
            "Bogen). Dazu je Figur:",
        ),
        ("table", (["Figur", "Quelle", "Rolle", "Alter", "Nötig", "Wunsch", "Generierungen"], zeilen)),
        ("p", "Was die App für die Wünsche noch braucht:"),
        ("ul", APP_FUER_WUENSCHE),
    ]


def _reihenfolge(stufen) -> list:
    zeilen, boegen, gen, sitz = [], 0, 0, 0
    for titel, plaene in stufen:
        s = sum(1 for p in plaene if p.sitz_richtungen)
        g = sum(p.generierungen for p in plaene)
        zeilen.append([titel, str(len(plaene)), str(s), str(g), ", ".join(p.name for p in plaene)])
        boegen, gen, sitz = boegen + len(plaene), gen + g, sitz + s
    zeilen.append(["Summe", str(boegen), str(sitz), str(gen), ""])
    return [
        ("h2", "Reihenfolge und Aufwand"),
        (
            "p",
            "Generierungen je Figur: 2 für die Figur, 4 für die Laufrichtungen, je Sitzrichtung 1 (links "
            "und rechts spiegelbar). Stufe 5 nur, wenn der Coach-Stil ganz genau gelten soll.",
        ),
        ("table", (["Stufe", "Bögen", "mit Sitzen", "Generierungen", "Figuren"], zeilen)),
    ]


def html(messungen, plaene, stufen, befunde, coach, coachbild, prompts) -> str:
    """Der Plan als Seite, mit dem Standbild des Coachs (eingebettet: nur lokal)."""
    teile = [
        "<!doctype html><meta charset='utf-8'><meta name='viewport' "
        "content='width=device-width'><title>Figurstil-Plan</title><style>body{font:14px "
        "system-ui;margin:16px;max-width:1100px}table{border-collapse:collapse;font-size:12px}td,th{border:1"
        "px solid #bbb;padding:2px "
        "5px;vertical-align:top}img{image-rendering:pixelated;float:right;background:#ccc}code{white-space:p"
        "re-wrap}</style>",
        "<h1>Figurstil: Neubau im Stil des Coachs</h1>",
        f"<img src='{coachbild}' width='128' alt='Coach Delgado'>",
    ]
    for art, daten in bloecke(messungen, plaene, stufen, befunde, coach, prompts):
        if art in {"h2", "h3", "p"}:
            teile.append(f"<{art}>{htmltext.escape(daten)}</{art}>")
        elif art == "code":
            teile.append(f"<p><code>{htmltext.escape(daten)}</code></p>")
        elif art == "ul":
            teile.append("<ul>" + "".join(f"<li>{htmltext.escape(x)}</li>" for x in daten) + "</ul>")
        else:
            kopf, zeilen = daten
            koepfe = "".join(f"<th>{htmltext.escape(k)}</th>" for k in kopf)
            reihen = "".join(
                "<tr>" + "".join(f"<td>{htmltext.escape(z)}</td>" for z in zeile) + "</tr>"
                for zeile in zeilen
            )
            teile.append(f"<table><tr>{koepfe}</tr>{reihen}</table>")
    return "\n".join(teile)


def markdown(messungen, plaene, stufen, befunde, coach, prompts) -> str:
    """Der Plan als Text für docs oder den Hauptchat."""
    teile = ["# Figurstil: Neubau im Stil des Coachs\n"]
    for art, daten in bloecke(messungen, plaene, stufen, befunde, coach, prompts):
        if art in {"h2", "h3"}:
            teile.append(f"\n{'#' * int(art[1])} {daten}\n")
        elif art == "p":
            teile.append(daten + "\n")
        elif art == "code":
            teile.append(f"```\n{daten}\n```\n")
        elif art == "ul":
            teile.append("\n".join(f"- {x}" for x in daten) + "\n")
        else:
            kopf, zeilen = daten
            teile.append("| " + " | ".join(kopf) + " |\n|" + "---|" * len(kopf))
            teile.extend("| " + " | ".join(z.replace("|", "/") for z in zeile) + " |" for zeile in zeilen)
            teile.append("")
    return "\n".join(teile)
