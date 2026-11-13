// Ort: Wohnzimmer im Haus an der Birch Lane (Akt 1, Maple Falls). Figur: Mama.
//
// Szenen der Story-Bibel (docs/spiel/05_Story_Bibel.md, Abschnitt 4):
// 1 Ankunft (akt1.ankunft), 4 Abend im neuen Haus (akt1.ersterAbend), 13 Aufbruch (akt1.aufbruch).
// Einstieg für die Figur ist der Knoten „mutter“ (orte.json, Figur mapleFalls.mutter); er verzweigt
// nach dem Spielstand. Wirkungen (Karten, Szenen) stehen in quests.json, nicht hier.
//
// Variablen: Die mit „Gesehen“ setzt diese Datei selbst. ausgangMapleFallsErsteLektion und
// nadelMapleFalls setzt die Hülle nach der Partie bzw. dem Clubkampf (regeln/dialogvariablen.ts); solange sie
// leer bzw. 0 sind, bleibt Mama beim Alltagsgespräch. Den Abend gibt es erst, wenn Ambrose die
// erste Partie besprochen hat (ersteLektionBesprochen aus maple-falls-dachboden.ink), weil die Quest
// mapleFalls.ersterAbend erst dort beginnt. Das Spiel beginnt heute auf dem Dachboden
// (regeln/spielstand.ts); wer das Brett schon berührt hat, bekommt eine kurze Begrüßung statt der
// Ankunft mit der Kiste.

EXTERNAL setzeSzene(kennung)

VAR held = "Du"
VAR brettBeruehrt = false
VAR ankunftGesehen = false
VAR ersterAbendGesehen = false
VAR aufbruchGesehen = false
VAR kenntHale = false
VAR ausgangMapleFallsErsteLektion = ""
VAR ersteLektionBesprochen = false
VAR nadelMapleFalls = 0
// Neu nach dem Roman zu Akt 1 (Kapitel 7, Szene akt1.dinerAbend): joGetroffen setzt
// maple-falls-park.ink, dinerAbendGesehen diese Datei.
VAR joGetroffen = false
VAR dinerAbendGesehen = false

=== mutter ===
{
- not ankunftGesehen and not brettBeruehrt: -> ankunft
- not ankunftGesehen: -> ankunft_kurz
- ausgangMapleFallsErsteLektion != "" and ausgangMapleFallsErsteLektion != "abgebrochen" and not ersteLektionBesprochen:
    Bist du oben fertig? Die Pizza wird kalt, aber ein paar Minuten hat sie noch. #sprecher:mutter
    -> END
- ersteLektionBesprochen and not ersterAbendGesehen: -> erster_abend
- kenntHale and nadelMapleFalls > 0 and not aufbruchGesehen: -> aufbruch
- joGetroffen and not dinerAbendGesehen: -> diner_einladung
- else: -> mutter_alltag
}

=== ankunft ===
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
Der Umzugswagen ist weg. Im Wohnzimmer stehen nur Kartons, ein Sofa und ein Pizzakarton. #sprecher:erzaehler
Da bist du ja, {held}. Willkommen in Maple Falls. #sprecher:mutter #stimmung:froh
Ich weiß, es sieht noch nicht nach Zuhause aus. Gib dem Haus eine Woche. #sprecher:mutter
// Roman, Kapitel 1 (neu gegenüber der Story-Bibel): der Wasserfall als Wahrzeichen und Heimweh.
Hinter den Dächern rauscht etwas, gleichmäßig, wie eine ferne Straße. #sprecher:erzaehler #klang:wasserfall
Der Wasserfall. Daher der Name. #sprecher:mutter
Man gewöhnt sich dran, sagt die Maklerin. Nach einer Woche hört man ihn nicht mehr. #sprecher:mutter
* [„Es ist ziemlich groß.“]
    Groß und alt. Deshalb konnten wir es uns leisten. #sprecher:mutter
* [„Ich vermisse die alte Wohnung.“]
    Ich auch. Aber hier hast du ein Zimmer mit Fenster zum Garten. #sprecher:mutter
- Die alte Mrs. Whitlock hat hier gewohnt, ihr ganzes Leben lang. #sprecher:mutter
Ihr Dachboden ist noch voll. #sprecher:mutter
Auf einer Kiste neben der Treppe steht mit dickem Stift: „Whitlock – nicht wegwerfen“. #sprecher:erzaehler
Bringst du die Kiste nach oben? Kisten auf den Dachboden, dann Pizza. #sprecher:mutter
In der Reihenfolge. #sprecher:mutter
* [„Schon unterwegs.“]
    Danke. Und schau nicht zu lange in die alten Sachen. Da oben ist es staubig. #sprecher:mutter
* [„Erst Pizza?“]
    Netter Versuch. Erst die Kiste. #sprecher:mutter #stimmung:ernst
