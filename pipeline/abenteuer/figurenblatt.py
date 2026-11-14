"""Figurenblatt-Schneider: zwölf gezeichnete Schachfiguren auf grünem Grund → zwölf freie Bilder.

Warum: Zu jedem Brettstil des Schach-Abenteuers lässt der Autor bei Gemini einen Figurensatz
zeichnen (Wunsch des Autors, 14.11.2026). Geliefert wird ein Blatt auf grünem Grund (#00FF00) mit
zwei Reihen à sechs Zellen: oben Weiß, unten Schwarz, je König, Dame, Turm, Läufer, Springer,
Bauer. Die App braucht je Figur ein Bild mit Alpha, alle gleich groß und auf derselben Grundlinie,
damit sie auf dem Brett in einer Reihe stehen (abenteuer/brett/Bilderzeichnung.tsx).

Verfahren: Grün wird durchsichtig, weiche Kanten bekommen Teildurchsicht und verlieren den grünen
Schimmer; durchgehende dunkle Trennlinien verschwinden (wie portraetblatt.py). Die Zellen ergeben
sich aus Lücken: erst zwei Bänder (Zeilen ohne Figur), dann je Band sechs Spalten; zu viele Stücke
werden über die kleinsten Lücken verbunden, zu wenige ergeben eine gleichmäßige Teilung. Alle
Figuren werden mit demselben Faktor verkleinert (der König bleibt größer als der Bauer), unten
bündig auf eine gemeinsame Grundlinie und mittig in ein Quadrat gesetzt.
Abhängigkeiten: numpy, Pillow.
"""

from dataclasses import dataclass, field

import numpy as np
from PIL import Image

# Reihenfolge im Blatt und Dateinamen wie die Bildsätze der App (wK, bN, …).
FIGURENFOLGE = ("K", "Q", "R", "B", "N", "P")
ZELLEN_JE_REIHE = len(FIGURENFOLGE)
FIGURGROESSE = 128
# Freiraum im Quadrat: unten bis zur Grundlinie, oben und seitlich.
RAND_UNTEN = 6
RAND_OBEN = 4
RAND_SEITE = 6
# Grünüberschuss (Grün minus größerer der anderen Kanäle, 0 bis 255): ab GRUEN_VOLL ganz
# durchsichtig (Hintergrund, mit Spielraum für JPEG), bis GRUEN_KANTE deckend (Rauschen).
GRUEN_VOLL = 215
GRUEN_KANTE = 35
# Trennlinien: fast schwarz über fast die ganze Breite oder Höhe.
DUNKEL_MAX, LINIENANTEIL = 70, 0.9
# Ab dieser Deckkraft gehört ein Pixel zur Figur.
DECKEND = 0.5
# Stücke mit weniger als diesem Anteil der Masse des größten Stücks sind Staub.
STAUBANTEIL = 0.01
# Vergrößerung ab diesem Faktor macht die Figuren weich: Warnung.
VERGROESSERUNG_MAX = 1.5


@dataclass
class Figurenschnitt:
    """Ergebnis: Bilder je Name (wK … bP), Hinweise und Warnungen für den Bericht."""

    figuren: dict[str, Image.Image]
    hinweise: list[str] = field(default_factory=list)
    warnungen: list[str] = field(default_factory=list)


