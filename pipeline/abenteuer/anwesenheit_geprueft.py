"""Geprüfte und gemeldete Funde der Anwesenheitsprüfung (pipeline/abenteuer/anwesenheit.py).

Schlüssel: „Prüfung:Figur oder Ortswort:Datei.Knoten@Karte“.
GEPRUEFT: Die Stelle passt, mit Grund (etwa: der Text sagt, dass die Figur woanders wartet).
GEMELDET: Die Stelle passt nicht, die Abhilfe wartet auf eine Entscheidung; der Grund nennt den
Vorschlag (Bericht docs/spiel/auftraege/anwesenheit_25-11.md).
"""

# Juno reist mit {held}, steht aber auf diesem Reiseabschnitt nicht auf der Karte. Seit dem
# 25.11.2026 gibt es Begleiter (app/src/abenteuer/regeln/gefolge.ts): In Akt 1 geht Juno vom
# Ortsschild bis Cedar Creek mit. Für die übrigen Abschnitte wartet die Entscheidung, wann sie
# mitgeht (Bericht, Vorschlag je Stelle).
MITREISENDE = 'Begleiter für diesen Reiseabschnitt setzen (~ begleiter = "juno"), wartet auf Entscheidung'

GEPRUEFT: dict[str, str] = {
    "ort:Dachboden:maple-falls-wohnzimmer.ankunft@mapleFalls.wohnzimmer": (
        "Mama erzählt vom Dachboden oben; die Szene spielt im Wohnzimmer, kein Schauplatzwechsel"
    ),
    "ort:Steg:weg-maple-cedar.tessa_b@wegMapleCedar.landstrasse": (
        "tessa_b spielt nur bei Tessa am Flussweg (tessaFluss, wenn nadelCedarCreek > 0); die "
        "statische Prüfung sieht den Dialog auch bei den Tessas der anderen Karten"
    ),
    "ort:Steg:weg-maple-cedar.tessa_b@wegMapleCedar.zedernpfad": (
        "tessa_b spielt nur bei Tessa am Flussweg (tessaFluss); siehe Landstraße"
    ),
}

GEMELDET: dict[str, str] = {
    "sprecher:juno:weg-cedar-riverton.fenwick@wegCedarRiverton.zedernwald": MITREISENDE,
}