- -> END

=== ankunft_kurz ===
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
Da bist du ja, {held}. Warst du schon auf dem Dachboden? Staubig, oder? #sprecher:mutter
Gib dem Haus eine Woche. Dann ist es ein Zuhause. #sprecher:mutter #stimmung:froh
Hörst du das Rauschen? Der Wasserfall. Nach einer Woche hört man ihn nicht mehr, sagt die Maklerin. #sprecher:mutter #klang:wasserfall
-> mutter

=== erster_abend ===
~ ersterAbendGesehen = true
Du kommst mit dem alten Brett die Treppe herunter. Mama sitzt mit einem Stück Pizza auf einem Karton. #sprecher:erzaehler
Was hast du da? Zeig mal. #sprecher:mutter
Sie sieht lange auf die Stellung. Dann sagt sie, ohne nachzudenken: „Weiß steht besser.“ #sprecher:erzaehler #pause
* [„Du kannst Schach?“]
    Ich? Nein. Das hab ich irgendwo gelesen. #sprecher:mutter
* [„Woher weißt du das?“]
    Weiß ich nicht. Sieht halt so aus. #sprecher:mutter
- Deine Mutter, wenn ich das sagen darf, lügt schlecht. #sprecher:ambrose
Das Brett ist alt. Pass auf die Figuren auf. Die sind bestimmt was wert. #sprecher:mutter
Ach, und im Briefkasten lag ein Zettel von der Schule. Die haben ein Schachteam. #sprecher:mutter
* [„Vielleicht schau ich mal hin.“]
    Mach das. Vielleicht findest du da Freunde. #sprecher:mutter #stimmung:froh
* [„Schach ist doch nur für Streber.“]
    Das haben sie früher auch zu mir gesagt. #sprecher:mutter
    Zu … ach, egal. Iss deine Pizza. #sprecher:mutter
- Ein Schachteam. Wie vornehm diese Zeit ist. Morgen gehen wir hin. #sprecher:ambrose
// Roman, Kapitel 4 (neu): Der Tisch wackelt, ein Pizzakarton kommt unter das Bein. Wärme ohne
// Worte; das Wohnzimmer bekommt dafür eine Zustandsfassung (Karten, eigener Auftrag). Danach der
// Hinweis auf die Nacht auf dem Dachboden (maple-falls-dachboden.erste_nacht).
Mama schraubt den Tisch zusammen, die Anleitung verkehrt herum neben sich. Du hilfst ihr. #sprecher:erzaehler
Als er steht, wackelt er. Ihr schiebt einen gefalteten Pizzakarton unter ein Bein. #sprecher:erzaehler
Das ist jetzt eben so. #sprecher:mutter #stimmung:froh
* [„Das ist jetzt eben so.“]
    Für einen Moment ist es fast wie zu Hause. #sprecher:erzaehler
* [Nichts sagen, nur nicken]
    Mama lacht. Für einen Moment ist es fast wie zu Hause. #sprecher:erzaehler
- In der Nacht, als das Haus still ist, kannst du nicht schlafen. Das Brett zieht dich noch einmal nach oben. #sprecher:erzaehler
-> END

=== aufbruch ===
~ aufbruchGesehen = true
Coach Delgado hat angerufen. Ihr spielt Samstag auswärts in Cedar Creek? #sprecher:mutter
* [„Ich spiele am vierten Brett!“]
    Am vierten Brett. Ich weiß, was das heißt. Glaube ich. #sprecher:mutter #stimmung:froh
* [„Darf ich mit?“]
    Du darfst. Ich hab schon unterschrieben. #sprecher:mutter
- Mit dem Coach im Schulbus, und um acht seid ihr zurück. #sprecher:mutter
Und das alte Brett nimmst du mit, oder? Dann verlier es nicht. #sprecher:mutter
* [„Woher weißt du, dass ich es mitnehme?“]
    Du trägst es seit Tagen herum. Wie ein Haustier. #sprecher:mutter
* [„Versprochen.“]
    Gut. Viel Glück, {held}. #sprecher:mutter #stimmung:froh
- Der Bus wartet am Stadtpark. #sprecher:erzaehler
-> END

=== mutter_alltag ===
{~Ich hab gleich Nachtschicht. Im Kühlschrank ist noch Pizza.|Hast du die Kartons in deinem Zimmer schon ausgepackt? Einen wenigstens?|Wenn du rausgehst: Hauptsache, du bist vor zehn zu Hause.|Die Nachbarin hat Kuchen gebracht. Die Leute hier sind nett.} #sprecher:mutter
-> END

// ---------------------------------------------------------------- Abend im Diner