def freistellen(blatt: Image.Image) -> np.ndarray:
    """RGBA-Feld (0 bis 1) ohne Grün und ohne Trennlinien.

    Eine Kante, an der die Figur zum Anteil a über reinem Grün liegt, hat einen Grünüberschuss
    (Grün minus größerer der anderen Kanäle) von (1 - a) mal 255, gleich welche Farbe die Figur
    hat. Daraus folgt die Deckkraft; die Farbe wird zurückgerechnet (Grün herausgemischt), so
    bleibt kein grüner Saum. Unter GRUEN_KANTE zählt der Überschuss als Rauschen, ab GRUEN_VOLL
    ist das Pixel Hintergrund.
    """
    rgb = np.asarray(blatt.convert("RGB"), dtype=np.float64) / 255.0
    dunkel = rgb.max(axis=2) * 255.0 <= DUNKEL_MAX
    ueberschuss = (rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2])) * 255.0
    alpha = np.clip((GRUEN_VOLL - ueberschuss) / (GRUEN_VOLL - GRUEN_KANTE), 0.0, 1.0)
    teil = np.maximum(alpha, 1e-6)
    rgb[..., 1] = np.where(alpha < 1, (rgb[..., 1] - (1 - alpha)) / teil, rgb[..., 1])
    rgb[..., 0] = np.where(alpha < 1, rgb[..., 0] / teil, rgb[..., 0])
    rgb[..., 2] = np.where(alpha < 1, rgb[..., 2] / teil, rgb[..., 2])
    rgb = np.clip(rgb, 0.0, 1.0)
    # Was nach dem Herausmischen noch grüner ist als Rot und Blau, ist Saum: auf Neutral senken.
    rgb[..., 1] = np.where(
        alpha < 1, np.minimum(rgb[..., 1], np.maximum(rgb[..., 0], rgb[..., 2])), rgb[..., 1]
    )
    alpha[dunkel.mean(axis=1) >= LINIENANTEIL, :] = 0
    alpha[:, dunkel.mean(axis=0) >= LINIENANTEIL] = 0
    return np.dstack([rgb, alpha])


def belegte_strecken(profil: np.ndarray) -> list[tuple[int, int, float]]:
    """Strecken mit Figurpixeln als (Beginn, Ende ausschließlich, Masse), Staub entfernt."""
    strecken, beginn = [], None
    for i, wert in enumerate(np.append(profil, 0)):
        if wert > 0 and beginn is None:
            beginn = i
        elif wert <= 0 and beginn is not None:
            strecken.append((beginn, i, float(profil[beginn:i].sum())))
            beginn = None
    if not strecken:
        return []
    groesste = max(m for _, _, m in strecken)
    return [s for s in strecken if s[2] >= STAUBANTEIL * groesste]


def verbinde(strecken: list[tuple[int, int, float]], anzahl: int) -> list[tuple[int, int, float]]:
    """Verbindet über die kleinsten Lücken, bis höchstens anzahl Strecken bleiben.

    Beispiel: Die Krone des Königs steht getrennt über dem Körper → beide werden eine Strecke.
    """
    strecken = list(strecken)
    while len(strecken) > anzahl:
        i = min(range(len(strecken) - 1), key=lambda k: strecken[k + 1][0] - strecken[k][1])
        a, b = strecken[i], strecken[i + 1]
        strecken[i : i + 2] = [(a[0], b[1], a[2] + b[2])]
    return strecken


def teile(maske: np.ndarray, anzahl: int, achse: int) -> list[tuple[int, int]]:
    """Bereiche entlang einer Achse (0: Zeilen, 1: Spalten) mit je einem Stück Figur.

    Zu wenige Lücken (Figuren berühren sich): gleichmäßige Teilung über die belegte Breite.
    """
    profil = maske.sum(axis=1 - achse)
    strecken = verbinde(belegte_strecken(profil), anzahl)
    if len(strecken) == anzahl:
        return [(a, b) for a, b, _ in strecken]
    belegt = np.nonzero(profil)[0]
    erst, letzt = (int(belegt[0]), int(belegt[-1]) + 1) if belegt.size else (0, len(profil))
    schritt = (letzt - erst) / anzahl
    return [(round(erst + i * schritt), round(erst + (i + 1) * schritt)) for i in range(anzahl)]


def zellen(rgba: np.ndarray) -> list[list[np.ndarray]]:
    """Zwei Reihen à sechs Ausschnitte (RGBA, eng um die Figur), zeilenweise wie im Blatt."""
    maske = rgba[..., 3] >= DECKEND
    reihen = []
    for y0, y1 in teile(maske, 2, 0):
        band = maske[y0:y1]
        reihe = []
        for x0, x1 in teile(band, ZELLEN_JE_REIHE, 1):
            teil = band[:, x0:x1]
            ys, xs = np.nonzero(teil)
            if ys.size == 0:
                reihe.append(np.zeros((0, 0, 4)))
                continue
            reihe.append(rgba[y0 + ys.min() : y0 + ys.max() + 1, x0 + xs.min() : x0 + xs.max() + 1])
        reihen.append(reihe)
    return reihen


