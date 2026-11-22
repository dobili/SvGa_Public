// Ort: Der Laden in Ghost Town (Akt 4): verstaubter Gemischtwarenladen gegenüber dem Saloon,
// Theke mit Kasse und Waage, leere Regale, hinten an der Ostwand die Treppe zum Zimmer darüber
// (Ortsdokument ghost-town.md, Abschnitte 1.0 und 1.3).
//
// Szene 99 der Story-Bibel (Abschnitt 29): Nach dem Fund des Postreiterabzeichens
// (ghost-town-saloon.fund_abzeichen) führt die Treppe in der Nacht in das Zimmer über dem Laden und
// von dort in die Erinnerung „Die letzte Kerze, 1866“ (erinnerung-siedlung.ink). Den Wechsel
// macht der Übergang `treppe` in orte.json (wenn: abzeichenGefunden und nicht kerzeGesehen).
// Einstiege wie in orte.json: treppe.
//
// Variablen: abzeichenGefunden setzt ghost-town-saloon.ink, kerzeGesehen erinnerung-siedlung.ink.

VAR abzeichenGefunden = false
VAR kerzeGesehen = false

// Treppe hinten im Laden. Vor dem Fund ist oben nur ein leeres Zimmer; nach dem Fund führt sie in
// die Erinnerung (Kapitel 57: Fetzen Rosentapete, Bettgestell aus Eisen); danach ist es wieder leer.
=== treppe ===
{
- kerzeGesehen:
    Oben ist das Zimmer leer. In der Ecke hängt der Fetzen Rosentapete. #sprecher:erzaehler
    Du lässt ihn hängen. #sprecher:erzaehler
    -> END
- not abzeichenGefunden:
    Die Treppe knarrt, aber sie hält. Oben ein leeres Zimmer, ein Bettgestell aus Eisen, Staub. #sprecher:erzaehler
    Du gehst wieder hinunter. #sprecher:erzaehler
    -> END
}
Die Stufen halten. Oben fällt Mondlicht durch ein Fenster ohne Glas auf ein Bettgestell aus Eisen. #sprecher:erzaehler #licht:nacht #uhr:nacht
In einer Ecke hängt ein Fetzen Tapete, groß wie deine Hand. Rosen. #sprecher:erzaehler #bild:tapete_rosen
Du legst die Hand darauf. #sprecher:erzaehler
Hier war es. #sprecher:ambrose #stimmung:still #bild:aus
-> END
