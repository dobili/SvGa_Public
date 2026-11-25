"""Angesehene Kandidaten des Werkzeugs pipeline/abenteuer/lageangabe.py, jeder mit Grund.

Schlüssel: „Prüfung:Figur:Datei.Knoten“ (Prüfungen siehe ``lageangabe.PRUEFUNGEN``).

- ``GEPRUEFT``: Die Stelle passt, obwohl das Werkzeug sie meldet (eine andere Person ist gemeint,
  Rückblick, kleiner Gegenstand, das Bild zeigt den Gegenstand).
- ``GEMELDET``: Bericht, noch nicht behoben: Bildwünsche (das Figurenbild zeigt den Gegenstand nicht)
  und Sitzplätze, die eine Karte brauchen (Figur auf den Stuhl daneben setzen; Bänke und
  Sitzrichtung bearbeitet mittel-3). Die Zahl hält der Dauertest mit einer Obergrenze, die nur sinken
  darf (pipeline/tests/test_abenteuer_lageangabe.py).

Stand 26.11.2026 (mittel-2). Akt 1 ist vollständig: Nia steht halb auf der Landstraße, der Wanderer
am Wegrand statt mitten auf der Straße, Victor steht an der Haltestelle von Cedar Creek (Text).
Außerhalb von Akt 1 sind fünf Sätze an die Karte angepasst (Pepe, Edna, Old Pete, Hollis, Dale).
"""

KLEIN = "Kleiner Gegenstand in der Hand, im Figurenbild nicht darstellbar und nicht nötig."
STUHL = "Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da."

GEPRUEFT: dict[str, str] = {
    # Akt 1
    "sitzt:coachDelgado:maple-falls-clubraum.coach_erstes_treffen": (
        "„Am Fenster sitzt ein Junge … das ist Sam“: gemeint ist Sam, und Sam sitzt (Szene sitzt rechts)."
    ),
    "bild:junoClub:maple-falls-clubraum.coach_reihe_offen": KLEIN + " (Heft)",
    "bild:coachDelgado:maple-falls-clubraum.pratt_und_heimweg": (
        "Der Hausmeister (Pratt) hält den Lappen, nicht Coach Delgado; Lappen ist ein kleiner Gegenstand."
    ),
    "bild:coachDelgado:maple-falls-clubraum.victor_trifft": (
        "„Ein Mann steigt aus“ ist Graham Hale vor der Schule, nicht Coach Delgado."
    ),
    # Akt 2 bis 4: andere Person, Rückblick, kleiner Gegenstand, Bild zeigt es
    "bild:pepe:bayou.pepe_erstes": KLEIN + " (Streichholz)",
    "bild:grahamHale:capital-arena-halle.aussage_victor": KLEIN + " (Telefon)",
    "bild:victor:capital-arena-halle.aussage_victor": (
        "Der Satz handelt von Graham Hale (Telefon), nicht von {rivale}."
    ),
    "bild:victor:capital-arena-halle.vor_dem_finale": "Verneinung: „Graham hält kein Telefon in der Hand.“",
    "bild:wanderer:capital-arena-aussen.wanderer_buch": (
        "Übergabe im Gespräch: Er zeigt das gebundene Bündel, das er gleich weitergibt; kein Dauerzustand."
    ),
    "bild:tomas:desert-springs-garage.tomas_erstes_treffen": KLEIN + " (Schraubenschlüssel)",
    "bild:dash:silicon-bay-aussen.dash_erstes_treffen": KLEIN + " (Burrito)",
    "bild:earl:weg-desert-summit.earl_k": KLEIN + " (Glasrohr, das er gerade dreht)",
    "bild:remy:port-delacroix-turnhalle.odile_hand": "Das Bild zeigt Remy mit dem Instrument in der Hand.",
    "bank:victor:ironwood-aussen.victor": (
        "Rückblick: „wo {rivale} saß“; die Bank ist leer, {rivale} ist fort."
    ),
    "tuer:schiffskoch:weg-silicon-delacroix.ruiz_erstes_treffen": (
        "„Mama lehnt in der Tür“ spielt bei der Ankunft in Port Delacroix, nicht auf der Fähre."
    ),
    "sitzt:turnierleiterin:capital-arena-halle.runde3_vorher": (
        "„Sie sitzt schon da“ meint Nova (eigener Eintrag), nicht die Turnierleiterin."
    ),
}

