"""Plausibilität der erkannten Bauteile: Verdachtsmuster melden und bekannte Irrtümer nachbessern.

Warum: Eine Bauteilliste irrt bei Treppenabsätzen am ehesten: An der
Schule las sie die Vorderkante des Absatzes als dritte Treppe (Stapel vom 28.11.2026), genau den
Fehler, den der Autor gemeldet hatte. ``verdacht`` zeigt solche Muster auf dem Bogen
(bauteil_bogen.py), ``nachbessern`` wandelt das sichere Muster beim Speichern der Vorschläge um.
Regeln der Ableitung: bauteilregeln.py (KARTENREGELN 10.95).
"""

from pipeline.abenteuer.bauteilregeln import PODEST, QUER, beruehrt, richtung
from pipeline.abenteuer.kollisionfein import ZP, K


def verdacht(teile: list[dict]) -> list[str]:
    """Muster, bei denen die Erkennung oft irrt (zur Prüfung auf dem Bogen, nichts wird geändert).

    Warum: Gemini nannte die Vorderkante des Absatzes der Schule einmal „Treppe unten“ (Stapel vom
    28.11.2026), obwohl die Treppen seitlich liegen. Befunde: eine Treppe „unten“ zwischen zwei
    Seitentreppen (meist die Mauer davor), ein Absatz ohne Treppe, eine Treppe ohne Tür, Absatz
    oder Veranda daneben. Beispiel: Schule mit Treppe unten [98,354,285,367] → ein Befund.
    """
    treppen = [t for t in teile if t["typ"] == "treppe"]
    befunde = []
    for t in treppen:
        seiten = [s for s in treppen if s is not t and beruehrt(s["rahmen"], t["rahmen"])]
        if richtung(t, teile) == "unten" and any(richtung(s, teile) in QUER for s in seiten):
            befunde.append(f"Treppe unten {t['rahmen']} zwischen Seitentreppen: Mauer?")
        nachbarn = [
            x for x in teile if x["typ"] in PODEST | {"tuer"} and beruehrt(x["rahmen"], t["rahmen"], K)
        ]
        if not nachbarn:
            befunde.append(f"Treppe {t['rahmen']} ohne Tür, Absatz oder Veranda")
    for p in (t for t in teile if t["typ"] == "absatz"):
        if not any(beruehrt(p["rahmen"], s["rahmen"]) for s in treppen):
            befunde.append(f"Absatz {p['rahmen']} ohne Treppe")
    return befunde


def nachbessern(teile: list[dict]) -> list[dict]:
    """Bessert das häufigste Missverständnis der Erkennung nach: eine „Treppe unten“, die zwischen zwei
    Seitentreppen unter einem Absatz liegt, ist dessen Vorderkante (Mauer).

    Warum: An der Schule (mf4Schule, hb7Schule, mfSchule) las Gemini die Vorderkante des Absatzes im
    Stapel und in drei weiteren Läufen als dritte Treppe, obwohl der Autor sie als Mauer bestimmt hat
    (28.11.2026). Ausgabe: neue Liste, das Bauteil mit Typ „mauer“ und Hinweis; sonst unverändert.
    """
    treppen = [t for t in teile if t["typ"] == "treppe"]
    absaetze = [t["rahmen"] for t in teile if t["typ"] in PODEST]
    aus = []
    for t in teile:
        seiten = [s for s in treppen if s is not t and beruehrt(s["rahmen"], t["rahmen"])]
        unter_absatz = any(
            a[0] < t["rahmen"][2] and t["rahmen"][0] < a[2] and a[3] <= t["rahmen"][1] + ZP for a in absaetze
        )
        if (
            t["typ"] == "treppe"
            and richtung(t, teile) == "unten"
            and unter_absatz
            and sum(richtung(s, teile) in QUER for s in seiten) >= len(QUER)
        ):
            aus.append(
                {
                    "typ": "mauer",
                    "rahmen": t["rahmen"],
                    "hinweis": "nachgebessert: Treppe unten zwischen Seitentreppen",
                }
            )
        else:
            aus.append(t)
    return aus
