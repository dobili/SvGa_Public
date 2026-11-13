# Abkürzungen abseits des Wegs (R030, R031), Stand 11.11.2026

Prüfung: `python -m pipeline.abenteuer.abkuerzung` (`pipeline/abenteuer/abkuerzung.py`, warnt nur).
Verglichen wird je Paar von Übergängen am Kartenrand der kürzeste Weg über Wegboden mit dem
kürzesten Weg querfeldein. Lage in Kacheln (x, y) ab oben links.

- **Abkürzung:** querfeldein höchstens 85 % so lang wie über den Weg und mindestens 6 Felder kürzer.
- **Umgehung** (nur Orte der Art „weg“): Man kommt ans Ziel, ohne den Weg zu benutzen.
- **Weg gesperrt, aber umgehbar:** Ein Möbel sperrt den Weg, querfeldein kommt man trotzdem durch
  (eine Sperre der Geschichte wirkt dann nicht).
- **Kein durchgehender Weg:** Die beiden Übergänge verbindet kein Wegboden.

Ausnahme für offenes Gelände ohne Sperre der Geschichte: `"abkuerzung_ok": "offenesGelaende"` in der
Szene (für einen Platz `"platz"`).
Beheben heißt: Wald, Fels, Zaun oder Wasser lückenlos setzen, oder den Weg so führen, dass er der
kürzeste ist. Abstecher zu Fundstellen bleiben erlaubt, solange sie nicht von Rand zu Rand führen.

## mittel-1

- **cedarCreek.aussen**
  - flussweg → zedernpfad: Abkürzung querfeldein, 16 statt 35 Felder (etwa über (1, 12))
  - zedernpfad → zedernwald: Abkürzung querfeldein, 65 statt 85 Felder (etwa über (39, 3))
- **wegCedarRiverton.bahndamm**
  - weiterRiverton → zurueckZedernwald: Weg bei (128, 19) gesperrt (wc8PlakatwandPM), aber umgehbar (154 Felder querfeldein)

## Haupt-Chat verteilt

- **crossroads.aussen**
  - jahrmarkt → wegSummit: Abkürzung querfeldein, 45 statt 63 Felder (etwa über (19, 11))
  - wegPinewood → wegSummit: Abkürzung querfeldein, 44 statt 55 Felder (etwa über (18, 12))
- **portDelacroix.aussen**
  - bayou → deich: Abkürzung querfeldein, 126 statt 195 Felder (etwa über (57, 50))
- **wegCrossroadsPinewood.riesenbaeume**
  - weiterCamp → zurueckHuetten: Weg bei (22, 50) gesperrt (cp7Rangerhaus), aber umgehbar (149 Felder querfeldein)
- **wegDelacroixDesert.canyonpfad**
  - sternwarte → weiterFelsbogen: Weg bei (25, 17) gesperrt (dd6Saguaro), aber umgehbar (49 Felder querfeldein)
- **wegDelacroixDesert.felsbogen**
  - weiterDesert → zurueckCanyon: kein durchgehender Weg (168 Felder querfeldein)
  - weiterDesert → zurueckCanyon: Umgehung ohne den Weg (168 Felder, etwa über (62, 22))
- **wegDesertSummit.diner**
  - weiterBergstrasse → zurueckDesert: Umgehung ohne den Weg (173 Felder, etwa über (76, 3))
- **wegGhostCapital.leuchtturm**
  - weiterCapital → zurueckSeeufer: Weg bei (61, 16) gesperrt (gc7Leuchtturm), aber umgehbar (142 Felder querfeldein)
  - weiterCapital → zurueckSeeufer: Umgehung ohne den Weg (151 Felder, etwa über (70, 21))
- **wegGhostCapital.seeufer**
  - weiterLeuchtturm → zurueckGhost: kein durchgehender Weg (150 Felder querfeldein)
  - weiterLeuchtturm → zurueckGhost: Umgehung ohne den Weg (153 Felder, etwa über (72, 18))