GEMELDET: dict[str, str] = {
    # Bildwünsche: Das Figurenbild zeigt den Gegenstand nicht (Bilder angesehen am 26.11.2026).
    "bild:gegnerin:weg-maple-cedar.nia_erstes_treffen": (
        "Bildwunsch: Nia mit Skateboard unter dem Arm (Schachbrett auf dem Board); ihr Bild zeigt "
        "Stirnband und lila Oberteil, aber kein Board."
    ),
    "bild:kira:hochebene.kira_regel": "Bildwunsch: Kira mit Basketball unter dem Arm (Bild ohne Ball).",
    "bild:theo:crossroads-raststaette.theo": "Bildwunsch: Theo mit Bildschirm unter dem Arm (Bild ohne).",
    "bild:tamsin:riverton-pavillon.tamsin_erstes_treffen": "Bildwunsch: Tamsin mit Schachuhr (Bild ohne).",
    "bild:victor:ironwood-aussen.kauf": "Bildwunsch: {rivale} mit Tablet unter dem Arm (Bild ohne).",
    "bild:ezra:pinewood-camp-aussen.ezra": (
        "Bildwunsch oder Text: Ezra hat im Bild eine Gitarre, keine Pfeife und kein Klemmbrett."
    ),
    # Sitzen mit Stuhl in der Nähe: Karte (Sitzplatz und Sitzrichtung, mit mittel-3 abstimmen).
    "sitzt:victor:capital-arena-halle.finale_angebot": STUHL + " (ca7StuhlLinks am Finaltisch)",
    "sitzt:kade:capital-arena-halle.kade": STUHL + " (ca7Stuhl am Tisch bei Nova)",
    "sitzt:nova:capital-arena-halle.runde3_vorher": STUHL + " (Tisch eins)",
    "sitzt:nova:crossroads-raststaette.nova_bitte": STUHL + " (cr7Hocker in der Ecke)",
    "sitzt:mira:desert-springs-garage.mira_clubkampf": STUHL + " (Reifenstapel dsReifen)",
    "sitzt:mira:desert-springs-garage.mira_erinnerung": STUHL + " (Reifenstapel dsReifen)",
    "sitzt:tamsin:riverton-pavillon.tamsin_eli": STUHL + " (Kisten am Tisch)",
    "sitzt:lin:silicon-bay-akademie.lin_nach_sieg": STUHL + " (sb8StuhlRuecken am Brett)",
    "sitzt:nova:silicon-bay-akademie.nova_erstes_treffen": STUHL
    + " (Fassung ohne Ansprechen: sitzt am Ringlicht)",
    "sitzt:haraldsen:summit-city-huette.haraldsen_reihe": STUHL + " (Ohrensessel am Kamin)",
    "sitzt:kit:summit-city-huette.kit_reihe": STUHL + " (mf2StuhlL am Clubtisch)",
    "sitzt:wanderer:weg-ghost-capital.wanderer_erstes": STUHL + " (Hocker; Text sagt Bank: Bank oder Text)",
    "sitzt:wanderer:weg-ghost-capital.wanderer_seiten": STUHL + " (wie wanderer_erstes)",
    # Sitzen ohne Möbel: Stufen, Geländer, Parkbank in der Hütte (Karte oder Text, Entscheidung offen).
    "sitzt:wanderer:capital-arena-aussen.wanderer": (
        "Sitzt laut Text auf den Stufen, keine Stufen nah: am Boden sitzen lassen oder Text „steht“."
    ),
    "sitzt:slick:crossroads-aussen.slick": (
        "Sitzt laut Text auf den Stufen vor dem Speisewagen: am Boden sitzen lassen (sitzboden) oder Text."
    ),
    "sitzt:victor:summit-city-bergstation.victor_bergstation": (
        "{rivale} sitzt am Geländer, Knie angezogen (Tiefpunkt): Karte am Boden sitzen lassen, Text behalten."
    ),
    "bank:ward:summit-city-huette.ward_lektion": (
        "Text sagt „Parkbank“, Ward sitzt in der Hütte ohne Bank: Wort anpassen (Bank am Kamin) "
        "oder eine Bank stellen."
    ),
}