// Szene akt1.dinerAbend (Roman, Kapitel 7; neu gegenüber der Story-Bibel), etwa vier Minuten,
// freigeschaltet nach der ersten Begegnung mit Jo. Mama findet die Lösung vor {held}, nur als
// Erzählerzeile (ihr Geheimnis ein zweites Mal ohne Worte); Hector erzählt vom Mann im Anzug
// (Graham Hale als Vorzeichen). Stimmung: warm, am Ende ein Schatten. Klang: eigenes kleines
// Diner-Stück wie aus einer Musikbox, Bratgeräusche, Geschirr; bei Hectors Bericht fällt die
// Musik einen Takt aus. Vorgemerkt für mittel-2: #musik:diner am Anfang, #pause:3 nach Mamas Finger.
// Die Szene spielt im Dialog; der Ort Diner bekommt für Hector eine Figur, wenn die Karten so weit
// sind (maple-falls-diner.ink, kleine Geschichte Hector).
=== diner_einladung ===
~ dinerAbendGesehen = true
{not kenntHale:
    ~ setzeSzene("akt1.dinerAbend")
}
Ich hab heute frei. Und der Herd ist immer noch nicht angeschlossen. #sprecher:mutter
Diner? Ich lade dich ein. #sprecher:mutter #stimmung:froh
* [„Pommes?“]
    Pommes. Und vielleicht sogar ein Salat. Vielleicht. #sprecher:mutter
* [„Gern.“]
- -> diner_abend

=== diner_abend ===
Das Diner an der Hauptstraße ist lang und schmal wie ein Eisenbahnwagen. Rote Bänke, eine Theke aus Blech. #sprecher:erzaehler #klang:diner
Es riecht nach Zwiebeln und Kaffee. Aus der Musikbox kommt leise ein altes Lied. #sprecher:erzaehler
Bestellung läuft! #sprecher:hector #stimmung:froh
Er ruft es in die Küche, obwohl außer ihm niemand in der Küche ist. Auf seiner Schürze steht „Hector“. #sprecher:erzaehler
Er legt euch Papiersets hin. Darauf ein Schachbrett: „Rätsel der Woche: Weiß zieht und setzt in einem Zug matt.“ #sprecher:erzaehler
Nimm zwei. Ist schwer diese Woche. Ich krieg's nicht raus. #sprecher:hector
* [Das Rätsel ansehen]
* [Erst Pommes bestellen]
    Pommes kommen. Das Rätsel läuft nicht weg. #sprecher:hector
- Neben der Kasse liegt ein Stapel Sets, mindestens zwanzig. Auf keinem ist etwas eingezeichnet. #sprecher:erzaehler
Du suchst. Was hängt? Wohin kann die Dame? #sprecher:erzaehler #pause
Mama sieht zu. Sie sagt nichts. #sprecher:erzaehler
Aber ihr Finger bewegt sich, einen Zentimeter über dem Papier, auf ein Feld. Eine halbe Sekunde vor deinem Stift. #sprecher:erzaehler #pause
Du tust, als hättest du es nicht gesehen. Dann zeichnest du den Pfeil ein. #sprecher:erzaehler
Hector hält das Set ins Licht wie einen Geldschein. #sprecher:erzaehler
Matt in eins! Am ersten Abend! Das kommt an die Wand. #sprecher:hector #stimmung:froh
Deine Mutter war schneller. Ich sage es nur, damit du es weißt. #sprecher:ambrose
* [Den Kopf schütteln, ganz leicht]
    Schon gut. Ich schweige. Gentlemen schweigen über Damen. #sprecher:ambrose #stimmung:lacht
* [„Pst.“]
    Mama sieht auf. „Was?“ Du zeigst auf die Pommes. #sprecher:erzaehler
- Die Pommes kommen. Hector bleibt am Tisch stehen, das Geschirrtuch über der Schulter. #sprecher:erzaehler
Gestern saß hier einer. Anzug, zwei Telefone, kein Lächeln. #sprecher:hector
Hat Kaffee bestellt und nur auf Zahlen geguckt. Wollte wissen, wem das Schulgebäude gehört. #sprecher:hector
Hab gesagt: der Schule. #sprecher:hector #stimmung:lacht
Dann lacht er nicht mehr. Die Musikbox setzt für einen Takt aus. #sprecher:erzaehler #pause
Hat er nicht komisch gefunden. #sprecher:hector
* [„Wer war das?“]
    Keine Ahnung. Hat nicht mal Trinkgeld gegeben. Kaffee schwarz, ohne alles. #sprecher:hector
* [Nichts sagen]
- Gibt es hier Ketchup? #sprecher:mutter
Draußen ist es dunkel geworden. Hinter dem Fenster die Hauptstraße, die einzige Ampel, dahinter schwarze Bäume. #sprecher:erzaehler
Es ist ein guter Abend. Du merkst es erst, als er fast vorbei ist. #sprecher:erzaehler
Du hast den ganzen Tag nicht an die alte Wohnung gedacht. #sprecher:erzaehler
-> END
