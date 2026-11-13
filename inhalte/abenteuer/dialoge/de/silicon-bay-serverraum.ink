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
    Die Schublade ist zu. Tausend grüne Lichter blinken, ohne Takt. #sprecher:erzaehler
    -> END
}
Kalt wie in einem Kühlschrank. Schränke aus Metall in langen Reihen, tausend grüne Lichter, ohne Takt. Hier also wohnt es. #sprecher:erzaehler
In der dritten Schublade eines Rollschranks liegt eine weiße Schachtel. Darin, je in einer Mulde: Ohrstöpsel. Vier fehlen. #sprecher:erzaehler
{ohrstoepselGefunden:
    Du nimmst den Stöpsel von der Glasbrücke aus der Tasche. Er passt in die fünfte Mulde. #sprecher:erzaehler #pause:2
- else:
    Hautfarben, mit einem winzigen Loch an der Seite. Darin glänzt etwas Metallenes. #sprecher:erzaehler
}
~ ohrempfaengerGefunden = true
Bitte. #sprecher:nova #musik:aus
Nova steht in der Tür, ohne Kamera, in einem Pullover, der ihr zu groß ist. #sprecher:erzaehler
Sie sieht auf die Schachtel in deiner Hand wie jemand, der seit einem Jahr darauf wartet, dass diese Tür aufgeht. #sprecher:erzaehler #pause:2
Bitte. Noch nicht. #sprecher:nova #stimmung:ernst
* [„Du trägst das. Im Turnier.“]
    -> schummelgeraete_nova

// Nova erzählt vom Vertrag. Gutachten L2.3: Der Held antwortet mit einer Handlung, nicht mit
// Worten; das Schweigen gilt als Versprechen (Auflösung in Akt 4).
=== schummelgeraete_nova ===
Es steht in meinem Vertrag. Nicht so. Da steht: technische Assistenz zur Leistungsoptimierung. #sprecher:nova
Ich war vierzehn. Meine Eltern haben unterschrieben. Sie dachten, es geht um Trainingspläne. #sprecher:nova
* [„Und Dr. Lin?“]
- Weiß nichts. Sie würde kündigen. Dann hätten vierzig Kinder keinen Raum. #sprecher:nova
Nova zieht die Ärmel über die Hände. #sprecher:erzaehler
Ich war gut, weißt du. Vorher. Ich war richtig gut. #sprecher:nova
Ich weiß nicht mehr, wie gut. Ich weiß nicht mehr, welche von den Zügen meine sind. #sprecher:nova #stimmung:ernst #pause:2
Du denkst an ein Mädchen auf einem Foto, das die Hände in den Ärmeln hat. #sprecher:erzaehler
* [Nova ansehen]
- Wenn das rauskommt, bin ich die Schuldige. Nicht die. Die haben Anwälte. Ich hab ein Gesicht. #sprecher:nova
Gib mir Zeit. Ich finde einen Weg. Aber nicht mit einer Schachtel aus einer Schublade. #sprecher:nova
* [Die Schachtel zurücklegen]
- ~ novaVersprechen = true
{ohrstoepselGefunden:Du legst die Schachtel zurück. Den Stöpsel von der Glasbrücke behältst du.|Du legst die Schachtel zurück. Einen Stöpsel behältst du.} #sprecher:erzaehler #pause:2
Nova sieht es. Sie sagt nichts dazu. #sprecher:erzaehler
Ob das richtig war, weißt du nicht sicher. #sprecher:erzaehler
-> END

