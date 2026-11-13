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
// Szene 1 nach dem Roman, Kapitel 1, und der Dialogprüfung (docs/spiel/22, VM1 bis VM6).
// Stimmung: fremd, müde, Sommerende. Keine Musik bis zur Pizza; Wasserfall fern.
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
Der Umzugswagen ist weg. Kartons, ein Sofa schief vor dem Fenster, sonst nichts. Das Licht fällt in langen staubigen Streifen. #sprecher:erzaehler
Auf den meisten Kartons steht nur ein Name, deiner oder ihrer. #sprecher:erzaehler
Alles, wo nur ein Name draufsteht, ins Wohnzimmer. #sprecher:mutter #stimmung:muede
Hinter den Dächern rauscht etwas, gleichmäßig, wie eine ferne Straße. #sprecher:erzaehler #klang:wasserfall
Hörst du das? Der Wasserfall. Daher der Name. #sprecher:mutter
Man gewöhnt sich dran, sagt die Maklerin. Nach einer Woche hört man ihn nicht mehr. #sprecher:mutter
* [„Es ist ziemlich groß.“]
    Groß. Und alt. #sprecher:mutter
* [„Ich vermisse die alte Wohnung.“]
    Ich auch. #sprecher:mutter #pause
- Mama fragt nicht, wie es dir geht. Dafür bist du ihr dankbar. #sprecher:erzaehler
Eins noch. #sprecher:mutter
Sie schiebt dir mit dem Fuß eine Kiste hin. Aus Holz, nicht aus Pappe. Auf dem Deckel, in steiler, altmodischer Schrift: „Whitlock – nicht wegwerfen.“ #sprecher:erzaehler
Stand im Flur. Die Vorbesitzerin. Sie hat hier gewohnt, seit … immer, glaube ich. #sprecher:mutter
Der Dachboden ist noch voll von ihren Sachen. Deshalb war das Haus so günstig. Alles, was oben ist, gehört jetzt uns. #sprecher:mutter
* [„Und was machen wir damit?“]
    Erst mal nichts. #sprecher:mutter
* [„Erst Pizza?“]
    Gleich. #sprecher:mutter
- Bring die hier hoch zu den anderen, ja? Ich kann heute keine Treppe mehr sehen. #sprecher:mutter #stimmung:muede
Etwas darin verrutscht, als du sie anhebst. Ein leises hölzernes Klacken, wie Kegel, die aneinanderstoßen. #sprecher:erzaehler #klang:holzklacken
-> END

=== ankunft_kurz ===
~ ankunftGesehen = true
~ setzeSzene("akt1.ankunft")
Da bist du ja. Warst du schon auf dem Dachboden? Staubig, oder? #sprecher:mutter #stimmung:muede
Hörst du das Rauschen? Der Wasserfall. Nach einer Woche hört man ihn nicht mehr, sagt die Maklerin. #sprecher:mutter #klang:wasserfall
-> mutter

=== erster_abend ===
// Szene 4 nach dem Roman, Kapitel 4, und der Dialogprüfung (VM20 bis VM26). Mamas Können zeigt
// sich ohne Worte; „Weiß steht besser“ (Entscheidung 13.11.2026, roman/akt1_befunde.md, 7).
// Klang: Bei Mamas Satz setzt die Musik zwei Sekunden aus. Porträt „ertappt“ fehlt noch als Tag.
~ ersterAbendGesehen = true
Du kommst mit dem alten Brett die Treppe herunter. Auf der neunten Stufe knarrt es. #sprecher:erzaehler #klang:knarren
Die hat schon geknarrt, als das Haus neu war. #sprecher:ambrose
Mama sitzt auf dem Boden und schraubt den Tisch zusammen, die Anleitung verkehrt herum neben sich. #sprecher:erzaehler
Ihr Blick fällt auf das Brett. Sie sieht dich nicht an. Sie sieht die Stellung an. #sprecher:erzaehler #pause:2
Weiß steht besser. #sprecher:mutter #pause:2
Dann hört sie, was sie gesagt hat. Ihr Gesicht macht zu, wie eine Tür, die jemand leise schließt. #sprecher:erzaehler
Hab ich irgendwo gelesen. Dass Weiß oft … ach, keine Ahnung. Wo hast du das her? #sprecher:mutter
* [„Vom Dachboden.“]
    Schön. Ist alt, oder? Pass auf, dass keine Figur wegkommt. #sprecher:mutter
