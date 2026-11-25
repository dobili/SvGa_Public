"""Geprüfte und gemeldete Funde der Anwesenheitsprüfung (pipeline/abenteuer/anwesenheit.py).

Schlüssel: „Prüfung:Figur oder Ortswort:Datei.Knoten@Karte“.
GEPRUEFT: Die Stelle passt, mit Grund (etwa: der Text sagt, dass die Figur woanders wartet).
GEMELDET: Die Stelle passt nicht, die Abhilfe wartet auf eine Entscheidung; der Grund nennt den
Vorschlag (Bericht docs/spiel/auftraege/anwesenheit_25-11.md).
"""

# Juno reist mit {held} (Akt 1 zu Fuß nach Cedar Creek und Riverton, später überall), steht aber auf
# keiner Wegkarte. Vorschlag: Juno als Mitreisende, die dem Helden sichtbar folgt, solange eine
# Bedingung je Reiseabschnitt gilt (wie der Begleiter Ambrose, oberwelt/begleiterschicht.ts, aber
# deckend und immer sichtbar). Das deckt alle Stellen mit Juno unterwegs auf einmal; einzeln
# gesetzte Juno-Figuren stünden fern vom Auslöser des Gesprächs.
MITREISENDE = "Juno als Mitreisende (Vorschlag, wartet auf Entscheidung): folgt dem Helden sichtbar"

GEPRUEFT: dict[str, str] = {
    "ort:Dachboden:maple-falls-wohnzimmer.ankunft@mapleFalls.wohnzimmer": (
        "Mama erzählt vom Dachboden oben; die Szene spielt im Wohnzimmer, kein Schauplatzwechsel"
    ),
    "genannt:juno:maple-falls-park.bushaltestelle@mapleFalls.park": (
        "Der Satz sagt, dass Juno woanders wartet (an der Landstraße); sie ist nicht hier"
    ),
    "genannt:juno:maple-falls-park.landstrasse@mapleFalls.park": (
        "Der Satz sagt, dass Juno woanders wartet (am Ortsschild); sie ist nicht hier"
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
    "sprecher:juno:cedar-creek-bibliothek.okafor_erstes_treffen@cedarCreek.bibliothek": MITREISENDE,
    "sprecher:juno:cedar-creek-aussen.ankunft@cedarCreek.aussen": MITREISENDE,
    "sprecher:juno:cedar-creek-aussen.zedernwald@cedarCreek.aussen": MITREISENDE,
    "sprecher:juno:weg-maple-cedar.juno_weg@wegMapleCedar.landstrasse": MITREISENDE,
    "sprecher:juno:cedar-creek-aussen.ende_akt1_bus@cedarCreek.aussen": MITREISENDE,
    "genannt:juno:weg-maple-cedar.faehrstein@wegMapleCedar.flussweg": MITREISENDE,
    "sprecher:juno:cedar-creek-bibliothek.okafor_nadel@cedarCreek.bibliothek": MITREISENDE,
    "genannt:juno:cedar-creek-aussen.sterne_angebot@cedarCreek.aussen": MITREISENDE,
    "genannt:juno:cedar-creek-aussen.zedernwald@cedarCreek.aussen": MITREISENDE,
    "genannt:juno:weg-maple-cedar.apfelstand_a@wegMapleCedar.landstrasse": MITREISENDE,
    "sprecher:juno:cedar-creek-aussen.sterne@cedarCreek.aussen": MITREISENDE,
    "sprecher:juno:weg-cedar-riverton.fenwick@wegCedarRiverton.zedernwald": MITREISENDE,
    "sprecher:juno:weg-maple-cedar.tafel@wegMapleCedar.landstrasse": MITREISENDE,
}
