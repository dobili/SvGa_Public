// Nebenort N3 Alter Steinbruch bei Ironwood (Akt 2): Ansehen Graffiti und Bagger, Finch-Figur Bauer F.
// Die Sperre S4 (Laterne) sitzt am Übergang in Ironwood (mittel-2).
VAR held = "Du"

// >>> Runde 6 (mittel-4)
VAR finchFiguren = 0
EXTERNAL gibFund(kennung)
VAR gefundenFinchBauerF = false
// Zähl-Merker der Sammelstücke (Chaos-Prüfung, 14.11.2026): gesetzt erst zusammen mit dem
// Zähler und dem Fund, damit Abbrechen oder Neuladen kein Stück verliert.
VAR finchBauerFGezaehlt = false

=== finch_bauer_f ===
{finchBauerFGezaehlt:
    Am Fels ist nur noch der Fink aus Kreide. #sprecher:erzaehler
    -> END
}
Am Fuß der Felswand ist ein Fink aus Kreide gemalt. In einer Ritze darunter steckt ein weißer Bauer aus Buchsbaum. #sprecher:erzaehler
~ finchBauerFGezaehlt = true
~ finchFiguren = finchFiguren + 1
~ gibFund("finchBauerF")
-> END

=== graffiti ===
Ein Wolf aus Sprühfarbe an der Felswand, daneben eine Krone. Jemand war hier, lange bevor du kamst. #sprecher:erzaehler
-> END

=== bagger ===
Ein alter Bagger, die Schaufel im Schotter. Seit Jahren hat ihn niemand bewegt. #sprecher:erzaehler
Auf dem Sitz liegt ein Vogelnest. #sprecher:erzaehler
-> END
// <<< Runde 6 (mittel-4)
