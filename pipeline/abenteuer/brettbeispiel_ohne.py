"""Fundstellen ohne Brettbeispiel, je Datei und Knoten mit Grund (zu ``brettbeispiel.py``).

Warum eigene Datei: Die Liste ist Inhalt, keine Logik, und wächst mit dem Spiel. Gründe:
- „Partie läuft“: Das echte Brett der Partie steht da; ein zweites Brett verdeckte es.
- „Rätsel folgt“: Ein Brett verriete die Lösung der Runde, die gleich beginnt.
- „Vergleich“: Der Begriff ist ein Bild im Alltag (Gabel beim Fischen, Turm hinter der Lore).
- „Zufallszeile“: Eine Zeile mit Wechseltexten ({~a|b}); die Marke gälte für alle Fassungen.
  Das Beispiel steht dort, wo die Figur das Konzept zum ersten Mal erklärt.
- „kein Erklären“: Der Begriff fällt nebenbei (Name, Ratschlag, Erzählung).
Stand 22.11.2026 (Bestandsaufnahme mittel-3).
"""

PARTIE = "Partie läuft: Das echte Brett steht da"
RAETSEL = "Rätsel folgt: Ein Brett verriete die Lösung"
VERGLEICH = "Vergleich im Alltag, keine Erklärung am Brett"
ZUFALL = "Zufallszeile; das Beispiel steht bei der ersten Erklärung"
NEBENBEI = "kein Erklären: Der Begriff fällt nebenbei"
VARIANTE = "Spielvariante mit eigenen Figuren, die der Figurensatz nicht hat"

