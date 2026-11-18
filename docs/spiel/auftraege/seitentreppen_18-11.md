# Seitliche Treppen in Innenräumen (18.11.2026, mittel-2)

Auftrag des Hauptchats: Innenräume suchen, in denen eine quer ansteigende Treppe (`treppeNachRechts`,
`treppeNachLinks`, 64 × 64, aus `pipeline/abenteuer/seitentreppe.py`) besser passt als die bisherige,
und sie dort setzen, wo es eindeutig ist (Regel 9, Widerspruch genügt). Sonst eine Vorschlagsliste.

Durchgesehen: alle 18 Innenszenen mit einer Treppe nach oben oder einem Treppenloch (Katalogart
`treppe`) und alle Beschreibungen mit Galerie, Empore, Obergeschoss, Balkon oder Treppe.

## Umgesetzt

**Saloon in Ghost Town** (`ghost-town-saloon`): Die gerade Treppe in der Nordostecke (`gt7Treppe`)
ist jetzt eine Seitentreppe (`treppeNachRechts` auf 15,2). Sie steigt an der Nordwand vom Klavier
nach rechts zur Ecke an und führt dort durch die Decke zu den Zimmern. So steht die Treppe im
Western-Saloon üblicherweise an der Wand. Sie hat keinen Auslöser, sie ist nur Kulisse.
Das Postreiterabzeichen liegt laut Beschreibung „an ihrem Fuß im Dunkel“. Es ist deshalb mit
seinem Auslöser von 18,6 an den neuen Fuß auf 14,4 gewandert. Die Beschreibung ist angepasst.
Prüfungen: Kartenbau in Ordnung, Treppenloch 0 Befunde, Übergänge in Ordnung, keine Figur
versperrt einen Weg, die Ausgabe der Kopfkachel-Prüfung ist unverändert.

## Nicht umgesetzt (Vorschläge, nicht eindeutig)

1. **Laden in Ghost Town** (`ghost-town-laden`): Die Treppe steht an der Ostwand und steigt nach
   Norden, wie es die Beschreibung verlangt („Hinten an der Ostwand …“). Neun Auslöser `treppe`
   führen in die Erinnerung „Die letzte Kerze, 1866“. Eine Seitentreppe an der Nordwand ginge,
   dann müssten aber der Ofen und das Fenster weichen und die Auslöser umziehen. Vorschlag: so
   lassen.
2. **Archiv und Bibliothek in Cedar Creek**: Die Kellertreppe im Archiv (`cc4Treppe`) ist das
   Gegenstück zum Treppenloch in der Bibliothek. Dort liegt dieselbe Treppe zu 25 % durchsichtig im
   Loch (KARTENREGELN 10.89). Eine Seitentreppe hieße, beide Räume und das Loch umzubauen.
   Vorschlag: nur, wenn der Autor die Kellertreppe quer haben möchte.
3. **Wohnzimmer und Zimmer in Maple Falls**: Hier gilt dasselbe Gegenstück-Paar (`mf4Treppe` und
   das Treppenloch im Zimmer). Das Haus ist vom Autor abgestimmt und Akt 1. Vorschlag: so lassen.
4. **Für später**: Räume mit Galerie gibt es noch nicht. Wenn einer dazukommt (etwa ein Theater,
   die Bibliothek mit Empore oder ein Lagerhaus mit Zwischenboden), ist die Seitentreppe dort
   die erste Wahl.
