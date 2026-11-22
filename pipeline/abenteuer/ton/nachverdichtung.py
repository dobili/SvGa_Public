"""Verdichten, bis ein Stück A0.6 hält: bis zu drei Durchgänge desselben sanften Verdichters.

Warum: Für die Ortsthemen reichte ein Durchgang des Verdichters (lautheit.verdichtungskurve), weil
ihre Noten auf gleichmäßige Lautheit hin gesetzt sind. Die Szenenstücke (Ambrose, Nova, Abschied,
Kurzmotive …) folgen der Erzählung: zart, dann fest, ein einzelner Ton, ein Crescendo. Nach einem
Durchgang lagen 13 Schleifen und 44 Einmal-Stücke über den Grenzen (Messung vom 22.11.2026,
Etappe Szenenstücke). Statt jedes Stück von Hand umzusetzen, misst der Musikbau nach jedem Durchgang
und verdichtet erneut, solange LRA, P98 oder Ausreißer mit RESERVE über der Grenze liegen. Derselbe
Verdichter mehrfach: Der Satz bleibt, nur die Spitzen über dem Mittel werden flacher.

Eingaben: Ton (Abtastwerte × Kanäle, numpy), Abtastrate, ob Schleife (ringförmig, mit LRA und P98)
oder Einmal-Stück (nur Ausreißer), ob Kampfmusik (engere LRA). Ausgabe: der verdichtete Ton, noch
ohne Zielpegel und Begrenzer (die setzt musikbau.gleichmaessig oder musikbau.einmalig danach).
Beispiel: ``nova`` (zart, dann fest) hatte LRA 16,9; nach den Durchgängen hält es die Grenze.
Sonderfall: Mehr als DURCHGAENGE Durchgänge gibt es nicht; was dann noch abweicht, meldet die
Prüfung (lautheitspruefung.py), damit niemand ein Stück unbemerkt platt drückt.
"""

from pipeline.abenteuer.ton import lautheit as L

DURCHGAENGE = 3
# So viel Abstand zur Grenze soll bleiben (LU): Ein anderer Bau soll nicht knapp darüber landen.
RESERVE = 0.3


def _zu_unruhig(messung: L.Messung, kampf: bool, schleife: bool) -> bool:
    """Liegt die Messung mit RESERVE über einer Grenze, die der Verdichter beeinflusst?"""
    if any(v.startswith("Ausreißer") for v in messung.verstoesse):
        return True
    if not schleife:
        return False
    grenze_lra = L.GRENZE_LRA_KAMPF if kampf else L.GRENZE_LRA
    return messung.lra > grenze_lra - RESERVE or messung.p98_ueber_median > L.GRENZE_P98 - RESERVE


def verdichte(  # noqa: ANN201 (numpy)
    ton,  # noqa: ANN001 (numpy)
    rate: int,
    schleife: bool = True,
    kampf: bool = False,
    durchgaenge: int = DURCHGAENGE,
):
    """Verdichtet in bis zu ``durchgaenge`` Durchgängen, bis das Stück A0.6 mit RESERVE hält."""
    for _ in range(durchgaenge):
        ton = ton * L.verdichtungskurve(ton, rate, schleife)
        if not _zu_unruhig(L.miss_ton(ton, rate, "", kampf, schleife), kampf, schleife):
            break
    return ton
