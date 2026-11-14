// Ort: Diner an der Hauptstraße von Maple Falls (Akt 1). Figur: Hector Sandoval.
//
// Neu nach dem Roman zu Akt 1 (docs/spiel/roman/akt1_teil2.md, Kapitel 7) und dem Ortsblatt
// (docs/spiel/20_Ortsblaetter.md, kleine Geschichten): Hector löst das Rätsel auf seinen Tischsets
// nie. Vier Stufen nach Zuständen, die es gibt; keine eigene Aufgabe, keine Belohnung.
// A Ankunft: Stapel ungelöster Sets neben der Kasse.
// B nach der Nadel und dem Abend im Diner: Das Set, das {held} gelöst hat, hängt gerahmt an der Wand.
// C nach Akt 1: Er hat selbst eines gelöst und erzählt es jedem, dreimal.
// D nach Akt 2 (Nadel von Ironwood): Der Mann im Anzug war wieder da und hat nach der Pacht gefragt.
//    Bleibt offen (Leitsatz 5: ernst, nie düster).
// Einstieg „hector“. Die Figur steht noch auf keiner Karte; Figur, Stapel und Bilderrahmen
// kommen mit den Karten. dinerAbendGesehen setzt maple-falls-wohnzimmer.ink.

VAR held = "Du"
VAR dinerAbendGesehen = false
VAR nadelMapleFalls = 0
VAR endeAkt1Gesehen = false
VAR nadelIronwood = 0
VAR hectorGetroffen = false

=== hector ===
{
- nadelIronwood > 0: -> hector_d
- endeAkt1Gesehen: -> hector_c
- nadelMapleFalls > 0 and dinerAbendGesehen: -> hector_b
- else: -> hector_a
}

=== hector_a ===
{hectorGetroffen:
    Rätsel der Woche. Ich krieg's nicht raus. Elfte Woche in Folge. #sprecher:hector #stimmung:nachdenklich
    -> END
}
~ hectorGetroffen = true
Bestellung läuft! #sprecher:hector #stimmung:froh
Hinter der Theke steht ein Mann mit Schürze. Neben der Kasse liegt ein Stapel Papiersets, auf jedem ein Schachrätsel. #sprecher:erzaehler
Die liegen da, weil ich keins löse. Ich kauf sie trotzdem jede Woche. #sprecher:hector #stimmung:laechelt
Irgendwann kommt einer rein und kann das. Dann gibt's Pommes aufs Haus. #sprecher:hector #stimmung:laechelt
* [„Darf ich mal sehen?“]
    Nimm eins mit. Aber erst essen. Auf leeren Magen sieht man nichts. #sprecher:hector #stimmung:laechelt
* [„Warum kaufen Sie sie dann?“]
    Weil ich gern rate. Und weil das Papier billiger ist als Tischdecken. #sprecher:hector #stimmung:lacht
- -> END

=== hector_b ===
An der Wand hinter der Theke hängt ein Papierset in einem Rahmen. Mit einem Pfeil darauf. In deiner Schrift. #sprecher:erzaehler
Das erste, das hier einer gelöst hat. Am ersten Abend. Ich zeig's jedem. #sprecher:hector #stimmung:froh
Die meisten nicken nur. Aber ich weiß, was es heißt. #sprecher:hector #stimmung:laechelt
* [„Was heißt es denn?“]
    Dass es geht. Jemand sitzt da und sieht es. Dann kann ich es auch. Irgendwann. #sprecher:hector #stimmung:laechelt
* [„Meine Mutter war schneller.“]
    Deine Mutter? Die hat nur Ketchup bestellt. #sprecher:hector #stimmung:lacht
    Ein Gentleman schweigt über Damen. Du hast es dennoch gesagt. #sprecher:ambrose #stimmung:lacht
- -> END

=== hector_c ===
Hast du's gehört? Ich hab eins gelöst. Selbst! Matt in zwei! #sprecher:hector #stimmung:froh
Ich hab erst die Dame gezogen, dann gemerkt, das ist falsch, dann den Turm. Und dann stand er da. Matt. #sprecher:hector #stimmung:laechelt
* [„Glückwunsch, Hector.“]
* [„Wie lange hat es gedauert?“]
    Drei Wochen. Und eine Nacht. Und zwei Kaffee. #sprecher:hector #stimmung:lacht
- Ein Gast kommt herein. Hector dreht sich zu ihm um. #sprecher:erzaehler
Hast du's gehört? Ich hab eins gelöst. Selbst! Matt in zwei! #sprecher:hector #stimmung:froh
Beim Bezahlen hörst du es ein drittes Mal. #sprecher:erzaehler
Drei Wochen für ein Matt in zwei. Ich hätte keinen Tag gebraucht. Aber ich hätte mich nicht so gefreut. #sprecher:ambrose #stimmung:still
-> END

=== hector_d ===
Hector wischt die Theke. Er wischt sie schon lange, an derselben Stelle. #sprecher:erzaehler
Der Mann im Anzug war wieder da. Diesmal hat er nicht nach der Schule gefragt. #sprecher:hector #stimmung:nachdenklich
Er wollte wissen, was ich an Pacht zahle. Und wie lange der Vertrag noch läuft. #sprecher:hector #stimmung:nachdenklich
* [„Was haben Sie gesagt?“]
    Die Wahrheit. Dass ich's nicht weiß. Den Vertrag hat mein Vater gemacht. #sprecher:hector #stimmung:nachdenklich
* [„Er kann Ihnen nichts tun.“]
    Vielleicht nicht. Aber er hat sich alles aufgeschrieben. #sprecher:hector #stimmung:bitter
- Er hängt das Geschirrtuch über die Schulter. Das gerahmte Set an der Wand hängt ein bisschen schief. #sprecher:erzaehler
Bestellung läuft. #sprecher:hector #stimmung:nachdenklich
-> END
