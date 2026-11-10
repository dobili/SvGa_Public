"""Tönung der Karte als Schleier über der Vorschau (wie die App, ``oberwelt/toenung.ts``).

Warum: Der Gutachter sieht nur die Vorschau aus ``kartenbild``. Ohne Schleier fehlte dort die Nacht
der Sternwarte (Variantenwahl, Mangel „keine Nachttönung“), obwohl die App sie zeichnet.
Rolle im Gesamtbild: nur für die Vorschau; das Spielbild bleibt ungetönt, die App legt den Schleier
selbst darüber. Sepia und Dunkel gehen in der App eigene Wege und bleiben hier ungetönt.
"""

from PIL import Image

# Farbe und Deckkraft je Tönung, gleich wie SCHLEIER in app/src/abenteuer/oberwelt/toenung.ts.
SCHLEIER = {
    "nebel": ((0xD8, 0xDD, 0xE0), 0.45),
    "nacht": ((0x0B, 0x15, 0x30), 0.55),
    "abend": ((0xFF, 0x8A, 0x3D), 0.18),
}


def schleier(bild: Image.Image, toenung: str | None) -> Image.Image:
    """Bild mit dem Schleier der Tönung; ohne bekannte Tönung unverändert.

    Beispiel: Sternwarte-Felsnase mit „nacht“ → dunkelblau überzogen, Deckkraft 0,55.
    """
    if toenung not in SCHLEIER:
        return bild
    farbe, deckkraft = SCHLEIER[toenung]
    flaeche = Image.new("RGBA", bild.size, (*farbe, round(deckkraft * 255)))
    ergebnis = bild.convert("RGBA")
    ergebnis.alpha_composite(flaeche)
    return ergebnis
