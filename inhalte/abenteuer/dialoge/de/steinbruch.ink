// Alter Steinbruch bei Ironwood (Nebenort N3, Akt 2): Fundstellen der Sammelstränge (Runde 6).
//
// Einstieg wie in orte.json: finch_bauer_f (Finch-Jagd, Dokument 15, 1.1 und Tabelle in 3;
// Feld in steinbruch.grube laut orte/ironwood.md 3.3). gefundenFinchBauerF setzt die Hülle nach gibFund.

EXTERNAL gibFund(kennung)

VAR gefundenFinchBauerF = false

=== finch_bauer_f ===
{gefundenFinchBauerF:
    Am Fels ist nur noch ein Fink aus Kreide zu sehen. #sprecher:erzaehler
    -> END
}
Am Fels ist ein kleiner Fink mit Kreide gezeichnet. Darunter, zwischen zwei Steinen, liegt ein weißer Bauer aus hellem Holz. #sprecher:erzaehler
~ gibFund("finchBauerF")
-> END
