"""Verbindet Lesen und Nachspielen für ein Kapitel.

Wozu diese Datei da ist:
    ``bauen/__main__.py`` ruft je Kapitel ``spiele_kapitel`` auf: Abbildungen (aus
    ``lesen/diagramme``), Übungen (aus ``lesen/uebungen``) und Zugfolgen (aus ``lesen/zugfolgen``)
    werden zusammengeführt und dem Nachspieler in Textreihenfolge übergeben.
"""

from __future__ import annotations

from pipeline.lesen.diagramme import Kapitelquelle, Rohdiagramm
from pipeline.lesen.quellen import Quelldatei
from pipeline.lesen.text import als_klartext, wandle_text
from pipeline.lesen.uebungen import lies_uebungen
from pipeline.lesen.verzeichnis import Verweisverzeichnis
from pipeline.lesen.zugfolgen import lies_unterschriftszuege, lies_zugfolgen
from pipeline.zugfolgen.baum import Beispiel
from pipeline.zugfolgen.nachspielen import Abbildungsstellung, Kapitelzugfolgen, Nachspieler


def spiele_kapitel(
    quelle: Quelldatei,
    kapitelquelle: Kapitelquelle,
    verzeichnis: Verweisverzeichnis,
    fruehere: list[Beispiel] | None = None,
) -> Kapitelzugfolgen:
    """Liest Zugfolgen und Übungen eines Kapitels und spielt sie nach.

    ``fruehere`` sind die Beispiele der Kapitel davor: Kapitel 5 und 6 setzen Eröffnungen aus
    Kapitel 2 fort, ohne sie neu zu zeigen. Eine solche Abbildung hängt dann am Beispiel des
    früheren Kapitels.

    Beispiel: Kapitel 1 ergibt unter anderem das Beispiel „London-System“ mit Abb. 1.2 bis 1.7
    auf einer Linie ab der Grundstellung.
    """
    zeilenanfang = _zeilenanfaenge(quelle.text)
    rohuebungen = lies_uebungen(quelle, verzeichnis).uebungen
    # Übungsdiagramme bilden eigene Beispiele: Der Übungskasten steht im letzten Abschnitt, und
    # sonst rutschten Abb. 5.45 bis 5.47 in den Eröffnungsbaum dieses Abschnitts.
    uebungsabschnitt = {n: f"Übung {u.nummer}" for u in rohuebungen for n in u.abbildungen}
    abbildungen = [
        Abbildungsstellung(
            nummer=d.nummer or "",
            fen=d.fen,
            position=zeilenanfang[d.zeile - 1] if 0 < d.zeile <= len(zeilenanfang) else 0,
            abschnitt=uebungsabschnitt.get(d.nummer or "") or (d.abschnitt.nummer if d.abschnitt else None),
            titel=d.unterabschnitt or (d.abschnitt.titel if d.abschnitt else kapitelquelle.titel),
            unterschriftszuege=lies_unterschriftszuege(_klartext(d)),
            fundstelle=d.fundstelle,
            unterschrift_am_anfang=_klartext(d).lstrip().startswith("Nach"),
        )
        for d in kapitelquelle.diagramme
        if d.nummer
    ]
    # Eine Übung ohne eigenes Diagramm verweist oft auf eines im Text („In der Légal-Falle hat
    # Weiß soeben 6. Sxe5!! gespielt (\\abb{4.18})“); ihre Züge gehören in dessen Baum. Mit
    # eigenem Diagramm zählt nur dieses: Ein Verweis dort ist meist nur ein Vergleich.
    uebungen = {u.label: u.abbildungen or u.verweise for u in rohuebungen}
    gelesen = lies_zugfolgen(quelle)
    ergebnis = Nachspieler(kapitelquelle.nummer, abbildungen, uebungen, fruehere).verarbeite(
        gelesen.zugfolgen
    )
    ergebnis.befunde[:0] = gelesen.befunde
    return ergebnis


def _zeilenanfaenge(text: str) -> list[int]:
    """Zeichenposition des Anfangs jeder Zeile (Zeile 1 beginnt bei 0)."""
    anfaenge = [0]
    for index, zeichen in enumerate(text):
        if zeichen == "\n":
            anfaenge.append(index + 1)
    return anfaenge


def _klartext(diagramm: Rohdiagramm) -> str:
    """Die Bildunterschrift als Klartext (für die Züge darin)."""
    return als_klartext(wandle_text(diagramm.unterschrift_latex, diagramm.fundstelle).teile)
