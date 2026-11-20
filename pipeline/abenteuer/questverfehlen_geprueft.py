"""Geprüfte Stellen der Prüfung „Quests verfehlen“ (questverfehlen.py): Schlüssel → Grund.

Schlüssel: „quest:start“ oder „quest:n“ (Schritt n ab 1). Jede Ausnahme nennt, warum der Spieler
den Auslöser nicht verlieren kann, obwohl eine Sperre ihn verdecken könnte.
"""

AUSNAHMEN: dict[str, str] = {
    "siliconBay.fehlendeSeite:2": (
        "Die Quest beginnt nur in silicon-bay-lobby.vitrine_erstmals, und dorthin führt die Vitrine nur, "
        "solange victorSeiteGegeben fehlt (sonst vitrine_spaet, 20.11.2026). Victors Seite "
        "(summit-city-bergstation.victor_seite) folgt als Rückmeldung auf die Partie summitCity.victorFrei, "
        "Schritt 6 der Hauptquest summitCity.endspiel; erst danach kommt das Grab (grabGesehen)."
    ),
}
