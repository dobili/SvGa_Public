// Ort: Serverraum der Akademie in Silicon Bay (Akt 3). Keine Figuren; Nova kommt dazu.
//
// Szenen der Story-Bibel (Abschnitt 20): 56 Die Spielberichte, zweiter Teil: Fund der
// Ohrempfänger (Gegenstand ohrempfaenger, passt zum Ohrstöpsel von der Glasbrücke), Nova bittet {held},
// noch nichts zu sagen (Auflösung in Akt 4). Die Quest siliconBay.spielberichte wartet auf den
// Knoten „schummelgeraete“.
// Einstieg wie in orte.json: schummelgeraete.
//
// Variablen: ohrstoepselGefunden (vom Weg 4, nur gelesen), ohrempfaengerGefunden (gesetzt hier,
// gelesen in der Akademie). Den Gegenstand ohrempfaenger gibt die Quest siliconBay.spielberichte.

VAR held = "Du"
VAR ohrstoepselGefunden = false
VAR ohrempfaengerGefunden = false
VAR novaVersprechen = false

=== schummelgeraete ===
{ohrempfaengerGefunden:
    Die Schublade ist wieder verschlossen. Das Lämpchen am Schrank blinkt ruhig. #sprecher:erzaehler
    -> END
}
Zwischen blinkenden Schränken steht eine Schublade offen. Darin liegen Dutzende winziger, schwarzer Knöpfe. #sprecher:erzaehler
{ohrstoepselGefunden:
    Sie sehen genauso aus wie der Ohrstöpsel von der Glasbrücke. #sprecher:erzaehler
}
Das ist kein Kopfhörer. Das ist eine Stimme im Ohr. #sprecher:ambrose #stimmung:streng
~ ohrempfaengerGefunden = true
Hinter dir geht die Tür. Nova steht im Licht des Flurs. #sprecher:erzaehler #pause
Bitte. Noch nicht. Wenn das rauskommt, bin ich die Schuldige. Nicht die. #sprecher:nova #stimmung:ernst
Mein Vertrag sagt, ich muss gewinnen. Er sagt nicht, wie. #sprecher:nova
* [„Ich sag nichts. Noch nicht.“]
    ~ novaVersprechen = true
    Danke. Nova dreht sich um und geht schnell. #sprecher:nova
* [„Das ist nicht fair. Dir gegenüber auch nicht.“]
    ~ novaVersprechen = true
    Ich weiß. Gib mir Zeit. Bitte. #sprecher:nova
- Du steckst einen der Knöpfe ein. Ambrose sagt lange nichts. #sprecher:erzaehler
Wer betrügt, weil er muss, ist ein Gefangener, kein Schurke. Merk dir das, {held}. #sprecher:ambrose
-> END
