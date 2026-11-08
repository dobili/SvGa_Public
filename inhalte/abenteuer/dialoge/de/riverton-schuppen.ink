// Ort: Fahrradschuppen hinter der Werkstatt von Mrs. Albescu in Riverton (Akt 2).
// Gegenstand: Fahrrad. Szene 33 der Story-Bibel: Quest riverton.schuppen wartet auf den Knoten
// „fahrrad“ und gibt den Gegenstand fahrrad (W3). Die Tür öffnet sich erst mit schuppenOffen
// (riverton-aussen.albescu_schluessel).

VAR held = "Du"
VAR fahrradErhalten = false

=== fahrrad ===
{fahrradErhalten:
    Wo das Rad stand, ist jetzt ein sauberer Fleck im Staub. #sprecher:erzaehler
    -> END
}
~ fahrradErhalten = true
Unter einer staubigen Plane steht ein grünes Fahrrad mit Korb. #sprecher:erzaehler
Mrs. Albescu zieht die Plane weg und pustet den Staub vom Sattel. #sprecher:erzaehler
Es soll fahren, nicht stehen. Nimm es, {held}. #sprecher:albescu #stimmung:froh
Mit dem Rad bist du doppelt so schnell. #sprecher:albescu
Ein Pferd aus Eisen, das kein Heu frisst. Ich gebe zu, ich bin beeindruckt. #sprecher:ambrose #stimmung:lacht
-> END
