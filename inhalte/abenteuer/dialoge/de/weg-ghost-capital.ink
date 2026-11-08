// Weg 11 von Ghost Town zur Capital Arena: Karten „Seeufer“ und „Leuchtturm“ (Akt 4, Szene 102 der
// Story-Bibel, Abschnitt 28 und 29; Landschaft L7 König der Hügel).
//
// Stationen (W4): Leuchtturmwärter Abe Lindgren mit „König der Hügel“ (Variante, noch ohne Technik:
// Abe erklärt sie nur), Rätseltafel am Seeufer (Runde wegGhostCapital.tafel, Königsaktivität im
// Endspiel), Fund Leuchtturmlinse. Einstiege wie in orte.json: abe, zurueck_ghost, tafel,
// fund_linse. Die Ankunft erzählt capital-arena-aussen.ankunft_zu_fuss.
//
// Variablen: wegGhostCapitalTafelBestanden setzt die Hülle (R42), die übrigen setzt diese Datei.
// Den Fund merkt sich Ink zusätzlich selbst.

EXTERNAL beginneAufgaben(runde)
EXTERNAL gibFund(kennung)

VAR wegGhostCapitalTafelBestanden = false
VAR abeGetroffen = false
VAR linseGefunden = false

// ---------------------------------------------------------------- Abe am Leuchtturm

=== abe ===
{abeGetroffen:
    {~Bei Sturm suchen die Kapitäne das Licht. Bei dir ist es die Mitte.|Der Turm ist hundert Jahre alt. Die Stufen auch. Ich zähle sie jeden Tag.|Viel Glück in der Arena. Bring den König zum Leuchtturm.} #sprecher:abe
    -> END
}
~ abeGetroffen = true
Vor dem rot-weißen Leuchtturm sitzt ein alter Mann mit Mütze und flickt ein Netz. #sprecher:erzaehler
Abe Lindgren, Wärter. Früher suchten die Kapitäne bei Sturm den Hafen. Ich habe ihnen geleuchtet. #sprecher:abe
Wir spielen hier König der Hügel. Wer seinen König in die Mitte bringt, gewinnt. #sprecher:abe
Der König muss zum Leuchtturm. Wie wir alle. #sprecher:ambrose #stimmung:friedlich
-> END

// ---------------------------------------------------------------- Rätseltafel, Fund und Rückweg

=== tafel ===
{wegGhostCapitalTafelBestanden:
    Auf der Tafel am Steg hat jemand mit Kreide einen Leuchtturm gemalt. Darunter: „Gelöst“. #sprecher:erzaehler
    -> END
}
Am Steg hängt eine Tafel mit drei Diagrammen: „Im Endspiel ist der König eine Figur. Bring ihn nach vorn!“ #sprecher:erzaehler
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegGhostCapital.tafel")
    -> END
* [Weitergehen]
    -> END

=== fund_linse ===
{linseGefunden:
    Im Wärterhaus liegt nur noch ein altes Logbuch. #sprecher:erzaehler
    -> END
}
~ linseGefunden = true
Im Wärterhaus liegt eine alte Linse aus dickem Glas, so groß wie ein Teller. #sprecher:erzaehler
Die hat hundert Schiffe heimgebracht. Nimm sie mit. Ich hab eine neue. #sprecher:abe
~ gibFund("leuchtturmlinse")
-> END

=== zurueck_ghost ===
Der Weg führt zurück nach Süden, nach Ghost Town. #sprecher:erzaehler
-> END