* [„Spielst du Schach?“]
    Ich? Nein. #sprecher:mutter
    Sie lacht, ein bisschen zu kurz. Ich kann nicht mal diesen Tisch. #sprecher:mutter
- Deine Mutter, wenn ich das sagen darf, lügt schlecht. #sprecher:ambrose
In der Schule gibt es übrigens ein Schachteam. Lag ein Zettel im Briefkasten. #sprecher:mutter
Falls du Leute kennenlernen willst. #sprecher:mutter
* [„Vielleicht schau ich mal hin.“]
    Mach das. #sprecher:mutter #stimmung:froh
* [„Schach ist doch nur für Streber.“]
    Dann eben nicht. Halt mal das Tischbein. #sprecher:mutter
- Ein Schachteam. Wie vornehm diese Zeit ist. Morgen gehen wir hin. #sprecher:ambrose
// Roman, Kapitel 4 (neu): Der Tisch wackelt, ein Pizzakarton kommt unter das Bein. Wärme ohne
// Worte; das Wohnzimmer bekommt dafür eine Zustandsfassung (Karten, eigener Auftrag). Danach der
// Hinweis auf die Nacht auf dem Dachboden (maple-falls-dachboden.erste_nacht).
Als der Tisch steht, wackelt er. Ihr schiebt einen gefalteten Pizzakarton unter ein Bein. #sprecher:erzaehler
Das ist jetzt eben so. #sprecher:mutter #stimmung:froh
* [„Das ist jetzt eben so.“]
    Für einen Moment ist es fast wie zu Hause. #sprecher:erzaehler
* [Nichts sagen, nur nicken]
    Mama lacht. Für einen Moment ist es fast wie zu Hause. #sprecher:erzaehler
- In der Nacht, als das Haus still ist, kannst du nicht schlafen. Das Brett zieht dich noch einmal nach oben. #sprecher:erzaehler
-> END

=== aufbruch ===
// Szene 13 nach dem Roman, Kapitel 10 (zu Fuß mit Juno, Nacht im Lesesaal; Entscheidung 13.11.2026)
// und der Dialogprüfung (Szene 13, ohne Nummer). Der Schulbus mit dem Team fährt am Samstag.
~ aufbruchGesehen = true
Coach Delgado hat angerufen. Ihr spielt Samstag in Cedar Creek? #sprecher:mutter
* [„Juno und ich gehen Freitag schon. Zu Fuß.“]
    Zu Fuß. #sprecher:mutter
* [„Ich spiele am vierten Brett!“]
    Am vierten Brett. Und Juno sagt, ihr geht schon Freitag. Zu Fuß. #sprecher:mutter
- Sie sieht dich an, über den Rand ihrer Kaffeetasse. Der Tisch wackelt nicht mehr; der Pizzakarton liegt noch unter dem Bein. #sprecher:erzaehler
Du hast in vier Wochen mehr geredet als im ganzen letzten Jahr. #sprecher:mutter
* [„Zwei Stunden. Am Fluss entlang.“]
* [„Wir schlafen in der Bibliothek. Es gibt Matten.“]
- Sie sieht auf das Brett. Sie will etwas sagen und sagt es nicht. #sprecher:erzaehler #pause:2
Mit Juno. Am Fluss. Gut. #sprecher:mutter
Sie drückt dir eine Tüte in die Hand, belegte Brote, als hätte sie es die ganze Zeit gewusst. #sprecher:erzaehler
Brett nicht verlieren. #sprecher:mutter #stimmung:froh
* [„Woher weißt du, dass ich es mitnehme?“]
    Du trägst es seit Tagen herum. Wie ein Haustier. #sprecher:mutter
* [„Versprochen.“]
- Juno wartet am Park, wo die Landstraße beginnt. #sprecher:erzaehler
-> END

=== mutter_alltag ===
{~Ich hab gleich Nachtschicht. Im Kühlschrank ist noch Pizza.|Hast du die Kartons in deinem Zimmer schon ausgepackt? Einen wenigstens?|Wenn du rausgehst: Hauptsache, du bist vor zehn zu Hause.|Mrs. Calloway von gegenüber hat Kuchen gebracht. Die Leute hier sind nett.} #sprecher:mutter
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
