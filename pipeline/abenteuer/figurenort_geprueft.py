"""Angesehene Kandidaten des Werkzeugs pipeline/abenteuer/figurenort.py, jeder mit Grund.

Schlüssel: „Prüfung:Figur:Datei.Knoten“ (Prüfung „ort“ oder „abschied“). Ein Eintrag sagt, warum die
Stelle passt, obwohl das Werkzeug sie meldet. Neue Kandidaten erst ansehen, dann beheben (Szene,
``wenn`` in orte.json, Kartenfassung) oder hier mit Grund eintragen. Stand 20.11.2026 (mittel-4).
"""

GEPRUEFT: dict[str, str] = {
    # Prüfung „ort“
    "ort:wegMapleCedar.tessa:weg-maple-cedar.tessa_b": (
        "Der Steg am Flussweg ist ihr Laufziel („Bis zum Steg!“), nicht der Ort des Gesprächs."
    ),
    "ort:wegMapleCedar.tessaZedern:weg-maple-cedar.tessa_b": (
        "Wie bei tessa: Der Steg am Flussweg ist ihr Laufziel, nicht der Ort des Gesprächs."
    ),
    # Prüfung „abschied“
    "abschied:mapleFalls.mutter:maple-falls-wohnzimmer.aufbruch": (
        "Nur {held} und Juno brechen auf; Mama bleibt zu Hause (Story-Bibel, Szene 13)."
    ),
    "abschied:mapleFalls.mutterAussen:maple-falls-wohnzimmer.aufbruch": (
        "Wartet nur bis zur Ankunft im Wohnzimmer (wenn: nicht ankunftGesehen und nicht brettBeruehrt)."
    ),
    "abschied:mapleFalls.coachDelgado:maple-falls-wohnzimmer.aufbruch": (
        "Der Coach ruft nur an; er fährt erst am Samstag mit dem Team im Bus (Story-Bibel, Szene 13)."
    ),
    "abschied:desertSprings.dot:desert-springs-aussen.highway": (
        "Dot leiht Mama ihr Auto und bleibt selbst in ihrer Garage."
    ),
    "abschied:ironwood.mama:ironwood-aussen.bus_silicon_bay_abfahrt": (
        "Mama verabschiedet {held} an der Haltestelle und bleibt (Nachtschicht). In der Kantine steht sie "
        "nach dem Kauf nur noch, bis sie die Lernkarte gegeben hat (wenn in orte.json)."
    ),
}