OHNE: dict[tuple[str, str], str] = {
    ("capital-arena-halle.ink", "halbfinale_turm"): PARTIE,
    ("capital-arena-halle.ink", "marcus"): NEBENBEI + " (Marcus stellt sich vor)",
    ("capital-arena-halle.ink", "pause_nach_runde2"): NEBENBEI + " (Rückblick auf Partien)",
    ("capital-arena-halle.ink", "vor_dem_finale_mama"): NEBENBEI + " (Ratschlag vor dem Finale)",
    ("capital-arena-halle.ink", "vorrunde_naechste"): NEBENBEI + " (Erzähler stellt Gegner vor)",
    ("cedar-creek-bibliothek.ink", "clubkampf_bauer"): PARTIE,
    ("cedar-creek-bibliothek.ink", "mae_alltag"): ZUFALL,
    ("cedar-creek-waschsalon.ink", "boateng_alltag"): ZUFALL,
    ("crossroads-aussen.ink", "rosie"): VERGLEICH + " (scharf wie ein Doppelangriff)",
    ("crossroads-raststaette.ink", "tisch_nach_partie"): NEBENBEI + " (Rat nach der Partie)",
    ("crossroads-raststaette.ink", "varianten_tisch"): NEBENBEI + " (Erzähler am Variantentisch)",
    ("desert-springs-antiquariat.ink", "okoro_kiste"): RAETSEL + " (Siegelstellung)",
    ("desert-springs-garage.ink", "clubkampf_sturm"): PARTIE,
    ("desert-springs-garage.ink", "mira_erinnerung"): "Erinnerung mit eigenem Bild (#bild:stellung18)",
    ("desert-springs-garage.ink", "mira_nach_erinnerung"): PARTIE,
    ("ghost-town-saloon.ink", "victor_aufstellen"): "Die Fernpartie wird gleich am echten Brett nachgespielt",
    ("goldmine.ink", "lore"): VERGLEICH + " (Turm hinter der Lore)",
    ("hochebene.ink", "kira_alltag"): ZUFALL,
    ("hochebene.ink", "kira_regel"): VARIANTE + " (Falke und Bison)",
    ("summit-city-aussen.ink", "drachenfest_angebot"): VARIANTE + " (Drache; die Partie folgt gleich)",
    ("ironwood-kantine.ink", "big_joe_alltag"): ZUFALL,
    ("ironwood-kantine.ink", "big_joe_clubkampf"): NEBENBEI + " (Zuruf im Clubkampf)",
    ("ironwood-kantine.ink", "big_joe_nach_sieg"): NEBENBEI + " (Rückblick)",
    ("ironwood-kantine.ink", "big_joe_reihe_offen"): NEBENBEI + " (stellt Hank und Priya vor)",
    ("ironwood-kantine.ink", "clubkampf_stimmt_es"): PARTIE,
    ("ironwood-kantine.ink", "hank_reihe"): RAETSEL + " (Fesselungen)",
    ("ironwood-kantine.ink", "hank_reihe_danach"): NEBENBEI + " (nach der Runde)",
    ("ironwood-kantine.ink", "mama_alltag"): ZUFALL,
    ("ironwood-kantine.ink", "priya"): ZUFALL + " (Spieß bei Big Joe gezeigt)",
    ("ironwood-kantine.ink", "priya_reihe"): RAETSEL + " (Spieße)",
    ("ironwood-kantine.ink", "priya_reihe_danach"): NEBENBEI + " (nach der Runde)",
    ("ironwood-museum.ink", "postsack"): RAETSEL + " (Siegelstellung als #bild)",
    ("kuerbishof.ink", "kuerbiswaage"): VERGLEICH + " (Bauer kurz vor der Umwandlung)",
    ("lockport-aussen.ink", "kai_auswahl"): VERGLEICH + " (beim Angeln)",
    ("maple-falls-aussen.ink", "lily_alltag"): ZUFALL,
    ("maple-falls-park.ink", "bibliothekar_brief"): NEBENBEI + " (Ambrose liest einen Brief)",
    ("maple-falls-wohnzimmer.ink", "mutter_alltag"): ZUFALL,
    ("port-delacroix-musikhaus.ink", "blaeser_alltag"): ZUFALL,
    (
        "port-delacroix-musikhaus.ink",
        "blaeser_regel",
    ): "Rochade in Schach960: Grundreihe ist gezeigt, die Rochade folgt im Spiel",
    ("port-delacroix-musikhaus.ink", "blaeser_set1"): RAETSEL + " (Set folgt mit eigener Grundreihe)",
    ("port-delacroix-musikhaus.ink", "set1_danach"): NEBENBEI,
    ("port-delacroix-musikhaus.ink", "set2_danach"): NEBENBEI,
    ("port-delacroix-musikhaus.ink", "set3_danach"): NEBENBEI,
    ("port-delacroix-turnhalle.ink", "odile_nach_partie"): NEBENBEI + " (Rückblick)",
    ("riverton-pavillon.ink", "ray_mulde"): VERGLEICH + " (zwei Briefe; Gabel im Pavillon gezeigt)",
    ("summit-city-aussen.ink", "drachenfest_regel"): VARIANTE + " (Drache)",
    ("summit-city-bergstation.ink", "victor_gabel"): PARTIE,
    (
        "summit-city-huette.ink",
        "haraldsen_karte",
    ): "Partiekarte; Turm hinter dem Freibauern zeigt Haraldsen in seiner Reihe",
    (
        "summit-city-huette.ink",
        "kit_karte",
    ): "Partiekarte mit Aufzählung; Quadrat und Opposition sind gezeigt",
    ("summit-city-huette.ink", "kit_reihe"): "Aufzählung nach dem Quadrat; Opposition zeigt Ward",
    ("summit-city-huette.ink", "victor_krise"): PARTIE,
    ("weg-cedar-riverton.ink", "tafel"): RAETSEL + " (Tafel mit drei Diagrammen)",
    ("weg-delacroix-desert.ink", "holloway"): VERGLEICH + " (Wanderin am Wasserrohr, kein Brett)",
    ("weg-ghost-capital.ink", "odette_danach"): ZUFALL,
    ("weg-ghost-capital.ink", "odette_erstes"): NEBENBEI + " (Gambit heißt ihr Wohnmobil)",
    ("weg-ghost-capital.ink", "weltschachtag_danach"): ZUFALL,
    ("weg-maple-cedar.ink", "ereignis_flohmarkt"): NEBENBEI + " (Wohnmobil Gambit)",
    ("weg-maple-cedar.ink", "flohmarkt_angebot"): RAETSEL + " (Matt in einem Zug)",
    ("weg-maple-cedar.ink", "flohmarkt_rueckmeldung"): NEBENBEI + " (nach dem Rätsel)",
    ("weg-riverton-ironwood.ink", "kreidespringer_geloest"): "Das Rätsel ist eben gelöst, sein Brett war da",
    ("weg-summit-crossroads.ink", "bell_regel_erstmals"): VARIANTE
    + " (Atomschach; Zählen zeigt Ambrose in der Wüste)",
}
