"""Katalog der Grafik im privaten Repository (register/katalog.json): Abfrage beim Kartenbau.

Warum: Die Beschreibungen der Bilder stammen von Sonnet-Helfern. Unsichere Einträge und Bauteile
sollen auffallen, bevor ein Bild verbaut wird (Entscheidung des Autors, 9.11.2026). Ohne privates
Repository (etwa in GitHub Actions) bleibt der Katalog leer und es gibt keine Befunde.
"""

from pathlib import Path

from pipeline.abenteuer.kartenbau import lade

# Unter dieser Sicherheit prüft Opus einen Katalogeintrag, bevor sein Bild verbaut wird.
SICHER_GENUG = 0.7


def katalogeintraege(privat: Path) -> dict[str, dict]:
    """Katalog des privaten Repositorys, erreichbar über den Pfad des Bildes und den seiner
    Schattenfassung; leer, wenn es keinen Katalog gibt."""
    pfad = privat / "register" / "katalog.json"
    if not pfad.exists():
        return {}
    katalog = lade(pfad)
    return {**katalog, **{e["schatten"]: e for e in katalog.values() if e.get("schatten")}}


def katalogbefund(name: str, eintrag: dict | None) -> str | None:
    """Befund zu einem Katalogeintrag: unsicher beschrieben oder laut Katalog nur ein Bauteil.

    Warum: Die Beschreibungen stammen von Sonnet-Helfern; unsichere werden erst geprüft, wenn eine
    Karte sie braucht (Entscheidung 9.11.2026).
    """
    if eintrag is None:
        return None
    if not eintrag.get("beschreibung"):
        return f"{name}: im Katalog noch nicht beschrieben, bitte beschreiben"
    if eintrag.get("ganz") is False:
        teile = eintrag.get("gegenstuecke") or "Gegenstücke fehlen"
        return f"{name} ist laut Katalog ein Bauteil: {str(teile)[:80]}"
    if eintrag.get("sicher", 1) < SICHER_GENUG and not eintrag.get("korrektur"):
        text = eintrag.get("beschreibung", "")[:60]
        return f"{name}: Katalogeintrag unsicher ({text}), bitte prüfen"
    return None
