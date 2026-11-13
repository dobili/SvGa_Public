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

// Runde 11 (13.11.2026): nach dem Roman (roman/akt3_teil1.md, Kapitel 33): die Schachtel mit den
// Mulden, der Stöpsel von der Glasbrücke passt in die fünfte, Nova im zu großen Pullover. Ambrose
// schweigt (er sieht seit Kapitel 32 auf das Tablet). Klang: nur Lüfter und Novas Stimme.

VAR held = "Du"
VAR ohrstoepselGefunden = false
VAR ohrempfaengerGefunden = false
VAR novaVersprechen = false

=== schummelgeraete ===
{ohrempfaengerGefunden:
    Die Schublade ist wieder verschlossen. Tausend grüne Lichter blinken, ohne Takt. #sprecher:erzaehler
    -> END
}
Kalt wie in einem Kühlschrank. Schränke aus Metall in langen Reihen, tausend grüne Lichter, ohne Takt. Hier also wohnt es. #sprecher:erzaehler
In der dritten Schublade eines Rollschranks liegt eine weiße Schachtel. Darin, je in einer Mulde: Ohrstöpsel. Vier fehlen. #sprecher:erzaehler
{ohrstoepselGefunden:
    Du nimmst den Stöpsel von der Glasbrücke aus der Tasche. Er passt in die fünfte Mulde. #sprecher:erzaehler
- else:
    Hautfarben, mit einem winzigen Loch an der Seite. Darin glänzt etwas Metallenes. #sprecher:erzaehler
}
~ ohrempfaengerGefunden = true
Bitte. #sprecher:nova #musik:aus
Nova steht in der Tür, ohne Kamera, in einem Pullover, der ihr zu groß ist. #sprecher:erzaehler
Bitte. Noch nicht. #sprecher:nova #stimmung:ernst
* [„Du trägst das. Im Turnier.“]
    -> schummelgeraete_nova

// Nova erzählt vom Vertrag; der Held verspricht zu schweigen (Auflösung in Akt 4).
=== schummelgeraete_nova ===
Es steht in meinem Vertrag. Nicht so. Da steht: technische Assistenz zur Leistungsoptimierung. #sprecher:nova
Ich war vierzehn. Meine Eltern haben unterschrieben. Sie dachten, es geht um Trainingspläne. #sprecher:nova
* [„Und Dr. Lin?“]
- Weiß nichts. Sie würde kündigen. Dann hätten vierzig Kinder keinen Raum. #sprecher:nova
Nova zieht die Ärmel über die Hände. #sprecher:erzaehler
Ich war gut, weißt du. Vorher. #sprecher:nova
Ich weiß nicht mehr, welche von den Zügen meine sind. #sprecher:nova #stimmung:ernst
Wenn das rauskommt, bin ich die Schuldige. Nicht die. Die haben Anwälte. Ich hab ein Gesicht. #sprecher:nova
Gib mir Zeit. Ich finde einen Weg. Aber nicht mit einer Schachtel aus einer Schublade. #sprecher:nova
* [„Ich sag nichts. Noch nicht.“]
    ~ novaVersprechen = true
    Danke. Ich muss los, bevor mich jemand sucht. #sprecher:nova
* [„Das ist nicht fair. Dir gegenüber auch nicht.“]
    ~ novaVersprechen = true
    Ich weiß. Gib mir Zeit. Bitte. #sprecher:nova
- {ohrstoepselGefunden:Du legst die Schachtel zurück. Den Stöpsel von der Glasbrücke behältst du.|Du legst die Schachtel zurück. Einen Stöpsel behältst du.} #sprecher:erzaehler
Ob das richtig war, weißt du nicht sicher. #sprecher:erzaehler
-> END

