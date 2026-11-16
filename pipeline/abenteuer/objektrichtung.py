"""Richtungen eines geformten Objekts: Blick, Lauf, Ende und Rechtecke nach Drehung und Spiegelung.

Warum: Der Karteneditor speichert ``drehung``, ``spiegeln`` und ``massstab`` je Objekt
(``objektform.py``). Die Prüfungen der Ausrichtung (Regel 10.78), der Tischlage (10.79), der
Anordnung (10.80 bis 10.87), der Fahrzeuge (10.65) und der Übergangsbilder (10.77) lasen die
Katalogangaben bisher direkt: Ein gespiegelter Stuhl, der im Katalog nach links schaut, schaut auf
der Karte aber nach rechts. Ohne diese Umrechnung meldeten sie falsche Befunde (Auftrag des
Hauptchats, 16.11.2026). Regel: wie im Bild (``objektform.formbild``) erst Maßstab, dann Spiegeln
(links und rechts tauschen), dann Drehung im Uhrzeigersinn (die Richtung dreht mit).

Eingaben sind Katalogangaben (``moebel/<ort>.json``) und ein Formträger: ein Szeneneintrag oder ein
gesetztes Stück aus ``kartenbau.platziere`` (beide tragen die Formfelder). Ohne Form bleibt alles,
wie es ist.
"""

from pipeline.abenteuer.objektform import FORMFELDER, geformt, hat_form
from pipeline.abenteuer.objektzuschnitt import beschneide_rechteck, beschnittene_groesse, zuschnitt_von

# Richtungen im Uhrzeigersinn: Ein Schritt ist eine Drehung um 90 Grad.
BLICKE = ("oben", "rechts", "unten", "links")
SEITEN = ("nord", "ost", "sued", "west")
SPIEGEL = {"links": "rechts", "rechts": "links", "west": "ost", "ost": "west"}
ACHSE_GETAUSCHT = {"waagrecht": "senkrecht", "senkrecht": "waagrecht"}
VIERTEL = 90

Rechteck = tuple[float, float, float, float]


def form_von(traeger: dict) -> dict:
    """Nur die Formfelder (drehung, spiegeln, massstab, zuschnitt) eines Eintrags oder Stücks.

    Warum: Ein gesetztes Stück trägt außerdem die schon geformte ``maske``; ``geformt`` würde sie
    sonst als eigene Maske ein zweites Mal drehen. Beispiel: ``{"drehung": 90, "maske": [...]}`` →
    ``{"drehung": 90}``. Der Zuschnitt kommt als Tupel (hashbar für ``formschluessel``).
    """
    form = {k: traeger[k] for k in FORMFELDER if k in traeger and k != "zuschnitt"}
    z = zuschnitt_von(traeger)
    return form | ({"zuschnitt": z} if z else {})


def formschluessel(traeger: dict) -> tuple:
    """Die Form als hashbarer Schlüssel (für zwischengespeicherte Pixelprüfungen).

    Beispiel: ``{"drehung": 90, "spiegeln": True}`` → ``(("drehung", 90), ("spiegeln", True))``.
    """
    return tuple(sorted(form_von(traeger).items()))


def _schritte(form: dict) -> int:
    return (int(form.get("drehung", 0)) % 360) // VIERTEL


def drehe_richtung(richtung: str | None, form: dict) -> str | None:
    """Blick (oben, rechts, unten, links) oder Seite (nord, ost, sued, west) nach der Form.

    Beispiel: „links“ gespiegelt → „rechts“; „unten“ um 90 Grad → „links“; „nord“ um 90 Grad →
    „ost“. Andere Werte (``keine``, None) bleiben.
    """
    if richtung is None:
        return None
    if form.get("spiegeln"):
        richtung = SPIEGEL.get(richtung, richtung)
    for reihe in (BLICKE, SEITEN):
        if richtung in reihe:
            return reihe[(reihe.index(richtung) + _schritte(form)) % len(reihe)]
    return richtung


