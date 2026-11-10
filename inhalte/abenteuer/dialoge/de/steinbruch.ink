// Nebenort N3 Alter Steinbruch bei Ironwood (Akt 2): Ansehen Graffiti und Bagger, Finch-Figur Bauer F.
// Die Sperre S4 (Laterne) sitzt am Übergang in Ironwood (mittel-2).
VAR held = "Du"

// >>> Runde 6 (mittel-4)
EXTERNAL gibFund(kennung)
VAR gefundenFinchBauerF = false

=== fund_finch_bauer_f ===
{gefundenFinchBauerF:
    Am Fels ist nur noch der Fink aus Kreide. #sprecher:erzaehler
    -> END
}
~ gefundenFinchBauerF = true
Am Fuß der Felswand ist ein Fink aus Kreide gemalt. In einer Ritze darunter steckt ein weißer Bauer aus Buchsbaum. #sprecher:erzaehler
~ gibFund("finchBauerF")
-> END

=== graffiti ===
Ein Wolf aus Sprühfarbe an der Felswand, daneben eine Krone. Jemand war hier, lange bevor {held} kam. #sprecher:erzaehler
-> END

=== bagger ===
Ein alter Bagger, die Schaufel im Schotter. Seit Jahren hat ihn niemand bewegt. Auf dem Sitz liegt ein Vogelnest. #sprecher:erzaehler
-> END
// <<< Runde 6 (mittel-4)
