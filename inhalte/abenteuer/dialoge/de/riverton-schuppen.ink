// Ort: Fahrradschuppen hinter der Werkstatt von Mrs. Albescu in Riverton (Akt 2).
// Gegenstand: Fahrrad. Szene 33 der Story-Bibel: Quest riverton.schuppen wartet auf den Knoten
// „fahrrad“ und gibt den Gegenstand fahrrad (W3). Die Tür öffnet sich erst mit schuppenOffen
// (riverton-aussen.albescu_schluessel). Runde 11: nach dem Roman, Kapitel 20.

VAR held = "Du"
VAR fahrradErhalten = false

=== fahrrad ===
// Kapitel 20: „Es soll fahren. Nicht stehen.“ Musik riverton.gitarre, Klingel als Geräusch des
// Fahrrads (fahrradklingel, 21_Klangplan.md).
{fahrradErhalten:
    Wo das Rad stand, ist jetzt ein sauberer Fleck im Staub. #sprecher:erzaehler
    -> END
}
~ fahrradErhalten = true
Drinnen riecht es nach Gummi und Staub. Unter einer Plane steht ein Fahrrad, grün, die Klingel mit einem Schmetterling. #sprecher:erzaehler #musik:riverton.gitarre
Meins. Er hat es mir zur Hochzeit gebaut. Dreißig Jahre bin ich damit jeden Tag zur Werkstatt gefahren. #sprecher:albescu
Sie legt die Hand auf den Lenker. Staub bleibt an ihren Fingern. #sprecher:erzaehler
Meine Knie machen das nicht mehr. #sprecher:albescu
Nimm es. #sprecher:albescu
* [„Das kann ich nicht …“]
    Es soll fahren. Nicht stehen. Ein Rad, das steht, ist ein Gestell. #sprecher:albescu
* [Den Lenker anfassen]
    Siehst du. Es soll fahren. Nicht stehen. #sprecher:albescu #stimmung:froh
- Fahr damit weit. Und wenn die Kette springt, kommst du her, und ich zeige dir, wie man das macht. #sprecher:albescu
Dafür brauche ich keine Knie. #sprecher:albescu
Du schiebst es hinaus in den Regen. Die Klingel funktioniert noch. #sprecher:erzaehler #klang:fahrradklingel
Eine Dame von Welt. Zu meiner Zeit hätte man für so ein Gefährt einen Kutscher gebraucht. Und ein zweites Pferd für den Kutscher. #sprecher:ambrose #stimmung:lacht
Juno schreibt ins Tagebuch: „Fahrrad. Grün. Mit Schmetterling.“ Darunter, kleiner: „Mrs. A. hat geweint, aber gut.“ #sprecher:erzaehler
-> END