def drehe_achse(achse: str | None, form: dict) -> str | None:
    """Laufachse nach der Form: Bei 90 und 270 Grad tauschen waagrecht und senkrecht.

    Beispiel: Gleis „waagrecht“ mit ``drehung`` 90 → „senkrecht“; gespiegelt bleibt es „waagrecht“.
    """
    if achse in ACHSE_GETAUSCHT and _schritte(form) % 2:
        return ACHSE_GETAUSCHT[achse]
    return achse


def forme_rechteck(r: Rechteck, breite: int, hoehe: int, form: dict) -> Rechteck:
    """Ein Rechteck im Bild (links, oben, rechts, unten) in das geformte Bild umgerechnet.

    Eingaben: Rechteck im ungeformten Bild der Größe ``breite`` × ``hoehe`` (etwa ``platte`` eines
    Tischs). Ausgabe: dasselbe Rechteck im Bild nach Zuschnitt, Maßstab, Spiegeln und Drehung.
    Beispiel: Platte (0, 0, 16, 8) im Bild 32 × 16, gespiegelt → (16, 0, 32, 8).
    Sonderfall: Mit Zuschnitt wird das Rechteck verschoben und auf den Ausschnitt begrenzt.
    """
    z = zuschnitt_von(form)
    if z is not None:
        r = beschneide_rechteck(r, breite, hoehe, z)
        breite, hoehe = beschnittene_groesse(breite, hoehe, z)
    m = float(form.get("massstab", 1))
    x0, y0, x1, y1 = r[0] * m, r[1] * m, r[2] * m, r[3] * m
    b, h = max(1, round(breite * m)), max(1, round(hoehe * m))
    if form.get("spiegeln"):
        x0, x1 = b - x1, b - x0
    for _ in range(_schritte(form)):
        # Uhrzeigersinn: Punkt (x, y) im Bild b × h → (h - y, x) im Bild h × b.
        x0, y0, x1, y1 = h - y1, x0, h - y0, x1
        b, h = h, b
    return x0, y0, x1, y1


def ausgerichtet(angabe: dict, traeger: dict) -> dict:
    """Die Katalogangabe so, wie das Objekt auf der Karte liegt (für die Prüfungen).

    Warum: Prüfungen fragen nach ``blick``, ``lauf``, ``ende``, ``platte``, ``breite`` und ``hoehe``;
    mit dieser Angabe gelten ihre Regeln ohne weitere Änderung auch für gedrehte und gespiegelte
    Bilder. Eingaben: Katalogangabe, Szeneneintrag oder gesetztes Stück. Ausgabe: dieselbe Angabe
    ohne Form, sonst eine Kopie (Größe und Maske wie ``objektform.geformt``).
    Beispiel: Stuhl ``blick`` „links“, ``spiegeln`` true → ``blick`` „rechts“.
    Sonderfall: ``varianten`` (Bilder anderer Richtung) und ``plaetze`` bleiben im Raster des
    Katalogbilds; ``richtung`` einer Treppe (hoch, runter) ändert sich nicht.
    """
    form = form_von(traeger)
    if not angabe or not hat_form(form):
        return angabe
    # Ohne Größe (Kunstdaten der Tests) bleibt die Größe, nur die Richtungen drehen.
    groesse = "breite" in angabe and "hoehe" in angabe
    neu = dict((geformt(angabe, form) if groesse else None) or angabe)
    if "blick" in angabe:
        neu["blick"] = drehe_richtung(angabe["blick"], form)
    if "ende" in angabe:
        neu["ende"] = drehe_richtung(angabe["ende"], form)
    if "lauf" in angabe:
        neu["lauf"] = drehe_achse(angabe["lauf"], form)
    if angabe.get("platte") and groesse:
        neu["platte"] = list(forme_rechteck(tuple(angabe["platte"]), angabe["breite"], angabe["hoehe"], form))
    return neu


def katalogrichtung(richtung: str, form: dict) -> str:
    """Rückwärts: Welche Richtung muss das Katalogbild haben, damit es nach der Form ``richtung``
    zeigt? Beispiel: gewünscht „rechts“ bei ``spiegeln`` → Katalogbild „links“."""
    for kandidat in (*BLICKE, *SEITEN):
        if drehe_richtung(kandidat, form) == richtung:
            return kandidat
    return drehe_achse(richtung, form) or richtung