def deckende_helligkeit(teil: np.ndarray) -> float:
    """Mittlere Helligkeit (0 bis 1) der deckenden Pixel einer Figur; 0 ohne Pixel."""
    deckend = teil[..., 3] >= DECKEND
    if not deckend.any():
        return 0.0
    return float((teil[..., :3][deckend] @ np.array([0.299, 0.587, 0.114])).mean())


def ins_quadrat(teil: np.ndarray, faktor: float, groesse: int) -> Image.Image:
    """Eine Figur, mit faktor skaliert, mittig und unten auf der Grundlinie in einem Quadrat."""
    bild = Image.fromarray(np.uint8(np.rint(teil * 255)), "RGBA")
    neu = (max(1, round(bild.width * faktor)), max(1, round(bild.height * faktor)))
    # Vormultipliziert skalieren, damit durchsichtige Pixel keine Farbe in die Kante tragen.
    bild = bild.convert("RGBa").resize(neu, Image.Resampling.LANCZOS).convert("RGBA")
    quadrat = Image.new("RGBA", (groesse, groesse))
    quadrat.alpha_composite(bild, ((groesse - bild.width) // 2, groesse - RAND_UNTEN - bild.height))
    return quadrat


def schneide_figuren(blatt: Image.Image, groesse: int = FIGURGROESSE) -> Figurenschnitt:
    """Die zwölf Figuren eines Blattes als Quadrate groesse × groesse mit Alpha.

    Beispiel: Blatt 1536 × 1024, oben sechs weiße, unten sechs schwarze Holzfiguren → wK … bP.
    Sonderfälle: weniger als zwölf Figuren → ValueError mit den fehlenden Namen; obere Reihe
    dunkler als die untere → Reihen getauscht (Hinweis); starke Vergrößerung → Warnung.
    """
    hinweise, warnungen = [], []
    reihen = zellen(freistellen(blatt))
    if deckende_helligkeit_reihe(reihen[0]) < deckende_helligkeit_reihe(reihen[1]):
        reihen.reverse()
        hinweise.append("Obere Reihe dunkler als die untere: Reihen getauscht (oben gehört Weiß)")
    namen = [f"{farbe}{f}" for farbe in "wb" for f in FIGURENFOLGE]
    teile_ = [teil for reihe in reihen for teil in reihe]
    fehlend = [n for n, t in zip(namen, teile_, strict=True) if t.size == 0]
    if fehlend:
        raise ValueError(f"Keine Figur gefunden für: {', '.join(fehlend)}")
    hoechste = max(t.shape[0] for t in teile_)
    breiteste = max(t.shape[1] for t in teile_)
    faktor = min((groesse - RAND_UNTEN - RAND_OBEN) / hoechste, (groesse - 2 * RAND_SEITE) / breiteste)
    if faktor > VERGROESSERUNG_MAX:
        warnungen.append(f"Figuren klein gezeichnet: {faktor:.1f}-fach vergrößert, wird weich")
    hinweise.append(f"12 Figuren gefunden, größte {breiteste} × {hoechste} Pixel, Faktor {faktor:.2f}")
    figuren = {n: ins_quadrat(t, faktor, groesse) for n, t in zip(namen, teile_, strict=True)}
    return Figurenschnitt(figuren, hinweise, warnungen)


def deckende_helligkeit_reihe(reihe: list[np.ndarray]) -> float:
    """Mittlere Helligkeit einer Reihe (zum Erkennen vertauschter Reihen)."""
    werte = [deckende_helligkeit(t) for t in reihe if t.size]
    return float(np.mean(werte)) if werte else 0.0
