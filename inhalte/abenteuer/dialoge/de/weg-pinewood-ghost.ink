// Weg 10 vom Pinewood Camp nach Ghost Town: Karten „Canyonrand“ und „Staubstraße“ (Akt 4, Szene 97
// der Story-Bibel, Abschnitt 28 und 29; Landschaft L3 Echo Canyon).
//
// Stationen (W4): Kletterin Juniper mit Drei-Schach (Variante, noch ohne Technik: Juniper erklärt
// sie nur), Rätseltafel am Canyonrand (Runde wegPinewoodGhost.tafel, drei Aufgaben mit Schach).
// Einstiege wie in orte.json: juniper, zurueck_camp, tafel. Die Ankunft erzählt
// ghost-town-aussen.ankunft_zu_fuss.
//
// Variablen: wegPinewoodGhostTafelBestanden setzt die Hülle (R42), die übrigen setzt diese Datei.

EXTERNAL beginneAufgaben(runde)

VAR wegPinewoodGhostTafelBestanden = false
VAR juniperGetroffen = false

// ---------------------------------------------------------------- Juniper am Canyonrand

=== juniper ===
{juniperGetroffen:
    {~Drei Schachs, drei Echos. Dann ist die Partie vorbei.|Das Seil hält. Das Brett auch.|Hinter der Staubstraße liegt Ghost Town. Niemand wohnt da. Fast niemand.} #sprecher:juniper
    -> END
}
~ juniperGetroffen = true
Am Canyonrand hängt eine Frau im Seil und winkt. Unten auf einem Felsvorsprung steht ein Brett. #sprecher:erzaehler
Juniper. Wir Kletterer spielen hier Drei-Schach. Wer dreimal Schach gibt, gewinnt. #sprecher:juniper
Bei jedem Schach rufen wir laut. Wenn das dritte Echo verklungen ist, ist Schluss. #sprecher:juniper
Drei Schachs, und keiner muss matt sein. Wie ungeduldig. Und wie lustig. #sprecher:ambrose #stimmung:lacht
-> END

// ---------------------------------------------------------------- Rätseltafel und Rückweg

=== tafel ===
{wegPinewoodGhostTafelBestanden:
    Auf der Tafel am Canyonrand steht in Kreide: „Gelöst. Echo!“ #sprecher:erzaehler
    -> END
}
An einem Pfosten am Canyonrand hängt eine Tafel mit drei Diagrammen: „Ein Schach mit Folgen. Findest du es?“ #sprecher:erzaehler
* [Die Aufgaben lösen]
    ~ beginneAufgaben("wegPinewoodGhost.tafel")
    -> END
* [Weitergehen]
    -> END

=== zurueck_camp ===
Der Pfad führt zurück in den Wald, zum Pinewood Camp. #sprecher:erzaehler
-> END
