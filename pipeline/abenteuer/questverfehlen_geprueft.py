"""Geprüfte Stellen der Prüfung „Quests verfehlen“ (questverfehlen.py): Schlüssel → Grund.

Schlüssel: „quest:start“ oder „quest:n“ (Schritt n ab 1). Jede Ausnahme nennt, warum der Spieler
den Auslöser nicht verlieren kann, obwohl eine Sperre ihn verdecken könnte. Geprüft am 20.11.2026
an Ink und Daten, bestätigt mit dem Aufschieber (questverfehlen-aufschieber.cjs), der die Quest so
spät wie möglich spielt.
"""

AUSNAHMEN: dict[str, str] = {
    "mapleFalls.dasBrett:1": "Die Zustandskarte ohne Brett gilt ab ersterAbendGesehen; den setzt "
    "maple-falls-wohnzimmer.erster_abend erst nach ersteLektionBesprochen, also nach Schritt 3.",
    "ironwood.mamasFinale:start": "Der Start ist das erste Treffen mit Big Joe (big_joe_erkennt), der "
    "Einstieg in Ironwood. Big Joe verschwindet nur mit endeAkt3Gesehen und feierGesehen zusammen; "
    "die Feier gibt es erst nach Mamas Finale.",
    "ironwood.clubkampf:1": "Big Joe verschwindet nur mit endeAkt3Gesehen und feierGesehen zusammen; "
    "die Feier setzt Mamas Finale voraus, das Ende von Akt 3 den Clubkampf von Ironwood (Hauptgeschichte).",
    "ironwood.clubkampf:4": "Wie Schritt 1: Big Joe bleibt bis zum Ende von Akt 3 und danach, solange "
    "die Feier offen ist.",
    "ghostTown.fernpartie:3": "Victor bleibt in Ghost Town bis ankunftCapitalArenaGesehen; der Weg nach "
    "Capital Arena öffnet erst mit fernpartieGespielt (wenn des Übergangs wegCapital), und das setzt "
    "ghost-town-saloon.victor_nach_fernpartie nach der Partie (Schritt 4).",
    "ghostTown.fernpartie:4": "Wie Schritt 3: Ohne victor_nach_fernpartie (fernpartieGespielt) bleibt "
    "der Weg nach Capital Arena zu, Victor ist also noch da.",
    "summitCity.endspiel:6": "Victor steht an der Bergstation bis grabGesehen (Ghost Town). Summit City "
    "verlässt man erst mit nadelSummitCity (Übergang wegCrossroads), also nach dem Clubkampf in "
    "Schritt 7; Schritt 6 kommt davor.",
    "ironwood.mamasFinale:3": "Mama geht erst mit kaufGesehen (ohne mamaSpielt). Den Kauf gibt es "
    "erst nach dem Clubkampf (nadelIronwood > 0, ironwood-aussen.victor), und Big Joe bietet den "
    "Clubkampf erst an, wenn Mama gespielt hat (big_joe_wartet bis mamaSpielt), also nach Schritt 3.",
    "siliconBay.spielberichte:1": "Die Auswertung bietet Victor in der Lobby an und, seit dem 20.11.2026, "
    "an der Bergstation (victor_berichte_spaeter) vor allem anderen. Dort muss {held} ihn für die "
    "Hauptquest ansprechen (summitCity.endspiel, Schritt 6), bevor Summit City sich öffnet und es zum "
    "Grab geht. Verloren ist sie nur für den, der zweimal „Nicht jetzt“ sagt (Entscheidung des "
    "Hauptchats: Bergstation).",
    "siliconBay.fehlendeSeite:2": (
        "Die Quest beginnt nur in silicon-bay-lobby.vitrine_erstmals, und dorthin führt die Vitrine nur, "
        "solange victorSeiteGegeben fehlt (sonst vitrine_spaet, 20.11.2026). Victors Seite "
        "(summit-city-bergstation.victor_seite) folgt als Rückmeldung auf die Partie summitCity.victorFrei, "
        "Schritt 6 der Hauptquest summitCity.endspiel; erst danach kommt das Grab (grabGesehen)."
    ),
}

# Echte Befunde, die eine Entscheidung zu Karten oder Dialogen brauchen (an den Hauptchat gemeldet,
# 20.11.2026, Bericht docs/spiel/auftraege/quests_verfehlen_20-11.md). Sie bleiben sichtbar
# („gemeldet“), bis sie behoben sind; dann schlägt test_ausnahmen_sind_noch_noetig an.
GEMELDET: dict[str, str] = {
    "siliconBay.spielberichte:start": "Victor verlässt Silicon Bay mit endeAkt3Gesehen; wer Theo vorher "
    "nicht besiegt und Victor nicht gefragt hat, bekommt die Spielberichte nie. Bewusst so gelassen "
    "(Entscheidung des Hauptchats, 20.11.2026): ein verpasstes Angebot, im Tagebuch hängt nichts.",
}
