"""Sprache der Schilder: Orts- und Geschäftsnamen englisch, Hinweise des Spiels deutsch.

Warum: Entscheidung des Autors RO53.6 (Kartenblick, 24.11.2026): Das Spiel liegt in Amerika, also
stehen Namen englisch auf Schildern, Fassaden und Tafeln; was der Spieler lesen muss, um
weiterzukommen, bleibt deutsch. Vorher standen „BERGLADEN“, „WASCHSALON“ oder „FEUERWACHE“ neben
„POST OFFICE“ und „STORE“. Der Erzähler gibt Aufschriften im Dialog auf Deutsch wieder (der
Lesetext übersetzt), daran ändert die Regel nichts.

Die Regel im Einzelnen:
- Englisch (NAMEN): Ortsschilder, Bahnhofsnamen, Laden-, Firmen- und Gebäudeschilder, Werbung und
  Alltagsschilder der Welt („FOR SALE“, „VACANCY“). Port Delacroix darf französisch heißen, wie im
  Dialog („MUSIQUE“, „DEPUIS 1889“), London 1851 ist englisch.
- Deutsch (HINWEISE): Sperren („GESPERRT“), Plakate zu Ereignissen der Geschichte (Meisterschaft,
  Flohmarkt, Diplomtag, Ankündigung „BALD“), Lehrsätze („ERST ZÄHLEN“), der Fahrplan und Wegweiser
  zu einem Questziel („ZUR SCHLEUSE“).

Geprüft werden die Aufschriften, die der Code zeichnet: ``SCHILDER`` in ``schildbild.py`` und, mit
dem privaten Paket, jede Zeichenkette in Großbuchstaben in ``werkzeuge/*.py`` (mindestens drei
Buchstaben und ein Vokal; Zahlen, Kürzel und Farbmuster fallen so weg). Befunde:
1. Aufschrift nicht eingeordnet: in NAMEN, HINWEISE oder KEIN_TEXT eintragen (mit Grund).
2. Ein Name enthält Umlaute oder ein deutsches Wort (DEUTSCHE_WOERTER).
Bilder mit eingebrannter Schrift aus Bildaufträgen (Gemini, gekauft) prüft der Mensch; die
gekauften Gebäude tragen englische Namen.

Aufruf: ``python -m pipeline.abenteuer.schildsprache [--privat PRIVAT]`` (letzte Zeile „N Befunde“,
Rückgabe 1 bei Befunden). Dauertest: pipeline/tests/test_abenteuer_schildsprache.py.
"""

import re
import sys
from pathlib import Path

from pipeline.abenteuer.schildbild import SCHILDER

