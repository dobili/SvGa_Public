"""Stehplätze, an denen man die Figur auch sieht: nicht unter einem Möbel- oder Dachbild.

Warum: Befund von mittel-1 aus Fotos mit echten Bildern (23.11.2026). Die Ersatzfelder neben dem
Stuhl (ohnesitzbild.json) lagen teils hinter der rechten Wand des Diners oder halb unter dem Dach
des Nachbarhauses im Park, und zwischen den Nischenbänken des Diners sah man nachts nur einen
Haarschopf. Ein Feld kann begehbar sein und die Figur trotzdem verschwinden lassen: wenn ein Bild,
das in der Tiefe vor ihr liegt (Tischplatte, Dach, Baumkrone), ihre Fußkachel überdeckt.

Regel: Ein Stehplatz ist gut, wenn er erreichbar ist (figurensperre.erreichbar) und die Mitte der
Fußkachel in keinem Bild eines nicht flachen Möbels liegt. Liegt das Bild vorn, verdeckt es die Figur
(Tischplatte, Dach); liegt es dahinter (Nischentische im Diner mit Ebene −57), steht sie darauf.
Flaches (Teppich, Matte, Treppe, Tür) und Begehbares zählt nicht.
Rolle im Gesamtbild: figurenzustaende_ablauf.py (Ersatzfelder) und tagesablauf.py (Dauertest der
Stehplätze in Freizeit und Nacht). Abhängigkeiten ohne Pillow.
"""

from collections import deque

from pipeline.abenteuer.objektkollision import ist_flach

K = 16
SUCHWEITE = 2  # so viele Schritte darf ein Ersatzfeld vom Möbel entfernt sein
NACHBARN = ((0, 1), (-1, 0), (1, 0), (0, -1))  # vor, links, rechts, hinter


def verdeckt(feld: tuple[int, int], gesetzt: list[dict], katalog: dict) -> str | None:
    """Name des Bilds, in dem eine Figur auf ``feld`` stünde (darin, darunter oder darauf), sonst None.

    Beispiel: Diner, Feld (13, 4) zwischen den Nischenbänken → „mf9Rundtisch“ (Befund 23.11.2026: nur
    ein Haarschopf zu sehen); unter dem Dach eines Hauses → der Name des Gebäudes.
    """
    mx, my = (feld[0] + 0.5) * K, (feld[1] + 0.5) * K
    for s in gesetzt:
        angabe = katalog.get(s["name"], {})
        if ist_flach(angabe) or angabe.get("begehbar"):
            continue
        if s["x"] <= mx < s["x"] + s["breite"] and s["y"] <= my < s["y"] + s["hoehe"]:
            return s["name"]
    return None


def stehplaetze(feld: tuple[int, int], frei: set, gesetzt: list[dict], katalog: dict, besetzt: set):  # noqa: ANN201
    """Gute Stehplätze neben ``feld``, nächste zuerst (Breitensuche, erst vor, links, rechts, hinter),
    höchstens SUCHWEITE Schritte über freie Felder.
    Beispiel: Bank im Park (22, 24) → (22, 25), wenn dort kein Dach liegt, dann die nächsten."""
    gesehen, schlange = {feld}, deque([(feld, 0)])
    while schlange:
        (x, y), weite = schlange.popleft()
        if weite == SUCHWEITE:
            continue
        for dx, dy in NACHBARN:
            neu = (x + dx, y + dy)
            if neu in gesehen or neu not in frei:
                continue
            gesehen.add(neu)
            if neu not in besetzt and not verdeckt(neu, gesetzt, katalog):
                yield neu
            schlange.append((neu, weite + 1))


def stehplatz(
    feld: tuple[int, int], frei: set, gesetzt: list[dict], katalog: dict, besetzt: set
) -> tuple[int, int] | None:
    """Der nächste gute Stehplatz (stehplaetze), sonst None."""
    return next(stehplaetze(feld, frei, gesetzt, katalog, besetzt), None)