- **wegIronwoodSilicon.glasbruecke**
  - weiterSilicon → zurueckRaststaette: kein durchgehender Weg (146 Felder querfeldein)
- **wegSummitCrossroads.geysirbecken**
  - weiterPraerie → zurueckSummit: kein durchgehender Weg (181 Felder querfeldein)
- **wegSummitCrossroads.praerie**
  - weiterCrossroads → zurueckGeysirbecken: Umgehung ohne den Weg (200 Felder, etwa über (24, 84))
- **crossroads.aussen (crossroads-aussen-gatter-offen)**
  - jahrmarkt → wegSummit: Abkürzung querfeldein, 45 statt 63 Felder (etwa über (19, 11))
  - wegPinewood → wegSummit: Abkürzung querfeldein, 44 statt 55 Felder (etwa über (18, 12))
- **portDelacroix.aussen (port-delacroix-aussen-musikhaus-neu)**
  - bayou → deich: Abkürzung querfeldein, 126 statt 195 Felder (etwa über (57, 50))
- **wegDesertSummit.diner (weg-desert-summit-diner-neon)**
  - weiterBergstrasse → zurueckDesert: Umgehung ohne den Weg (173 Felder, etwa über (76, 3))

## niedrig-1

- **mapleFalls.park**
  - park → zedernpfad: Abkürzung querfeldein, 25 statt 58 Felder (etwa über (10, 11))
- **mapleFalls.park (maple-falls-park-schulbus)**
  - park → zedernpfad: Abkürzung querfeldein, 25 statt 58 Felder (etwa über (10, 11))
- **mapleFalls.park (maple-falls-park-steg-neu)**
  - park → zedernpfad: Abkürzung querfeldein, 25 statt 58 Felder (etwa über (10, 11))

## mittel-3

- **wegMapleCedar.flussweg**
  - weiterCedar → zurueckLandstrasse: Umgehung ohne den Weg (126 Felder, etwa über (57, 11))
- **wegMapleCedar.landstrasse**
  - kuerbishof → weiterFluss: Weg bei (53, 11) gesperrt (wg4Tor2), aber umgehbar (108 Felder querfeldein)
  - kuerbishof → zurueckPark: Weg bei (52, 11) gesperrt (wg4Tor1), aber umgehbar (67 Felder querfeldein)
- **wegMapleCedar.zedernpfad**
  - zedernWeiterCedar → zedernZurueckPark: Weg bei (40, 12) gesperrt (wg9SturmholzFlach), aber umgehbar (106 Felder querfeldein)
  - zedernWeiterCedar → zedernZurueckPark: Umgehung ohne den Weg (114 Felder, etwa über (51, 13))
- **wegMapleCedar.landstrasse (weg-maple-cedar-landstrasse-flohmarkt-leer)**
  - kuerbishof → weiterFluss: Weg bei (53, 11) gesperrt (wg4Tor2), aber umgehbar (108 Felder querfeldein)
  - kuerbishof → zurueckPark: Weg bei (52, 11) gesperrt (wg4Tor1), aber umgehbar (67 Felder querfeldein)

## Schon behoben (mittel-2)

- `summitCity.aussen`: Zwischen den beiden Südausgängen lag offene Wiese (22 statt 70 Felder). Jetzt
  verbindet der Weg beide auf Reihe 46 und 47, ein Weidezaun (x 45, y 48 bis 58) trennt die Wiese.
- `riverton.aussen` (alle Zustände): Ein Busch stand auf dem Weg vom Bahndamm (16, 11); versetzt.
- `pinewoodCamp.aussen`: Der Weg vom Nordeingang ist jetzt mit dem Feuerplatz verbunden.
- Ausnahme `abkuerzung_ok` gesetzt (offenes Gelände, keine Sperre der Geschichte am Weg):
  `wegPinewoodGhost.staubstrasse`, `wegPinewoodGhost.canyonrand`, `hochebene.felsentuerme`.
  Bitte widersprechen, wenn dort doch nur der Weg begehbar sein soll.