# Englische Namen auf Schildern, Fassaden und Werbung (Regel oben).
NAMEN = frozenset(
    {
        "ACADEMY", "ARENA", "ASSAY", "BAKERY", "BANK", "BARBER", "BASIN", "BOOKS", "CABLE CAR",
        "CANDY", "CAPITAL", "CEDAR CREEK", "CHESS PLAYERS 211", "CLOCKS", "COFFEE", "COFFEE HOUSE",
        "COMING SOON", "CROSSROADS", "DELI", "DEPT STORE", "DEPUIS 1889", "DESERT",
        "DESERT SPRINGS", "DINER", "ELECTRONICS", "FAIR", "FAN SHOP", "FASHION", "FERRY", "FISH",
        "FISH HALL", "FLOWERS", "FOR", "GALLERY", "GAS", "GOLD", "GYM", "HARBOR MASTER", "HARDWARE",
        "HATS", "HITLOCK", "HOME", "HOTEL", "HOTEL BAYVIEW", "ICE", "KING", "KING'S", "KIOSK",
        "LANE", "LAUNDROMAT", "LIVERY", "LONG", "MISTAKES", "MOTEL", "MOVE", "MUSIC", "MUSIQUE",
        "NO MORE", "NOW HERE", "OBSERVATORY", "OFFICE", "OUTFITTERS", "PERFECT", "PERFECT MOVE",
        "PHARMACY", "POP. 211", "PORT DELACROIX", "PRESS", "RANGER", "RARE BOOKS", "RESCUE",
        "REST STOP", "RIDGE", "SALE", "SALOON", "SHAVE", "SHERIFF", "SHIP STORE", "SHIP SUPPLY",
        "SHOES", "SIGNAL", "SPORTS", "SPRINGS", "STAGE", "STEAMWELL", "STORE", "SUBWAY", "SUMMER",
        "TEST", "TICKETS", "TOBACCO", "TOYS", "TRAIL", "UNDERTAKER", "VACANCY", "VARIETY",
        "WASHROOM", "ZERO",
    }
)  # fmt: skip
# Deutsche Hinweise des Spiels, je mit Grund.
HINWEISE = {
    "GESPERRT": "Sperre, die der Spieler verstehen muss",
    "ZUR SCHLEUSE": "Wegweiser zum Questziel Schleuse (Lockport)",
    "FAHRPLAN": "Fahrplan am Bahnhof, sagt dem Spieler, wann der Zug fährt",
    "ERST": "Lehrsatz „Erst zählen“ (Buch, Kapitel 1)",
    "ZAHLEN": "Lehrsatz „Erst zählen“ (Schrift ohne Umlaut)",
    "BALD": "Ankündigungsplakat mit leerer Zeile (U-Bahn Capital)",
    "FLOH-": "Plakat Flohmarkt (Ereignis der Geschichte)",
    "MARKT": "Plakat Flohmarkt (Ereignis der Geschichte)",
    "DIPLOM-": "Plakat Diplomtag (Ereignis der Geschichte)",
    "TAG": "Plakat Diplomtag (Ereignis der Geschichte)",
    "JULI": "Plakat zur Meisterschaft am 20. Juli",
    "LANDES": "Banner zur Landesmeisterschaft (Ereignis der Geschichte)",
    "LANDES-": "Plakat zur Landesmeisterschaft (Ereignis der Geschichte)",
    "MEISTER": "Plakat zur Landesmeisterschaft",
    "SCHAFT": "Plakat zur Landesmeisterschaft",
    "MEISTERSCHAFT": "Banner zur Landesmeisterschaft",
}
# Großgeschriebene Zeichenketten, die keine Aufschrift sind.
KEIN_TEXT = {
    "RGBA": "Bildmodus",
    "WEBP": "Dateiformat",
    "ROPPRWWBBLLLLLLR": "Farbmuster einer Bildzeile",
}
# Werkzeuge, die nicht mehr gelten: Ihre Bilder stehen nicht mehr im Katalog.
ABGELOEST = {
    "schilder_deutsch.py": "RO53.6: Feuerwache, Polizei und Post tragen wieder die gekauften "
    "englischen Schilder (capital-arena.json)",
}
# Deutsche Wörter, die in einem Namen nicht stehen dürfen (die Namen vor RO53.6 und ähnliche).
DEUTSCHE_WOERTER = frozenset(
    {
        "APOTHEKE", "BERGLADEN", "BERGWACHT", "BLUMEN", "BROT", "BUECHER", "EINWOHNER", "EISENWAREN",
        "ELEKTRO", "FAEHRE", "FEINKOST", "FEUERWACHE", "FISCH", "GALERIE", "HAFENBEDARF", "HUETE",
        "KAFFEE", "KAFFEEHAUS", "KAUFHAUS", "KEGEL", "KOENIG", "LADEN", "MODE", "MUSIK", "POLIZEI",
        "PRESSE", "RASTHAUS", "SCHACH", "SCHUHE", "SEILBAHN", "SEIT", "SPIELWAREN", "STERNWARTE",
        "TABAK", "TURNHALLE", "UHREN", "UND", "VERKAUFEN", "WARENHAUS", "WASCHHAUS", "WASCHSALON",
        "WOHNEN", "ZU",
    }
)  # fmt: skip
GROSS = re.compile(r"\"([A-ZÄÖÜ0-9][A-ZÄÖÜ0-9 .!&,:'\-]+)\"")
BUCHSTABE = re.compile(r"[A-ZÄÖÜ]")
VOKAL = re.compile(r"[AEIOUYÄÖÜ]")
MIN_BUCHSTABEN = 3


def ist_aufschrift(text: str) -> bool:
    """Sieht die Zeichenkette nach Schrift aus? Mindestens drei Buchstaben und ein Vokal, keine
    Punktreihe (Farbmuster wie „FFFEMM......“).

    Beispiel: „STORE“ → ja; „15.20.08“, „PD“, „DRHRD“, „FFFEMM......“ → nein.
    """
    if ".." in text:
        return False
    return len(BUCHSTABE.findall(text)) >= MIN_BUCHSTABEN and bool(VOKAL.search(text))


def aufschriften(privat: Path | None) -> dict[str, set[str]]:
    """Alle Aufschriften mit ihren Fundstellen: schildbild.py und (mit Paket) werkzeuge/*.py."""
    funde: dict[str, set[str]] = {}
    for name, schild in SCHILDER.items():
        funde.setdefault(schild.text, set()).add(f"schildbild.py ({name})")
    ordner = privat / "werkzeuge" if privat else None
    if ordner and ordner.is_dir():
        for datei in sorted(ordner.glob("*.py")):
            if datei.name in ABGELOEST:
                continue
            for text in GROSS.findall(datei.read_text(encoding="utf-8")):
                if ist_aufschrift(text):
                    funde.setdefault(text, set()).add(datei.name)
    return funde


def befunde(privat: Path | None) -> list[str]:
    """Befunde 1 und 2 (Kopf der Datei), sortiert. Beispiel: „WASCHSALON“ → nicht eingeordnet."""
    ergebnis = []
    for text, stellen in sorted(aufschriften(privat).items()):
        wo = ", ".join(sorted(stellen))
        if text in KEIN_TEXT or text in HINWEISE:
            continue
        if text not in NAMEN:
            ergebnis.append(f"„{text}“ ({wo}) ist nicht eingeordnet: Name (englisch) oder Hinweis?")
            continue
        woerter = set(re.findall(r"[A-ZÄÖÜ]+", text))
        if re.search("[ÄÖÜ]", text) or woerter & DEUTSCHE_WOERTER:
            ergebnis.append(f"„{text}“ ({wo}) ist ein Name, aber deutsch")
    return ergebnis


def main(argv: list[str]) -> int:
    privat = Path(argv[argv.index("--privat") + 1]) if "--privat" in argv else None
    liste = befunde(privat)
    for zeile in liste:
        print(zeile)
    print(f"{len(liste)} Befunde")
    return 1 if liste else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
